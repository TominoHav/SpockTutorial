/* ---------- Spock jako přetahovatelný pomocník ---------- */
const POS_KEY = 'spock-fab-pos', HINT_KEY = 'spock-hint-seen';
function placeFab(fab, x, y){
  const r = fab.getBoundingClientRect(), w = r.width || 80, h = r.height || 100;
  x = Math.max(4, Math.min(innerWidth - w - 4, x)); y = Math.max(4, Math.min(innerHeight - h - 4, y));
  fab.style.left = x + 'px'; fab.style.top = y + 'px'; fab.style.right = 'auto'; fab.style.bottom = 'auto';
  return {x, y};
}
function openSpock(){
  const fab = $('#g-fab'), panel = $('#g-panel'); if (!panel || G.unavailable || !G.sample) return;
  const r = fab.hidden ? null : fab.getBoundingClientRect();
  panel.hidden = false; fab.hidden = true;
  try { localStorage.setItem(HINT_KEY, '1'); } catch(e) {}
  const bub = $('#g-fab-t'); if (bub) bub.hidden = true;
  if (innerWidth > 760 && r && r.width) {
    const pw = panel.offsetWidth, ph = panel.offsetHeight, gap = 8;
    const right = r.left + r.width / 2 > innerWidth / 2, below = r.top + r.height / 2 > innerHeight / 2;
    let x = right ? r.right - pw : r.left;
    let y = below ? r.bottom - ph : r.top;
    x = Math.max(16, Math.min(innerWidth - pw - 16, x)); y = Math.max(16, Math.min(innerHeight - ph - 16, y));
    Object.assign(panel.style, {left:x+'px', top:y+'px', right:'auto', bottom:'auto'});
  } else if (innerWidth <= 760) { Object.assign(panel.style, {left:'', top:'', right:'', bottom:''}); document.body.classList.add('spock-open'); fitPanel(); }
  if (!$('#g-log').children.length) gIntro();
  if (innerWidth > 760) $('#g-in').focus();   /* na mobilu klávesnici neotevírat hned, zakryla by odpověď */
}
/* Na mobilu panel vyplní viditelnou část obrazovky, i když se otevře klávesnice nebo lišta prohlížeče. */
function fitPanel(){
  const panel = $('#g-panel'); if (!panel || panel.hidden) return;
  if (innerWidth > 760) { panel.style.height = ''; return; }
  const vv = window.visualViewport, h = vv ? vv.height : innerHeight, top = vv ? vv.offsetTop : 0;
  Object.assign(panel.style, {top: top + 'px', height: h + 'px', bottom: 'auto'});
  const log = $('#g-log'); if (log) log.scrollTop = log.scrollHeight;
}
if (window.visualViewport) { visualViewport.addEventListener('resize', fitPanel); visualViewport.addEventListener('scroll', fitPanel); }
addEventListener('resize', fitPanel);
function closeSpock(){ const p = $('#g-panel'); p.hidden = true; Object.assign(p.style, {height:''}); if (innerWidth <= 760) Object.assign(p.style, {top:'', bottom:''}); document.body.classList.remove('spock-open'); $('#g-fab').hidden = false; }
function spockFab(fab){
  let saved = null; try { saved = JSON.parse(localStorage.getItem(POS_KEY) || 'null'); } catch(e) {}
  let seen = false; try { seen = localStorage.getItem(HINT_KEY) === '1'; } catch(e) {}
  const bub = $('#g-fab-t'); if (bub && seen) bub.hidden = true;
  if (bub && !seen) setTimeout(() => { bub.hidden = true; try { localStorage.setItem(HINT_KEY, '1'); } catch(e) {} }, 8000);
  const put = () => { if (saved && typeof saved.fx === 'number') placeFab(fab, saved.fx * innerWidth, saved.fy * innerHeight); };
  requestAnimationFrame(put);
  addEventListener('resize', put);
  let start = null, moved = false;
  fab.addEventListener('pointerdown', e => {
    if (e.button !== 0) return;
    const r = fab.getBoundingClientRect();
    start = {px:e.clientX, py:e.clientY, x:r.left, y:r.top}; moved = false;
    fab.setPointerCapture(e.pointerId);
  });
  fab.addEventListener('pointermove', e => {
    if (!start) return;
    const dx = e.clientX - start.px, dy = e.clientY - start.py;
    if (!moved && Math.hypot(dx, dy) < 6) return;
    moved = true; fab.classList.add('dragging');
    placeFab(fab, start.x + dx, start.y + dy);
  });
  const end = e => {
    if (!start) return;
    fab.classList.remove('dragging');
    if (moved) {
      const r = fab.getBoundingClientRect();
      saved = {fx: r.left / innerWidth, fy: r.top / innerHeight};
      try { localStorage.setItem(POS_KEY, JSON.stringify(saved)); localStorage.setItem(HINT_KEY, '1'); } catch(err) {}
      if (bub) bub.hidden = true;
      toast('Spock zůstane tady');
    } else if (e.type === 'pointerup') openSpock();
    start = null;
  };
  fab.addEventListener('pointerup', end);
  fab.addEventListener('pointercancel', end);
  fab.addEventListener('keydown', e => {
    const k = {ArrowLeft:[-20,0], ArrowRight:[20,0], ArrowUp:[0,-20], ArrowDown:[0,20]}[e.key];
    if (k) { e.preventDefault(); const r = fab.getBoundingClientRect(); placeFab(fab, r.left + k[0], r.top + k[1]); const r2 = fab.getBoundingClientRect(); saved = {fx:r2.left/innerWidth, fy:r2.top/innerHeight}; try { localStorage.setItem(POS_KEY, JSON.stringify(saved)); } catch(err) {} }
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openSpock(); }
  });
}
document.addEventListener('click', e => { if (e.target.closest('[data-open-spock]')) openSpock(); });

