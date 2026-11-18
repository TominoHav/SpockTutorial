/* ---------- Co je SPOCK: kapitoly videa a tři varianty ---------- */
const CH = [
 {id:'vyzva', t:0, c:'pink', k:'Výzva', h:'Každý nový produkt nebo změna začíná nápadem', short:'Dnes to trvá týdny a každý tým to dělá jinak.',
  body:`<ol class="cv-list"><li><span>01</span>Dnes to trvá týdny</li><li><span>02</span>Každý tým to dělá jinak</li><li><span>03</span>Rozhodnutí se těžko dohledávají</li></ol>`},
 {id:'jak', t:30, c:'purple', k:'Jak to funguje', h:'AI agenti připravují práci, tým schvaluje každý krok', short:'Nápad → Důkazy → Možnosti → Připraveno k vývoji.',
  body:`<div class="cv-steps">${[['Nápad','Strukturuje brief'],['Důkazy','Analyzuje výzkum'],['Možnosti','Porovná trh a zváží rizika'],['Připraveno k vývoji','Připraví dokumenty']].map((s,i)=>`<div class="cv-step"><span class="cv-n">0${i+1}</span><b>${s[0]}</b><span>${s[1]}</span><em>✓ Schváleno</em></div>`).join('')}</div><p class="cv-note">V SPOCKu to odpovídá sedmi fázím: <a href="#" data-go="map">SPOCK v kostce</a>.</p>`},
 {id:'strategie', t:48, c:'indigo', k:'Napojení na strategii', h:'Začíná se strategií banky', short:'Strategie → cíl → problém zákazníka → řešení.',
  body:`<ol class="cv-chain"><li>Strategie banky</li><li>Business cíl</li><li>Problém zákazníka</li><li>Řešení</li></ol><p class="cv-note">Ve fázi 1 je to vazba produktového cíle na key result ze Strategy Basis.</p>`},
 {id:'prinosy', t:54, c:'blue', k:'Přínosy', h:'Co SPOCK přináší bance', short:'Rychleji, jednotně, na základě důkazů, dohledatelně.',
  body:`<div class="cv-ben"><div><b>Rychleji</b>Méně času nad přípravou dokumentů</div><div><b>Jednotně</b>Jedna metoda napříč týmy</div><div><b>Na základě důkazů</b>Rozhodnutí opřená o výzkum, ne o názor</div><div><b>Dohledatelně</b>Kdo co rozhodl, kdy a proč</div></div>`},
 {id:'kontrola', t:78, c:'pink', k:'Zabudovaná kontrola', h:'Kontrola je součástí postupu', short:'Rizika od začátku, mezery se neskrývají, rozhodnutí se zapisují.',
  body:`<ul class="cv-checks"><li>Rizika a compliance se zvažují od začátku</li><li>Mezery se označí, nikdy se nevymýšlí</li><li>Každé rozhodnutí je zapsané a dohledatelné</li></ul><div class="cv-rec"><span>Záznam rozhodnutí · ukázka</span><b>Schválena možnost B</b><small>Schválil(a): Jana Nováková, Product Manager</small></div>`},
 {id:'pilot', t:90, c:'purple', k:'Výsledek pilotu', h:'Týdny → 1 den', short:'Co trvalo týdny, zabralo v pilotu jeden den.',
  body:`<p class="cv-big"><s>Týdny</s><span>→</span>1 den</p><p>Co produktovému týmu dřív trvalo týdny, zabralo v pilotu jeden den.</p>`},
 {id:'dal', t:102, c:'indigo', k:'Co přijde dál', h:'Plánují se další fáze', short:'Výzkum, prototypování, specifikace.',
  body:`<ol class="cv-road"><li class="now"><small>Dnes</small>Od nápadu k iniciativě</li><li><small>Dál</small>Výzkum</li><li>Prototypování</li><li>Specifikace</li></ol>`},
 {id:'proc', t:114, c:'blue', k:'Proč Spock?', h:'Inspirováno kombinací člověka a Vulkánce', short:'Data a objektivita spojené s lidskou zvědavostí.',
  body:`<blockquote class="cv-quote"><b>SPOCK</b> připomíná, že myšlení opřené o data a objektivitu, spojené s lidskou zvědavostí, kreativitou a společným posláním, posouvá hranice našeho vesmíru.</blockquote>`}
];
/* Videa „SPOCK krok za krokem“: dlouhé a klipy po fázích (bez zvuku, české titulky v obraze). Vyrábí je nastroje/video/record.js. */
const VIDS = Object.assign({'krok-za-krokem':['Video: SPOCK krok za krokem · 4 min', 'Sedm fází na hotovém běhu'], 'pitch':['Video: Onboarding do SPOCKu za necelé dvě minuty', 'Co vás v onboardingu čeká']}, Object.fromEntries(['Brief','Problémy a příležitosti','Trh','Řešení','MVP','PRD','Iniciativa'].map((n, i) => ['faze-' + (i + 1), ['Video: fáze ' + (i + 1) + ' · ' + n, 'Fáze ' + (i + 1) + ': ' + n]])));
const vidTag = id => VIDS[id] ? `<video class="cv-video" controls preload="none" playsinline poster="spock-${id}-poster.jpg" aria-label="Video: ${VIDS[id][1]}"><source src="spock-${id}.mp4" type="video/mp4">Váš prohlížeč video neumí přehrát.</video>` : VIDEO;
const VIDEO = `<video class="cv-video" controls preload="none" playsinline poster="spock-intro-poster.jpg" aria-label="Video: Co je SPOCK"><source src="spock-intro.mp4" type="video/mp4">Váš prohlížeč video neumí přehrát.</video>`;
const BRAND = () => `<div class="cv-lock">${spockLogo('md')}<div><b>SPOCK</b><span>Lepší produktová rozhodnutí, rychleji.</span></div></div>`;
function introSection(){ return introB(); }

