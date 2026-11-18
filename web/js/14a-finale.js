/* ---------- finále cesty: anglický komentář s českými titulky, šatna, certifikát ---------- */
/* Po dokončení cesty si člověk oblékne postavičku a pustí finále: krátký film o jeho vlastní cestě.
   Komentář mluví anglicky (hlas prohlížeče), titulky jsou české a jdou větu po větě s komentářem.
   Bez anglického hlasu nebo se ztlumeným zvukem běží titulky samy podle délky textu. */
const WORLDS_EN = {
  l0:{n:'Orientation Planet', foe:'the Nebula of Vagueness', win:'Spock lit up the map: seven stages, six agents, five rules. The fog cleared.'},
  l1:{n:'Orbital Dock', foe:'the Asteroid Field of Access Requests', win:'Roles, certificates, installation. The ship is ready to fly.'},
  role:{n:'The Discovery World', foe:'the Siren of the Ready-Made Solution', win:'Evidence first, solution second. Every signature is in place.'},
  l3:{n:'The Anomaly Belt', foe:'the Black Hole of Sent-Back Stages', win:'You sent a stage back without losing the trail.'},
  l4:{n:'Frontier Station', foe:'the Swarm of Deviations', win:'You spotted the deviations and reported them. Now you lead other crews.'}
};
const ROLES_EN = {pm:'Product Manager', pd:'Product Designer', se:'Software Engineer', gm:'Guild Master'};
const worldEn = w => WORLDS_EN[w.role ? 'role' : w.id] || {n:w.title, foe:'the obstacle', win:''};

/* šatna: doplňky se odemykají tím, co člověk na cestě dokázal */
const AV_ACC = [
  ['none', 'Bez doplňku', () => true, ''],
  ['cape', 'Plášť', () => true, ''],
  ['antenna', 'Anténa', () => true, ''],
  ['star', 'Hvězda', () => true, ''],
  ['medal', 'Medaile absolventa', () => pathDone(), 'za celou cestu'],
  ['jet', 'Raketový batoh', () => streak() >= 7 || !!S.badges['got.streak7'], 'za sérii 7 dní'],
  ['cap', 'Velitelská čapka', () => rank().lvl >= Math.max(1, ranks().length - 1), 'za jednu z nejvyšších hodností']
];

/* osobní čísla z cesty: jen to, co je opravdu v pokroku */
function finaleStats(){
  const mods = pathIds().map(id => W.find(w => w.id === id)).filter(w => w && modPct(w) === 1);
  const days = Object.keys(S.days || {}).filter(k => S.days[k] > 0).sort();
  const lessons = mods.reduce((n, w) => n + w.days.length, 0);
  const tasks = mods.reduce((n, w) => n + w.days.reduce((m, d, di) => m + d.todo.filter((_, ti) => S.todo[w.id + '.' + di + '.' + ti]).length, 0), 0);
  const proofs = Object.keys(S.proof || {}).length;
  const perfect = Object.values(S.qpass || {}).filter(q => q && q.total && q.right === q.total).length;
  const badges = myBadges().filter(b => S.badges['got.' + b[0]]).length;
  return {mods, first:days[0], last:days[days.length - 1], active:days.length, lessons, tasks, proofs, perfect, badges, xp:S.xp, rank:rank().name, role:S.role};
}
const czDate = k => k ? k.split('-').reverse().map(Number).join('. ') : '';
const enDate = k => { if (!k) return ''; const [y, m, d] = k.split('-').map(Number); return ['January','February','March','April','May','June','July','August','September','October','November','December'][m - 1] + ' ' + d + ', ' + y; };
const plCs = (n, a, b, c) => n + ' ' + (n === 1 ? a : n > 1 && n < 5 ? b : c);
const wCs = (n, a, b, c) => n === 1 ? a : n > 1 && n < 5 ? b : c;
const plEn = (n, a) => n + ' ' + a + (n === 1 ? '' : 's');

