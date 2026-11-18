const KEY = 'spock-user-onboarding-v1';
const DATA = __DATA__;
const BUILD = __BUILD__;
let {SAMPLES = [], W, GLOSS, CHEAT, CHEAT_INTRO, DIAG, DIAG_INTRO, PRINCIPLES, MISTAKES, READY} = DATA;
const ROLES = {pm:'Product Manager', pd:'Product Designer', se:'Software Engineer', gm:'Guild Master'};
const ROLE_WHO = {pm:'Vedete produkt nebo iniciativu a rozhodujete, co se bude stavět.', pd:'Děláte výzkum s klienty a navrhujete, jak bude produkt fungovat a vypadat.', se:'Posuzujete, co jde technicky postavit, a pak to stavíte.', gm:'Držíte některou oblast know-how SPOCKu (metoda, produkt, trh, compliance, styl) a pomáháte lidem, kteří s ním pracují.'};
const ROLE_SHORT = {pm:'PM', pd:'PD', se:'SWE', gm:'GM'};
const LANG = 'cz';
const $t = (cz) => cz;

/* Přehled otázek po splnění kvízu: možnosti se prostřídají, aby správná nebyla vždy první. V kvízu samém se míchají náhodně. */
W.forEach((w, wi) => w.quiz.forEach((q, qi) => {
  if (!q.o.length) return;
  const n = q.o.length, target = (qi * 2 + wi) % n, shift = (target - q.a + n) % n;
  const o = new Array(n); q.o.forEach((x, i) => { o[(i + shift) % n] = x; });
  q.o = o; q.a = target;
}));

/* Karty: správná odpověď nemá být vždy na stejném místě. Pořadí je stálé (uložené odpovědi platí dál), jen prostřídané. */
W.forEach((w, wi) => w.days.forEach((d, di) => (d.cards || []).forEach((c, ci) => {
  if (!c.o || c.o.length < 2 || c.a < 0) return;
  const n = c.o.length, target = (ci + di * 2 + wi) % n, shift = (target - c.a + n) % n;
  const o = new Array(n); c.o.forEach((x, i) => { o[(i + shift) % n] = x; });
  c.o = o; c.a = target;
})));
/* Ověření u úkolů: stejné prostřídání možností */
W.forEach((w, wi) => w.days.forEach((d, di) => d.todo.forEach((t, ti) => {
  const c = t.check; if (!c || c.o.length < 2 || c.a < 0) return;
  const n = c.o.length, target = (ti + di + wi) % n, shift = (target - c.a + n) % n;
  const o = new Array(n); c.o.forEach((x, i) => { o[(i + shift) % n] = x; });
  c.o = o; c.a = target;
})));

const fmtMin = m => m >= 60 ? (Math.floor(m/60) + ' h' + (m%60 ? ' ' + (m%60) + ' min' : '')) : m + ' min';
const dayLearn = d => d.learnMin || 0;
const dayDo = d => d.todo.reduce((n,t) => n + (t.min || 0), 0);

