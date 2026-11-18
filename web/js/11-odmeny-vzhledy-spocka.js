/* ---------- odměny: vzhledy Spocka za hodnosti, zmrazení série, denní výzvy ---------- */
/* vzhled = filtr barev na postavičce; první je výchozí, další se odemykají s hodností (index = pořadí hodnosti) */
/* vzhled = vlastní barvy a doplněk pro každou hodnost (index = pořadí hodnosti). b = vrstva za tělem, f = před tělem. */
const SKINS = [
  {k:'klasik', n:'Klasický', d:'jak ho znáte', g:['#E15079','#A54CB2','#372B91']},
  {k:'ocean', n:'Oceán', d:'modrý se šátkem', g:['#4FD3EC','#1B7FC4','#12356E'], limb:'#12356E', hand:'#1B7FC4', tip:'#4FD3EC', eye:'#C8F6FF',
    f:'<path d="M37 84 Q60 99 83 84 L81 92 Q60 106 39 92 Z" fill="#F2B544"/><path d="M72 95 L84 110 L71 106 Z" fill="#E8962E"/>'},
  {k:'les', n:'Les', d:'zelený se sluchátky', g:['#C4EC7A','#3FA34D','#1D5B34'], limb:'#1D5B34', hand:'#3FA34D', tip:'#F2B544', eye:'#EFFFC2',
    f:'<path d="M31 56 Q60 8 89 56" fill="none" stroke="#2B2F3A" stroke-width="4.5" stroke-linecap="round"/><rect x="24" y="52" width="10" height="17" rx="5" fill="#2B2F3A"/><rect x="86" y="52" width="10" height="17" rx="5" fill="#2B2F3A"/><path d="M29 68 Q32 84 46 82" fill="none" stroke="#2B2F3A" stroke-width="2.6" stroke-linecap="round"/><circle cx="47" cy="82" r="3" fill="#F2B544"/>'},
  {k:'zlato', n:'Zlato', d:'zlatý s medailí', g:['#FFE99A','#F2B544','#B86E12'], limb:'#8A5410', hand:'#F2B544', tip:'#FFF3C4', eye:'#FFE99A',
    f:'<path d="M52 80 L60 92 L68 80" fill="none" stroke="#D43C5E" stroke-width="4"/><circle cx="60" cy="94" r="8.5" fill="#FFF3C4" stroke="#B86E12" stroke-width="2"/><path d="M60 88.5l1.8 3.6 4 .6-2.9 2.8.7 4-3.6-1.9-3.6 1.9.7-4-2.9-2.8 4-.6z" fill="#B86E12"/>'},
  {k:'noc', n:'Noc', d:'půlnoční s hvězdami', g:['#4A5BB0','#1B2140','#0B0920'], limb:'#1B2140', hand:'#4A5BB0', tip:'#7DE3F4', eye:'#7DE3F4', glow:'#7DE3F4',
    f:'<path d="M17 28l1.8 4.6 4.6 1.8-4.6 1.8L17 40.8l-1.8-4.6-4.6-1.8 4.6-1.8z" fill="#7DE3F4"/><path d="M103 22l1.4 3.6 3.6 1.4-3.6 1.4-1.4 3.6-1.4-3.6-3.6-1.4 3.6-1.4z" fill="#F2B544"/><path d="M100 96l1.2 3 3 1.2-3 1.2-1.2 3-1.2-3-3-1.2 3-1.2z" fill="#C9B6FF"/><path d="M20 100l1 2.6 2.6 1-2.6 1-1 2.6-1-2.6-2.6-1 2.6-1z" fill="#fff"/>'},
  {k:'duha', n:'Duha', d:'duhový s korunou a pláštěm', g:['#FF5E7E','#F2B544','#39C6E0'], limb:'#372B91', hand:'#FF5E7E', tip:'#F2B544', eye:'#FFF3C4', noAnt:true,
    b:'<path d="M32 58 L12 120 L60 104 L108 120 L88 58 Z" fill="#A54CB2" opacity=".55"/>',
    f:'<path d="M45 30 L43 12 L52 21 L60 8 L68 21 L77 12 L75 30 Z" fill="#F2B544" stroke="#B86E12" stroke-width="1.6" stroke-linejoin="round"/><circle cx="60" cy="19" r="2.6" fill="#E15079"/>'},
  {k:'plamen', n:'Plamen', d:'ohnivý s tryskami', g:['#FFD25E','#FF7A2F','#D91E4A'], limb:'#8E1436', hand:'#FF7A2F', tip:'#FFD25E', eye:'#FFF1B8',
    b:'<path d="M32 58 L16 112 L60 100 L104 112 L88 58 Z" fill="#D91E4A" opacity=".5"/><path class="sp-jet" d="M38 120 Q44 142 44 146 Q44 142 50 120 Z" fill="#FFD25E"/><path class="sp-jet" d="M70 120 Q76 142 76 146 Q76 142 82 120 Z" fill="#FFD25E"/>',
    f:'<path d="M48 26 Q52 14 60 6 Q58 16 66 18 Q72 20 72 28 Z" fill="#FF7A2F"/>', noAnt:true}
];
const skinsOwned = () => SKINS.slice(0, Math.max(1, rank().lvl));
const curSkin = () => skinsOwned().find(x => x.k === S.skin) || SKINS[0];
/* po změně vzhledu překreslit i Spocka, který na stránce stojí trvale (pomocník v rohu a hlavička chatu) */
function applySkin(){
  document.body.dataset.spockskin = curSkin().k;
  try { const f = document.querySelector('#g-fab .spock'); if (f) f.outerHTML = spockSVG('fab'); const h = document.querySelector('#g-panel .spock'); if (h) h.outerHTML = spockSVG('head'); } catch (e) {}
}
const FREEZE_MAX = 2;
function addFreeze(){ if (S.freeze >= FREEZE_MAX) return false; S.freeze++; return true; }
/* při načtení: vynechané dny (nejvýš tolik, kolik je zmrazení) se zakryjí, když před nimi série byla */
function useFreezes(){
  let gap = 0; while (gap < FREEZE_MAX + 1 && !dayOn(dKey(gap + 1))) gap++;
  if (!gap || gap > S.freeze || !dayOn(dKey(gap + 1))) return;
  for (let i = 1; i <= gap; i++) S.frozen[dKey(i)] = 1;
  S.freeze -= gap; save();
  notice({kind:'goal', title:'Zmrazení zachránilo vaši sérii', text:`Série ${streak()} dní pokračuje. Zbývá zmrazení: ${S.freeze}.`});
}
function streakReward(){
  const st = streak(); if (![3,7,14,30].includes(st) || S.got['streak.' + st]) return;
  S.got['streak.' + st] = true; const f = addFreeze(); save();
  celebrate({kind:'streak', title:`Série ${st} dní!`, text: f ? 'Odměna: zmrazení série. Když jeden den vynecháte, série nepropadne.' : 'Zmrazení série už máte plná (2 ze 2). Držte tempo.'});
}
function rankReward(lv0){
  /* odměna za každou hodnost jen jednou, i když XP přibude ve vnořeném přičtení (výzva, truhla) */
  const r = rank(); if (r.lvl <= lv0 || r.lvl <= (S.rankLvl || 1)) return; S.rankLvl = r.lvl;
  const sk = SKINS[r.lvl - 1], f = addFreeze(); if (sk) S.skin = sk.k; save(); applySkin();
  celebrate({kind:'rank', title:'Nová hodnost: ' + r.name, text:(sk ? `Odměna: vzhled Spocka „${sk.n}“` : 'Odměna') + (f ? ' a zmrazení série.' : '.') + ' Vzhled změníte v profilu.'});
}
/* denní výzvy: tři na den, začínají po výběru role; každá +10 XP, všechny tři otevřou truhlu +20 XP */
const QUESTS = {xp:['Získejte dnes 30 XP', 30], cards:['Odpovězte správně na 3 karty', 3], tasks:['Splňte 1 úkol', 1], lesson:['Dokončete 1 lekci', 1], quiz:['Odpovězte v kvízu 3× napoprvé', 3]};
const QXP = 10, QCHEST = 20;
function dq(){
  const t = dKey(0);
  if (!S.dq || S.dq.day !== t) {
    const w = nextOnPath(), li = w ? curLesson(w) : -1, d = w && li >= 0 ? w.days[li] : null;
    const cardsLeft = d && d.cards ? d.cards.length - cardsDone(w, li) : 0, quizOpen = pathMods().some(m => quizReady(m) && !quizPassed(m));
    const pool = [cardsLeft >= 3 ? 'cards' : null, quizOpen ? 'quiz' : null, 'tasks', 'lesson'].filter(Boolean);
    S.dq = {day:t, ids:['xp'].concat(pool.slice(0, 2)), c:{}, done:{}, chest:false};
  }
  return S.dq;
}
const questProg = id => id === 'xp' ? todayXP() : (dq().c[id] || 0);
function questCount(key, amount){
  if (!S.role || /^dq/.test(key)) return;
  const q = dq(), k = key.startsWith('card.') ? 'cards' : key.startsWith('task.') ? 'tasks' : key.startsWith('lesson.') ? 'lesson' : key.startsWith('quiz.') && amount === XP.quizFirst ? 'quiz' : null;
  if (k) q.c[k] = (q.c[k] || 0) + 1;
  q.ids.forEach(id => { if (!q.done[id] && questProg(id) >= QUESTS[id][1]) { q.done[id] = 1; save(); award('dq.' + q.day + '.' + id, QXP, 'výzva'); } });
  if (!q.chest && q.ids.every(id => q.done[id])) { q.chest = true; save(); award('dqc.' + q.day, QCHEST, 'truhla'); notice({kind:'goal', title:'Denní výzvy splněny!', text:'V truhle bylo +' + QCHEST + ' XP. Zítra čekají nové.'}); }
}
function questCard(){
  if (!S.role) return '';
  const q = dq(), n = q.ids.filter(id => q.done[id]).length;
  return `<section class="quests" aria-label="Dnešní výzvy"><div class="qs-h"><h3>Dnešní výzvy</h3><span class="qs-chest ${q.chest ? 'open' : ''}" title="Truhla za všechny tři výzvy">${q.chest ? 'Truhla otevřena · +' + QCHEST + ' XP' : 'Truhla · ' + n + '/3'}</span></div>
    <ul>${q.ids.map(id => { const p = Math.min(questProg(id), QUESTS[id][1]), t = QUESTS[id][1]; return `<li class="${q.done[id] ? 'done' : ''}"><span class="qs-t">${q.done[id] ? '✓ ' : ''}${QUESTS[id][0]}</span><span class="bar"><i style="width:${Math.round(p / t * 100)}%"></i></span><span class="num">${p}/${t}</span><span class="tm xp ${q.done[id] ? 'got' : ''}">+${QXP} XP</span></li>`; }).join('')}</ul></section>`;
}
function xpPop(text){
  let el = document.getElementById('xp-pop');
  if (!el) { el = document.createElement('div'); el.id = 'xp-pop'; el.setAttribute('role','status'); document.body.append(el); }
  el.textContent = text; el.classList.remove('go'); void el.offsetWidth; el.classList.add('go');
}

