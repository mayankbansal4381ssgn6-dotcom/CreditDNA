// @ts-check
import { initDNA } from '../three-dna.js';

/** @type {{ dispose: () => void } | null} */
let dnaInstance = null;

/**
 * Render the landing page
 * @param {Function} go
 */
export function renderLanding(go) {
  if (dnaInstance) { dnaInstance.dispose(); dnaInstance = null; }

  document.getElementById('app').innerHTML = `
  <div class="page-enter">

    <!-- HERO -->
    <section class="relative overflow-hidden" style="padding: clamp(72px,10vw,110px) 0 80px; min-height: 88vh; display:flex; align-items:center;">
      <div class="hero-blob" style="width:500px;height:500px;background:radial-gradient(circle,rgba(212,80,15,.10) 0%,transparent 70%);top:-80px;right:-60px;"></div>
      <div class="hero-blob" style="width:300px;height:300px;background:radial-gradient(circle,rgba(34,197,94,.07) 0%,transparent 70%);bottom:40px;left:-40px;"></div>

      <canvas id="dna-canvas"></canvas>

      <div class="wrap w-full">
        <div style="max-width:580px">
          <div class="flex items-center gap-3 mb-6">
            <span class="badge badge-accent">🇮🇳 Built for Unbanked India</span>
            <span class="badge badge-green">500M+ addressable users</span>
          </div>
          <h1 class="font-display font-extrabold text-ink leading-[1.08] tracking-tight mb-6"
              style="font-size:clamp(38px,6vw,72px);">
            Credit for<br>
            <span style="color:#d4500f">everyone</span><br>
            who uses UPI
          </h1>
          <p class="text-[#4a3f30] leading-relaxed mb-10" style="font-size:clamp(15px,2vw,19px); max-width:480px;">
            Your UPI transaction history is rich financial data. We turn it into a 300–900 score —
            processed <strong>on your device</strong>, never shared raw.
          </p>
          <div class="flex flex-wrap gap-4 hero-ctas">
            <button class="btn-primary btn-lg" onclick="window._go('register')">
              Get Your Score Free →
            </button>
            <button class="btn-outline btn-lg" onclick="window._go('how')">
              How It Works
            </button>
          </div>
          <div class="flex flex-wrap items-center gap-6 mt-10 text-sm text-[#8c7d6a]">
            <span class="flex items-center gap-2"><span class="text-[#0f7e5a] font-bold">✓</span> No bank account needed</span>
            <span class="flex items-center gap-2"><span class="text-[#0f7e5a] font-bold">✓</span> 100% on-device</span>
            <span class="flex items-center gap-2"><span class="text-[#0f7e5a] font-bold">✓</span> Free for individuals</span>
          </div>
        </div>
      </div>
    </section>

    <!-- STATS RIBBON -->
    <section style="background:#1a1208; padding:40px 0;">
      <div class="wrap">
        <div class="grid-4" style="text-align:center; gap:24px;">
          ${[['500M+','Unbanked Indians'],['50+','UPI Signals Analysed'],['300–900','Score Range'],['<200ms','Score Generation']].map(([n,l]) => `
          <div>
            <div class="font-display font-extrabold text-[#22c55e]" style="font-size:clamp(28px,4vw,40px);">${n}</div>
            <div style="font-size:13px; color:rgba(250,246,236,.5); margin-top:4px;">${l}</div>
          </div>`).join('')}
        </div>
      </div>
    </section>

    <!-- PROBLEM -->
    <section class="section" style="background:#fffef9;">
      <div class="wrap">
        <div class="grid-2" style="align-items:center; gap:56px;">
          <div>
            <span class="label">The Problem</span>
            <h2 class="font-display font-extrabold text-ink mb-6" style="font-size:clamp(26px,4vw,42px); line-height:1.1;">
              500 million Indians are <span style="color:#d4500f">invisible</span> to banks
            </h2>
            <p class="text-[#4a3f30] leading-relaxed mb-6" style="font-size:15px;">
              Not because they're poor — but because banks have <em>no data</em> on them.
              Gig workers, farmers, students and micro-entrepreneurs transact actively via UPI every day
              but are completely shut out of formal credit.
            </p>
            <p class="text-[#4a3f30] leading-relaxed" style="font-size:15px;">
              The CIBIL score was designed for bank customers. <strong>CreditDNA was designed for everyone else.</strong>
            </p>
          </div>
          <div class="grid-2" style="gap:16px;">
            ${[['🚫','No CIBIL Score','Even with years of steady income and payments'],
               ['📵','No Bank History','UPI-first users leave no traditional paper trail'],
               ['💸','No Access','₹2.4L crore in credit demand goes unfulfilled'],
               ['🔄','Stuck in a Loop','Can\'t get credit without history, no history without credit']
              ].map(([i,t,d]) => `
            <div class="cdna-card" style="padding:20px;">
              <div style="font-size:26px; margin-bottom:10px;">${i}</div>
              <div class="font-display font-bold text-ink mb-2" style="font-size:15px;">${t}</div>
              <div style="font-size:13px; color:#8c7d6a; line-height:1.6;">${d}</div>
            </div>`).join('')}
          </div>
        </div>
      </div>
    </section>

    <!-- HOW IT WORKS -->
    <section class="section" style="background:#faf8f3;">
      <div class="wrap" style="text-align:center;">
        <span class="label">How It Works</span>
        <h2 class="font-display font-extrabold text-ink mb-4" style="font-size:clamp(26px,4vw,42px); line-height:1.1;">
          Four steps to your score
        </h2>
        <p class="text-[#4a3f30] mb-14" style="font-size:15px; max-width:520px; margin-left:auto; margin-right:auto;">
          From raw UPI history to a bankable credit score — entirely on your device, in under 200ms.
        </p>
        <div class="grid-4" style="text-align:left; position:relative;">
          ${[['01','#d4500f','Consent','You grant permission','Your UPI data loads into an on-device pipeline. DPDP Act compliant. Raw data never uploaded.'],
             ['02','#0f7e5a','Feature Engineering','50+ signals extracted','Transaction frequency, regularity, merchant diversity, income consistency — all analysed locally.'],
             ['03','#1d5fa8','ML Scoring','On-device model runs','A lightweight ML model converts your behavioural signals into a 300–900 score in milliseconds.'],
             ['04','#b45309','Bank API','Score shared, not data','Lenders call our REST API. They receive your score + tier. Raw transactions are architecturally inaccessible.'],
            ].map(([num,c,t,sub,d]) => `
          <div class="cdna-card cdna-card-lift" style="padding:24px; border-top:3px solid ${c};">
            <div class="font-display font-extrabold mb-3" style="font-size:32px; color:${c}; opacity:.25;">${num}</div>
            <div style="font-size:11px; font-weight:700; letter-spacing:.1em; color:${c}; margin-bottom:6px; text-transform:uppercase;">${sub}</div>
            <div class="font-display font-bold text-ink mb-2" style="font-size:18px;">${t}</div>
            <div style="font-size:13px; color:#8c7d6a; line-height:1.65;">${d}</div>
          </div>`).join('')}
        </div>
      </div>
    </section>

    <!-- RAVI DEMO -->
    <section class="section" style="background:#fffef9;">
      <div class="wrap">
        <div class="grid-2" style="align-items:center; gap:64px;">
          <div>
            <span class="label">Real-World Example</span>
            <h2 class="font-display font-extrabold text-ink mb-4" style="font-size:clamp(24px,3.5vw,38px); line-height:1.1;">
              Meet Ravi — Swiggy delivery partner
            </h2>
            <p class="text-[#4a3f30] leading-relaxed mb-6" style="font-size:15px;">
              Ravi earns ₹22,000/month via Swiggy + weekend gigs. He's been using UPI for 3 years, pays his Jio bill every month,
              and buys groceries at DMart weekly. No salary slip. No bank statement. <strong>Zero CIBIL history.</strong>
            </p>
            <div class="cdna-card" style="padding:24px; margin-bottom:16px;">
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:16px;">
                <div>
                  <div class="font-display font-bold text-ink" style="font-size:16px;">Ravi Kumar's CreditDNA Score</div>
                  <div style="font-size:13px; color:#8c7d6a;">Generated from 6 months of UPI history</div>
                </div>
                <div class="font-display font-extrabold" style="font-size:44px; color:#0f7e5a;">724</div>
              </div>
              <div class="progress-bar" style="margin-bottom:8px;">
                <div class="progress-fill" style="width:70.6%; background:#0f7e5a;"></div>
              </div>
              <div style="display:flex; justify-content:space-between; font-size:11px; color:#8c7d6a;">
                <span>300 — Poor</span><span class="badge badge-green" style="font-size:11px;">Good</span><span>900 — Excellent</span>
              </div>
            </div>
            <button class="btn-primary" onclick="window._go('check')">Try the Score Simulator →</button>
          </div>
          <div class="grid-2" style="gap:14px;">
            ${[['💳','Payment Regularity','94/100','Pays utilities every month without fail'],
               ['📈','Income Stability','81/100','Consistent Swiggy credits + side income'],
               ['🏪','Merchant Diversity','88/100','8+ different spend categories'],
               ['🔗','UPI Tenure','76/100','3+ years of active UPI usage']
              ].map(([i,t,v,d]) => `
            <div class="cdna-card" style="padding:18px;">
              <div style="font-size:22px; margin-bottom:8px;">${i}</div>
              <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:6px;">
                <div style="font-size:13px; font-weight:600; color:#1a1208;">${t}</div>
                <div class="font-display font-bold" style="color:#0f7e5a;">${v}</div>
              </div>
              <div style="font-size:12px; color:#8c7d6a;">${d}</div>
            </div>`).join('')}
          </div>
        </div>
      </div>
    </section>

    <!-- FEATURES -->
    <section class="section" style="background:#1a1208;">
      <div class="wrap" style="text-align:center;">
        <span class="label" style="color:rgba(250,246,236,.4);">Why CreditDNA</span>
        <h2 class="font-display font-extrabold mb-14" style="font-size:clamp(26px,4vw,42px); color:#faf6ec; line-height:1.1;">
          Built different, by design
        </h2>
        <div class="grid-3" style="text-align:left;">
          ${[['🔒','Privacy by Architecture','Raw UPI data never leaves your device. Architecturally impossible — not just a privacy policy.','#d4500f'],
             ['⚡','200ms Scoring','Lightweight on-device ML model. No round-trip to servers. Score generated before you blink.','#0f7e5a'],
             ['🧬','50+ Behavioural Signals','Transaction frequency, regularity, income consistency, merchant diversity and 46 more.','#1d5fa8'],
             ['📖','Plain-English Explanations','Every score comes with a human-readable breakdown. You know exactly why you got your score.','#b45309'],
             ['🏦','Bank-Ready REST API','POST /api/score — lenders receive score + tier + factors. Zero raw data ever transmitted.','#0f7e5a'],
             ['🌏','UPI-First Design','Works for every Indian with a UPI account. No salary slip, no bank account, no problem.','#d4500f'],
            ].map(([i,t,d,c]) => `
          <div class="cdna-card-lift" style="background:rgba(255,255,255,.05); border:1.5px solid rgba(255,250,235,.08); border-radius:16px; padding:24px; transition:all .2s;">
            <div style="width:44px; height:44px; border-radius:12px; background:${c}20; display:flex; align-items:center; justify-content:center; font-size:20px; margin-bottom:16px;">${i}</div>
            <div class="font-display font-bold mb-2" style="color:#faf6ec; font-size:17px;">${t}</div>
            <div style="font-size:13px; color:rgba(250,246,236,.5); line-height:1.65;">${d}</div>
          </div>`).join('')}
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="section" style="background:#faf8f3; text-align:center;">
      <div class="wrap" style="max-width:620px;">
        <h2 class="font-display font-extrabold text-ink mb-4" style="font-size:clamp(28px,5vw,52px); line-height:1.05;">
          Ready to build your credit story?
        </h2>
        <p class="text-[#4a3f30] mb-10" style="font-size:16px; max-width:460px; margin-left:auto; margin-right:auto;">
          Join thousands of Indians who are already building their CreditDNA score. Free forever for individuals.
        </p>
        <button class="btn-primary btn-lg" onclick="window._go('register')">
          Get Your Score Free →
        </button>
      </div>
    </section>

    <!-- FOOTER -->
    <footer style="border-top:1px solid #e8e0d0; padding:28px clamp(16px,4vw,32px); text-align:center;">
      <p style="font-size:13px; color:#8c7d6a;">CreditDNA © 2025 · BOTSQUAD · SRM IST · Chennai</p>
    </footer>

  </div>`;

  // Boot Three.js DNA after DOM is ready
  requestAnimationFrame(() => {
    const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('dna-canvas'));
    if (canvas && window.innerWidth > 768) {
      dnaInstance = initDNA(canvas);
    }
    // Animate progress bar in Ravi demo
    const fill = document.querySelector('.progress-fill');
    if (fill) { fill.style.width = '0'; setTimeout(() => { fill.style.width = '70.6%'; }, 200); }
  });
}
