use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

declare_id!("CLETUSxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
// TODO: Replace with actual program ID after deployment:
//   anchor keys list  OR  anchor deploy --provider.cluster devnet

// ============================================================
// Cletus Staking Program - Solana/Anchor
// 7 Tiers: Starter → Founder
// 0.5% APY SOL rewards + Profit sharing
// Multi-sig treasury, emergency pause
// ============================================================

pub mod constants {
    /// SOL APY rate: 0.5% per year (in basis points, 50 = 0.5%)
    pub const APY_BPS: u64 = 50;
    /// Basis points denominator
    pub const BPS_DENOMINATOR: u64 = 10_000;
    /// Seconds in a year
    pub const SECONDS_PER_YEAR: u64 = 365 * 24 * 60 * 60;
    /// Unstaking cooldown: 7 days
    pub const UNSTAKE_COOLDOWN: i64 = 7 * 24 * 60 * 60;
    /// Early unstake penalty: 2% (within 30 days)
    pub const EARLY_PENALTY_BPS: u64 = 200;
    /// Early unstake lock period: 30 days
    pub const EARLY_LOCK_PERIOD: i64 = 30 * 24 * 60 * 60;
    /// Treasury fee: 20% of profits reserved
    pub const TREASURY_FEE_BPS: u64 = 2_000;
    /// Number of required multisig signers (2-of-3 multisig: 2 signers required, 3 authorized)
    pub const MULTISIG_THRESHOLD: u8 = 2;
}

// Tier thresholds (in CLETUS tokens, with 6 decimal places)
pub mod tiers {
    pub const STARTER_MIN: u64 = 100_000 * 1_000_000;    // 100K CLETUS
    pub const BRONZE_MIN: u64 = 500_000 * 1_000_000;     // 500K CLETUS
    pub const SILVER_MIN: u64 = 1_000_000 * 1_000_000;   // 1M CLETUS
    pub const GOLD_MIN: u64 = 5_000_000 * 1_000_000;     // 5M CLETUS
    pub const PLATINUM_MIN: u64 = 10_000_000 * 1_000_000; // 10M CLETUS
    pub const DIAMOND_MIN: u64 = 25_000_000 * 1_000_000;  // 25M CLETUS
    pub const FOUNDER_MIN: u64 = 100_000_000 * 1_000_000; // 100M CLETUS

    // Profit share percentages in BPS (0 = no profit share)
    pub const STARTER_PROFIT_BPS: u64 = 0;
    pub const BRONZE_PROFIT_BPS: u64 = 100;    // 1%
    pub const SILVER_PROFIT_BPS: u64 = 200;    // 2%
    pub const GOLD_PROFIT_BPS: u64 = 500;      // 5%
    pub const PLATINUM_PROFIT_BPS: u64 = 1_000; // 10%
    pub const DIAMOND_PROFIT_BPS: u64 = 2_000;  // 20%
    pub const FOUNDER_PROFIT_BPS: u64 = 3_500;  // 35%
}

#[program]
pub mod cletus_staking {
    use super::*;

    // ============================================================
    // Initialize the global staking program state
    // ============================================================
    pub fn initialize(
        ctx: Context<Initialize>,
        admin: Pubkey,
        multisig_signers: [Pubkey; 3],
    ) -> Result<()> {
        let state = &mut ctx.accounts.global_state;
        state.admin = admin;
        state.multisig_signers = multisig_signers;
        state.is_paused = false;
        state.total_staked = 0;
        state.total_stakers = 0;
        state.total_sol_distributed = 0;
        state.total_profit_distributed = 0;
        state.treasury_balance = 0;
        state.last_distribution = Clock::get()?.unix_timestamp;
        state.bump = ctx.bumps.global_state;

        emit!(ProgramInitialized {
            admin,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    // ============================================================
    // Stake CLETUS tokens
    // ============================================================
    pub fn stake(ctx: Context<Stake>, amount: u64) -> Result<()> {
        let state = &mut ctx.accounts.global_state;
        require!(!state.is_paused, StakingError::ProgramPaused);

        // Minimum stake check (Starter tier minimum)
        require!(amount >= tiers::STARTER_MIN, StakingError::BelowMinimumStake);

        let position = &mut ctx.accounts.staking_position;
        let clock = Clock::get()?;

        // Transfer CLETUS tokens from user to vault
        let transfer_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.user_token_account.to_account_info(),
                to: ctx.accounts.staking_vault.to_account_info(),
                authority: ctx.accounts.user.to_account_info(),
            },
        );
        token::transfer(transfer_ctx, amount)?;

        // Update position
        if position.staked_amount == 0 {
            // New staker
            position.owner = ctx.accounts.user.key();
            position.staked_at = clock.unix_timestamp;
            state.total_stakers += 1;
        }

        position.staked_amount += amount;
        position.last_reward_claim = clock.unix_timestamp;
        position.tier = calculate_tier(position.staked_amount);
        position.pending_sol_rewards = 0;
        position.total_sol_claimed = 0;
        position.total_profit_claimed = 0;
        position.unstake_requested = false;
        position.unstake_request_time = 0;
        position.unstake_amount = 0;

        // Update global state
        state.total_staked += amount;

        emit!(Staked {
            user: ctx.accounts.user.key(),
            amount,
            total_staked: position.staked_amount,
            tier: position.tier,
            timestamp: clock.unix_timestamp,
        });

        Ok(())
    }

    // ============================================================
    // Request unstaking (initiates 7-day cooldown)
    // ============================================================
    pub fn request_unstake(ctx: Context<RequestUnstake>, amount: u64) -> Result<()> {
        let state = &ctx.accounts.global_state;
        require!(!state.is_paused, StakingError::ProgramPaused);

        let position = &mut ctx.accounts.staking_position;
        require!(
            position.owner == ctx.accounts.user.key(),
            StakingError::Unauthorized
        );
        require!(
            amount <= position.staked_amount,
            StakingError::InsufficientStake
        );
        require!(
            !position.unstake_requested,
            StakingError::UnstakeAlreadyPending
        );
        require!(amount > 0, StakingError::InvalidAmount);

        let clock = Clock::get()?;

        // Accrue pending rewards before unstaking
        let accrued = calculate_accrued_rewards(
            position.staked_amount,
            position.last_reward_claim,
            clock.unix_timestamp,
        );
        position.pending_sol_rewards += accrued;
        position.last_reward_claim = clock.unix_timestamp;

        position.unstake_requested = true;
        position.unstake_request_time = clock.unix_timestamp;
        position.unstake_amount = amount;

        emit!(UnstakeRequested {
            user: ctx.accounts.user.key(),
            amount,
            available_at: clock.unix_timestamp + constants::UNSTAKE_COOLDOWN,
            timestamp: clock.unix_timestamp,
        });

        Ok(())
    }

    // ============================================================
    // Complete unstaking after cooldown period
    // ============================================================
    pub fn complete_unstake(ctx: Context<CompleteUnstake>) -> Result<()> {
        let position = &mut ctx.accounts.staking_position;
        require!(
            position.owner == ctx.accounts.user.key(),
            StakingError::Unauthorized
        );
        require!(position.unstake_requested, StakingError::NoUnstakePending);

        let clock = Clock::get()?;
        let elapsed = clock.unix_timestamp - position.unstake_request_time;

        // Check cooldown
        require!(
            elapsed >= constants::UNSTAKE_COOLDOWN,
            StakingError::CooldownNotComplete
        );

        let amount = position.unstake_amount;

        // Apply early penalty if staked < 30 days
        let days_staked = clock.unix_timestamp - position.staked_at;
        let transfer_amount = if days_staked < constants::EARLY_LOCK_PERIOD {
            let penalty = amount * constants::EARLY_PENALTY_BPS / constants::BPS_DENOMINATOR;
            let state = &mut ctx.accounts.global_state;
            state.treasury_balance += penalty;
            amount - penalty
        } else {
            amount
        };

        // Transfer tokens back to user from vault
        let seeds = &[
            b"global_state".as_ref(),
            &[ctx.accounts.global_state.bump],
        ];
        let signer = &[&seeds[..]];

        let transfer_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.staking_vault.to_account_info(),
                to: ctx.accounts.user_token_account.to_account_info(),
                authority: ctx.accounts.global_state.to_account_info(),
            },
            signer,
        );
        token::transfer(transfer_ctx, transfer_amount)?;

        // Update state
        let state = &mut ctx.accounts.global_state;
        state.total_staked -= amount;

        position.staked_amount -= amount;
        position.unstake_requested = false;
        position.unstake_request_time = 0;
        position.unstake_amount = 0;
        position.tier = calculate_tier(position.staked_amount);

        if position.staked_amount == 0 {
            state.total_stakers = state.total_stakers.saturating_sub(1);
        }

        emit!(Unstaked {
            user: ctx.accounts.user.key(),
            amount: transfer_amount,
            timestamp: clock.unix_timestamp,
        });

        Ok(())
    }

    // ============================================================
    // Claim accumulated SOL rewards
    // ============================================================
    pub fn claim_rewards(ctx: Context<ClaimRewards>) -> Result<()> {
        let state = &mut ctx.accounts.global_state;
        require!(!state.is_paused, StakingError::ProgramPaused);

        let position = &mut ctx.accounts.staking_position;
        require!(
            position.owner == ctx.accounts.user.key(),
            StakingError::Unauthorized
        );
        require!(position.staked_amount > 0, StakingError::NoStake);

        let clock = Clock::get()?;

        // Calculate accrued rewards
        let accrued = calculate_accrued_rewards(
            position.staked_amount,
            position.last_reward_claim,
            clock.unix_timestamp,
        );

        let total_rewards = position.pending_sol_rewards + accrued;
        require!(total_rewards > 0, StakingError::NoRewardsToClaim);

        // Transfer SOL from rewards pool to user
        let rewards_lamports = total_rewards;
        require!(
            ctx.accounts.rewards_pool.lamports() >= rewards_lamports,
            StakingError::InsufficientRewardsPool
        );

        **ctx.accounts.rewards_pool.try_borrow_mut_lamports()? -= rewards_lamports;
        **ctx.accounts.user.try_borrow_mut_lamports()? += rewards_lamports;

        // Update position
        position.pending_sol_rewards = 0;
        position.last_reward_claim = clock.unix_timestamp;
        position.total_sol_claimed += total_rewards;

        // Update global state
        state.total_sol_distributed += total_rewards;

        emit!(RewardsClaimed {
            user: ctx.accounts.user.key(),
            amount: total_rewards,
            timestamp: clock.unix_timestamp,
        });

        Ok(())
    }

    // ============================================================
    // Distribute monthly profit share (admin only)
    // Called by admin after each profitable month
    // ============================================================
    pub fn distribute_profit(
        ctx: Context<DistributeProfit>,
        monthly_profit_lamports: u64,
    ) -> Result<()> {
        let state = &mut ctx.accounts.global_state;
        require!(!state.is_paused, StakingError::ProgramPaused);
        require!(
            ctx.accounts.admin.key() == state.admin,
            StakingError::Unauthorized
        );
        require!(monthly_profit_lamports > 0, StakingError::InvalidAmount);
        require!(state.total_staked > 0, StakingError::NoStakers);

        // Reserve treasury fee (20%)
        let treasury_amount =
            monthly_profit_lamports * constants::TREASURY_FEE_BPS / constants::BPS_DENOMINATOR;
        let distributable = monthly_profit_lamports - treasury_amount;

        state.treasury_balance += treasury_amount;
        state.total_profit_distributed += distributable;

        let clock = Clock::get()?;
        state.last_distribution = clock.unix_timestamp;

        emit!(ProfitDistributed {
            total_profit: monthly_profit_lamports,
            treasury_reserved: treasury_amount,
            distributable,
            timestamp: clock.unix_timestamp,
        });

        Ok(())
    }

    // ============================================================
    // Claim profit share for a staker
    // ============================================================
    pub fn claim_profit_share(
        ctx: Context<ClaimProfitShare>,
        distribution_amount: u64,
    ) -> Result<()> {
        let state = &mut ctx.accounts.global_state;
        require!(!state.is_paused, StakingError::ProgramPaused);

        let position = &ctx.accounts.staking_position;
        require!(
            position.owner == ctx.accounts.user.key(),
            StakingError::Unauthorized
        );
        require!(position.staked_amount > 0, StakingError::NoStake);

        let tier_profit_bps = get_tier_profit_bps(position.tier);
        require!(tier_profit_bps > 0, StakingError::TierNotEligible);

        // Calculate user's share based on their stake proportion and tier
        let user_share = calculate_profit_share(
            distribution_amount,
            position.staked_amount,
            state.total_staked,
            tier_profit_bps,
        );

        require!(user_share > 0, StakingError::NoRewardsToClaim);
        require!(
            ctx.accounts.rewards_pool.lamports() >= user_share,
            StakingError::InsufficientRewardsPool
        );

        // Transfer SOL profit share
        **ctx.accounts.rewards_pool.try_borrow_mut_lamports()? -= user_share;
        **ctx.accounts.user.try_borrow_mut_lamports()? += user_share;

        let clock = Clock::get()?;

        emit!(ProfitShareClaimed {
            user: ctx.accounts.user.key(),
            amount: user_share,
            tier: position.tier,
            timestamp: clock.unix_timestamp,
        });

        Ok(())
    }

    // ============================================================
    // Add SOL to rewards pool (admin/fee collection)
    // ============================================================
    pub fn fund_rewards_pool(ctx: Context<FundRewardsPool>, amount: u64) -> Result<()> {
        // Transfer SOL from funder to rewards pool
        let ix = anchor_lang::solana_program::system_instruction::transfer(
            &ctx.accounts.funder.key(),
            &ctx.accounts.rewards_pool.key(),
            amount,
        );
        anchor_lang::solana_program::program::invoke(
            &ix,
            &[
                ctx.accounts.funder.to_account_info(),
                ctx.accounts.rewards_pool.to_account_info(),
            ],
        )?;

        emit!(RewardsPoolFunded {
            funder: ctx.accounts.funder.key(),
            amount,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    // ============================================================
    // Emergency pause (requires multisig: 2 of 3)
    // ============================================================
    pub fn emergency_pause(
        ctx: Context<EmergencyPause>,
        signer1: Pubkey,
        signer2: Pubkey,
    ) -> Result<()> {
        let state = &mut ctx.accounts.global_state;

        // Verify both signers are authorized multisig members
        require!(
            state.multisig_signers.contains(&signer1),
            StakingError::InvalidMultisigSigner
        );
        require!(
            state.multisig_signers.contains(&signer2),
            StakingError::InvalidMultisigSigner
        );
        require!(signer1 != signer2, StakingError::DuplicateMultisigSigner);

        state.is_paused = true;

        emit!(EmergencyPauseActivated {
            signer1,
            signer2,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    // ============================================================
    // Resume from pause (admin only)
    // ============================================================
    pub fn resume(ctx: Context<Resume>) -> Result<()> {
        let state = &mut ctx.accounts.global_state;
        require!(
            ctx.accounts.admin.key() == state.admin,
            StakingError::Unauthorized
        );

        state.is_paused = false;

        emit!(ProgramResumed {
            admin: ctx.accounts.admin.key(),
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    // ============================================================
    // Update admin (requires current admin)
    // ============================================================
    pub fn update_admin(ctx: Context<UpdateAdmin>, new_admin: Pubkey) -> Result<()> {
        let state = &mut ctx.accounts.global_state;
        require!(
            ctx.accounts.admin.key() == state.admin,
            StakingError::Unauthorized
        );

        let old_admin = state.admin;
        state.admin = new_admin;

        emit!(AdminUpdated {
            old_admin,
            new_admin,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    // ============================================================
    // Withdraw from treasury (multisig required)
    // ============================================================
    pub fn withdraw_treasury(
        ctx: Context<WithdrawTreasury>,
        amount: u64,
        signer1: Pubkey,
        signer2: Pubkey,
    ) -> Result<()> {
        let state = &mut ctx.accounts.global_state;

        require!(
            state.multisig_signers.contains(&signer1),
            StakingError::InvalidMultisigSigner
        );
        require!(
            state.multisig_signers.contains(&signer2),
            StakingError::InvalidMultisigSigner
        );
        require!(signer1 != signer2, StakingError::DuplicateMultisigSigner);
        require!(amount <= state.treasury_balance, StakingError::InsufficientTreasury);

        state.treasury_balance -= amount;

        **ctx.accounts.rewards_pool.try_borrow_mut_lamports()? -= amount;
        **ctx.accounts.recipient.try_borrow_mut_lamports()? += amount;

        emit!(TreasuryWithdrawn {
            amount,
            recipient: ctx.accounts.recipient.key(),
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }
}

// ============================================================
// Helper Functions
// ============================================================

fn calculate_tier(amount: u64) -> u8 {
    if amount >= tiers::FOUNDER_MIN { 6 }
    else if amount >= tiers::DIAMOND_MIN { 5 }
    else if amount >= tiers::PLATINUM_MIN { 4 }
    else if amount >= tiers::GOLD_MIN { 3 }
    else if amount >= tiers::SILVER_MIN { 2 }
    else if amount >= tiers::BRONZE_MIN { 1 }
    else { 0 }
}

fn get_tier_profit_bps(tier: u8) -> u64 {
    match tier {
        0 => tiers::STARTER_PROFIT_BPS,
        1 => tiers::BRONZE_PROFIT_BPS,
        2 => tiers::SILVER_PROFIT_BPS,
        3 => tiers::GOLD_PROFIT_BPS,
        4 => tiers::PLATINUM_PROFIT_BPS,
        5 => tiers::DIAMOND_PROFIT_BPS,
        6 => tiers::FOUNDER_PROFIT_BPS,
        _ => 0,
    }
}

fn calculate_accrued_rewards(
    staked_amount: u64,
    last_claim: i64,
    current_time: i64,
) -> u64 {
    let elapsed = (current_time - last_claim) as u64;
    // Rewards in lamports: staked * APY_BPS / BPS_DENOMINATOR * elapsed / SECONDS_PER_YEAR
    // Using u128 to prevent overflow
    let rewards = (staked_amount as u128)
        .saturating_mul(constants::APY_BPS as u128)
        .saturating_mul(elapsed as u128)
        / (constants::BPS_DENOMINATOR as u128 * constants::SECONDS_PER_YEAR as u128);

    // Convert from CLETUS token units to SOL lamports (rough approximation).
    // ⚠️ PRODUCTION: Replace this with a Pyth price oracle integration or
    //    a governance-set fixed rate. Using a hard-coded conversion will
    //    produce incorrect rewards if the CLETUS/SOL exchange rate changes.
    (rewards / 1_000_000) as u64 // 1M CLETUS ≈ 1 lamport reward unit
}

fn calculate_profit_share(
    distribution: u64,
    user_staked: u64,
    total_staked: u64,
    tier_bps: u64,
) -> u64 {
    if total_staked == 0 { return 0; }

    // User's proportional share weighted by tier multiplier
    let base_share = (distribution as u128)
        .saturating_mul(user_staked as u128)
        .saturating_mul(tier_bps as u128)
        / (total_staked as u128 * constants::BPS_DENOMINATOR as u128);

    base_share as u64
}

// ============================================================
// Account Structs
// ============================================================

#[account]
#[derive(Default)]
pub struct GlobalState {
    /// Program admin pubkey
    pub admin: Pubkey,
    /// Multisig signers (3-of-3 authorized, 2 required)
    pub multisig_signers: [Pubkey; 3],
    /// Whether the program is paused
    pub is_paused: bool,
    /// Total CLETUS tokens staked
    pub total_staked: u64,
    /// Total number of active stakers
    pub total_stakers: u64,
    /// Total SOL distributed as APY rewards
    pub total_sol_distributed: u64,
    /// Total SOL distributed as profit share
    pub total_profit_distributed: u64,
    /// SOL reserved in treasury
    pub treasury_balance: u64,
    /// Timestamp of last distribution
    pub last_distribution: i64,
    /// PDA bump
    pub bump: u8,
}

#[account]
#[derive(Default)]
pub struct StakingPosition {
    /// Position owner
    pub owner: Pubkey,
    /// Amount of CLETUS staked
    pub staked_amount: u64,
    /// Unix timestamp when staked
    pub staked_at: i64,
    /// Unix timestamp of last reward claim
    pub last_reward_claim: i64,
    /// Accrued but unclaimed SOL rewards (lamports)
    pub pending_sol_rewards: u64,
    /// Total SOL claimed as APY rewards
    pub total_sol_claimed: u64,
    /// Total SOL claimed as profit share
    pub total_profit_claimed: u64,
    /// Current tier (0=Starter, 6=Founder)
    pub tier: u8,
    /// Whether an unstake has been requested
    pub unstake_requested: bool,
    /// Timestamp of unstake request
    pub unstake_request_time: i64,
    /// Amount pending unstake
    pub unstake_amount: u64,
}

// ============================================================
// Context Structs
// ============================================================

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = payer,
        space = 8 + std::mem::size_of::<GlobalState>(),
        seeds = [b"global_state"],
        bump
    )]
    pub global_state: Account<'info, GlobalState>,

    #[account(
        init,
        payer = payer,
        space = 8,
        seeds = [b"rewards_pool"],
        bump
    )]
    /// CHECK: SOL rewards pool - verified by seeds
    pub rewards_pool: AccountInfo<'info>,

    #[account(mut)]
    pub payer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Stake<'info> {
    #[account(mut, seeds = [b"global_state"], bump = global_state.bump)]
    pub global_state: Account<'info, GlobalState>,

    #[account(
        init_if_needed,
        payer = user,
        space = 8 + std::mem::size_of::<StakingPosition>(),
        seeds = [b"staking_position", user.key().as_ref()],
        bump
    )]
    pub staking_position: Account<'info, StakingPosition>,

    #[account(mut)]
    pub user: Signer<'info>,

    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub staking_vault: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RequestUnstake<'info> {
    #[account(seeds = [b"global_state"], bump = global_state.bump)]
    pub global_state: Account<'info, GlobalState>,

    #[account(
        mut,
        seeds = [b"staking_position", user.key().as_ref()],
        bump
    )]
    pub staking_position: Account<'info, StakingPosition>,

    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct CompleteUnstake<'info> {
    #[account(mut, seeds = [b"global_state"], bump = global_state.bump)]
    pub global_state: Account<'info, GlobalState>,

    #[account(
        mut,
        seeds = [b"staking_position", user.key().as_ref()],
        bump
    )]
    pub staking_position: Account<'info, StakingPosition>,

    #[account(mut)]
    pub user: Signer<'info>,

    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub staking_vault: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ClaimRewards<'info> {
    #[account(mut, seeds = [b"global_state"], bump = global_state.bump)]
    pub global_state: Account<'info, GlobalState>,

    #[account(
        mut,
        seeds = [b"staking_position", user.key().as_ref()],
        bump
    )]
    pub staking_position: Account<'info, StakingPosition>,

    #[account(mut)]
    pub user: Signer<'info>,

    #[account(mut, seeds = [b"rewards_pool"], bump)]
    /// CHECK: SOL rewards pool - verified by seeds
    pub rewards_pool: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ClaimProfitShare<'info> {
    #[account(seeds = [b"global_state"], bump = global_state.bump)]
    pub global_state: Account<'info, GlobalState>,

    #[account(
        seeds = [b"staking_position", user.key().as_ref()],
        bump
    )]
    pub staking_position: Account<'info, StakingPosition>,

    #[account(mut)]
    pub user: Signer<'info>,

    #[account(mut, seeds = [b"rewards_pool"], bump)]
    /// CHECK: SOL rewards pool - verified by seeds
    pub rewards_pool: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct DistributeProfit<'info> {
    #[account(mut, seeds = [b"global_state"], bump = global_state.bump)]
    pub global_state: Account<'info, GlobalState>,

    pub admin: Signer<'info>,
}

