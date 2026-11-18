/* ---------- upozornění v horní liště: opakování chyb a novinky ve SPOCKu ----------
   Zvonek vedle série, XP a procent ukazuje počet; po kliknutí se otevře panel. Když přibude něco nového,
   jednou vyskočí hláška (opakování nejvýš jednou denně, novinky jednou). Úvodní stránka zůstává jen pro cestu. */
const newsItems = () => S.role && S.spockSeen && S.spockSeen !== BUILD.spock ? NOVINKY[BUILD.spock] || null : null;
function ntfCount(){ return (S.role && revDue().length ? 1 : 0) + (newsItems() ? 1 : 0); }
function ntfPanel(){
  const n = S.role ? revDue().length : 0, news = newsItems(), parts = [];
  if (n) parts.push(`<div class="ntf-i"><b>Opakování chyb</b><p>${n} ${n === 1 ? 'karta' : n < 5 ? 'karty' : 'karet'} k zopakování. Co jste netrefili, se vrací s odstupem, dokud to neumíte. +5 XP za každou.</p><button class="btn primary sm" type="button" data-review>Opakovat →</button></div>`);
  if (news) parts.push(`<div class="ntf-i"><b>Co je nového ve SPOCKu ${esc(BUILD.spock)}</b><ul>${news.map(x => `<li>${fmt(x)}</li>`).join('')}</ul><button class="btn sm" type="button" data-newsok>Rozumím</button></div>`);
  return parts.length ? parts.join('') : '<p class="ntf-empty">Nic nového. Až budete mít co opakovat nebo SPOCK přinese novinky, objeví se tady.</p>';
}
function ntfUpdate(){
  if (S.role && !S.spockSeen) { S.spockSeen = BUILD.spock; save(); }
  const b = document.getElementById('pill-ntf'); if (!b) return;
  const c = ntfCount(); b.hidden = !S.role; b.classList.toggle('has', !!c);
  b.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20a2 2 0 0 0 4 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>${c ? `<b class="ntf-n">${c}</b>` : ''}`;
  b.setAttribute('aria-label', c ? 'Upozornění: ' + c : 'Upozornění: nic nového'); b.title = b.getAttribute('aria-label');
  const pop = document.getElementById('ntf-pop'); if (pop && !pop.hidden) pop.innerHTML = ntfPanel();
  /* vyskočí jednou: novinky po nové verzi, opakování jednou denně */
  if (S.role && newsItems() && S.newsNotified !== BUILD.spock) { S.newsNotified = BUILD.spock; save(); notice({kind:'badge', title:'Co je nového ve SPOCKu ' + BUILD.spock, text:'Podívejte se na zvonek nahoře.'}); }
  const n = S.role ? revDue().length : 0;
  if (n && S.revNotified !== dKey(0)) { S.revNotified = dKey(0); save(); notice({kind:'badge', title:n + ' ' + (n === 1 ? 'karta' : n < 5 ? 'karty' : 'karet') + ' k zopakování', text:'Najdete je u zvonku nahoře.'}); }
}
function ntfToggle(open){
  const b = document.getElementById('pill-ntf'); let pop = document.getElementById('ntf-pop'); if (!b) return;
  if (!pop) { pop = document.createElement('div'); pop.id = 'ntf-pop'; pop.className = 'ntf-pop'; pop.setAttribute('role', 'region'); pop.setAttribute('aria-label', 'Upozornění'); pop.hidden = true; document.body.append(pop); }
  const show = open === undefined ? pop.hidden : open;
  pop.hidden = !show; b.setAttribute('aria-expanded', String(show));
  /* panel visí přímo pod zvonkem a zarovná se k jeho pravé hraně; na úzké obrazovce přes celou šířku */
  if (show) { const r = b.getBoundingClientRect(), w = Math.min(380, innerWidth - 24); pop.style.top = Math.round(r.bottom + 8) + 'px'; pop.style.left = Math.round(Math.max(12, Math.min(r.right - w, innerWidth - w - 12))) + 'px'; pop.style.right = 'auto'; pop.style.width = w + 'px'; }
  if (show) { pop.innerHTML = ntfPanel(); const f = pop.querySelector('button'); if (f) f.focus(); try { trk('upozornění', 'otevřeno'); } catch (e) {} }
}
document.addEventListener('click', e => {
  if (e.target.closest('#pill-ntf')) { ntfToggle(); return; }
  if (e.target.closest('[data-review],[data-newsok]')) ntfToggle(false);
  else if (!e.target.closest('#ntf-pop')) { const p = document.getElementById('ntf-pop'); if (p && !p.hidden) ntfToggle(false); }
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') { const p = document.getElementById('ntf-pop'); if (p && !p.hidden) { ntfToggle(false); document.getElementById('pill-ntf').focus(); } } });
document.addEventListener('click', e => { if (e.target.closest('[data-newsok]')) { S.spockSeen = BUILD.spock; save(); ntfUpdate(); render(); } });
let SES = null;
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
const cardsTotal = w => w.days.reduce((n, d) => n + (d.cards || []).length, 0);
const cardsAll = w => w.days.reduce((n, d, di) => n + cardsDone(w, di), 0);
const quizReady = w => cardsAll(w) === cardsTotal(w);
const quizPassed = w => !!(S.qpass && S.qpass[w.id]);
function sesItem(src, key){
  const ord = shuffle(src.o.map((_, i) => i));
  return {key, q:src.q, e:src.e !== undefined ? src.e : src.why, o:ord.map(i => src.o[i]), a:ord.indexOf(src.a)};
}
function startSession(wid, mode){
  if (mode === 'rev') return startReview();
  const w = W.find(x => x.id === wid); if (!w) return;
  if (mode === 'quiz' && !quizReady(w)) { toast('Kvíz se odemkne po kartách modulu (' + cardsAll(w) + ' z ' + cardsTotal(w) + ').'); return; }
  let pool = w.quiz.map((q, i) => q.o.length ? sesItem(q, w.id + '.' + i) : null).filter(Boolean);
  if (mode === 'jump') w.days.forEach((d, di) => (d.cards || []).forEach((c, ci) => { if (c.o.length && c.a >= 0) pool.push(sesItem(c, 'card.' + w.id + '.' + di + '.' + ci)); }));
  /* vstupní test: otázky z karet a kvízu úrovně 0; kdo ho zvládne, má teorii úrovně 0 splněnou a Přípravu odemčenou */
  if (mode === 'place') { pool = w.quiz.map((q, i) => q.o.length ? sesItem(q, w.id + '.' + i) : null).filter(Boolean); w.days.forEach((d, di) => (d.cards || []).forEach((c, ci) => { if (c.o.length && c.a >= 0) pool.push(sesItem(c, 'card.' + w.id + '.' + di + '.' + ci)); })); }
  const items = shuffle(pool).slice(0, mode === 'place' ? PLACE_N : QN);
  if (!items.length) return;
  SES = {wid, mode, items, qs:items.map((_, i) => i), i:0, hearts:(mode === 'jump' || mode === 'place') ? Math.max(1, items.length - Math.ceil(items.length * QPASS)) + 1 : 0, pick:null, checked:false, right:0, total:items.length, missed:new Set(), gained:0};
  SES.heartsMax = SES.hearts;
  renderSession();
}
/* jen pro automatický test: čtení stavu kvízu */
/* testovací háčky: jen v testovacím sestavení (e2e.html nastaví window.__E2E), ne pro uživatele */
if (window.__E2E) window.__kviz = {cardA: k => { const c = revCardOf(k); return c ? c.a : null; }, liveNow: () => dashLive(), streak: () => streak(), state: fn => { fn(S); save(); return true; },
  /* vyplní modul až na jeden úkol bez ověření a vrátí, kde zůstal: test ho pak odškrtne opravdovým kliknutím */
  almost: wid => { const w = W.find(x => x.id === wid); let left = null; S.qpass = S.qpass || {};
    for (let di = w.days.length - 1; di >= 0 && !left; di--) for (let ti = w.days[di].todo.length - 1; ti >= 0; ti--) if (!w.days[di].todo[ti].check) { left = [di, ti]; break; }
    w.days.forEach((d, di) => { d.todo.forEach((_, ti) => { if (!(left && left[0] === di && left[1] === ti)) S.todo[wid+'.'+di+'.'+ti] = true; }); (d.cards || []).forEach((c, ci) => { S.cards[wid+'.'+di+'.'+ci] = c.a; }); });
    S.qpass[wid] = {at:Date.now(), right:5, total:5}; save(); render(); return left; },
  scenes: () => playScenes(storyScenes(), 'Příběh vaší cesty', 'příběh'),
  open: id => go('week', {week:id, peek:id}),
  skins: () => SKINS.map(k => [k.n, k.d, spockSVG('fab', k)]), finish: () => { S.qpass = S.qpass || {}; pathMods().forEach(w => { w.days.forEach((d, di) => { d.todo.forEach((_, ti) => { S.todo[w.id+'.'+di+'.'+ti] = true; }); (d.cards || []).forEach((c, ci) => { S.cards[w.id+'.'+di+'.'+ci] = c.a; }); }); S.qpass[w.id] = S.qpass[w.id] || {at:Date.now(), right:5, total:5}; }); save(); render(); return pathDone(); }, path: () => pathIds(), badges: () => myBadges().map(b => b[0]), idle: mins => { const now = Date.now(); tTick(); const b = Object.values(TRK.doc.secs).reduce((n, x) => n + x, 0); TRK.act = now - (mins + 2) * 60000; TRK.curAt = now - mins * 60000; tTick(); return Object.values(TRK.doc.secs).reduce((n, x) => n + x, 0) - b; }, check: (w, d, t) => { const m = W.find(x => x.id === w); return m.days[d].todo[t].check.a; }, build: () => BUILD, ctx: () => { const v = view, out = {}; W.forEach(w => { view = Object.assign({}, v, {name:'week', week:w.id}); out[w.id] = rules().length; }); view = v; return out; }, mods: () => W.map(w => ({id:w.id, lessons:w.days.length, cards:cardsTotal(w)})), ses: () => SES, pool: id => { const w = W.find(x => x.id === id); return w ? w.quiz.length : 0; }};
function sesQ(){ const w = W.find(x => x.id === SES.wid) || {id:SES.wid, title:'Opakování chyb', c:'indigo'}, qi = SES.qs[SES.i]; return {w, qi, q:SES.items[qi]}; }
function renderSession(){
  let ov = document.getElementById('ses');
  if (!ov) { ov = document.createElement('div'); ov.id = 'ses'; ov.className = 'ses'; ov.setAttribute('role','dialog'); ov.setAttribute('aria-modal','true'); document.body.append(ov); }
  const {w, q} = sesQ();
  const game = SES.mode === 'quiz', wd = game ? (worldOf(w) || {n:w.title, foe:'Překážka', c:'#A54CB2'}) : null;
  ov.className = 'ses c-' + w.c + (game ? ' ses-game' : '');
  const pct = Math.round(SES.i / SES.qs.length * 100);
  const hearts = (SES.mode === 'jump' || SES.mode === 'place') ? `<span class="ses-hearts" aria-label="Zbývá ${SES.hearts} ${SES.hearts === 1 ? 'srdíčko' : 'srdíčka'}">${Array.from({length:SES.heartsMax || SES.hearts}, (_, i) => `<span class="${i < SES.hearts ? '' : 'lost'}">${HEART}</span>`).join('')}</span>` : `<span class="ses-n num">${Math.min(SES.i + 1, SES.qs.length)} / ${SES.qs.length}</span>`;
  const body = `<div class="ses-opts">${q.o.map((o,oi) => {
      let cls = ''; if (SES.checked) { if (oi === q.a) cls = 'right'; else if (oi === SES.pick) cls = 'wrong'; } else if (oi === SES.pick) cls = 'picked';
      return `<button type="button" class="ses-opt ${cls}" data-sopt="${oi}" ${SES.checked?'disabled':''}><span class="ses-k">${oi+1}</span><span>${fmt(o)}</span></button>`; }).join('')}</div>`;
  let foot;
  if (!SES.checked) foot = `<div class="ses-foot">${SES.mode === 'quiz' ? '<button class="btn" type="button" data-sskip>Přeskočit</button>' : '<span></span>'}<button class="btn primary" type="button" data-scheck ${SES.pick === null ? 'disabled' : ''}>Zkontrolovat</button></div>`;
  else {
    const ok = SES.pick === q.a;
    foot = `<div class="ses-foot fb-${ok ? 'ok' : 'bad'}"><div class="ses-fb"><b>${ok ? 'Výborně!' : 'Správná odpověď: ' + fmt(q.o[q.a])}</b><p>${!ok && SES.mode === 'quiz' ? '<b>Spock radí:</b> ' : ''}${fmt(q.e || '')}${!ok && SES.mode === 'quiz' ? ' Otázka se vrátí na konci.' : ''}</p></div><button class="btn primary" type="button" data-snext>Pokračovat</button></div>`;
  }
  ov.innerHTML = `${game ? '<div class="sp-stars" aria-hidden="true"></div>' : ''}<div class="ses-in">
    <div class="ses-top"><button class="g-x" type="button" data-sclose aria-label="Ukončit kvíz">×</button>${game ? `<div class="mg-track" role="img" aria-label="Postup ${SES.i} z ${SES.qs.length}"><span class="mg-ship" style="left:${pct}%">${shipSVG()}</span>${SES.qs.map((_, k) => `<i class="${k < SES.i ? 'on' : ''}"></i>`).join('')}<span class="mg-goal" style="--pc:${wd.c}"></span></div>` : `<span class="ses-bar"><i style="width:${pct}%"></i></span>`}${hearts}</div>
    <div class="ses-body"><span class="eyebrow">${game ? `Překážka · ${wd.foe}` : (SES.mode === 'jump' ? 'Skokový test · ' : SES.mode === 'place' ? 'Vstupní test · ' : SES.mode === 'rev' ? '' : 'Ověř se · ') + esc(SES.mode === 'place' ? 'Poznejte SPOCK' : w.title)}</span><h2 class="ses-q">${fmt(q.q)}</h2>${body}</div>
    ${foot}</div>`;
  const f = ov.querySelector('[data-snext],[data-scheck]:not([disabled]),.ses-opt'); if (f) f.focus();
}
function sesCheck(){
  const {qi, q} = sesQ();
  SES.checked = true;
  const ok = SES.pick === q.a, first = !SES.missed.has(qi);
  if (ok) { if (first) SES.right++; if (SES.mode === 'quiz') SES.gained += award('quiz.' + q.key, first ? XP.quizFirst : XP.quizRetry); if (SES.mode === 'rev' && first) SES.gained += revDone(q.key, true); }
  else { if (SES.mode === 'rev' && first) revDone(q.key, false); SES.missed.add(qi); if (SES.mode === 'jump' || SES.mode === 'place') SES.hearts--; else SES.qs.push(qi); }
  renderSession();
}
function sesNext(){
  if ((SES.mode === 'jump' || SES.mode === 'place') && SES.hearts <= 0) return endSession(false);
  SES.i++; SES.pick = null; SES.checked = false;
  if (SES.i >= SES.qs.length) return endSession(true);
  renderSession();
}
function endSession(ok){
  const s = SES, w = W.find(x => x.id === s.wid); SES = null;
  const ov = document.getElementById('ses'); if (ov) ov.remove();
  const need = Math.ceil(s.total * QPASS);
  try { trackQuiz(s.wid, s.mode, !!ok && s.right >= need, s.right, s.total); } catch (e) {}
  if (s.mode === 'rev') { save(); celebrate({kind:'quiz', title:'Opakování hotové', text:`Napoprvé správně ${s.right} z ${s.total}. ${s.right === s.total ? 'Tyhle karty se vrátí za delší dobu.' : 'Netrefené karty se vrátí zítra.'} Získáno ${s.gained} XP.`}); render(); return; }
  if (s.mode === 'place') {
    if (ok && s.right >= need) { placeCredit(); celebrate({kind:'unlock', title:'Vstupní test zvládnutý', text:`${s.right} z ${s.total} správně. Teorii úrovně 0 máte splněnou a Příprava je odemčená. Praktické úkoly ve VS Code na vás počkají, ty se testem přeskočit nedají.`}); }
    else celebrate({kind:'fail', title:'Vstupní test nevyšel', text:`Potřebujete aspoň ${need} z ${s.total} správně. Nevadí, úroveň 0 vás to naučí. Test můžete zkusit znovu s jinými otázkami.`});
    render(); return;
  }
  if (s.mode === 'jump') {
    if (ok && s.right >= need) { S.unlocked[w.id] = true; save(); award('jump.' + w.id, XP.jump, 'skok'); celebrate({kind:'unlock', title:'Odemčeno: ' + w.title, text:`Skokový test zvládnutý: ${s.right} z ${s.total}. Modul je otevřený.`}); }
    else celebrate({kind:'fail', title:'Skokový test nevyšel', text:`Potřebujete aspoň ${need} z ${s.total} správně. Vraťte se k předchozímu modulu, nebo to zkuste znovu s jinými otázkami.`});
  } else {
    const passed = s.right >= need;
    S.qpass = S.qpass || {};
    if (passed && !S.qpass[w.id]) { S.qpass[w.id] = {at:Date.now(), right:s.right, total:s.total}; }
    save();
    const perfect = s.missed.size === 0;
    if (perfect && !S.badges.perfect) { S.badges.perfect = true; save(); }
    if (passed) celebrate({kind:'quiz', title: perfect ? 'Kvíz bez chyby!' : 'Kvíz splněný', text:`Správně napoprvé ${s.right} z ${s.total}. Získáno ${s.gained} XP.`});
    else celebrate({kind:'fail', title:'Kvíz zatím nesplněný', text:`Napoprvé správně ${s.right} z ${s.total}, potřeba je ${need}. Projděte si znovu karty a zkuste to: vylosují se jiné otázky.`});
    checkModuleDone(w);
  }
  render();
}
function checkModuleDone(w){
  if (w && modPct(w) === 1 && award('module.' + w.id, XP.module, 'modul')) { const wd = pathIds().includes(w.id) ? worldOf(w) : null, nx = nextOnPath();
    celebrate({kind:'module', title: wd ? 'Překážka překonána: ' + wd.foe : 'Modul hotový: ' + w.title, text: (wd ? wd.win + ' ' : '') + (nx ? 'Další svět: ' + worldOf(nx).n + '.' : pathDone() ? 'Jste u cíle. Spock na vás čeká s lodí.' : ''), fin: !!wd && pathDone(), mod: w.id}); }
}
document.addEventListener('click', e => {
  if (!SES) return;
  const t = e.target.closest('[data-sopt],[data-scheck],[data-snext],[data-sclose],[data-sskip]'); if (!t) return;
  if (t.dataset.sopt !== undefined) { SES.pick = +t.dataset.sopt; renderSession(); }
  else if (t.hasAttribute('data-scheck')) sesCheck();
  else if (t.hasAttribute('data-snext')) sesNext();
  else if (t.hasAttribute('data-sskip')) { SES.qs.push(SES.qs[SES.i]); SES.i++; SES.pick = null; if (SES.i >= SES.qs.length) endSession(true); else renderSession(); }
  else if (t.hasAttribute('data-sclose')) { const ov = document.getElementById('ses'); if (ov) ov.remove(); SES = null; render(); showCel(); }
});
document.addEventListener('keydown', e => {
  if (!SES) return;
  if (e.key === 'Escape') { const ov = document.getElementById('ses'); if (ov) ov.remove(); SES = null; render(); showCel(); return; }
  const {q} = sesQ();
  if (!SES.checked && /^[1-6]$/.test(e.key) && q.o[+e.key-1] !== undefined) { SES.pick = +e.key-1; renderSession(); }
  else if (e.key === 'Enter' && !e.target.closest('button')) { e.preventDefault(); if (SES.checked) sesNext(); else if (SES.pick !== null) sesCheck(); }
});

