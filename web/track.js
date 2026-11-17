
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
    T.perf.size = document.documentElement.outerHTML.length;
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
tInit();

/* ---------- zpětná vazba ---------- */
const FB_KINDS = [['chyba','Chyba v obsahu'],['nejasne','Něčemu nerozumím'],['navrh','Návrh na zlepšení'],['technika','Něco nefunguje']];
function fbOpen(){
  if (document.getElementById('fb')) return;
  const where = tLocLabel(tLoc()), card = (document.querySelector('.lpanel .lcard.cur h3') || {}).textContent || '';
  const ov = document.createElement('div'); ov.id = 'fb'; ov.className = 'fb'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-label', 'Zpětná vazba');
  ov.innerHTML = `<form class="fb-in" id="fb-form"><button type="button" class="g-x fb-x" aria-label="Zavřít">×</button>
    <h2>Zpětná vazba k tutoriálu</h2>
    <p class="muted">Jde přímo vlastníkovi tutoriálu jako úkol k vyřízení, i s vaším jménem a místem, kde právě jste. Nepište sem klientská ani osobní data.</p>
    <p class="fb-where"><b>Kde:</b> <span id="fb-where"></span></p>
    <label for="fb-kind">Čeho se týká</label><select id="fb-kind">${FB_KINDS.map(k => `<option value="${k[0]}">${k[1]}</option>`).join('')}</select>
    <label for="fb-text">Co je špatně nebo co vás zarazilo</label><textarea id="fb-text" rows="3" required maxlength="1500" placeholder="Např. odpověď u této karty neodpovídá tomu, co vidím ve SPOCKu."></textarea>
    <label for="fb-fix">Co navrhujete upravit <span class="muted">(nepovinné)</span></label><textarea id="fb-fix" rows="2" maxlength="1500" placeholder="Např. doplnit krok s volbou modelu."></textarea>
    <div class="fb-foot"><span class="muted" id="fb-msg"></span><button class="btn primary" type="submit">Odeslat</button></div></form>`;
  document.body.append(ov);
  ov.querySelector('#fb-where').textContent = where + (card ? ' › karta „' + card + '“' : '');
  const close = () => ov.remove();
  ov.querySelector('.fb-x').onclick = close;
  ov.addEventListener('click', e => { if (e.target === ov) close(); });
  ov.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  ov.querySelector('#fb-form').addEventListener('submit', async e => {
    e.preventDefault();
    const item = {id:'f' + tNow().toString(36) + Math.random().toString(36).slice(2, 6), at:tNow(), loc:tLoc(), where:ov.querySelector('#fb-where').textContent, kind:ov.querySelector('#fb-kind').value, text:ov.querySelector('#fb-text').value.trim(), fix:ov.querySelector('#fb-fix').value.trim(), role:S.role || null, ver:BUILD.ver || ''};
    if (!item.text) return;
    const msg = ov.querySelector('#fb-msg'); msg.textContent = 'Odesílám…';
    let sent = false;
    if (TRK.ok) {
      try {
        const ref = TRK.db.doc('feedback/' + TRK.uid), s = await ref.get();
        const items = s.exists && Array.isArray(s.data().items) ? JSON.parse(JSON.stringify(s.data().items)) : [];
        items.push(item); await ref.set({items, last:tNow()}); sent = true;
      } catch (err) {}
    }
    if (sent) { trk('zpětná vazba', item.kind); award('feedback.' + item.id, 10, 'zpětná vazba'); close(); toast('Díky. Zpětná vazba je u vlastníka tutoriálu.'); }
    else if (!navigator.onLine || (TRK.uid && !TRK.ok) || NET.lost) { fbOutboxAdd(item); trk('zpětná vazba', item.kind + ' (ve frontě)'); close(); toast('Jste offline. Zpětnou vazbu odešlu sám, jakmile budete zase připojeni.'); }
    else {
      const txt = `Zpětná vazba k SPOCK tutoriálu\nKde: ${item.where}\nTyp: ${(FB_KINDS.find(k => k[0] === item.kind) || [])[1]}\nCo: ${item.text}\nNávrh: ${item.fix || '—'}`;
      try { await navigator.clipboard.writeText(txt); msg.textContent = 'Odeslat se nepodařilo. Text je ve schránce, pošlete ho prosím vlastníkovi tutoriálu.'; }
      catch (err) { msg.textContent = 'Odeslat se nepodařilo. Zkopírujte prosím text a pošlete ho vlastníkovi tutoriálu.'; }
    }
  });
  ov.querySelector('#fb-text').focus();
}
document.addEventListener('click', e => { if (e.target.closest('[data-fbopen]')) { e.preventDefault(); fbOpen(); } });