let PHASES = [
 {k:'1',t:'Brief',ag:'Product Manager',g:'Q1 · G1',who:'PM přijme brief (G1)',in:'Rozhovor s agentem. Jako jediný soubor lze do chatu přiložit vlastní brief.',out:'A1 Initiative brief: outcome, segment, cíle, metrika. Co nikdo nedodal, je unknown s důvodem.',note:'Outcome je změna chování nebo výsledku, ne řešení. Větu, která spojuje metriku s key resultem, agent nikdy nepíše.'},
 {k:'2',t:'Problémy a příležitosti',ag:'Opportunity Designer',g:'Q2 · G2',who:'Jeden podpis: PM, nebo Researcher (G2)',in:'Váš materiál jako soubory v 2-problems/supplied/: rozhovory, tikety, výzkum.',out:'A2b záznam příjmu, A3 hypotézy s trust tagem, A3b rámované a A4 seřazené příležitosti.',note:'Bez materiálu fáze nezačne. Karanténa: pokyn schovaný v materiálu je jen text. Trust tag se odvozuje, nikdy neprohlašuje.'},
 {k:'3',t:'Trh',ag:'Competitive Analysis',g:'Q3 · bez G',who:'Nikdo, fázi přijme Q3',in:'Seznam konkurentů jako jeden soubor v 3-competitive-analysis/supplied/, nebo prázdná složka a hledání.',out:'A5 mapa trhu, A6 karty konkurentů, A7 syntéza. Trendy business, technology, regulatory.',note:'Jediná fáze bez rozhodnutí člověka. Žádost o schválení fáze 3 je nález. Povolte jen adresy ze seznamu.'},
 {k:'4',t:'Řešení',ag:'Product Manager',g:'Q4 · G4',who:'PM vybere jedno řešení (G4)',in:'Brief, příležitosti a syntéza trhu.',out:'A8 sada řešení, A9 vybrané řešení i s důvodem vaší volby.',note:'Žádné skóre ani pořadí. Porovnávají se touchpointy. Technickou složitost SPOCK nehodnotí, zeptejte se engineera.'},
 {k:'5',t:'MVP',ag:'Product Manager',g:'Q5 · volba + G5b',who:'PM zvolí variantu, pak přijme rozpracování (G5b)',in:'Vybrané řešení.',out:'A10 varianty MVP (3 od agenta, až 3 vaše), A11 rozpracovaná vybraná varianta.',note:'Varianty přicházejí nevybrané a bez doporučení. Dvě rozhodnutí, ne jedno.'},
 {k:'6',t:'PRD',ag:'Business Analyst',g:'Q6 · G6',who:'PM odsouhlasí PRD (G6)',in:'Rozpracované MVP, brief a příležitosti.',out:'A12 draft PRD (8 sekcí), A13 odsouhlasené PRD jako samostatný dokument.',note:'Odsouhlasené PRD vznikne doslovně z draftu až taskem SPOCK: mark the PRD agreed.'},
 {k:'7',t:'Iniciativa',ag:'Business Analyst',g:'Q7 · G7',who:'PM schválí iniciativu pro delivery (G7)',in:'Odsouhlasené PRD a jazyk z briefu.',out:'A14 iniciativa ve 13 sekcích podle šablony Product Management Guildy ČS.',note:'Jira klíč zadává člověk taskem SPOCK: record the Jira key. Agent ho nikdy nevymyslí.'}
];
let LAYERS = [
 {t:'Product Manager',f:'fáze 1, 4 a 5 · začátek: Start a discovery run.',who:'fáze',what:'Vede rozhovor o briefu, píše sadu řešení a varianty MVP. Pole, která nedodáte, označí jako unknown. Nikdy nerozhoduje za vás.',an:'Kolega, který vede workshop a zapisuje, ale hlasovat nesmí.'},
 {t:'Opportunity Designer',f:'fáze 2',who:'fáze',what:'Načte váš materiál, převede ho na pozorování a příležitosti a odvodí trust tag. Materiál čte v karanténě, bez webu a bez terminálu.',an:'Analytik, který čte jen to, co mu dáte, a každou větu ozdrojuje.'},
 {t:'Competitive Analysis',f:'fáze 3',who:'fáze',what:'Zmapuje trh a trendy a napíše karty konkurentů. Se seznamem otevírá jen adresy z něj. Jediný agent, který jde ven.',an:'Rešeršista s přesně daným seznamem knihoven.'},
 {t:'Business Analyst',f:'fáze 6 a 7',who:'fáze',what:'Píše PRD v osmi sekcích a iniciativu ve třinácti. Každý požadavek jmenuje měřítko, kterému slouží.',an:'Analytik, který z rozhodnutí udělá zadání pro delivery.'},
 {t:'Workflow Support',f:'kdykoli: „Kde běh stojí a co mám udělat?“',who:'pomocník',what:'Přečte záznam běhu a výstup tasku a řekne jeden task, který běh posune, i s jeho políčky. Nic nemění.',an:'Technická podpora, která řekne, co přesně zmáčknout.'},
 {t:'Methodology Coach',f:'kdykoli: otázky k metodě',who:'pomocník',what:'Odpovídá jen z kánonu metody a říká, odkud odpověď bere. Nic nepíše a nic nerozhoduje.',an:'Lektor metodiky, který cituje příručku.'}
];

