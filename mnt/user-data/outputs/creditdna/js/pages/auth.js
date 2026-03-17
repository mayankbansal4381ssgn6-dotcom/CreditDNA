// @ts-check
import { doLogin, doRegister } from '../auth.js';
import { isAdmin } from '../config.js';
import { toast } from '../toast.js';

/** @type {'login'|'register'} */
let authTab = 'login';
let RS = 1;
let RD = {};

/**
 * @param {Function} go
 * @param {'login'|'register'} [tab]
 */
export function renderLogin(go, tab = 'login') {
  authTab = tab; RS = 1; RD = {};
  _renderAuth(go);
}

export function renderRegister(go) {
  authTab = 'register'; RS = 1; RD = {};
  _renderAuth(go);
}

function _renderAuth(go) {
  document.getElementById('app').innerHTML = `
  <div class="auth-page page-enter">
    <div class="auth-left">
      <div>
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:40px;">
          <div class="auth-logo-mark" style="width:38px;height:38px;border-radius:9px;background:#0a2a0a;border:1.5px solid rgba(34,197,94,.3);background-image:url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 36 36%22%3E%3Cg stroke=%2222c55e%22 stroke-width=%221.8%22 stroke-linecap=%22round%22%3E%3Cline x1=%229%22 y1=%2212%22 x2=%2227%22 y2=%2212%22/%3E%3Cline x1=%229%22 y1=%2212%22 x2=%229%22 y2=%2216%22/%3E%3Cline x1=%2227%22 y1=%2212%22 x2=%2227%22 y2=%2216%22/%3E%3Cline x1=%229%22 y1=%2216%22 x2=%2227%22 y2=%2216%22 opacity=%22.85%22/%3E%3Cline x1=%229%22 y1=%2216%22 x2=%229%22 y2=%2220%22/%3E%3Cline x1=%2227%22 y1=%2216%22 x2=%2227%22 y2=%2220%22/%3E%3Cline x1=%229%22 y1=%2220%22 x2=%2227%22 y2=%2220%22 opacity=%22.65%22/%3E%3Cline x1=%229%22 y1=%2220%22 x2=%229%22 y2=%2224%22/%3E%3Cline x1=%2227%22 y1=%2220%22 x2=%2227%22 y2=%2224%22/%3E%3Cline x1=%229%22 y1=%2224%22 x2=%2227%22 y2=%2224%22 opacity=%22.45%22/%3E%3C/g%3E%3C/svg%3E');background-repeat:no-repeat;background-position:center;background-size:28px;flex-shrink:0;"></div>
          <div>
            <div class="font-display font-extrabold text-[#22c55e]" style="font-size:20px;letter-spacing:-.01em;">CreditDNA</div>
            <div style="font-size:8px;font-weight:700;letter-spacing:.18em;color:#22c55e;opacity:.5;margin-top:1px;">YOUR CREDIT. YOUR DATA.</div>
          </div>
        </div>
        <h2 class="font-display font-extrabold mb-4" style="font-size:clamp(28px,3.5vw,40px);color:#faf6ec;line-height:1.1;letter-spacing:-.02em;">
          Credit for everyone<br>who uses UPI
        </h2>
        <p style="font-size:15px;color:rgba(250,246,236,.55);line-height:1.75;margin-bottom:36px;">
          Your UPI transaction history is rich financial data. We turn it into a 300–900 score — processed on your device, never shared raw.
        </p>
        ${[['🔒','Privacy first','Raw data never leaves your phone. Ever.'],
           ['⚡','Instant results','Score generated in under 200ms.'],
           ['🧬','50+ signals','More accurate than a single CIBIL number.']].map(([i,t,d]) => `
        <div style="display:flex;gap:13px;margin-bottom:18px;">
          <div style="width:38px;height:38px;border-radius:10px;background:rgba(250,246,236,.08);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:18px;">${i}</div>
          <div><div style="font-size:14px;font-weight:700;color:#faf6ec;margin-bottom:2px;">${t}</div><div style="font-size:13px;color:rgba(250,246,236,.45);">${d}</div></div>
        </div>`).join('')}
      </div>
      <div style="font-size:12px;color:rgba(250,246,236,.2);margin-top:24px;">BOTSQUAD · SRM IST · Chennai · © 2025</div>
    </div>

    <div class="auth-right" style="max-width:500px;width:100%;">
      <div style="max-width:420px;width:100%;margin:0 auto;" class="page-enter">
        <h1 class="font-display font-extrabold text-ink mb-2" style="font-size:clamp(22px,4vw,28px);letter-spacing:-.02em;">
          ${authTab === 'login' ? 'Welcome back 👋' : 'Create your account'}
        </h1>
        <p style="font-size:14px;color:#8c7d6a;margin-bottom:24px;">
          ${authTab === 'login' ? 'Sign in to your CreditDNA account' : 'Free for individuals · Takes 2 minutes'}
        </p>

        <div class="auth-tabs">
          <button class="auth-tab${authTab === 'login' ? ' active' : ''}" onclick="window._authSwitch('login')">Sign In</button>
          <button class="auth-tab${authTab === 'register' ? ' active' : ''}" onclick="window._authSwitch('register')">Create Account</button>
        </div>

        <div id="auth-form"></div>

        <p style="text-align:center;margin-top:18px;font-size:13px;color:#8c7d6a;">
          ${authTab === 'login'
            ? `Don't have an account? <span style="color:#d4500f;cursor:pointer;font-weight:600" onclick="window._authSwitch('register')">Sign up free</span>`
            : `Already registered? <span style="color:#d4500f;cursor:pointer;font-weight:600" onclick="window._authSwitch('login')">Sign in</span>`}
        </p>
      </div>
    </div>
  </div>`;

  window._authSwitch = (tab) => { authTab = tab; RS = 1; RD = {}; _renderAuth(go); };
  window._authGo = go;
  _renderAuthForm(go);
}

function _renderAuthForm(go) {
  document.querySelectorAll('.auth-tab').forEach((el, i) => {
    el.classList.toggle('active', (i === 0 && authTab === 'login') || (i === 1 && authTab === 'register'));
  });
  const wrap = document.getElementById('auth-form');
  if (!wrap) return;
  if (authTab === 'login') _renderLoginForm(wrap, go);
  else _renderRegisterStep(wrap, go);
}

function _renderLoginForm(wrap, go) {
  wrap.innerHTML = `
    <div id="lerr"></div>
    <div class="field"><label>Email Address</label>
      <div class="input-wrap has-icon"><span class="ico ico-mail"></span>
        <input id="l-email" type="email" placeholder="you@email.com" autocomplete="email">
      </div>
    </div>
    <div class="field"><label>Password</label>
      <div class="input-wrap has-icon"><span class="ico ico-lock"></span>
        <input id="l-pass" type="password" placeholder="Your password" autocomplete="current-password"
          onkeydown="if(event.key==='Enter')window._loginSubmit()">
      </div>
    </div>
    <button class="btn-primary btn-full btn-lg" style="margin-top:8px;border-radius:12px;" onclick="window._loginSubmit()">Sign In →</button>`;

  window._loginSubmit = () => {
    const email = document.getElementById('l-email').value.trim();
    const pass  = document.getElementById('l-pass').value;
    const err   = document.getElementById('lerr');
    if (!email || !pass) { err.innerHTML = '<div class="msg-err">Please fill in all fields</div>'; return; }
    const user = doLogin(email, pass);
    if (!user) { err.innerHTML = '<div class="msg-err">Incorrect email or password</div>'; return; }
    toast(`Welcome back, ${user.name.split(' ')[0]}! 👋`, 'ok');
    if (isAdmin(user)) {
      // Show admin portal prompt
      err.innerHTML = `<div class="msg-ok">✅ Signed in! You have admin access — <a href="admin.html" style="color:#0f7e5a;font-weight:700;text-decoration:underline;">Open Admin Portal</a> or continue to dashboard.</div>`;
      setTimeout(() => go('dashboard'), 2500);
    } else {
      go('dashboard');
    }
  };
}

function _renderRegisterStep(wrap, go) {
  const steps = ['Your Info', 'About You', 'Consent'];
  const dotRow = steps.map((s, i) => `
    <div style="display:flex;align-items:center;flex:1;">
      <div class="step-dot" style="background:${i+1<=RS?'#d4500f':'#faf8f3'};color:${i+1<=RS?'#fff':'#8c7d6a'};border:2px solid ${i+1<=RS?'#d4500f':'#e8e0d0'};box-shadow:${i+1===RS?'0 0 0 3px rgba(212,80,15,.15)':'none'};">
        ${i+1 <= RS && RS > i+1 ? '✓' : i+1}
      </div>
      ${i < 2 ? `<div class="step-line" style="background:${i+1<RS?'#d4500f':'#e8e0d0'};"></div>` : ''}
    </div>`).join('');

  let fields = '';

  if (RS === 1) fields = `
    <div class="field"><label>Full Name *</label>
      <div class="input-wrap has-icon"><span class="ico ico-user"></span>
        <input id="r-name" value="${RD.name||''}" placeholder="e.g. Ravi Kumar" autocomplete="name">
      </div>
    </div>
    <div class="field"><label>Email Address *</label>
      <div class="input-wrap has-icon"><span class="ico ico-mail"></span>
        <input id="r-email" type="email" value="${RD.email||''}" placeholder="you@email.com" autocomplete="email">
      </div>
    </div>
    <div class="field"><label>Password *</label>
      <div class="input-wrap has-icon"><span class="ico ico-lock"></span>
        <input id="r-pass" type="password" value="${RD.pass||''}" placeholder="At least 6 characters" autocomplete="new-password">
      </div>
    </div>
    <div class="field"><label>Confirm Password *</label>
      <div class="input-wrap has-icon"><span class="ico ico-lock"></span>
        <input id="r-conf" type="password" value="${RD.conf||''}" placeholder="Repeat password" autocomplete="new-password">
      </div>
    </div>`;

  else if (RS === 2) fields = `
    <div class="field"><label>Phone Number</label>
      <div class="input-wrap has-icon"><span class="ico ico-phone"></span>
        <input id="r-phone" type="tel" value="${RD.phone||''}" placeholder="+91 00000 00000" autocomplete="tel">
      </div>
    </div>
    <div class="field"><label>Occupation *</label>
      <select id="r-occ">
        <option value="">Select your occupation</option>
        ${[['gig','Gig Worker (Swiggy, Zomato, Ola)'],['farmer','Farmer / Agricultural Worker'],['student','Student'],
           ['sme','Small Business / SME Owner'],['daily','Daily Wage Worker'],['freelance','Freelancer / Self-Employed'],
           ['salaried','Salaried Employee'],['other','Other']]
          .map(([v,l]) => `<option value="${v}"${RD.occ===v?' selected':''}>${l}</option>`).join('')}
      </select>
    </div>
    <div class="field"><label>Monthly UPI Transactions</label>
      <select id="r-txn">
        <option value="low">Less than 10/month</option>
        <option value="med"${!RD.txn||RD.txn==='med'?' selected':''}>10–50/month</option>
        <option value="high"${RD.txn==='high'?' selected':''}>50–100/month</option>
        <option value="vhigh"${RD.txn==='vhigh'?' selected':''}>100+/month</option>
      </select>
    </div>`;

  else fields = `
    <div class="field"><label>Primary UPI App</label>
      <select id="r-upi">
        ${[['gpay','Google Pay'],['phonepe','PhonePe'],['paytm','Paytm'],['bhim','BHIM UPI'],['other','Other']]
          .map(([v,l]) => `<option value="${v}">${l}</option>`).join('')}
      </select>
    </div>
    <div style="background:#fff0e8;border:1.5px solid rgba(212,80,15,.3);border-radius:12px;padding:16px;margin-bottom:16px;">
      <div style="font-size:12px;font-weight:700;letter-spacing:.08em;color:#d4500f;margin-bottom:10px;">OUR PRIVACY COMMITMENT</div>
      <div style="font-size:13px;color:#4a3f30;line-height:1.8;">
        ✅ Raw UPI data <strong>never uploaded</strong> anywhere<br>
        ✅ All scoring runs <strong>on your device</strong><br>
        ✅ Banks receive <strong>your score only</strong> — not your transactions<br>
        ✅ Delete your account and data at any time
      </div>
    </div>
    <label style="display:flex;align-items:flex-start;gap:10px;cursor:pointer;">
      <input type="checkbox" id="r-consent" style="margin-top:3px;">
      <span style="font-size:13px;color:#4a3f30;line-height:1.6;">
        I agree to CreditDNA's <span style="color:#d4500f;">Privacy Policy</span> and consent to on-device processing of my UPI transaction history.
      </span>
    </label>`;

  wrap.innerHTML = `
    <div style="display:flex;align-items:center;gap:0;margin-bottom:6px;">${dotRow}</div>
    <p style="font-size:11px;font-weight:700;letter-spacing:.1em;color:#8c7d6a;margin-bottom:18px;text-align:center;">STEP ${RS} OF 3 — ${steps[RS-1].toUpperCase()}</p>
    <div id="rerr"></div>${fields}
    <div style="display:flex;gap:10px;margin-top:18px;">
      ${RS > 1 ? `<button class="btn-outline" style="flex:1;" onclick="window._rBack()">← Back</button>` : ''}
      <button class="btn-primary" style="flex:2;border-radius:12px;padding:13px;font-size:15px;" onclick="window._rNext()">
        ${RS < 3 ? 'Continue →' : 'Create Account →'}
      </button>
    </div>`;

  window._rBack = () => { RS--; _renderRegisterStep(document.getElementById('auth-form'), go); };
  window._rNext = () => _validateStep(wrap, go);
}

function _validateStep(wrap, go) {
  const err = document.getElementById('rerr');

  if (RS === 1) {
    const n = document.getElementById('r-name').value.trim();
    const e = document.getElementById('r-email').value.trim();
    const p = document.getElementById('r-pass').value;
    const c = document.getElementById('r-conf').value;
    if (!n||!e||!p||!c) { err.innerHTML = '<div class="msg-err">Please fill in all fields</div>'; return; }
    if (p.length < 6) { err.innerHTML = '<div class="msg-err">Password must be at least 6 characters</div>'; return; }
    if (p !== c) { err.innerHTML = '<div class="msg-err">Passwords don\'t match</div>'; return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) { err.innerHTML = '<div class="msg-err">Please enter a valid email</div>'; return; }
    Object.assign(RD, { name:n, email:e, pass:p, conf:c }); RS++; _renderRegisterStep(wrap, go);

  } else if (RS === 2) {
    const o = document.getElementById('r-occ').value;
    if (!o) { err.innerHTML = '<div class="msg-err">Please select your occupation</div>'; return; }
    Object.assign(RD, { phone: document.getElementById('r-phone').value.trim(), occ:o, txn: document.getElementById('r-txn').value });
    RS++; _renderRegisterStep(wrap, go);

  } else {
    if (!document.getElementById('r-consent').checked) {
      err.innerHTML = '<div class="msg-err">Please accept the privacy policy to continue</div>'; return;
    }
    Object.assign(RD, { upiApp: document.getElementById('r-upi').value, password: RD.pass });
    const user = doRegister(RD);
    if (!user) return;
    if (isAdmin(user)) {
      err.innerHTML = `<div class="msg-ok">✅ Admin account created! <a href="admin.html" style="color:#0f7e5a;font-weight:700;text-decoration:underline;">Open Admin Portal</a></div>`;
      setTimeout(() => go('dashboard'), 2500);
    } else {
      go('dashboard');
    }
  }
}
