
/* ---------- měření průchodu, zpětná vazba a dashboard vlastníka ----------
   Data jdou do sdílené databáze stránky na claude.ai: jeden dokument na člověka (track/<id>) a jeho zpětná vazba (feedback/<id>).
   Ukládají se jen identifikátory lidí, jména dohledá dashboard při zobrazení. Mimo claude.ai (nebo bez práva zápisu) se nic neměří. */
const TRK = {db:null, user:null, uid:null, owner:false, ok:false, doc:null, dirty:false, busy:false, cur:null, curAt:0, lastClick:''};
const tNow = () => Date.now(), tDay = () => dKey(0);
const tInc = (o, k, n) => { o[k] = (o[k] || 0) + (n === undefined ? 1 : n); };
const tPush = (a, v, max) => { a.push(v); while (a.length > max) a.shift(); };
function tBlank(){ return {v:1, first:tNow(), last:tNow(), visits:{}, secs:{}, dev:{}, role:null, prog:{}, pv:{}, tm:{}, clicks:{}, locked:{}, quiz:{}, wrong:[], perf:{load:[], fcp:[], render:[], size:0, errs:[]}, spock:{n:0, tin:0, tout:0, ms:[], err:0}, ev:[]}; }
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
  W.forEach(w => { const t = weekTotals(w); mods[w.id] = [t.done, t.tot, w.days.filter((_, di) => lessonDone(w, di)).length, w.days.length, quizPassed(w) ? 1 : 0, cardsAll(w), cardsTotal(w)]; if (applies(w) && w.id !== 'l1b') { done += t.done; tot += t.tot; } });
  T.prog = {xp:S.xp || 0, pct:tot ? Math.round(100 * done / tot) : 0, mods, loc:tLoc(), badges:Object.keys(S.badges || {}).filter(k => k.startsWith('got.')).length, streak:streak(), sim:!!(S.badges && S.badges.sim), video:!!S.seenVideo};
  T.wrong = Object.keys(S.cards || {}).filter(k => { const [wid, di, ci] = k.split('.'), w = W.find(x => x.id === wid), c = w && w.days[+di] && w.days[+di].cards[+ci]; return c && S.cards[k] !== c.a; });
}
function tTick(){
  const T = TRK.doc; if (!T || !TRK.cur) return;
  const s = Math.min(600, Math.round((tNow() - TRK.curAt) / 1000)); if (s <= 0) return;
  tInc(T.tm, TRK.cur, s); tInc(T.secs, tDay(), s); TRK.curAt = tNow(); TRK.dirty = true;
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
function trackRender(ms){ const T = TRK.doc; if (T && ms >= 0) { tPush(T.perf.render, Math.round(ms), 40); } }
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
  if (el.tagName === 'SUMMARY') return 'rozbalit: ' + (el.textContent || '').trim().slice(0, 40);
  return (el.tagName === 'A' ? 'odkaz: ' : 'tlačítko: ') + ((el.getAttribute('aria-label') || el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40) || el.className || '?');
}
document.addEventListener('click', e => {
  const T = TRK.doc; if (!T) return;
  const el = e.target.closest('button, a, summary, input[type=checkbox], [data-card]'); if (!el || el.closest('#dash')) return;
  const k = tClickKey(el); tInc(T.clicks, k); TRK.lastClick = k;
  if (el.dataset && el.dataset.week) { const w = W.find(x => x.id === el.dataset.week); if (w && isLocked(w)) tInc(T.locked, w.id); }
  trk('klik', k);
}, true);
window.addEventListener('error', e => { const T = TRK.doc; if (T) { tPush(T.perf.errs, [tNow(), String(e.message || 'chyba').slice(0, 160), tLoc()], 20); TRK.dirty = true; } });
document.addEventListener('visibilitychange', () => { if (document.hidden) { tFlush(); } else { TRK.curAt = tNow(); } });
window.addEventListener('pagehide', () => { tFlush(); });

