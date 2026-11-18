/* ---------- vysvětlivky odborných slov přímo v textu lekce ---------- */
const GL_DEF = n => { const g = GLOSS.find(x => x[0].toLowerCase().startsWith(n.toLowerCase())); return g ? plain(g[1]).replace(/`/g,'') : ''; };
/* výkon: regulární výrazy se sestaví až při prvním použití, ne při načtení stránky */
let TERMS_RX = null;
const TERMS_SRC = [
  ['REDIM\\p{L}*','Interní systém ČS pro žádosti o oprávnění. Přístupy ke Copilotu, repozitáři i SSH certifikátu se objednávají jako role v REDIMu.'],
  ['Solveo','Firemní katalog softwaru pro Windows. Programy objednáte jako v e-shopu.'],
  ['Self Service\\+','Firemní katalog softwaru pro Mac (Catalog → vyhledat → nainstalovat).'],
  ['caauth-cli','Program, který nainstaluje SSH certifikát pro připojení k firemnímu GitHubu.'],
  ['surface','Soubor .github/surface říká SPOCKu, v jakém nástroji pracujete. Musí v něm být copilot.'],
  ['repozitář\\p{L}*','Místo na GitHubu, kde jsou uložené soubory projektu. Odtud si SPOCK stáhnete.'],
  ['naklon\\p{L}*|klon(?:ovat|ujte|u|em)','Stáhnout kopii repozitáře tak, aby se dala později jedním krokem aktualizovat.'],
  ['Git(?:u|em)?','Program, který hlídá verze souborů a umí repozitář stáhnout a aktualizovat.'],
  ['Node\\.js','Program, který na pozadí spouští skripty SPOCKu. Sami v něm nic neděláte.'],
  ['VS Code','Visual Studio Code, program na práci se soubory. V něm SPOCK běží.'],
  ['Copilot Chat\\p{L}*','Okno s AI asistentem uvnitř VS Code. Tady mluvíte s agenty SPOCKu.'],
  ['agent mode','Režim, ve kterém asistent smí pracovat se soubory, ne jen odpovídat.'],
  ['Command Palette','Vyhledávací řádek ve VS Code pro všechny příkazy. Otevře ho Cmd+Shift+P nebo Ctrl+Shift+P.'],
  ['task\\p{L}*', () => GL_DEF('Task')],
  ['brief\\p{L}*','Zadání běhu z fáze 1: jaký výsledek chcete, pro koho a podle čeho ho poznáte.'],
  ['trust tag\\p{L}*', () => GL_DEF('Trust tag')],
  ['PRD','Product Requirements Document: co se má postavit a proč. Vzniká ve fázi 6.'],
  ['MVP','Minimum Viable Product: nejmenší verze řešení, která ověří, že funguje. Fáze 5.'],
  ['iniciativ\\p{L}*','Výstup fáze 7: zadání pro vývoj ve 13 sekcích podle šablony Product Management Guildy ČS.'],
  ['unknown','Pole, které nikdo nedodal. Agent si ho nevymyslí, nechá ho jako unknown s důvodem.'],
  ['stale', () => GL_DEF('Stale')],
  ['free-roam', () => GL_DEF('Free-roam')],
  ['Q brán\\p{L}*|Q[1-7]', () => GL_DEF('Q1')],
  ['G brán\\p{L}*|G(?:1|2|4|5b|6|7)', () => GL_DEF('G1')],
  ['outcome\\p{L}*', () => GL_DEF('Outcome')],
  ['touchpoint\\p{L}*', () => GL_DEF('Touchpoint')],
  ['karantén\\p{L}*', () => GL_DEF('Karanténa')]
];
const TERMS_GET = () => TERMS_RX || (TERMS_RX = TERMS_SRC.map(([p, d]) => [new RegExp('(?<![\\p{L}\\d_.-])(?:' + p + ')(?![\\p{L}\\d_])', 'iu'), d]));
function glossify(root){
  if (!root) return;
  const used = new Set(), tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {acceptNode: n => n.parentElement.closest('code,a,button,h1,h2,h3,summary,label,table,svg,.gl,.eyebrow,.ld,.ses,script,style') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT});
  /* výkon: pojmy, které v lekci vůbec nejsou, se nehledají v každém textovém uzlu zvlášť */
  const all = root.textContent, live = TERMS_GET().map((t, ti) => [t[0], t[1], ti]).filter(t => t[0].test(all)); if (!live.length) return;
  const nodes = []; while (tw.nextNode()) nodes.push(tw.currentNode);
  nodes.forEach(n => {
    let node = n;
    live.forEach(([re, d, ti]) => {
      if (used.has(ti) || !node) return;
      const m = node.nodeValue.match(re); if (!m) return;
      const def = typeof d === 'function' ? d() : d; if (!def) return;
      used.add(ti);
      const after = node.splitText(m.index), rest = after.splitText(m[0].length);
      const sp = document.createElement('span'); sp.className = 'gl'; sp.tabIndex = 0; sp.dataset.tip = def; sp.textContent = after.nodeValue;
      sp.setAttribute('aria-label', after.nodeValue + ': ' + def);
      after.replaceWith(sp); node = rest;
    });
  });
}

/* ---------- zpětná vazba k onboardingu ---------- */
const SURVEY_Q = ['Rozumím, co SPOCK dělá a k čemu ho budu používat.','Poznám, kdy výstupu SPOCKu věřit a kdy ne.','Vím, na koho se obrátit, když něco nefunguje.'];
function surveyCard(compact){
  const sv = S.survey || {};
  return `<section class="svy" id="svy"><div class="svy-h">${spockSVG('fab')}<div><h3>${sv.at ? 'Díky za zpětnou vazbu!' : 'Jak se vám onboarding daří?'}</h3><p>${sv.at ? 'Odpovědi jsou u týmu CoE Product Management. Když je upravíte, pošlete je znovu.' : 'Tři otázky, minuta času. Pomůže to onboarding zlepšit pro další kolegy.'}</p></div></div>
    ${SURVEY_Q.map((q,i) => `<div class="svy-q"><span>${q}</span><div class="svy-s" role="radiogroup" aria-label="${esc(q)}">${[1,2,3,4,5].map(v => `<button type="button" role="radio" aria-checked="${sv['q'+i] === v}" class="${sv['q'+i] === v ? 'on' : ''}" data-svy="${i}:${v}" title="${['vůbec nesouhlasím','spíš nesouhlasím','napůl','spíš souhlasím','plně souhlasím'][v-1]}">${v}</button>`).join('')}</div></div>`).join('')}
    <label class="svy-t"><span>Co bylo nejtěžší nebo nejasné?</span><textarea id="svy-txt" rows="${compact ? 2 : 3}" placeholder="Volitelné">${esc(sv.txt || '')}</textarea></label>
    <div class="svy-f"><span class="muted">1 = vůbec nesouhlasím, 5 = plně souhlasím. Odešlou se týmu CoE Product Management, který onboarding spravuje.</span><button class="btn primary" type="button" data-svy-send ${SURVEY_Q.every((_,i) => sv['q'+i]) ? '' : 'disabled'}>${sv.at ? 'Odeslat znovu' : 'Odeslat zpětnou vazbu CoE Product Managementu'}</button></div>
    ${sv.at ? `<p class="svy-ok" role="status">${sv.queued ? 'Jste offline. Odešlu je sám, jakmile budete zase připojeni.' : 'Odesláno týmu CoE Product Management. Díky!'}</p>` : ''}</section>`;
}
document.addEventListener('click', e => {
  const b = e.target.closest('[data-svy],[data-svy-send]'); if (!b) return;
  S.survey = S.survey || {};
  if (b.dataset.svy) { const [i, v] = b.dataset.svy.split(':').map(Number); S.survey['q'+i] = v; save(); const y = scrollY; render(); scrollTo({top:y}); return; }
  const tx = document.getElementById('svy-txt'); S.survey.txt = tx ? tx.value : '';
  const out = SURVEY_Q.map((q,i) => q + ' ' + S.survey['q'+i] + '/5').join(' · ') + (S.survey.txt ? '\nNejtěžší: ' + S.survey.txt : '');
  /* jeden dotazník na člověka: opakované odeslání přepíše ten předchozí */
  const item = {id:'svy', at:Date.now(), loc:'badges', where:'Dotazník k onboardingu', kind:'dotaznik', text:out, fix:'', role:S.role || null, ver:BUILD.ver || ''};
  b.disabled = true; b.textContent = 'Odesílám…';
  fbStore(item).then(res => {
    if (res === 'fail') { b.disabled = false; b.textContent = 'Odeslat znovu'; toast('Odeslat se nepodařilo. Zkuste to prosím znovu.'); return; }
    S.survey.at = dKey(0); S.survey.queued = res === 'queued'; save(); award('survey', 20, 'zpětná vazba'); try { trk('zpětná vazba', 'dotazník'); } catch (e) {}
    const y = scrollY; render(); scrollTo({top:y}); toast(res === 'sent' ? 'Odesláno týmu CoE Product Management' : 'Odešlu, až budete online');
  });
});
document.addEventListener('input', e => { if (e.target.id === 'svy-txt') { S.survey = S.survey || {}; S.survey.txt = e.target.value; save(); } });

/* kopírování ukázek kódu a promptů z lekcí */
document.addEventListener('click', e => {
  const b = e.target.closest('[data-copy]'); if (!b) return;
  const pre = b.parentElement.querySelector('pre'); if (!pre) return;
  const done = () => { b.textContent = 'Zkopírováno'; setTimeout(() => { b.textContent = 'Zkopírovat'; }, 1500); };
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(pre.innerText).then(done, () => { const r = document.createRange(); r.selectNodeContents(pre); const s = getSelection(); s.removeAllRanges(); s.addRange(r); });
  else { const r = document.createRange(); r.selectNodeContents(pre); const s = getSelection(); s.removeAllRanges(); s.addRange(r); }
});

/* karty v lekci: odpověď otevře další kartu */
document.addEventListener('click', e => {
  const b = e.target.closest('[data-card]'); if (!b) return;
  const [k, o] = b.dataset.card.split(':'), [wid, di, ci] = k.split('.');
  const w = W.find(x => x.id === wid), c = w && w.days[+di].cards[+ci]; if (!c || (S.cards || {})[k] !== undefined) return;
  S.cards = S.cards || {}; S.cards[k] = +o;
  /* netrefená karta se vrátí k opakování za den */
  if (+o !== c.a) { try { revAdd(k); } catch (err) {} }
  save();
  if (+o === c.a) award('card.' + k, 5, 'karta');
  const d = w.days[+di];
  if (lessonDone(w, +di) && award('lesson.' + wid + '.' + di, XP.lesson, 'lekce')) {
    celebrate({kind:'lesson', sum:lessonSum(w, +di), title:'Lekce ' + d.d + ' hotová!', text:plain(d.t) + '. ' + (w.days[+di+1] ? 'Na řadě je lekce ' + w.days[+di+1].d + '.' : 'Na řadě je kvíz modulu.')});
    if (w.days[+di+1]) view.lesson = +di + 1;
  }
  if (quizReady(w) && !quizPassed(w)) celebrate({kind:'quiz', title:'Kvíz modulu je odemčený', text:'Zodpověděli jste všechny karty modulu ' + w.title + '. Kvíz vylosuje ' + Math.min(QN, w.quiz.length) + ' otázek a ověří, že látku umíte použít v praxi. Úkoly můžete dodělat i potom.', quiz:w.id});
  checkModuleDone(w);
  if (view.lesson !== +di) { renderWeek(view.week); updatePills(); toLessonTop(); return; }
  const y = scrollY; renderWeek(view.week); updatePills(); scrollTo({top:y});
  const nx = document.getElementById('card-' + wid + '-' + di + '-' + (+ci + 1));
  if (nx) nx.scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center'});
});
/* Příkazy v postupu úkolu (SPOCK: …) se kliknutím zkopírují do schránky */
document.addEventListener('click', e => {
  const c = e.target.closest('.thow code, .lc-ol code'); if (!c || e.target.closest('a,button')) return;
  const t = c.textContent.trim(); if (t.length < 6 || !navigator.clipboard) return;
  navigator.clipboard.writeText(t).then(() => toast('Zkopírováno: ' + (t.length > 40 ? t.slice(0, 40) + '…' : t)), () => {});
});

