/* ---------- pokrok pod účtem: soukromá část databáze data/users/<člověk>/progress ----------
   Vidí ji jen ten člověk. Při otevření se sloučí s pokrokem v prohlížeči (nic se neztratí, ani při dvou
   zařízeních), každá změna se do 2 s uloží. Bez přihlášení nebo bez připojení se pokračuje jen z prohlížeče.
   Přechod na vlastní server: stačí nahradit pLoad a pPush. */
const PROG = {ref:null, ready:false, h:null, busy:false};
function pMerge(a, b){
  /* reset kurzu: stav starší než reset na druhé straně se nepřimíchá */
  if ((a.resetAt || 0) > (b._at || 0)) return Object.assign({}, a);
  if ((b.resetAt || 0) > (a._at || 0)) return Object.assign({}, b);
  const o = Object.assign({}, b, a), newer = (b._at || 0) > (a._at || 0) ? b : a;
  ['role','goal','skin','av','sound','pos','survey','dq','seenVideo','flown','express'].forEach(k => { if (newer[k] !== undefined) o[k] = newer[k]; });
  ['todo','cards','proof','got','badges','unlocked','qpass','ready','quiz','frozen','vids','exSeen','rev','runev','selfok'].forEach(k => { o[k] = Object.assign({}, b[k] || {}, a[k] || {}); });
  o.days = Object.assign({}, b.days || {}); Object.entries(a.days || {}).forEach(([d, v]) => { o.days[d] = Math.max(v, o.days[d] || 0); });
  ['ptries','tries'].forEach(k => { o[k] = Object.assign({}, b[k] || {}); Object.entries(a[k] || {}).forEach(([x, v]) => { o[k][x] = Math.max(v, o[k][x] || 0); }); });
  ['xp','freeze','rankLvl'].forEach(k => { o[k] = Math.max(a[k] || 0, b[k] || 0); });
  /* první hodnota: ověřená z běhu má přednost před odškrtnutou bez důkazu, jinak platí dřívější */
  const fvs = [a.fv, b.fv].filter(Boolean).sort((x, y) => (x.lvl === 'run' ? 0 : 1) - (y.lvl === 'run' ? 0 : 1) || (x.at || 0) - (y.at || 0));
  if (fvs.length) o.fv = fvs[0];
  o._at = Math.max(a._at || 0, b._at || 0);
  return o;
}
async function pLoad(db, uid){
  try {
    PROG.ref = db.doc('data/users/' + uid + '/progress');
    const snap = await PROG.ref.get(), remote = snap.exists ? snap.data() : null;
    PROG.ready = true;
    if (remote && remote.state && typeof remote.state === 'object') {
      const before = JSON.stringify(S), merged = pMerge(S, JSON.parse(JSON.stringify(remote.state)));
      if (JSON.stringify(merged) !== before) { Object.keys(S).forEach(k => delete S[k]); Object.assign(S, merged); try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} try { applySkin(); } catch (e) {} render(); }
      if ((remote.at || 0) < (S._at || 0) || JSON.stringify(remote.state) !== JSON.stringify(S)) pPush();
    } else if (Object.keys(S.todo || {}).length || S.role) pPush();
  } catch (e) { PROG.ref = null; PROG.ready = false; }
}
function pSync(){ if (!PROG.ready || !PROG.ref) return; clearTimeout(PROG.h); PROG.h = setTimeout(pPush, 2000); }
async function pPush(){
  if (!PROG.ref || PROG.busy) return; PROG.busy = true; clearTimeout(PROG.h);
  try { await PROG.ref.set({v:1, at:Date.now(), state:JSON.parse(JSON.stringify(S))}); }
  catch (e) { if (e && (e.code === 'revoked' || e.code === 'invalid_argument' || e.code === 'not_granted')) PROG.ref = null; else PROG.h = setTimeout(pPush, 15000); }
  PROG.busy = false;
  try { tmPush(); } catch (e) {}
}
document.addEventListener('visibilitychange', () => { if (document.hidden && PROG.h) pPush(); });

