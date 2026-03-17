// @ts-check
import { DB } from './db.js';
import { isAdmin } from './config.js';
import { doLogout } from './auth.js';
import { toast } from './toast.js';

/** @type {boolean} */
let mmOpen = false;
window._toggleMM = toggleMM;

/**
 * Render nav links
 * @param {string} page
 * @param {Function} go
 */
export function renderNav(page, go) {
  const user = DB.me();
  const linksEl = document.getElementById('nav-links');
  const logoEl  = document.getElementById('logo-btn');

  if (logoEl) logoEl.onclick = () => go('landing');

  if (!linksEl) return;

  /**
   * @param {string} id
   * @param {string} label
   */
  const lnk = (id, label) =>
    `<button class="nav-link${page === id ? ' active' : ''}" onclick="window._go('${id}')">${label}</button>`;

  let h = lnk('landing', 'Home') + lnk('how', 'How It Works') + lnk('pricing', 'For Banks');

  if (user) {
    if (isAdmin(user)) {
      h += `<a href="admin.html" class="nav-link" style="color:#d4500f;font-weight:700">👑 Admin Portal</a>`;
    }
    h += lnk('dashboard', 'Dashboard') + lnk('check', 'My Score') + lnk('transactions', 'Transactions');
    h += `<div class="user-avatar">${user.name.charAt(0).toUpperCase()}</div>`;
    h += `<button class="btn-danger btn-sm" onclick="window._logout()">Sign out</button>`;
  } else {
    h += lnk('login', 'Sign In');
    h += `<button class="btn-primary btn-sm" onclick="window._go('register')">Get Started</button>`;
  }

  linksEl.innerHTML = h;

  // Register globals for onclick in innerHTML
  window._go = go;
  window._logout = () => { doLogout(); go('landing'); };
}

/**
 * Render mobile menu
 * @param {string} page
 * @param {Function} go
 */
export function renderMM(page, go) {
  const el = document.getElementById('mobile-menu');
  if (!el) return;
  const user = DB.me();

  const item = (id, ico, label) =>
    `<button class="mm-item" onclick="window._go('${id}');closeMM()">${ico} ${label}</button>`;

  let h = item('landing','🏠','Home') + item('how','🔬','How It Works') + item('pricing','🏦','For Banks');

  if (user) {
    h += `<div class="mm-div"></div>`;
    if (isAdmin(user)) {
      h += `<a href="admin.html" class="mm-item" style="color:#d4500f;font-weight:700">👑 Admin Portal</a>`;
    }
    h += item('dashboard','📊','Dashboard') + item('check','🎯','My Score') + item('transactions','💳','Transactions') + item('profile','👤','Profile');
    h += `<div class="mm-div"></div>`;
    h += `<button class="mm-item" style="color:#c0392b" onclick="window._logout();closeMM()">🚪 Sign Out</button>`;
  } else {
    h += `<div class="mm-div"></div>`;
    h += item('login','🔑','Sign In');
    h += `<button class="btn-primary btn-full" style="margin-top:8px" onclick="window._go('register');closeMM()">Get Started Free</button>`;
  }

  el.innerHTML = h;
}

export function toggleMM() {
  mmOpen = !mmOpen;
  const el = document.getElementById('mobile-menu');
  if (el) el.classList.toggle('open', mmOpen);
}

export function closeMM() {
  mmOpen = false;
  const el = document.getElementById('mobile-menu');
  if (el) el.classList.remove('open');
}

// Close on outside click
document.addEventListener('click', e => {
  if (mmOpen && !e.target.closest('#mobile-menu') && !e.target.closest('#hb')) closeMM();
});