/* scény finále: každá má anglický nadpis, český podtitul a řádky [anglicky, česky] */
function storyScenes(){
  const st = finaleStats(), roleEn = ROLES_EN[st.role] || 'crew member', roleCs = st.role ? ROLES[st.role] : '';
  const sc = [{k:'start', title:'Day one', cs:'Den první',
    lines:[[`${st.first ? enDate(st.first) + '. ' : ''}A small figure boards a ship.`, `${st.first ? czDate(st.first) + '. ' : ''}Malá postavička nastupuje do lodi.`],
           ['The mission: learn discovery with SPOCK.', 'Mise: naučit se discovery se SPOCKem.'],
           ['Spock is on the radio. He will be waiting at the finish.', 'Spock je na příjmu. V cíli na ni počká.']]}];
  st.mods.forEach((w, i) => { const wd = worldOf(w), we = worldEn(w);
    sc.push({k:'world', c:wd.c, n:i, foe:wd.foe, title:we.n, cs:wd.n,
      lines:[[`Obstacle: ${we.foe}.`, `Překážka: ${wd.foe}.`], [we.win, wd.win]]}); });
  sc.push({k:'numbers', title:'By the numbers', cs:'Vaše cesta v číslech', stats:st,
    lines:[[`${plEn(st.lessons, 'lesson')}, ${plEn(st.tasks, 'task')}${st.proofs ? `, ${st.proofs} verified in VS Code` : ''}.`, `${plCs(st.lessons, 'lekce', 'lekce', 'lekcí')}, ${plCs(st.tasks, 'úkol', 'úkoly', 'úkolů')}${st.proofs ? `, ${st.proofs} ověřených ve VS Code` : ''}.`],
           [`${st.xp} experience points. Rank: ${st.rank}.`, `${st.xp} XP. Hodnost: ${st.rank}.`]]});
  sc.push({k:'meet', party:true, banner:'You made it!', bannerCs:'Dokázali jste to!', title:'Meeting Spock', cs:'Setkání se Spockem',
    lines:[['The figure lands at the finish line. Spock is waiting.', 'Postavička přistává v cíli. Spock už čeká.'],
           ['He hands over the crew flag. From now on, you lead discovery.', 'Předává vlajku posádky. Od teď vedete discovery vy.']]});
  sc.push({k:'cert', party:true, title:'Mission complete', cs:'Mise splněna', stats:st, roleCs,
    lines:[[`SPOCK onboarding complete${st.role ? ', as ' + roleEn : ''}.`, `Onboarding do SPOCKu je hotový${roleCs ? ', v roli ' + roleCs : ''}.`],
           [`${plEn(st.badges, 'badge')}. ${st.perfect ? plEn(st.perfect, 'quiz') + ' passed without a single mistake.' : 'Every level cleared.'}`, `${plCs(st.badges, 'odznak', 'odznaky', 'odznaků')}. ${st.perfect ? plCs(st.perfect, 'kvíz', 'kvízy', 'kvízů') + ' bez jediné chyby.' : 'Všechny úrovně za vámi.'}`]]});
  sc.push({k:'end', party:true, banner:'Agents prepare. You decide.', bannerCs:'Agenti připravují, vy rozhodujete.', title:'Lift-off', cs:'Odlet',
    lines:[['Spock and the figure take off together, towards the next initiative.', 'Spock a postavička odlétají spolu k další iniciativě.'],
           ['Agents prepare. You decide.', 'Agenti připravují, vy rozhodujete.']]});
  return sc;
}

/* anglický hlas: nejlepší, který prohlížeč má; český hlas zůstává pro zbytek aplikace */
function pickEnVoice(){
  try { const v = speechSynthesis.getVoices().filter(x => /^en[-_]/i.test(x.lang)); const rank = x => (/natural|neural|google us english|samantha|aria|jenny|guy|daniel/i.test(x.name) ? 0 : 1) + (/^en[-_]us/i.test(x.lang) ? 0 : .5); SND.en = v.sort((a, b) => rank(a) - rank(b))[0] || null; } catch (e) {}
}
try { pickEnVoice(); speechSynthesis.addEventListener && speechSynthesis.addEventListener('voiceschanged', pickEnVoice); } catch (e) {}
function sayEn(text, onend){
  let done = false; const fin = () => { if (!done) { done = true; onend && onend(); } };
  if (!sndOn() || !window.SpeechSynthesisUtterance) return false;
  if (!SND.en) pickEnVoice(); if (!SND.en) return false;
  try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.lang = SND.en.lang; u.voice = SND.en; u.rate = .96; u.pitch = 1; u.onend = fin; u.onerror = fin; speechSynthesis.speak(u); return true; } catch (e) { return false; }
}