/* A · Kapitoly synchronizované s videem */
/* B · Kino a karusel slajdů */
function introB(){
  return `<section class="cvB" aria-labelledby="cv-h">
    <div class="cvB-top">
      <div class="cvB-txt"><span class="eyebrow">Co je SPOCK</span><h2 id="cv-h">AI připravuje práci. <em>Lidé rozhodují.</em></h2><p>AI asistent, který provede produktové týmy od prvního nápadu až k iniciativě připravené k vývoji. Celý příběh je ve videu, hlavní body pod ním.</p>${BRAND()}</div>
      <div class="cvB-film"><span class="cvB-frame">${VIDEO}</span><span class="cvB-cap">2 min 26 s · anglicky s komentářem</span></div>
    </div>
    <div class="cvB-strip-h"><b>8 věcí z videa</b><span class="sp"></span><button class="btn sm" type="button" data-cvscroll="-1" aria-label="Předchozí">←</button><button class="btn sm" type="button" data-cvscroll="1" aria-label="Další">→</button></div>
    <ol class="cvB-strip">${CH.map((x,i) => `<li class="cvB-card c-${x.c}"><span class="cvB-no" aria-hidden="true" data-n="${String(i+1).padStart(2,'0')}"></span><span class="eyebrow">${x.k}</span><h3>${x.h}</h3>${x.body}</li>`).join('')}</ol>
  </section>`;
}
document.addEventListener('click', e => {
  const s = e.target.closest('[data-cvscroll]');
  if (s) { const st = document.querySelector('.cvB-strip'); if (st) st.scrollBy({left: +s.dataset.cvscroll * st.clientWidth * .8, behavior:'smooth'}); }
});

