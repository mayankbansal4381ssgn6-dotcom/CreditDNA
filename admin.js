// @ts-check
/**
 * @fileoverview CreditDNA Admin Portal
 * Separate page (admin.html) — dark green theme
 * Admin must verify their key + be in the ADMIN_EMAILS list
 */

import { DB } from './db.js';
import { ADMIN_EMAILS, ADMIN_KEY, scoreColor, scoreTier, OCC_LABELS } from './config.js';

/* ── State ────────────────────────── */
let adminUser = null;
let activeTab = 'overview';

/* ── Helpers ──────────────────────── */
const app = () => document.getElementById('admin-app');

function aToast(msg, type = 'ok') {
  const el = document.getElementById('admin-toast');
  if (!el) return;
  const colors = { ok: '#22c55e', err: '#ef4444', info: '#60a5fa' };
  const item = document.createElement('div');
  item.style.cssText = `background:#141f14;border:1px solid ${colors[type]}40;color:${colors[type]};padding:10px 20px;border-radius:999px;font-size:13px;font-weight:600;margin-bottom:8px;box-shadow:0 4px 20px rgba(0,0,0,.4);`;
  item.textContent = msg;
  el.appendChild(item);
  setTimeout(() => { item.style.opacity='0'; item.style.transition='opacity .3s'; setTimeout(()=>item.remove(),300); }, 3000);
}

