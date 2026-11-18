
/* ---------- měření průchodu, zpětná vazba a dashboard vlastníka ----------
   Data jdou do sdílené databáze stránky na claude.ai: jeden dokument na člověka (track/<id>) a jeho zpětná vazba (feedback/<id>).
   Ukládají se jen identifikátory lidí, jména dohledá dashboard při zobrazení. Mimo claude.ai (nebo bez práva zápisu) se nic neměří. */
const TRK = {act:Date.now(), db:null, user:null, uid:null, owner:false, ok:false, doc:null, dirty:false, busy:false, cur:null, curAt:0, lastClick:''};
const tNow = () => Date.now(), tDay = () => dKey(0);
const tInc = (o, k, n) => { o[k] = (o[k] || 0) + (n === undefined ? 1 : n); };
const tPush = (a, v, max) => { a.push(v); while (a.length > max) a.shift(); };
function tBlank(){ return {v:1, ses:[], first:tNow(), last:tNow(), visits:{}, secs:{}, dev:{}, role:null, prog:{}, pv:{}, tm:{}, clicks:{}, locked:{}, quiz:{}, wrong:[], perf:{load:[], fcp:[], render:[], size:0, errs:[]}, spock:{n:0, tin:0, tout:0, ms:[], err:0}, ev:[]}; }
function tLoc(){
  if (view.name !== 'week') return view.name;
  const w = W.find(x => x.id === view.week); if (!w) return 'week';
  const d = w.days[typeof view.lesson === 'number' ? view.lesson : 0];
  return w.id + (d ? '/' + d.d : '');
}
function tLocLabel(k){
  const NAMES = {home:'Úvodní stránka', map:'SPOCK v kostce', diag:'Diagnostika', gloss:'Slovníček', cheat:'Tahák tasků', ready:'Připravenost', badges:'Odznaky a profil', dash:'Dashboard', sim:'SPOCK nanečisto', quiz:'Kvíz'};
  if (NAMES[k]) return NAMES[k];
  const [id, les] = String(k).split('/'), w = W.find(x => x.id === id); if (!w) return String(k);
  const d = w.days.find(x => x.d === les);
  return w.title + (d ? ' › ' + d.d + ' ' + plain(d.t) : '');
}
function trk(type, key){
  if (!TRK.doc) return;
  tPush(TRK.doc.ev, [tNow(), type, String(key).slice(0, 80)], 300); TRK.dirty = true;
}
function tSnapshot(){
  const T = TRK.doc; if (!T) return;
  T.last = tNow(); T.role = S.role || null;
  const mods = {}; let done = 0, tot = 0;
  W.forEach(w => { const t = weekTotals(w); mods[w.id] = [t.done, t.tot, w.days.filter((_, di) => lessonDone(w, di)).length, w.days.length, quizPassed(w) ? 1 : 0, cardsAll(w), cardsTotal(w)]; if (counts(w)) { done += t.done; tot += t.tot; } });
  T.prog = {xp:S.xp || 0, pct:tot ? Math.round(100 * done / tot) : 0, mods, loc:tLoc(), badges:Object.keys(S.badges || {}).filter(k => k.startsWith('got.')).length, streak:streak(), sim:!!(S.badges && S.badges.sim), video:!!S.seenVideo};
  T.devs = Object.keys(S.proof || {}).filter(k => { const [wid, di, ti] = k.split('.'), w = W.find(x => x.id === wid), t = w && w.days[+di] && w.days[+di].todo[+ti]; return t && t.check && t.check.kind === 'seen' && S.proof[k] !== t.check.a; });
  T.ptries = Object.assign({}, S.ptries || {});
  /* První hodnota (čas od první návštěvy = T.first) a síla důkazu u hotových úkolů: odškrtnuté bez ověření,
     otázka ověření, co jste viděli, důkaz z vlastního běhu, odškrtnuté bez důkazu z běhu. Jména ani obsah běhu se neukládají. */
  T.fv = S.fv ? {at:S.fv.at, lvl:S.fv.lvl, gate:S.fv.gate || null, selfAt:S.fv.selfAt || null} : null;
  const ver = {self:0, proof:0, seen:0, run:0, runself:0};
  W.forEach(w => w.days.forEach((d, di) => d.todo.forEach((t, ti) => { const k = w.id + '.' + di + '.' + ti; if (!S.todo[k]) return; const c = t.check; ver[!c ? 'self' : c.kind === 'run' ? ((S.runev || {})[k] ? 'run' : 'runself') : c.kind]++; })));
  T.ver = ver;
  T.wrong = Object.keys(S.cards || {}).filter(k => { const [wid, di, ci] = k.split('.'), w = W.find(x => x.id === wid), c = w && w.days[+di] && w.days[+di].cards[+ci]; return c && S.cards[k] !== c.a; });
}
function tTick(){
  const T = TRK.doc; if (!T || !TRK.cur) return;
  /* počítá se jen aktivní čas: nejvýš 60 s po poslední akci (klik, psaní, posun, přehrávání videa) */
  const now = tNow(), end = Math.min(now, (TRK.act || TRK.curAt) + 60000), s = Math.round((end - TRK.curAt) / 1000);
  TRK.curAt = now; if (s <= 0) return;
  tInc(T.tm, TRK.cur, s); tInc(T.secs, tDay(), s);
  const ss = T.ses[T.ses.length - 1]; if (ss) { ss[1] = end; ss[2] += s; }
  TRK.dirty = true;
}
function trackView(){
  const T = TRK.doc; if (!T) return;
  const k = tLoc(); if (k === TRK.cur) return;
  tTick(); TRK.cur = k; TRK.curAt = tNow(); tInc(T.pv, k); trk('view', k);
}
async function tFlush(){
  if (!TRK.ok || !TRK.doc || TRK.busy || !TRK.dirty) return;
  TRK.busy = true; TRK.dirty = false;
  try { tTick(); tSnapshot(); await TRK.db.doc('track/' + TRK.uid).set(JSON.parse(JSON.stringify(TRK.doc))); }
  catch (e) { if (e && (e.code === 'invalid_argument' || e.code === 'revoked' || e.code === 'not_granted')) TRK.ok = false; else TRK.dirty = true; }
  TRK.busy = false;
}
function trackSpock(inChars, outChars, ms, ok){
  const T = TRK.doc; if (!T) return;
  T.spock.n++; T.spock.tin += Math.round(inChars / 3.5); T.spock.tout += Math.round(outChars / 3.5); tPush(T.spock.ms, ms, 30); if (!ok) T.spock.err++;
  trk('spock', ok ? 'ok ' + ms + ' ms' : 'chyba'); TRK.dirty = true;
}
function trackRender(ms){ const T = TRK.doc; if (T && ms >= 0) { tPush(T.perf.render, Math.round(ms), 40); const pv = T.perfv && T.perfv[BUILD.ver]; if (pv) tPush(pv.render, Math.round(ms), 20); } }
function trackQuiz(wid, mode, passed, right, total){
  const T = TRK.doc; if (!T) return;
  const q = T.quiz[wid + ':' + mode] = T.quiz[wid + ':' + mode] || {tries:0, fails:0, best:0};
  q.tries++; if (!passed) q.fails++; q.best = Math.max(q.best, right); q.total = total;
  trk(mode === 'jump' ? 'skok' : 'kvíz', wid + ' ' + right + '/' + total + (passed ? ' splněno' : ' nesplněno')); TRK.dirty = true;
}
function tClickKey(el){
  const d = el.dataset || {};
  if (d.card) return 'karta ' + d.card.split(':')[0];
  if (d.week) return 'modul ' + d.week;
  if (d.lesson !== undefined) return 'lekce ' + (view.week || '') + ' ' + d.lesson;
  if (d.go) return 'opora ' + d.go;
  if (d.quiz) return 'kvíz ' + d.quiz;
  if (d.jump) return 'skokový test ' + d.jump;
  if (d.peek) return 'náhled ' + d.peek;
  if (d.role) return 'role ' + d.role;
  if (d.todo) return 'úkol ' + d.todo;
  if ('simstart' in d) return 'SPOCK nanečisto';
  if ('playvideo' in d) return 'video';
  if ('openSpock' in d || el.id === 'g-fab') return 'Spock';
  if (d.sim) return 'simulace ' + d.sim;
  if ('fbopen' in d) return 'zpětná vazba';
  if (el.id === 'home-btn') return 'domů (logo)';
  if (el.tagName === 'SUMMARY') return 'rozbalit: ' + (el.textContent || '').trim().slice(0, 40);
  return (el.tagName === 'A' ? 'odkaz: ' : 'tlačítko: ') + ((el.getAttribute('aria-label') || el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40) || el.className || '?');
}
document.addEventListener('click', e => {
  const T = TRK.doc; if (!T) return;
  const el = e.target.closest('button, a, summary, input[type=checkbox], [data-card]'); if (!el || el.closest('#dash')) return;
  const k = tClickKey(el); tInc(T.clicks, k); TRK.lastClick = k;
  if (el.dataset && el.dataset.week) { const w = W.find(x => x.id === el.dataset.week); if (w && isLocked(w)) { tInc(T.locked, w.id); trk('zamčeno', w.id); } }
  /* opakované klikání: stejný prvek 3× během 2 s (člověk čeká, že se něco stane) */
  const now = tNow(); TRK.rc = (TRK.rc || []).filter(x => now - x[0] < 2000); TRK.rc.push([now, k]);
  if (TRK.rc.filter(x => x[1] === k).length === 3) trk('opakovaný klik', k);
  if (el.dataset && el.dataset.card) { const [ck, o] = el.dataset.card.split(':'), [wid, di, ci] = ck.split('.'), w = W.find(x => x.id === wid), c = w && w.days[+di] && w.days[+di].cards[+ci]; if (c) trk('karta', ck + (+o === c.a ? ' správně' : ' špatně')); }
  trk('klik', k);
}, true);
window.addEventListener('error', e => { const T = TRK.doc; if (T) { tPush(T.perf.errs, [tNow(), String(e.message || 'chyba').slice(0, 160), tLoc()], 20); TRK.dirty = true; } });
['pointerdown', 'keydown', 'scroll', 'touchstart', 'wheel'].forEach(ev => window.addEventListener(ev, () => { TRK.act = tNow(); }, {passive:true, capture:true}));
document.addEventListener('timeupdate', () => { TRK.act = tNow(); }, true);
document.addEventListener('visibilitychange', () => { if (document.hidden) { tFlush(); } else { TRK.curAt = tNow(); TRK.act = tNow(); } });
window.addEventListener('pagehide', () => { tFlush(); });

