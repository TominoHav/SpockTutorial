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
      <p>Data z databáze stránky, načtená ${dWhen(DASH.at)}. Měří se jen lidé přihlášení na claude.ai s právem zápisu (sdílení jako Přispěvatel). <button class="btn sm" type="button" data-dash="reload">${DASH.loading ? 'Načítám…' : 'Načíst znovu'}</button> <button class="btn sm" type="button" data-go="admin">Testování kurzu →</button>
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