/* ══════════════════════════════════════
   LOGIN GATE
══════════════════════════════════════ */
function renderAdminLogin() {
  app().innerHTML = `
  <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;">
    <div style="width:100%;max-width:420px;" class="fade-up">

      <!-- Logo -->
      <div style="text-align:center;margin-bottom:40px;">
        <div style="display:inline-flex;align-items:center;gap:12px;margin-bottom:12px;">
          <div style="width:48px;height:48px;border-radius:12px;background:#0a2a0a;border:1.5px solid rgba(34,197,94,.3);display:flex;align-items:center;justify-content:center;">
            <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
              <g stroke="#22c55e" stroke-width="1.8" stroke-linecap="round">
                <line x1="9" y1="12" x2="27" y2="12"/>
                <line x1="9" y1="12" x2="9" y2="16"/><line x1="27" y1="12" x2="27" y2="16"/>
                <line x1="9" y1="16" x2="27" y2="16" opacity=".85"/>
                <line x1="9" y1="16" x2="9" y2="20"/><line x1="27" y1="16" x2="27" y2="20"/>
                <line x1="9" y1="20" x2="27" y2="20" opacity=".65"/>
                <line x1="9" y1="20" x2="9" y2="24"/><line x1="27" y1="20" x2="27" y2="24"/>
                <line x1="9" y1="24" x2="27" y2="24" opacity=".45"/>
              </g>
            </svg>
          </div>
          <div>
            <div style="font-family:'Bricolage Grotesque',sans-serif;font-size:22px;font-weight:800;color:#22c55e;letter-spacing:-.01em;">CreditDNA</div>
            <div style="font-size:8px;font-weight:700;letter-spacing:.2em;color:#22c55e;opacity:.4;">ADMIN PORTAL</div>
          </div>
        </div>
        <div style="display:flex;align-items:center;justify-content:center;gap:8px;">
          <div class="glow-dot"></div>
          <span style="font-size:12px;color:#5a7a5a;font-weight:600;">Restricted Access · Team Only</span>
        </div>
      </div>

      <!-- Login card -->
      <div class="a-card" style="padding:32px;position:relative;overflow:hidden;">
        <div class="scan-line"></div>
        <h2 style="font-family:'Bricolage Grotesque',sans-serif;font-size:22px;font-weight:800;color:#e2f5e2;margin-bottom:6px;">Admin Sign In</h2>
        <p style="font-size:13px;color:#5a7a5a;margin-bottom:24px;">Your email must be on the admin whitelist</p>

        <div id="a-err"></div>

        <div style="margin-bottom:14px;">
          <label style="display:block;font-size:12px;font-weight:600;color:#9dc49d;margin-bottom:6px;">Admin Email</label>
          <input class="a-input" id="a-email" type="email" placeholder="you@creditdna.in" autocomplete="email">
        </div>
        <div style="margin-bottom:14px;">
          <label style="display:block;font-size:12px;font-weight:600;color:#9dc49d;margin-bottom:6px;">Password</label>
          <input class="a-input" id="a-pass" type="password" placeholder="Your account password"
            onkeydown="if(event.key==='Enter')document.getElementById('a-login-btn').click()">
        </div>
        <div style="margin-bottom:24px;">
          <label style="display:block;font-size:12px;font-weight:600;color:#9dc49d;margin-bottom:6px;">
            Admin Key
            <span style="font-size:11px;color:#5a7a5a;font-weight:400;margin-left:4px;">(provided by team lead)</span>
          </label>
          <input class="a-input" id="a-key" type="password" placeholder="••••••••"
            onkeydown="if(event.key==='Enter')document.getElementById('a-login-btn').click()">
        </div>

        <button class="a-btn" id="a-login-btn" onclick="window._adminLogin()">
          Access Admin Portal →
        </button>

        <div style="text-align:center;margin-top:20px;">
          <a href="index.html" style="font-size:13px;color:#5a7a5a;text-decoration:none;">
            ← Back to CreditDNA
          </a>
        </div>
      </div>

      <p style="text-align:center;font-size:12px;color:#2d3d2d;margin-top:20px;">
        Not an admin? <a href="index.html" style="color:#22c55e;text-decoration:none;">Return to app</a>
      </p>
    </div>
  </div>`;

  window._adminLogin = () => {
    const email = document.getElementById('a-email').value.trim().toLowerCase();
    const pass  = document.getElementById('a-pass').value;
    const key   = document.getElementById('a-key').value.trim();
    const errEl = document.getElementById('a-err');

    if (!email || !pass || !key) {
      errEl.innerHTML = '<div style="background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.3);color:#ef4444;border-radius:10px;padding:10px 14px;font-size:13px;margin-bottom:14px;">Please fill in all fields</div>';
      return;
    }

    // 1. Check admin email whitelist
    if (!ADMIN_EMAILS.includes(email)) {
      errEl.innerHTML = '<div style="background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.3);color:#ef4444;border-radius:10px;padding:10px 14px;font-size:13px;margin-bottom:14px;">❌ This email is not on the admin whitelist</div>';
      return;
    }

    // 2. Check admin key
    if (key !== ADMIN_KEY) {
      errEl.innerHTML = '<div style="background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.3);color:#ef4444;border-radius:10px;padding:10px 14px;font-size:13px;margin-bottom:14px;">❌ Invalid admin key</div>';
      return;
    }

    // 3. Find user account — or allow access without a registered account (team lead)
    const user = DB.findByEmail(email);
    if (user) {
      if (user.password !== pass) {
        errEl.innerHTML = '<div style="background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.3);color:#ef4444;border-radius:10px;padding:10px 14px;font-size:13px;margin-bottom:14px;">❌ Incorrect password</div>';
        return;
      }
      adminUser = user;
    } else {
      // No registered account yet — allow with just the admin key (for first-time setup)
      adminUser = { id: -1, name: email.split('@')[0], email, isAdmin: true };
    }

    aToast('✅ Access granted — welcome to the Admin Portal', 'ok');
    renderAdminDashboard();
  };
}

