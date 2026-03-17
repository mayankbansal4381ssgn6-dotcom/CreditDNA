# CreditDNA
### Alternative Credit Scoring for Unbanked India

**Team:** BOTSQUAD  
**Institution:** SRM Institute of Science & Technology, Chennai  
**Stack:** HTML · CSS (Tailwind) · JavaScript (ES Modules) · JSDoc TypeScript · Three.js · localStorage

---

## What is CreditDNA?

CreditDNA builds a **300–900 credit score** for unbanked Indians using their UPI transaction behaviour — processed entirely on-device, so raw data never leaves the user's phone. Banks and NBFCs call our REST API and receive only the score. Nothing else.

**The problem:** 500 million Indians have no CIBIL score — not because they're poor, but because banks have no data on them. Gig workers, farmers, students, and micro-entrepreneurs transact actively via UPI every day but are completely invisible to the formal credit system.

**The fix:** Analyse 50+ behavioural signals from UPI history → generate a privacy-first credit score → share only the score with lenders via API.

---

## Live Demo

> Deploy to Vercel and open on any device — phone, tablet, or desktop.
> Admin portal available at `/admin`

---

## Pages

| Page | URL | Description |
|---|---|---|
| Home | `/#landing` | Landing page with DNA 3D animation, problem, how it works, Ravi demo, features |
| How It Works | `/#how` | Full methodology — consent → feature engineering → ML scoring → bank API |
| For Banks | `/#pricing` | API pricing tiers for lenders (Starter / Growth / Enterprise) |
| Register | `/#register` | 3-step signup: personal info → occupation → UPI consent |
| Login | `/#login` | Email + password authentication |
| Dashboard | `/#dashboard` | Score overview, animated arc, factor breakdown, improvement tips |
| Check Score | `/#check` | 5-question UPI behaviour simulator with animated score reveal |
| Transactions | `/#transactions` | Mock UPI transaction list with summary stats |
| Profile | `/#profile` | Account details, privacy info, delete account |
| **Admin Portal** | `/admin.html` | Separate dark-themed admin dashboard (restricted access) |

---

## Admin Portal

The admin portal (`admin.html`) is a **completely separate page** with its own login gate.

### Access Requirements
All three must match to gain access:
1. **Email** — must be on the admin whitelist in `js/config.js`
2. **Password** — the account password set during registration
3. **Admin Key** — `CDNA2025` (shared with team leads only)

### Admin Features
- **Overview tab** — occupation breakdown, score distribution charts, recent signups
- **Users tab** — full user table, delete users, export CSV
- **Scores tab** — score analytics, ranked leaderboard
- **Settings tab** — admin whitelist view, DB stats, clear all data

### Admin Emails (whitelist)
```
simon@creditdna.in
mayank@creditdna.in
varsha@creditdna.in
deva@creditdna.in
admin@creditdna.in
```
> To add a new admin, edit `ADMIN_EMAILS` in `js/config.js`

---

## Features

- **Privacy by architecture** — raw UPI data never leaves the device
- **On-device ML scoring** — 50+ behavioural signals processed locally
- **Three.js DNA helix** — interactive 3D double helix with mouse parallax (desktop only)
- **Plain-English explanations** — users know exactly why they got their score
- **Animated score arc** — SVG arc + count-up animation on score reveal
- **Bank-ready REST API** — `POST /api/score` returns score + tier + factors
- **Score simulator** — working 5-question demo that calculates a real 300–900 score
- **Full auth flow** — register, login, logout, persistent sessions via localStorage
- **Improvement tips** — personalised advice based on score tier
- **Separate admin portal** — dark-themed, triple-gated, with user management + CSV export

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vanilla HTML5 + Tailwind CSS (Play CDN) + JavaScript ES Modules |
| Type Safety | JSDoc `@typedef` / `@param` / `@returns` (zero build step) |
| 3D Animation | Three.js r128 (CDN) — DNA double helix with particles + mouse parallax |
| Typography | Bricolage Grotesque + Plus Jakarta Sans (Google Fonts CDN) |
| Admin Typography | + JetBrains Mono for terminal aesthetic |
| Auth & Storage | Browser localStorage (no backend needed) |
| Deployment | Vercel (static, multi-page) |

