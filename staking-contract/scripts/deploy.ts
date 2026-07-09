#!/usr/bin/env ts-node
/**
 * Cletus Staking Contract - Deploy Script
 *
 * Usage:
 *   NETWORK=devnet ts-node staking-contract/scripts/deploy.ts
 *   NETWORK=mainnet ts-node staking-contract/scripts/deploy.ts
 *
 * Prerequisites:
 *   - Solana CLI installed and configured
 *   - Anchor installed: cargo install --git https://github.com/coral-xyz/anchor anchor-cli
 *   - Wallet configured: solana-keygen new or import
 *   - npm install @coral-xyz/anchor @solana/web3.js @solana/spl-token
 */

import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { PublicKey, Keypair, Connection, clusterApiUrl } from '@solana/web3.js';
import * as fs from 'fs';
import * as path from 'path';

const NETWORK = (process.env.NETWORK as 'devnet' | 'mainnet-beta') || 'devnet';

async function deploy() {
  console.log('\n🚀 Cletus Staking Contract - Deploy Script');
  console.log('==========================================');
  console.log(`Network: ${NETWORK}`);

  // Load deployer wallet
  const walletPath =
    process.env.WALLET_PATH || path.join(process.env.HOME || '~', '.config/solana/id.json');

  if (!fs.existsSync(walletPath)) {
    console.error(`\n❌ Wallet not found at: ${walletPath}`);
    console.log('Run: solana-keygen new --outfile ~/.config/solana/id.json');
    process.exit(1);
  }

  const walletKeyData = JSON.parse(fs.readFileSync(walletPath, 'utf-8'));
  const payer = Keypair.fromSecretKey(Uint8Array.from(walletKeyData));

  console.log(`\n📋 Deployer: ${payer.publicKey.toBase58()}`);

  // Connect to cluster
  const rpcUrl = process.env.RPC_URL || clusterApiUrl(NETWORK);
  const connection = new Connection(rpcUrl, 'confirmed');

  const balance = await connection.getBalance(payer.publicKey);
  console.log(`💰 Balance: ${balance / 1e9} SOL`);

  if (balance < 0.5 * 1e9) {
    console.error('\n❌ Insufficient balance. Need at least 0.5 SOL for deployment.');
    if (NETWORK === 'devnet') {
      console.log('Get devnet SOL: solana airdrop 2');
    }
    process.exit(1);
  }

  // Build program
  console.log('\n🔨 Building program...');
  console.log('Run: anchor build');
  console.log('\nAfter build, run: anchor deploy');
  console.log('\nOr use the initialization script:');
  console.log('ts-node staking-contract/scripts/initialize.ts');

  // PDA derivation preview
  const programId = new PublicKey('CLETUSxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
  const [globalStatePda] = PublicKey.findProgramAddressSync(
    [Buffer.from('global_state')],
    programId
  );
  const [rewardsPoolPda] = PublicKey.findProgramAddressSync(
    [Buffer.from('rewards_pool')],
    programId
  );

  console.log('\n📍 Program Addresses:');
  console.log(`  Program ID:    CLETUSxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`);
  console.log(`  Global State:  ${globalStatePda.toBase58()}`);
  console.log(`  Rewards Pool:  ${rewardsPoolPda.toBase58()}`);

  console.log('\n✅ Deploy script ready. Follow steps above to complete deployment.');
}

deploy().catch(console.error);
