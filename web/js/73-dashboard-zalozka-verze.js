/* ---------- dashboard: záložka Verze a kvalita ---------- */
function dTabs(){ return `<div class="ds-tabs" role="tablist">${[['lide','Lidé a průchod'],['pohyb','Pohyb a problémová místa'],['ver','Verze a kvalita']].map(t => `<button type="button" role="tab" aria-selected="${DASH.tab === t[0]}" class="${DASH.tab === t[0] ? 'on' : ''}" data-dash="tab:${t[0]}">${t[1]}</button>`).join('')}</div>`; }
const vTok = n => Math.round((n || 0) / 3.5);
const vCtxMax = v => v && v.e2e && v.e2e.ctx ? Math.max(0, ...Object.values(v.e2e.ctx)) : null;
const vLab = (v, tag, k) => v && v.e2e && v.e2e.lab && v.e2e.lab[tag] ? v.e2e.lab[tag][k] : null;
/* změna proti předchozí verzi: text + slovní hodnocení (ne jen barva) */
function vDelta(cur, prev, pctLimit, absLimit){
  if (cur === null || cur === undefined || prev === null || prev === undefined || !prev) return {txt:'', bad:false, good:false};
  const d = cur - prev, pct = Math.round(100 * d / prev);
  if (!d) return {txt:'beze změny', bad:false, good:false};
  const bad = d > 0 && pct >= pctLimit && Math.abs(d) >= (absLimit || 0), good = d < 0 && -pct >= pctLimit;
  return {txt:(d > 0 ? '+' : '−') + Math.abs(pct) + ' %' + (bad ? ' · horší' : good ? ' · lepší' : ''), bad, good};
}
const vCell = (val, dl) => `${val}${dl && dl.txt ? ` <small class="${dl.bad ? 'ds-bad' : dl.good ? 'ds-good' : ''}">${dl.txt}</small>` : ''}`;
/* Načtení v testu se srovnává jen mezi verzemi měřenými mediánem ze 7 načtení o samotě (m: 'median7').
   Starší verze měřily jednou za souběžného běhu testů; to kolísalo o desítky procent a hlásilo zhoršení, které nebylo. */