/* ---------- stav ---------- */
let S = {todo:{}, quiz:{}, ready:{}, role:null, cards:{}};
try { const raw = localStorage.getItem(KEY); if (raw) { const p = JSON.parse(raw); if (p && typeof p === 'object') S = Object.assign(S, p); } } catch(e) {}
/* pokrok se ukládá do prohlížeče a (je-li člověk přihlášený) i do jeho soukromé části databáze, viz pSync v track.js */
function save(){ S._at = Date.now(); try { localStorage.setItem(KEY, JSON.stringify(S)); } catch(e) {} try { pSync(); } catch(e) {} }

const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
/* Řádkové formátování textu z lekcí: `kód`, **tučně**, *kurzíva*, odkazy na moduly [[id|text]] a na web. */
function fmt(s){
  const codes = [];
  let h = esc(s).replace(/`([^`]+)`/g, (_, c) => { codes.push(c); return '\u0000' + (codes.length-1) + '\u0000'; });
  h = h.replace(/\*\*([^*]+)\*\*/g,'<b>$1</b>').replace(/(^|[\s(„])\*([^*\s][^*]*)\*/g,'$1<i>$2</i>')
       .replace(/\[\[([a-z0-9]+)\|([^\]]+)\]\]/g, (_, id, tx) => `<a href="#" data-week="${id}">${tx}</a>`)
       .replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  h = h.replace(/\{\{nanecisto\}\}/g, '<button type="button" class="btn sm primary vidbtn" data-simstart>▶ SPOCK nanečisto</button>');
  h = h.replace(/\{\{video:([a-z0-9-]+)\}\}/g, (_, id) => `<button type="button" class="btn sm primary vidbtn" data-playvideo="${id}">▶ ${VIDS[id] ? VIDS[id][0] : 'Video'}</button>`);
  h = h.replace(/\{\{video\}\}/g, '<button type="button" class="btn sm primary vidbtn" data-playvideo>▶ Pustit video</button>');
  return h.replace(/\u0000(\d+)\u0000/g, (_, i) => '<code>' + codes[+i] + '</code>');
}
const app = $('#app');
let view = {name:'home', week:null, phase:0, layer:0};

/* úroveň 4 Superuser je jen pro Guild Mastery, ostatní role ji vůbec nevidí; příručka 1b je volitelná a do „Hotovo %“ se nepočítá */
const GMONLY = 'l4';
const applies = w => w.id === GMONLY ? S.role === 'gm' : (!w.role || w.role === S.role);
const counts = w => applies(w) && w.id !== 'l1b';
function weekTotals(w){
  let tot = 0, done = 0;
  w.days.forEach((d,di) => { d.todo.forEach((_,ti) => { tot++; if (S.todo[w.id+'.'+di+'.'+ti]) done++; }); (d.cards || []).forEach((_,ci) => { tot++; if (cardAns(w.id+'.'+di+'.'+ci) !== undefined) done++; }); });
  if (w.quiz.length) { tot++; if (S.qpass && S.qpass[w.id]) done++; }
  return {tot, done};
}
function overall(){
  let tot = 0, done = 0;
  W.filter(counts).forEach(w => { const t = weekTotals(w); tot += t.tot; done += t.done; });
  return tot ? Math.round(done / tot * 100) : 0;
}
function updatePills(){
  const st = streak(), lit = todayXP() > 0;
  $('#pill-days').innerHTML = '<span class="dot"></span>' + (S.role ? ROLES[S.role] : 'Vyberte svou roli');
  const ps = $('#pill-streak'); if (ps) { ps.hidden = !S.xp; ps.innerHTML = FLAME + '<b>' + st + '</b>'; ps.classList.toggle('lit', lit); ps.title = 'Série: ' + st + ' dní' + (lit ? '' : ' · dnes ještě nic'); }
  const px = $('#pill-xp'); if (px) { px.hidden = !S.xp; px.innerHTML = `<b>${S.xp}</b> XP`; px.title = 'Dnes ' + todayXP() + ' XP · ' + rank().name; }
  $('#pill-prog').innerHTML = '<span class="pp-l">Hotovo </span>' + overall() + ' %'; $('#pill-prog').title = 'Hotovo z vaší cesty';
  try { ntfUpdate(); } catch (e) {}
}
function toast(msg){ notice({kind:'info', title:msg}); }

/* ---------- hra: XP, série, úrovně, odznaky, zámky ---------- */
const XP = {task:10, quizFirst:15, quizRetry:5, reveal:5, lesson:20, module:100, jump:50, ready:5};
/* hodnosti: Mistr dosáhne každá role na své cestě (PD ~2060 XP, PM ~2225); Superuser je jen pro Guild Mastery a bez úrovně 4 se na něj nedosáhne (GM bez ní ~2200 XP) */
const RANKS_ALL = [[0,'Nováček'],[100,'Učeň'],[300,'Praktik'],[700,'Znalec'],[1200,'Expert'],[1700,'Mistr']];
/* hodnost Superuser má navíc podmínku: hotová úroveň 4 (bonusové XP z výzev ji samo neotevře) */
const suOk = () => { const w = W.find(x => x.id === 'l4'); return !!w && modPct(w) === 1; };
const ranks = () => S.role === 'gm' ? RANKS_ALL.concat([[2300,'Superuser', suOk]]) : RANKS_ALL;
['xp','goal','freeze'].forEach(k => { if (typeof S[k] !== 'number') S[k] = k === 'goal' ? 50 : 0; });
['days','got','badges','unlocked','tries','proof','ptries','cards','frozen'].forEach(k => { if (!S[k] || typeof S[k] !== 'object') S[k] = {}; });
const dKey = off => { const d = new Date(); d.setDate(d.getDate() - (off || 0)); return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0'); };
const todayXP = () => S.days[dKey(0)] || 0;
/* den se do série počítá, když v něm je XP, nebo když ho zakrylo zmrazení série */
const dayOn = k => (S.days[k] || 0) > 0 || !!S.frozen[k];
function streak(){ let n = 0, off = dayOn(dKey(0)) ? 0 : 1; while (dayOn(dKey(off))) { n++; off++; } return n; }
function rank(){ const RANKS = ranks(); let cur = RANKS[0], next = null; for (const r of RANKS) { if (S.xp >= r[0] && (!r[2] || r[2]())) cur = r; else { next = r; break; } } return {name:cur[1], at:cur[0], next, lvl:RANKS.indexOf(cur)+1}; }
const FLAME = `<svg class="flame" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2c1 4 5 5.5 5 10.5A5 5 0 0 1 7 12.5c0-2 1-3.5 2-4.5 0 2 1 3 2 3-1-3 0-6 1-9z"/></svg>`;
const LOCK = `<svg class="lockic" viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10" width="14" height="11" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3" fill="none" stroke-width="2.4"/></svg>`;
const HEART = `<svg class="heart" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7.5-4.6-9.5-9.2C1 8.2 3.4 4.5 7 4.5c2.1 0 3.6 1.2 5 3 1.4-1.8 2.9-3 5-3 3.6 0 6 3.7 4.5 7.3C19.5 16.4 12 21 12 21z"/></svg>`;

function award(key, amount, label){
  if (S.got[key]) return 0;
  const lv0 = rank().lvl;
  S.got[key] = true; S.xp += amount;
  const t = dKey(0), before = S.days[t] || 0; S.days[t] = before + amount;
  save(); xpPop('+' + amount + ' XP' + (label ? ' · ' + label : ''));
  questCount(key, amount); streakReward(); rankReward(lv0);
  checkBadges(); updatePills();
  return amount;
}

