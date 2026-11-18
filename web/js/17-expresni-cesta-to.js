/* ---------- expresní cesta: to nejnutnější pro start se SPOCKem za zhruba 1 h 40 min ----------
   Kroky z existujících lekcí: nejdřív objednání rolí v Přípravě, pak v úrovni 0 jen karty (bez úkolů). Zbytek cesty zůstává na později. */
const EXPRESS = [
  /* přístupy první: schválení v REDIMu trvá dny a běží, zatímco se člověk učí; kdo je objedná až na konci, čeká o to déle na první běh */
  {id:'l1', t:'Objednejte si přístupy', d:'Lekce 1.1: role v REDIMu. Schválení trvá pár dní a běží, zatímco pokračujete.', min:45, w:'l1', l:0},
  {id:'sim', t:'Vyzkoušejte SPOCK nanečisto', d:'Celý běh od nápadu po iniciativu ve zkratce.', min:5, done:() => !!(S.badges && S.badges.sim), go:'sim'},
  {id:'l0c0', t:'Co SPOCK dělá a proč', d:'Lekce 0.1, jen karty.', min:15, w:'l0', l:0, cards:true},
  {id:'l0c1', t:'Agenti, tasky a brány', d:'Lekce 0.2, jen karty.', min:15, w:'l0', l:1, cards:true},
  {id:'l0c2', t:'Pět pravidel, která se neporušují', d:'Lekce 0.3.', min:10, w:'l0', l:2, cards:true},
  {id:'vid', t:'Video: SPOCK krok za krokem', d:'Hotový běh všemi sedmi fázemi za 4 minuty.', min:5, done:() => !!(S.vids && S.vids['krok-za-krokem']), video:'krok-za-krokem'},
  {id:'cheat', t:'Tahák tasků', d:'Které tasky budete používat a kdy.', min:5, done:() => !!(S.exSeen && S.exSeen.cheat), go:'cheat'}
];
const exDone = st => { if (st.done) return st.done(); const w = W.find(x => x.id === st.w); if (!w) return false; const d = w.days[st.l]; return st.cards ? (d.cards || []).every((_, ci) => cardAns(st.w + '.' + st.l + '.' + ci) !== undefined) : lessonDone(w, st.l); };
const pathHours = () => { try { return Math.round(pathIds().reduce((n, id) => { const w = W.find(x => x.id === id); return n + (w ? w.days.reduce((m, d) => m + dayLearn(d) + dayDo(d), 0) : 0); }, 0) / 60); } catch (e) { return 15; } };
/* Rozcestí jen pro toho, kdo ještě nic nezačal; ostatním stačí odkaz v banneru */
const started = () => !!S.pos || W.some(w => modPct(w) > 0);
const exNext = () => EXPRESS.find(st => !exDone(st));
const exLeft = () => EXPRESS.filter(st => !exDone(st)).reduce((n, st) => n + st.min, 0);
const exSeg = () => `<span class="exseg" aria-hidden="true">${EXPRESS.map(st => `<i class="${exDone(st) ? 'ok' : exNext() === st ? 'cur' : ''}"></i>`).join('')}</span>`;
const exList = () => `<ol class="exlist">${EXPRESS.map((st, i) => { const ok = exDone(st), cur = exNext() === st; return `<li class="${ok ? 'ok' : cur ? 'cur' : ''}"><button type="button" data-express="step:${st.id}"><span class="exl-ck" aria-hidden="true">${ok ? '✓' : i + 1}</span><span class="exl-t">${esc(st.t)}</span><span class="exl-m">${st.min} min</span></button></li>`; }).join('')}</ol>`;
/* Akční blok v banneru, když je expresní cesta zvolená */
function exHeroAction(roleLine){
  const nx = exNext(), done = EXPRESS.filter(exDone).length, i = nx ? EXPRESS.indexOf(nx) + 1 : 7;
  return `<div class="hx-next ex">
    <span class="hx-nl">${nx ? `Expresní cesta · krok ${i} ze ${EXPRESS.length}` : 'Expresní cesta hotová'}</span>
    <b class="hx-nt">${nx ? esc(nx.t) : 'Znáte to nejnutnější'}</b>
    <span class="hx-nm">${nx ? `${esc(nx.d.replace(/\.$/, ''))} · ~${nx.min} min · zbývá ~${fmtMin(exLeft())}` : 'Až dorazí přístupy, pokračujte Přípravou: instalace, Copilot a první běh.'}</span>
    ${exSeg()}
    <div class="hx-cta">${nx ? `<button class="btn primary" type="button" data-express="step:${nx.id}">${done ? 'Pokračovat' : 'Začít'}: ${esc(nx.t)} →</button>` : `<button class="btn primary" type="button" data-week="l1">Pokračovat Přípravou →</button>`}<button class="btn" type="button" data-open-spock>Zeptat se Spocka</button></div>
    <details class="exall"><summary>Všech ${EXPRESS.length} kroků</summary>${exList()}</details>
    <p class="exsw-l"><button class="linkbtn" type="button" data-express="off">Přepnout na celou cestu</button> <span class="muted">· pokrok zůstává</span></p>
    ${roleLine}</div>`;
}
/* Rozcestí: dvě rovnocenné volby po výběru role, dokud se člověk nerozhodne */
function exFork(roleLine){
  /* jako v pitch videu: dvě rovnocenné karty vedle sebe, pod nimi vstupní test */
  const full = pathHours();
  return `<div class="exfork" role="group" aria-label="Jak chcete začít">
    <span class="hx-nl">Jak chcete začít?</span>
    <div class="exf-opts">
      <button type="button" class="exf full" data-express="full" data-golesson="l0:0"><span class="exf-k">Celá cesta</span><b>~${full} h</b><span>Všechny úrovně s praxí ve VS Code až po vlastní běh.</span><span class="exf-go">Začít lekcí 0.1 →</span></button>
      <button type="button" class="exf fast" data-express="on"><span class="exf-k">Expresní start</span><b>1 h 40 min</b><span>To nejnutnější: co SPOCK dělá, pravidla, video a objednání přístupů. Pokrok se započítá.</span><span class="exf-go">Začít expres →</span></button>
    </div>
    <p class="exf-place">Znáte už SPOCK? <button class="linkbtn" type="button" data-place>Vstupní test (${PLACE_N} otázek)</button> přeskočí teorii úrovně 0.</p>${roleLine}</div>`;
}
function exCheck(){
  if (!S.express || S.got['express']) return;
  if (EXPRESS.every(exDone)) { award('express', 50, 'expresní cesta'); S.badges['got.express'] = dKey(0); save(); celebrate({kind:'module', title:'Expresní cesta hotová!', text:'Znáte to nejnutnější a přístupy jsou objednané. Až dorazí, pokračujte Přípravou: instalace, Copilot a první běh. Celá cesta na vás počká.'}); }
}
function exOpen(st){
  try { trk('expres', st.id); } catch (e) {}
  if (st.go === 'sim') return simStart();
  if (st.video) return playVideo(st.video);
  if (st.go) { if (st.go === 'cheat') { S.exSeen = Object.assign({}, S.exSeen, {cheat:1}); save(); setTimeout(exCheck, 0); } return go(st.go); }
  view.lesson = st.l; view.lessonOf = st.w; go('week', {week:st.w, peek:st.w});
}
document.addEventListener('click', e => {
  const b = e.target.closest('[data-express]'); if (!b) return;
  const v = b.dataset.express;
  if (v === 'on') { S.express = true; save(); try { trk('expres', 'zvolena'); } catch (err) {} render(); window.scrollTo(0, 0); const f = document.querySelector('.hx-next.ex .btn.primary'); if (f) f.focus({preventScroll:true}); return; }
  if (v === 'off') { S.express = false; save(); render(); return; }
  if (v === 'full') { S.express = false; save(); try { trk('expres', 'celá cesta'); } catch (err) {} return; } /* do první lekce otevře data-golesson */
  const st = EXPRESS.find(x => 'step:' + x.id === v); if (st) exOpen(st);
});
function startBlock(){
  return `<section class="startb"><div class="sec-h"><h2 id="role-h">Začněte: vyberte svou roli</h2><p>Role určí, který modul vás čeká na úrovni 2.</p></div>${roleCards()}
    <div class="startb-go"><button class="btn primary" type="button" data-week="l0" ${S.role ? '' : 'disabled'}>Začít úrovní 0: Poznejte SPOCK →</button><span class="muted">${S.role ? 'Role: ' + esc(ROLES[S.role]) : 'Nejdřív vyberte roli.'}</span></div></section>`;
}
function introCollapsed(){ return `<details class="introfold"><summary>${spockLogo('sm')}<b>Co je SPOCK</b><span>video a 8 hlavních myšlenek</span></summary>${introSection()}</details>`; }

