/* ---------- testování kurzu: jen pro vlastníka, stejně jako dashboard ---------- */
/* Vlastník si může smazat vlastní pokrok a projít kurz od začátku, nebo skočit do kterékoli fáze.
   Týká se jen jeho vlastního pokroku (v prohlížeči i pod účtem), ne ostatních lidí ani dat v dashboardu. */
const ADM = {confirm:false, keepRole:true};
function admDone(w){
  /* modul jako hotový: úkoly, karty správně, kvíz splněný; stejně jako by ho člověk prošel */
  S.qpass = S.qpass || {}; S.unlocked = S.unlocked || {};
  w.days.forEach((d, di) => { d.todo.forEach((_, ti) => { S.todo[w.id + '.' + di + '.' + ti] = true; }); (d.cards || []).forEach((c, ci) => { S.cards[w.id + '.' + di + '.' + ci] = c.a; }); });
  if (!S.qpass[w.id]) S.qpass[w.id] = {at:Date.now(), right:5, total:5, admin:true};
  S.unlocked[w.id] = true;
}
function admReset(){
  const role = ADM.keepRole ? S.role : null, sound = S.sound;
  Object.keys(S).forEach(k => delete S[k]);
  Object.assign(S, {todo:{}, quiz:{}, ready:{}, role, cards:{}, resetAt:Date.now()});
  /* stejné výchozí hodnoty jako při prvním načtení (10-app.js) */
  S.xp = 0; S.goal = 50; S.freeze = 0;
  ['days','got','badges','unlocked','tries','proof','ptries','cards','frozen'].forEach(k => { S[k] = {}; });
  if (sound === false) S.sound = false;
  save(); try { if (PROG.ref) pPush(); } catch (e) {}
  try { trk('testování', 'reset kurzu'); } catch (e) {}
  ADM.confirm = false; view = {name:'home'}; render(); window.scrollTo({top:0});
  toast(role ? 'Kurz je od začátku. Role zůstala: ' + ROLES[role] + '.' : 'Kurz je od začátku, včetně výběru role.');
}
function admJump(id, lesson){
  const w = W.find(x => x.id === id); if (!w) return;
  if (w.role && w.role !== S.role) S.role = w.role;   /* modul role: přepne i roli, aby cesta seděla */
  const path = pathIds(), at = path.indexOf(id);
  if (at > 0) path.slice(0, at).forEach(pid => { const m = W.find(x => x.id === pid); if (m) admDone(m); });
  S.unlocked = S.unlocked || {}; S.unlocked[id] = true;
  save(); try { trk('testování', 'skok na ' + id + (lesson ? '/' + lesson : '')); } catch (e) {}
  view.lesson = lesson || 0; view.lessonOf = id; go('week', {week:id, peek:id});
  toast('Jste v modulu ' + w.title + (at > 0 ? '. Předchozí úrovně cesty jsou označené jako hotové.' : '.'));
}
function renderAdmin(){
  if (!TRK.owner) { view = {name:'home'}; return render(); }
  const path = pathIds(), mods = W.filter(w => path.includes(w.id) || w.role || w.id === 'l1b');
  const row = w => { const on = path.includes(w.id), p = Math.round(modPct(w) * 100);
    return `<div class="adm-m c-${w.c}"><div class="adm-mh"><b>${esc(w.role ? 'Úroveň 2 · ' + w.title : w.lab + ' · ' + w.title)}</b><span class="muted">${on ? p + ' % · ' : 'mimo vaši cestu · '}${w.days.length} lekcí${isLocked(w) ? ' · zamčeno' : ''}</span></div>
      <div class="adm-ls">${w.days.map((d, di) => `<button type="button" class="btn sm" data-adm="jump:${w.id}:${di}" title="${esc(plain(d.t))}">${esc(d.d)}</button>`).join('')}<button type="button" class="btn sm primary" data-adm="jump:${w.id}:0">Začít tady →</button></div></div>`; };
  app.innerHTML = shell('admin', `<div id="adm">
    <div class="mh c-indigo"><span class="eyebrow">Testování kurzu · jen pro vlastníka</span><h1>Projděte kurz jako nový uživatel</h1>
      <p>Mění se jen <b>váš</b> pokrok, v tomto prohlížeči i pod vaším účtem. Data ostatních lidí a dashboard zůstávají beze změny.</p></div>
    <section class="adm-box"><h2>Reset kurzu</h2><p>Smaže úkoly, karty, kvízy, XP, odznaky, sérii i postavičku a vrátí vás na začátek. Reset platí i na dalších zařízeních: starší pokrok se do něj už nepřimíchá.</p>
      <label class="ds-chk"><input type="checkbox" data-adm="keep" ${ADM.keepRole ? 'checked' : ''}> Ponechat roli${S.role ? ' (' + esc(ROLES[S.role]) + ')' : ''}</label>
      <p>${ADM.confirm ? `<button type="button" class="btn danger" data-adm="reset">Ano, smazat můj pokrok</button> <button type="button" class="btn" data-adm="cancel">Zrušit</button>` : '<button type="button" class="btn" data-adm="ask">Resetovat kurz…</button>'}</p></section>
    <section class="adm-box"><h2>Přepnout do fáze</h2><p>Klikněte na lekci a jste rovnou v ní. Předchozí úrovně vaší cesty se označí jako hotové, aby se aplikace chovala jako u člověka, který sem došel. Modul jiné role přepne i roli.</p>
      <div class="adm-list">${mods.map(row).join('')}</div>
      <p class="muted">Vstupní test, expres a finále: <button class="linkbtn" type="button" data-place>Vstupní test</button> · <button class="linkbtn" type="button" data-adm="express">Expresní cesta</button> · <button class="linkbtn" type="button" data-adm="finale">Hotová cesta a finále</button></p></section>
  </div>`);
}
document.addEventListener('click', e => {
  const b = e.target.closest('[data-adm]'); if (!b || !TRK.owner) return;
  const [a, id, li] = b.dataset.adm.split(':');
  if (a === 'ask') { ADM.confirm = true; renderAdmin(); const r = document.querySelector('[data-adm=reset]'); if (r) r.focus(); }
  else if (a === 'cancel') { ADM.confirm = false; renderAdmin(); }
  else if (a === 'reset') admReset();
  else if (a === 'jump') admJump(id, +li || 0);
  else if (a === 'express') { if (!S.role) S.role = 'pm'; S.express = true; save(); go('home'); }
  else if (a === 'finale') { if (!S.role) S.role = 'pm'; pathIds().forEach(pid => { const m = W.find(x => x.id === pid); if (m) admDone(m); }); save(); try { trk('testování', 'hotová cesta'); } catch (err) {} go('home'); toast('Cesta je hotová. Finále spustíte u Setkání se Spockem.'); }
});
document.addEventListener('change', e => { if (e.target.matches('[data-adm=keep]')) ADM.keepRole = e.target.checked; });