/* zámky: cesta 0 → 1 → role → 3, Guild Master navíc → 4; příručka 1b se nezamyká; další modul se odemkne na 80 % předchozího nebo skokovým testem */
const pathIds = () => ['l0','l1', S.role, 'l3', S.role === 'gm' ? GMONLY : null].filter(Boolean);
const modPct = w => { const t = weekTotals(w); return t.tot ? t.done / t.tot : 0; };
function prevOf(w){ const p = pathIds(), i = p.indexOf(w.id); return i > 0 ? W.find(x => x.id === p[i-1]) : null; }
function isLocked(w){
  if (!w || S.unlocked[w.id]) return false;
  if ((w.role && w.role !== S.role) || !applies(w)) return false;
  const prev = prevOf(w); return !!prev && modPct(prev) < .8;
}
function nextOnPath(){ return pathIds().map(id => W.find(w => w.id === id)).find(w => w && modPct(w) < 1) || null; }

/* odznaky */
const BADGES = [
  ['welcome','Na palubě','Vyberte si roli a vydejte se na cestu.', () => !!S.role],
  ['sim','Pilot nanečisto','Projděte simulaci SPOCK nanečisto.', () => !!S.badges.sim],
  ['first-task','První krok','Splňte první úkol.', () => Object.keys(S.got).some(k => k.startsWith('task.'))],
  ['first-lesson','První lekce','Dokončete celou lekci.', () => Object.keys(S.got).some(k => k.startsWith('lesson.'))],
  ['perfect','Bez chyby','Projděte kvíz modulu napoprvé bez jediné chyby.', () => !!S.badges.perfect],
  ['streak3','Tři dny v řadě','Učte se tři dny po sobě.', () => streak() >= 3],
  ['streak7','Týden v řadě','Učte se sedm dní po sobě.', () => streak() >= 7],
  ['jumper','Skokan','Odemkněte modul skokovým testem.', () => Object.keys(S.got).some(k => k.startsWith('jump.'))],
  ['deep','Do hloubky','Dokončete Fáze do hloubky.', () => { const w = W.find(x => x.id === 'l1b'); return w && modPct(w) === 1; }],
  ['role','Moje role','Dokončete modul své role.', () => { const w = S.role && W.find(x => x.role === S.role); return !!w && modPct(w) === 1; }],
  ['spock','Kamarád Spocka','Zeptejte se Spocka na první otázku.', () => !!S.badges.spock],
  ['xp500','500 XP','Nasbírejte 500 XP.', () => S.xp >= 500],
  ['xp1000','1000 XP','Nasbírejte 1000 XP.', () => S.xp >= 1000],
  ['express','Expres','Dokončete expresní cestu.', () => !!S.got['express']],
  ['path','Cesta hotová','Dokončete celou svou cestu až po úroveň 3.', () => !!S.role && ['l0','l1',S.role,'l3'].every(id => modPct(W.find(w => w.id === id)) === 1)],
  ['superuser','Superuser','Jen pro Guild Mastery: dokončete i úroveň 4.', () => S.role === 'gm' && pathIds().every(id => modPct(W.find(w => w.id === id)) === 1)]
];
/* odznak Superuser vidí jen Guild Master, ostatní role mají o odznak méně */
const myBadges = () => BADGES.filter(b => b[0] !== 'superuser' || S.role === 'gm');
function checkBadges(){
  try { exCheck(); } catch (e) {}
  myBadges().forEach(([id, name, how, test]) => {
    if (S.badges['got.' + id]) return;
    let ok = false; try { ok = test(); } catch(e) {}
    if (ok) { S.badges['got.' + id] = dKey(0); save(); celebrate({kind:'badge', title:'Nový odznak: ' + name, text:how}); }
  });
}