/* certifikát: obrázek, který si člověk uloží (podržením nebo pravým tlačítkem) a pošle dál */
function certSVG(st, roleCs){
  const av = avatarSVG(null).replace('<svg ', '<svg x="1180" y="250" width="260" height="330" ');
  const m = medalSVG({role:roleCs, date:czDate(st.last)}).replace('<svg ', '<svg x="160" y="250" width="230" height="276" ');
  const row = (x, n, l) => `<text x="${x}" y="690" text-anchor="middle" font-size="64" font-weight="800" fill="#fff">${n}</text><text x="${x}" y="732" text-anchor="middle" font-size="24" fill="#C9B6FF">${esc(l)}</text>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="1600" height="900" font-family="Inter, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif">
    <defs><radialGradient id="cbg" cx=".25" cy="0" r="1.2"><stop offset="0" stop-color="#2A2470"/><stop offset=".55" stop-color="#141033"/><stop offset="1" stop-color="#0B0920"/></radialGradient>
    <linearGradient id="cln" x1="0" x2="1"><stop offset="0" stop-color="#E15079"/><stop offset=".5" stop-color="#A54CB2"/><stop offset="1" stop-color="#372B91"/></linearGradient></defs>
    <rect width="1600" height="900" fill="url(#cbg)"/>
    ${Array.from({length:70}, (_, i) => `<circle cx="${(i * 233) % 1600}" cy="${(i * 137) % 900}" r="${i % 5 ? 1.2 : 2.2}" fill="#fff" opacity="${.25 + (i % 4) * .15}"/>`).join('')}
    <rect x="40" y="40" width="1520" height="820" rx="36" fill="none" stroke="url(#cln)" stroke-width="6"/>
    <text x="800" y="140" text-anchor="middle" font-size="28" font-weight="800" letter-spacing="8" fill="#C9B6FF">SPOCK · ONBOARDING DO DISCOVERY</text>
    <text x="800" y="250" text-anchor="middle" font-size="96" font-weight="900" fill="#fff">Mise splněna</text>
    <text x="800" y="320" text-anchor="middle" font-size="36" fill="#E9EDF7">${esc(roleCs ? 'Role ' + roleCs + ' · hodnost ' + st.rank : 'Hodnost ' + st.rank)}</text>
    <text x="800" y="380" text-anchor="middle" font-size="28" fill="#C9B6FF">${esc((st.first ? czDate(st.first) + ' – ' : '') + czDate(st.last))}</text>
    <rect x="560" y="430" width="480" height="6" rx="3" fill="url(#cln)"/>
    <text x="800" y="500" text-anchor="middle" font-size="34" font-style="italic" fill="#fff">Agenti připravují, vy rozhodujete.</text>
    ${m}${av}
    ${row(380, st.lessons, wCs(st.lessons, 'lekce', 'lekce', 'lekcí'))}${row(640, st.tasks, wCs(st.tasks, 'úkol', 'úkoly', 'úkolů'))}${row(900, st.xp, 'XP')}${row(1160, st.badges, wCs(st.badges, 'odznak', 'odznaky', 'odznaků'))}
    <text x="800" y="820" text-anchor="middle" font-size="22" fill="#8F86C9">Česká spořitelna · Product Discovery Experience</text></svg>`;
}
function certImage(st, roleCs, img){
  try {
    const src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(certSVG(st, roleCs)), im = new Image();
    im.onload = () => { try { const c = document.createElement('canvas'); c.width = 1600; c.height = 900; c.getContext('2d').drawImage(im, 0, 0); img.src = c.toDataURL('image/png'); } catch (e) { img.src = src; } };
    im.onerror = () => { img.src = src; }; im.src = src;
  } catch (e) {}
}

