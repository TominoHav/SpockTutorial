/* ---------- diagnostika ---------- */
function renderDiag(){
  const ladder = DIAG.filter(g => !/Nálezy/.test(g.g));
  const finds = DIAG.find(g => /Nálezy/.test(g.g));
  let n = 0;
  app.innerHTML = shell('diag', `
    <div class="mh c-purple"><span class="eyebrow">Když něco nejde</span><h1>Co vidím → co udělám</h1>
    <p class="why">${fmt(DIAG_INTRO)}</p></div>
    ${ladder.map(g => `<div class="sec-h"><h2>${esc(g.g)}</h2></div><div class="ladder c-purple">${g.t.rows.map(r => `<div class="rung"><span class="rn"><span>${++n}</span></span><div class="rb"><b>${fmt(r[0])}</b><p class="fix">${fmt(r[1])}</p></div></div>`).join('')}</div>`).join('')}
    ${finds ? `<div class="sec-h"><h2>Nálezy, které hlásíte</h2><p>Podle <a href="#" data-week="l3">úrovně 3, lekce 3.6</a>.</p></div><div class="mist">${finds.t.rows.map(r => `<div><b>${fmt(r[0])}</b><span>${fmt(r[1])}</span></div>`).join('')}</div>` : ''}
    <div class="sec-h"><h2>Nejčastější chyby uživatelů</h2></div>
    <div class="mist">${MISTAKES.map(m => `<div><b>${fmt(m[0])}</b><span>${fmt(m[1])}</span></div>`).join('')}</div>
    <div class="sec-h"><h2>Jak SPOCK přemýšlí</h2></div>
    <ul class="keys c-purple">${PRINCIPLES.map(p => `<li><span>${fmt(p)}</span></li>`).join('')}</ul>`);
}

/* ---------- slovníček ---------- */
function renderGloss(q){
  q = (q || '').toLowerCase();
  const rows = GLOSS.filter(g => !q || (g[0]+' '+g[1]).toLowerCase().includes(q));
  app.innerHTML = shell('gloss', `
    <div class="mh c-blue"><span class="eyebrow">Slovníček</span><h1>Pojmy, které budete potřebovat</h1></div>
    <div class="gloss-tools"><input id="gloss-q" type="search" placeholder="Hledat pojem…" value="${esc(q)}" aria-label="Hledat pojem"></div>
    ${rows.length ? `<dl class="gloss">${rows.map(g => `<dt>${fmt(g[0])}</dt><dd>${fmt(g[1])}</dd>`).join('')}</dl>` : '<p class="muted">Nic nenalezeno. Zkuste jiné slovo.</p>'}`);
  const inp = $('#gloss-q'); if (inp && q) { inp.focus(); inp.setSelectionRange(q.length, q.length); }
}