/* ---------- dashboard vlastníka ---------- */
const DASH = {tab:'lide', vers:[], rows:null, fb:null, state:{}, names:{}, err:'', at:0, withMe:false, sel:null, days:14, loading:false};
const dMed = a => { const b = (a || []).filter(x => typeof x === 'number').sort((x, y) => x - y); return b.length ? b[Math.floor(b.length / 2)] : null; };
const dP90 = a => { const b = (a || []).filter(x => typeof x === 'number').sort((x, y) => x - y); return b.length ? b[Math.min(b.length - 1, Math.floor(b.length * .9))] : null; };
const dSum = o => Object.values(o || {}).reduce((n, x) => n + (+x || 0), 0);
const dMs = v => v === null ? '—' : v >= 1000 ? (v / 1000).toFixed(1).replace('.', ',') + ' s' : v + ' ms';
const dDur = s => s >= 3600 ? Math.floor(s / 3600) + ' h ' + Math.round(s % 3600 / 60) + ' min' : s >= 60 ? Math.round(s / 60) + ' min' : s + ' s';
const dTime = t => { const d = new Date(t); return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); };
const dDate = t => { const d = new Date(t); return ['ne','po','út','st','čt','pá','so'][d.getDay()] + ' ' + d.getDate() + '. ' + (d.getMonth() + 1) + '. ' + d.getFullYear(); };
/* sezení člověka; u starších záznamů bez nich se odvodí z časů kroků (mezera přes 30 min = nové sezení) */
function dSessions(r){
  if (Array.isArray(r.ses) && r.ses.length) return r.ses.map(x => ({from:x[0], to:Math.max(x[0], x[1]), secs:x[2] || 0}));
  const ts = (r.ev || []).map(e => e[0]).filter(Number.isFinite).sort((a, b) => a - b), out = [];
  ts.forEach(t => { const l = out[out.length - 1]; if (l && t - l.to <= 18e5) l.to = t; else out.push({from:t, to:t, secs:0, est:true}); });
  return out;
}
const dAgo = t => { const d = Math.floor((tNow() - t) / 864e5); return d <= 0 ? 'dnes' : d === 1 ? 'včera' : 'před ' + d + ' dny'; };
const dWhen = t => { const d = new Date(t); return d.getDate() + '. ' + (d.getMonth() + 1) + '. ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); };
const dNum = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const dName = id => esc(DASH.names[id] || 'Neznámý uživatel');
/* živá aktualizace: stáhne jen záznamy lidí, kteří od minula něco udělali; plné načtení je jen poprvé a tlačítkem */
async function dashLive(){
  if (!TRK.db || DASH.loading || !DASH.rows) return;
  const col = TRK.db.collection('track');
  if (typeof col.where !== 'function') return dashLoad();
  DASH.loading = true;
  try {
    const since = DASH.rows.filter(r => r.id !== TRK.uid).reduce((m, r) => Math.max(m, r.last || 0), 0);
    const ch = await col.where('last', '>', since).limit(1000).get();
    try { window.__liveQ = true; } catch (e) {}   /* jen pro test: živá aktualizace šla přes dotaz na změněné */
    const fresh = ch.docs.map(d => Object.assign({id:d.id}, d.data())).filter(r => DASH.withMe || r.id !== TRK.uid);
    DASH.checked = tNow();
    if (fresh.length) {
      const byId = new Map(DASH.rows.map(r => [r.id, r])); fresh.forEach(r => byId.set(r.id, r)); DASH.rows = [...byId.values()];
      const newIds = fresh.map(r => r.id).filter(id => !(id in DASH.names));
      if (newIds.length) { try { const ps = await TRK.user.profiles(newIds); newIds.forEach(id => { DASH.names[id] = (ps[id] && ps[id].name) || ''; }); } catch (e) {} }
      DASH.at = tNow();
    }
    DASH.same = !fresh.length;
  } catch (e) { DASH.same = true; }
  DASH.loading = false;
  if (view.name !== 'dash') return;
  if (DASH.same) { const l = document.querySelector('.fl-live'); if (l) l.textContent = '● Živě · beze změny, ověřeno ' + dTime(DASH.checked); return; }
  const open = [...document.querySelectorAll('#dash details[open]')].map(d => d.className), y = scrollY;
  renderDash(); scrollTo({top:y});
  open.forEach(c => { const d = document.querySelector('#dash details.' + String(c).split(' ')[0]); if (d) d.open = true; });
}
async function dashLoad(){
  if (!TRK.db || DASH.loading) return;
  DASH.loading = true; DASH.err = '';
  try {
    await tFlush();
    const [tr, fb, st, vs] = await Promise.all([TRK.db.collection('track').limit(1000).get(), TRK.db.collection('feedback').limit(1000).get(), TRK.db.doc('todo/state').get(), TRK.db.collection('versions').limit(500).get()]);
    DASH.vers = vs.docs.map(d => JSON.parse(JSON.stringify(d.data()))).filter(v => v && v.ver);
    const mine = DASH.vers.find(v => v.ver === BUILD.ver);
    if (BUILD.ver && BUILD.ver !== 'neznámá' && (!mine || (!mine.e2e && BUILD.e2e) || mine.src !== BUILD.src)) {
      const rec = Object.assign(JSON.parse(JSON.stringify(BUILD)), {seen:(mine && mine.seen) || tNow()});
      try { await TRK.db.doc('versions/' + BUILD.ver).set(rec); DASH.vers = DASH.vers.filter(v => v.ver !== BUILD.ver).concat([rec]); } catch (e) {}
    }
    DASH.vers.sort((a, b) => (a.ts || a.seen || 0) - (b.ts || b.seen || 0));
    if (tr.docs.length >= 1000) DASH.err = 'Načteno prvních 1000 lidí. Pro víc je potřeba načítání po stránkách.';
    const rows = tr.docs.map(d => Object.assign({id:d.id}, d.data())), sig = rows.filter(r => DASH.withMe || r.id !== TRK.uid).map(r => r.id + ':' + (r.last || 0) + ':' + ((r.ev || []).length)).sort().join(',') + (DASH.withMe ? '|me' : '') + '|' + fb.docs.length;
    DASH.same = DASH.rows && DASH.sig === sig; DASH.sig = sig;
    DASH.rows = rows;   /* vlastní záznam se mění při každém uložení, do porovnání se počítá jen se Započítat i mě */
    DASH.fb = []; fb.docs.forEach(d => (d.data().items || []).forEach(it => DASH.fb.push(Object.assign({uid:d.id}, it))));
    DASH.fb.sort((a, b) => b.at - a.at);
    DASH.state = st.exists ? JSON.parse(JSON.stringify(st.data())) : {}; if (!DASH.state.done) DASH.state.done = {};
    const ids = [...new Set(DASH.rows.map(r => r.id).concat(DASH.fb.map(f => f.uid)))];
    try { const ps = await TRK.user.profiles(ids); ids.forEach(id => { DASH.names[id] = (ps[id] && ps[id].name) || ''; }); } catch (e) {}
    if (!DASH.same) DASH.at = tNow(); DASH.checked = tNow();
  } catch (e) { DASH.err = 'Data se nepodařilo načíst. Zkuste to znovu.'; }
  DASH.loading = false;
  if (view.name !== 'dash') return;
  if (DASH.same) { const l = document.querySelector('.fl-live'); if (l) l.textContent = '● Živě · beze změny, ověřeno ' + dTime(DASH.checked); return; }
  const open = [...document.querySelectorAll('#dash details[open]')].map(d => d.className);
  renderDash();
  open.forEach(c => { const d = document.querySelector('#dash details.' + String(c).split(' ')[0]); if (d) d.open = true; });
}
function dTile(label, value, sub){ return `<div class="ds-tile"><span class="ds-l">${label}</span><b class="num">${value}</b>${sub ? `<small>${sub}</small>` : ''}</div>`; }
function dBars(rows, unit){
  if (!rows.some(r => r[1])) return '<p class="muted ds-empty">V tomhle období zatím žádná data.</p>';
  const max = Math.max(1, ...rows.map(r => r[1]));
  return `<div class="ds-bars" role="img" aria-label="Sloupcový graf">${rows.map(r => `<div class="ds-bar" title="${esc(r[0])}: ${dNum(r[1])}${unit || ''}"><span class="ds-bv num">${r[1] ? dNum(r[1]) : ''}</span><i style="height:${Math.round(r[1] / max * 100)}%"></i><span class="ds-bl">${esc(r[2] || r[0])}</span></div>`).join('')}</div>`;
}
function dHBars(rows, total){
  const max = Math.max(1, total || 0, ...rows.map(r => r[1]));
  let last = -1; rows.forEach((r, i) => { if (r[1]) last = i; });
  const rest = rows.length - (last + 2); let tail = '';
  if (rest > 1) { tail = `<p class="muted ds-rest">Dalších ${rest} kroků zatím nikdo: ${rows.slice(last + 2).map(r => esc(r[0])).join(', ')}.</p>`; rows = rows.slice(0, last + 2); }
  return `<div class="ds-hb">${rows.map(r => `<div class="ds-hr" title="${esc(r[0])}: ${dNum(r[1])}"><span class="ds-hl">${esc(r[0])}</span><span class="ds-ht"><i style="width:${Math.round(r[1] / max * 100)}%"></i></span><span class="ds-hv num">${dNum(r[1])}${r[2] ? ' <small>' + r[2] + '</small>' : ''}</span></div>`).join('')}${tail}</div>`;
}
function dWhoTimes(r){
  const ss = dSessions(r).slice().reverse(), est = ss.some(x => x.est);
  const hours = Array(24).fill(0); dSessions(r).forEach(x => { hours[new Date(x.from).getHours()] += x.secs || 60; });
  const mx = Math.max(1, ...hours);
  return `<div class="ds-who"><h3>Kdy aplikaci používal(a): ${dName(r.id)}</h3>
    <p class="muted">Poprvé ${r.first ? dWhen(r.first) : '—'}, naposledy ${dWhen(r.last)} · ${ss.length} ${ss.length === 1 ? 'sezení' : 'sezení'}, aktivně ${dDur(dSum(r.secs))}${est ? ' · starší sezení jsou odvozená z kroků, bez aktivního času' : ''}</p>
    <div class="ds-hours" aria-label="Rozložení podle hodiny dne">${hours.map((v, h) => `<span title="${h}:00–${h}:59 · ${dDur(v)}" style="--a:${v ? .15 + .85 * v / mx : 0}"><i>${h % 6 ? '' : h}</i></span>`).join('')}</div>
    ${dTable(['Den', 'Od', 'Do', 'Délka', 'Aktivně'], ss.slice(0, 30).map(x => [dDate(x.from), dTime(x.from), dTime(x.to), dDur(Math.max(0, Math.round((x.to - x.from) / 1000))), x.est ? '—' : dDur(x.secs)]), 'Zatím žádné sezení.')}</div>`;
}
function dHeat(rows){
  const g = Array.from({length:7}, () => Array(24).fill(0)); let any = 0;
  rows.forEach(r => dSessions(r).forEach(x => { const d = new Date(x.from); g[(d.getDay() + 6) % 7][d.getHours()] += x.secs || 60; any++; }));
  if (!any) return '<p class="muted ds-empty">Zatím žádná sezení.</p>';
  const mx = Math.max(1, ...g.flat()), DN = ['Po','Út','St','Čt','Pá','So','Ne'];
  return `<div class="ds-heat" role="img" aria-label="Kdy lidé tutoriál používají podle dne a hodiny"><span></span>${Array.from({length:24}, (_, h) => `<span class="hh">${h % 3 ? '' : h}</span>`).join('')}
    ${g.map((row, d) => `<span class="hd">${DN[d]}</span>` + row.map((v, h) => `<span class="hc" title="${DN[d]} ${h}:00 · ${dDur(v)}" style="--a:${v ? .12 + .88 * v / mx : 0}"></span>`).join('')).join('')}</div>`;
}
function dTable(head, rows, empty){
  if (!rows.length) return `<p class="muted">${empty || 'Zatím žádná data.'}</p>`;
  return `<div class="tw ds-tw" tabindex="0" role="region" aria-label="${esc(String(head[0]).replace(/<[^>]+>/g, ''))}: tabulka, posouvá se do strany"><table><thead><tr>${head.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}
function dCardLabel(k){
  const [wid, di, ci] = k.split('.'), w = W.find(x => x.id === wid), d = w && w.days[+di], c = d && d.cards && d.cards[+ci];
  return c ? esc(w.title + ' › ' + d.d + ' › ' + plain(c.t)) : esc(k);
}
function dClickLabel(k){
  const m = k.match(/^(modul|náhled|kvíz|skokový test) (\w+)$/), w = m && W.find(x => x.id === m[2]);
  if (w) return esc({modul:'Modul', 'náhled':'Náhled modulu', 'kvíz':'Kvíz', 'skokový test':'Skokový test'}[m[1]] + ': ' + w.title);
  if (k.startsWith('karta ')) return 'Karta: ' + dCardLabel(k.slice(6));
  if (k.startsWith('opora ')) return esc('Opora: ' + tLocLabel(k.slice(6)));
  if (k.startsWith('role ')) return esc('Výběr role: ' + (ROLES[k.slice(5)] || k.slice(5)));
  if (k.startsWith('úkol ')) { const [wid, di, ti] = k.slice(5).split('.'), w2 = W.find(x => x.id === wid), t = w2 && w2.days[+di] && w2.days[+di].todo[+ti]; return t ? esc('Úkol: ' + w2.days[+di].d + ' ' + plain(t.t)) : esc(k); }
  if (k.startsWith('lekce ')) { const [, wid, di] = k.split(' '), w3 = W.find(x => x.id === wid), d = w3 && w3.days[+di]; return d ? esc('Lekce: ' + d.d + ' ' + plain(d.t)) : esc(k); }
  return esc(k.charAt(0).toUpperCase() + k.slice(1));
}
function dashMd(){
  const open = DASH.fb.filter(f => !DASH.state.done[f.id]);
  return '# Zpětná vazba z tutoriálu (otevřená)\n\n' + (open.length ? open.map(f => `- [ ] **${(FB_KINDS.find(k => k[0] === f.kind) || [0, f.kind])[1]}** · ${f.where}\n  - Kdo: ${DASH.names[f.uid] || 'neznámý uživatel'}${f.role ? ' (' + ROLES[f.role] + ')' : ''}, ${dWhen(f.at)}\n  - Co: ${f.text.replace(/\n/g, ' ')}\n  - Návrh: ${(f.fix || '—').replace(/\n/g, ' ')}`).join('\n') : 'Nic otevřeného.') + '\n';
}
function renderDash(){
  if (!TRK.owner) { app.innerHTML = shell('dash', `<div class="mh c-indigo"><span class="eyebrow">Dashboard</span><h1>Jen pro vlastníka tutoriálu</h1><p>Přehled průchodu vidí jen vlastník a editoři stránky.</p></div>`); return; }
  if (!DASH.rows) {
    app.innerHTML = shell('dash', `<div id="dash"><div class="mh c-indigo"><span class="eyebrow">Dashboard</span><h1>Jak lidé procházejí tutoriálem</h1><p>${DASH.err ? esc(DASH.err) + ' <button class="btn sm" type="button" data-dash="reload">Načíst znovu</button>' : 'Načítám data…'}</p></div></div>`);
    if (!DASH.err) dashLoad(); return;
  }
  if (DASH.tab === 'ver') return renderDashVer();
  if (DASH.tab === 'pohyb') return renderDashFlow();
  const all = DASH.rows, rows = DASH.withMe ? all : all.filter(r => r.id !== TRK.uid), n = rows.length, now = tNow();
  const act7 = rows.filter(r => now - r.last < 7 * 864e5).length, today = rows.reduce((s, r) => s + ((r.visits || {})[tDay()] || 0), 0);
  const days = Array.from({length:DASH.days}, (_, i) => dKey(DASH.days - 1 - i));
  const visitBars = days.map(k => [k, rows.reduce((s, r) => s + ((r.visits || {})[k] ? 1 : 0), 0), k.slice(8) + '.']);
  const totSecs = rows.reduce((s, r) => s + dSum(r.secs), 0), totVisits = rows.reduce((s, r) => s + dSum(r.visits), 0);
  const mod = (r, id) => ((r.prog || {}).mods || {})[id] || [0, 1, 0, 0, 0, 0, 0];
  const roleMod = r => r.role && W.find(w => w.role === r.role);
  const steps = [
    ['Otevřeli stránku', rows.length],
    ['Vybrali si roli', rows.filter(r => r.role).length],
    ['Prošli SPOCK nanečisto', rows.filter(r => (r.prog || {}).sim).length],
    ['Zodpověděli první kartu', rows.filter(r => mod(r, 'l0')[5] > 0).length],
    ['Dokončili úroveň 0 včetně kvízu', rows.filter(r => mod(r, 'l0')[0] === mod(r, 'l0')[1]).length],
    ['Začali Přípravu', rows.filter(r => mod(r, 'l1')[0] > 0).length],
    ['Dokončili Přípravu', rows.filter(r => mod(r, 'l1')[0] === mod(r, 'l1')[1]).length],
    ['Dokončili modul své role', rows.filter(r => { const w = roleMod(r); return w && mod(r, w.id)[0] === mod(r, w.id)[1]; }).length],
    ['Dokončili Pokročilý', rows.filter(r => mod(r, 'l3')[0] === mod(r, 'l3')[1]).length],
    ['Dokončili Superuser (jen GM)', rows.filter(r => mod(r, 'l4')[0] === mod(r, 'l4')[1]).length]];
  const funnel = steps.map((s, i) => [s[0], s[1], i && steps[i - 1][1] ? Math.round(100 * s[1] / steps[i - 1][1]) + ' % z předchozího' : '']);
  // kde se ztrácejí
  const stuck = rows.filter(r => now - r.last > 3 * 864e5 && (r.prog || {}).pct < 100);
  const stuckBy = {}; stuck.forEach(r => tInc(stuckBy, (r.prog || {}).loc || 'home'));
  const wrong = {}; rows.forEach(r => (r.wrong || []).forEach(k => tInc(wrong, k)));
  const answered = {}; rows.forEach(r => W.forEach(w => { /* počet lidí, kteří modul začali */ if (mod(r, w.id)[5] > 0) tInc(answered, w.id); }));
  const devs = {}; rows.forEach(r => (r.devs || []).forEach(k => tInc(devs, k)));
  const ptr = {}; rows.forEach(r => Object.entries(r.ptries || {}).forEach(([k, v]) => { if (v > 1) tInc(ptr, k, v); }));
  const lockedC = {}; rows.forEach(r => Object.entries(r.locked || {}).forEach(([k, v]) => tInc(lockedC, k, v)));
  const quizF = {}; rows.forEach(r => Object.entries(r.quiz || {}).forEach(([k, q]) => { const o = quizF[k] = quizF[k] || {tries:0, fails:0, people:0}; o.tries += q.tries || 0; o.fails += q.fails || 0; o.people++; }));
  const halfLessons = []; W.forEach(w => { const started = rows.filter(r => mod(r, w.id)[5] > 0 || mod(r, w.id)[0] > 0).length, fin = rows.filter(r => mod(r, w.id)[0] === mod(r, w.id)[1]).length; if (started) halfLessons.push([esc(w.title), started, fin, Math.round(100 * fin / started) + ' %']); });
  // kliky a stránky
  const clicks = {}, pv = {}, tm = {};
  rows.forEach(r => { Object.entries(r.clicks || {}).forEach(([k, v]) => tInc(clicks, k, v)); Object.entries(r.pv || {}).forEach(([k, v]) => tInc(pv, k, v)); Object.entries(r.tm || {}).forEach(([k, v]) => tInc(tm, k, v)); });
  const top = (o, m) => Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, m);
  // výkon
  const P = k => rows.flatMap(r => ((r.perf || {})[k]) || []);
  const mob = rows.filter(r => (r.dev || {}).mobile), desk = rows.filter(r => !(r.dev || {}).mobile);
  const errs = rows.flatMap(r => (((r.perf || {}).errs) || []).map(e => [e[0], e[1], e[2], r.id])).sort((a, b) => b[0] - a[0]).slice(0, 15);
  const sizes = rows.map(r => (r.perf || {}).size).filter(Boolean);
  // Spock
  const sp = rows.reduce((o, r) => { const s = r.spock || {}; o.n += s.n || 0; o.tin += s.tin || 0; o.tout += s.tout || 0; o.err += s.err || 0; o.ms = o.ms.concat(s.ms || []); if (s.n) o.people++; return o; }, {n:0, tin:0, tout:0, err:0, ms:[], people:0});
  const openFb = DASH.fb.filter(f => !DASH.state.done[f.id]);
  const sel = DASH.sel && all.find(r => r.id === DASH.sel);
  const people = rows.slice().sort((a, b) => b.last - a.last).slice(0, DASH.allL ? rows.length : 50).map(r => [
    `<button class="linkbtn" type="button" data-dash="who:${esc(r.id)}">${dName(r.id)}${r.id === TRK.uid ? ' (vy)' : ''}</button>`, r.role ? esc(ROLES[r.role]) : '—', r.first ? `<span class="ds-nw">${dWhen(r.first)}</span>` : '—', `<span class="ds-nw">${dWhen(r.last)}</span><small class="muted ds-ago">${dAgo(r.last)}</small>`, dNum(dSessions(r).length), dDur(dSum(r.secs)),
    `<span class="ds-nw"><span class="ds-pct"><i style="width:${(r.prog || {}).pct || 0}%"></i></span> ${(r.prog || {}).pct || 0} %</span>`, esc(tLocLabel((r.prog || {}).loc || 'home')), dNum((r.prog || {}).xp || 0), (r.dev || {}).mobile ? 'mobil' : 'počítač']);
  app.innerHTML = shell('dash', `<div id="dash">${dTabs()}
    <div class="mh c-indigo"><span class="eyebrow">Dashboard · jen pro vlastníka</span><h1>Jak lidé procházejí tutoriálem</h1>
      <p>Data z databáze stránky, načtená ${dWhen(DASH.at)}. Měří se jen lidé přihlášení na claude.ai s právem zápisu (sdílení jako Přispěvatel). <button class="btn sm" type="button" data-dash="reload">${DASH.loading ? 'Načítám…' : 'Načíst znovu'}</button>
      <label class="ds-chk"><input type="checkbox" data-dash="me" ${DASH.withMe ? 'checked' : ''}> Započítat i mě</label></p></div>
    <div class="ds-tiles">${dTile('Lidé celkem', n)}${dTile('Aktivní za 7 dní', act7)}${dTile('Návštěv dnes', today)}${dTile('Návštěv celkem', dNum(totVisits))}${dTile('Čas na stránce', dDur(totSecs), n ? 'průměr ' + dDur(Math.round(totSecs / n)) + ' na člověka' : '')}${dTile('Dokončili úroveň 0', steps[4][1], n ? Math.round(100 * steps[4][1] / n) + ' % lidí' : '')}${dTile('Otevřená zpětná vazba', openFb.length, DASH.fb.length + ' celkem')}${dTile('Dotazy na Spocka', dNum(sp.n), 'lidí: ' + sp.people)}</div>

    <div class="sec-h"><h2>Zpětná vazba k vyřízení</h2><p>Každá položka je úkol: kdo ji napsal, kde a co navrhuje. Odškrtnutím ji uzavřete.</p></div>
    ${DASH.fb.length ? `<div class="ds-fb">${DASH.fb.map(f => `<label class="ds-fbi ${DASH.state.done[f.id] ? 'done' : ''}"><input type="checkbox" data-dash="fb:${esc(f.id)}" ${DASH.state.done[f.id] ? 'checked' : ''}><span><b>${esc((FB_KINDS.find(k => k[0] === f.kind) || [0, f.kind])[1])}</b> · ${esc(f.where || '')}<small>${dName(f.uid)}${f.role ? ' · ' + esc(ROLES[f.role]) : ''} · ${dWhen(f.at)}</small><span class="ds-fbt">${esc(f.text)}</span>${f.fix ? `<span class="ds-fbf"><b>Návrh:</b> ${esc(f.fix)}</span>` : ''}${f.loc && f.loc.includes('/') ? `<button class="linkbtn" type="button" data-dash="open:${esc(f.loc)}">Otevřít to místo</button>` : ''}</span></label>`).join('')}</div>
      <p><button class="btn sm" type="button" data-dash="md">Zkopírovat otevřené jako Markdown do TODO</button></p>` : '<p class="muted">Zatím nikdo nic nenapsal. Tlačítko „Zpětná vazba“ je nahoře v liště na každé stránce.</p>'}

    <div class="sec-h"><h2>Návštěvy</h2><p>Kolik různých lidí přišlo v posledních ${DASH.days} dnech.</p></div>
    ${dBars(visitBars, ' lidí')}

    <div class="sec-h"><h2>Trychtýř cesty</h2><p>Kolik lidí došlo ke kterému kroku.</p></div>
    ${dHBars(funnel, n)}

    <div class="sec-h"><h2>Kde se lidé ztrácejí</h2></div>
    <div class="ds-grid">
      <div><h3>Kde skončili ti, kdo se 3 dny nevrátili</h3>${dTable(['Místo', 'Lidí'], top(stuckBy, 10).map(([k, v]) => [esc(tLocLabel(k)), v]), 'Nikdo nedokončený není déle než 3 dny pryč.')}</div>
      <div><h3>Karty s nejvíc špatnými odpověďmi</h3>${dTable(['Karta', 'Špatně'], top(wrong, 10).map(([k, v]) => [dCardLabel(k), v]), 'Zatím žádná špatná odpověď.')}</div>
      <div><h3>Moduly: začali a dokončili</h3>${dTable(['Modul', 'Začali', 'Dokončili', 'Dokončení'], halfLessons)}</div>
      <div><h3>Kvízy a skokové testy</h3>${dTable(['Test', 'Lidí', 'Pokusů', 'Nesplněno'], Object.entries(quizF).map(([k, q]) => { const [id, m] = k.split(':'), w = W.find(x => x.id === id); return [esc((m === 'jump' ? 'Skokový test: ' : 'Kvíz: ') + (w ? w.title : id)), q.people, q.tries, q.fails + (q.tries ? ' (' + Math.round(100 * q.fails / q.tries) + ' %)' : '')]; }), 'Zatím nikdo kvíz nespustil.')}</div>
      <div><h3>Odchylky agentů, které lidé viděli ve VS Code</h3>${dTable(['Úkol', 'Lidí'], top(devs, 10).map(([k, v]) => [dClickLabel('úkol ' + k), v]), 'Nikdo zatím odchylku nenahlásil.')}</div>
      <div><h3>Ověření z VS Code s nejvíc pokusy</h3>${dTable(['Úkol', 'Pokusů celkem'], top(ptr, 10).map(([k, v]) => [dClickLabel('úkol ' + k), v]), 'Zatím žádné ověření.')}</div>
      <div><h3>Kliknutí na zamčený modul</h3>${dTable(['Modul', 'Kliknutí'], top(lockedC, 9).map(([k, v]) => [esc((W.find(w => w.id === k) || {title:k}).title), v]), 'Nikdo neklikal na zamčený modul.')}</div>
    </div>

    <div class="sec-h"><h2>Lidé</h2><p>Kliknutím na jméno uvidíte, kdy aplikaci používal(a) a jeho poslední kroky. Časy jsou ve vašem časovém pásmu.</p></div>
    ${dTable(['Kdo', 'Role', 'Poprvé', 'Naposledy', 'Sezení', 'Čas', 'Pokrok', 'Kde je', 'XP', 'Zařízení'], people, 'Zatím nikdo.')}
    ${rows.length > 50 && !DASH.allL ? `<p><button class="btn sm" type="button" data-dash="alll">Zobrazit všech ${rows.length} lidí</button> <span class="muted">Řazeno podle poslední návštěvy.</span></p>` : ''}
    ${sel ? dWhoTimes(sel) : ''}
    ${sel ? `<div class="ds-who"><h3>Poslední kroky: ${dName(sel.id)} <button class="btn sm" type="button" data-dash="who:">Zavřít</button></h3>${dTable(['Kdy', 'Co', 'Kde nebo na co'], (sel.ev || []).slice(-80).reverse().map(e => [dWhen(e[0]), esc(e[1]), e[1] === 'view' ? esc(tLocLabel(e[2])) : e[1] === 'klik' ? dClickLabel(e[2]) : esc(e[2])]), 'Žádné kroky.')}</div>` : ''}

    <div class="sec-h"><h2>Kdy lidé tutoriál používají</h2><p>Aktivní čas podle dne v týdnu a hodiny začátku sezení. Čím tmavší, tím víc.</p></div>
    ${dHeat(rows)}

    <div class="sec-h"><h2>Kam lidé klikají a co čtou</h2></div>
    <div class="ds-grid">
      <div><h3>Nejčastější kliknutí</h3>${dTable(['Na co', 'Kliknutí'], top(clicks, 15).map(([k, v]) => [dClickLabel(k), dNum(v)]))}</div>
      <div><h3>Nejnavštěvovanější místa</h3>${dTable(['Místo', 'Zobrazení', 'Čas celkem'], top(pv, 15).map(([k, v]) => [esc(tLocLabel(k)), dNum(v), dDur(tm[k] || 0)]))}</div>
    </div>

    <div class="sec-h"><h2>Výkon a rychlost stránky</h2><p>Měřeno v prohlížečích návštěvníků. Medián je typická hodnota, P90 zažije nejpomalejší desetina.</p></div>
    <div class="ds-tiles">${dTile('Načtení stránky', dMs(dMed(P('load'))), 'P90 ' + dMs(dP90(P('load'))))}${dTile('První vykreslení', dMs(dMed(P('fcp'))), 'P90 ' + dMs(dP90(P('fcp'))))}${dTile('Překreslení obrazovky', dMs(dMed(P('render'))), 'P90 ' + dMs(dP90(P('render'))))}${dTile('Velikost stránky', sizes.length ? Math.round(dMed(sizes) / 1024) + ' kB' : '—', 'bez videa')}${dTile('Načtení na mobilu', dMs(dMed(mob.flatMap(r => (r.perf || {}).load || []))), 'lidí: ' + mob.length)}${dTile('Načtení na počítači', dMs(dMed(desk.flatMap(r => (r.perf || {}).load || []))), 'lidí: ' + desk.length)}${dTile('Chyby v prohlížeči', errs.length, 'posledních 15')}${dTile('Tmavý režim', rows.filter(r => (r.dev || {}).dark).length, 'z ' + n + ' lidí')}</div>
    ${errs.length ? dTable(['Kdy', 'Chyba', 'Kde', 'Komu'], errs.map(e => [dWhen(e[0]), esc(e[1]), esc(tLocLabel(e[2])), dName(e[3])])) : ''}

    <div class="sec-h"><h2>Spock a tokeny</h2><p>Počet tokenů je <b>odhad</b> z délky textu (asi 3,5 znaku na token). Claude stránce skutečnou spotřebu nesděluje. Dotazy se počítají z účtu každého uživatele, ne z vašeho.</p></div>
    <div class="ds-tiles">${dTile('Dotazů', dNum(sp.n))}${dTile('Tokeny na vstupu', dNum(sp.tin), 'odhad')}${dTile('Tokeny na výstupu', dNum(sp.tout), 'odhad')}${dTile('Na jeden dotaz', sp.n ? dNum((sp.tin + sp.tout) / sp.n) : '—', 'odhad tokenů')}${dTile('Doba odpovědi', dMs(dMed(sp.ms)), 'P90 ' + dMs(dP90(sp.ms)))}${dTile('Neúspěšné dotazy', sp.err)}</div>
    ${dTable(['Kdo', 'Dotazů', 'Tokeny celkem (odhad)'], rows.filter(r => (r.spock || {}).n).sort((a, b) => b.spock.n - a.spock.n).slice(0, 10).map(r => [dName(r.id), r.spock.n, dNum(r.spock.tin + r.spock.tout)]), 'Zatím se nikdo Spocka neptal.')}
  </div>`);
}
document.addEventListener('click', async e => {
  const b = e.target.closest('[data-dash]'); if (!b || b.type === 'checkbox') return;
  const [cmd, arg] = [b.dataset.dash.split(':')[0], b.dataset.dash.split(':').slice(1).join(':')];
  if (cmd === 'reload') { DASH.rows = DASH.rows || null; await dashLoad(); }
  else if (cmd === 'tab') { DASH.tab = arg; renderDash(); window.scrollTo({top:0}); }
  else if (cmd === 'fdays') { FLF.days = +arg; renderDash(); }
  else if (cmd === 'frole') { FLF.role = arg; renderDash(); }
  else if (cmd === 'fdev') { FLF.dev = arg; renderDash(); }
  else if (cmd === 'fplace') { FLF.place = FLF.place === arg ? '' : arg; renderDash(); }
  else if (cmd === 'alll') { DASH.allL = true; renderDash(); }
  else if (cmd === 'allp') { DASH.allP = true; renderDash(); }
  else if (cmd === 'live') { DASH.live = DASH.live === false; renderDash(); if (DASH.live) dashLoad(); }
  else if (cmd === 'flow') { DASH.sel = arg || null; renderDash(); const el = document.querySelector('.fl-who'); if (el) el.scrollIntoView({block:'start'}); }
  else if (cmd === 'who') { DASH.sel = arg || null; renderDash(); const el = document.querySelector('.ds-who'); if (el) el.scrollIntoView({block:'start'}); }
  else if (cmd === 'md') { try { await navigator.clipboard.writeText(dashMd()); toast('Zkopírováno. Vložte do revize/TODO-ZPETNA-VAZBA.md'); } catch (err) { toast('Kopírování se nepodařilo'); } }
  else if (cmd === 'open') { const [id, les] = arg.split('/'), w = W.find(x => x.id === id); if (w) { const di = w.days.findIndex(d => d.d === les); view.lesson = Math.max(0, di); view.lessonOf = id; go('week', {week:id, peek:id}); } }
});
document.addEventListener('change', async e => {
  const t = e.target; if (!t.dataset || !t.dataset.dash) return;
  if (t.dataset.dash === 'me') { DASH.withMe = t.checked; renderDash(); return; }
  if (t.dataset.dash.startsWith('fb:')) {
    const id = t.dataset.dash.slice(3); if (t.checked) DASH.state.done[id] = tNow(); else delete DASH.state.done[id];
    try { await TRK.db.doc('todo/state').set(JSON.parse(JSON.stringify(DASH.state))); } catch (err) { toast('Uložení se nepodařilo'); }
    renderDash();
  }
});

/* ---------- dashboard: záložka Verze a kvalita ---------- */
function dTabs(){ return `<div class="ds-tabs" role="tablist">${[['lide','Lidé a průchod'],['pohyb','Pohyb a problémová místa'],['ver','Verze a kvalita']].map(t => `<button type="button" role="tab" aria-selected="${DASH.tab === t[0]}" class="${DASH.tab === t[0] ? 'on' : ''}" data-dash="tab:${t[0]}">${t[1]}</button>`).join('')}</div>`; }
const vTok = n => Math.round((n || 0) / 3.5);
const vCtxMax = v => v && v.e2e && v.e2e.ctx ? Math.max(0, ...Object.values(v.e2e.ctx)) : null;
const vLab = (v, tag, k) => v && v.e2e && v.e2e.lab && v.e2e.lab[tag] ? v.e2e.lab[tag][k] : null;
/* změna proti předchozí verzi: text + slovní hodnocení (ne jen barva) */
function vDelta(cur, prev, pctLimit, absLimit){
  if (cur === null || cur === undefined || prev === null || prev === undefined || !prev) return {txt:'', bad:false, good:false};
  const d = cur - prev, pct = Math.round(100 * d / prev);
  if (!d) return {txt:'beze změny', bad:false, good:false};
  const bad = d > 0 && pct >= pctLimit && Math.abs(d) >= (absLimit || 0), good = d < 0 && -pct >= pctLimit;
  return {txt:(d > 0 ? '+' : '−') + Math.abs(pct) + ' %' + (bad ? ' · horší' : good ? ' · lepší' : ''), bad, good};
}
const vCell = (val, dl) => `${val}${dl && dl.txt ? ` <small class="${dl.bad ? 'ds-bad' : dl.good ? 'ds-good' : ''}">${dl.txt}</small>` : ''}`;
/* Načtení v testu se srovnává jen mezi verzemi měřenými mediánem ze 7 načtení o samotě (m: 'median7').
   Starší verze měřily jednou za souběžného běhu testů; to kolísalo o desítky procent a hlásilo zhoršení, které nebylo. */
function vLoadDelta(v, p, tag){
  if (vLab(v, tag, 'm') !== 'median7' || vLab(p, tag, 'm') !== 'median7') return {txt:'', bad:false, good:false};
  return vDelta(vLab(v, tag, 'load'), vLab(p, tag, 'load'), 20, 30);
}
function vField(ver, k){ return dMed((DASH.rows || []).flatMap(r => ((r.perfv || {})[ver] || {})[k] || [])); }
function renderDashVer(){
  const vers = DASH.vers.slice(), cur = vers.find(v => v.ver === BUILD.ver) || BUILD, i = vers.findIndex(v => v.ver === cur.ver), prev = i > 0 ? vers[i - 1] : null;
  const e = cur.e2e, P = prev || {};
  const kB = n => Math.round((n || 0) / 1024) + ' kB';
  const dSize = vDelta((cur.size || {}).html, (P.size || {}).html, 5, 10240);
  const dLoadD = vLoadDelta(cur, P, 'počítač'), dLoadM = vLoadDelta(cur, P, 'mobil');
  const dRenD = vDelta(vLab(cur, 'počítač', 'render'), vLab(P, 'počítač', 'render'), 20, 3), dRenM = vDelta(vLab(cur, 'mobil', 'render'), vLab(P, 'mobil', 'render'), 20, 3);
  const dCtx = vDelta(vCtxMax(cur), vCtxMax(P), 10, 3500), dEdit = vDelta((cur.edit || {}).celkem, (P.edit || {}).celkem, 10, 2000);
  const fLoad = vField(cur.ver, 'load'), fLoadP = prev ? vField(prev.ver, 'load') : null, fRen = vField(cur.ver, 'render'), fRenP = prev ? vField(prev.ver, 'render') : null;
  const dFL = vDelta(fLoad, fLoadP, 20, 50), dFR = vDelta(fRen, fRenP, 20, 3);
  // co je potřeba dodělat
  const todo = [];
  if (!e) todo.push(['Testy', 'Pro tuto verzi neběžely end-to-end testy, nebo se web po nich změnil. Spusťte testy a web sestavte znovu (postup je ve web/README.md).']);
  else (e.failed || []).forEach(f => todo.push(['Neprošel test', f]));
  [['Scénáře', cur.scen, 'nastroje/e2e/scenare.js'], ['Přístupnost', cur.a11y, 'nastroje/e2e/pristupnost.js'], ['Výkon', cur.perf, 'nastroje/e2e/vykon.js']].forEach(([n, r, f]) => {
    if (!r) todo.push([n, 'Pro tuto verzi neběžel test ' + f + ', nebo se web po něm změnil.']);
    else (r.failed || []).forEach(x => todo.push([n + ': neprošlo', x]));
  });
  [[dSize, 'Stránka je větší', kB((P.size || {}).html) + ' → ' + kB((cur.size || {}).html) + '. Větší stránka se déle načítá, hlavně na mobilu.'],
   [dLoadD, 'Pomalejší načtení na počítači (v testu)', dMs(vLab(P, 'počítač', 'load')) + ' → ' + dMs(vLab(cur, 'počítač', 'load'))],
   [dLoadM, 'Pomalejší načtení na mobilu (v testu)', dMs(vLab(P, 'mobil', 'load')) + ' → ' + dMs(vLab(cur, 'mobil', 'load'))],
   [dRenD, 'Pomalejší překreslení na počítači (v testu)', dMs(vLab(P, 'počítač', 'render')) + ' → ' + dMs(vLab(cur, 'počítač', 'render'))],
   [dRenM, 'Pomalejší překreslení na mobilu (v testu)', dMs(vLab(P, 'mobil', 'render')) + ' → ' + dMs(vLab(cur, 'mobil', 'render'))],
   [dFL, 'Pomalejší načtení u skutečných lidí', dMs(fLoadP) + ' → ' + dMs(fLoad)],
   [dFR, 'Pomalejší překreslení u skutečných lidí', dMs(fRenP) + ' → ' + dMs(fRen)],
   [dCtx, 'Dotaz na Spocka je dražší', dNum(vTok(vCtxMax(P))) + ' → ' + dNum(vTok(vCtxMax(cur))) + ' tokenů na dotaz (odhad, největší modul).'],
   [dEdit, 'Další úpravy budou dražší', dNum((P.edit || {}).celkem) + ' → ' + dNum((cur.edit || {}).celkem) + ' tokenů na přečtení zdrojů (odhad).']
  ].forEach(([d, t, x]) => { if (d.bad) todo.push([t + ' (' + d.txt.replace(' · horší', '') + ')', x]); });
  const ctxRows = e && e.ctx ? W.map(w => { const c = e.ctx[w.id], p = P.e2e && P.e2e.ctx ? P.e2e.ctx[w.id] : null; return [esc(w.title), vCell(dNum(vTok(c)), vDelta(c, p, 10, 3500))]; }) : [];
  const ed = cur.edit || {}, pe = P.edit || {};
  const hist = vers.slice().reverse().map((v, j, arr) => { const p = arr[j + 1] || null, pp = p || {};
    return [`<b>${esc(v.ver)}</b>${v.ver === BUILD.ver ? ' <small>(tato)</small>' : ''}<small class="ds-vt">${esc(v.date || '')} · ${esc(v.title || '')}</small>`,
      v.e2e ? (v.e2e.fail ? `<span class="ds-bad">✕ ${v.e2e.fail} neprošlo</span> z ${v.e2e.total}` : `<span class="ds-good">✓ ${v.e2e.pass}/${v.e2e.total}</span>`) : '<span class="muted">neběžely</span>',
      vCell(kB((v.size || {}).html), vDelta((v.size || {}).html, (pp.size || {}).html, 5, 10240)),
      vCell(dMs(vLab(v, 'mobil', 'load')) + (vLab(v, 'mobil', 'load') !== null && vLab(v, 'mobil', 'm') !== 'median7' ? ' <small class="muted">orientačně</small>' : ''), vLoadDelta(v, pp, 'mobil')),
      vCell(dMs(vLab(v, 'mobil', 'render')), vDelta(vLab(v, 'mobil', 'render'), vLab(pp, 'mobil', 'render'), 20, 3)),
      vCell(vCtxMax(v) === null ? '—' : dNum(vTok(vCtxMax(v))), vDelta(vCtxMax(v), vCtxMax(pp), 10, 3500)),
      vCell(dNum((v.edit || {}).celkem || 0), vDelta((v.edit || {}).celkem, (pp.edit || {}).celkem, 10, 2000)),
      (v.counts || {}).karty !== undefined ? `${v.counts.karty} karet · ${v.counts.kviz} otázek · ${v.counts.ukoly} úkolů` : '—']; });
  app.innerHTML = shell('dash', `<div id="dash">${dTabs()}
    <div class="mh c-indigo"><span class="eyebrow">Dashboard · verze a kvalita</span><h1>Verze ${esc(cur.ver || '?')}${cur.date ? ' z ' + esc(cur.date) : ''}</h1>
      <p>${esc(cur.title || '')}. Porovnání je vždy s předchozí zaznamenanou verzí${prev ? ' (' + esc(prev.ver) + ')' : ', ta zatím není'}. Historie se plní od chvíle, kdy tuhle záložku u nové verze poprvé otevřete. <button class="btn sm" type="button" data-dash="reload">${DASH.loading ? 'Načítám…' : 'Načíst znovu'}</button></p></div>

    <div class="ds-tiles">${dTile('End-to-end testy', e ? (e.fail ? '✕ ' + e.fail + ' neprošlo' : '✓ ' + e.pass + '/' + e.total) : 'neběžely', e ? 'trvaly ' + dDur(Math.round(e.durMs / 1000)) : 'viz úkoly níže')}${dTile('Velikost stránky', kB((cur.size || {}).html), dSize.txt || 'bez videa')}${dTile('Načtení v testu', dMs(vLab(cur, 'mobil', 'load')), 'mobil' + (dLoadM.txt ? ' · ' + dLoadM.txt : ''))}${dTile('Překreslení v testu', dMs(vLab(cur, 'mobil', 'render')), 'mobil' + (dRenM.txt ? ' · ' + dRenM.txt : ''))}${dTile('Tokeny na dotaz Spockovi', vCtxMax(cur) === null ? '—' : dNum(vTok(vCtxMax(cur))), 'odhad, největší modul' + (dCtx.txt ? ' · ' + dCtx.txt : ''))}${dTile('Tokeny na přečtení zdrojů', dNum(ed.celkem || 0), 'odhad' + (dEdit.txt ? ' · ' + dEdit.txt : ''))}</div>

    <div class="sec-h"><h2>Co je potřeba dodělat</h2><p>Neprošlé testy a všechno, co se proti předchozí verzi znatelně zhoršilo.</p></div>
    ${todo.length ? `<div class="ds-fb">${todo.map(t => `<div class="ds-fbi ds-vtodo"><span aria-hidden="true">!</span><span><b>${esc(t[0])}</b><span class="ds-fbt">${esc(t[1])}</span></span></div>`).join('')}</div>` : `<p class="ds-okline"><b>✓ Nic.</b> ${e ? 'Všechny testy prošly a nic se znatelně nezhoršilo.' : ''}</p>`}

    <div class="sec-h"><h2>End-to-end testy</h2><p>Automatický průchod webem na počítači i mobilu. Běží před publikací a na GitHubu při každé změně.</p></div>
    ${e ? dTable(['Kontrol', 'Prošlo', 'Neprošlo', 'Doba běhu', 'Kdy'], [[e.total, e.pass, e.fail, dDur(Math.round(e.durMs / 1000)), dWhen(e.at)]]) + (e.failed && e.failed.length ? dTable(['Co neprošlo'], e.failed.map(f => [esc(f)])) : '') : '<p class="muted">Výsledek testů u této verze chybí.</p>'}

    <div class="sec-h"><h2>Výkon a rychlost</h2><p>„V testu“ je měření v laboratorním prohlížeči při testech, hodí se k porovnání verzí. Načtení je medián ze sedmi načtení; u starších verzí šlo o jedno měření, proto je u nich jen orientační a neporovnává se. „U lidí“ je medián ze skutečných návštěv dané verze.</p></div>
    ${dTable(['Měření', 'Tato verze', 'Předchozí'], [
      ['Velikost stránky', vCell(kB((cur.size || {}).html), dSize), prev ? kB((P.size || {}).html) : '—'],
      ['Z toho kód', kB((cur.size || {}).js), prev ? kB((P.size || {}).js) : '—'], ['Z toho obsah lekcí', kB((cur.size || {}).data), prev ? kB((P.size || {}).data) : '—'],
      ['Načtení v testu, počítač', vCell(dMs(vLab(cur, 'počítač', 'load')), dLoadD), dMs(vLab(P, 'počítač', 'load'))], ['Načtení v testu, mobil', vCell(dMs(vLab(cur, 'mobil', 'load')), dLoadM), dMs(vLab(P, 'mobil', 'load'))],
      ['Překreslení v testu, počítač', vCell(dMs(vLab(cur, 'počítač', 'render')), dRenD), dMs(vLab(P, 'počítač', 'render'))], ['Překreslení v testu, mobil', vCell(dMs(vLab(cur, 'mobil', 'render')), dRenM), dMs(vLab(P, 'mobil', 'render'))],
      ['Načtení u lidí', vCell(dMs(fLoad), dFL), dMs(fLoadP)], ['Překreslení u lidí', vCell(dMs(fRen), dFR), dMs(fRenP)]])}

    <div class="sec-h"><h2>Náročnost na tokeny</h2><p>Všechna čísla jsou <b>odhad</b> z délky textu (asi 3,5 znaku na token).</p></div>
    <div class="ds-grid">
      <div><h3>Jeden dotaz na Spocka podle otevřeného modulu</h3><p class="muted">Tolik tokenů jde s každou zprávou jako kontext. Platí je uživatel ze svého účtu.</p>${dTable(['Modul', 'Tokenů na dotaz'], ctxRows, 'Změří se při testech.')}</div>
      <div><h3>Kolik stojí další úpravy</h3><p class="muted">Tolik tokenů musí Claude přečíst, než danou část upraví. Čím větší zdroje, tím dražší každá další změna.</p>${dTable(['Co se upravuje', 'Tokenů na přečtení'], [['Lekce (všechny)', vCell(dNum(ed.lekce || 0), vDelta(ed.lekce, pe.lekce, 10, 2000))], ['Aplikace (kód webu)', vCell(dNum(ed.aplikace || 0), vDelta(ed.aplikace, pe.aplikace, 10, 2000))], ['Vzhled', vCell(dNum(ed.vzhled || 0), vDelta(ed.vzhled, pe.vzhled, 10, 2000))], ['Testy a nástroje', vCell(dNum(ed.testy || 0), vDelta(ed.testy, pe.testy, 10, 2000))], ['<b>Celkem</b>', vCell('<b>' + dNum(ed.celkem || 0) + '</b>', dEdit)]])}
        <h3 style="margin-top:12px">Největší soubory</h3>${dTable(['Soubor', 'Tokenů'], (ed.top || []).map(t => [esc(t[0]), dNum(t[1])]))}</div>
    </div>

    <div class="sec-h"><h2>Historie verzí</h2><p>Nejnovější nahoře. Změna je proti verzi o řádek níž.</p></div>
    ${dTable(['Verze', 'Testy', 'Velikost', 'Načtení (mobil, test)', 'Překreslení (mobil, test)', 'Tokeny na dotaz', 'Tokeny na úpravy', 'Obsah'], hist, 'Zatím žádná zaznamenaná verze.')}
  </div>`);
}

/* ---------- Pohyb a problémová místa: jak se lidé po aplikaci pohybují ----------
   Z kroků každého člověka (zobrazení stránek, kliknutí, odpovědi, kvízy) se složí sezení a v nich cesta.
   Z cest se počítají přechody, vstupy a odchody, opakující se vzorce, bloudění a problémová místa. */
const FL = {IDLE:18e5, CAP:6e5};
const FLK = new Map();
function flKind(loc){ let k = FLK.get(loc); if (k === undefined) { k = flKind0(loc); FLK.set(loc, k); } return k; }
function flKind0(loc){ if (!loc) return 'jiné'; if (/^l|^pm|^pd|^se|^gm/.test(loc) && loc.includes('/')) return 'lekce'; return {home:'úvod', map:'opora', diag:'opora', gloss:'opora', cheat:'opora', ready:'opora', badges:'profil', sim:'simulace', ses:'kvíz', quiz:'kvíz', dash:'dashboard'}[loc] || 'jiné'; }
const flShort = loc => { const [id, les] = String(loc).split('/'), w = W.find(x => x.id === id); if (w && les) { const d = w.days.find(x => x.d === les); return les + (d ? ' ' + plain(d.t) : ''); } return tLocLabel(loc); };
/* cesta jednoho člověka: sezení → kroky {loc, from, dur, flags} */
function flJourney(r){
  let ev = (r.ev || []).filter(e => Array.isArray(e) && Number.isFinite(e[0])); if (ev.some((e, i) => i && e[0] < ev[i - 1][0])) ev = ev.slice().sort((a, b) => a[0] - b[0]); const ses = [];
  let cur = null, step = null;
  const close = t => { if (step) { step.dur = Math.max(0, Math.min(FL.CAP, (t || step.last) - step.from)); step = null; } };
  ev.forEach(e => {
    const [ts, type, key] = e;
    if (!cur || ts - cur.last > FL.IDLE) { close(cur && cur.last); cur = {from:ts, last:ts, steps:[]}; ses.push(cur); }
    cur.last = ts;
    if (type === 'view') { if (key === 'dash') { close(ts); return; } if (step && step.loc === key) return; close(ts); step = {loc:key, from:ts, last:ts, dur:0, wrong:0, right:0, rage:0, locked:0, proofBad:0, quizFail:0, quizOk:0, fb:0, clicks:0}; cur.steps.push(step); return; }
    if (!step) return; step.last = ts;
    if (type === 'karta') key.endsWith('špatně') ? step.wrong++ : step.right++;
    else if (type === 'opakovaný klik') step.rage++;
    else if (type === 'zamčeno') { step.locked++; (cur.locked = cur.locked || []).push(key); }
    else if (type === 'ověření' && key.endsWith('špatně')) step.proofBad++;
    else if ((type === 'kvíz' || type === 'skok') && key.endsWith('nesplněno')) step.quizFail++;
    else if ((type === 'kvíz' || type === 'skok') && key.endsWith('splněno')) step.quizOk++;
    else if (type === 'zpětná vazba') step.fb++;
    else if (type === 'klik') step.clicks++;
  });
  close(cur && cur.last);
  ses.forEach(x => { x.steps.forEach((st, i) => { st.end = i === x.steps.length - 1; }); });
  return ses.filter(x => x.steps.length);
}
function flAnalyze(rows){
  const A = {people:rows.length, sessions:0, steps:0, trans:{}, entry:{}, exit:{}, visits:{}, uniq:{}, dwell:{}, paths:{}, ping:{}, revisit:{}, wrong:{}, rage:{}, locked:{}, proofBad:{}, quizFail:{}, fb:{}, persons:[], lockedMod:{}, reached:{}};
  const add = (o, k, n) => { o[k] = (o[k] || 0) + (n === undefined ? 1 : n); };
  rows.forEach(r => {
    const J = flJourneyOf(r), seen = {}, P = {id:r.id, J, tags:[], stuck:null, sessions:J.length, steps:0, ping:0, back:0};
    const reached = new Set();
    J.forEach(x => {
      (x.locked || []).forEach(m => add(A.lockedMod, m));
      x.steps.forEach(st => reached.add(st.loc));
      A.sessions++; const L = x.steps.map(st => st.loc);
      add(A.entry, L[0]); if (x.steps.length) add(A.exit, L[L.length - 1]);
      x.steps.forEach((st, i) => {
        A.steps++; P.steps++; add(A.visits, st.loc); if (!seen[st.loc]) { seen[st.loc] = 0; add(A.uniq, st.loc); } else add(A.revisit, st.loc); seen[st.loc]++;
        (A.dwell[st.loc] = A.dwell[st.loc] || []).push(st.dur / 1000);
        if (i) add(A.trans, L[i - 1] + '→' + st.loc);
        if (i > 1 && L[i - 2] === st.loc && st.from - x.steps[i - 2].from < 9e4) { add(A.ping, [L[i - 1], st.loc].sort().join('↔')); P.ping++; }
        ['wrong', 'rage', 'locked', 'proofBad', 'quizFail', 'fb'].forEach(k => { if (st[k]) add(A[k], st.loc, st[k]); });
        if (!P.stuck || st.dur > P.stuck.dur) P.stuck = st;
      });
      const D = L.filter((l, i) => l !== L[i - 1]);
      for (let i = 0; i + 2 < D.length; i++) add(A.paths, D.slice(i, i + 3).map(flKind).join(' → '));
    });
    reached.forEach(l => add(A.reached, l));
    A.persons.push(P);
  });
  // problémová místa: skóre z odchodů, chyb, bloudění, zamčených klepnutí a doby
  const med = a => { const b = a.slice().sort((x, y) => x - y); return b.length ? b[Math.floor(b.length / 2)] : 0; };
  let medAllV = null; const medAllF = () => medAllV === null ? (medAllV = med(Object.values(A.dwell).flat())) : medAllV;
  const lessonMin = loc => { const [id, les] = String(loc).split('/'), w = W.find(x => x.id === id), d = w && w.days.find(x => x.d === les); return d ? dayLearn(d) + dayDo(d) : 0; };
  A.places = Object.keys(A.visits).filter(l => l !== 'dash').map(loc => {
    const v = A.visits[loc], u = A.uniq[loc] || 0, ex = A.exit[loc] || 0, md = med(A.dwell[loc] || []), est = lessonMin(loc);
    const pingN = Object.entries(A.ping).filter(([k]) => k.split('↔').includes(loc)).reduce((s, [, n]) => s + n, 0);
    const why = [];
    const exitRate = v ? ex / v : 0;
    if (ex && exitRate >= .4 && flKind(loc) !== 'úvod') why.push(['odchod', `${ex}× tu sezení skončilo (${Math.round(exitRate * 100)} % návštěv)`]);
    if (A.wrong[loc]) why.push(['chyby', `${A.wrong[loc]}× špatná odpověď na kartu`]);
    if (A.proofBad[loc]) why.push(['ověření', `${A.proofBad[loc]}× špatně u ověření z VS Code`]);
    if (A.quizFail[loc]) why.push(['kvíz', `${A.quizFail[loc]}× nesplněný kvíz`]);
    if (A.rage[loc]) why.push(['klikání', `${A.rage[loc]}× opakované klikání na stejné místo`]);
    if (A.locked[loc]) why.push(['zámek', `${A.locked[loc]}× klik na zamčený modul`]);
    if (pingN) why.push(['bloudění', `${pingN}× tam a zpět během minuty`]);
    if ((A.revisit[loc] || 0) >= 2 && u) why.push(['návraty', `${A.revisit[loc]} návratů od ${u} ${u === 1 ? 'člověka' : 'lidí'}`]);
    if (est && md > est * 60 * 1.6 && md > 120) why.push(['dlouho', `medián ${dDur(Math.round(md))}, odhad ${est} min`]);
    else if (!est && md > 180 && medAllF() && md > medAllF() * 4) why.push(['dlouho', `medián ${dDur(Math.round(md))}, běžně ${dDur(Math.round(medAllF()))}`]);
    if (est && md < est * 60 * .15 && v >= 2 && flKind(loc) === 'lekce') why.push(['proletěno', `medián ${dDur(Math.round(md))} při odhadu ${est} min`]);
    const W8 = {odchod:3, chyby:1.5, ověření:2, kvíz:2, klikání:3, zámek:1, bloudění:2, návraty:1, dlouho:1.5, proletěno:1};
    const score = why.reduce((sc, [k]) => sc + W8[k], 0) * Math.log2(1 + u);
    return {loc, v, u, ex, md, est, why, score};
  }).filter(p => p.why.length).sort((a, b) => b.score - a.score);
  // vzorce chování lidí
  A.persons.forEach(P => {
    const all = P.J.flatMap(x => x.steps), lessons = all.filter(st => flKind(st.loc) === 'lekce');
    const oporaFirst = P.J.length && P.J[0].steps.slice(0, 4).some(st => flKind(st.loc) === 'opora');
    if (P.J.length >= 3) P.tags.push(['vrací se', `${P.J.length} sezení`]);
    if (P.J.length === 1 && all.length <= 3) P.tags.push(['odešel brzy', 'jedno krátké sezení']);
    if (P.ping >= 2) P.tags.push(['bloudí', `${P.ping}× tam a zpět`]);
    if (lessons.length && lessons.filter(st => st.dur < 30000).length / lessons.length > .6) P.tags.push(['proletí lekce', 'většina lekcí pod 30 s']);
    if (oporaFirst) P.tags.push(['hledá v opoře', 'brzy otevřel(a) oporu']);
    const errs = all.reduce((n, st) => n + st.wrong + st.proofBad + st.quizFail, 0); if (errs >= 4) P.tags.push(['chybuje', `${errs} chyb`]);
    if (all.some(st => st.rage)) P.tags.push(['frustrace', 'opakované klikání']);
    if (P.stuck && P.stuck.dur >= 3e5) P.tags.push(['zasekl(a) se', flShort(P.stuck.loc) + ' · ' + dDur(Math.round(P.stuck.dur / 1000))]);
  });
  return A;
}
/* automatické závěry: věty, které shrnují, co z dat plyne */
function flInsights(A){
  const out = [], top = (o, n) => Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, n || 1);
  if (!A.steps) return ['Zatím nejsou data o pohybu. Analýza se naplní, až tutoriál otevře první člověk.'];
  const p0 = A.places[0]; if (p0) out.push(`<b>Největší problémové místo: ${esc(flShort(p0.loc))}.</b> ${esc(p0.why.map(w => w[1]).join(', '))}.`);
  const ex = top(A.exit, 2).filter(([l]) => flKind(l) !== 'úvod'); if (ex[0]) out.push(`Lidé nejčastěji končí sezení na <b>${esc(flShort(ex[0][0]))}</b> (${ex[0][1]}×).`);
  const pg = top(A.ping); if (pg[0] && pg[0][1] >= 2) out.push(`Bloudění: lidé přeskakují tam a zpět mezi <b>${esc(pg[0][0].split('↔').map(flShort).join(' a '))}</b> (${pg[0][1]}×). Nejspíš tam chybí jasný další krok.`);
  const lk = top(A.lockedMod); if (lk[0]) out.push(`Na zamčený modul <b>${esc(tLocLabel(lk[0][0]))}</b> se klikalo ${lk[0][1]}×. Lidé chtějí jít dál, než je cesta pustí.`);
  const rg = top(A.rage); if (rg[0]) out.push(`Opakované klikání na stejném místě: <b>${esc(flShort(rg[0][0]))}</b>. Něco tam nereaguje tak, jak lidé čekají.`);
  const pt = top(A.paths); if (pt[0]) out.push(`Nejčastější vzorec pohybu: <b>${esc(pt[0][0])}</b> (${pt[0][1]}×).`);
  const tags = {}; A.persons.forEach(P => P.tags.forEach(([t]) => { tags[t] = (tags[t] || 0) + 1; }));
  const tg = Object.entries(tags).sort((a, b) => b[1] - a[1]).slice(0, 3); if (tg.length) out.push('Typy chování: ' + tg.map(([t, n]) => `<b>${esc(t)}</b> ${n}×`).join(', ') + '.');
  return out;
}
function flChip(st){
  const warn = st.wrong + st.proofBad + st.quizFail + st.rage + st.locked;
  const marks = [st.wrong && `${st.wrong}× špatně`, st.proofBad && `${st.proofBad}× ověření`, st.quizFail && 'kvíz nesplněn', st.quizOk && 'kvíz splněn', st.rage && 'opakované klikání', st.locked && 'zamčeno', st.fb && 'zpětná vazba'].filter(Boolean);
  return `<span class="fl-st k-${flKind(st.loc)} ${warn ? 'warn' : ''} ${st.end ? 'last' : ''}" title="${esc(tLocLabel(st.loc))} · ${dDur(Math.round(st.dur / 1000))}${marks.length ? ' · ' + marks.join(', ') : ''}"><b>${esc(flShort(st.loc))}</b><small>${dDur(Math.round(st.dur / 1000))}${marks.length ? ' · ' + esc(marks.join(', ')) : ''}</small></span>`;
}
/* filtry záložky Pohyb: období, role, zařízení; vybrané problémové místo zúží cesty lidí */
const FLF = {days:0, role:'', dev:'', place:''};
function flFilter(rows){
  const since = FLF.days ? tNow() - FLF.days * 864e5 : 0;
  return rows.filter(r => (!FLF.role || r.role === FLF.role) && (!FLF.dev || (FLF.dev === 'mobil') === !!(r.dev || {}).mobile))
    .map(r => since ? Object.assign({}, r, {since, src:r}) : r);
}
/* cesty se počítají jednou na záznam (dokud se záznam nezmění); filtr období jen vybere novější sezení */
const FLJ = new WeakMap();
function flJourneyOf(r){ const src = r.src || r; let J = FLJ.get(src); if (!J) { J = flJourney(src); FLJ.set(src, J); } return r.since ? J.filter(x => x.last >= r.since) : J; }
const FL_KINDS = [['úvod','Úvod'],['lekce','Lekce'],['kvíz','Kvíz'],['opora','Opora'],['profil','Profil'],['simulace','Simulace'],['jiné','Jiné']];
const flTip = (t) => ` data-tip="${esc(t)}" tabindex="0"`;
/* graf: mapa pohybu mezi typy stránek (uzly = typy, šipky = přechody) */
function flMapSvg(A){
  const kv = {}, kt = {};
  Object.entries(A.visits).forEach(([l, n]) => { const k = flKind(l); if (k !== 'dashboard') kv[k] = (kv[k] || 0) + n; });
  Object.entries(A.trans).forEach(([t, n]) => { const [a, b] = t.split('→').map(flKind); if (a === 'dashboard' || b === 'dashboard') return; const k = a + '→' + b; kt[k] = (kt[k] || 0) + n; });
  const nodes = FL_KINDS.filter(([k]) => kv[k]); if (!nodes.length) return '<p class="muted ds-empty">Zatím žádný pohyb.</p>';
  const W2 = 480, H2 = 300, cx = W2 / 2, cy = H2 / 2 - 6, R = 92, mx = Math.max(...Object.values(kv)), tmx = Math.max(1, ...Object.values(kt));
  const pos = {}; nodes.forEach(([k], i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / nodes.length; pos[k] = [cx + Math.cos(a) * R * 1.75, cy + Math.sin(a) * R]; });
  const rad = k => 18 + 20 * Math.sqrt(kv[k] / mx), slot = k => FL_KINDS.findIndex(x => x[0] === k) + 1;
  const edges = Object.entries(kt).filter(([k]) => { const [a, b] = k.split('→'); return a !== b && pos[a] && pos[b]; }).sort((x, y) => x[1] - y[1]).map(([k, n]) => {
    const [a, b] = k.split('→'), [x1, y1] = pos[a], [x2, y2] = pos[b], dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L;
    const sx = x1 + ux * rad(a), sy = y1 + uy * rad(a), ex = x2 - ux * (rad(b) + 6), ey = y2 - uy * (rad(b) + 6), qx = (sx + ex) / 2 - uy * 26, qy = (sy + ey) / 2 + ux * 26, w = 1.5 + 7 * n / tmx;
    return `<path d="M${sx.toFixed(1)} ${sy.toFixed(1)} Q${qx.toFixed(1)} ${qy.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}" class="fl-edge" stroke-width="${w.toFixed(1)}" marker-end="url(#flarr)"${flTip(FL_KINDS.find(x => x[0] === a)[1] + ' → ' + FL_KINDS.find(x => x[0] === b)[1] + ': ' + n + '×')}/>`;
  }).join('');
  const nd = nodes.map(([k, lab]) => { const [x, y] = pos[k], self = kt[k + '→' + k] || 0;
    return `<g class="fl-node"${flTip(lab + ': ' + kv[k] + ' návštěv' + (self ? ', ' + self + '× přechod uvnitř (např. lekce → lekce)' : ''))}><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${rad(k).toFixed(1)}" style="fill:var(--fl-${slot(k)})"/><text x="${x.toFixed(1)}" y="${(y + rad(k) + 16).toFixed(1)}" text-anchor="middle" class="fl-nl">${lab}</text><text x="${x.toFixed(1)}" y="${(y + 4).toFixed(1)}" text-anchor="middle" class="fl-nv">${kv[k]}</text></g>`; }).join('');
  return `<svg class="fl-map" viewBox="0 0 ${W2} ${H2}" role="img" aria-label="Mapa pohybu mezi typy stránek"><defs><marker id="flarr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" class="fl-arrh"/></marker></defs>${edges}${nd}</svg>`;
}
/* graf: vodorovné pruhy s popiskem a hodnotou */
function flBars(items, opts){
  opts = opts || {}; if (!items.length) return `<p class="muted ds-empty">${opts.empty || 'Zatím žádná data.'}</p>`;
  const mx = Math.max(1, ...items.map(x => x.n));
  return `<div class="fl-bars">${items.map(x => `<div class="fl-br ${x.cls || ''}" ${x.cmd ? `role="button" data-dash="${esc(x.cmd)}"` : ''}${flTip(x.tip || (x.label + ': ' + x.n))}><span class="fl-bl">${esc(x.label)}</span><span class="fl-bt"><i style="width:${x.n ? Math.max(2, Math.round(x.n / mx * 100)) : 0}%;${x.color ? 'background:' + x.color : ''}"></i></span><span class="fl-bv num">${x.val || x.n}</span>${x.note ? `<span class="fl-bn">${x.note}</span>` : ''}</div>`).join('')}</div>`;
}
/* graf: sloupce v čase, dvě skupiny na sobě (bez problému / s problémem) */
function flDays(sess, days){
  const keys = Array.from({length:days}, (_, i) => dKey(days - 1 - i)), ok = {}, bad = {};
  sess.forEach(x => { const k = (() => { const d = new Date(x.from); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); })(); (x.bad ? bad : ok)[k] = ((x.bad ? bad : ok)[k] || 0) + 1; });
  const mx = Math.max(1, ...keys.map(k => (ok[k] || 0) + (bad[k] || 0)));
  if (!keys.some(k => ok[k] || bad[k])) return '<p class="muted ds-empty">V tomhle období zatím žádná sezení.</p>';
  return `<div class="fl-cols">${keys.map(k => { const a = ok[k] || 0, b = bad[k] || 0; return `<div class="fl-col"${flTip(k.split('-').reverse().join('. ') + ': ' + (a + b) + ' sezení, z toho ' + b + ' s problémem')}><span class="fl-cv num">${a + b || ''}</span><span class="fl-cs"><i class="bad" style="height:${b / mx * 100}%"></i><i class="ok" style="height:${a / mx * 100}%"></i></span><span class="fl-cl">${k.slice(8)}.</span></div>`; }).join('')}</div>
    <p class="fl-leg2"><span><i class="ok"></i>sezení bez problému</span><span><i class="bad"></i>sezení s problémem (chyba, bloudění, opakované klikání, zámek)</span></p>`;
}
function flKpi(label, val, what, cls){ return `<div class="fl-kpi ${cls || ''}"><span class="fl-kl">${label}</span><b class="num">${val}</b><span class="fl-kw">${what}</span></div>`; }
let FLC = {key:'', A:null, rows:null};
function renderDashFlow(){
  const key = [DASH.at, DASH.withMe, FLF.days, FLF.role, FLF.dev].join('|');
  if (FLC.key !== key) { const all = DASH.rows, base = DASH.withMe ? all : all.filter(r => r.id !== TRK.uid), rows = flFilter(base); FLC = {key, rows, A:flAnalyze(rows)}; }
  const rows = FLC.rows;
  const A = FLC.A, sel = DASH.sel && A.persons.find(P => P.id === DASH.sel);
  const top = (o, n) => Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, n);
  const sess = A.persons.flatMap(P => P.J.map(x => { const st = x.steps; const bad = st.some(s2 => s2.wrong || s2.proofBad || s2.quizFail || s2.rage || s2.locked) || st.some((s2, i) => i > 1 && st[i - 2].loc === s2.loc); return {from:x.from, to:x.last, n:st.length, bad, lastLoc:st[st.length - 1].loc, id:P.id}; }));
  const medS = (() => { const d = sess.map(x => (x.to - x.from) / 1000).sort((a, b) => a - b); return d.length ? d[Math.floor(d.length / 2)] : 0; })();
  const badPct = sess.length ? Math.round(sess.filter(x => x.bad).length / sess.length * 100) : 0;
  const pingS = A.persons.reduce((n, P) => n + (P.ping ? 1 : 0), 0);
  const exitLesson = sess.filter(x => flKind(x.lastLoc) === 'lekce').length;
  const fromTot = {}; Object.entries(A.trans).forEach(([k, n]) => { const f = k.split('→')[0]; fromTot[f] = (fromTot[f] || 0) + n; });
  const place = FLF.place && A.places.find(p => p.loc === FLF.place);
  const persons = A.persons.filter(P => !FLF.place || P.J.some(x => x.steps.some(st => st.loc === FLF.place))).sort((a, b) => b.steps - a.steps);
  // kam až lidé došli
  const reachL = []; ['l0', 'l1', 'pm', 'pd', 'se', 'gm', 'l3', 'l4'].forEach(id => { const w = W.find(x => x.id === id); if (w && (!w.role || !FLF.role || w.role === FLF.role)) w.days.forEach(d => { const k = id + '/' + d.d; if (A.reached[k] || id === 'l0') reachL.push([k, A.reached[k] || 0, w]); }); });
  let prevN = null; const reach = reachL.map(([k, n, w]) => { const drop = prevN && n < prevN && !w.role ? Math.round((prevN - n) / prevN * 100) : 0; prevN = n; return {label:d2(k), n, val:n + (n === 1 ? ' člověk' : ' lidí'), note: drop ? `<span class="fl-tag ${drop >= 40 ? 'bad' : 'warn'}">−${drop} %</span>` : '', tip:tLocLabel(k) + ': otevřelo ' + n + (drop ? ', propad ' + drop + ' % proti předchozí lekci' : ''), cls: drop >= 40 ? 'drop' : ''}; });
  function d2(k){ return flShort(k); }
  // problémová místa jako pruhy podle skóre, barva podle hlavního důvodu
  const RC = {odchod:'var(--fl-2)', chyby:'var(--fl-8)', 'ověření':'var(--fl-8)', 'kvíz':'var(--fl-7)', 'klikání':'var(--fl-5)', 'zámek':'var(--fl-4)', 'bloudění':'var(--fl-4)', 'návraty':'var(--fl-1)', dlouho:'var(--fl-1)', proletěno:'var(--fl-3)'};
  const placeBars = A.places.slice(0, 10).map(p => ({label:flShort(p.loc), n:Math.round(p.score * 10) / 10, val:p.u + (p.u === 1 ? ' člověk' : ' lidí'), color:RC[p.why[0][0]], note:p.why.slice(0, 2).map(([k]) => `<span class="fl-tag">${esc(k)}</span>`).join(' '), tip:tLocLabel(p.loc) + ' · ' + p.why.map(w => w[1]).join(' · '), cmd:'fplace:' + p.loc, cls: FLF.place === p.loc ? 'on' : ''}));
  // délka sezení a typy chování
  const B = [['do 1 min', 60], ['1–5 min', 300], ['5–15 min', 900], ['15–30 min', 1800], ['přes 30 min', Infinity]], bc = B.map(() => 0);
  sess.forEach(x => { const d = (x.to - x.from) / 1000; bc[B.findIndex(b => d < b[1])]++; });
  const tags = {}; A.persons.forEach(P => P.tags.forEach(([t]) => { tags[t] = (tags[t] || 0) + 1; }));
  const TAGD = {'vrací se':'3 a víc sezení', 'odešel brzy':'jedno krátké sezení a už se nevrátil(a)', 'bloudí':'opakovaně tam a zpět mezi stránkami', 'proletí lekce':'většina lekcí pod 30 s', 'hledá v opoře':'brzy otevřel(a) oporu, nejspíš něco hledá', 'chybuje':'4 a víc chyb', 'frustrace':'opakované klikání na stejné místo', 'zasekl(a) se':'na jednom kroku přes 5 minut'};
  const sel2 = (v, cur, lab) => `<button type="button" class="rolebtn ${cur === v ? 'on' : ''}" aria-pressed="${cur === v}" data-dash="${lab}:${v}">`;
  app.innerHTML = shell('dash', `<div id="dash">${dTabs()}
    <div class="mh c-indigo"><span class="eyebrow">Dashboard · jen pro vlastníka</span><h1>Pohyb a problémová místa</h1>
      <p>Jak se lidé po aplikaci opravdu pohybují a kde mají potíže. Najeďte myší nebo klepněte na kterýkoli graf a uvidíte čísla. <span class="fl-live" role="status">${DASH.live === false ? 'Živá aktualizace vypnutá' : '● Živě'} · data z ${dWhen(DASH.at)}</span> <button class="btn sm" type="button" data-dash="live">${DASH.live === false ? 'Zapnout živou aktualizaci' : 'Pozastavit'}</button></p></div>

    <div class="fl-filters" role="group" aria-label="Filtry">
      <span class="fl-fl">Období</span>${[[0, 'vše'], [7, '7 dní'], [14, '14 dní'], [30, '30 dní']].map(([v, l]) => sel2(String(v), String(FLF.days), 'fdays') + l + '</button>').join('')}
      <span class="fl-fl">Role</span>${[['', 'všechny'], ['pm', 'PM'], ['pd', 'PD'], ['se', 'SWE'], ['gm', 'GM']].map(([v, l]) => sel2(v, FLF.role, 'frole') + l + '</button>').join('')}
      <span class="fl-fl">Zařízení</span>${[['', 'vše'], ['mobil', 'mobil'], ['pc', 'počítač']].map(([v, l]) => sel2(v, FLF.dev, 'fdev') + l + '</button>').join('')}
      <label class="ds-chk"><input type="checkbox" data-dash="me" ${DASH.withMe ? 'checked' : ''}> Započítat i mě</label>
    </div>

    <div class="fl-kpis">
      ${flKpi('Lidé', dNum(A.people), 'kolik lidí se v tomto výběru pohybovalo')}
      ${flKpi('Sezení', dNum(A.sessions), 'jedno sezení končí po 30 min bez aktivity')}
      ${flKpi('Typické sezení', dDur(Math.round(medS)), 'medián délky jednoho sezení')}
      ${flKpi('Sezení s problémem', badPct + ' %', 'chyba, bloudění, opakované klikání nebo zámek', badPct >= 40 ? 'bad' : badPct >= 20 ? 'warn' : 'ok')}
      ${flKpi('Konec uprostřed lekce', sess.length ? Math.round(exitLesson / sess.length * 100) + ' %' : '—', 'podíl sezení, která skončila v lekci, ne na úvodu', sess.length && exitLesson / sess.length >= .5 ? 'warn' : '')}
      ${flKpi('Bloudí', pingS + ' z ' + A.people, 'lidé, kteří přeskakují tam a zpět', pingS && pingS / Math.max(1, A.people) >= .3 ? 'warn' : '')}
    </div>

    <div class="sec-h"><h2>Co z dat plyne</h2><p>Závěry spočítané z dat, seřazené od nejdůležitějšího.</p></div>
    <ul class="fl-ins">${flInsights(A).map(x => `<li>${x}</li>`).join('')}</ul>

    <div class="fl-two">
      <section class="fl-card"><h3>Mapa pohybu</h3><p class="fl-how">Kruh = typ stránky, velikost = počet návštěv. Šipka = přechod, čím tlustší, tím častější.</p>${flMapSvg(A)}
        <p class="fl-leg2">${FL_KINDS.map(([k, l], i) => Object.keys(A.visits).some(v => flKind(v) === k) ? `<span><i style="background:var(--fl-${i + 1})"></i>${l}</span>` : '').join('')}</p></section>
      <section class="fl-card"><h3>Kam až lidé došli</h3><p class="fl-how">Kolik lidí otevřelo kterou lekci, v pořadí cesty. Červený propad = tady lidé přestávají.</p>${flBars(reach, {empty:'Zatím nikdo neotevřel lekci.'})}</section>
    </div>

    <section class="fl-card"><h3>Problémová místa</h3><p class="fl-how">Délka pruhu = závažnost (důvody × počet lidí), barva = hlavní důvod. Klepněte na místo a níže uvidíte jen lidi, kteří tam byli.</p>
      ${flBars(placeBars, {empty:'Zatím žádné problémové místo.'})}
      ${place ? `<div class="fl-detail"><b>${esc(tLocLabel(place.loc))}</b> <span class="muted">${place.u} ${place.u === 1 ? 'člověk' : 'lidí'} · ${place.v} návštěv · medián ${dDur(Math.round(place.md))}${place.est ? ' (odhad ' + place.est + ' min)' : ''}</span><span class="fl-why">${place.why.map(([k, t]) => `<span class="fl-tag">${esc(t)}</span>`).join('')}</span>${place.loc.includes('/') ? `<button class="linkbtn" type="button" data-dash="open:${esc(place.loc)}">Otevřít to místo v tutoriálu</button>` : ''} <button class="btn sm" type="button" data-dash="fplace:">Zrušit výběr</button></div>` : ''}</section>

    <div class="fl-two">
      <section class="fl-card"><h3>Aktivita v čase</h3><p class="fl-how">Sezení po dnech za posledních ${FLF.days || 14} dní. Horní část sloupce = sezení s problémem.</p>${flDays(sess, FLF.days || 14)}</section>
      <section class="fl-card"><h3>Jak dlouho lidé zůstávají</h3><p class="fl-how">Počet sezení podle délky. Hodně krátkých sezení = lidé rychle odcházejí.</p>${flBars(B.map(([l], i) => ({label:l, n:bc[i], val:bc[i] + ' sezení', color:'var(--fl-1)'})).filter(x => sess.length), {empty:'Zatím žádná sezení.'})}</section>
    </div>

    <section class="fl-card"><h3>Typy chování</h3><p class="fl-how">Kolik lidí se chová kterým způsobem. Jeden člověk může mít víc typů.</p>${flBars(Object.entries(tags).sort((a, b) => b[1] - a[1]).map(([t, n]) => ({label:t, n, val:n + (n === 1 ? ' člověk' : ' lidí'), color:'var(--fl-7)', tip:t + ': ' + (TAGD[t] || '')})), {empty:'Zatím nikdo bez nápadností.'})}
      <p class="fl-how">${Object.keys(tags).map(t => `<b>${esc(t)}</b>: ${esc(TAGD[t] || '')}`).join(' · ')}</p></section>

    <div class="sec-h"><h2>Cesta každého člověka</h2><p>${place ? `Jen lidé, kteří byli na místě <b>${esc(flShort(place.loc))}</b>. ` : ''}Klepněte na jméno a uvidíte celou cestu krok za krokem.</p></div>
    ${dTable(['Kdo', 'Sezení', 'Kroků', 'Typ chování', 'Nejdéle'], persons.slice(0, DASH.allP ? persons.length : 50).map(P => [
      `<button class="linkbtn" type="button" data-dash="flow:${esc(P.id)}">${dName(P.id)}${P.id === TRK.uid ? ' (vy)' : ''}</button>`, P.sessions, P.steps,
      P.tags.length ? P.tags.map(([t, d]) => `<span class="fl-tag" title="${esc(d)}">${esc(t)}</span>`).join(' ') : '<span class="muted">bez nápadností</span>',
      P.stuck ? esc(flShort(P.stuck.loc)) + ' · ' + dDur(Math.round(P.stuck.dur / 1000)) : '—']), 'Nikdo neodpovídá výběru.')}
    ${persons.length > 50 && !DASH.allP ? `<p><button class="btn sm" type="button" data-dash="allp">Zobrazit všech ${persons.length} lidí</button></p>` : ''}
    ${sel ? `<div class="ds-who fl-who"><h3>Cesta: ${dName(sel.id)} <button class="btn sm" type="button" data-dash="flow:">Zavřít</button></h3>
      ${sel.tags.length ? `<p>${sel.tags.map(([t, d]) => `<span class="fl-tag">${esc(t)}: ${esc(d)}</span>`).join(' ')}</p>` : ''}
      ${sel.J.slice().reverse().slice(0, 20).map(x => `<div class="fl-ses"><span class="fl-sh">${dDate(x.from)} · ${dTime(x.from)}–${dTime(x.last)} · ${x.steps.length} kroků</span><div class="fl-path">${x.steps.map(flChip).join('<span class="fl-ar" aria-hidden="true">→</span>')}<span class="fl-end">konec</span></div></div>`).join('') || '<p class="muted">Žádné kroky.</p>'}</div>` : ''}

    <details class="fl-more"><summary>Podrobné tabulky: přechody, vstupy, odchody, vzorce a bloudění</summary>
      <h3>Odkud kam lidé jdou</h3>
      ${dTable(['Odkud', 'Kam', 'Kolikrát', 'Podíl odchodů ze stránky'], top(A.trans, 15).map(([k, n]) => { const [f, to] = k.split('→'); return [esc(flShort(f)), esc(flShort(to)), n, Math.round(n / fromTot[f] * 100) + ' %']; }), 'Zatím žádné přechody.')}
      <div class="ds-grid">
        <div><h3>Kde lidé začínají</h3>${dTable(['Stránka', 'Sezení'], top(A.entry, 8).map(([l, n]) => [esc(flShort(l)), n]), 'Zatím nic.')}</div>
        <div><h3>Kde lidé končí</h3>${dTable(['Stránka', 'Sezení', 'Podíl návštěv'], top(A.exit, 8).map(([l, n]) => [esc(flShort(l)), n, Math.round(n / (A.visits[l] || 1) * 100) + ' %']), 'Zatím nic.')}</div>
      </div>
      <div class="ds-grid">
        <div><h3>Opakující se vzorce pohybu</h3>${dTable(['Vzorec (3 kroky po sobě)', 'Kolikrát'], top(A.paths, 8).map(([k, n]) => [esc(k), n]), 'Zatím málo dat.')}</div>
        <div><h3>Bloudění: tam a zpět</h3>${dTable(['Mezi', 'Kolikrát'], top(A.ping, 8).map(([k, n]) => [esc(k.split('↔').map(flShort).join(' ↔ ')), n]), 'Nikdo nebloudí.')}</div>
      </div>
    </details>
    <p class="muted fl-leg">Barvy kroků v cestě: <span class="fl-st k-úvod"><b>úvod</b></span> <span class="fl-st k-lekce"><b>lekce</b></span> <span class="fl-st k-kvíz"><b>kvíz</b></span> <span class="fl-st k-opora"><b>opora</b></span> <span class="fl-st k-profil"><b>profil</b></span> <span class="fl-st warn"><b>problém</b></span>. Doba kroku je čas do dalšího kroku, nejvýš 10 minut.</p>
  </div>`);
}
/* tooltip pro grafy dashboardu: text z data-tip, vložený přes textContent */
(function(){
  let tip = null;
  const show = (el, x, y) => { if (!tip) { tip = document.createElement('div'); tip.className = 'fl-tip'; tip.setAttribute('role', 'tooltip'); document.body.append(tip); }
    tip.textContent = el.getAttribute('data-tip'); tip.hidden = false; const r = tip.getBoundingClientRect(); tip.style.left = Math.max(8, Math.min(innerWidth - r.width - 8, x + 12)) + 'px'; tip.style.top = Math.max(8, y - r.height - 10) + 'px'; };
  const hide = () => { if (tip) tip.hidden = true; };
  document.addEventListener('pointermove', e => { const el = e.target.closest && e.target.closest('#dash [data-tip]'); if (el) show(el, e.clientX, e.clientY); else hide(); });
  document.addEventListener('focusin', e => { const el = e.target.closest && e.target.closest('#dash [data-tip]'); if (el) { const r = el.getBoundingClientRect(); show(el, r.left, r.top); } else hide(); });
  addEventListener('scroll', hide, {passive:true});
})();
/* živá aktualizace: dokud je otevřený dashboard, data se každých 30 s načtou znovu (jen když je karta vidět) */
setInterval(() => { if (view.name === 'dash' && DASH.live !== false && !document.hidden && !DASH.loading && DASH.rows) dashLive(); }, 30000);
/* klávesnice: prvky grafů, které jdou vybrat, reagují na Enter a mezerník */
document.addEventListener('keydown', e => { const el = e.target.closest && e.target.closest('#dash [role=button][data-dash]'); if (el && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); el.click(); } });

