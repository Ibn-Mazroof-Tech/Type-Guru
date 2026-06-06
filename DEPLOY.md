# Deploying TypeGuru to Vercel

## Step-by-Step

### Step 1 — NeonDB Setup
1. Go to https://console.neon.tech
2. Create New Project → name it "typeguru"
3. Copy the **Connection String** (starts with `postgresql://`)
4. Paste it as `DATABASE_URL` in your `.env.local`
5. Run: `npm run db:push` to create all tables

### Step 2 — Razorpay Setup
1. Go to https://dashboard.razorpay.com
2. Create account → Settings → API Keys → Generate Test Key
3. Copy Key ID and Key Secret
4. Set `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `NEXT_PUBLIC_RAZORPAY_KEY_ID`
5. When ready for production, switch to Live keys

### Step 3 — Google OAuth (optional)
1. Go to https://console.cloud.google.com
2. APIs & Services → Credentials → Create OAuth Client ID
3. Add `http://localhost:3000` (dev) and your Vercel URL (prod) to Authorized URIs
4. Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`

### Step 4 — Resend Email
1. Go to https://resend.com → Sign up free
2. Create API Key → copy it
3. Set `RESEND_API_KEY` and `EMAIL_FROM`

### Step 5 — Upstash Redis
1. Go to https://console.upstash.com → Create Database
2. Copy REST URL and REST Token
3. Set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`

### Step 6 — Deploy to Vercel
1. Push your project to GitHub
2. Go to https://vercel.com/new
3. Import your GitHub repo
4. Under Environment Variables, add all variables from .env.example
5. Set `NEXTAUTH_URL` to your Vercel domain (e.g. https://typeguru.vercel.app)
6. Set `NEXT_PUBLIC_APP_URL` to same Vercel domain
7. Click Deploy

### Step 7 — Final DB Migration
After first deploy, run migrations against production NeonDB:
```bash
DATABASE_URL="your-neon-connection-string" npm run db:push
```

## Google AdSense Integration

Add to `app/layout.tsx` inside `<head>`:
```html
<script
  async
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_ID"
  crossOrigin="anonymous"
/>
```

Place ad units on free-tier pages (practice page between stats and typing area).