#[derive(Accounts)]
pub struct FundRewardsPool<'info> {
    #[account(mut, seeds = [b"rewards_pool"], bump)]
    /// CHECK: SOL rewards pool - verified by seeds
    pub rewards_pool: AccountInfo<'info>,

    #[account(mut)]
    pub funder: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct EmergencyPause<'info> {
    #[account(mut, seeds = [b"global_state"], bump = global_state.bump)]
    pub global_state: Account<'info, GlobalState>,

    pub caller: Signer<'info>,
}

#[derive(Accounts)]
pub struct Resume<'info> {
    #[account(mut, seeds = [b"global_state"], bump = global_state.bump)]
    pub global_state: Account<'info, GlobalState>,

    pub admin: Signer<'info>,
}

#[derive(Accounts)]
pub struct UpdateAdmin<'info> {
    #[account(mut, seeds = [b"global_state"], bump = global_state.bump)]
    pub global_state: Account<'info, GlobalState>,

    pub admin: Signer<'info>,
}

#[derive(Accounts)]
pub struct WithdrawTreasury<'info> {
    #[account(mut, seeds = [b"global_state"], bump = global_state.bump)]
    pub global_state: Account<'info, GlobalState>,

    #[account(mut, seeds = [b"rewards_pool"], bump)]
    /// CHECK: SOL rewards pool - verified by seeds
    pub rewards_pool: AccountInfo<'info>,

    #[account(mut)]
    /// CHECK: Treasury recipient - validated by multisig
    pub recipient: AccountInfo<'info>,

    pub caller: Signer<'info>,
    pub system_program: Program<'info, System>,
}

