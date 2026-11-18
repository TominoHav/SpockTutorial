/* ---------- cesta jako v Duolingu ---------- */
const cardAns = k => (S.cards || {})[k];
const cardsDone = (w, di) => (w.days[di].cards || []).filter((_,ci) => cardAns(w.id+'.'+di+'.'+ci) !== undefined).length;
const lessonDone = (w, di) => { const d = w.days[di], nc = (d.cards || []).length; return (d.todo.length + nc) > 0 && d.todo.every((_,ti) => S.todo[w.id+'.'+di+'.'+ti]) && cardsDone(w, di) === nc; };
const lessonPct = (w, di) => { const d = w.days[di], n = d.todo.length + (d.cards || []).length; return n ? (d.todo.filter((_,ti) => S.todo[w.id+'.'+di+'.'+ti]).length + cardsDone(w, di)) / n : 0; };
function curLesson(w){ const i = w.days.findIndex((_,di) => !lessonDone(w, di)); return i; }
const TROPHY = `<svg class="trophy-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h10v3h3a3 3 0 0 1-3 5.2A5 5 0 0 1 13 15v2h3v3H8v-3h3v-2a5 5 0 0 1-4-3.8A3 3 0 0 1 4 6h3V3zm10 5v1.5A1.2 1.2 0 0 0 18 8zM7 8H6a1.2 1.2 0 0 0 1 1.5z"/></svg>`;

