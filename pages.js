// @ts-check
import { DB } from '../db.js';
import { isAdmin, scoreColor, scoreTier, scorePct, fmtAmt, MOCK_TXN, OCC_LABELS } from '../config.js';
import { toast } from '../toast.js';

/* ══════════════════════════════════════════
   DASHBOARD
══════════════════════════════════════════ */
export function renderDashboard(go) {
  const u = DB.me();
  if (!u) { go('login'); return; }
  const s = u.score, c = scoreColor(s), tier = scoreTier(s), pct = scorePct(s);

  document.getElementById('app').innerHTML = `
  <div class="page-enter" style="padding:28px clamp(16px,4vw,28px) 60px; max-width:1100px; margin:0 auto;">

    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:26px;flex-wrap:wrap;gap:14px;">
      <div>
        <h1 class="font-display font-extrabold text-ink mb-1" style="font-size:clamp(22px,4vw,30px);">
          Hi, ${u.name.split(' ')[0]} ${isAdmin(u)?'👑':'👋'}
        </h1>
        <p style="font-size:14px;color:#8c7d6a;">${u.email}${isAdmin(u)?` · <span style="color:#d4500f;font-weight:600;">Admin</span>`:''}</p>
      </div>
      <div style="display:flex;gap:10px;flex-wrap:wrap;">
        ${isAdmin(u) ? `<a href="admin.html" class="btn-outline btn-sm" style="color:#d4500f;border-color:rgba(212,80,15,.3);">👑 Admin Portal</a>` : ''}
        <button class="btn-primary btn-sm" onclick="window._go('check')">Check Score</button>
      </div>
    </div>

    <!-- Score card -->
    <div class="cdna-card" style="padding:28px;margin-bottom:20px;border-top:3px solid ${c};">
      <div class="score-hero" style="display:flex;gap:28px;align-items:center;flex-wrap:wrap;">
        <div style="text-align:center;flex-shrink:0;">
          <!-- SVG Arc Score -->
          <div style="position:relative;width:160px;height:160px;margin:0 auto;">
            <svg width="160" height="160" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="66" fill="none" stroke="#f5f0e8" stroke-width="10"/>
              <circle cx="80" cy="80" r="66" fill="none" stroke="${c}" stroke-width="10"
                stroke-dasharray="${Math.PI * 2 * 66}"
                stroke-dashoffset="${Math.PI * 2 * 66 * (1 - (s ? pct/100 : 0))}"
                stroke-linecap="round"
                transform="rotate(-90 80 80)"
                style="transition:stroke-dashoffset 1.4s cubic-bezier(.4,0,.2,1);"/>
            </svg>
            <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;">
              <div class="font-display font-extrabold" style="font-size:38px;color:${c};line-height:1;">${s || '?'}</div>
              <div class="badge" style="background:${c}18;color:${c};margin-top:4px;font-size:11px;">${tier}</div>
            </div>
          </div>
          <div style="font-size:11px;font-weight:700;letter-spacing:.1em;color:#8c7d6a;margin-top:10px;">YOUR CREDITDNA SCORE</div>
        </div>
        <div style="flex:1;min-width:200px;">
          ${s ? `
          <div style="display:flex;justify-content:space-between;font-size:12px;color:#8c7d6a;margin-bottom:6px;"><span>300 — Poor</span><span>900 — Excellent</span></div>
          <div class="progress-bar" style="margin-bottom:20px;"><div class="progress-fill" id="db-pfill" style="width:0;background:${c};"></div></div>
          <div class="grid-2" style="gap:12px;">
            ${[['Payment Regularity','94','Excellent'],['Income Stability','81','Good'],['Merchant Diversity','88','Very Good'],['UPI Tenure','76','Good']]
              .map(([lbl,val,tier]) => `
            <div style="background:#faf8f3;border-radius:10px;padding:12px;">
              <div style="font-size:12px;color:#8c7d6a;margin-bottom:4px;">${lbl}</div>
              <div style="display:flex;align-items:baseline;gap:6px;">
                <span class="font-display font-bold" style="font-size:20px;color:${c};">${val}</span>
                <span style="font-size:11px;color:#8c7d6a;">/100</span>
              </div>
            </div>`).join('')}
          </div>` : `
          <div style="text-align:center;padding:40px 0;">
            <div style="font-size:48px;margin-bottom:16px;">🎯</div>
            <h3 class="font-display font-bold text-ink mb-2" style="font-size:20px;">No score yet</h3>
            <p style="color:#8c7d6a;font-size:14px;margin-bottom:20px;">Answer 5 questions to generate your CreditDNA score</p>
            <button class="btn-primary" onclick="window._go('check')">Generate My Score →</button>
          </div>`}
        </div>
      </div>
    </div>

    <!-- Quick stats -->
    <div class="db-grid" style="gap:16px;margin-bottom:20px;">
      <div class="cdna-card" style="padding:22px;">
        <div class="label">Recent Activity</div>
        ${MOCK_TXN.slice(0,4).map(t => `
        <div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid #f5f0e8;">
          <div class="txn-ico" style="background:${t.credit?'#e8f5ef':'#fdecea'};">${t.ico}</div>
          <div style="flex:1;min-width:0;">
            <div style="font-size:13px;font-weight:600;color:#1a1208;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${t.merchant}</div>
            <div style="font-size:12px;color:#8c7d6a;">${t.date}</div>
          </div>
          <div style="font-size:13px;font-weight:700;color:${t.credit?'#0f7e5a':'#c0392b'};flex-shrink:0;">${fmtAmt(t.amt)}</div>
        </div>`).join('')}
        <button class="btn-ghost btn-sm" style="width:100%;margin-top:10px;" onclick="window._go('transactions')">View all →</button>
      </div>

      <div class="cdna-card" style="padding:22px;">
        <div class="label">Improvement Tips</div>
        ${[['🔁','Pay utilities via UPI','Could add +15–25 points'],['📅','Maintain monthly income credits','Boosts stability signal'],['🛍️','Diversify merchant categories','More categories = higher score'],['⏰','Use UPI consistently','Tenure adds significant weight']]
          .map(([i,t,d]) => `
        <div style="display:flex;gap:10px;padding:10px 0;border-bottom:1px solid #f5f0e8;">
          <span style="font-size:18px;flex-shrink:0;">${i}</span>
          <div>
            <div style="font-size:13px;font-weight:600;color:#1a1208;">${t}</div>
            <div style="font-size:12px;color:#0f7e5a;">${d}</div>
          </div>
        </div>`).join('')}
      </div>
    </div>

    <!-- Profile summary -->
    <div class="cdna-card" style="padding:22px;">
      <div class="label">Your Profile</div>
      <div style="display:flex;flex-wrap:wrap;gap:20px;">
        ${[['Occupation',OCC_LABELS[u.occ]||'—'],['UPI App',u.upiApp||'—'],['Monthly Transactions',u.txn||'—'],['Member Since',new Date(u.joined).toLocaleDateString('en-IN',{month:'short',year:'numeric'})]]
          .map(([k,v]) => `
        <div style="min-width:140px;">
          <div style="font-size:12px;color:#8c7d6a;margin-bottom:2px;">${k}</div>
          <div style="font-size:14px;font-weight:600;color:#1a1208;text-transform:capitalize;">${v}</div>
        </div>`).join('')}
      </div>
    </div>
  </div>`;

  // Animate arc and bar
  requestAnimationFrame(() => {
    const fill = document.getElementById('db-pfill');
    if (fill && s) setTimeout(() => { fill.style.width = pct + '%'; }, 150);
  });
}

