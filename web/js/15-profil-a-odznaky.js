/* ---------- profil a odznaky ---------- */
function renderBadges(){
  const r = rank(), span = r.next ? r.next[0] - r.at : 1, into = r.next ? S.xp - r.at : 1;
  const days = Array.from({length:7}, (_,i) => { const k = dKey(6-i), d = new Date(); d.setDate(d.getDate() - (6-i)); return {k, v:S.days[k] || 0, l:['Ne','Po','Út','St','Čt','Pá','So'][d.getDay()]}; });
  const max = Math.max(1, ...days.map(d => d.v));
  app.innerHTML = shell('badges', `
    <div class="mh c-indigo"><span class="eyebrow">Profil hráče</span><h1>${esc(r.name)} · hodnost ${r.lvl} z ${ranks().length}</h1>
      <div class="rankbar"><span class="bar"><i style="width:${Math.min(100, into/span*100)}%"></i></span><span class="lbl num">${r.next ? `${S.xp} / ${r.next[0]} XP do hodnosti ${r.next[1]}` : `${S.xp} XP · nejvyšší hodnost`}</span></div></div>
    <div class="pstats">
      <div class="pstat">${FLAME}<b class="num">${streak()}</b><span>dní v sérii</span></div>
      <div class="pstat"><b class="num">${S.xp}</b><span>XP celkem</span></div>
      <div class="pstat"><b class="num">${myBadges().filter(b => S.badges['got.' + b[0]]).length}/${myBadges().length}</b><span>odznaků</span></div>
      <div class="pstat" title="Zmrazení zakryje vynechaný den, aby série nepropadla. Získáte ho za povýšení a za sérii 3, 7, 14 a 30 dní."><b class="num">${S.freeze}/${FREEZE_MAX}</b><span>zmrazení série</span></div>
    </div>
    ${questCard()}
    <div class="sec-h"><h2>Postup v hodnostech</h2><p>Každá hodnost přináší nový vzhled Spocka a zmrazení série.</p></div>
    <ol class="ladder">${ranks().map((x, i) => { const st = i + 1 < r.lvl ? 'done' : i + 1 === r.lvl ? 'cur' : 'todo'; return `<li class="${st}"><span class="ld-n">${st === 'done' ? '✓' : i + 1}</span><div><b>${esc(x[1])}</b><span>${x[0]} XP${x[2] ? ' a hotová úroveň 4' : ''}</span></div><span class="ld-r">${i ? 'Vzhled „' + SKINS[i].n + '“ (' + SKINS[i].d + ') a zmrazení série' : 'Začátek cesty'}</span></li>`; }).join('')}</ol>
    <div class="sec-h"><h2>Vzhled Spocka</h2><p>Odemčené vzhledy si můžete přepínat.</p></div>
    <div class="skins">${SKINS.slice(0, ranks().length).map((k, i) => { const own = i < r.lvl, on = curSkin().k === k.k; return `<button type="button" class="skin ${on ? 'on' : ''} ${own ? '' : 'lk'}" ${own ? `data-setskin="${k.k}"` : 'disabled'} aria-pressed="${on}"><span class="sk-art">${spockSVG('fab', k)}</span><b>${k.n}</b><small>${own ? k.d : LOCK + ' ' + esc(ranks()[i][1])}</small></button>`; }).join('')}</div>
    <div class="sec-h"><h2>Vaše postavička</h2><p>${pathDone() ? 'Mise splněna. Postavičku můžete obléknout a znovu si přehrát finále (anglicky s českými titulky).' : 'Letí s vámi od světa ke světu. Šatna a závěrečný příběh se otevřou v cíli cesty.'}</p></div>
    <div class="avbox">${avatarSVG(null, 'big')}<div>${pathDone() ? '<button class="btn primary" type="button" data-wardrobe>Šatna</button> <button class="btn" type="button" data-story>▶ Přehrát finále</button>' : `<span class="muted">${LOCK} Šatna a příběh: po dokončení cesty</span>`}</div></div>
    <div class="sec-h"><h2>Posledních 7 dní</h2><p>XP za každý den.</p></div>
    <div class="week7">${days.map(d => `<div class="d7"><span class="d7b"><i style="height:${d.v/max*100}%" class="${d.v ? 'ok' : ''}"></i></span><span class="d7v num">${d.v}</span><span class="d7l">${d.l}</span></div>`).join('')}</div>
    <div class="sec-h"><h2>Odznaky</h2></div>
    <div class="badges">${myBadges().map(([id,name,how]) => { const got = S.badges['got.' + id]; return `<div class="badge ${got?'on':''}"><span class="bd"><span>${got ? '★' : LOCK}</span></span><b>${esc(name)}</b><span>${esc(how)}</span>${got ? `<small>${esc(got.split('-').reverse().join('. '))}</small>` : ''}</div>`; }).join('')}</div>
    <div class="sec-h"><h2>Jak se získává XP</h2></div>
    <dl class="kv"><dt>Karta správně</dt><dd>+5 XP</dd><dt>Úkol</dt><dd>+${XP.task} XP, s ověřením z VS Code +5 navíc</dd><dt>Minihra u překážky</dt><dd>+15 XP za dohrání</dd><dt>Denní výzva</dt><dd>+${QXP} XP, truhla za všechny tři +${QCHEST} XP</dd><dt>Celá lekce</dt><dd>+${XP.lesson} XP navíc</dd><dt>Kvíz napoprvé</dt><dd>+${XP.quizFirst} XP za otázku, na další pokus +${XP.quizRetry}</dd><dt>Celý modul</dt><dd>+${XP.module} XP</dd><dt>Skokový test</dt><dd>+${XP.jump} XP a odemčený modul</dd></dl>${surveyCard()}`);
}
document.addEventListener('click', e => { const k = e.target.closest('[data-setskin]'); if (k) { S.skin = k.dataset.setskin; save(); applySkin(); renderBadges(); } });