/* Schéma architektury SPOCKu pro lekci GM 2G.6 */
function archSvg(){
  const box = (x,y,w,h,t,sub,cls) => `<g class="as-b ${cls||''}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10"/><text x="${x+w/2}" y="${y+(sub?h/2-4:h/2+5)}" class="as-t">${t}</text>${sub?`<text x="${x+w/2}" y="${y+h/2+14}" class="as-s">${sub}</text>`:''}</g>`;
  const ar = (x1,y1,x2,y2,lbl,lx,ly) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="as-a" marker-end="url(#as-m)"/>${lbl?`<text x="${lx}" y="${ly}" class="as-l">${lbl}</text>`:''}`;
  return `<figure class="archfig"><svg viewBox="0 0 760 430" role="img" aria-labelledby="as-ti as-de"><title id="as-ti">Architektura SPOCKu</title><desc id="as-de">Agent čte pravidla, skill a know-how, je obklopený hlídači, píše dokument, který ověří kontroly (Q brána), podepisuje člověk (G brána) a vše se zapíše do záznamu běhu.</desc>
    <defs><marker id="as-m" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" class="as-mk"/></marker></defs>
    <text x="20" y="22" class="as-h">1 · Co agent ví</text>
    ${box(20,34,220,62,'Know-how','co znamená „dobře“ · vaše vrstva','gm')}
    ${box(20,108,220,52,'Skill','postup pro jeden dokument')}
    ${box(20,172,220,52,'Pravidla pro všechny','pracovní řád agentů')}
    ${ar(240,65,300,110)}${ar(240,134,300,134)}${ar(240,198,300,158)}
    <g class="as-guard"><rect x="290" y="44" width="200" height="190" rx="18"/><text x="390" y="62" class="as-gt">2 · Hlídače kolem agenta</text></g>
    ${box(310,76,160,140,'Agent','smí jen nástroje ze seznamu','ag')}
    <text x="580" y="22" class="as-h">3 · Kdo ověří</text>
    ${box(540,34,200,52,'Dokument fáze','napsal agent')}
    ${ar(470,120,540,64,'píše',500,84)}
    ${box(540,112,200,52,'Kontroly · Q brána','kód, ne agent','chk')}
    ${ar(640,86,640,112)}
    <text x="580" y="196" class="as-h">4 · Kdo rozhoduje</text>
    ${box(540,208,200,52,'Vy · G brána','podpis přes task s políčky','me')}
    ${ar(640,164,640,208)}
    ${box(540,290,200,62,'Záznam běhu','podpisy a verze know-how')}
    ${ar(640,260,640,290)}
    ${box(290,290,200,62,'Vy v chatu','zadání, odpovědi, materiál','me')}
    ${ar(390,290,390,216,'',0,0)}
    ${ar(540,321,490,321,'',0,0)}
    <text x="515" y="300" class="as-l" text-anchor="middle">další fáze</text><text x="515" y="313" class="as-l" text-anchor="middle">nový chat</text>
    <line x1="470" y1="150" x2="540" y2="150" class="as-x"/><text x="505" y="130" class="as-l" text-anchor="middle">kód kontrol</text><text x="505" y="143" class="as-l" text-anchor="middle">číst nesmí</text>
    <text x="20" y="300" class="as-n">Cizí materiál čte krok</text><text x="20" y="318" class="as-n">material-intake bez nástrojů</text><text x="20" y="336" class="as-n">(karanténa ve fázi 2).</text>
    <text x="20" y="384" class="as-n">Workflow se mění jen novým vydáním.</text><text x="20" y="402" class="as-n">Úprava v pracovní kopii shodí kontrolu C189.</text>
  </svg><figcaption>Agent píše, kód kontroluje, člověk podepisuje. Hlídače zastaví špatný krok dřív, než se stane.</figcaption></figure>`;
}
function lessonPanel(w, di){
  const d = w.days[di]; if (!d) return '';
  const dn = d.todo.filter((_,ti) => S.todo[w.id+'.'+di+'.'+ti]).length, done = lessonDone(w, di);
  const learn = d.learn.length ? `<div class="blk"><h4 class="ls-sub">Ke čtení${d.learn.some(r => /`/.test(r.l)) ? ' · v kopii SPOCKu' : ''}</h4><div class="res">${d.learn.map(r => `<div class="ritem"><span class="ty text">text</span><span>${fmt(r.l)}<small>${fmt(r.n||'')}</small></span></div>`).join('')}</div></div>` : '';
  const cards = d.cards && d.cards.length ? (() => {
    const nAns = cardsDone(w, di), shown = d.cards.slice(0, Math.min(d.cards.length, nAns + 1));
    return `<div class="blk"><div class="cards">${shown.map((c, ci) => {
      const k = w.id + '.' + di + '.' + ci, a = cardAns(k), answered = a !== undefined;
      return `<article class="lcard ${answered ? 'done' : 'cur'}" id="card-${k.replace(/\./g,'-')}"><span class="lc-n num">Karta ${ci + 1} z ${d.cards.length}</span><h3>${fmt(c.t)}</h3>${(c.blocks || c.text.map(p => ({p}))).map(b => b.p !== undefined ? `<p>${fmt(b.p)}</p>` : b.list ? `<ul class="keys">${b.list.map(x => `<li><span>${fmt(x)}</span></li>`).join('')}</ul>` : b.table ? tbl(b.table) : b.svg === 'arch' ? archSvg() : b.olist ? `<ol class="lc-ol">${b.olist.map(x => `<li>${fmt(x)}</li>`).join('')}</ol>` : b.code !== undefined ? `<div class="codeblk"><button type="button" class="btn sm codecopy" data-copy>Zkopírovat</button><pre><code>${esc(b.code)}</code></pre></div>` : '').join('')}${c.more || c.moreList ? `<details class="lc-more"><summary>Víc do hloubky</summary>${c.more ? `<p>${fmt(c.more)}</p>` : ''}${c.moreList ? `<ul class="keys">${c.moreList.map(x => `<li><span>${fmt(x)}</span></li>`).join('')}</ul>` : ''}</details>` : ''}${c.q ? `<div class="lc-q"><b>${fmt(c.q)}</b><div class="lc-opts">${c.o.map((o, oi) => `<button type="button" class="lc-opt ${answered ? (oi === c.a ? 'right' : oi === a ? 'wrong' : '') : ''}" data-card="${k}:${oi}" ${answered ? 'disabled' : ''}>${fmt(o)}</button>`).join('')}</div>${answered ? `<p class="lc-why ${a === c.a ? 'ok' : 'bad'}"><b>${a === c.a ? 'Správně.' : 'Ne tak docela.'}</b> ${fmt(c.why)}</p>` : ''}</div>` : ''}</article>`;
    }).join('')}${nAns < d.cards.length ? `<p class="lc-left muted">Odpovězte a otevře se další karta. Zbývá ${d.cards.length - nAns} z ${d.cards.length}.</p>` : ''}</div></div>`;
  })() : '';
  const extra = d.extra && d.extra.length ? `<details class="blk extra"><summary>Pro zvídavé · anglicky, ve vaší kopii SPOCKu</summary><div class="res">${d.extra.map(r => `<div class="ritem"><span class="ty text">text</span><span>${fmt(r.l)}<small>${fmt(r.n||'')}</small></span></div>`).join('')}</div></details>` : '';
  /* Co si odnést do práce: pravidla z vysvětlení karet lekce (žádný nový obsah), ukážou se po zodpovězení karet, ať neprozradí odpovědi */
  const rules = (d.cards || []).map(c => c.why).filter(Boolean).slice(0, 4), rulesOn = rules.length && cardsDone(w, di) === d.cards.length;
  const hasKey = d.key.length || d.tables.length || (d.codes && d.codes.length);
  const key = (hasKey || rules.length) ? `<div class="blk takeaway">${rules.length ? (rulesOn ? `<ul class="keys">${rules.map(r => `<li><span>${fmt(r)}</span></li>`).join('')}</ul>` : '<p class="muted tk-wait">Ukáže se, až zodpovíte karty lekce.</p>') : ''}${w.id === 'gm' && d.d === '2G.6' ? archSvg() : ''}${(() => { const at = t => t.at === undefined ? 0 : t.at; let h = '', ul = []; const flush = () => { if (ul.length) { h += `<ul class="keys">${ul.join('')}</ul>`; ul = []; } }; const codes = d.codes || [], cb = c => `<div class="codeblk"><button type="button" class="btn sm codecopy" data-copy>Zkopírovat</button><pre><code>${esc(c.text)}</code></pre></div>`; d.key.forEach((k, i) => { d.tables.filter(t => at(t) === i).forEach(t => { flush(); h += tbl(t); }); codes.filter(c => c.at === i).forEach(c => { flush(); h += cb(c); }); ul.push(`<li><span>${fmt(k)}</span></li>`); }); flush(); d.tables.filter(t => at(t) >= d.key.length).forEach(t => { h += tbl(t); }); codes.filter(c => c.at >= d.key.length).forEach(c => { h += cb(c); }); return h; })()}</div>` : '';
  const todo = d.todo.length ? `<div class="blk"><div class="todo">${(() => { const ci = d.todo.findIndex((_,ti) => !S.todo[w.id+'.'+di+'.'+ti]); return d.todo.map((t,ti) => todoItem(w.id+'.'+di+'.'+ti, t, ti === ci)).join(''); })()}</div></div>` : '';
  const xpLeft = d.todo.filter((_,ti) => !S.got['task.'+w.id+'.'+di+'.'+ti]).length * XP.task + (S.got['lesson.'+w.id+'.'+di] ? 0 : XP.lesson);
  const next = di + 1 < w.days.length
    ? `<button class="btn ${done ? 'primary' : ''}" type="button" data-lesson="${di+1}">Další lekce: ${esc(w.days[di+1].d)} →</button>`
    : ''; /* poslední lekce: další krok je kvíz u překážky hned pod lekcí */
  return `<section class="lpanel c-${w.c}" id="lpanel" data-lk="${w.id}.${di}" aria-label="Lekce ${esc(d.d)}">
    <div class="lp-head">
      <span class="lp-badge">${done ? '✓' : esc(d.d)}</span>
      <div class="lp-ht"><span class="eyebrow">Lekce ${esc(d.d)} · ~${fmtMin(dayLearn(d) + dayDo(d))}${xpLeft ? ' · ještě ' + xpLeft + ' XP' : ' · hotovo'}</span><h2>${fmt(d.t)}</h2></div>
    </div>
    <div class="lp-prog"><span class="bar"><i style="width:${Math.round(lessonPct(w, di)*100)}%"></i></span><span class="num">${d.cards && d.cards.length ? cardsDone(w, di) + '/' + d.cards.length + ' karet · ' : ''}${dn}/${d.todo.length} úkolů</span></div>
    ${lessonSteps(w, di, [
      (learn || cards) && {k:'learn', t:'Pochopte', sub:d.cards && d.cards.length ? cardsDone(w, di) + '/' + d.cards.length + ' ' + (d.cards.length === 1 ? 'karta' : d.cards.length < 5 ? 'karty' : 'karet') : 'ke čtení', done:!!(d.cards && d.cards.length) && cardsDone(w, di) === d.cards.length, body:learn + cards},
      todo && {k:'todo', t:d.todo.some(t => /VS Code/.test(t.note || '') || t.check) ? 'Vyzkoušejte ve SPOCKu' : 'Vyzkoušejte', sub:dn + '/' + d.todo.length + ' ' + (d.todo.length === 1 ? 'úkol' : d.todo.length < 5 ? 'úkoly' : 'úkolů'), done:dn === d.todo.length, body:todo},
      key && {k:'take', t:'Co si odnést do práce', short:'Co si odnést', sub:rules.length && !rulesOn ? 'po kartách' : '', done:false, wait:!!rules.length && !rulesOn, body:key}
    ])}<div class="dbody">${extra}</div>
    <p class="lp-fb"><button class="btn sm ghost" type="button" data-fbopen>Něco tu nesedí? Napište nám</button></p>
    <div class="lp-foot">${di > 0 ? `<button class="btn" type="button" data-lesson="${di-1}">← ${esc(w.days[di-1].d)}</button>` : '<span></span>'}${next}</div>
  </section>`;
}
/* Lekce ve třech stejných krocích: Pochopte → Vyzkoušejte → Co si odnést do práce.
   Lišta nahoře ukazuje, kde člověk je. Hotové kroky se při otevření lekce sbalí; při překreslení téže lekce
   zůstane rozbalené to, co bylo (ať po poslední kartě nezmizí její vysvětlení). */
function lessonSteps(w, di, list){
  const steps = list.filter(Boolean), lk = w.id + '.' + di, old = document.getElementById('lpanel');
  const keep = old && old.dataset.lk === lk ? Object.fromEntries([...old.querySelectorAll('.lstep')].map(e => [e.dataset.step, e.open])) : null;
  const cur = steps.findIndex(st => !st.done && !st.wait);
  const state = (st, i) => st.done ? 'done' : i === cur ? 'now' : 'wait';
  const chip = s => s === 'done' ? 'Hotovo ✓' : s === 'now' ? 'Na řadě' : 'Čeká';
  const bar = `<ol class="lsteps" aria-label="Kroky lekce">${steps.map((st, i) => `<li class="ls-${state(st, i)}"><button type="button" data-lstep="${st.k}"><span class="ls-n">${state(st, i) === 'done' ? '✓' : i + 1}</span><span>${st.short || st.t}</span></button></li>`).join('')}</ol>`;
  return bar + steps.map((st, i) => { const s = state(st, i), open = keep && keep[st.k] !== undefined ? keep[st.k] : s !== 'done';
    return `<details class="lstep ls-${s}" data-step="${st.k}" ${open ? 'open' : ''}><summary><span class="ls-n">${s === 'done' ? '✓' : i + 1}</span><span class="ls-t">${st.t}</span>${st.sub ? `<span class="ls-sub2">${st.sub}</span>` : ''}<span class="ls-chip">${chip(s)}</span></summary><div class="ls-b">${st.body}</div></details>`; }).join('');
}
document.addEventListener('click', e => { const b = e.target.closest('[data-lstep]'); if (!b) return; const d = document.querySelector(`.lstep[data-step="${b.dataset.lstep}"]`); if (d) { d.open = true; d.scrollIntoView({block:'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'}); } });
/* Po přechodu na jinou lekci skočit na její začátek (pod lištu nahoře) */
function toLessonTop(){ const p = document.getElementById('lpanel'); if (p) p.scrollIntoView({block:'start', behavior:'auto'}); }
document.addEventListener('click', e => {
  const l = e.target.closest('[data-lesson]'); if (!l || view.name !== 'week') return;
  view.lesson = +l.dataset.lesson; renderWeek(view.week); updatePills();
  const p = document.getElementById('lpanel'); if (p) p.scrollIntoView({block:'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
});

function renderWeek(id){
  const w = W.find(x => x.id === id); if (!w || (w.id === GMONLY && !applies(w))) return renderHome();   /* úroveň 4 vidí jen Guild Master */
  if (isLocked(w) && view.peek !== w.id) return renderLocked(w);
  const idx = W.indexOf(w);
  const cur = curLesson(w);
  if (typeof view.lesson !== 'number' || view.lessonOf !== w.id || !w.days[view.lesson]) { view.lesson = cur >= 0 ? cur : w.days.length - 1; view.lessonOf = w.id; }
  const sel = view.lesson;
  const quiz = quizPassed(w) ? w.quiz.map(q => `<div class="qcard"><div class="stmt">${fmt(q.q)}</div><div class="opts">${q.o.map((o,oi) => `<div class="opt ${oi === q.a ? 'right' : ''}"><span class="rad"></span><span>${fmt(o)}</span></div>`).join('')}</div><div class="fb">${fmt(q.e)}</div></div>`).join('') : '';
  const qr = quizReady(w), qp = quizPassed(w), ct = cardsTotal(w), ca = cardsAll(w);
  const seq = pathIds().map(id => W.find(x => x.id === id)).filter(Boolean), si = seq.indexOf(w);
  const prev = si >= 0 ? seq[si-1] : W[idx-1], next = si >= 0 ? seq[si+1] : W[idx+1];
  const other = S.role && ((w.role && w.role !== S.role) || !applies(w));
  app.innerHTML = shell(w.id, `
    <div class="unit c-${w.c}"><div class="unit-t"><span class="eyebrow">${esc(w.lab)}${w.role ? '' : w.id === GMONLY ? ' · jen Guild Master' : ' · všichni'}</span><h1>${esc(w.title)}</h1><p>${fmt(w.goal)}</p><button type="button" class="unit-more" aria-expanded="false">Více</button></div>
      </div>
    ${other ? `<p class="goal" style="background:var(--warn-bg)"><b>Tohle je lekce pro roli ${ROLES[w.role || 'gm']}.</b> Čtěte ji pro kontext tria, do vašeho pokroku se nepočítá.</p>` : ''}
    ${sel === 0 ? `<details class="unit-guide"><summary>Průvodce modulem: proč a co mít připravené</summary><div class="mh c-${w.c}"><p class="why"><b>Proč:</b> ${fmt(w.why)}</p>${w.before ? `<p class="why"><b>Než začnete:</b> ${fmt(w.before)}</p>` : ''}</div></details>` : ''}
    ${lessonPanel(w, sel)}
    ${sel === w.days.length - 1 ? `<div class="sec-h" style="margin-top:28px"><h2>Kvíz u překážky</h2><p>${qp ? 'Překážku máte za sebou.' : qr ? 'Karty máte hotové. Proleťte překážkou: otázky ze situací z praxe.' : 'Odemkne se, až zodpovíte všechny karty modulu.'}</p></div>
    <div class="qlaunch c-${w.c} ${qr ? '' : 'qlock'}">${spockSVG('fab')}<div><b>${esc((worldOf(w) || {foe:'Kvíz modulu'}).foe)} · ${Math.min(QN, w.quiz.length)} otázek</b><span>${qp ? `Splněno: ${S.qpass[w.id].right} z ${S.qpass[w.id].total} napoprvé.` : qr ? `Otázky se losují a míchají. Na splnění potřebujete ${Math.ceil(Math.min(QN, w.quiz.length) * QPASS)} z ${Math.min(QN, w.quiz.length)} napoprvé.` : `Karty: ${ca} z ${ct}.`}</span></div><button class="btn ${qr && !qp ? 'primary' : ''}" type="button" data-quiz="${w.id}" ${qr ? '' : 'disabled'}>${qp ? 'Zopakovat kvíz' : qr ? 'Spustit kvíz' : LOCK + ' Po kartách'}</button></div>
    ${qp ? `<details class="qreview"><summary>Všechny otázky kvízu s vysvětlením</summary><div class="quiz c-${w.c}">${quiz}</div></details>` : ''} ` : ''}
    ${qp && sel === w.days.length - 1 ? `<div class="navrow"><span></span>${next ? `<button class="btn primary" type="button" data-week="${next.id}">Pokračovat: ${esc(next.title)} →</button>` : `<button class="btn primary" type="button" data-go="home">Na úvod →</button>`}</div>` : ''}`);
  /* vysvětlivky až po vykreslení lekce, aby se lekce ukázala hned */
  { const gr = document.querySelector('.lpanel') || document.querySelector('.main'), go = () => { if (gr.isConnected) glossify(gr); }; (window.requestIdleCallback || setTimeout)(go, {timeout:300}); }
  const um = document.querySelector('.unit-more');
  if (um) um.addEventListener('click', () => { const u = um.closest('.unit'), o = u.classList.toggle('open'); um.textContent = o ? 'Méně' : 'Více'; um.setAttribute('aria-expanded', o); });
  const pl = document.querySelector('.pd-line'), po = pl && pl.querySelector('.pd-s.on');
  if (pl && po && pl.scrollWidth > pl.clientWidth) pl.scrollLeft = Math.max(0, po.offsetLeft - pl.offsetLeft - pl.clientWidth/2 + po.offsetWidth/2);
}

