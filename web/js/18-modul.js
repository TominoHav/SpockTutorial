/* ---------- modul ---------- */
/* Úkol s ověřením z VS Code: odškrtne se až odpovědí, kterou člověk zjistí jen tak, že úkol opravdu udělá. */
const proofAns = k => (S.proof || {})[k];
const proofOk = (k, o) => !o.check || (o.check.kind === 'run' ? !!((S.runev || {})[k] || (S.selfok || {})[k]) : o.check.kind === 'seen' ? proofAns(k) !== undefined : proofAns(k) === o.check.a);
/* Důkaz z běhu: člověk vloží RUN-STATE.md vlastního běhu a web v prohlížeči ověří, že fáze je schválená a bránu podepsal člověk.
   Formát podle .github/scripts/run-state.mjs ve SPOCKu (render: decision_gates → - id, decided_by, decided_at, by_agent: false),
   starší záznamy mají decision_gate bez seznamu. Text se nikam neposílá ani neukládá; uloží se jen datum podpisu a otisk názvu běhu. */
function runEvidence(txt, gate){
  const t = String(txt || '').replace(/\r/g, ''), un = v => v.trim().replace(/^["']|["']$/g, '');
  const val = (re, src) => { const m = src.match(re); return m ? un(m[1]) : ''; };
  if (!/^record:\s*run-state\s*$/m.test(t)) return {ok:false, why:'Tohle nevypadá jako RUN-STATE.md. Otevřete runs/<váš běh>/RUN-STATE.md, označte všechno a vložte celý obsah.'};
  const run = val(/^run_id:\s*(.+)$/m, t);
  if (!run) return {ok:false, why:'V záznamu chybí run_id. Zkopírujte celý soubor, i úplný začátek.'};
  if (SAMPLES.includes(run)) return {ok:false, why:'„' + run + '“ je ukázkový běh, který SPOCK přibaluje. Vložte RUN-STATE.md vlastního běhu ze složky runs/.'};
  const n = gate.slice(1), L = t.split('\n'), i = L.findIndex(l => new RegExp('^  - id:\\s*["\']?' + n + '["\']?\\s*$').test(l));
  if (i < 0) return {ok:false, why:'V záznamu chybí fáze ' + n + '. Zkopírujte celý soubor.'};
  let j = i + 1; while (j < L.length && !/^  - id:/.test(L[j]) && !/^\S/.test(L[j])) j++;
  const blk = L.slice(i, j), st = val(/^    status:\s*(.+)$/m, blk.join('\n'));
  const gi = blk.findIndex(l => new RegExp('^\\s+(- )?id:\\s*["\']?' + gate + '["\']?\\s*$').test(l));
  if (gi < 0) return {ok:false, why:'Podpis ' + gate + ' v záznamu zatím není. Spusťte task SPOCK: approve what is in front of me, pak RUN-STATE.md zkopírujte znovu.'};
  const g = blk.slice(gi, gi + 4).join('\n'), by = val(/decided_by:\s*(.+)$/m, g), at = val(/decided_at:\s*(\d{4}-\d{2}-\d{2})/m, g);
  if (/by_agent:\s*true/.test(g)) return {ok:false, why:'Podpis ' + gate + ' je zapsaný jako od agenta. Bránu musí podepsat člověk v tasku.'};
  if (!by || !at) return {ok:false, why:'U ' + gate + ' chybí jméno nebo datum podpisu. Spusťte task SPOCK: approve what is in front of me.'};
  if (st !== 'accepted') return {ok:false, why:'Fáze ' + n + ' má stav „' + (st || 'neznámý') + '“, ne accepted. Dokončete schválení a zkopírujte soubor znovu.'};
  return {ok:true, run, at};
}
const RUNERR = {};
const rhash = s => { let h = 5381; for (const ch of String(s)) h = ((h << 5) + h + ch.charCodeAt(0)) >>> 0; return h.toString(36); };
function runBlock(k, c){
  const ev = (S.runev || {})[k], self = (S.selfok || {})[k], err = RUNERR[k], id = 're-' + k.replace(/\./g, '-');
  if (ev) return `<div class="tchk proof run"><span class="tchk-l">Důkaz z běhu</span><p class="lc-why ok"><b>Ověřeno z vašeho běhu.</b> Fáze ${esc(c.gate.slice(1))} je schválená a ${esc(c.gate)} jste podepsali ${esc(ev.signed)}. Tohle je váš první skutečný výsledek ve SPOCKu.</p></div>`;
  return `<div class="tchk proof run"><span class="tchk-l">Důkaz z běhu</span><b>Vložte celý obsah <code>RUN-STATE.md</code> vašeho běhu</b>
    <textarea class="runev-in" id="${id}" rows="4" spellcheck="false" aria-label="Obsah souboru RUN-STATE.md" placeholder="---&#10;run_id: …&#10;record: run-state&#10;…"></textarea>
    <div class="runev-act"><button class="btn sm primary" type="button" data-runev="${k}">Ověřit</button>${self ? '<span class="muted">Odškrtnuto bez důkazu. Důkaz můžete vložit kdykoli.</span>' : `<button class="linkbtn" type="button" data-runself="${k}">Nejde to? Odškrtnout bez důkazu</button>`}</div>
    ${err ? `<p class="lc-why bad" role="alert"><b>Zatím to nesedí.</b> ${esc(err)}</p>` : ''}
    <p class="muted runev-pv">Text zůstává jen ve vašem prohlížeči a nikam se neposílá. Uloží se jen to, že podpis ${esc(c.gate)} existuje, a jeho datum.</p></div>`;
}
function checkBlock(k, c){
  if (c.kind === 'run') return runBlock(k, c);
  const a = proofAns(k), ans = a !== undefined, seen = c.kind === 'seen', tries = (S.ptries || {})[k] || 0;
  const right = ans && a === c.a, locked = seen ? ans : right;
  let fb = '';
  if (seen && ans) fb = right ? `<p class="lc-why ok"><b>Tak to má být.</b> ${c.hint ? '' : 'Agent se zachoval správně.'}</p>` : `<p class="lc-why bad"><b>To je odchylka od správného chování.</b> Zapište si ji do deníku i s citací agenta. ${fmt(c.hint || 'Opakuje-li se, pošlete nález týmu CoE Product Management (lekce 3.6).')}</p>`;
  else if (!seen && right) fb = `<p class="lc-why ok"><b>Sedí.</b> Úkol je splněný.</p>`;
  else if (!seen && tries) fb = `<p class="lc-why bad"><b>To nesedí.</b> ${fmt(c.hint || 'Podívejte se do SPOCKu ještě jednou a zkuste to znovu.')}</p>`;
  return `<div class="tchk ${seen ? 'seen' : 'proof'}"><span class="tchk-l">${seen ? 'Co jste viděli' : 'Ověření z VS Code'}</span><b>${fmt(c.q)}</b><div class="lc-opts">${c.o.map((o, oi) => `<button type="button" class="lc-opt ${locked ? (oi === c.a ? 'right' : oi === a ? 'wrong' : '') : ''}" data-proof="${k}:${oi}" ${locked ? 'disabled' : ''}>${fmt(o)}</button>`).join('')}</div>${fb}</div>`;
}
function todoItem(k, o, cur){
  const nh = o.how ? o.how.length : 0, how = nh ? `<ol class="thow">${o.how.map(h => `<li>${fmt(h)}</li>`).join('')}</ol>` : '', chk = o.check ? checkBlock(k, o.check) : '';
  const fold = nh > 2 || (nh && o.check);
  const body = fold ? `<details class="tfold" ${cur ? 'open' : ''}><summary><span class="tf-o">Zobrazit postup</span><span class="tf-c">Skrýt postup</span> · ${nh} ${nh === 1 ? 'krok' : nh < 5 ? 'kroky' : 'kroků'}${o.check ? (o.check.kind === 'seen' ? ' a otázka, co jste viděli' : o.check.kind === 'run' ? ' a důkaz z běhu' : ' a ověření') : ''}</summary>${how}${chk}</details>` : how + chk;
  const det = (o.why || nh || o.check) ? `<div class="tdet">${o.why ? `<p class="twhy"><b>Proč:</b> ${fmt(o.why)}</p>` : ''}${body}</div>` : '';
  const gate = o.check && !proofOk(k, o) && !S.todo[k];
  return `<div class="titem ${o.check ? 'has-chk' : ''}"><label><input type="checkbox" id="t-${k.replace(/\./g,'-')}" data-todo="${k}" ${S.todo[k]?'checked':''} ${gate ? 'disabled title="Odškrtne se odpovědí na ověření níže"' : ''}><span>${fmt(o.t)}${o.min ? ` <span class="tm">~${fmtMin(o.min)}</span>` : ''}${o.note ? ` <span class="tm ${/VS Code/.test(o.note) ? 'where vsc' : ''}">${esc(o.note)}</span>` : ''} <span class="tm xp ${S.got['task.'+k] ? 'got' : ''}">+${XP.task} XP</span></span></label>${det}</div>`;
}
document.addEventListener('click', e => {
  const b = e.target.closest('[data-proof]'); if (!b) return;
  const [k, oi] = b.dataset.proof.split(':'), [wid, di, ti] = k.split('.'), w = W.find(x => x.id === wid), t = w && w.days[+di] && w.days[+di].todo[+ti], c = t && t.check; if (!c) return;
  S.proof = S.proof || {}; S.ptries = S.ptries || {};
  const seen = c.kind === 'seen', ok = +oi === c.a;
  S.ptries[k] = (S.ptries[k] || 0) + 1;
  try { trk(seen ? 'co viděli' : 'ověření', k + (ok ? ' správně' : seen ? ' odchylka' : ' špatně')); } catch (err) {}
  if (seen || ok) {
    S.proof[k] = +oi; save();
    if (ok) award('proof.' + k, 5, 'ověření');
    const box = document.getElementById('t-' + k.replace(/\./g, '-'));
    if (box && !box.checked) { box.disabled = false; box.checked = true; box.dispatchEvent(new Event('change', {bubbles:true})); return; }
  } else save();
  const y = scrollY; renderWeek(view.week); scrollTo({top:y});
});
document.addEventListener('click', e => {
  const b = e.target.closest('[data-runev],[data-runself]'); if (!b) return;
  const k = b.dataset.runev || b.dataset.runself, [wid, di, ti] = k.split('.'), w = W.find(x => x.id === wid), t = w && w.days[+di] && w.days[+di].todo[+ti], c = t && t.check; if (!c || c.kind !== 'run') return;
  const now = Date.now(), id = 're-' + k.replace(/\./g, '-');
  if (b.dataset.runself) {
    S.selfok = Object.assign({}, S.selfok, {[k]:now}); if (!S.fv) S.fv = {at:now, lvl:'self', gate:c.gate};
    try { trk('první hodnota', c.gate + ' bez důkazu'); } catch (err) {}
  } else {
    const ta = document.getElementById(id), r = runEvidence(ta && ta.value, c.gate);
    S.ptries = S.ptries || {}; S.ptries[k] = (S.ptries[k] || 0) + 1;
    if (!r.ok) { RUNERR[k] = r.why; try { trk('důkaz z běhu', c.gate + ' nesedí'); } catch (err) {} save(); const y = scrollY; renderWeek(view.week); scrollTo({top:y}); const el = document.getElementById(id); if (el) el.focus({preventScroll:true}); return; }
    delete RUNERR[k];
    S.runev = Object.assign({}, S.runev, {[k]:{at:now, gate:c.gate, signed:r.at, rh:rhash(r.run)}});
    if (!S.fv || S.fv.lvl !== 'run') S.fv = {at:now, lvl:'run', gate:c.gate, selfAt:S.fv && S.fv.lvl === 'self' ? S.fv.at : null};
    award('proof.' + k, 5, 'důkaz z běhu');
    try { trk('první hodnota', c.gate + ' ověřeno z běhu'); } catch (err) {}
  }
  save();
  const box = document.getElementById('t-' + k.replace(/\./g, '-'));
  if (box && !box.checked) { box.disabled = false; box.checked = true; box.dispatchEvent(new Event('change', {bubbles:true})); return; }
  const y = scrollY; renderWeek(view.week); scrollTo({top:y});
});
function qDone(w){ return quizPassed(w) ? 1 : 0; }
function tbl(t){
  return `<div class="tw"><table><thead><tr>${t.head.map(h => `<th>${fmt(h)}</th>`).join('')}</tr></thead><tbody>${t.rows.map(r => `<tr>${r.map(c => `<td>${fmt(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}