/* Připojení k účtu a databázi. Bez sítě se nepovede; zkusí se znovu, jakmile je zařízení zpět online (viz offline režim níže). */
async function tInit(){
  if (TRK.ok || TRK.initing) return; TRK.initing = true;
  try { await tInitRun(); } finally { TRK.initing = false; }
  try { fbOutboxSend(); } catch (e) {}
}
async function tInitRun(){
  let db = null, user = null;
  try { db = await claude.use('db'); user = await claude.use('user'); } catch (e) {}
  if (!db || !user) return;
  let me = null; try { me = await user.me(); } catch (e) {}
  if (!me || !me.id) return;
  TRK.db = db; TRK.user = user; TRK.uid = me.id; TRK.owner = !!(me.isOwner || me.canEdit);
  if (!PROG.ready) await pLoad(db, me.id);
  let doc = null;
  try { const s = await db.doc('track/' + me.id).get(); doc = s.exists ? JSON.parse(JSON.stringify(s.data())) : null; } catch (e) { return; }
  const T = Object.assign(tBlank(), doc || {});
  ['visits','secs','pv','tm','clicks','locked','quiz'].forEach(k => { if (!T[k] || typeof T[k] !== 'object') T[k] = {}; });
  T.perf = Object.assign({load:[], fcp:[], render:[], size:0, errs:[]}, T.perf || {}); T.spock = Object.assign({n:0, tin:0, tout:0, ms:[], err:0}, T.spock || {}); T.ev = Array.isArray(T.ev) ? T.ev : [];
  tInc(T.visits, tDay());
  /* sezení: [začátek, konec, aktivní sekundy]; nové začne po 30 min bez aktivity, uchová se posledních 100 */
  if (!Array.isArray(T.ses)) T.ses = [];
  { const ls = T.ses[T.ses.length - 1]; if (!ls || tNow() - ls[1] > 18e5) tPush(T.ses, [tNow(), tNow(), 0], 100); }
  if (!T.perfv || typeof T.perfv !== 'object') T.perfv = {};
  if (!T.perfv[BUILD.ver]) T.perfv[BUILD.ver] = {load:[], render:[]};
  Object.keys(T.perfv).slice(0, -6).forEach(k => delete T.perfv[k]);
  T.dev = {w:innerWidth, h:innerHeight, mobile:innerWidth < 760, dark:matchMedia('(prefers-color-scheme: dark)').matches, touch:'ontouchstart' in window, lang:navigator.language || ''};
  try {
    const nav = performance.getEntriesByType('navigation')[0];
    if (nav) { const lm = Math.round(nav.domContentLoadedEventEnd || nav.duration || 0); tPush(T.perf.load, lm, 20); tPush(T.perfv[BUILD.ver].load, lm, 20); }
    const fcp = performance.getEntriesByName('first-contentful-paint')[0]; if (fcp) tPush(T.perf.fcp, Math.round(fcp.startTime), 20);
    T.perf.size = (BUILD.size && BUILD.size.html) || 0; /* dřív outerHTML celé stránky: převod ~650 kB na text stál při každém načtení desítky ms */
  } catch (e) {}
  TRK.doc = T; TRK.ok = true; TRK.dirty = true;
  tmLoad();
  trk('návštěva', T.dev.mobile ? 'mobil' : 'počítač');
  trackView(); await tFlush();
  if (!TRK.timer) TRK.timer = setInterval(tFlush, 20000);
  if (TRK.owner) {
    const pp = document.getElementById('pill-fb');
    if (pp && !document.getElementById('pill-dash')) pp.insertAdjacentHTML('afterend', '<button class="pill fb-pill" id="pill-dash" type="button" data-go="dash" aria-label="Dashboard: jak lidé procházejí tutoriálem a zpětná vazba" title="Dashboard: jak lidé procházejí tutoriálem a zpětná vazba"><svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg><span class="fb-t">Dashboard</span></button>');
    if (view.name !== 'week' && view.name !== 'home') render();
  }
}
/* připojení k účtu až po vykreslení stránky: měření a načtení pokroku nemají zdržet první zobrazení */
if (document.readyState === 'loading') addEventListener('DOMContentLoaded', () => setTimeout(tInit, 0), {once:true}); else setTimeout(tInit, 0);