/* zamčený modul */
function renderLocked(w){
  const prev = prevOf(w), jq = QN;
  app.innerHTML = shell(w.id, `
    <div class="locked-card c-${w.c}">
      ${spockSVG('big')}
      <span class="eyebrow">${esc(w.lab)} · zamčeno</span>
      <h1>${LOCK} ${esc(w.title)}</h1>
      <p>Tenhle modul se odemkne, až budete mít <b>${esc(prev.title)}</b> hotový aspoň na 80 % (teď ${Math.round(modPct(prev)*100)} %).</p>
      <p class="muted">Už to umíte? Přeskočte ho skokovým testem: ${jq} otázek z celého modulu, potřeba je aspoň ${Math.ceil(jq * QPASS)} správně.</p>
      <div class="hx-cta" style="justify-content:center"><button class="btn primary" type="button" data-week="${prev.id}">Pokračovat v modulu ${esc(prev.title)}</button><button class="btn" type="button" data-jump="${w.id}">Skokový test</button><button class="btn" type="button" data-peek="${w.id}">Jen si to prohlédnout</button></div>
    </div>`);
}
document.addEventListener('click', e => {
  const j = e.target.closest('[data-jump]'); if (j) return startSession(j.dataset.jump, 'jump');
  const p = e.target.closest('[data-peek]'); if (p) { view.peek = p.dataset.peek; renderWeek(p.dataset.peek); window.scrollTo({top:0}); }
  const s = e.target.closest('[data-quiz]'); if (s) startSession(s.dataset.quiz, 'quiz');
});


/* ---------- Spock: postavička pro banner i pomocníka ---------- */
let SP_N = 0;
function spockSVG(cls, skin){
  const id = 'spg' + (++SP_N); let k = skin; if (!k) { try { k = curSkin(); } catch (e) { k = null; } } k = k || {k:'klasik', g:['#E15079','#A54CB2','#372B91']};
  const vars = [k.limb && '--limb:' + k.limb, k.hand && '--hand:' + k.hand, k.tip && '--tip:' + k.tip, k.eye && '--eye:' + k.eye, k.hand && '--ant:' + k.hand].filter(Boolean).join(';');
  return `<svg class="spock sk-${k.k} ${cls||''}" viewBox="0 0 120 140" aria-hidden="true" focusable="false" ${vars ? `style="${vars}"` : ''}>
    <defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${k.g[0]}"/><stop offset=".55" stop-color="${k.g[1]}"/><stop offset="1" stop-color="${k.g[2]}"/></linearGradient></defs>
    <ellipse class="sp-shadow" cx="60" cy="133" rx="26" ry="5"/>
    <g class="sp-body">
      ${k.b || ''}
      <g class="sp-legs"><line x1="49" y1="96" x2="44" y2="122"/><line x1="71" y1="96" x2="76" y2="122"/></g>
      <g class="sp-arm sp-arm-l"><line x1="28" y1="70" x2="12" y2="56"/><circle cx="11" cy="55" r="5"/></g>
      <g class="sp-arm sp-arm-r"><line x1="92" y1="70" x2="108" y2="54"/><circle cx="109" cy="53" r="5"/></g>
      ${k.noAnt ? '' : '<line class="sp-ant" x1="60" y1="24" x2="60" y2="10"/><circle class="sp-tip" cx="60" cy="8" r="5"/>'}
      <rect x="30" y="34" width="60" height="60" rx="16" transform="rotate(45 60 64)" fill="url(#${id})"/>
      <rect x="35" y="50" width="50" height="28" rx="14" fill="#0C1B2A" ${k.glow ? `stroke="${k.glow}" stroke-width="1.6"` : ''}/>
      <g class="sp-eyes"><ellipse cx="50" cy="61" rx="4.5" ry="5.5"/><ellipse cx="70" cy="61" rx="4.5" ry="5.5"/></g>
      <path class="sp-smile" d="M53 70 Q60 75 67 70"/>
      ${k.f || ''}
    </g>
  </svg>`;
}