/* shrnutí lekce pro oslavu: přesnost karet, splněné úkoly a dnešní XP */
function lessonSum(w, di){
  const d = w.days[di], cs = d.cards || [], ok = cs.filter((c, ci) => S.cards[w.id + '.' + di + '.' + ci] === c.a).length;
  const out = []; if (cs.length) out.push([Math.round(ok / cs.length * 100) + ' %', 'karty napoprvé']);
  if (d.todo.length) out.push([d.todo.length + '/' + d.todo.length, 'úkolů']);
  out.push([todayXP(), 'XP dnes']); return out;
}
/* oslavy: fronta, aby se nepřekrývaly */
const CEL = [];
/* Přes celou obrazovku jen přirozené předěly: lekce, modul, konec kvízu, odemčení. Odznaky
   práci nepřeruší: ukážou se jako upozornění v rohu, které samo zmizí. */
const QUIET = ['badge', 'goal'];
function celebrate(c){
  if (QUIET.includes(c.kind)) return notice(c);
  CEL.push(c); showCel();
}
/* Všechny hlášky (role, odznak, zkopírováno) jdou jednou frontou na jedno místo a ukazují se po jedné. */
const MSGQ = []; let msgOn = false, msgCur = null;
function notice(c){
  if (c.kind === 'info') { for (let i = MSGQ.length - 1; i >= 0; i--) if (MSGQ[i].kind === 'info') MSGQ.splice(i, 1); }
  MSGQ.push(c); if (!msgOn) msgNext(); else if (msgCur && msgCur.info) msgCur.end(500);
}
function msgNext(){
  const c = MSGQ.shift();
  if (!c) { msgOn = false; document.body.classList.remove('msg-on'); return; }
  msgOn = true; document.body.classList.add('msg-on');
  let box = document.getElementById('notices');
  if (!box) { box = document.createElement('div'); box.id = 'notices'; box.className = 'notices'; box.setAttribute('role', 'status'); box.setAttribute('aria-live', 'polite'); document.body.append(box); }
  const info = c.kind === 'info', n = document.createElement(info ? 'div' : 'button'); n.className = 'notice ' + c.kind;
  if (info) n.textContent = c.title;
  else {
    n.type = 'button';
    n.innerHTML = `<span class="nt-ic" aria-hidden="true">${c.kind === 'goal' ? FLAME : '<span>★</span>'}</span><span class="nt-tx"><b>${esc(c.title)}</b><small>${esc(c.text || '')}</small></span>`;
    n.title = 'Zavřít';   /* kliknutí jen zavře: hláška leží nad obsahem a nesmí nikam přesměrovat */
    n.addEventListener('click', () => msgCur && msgCur.end(0));
  }
  box.append(n);
  requestAnimationFrame(() => n.classList.add('in'));
  const out = () => { n.classList.remove('in'); setTimeout(() => { n.remove(); msgCur = null; msgNext(); }, 250); };
  let h = setTimeout(out, info ? 1800 : (MSGQ.length ? 2600 : 4200));
  msgCur = {info, end: ms => { clearTimeout(h); h = setTimeout(out, ms); }};
}
function showCel(){
  /* během kvízu a skokového testu oslavy počkají na jeho konec; naráz je vidět jen jedna */
  const c = CEL[0]; if (!c || SES || STORY || document.querySelector('.cel')) return;
  const ov = document.createElement('div'); ov.className = 'cel'; ov.setAttribute('role','dialog'); ov.setAttribute('aria-modal','true'); ov.setAttribute('aria-label', c.title);
  const big = c.kind === 'module' || c.kind === 'badge' || c.kind === 'unlock' || c.kind === 'rank' || c.kind === 'streak';
  ov.innerHTML = `<canvas class="confetti" aria-hidden="true"></canvas><div class="cel-card ${c.kind}">${spockSVG('big')}
    ${c.kind === 'badge' ? '<span class="cel-badge"><span>★</span></span>' : ''}
    <h2>${esc(c.title)}</h2><p>${esc(c.text || '')}</p>
    ${c.sum ? `<div class="cel-sum">${c.sum.map(x => `<div><b class="num">${x[0]}</b><span>${x[1]}</span></div>`).join('')}</div>` : ''}
    <div class="cel-stats"><span>${FLAME}<b>${streak()}</b> série</span><span><b>${S.xp}</b> XP celkem</span><span><b>${rank().name}</b> hodnost</span></div>
    <div class="cel-acts">${c.mod ? `${c.fin ? '<button class="btn primary cel-fin" type="button">Obléknout postavičku a odletět</button>' : ''}<button class="btn ${c.fin ? '' : 'primary'} cel-go" type="button">Pokračovat</button>` : c.quiz ? '<button class="btn primary cel-quiz" type="button">Spustit kvíz</button><button class="btn cel-go" type="button">Později</button>' : '<button class="btn primary cel-go" type="button">Pokračovat</button>'}</div></div>`;
  document.body.append(ov);
  const done = () => { ov.remove(); CEL.shift(); showCel(); };
  ov.querySelector('.cel-go').onclick = done;
  const cf = ov.querySelector('.cel-fin'); if (cf) cf.onclick = () => { CEL.length = 1; done(); openWardrobe(); };
  const cq = ov.querySelector('.cel-quiz'); if (cq) cq.onclick = () => { CEL.length = 1; done(); startSession(c.quiz, 'quiz'); };
  ov.addEventListener('keydown', e => { if (e.key === 'Escape') done(); });
  (ov.querySelector('.cel-fin') || ov.querySelector('.cel-quiz') || ov.querySelector('.cel-go')).focus();
  confetti(ov.querySelector('.confetti'), big ? 160 : 90);
}
function confetti(cv, n){
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const ctx = cv.getContext('2d'); const W2 = cv.width = innerWidth, H2 = cv.height = innerHeight;
  const cols = ['#E15079','#A54CB2','#372B91','#0B6CB0','#F2B544','#4CC28C'];
  const P = Array.from({length:n}, () => ({x:W2/2 + (Math.random()-.5)*120, y:H2*.38, vx:(Math.random()-.5)*14, vy:-Math.random()*14-4, r:Math.random()*6+4, c:cols[Math.random()*cols.length|0], a:Math.random()*6, va:(Math.random()-.5)*.3}));
  let t = 0;
  (function f(){ if (!cv.isConnected || t++ > 160) return; ctx.clearRect(0,0,W2,H2);
    P.forEach(p => { p.vy += .35; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.a += p.va; ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.a); ctx.fillStyle = p.c; ctx.fillRect(-p.r/2,-p.r/4,p.r,p.r/2); ctx.restore(); });
    requestAnimationFrame(f); })();
}