/* ══════════════════════════════════════════
   CHECK SCORE
══════════════════════════════════════════ */
export function renderCheck(go) {
  const u = DB.me();
  if (!u) { go('login'); return; }

  document.getElementById('app').innerHTML = `
  <div class="page-enter" style="padding:28px clamp(16px,4vw,28px) 60px; max-width:660px; margin:0 auto;">
    <div style="text-align:center;margin-bottom:28px;">
      <span class="label">Score Check</span>
      <h1 class="font-display font-extrabold text-ink mb-3" style="font-size:clamp(24px,5vw,36px);">Generate Your CreditDNA Score</h1>
      <p style="font-size:15px;color:#4a3f30;line-height:1.7;">Answer 5 quick questions about your UPI behaviour. Processed locally — nothing is uploaded.</p>
    </div>
    <div class="cdna-card" style="padding:30px;border-radius:20px;" id="score-form">
      <div style="display:flex;align-items:center;gap:10px;background:#fff0e8;border:1px solid rgba(212,80,15,.3);border-radius:12px;padding:12px 14px;margin-bottom:22px;">
        <span style="font-size:18px;">🔒</span>
        <span style="font-size:13px;color:#4a3f30;">Your answers are processed locally on your device. Nothing is uploaded anywhere.</span>
      </div>
      ${[['q1','How often do you make UPI payments?',
          [['3','Rarely — less than 5/month'],['6','Sometimes — 5 to 20/month'],['8','Regularly — 20 to 50/month'],['10','Very often — 50+ times/month']],'8'],
         ['q2','Do you pay utility bills through UPI?',
          [['3','No, I never do'],['5','Sometimes, but inconsistently'],['8','Yes, most months'],['10','Yes, every single month']],'10'],
         ['q3','How many different merchant categories do you pay?',
          [['3','Only 1–2 types'],['6','About 3–5 types'],['8','Around 6–10 types'],['10','More than 10 different types']],'8'],
         ['q4','How consistent is your monthly income via UPI?',
          [['3','Very irregular, hard to predict'],['6','Somewhat irregular'],['8','Mostly consistent month to month'],['10','Very consistent, similar every month']],'8'],
         ['q5','How long have you been actively using UPI?',
          [['4','Less than 6 months'],['6','6 months to 1 year'],['8','1 to 3 years'],['10','More than 3 years']],'8'],
        ].map(([id,lbl,opts,def]) => `
      <div class="field">
        <label>${lbl}</label>
        <select id="${id}">${opts.map(([v,l]) => `<option value="${v}"${v===def?' selected':''}>${l}</option>`).join('')}</select>
      </div>`).join('')}
      <button class="btn-primary btn-full btn-lg" style="border-radius:12px;margin-top:8px;" onclick="window._calcScore()">Calculate My Score →</button>
    </div>
    <div id="score-result" style="display:none;"></div>
  </div>`;

  window._calcScore = () => {
    const vals = ['q1','q2','q3','q4','q5'].map(id => parseInt(document.getElementById(id).value));
    const avg  = vals.reduce((a,b) => a+b, 0) / vals.length;
    const s    = Math.min(900, Math.max(300, Math.round(300 + (avg/10)*600 + (Math.random()*28-14))));
    const c = scoreColor(s), tier = scoreTier(s), pct = scorePct(s);

    const users = DB.users(), i = users.findIndex(u2 => u2.id === u.id);
    if (i > -1) { users[i].score = s; DB.save(users); DB.setMe(users[i]); }

    document.getElementById('score-form').style.display = 'none';
    const res = document.getElementById('score-result');
    res.style.display = 'block';
    res.innerHTML = `
    <div class="cdna-card page-enter" style="padding:32px;border-radius:20px;text-align:center;border-top:3px solid ${c};">
      <div style="font-size:13px;font-weight:700;letter-spacing:.1em;color:#8c7d6a;margin-bottom:16px;">YOUR CREDITDNA SCORE</div>
      <div class="font-display font-extrabold" style="font-size:88px;color:${c};line-height:1;" id="score-num">—</div>
      <div class="badge" style="background:${c}18;color:${c};margin:12px auto;display:inline-flex;font-size:14px;">${tier}</div>
      <div class="progress-bar" style="margin:20px 0;"><div class="progress-fill" id="res-pfill" style="width:0;background:${c};"></div></div>
      <div style="display:flex;justify-content:space-between;font-size:12px;color:#8c7d6a;margin-bottom:24px;"><span>300</span><span>900</span></div>
      <div class="grid-2" style="gap:12px;margin-bottom:24px;">
        ${[['Payment Regularity',vals[1]*10],['UPI Frequency',vals[0]*10],['Merchant Diversity',vals[2]*10],['Income Consistency',vals[3]*10]]
          .map(([l,v]) => `
        <div style="background:#faf8f3;border-radius:10px;padding:14px;text-align:left;">
          <div style="font-size:12px;color:#8c7d6a;margin-bottom:4px;">${l}</div>
          <div class="font-display font-bold" style="font-size:22px;color:${c};">${v}<span style="font-size:13px;color:#8c7d6a;">/100</span></div>
        </div>`).join('')}
      </div>
      <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
        <button class="btn-primary" onclick="window._go('dashboard')">View Dashboard →</button>
        <button class="btn-outline" onclick="window.location.reload()">Recalculate</button>
      </div>
    </div>`;

    // Animate score number
    let current = 300;
    const target = s;
    const el = document.getElementById('score-num');
    const interval = setInterval(() => {
      current = Math.min(target, current + Math.ceil((target - current) / 8) + 2);
      if (el) el.textContent = current;
      if (current >= target) clearInterval(interval);
    }, 30);

    setTimeout(() => {
      const fill = document.getElementById('res-pfill');
      if (fill) fill.style.width = pct + '%';
    }, 100);

    toast('🎉 Score generated successfully!', 'ok');
  };
}

