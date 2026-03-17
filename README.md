# CreditDNA
### Alternative Credit Scoring for Unbanked India

**Team:** BOTSQUAD  
**Institution:** SRM Institute of Science & Technology, Chennai  
**Stack:** HTML · CSS · JavaScript · Three.js · localStorage

---

## What is CreditDNA?

CreditDNA builds a **300–900 credit score** for unbanked Indians using their UPI transaction behaviour — processed entirely on-device, so raw data never leaves the user's phone. Banks and NBFCs call our REST API and receive only the score. Nothing else.

**The problem:** 500 million Indians have no CIBIL score — not because they're poor, but because banks have no data on them. Gig workers, farmers, students, and micro-entrepreneurs transact actively via UPI every day but are completely invisible to the formal credit system.

**The fix:** Analyse 50+ behavioural signals from UPI history → generate a privacy-first credit score → share only the score with lenders via API.

---

## Live Demo

> Deploy to Vercel and open on any device — phone, tablet, or desktop.

---

## Pages

| Page | URL (client-side) | Description |
|---|---|---|
| Home | `/` | Landing page with DNA 3D animation, problem, how it works, Ravi demo, features, team |
| How It Works | `/how` | Full methodology — consent → feature engineering → ML scoring → bank API |
| For Banks | `/pricing` | API pricing tiers for lenders (Starter / Growth / Enterprise) |
| Register | `/register` | 3-step signup: personal info → occupation → UPI consent |
| Login | `/login` | Email + password authentication |
| Dashboard | `/dashboard` | Score overview, factor breakdown, improvement tips |
| Check Score | `/check` | 5-question UPI behaviour simulator that generates and saves your score |
| Profile | `/profile` | Account details, privacy info |

---

## Features

- **Privacy by architecture** — raw UPI data never leaves the device
- **On-device ML scoring** — 50+ behavioural signals processed locally
- **Plain-English explanations** — users know exactly why they got their score
- **Bank-ready REST API** — `POST /api/score` returns score + tier + factors
- **Score simulator** — working 5-question demo that calculates a real 300–900 score
- **Full auth flow** — register, login, logout, persistent sessions via localStorage
- **Improvement tips** — personalised advice based on your score tier

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vanilla HTML5 + CSS3 + JavaScript (ES6+) |
| 3D Animation | Three.js r128 (CDN) — DNA double helix |
| Typography | Orbitron + Rajdhani (Google Fonts CDN) |
| Auth & Storage | Browser localStorage (no backend needed) |
| Deployment | Vercel (static) |

> **Zero dependencies.** No npm, no build step, no node_modules. One HTML file.

---

## Device Compatibility

| Device | Support |
|---|---|
| Desktop (Windows / Mac / Linux) | ✅ Full — Three.js animation, hover effects |
| iPhone (iOS Safari / Chrome) | ✅ Full — hamburger nav, safe area support, no zoom on inputs |
| Android (Chrome / Samsung Browser) | ✅ Full — touch gestures, hamburger nav |
| iPad / tablet | ✅ Full — adaptive layout |

**Mobile-specific optimisations:**
- Three.js skipped on phones (saves battery + avoids lag)
- Hamburger menu with slide-down animation
- `env(safe-area-inset-*)` for iPhone notch / Dynamic Island
- `min-height: 44px` on all tap targets (Apple guidelines)
- `font-size: max(16px)` on inputs — prevents iOS auto-zoom
- `viewport-fit=cover` for edge-to-edge iPhone display
- Add to Home Screen on iOS → opens fullscreen like a native app

---

## Local Setup

No installation required. Just open the file:

```bash
# Option 1 — double click
open index.html

# Option 2 — VS Code Live Server
# Right-click index.html → Open with Live Server

# Option 3 — any static server
npx serve .
# Open http://localhost:3000
```

---

## Deploy to Vercel

### Option A — Vercel CLI
```bash
npm i -g vercel
cd creditdna
vercel
# Framework: Other → Deploy
```

### Option B — Vercel Dashboard (No CLI)
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repo
3. Framework preset: **Other**
4. Click **Deploy** — live in ~30 seconds

### Option C — GitHub + Vercel (Recommended)
```bash
git add .
git commit -m "Update"
git push
# Vercel auto-deploys on every push
```

---

## File Structure

```
creditdna/
├── index.html      ← Entire app (HTML + CSS + JS + Three.js)
├── vercel.json     ← Vercel routing config
└── README.md       ← This file
```

---

## The Team — BOTSQUAD

| Name | Role |
|---|---|
| Simon Paul | Full Stack + Lead |
| Mayank Bansal | Data Science + Backend |
| Varsha Rani | UI/UX + Frontend |
| Deva Nandha | Business Analyst |

---

*CreditDNA © 2025 · Built by BOTSQUAD · SRM Institute of Science & Technology, Chennai*