(async () => {
  let db = null, user = null;
  try { db = await claude.use('db'); user = await claude.use('user'); } catch (e) {}
  if (!db || !user) return;
  let me = null; try { me = await user.me(); } catch (e) {}
  if (!me || !me.id) return;
  TRK.db = db; TRK.user = user; TRK.uid = me.id; TRK.owner = !!(me.isOwner || me.canEdit);
  let doc = null;
  try { const s = await db.doc('track/' + me.id).get(); doc = s.exists ? JSON.parse(JSON.stringify(s.data())) : null; } catch (e) { return; }
  const T = Object.assign(tBlank(), doc || {});
  ['visits','secs','pv','tm','clicks','locked','quiz'].forEach(k => { if (!T[k] || typeof T[k] !== 'object') T[k] = {}; });
  T.perf = Object.assign({load:[], fcp:[], render:[], size:0, errs:[]}, T.perf || {}); T.spock = Object.assign({n:0, tin:0, tout:0, ms:[], err:0}, T.spock || {}); T.ev = Array.isArray(T.ev) ? T.ev : [];
  tInc(T.visits, tDay());
  T.dev = {w:innerWidth, h:innerHeight, mobile:innerWidth < 760, dark:matchMedia('(prefers-color-scheme: dark)').matches, touch:'ontouchstart' in window, lang:navigator.language || ''};
  try {
    const nav = performance.getEntriesByType('navigation')[0];
    if (nav) tPush(T.perf.load, Math.round(nav.domContentLoadedEventEnd || nav.duration || 0), 20);
    const fcp = performance.getEntriesByName('first-contentful-paint')[0]; if (fcp) tPush(T.perf.fcp, Math.round(fcp.startTime), 20);
    T.perf.size = document.documentElement.outerHTML.length;
  } catch (e) {}
  TRK.doc = T; TRK.ok = true; TRK.dirty = true;
  trk('návštěva', T.dev.mobile ? 'mobil' : 'počítač');
  trackView(); await tFlush();
  setInterval(tFlush, 20000);
  if (TRK.owner) {
    const pp = document.getElementById('pill-prog');
    if (pp && !document.getElementById('pill-dash')) pp.insertAdjacentHTML('afterend', '<button class="pill" id="pill-dash" type="button" data-go="dash" title="Dashboard: jak lidé procházejí tutoriálem">Dashboard</button>');
    if (view.name !== 'week' && view.name !== 'home') render();
  }
})();

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
    const item = {id:'f' + tNow().toString(36) + Math.random().toString(36).slice(2, 6), at:tNow(), loc:tLoc(), where:ov.querySelector('#fb-where').textContent, kind:ov.querySelector('#fb-kind').value, text:ov.querySelector('#fb-text').value.trim(), fix:ov.querySelector('#fb-fix').value.trim(), role:S.role || null, ver:(document.querySelector('.ver') || {}).textContent || ''};
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
const DASH = {rows:null, fb:null, state:{}, names:{}, err:'', at:0, withMe:false, sel:null, days:14, loading:false};
const dMed = a => { const b = (a || []).filter(x => typeof x === 'number').sort((x, y) => x - y); return b.length ? b[Math.floor(b.length / 2)] : null; };
const dP90 = a => { const b = (a || []).filter(x => typeof x === 'number').sort((x, y) => x - y); return b.length ? b[Math.min(b.length - 1, Math.floor(b.length * .9))] : null; };
const dSum = o => Object.values(o || {}).reduce((n, x) => n + (+x || 0), 0);
const dMs = v => v === null ? '—' : v >= 1000 ? (v / 1000).toFixed(1).replace('.', ',') + ' s' : v + ' ms';
const dDur = s => s >= 3600 ? Math.floor(s / 3600) + ' h ' + Math.round(s % 3600 / 60) + ' min' : s >= 60 ? Math.round(s / 60) + ' min' : s + ' s';
const dAgo = t => { const d = Math.floor((tNow() - t) / 864e5); return d <= 0 ? 'dnes' : d === 1 ? 'včera' : 'před ' + d + ' dny'; };
const dWhen = t => { const d = new Date(t); return d.getDate() + '. ' + (d.getMonth() + 1) + '. ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); };
const dNum = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const dName = id => esc(DASH.names[id] || 'Neznámý uživatel');
async function dashLoad(){
  if (!TRK.db || DASH.loading) return;
  DASH.loading = true; DASH.err = '';
  try {
    await tFlush();
    const [tr, fb, st] = await Promise.all([TRK.db.collection('track').limit(1000).get(), TRK.db.collection('feedback').limit(1000).get(), TRK.db.doc('todo/state').get()]);
    DASH.rows = tr.docs.map(d => Object.assign({id:d.id}, d.data()));
    DASH.fb = []; fb.docs.forEach(d => (d.data().items || []).forEach(it => DASH.fb.push(Object.assign({uid:d.id}, it))));
    DASH.fb.sort((a, b) => b.at - a.at);
    DASH.state = st.exists ? JSON.parse(JSON.stringify(st.data())) : {}; if (!DASH.state.done) DASH.state.done = {};
    const ids = [...new Set(DASH.rows.map(r => r.id).concat(DASH.fb.map(f => f.uid)))];
    try { const ps = await TRK.user.profiles(ids); ids.forEach(id => { DASH.names[id] = (ps[id] && ps[id].name) || ''; }); } catch (e) {}
    DASH.at = tNow();
  } catch (e) { DASH.err = 'Data se nepodařilo načíst. Zkuste to znovu.'; }
  DASH.loading = false;
  if (view.name === 'dash') renderDash();
}
function dTile(label, value, sub){ return `<div class="ds-tile"><span class="ds-l">${label}</span><b class="num">${value}</b>${sub ? `<small>${sub}</small>` : ''}</div>`; }
function dBars(rows, unit){
  const max = Math.max(1, ...rows.map(r => r[1]));
  return `<div class="ds-bars" role="img" aria-label="Sloupcový graf">${rows.map(r => `<div class="ds-bar" title="${esc(r[0])}: ${dNum(r[1])}${unit || ''}"><span class="ds-bv num">${r[1] ? dNum(r[1]) : ''}</span><i style="height:${Math.round(r[1] / max * 100)}%"></i><span class="ds-bl">${esc(r[2] || r[0])}</span></div>`).join('')}</div>`;
}
function dHBars(rows, total){
  const max = Math.max(1, total || 0, ...rows.map(r => r[1]));
  return `<div class="ds-hb">${rows.map(r => `<div class="ds-hr" title="${esc(r[0])}: ${dNum(r[1])}"><span class="ds-hl">${esc(r[0])}</span><span class="ds-ht"><i style="width:${Math.round(r[1] / max * 100)}%"></i></span><span class="ds-hv num">${dNum(r[1])}${r[2] ? ' <small>' + r[2] + '</small>' : ''}</span></div>`).join('')}</div>`;
}
function dTable(head, rows, empty){
  if (!rows.length) return `<p class="muted">${empty || 'Zatím žádná data.'}</p>`;
  return `<div class="tw ds-tw"><table><thead><tr>${head.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
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
    ['Dokončili Superuser', rows.filter(r => mod(r, 'l4')[0] === mod(r, 'l4')[1]).length]];
  const funnel = steps.map((s, i) => [s[0], s[1], i && steps[i - 1][1] ? Math.round(100 * s[1] / steps[i - 1][1]) + ' % z předchozího' : '']);
  // kde se ztrácejí
  const stuck = rows.filter(r => now - r.last > 3 * 864e5 && (r.prog || {}).pct < 100);
  const stuckBy = {}; stuck.forEach(r => tInc(stuckBy, (r.prog || {}).loc || 'home'));
  const wrong = {}; rows.forEach(r => (r.wrong || []).forEach(k => tInc(wrong, k)));
  const answered = {}; rows.forEach(r => W.forEach(w => { /* počet lidí, kteří modul začali */ if (mod(r, w.id)[5] > 0) tInc(answered, w.id); }));
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
  const people = rows.slice().sort((a, b) => b.last - a.last).map(r => [
    `<button class="linkbtn" type="button" data-dash="who:${esc(r.id)}">${dName(r.id)}${r.id === TRK.uid ? ' (vy)' : ''}</button>`, r.role ? esc(ROLES[r.role]) : '—', dAgo(r.last), dNum(dSum(r.visits)), dDur(dSum(r.secs)),
    `<span class="ds-nw"><span class="ds-pct"><i style="width:${(r.prog || {}).pct || 0}%"></i></span> ${(r.prog || {}).pct || 0} %</span>`, esc(tLocLabel((r.prog || {}).loc || 'home')), dNum((r.prog || {}).xp || 0), (r.dev || {}).mobile ? 'mobil' : 'počítač']);
  app.innerHTML = shell('dash', `<div id="dash">
    <div class="mh c-indigo"><span class="eyebrow">Dashboard · jen pro vlastníka</span><h1>Jak lidé procházejí tutoriálem</h1>
      <p>Data z databáze stránky, načtená ${dWhen(DASH.at)}. Měří se jen lidé přihlášení na claude.ai s právem zápisu (sdílení jako Přispěvatel). <button class="btn sm" type="button" data-dash="reload">${DASH.loading ? 'Načítám…' : 'Načíst znovu'}</button>
      <label class="ds-chk"><input type="checkbox" data-dash="me" ${DASH.withMe ? 'checked' : ''}> Započítat i mě</label></p></div>
    <div class="ds-tiles">${dTile('Lidé celkem', n)}${dTile('Aktivní za 7 dní', act7)}${dTile('Návštěv dnes', today)}${dTile('Návštěv celkem', dNum(totVisits))}${dTile('Čas na stránce', dDur(totSecs), n ? 'průměr ' + dDur(Math.round(totSecs / n)) + ' na člověka' : '')}${dTile('Dokončili úroveň 0', steps[4][1], n ? Math.round(100 * steps[4][1] / n) + ' % lidí' : '')}${dTile('Otevřená zpětná vazba', openFb.length, DASH.fb.length + ' celkem')}${dTile('Dotazy na Spocka', dNum(sp.n), 'lidí: ' + sp.people)}</div>

    <div class="sec-h"><h2>Zpětná vazba k vyřízení</h2><p>Každá položka je úkol: kdo ji napsal, kde a co navrhuje. Odškrtnutím ji uzavřete.</p></div>
    ${DASH.fb.length ? `<div class="ds-fb">${DASH.fb.map(f => `<label class="ds-fbi ${DASH.state.done[f.id] ? 'done' : ''}"><input type="checkbox" data-dash="fb:${esc(f.id)}" ${DASH.state.done[f.id] ? 'checked' : ''}><span><b>${esc((FB_KINDS.find(k => k[0] === f.kind) || [0, f.kind])[1])}</b> · ${esc(f.where || '')}<small>${dName(f.uid)}${f.role ? ' · ' + esc(ROLES[f.role]) : ''} · ${dWhen(f.at)}</small><span class="ds-fbt">${esc(f.text)}</span>${f.fix ? `<span class="ds-fbf"><b>Návrh:</b> ${esc(f.fix)}</span>` : ''}${f.loc && f.loc.includes('/') ? `<button class="linkbtn" type="button" data-dash="open:${esc(f.loc)}">Otevřít to místo</button>` : ''}</span></label>`).join('')}</div>
      <p><button class="btn sm" type="button" data-dash="md">Zkopírovat otevřené jako Markdown do TODO</button></p>` : '<p class="muted">Zatím nikdo nic nenapsal. Tlačítko „Zpětná vazba“ je vlevo dole na každé stránce.</p>'}

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
      <div><h3>Kliknutí na zamčený modul</h3>${dTable(['Modul', 'Kliknutí'], top(lockedC, 9).map(([k, v]) => [esc((W.find(w => w.id === k) || {title:k}).title), v]), 'Nikdo neklikal na zamčený modul.')}</div>
    </div>

    <div class="sec-h"><h2>Lidé</h2><p>Kliknutím na jméno uvidíte poslední kroky toho člověka.</p></div>
    ${dTable(['Kdo', 'Role', 'Naposledy', 'Návštěv', 'Čas', 'Pokrok', 'Kde je', 'XP', 'Zařízení'], people, 'Zatím nikdo.')}
    ${sel ? `<div class="ds-who"><h3>Poslední kroky: ${dName(sel.id)} <button class="btn sm" type="button" data-dash="who:">Zavřít</button></h3>${dTable(['Kdy', 'Co', 'Kde nebo na co'], (sel.ev || []).slice(-80).reverse().map(e => [dWhen(e[0]), esc(e[1]), e[1] === 'view' ? esc(tLocLabel(e[2])) : e[1] === 'klik' ? dClickLabel(e[2]) : esc(e[2])]), 'Žádné kroky.')}</div>` : ''}

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
