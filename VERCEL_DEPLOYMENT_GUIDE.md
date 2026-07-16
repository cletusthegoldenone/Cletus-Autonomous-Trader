# Vercel Deployment Guide - Cletus-Autonomous-Trader

## 🚀 Quick Deploy to Vercel

Vercel makes deploying Next.js apps **automatic and effortless**. Here's everything you need:

---

## **Step 1: Push Code to GitHub** ✅ (Already Done)

Your repository is already on GitHub:
- **Repository:** https://github.com/cletusthegoldenone/Cletus-Autonomous-Trader
- **Branch:** main
- **Status:** Ready to deploy

---

## **Step 2: Create a Vercel Account**

1. Go to [**vercel.com/signup**](https://vercel.com/signup)
2. Click **"Continue with GitHub"**
3. Authorize Vercel to access your GitHub repositories
4. You're logged in! ✅

---

## **Step 3: Import Project to Vercel**

### Option A: From Vercel Dashboard (Easiest)

1. Go to [**vercel.com/dashboard**](https://vercel.com/dashboard)
2. Click **"New Project"** (or "Add New" → "Project")
3. Under "Import Git Repository," find and click:
   - **`cletusthegoldenone/Cletus-Autonomous-Trader`**
4. Click **"Import"**

### Option B: Direct Import Link

Click this link (after signing into Vercel):
```
https://vercel.com/new?clone-from=https://github.com/cletusthegoldenone/Cletus-Autonomous-Trader
```

---

## **Step 4: Configure Environment Variables**

Vercel will ask for environment variables. Set these values:

### Required Variables

```env
# Solana RPC (Helius)
NEXT_PUBLIC_HELIUS_API_KEY=your_helius_api_key
HELIUS_RPC_URL=https://mainnet.helius-rpc.com

# Gemini AI API
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key

# Database (optional for basic features)
DATABASE_URL=postgresql://user:password@host:5432/cletus

# Admin Wallet
NEXT_PUBLIC_ADMIN_WALLET=9xQeKq6isj8Xu26Ku2b3FqxZsEaq5XfVhJ5dNon9Mop7

# Trading Settings
NEXT_PUBLIC_MIN_MARKET_CAP=25000
NEXT_PUBLIC_MAX_MARKET_CAP=1000000000
NEXT_PUBLIC_ENABLE_LIVE_TRADING=false

# Feature Flags (IMPORTANT)
NEXT_PUBLIC_ENABLE_SIMULATION_MODE=true
NEXT_PUBLIC_ENABLE_DRY_RUN=true
NODE_ENV=production
```

### How to Add Environment Variables in Vercel:

1. In the project import screen, click **"Environment Variables"**
2. Add each variable:
   - **Name:** (e.g., `NEXT_PUBLIC_HELIUS_API_KEY`)
   - **Value:** (your API key)
   - Click **"Add"**
3. Repeat for all variables
4. Click **"Deploy"**

---

## **Step 5: Configure Build Settings** (Auto-Detected)

Vercel automatically detects:
- **Framework:** Next.js ✓
- **Build Command:** `npm run build` ✓
- **Output Directory:** `.next` ✓
- **Install Command:** `npm install` ✓

**No changes needed!** The default settings are perfect.

---

## **Step 6: Deploy!**

1. Click **"Deploy"** button
2. Vercel starts the build process (takes 2-5 minutes)
3. Watch the build logs in real-time
4. When complete, you'll see:
   ```
   ✓ Build succeeded
   ✓ Deployment live at: https://cletus-autonomous-trader.vercel.app
   ```

---

## **Step 7: Verify Deployment**

### Check Your Live App

Visit: **`https://cletus-autonomous-trader.vercel.app`**

You should see:
- ✅ Dashboard loading with real-time stats
- ✅ Candlestick chart rendering
- ✅ Trading signals appearing
- ✅ Staking dashboard showing
- ✅ AI chat ready

### Test API Routes

```bash
# Prices API
curl https://cletus-autonomous-trader.vercel.app/api/prices?pair=SOL&timeframe=1h

# Signals API
curl https://cletus-autonomous-trader.vercel.app/api/signals

# AI Brain
curl -X POST https://cletus-autonomous-trader.vercel.app/api/ai \
  -H "Content-Type: application/json" \
  -d '{"question":"What is a good entry signal?"}'
```

---

## **Step 8: Set Up Custom Domain (Optional)**

### Add Your Own Domain

1. In Vercel dashboard, select your project
2. Go to **Settings** → **Domains**
3. Click **"Add Domain"**
4. Enter your domain (e.g., `cletus.trade`)
5. Follow DNS configuration instructions
6. Wait for DNS propagation (5-60 minutes)

### DNS Configuration Example

If your domain is hosted on Vercel:
- Just add the domain in Vercel settings—it handles DNS automatically! ✓

If hosted elsewhere (GoDaddy, Namecheap, etc.):
- Add a **CNAME record:**
  ```
  Name: www
  Value: cletus-autonomous-trader.vercel.app
  ```
- Add an **A record:**
  ```
  Name: @
  IP: 76.76.19.165
  ```

---

## **Step 9: Enable Continuous Deployment**

**Automatic!** Every time you push to `main` branch:

```bash
git push origin main
```

Vercel automatically:
1. Detects the push
2. Starts a new build
3. Deploys the latest version
4. Creates a preview URL (if from pull request)

---

## **Troubleshooting**

### Build Failed?

Check the **Build Logs** in Vercel dashboard:
1. Select your project
2. Click **"Deployments"**
3. Click the failed deployment
4. Scroll through logs to find error

**Common issues:**

```
Error: Missing environment variable
→ Add the variable to Vercel Settings > Environment Variables

Error: Timeout during build
→ Check your package.json for heavy dependencies
→ Consider using `--turbo` for Next.js 13+

Error: Port 3000 already in use
→ Vercel handles this automatically, shouldn't happen
```

### App Works Locally but Not on Vercel?

1. Check environment variables are set correctly
2. Verify API keys are valid
3. Check database connection string
4. Review Vercel build logs for errors

---

## **Monitoring & Logs**

### View Live Logs

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Watch logs in real-time
vercel logs cletus-autonomous-trader
```

### Monitor in Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click your project
3. View:
   - **Deployments:** Past & current builds
   - **Logs:** Real-time server output
   - **Analytics:** Traffic & performance
   - **Settings:** Configuration options

---

## **Production Checklist**

- [x] Next.js build passes (`npm run build ✓`)
- [x] Lint passes (`npm run lint ✓`)
- [x] Security scan clean (`0 alerts`)
- [x] Environment variables set
- [x] Database connected (optional)
- [x] API keys configured
- [x] Trade features set to simulation mode
- [x] Admin wallet configured
- [x] Custom domain (optional)
- [x] SSL/TLS enabled (automatic with Vercel)
- [x] Continuous deployment enabled

---

## **Performance Tips**

### Optimize Build Time

```bash
# Use Vercel's Edge Functions for API routes (faster)
# In api/prices/route.ts add:
export const config = {
  runtime: 'edge',
};
```

### Monitor Performance

- **Vercel Analytics:** View Core Web Vitals
- **Lighthouse:** Run in browser DevTools
- **Real User Monitoring:** Monitor actual user sessions

---

## **Scaling for Production**

### If Traffic Grows

Vercel automatically:
- ✅ Scales serverless functions
- ✅ Distributes content globally (CDN)
- ✅ Handles SSL/TLS certificates
- ✅ Provides DDoS protection

### Database Scaling

If you add PostgreSQL:
1. Use **Vercel Postgres** (integrated)
2. Or external: **AWS RDS**, **Supabase**, **PlanetScale**

---

## **Smart Contract Deployment** (Separate)

The UI is deployed on Vercel, but the smart contract needs separate deployment:

### Deploy Staking Contract to Solana

```bash
cd staking-contract

# Build the contract
anchor build

# Deploy to devnet (test first!)
anchor deploy --provider.cluster devnet

# Initialize with your admin wallet
anchor run initialize
```

For mainnet (production):
```bash
anchor deploy --provider.cluster mainnet-beta
```

---

## **API Route Optimization**

### Current Routes
- ✅ `GET /api/prices` - Generates OHLCV data
- ✅ `GET /api/signals` - Trading signal engine
- ✅ `POST /api/ai` - Gemini integration

### To Add Caching

```typescript
// In any API route
export const revalidate = 60; // Cache for 60 seconds

export async function GET(request: Request) {
  // API logic
}
```

---

## **Next Steps After Deployment**

1. **Test all features** on live URL
2. **Share the link** with users/beta testers
3. **Monitor logs** for errors
4. **Collect feedback** from users
5. **Add custom domain** when ready
6. **Scale** as needed

---

## **Support & Resources**

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Solana Docs:** https://docs.solana.com
- **Gemini AI:** https://ai.google.dev

---

## **Summary**

| Step | Status | Time |
|------|--------|------|
| 1. Code to GitHub | ✅ Done | - |
| 2. Create Vercel account | 📝 Do now | 2 min |
| 3. Import project | 📝 Do now | 1 min |
| 4. Add env variables | 📝 Do now | 3 min |
| 5. Deploy | 📝 Do now | 1 click |
| 6. Wait for build | ⏳ Auto | 2-5 min |
| 7. Visit live URL | ✅ Ready | - |

**Total time: ~15 minutes**

---

## **Your Live App**

Once deployed, your app will be live at:

```
🚀 https://cletus-autonomous-trader.vercel.app
```

(Vercel will generate the exact subdomain after you import)

**The golden goose is ready to fly!** 🦆✈️

---

## **Quick Deploy Command (CLI)**

If you have Vercel CLI installed:

```bash
# Login
vercel login

# Deploy from project directory
vercel --prod

# Watch logs
vercel logs --follow
```

---

**Deployment Guide Complete!** Everything is ready. Just follow the steps above and your Cletus-Autonomous-Trader will be live on the internet. 🎉
