// @ts-check
/**
 * @fileoverview CreditDNA main app entry point
 * Client-side router + boot
 */

import { DB } from './db.js';
import { isAdmin } from './config.js';
import { renderNav, renderMM } from './nav.js';
import { toast } from './toast.js';

import { renderLanding }      from './pages/landing.js';
import { renderLogin, renderRegister } from './pages/auth.js';
import {
  renderDashboard,
  renderCheck,
  renderTransactions,
  renderProfile,
  renderHow,
  renderPricing,
} from './pages/pages.js';

/* ── State ──────────────────────────── */
let PAGE = 'landing';

/* ── Router ─────────────────────────── */
const PAGES = {
  landing:      go => renderLanding(go),
  how:          go => renderHow(go),
  pricing:      go => renderPricing(go),
  login:        go => renderLogin(go),
  register:     go => renderRegister(go),
  dashboard:    go => renderDashboard(go),
  check:        go => renderCheck(go),
  transactions: go => renderTransactions(go),
  profile:      go => renderProfile(go),
};

/**
 * Navigate to a page
 * @param {string} page
 */
function go(page) {
  // Guard protected pages
  const protected_ = ['dashboard','check','transactions','profile'];
  if (protected_.includes(page) && !DB.me()) {
    toast('Please sign in first', 'err');
    page = 'login';
  }

  PAGE = page;

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Update URL hash (no page reload)
  history.pushState({ page }, '', `#${page}`);

  // Render nav + page
  renderNav(PAGE, go);
  const render = PAGES[page] || PAGES.landing;
  render(go);
}

// Expose globally (used in innerHTML onclick)
window._go = go;

/* ── Handle browser back/forward ────── */
window.addEventListener('popstate', e => {
  const page = e.state?.page || 'landing';
  PAGE = page;
  renderNav(PAGE, go);
  (PAGES[page] || PAGES.landing)(go);
});

/* ── Handle hash on load ─────────────── */
const hashPage = window.location.hash.replace('#', '') || 'landing';

/* ── Boot ────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  go(PAGES[hashPage] ? hashPage : 'landing');
});
