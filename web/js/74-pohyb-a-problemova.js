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