/* přehrávač finále: filmový formát (pruhy nahoře a dole), titulky větu po větě, ovládání i klávesnicí */
let STORY = null;
function playScenes(sc, label, what){
  try { trk(what, 'spuštěno'); } catch (e) {}
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let ov = document.getElementById('story'); if (ov) ov.remove();
  ov = document.createElement('div'); ov.id = 'story'; ov.className = 'story film'; ov.setAttribute('role','dialog'); ov.setAttribute('aria-modal','true'); ov.setAttribute('aria-label', label); document.body.append(ov);
  document.body.classList.add('noscroll');
  STORY = {i:0, line:0, n:sc.length, paused:still, h:null};
  sndStart();
  const close = () => { clearTimeout(STORY.h); sndStop(); ov.remove(); STORY = null; document.body.classList.remove('noscroll'); try { trk(what, 'zavřeno'); } catch (e) {} render(); showCel(); };
  const flag = '<svg class="st-flag" viewBox="0 0 40 60" aria-hidden="true"><line x1="5" y1="4" x2="5" y2="58" stroke="#C9D2E3" stroke-width="3" stroke-linecap="round"/><path d="M6 6 L36 12 L6 26 Z" fill="#E15079"/><circle cx="15" cy="15" r="3.4" fill="#fff"/></svg>';
  const counter = (n, l) => `<span class="fn-n"><b class="num" data-to="${n}">${still ? n : 0}</b><small>${l}</small></span>`;
  const art = s => s.k === 'world' ? `<span class="st-planet" style="--pc:${s.c}"></span>${s.foe ? `<span class="st-foe">${s.foe}</span>` : ''}<span class="st-ship fly">${shipSVG()}</span><span class="st-comm"><span class="st-comm-l">Spock radí</span>${spockSVG('fab')}</span>`
    : s.k === 'start' ? `<span class="st-ship idle">${shipSVG()}</span><span class="st-av walk">${avatarSVG()}</span><span class="st-comm"><span class="st-comm-l">Spock na příjmu</span>${spockSVG('fab')}</span>`
    : s.k === 'numbers' ? `<span class="fn-grid">${counter(s.stats.mods.length, wCs(s.stats.mods.length, 'svět', 'světy', 'světů'))}${counter(s.stats.lessons, wCs(s.stats.lessons, 'lekce', 'lekce', 'lekcí'))}${counter(s.stats.tasks, wCs(s.stats.tasks, 'úkol', 'úkoly', 'úkolů'))}${counter(s.stats.proofs, 'ověřeno ve VS Code')}${counter(s.stats.xp, 'XP')}${counter(s.stats.active, wCs(s.stats.active, 'den se SPOCKem', 'dny se SPOCKem', 'dní se SPOCKem'))}</span>`
    : s.k === 'meet' ? `<span class="st-rays"></span><span class="st-crowd">${crowd()}</span><span class="st-ground"></span><span class="st-ship landed">${shipSVG()}</span><span class="st-av meet">${avatarSVG(null, 'big')}</span><span class="st-guide meet">${spockSVG('big')}</span><span class="st-hand"></span><span class="st-flagbox">${flag}</span>`
    : s.k === 'cert' ? `<span class="st-rays"></span><figure class="fn-cert"><img alt="Certifikát: mise splněna" width="1600" height="900"><figcaption>Obrázek si uložte podržením nebo pravým tlačítkem a pošlete týmu.</figcaption></figure>`
    : `<span class="st-trail"></span><span class="st-crew away"><span class="st-crew-av">${avatarSVG()}</span><span class="st-crew-sp">${spockSVG('fab')}</span>${shipSVG()}</span>`;
  const count = () => { if (still) return; ov.querySelectorAll('.fn-n b[data-to]').forEach((b, k) => { const to = +b.dataset.to, t0 = performance.now() + k * 180; (function f(t){ if (!b.isConnected) return; const p = Math.min(1, Math.max(0, (t - t0) / 1400)); b.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(f); })(performance.now()); }); };
  /* titulky: věta po větě; s hlasem se čeká na dočtení, bez něj podle délky české věty */
  const line = () => {
    if (!STORY) return; const s = sc[STORY.i], L = s.lines[STORY.line], last = STORY.i === sc.length - 1, lastLine = STORY.line === s.lines.length - 1, i0 = STORY.i, l0 = STORY.line;
    const sub = ov.querySelector('.st-sub'); if (sub) { sub.textContent = L[1]; sub.setAttribute('lang', 'cs'); sub.classList.remove('in'); void sub.offsetWidth; sub.classList.add('in'); }
    const en = ov.querySelector('.st-en'); if (en) en.textContent = L[0];
    clearTimeout(STORY.h);
    const next = () => { if (!STORY || STORY.paused || STORY.i !== i0 || STORY.line !== l0) return;
      if (!lastLine) { STORY.line++; line(); } else if (!last) { STORY.i++; STORY.line = 0; show(); } };
    const wait = ms => { if (STORY) STORY.h = setTimeout(next, ms); }; /* hlas může dohlásit konec až po zavření finále */
    if (STORY.paused) return;
    const spoken = sayEn(L[0], () => wait(650));
    if (!spoken) wait(Math.max(2600, L[1].length * 62)); else if (STORY) STORY.h = setTimeout(next, Math.max(6000, L[0].length * 120)); /* pojistka, kdyby hlas nedal vědět */
  };
  const show = () => {
    const s = sc[STORY.i], last = STORY.i === sc.length - 1;
    ov.innerHTML = `<div class="st-stage k-${s.k}"><div class="sp-stars" aria-hidden="true"></div><div class="st-art" aria-hidden="true"><div class="st-scene">${art(s)}</div></div>
      ${s.banner ? `<div class="st-banner" aria-hidden="true"><span lang="en">${s.banner}</span><small>${s.bannerCs || ''}</small></div>` : ''}${s.party ? '<canvas class="st-fw" aria-hidden="true"></canvas>' : ''}
      <div class="st-cap"><span class="eyebrow">Finále · ${STORY.i + 1}/${sc.length}</span><h2 lang="en">${s.title}</h2><p class="st-cs">${s.cs}</p></div>
      <div class="st-subs"><p class="st-en" lang="en" aria-hidden="true"></p><p class="st-sub" aria-live="polite"></p></div>
      <div class="st-bar"><span class="st-seg" aria-hidden="true">${sc.map((_, k) => `<i class="${k < STORY.i ? 'on' : k === STORY.i ? 'now' : ''}"></i>`).join('')}</span>
        <button class="btn sm" type="button" data-st="prev" ${STORY.i ? '' : 'disabled'}>Zpět</button>
        <button class="btn sm" type="button" data-st="pause">${STORY.paused ? 'Přehrát' : 'Pozastavit'}</button>
        <button class="btn sm" type="button" data-st="snd" aria-pressed="${sndOn()}">${sndOn() ? 'Zvuk: zapnutý' : 'Zvuk: vypnutý'}</button>
        <button class="btn sm primary" type="button" data-st="next">${last ? 'Dokončit' : 'Další'}</button>
        <button class="btn sm" type="button" data-st="close">Přeskočit</button></div></div>`;
    if (s.party) { fanfare(); fireworks(ov.querySelector('.st-fw')); } else blip('step');
    if (s.k === 'numbers') count();
    if (s.k === 'cert') certImage(s.stats, s.roleCs, ov.querySelector('.fn-cert img'));
    line();
    const nb = ov.querySelector('[data-st=next]'); if (nb) nb.focus({preventScroll:true});
  };
  ov.addEventListener('click', e => { const b = e.target.closest('[data-st]'); if (!b || !STORY) return; const a = b.dataset.st;
    if (a === 'close' || (a === 'next' && STORY.i === sc.length - 1)) return close();
    if (a === 'next') { STORY.i++; STORY.line = 0; } else if (a === 'prev') { STORY.i = Math.max(0, STORY.i - 1); STORY.line = 0; }
    else if (a === 'pause') { STORY.paused = !STORY.paused; if (STORY.paused) { clearTimeout(STORY.h); try { speechSynthesis.cancel(); } catch (e) {} } }
    else if (a === 'snd') { S.sound = !sndOn(); save(); if (sndOn()) sndStart(); else sndStop(); }
    show(); });
  ov.addEventListener('keydown', e => {
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowRight' && !e.target.closest('button')) ov.querySelector('[data-st=next]').click();
    else if (e.key === 'ArrowLeft' && !e.target.closest('button')) { const p = ov.querySelector('[data-st=prev]'); if (p && !p.disabled) p.click(); }
  });
  show();
}
function playStory(){
  if (!pathDone()) { toast('Finále se přehraje, až dokončíte celou cestu.'); return; }
  playScenes(storyScenes(), 'Finále vaší cesty', 'příběh');
}