/* ---------- pokrok pod účtem: soukromá část databáze data/users/<člověk>/progress ----------
   Vidí ji jen ten člověk. Při otevření se sloučí s pokrokem v prohlížeči (nic se neztratí, ani při dvou
   zařízeních), každá změna se do 2 s uloží. Bez přihlášení nebo bez připojení se pokračuje jen z prohlížeče.
   Přechod na vlastní server: stačí nahradit pLoad a pPush. */
const PROG = {ref:null, ready:false, h:null, busy:false};
function pMerge(a, b){
  const o = Object.assign({}, b, a), newer = (b._at || 0) > (a._at || 0) ? b : a;
  ['role','goal','skin','av','sound','pos','survey','dq','seenVideo','flown','express'].forEach(k => { if (newer[k] !== undefined) o[k] = newer[k]; });
  ['todo','cards','proof','got','badges','unlocked','qpass','ready','quiz','frozen','vids','exSeen','rev'].forEach(k => { o[k] = Object.assign({}, b[k] || {}, a[k] || {}); });
  o.days = Object.assign({}, b.days || {}); Object.entries(a.days || {}).forEach(([d, v]) => { o.days[d] = Math.max(v, o.days[d] || 0); });
  ['ptries','tries'].forEach(k => { o[k] = Object.assign({}, b[k] || {}); Object.entries(a[k] || {}).forEach(([x, v]) => { o[k][x] = Math.max(v, o[k][x] || 0); }); });
  ['xp','freeze','rankLvl'].forEach(k => { o[k] = Math.max(a[k] || 0, b[k] || 0); });
  o._at = Math.max(a._at || 0, b._at || 0);
  return o;
}
async function pLoad(db, uid){
  try {
    PROG.ref = db.doc('data/users/' + uid + '/progress');
    const snap = await PROG.ref.get(), remote = snap.exists ? snap.data() : null;
    PROG.ready = true;
    if (remote && remote.state && typeof remote.state === 'object') {
      const before = JSON.stringify(S), merged = pMerge(S, JSON.parse(JSON.stringify(remote.state)));
      if (JSON.stringify(merged) !== before) { Object.keys(S).forEach(k => delete S[k]); Object.assign(S, merged); try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} try { applySkin(); } catch (e) {} render(); }
      if ((remote.at || 0) < (S._at || 0) || JSON.stringify(remote.state) !== JSON.stringify(S)) pPush();
    } else if (Object.keys(S.todo || {}).length || S.role) pPush();
  } catch (e) { PROG.ref = null; PROG.ready = false; }
}
function pSync(){ if (!PROG.ready || !PROG.ref) return; clearTimeout(PROG.h); PROG.h = setTimeout(pPush, 2000); }
async function pPush(){
  if (!PROG.ref || PROG.busy) return; PROG.busy = true; clearTimeout(PROG.h);
  try { await PROG.ref.set({v:1, at:Date.now(), state:JSON.parse(JSON.stringify(S))}); }
  catch (e) { if (e && (e.code === 'revoked' || e.code === 'invalid_argument' || e.code === 'not_granted')) PROG.ref = null; else PROG.h = setTimeout(pPush, 15000); }
  PROG.busy = false;
  try { tmPush(); } catch (e) {}
}
document.addEventListener('visibilitychange', () => { if (document.hidden && PROG.h) pPush(); });