/* ---------- home ---------- */
function roleBtns(){
  return `<div class="roles" role="group" aria-label="Vaše role">${Object.keys(ROLES).map(r => `<button type="button" class="rolebtn ${S.role===r?'on':''}" data-role="${r}" aria-pressed="${S.role===r}" title="${esc(ROLE_WHO[r])}">${ROLES[r]}</button>`).join('')}</div>`;
}
function badgeProg(id){
  const st = streak();
  if (id === 'streak3') return [Math.min(st,3), 3];
  if (id === 'streak7') return [Math.min(st,7), 7];
  if (id === 'xp500') return [Math.min(S.xp,500), 500];
  if (id === 'xp1000') return [Math.min(S.xp,1000), 1000];
  if (id === 'deep') { const w = W.find(x => x.id === 'l1b'); const t = weekTotals(w); return [t.done, t.tot]; }
  if (id === 'role') { const w = S.role && W.find(x => x.role === S.role); if (!w) return null; const t = weekTotals(w); return [t.done, t.tot]; }
  return null;
}
function profileCard(compact){
  const r = rank(), span = r.next ? r.next[0] - r.at : 1, into = r.next ? S.xp - r.at : 1;
  const got = myBadges().filter(b => S.badges['got.' + b[0]]), todo = myBadges().filter(b => !S.badges['got.' + b[0]]);
  const nb = todo.map(b => ({b, p:badgeProg(b[0])})).sort((x,y) => (y.p ? y.p[0]/y.p[1] : 0) - (x.p ? x.p[0]/x.p[1] : 0))[0];
  return `<section class="pcard">
    <div class="pc-head">
      <div class="pc-me">${spockSVG('fab')}<div><span class="eyebrow">Profil hráče</span><h3>${esc(r.name)} · hodnost ${r.lvl}</h3>
        <div class="rankbar"><span class="bar"><i style="width:${Math.min(100, into/span*100)}%"></i></span><span class="lbl num">${r.next ? `${S.xp} / ${r.next[0]} XP do hodnosti ${r.next[1]}` : `${S.xp} XP · nejvyšší hodnost`}</span></div></div></div>
      ${compact ? '' : `<div class="pc-stats"><span class="${todayXP() ? 'lit' : ''}">${FLAME}<b class="num">${streak()}</b>série</span><span><b class="num">${S.xp}</b>XP</span><span><b class="num">${todayXP()}</b>XP dnes</span></div>`}
    </div>
    <div class="pc-badges">
      <div class="pc-bh"><h3>Odznaky <span class="hk-n">${got.length}/${myBadges().length}</span></h3><button class="btn sm" type="button" data-go="badges">Celý profil →</button></div>
      <div class="pc-row">${(compact ? got.concat(todo).slice(0, Math.max(6, got.length)).slice(-6) : myBadges()).map(([id,name,how]) => { const g = S.badges['got.' + id]; return `<button type="button" class="pc-b ${g?'on':''}" data-go="badges" title="${esc(name + ': ' + how)}"><span class="bd"><span>${g ? '★' : LOCK}</span></span><small>${esc(name)}</small></button>`; }).join('')}</div>
      ${nb ? `<div class="pc-next"><span class="bd sm"><span>${LOCK}</span></span><div><b>Další odznak: ${esc(nb.b[1])}</b><span>${esc(nb.b[2])}</span>${nb.p ? `<span class="pc-np"><span class="bar"><i style="width:${nb.p[1] ? Math.round(nb.p[0]/nb.p[1]*100) : 0}%"></i></span><span class="num">${nb.p[0]}/${nb.p[1]}</span></span>` : ''}</div></div>` : '<div class="pc-next"><b>Máte všechny odznaky. Jste superuser!</b></div>'}
    </div>
  </section>`;
}
/* ---------- SPOCK: logo a obsah videa ---------- */
const HAND = 'M55.1 20.4 C54.5 20.1 53.9 20.1 53.3 20.4 C52.7 20.6 52.0 21.3 51.5 21.9 C51.0 22.5 51.2 19.9 50.6 24.1 C50.0 28.3 48.6 42.7 47.9 46.9 C47.2 51.1 46.8 48.8 46.3 49.1 C45.8 49.5 45.2 49.3 44.8 49.0 C44.3 48.7 44.6 50.8 43.6 47.5 C42.6 44.2 39.8 32.6 38.8 29.2 C37.8 25.8 37.9 27.6 37.4 27.1 C36.9 26.6 36.6 26.3 36.0 26.2 C35.4 26.1 34.1 26.2 33.5 26.6 C32.9 27.1 32.3 28.0 32.1 28.9 C31.9 29.8 32.0 30.6 32.3 32.1 C32.6 33.6 33.6 36.8 33.8 37.8 C34.0 38.8 33.5 38.1 33.3 38.2 C33.0 38.3 32.7 38.3 32.3 38.2 C31.9 38.1 31.5 37.5 31.1 37.4 C30.7 37.3 30.3 37.3 29.8 37.5 C29.3 37.7 28.6 38.4 28.3 38.8 C28.0 39.2 27.9 39.5 27.8 40.0 C27.7 40.5 27.2 39.2 27.8 41.7 C28.4 44.2 30.3 51.1 31.1 55.1 C31.9 59.1 32.2 63.3 32.6 65.9 C33.0 68.5 33.4 69.3 33.8 70.5 C34.2 71.7 34.4 72.3 35.0 73.2 C35.6 74.1 36.5 75.2 37.4 76.0 C38.3 76.8 39.2 77.5 40.3 78.1 C41.4 78.6 42.0 79.1 44.2 79.3 C46.4 79.5 51.5 79.5 53.7 79.3 C55.9 79.1 56.2 78.7 57.3 78.3 C58.3 77.9 58.9 77.7 60.0 76.8 C61.1 75.9 62.1 75.5 63.7 73.1 C65.4 70.7 68.3 64.9 69.9 62.6 C71.5 60.3 72.3 60.1 73.5 59.2 C74.7 58.3 76.2 57.6 77.1 57.1 C78.0 56.6 78.4 56.8 79.0 56.5 C79.6 56.2 80.5 55.7 80.7 55.1 C81.0 54.5 80.7 53.7 80.5 53.1 C80.3 52.5 80.0 52.1 79.5 51.6 C79.0 51.1 78.1 50.6 77.4 50.3 C76.8 50.0 76.5 50.0 75.6 50.0 C74.7 50.0 73.4 49.6 72.0 50.4 C70.6 51.2 68.0 54.0 67.0 54.8 C66.0 55.6 66.4 55.2 65.8 55.2 C65.2 55.2 64.0 55.3 63.5 55.1 C63.0 54.9 62.8 54.5 62.5 54.0 C62.2 53.5 61.8 53.2 61.6 52.1 C61.4 51.0 61.1 50.9 61.5 47.6 C61.9 44.3 63.6 35.8 64.0 32.4 C64.4 29.0 64.1 28.2 64.1 27.1 C64.0 26.0 64.1 26.4 63.7 26.0 C63.3 25.6 62.4 24.9 61.9 24.7 C61.4 24.5 61.5 24.4 61.0 24.6 C60.5 24.8 59.1 25.5 58.6 25.7 C58.1 25.9 58.0 26.2 57.7 25.6 C57.4 25.0 57.2 22.8 56.8 21.9 C56.4 21.0 55.7 20.6 55.1 20.4Z';
function spockLogo(cls){ return `<svg class="sp-logo ${cls||''}" viewBox="0 0 100 100" aria-hidden="true" focusable="false"><rect width="100" height="100" rx="22" fill="#1068D2"/><path d="${HAND}" fill="#fff"/></svg>`; }