/* ---------- offline režim ----------
   Hra, lekce, kvízy, minihry, výzvy i pokrok běží v zařízení (localStorage), takže bez sítě jde pokračovat.
   Co síť potřebuje: synchronizace pokroku pod účtem, měření, zpětná vazba, chat se Spockem a videa.
   Bez sítě: v hlavičce je štítek Offline, zpětná vazba čeká ve frontě v zařízení, chat to vysvětlí místo chyby.
   Po připojení: znovu připojení k účtu (když se při startu nepovedlo), odeslání pokroku, měření a fronty. */
const NET = {lost:false};
const FB_OUT = 'spock-fb-outbox';
function fbOutbox(){ try { const a = JSON.parse(localStorage.getItem(FB_OUT) || '[]'); return Array.isArray(a) ? a : []; } catch (e) { return []; } }
function fbOutboxAdd(item){ const a = fbOutbox(); a.push(item); try { localStorage.setItem(FB_OUT, JSON.stringify(a.slice(-20))); } catch (e) {} netPill(); }
async function fbOutboxSend(){
  const a = fbOutbox(); if (!a.length || !TRK.ok || !navigator.onLine || NET.sending) return;
  NET.sending = true;
  try {
    const ref = TRK.db.doc('feedback/' + TRK.uid), s = await ref.get();
    const items = s.exists && Array.isArray(s.data().items) ? JSON.parse(JSON.stringify(s.data().items)) : [];
    const have = new Set(items.map(x => x.id)); a.forEach(it => { if (!have.has(it.id)) items.push(it); });
    await ref.set({items, last:tNow()});
    try { localStorage.removeItem(FB_OUT); } catch (e) {}
    a.forEach(it => { try { award('feedback.' + it.id, 10, 'zpětná vazba'); } catch (e) {} });
    toast(a.length === 1 ? 'Zpětná vazba z doby offline je odeslaná.' : 'Zpětné vazby z doby offline (' + a.length + ') jsou odeslané.');
  } catch (e) {}
  NET.sending = false; netPill();
}
function netPill(){
  const off = !navigator.onLine, q = fbOutbox().length;
  let el = document.getElementById('pill-net');
  if (!el) { const pp = document.querySelector('.hg-act'); if (!pp) return; pp.insertAdjacentHTML('afterbegin', '<span class="pill net-pill" id="pill-net" role="status" hidden></span>'); el = document.getElementById('pill-net'); }
  el.hidden = !off;
  el.innerHTML = '<span class="net-dot" aria-hidden="true"></span><span class="net-t">Offline</span>' + (q ? '<span class="net-q">· ' + q + '</span>' : '');
  el.title = 'Jste offline. Lekce, kvízy a hra fungují dál a pokrok se ukládá v zařízení. Synchronizace pod účtem' + (q ? ', ' + q + ' zpětná vazba ve frontě' : '') + ' a chat se Spockem počkají na připojení.';
  el.setAttribute('aria-label', el.title);
}
async function netBack(){
  NET.lost = false; netPill();
  try { trk('připojení', 'zpět online'); } catch (e) {}
  await tInit();
  try { if (TRK.ok) { TRK.dirty = true; await tFlush(); } } catch (e) {}
  try { if (PROG.ref) await pPush(); } catch (e) {}
  try { await fbOutboxSend(); } catch (e) {}
  toast(PROG.ref ? 'Jste zpět online. Pokrok je uložený pod vaším účtem.' : 'Jste zpět online.');
}
window.addEventListener('offline', () => { NET.lost = true; netPill(); try { trk('připojení', 'offline'); } catch (e) {} toast('Jste offline. Můžete pokračovat, pokrok se ukládá v zařízení.'); });
window.addEventListener('online', () => { netBack(); });
setTimeout(netPill, 0);