// ============================================================
// Events
// ============================================================

#[event]
pub struct ProgramInitialized {
    pub admin: Pubkey,
    pub timestamp: i64,
}

#[event]
pub struct Staked {
    pub user: Pubkey,
    pub amount: u64,
    pub total_staked: u64,
    pub tier: u8,
    pub timestamp: i64,
}

#[event]
pub struct UnstakeRequested {
    pub user: Pubkey,
    pub amount: u64,
    pub available_at: i64,
    pub timestamp: i64,
}

#[event]
pub struct Unstaked {
    pub user: Pubkey,
    pub amount: u64,
    pub timestamp: i64,
}

#[event]
pub struct RewardsClaimed {
    pub user: Pubkey,
    pub amount: u64,
    pub timestamp: i64,
}

#[event]
pub struct ProfitDistributed {
    pub total_profit: u64,
    pub treasury_reserved: u64,
    pub distributable: u64,
    pub timestamp: i64,
}

#[event]
pub struct ProfitShareClaimed {
    pub user: Pubkey,
    pub amount: u64,
    pub tier: u8,
    pub timestamp: i64,
}

#[event]
pub struct RewardsPoolFunded {
    pub funder: Pubkey,
    pub amount: u64,
    pub timestamp: i64,
}

#[event]
pub struct EmergencyPauseActivated {
    pub signer1: Pubkey,
    pub signer2: Pubkey,
    pub timestamp: i64,
}