function vLoadDelta(v, p, tag){
  if (vLab(v, tag, 'm') !== 'median7' || vLab(p, tag, 'm') !== 'median7') return {txt:'', bad:false, good:false};
  return vDelta(vLab(v, tag, 'load'), vLab(p, tag, 'load'), 20, 30);
}
function vField(ver, k){ return dMed((DASH.rows || []).flatMap(r => ((r.perfv || {})[ver] || {})[k] || [])); }
function renderDashVer(){
  const vers = DASH.vers.slice(), cur = vers.find(v => v.ver === BUILD.ver) || BUILD, i = vers.findIndex(v => v.ver === cur.ver), prev = i > 0 ? vers[i - 1] : null;
  const e = cur.e2e, P = prev || {};
  const kB = n => Math.round((n || 0) / 1024) + ' kB';
  const dSize = vDelta((cur.size || {}).html, (P.size || {}).html, 5, 10240);
  const dLoadD = vLoadDelta(cur, P, 'počítač'), dLoadM = vLoadDelta(cur, P, 'mobil');
  const dRenD = vDelta(vLab(cur, 'počítač', 'render'), vLab(P, 'počítač', 'render'), 20, 3), dRenM = vDelta(vLab(cur, 'mobil', 'render'), vLab(P, 'mobil', 'render'), 20, 3);
  const dCtx = vDelta(vCtxMax(cur), vCtxMax(P), 10, 3500), dEdit = ((cur.edit || {}).mira || 'zdroj') === ((P.edit || {}).mira || 'zdroj') ? vDelta((cur.edit || {}).celkem, (P.edit || {}).celkem, 10, 2000) : {};
  const fLoad = vField(cur.ver, 'load'), fLoadP = prev ? vField(prev.ver, 'load') : null, fRen = vField(cur.ver, 'render'), fRenP = prev ? vField(prev.ver, 'render') : null;
  const dFL = vDelta(fLoad, fLoadP, 20, 50), dFR = vDelta(fRen, fRenP, 20, 3);
  // co je potřeba dodělat
  const todo = [];
  if (!e) todo.push(['Testy', 'Pro tuto verzi neběžely end-to-end testy, nebo se web po nich změnil. Spusťte testy a web sestavte znovu (postup je ve web/README.md).']);
  else (e.failed || []).forEach(f => todo.push(['Neprošel test', f]));
  [['Scénáře', cur.scen, 'nastroje/e2e/scenare.js'], ['Přístupnost', cur.a11y, 'nastroje/e2e/pristupnost.js'], ['Výkon', cur.perf, 'nastroje/e2e/vykon.js']].forEach(([n, r, f]) => {
    if (!r) todo.push([n, 'Pro tuto verzi neběžel test ' + f + ', nebo se web po něm změnil.']);
    else (r.failed || []).forEach(x => todo.push([n + ': neprošlo', x]));
  });
  [[dSize, 'Stránka je větší', kB((P.size || {}).html) + ' → ' + kB((cur.size || {}).html) + '. Větší stránka se déle načítá, hlavně na mobilu.'],
   [dLoadD, 'Pomalejší načtení na počítači (v testu)', dMs(vLab(P, 'počítač', 'load')) + ' → ' + dMs(vLab(cur, 'počítač', 'load'))],
   [dLoadM, 'Pomalejší načtení na mobilu (v testu)', dMs(vLab(P, 'mobil', 'load')) + ' → ' + dMs(vLab(cur, 'mobil', 'load'))],
   [dRenD, 'Pomalejší překreslení na počítači (v testu)', dMs(vLab(P, 'počítač', 'render')) + ' → ' + dMs(vLab(cur, 'počítač', 'render'))],
   [dRenM, 'Pomalejší překreslení na mobilu (v testu)', dMs(vLab(P, 'mobil', 'render')) + ' → ' + dMs(vLab(cur, 'mobil', 'render'))],
   [dFL, 'Pomalejší načtení u skutečných lidí', dMs(fLoadP) + ' → ' + dMs(fLoad)],
   [dFR, 'Pomalejší překreslení u skutečných lidí', dMs(fRenP) + ' → ' + dMs(fRen)],
   [dCtx, 'Dotaz na Spocka je dražší', dNum(vTok(vCtxMax(P))) + ' → ' + dNum(vTok(vCtxMax(cur))) + ' tokenů na dotaz (odhad, největší modul).'],
   [dEdit, 'Další úpravy budou dražší', dNum((P.edit || {}).celkem) + ' → ' + dNum((cur.edit || {}).celkem) + ' tokenů na přečtení zdrojů (odhad).']
  ].forEach(([d, t, x]) => { if (d.bad) todo.push([t + ' (' + d.txt.replace(' · horší', '') + ')', x]); });
  const ctxRows = e && e.ctx ? W.map(w => { const c = e.ctx[w.id], p = P.e2e && P.e2e.ctx ? P.e2e.ctx[w.id] : null; return [esc(w.title), vCell(dNum(vTok(c)), vDelta(c, p, 10, 3500))]; }) : [];
  const ed = cur.edit || {}, pe = P.edit || {};
  const edSame = (ed.mira || 'zdroj') === (pe.mira || 'zdroj'); /* jiná míra (celý zdroj × jedna úprava) se nesrovnává */
  const hist = vers.slice().reverse().map((v, j, arr) => { const p = arr[j + 1] || null, pp = p || {};
    return [`<b>${esc(v.ver)}</b>${v.ver === BUILD.ver ? ' <small>(tato)</small>' : ''}<small class="ds-vt">${esc(v.date || '')} · ${esc(v.title || '')}</small>`,
      v.e2e ? (v.e2e.fail ? `<span class="ds-bad">✕ ${v.e2e.fail} neprošlo</span> z ${v.e2e.total}` : `<span class="ds-good">✓ ${v.e2e.pass}/${v.e2e.total}</span>`) : '<span class="muted">neběžely</span>',
      vCell(kB((v.size || {}).html), vDelta((v.size || {}).html, (pp.size || {}).html, 5, 10240)),
      vCell(dMs(vLab(v, 'mobil', 'load')) + (vLab(v, 'mobil', 'load') !== null && vLab(v, 'mobil', 'm') !== 'median7' ? ' <small class="muted">orientačně</small>' : ''), vLoadDelta(v, pp, 'mobil')),
      vCell(dMs(vLab(v, 'mobil', 'render')), vDelta(vLab(v, 'mobil', 'render'), vLab(pp, 'mobil', 'render'), 20, 3)),
      vCell(vCtxMax(v) === null ? '—' : dNum(vTok(vCtxMax(v))), vDelta(vCtxMax(v), vCtxMax(pp), 10, 3500)),
      vCell(dNum((v.edit || {}).celkem || 0), vDelta((v.edit || {}).celkem, (pp.edit || {}).celkem, 10, 2000)),
      (v.counts || {}).karty !== undefined ? `${v.counts.karty} karet · ${v.counts.kviz} otázek · ${v.counts.ukoly} úkolů` : '—']; });
  app.innerHTML = shell('dash', `<div id="dash">${dTabs()}
    <div class="mh c-indigo"><span class="eyebrow">Dashboard · verze a kvalita</span><h1>Verze ${esc(cur.ver || '?')}${cur.date ? ' z ' + esc(cur.date) : ''}</h1>
      <p>${esc(cur.title || '')}. Porovnání je vždy s předchozí zaznamenanou verzí${prev ? ' (' + esc(prev.ver) + ')' : ', ta zatím není'}. Historie se plní od chvíle, kdy tuhle záložku u nové verze poprvé otevřete. <button class="btn sm" type="button" data-dash="reload">${DASH.loading ? 'Načítám…' : 'Načíst znovu'}</button></p></div>

    <div class="ds-tiles">${dTile('End-to-end testy', e ? (e.fail ? '✕ ' + e.fail + ' neprošlo' : '✓ ' + e.pass + '/' + e.total) : 'neběžely', e ? 'trvaly ' + dDur(Math.round(e.durMs / 1000)) : 'viz úkoly níže')}${dTile('Velikost stránky', kB((cur.size || {}).html), dSize.txt || 'bez videa')}${dTile('Načtení v testu', dMs(vLab(cur, 'mobil', 'load')), 'mobil' + (dLoadM.txt ? ' · ' + dLoadM.txt : ''))}${dTile('Překreslení v testu', dMs(vLab(cur, 'mobil', 'render')), 'mobil' + (dRenM.txt ? ' · ' + dRenM.txt : ''))}${dTile('Tokeny na dotaz Spockovi', vCtxMax(cur) === null ? '—' : dNum(vTok(vCtxMax(cur))), 'odhad, největší modul' + (dCtx.txt ? ' · ' + dCtx.txt : ''))}${dTile('Tokeny na přečtení zdrojů', dNum(ed.celkem || 0), 'odhad' + (dEdit.txt ? ' · ' + dEdit.txt : ''))}</div>

    <div class="sec-h"><h2>Co je potřeba dodělat</h2><p>Neprošlé testy a všechno, co se proti předchozí verzi znatelně zhoršilo.</p></div>
    ${todo.length ? `<div class="ds-fb">${todo.map(t => `<div class="ds-fbi ds-vtodo"><span aria-hidden="true">!</span><span><b>${esc(t[0])}</b><span class="ds-fbt">${esc(t[1])}</span></span></div>`).join('')}</div>` : `<p class="ds-okline"><b>✓ Nic.</b> ${e ? 'Všechny testy prošly a nic se znatelně nezhoršilo.' : ''}</p>`}

    <div class="sec-h"><h2>End-to-end testy</h2><p>Automatický průchod webem na počítači i mobilu. Běží před publikací a na GitHubu při každé změně.</p></div>
    ${e ? dTable(['Kontrol', 'Prošlo', 'Neprošlo', 'Doba běhu', 'Kdy'], [[e.total, e.pass, e.fail, dDur(Math.round(e.durMs / 1000)), dWhen(e.at)]]) + (e.failed && e.failed.length ? dTable(['Co neprošlo'], e.failed.map(f => [esc(f)])) : '') : '<p class="muted">Výsledek testů u této verze chybí.</p>'}

    <div class="sec-h"><h2>Výkon a rychlost</h2><p>„V testu“ je měření v laboratorním prohlížeči při testech, hodí se k porovnání verzí. Načtení je medián ze sedmi načtení; u starších verzí šlo o jedno měření, proto je u nich jen orientační a neporovnává se. „U lidí“ je medián ze skutečných návštěv dané verze.</p></div>
    ${dTable(['Měření', 'Tato verze', 'Předchozí'], [
      ['Velikost stránky', vCell(kB((cur.size || {}).html), dSize), prev ? kB((P.size || {}).html) : '—'],
      ['Z toho kód', kB((cur.size || {}).js), prev ? kB((P.size || {}).js) : '—'], ['Z toho obsah lekcí', kB((cur.size || {}).data), prev ? kB((P.size || {}).data) : '—'],
      ['Načtení v testu, počítač', vCell(dMs(vLab(cur, 'počítač', 'load')), dLoadD), dMs(vLab(P, 'počítač', 'load'))], ['Načtení v testu, mobil', vCell(dMs(vLab(cur, 'mobil', 'load')), dLoadM), dMs(vLab(P, 'mobil', 'load'))],
      ['Překreslení v testu, počítač', vCell(dMs(vLab(cur, 'počítač', 'render')), dRenD), dMs(vLab(P, 'počítač', 'render'))], ['Překreslení v testu, mobil', vCell(dMs(vLab(cur, 'mobil', 'render')), dRenM), dMs(vLab(P, 'mobil', 'render'))],
      ['Načtení u lidí', vCell(dMs(fLoad), dFL), dMs(fLoadP)], ['Překreslení u lidí', vCell(dMs(fRen), dFR), dMs(fRenP)]])}

    <div class="sec-h"><h2>Náročnost na tokeny</h2><p>Všechna čísla jsou <b>odhad</b> z délky textu (asi 3,5 znaku na token).</p></div>
    <div class="ds-grid">
      <div><h3>Jeden dotaz na Spocka podle otevřeného modulu</h3><p class="muted">Tolik tokenů jde s každou zprávou jako kontext. Platí je uživatel ze svého účtu.</p>${dTable(['Modul', 'Tokenů na dotaz'], ctxRows, 'Změří se při testech.')}</div>
      <div><h3>Kolik stojí další úpravy</h3><p class="muted">Tolik tokenů Claude přečte pro jednu změnu: <code>CLAUDE.md</code> a jeden soubor dané oblasti (průměr). Kód webu je rozdělený na moduly, aby se nečetl celý. Celý zdroj je pro srovnání.</p>${dTable(['Co se upravuje', 'Na jednu úpravu', 'Celý zdroj'], [['Lekce', 'lekce'], ['Aplikace (kód webu)', 'aplikace'], ['Vzhled', 'vzhled'], ['Testy a nástroje', 'testy']].map(([l, k]) => [l, vCell(dNum(ed[k] || 0), edSame ? vDelta(ed[k], pe[k], 10, 2000) : {}), dNum((ed.zdroj || {})[k] || ed[k] || 0)]).concat([['<b>Celkem</b>', vCell('<b>' + dNum(ed.celkem || 0) + '</b>', edSame ? dEdit : {}), dNum(Object.values(ed.zdroj || {}).reduce((a, b) => a + b, 0) || ed.celkem || 0)]]))}${edSame ? '' : '<p class="muted">Předchozí verze měřila celý zdroj, ne jednu úpravu, proto se změna neukazuje.</p>'}
        <h3 style="margin-top:12px">Největší soubory</h3>${dTable(['Soubor', 'Tokenů'], (ed.top || []).map(t => [esc(t[0]), dNum(t[1])]))}</div>
    </div>

    <div class="sec-h"><h2>Historie verzí</h2><p>Nejnovější nahoře. Změna je proti verzi o řádek níž.</p></div>
    ${dTable(['Verze', 'Testy', 'Velikost', 'Načtení (mobil, test)', 'Překreslení (mobil, test)', 'Tokeny na dotaz', 'Tokeny na úpravy', 'Obsah'], hist, 'Zatím žádná zaznamenaná verze.')}
  </div>`);
}