/* 1 · Dvě tváře: jiná stránka pro nováčka a pro vracejícího se */
/* 2 · Jeden příběh shora dolů, číslované kroky; po návratu se hotové kroky sbalí */
/* 3 · Záložky: výchozí záložka podle toho, jestli jste tu poprvé */
/* 4 · Jedna stálá stránka, mění se jen akční blok banneru, sbalení videa a prázdný stav profilu */
function heroStable(){
  const first = isFirst(), n = nextLessonInfo(), w = n && n.w, p = w ? Math.round(modPct(w)*100) : 100;
  const roleLine = S.role
    ? `<div class="hx-role">Role: <b>${esc(ROLES[S.role])}</b> <button class="linkbtn" type="button" data-rolepick>změnit</button></div><div class="hx-rolepick" hidden>${roleBtns()}</div>`
    : `<div><div class="lbl hx-lbl">1. Vyberte svou roli</div>${roleBtns()}</div>`;
  const exOn = !first && S.express && S.role;
  const exLink = !first && S.role && !S.express ? `<p class="exsw-l"><button class="linkbtn" type="button" data-express="on">Málo času? Expresní start za 1 h 40 min</button></p>` : '';
  const action = exOn ? exHeroAction(roleLine) + miniStats()
    : (!first && S.express === undefined && !started()) ? exFork(roleLine) + miniStats()
    : first
    ? `<div class="hx-next first">${roleLine}<div class="hx-cta"><button class="btn primary" type="button" data-week="l0">${S.role ? '' : '2. '}Začít úrovní 0: Poznejte SPOCK →</button><button class="btn" type="button" data-open-spock>Zeptat se Spocka</button></div></div>`
    : `<div class="hx-next">
        <span class="hx-nl">Na řadě</span>
        <b class="hx-nt">${n ? (n.d ? esc(plain(n.d.t)) : 'Kvíz modulu') : 'Cesta je hotová'}</b>
        ${w ? `<span class="hx-nm">${esc(w.lab)} · ${esc(w.title)}${n.d ? ` · lekce ${esc(n.d.d)}, ~${fmtMin(dayLearn(n.d) + dayDo(n.d))}` : ''}</span><span class="cont-bar"><span class="bar"><i style="width:${p}%"></i></span><span class="num">${p} %</span></span>` : ''}
        <div class="hx-cta">${continueBtn()}<button class="btn" type="button" data-open-spock>Zeptat se Spocka</button></div>
        ${exLink}${roleLine}
      </div>${miniStats()}`;
  return `<section class="hx"><div class="hx-txt">
    <div class="hx-brand">${pdeLogo()}<span class="eyebrow">${first ? 'Vítejte v onboardingu SPOCKu' : 'Vítejte zpět · Onboarding do SPOCKu'}</span></div>
    <h1>Od první instalace <em>k vlastnímu běhu</em></h1>
    ${first ? '<p class="hx-lead">Pro Product Managera, Product Designera, Software Engineera a Guild Mastera. Naučí vás, jak SPOCK funguje uvnitř každé fáze, provede vás vlastním během a ukáže, čemu výstupu věřit a čemu ne.</p>' : ''}
    ${action}
  </div>${heroArt(first ? 'Ahoj, jsem Spock' : streak() ? `Série ${streak()} ${streak() === 1 ? 'den' : streak() < 5 ? 'dny' : 'dní'}!` : 'Vítejte zpět')}</section>`;
}
function homeV4(){
  /* nováček: jedna hlavní akce (nanečisto) v úvodu, pak výběr role a cesta; vysvětlení a opora sbalené níž */
  /* první použití (původní verze): banner, výběr role na stránce, pak rozbalené vysvětlení Co je SPOCK, až potom cesta */
  if (isFirst()) return heroFirst() + startBlock() + introSection() + pathBlock('Co vás čeká') + toolsBlock('Opora');
  const l1 = W.find(w => w.id === 'l1'), showSvy = l1 && modPct(l1) === 1 && !(S.survey && S.survey.at);
  /* Co je SPOCK hned pod banner, až pak Vaše cesta vesmírem */
  return heroStable() + `<div class="v4-gap">${introCollapsed()}</div>` + (showSvy ? surveyCard(true) : '') + pathBlock() + `<div class="sec-h"><h2>Profil a odznaky</h2>${isFirst() ? '<p>Za každý úkol, lekci a kvíz získáte XP. První odznak dostanete za první splněný úkol.</p>' : ''}</div>` + profileCard(true) + toolsBlock();
}
function renderHome(){ app.innerHTML = homeV4(); }
document.addEventListener('click', e => {
  const t = e.target.closest('[data-golesson],[data-scrollto],[data-rolepick]'); if (!t) return;
  if (t.dataset.golesson) { const [id, li] = t.dataset.golesson.split(':'); view.lesson = +li; view.lessonOf = id; return go('week', {week:id}); }
  if (t.dataset.scrollto) { const el = document.getElementById(t.dataset.scrollto); if (el) el.scrollIntoView({behavior:'smooth', block:'start'}); return; }
  if (t.hasAttribute('data-rolepick')) { const r = document.querySelector('.hx-rolepick'); if (r) r.hidden = !r.hidden; }
});
/* Video v okně: pustí se odkudkoli (tlačítko {{video}} v úkolu) */
function playVideo(id){
  S.vids = S.vids || {}; const fresh = !S.vids[id || 'intro']; if (fresh) { S.vids[id || 'intro'] = 1; save(); try { trk('video', id || 'intro'); } catch (e) {} setTimeout(exCheck, 0); }
  const ov = document.createElement('div'); ov.className = 'vidov'; ov.setAttribute('role','dialog'); ov.setAttribute('aria-modal','true'); ov.setAttribute('aria-label','Video: Co je SPOCK');
  ov.innerHTML = `<div class="vidov-in"><button type="button" class="g-x vidov-x" aria-label="Zavřít video">×</button>${vidTag(id)}</div>`;
  document.body.append(ov);
  const v = ov.querySelector('video'), close = () => { v.pause(); ov.remove(); };
  v.addEventListener('error', () => { if (navigator.onLine) return; const vk = id || 'intro'; if (fresh && S.vids) { delete S.vids[vk]; save(); } ov.querySelector('.vidov-in').insertAdjacentHTML('beforeend', '<p class="vid-off" role="status">Video se bez připojení nenačte. Pusťte si ho, až budete online; ostatní lekce fungují dál.</p>'); }, true);
  ov.querySelector('.vidov-x').onclick = close;
  ov.addEventListener('click', e => { if (e.target === ov) close(); });
  ov.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  v.play().catch(() => {}); ov.querySelector('.vidov-x').focus();
}
document.addEventListener('click', e => { const vb = e.target.closest('[data-playvideo]'); if (vb) { e.preventDefault(); playVideo(vb.dataset.playvideo || ''); } });
document.addEventListener('play', e => { if (e.target.matches && e.target.matches('.cv-video') && !S.seenVideo) { S.seenVideo = true; save(); } }, true);


