/* ---------- zpětná vazba ---------- */
const FB_KINDS = [['chyba','Chyba v obsahu'],['nejasne','Něčemu nerozumím'],['navrh','Návrh na zlepšení'],['technika','Něco nefunguje'],['dotaznik','Dotazník k onboardingu']];
/* uloží zpětnou vazbu do databáze (feedback/<id>); offline ji dá do fronty. Vrací 'sent', 'queued', nebo 'fail'. */
async function fbStore(item){
  if (TRK.ok) {
    try {
      const ref = TRK.db.doc('feedback/' + TRK.uid), s = await ref.get();
      const items = s.exists && Array.isArray(s.data().items) ? JSON.parse(JSON.stringify(s.data().items)) : [];
      const i = items.findIndex(x => x.id === item.id); if (i >= 0) items[i] = item; else items.push(item);
      await ref.set({items, last:tNow()}); return 'sent';
    } catch (err) {}
  }
  if (!navigator.onLine || (TRK.uid && !TRK.ok) || NET.lost) { fbOutboxAdd(item); return 'queued'; }
  return 'fail';
}
function fbOpen(){
  if (document.getElementById('fb')) return;
  const where = tLocLabel(tLoc()), card = (document.querySelector('.lpanel .lcard.cur h3') || {}).textContent || '';
  const ov = document.createElement('div'); ov.id = 'fb'; ov.className = 'fb'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-label', 'Zpětná vazba');
  ov.innerHTML = `<form class="fb-in" id="fb-form"><button type="button" class="g-x fb-x" aria-label="Zavřít">×</button>
    <h2>Zpětná vazba k tutoriálu</h2>
    <p class="muted">Jde přímo vlastníkovi tutoriálu jako úkol k vyřízení, i s vaším jménem a místem, kde právě jste. Nepište sem klientská ani osobní data.</p>
    <p class="fb-where"><b>Kde:</b> <span id="fb-where"></span></p>
    <label for="fb-kind">Čeho se týká</label><select id="fb-kind">${FB_KINDS.map(k => `<option value="${k[0]}">${k[1]}</option>`).join('')}</select>
    <label for="fb-text">Co je špatně nebo co vás zarazilo</label><textarea id="fb-text" rows="3" required maxlength="1500" placeholder="Např. odpověď u této karty neodpovídá tomu, co vidím ve SPOCKu."></textarea>
    <label for="fb-fix">Co navrhujete upravit <span class="muted">(nepovinné)</span></label><textarea id="fb-fix" rows="2" maxlength="1500" placeholder="Např. doplnit krok s volbou modelu."></textarea>
    <div class="fb-foot"><span class="muted" id="fb-msg"></span><button class="btn primary" type="submit">Odeslat</button></div></form>`;
  document.body.append(ov);
  ov.querySelector('#fb-where').textContent = where + (card ? ' › karta „' + card + '“' : '');
  const close = () => ov.remove();
  ov.querySelector('.fb-x').onclick = close;
  ov.addEventListener('click', e => { if (e.target === ov) close(); });
  ov.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  ov.querySelector('#fb-form').addEventListener('submit', async e => {
    e.preventDefault();
    const item = {id:'f' + tNow().toString(36) + Math.random().toString(36).slice(2, 6), at:tNow(), loc:tLoc(), where:ov.querySelector('#fb-where').textContent, kind:ov.querySelector('#fb-kind').value, text:ov.querySelector('#fb-text').value.trim(), fix:ov.querySelector('#fb-fix').value.trim(), role:S.role || null, ver:BUILD.ver || ''};
    if (!item.text) return;
    const msg = ov.querySelector('#fb-msg'); msg.textContent = 'Odesílám…';
    const res = await fbStore(item);
    if (res === 'sent') { trk('zpětná vazba', item.kind); award('feedback.' + item.id, 10, 'zpětná vazba'); close(); toast('Díky. Zpětná vazba je u vlastníka tutoriálu.'); }
    else if (res === 'queued') { trk('zpětná vazba', item.kind + ' (ve frontě)'); close(); toast('Jste offline. Zpětnou vazbu odešlu sám, jakmile budete zase připojeni.'); }
    else {
      const txt = `Zpětná vazba k SPOCK tutoriálu\nKde: ${item.where}\nTyp: ${(FB_KINDS.find(k => k[0] === item.kind) || [])[1]}\nCo: ${item.text}\nNávrh: ${item.fix || '—'}`;
      try { await navigator.clipboard.writeText(txt); msg.textContent = 'Odeslat se nepodařilo. Text je ve schránce, pošlete ho prosím vlastníkovi tutoriálu.'; }
      catch (err) { msg.textContent = 'Odeslat se nepodařilo. Zkopírujte prosím text a pošlete ho vlastníkovi tutoriálu.'; }
    }
  });
  ov.querySelector('#fb-text').focus();
}
document.addEventListener('click', e => { if (e.target.closest('[data-fbopen]')) { e.preventDefault(); fbOpen(); } });