/* ---------- tahák a připravenost ---------- */
function renderCheat(){
  app.innerHTML = shell('cheat', `
    <div class="mh c-blue"><span class="eyebrow">Opora</span><h1>Tahák tasků SPOCKu</h1>
    ${CHEAT_INTRO.map(p => `<p class="goal">${fmt(p)}</p>`).join('')}</div>
    ${CHEAT.map(g => `<div class="rgroup c-blue"><h3>${esc(g.g)}</h3><dl class="gloss cheat">${g.t.rows.map(r => `<dt>${/^`/.test(r[0]) ? fmt(r[0]) : '<span>' + fmt(r[0]) + '</span>'}</dt><dd>${fmt(r[1])}${r[2] && r[2] !== '—' ? `<span class="lvl">${esc(g.t.head[2])}: ${fmt(r[2])}</span>` : ''}</dd>`).join('')}</dl></div>`).join('')}`);
}

/* ---------- shell s railem ---------- */
/* ---------- cesta na stránce modulu: tři varianty ---------- */
const modState = w => { const lk = isLocked(w), p = modPct(w), here = nextOnPath(); return lk ? 'lock' : p === 1 ? 'done' : (here && here.id === w.id) ? 'here' : p > 0 ? 'part' : 'todo'; };
const lesState = (w, di) => { const cur = curLesson(w), p = lessonPct(w, di); return lessonDone(w, di) ? 'done' : di === cur ? 'here' : p > 0 ? 'part' : 'todo'; };
const selLesson = w => view.lessonOf === w.id ? view.lesson : (curLesson(w) >= 0 ? curLesson(w) : 0);
const pathMods = () => pathIds().map(id => W.find(w => w.id === id)).filter(Boolean);
const shortLab = w => w.role ? '2' : w.lab.replace('Úroveň ','');
const ringSvg = (p, c) => `<svg class="pv-ring" viewBox="0 0 36 36" aria-hidden="true"><circle cx="18" cy="18" r="15.5" fill="none" stroke="var(--surface-2)" stroke-width="4"/>${p > 0 ? `<circle cx="18" cy="18" r="15.5" fill="none" stroke="${c}" stroke-width="4" stroke-linecap="round" stroke-dasharray="${(p*97.4).toFixed(1)} 97.4" transform="rotate(-90 18 18)"/>` : ''}</svg>`;
const otherRoles = active => { const o = W.filter(w => w.role && w.role !== S.role); return o.length ? `<span class="grp">${S.role ? 'Jiné role' : 'Role'}</span>` + o.map(w => `<button type="button" class="${active===w.id?'on':''} dim c-${w.c}" data-week="${w.id}"><span class="dm"></span><span class="rl">${esc(w.title)}</span></button>` + sideLessons(w, active)).join('') : ''; };
/* moduly mimo cestu (jiné role, příručka): přepínač lekcí pod položkou v menu */
const sideLessons = (w, active) => active === w.id && view.name === 'week' ? `<div class="pd-in-card pd-side">${pdCard(w)}</div>` : '';

/* A · Časová osa: moduly pod sebou na svislé lince, aktivní modul rozbalí lekce */

/* C · Karty modulů: každý modul je karta s barevnou hlavičkou, lekce jako řada uzlů */

/* B · Mapa nahoře: cesta jako vodorovná linka metra přes celou šířku, levý sloupec jen na oporu */

/* D · B+C: metro nahoře se stanicemi s prstencem pokroku, pod ním karta aktivního modulu s očíslovanými lekcemi */

/* D (v levém sloupci) · Spock + cesta modulů s prstencem, aktivní modul rozbalí kartu s očíslovanými lekcemi */
function pdCard(w){
  const nd = w.days.filter((_,di) => lessonDone(w, di)).length, sl = selLesson(w), qd = qDone(w), qa = quizPassed(w);
  const steps = w.days.map((d,di) => { const ls = lesState(w, di); return `<li class="pd-l st-${ls} ${sl === di ? 'sel' : ''}"><button type="button" data-lesson="${di}" title="${esc(d.d + ' ' + plain(d.t))}" ${sl === di ? 'aria-current="true"' : ''}><span class="pd-ld">${ls === 'done' ? '✓' : esc(d.d.split('.').pop())}</span></button></li>`; }).join('')
    + `<li class="pd-l trophy ${qa ? 'st-done' : ''}"><button type="button" data-quiz="${w.id}" title="${qa ? 'Kvíz splněný' : quizReady(w) ? 'Kvíz modulu je odemčený' : 'Kvíz se odemkne po kartách'}"><span class="pd-ld">${TROPHY}</span></button></li>`;
  const cur = w.days[sl];
  return `<div class="pd-card c-${w.c}"><div class="pd-ch"><span>Lekce</span><span class="pd-cnt num">${nd}/${w.days.length} hotovo</span></div><ol class="pd-les ${w.days.length > 5 ? 'many' : ''}">${steps}</ol>${cur ? `<p class="pd-cur"><small>${esc(cur.d)}</small>${fmt(cur.t)}</p>` : ''}</div>`;
}
function railPathD(active){
  const aw = view.name === 'week' ? W.find(w => w.id === active) : null;
  const hereId = (nextOnPath() || {}).id;
  const items = pathMods().map(m => {
    const st = modState(m), on = m.id === active, p = modPct(m);
    const sub = st === 'lock' ? 'Zamčeno' : '<span class="pd-pc">' + Math.round(p*100) + ' %</span><span class="pd-ls"> · ' + m.days.filter((_,di) => lessonDone(m, di)).length + '/' + m.days.length + '</span>';
    return `<li class="pd-s st-${st} c-${m.c} ${on?'on':''}"><button type="button" class="pd-sb" data-week="${m.id}" ${on?'aria-current="step"':''}><span class="pd-node">${st === 'done' ? '' : ringSvg(p, 'var(--c)')}<span class="pd-in">${st === 'lock' ? LOCK : st === 'done' ? '✓' : esc(shortLab(m))}</span></span><span class="pd-lv">Úroveň ${esc(shortLab(m))}</span><span class="pd-sn"><b>${esc(m.title)}</b><small>${sub}</small></span>${(hereId ? m.id === hereId : on) ? `<span class="pd-spock">${spockSVG('fab')}</span>` : ''}</button>${on && aw && aw.id === m.id ? `<div class="pd-in-card">${pdCard(m)}</div>` : ''}</li>`;
  }).join('');
  const mob = aw ? `<div class="pd-mob-card">${pdCard(aw)}</div>` : '';
  /* na mobilu jsou v řadě jen kroky; název, procenta a lekce vybrané (nebo rozdělané) úrovně jsou na jednom řádku pod nimi */
  const cm = aw && pathIds().includes(aw.id) ? aw : pathMods().find(m => m.id === hereId) || pathMods()[0];
  const cap = cm ? `<p class="pd-cap c-${cm.c}"><b>${esc(cm.role ? 'Úroveň 2' : cm.lab)} · ${esc(cm.title)}</b><span>${isLocked(cm) ? 'zamčeno' : Math.round(modPct(cm)*100) + ' % · ' + cm.days.filter((_,di) => lessonDone(cm, di)).length + '/' + cm.days.length + ' lekcí'}</span></p>` : '';
  return `<div class="pdr"><span class="grp">Cesta</span><ol class="pd-line">${items}</ol>${cap}${mob}</div>`;
}

function shell(active, body){
  const wk0 = W.map(w => {
    const t = weekTotals(w), cls = t.done === t.tot ? 'full' : t.done ? 'half' : '';
    const other = w.role && S.role && w.role !== S.role;
    const lk = isLocked(w);
    return `<button type="button" class="${active===w.id?'on':''} ${other?'dim':''} ${lk?'lk':''} c-${w.c}" data-week="${w.id}">${lk ? '<span class="dm lkic">' + LOCK + '</span>' : `<span class="dm ${cls}"></span>`}<span class="rl">${esc(w.role ? '2 · ' + w.title : w.lab.replace('Úroveň ','') + ' · ' + w.title)}</span></button>`;
  }).join('');
  const gw = W.find(w => w.id === 'l1b');
  const guide = gw ? `<button type="button" class="${active===gw.id?'on':''} c-${gw.c}" data-week="${gw.id}"><span class="dm"></span>Příručka: ${esc(gw.title)}</button>` + sideLessons(gw, active) : '';
  /* Opora: nahoře jen to, bez čeho se člověk neobejde; zbytek sbalený v Další; dashboard jen pro vlastníka */
  const it = x => `<button type="button" class="${active===x[0]?'on':''} c-${x[2]}" data-go="${x[0]}"><span class="dm"></span>${x[1]}</button>`;
  const core = [['cheat','Tahák tasků','blue'],['diag','Když něco nejde','purple'],['gloss','Slovníček','blue']].map(it).join('');
  /* Další: profil s týmem a příručka; moduly jiných rolí se ukážou až po změně role */
  const extra = [['badges','Odznaky a profil','indigo'],['tym','Tým','indigo']], exOpen = extra.some(x => x[0] === active) || (gw && active === gw.id) || W.some(w => w.role && w.role !== S.role && w.id === active);
  const more = `<details class="rail-x" ${exOpen ? 'open' : ''}><summary>Další</summary>${extra.map(it).join('')}${guide}${W.some(w => w.role && w.role !== S.role && w.id === active) ? otherRoles(active) : ''}</details>`;
  const own = TRK.owner ? `<span class="grp">Jen pro vás</span>${it(['dash','Dashboard','indigo'])}` : '';
  return `<div class="ed"><nav class="rail" aria-label="Navigace">${railPathD(active) + `<div class="rail-more"><span class="grp">Opora</span>${core}${more}${own}</div>`}</nav><section class="main">${body}</section></div>`;
}

function nextWeek(){
  const n = nextOnPath(); if (n && !isLocked(n)) return n;
  return W.filter(counts).find(w => { const t = weekTotals(w); return t.done < t.tot; }) || W[W.length-1];
}
function render(){
  const t0 = performance.now();
  if (view.name === 'dash') renderDash();
  else if (view.name === 'home') renderHome();
  else if (view.name === 'week') renderWeek(view.week);
  else if (view.name === 'diag') renderDiag();
  else if (view.name === 'gloss') renderGloss(view.q);
  else if (view.name === 'cheat') renderCheat();
  else if (view.name === 'badges') renderBadges();
  else if (view.name === 'tym') renderTeam();
  updatePills();
  /* poslední místo pro „Pokračovat tam, kde jste skončil(a)“ */
  if (view.name === 'week' && typeof view.lesson === 'number' && (!S.pos || S.pos.w !== view.week || S.pos.l !== view.lesson)) { S.pos = {w:view.week, l:view.lesson}; save(); }
  try { trackRender(performance.now() - t0); trackView(); } catch (e) {}
}
function go(name, extra){
  view = Object.assign({}, view, {name, peek:null}, extra || {});
  render(); window.scrollTo({top:0});
}

/* ---------- události ---------- */
document.addEventListener('click', e => {
  const t = e.target.closest('[data-week],[data-go],[data-phase],[data-layer],[data-q],[data-retry],[data-reveal],[data-role]');
  if (!t) return;
  if (t.tagName === 'A') e.preventDefault();
  if (t.dataset.role) { S.role = t.dataset.role; save(); toast('Role: ' + ROLES[S.role]); award('welcome', 10, 'role'); checkBadges(); render(); /* přístupnost: po výběru role zaměřit další krok, ať se klávesnice neztratí */ const nx = document.querySelector('.exfork .exf, .hx [data-golesson], .hx [data-week=l0], [data-golesson]'); if (nx) nx.focus({preventScroll:true}); return; }
  if (t.dataset.week) return go(t.dataset.week === 'home' ? 'home' : 'week', {week:t.dataset.week});
  if (t.dataset.go === 'next') return go('week', {week:nextWeek().id});
  if (t.dataset.go) return go(t.dataset.go);
  const keep = () => { const y = window.scrollY; renderWeek(view.week); updatePills(); window.scrollTo({top:y}); };
});
document.addEventListener('change', e => {
  const t = e.target;
  if (t.dataset.todo) {
    S.todo[t.dataset.todo] = t.checked; save();
    if (t.checked) award('task.' + t.dataset.todo, XP.task);
    if (t.checked) try { const [wid, di, ti] = t.dataset.todo.split('.'), w0 = W.find(x => x.id === wid), o = w0 && w0.days[+di] && w0.days[+di].todo[+ti], c = o && o.check;
      trk('úkol', t.dataset.todo + ' ' + (!c ? 'bez ověření' : c.kind === 'run' ? ((S.runev || {})[t.dataset.todo] ? 'z běhu' : 'bez důkazu') : c.kind === 'seen' ? 'co viděli' : 'otázka')); } catch (err) {}
    updatePills();

    const w = W.find(x => x.id === view.week);
    if (w && t.checked) {
      const [, di] = t.dataset.todo.split('.').map(Number), d = w.days[di];
      if (d && lessonDone(w, di) && award('lesson.' + w.id + '.' + di, XP.lesson, 'lekce')) {
        celebrate({kind:'lesson', sum:lessonSum(w, di), title:'Lekce ' + d.d + ' hotová!', text:plain(d.t) + '. ' + (w.days[di+1] ? 'Na řadě je lekce ' + w.days[di+1].d + '.' : 'Na řadě je kvíz modulu.')});
        if (w.days[di+1]) view.lesson = di + 1;
      }
      checkModuleDone(w);
    }
    if (view.name === 'week' && view.lesson !== +t.dataset.todo.split('.')[1]) { renderWeek(view.week); toLessonTop(); return; }
    if (view.name === 'week') { const id = t.id, y = window.scrollY; renderWeek(view.week); window.scrollTo({top:y}); const el = id && document.getElementById(id); if (el && view.lesson === +t.dataset.todo.split('.')[1]) el.focus({preventScroll:true}); }
  }
});
document.addEventListener('input', e => {
  if (e.target.id === 'gloss-q') { view.q = e.target.value; renderGloss(view.q); }
});