> **Zero build step.** No npm, no webpack, no node_modules. Just files.

---

## File Structure

```
creditdna/
├── index.html              ← Main app shell (nav, toast, app root)
├── admin.html              ← Admin portal shell (separate dark page)
├── vercel.json             ← Vercel multi-page routing config
├── README.md               ← This file
│
├── css/
│   └── styles.css          ← Custom CSS (animations, cards, forms, layout)
│
└── js/
    ├── app.js              ← Client-side router + boot
    ├── config.js           ← Constants, score helpers, mock data (JSDoc typed)
    ├── db.js               ← localStorage DB layer (typed)
    ├── auth.js             ← Login / register / logout logic
    ├── nav.js              ← Nav bar + mobile menu renderer
    ├── toast.js            ← Toast notification system
    ├── three-dna.js        ← Three.js DNA double helix 3D model
    └── pages/
        ├── landing.js      ← Landing page (boots Three.js on desktop)
        ├── auth.js         ← Login form + 3-step register wizard
        └── pages.js        ← Dashboard, Check Score, Transactions,
                              Profile, How It Works, Pricing
```

---

## Device Compatibility

| Device | Support |
|---|---|
| Desktop (Windows / Mac / Linux) | ✅ Full — Three.js DNA animation, hover effects |
| iPhone (iOS Safari / Chrome) | ✅ Full — hamburger nav, safe area support, no zoom on inputs |
| Android (Chrome / Samsung Browser) | ✅ Full — touch gestures, hamburger nav |
| iPad / tablet | ✅ Full — adaptive layout |

**Mobile-specific optimisations:**
- Three.js skipped on phones (saves battery, avoids lag)
- Hamburger menu with slide-down animation
- `env(safe-area-inset-*)` for iPhone notch / Dynamic Island
- `min-height: 44px` on all tap targets (Apple guidelines)
- `font-size: max(16px)` on inputs — prevents iOS auto-zoom
- `viewport-fit=cover` for edge-to-edge iPhone display

---

## Local Setup

No installation required:

```bash
# Option 1 — VS Code Live Server (recommended)
# Right-click index.html → Open with Live Server

# Option 2 — any static server
npx serve .
# Open http://localhost:3000

# Option 3 — Python
python -m http.server 3000
```

> ⚠️ Must be served over HTTP (not opened as a file:///) because ES modules require a server.

---

## Deploy to Vercel

### Option A — Vercel CLI
```bash
npm i -g vercel
cd creditdna
vercel
# Framework: Other → Deploy
```

### Option B — GitHub + Vercel (Recommended)
```bash
git add .
git commit -m "CreditDNA v2 — multi-file architecture"
git push
# Vercel auto-deploys on every push
```

### Option C — Vercel Dashboard (No CLI)
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repo
3. Framework preset: **Other**
4. Click **Deploy**

---

## The Team — BOTSQUAD

| Name | Role | Admin Email |
|---|---|---|
| Simon Paul | Full Stack + Lead | simon@creditdna.in |
| Mayank Bansal | Data Science + Backend | mayank@creditdna.in |
| Varsha Rani | UI/UX + Frontend | varsha@creditdna.in |
| Deva Nandha | Business Analyst | deva@creditdna.in |

---

## Changelog

### v2.0 (March 2025)
- Restructured from single HTML file to proper multi-file ES module architecture
- Added Tailwind CSS (Play CDN) with custom theme tokens
- Added Three.js DNA double helix 3D model with mouse parallax
- Added separate admin portal (`admin.html`) with triple-gated login
- Added JSDoc TypeScript typing throughout
- Added animated SVG score arc, count-up animation
- Added CSV export in admin portal
- Fixed checkbox visibility bug (webkit-appearance)
- Fixed icon overlap bug (replaced emoji with CSS background-image icons)
- Removed dark mode (light-only)

### v1.0 (Initial)
- Single `index.html` with all HTML + CSS + JS
- Basic auth, score simulator, admin dashboard

---

*CreditDNA © 2025 · Built by BOTSQUAD · SRM Institute of Science & Technology, Chennai*
