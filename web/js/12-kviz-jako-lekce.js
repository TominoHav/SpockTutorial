/* ---------- kvíz jako lekce (Duolingo): losuje 5 otázek ze zásoby, pořadí otázek i možností se míchá při každém spuštění ---------- */
const QN = 5, QPASS = .8, PLACE_N = 8;
/* ---------- opakování chyb s odstupem ----------
   Karta zodpovězená špatně se vrátí k zopakování za 1 den; když ji člověk pak trefí napoprvé, další opakování je za 3,
   7 a 14 dní, pak karta z opakování zmizí. Netrefená se vrací zase za den. Za každou trefu +5 XP. */
const REV_DAYS = [1, 3, 7, 14];
function revInit(){
  if (S.revInit) return; S.rev = S.rev || {};
  let n = 0;
  Object.keys(S.cards || {}).forEach(k => { const [wid, di, ci] = k.split('.'), w = W.find(x => x.id === wid), c = w && w.days[+di] && (w.days[+di].cards || [])[+ci]; if (c && c.o.length && S.cards[k] !== c.a && !S.rev[k]) { S.rev[k] = {due:Date.now(), step:0}; n++; } });
  /* bez nových karet se neukládá: uložení by posunulo čas pokroku a na novém zařízení by přebilo pokrok z účtu */
  S.revInit = true; if (n) save();
}
const revCardOf = k => { const [wid, di, ci] = k.split('.'), w = W.find(x => x.id === wid); return w && w.days[+di] && (w.days[+di].cards || [])[+ci]; };
const revDue = () => Object.keys(S.rev || {}).filter(k => S.rev[k].due <= Date.now() && revCardOf(k));
function revAdd(k){ S.rev = S.rev || {}; S.rev[k] = {due:Date.now() + REV_DAYS[0] * 864e5, step:0}; }
function revDone(key, ok){
  const k = key.replace(/^rev\./, ''), r = (S.rev || {})[k]; if (!r) return 0;
  if (!ok) { r.step = 0; r.due = Date.now() + REV_DAYS[0] * 864e5; save(); return 0; }
  r.step++; if (r.step >= REV_DAYS.length) delete S.rev[k]; else r.due = Date.now() + REV_DAYS[r.step] * 864e5;
  return award('rev.' + k + '.' + dKey(0), 5, 'opakování') || 0;
}
function startReview(){
  const due = revDue(); if (!due.length) { toast('Teď není co opakovat.'); return; }
  const items = shuffle(due).slice(0, QN).map(k => sesItem(revCardOf(k), 'rev.' + k));
  SES = {wid:'rev', mode:'rev', items, qs:items.map((_, i) => i), i:0, hearts:0, pick:null, checked:false, right:0, total:items.length, missed:new Set(), gained:0};
  try { trk('opakování', items.length + ' karet'); } catch (e) {}
  renderSession();
}
document.addEventListener('click', e => { if (e.target.closest('[data-review]')) startReview(); if (e.target.closest('[data-place]')) startSession('l0', 'place'); });
/* vstupní test: splní karty a kvíz úrovně 0 a odemkne Přípravu; praktické úkoly zůstávají */
function placeCredit(){
  const w = W.find(x => x.id === 'l0'); if (!w) return;
  S.cards = S.cards || {}; w.days.forEach((d, di) => (d.cards || []).forEach((c, ci) => { const k = w.id + '.' + di + '.' + ci; if (S.cards[k] === undefined) S.cards[k] = c.a; }));
  S.qpass = S.qpass || {}; if (!S.qpass.l0) S.qpass.l0 = {at:Date.now(), right:0, total:0, place:true};
  S.unlocked = S.unlocked || {}; S.unlocked.l1 = true; S.placed = dKey(0); save(); award('place.l0', XP.jump, 'vstupní test'); checkModuleDone(w);
}
/* ---------- co je nového ve SPOCKu ----------
   Když vyjde nová verze SPOCKu a onboarding se podle ní aktualizuje, sem se doplní, co se změnilo pro uživatele
   (klíč = release ze SPOCK-VERZE.md). Kdo už onboarding používal, uvidí na úvodu kartu s novinkami, dokud ji nezavře.
   Nováček kartu nevidí, učí se rovnou novou verzi. */
const NOVINKY = {};
if (window.__E2E && window.__E2E_NOVINKY) Object.assign(NOVINKY, window.__E2E_NOVINKY);