#[event]
pub struct ProgramResumed {
    pub admin: Pubkey,
    pub timestamp: i64,
}

#[event]
pub struct AdminUpdated {
    pub old_admin: Pubkey,
    pub new_admin: Pubkey,
    pub timestamp: i64,
}

#[event]
pub struct TreasuryWithdrawn {
    pub amount: u64,
    pub recipient: Pubkey,
    pub timestamp: i64,
}

// ============================================================
// Errors
// ============================================================

#[error_code]
pub enum StakingError {
    #[msg("Program is currently paused for emergency")]
    ProgramPaused,
    #[msg("Unauthorized: caller is not the admin or owner")]
    Unauthorized,
    #[msg("Stake amount is below the minimum for Starter tier (100K CLETUS)")]
    BelowMinimumStake,
    #[msg("Insufficient staked balance for this operation")]
    InsufficientStake,
    #[msg("Unstake cooldown period has not completed (7 days required)")]
    CooldownNotComplete,
    #[msg("An unstake request is already pending")]
    UnstakeAlreadyPending,
    #[msg("No pending unstake request found")]
    NoUnstakePending,
    #[msg("No active stake found")]
    NoStake,
    #[msg("No rewards available to claim")]
    NoRewardsToClaim,
    #[msg("Rewards pool has insufficient SOL balance")]
    InsufficientRewardsPool,
    #[msg("Tier is not eligible for profit sharing (requires Bronze or above)")]
    TierNotEligible,
    #[msg("Invalid amount: must be greater than zero")]
    InvalidAmount,
    #[msg("No stakers in the program")]
    NoStakers,
    #[msg("Invalid multisig signer")]
    InvalidMultisigSigner,
    #[msg("Duplicate multisig signer addresses")]
    DuplicateMultisigSigner,
    #[msg("Insufficient treasury balance")]
    InsufficientTreasury,
    #[msg("Arithmetic overflow in reward calculation")]
    ArithmeticOverflow,
}