/* ══════════════════════════════════════════
   TRANSACTIONS
══════════════════════════════════════════ */
export function renderTransactions(go) {
  const u = DB.me();
  if (!u) { go('login'); return; }

  const total  = MOCK_TXN.reduce((a,t) => a + t.amt, 0);
  const income = MOCK_TXN.filter(t=>t.credit).reduce((a,t)=>a+t.amt,0);
  const spend  = MOCK_TXN.filter(t=>!t.credit).reduce((a,t)=>a+Math.abs(t.amt),0);

  document.getElementById('app').innerHTML = `
  <div class="page-enter" style="padding:28px clamp(16px,4vw,28px) 60px; max-width:900px; margin:0 auto;">
    <div style="margin-bottom:24px;">
      <h1 class="font-display font-extrabold text-ink mb-1" style="font-size:clamp(22px,4vw,30px);">UPI Transactions</h1>
      <p style="font-size:14px;color:#8c7d6a;">Demo data — in production, your data stays on-device and is never uploaded.</p>
    </div>

    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:24px;" class="ag">
      ${[['Total Balance',fmtAmt(total),'#d4500f'],['Income',fmtAmt(income),'#0f7e5a'],['Expenses',`−₹${spend.toLocaleString('en-IN')}`,'#c0392b']]
        .map(([l,v,c]) => `
      <div class="cdna-card" style="padding:20px;border-top:3px solid ${c};">
        <div style="font-size:12px;color:#8c7d6a;margin-bottom:6px;">${l}</div>
        <div class="font-display font-bold" style="font-size:24px;color:${c};">${v}</div>
      </div>`).join('')}
    </div>

    <div class="cdna-card" style="overflow:hidden;">
      <div style="padding:18px 20px;border-bottom:1px solid #e8e0d0;font-size:13px;font-weight:700;color:#1a1208;">
        All Transactions (${MOCK_TXN.length})
      </div>
      <div style="overflow-x:auto;">
        <table style="width:100%;border-collapse:collapse;">
          <thead>
            <tr style="background:#faf8f3;">
              <th style="text-align:left;padding:10px 16px;font-size:11px;font-weight:700;letter-spacing:.08em;color:#8c7d6a;">MERCHANT</th>
              <th style="text-align:left;padding:10px 16px;font-size:11px;font-weight:700;letter-spacing:.08em;color:#8c7d6a;">CATEGORY</th>
              <th style="text-align:left;padding:10px 16px;font-size:11px;font-weight:700;letter-spacing:.08em;color:#8c7d6a;">UPI ID</th>
              <th style="text-align:left;padding:10px 16px;font-size:11px;font-weight:700;letter-spacing:.08em;color:#8c7d6a;">DATE</th>
              <th style="text-align:right;padding:10px 16px;font-size:11px;font-weight:700;letter-spacing:.08em;color:#8c7d6a;">AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            ${MOCK_TXN.map(t => `
            <tr style="border-bottom:1px solid #f5f0e8;">
              <td style="padding:12px 16px;">
                <div style="display:flex;align-items:center;gap:10px;">
                  <div class="txn-ico" style="background:${t.credit?'#e8f5ef':'#fdecea'};width:34px;height:34px;font-size:14px;">${t.ico}</div>
                  <div style="font-size:13px;font-weight:600;color:#1a1208;">${t.merchant}</div>
                </div>
              </td>
              <td style="padding:12px 16px;"><span class="badge badge-blue" style="font-size:11px;">${t.cat}</span></td>
              <td style="padding:12px 16px;font-size:12px;color:#8c7d6a;font-family:monospace;">${t.upi}</td>
              <td style="padding:12px 16px;font-size:13px;color:#8c7d6a;">${t.date}</td>
              <td style="padding:12px 16px;text-align:right;font-size:13px;font-weight:700;color:${t.credit?'#0f7e5a':'#c0392b'};">${fmtAmt(t.amt)}</td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  </div>`;
}

/* ══════════════════════════════════════════
   PROFILE
══════════════════════════════════════════ */
export function renderProfile(go) {
  const u = DB.me();
  if (!u) { go('login'); return; }

  document.getElementById('app').innerHTML = `
  <div class="page-enter" style="padding:28px clamp(16px,4vw,28px) 60px; max-width:700px; margin:0 auto;">
    <h1 class="font-display font-extrabold text-ink mb-6" style="font-size:clamp(22px,4vw,28px);">Your Profile</h1>

    <div class="cdna-card" style="padding:28px;margin-bottom:20px;">
      <div style="display:flex;align-items:center;gap:16px;margin-bottom:24px;">
        <div style="width:60px;height:60px;border-radius:16px;background:#fff0e8;border:2px solid rgba(212,80,15,.3);display:flex;align-items:center;justify-content:center;font-family:'Bricolage Grotesque',sans-serif;font-size:24px;font-weight:800;color:#d4500f;">${u.name.charAt(0)}</div>
        <div>
          <div class="font-display font-bold text-ink" style="font-size:20px;">${u.name}</div>
          <div style="font-size:14px;color:#8c7d6a;">${u.email}</div>
          ${isAdmin(u) ? `<span class="badge badge-gold" style="margin-top:4px;">👑 Admin</span>` : ''}
        </div>
      </div>
      <div class="grid-2" style="gap:16px;">
        ${[['Phone',u.phone||'Not provided'],['Occupation',OCC_LABELS[u.occ]||'—'],['Primary UPI App',u.upiApp||'—'],['Monthly Transactions',u.txn||'—'],['Member Since',new Date(u.joined).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})],['Score',u.score||'Not generated yet']]
          .map(([k,v]) => `
        <div style="background:#faf8f3;border-radius:10px;padding:14px;">
          <div style="font-size:12px;color:#8c7d6a;margin-bottom:3px;">${k}</div>
          <div style="font-size:14px;font-weight:600;color:#1a1208;text-transform:capitalize;">${v}</div>
        </div>`).join('')}
      </div>
    </div>

    <div class="cdna-card" style="padding:24px;margin-bottom:20px;">
      <div class="label">Privacy & Data</div>
      <p style="font-size:13px;color:#4a3f30;line-height:1.7;margin-bottom:12px;">
        Raw UPI data is never stored on our servers. Only your score is saved locally in your browser via localStorage.
        Delete your account anytime to remove all data instantly.
      </p>
      <div style="font-size:13px;color:#8c7d6a;">Contact: <span style="color:#d4500f;">privacy@creditdna.in</span></div>
    </div>

    <div style="display:flex;gap:12px;flex-wrap:wrap;">
      <button class="btn-outline" onclick="window._go('dashboard')">← Dashboard</button>
      <button class="btn-danger" onclick="if(confirm('Delete your account and all data?')){window._deleteAccount();}">Delete Account</button>
    </div>
  </div>`;

  window._deleteAccount = () => {
    DB.deleteUser(u.id);
    DB.logout();
    toast('Account deleted. Goodbye!', 'info');
    go('landing');
  };
}

/* ══════════════════════════════════════════
   HOW IT WORKS
══════════════════════════════════════════ */
export function renderHow(go) {
  document.getElementById('app').innerHTML = `
  <div class="page-enter section" style="max-width:900px; margin:0 auto; padding-left:clamp(16px,4vw,32px); padding-right:clamp(16px,4vw,32px);">
    <div style="text-align:center;margin-bottom:56px;">
      <span class="label">Methodology</span>
      <h1 class="font-display font-extrabold text-ink mb-4" style="font-size:clamp(26px,5vw,44px);">How CreditDNA Works</h1>
      <p style="font-size:16px;color:#4a3f30;max-width:580px;margin:0 auto;line-height:1.75;">
        A complete walkthrough of how we turn UPI transaction history into a fair, explainable, privacy-first credit score.
      </p>
    </div>

    ${[['01','#d4500f','Consent & Collection','Your data stays on your device',
        'You explicitly consent to CreditDNA reading your UPI history. Everything loads into an on-device pipeline — DPDP Act compliant. Raw data is never uploaded to any server, by any pathway.',
        ['User explicitly consents — revocable anytime','All computation is on-device only','No third-party data sharing','RBI guidelines followed']],
       ['02','#0f7e5a','Feature Engineering','50+ signals extracted locally',
        'The on-device pipeline extracts 50+ behavioural signals from your raw transactions: payment frequency, merchant diversity, income regularity, utility payment habits, spending patterns and more.',
        ['Transaction frequency signals','Income & salary detection','Merchant category diversity','Bill payment regularity']],
       ['03','#1d5fa8','ML Scoring Engine','Lightweight model, powerful output',
        'A compressed machine learning model converts your behavioural signals into a score between 300 and 900. The model runs entirely in-browser using JavaScript — no network call required.',
        ['Trained on synthetic UPI data','300–900 output range','Bias-tested across occupations','Plain-English factor explanations']],
       ['04','#b45309','Bank API Integration','Banks see the score. Never the data.',
        'When you apply for a loan, the lender calls our REST API with your consent token. They receive your score, tier, and top factors. Raw transaction data transmission is architecturally impossible.',
        ['POST /api/score — simple REST call','Input: consent token only','Output: score + tier + top 3 factors','Zero raw transactions ever transmitted']],
      ].map(([num,c,t,sub,desc,bullets]) => `
    <div class="cdna-card" style="padding:32px;margin-bottom:24px;border-left:4px solid ${c};">
      <div style="display:flex;gap:24px;align-items:flex-start;flex-wrap:wrap;">
        <div class="font-display font-extrabold" style="font-size:48px;color:${c};opacity:.18;flex-shrink:0;line-height:1;">${num}</div>
        <div style="flex:1;min-width:240px;">
          <div style="font-size:11px;font-weight:700;letter-spacing:.1em;color:${c};margin-bottom:6px;text-transform:uppercase;">${sub}</div>
          <h3 class="font-display font-bold text-ink mb-3" style="font-size:22px;">${t}</h3>
          <p style="font-size:14px;color:#4a3f30;line-height:1.7;margin-bottom:16px;">${desc}</p>
          <div class="grid-2" style="gap:8px;">
            ${bullets.map(b => `<div style="display:flex;gap:8px;align-items:flex-start;font-size:13px;color:#4a3f30;"><span style="color:${c};font-weight:700;flex-shrink:0;">✓</span>${b}</div>`).join('')}
          </div>
        </div>
      </div>
    </div>`).join('')}
  </div>`;
}

/* ══════════════════════════════════════════
   PRICING
══════════════════════════════════════════ */
export function renderPricing(go) {
  document.getElementById('app').innerHTML = `
  <div class="page-enter section" style="max-width:1000px; margin:0 auto; padding-left:clamp(16px,4vw,32px); padding-right:clamp(16px,4vw,32px);">
    <div style="text-align:center;margin-bottom:56px;">
      <span class="label">For Banks & NBFCs</span>
      <h1 class="font-display font-extrabold text-ink mb-4" style="font-size:clamp(26px,5vw,44px);">Simple, transparent pricing</h1>
      <p style="font-size:16px;color:#4a3f30;max-width:480px;margin:0 auto;">
        Pay only for what you use. No setup fees, no hidden costs. Start scoring in minutes.
      </p>
    </div>

    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:20px;margin-bottom:56px;">
      ${[['Starter','₹2','per API call','Up to 5,000/month','#8c7d6a',['Full score + tier','Top 3 factors','99.5% uptime SLA','Email support'],false],
         ['Growth','₹1.50','per API call','5K–50K/month','#d4500f',['Everything in Starter','Webhook callbacks','Analytics dashboard','Priority support'],true],
         ['Enterprise','Custom','pricing','100K+/month','#0f7e5a',['Everything in Growth','Custom SLA agreement','White-label option','AA framework integration','On-premise deployment','Direct team access'],false],
        ].map(([name,price,unit,vol,c,features,popular]) => `
      <div class="cdna-card ${popular?'plan-popular':''}" style="padding:32px;border-top:3px solid ${c};${popular?'transform:scale(1.02);':''}">
        <div style="margin-bottom:24px;">
          <div style="font-size:13px;font-weight:700;color:${c};letter-spacing:.06em;margin-bottom:8px;text-transform:uppercase;">${name}</div>
          <div style="display:flex;align-items:baseline;gap:4px;">
            <span class="font-display font-extrabold text-ink" style="font-size:36px;">${price}</span>
            <span style="font-size:14px;color:#8c7d6a;">${unit}</span>
          </div>
          <div style="font-size:13px;color:#8c7d6a;margin-top:4px;">${vol}</div>
        </div>
        <div style="margin-bottom:24px;">
          ${features.map(f => `
          <div style="display:flex;gap:8px;align-items:flex-start;padding:7px 0;border-bottom:1px solid #f5f0e8;font-size:13px;color:#4a3f30;">
            <span style="color:${c};font-weight:700;">✓</span>${f}
          </div>`).join('')}
        </div>
        <button class="btn-${popular?'primary':'outline'} btn-full" onclick="window._go('register')">Get Started →</button>
      </div>`).join('')}
    </div>

    <div class="cdna-card" style="padding:32px;text-align:center;">
      <h3 class="font-display font-bold text-ink mb-3" style="font-size:22px;">API Reference</h3>
      <p style="font-size:14px;color:#4a3f30;margin-bottom:20px;">Simple REST call. Integrate in minutes.</p>
      <div style="background:#1a1208;border-radius:12px;padding:20px;text-align:left;font-family:monospace;font-size:13px;color:#22c55e;overflow-x:auto;">
        <div style="color:#8c7d6a;margin-bottom:8px;">// Request</div>
        <div>POST /api/score HTTP/1.1</div>
        <div>Authorization: Bearer YOUR_API_KEY</div>
        <div>Content-Type: application/json</div>
        <br>
        <div>{"consent_token": "cdna_ct_abc123"}</div>
        <br>
        <div style="color:#8c7d6a;margin-bottom:8px;">// Response</div>
        <div>{</div>
        <div>&nbsp;&nbsp;"score": 724,</div>
        <div>&nbsp;&nbsp;"tier": "Good",</div>
        <div>&nbsp;&nbsp;"top_factors": ["payment_regularity","income_stability","merchant_diversity"],</div>
        <div>&nbsp;&nbsp;"generated_at": "2025-03-17T10:30:00Z"</div>
        <div>}</div>
      </div>
    </div>
  </div>`;
}
