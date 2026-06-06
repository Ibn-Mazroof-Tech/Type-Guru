# TypeGuru — AI Typing Platform

India's most advanced AI-powered typing platform for government aspirants,
data entry professionals, developers & Arabic learners.

## Tech Stack

| Layer       | Technology                        |
|-------------|-----------------------------------|
| Frontend    | Next.js 14 (App Router) + Tailwind CSS |
| Auth        | NextAuth.js v5                    |
| Database    | NeonDB (Serverless PostgreSQL)    |
| ORM         | Drizzle ORM                       |
| Payments    | Razorpay (UPI + Cards)            |
| Email       | Resend                            |
| Caching     | Upstash Redis                     |
| Deployment  | Vercel                            |

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env.local
# Fill in all values in .env.local
```

### 3. Push database schema to NeonDB
```bash
npm run db:push
```

### 4. Run development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

## Deployment to Vercel

1. Push this project to GitHub
2. Import repo at [vercel.com/new](https://vercel.com/new)
3. Add all `.env.example` variables in Vercel → Settings → Environment Variables
4. Deploy — Vercel auto-detects Next.js

## Environment Variables

See `.env.example` for all required variables with instructions on where to get each one.

## Features

- ⚡ General Speed — Standard QWERTY timed tests
- 🏛️ Govt. Exam Prep — SSC, RRB, CPCT, High Court (free)
- 📊 Data Entry — Numbers, codes, forms (free)
- 💻 Code Typing — Python, JS, SQL (Pro)
- 🕌 Arabic / Urdu — Script & Quran (Pro)
- 🤖 AI Coach — Keyboard heatmap & personalized drills (Pro)
- 🏆 National Leaderboard
- 🎓 Verifiable Certificates
- 💎 Razorpay payments (₹11/day · ₹299/mo · ₹1999/yr)

## Monetization

- **Google Ads** — Free tier users (add AdSense script to layout.tsx)
- **Day Pass** — ₹11/day (impulse purchase before exams)
- **Pro Monthly** — ₹299/month
- **Pro Yearly** — ₹1,999/year (save 33%)
- **Certificates** — ₹149–₹249 per certificate
- **Corporate** — Custom pricing

## Database Commands

```bash
npm run db:generate   # Generate migration files
npm run db:push       # Push schema directly (dev)
npm run db:migrate    # Run migrations (production)
npm run db:studio     # Open Drizzle Studio GUI
```

## Project Structure

```
typeguru/
├── app/
│   ├── (auth)/              # Login & Signup pages
│   ├── (dashboard)/         # Practice, Coach, Leaderboard, Pricing
│   ├── api/                 # All API endpoints
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Landing page
├── components/
│   ├── ui/                  # Navbar, Modal, UpgradeModal
│   ├── typing/              # TypingTest, ModeSelector, StatsBar
│   ├── coach/               # KeyboardHeatmap, WeeklyChart, DrillCards
│   └── providers/           # SessionProvider
├── lib/
│   ├── db/                  # Schema + NeonDB connection
│   ├── auth/                # NextAuth config
│   ├── razorpay.ts          # Payment helpers
│   └── utils.ts             # Shared utilities
├── types/                   # TypeScript types
├── middleware.ts             # Route protection
└── .env.example             # Environment variables template
```