/* ---------- offline režim ----------
   Hra, lekce, kvízy, minihry, výzvy i pokrok běží v zařízení (localStorage), takže bez sítě jde pokračovat.
   Co síť potřebuje: synchronizace pokroku pod účtem, měření, zpětná vazba, chat se Spockem a videa.
   Bez sítě: v hlavičce je štítek Offline, zpětná vazba čeká ve frontě v zařízení, chat to vysvětlí místo chyby.
   Po připojení: znovu připojení k účtu (když se při startu nepovedlo), odeslání pokroku, měření a fronty. */
const NET = {lost:false};
const FB_OUT = 'spock-fb-outbox';
function fbOutbox(){ try { const a = JSON.parse(localStorage.getItem(FB_OUT) || '[]'); return Array.isArray(a) ? a : []; } catch (e) { return []; } }
function fbOutboxAdd(item){ const a = fbOutbox(); a.push(item); try { localStorage.setItem(FB_OUT, JSON.stringify(a.slice(-20))); } catch (e) {} netPill(); }
async function fbOutboxSend(){
  const a = fbOutbox(); if (!a.length || !TRK.ok || !navigator.onLine || NET.sending) return;
  NET.sending = true;
  try {
    const ref = TRK.db.doc('feedback/' + TRK.uid), s = await ref.get();
    const items = s.exists && Array.isArray(s.data().items) ? JSON.parse(JSON.stringify(s.data().items)) : [];
    const have = new Set(items.map(x => x.id)); a.forEach(it => { if (!have.has(it.id)) items.push(it); });
    await ref.set({items, last:tNow()});
    try { localStorage.removeItem(FB_OUT); } catch (e) {}
    a.forEach(it => { try { award('feedback.' + it.id, 10, 'zpětná vazba'); } catch (e) {} });
    toast(a.length === 1 ? 'Zpětná vazba z doby offline je odeslaná.' : 'Zpětné vazby z doby offline (' + a.length + ') jsou odeslané.');
  } catch (e) {}
  NET.sending = false; netPill();
}
function netPill(){
  const off = !navigator.onLine, q = fbOutbox().length;
  let el = document.getElementById('pill-net');
  if (!el) { const pp = document.querySelector('.hg-act'); if (!pp) return; pp.insertAdjacentHTML('afterbegin', '<span class="pill net-pill" id="pill-net" role="status" hidden></span>'); el = document.getElementById('pill-net'); }
  el.hidden = !off;
  el.innerHTML = '<span class="net-dot" aria-hidden="true"></span><span class="net-t">Offline</span>' + (q ? '<span class="net-q">· ' + q + '</span>' : '');
  el.title = 'Jste offline. Lekce, kvízy a hra fungují dál a pokrok se ukládá v zařízení. Synchronizace pod účtem' + (q ? ', ' + q + ' zpětná vazba ve frontě' : '') + ' a chat se Spockem počkají na připojení.';
  el.setAttribute('aria-label', el.title);
}
async function netBack(){
  NET.lost = false; netPill();
  try { trk('připojení', 'zpět online'); } catch (e) {}
  await tInit();
  try { if (TRK.ok) { TRK.dirty = true; await tFlush(); } } catch (e) {}
  try { if (PROG.ref) await pPush(); } catch (e) {}
  try { await fbOutboxSend(); } catch (e) {}
  toast(PROG.ref ? 'Jste zpět online. Pokrok je uložený pod vaším účtem.' : 'Jste zpět online.');
}
window.addEventListener('offline', () => { NET.lost = true; netPill(); try { trk('připojení', 'offline'); } catch (e) {} toast('Jste offline. Můžete pokračovat, pokrok se ukládá v zařízení.'); });
window.addEventListener('online', () => { netBack(); });
setTimeout(netPill, 0);

