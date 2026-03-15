# CreditDNA — HackNova 3.0

**Alternative Credit Scoring for Unbanked India**  
Team: BOTSQUAD | SRM Institute of Science & Technology, Chennai  
Track: FinTech / Financial Inclusion — AMD Slingshot 2026

---

## 🚀 Quick Start (Local)

1. Clone / download this folder
2. Open `index.html` directly in any browser — **no build step needed**
3. Everything runs client-side (Three.js CDN + localStorage auth)

```bash
# Or serve locally with any static server:
npx serve .
# Then open http://localhost:3000
```

---

## ☁️ Deploy to Vercel (3 steps)

### Option A — Vercel CLI
```bash
npm i -g vercel
cd creditdna
vercel
# Follow prompts → select "Other" framework → deploy
```

### Option B — Vercel Dashboard (No CLI)
1. Go to https://vercel.com/new
2. Choose **"Import Third-Party Git Repository"** or drag-drop this folder
3. Framework preset: **Other**
4. Root directory: `creditdna/` (or `.` if already inside)
5. Click **Deploy** — done in ~30 seconds

### Option C — GitHub + Vercel (Recommended)
```bash
git init
git add .
git commit -m "CreditDNA initial deployment"
gh repo create creditdna --public --push
# Then import repo at vercel.com/new
```

---

## 📁 File Structure

```
creditdna/
├── index.html      ← Entire app (HTML + CSS + JS + Three.js)
├── vercel.json     ← Vercel routing config
└── README.md       ← This file
```

---

## 🧬 What's Inside

### Pages
| Route (client-side) | Description |
|---|---|
| `landing` | Hero with DNA Three.js animation, problem statement, how it works, unique angle vs competitors, Ravi demo, revenue model, tech stack, team |
| `about` | Deep dive — mission, AMD Slingshot angle, innovation breakdown, stretch goals |
| `login` | Email + password auth (localStorage) |
| `register` | 3-step registration: personal → team → track |
| `dashboard` | Submission status, countdown, announcements, quick links |
| `submit` | 9-step project submission form (pre-filled with CreditDNA content) |
| `profile` | Hacker profile card |

### Tech
- **Three.js r128** (CDN) — DNA double helix 3D scene with mouse parallax
- **Orbitron + Rajdhani** fonts (Google Fonts CDN)
- **localStorage** — auth, user data, submissions (no backend needed for hackathon demo)
- **Zero dependencies** beyond CDN scripts — pure HTML/CSS/JS

---

## 🎯 The Unique Angle (AMD Slingshot 2026)

```
CreditVidya exists BUT sends data to cloud
    → Privacy risk for 500M users
    → CreditDNA fixes this with AMD on-device AI
```

**4 Pillars no competitor has together:**
- ✅ Alternative credit scoring (UPI as credit proxy)
- ✅ On-device ML via AMD Ryzen AI NPU
- ✅ No raw data leaves the phone
- ✅ Works offline

---

## 👥 Team BOTSQUAD

| Name | Role |
|---|---|
| Simon Paul | Full Stack + Lead |
| Mayank Bansal | Data Science + Backend |
| Varsha Rani | UI/UX + Frontend |
| Deva Nandha | Business Analyst |

---

*Built for HackNova 3.0, SRM IST × MLH × Newton School Coding Club*
