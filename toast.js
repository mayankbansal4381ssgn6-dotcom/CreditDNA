// @ts-check
/**
 * @fileoverview Toast notification system
 * @param {string} msg
 * @param {'ok'|'err'|'info'} [type]
 */
export function toast(msg, type = 'info') {
  const el = document.getElementById('toast');
  if (!el) return;

  const colors = { ok: '#0f7e5a', err: '#c0392b', info: '#d4500f' };
  const color  = colors[type] || colors.info;

  const item = document.createElement('div');
  item.className = 'toast-item';
  item.innerHTML = `<span class="toast-dot" style="background:${color}"></span>${msg}`;
  el.appendChild(item);

  setTimeout(() => {
    item.style.opacity = '0';
    item.style.transition = 'opacity .3s';
    setTimeout(() => item.remove(), 300);
  }, 3000);
}