/* ---------- tým: společné učení a přehled o postupu kolegů ----------
   Kdo tým založí, dostane kód a pošle ho kolegům (třeba v Teams). Kdo se kódem připojí, souhlasí, že členové týmu
   uvidí jeho souhrn: roli, hodnost, XP, postup, kde je a kdy byl naposledy aktivní. Nic dalšího (odpovědi, kliknutí) se nesdílí.
   Databáze: tymy/<zakladatel> {name, code, removed[]} a clenove/<člověk> {team, souhrn}. Zakladatel může člena odebrat
   (zapíše ho do removed) nebo tým zrušit; každý může tým kdykoli opustit. Jména se neukládají, zobrazují se z profilu. */
const TEAM = {ready:false, my:null, team:null, members:[], names:{}, err:'', busy:false, kicked:false, draft:{}};
const tmCode = () => { const A = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; const r = crypto.getRandomValues(new Uint8Array(6)); return Array.from(r, x => A[x % A.length]).join(''); };
function tmSummary(){ const r = rank(), n = nextOnPath(); return {role:S.role || null, xp:S.xp || 0, rank:r.name, lvl:r.lvl, pct:overall(), mod:n ? n.id : null, streak:streak(), last:Date.now(), express:!!S.express, done:pathDone()}; }
async function tmLoad(){
  if (!TRK.db || !TRK.uid) return; TEAM.fresh = Date.now();
  try {
    const s = await TRK.db.doc('clenove/' + TRK.uid).get(); TEAM.my = s.exists ? JSON.parse(JSON.stringify(s.data())) : null; TEAM.team = null; TEAM.members = []; TEAM.kicked = false;
    if (TEAM.my && TEAM.my.team) {
      const t = await TRK.db.doc('tymy/' + TEAM.my.team).get();
      const tm = t.exists ? Object.assign({id:TEAM.my.team}, t.data()) : null;
      if (!tm || (tm.removed || []).includes(TRK.uid)) { TEAM.kicked = tm ? 'odebrán' : 'zrušen'; TEAM.my.team = null; await TRK.db.doc('clenove/' + TRK.uid).set(TEAM.my); }
      else { TEAM.team = tm; await tmMembers(); }
    }
    TEAM.err = '';
  } catch (e) { TEAM.err = navigator.onLine ? 'Tým se nepodařilo načíst. Zkuste to za chvíli.' : 'Jste offline. Tým se načte po připojení.'; }
  TEAM.ready = true; if (view.name === 'tym' || view.name === 'home') render();
}
async function tmMembers(){
  const q = await TRK.db.collection('clenove').where('team', '==', TEAM.team.id).get(), rm = TEAM.team.removed || [];
  TEAM.members = q.docs.map(d => Object.assign({id:d.id}, d.data())).filter(m => !rm.includes(m.id));
  try { const ps = await TRK.user.profiles(TEAM.members.map(m => m.id)); TEAM.names = {}; Object.keys(ps || {}).forEach(k => { TEAM.names[k] = (ps[k] && ps[k].name) || ''; }); } catch (e) {}
}
async function tmPush(){
  if (!TEAM.my || !TEAM.my.team || !TRK.db || !TRK.uid) return;
  try { TEAM.my = Object.assign(TEAM.my, tmSummary()); await TRK.db.doc('clenove/' + TRK.uid).set(JSON.parse(JSON.stringify(TEAM.my))); } catch (e) {}
}
async function tmAct(a, arg){
  if (TEAM.busy || !TRK.db || !TRK.uid) return; TEAM.busy = true; TEAM.err = '';
  const fail = m => { const x = new Error(m); x.v = true; throw x; };
  try {
    if (a === 'create') {
      const name = String(arg || '').trim().slice(0, 60); if (!name) fail('Napište název týmu.');
      const team = {name, code:tmCode(), removed:[], at:Date.now()};
      await TRK.db.doc('tymy/' + TRK.uid).set(team);
      TEAM.my = Object.assign({}, tmSummary(), {team:TRK.uid}); await TRK.db.doc('clenove/' + TRK.uid).set(TEAM.my);
      try { trk('tým', 'založen'); } catch (e) {}
    } else if (a === 'join') {
      const code = String(arg || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
      if (code.length !== 6) fail('Kód týmu má 6 znaků.');
      const q = await TRK.db.collection('tymy').where('code', '==', code).limit(1).get();
      if (!q.docs.length) fail('Tým s tímhle kódem neexistuje. Zkontrolujte ho u kolegy, který tým založil.');
      const d = q.docs[0];
      if ((d.data().removed || []).includes(TRK.uid)) fail('Z tohoto týmu vás zakladatel odebral.');
      TEAM.my = Object.assign({}, tmSummary(), {team:d.id}); await TRK.db.doc('clenove/' + TRK.uid).set(TEAM.my);
      try { trk('tým', 'připojen'); } catch (e) {}
    } else if (a === 'leave' || a === 'dissolve') {
      if (a === 'dissolve' && TEAM.team && TEAM.team.id === TRK.uid) await TRK.db.doc('tymy/' + TRK.uid).delete();
      TEAM.my = Object.assign({}, TEAM.my || {}, {team:null}); await TRK.db.doc('clenove/' + TRK.uid).set(TEAM.my);
      try { trk('tým', a === 'leave' ? 'opuštěn' : 'zrušen'); } catch (e) {}
    } else if (a === 'remove' && TEAM.team && TEAM.team.id === TRK.uid && arg && arg !== TRK.uid) {
      const removed = Array.from(new Set((TEAM.team.removed || []).concat([arg])));
      await TRK.db.doc('tymy/' + TRK.uid).update({removed});
    }
  } catch (e) {
    TEAM.busy = false;
    if (e && e.v) { TEAM.err = e.message; renderTeam(); return; }
    TEAM.err = navigator.onLine ? 'Nepodařilo se to uložit. Zkuste to znovu.' : 'Jste offline. Tým jde upravit po připojení.';
  }
  TEAM.busy = false;
  const err = TEAM.err; await tmLoad(); if (err) { TEAM.err = err; if (view.name === 'tym') renderTeam(); }
}
const tmAgo = t => { if (!t) return '—'; const d = Math.floor((Date.now() - t) / 864e5); return d <= 0 ? 'dnes' : d === 1 ? 'včera' : 'před ' + d + ' dny'; };
function teamCard(){
  if (!S.role || !TRK.ok) return '';
  if (TEAM.team) { const m = TEAM.members, avg = m.length ? Math.round(m.reduce((n, x) => n + (x.pct || 0), 0) / m.length) : 0;
    return `<section class="tmc"><div><span class="eyebrow">Váš tým</span><h3>${esc(TEAM.team.name)}</h3><p class="muted">${m.length} ${m.length === 1 ? 'člověk' : m.length < 5 ? 'lidé' : 'lidí'} · průměrně ${avg} % cesty</p></div><button class="btn" type="button" data-go="tym">Otevřít tým →</button></section>`; }
  return `<section class="tmc"><div><span class="eyebrow">Učte se s týmem</span><h3>Vidíte, kde jsou kolegové</h3><p class="muted">Založte tým nebo se připojte kódem od kolegy.</p></div><button class="btn" type="button" data-go="tym">Tým →</button></section>`;
}
function renderTeam(){
  const lead = TEAM.team && TEAM.team.id === TRK.uid, W2 = id => { const w = W.find(x => x.id === id); return w ? (w.role ? w.title : w.lab + ' · ' + w.title) : 'Hotovo'; };
  let body;
  if (!TRK.ok || !TEAM.ready) body = `<p class="tm-note">${TRK.ok ? 'Načítám tým…' : 'Tým funguje, když jste přihlášení a online. Pokrok se mezitím ukládá v zařízení.'}</p>`;
  else if (!TEAM.team) body = `${TEAM.kicked ? `<p class="tm-note">Tým, ve kterém jste byli, ${TEAM.kicked === 'zrušen' ? 'jeho zakladatel zrušil' : 'vás odebral'}. Můžete založit nový nebo se připojit k jinému.</p>` : ''}
    <div class="tm-two">
      <form class="tm-box" data-tmform="create"><h2>Založit tým</h2><p class="muted">Dostanete kód, který pošlete kolegům.</p><label for="tm-name">Název týmu</label><input id="tm-name" maxlength="60" placeholder="Např. Tribe Platby" autocomplete="off" value="${esc(TEAM.draft.name || '')}"><button class="btn primary" type="submit">Založit tým</button></form>
      <form class="tm-box" data-tmform="join"><h2>Připojit se kódem</h2><p class="muted">Kód vám pošle kolega, který tým založil.</p><label for="tm-code">Kód týmu</label><input id="tm-code" maxlength="8" placeholder="Např. K7M2QX" autocomplete="off" autocapitalize="characters" value="${esc(TEAM.draft.code || '')}"><label class="tm-ok"><input type="checkbox" id="tm-agree"> Souhlasím, že členové týmu uvidí můj souhrn: roli, hodnost, XP, postup cestou a kdy jsem byl(a) naposledy aktivní.</label><button class="btn primary" type="submit">Připojit se</button></form>
    </div>`;
  else { const m = TEAM.members.slice().sort((a, b) => (b.pct || 0) - (a.pct || 0) || (b.xp || 0) - (a.xp || 0)), now = Date.now();
    const avg = m.length ? Math.round(m.reduce((n, x) => n + (x.pct || 0), 0) / m.length) : 0, done = m.filter(x => x.done).length, act = m.filter(x => now - (x.last || 0) < 7 * 864e5).length, stuck = m.filter(x => !x.done && now - (x.last || 0) > 3 * 864e5);
    body = `<div class="tm-head"><div><span class="eyebrow">${lead ? 'Zakládali jste' : 'Jste členem'}</span><h2>${esc(TEAM.team.name)}</h2></div>${lead ? `<div class="tm-code"><span>Kód pro kolegy</span><b id="tm-code-v">${esc(TEAM.team.code)}</b><button class="btn sm" type="button" data-tm="copy">Zkopírovat</button></div>` : ''}</div>
    ${lead ? '<p class="muted">Pošlete kód kolegům, třeba v Teams. V aplikaci ho zadají na stránce Tým.</p>' : ''}
    <div class="tm-kpi"><div><b>${m.length}</b><span>${m.length === 1 ? 'člověk' : m.length < 5 ? 'lidé' : 'lidí'} v týmu</span></div><div><b>${avg} %</b><span>průměrný postup</span></div><div><b>${done}</b><span>dokončilo cestu</span></div><div><b>${act}</b><span>aktivních za 7 dní</span></div></div>
    ${stuck.length ? `<p class="tm-stuck"><b>Bez aktivity přes 3 dny:</b> ${stuck.map(x => esc(x.id === TRK.uid ? 'vy' : TEAM.names[x.id] || 'kolega')).join(', ')}. Možná se zasekli, zkuste se jich zeptat.</p>` : ''}
    <div class="tw" tabindex="0" role="region" aria-label="Postup členů týmu"><table class="tm-t"><thead><tr><th>Člověk</th><th>Role</th><th>Hodnost</th><th>Postup</th><th>Právě</th><th>Série</th><th>Naposledy</th>${lead ? '<th></th>' : ''}</tr></thead><tbody>
    ${m.map(x => `<tr class="${x.id === TRK.uid ? 'me' : ''}"><td><b>${esc(x.id === TRK.uid ? 'Vy' : TEAM.names[x.id] || 'Kolega')}</b>${x.id === TEAM.team.id ? ' <small class="muted">zakladatel</small>' : ''}</td><td>${esc(x.role ? ROLE_SHORT[x.role] || x.role : '—')}</td><td>${esc(x.rank || '—')} <small class="muted">${x.xp || 0} XP</small></td><td><span class="tm-bar"><span class="bar"><i style="width:${x.pct || 0}%"></i></span><span class="num">${x.pct || 0} %</span></span></td><td>${x.done ? '✓ Hotovo' : esc(W2(x.mod))}${x.express ? ' <small class="muted">expres</small>' : ''}</td><td>${x.streak ? '🔥 ' + x.streak : '—'}</td><td>${tmAgo(x.last)}</td>${lead ? `<td>${x.id !== TRK.uid ? `<button class="linkbtn" type="button" data-tm="remove:${esc(x.id)}">Odebrat</button>` : ''}</td>` : ''}</tr>`).join('')}
    </tbody></table></div>
    <div class="tm-foot"><button class="btn" type="button" data-tm="reload">Obnovit</button>${lead ? '<button class="btn" type="button" data-tm="dissolve">Zrušit tým</button>' : '<button class="btn" type="button" data-tm="leave">Opustit tým</button>'}</div>
    <p class="muted tm-priv">Členové vidí jen tenhle souhrn. Odpovědi, kliknutí ani zpětná vazba se nesdílejí.</p>`; }
  app.innerHTML = shell('tym', `<div class="mh c-indigo"><span class="eyebrow">Učte se společně</span><h1>Tým</h1><p class="goal">Vidíte, kde jsou kolegové, kdo je napřed a kdo se možná zasekl.</p></div>${TEAM.err ? `<p class="tm-err" role="alert">${esc(TEAM.err)}</p>` : ''}${body}`);
}
document.addEventListener('submit', e => {
  const f = e.target.closest('[data-tmform]'); if (!f) return; e.preventDefault();
  /* rozepsané hodnoty přežijí překreslení po chybě */
  TEAM.draft = {name:(f.querySelector('#tm-name') || {}).value || TEAM.draft.name || '', code:(f.querySelector('#tm-code') || {}).value || TEAM.draft.code || ''};
  if (f.dataset.tmform === 'create') tmAct('create', f.querySelector('#tm-name').value);
  else { if (!f.querySelector('#tm-agree').checked) { TEAM.err = 'Pro připojení potvrďte souhlas se sdílením souhrnu.'; renderTeam(); return; } tmAct('join', f.querySelector('#tm-code').value); }
});
document.addEventListener('click', e => {
  /* po otevření stránky Tým se přehled načte znovu, ať je postup kolegů aktuální */
  if (e.target.closest('[data-go=tym]') && TRK.ok && !TEAM.busy) setTimeout(tmLoad, 0);
  const b = e.target.closest('[data-tm]'); if (!b) return; const [a, arg] = b.dataset.tm.split(':');
  if (a === 'copy') { try { navigator.clipboard.writeText(TEAM.team.code); toast('Kód týmu je ve schránce.'); } catch (err) {} return; }
  if (a === 'reload') { tmLoad(); return; }
  if ((a === 'leave' || a === 'dissolve' || a === 'remove') && !confirm(a === 'leave' ? 'Opustit tým?' : a === 'dissolve' ? 'Zrušit tým? Členové ho přestanou vidět.' : 'Odebrat člověka z týmu?')) return;
  tmAct(a, arg);
});
