/* ---------- tým: společné učení a přehled o postupu kolegů ----------
   Kdo tým založí, dostane kód a pošle ho kolegům (třeba v Teams). Kdo se kódem připojí, souhlasí, že členové týmu
   uvidí jeho souhrn: roli, hodnost, XP, postup, kde je a kdy byl naposledy aktivní. Nic dalšího (odpovědi, kliknutí) se nesdílí.
   Databáze: tymy/<zakladatel> {name, code, removed[]} a clenove/<člověk> {team, souhrn}. Zakladatel může člena odebrat
   (zapíše ho do removed) nebo tým zrušit; každý může tým kdykoli opustit. Jména se neukládají, zobrazují se z profilu. */
const TEAM = {ready:false, my:null, team:null, members:[], names:{}, err:'', busy:false, kicked:false, draft:{}};
const tmCode = () => { const A = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; const r = crypto.getRandomValues(new Uint8Array(6)); return Array.from(r, x => A[x % A.length]).join(''); };
function tmSummary(){ const r = rank(), n = nextOnPath(); return {role:S.role || null, xp:S.xp || 0, rank:r.name, lvl:r.lvl, pct:overall(), mod:n ? n.id : null, streak:streak(), last:Date.now(), express:!!S.express, done:pathDone()}; }
async function tmLoad(){
  if (!TRK.db || !TRK.uid) return; TEAM.fresh = Date.now();
  try {
    const s = await TRK.db.doc('clenove/' + TRK.uid).get(); TEAM.my = s.exists ? JSON.parse(JSON.stringify(s.data())) : null; TEAM.team = null; TEAM.members = []; TEAM.kicked = false;
    if (TEAM.my && TEAM.my.team) {
      const t = await TRK.db.doc('tymy/' + TEAM.my.team).get();
      const tm = t.exists ? Object.assign({id:TEAM.my.team}, t.data()) : null;
      if (!tm || (tm.removed || []).includes(TRK.uid)) { TEAM.kicked = tm ? 'odebrán' : 'zrušen'; TEAM.my.team = null; await TRK.db.doc('clenove/' + TRK.uid).set(TEAM.my); }
      else { TEAM.team = tm; await tmMembers(); }
    }
    TEAM.err = '';
  } catch (e) { TEAM.err = navigator.onLine ? 'Tým se nepodařilo načíst. Zkuste to za chvíli.' : 'Jste offline. Tým se načte po připojení.'; }
  TEAM.ready = true; if (view.name === 'tym' || view.name === 'home') render();
}
async function tmMembers(){
  const q = await TRK.db.collection('clenove').where('team', '==', TEAM.team.id).get(), rm = TEAM.team.removed || [];
  TEAM.members = q.docs.map(d => Object.assign({id:d.id}, d.data())).filter(m => !rm.includes(m.id));
  try { const ps = await TRK.user.profiles(TEAM.members.map(m => m.id)); TEAM.names = {}; Object.keys(ps || {}).forEach(k => { TEAM.names[k] = (ps[k] && ps[k].name) || ''; }); } catch (e) {}
}
async function tmPush(){
  if (!TEAM.my || !TEAM.my.team || !TRK.db || !TRK.uid) return;
  try { TEAM.my = Object.assign(TEAM.my, tmSummary()); await TRK.db.doc('clenove/' + TRK.uid).set(JSON.parse(JSON.stringify(TEAM.my))); } catch (e) {}
}
async function tmAct(a, arg){
  if (TEAM.busy || !TRK.db || !TRK.uid) return; TEAM.busy = true; TEAM.err = '';
  const fail = m => { const x = new Error(m); x.v = true; throw x; };
  try {
    if (a === 'create') {
      const name = String(arg || '').trim().slice(0, 60); if (!name) fail('Napište název týmu.');
      const team = {name, code:tmCode(), removed:[], at:Date.now()};
      await TRK.db.doc('tymy/' + TRK.uid).set(team);
      TEAM.my = Object.assign({}, tmSummary(), {team:TRK.uid}); await TRK.db.doc('clenove/' + TRK.uid).set(TEAM.my);
      try { trk('tým', 'založen'); } catch (e) {}
    } else if (a === 'join') {
      const code = String(arg || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
      if (code.length !== 6) fail('Kód týmu má 6 znaků.');
      const q = await TRK.db.collection('tymy').where('code', '==', code).limit(1).get();
      if (!q.docs.length) fail('Tým s tímhle kódem neexistuje. Zkontrolujte ho u kolegy, který tým založil.');
      const d = q.docs[0];
      if ((d.data().removed || []).includes(TRK.uid)) fail('Z tohoto týmu vás zakladatel odebral.');
      TEAM.my = Object.assign({}, tmSummary(), {team:d.id}); await TRK.db.doc('clenove/' + TRK.uid).set(TEAM.my);
      try { trk('tým', 'připojen'); } catch (e) {}
    } else if (a === 'leave' || a === 'dissolve') {
      if (a === 'dissolve' && TEAM.team && TEAM.team.id === TRK.uid) await TRK.db.doc('tymy/' + TRK.uid).delete();
      TEAM.my = Object.assign({}, TEAM.my || {}, {team:null}); await TRK.db.doc('clenove/' + TRK.uid).set(TEAM.my);
      try { trk('tým', a === 'leave' ? 'opuštěn' : 'zrušen'); } catch (e) {}
    } else if (a === 'remove' && TEAM.team && TEAM.team.id === TRK.uid && arg && arg !== TRK.uid) {
      const removed = Array.from(new Set((TEAM.team.removed || []).concat([arg])));
      await TRK.db.doc('tymy/' + TRK.uid).update({removed});
    }
  } catch (e) {
    TEAM.busy = false;
    if (e && e.v) { TEAM.err = e.message; renderTeam(); return; }
    TEAM.err = navigator.onLine ? 'Nepodařilo se to uložit. Zkuste to znovu.' : 'Jste offline. Tým jde upravit po připojení.';
  }
  TEAM.busy = false;
  const err = TEAM.err; await tmLoad(); if (err) { TEAM.err = err; if (view.name === 'tym') renderTeam(); }
}
const tmAgo = t => { if (!t) return '—'; const d = Math.floor((Date.now() - t) / 864e5); return d <= 0 ? 'dnes' : d === 1 ? 'včera' : 'před ' + d + ' dny'; };
function renderTeam(){
  const lead = TEAM.team && TEAM.team.id === TRK.uid, W2 = id => { const w = W.find(x => x.id === id); return w ? (w.role ? w.title : w.lab + ' · ' + w.title) : 'Hotovo'; };
  let body;
  if (!TRK.ok || !TEAM.ready) body = `<p class="tm-note">${TRK.ok ? 'Načítám tým…' : 'Tým funguje, když jste přihlášení a online. Pokrok se mezitím ukládá v zařízení.'}</p>`;
  else if (!TEAM.team) body = `${TEAM.kicked ? `<p class="tm-note">Tým, ve kterém jste byli, ${TEAM.kicked === 'zrušen' ? 'jeho zakladatel zrušil' : 'vás odebral'}. Můžete založit nový nebo se připojit k jinému.</p>` : ''}
    <div class="tm-two">
      <form class="tm-box" data-tmform="create"><h2>Založit tým</h2><p class="muted">Dostanete kód, který pošlete kolegům.</p><label for="tm-name">Název týmu</label><input id="tm-name" maxlength="60" placeholder="Např. Tribe Platby" autocomplete="off" value="${esc(TEAM.draft.name || '')}"><button class="btn primary" type="submit">Založit tým</button></form>
      <form class="tm-box" data-tmform="join"><h2>Připojit se kódem</h2><p class="muted">Kód vám pošle kolega, který tým založil.</p><label for="tm-code">Kód týmu</label><input id="tm-code" maxlength="8" placeholder="Např. K7M2QX" autocomplete="off" autocapitalize="characters" value="${esc(TEAM.draft.code || '')}"><label class="tm-ok"><input type="checkbox" id="tm-agree"> Souhlasím, že členové týmu uvidí můj souhrn: roli, hodnost, XP, postup cestou a kdy jsem byl(a) naposledy aktivní.</label><button class="btn primary" type="submit">Připojit se</button></form>
    </div>`;
  else { const m = TEAM.members.slice().sort((a, b) => (b.pct || 0) - (a.pct || 0) || (b.xp || 0) - (a.xp || 0)), now = Date.now();
    const avg = m.length ? Math.round(m.reduce((n, x) => n + (x.pct || 0), 0) / m.length) : 0, done = m.filter(x => x.done).length, act = m.filter(x => now - (x.last || 0) < 7 * 864e5).length, stuck = m.filter(x => !x.done && now - (x.last || 0) > 3 * 864e5);
    body = `<div class="tm-head"><div><span class="eyebrow">${lead ? 'Zakládali jste' : 'Jste členem'}</span><h2>${esc(TEAM.team.name)}</h2></div>${lead ? `<div class="tm-code"><span>Kód pro kolegy</span><b id="tm-code-v">${esc(TEAM.team.code)}</b><button class="btn sm" type="button" data-tm="copy">Zkopírovat</button></div>` : ''}</div>
    ${lead ? '<p class="muted">Pošlete kód kolegům, třeba v Teams. V aplikaci ho zadají na stránce Tým.</p>' : ''}
    <div class="tm-kpi"><div><b>${m.length}</b><span>${m.length === 1 ? 'člověk' : m.length < 5 ? 'lidé' : 'lidí'} v týmu</span></div><div><b>${avg} %</b><span>průměrný postup</span></div><div><b>${done}</b><span>dokončilo cestu</span></div><div><b>${act}</b><span>aktivních za 7 dní</span></div></div>
    ${stuck.length ? `<p class="tm-stuck"><b>Bez aktivity přes 3 dny:</b> ${stuck.map(x => esc(x.id === TRK.uid ? 'vy' : TEAM.names[x.id] || 'kolega')).join(', ')}. Možná se zasekli, zkuste se jich zeptat.</p>` : ''}
    <div class="tw" tabindex="0" role="region" aria-label="Postup členů týmu"><table class="tm-t"><thead><tr><th>Člověk</th><th>Role</th><th>Hodnost</th><th>Postup</th><th>Právě</th><th>Série</th><th>Naposledy</th>${lead ? '<th></th>' : ''}</tr></thead><tbody>
    ${m.map(x => `<tr class="${x.id === TRK.uid ? 'me' : ''}"><td><b>${esc(x.id === TRK.uid ? 'Vy' : TEAM.names[x.id] || 'Kolega')}</b>${x.id === TEAM.team.id ? ' <small class="muted">zakladatel</small>' : ''}</td><td>${esc(x.role ? ROLE_SHORT[x.role] || x.role : '—')}</td><td>${esc(x.rank || '—')} <small class="muted">${x.xp || 0} XP</small></td><td><span class="tm-bar"><span class="bar"><i style="width:${x.pct || 0}%"></i></span><span class="num">${x.pct || 0} %</span></span></td><td>${x.done ? '✓ Hotovo' : esc(W2(x.mod))}${x.express ? ' <small class="muted">expres</small>' : ''}</td><td>${x.streak ? '🔥 ' + x.streak : '—'}</td><td>${tmAgo(x.last)}</td>${lead ? `<td>${x.id !== TRK.uid ? `<button class="linkbtn" type="button" data-tm="remove:${esc(x.id)}">Odebrat</button>` : ''}</td>` : ''}</tr>`).join('')}
    </tbody></table></div>
    <div class="tm-foot"><button class="btn" type="button" data-tm="reload">Obnovit</button>${lead ? '<button class="btn" type="button" data-tm="dissolve">Zrušit tým</button>' : '<button class="btn" type="button" data-tm="leave">Opustit tým</button>'}</div>
    <p class="muted tm-priv">Členové vidí jen tenhle souhrn. Odpovědi, kliknutí ani zpětná vazba se nesdílejí.</p>`; }
  app.innerHTML = shell('tym', `<div class="mh c-indigo"><span class="eyebrow">Učte se společně</span><h1>Tým</h1><p class="goal">Vidíte, kde jsou kolegové, kdo je napřed a kdo se možná zasekl.</p></div>${TEAM.err ? `<p class="tm-err" role="alert">${esc(TEAM.err)}</p>` : ''}${body}`);
}
document.addEventListener('submit', e => {
  const f = e.target.closest('[data-tmform]'); if (!f) return; e.preventDefault();
  /* rozepsané hodnoty přežijí překreslení po chybě */
  TEAM.draft = {name:(f.querySelector('#tm-name') || {}).value || TEAM.draft.name || '', code:(f.querySelector('#tm-code') || {}).value || TEAM.draft.code || ''};
  if (f.dataset.tmform === 'create') tmAct('create', f.querySelector('#tm-name').value);
  else { if (!f.querySelector('#tm-agree').checked) { TEAM.err = 'Pro připojení potvrďte souhlas se sdílením souhrnu.'; renderTeam(); return; } tmAct('join', f.querySelector('#tm-code').value); }
});
document.addEventListener('click', e => {
  /* po otevření stránky Tým se přehled načte znovu, ať je postup kolegů aktuální */
  if (e.target.closest('[data-go=tym]') && TRK.ok && !TEAM.busy) setTimeout(tmLoad, 0);
  const b = e.target.closest('[data-tm]'); if (!b) return; const [a, arg] = b.dataset.tm.split(':');
  if (a === 'copy') { try { navigator.clipboard.writeText(TEAM.team.code); toast('Kód týmu je ve schránce.'); } catch (err) {} return; }
  if (a === 'reload') { tmLoad(); return; }
  if ((a === 'leave' || a === 'dissolve' || a === 'remove') && !confirm(a === 'leave' ? 'Opustit tým?' : a === 'dissolve' ? 'Zrušit tým? Členové ho přestanou vidět.' : 'Odebrat člověka z týmu?')) return;
  tmAct(a, arg);
});