/* ══════════════════════════════════════
   ADMIN DASHBOARD
══════════════════════════════════════ */
function renderAdminDashboard() {
  const users   = DB.users();
  const total   = users.length;
  const scored  = users.filter(u => u.score).length;
  const admins  = users.filter(u => u.isAdmin).length;
  const avg     = scored ? Math.round(users.filter(u=>u.score).reduce((a,u)=>a+u.score,0)/scored) : 0;
  const today   = users.filter(u => {
    const d = new Date(u.joined), n = new Date();
    return d.toDateString() === n.toDateString();
  }).length;

  const occCount = {};
  users.forEach(u => {
    if (u.occ) occCount[u.occ] = (occCount[u.occ] || 0) + 1;
  });
  const topOcc = Object.entries(occCount).sort((a,b)=>b[1]-a[1]).slice(0,3);

  app().innerHTML = `
  <div style="min-height:100vh;">
    <!-- Top nav -->
    <nav style="height:64px;display:flex;align-items:center;justify-content:space-between;padding:0 clamp(16px,4vw,32px);border-bottom:1px solid rgba(34,197,94,.12);background:rgba(10,15,10,.97);position:sticky;top:0;z-index:50;backdrop-filter:blur(12px);">
      <div style="display:flex;align-items:center;gap:12px;">
        <svg width="30" height="30" viewBox="0 0 36 36" fill="none">
          <rect width="36" height="36" rx="8" fill="#0a2a0a"/>
          <g stroke="#22c55e" stroke-width="1.8" stroke-linecap="round">
            <line x1="9" y1="12" x2="27" y2="12"/>
            <line x1="9" y1="12" x2="9" y2="16"/><line x1="27" y1="12" x2="27" y2="16"/>
            <line x1="9" y1="16" x2="27" y2="16" opacity=".85"/>
            <line x1="9" y1="16" x2="9" y2="20"/><line x1="27" y1="16" x2="27" y2="20"/>
            <line x1="9" y1="20" x2="27" y2="20" opacity=".65"/>
            <line x1="9" y1="20" x2="9" y2="24"/><line x1="27" y1="20" x2="27" y2="24"/>
            <line x1="9" y1="24" x2="27" y2="24" opacity=".45"/>
          </g>
        </svg>
        <div>
          <div style="font-family:'Bricolage Grotesque',sans-serif;font-size:15px;font-weight:800;color:#22c55e;">CreditDNA</div>
          <div style="font-size:9px;font-weight:700;letter-spacing:.18em;color:#22c55e;opacity:.4;">ADMIN PORTAL</div>
        </div>
        <div style="width:1px;height:28px;background:rgba(34,197,94,.15);margin:0 8px;"></div>
        <div style="display:flex;align-items:center;gap:6px;">
          <div class="glow-dot" style="width:6px;height:6px;"></div>
          <span style="font-size:12px;color:#5a7a5a;font-family:'JetBrains Mono',monospace;">LIVE</span>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:12px;">
        <div style="text-align:right;">
          <div style="font-size:13px;font-weight:600;color:#9dc49d;">${adminUser.name}</div>
          <div style="font-size:11px;color:#5a7a5a;">${adminUser.email}</div>
        </div>
        <a href="index.html" style="background:#141f14;border:1px solid rgba(34,197,94,.2);color:#9dc49d;padding:8px 14px;border-radius:8px;font-size:12px;font-weight:600;text-decoration:none;transition:all .2s;">← App</a>
        <button onclick="window._adminLogout()" style="background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.25);color:#ef4444;padding:8px 14px;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;">Sign Out</button>
      </div>
    </nav>

    <!-- Content -->
    <div style="max-width:1200px;margin:0 auto;padding:28px clamp(16px,4vw,28px) 60px;">

      <div style="margin-bottom:28px;">
        <div style="font-size:11px;font-weight:700;letter-spacing:.12em;color:#5a7a5a;text-transform:uppercase;margin-bottom:6px;">Admin Portal · Restricted</div>
        <h1 style="font-family:'Bricolage Grotesque',sans-serif;font-size:clamp(22px,4vw,32px);font-weight:800;color:#e2f5e2;margin-bottom:4px;">CreditDNA Dashboard</h1>
        <p style="font-size:14px;color:#5a7a5a;">Signed in as ${adminUser.name} · ${new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long'})}</p>
      </div>

      <!-- Stats -->
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px;margin-bottom:28px;">
        ${[['👥','Total Users',total,'#22c55e'],['🎯','Scored',scored,'#60a5fa'],['📊','Avg Score',avg||'—','#f59e0b'],['🆕','Today',today,'#a78bfa'],['👑','Admins',admins,'#22c55e']].map(([i,l,v,c]) => `
        <div class="a-stat">
          <div style="font-size:22px;margin-bottom:8px;">${i}</div>
          <div style="font-size:11px;color:#5a7a5a;font-weight:600;letter-spacing:.08em;text-transform:uppercase;margin-bottom:4px;">${l}</div>
          <div style="font-family:'Bricolage Grotesque',sans-serif;font-size:32px;font-weight:800;color:${c};">${v}</div>
        </div>`).join('')}
      </div>

      <!-- Tab nav -->
      <div style="display:flex;gap:4px;background:#0f1a0f;border-radius:10px;padding:4px;margin-bottom:24px;border:1px solid rgba(34,197,94,.1);overflow-x:auto;">
        ${[['overview','📊 Overview'],['users','👥 Users'],['scores','🎯 Scores'],['settings','⚙️ Settings']].map(([id,lbl]) => `
        <button onclick="window._adminTab('${id}')"
          id="tab-${id}"
          style="flex:1;padding:9px 16px;border-radius:7px;font-size:13px;font-weight:600;border:none;cursor:pointer;font-family:inherit;white-space:nowrap;min-width:fit-content;
          background:${activeTab===id?'#141f14':'transparent'};
          color:${activeTab===id?'#22c55e':'#5a7a5a'};
          box-shadow:${activeTab===id?'0 1px 4px rgba(0,0,0,.4)':'none'};
          transition:all .2s;">${lbl}</button>`).join('')}
      </div>

      <!-- Tab content -->
      <div id="admin-tab-content"></div>
    </div>
  </div>`;

  window._adminLogout = () => { adminUser = null; renderAdminLogin(); };
  window._adminTab = (tab) => { activeTab = tab; renderAdminTab(tab); };
  renderAdminTab(activeTab);
}

function renderAdminTab(tab) {
  const el = document.getElementById('admin-tab-content');
  if (!el) return;

  // Update tab buttons
  ['overview','users','scores','settings'].forEach(id => {
    const btn = document.getElementById(`tab-${id}`);
    if (!btn) return;
    btn.style.background = tab===id ? '#141f14' : 'transparent';
    btn.style.color      = tab===id ? '#22c55e' : '#5a7a5a';
    btn.style.boxShadow  = tab===id ? '0 1px 4px rgba(0,0,0,.4)' : 'none';
  });

  const users = DB.users();

  if (tab === 'overview') {
    const occCount = {};
    users.forEach(u => { if (u.occ) occCount[u.occ] = (occCount[u.occ]||0)+1; });
    const topOcc = Object.entries(occCount).sort((a,b)=>b[1]-a[1]);

    el.innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
      <div class="a-card" style="padding:24px;">
        <div style="font-size:11px;font-weight:700;letter-spacing:.1em;color:#5a7a5a;text-transform:uppercase;margin-bottom:16px;">Occupation Breakdown</div>
        ${topOcc.length ? topOcc.map(([occ,count]) => `
        <div style="margin-bottom:12px;">
          <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:5px;">
            <span style="color:#9dc49d;text-transform:capitalize;">${OCC_LABELS[occ]||occ}</span>
            <span style="color:#22c55e;font-weight:700;">${count}</span>
          </div>
          <div style="height:4px;background:rgba(34,197,94,.1);border-radius:2px;">
            <div style="height:100%;background:#22c55e;border-radius:2px;width:${(count/users.length*100).toFixed(0)}%;transition:width .8s ease;"></div>
          </div>
        </div>`).join('') : '<div style="color:#5a7a5a;font-size:13px;">No data yet</div>'}
      </div>
      <div class="a-card" style="padding:24px;">
        <div style="font-size:11px;font-weight:700;letter-spacing:.1em;color:#5a7a5a;text-transform:uppercase;margin-bottom:16px;">Score Distribution</div>
        ${users.filter(u=>u.score).length ? [['Excellent (750+)',users.filter(u=>u.score>=750).length,'#22c55e'],['Good (650–749)',users.filter(u=>u.score>=650&&u.score<750).length,'#60a5fa'],['Fair (550–649)',users.filter(u=>u.score>=550&&u.score<650).length,'#f59e0b'],['Poor (<550)',users.filter(u=>u.score&&u.score<550).length,'#ef4444']].map(([l,c,color]) => `
        <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid rgba(34,197,94,.07);">
          <div style="display:flex;align-items:center;gap:8px;">
            <div style="width:8px;height:8px;border-radius:50%;background:${color};"></div>
            <span style="font-size:13px;color:#9dc49d;">${l}</span>
          </div>
          <span style="font-size:14px;font-weight:700;color:${color};">${c}</span>
        </div>`).join('') : '<div style="color:#5a7a5a;font-size:13px;">No scored users yet</div>'}
      </div>
    </div>
    <div class="a-card" style="padding:24px;margin-top:20px;">
      <div style="font-size:11px;font-weight:700;letter-spacing:.1em;color:#5a7a5a;text-transform:uppercase;margin-bottom:16px;">Recent Signups</div>
      ${users.length ? `<table class="a-table">
        <thead><tr><th>Name</th><th>Email</th><th>Occupation</th><th>Score</th><th>Joined</th></tr></thead>
        <tbody>
          ${users.slice(-5).reverse().map(u => `
          <tr>
            <td style="color:#e2f5e2;font-weight:600;">${u.name}</td>
            <td style="font-family:'JetBrains Mono',monospace;font-size:12px;">${u.email}</td>
            <td style="text-transform:capitalize;">${OCC_LABELS[u.occ]||u.occ||'—'}</td>
            <td><span style="color:${u.score?scoreColor(u.score):'#5a7a5a'};font-weight:700;">${u.score||'—'}</span></td>
            <td>${new Date(u.joined).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</td>
          </tr>`).join('')}
        </tbody>
      </table>` : '<div style="color:#5a7a5a;font-size:13px;">No users registered yet</div>'}
    </div>`;

  } else if (tab === 'users') {
    el.innerHTML = `
    <div class="a-card" style="overflow:hidden;">
      <div style="padding:18px 24px;border-bottom:1px solid rgba(34,197,94,.1);display:flex;justify-content:space-between;align-items:center;">
        <div style="font-size:11px;font-weight:700;letter-spacing:.1em;color:#5a7a5a;text-transform:uppercase;">All Users (${users.length})</div>
        <button onclick="window._exportUsers()" style="background:#141f14;border:1px solid rgba(34,197,94,.2);color:#22c55e;padding:6px 14px;border-radius:7px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;">Export CSV</button>
      </div>
      ${users.length ? `
      <div style="overflow-x:auto;">
        <table class="a-table">
          <thead><tr><th>Name</th><th>Email</th><th>Occ.</th><th>UPI App</th><th>Score</th><th>Admin</th><th>Joined</th><th>Action</th></tr></thead>
          <tbody>
            ${users.map(u => `
            <tr>
              <td style="color:#e2f5e2;font-weight:600;">${u.name}</td>
              <td style="font-family:'JetBrains Mono',monospace;font-size:11px;">${u.email}</td>
              <td style="text-transform:capitalize;">${OCC_LABELS[u.occ]||u.occ||'—'}</td>
              <td style="text-transform:capitalize;">${u.upiApp||'—'}</td>
              <td><span style="font-weight:700;color:${u.score?scoreColor(u.score):'#5a7a5a'}">${u.score||'—'}</span>${u.score?`<span style="margin-left:5px;font-size:10px;color:#5a7a5a;">${scoreTier(u.score)}</span>`:''}</td>
              <td>${u.isAdmin?'<span style="color:#22c55e;font-weight:700;">👑 Yes</span>':'<span style="color:#5a7a5a;">No</span>'}</td>
              <td style="font-size:11px;">${new Date(u.joined).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</td>
              <td><button onclick="window._deleteUser(${u.id})" style="background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.25);color:#ef4444;padding:4px 10px;border-radius:6px;font-size:11px;font-weight:600;cursor:pointer;font-family:inherit;">Delete</button></td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>` : '<div style="padding:32px;text-align:center;color:#5a7a5a;">No users registered yet</div>'}
    </div>`;

    window._deleteUser = (id) => {
      if (!confirm('Delete this user permanently?')) return;
      DB.deleteUser(id);
      aToast('User deleted', 'ok');
      renderAdminTab('users');
    };

    window._exportUsers = () => {
      const cols = ['ID','Name','Email','Occupation','UPI App','Score','Admin','Joined'];
      const rows = users.map(u => [u.id,u.name,u.email,u.occ||'',u.upiApp||'',u.score||'',u.isAdmin,u.joined].join(','));
      const csv  = [cols.join(','), ...rows].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'creditdna_users.csv';
      a.click();
      aToast('CSV exported', 'ok');
    };

  } else if (tab === 'scores') {
    const scored = users.filter(u => u.score);
    el.innerHTML = `
    <div class="a-card" style="padding:24px;">
      <div style="font-size:11px;font-weight:700;letter-spacing:.1em;color:#5a7a5a;text-transform:uppercase;margin-bottom:20px;">Score Analytics</div>
      ${scored.length ? `
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:14px;margin-bottom:24px;">
        ${[['Highest Score', Math.max(...scored.map(u=>u.score))],['Lowest Score',Math.min(...scored.map(u=>u.score))],['Average Score',Math.round(scored.reduce((a,u)=>a+u.score,0)/scored.length)],['Scored Users',scored.length]].map(([l,v]) => `
        <div style="background:#0f1a0f;border-radius:10px;padding:16px;border:1px solid rgba(34,197,94,.1);">
          <div style="font-size:11px;color:#5a7a5a;margin-bottom:4px;">${l}</div>
          <div style="font-family:'Bricolage Grotesque',sans-serif;font-size:28px;font-weight:800;color:#22c55e;">${v}</div>
        </div>`).join('')}
      </div>
      <table class="a-table">
        <thead><tr><th>Name</th><th>Email</th><th>Score</th><th>Tier</th></tr></thead>
        <tbody>
          ${scored.sort((a,b)=>b.score-a.score).map(u => `
          <tr>
            <td style="color:#e2f5e2;font-weight:600;">${u.name}</td>
            <td style="font-size:12px;font-family:'JetBrains Mono',monospace;">${u.email}</td>
            <td><span style="font-size:18px;font-weight:800;color:${scoreColor(u.score)}">${u.score}</span></td>
            <td><span style="background:${scoreColor(u.score)}20;color:${scoreColor(u.score)};padding:3px 10px;border-radius:999px;font-size:11px;font-weight:700;">${scoreTier(u.score)}</span></td>
          </tr>`).join('')}
        </tbody>
      </table>` : '<div style="color:#5a7a5a;font-size:13px;padding:32px;text-align:center;">No scored users yet</div>'}
    </div>`;

  } else if (tab === 'settings') {
    el.innerHTML = `
    <div class="a-card" style="padding:28px;max-width:500px;">
      <div style="font-size:11px;font-weight:700;letter-spacing:.1em;color:#5a7a5a;text-transform:uppercase;margin-bottom:20px;">Admin Settings</div>
      <div style="margin-bottom:20px;padding:16px;background:#0f1a0f;border-radius:10px;border:1px solid rgba(34,197,94,.1);">
        <div style="font-size:12px;color:#5a7a5a;margin-bottom:4px;">Current Admin</div>
        <div style="font-size:15px;font-weight:600;color:#e2f5e2;">${adminUser.name}</div>
        <div style="font-size:13px;color:#5a7a5a;font-family:'JetBrains Mono',monospace;">${adminUser.email}</div>
      </div>
      <div style="margin-bottom:20px;padding:16px;background:#0f1a0f;border-radius:10px;border:1px solid rgba(34,197,94,.1);">
        <div style="font-size:12px;color:#5a7a5a;margin-bottom:8px;">Admin Whitelist</div>
        ${ADMIN_EMAILS.map(e => `
        <div style="font-size:12px;color:#9dc49d;padding:4px 0;font-family:'JetBrains Mono',monospace;border-bottom:1px solid rgba(34,197,94,.07);">${e}</div>`).join('')}
      </div>
      <div style="margin-bottom:20px;padding:16px;background:#0f1a0f;border-radius:10px;border:1px solid rgba(34,197,94,.1);">
        <div style="font-size:12px;color:#5a7a5a;margin-bottom:4px;">Database Stats</div>
        <div style="font-size:13px;color:#9dc49d;">Total users in localStorage: <strong style="color:#22c55e;">${DB.users().length}</strong></div>
      </div>
      <button onclick="if(confirm('Clear ALL user data? This cannot be undone.'))window._clearDB()" style="background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.25);color:#ef4444;padding:10px 20px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;width:100%;">
        ⚠️ Clear All User Data
      </button>
    </div>`;

    window._clearDB = () => {
      localStorage.removeItem('cdna_users');
      localStorage.removeItem('cdna_me');
      aToast('All user data cleared', 'ok');
      renderAdminTab('settings');
    };
  }
}

/* ── Boot ─────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Check if already authenticated in session
  const me = DB.me();
  if (me && me.isAdmin) {
    adminUser = me;
    renderAdminDashboard();
  } else {
    renderAdminLogin();
  }
});