/* ---------- úvodní stránka ---------- */
const isFirst = () => !S.role;
function heroArt(hi){ return `<div class="hx-art" aria-hidden="true">${spockSVG('big')}<span class="hx-chip c1">Fáze 1–7</span><span class="hx-chip c2">Q a G brány</span><span class="hx-chip c3">Váš podpis</span><span class="hx-hi">${hi}</span></div>`; }
function miniStats(){ return `<ul class="hx-facts"><li class="fl ${todayXP() ? 'lit' : ''}">${FLAME}<b class="num">${streak()}</b><span>dní v sérii</span></li><li><b class="num">${S.xp}</b><span>XP · ${esc(rank().name)}</span></li></ul>`; }
function nextLessonInfo(){
  const w = nextOnPath(); if (!w) return null;
  const li = curLesson(w); return {w, li: li >= 0 ? li : null, d: li >= 0 ? w.days[li] : null};
}
function continueBtn(cls){
  const pw = S.pos && W.find(w => w.id === S.pos.w), pd = pw && pw.days[S.pos.l];
  if (pd && applies(pw) && !isLocked(pw) && !lessonDone(pw, S.pos.l)) return `<button class="btn primary ${cls||''}" type="button" data-golesson="${pw.id}:${S.pos.l}">Pokračovat, kde jste skončil(a): lekce ${esc(pd.d)} →</button>`;
  const n = nextLessonInfo(); if (!n) return `<button class="btn primary ${cls||''}" type="button" data-go="badges">Celá cesta hotová · profil</button>`;
  return n.d ? `<button class="btn primary ${cls||''}" type="button" data-golesson="${n.w.id}:${n.li}">Pokračovat: lekce ${esc(n.d.d)} →</button>` : `<button class="btn primary ${cls||''}" type="button" data-quiz="${n.w.id}">Pokračovat: kvíz modulu ${esc(n.w.title)} →</button>`;
}
function pathBlock(title){
  const mine = S.role ? W.find(w => w.role === S.role) : null;

  return `<section class="hpcard"><div class="hp">
    <div class="hp-head"><h2>${title || 'Vaše cesta vesmírem'}</h2><p class="muted">Každá úroveň je svět s jednou překážkou. Spock vám u každé poradí.</p></div>
    ${spaceMap()}
    <p class="hp-ref muted">Volitelně: <button class="linkbtn" type="button" data-week="l1b">příručka Fáze do hloubky</button>, každá fáze podle své specifikace.</p></div></section>`;
}
function roleCards(){
  return `<div class="rcards">${W.filter(w => w.role).map(w => `<button type="button" class="rcard c-${w.c} ${S.role === w.role ? 'on' : ''}" data-role="${w.role}" aria-pressed="${S.role === w.role}"><span class="rc-dia"><span>${S.role === w.role ? '✓' : ROLE_SHORT[w.role]}</span></span><b>${esc(ROLES[w.role])}</b><span>${esc(ROLE_WHO[w.role])}</span></button>`).join('')}</div>`;
}
function toolsBlock(title){
  /* jen to, bez čeho se člověk neobejde; profil, tým a příručka jsou v menu pod Další */
  return `<div class="sec-h"><h2>${title || 'Opora'}</h2></div><div class="journey three">
    <button class="jstep c-purple" type="button" data-go="diag"><span class="n">Když něco nejde</span><h3>Diagnostika</h3><p>Co vidím → co udělám a nejčastější chyby uživatelů.</p></button>
    <button class="jstep c-blue" type="button" data-go="gloss"><span class="n">Neznámý pojem</span><h3>Slovníček</h3><p>Pojmy SPOCKu jednou větou: brána, agent, task, iniciativa.</p></button>
    <button class="jstep c-indigo" type="button" data-go="cheat"><span class="n">Opora</span><h3>Tahák tasků</h3><p>Všechny tasky SPOCKu, kdy je spustit a která políčka otevřou.</p></button></div>${contacts()}`;
}
function contacts(){
  return `<section class="whohelp"><h3>Kdo vám pomůže</h3><ul>
    <li><b>SPOCK core tým</b><span>Přístup k pilotu, materiály a data, obecné otázky: Veronika Bedáňová (vbedanova@csas.cz) a Ines Bamburać-Alibašić (ibamburac-alibasic@csas.cz).</span></li>
    <li><b>Repozitář a prostředí</b><span>Ilya Shramov. Instalace a běžné potíže: nejdřív support engineer ve vašem týmu, pak IT podpora ČS.</span></li>
    <li><b>SPOCK</b><span>CoE Product Management a CoE Product Design. Na otázky k lekcím onboardingu odpoví průvodce Spock v rohu stránky.</span><button class="linkbtn" type="button" data-open-spock>Zeptat se</button></li>
    <li><b>Onboarding Tutorial</b><span>Tomáš Havlíček, Guild Master Product Management.</span></li>
  </ul></section>`;
}
/* Logo PDE Journey (Product Discovery Experience): kruh s cestou kolem nápisu PDE, překreslené do SVG, aby bylo ostré v každé velikosti */
let PDE_N = 0;
function pdeLogo(cls){
  const id = 'pdeg' + (++PDE_N), m = 'pdem' + PDE_N;
  return `<svg class="pde-logo ${cls || ''}" viewBox="0 0 100 100" role="img" aria-label="PDE Journey"><defs>
    <linearGradient id="${id}" x1=".15" y1=".1" x2=".85" y2=".95"><stop offset="0" stop-color="#36299A"/><stop offset=".6" stop-color="#4B2EA0"/><stop offset="1" stop-color="#7A3C9E"/></linearGradient>
    <mask id="${m}"><rect width="100" height="100" fill="#fff"/><rect x="42" y="25" width="16" height="12" fill="#000"/><rect x="13" y="40" width="12" height="16" fill="#000"/><rect x="75" y="40" width="12" height="16" fill="#000"/><rect x="30" y="58" width="40" height="13" fill="#000"/></mask></defs>
    <circle cx="50" cy="50" r="49" fill="url(#${id})"/>
    <rect x="19" y="31" width="62" height="34" rx="7" fill="none" stroke="#fff" stroke-width="1.7" stroke-dasharray="3.4 2.8" stroke-linecap="round" mask="url(#${m})"/>
    <g fill="none" stroke="#fff" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M45 28.5l2.5 2.5-2.5 2.5M50 28.5l2.5 2.5-2.5 2.5"/><path d="M16.5 46l2.5-2.5 2.5 2.5M16.5 51l2.5-2.5 2.5 2.5"/><path d="M78.5 45l2.5 2.5 2.5-2.5M78.5 50l2.5 2.5 2.5-2.5"/></g>
    <text x="50" y="54.5" text-anchor="middle" font-family="Inter,system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif" font-weight="600" font-size="19" fill="#fff" letter-spacing=".5">PDE</text>
    <rect x="33" y="60.5" width="34" height="8" rx="4" fill="#fff"/>
    <text x="50" y="66.4" text-anchor="middle" font-family="Inter,system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif" font-weight="800" font-size="4.6" fill="#3A2B95" letter-spacing="1.1">JOURNEY</text></svg>`;
}
function heroFirst(){
  return `<section class="hx hx-first"><div class="hx-txt">
    <div class="hx-brand">${pdeLogo()}<span class="eyebrow">Onboarding do SPOCKu · nový nástroj pro discovery v ČS</span></div>
    <h1>Seznamte se <em>se SPOCKem</em></h1>
    <p class="hx-lead">SPOCK je AI asistent ve VS Code. Produktovým týmům připraví podklady v sedmi fázích discovery, od nápadu po iniciativu připravenou k vývoji. <b>Agenti připravují, vy rozhodujete.</b></p>
    <ul class="hx-ben"><li>Rychleji</li><li>Jednotně napříč týmy</li><li>Na základě důkazů</li><li>Dohledatelně</li></ul>
    <div class="hx-cta"><button class="btn primary" type="button" data-simstart>Vyzkoušet nanečisto · 5 min</button><button class="btn" type="button" data-playvideo="pitch">▶ Co vás čeká · 1 min 40 s</button></div>
    <p class="hx-note">Nic neinstalujete. Začíná se tady na webu.</p>
  </div>${heroArt('Ahoj, jsem Spock')}</section>`;
}
