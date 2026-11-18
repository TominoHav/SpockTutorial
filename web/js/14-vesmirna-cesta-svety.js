/* ---------- vesmírná cesta: světy, překážky, postavička, šatna a závěrečný příběh ---------- */
/* Každý modul cesty je svět s jednou překážkou. Postavička letí od světa ke světu, Spock jí u každé překážky poradí. */
const WORLDS = {
  l0:{n:'Planeta Orientace', foe:'Mlhovina nejasností', win:'Spock rozsvítil mapu: sedm fází, šest agentů a pět pravidel. Mlhovina se rozplynula.', c:'#E15079'},
  l1:{n:'Orbitální dok', foe:'Asteroidové pole přístupů', win:'Spock vás provedl mezi rolemi, certifikáty a instalací. Loď je připravená k letu.', c:'#E8962E'},
  role:{n:'Svět discovery', foe:'Siréna hotového řešení', win:'Spock připomněl: nejdřív důkaz, potom řešení. Váš běh má všechny podpisy.', c:'#A54CB2'},
  l3:{n:'Pás anomálií', foe:'Černá díra vrácených fází', win:'Spock ukázal, jak vrátit fázi a neztratit stopu. Černá díra vás nepohltila.', c:'#372B91'},
  l4:{n:'Hraniční stanice', foe:'Roj odchylek', win:'Se Spockem jste roj odchylek rozpoznali a nahlásili. Teď vedete další posádky.', c:'#0B6CB0'}
};
const worldOf = w => WORLDS[w.role ? 'role' : w.id];
const pathDone = () => !!S.role && pathIds().every(id => modPct(W.find(w => w.id === id)) === 1);
const AV = {suit:['#E15079','#0B6CB0','#2E9E6B','#E8962E','#372B91'], visor:['#7DE3F4','#F2B544','#C9B6FF'], acc:[['none','Bez doplňku'],['cape','Plášť'],['antenna','Anténa'],['star','Hvězda']]};
const av = () => Object.assign({suit:0, visor:0, acc:'none', patch:false}, S.av || {});
function avatarSVG(o, cls){
  o = o || av(); const su = AV.suit[o.suit] || AV.suit[0], vi = AV.visor[o.visor] || AV.visor[0];
  return `<svg class="avatar ${cls||''}" viewBox="0 0 60 76" aria-hidden="true">
    ${o.acc === 'cape' ? `<path d="M18 34 L6 66 L30 58 L54 66 L42 34 Z" fill="${su}" opacity=".55"/>` : ''}
    ${o.acc === 'jet' ? '<rect x="9" y="30" width="9" height="22" rx="4" fill="#B7C2DA"/><rect x="42" y="30" width="9" height="22" rx="4" fill="#B7C2DA"/><path class="av-fl" d="M10 52 L13.5 63 L17 52 Z M43 52 L46.5 63 L50 52 Z" fill="#F2B544"/>' : ''}
    ${o.acc === 'antenna' ? '<line x1="30" y1="6" x2="30" y2="-2" stroke="#8892A6" stroke-width="2.4" stroke-linecap="round"/><circle cx="30" cy="-3" r="3" fill="#F2B544"/>' : ''}
    <rect x="16" y="54" width="10" height="16" rx="5" fill="${su}"/><rect x="34" y="54" width="10" height="16" rx="5" fill="${su}"/>
    <rect x="6" y="36" width="10" height="18" rx="5" fill="${su}"/><rect x="44" y="36" width="10" height="18" rx="5" fill="${su}"/>
    <rect x="14" y="32" width="32" height="28" rx="11" fill="${su}"/>
    <rect x="22" y="42" width="16" height="9" rx="3" fill="#fff" opacity=".85"/>
    ${o.acc === 'medal' ? '' : o.acc === 'star' ? '<path d="M30 41.5l1.7 3.4 3.8.5-2.8 2.6.7 3.7-3.4-1.8-3.4 1.8.7-3.7-2.8-2.6 3.8-.5z" fill="#F2B544"/>' : '<circle cx="26" cy="46.5" r="1.8" fill="#E15079"/><circle cx="31" cy="46.5" r="1.8" fill="#F2B544"/>'}
    <circle cx="30" cy="20" r="17" fill="#F4F6FB" stroke="#C9D2E3" stroke-width="2"/>
    <rect x="17" y="12" width="26" height="16" rx="8" fill="#1B2140"/>
    <rect x="19" y="14" width="22" height="12" rx="6" fill="${vi}" opacity=".9"/>
    <path d="M22 17q4-3 8 0" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".8"/>
    ${o.acc === 'cap' ? '<path d="M15 9 Q30 -4 45 9 L45 12 L15 12 Z" fill="#1B2140"/><rect x="13" y="10" width="34" height="4" rx="2" fill="#F2B544"/><circle cx="30" cy="5" r="2.4" fill="#F2B544"/>' : ''}
    ${o.acc === 'medal' ? '<path d="M25 33 L30 42 L35 33" fill="none" stroke="#E15079" stroke-width="3"/><circle cx="30" cy="46" r="5.2" fill="#F2B544" stroke="#B86E12" stroke-width="1.2"/>' : ''}
    ${o.patch && S.role ? `<rect x="35" y="33" width="10" height="7" rx="2" fill="#fff" opacity=".92"/><text x="40" y="38.6" text-anchor="middle" font-size="4.6" font-weight="800" fill="#1B2140">${({pm:'PM', pd:'PD', se:'SWE', gm:'GM'})[S.role] || ''}</text>` : ''}
  </svg>`;
}
function shipSVG(cls){
  return `<svg class="ship ${cls||''}" viewBox="0 0 120 60" aria-hidden="true">
    <path class="ship-fl" d="M14 30 L-6 22 L2 30 L-6 38 Z" fill="#F2B544"/>
    <path d="M12 30 C12 14 46 8 84 12 C104 14 116 24 116 30 C116 36 104 46 84 48 C46 52 12 46 12 30 Z" fill="#E9EDF7" stroke="#B7C2DA" stroke-width="2"/>
    <path d="M30 12 L20 0 L46 9 Z M30 48 L20 60 L46 51 Z" fill="#A54CB2"/>
    <circle cx="82" cy="30" r="11" fill="#1B2140"/><circle cx="82" cy="30" r="8" fill="#7DE3F4" opacity=".85"/>
    <rect x="40" y="26" width="24" height="8" rx="4" fill="#E15079"/>
  </svg>`;
}
/* mapa cesty na úvodní stránce: světy v řadě, postavička u světa, který je na řadě, na konci čeká Spock */
function spaceMap(){
  const mods = pathIds().map(id => W.find(w => w.id === id)).filter(Boolean), nx = nextOnPath(), fin = pathDone();
  const pend = !S.role;
  const items = (pend ? ['l0','l1',null,'l3'].map(id => id && W.find(w => w.id === id)) : mods).map((w, i) => {
    if (!w) return `<li class="sw tbd"><span class="sw-pl" style="--pc:#A54CB2"><span>2</span></span><h3>Svět discovery</h3><p class="sw-m">Vaše role</p><p class="sw-foe">Nejdřív vyberte roli</p></li>`;
    const wd = worldOf(w), t = weekTotals(w), pct = t.tot ? t.done / t.tot : 0, done = pct === 1, locked = isLocked(w), here = nx && nx.id === w.id && !locked;
    /* u každé planety jedna akce: další krok, nebo otevření; kvíz si lze zopakovat uvnitř modulu */
    const quizNext = !locked && !done && quizReady(w) && !quizPassed(w);
    const lbl = locked ? 'Náhled' : quizNext ? 'Kvíz u překážky' : here ? 'Pokračovat' : 'Otevřít';
    return `<li class="sw ${done ? 'done' : ''} ${here ? 'here' : ''} ${locked ? 'locked' : ''}">
      ${here ? `<span class="sw-me" title="Tady právě jste">${avatarSVG()}</span>` : ''}
      <span class="sw-pl" style="--pc:${wd.c}"><span>${done ? '✓' : locked ? LOCK : i}</span></span>
      <h3>${wd.n}</h3><p class="sw-m">${esc(w.role ? w.title : w.lab + ' · ' + w.title)}</p>
      <p class="sw-foe ${done ? 'won' : ''}">${done ? 'Překonáno: ' : 'Překážka: '}${wd.foe}</p>
      <span class="sw-prog" aria-label="Hotovo ${Math.round(pct*100)} %"><span class="sw-bar"><i style="width:${Math.round(pct*100)}%"></i></span><b class="num">${Math.round(pct*100)} %</b></span>
      <button class="linkbtn" type="button" ${quizNext ? `data-quiz="${w.id}"` : `data-week="${w.id}"`}>${lbl}</button></li>`;
  }).join('');
  return `<div class="spmap"><div class="sp-stars" aria-hidden="true"></div>
    <ol class="sp-route ${S.role === 'gm' ? 'five' : ''}">${items}
      <li class="sw end ${fin ? 'done' : ''}"><span class="sw-spock">${fin ? `<span class="sw-duo">${avatarSVG()}</span>` : ''}${spockSVG('fab')}</span><h3>Setkání se Spockem</h3><p class="sw-m">${fin ? 'Mise splněna' : 'Cíl cesty'}</p>
        ${fin ? `<p class="sw-foe won">${S.flown ? 'Finále: anglicky, s českými titulky' : 'Spock čeká. Oblékněte se na finále.'}</p><button class="btn sm primary" type="button" ${S.flown ? 'data-story' : 'data-wardrobe'}>${S.flown ? '▶ Přehrát finále' : 'Obléknout a odletět'}</button>${S.flown ? '<button class="linkbtn" type="button" data-wardrobe>Šatna</button>' : ''}` : '<p class="sw-foe">Spock vás provází celou cestou a v cíli na vás čeká s lodí.</p>'}</li>
    </ol></div>`;
}
/* šatna: otevře se po dokončení cesty, postavičku si člověk oblékne a odletí (spustí se závěrečný příběh) */
function openWardrobe(){
  if (!pathDone()) { toast('Šatna se otevře, až dokončíte celou cestu.'); return; }
  let ov = document.getElementById('wardrobe');
  if (!ov) { ov = document.createElement('div'); ov.id = 'wardrobe'; ov.className = 'cel wardrobe'; ov.setAttribute('role','dialog'); ov.setAttribute('aria-modal','true'); ov.setAttribute('aria-label','Šatna'); document.body.append(ov); }
  const o = av();
  ov.innerHTML = `<div class="cel-card wd-card"><span class="eyebrow">Mise splněna</span><h2>Šatna před odletem</h2><p>Oblékněte postavičku na cestu ke Spockovi. Některé doplňky jste si odemkli tím, co jste na cestě dokázali.</p>
    <div class="wd-prev"><span class="wd-av">${avatarSVG(o, 'big')}</span><span class="wd-sp">${spockSVG('fab')}</span></div>
    <div class="wd-row"><span>Skafandr</span>${AV.suit.map((c, i) => `<button type="button" class="wd-sw ${o.suit === i ? 'on' : ''}" data-av="suit:${i}" style="--sw:${c}" aria-label="Barva skafandru ${i+1}" aria-pressed="${o.suit === i}"></button>`).join('')}</div>
    <div class="wd-row"><span>Hledí</span>${AV.visor.map((c, i) => `<button type="button" class="wd-sw ${o.visor === i ? 'on' : ''}" data-av="visor:${i}" style="--sw:${c}" aria-label="Barva hledí ${i+1}" aria-pressed="${o.visor === i}"></button>`).join('')}</div>
    <div class="wd-row"><span>Doplněk</span>${AV_ACC.map(([k, l, ok, why]) => ok() ? `<button type="button" class="rolebtn ${o.acc === k ? 'on' : ''}" data-av="acc:${k}" aria-pressed="${o.acc === k}">${l}</button>` : `<button type="button" class="rolebtn wd-lock" disabled title="Odemknete ${why}">${LOCK} ${l}</button>`).join('')}</div>
    ${S.role ? `<div class="wd-row"><span>Nášivka</span><button type="button" class="rolebtn ${o.patch ? 'on' : ''}" data-av="patch:${o.patch ? 0 : 1}" aria-pressed="${!!o.patch}">Role ${({pm:'PM', pd:'PD', se:'SWE', gm:'GM'})[S.role]}</button></div>` : ''}
    <div class="cel-acts"><button class="btn primary" type="button" data-fly>${S.flown ? 'Přehrát finále' : 'Odletět ke Spockovi'}</button><button class="btn" type="button" data-wdclose>Zavřít</button></div>
    <p class="muted wd-note">Finále je anglicky s českými titulky, trvá asi dvě minuty a jde kdykoli přeskočit.</p></div>`;
  ov.querySelector('[data-fly]').focus();
}
document.addEventListener('click', e => {
  const t = e.target.closest('[data-wardrobe],[data-av],[data-wdclose],[data-fly],[data-story]'); if (!t) return;
  const ov = document.getElementById('wardrobe');
  if (t.hasAttribute('data-wardrobe')) openWardrobe();
  else if (t.dataset.av) { const [k, v] = t.dataset.av.split(':'); if (k === 'acc' && !(AV_ACC.find(a => a[0] === v) || [0, 0, () => false])[2]()) return; S.av = Object.assign(av(), {[k]: k === 'acc' ? v : k === 'patch' ? v === '1' : +v}); save(); openWardrobe(); }
  else if (t.hasAttribute('data-wdclose')) { if (ov) ov.remove(); render(); }
  else if (t.hasAttribute('data-fly')) { if (ov) ov.remove(); S.flown = dKey(0); save(); playStory(); }
  else if (t.hasAttribute('data-story')) playStory();
});
/* zvuk: tichý podkres a tóny z Web Audio, komentář čte hlas prohlížeče (když má český). Jde vypnout. */
const SND = {ctx:null, nodes:[], voice:null};
const sndOn = () => S.sound !== false;
function pickVoice(){ try { const v = speechSynthesis.getVoices(); SND.voice = v.find(x => /^cs/i.test(x.lang)) || null; } catch (e) {} }
try { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; } catch (e) {}
function sndStart(){
  if (!sndOn() || SND.ctx) return;
  try {
    const C = window.AudioContext || window.webkitAudioContext; if (!C) return;
    const ctx = SND.ctx = new C(), out = ctx.createGain(); out.gain.value = 0; out.connect(ctx.destination);
    if (ctx.state === 'suspended' && ctx.resume) ctx.resume().catch(() => {});   /* Safari spouští zvuk pozastavený */
    out.gain.linearRampToValueAtTime(.05, ctx.currentTime + 2);
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 520; lp.connect(out);
    [[110, 'sine'], [164.8, 'sine'], [220.4, 'triangle']].forEach(([f, t], n) => { const o = ctx.createOscillator(), g = ctx.createGain(); o.type = t; o.frequency.value = f; g.gain.value = n === 2 ? .12 : .5; o.connect(g); g.connect(lp); o.start(); SND.nodes.push(o); });
    const lfo = ctx.createOscillator(), lg = ctx.createGain(); lfo.frequency.value = .12; lg.gain.value = 140; lfo.connect(lg); lg.connect(lp.frequency); lfo.start(); SND.nodes.push(lfo);
    SND.out = out;
  } catch (e) { SND.ctx = null; }
}
function sndStop(){
  try { speechSynthesis.cancel(); } catch (e) {}
  const ctx = SND.ctx; if (!ctx) return; SND.ctx = null;
  try { SND.out.gain.linearRampToValueAtTime(0, ctx.currentTime + .4); setTimeout(() => { SND.nodes.forEach(n => { try { n.stop(); } catch (e) {} }); SND.nodes = []; ctx.close(); }, 500); } catch (e) {}
}
function blip(kind){
  if (!sndOn()) return;
  try {
    const C = window.AudioContext || window.webkitAudioContext; if (!C) return;
    const ctx = SND.ctx || (SND.tmp = SND.tmp || new C()); if (ctx.state === 'suspended' && ctx.resume) ctx.resume().catch(() => {});
    const o = ctx.createOscillator(), g = ctx.createGain(), t = ctx.currentTime;
    const f = kind === 'ok' ? [523, 784] : kind === 'bad' ? [196, 147] : [392, 440];
    o.type = kind === 'bad' ? 'sawtooth' : 'sine'; o.frequency.setValueAtTime(f[0], t); o.frequency.linearRampToValueAtTime(f[1], t + .16);
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(kind === 'bad' ? .05 : .09, t + .02); g.gain.exponentialRampToValueAtTime(.0001, t + .32);
    o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + .34);
  } catch (e) {}
}
/* přečte text; onend se zavolá po dočtení, nebo hned, když hlas není */
function say(text, onend){
  let done = false; const fin = () => { if (!done) { done = true; onend && onend(); } };
  if (!sndOn() || !SND.voice || !window.SpeechSynthesisUtterance) return false;
  try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text.replace(/<[^>]+>/g, ' ')); u.lang = SND.voice.lang; u.voice = SND.voice; u.rate = 1; u.onend = fin; u.onerror = fin; speechSynthesis.speak(u); return true; } catch (e) { return false; }
}
/* přehrávač scén: závěrečný příběh i shrnutí úrovně. Běží sám, jde pozastavit, krokovat, ztlumit a kdykoli přeskočit. */
/* oslava v cíli: posádka agentů, medaile absolventa, ohňostroj a fanfára */
function crowd(){
  return SKINS.slice(1, 7).map((k, i) => `<span class="cw" style="--d:${(i * .17).toFixed(2)}s">${spockSVG('fab', Object.assign({}, k, {f:'', b:'', noAnt:false}))}</span>`).join('');
}
function medalSVG(m){
  m = m || {};
  return `<svg class="medal" viewBox="0 0 200 240" aria-hidden="true">
    <path d="M62 0 L100 70 L138 0 L118 0 L100 34 L82 0 Z" fill="#E15079"/><path d="M82 0 L100 34 L118 0" fill="#A54CB2"/>
    <circle cx="100" cy="140" r="86" fill="#B86E12"/><circle cx="100" cy="140" r="78" fill="url(#mg1)"/>
    <defs><radialGradient id="mg1" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#FFF3C4"/><stop offset=".5" stop-color="#F2B544"/><stop offset="1" stop-color="#C8811C"/></radialGradient></defs>
    <circle cx="100" cy="140" r="64" fill="none" stroke="#FFF3C4" stroke-width="2" stroke-dasharray="3 5"/>
    <text x="100" y="118" text-anchor="middle" font-size="13" font-weight="800" fill="#7A4A0C" letter-spacing="2">ABSOLVENT</text>
    <text x="100" y="146" text-anchor="middle" font-size="26" font-weight="900" fill="#5A3608">SPOCK</text>
    <text x="100" y="166" text-anchor="middle" font-size="11" font-weight="700" fill="#7A4A0C">${esc(m.role || '')}</text>
    <text x="100" y="184" text-anchor="middle" font-size="10" font-weight="600" fill="#7A4A0C">${esc(m.date || '')}</text>
  </svg>`;
}
function fanfare(){
  if (!sndOn()) return;
  try {
    const C = window.AudioContext || window.webkitAudioContext; if (!C) return;
    const ctx = SND.ctx || (SND.tmp = SND.tmp || new C()), t0 = ctx.currentTime + .05;
    [[523,0,.18],[659,.16,.18],[784,.32,.18],[1047,.5,.7],[784,.5,.7],[659,.5,.7]].forEach(([f, d, len]) => {
      const o = ctx.createOscillator(), g = ctx.createGain(); o.type = 'triangle'; o.frequency.value = f;
      g.gain.setValueAtTime(.0001, t0 + d); g.gain.exponentialRampToValueAtTime(.08, t0 + d + .03); g.gain.exponentialRampToValueAtTime(.0001, t0 + d + len);
      o.connect(g); g.connect(ctx.destination); o.start(t0 + d); o.stop(t0 + d + len + .05);
    });
  } catch (e) {}
}
function fireworks(cv){
  if (!cv || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const ctx = cv.getContext('2d'), r = cv.getBoundingClientRect(), W2 = cv.width = r.width, H2 = cv.height = r.height;
  const cols = ['#F2B544','#E15079','#7DE3F4','#9BE8C0','#C9B6FF','#FFF3C4'], P = [];
  let t = 0, next = 0;
  (function f(){
    if (!cv.isConnected) return;
    if (t >= next && t < 420) { const x = W2 * (.15 + Math.random() * .7), y = H2 * (.1 + Math.random() * .35), c = cols[Math.random() * cols.length | 0];
      for (let i = 0; i < 46; i++) { const a = Math.PI * 2 * i / 46, v = 2 + Math.random() * 2.6; P.push({x, y, vx:Math.cos(a) * v, vy:Math.sin(a) * v, l:60 + Math.random() * 25, c}); }
      next = t + 26 + Math.random() * 30; }
    ctx.clearRect(0, 0, W2, H2);
    for (let i = P.length - 1; i >= 0; i--) { const p = P[i]; p.x += p.vx; p.y += p.vy; p.vy += .045; p.vx *= .985; p.l--; if (p.l <= 0) { P.splice(i, 1); continue; }
      ctx.globalAlpha = Math.min(1, p.l / 30); ctx.fillStyle = p.c; ctx.beginPath(); ctx.arc(p.x, p.y, 2.2, 0, 7); ctx.fill(); }
    t++; if (t < 520 || P.length) requestAnimationFrame(f);
  })();
}
/* shrnutí úrovně: co se člověk v každé lekci naučil (názvy karet, u lekcí bez karet úkoly) */

