// Doplňkové scénáře webu SPOCK Tutorialu: výpadky služeb, dvě zařízení, klávesnice, tablet a široký monitor,
// tmavý režim a videa. Každý scénář běží ve vlastním prohlížeči; když spadne, ostatní pokračují.
// Spuštění (po sestavení webu): node nastroje/e2e/scenare.js
const fs=require('fs');const path=require('path');const {buildE2E,settle,browserType,failShot}=require('./fixture');
const {DIST}=buildE2E();const F='file://'+path.join(DIST,'e2e.html');
const R=[];const SHOTS=[];let CUR=null;
const ok=(n,c,d='')=>{R.push([c?'PASS':'FAIL',n,d]);if(!c)SHOTS.push(failShot(DIST,CUR,'scenare-'+n));};
const scenario=async(name,fn)=>{try{await fn();}catch(e){R.push(['FAIL',name+': scénář spadl',String(e&&e.message||e).split('\n')[0].slice(0,200)]);SHOTS.push(failShot(DIST,CUR,name+'-spadl'));}};
/* úprava testovacího prostředí: obalí window.claude, než ho stránka použije */
const wrapClaude=(ctx,mode)=>ctx.addInitScript(m=>{let real;Object.defineProperty(window,'claude',{configurable:true,get(){return real},set(v){
  const use=v.use;real={use:async n=>{const x=await use(n);
    if(m==='chat-chyba'&&n==='sample'){const f=async()=>{await new Promise(r=>setTimeout(r,30));const e=new Error('výpadek');e.code='unavailable';throw e;};f.limits=x.limits;return f;}
    if(m==='db-vypadek'&&n==='db'){const bad=async()=>{const e=new Error('nedostupné');e.code='unavailable';throw e;};return {doc:()=>({get:bad,set:bad,onSnapshot:()=>()=>{}}),collection:()=>{const q={where:()=>q,limit:()=>q,orderBy:()=>q,get:bad};return q;}};}
    if(m==='bez-zapisu'&&n==='db'){const deny=async()=>{const e=new Error('bez práva');e.code='not_granted';throw e;};return {doc:p=>{const d=x.doc(p);return {get:d.get,set:deny};},collection:x.collection};}
    return x;}};}});},mode);
const loadState=p=>p.evaluate(()=>JSON.parse(localStorage.getItem('spock-user-onboarding-v1')||'{}'));
const overflow=p=>p.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
const open=(p,v)=>p.evaluate(v=>{if(v==='home')document.querySelector('#home-btn').click();else if(v==='lesson')document.querySelector('[data-week=l0]').click();else{const e=document.querySelector('[data-go='+v+']');e&&e.click();}},v);

(async()=>{const b=await browserType().launch();const T0=Date.now();
const runs=[];
// 1) výpadky služeb
runs.push(scenario('výpadky',async()=>{
 for(const mode of ['chat-chyba','db-vypadek','bez-zapisu']){
  const ctx=await b.newContext({viewport:{width:1280,height:900}});await wrapClaude(ctx,mode);
  const p=await ctx.newPage();CUR=p;const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.goto(F);await p.waitForSelector('.startb [data-role]');
  await p.locator('.startb [data-role=pm]').click();await settle(p,50);
  if(mode==='chat-chyba'){
   await p.locator('[data-open-spock]').first().click();await p.waitForSelector('#g-in');
   await p.locator('#g-in').fill('Jak spustím task?');await p.locator('#g-send').click();
   await p.waitForSelector('#g-log .g-msg.err',{timeout:5000}).catch(()=>{});
   ok('výpadek chatu: Spock ukáže srozumitelnou chybu a nabídne zkusit znovu', (await p.locator('#g-log .g-msg.err').innerText().catch(()=>'')).includes('Zkuste to znovu') && await p.locator('#g-send').innerText()==='Poslat');
  }
  if(mode==='db-vypadek'){
   await p.locator('[data-golesson],[data-week=l0]').first().click();await p.waitForSelector('.lpanel .lcard');
   await p.evaluate(()=>document.querySelector('.lpanel .lcard.cur .lc-opt').click());await settle(p,50);
   const st=await loadState(p);
   ok('nedostupná databáze: tutoriál funguje dál a pokrok se uloží do prohlížeče', st.role==='pm' && Object.keys(st.cards||{}).length===1);
  }
  if(mode==='bez-zapisu'){
   await p.locator('[data-golesson],[data-week=l0]').first().click();await p.waitForSelector('.lpanel .lcard');
   await p.evaluate(()=>document.querySelector('.lpanel .lcard.cur .lc-opt').click());await p.waitForTimeout(2600);
   const st=await loadState(p);
   ok('bez práva zápisu: pokrok zůstane v prohlížeči a stránka nespadne', Object.keys(st.cards||{}).length===1);
  }
  ok(`${mode}: bez chyb v konzoli`, errs.length===0, errs.slice(0,2).join(' | '));
  await ctx.close();
 }
}));
// 2) dvě zařízení: každé má jiný pokrok, po návratu se sloučí a nic se neztratí
runs.push(scenario('dvě zařízení',async()=>{
 const ctx=await b.newContext({viewport:{width:1280,height:900}});const now=Date.now();
 await ctx.addInitScript(n=>{const seed={v:1,at:n-5000,state:{role:'pm',todo:{'l0.0.1':true},cards:{'l0.0.1':1},xp:40,got:{'task.l0.0.1':true},days:{},_at:n-5000}};
  if(!localStorage.getItem('spock-user-onboarding-v1'))localStorage.setItem('spock-user-onboarding-v1',JSON.stringify({role:'pm',todo:{'l0.0.0':true},cards:{'l0.0.0':0},xp:25,got:{'task.l0.0.0':true},days:{},_at:n}));
  let db;Object.defineProperty(window,'__db',{configurable:true,get(){return db},set(v){if(!v['data/users/u_ja/progress'])v['data/users/u_ja/progress']=seed;db=v;}});},now);
 const p=await ctx.newPage();CUR=p;const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto(F);await p.waitForSelector('.hx');await p.waitForTimeout(2600);
 const st=await loadState(p),remote=await p.evaluate(()=>window.__db['data/users/u_ja/progress']);
 ok('dvě zařízení: po sloučení jsou hotové úkoly z obou', st.todo&&st.todo['l0.0.0']&&st.todo['l0.0.1'], JSON.stringify(st.todo));
 ok('dvě zařízení: XP je vyšší z obou, nic se neodečte', st.xp===40, 'xp '+st.xp);
 ok('dvě zařízení: sloučený pokrok se uloží zpět do účtu', remote&&remote.state&&remote.state.todo['l0.0.0']&&remote.state.todo['l0.0.1']);
 ok('dvě zařízení: bez chyb v konzoli', errs.length===0, errs.slice(0,2).join(' | '));
 await ctx.close();
}));
// 3) klávesnice: celá první lekce bez myši, Escape zavírá okna, zaměření je vidět
runs.push(scenario('klávesnice',async()=>{
 const ctx=await b.newContext({viewport:{width:1280,height:900}});const p=await ctx.newPage();CUR=p;const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto(F);await p.waitForSelector('.startb [data-role]');
 const tabTo=async(sel,max=80)=>{for(let i=0;i<max;i++){await p.keyboard.press('Tab');if(await p.evaluate(s=>document.activeElement&&document.activeElement.matches(s),sel))return true;}return false;};
 ok('klávesnice: na výběr role se dá dojít Tabem', await tabTo('.startb [data-role=pm]'));
 const vis=()=>p.evaluate(()=>{const a=document.activeElement;if(!a||a===document.body)return false;const s=getComputedStyle(a);return (s.outlineStyle!=='none'&&parseFloat(s.outlineWidth)>=1)||s.boxShadow!=='none';});
 ok('klávesnice: zaměřený prvek má viditelný obrys', await vis());
 await p.keyboard.press('Enter');await settle(p,50);
 ok('klávesnice: Enter vybere roli', (await loadState(p)).role==='pm');
 ok('klávesnice: po výběru role zůstane zaměření na dalším kroku, ne ztracené', await p.evaluate(()=>document.activeElement&&document.activeElement!==document.body&&document.activeElement.matches('[data-golesson],[data-week]')));
 await p.evaluate(()=>{for(const e of document.querySelectorAll('.notice'))e.remove();});
 ok('klávesnice: Tabem se dojde na tlačítko do první lekce', await tabTo('[data-golesson],[data-week=l0]'));
 await p.keyboard.press('Enter');await p.waitForSelector('.lpanel .lcard');
 ok('klávesnice: odpověď na kartu jde vybrat Tabem a Enterem', await tabTo('.lpanel .lcard.cur .lc-opt'));
 await p.keyboard.press('Enter');await settle(p,50);
 ok('klávesnice: karta má po Enteru vysvětlení', await p.locator('.lpanel .lc-why').count()===1);
 await p.evaluate(()=>document.querySelector('[data-playvideo]').focus());await p.keyboard.press('Enter');await p.waitForSelector('.vidov');
 await p.keyboard.press('Escape');await settle(p,50);
 ok('klávesnice: Escape zavře okno s videem', await p.locator('.vidov').count()===0);
 await p.evaluate(()=>document.querySelector('[data-fbopen]').click());await settle(p,80);
 const fbOpen=await p.locator('#fb, .fbm, [aria-label*="Zpětná vazba"][role=dialog]').count();
 await p.keyboard.press('Escape');await settle(p,80);
 ok('klávesnice: Escape zavře okno zpětné vazby', fbOpen>0 && await p.locator('#fb, .fbm, [aria-label*="Zpětná vazba"][role=dialog]').count()===0, 'otevřeno '+fbOpen);
 ok('klávesnice: bez chyb v konzoli', errs.length===0, errs.slice(0,2).join(' | '));
 await ctx.close();
}));
// 4) tablet a široký monitor, 5) tmavý režim
for(const [name,w,h,scheme] of [['tablet',768,1024,'light'],['tablet na šířku',1024,768,'light'],['široký monitor',1920,1080,'light'],['tmavý režim, mobil',390,844,'dark'],['tmavý režim, počítač',1280,900,'dark']]){
 runs.push(scenario(name,async()=>{
  const ctx=await b.newContext({viewport:{width:w,height:h},colorScheme:scheme});const p=await ctx.newPage();CUR=p;const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.goto(F);await p.waitForSelector('.startb [data-role]');await p.locator('.startb [data-role=gm]').click();await settle(p,50);
  const bad=[];
  for(const v of ['home','lesson','badges','gloss','cheat']){await open(p,v);await settle(p,30);const o=await overflow(p);if(o>0)bad.push(v+' +'+o);}
  await p.evaluate(()=>document.querySelector('[data-go=dash]').click());await p.waitForSelector('#dash .ds-tabs');
  for(const t of ['lide','pohyb','ver']){await p.evaluate(t=>document.querySelector('[data-dash="tab:'+t+'"]').click(),t);await settle(p,30);const o=await overflow(p);if(o>0)bad.push('dashboard '+t+' +'+o);}
  ok(`${name}: žádná stránka ani dashboard nepřetéká do strany`, bad.length===0, bad.join(', '));
  if(scheme==='dark'){const bg=await p.evaluate(()=>getComputedStyle(document.body).backgroundColor);ok(`${name}: stránka je opravdu tmavá`, /rgb\((\d+), (\d+), (\d+)\)/.test(bg)&&bg.match(/\d+/g).slice(0,3).every(x=>+x<80), bg);}
  ok(`${name}: bez chyb v konzoli`, errs.length===0, errs.slice(0,2).join(' | '));
  await ctx.close();
 }));
}
// 15) testování kurzu: vlastník smaže svůj pokrok a skočí do kterékoli fáze
runs.push(scenario('testování kurzu',async()=>{
 const ctx=await b.newContext({viewport:{width:1280,height:900}});const p=await ctx.newPage();CUR=p;const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto(F);await p.waitForSelector('.startb [data-role]');await p.locator('.startb [data-role=pm]').click();await settle(p,300);
 await p.evaluate(()=>document.querySelector('[data-go=cheat]').click());await settle(p,100);
 ok('testování: v menu Jen pro vás je Testování kurzu vedle dashboardu', await p.locator('.rail-more [data-go=admin]').count()===1);
 await p.evaluate(()=>document.querySelector('[data-go=admin]').click());await settle(p,100);
 ok('testování: stránka nabízí reset a skok do každé lekce', await p.locator('#adm [data-adm=ask]').count()===1 && await p.locator('#adm [data-adm^="jump:l3:"]').count()>3);
 await p.locator('#adm [data-adm="jump:l3:2"]').first().click();await settle(p,200);
 const s1=await loadState(p);
 ok('testování: skok do úrovně 3 otevře její 3. lekci a předchozí úrovně cesty označí jako hotové', /Pokročilý/.test(await p.locator('.unit h1').innerText()) && (await p.locator('#lpanel').getAttribute('data-lk'))==='l3.2' && !!(s1.qpass&&s1.qpass.l0&&s1.qpass.l1&&s1.qpass.pm), JSON.stringify(Object.keys(s1.qpass||{})));
 await p.evaluate(()=>document.querySelector('[data-go=admin]').click());await settle(p,100);
 await p.locator('#adm [data-adm=ask]').click();await settle(p,50);
 ok('testování: reset chce potvrzení', await p.locator('#adm [data-adm=reset]').count()===1);
 await p.locator('#adm [data-adm=reset]').click();await settle(p,2600);
 const s2=await loadState(p), acc=await p.evaluate(()=>{const d=window.__db['data/users/u_ja/progress'];return d&&d.state?d.state:null;});
 ok('testování: reset smaže pokrok, roli ponechá a vrátí na úvod', !Object.keys(s2.todo||{}).length && !Object.keys(s2.qpass||{}).length && s2.role==='pm' && !!s2.resetAt && await p.locator('.hx').count()===1);
 ok('testování: reset se zapíše i do pokroku pod účtem', !!acc && !Object.keys(acc.todo||{}).length && !!acc.resetAt, JSON.stringify(acc||{}).slice(0,100));
 ok('testování: bez chyb v konzoli', errs.length===0, errs.slice(0,2).join(' | '));
 await ctx.close();
}));
// 14) opora: v menu jen to nezbytné, zbytek pod Další, dashboard jen pro vlastníka
runs.push(scenario('opora',async()=>{
 const ctx=await b.newContext({viewport:{width:1280,height:900}});const p=await ctx.newPage();CUR=p;
 await p.goto(F);await p.waitForSelector('.startb [data-role]');await p.locator('.startb [data-role=pm]').click();await settle(p,200);
 await p.evaluate(()=>document.querySelector('[data-go=cheat]').click());await settle(p,100);
 const vis=await p.evaluate(()=>[...document.querySelectorAll('.rail-more > button')].map(b=>b.dataset.go));
 ok('opora: v menu jsou nahoře jen tahák, když něco nejde a slovníček (a pro vlastníka dashboard a testování)', JSON.stringify(vis)==='["cheat","diag","gloss","dash","admin"]', JSON.stringify(vis));
 ok('opora: pod Další jsou jen odznaky a profil, tým a příručka (bez mapy, připravenosti, nanečisto a jiných rolí)', await p.evaluate(()=>{const d=document.querySelector('.rail-x');return d&&!d.open&&!d.querySelector('[data-simstart]')&&['badges','tym'].every(x=>d.querySelector('[data-go='+x+']'))&&!d.querySelector('[data-go=map],[data-go=ready]')&&!!d.querySelector('[data-week=l1b]')&&!d.querySelector('[data-week=pd]');}));
 await p.evaluate(()=>document.querySelector('.rail-x [data-go=tym]').click());await settle(p,100);
 ok('opora: na stránce z Další zůstane Další rozbalené', await p.evaluate(()=>document.querySelector('.rail-x').open));
 await p.evaluate(()=>document.querySelector('[data-go=cheat]').click());await settle(p,100);
 await p.evaluate(()=>document.querySelector('[data-week=l0]').click());await settle(p,150);
 ok('kroky lekce: teoretická lekce má kroky Pochopte, Vyzkoušejte, Co si odnést do práce', await p.evaluate(()=>{const h=[...document.querySelectorAll('.lpanel .lstep .ls-t')].map(x=>x.innerText);return h.length===3&&h[0]==='Pochopte'&&/^Vyzkoušejte/.test(h[1])&&h[2]==='Co si odnést do práce';}));
 ok('kroky lekce: první nehotový krok je Na řadě a hotové se při otevření lekce sbalí', await p.evaluate(()=>{const st=[...document.querySelectorAll('.lpanel .lstep')];return st.filter(e=>e.classList.contains('ls-now')).length===1&&st.filter(e=>e.classList.contains('ls-done')).every(e=>!e.open);}));
 ok('konec lekce: co si odnést se neukáže dřív než karty (neprozradí odpovědi)', await p.locator('.takeaway .tk-wait').count()===1 && await p.locator('.takeaway .keys').count()===0);
 ok('čas: v menu a u bloků lekcí nejsou odhady času', await p.locator('.rail .rt').count()===0 && await p.locator('.tsum').count()===0);
 ok('opora: dashboard je pod Jen pro vás', /jen pro vás/i.test(await p.locator('.rail-more').innerText()));
 await p.evaluate(()=>document.querySelector('#home-btn').click());await settle(p,100);
 ok('čas: úvod bez „30 minut denně“ a bez denního cíle', !/30 minut|denní cíl|dnešní cíl/i.test(await p.evaluate(()=>document.body.innerText)));
 ok('opora: úvodní stránka nabízí jen tři nejdůležitější opory', await p.evaluate(()=>{const j=[...document.querySelectorAll('.journey .jstep')].map(b=>b.dataset.go);return JSON.stringify(j)==='["diag","gloss","cheat"]';}));
 await ctx.close();
}));
// 13) přizpůsobení: opakování chyb s odstupem, vstupní test, co je nového ve SPOCKu
runs.push(scenario('přizpůsobení',async()=>{
 const ctx=await b.newContext({viewport:{width:1280,height:900}});await ctx.addInitScript(()=>{window.__E2E_NOVINKY={'1.16.1':['Nový task **SPOCK: Kontrola**.']};});const p=await ctx.newPage();CUR=p;const errs=[];p.on('pageerror',e=>errs.push(e.message));
 const clean=()=>p.evaluate(()=>{for(const e of document.querySelectorAll('.cel'))e.remove();});
 const answer=async right=>{for(let g=0;g<20&&await p.locator('#ses').count();g++){const pick=await p.evaluate(r=>{const it=(S=>S.items[S.qs[S.i]])(__kviz.ses());return r?it.a:(it.a+1)%it.o.length},right);await p.locator('.ses-opt').nth(pick).click();await p.locator('[data-scheck]').click();await p.locator('[data-snext]').click();await settle(p);}};
 await p.goto(F);await p.waitForSelector('.startb [data-role]');await p.locator('.startb [data-role=pm]').click();await settle(p,300);
 ok('přizpůsobení: rozcestí nabízí vstupní test', await p.locator('.exfork [data-place]').count()===1);
 // vstupní test: špatně → nevyjde, nic se nezmění
 await p.locator('[data-place]').click();await p.waitForSelector('#ses');
 ok('přizpůsobení: vstupní test má 8 otázek a srdíčka', await p.evaluate(()=>__kviz.ses().total===8)&&await p.locator('.ses-hearts').count()===1&&/vstupní test/i.test(await p.locator('.ses-body .eyebrow').innerText()));
 await answer(false);await clean();
 ok('přizpůsobení: nevydařený vstupní test nic neodemkne', !(await loadState(p)).placed && !((await loadState(p)).unlocked||{}).l1);
 // vstupní test: správně → teorie úrovně 0 splněná, Příprava odemčená, úkoly zůstávají
 await p.evaluate(()=>document.querySelector('#home-btn').click());await settle(p,200);
 await p.locator('[data-place]').click();await p.waitForSelector('#ses');await answer(true);await clean();
 const st=await loadState(p);
 ok('přizpůsobení: zvládnutý vstupní test odemkne Přípravu a splní karty i kvíz úrovně 0', !!st.placed&&st.unlocked.l1===true&&!!st.qpass.l0&&Object.keys(st.cards).filter(k=>k.startsWith('l0.')).length>10);
 ok('přizpůsobení: praktické úkoly úrovně 0 testem nezmizí', Object.keys(st.todo||{}).filter(k=>k.startsWith('l0.')).length===0);
 // opakování chyb: špatná odpověď na kartu → karta se vrátí za den
 await p.evaluate(()=>document.querySelector('#home-btn').click());await settle(p,100);
 await p.evaluate(()=>{__kviz.state(S=>{delete S.cards['l1.0.0'];});});
 await p.evaluate(()=>document.querySelector('[data-week=l1]')?.click());await p.waitForSelector('.lpanel .lcard.cur .lc-opt',{timeout:5000}).catch(()=>{});
 const wrong=await p.evaluate(()=>{const o=document.querySelector('.lpanel .lcard.cur .lc-opt');if(!o)return null;const [k]=o.dataset.card.split(':');const a=__kviz.cardA(k);const bad=[...document.querySelectorAll('.lpanel .lcard.cur .lc-opt')].find(b=>+b.dataset.card.split(':')[1]!==a);bad.click();return k;});
 await clean();const s2=await loadState(p);
 ok('přizpůsobení: netrefená karta se zařadí k opakování za den', !!wrong&&s2.rev&&s2.rev[wrong]&&s2.rev[wrong].due>Date.now()+20*36e5, wrong);
 await p.evaluate(k=>__kviz.state(S=>{S.rev[k].due=Date.now()-1;}),wrong);
 await p.evaluate(()=>document.querySelector('#home-btn').click());await settle(p,200);
 ok('přizpůsobení: opakování je v horní liště u zvonku, ne na úvodní stránce', await p.locator('#pill-ntf .ntf-n').innerText().then(t=>t==='1')&&await p.locator('.revc,.newsc').count()===0);
 await p.waitForFunction(()=>[...document.querySelectorAll('.notice')].some(n=>/k zopakování/.test(n.textContent)),null,{timeout:12000}).then(()=>true,()=>false).then(v=>ok('přizpůsobení: vyskočí upozornění na karty k zopakování',v));
 await clean();await p.locator('#pill-ntf').click();await settle(p,80);
 ok('přizpůsobení: zvonek otevře panel s opakováním a počtem karet', await p.locator('#ntf-pop [data-review]').isVisible()&&/1 karta/.test(await p.locator('#ntf-pop').innerText())&&(await p.locator('#pill-ntf').getAttribute('aria-expanded'))==='true');
 ok('zvonek: panel visí přímo pod zvonkem', await p.evaluate(()=>{const b=document.getElementById('pill-ntf').getBoundingClientRect(),q=document.getElementById('ntf-pop').getBoundingClientRect();return q.top>=b.bottom&&q.top-b.bottom<=16&&q.left<=b.right&&q.right>=b.left;}));
 const x0=(await loadState(p)).xp;
 await p.locator('#ntf-pop [data-review]').click();await p.waitForSelector('#ses');await answer(true);await clean();
 const s3=await loadState(p);
 ok('přizpůsobení: trefa při opakování posune kartu na 3 dny a přidá XP', s3.rev[wrong]&&s3.rev[wrong].step===1&&s3.rev[wrong].due>Date.now()+2.5*864e5&&s3.xp>x0, JSON.stringify(s3.rev[wrong]));
 await p.evaluate(()=>document.querySelector('#home-btn').click());await settle(p,200);
 ok('přizpůsobení: po opakování zvonek nic neukazuje', await p.locator('#pill-ntf .ntf-n').count()===0);
 // co je nového: kdo onboarding používal před novou verzí SPOCKu, uvidí novinky
 await p.evaluate(()=>__kviz.state(S=>{S.spockSeen='1.15.0';}));await p.evaluate(()=>document.querySelector('#home-btn').click());await settle(p,200);
 await p.waitForFunction(()=>[...document.querySelectorAll('.notice')].some(n=>/Co je nového/.test(n.textContent)),null,{timeout:12000}).then(()=>true,()=>false).then(v=>ok('přizpůsobení: po nové verzi SPOCKu vyskočí upozornění na novinky',v));
 await clean();await p.locator('#pill-ntf').click();await settle(p,80);
 ok('přizpůsobení: novinky jsou v panelu u zvonku', (await p.locator('#ntf-pop').innerText()).includes('Kontrola'));
 await p.locator('#ntf-pop [data-newsok]').click();await settle(p,100);
 ok('přizpůsobení: Rozumím novinky skryje a panel zavře', await p.locator('#ntf-pop').isHidden()&&await p.locator('#pill-ntf .ntf-n').count()===0&&(await loadState(p)).spockSeen==='1.16.1');
 await p.locator('#pill-ntf').click();await settle(p,50);await p.keyboard.press('Escape');await settle(p,50);
 ok('přizpůsobení: prázdný panel zavře Escape a zaměření se vrátí na zvonek', await p.locator('#ntf-pop').isHidden()&&await p.evaluate(()=>document.activeElement.id==='pill-ntf'));
 ok('přizpůsobení: bez chyb v konzoli', errs.length===0, errs.slice(0,2).join(' | '));
 await ctx.close();
}));
// 12) tým: založení, kód, přehled členů, odebrání, zrušení; připojení kódem k jinému týmu
runs.push(scenario('tým',async()=>{
 const ctx=await b.newContext({viewport:{width:1280,height:900}});const p=await ctx.newPage();CUR=p;const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('dialog',d=>d.accept());
 await p.goto(F);await p.waitForSelector('.startb [data-role]');await p.locator('.startb [data-role=pm]').click();await settle(p,300);
 await p.evaluate(()=>document.querySelector('[data-go=cheat]').click());await settle(p,100);
 ok('tým: stránka Tým je v menu', await p.locator('.rail-more [data-go=tym]').count()===1);
 await p.evaluate(()=>document.querySelector('[data-go=tym]').click());await settle(p,100);
 ok('tým: bez týmu jde tým založit nebo se připojit kódem', await p.locator('[data-tmform=create]').count()===1&&await p.locator('[data-tmform=join]').count()===1);
 await p.locator('[data-tmform=create] button').click();await settle(p,200);
 ok('tým: bez názvu se tým nezaloží a ukáže se proč', await p.evaluate(()=>!window.__db['tymy/u_ja'])&&/název/i.test(await p.locator('.tm-err').innerText()));
 await p.fill('#tm-name','Tribe Platby');await p.locator('[data-tmform=create] button').click();await p.waitForSelector('#tm-code-v');
 const code=await p.locator('#tm-code-v').innerText();
 ok('tým: po založení je vidět šestiznakový kód a zakladatel je v týmu', /^[A-Z0-9]{6}$/.test(code)&&await p.evaluate(()=>window.__db['clenove/u_ja'].team==='u_ja'), code);
 await p.evaluate(()=>{window.__db['clenove/u_kolega']={team:'u_ja',role:'pd',xp:320,rank:'Praktik',lvl:3,pct:41,mod:'pd',streak:4,last:Date.now()-864e5,done:false};window.__db['clenove/u_novak']={team:'u_ja',role:'se',xp:60,rank:'Nováček',lvl:1,pct:6,mod:'l0',streak:0,last:Date.now()-5*864e5,done:false};window.__db['clenove/u_cizi']={team:'u_jiny',pct:90};});
 await p.locator('[data-tm=reload]').click();await settle(p,300);
 ok('tým: přehled ukáže jen členy tohoto týmu se jmény, postupem a poslední aktivitou', await p.locator('.tm-t tbody tr').count()===3&&(await p.locator('.tm-t').innerText()).includes('Kolega Testovací')&&(await p.locator('.tm-t').innerText()).includes('41 %'));
 ok('tým: upozorní na lidi bez aktivity přes 3 dny', await p.locator('.tm-stuck').count()===1);
 ok('tým: souhrnná čísla týmu (lidé, průměr, hotovo, aktivní)', (await p.locator('.tm-kpi').innerText()).includes('3'));
 await p.locator('[data-tm="remove:u_novak"]').click();await settle(p,300);
 ok('tým: zakladatel může člověka odebrat', await p.locator('.tm-t tbody tr').count()===2&&await p.evaluate(()=>window.__db['tymy/u_ja'].removed.includes('u_novak')));
 await p.evaluate(()=>{window.__S=JSON.parse(localStorage.getItem('spock-user-onboarding-v1'));__kviz.state(S=>{S.xp=S.xp+40;});});await p.waitForTimeout(2600);
 ok('tým: změna postupu se propíše do souhrnu v týmu', await p.evaluate(()=>window.__db['clenove/u_ja'].xp>=50), await p.evaluate(()=>window.__db['clenove/u_ja'].xp));
 await p.locator('[data-tm=dissolve]').click();await settle(p,300);
 ok('tým: zakladatel může tým zrušit', await p.evaluate(()=>!window.__db['tymy/u_ja']&&window.__db['clenove/u_ja'].team===null)&&await p.locator('[data-tmform=join]').count()===1);
 await p.evaluate(()=>{window.__db['tymy/u_jiny']={name:'Jiný tým',code:'K7M2QX',removed:[]};});
 await p.fill('#tm-code','ZZZZZZ');await p.locator('#tm-agree').check();await p.locator('[data-tmform=join] button').click();await settle(p,300);
 ok('tým: neexistující kód vysvětlí, co dělat', /neexistuje/.test(await p.locator('.tm-err').innerText()));
 await p.fill('#tm-code','k7m2qx');await p.locator('#tm-agree').uncheck();await p.locator('[data-tmform=join] button').click();await settle(p,150);
 ok('tým: bez souhlasu se sdílením souhrnu se nepřipojí', /souhlas/.test(await p.locator('.tm-err').innerText())&&await p.evaluate(()=>window.__db['clenove/u_ja'].team===null));
 await p.locator('#tm-agree').check();await p.locator('[data-tmform=join] button').click();await settle(p,300);
 ok('tým: s kódem (i malými písmeny) a souhlasem se připojí k cizímu týmu', await p.evaluate(()=>window.__db['clenove/u_ja'].team==='u_jiny')&&(await p.locator('.tm-head').innerText()).includes('Jiný tým')&&await p.locator('#tm-code-v').count()===0);
 await p.locator('[data-tm=leave]').click();await settle(p,300);
 ok('tým: člen může tým opustit', await p.evaluate(()=>window.__db['clenove/u_ja'].team===null));
 ok('tým: bez chyb v konzoli', errs.length===0, errs.slice(0,2).join(' | '));
 await ctx.close();
 const m=await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const q=await m.newPage();
 await q.goto(F);await q.waitForSelector('.startb [data-role]');await q.locator('.startb [data-role=pm]').click();await settle(q,300);
 await q.evaluate(()=>{window.__db['tymy/u_ja']={name:'Tribe Platby s dlouhým názvem týmu',code:'ABC234',removed:[]};window.__db['clenove/u_ja']={team:'u_ja',pct:0};window.__db['clenove/u_kolega']={team:'u_ja',role:'pd',xp:320,rank:'Praktik',pct:41,mod:'pd',streak:4,last:Date.now()};});
 await q.evaluate(()=>document.querySelector('[data-go=cheat]').click());await settle(q,100);
 await q.evaluate(()=>document.querySelector('[data-go=tym]').click());await q.waitForSelector('.tm-t tbody tr',{timeout:5000}).catch(()=>{});await settle(q,200);
 ok('tým, mobil: stránka nepřetéká do strany a tabulka se dá posouvat', await q.evaluate(()=>document.documentElement.scrollWidth-innerWidth)<=0&&await q.locator('.tm-t tbody tr').count()===2);
 await m.close();
}));
// 11) první použití: bez uvítacího okna; role se vybírá na stránce, pod ní rozbalené Co je SPOCK, až pak cesta
runs.push(scenario('první použití',async()=>{
 for(const [W,H,dev] of [[1280,900,'počítač'],[390,844,'mobil']]){
  const ctx=await b.newContext({viewport:{width:W,height:H}});const p=await ctx.newPage();CUR=p;const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.goto(F);await settle(p,700);
  ok(`první použití, ${dev}: neotevře se žádné uvítací okno`, await p.locator('.vidov').count()===0);
  ok(`první použití, ${dev}: pořadí banner, výběr role, Co je SPOCK, cesta`, await p.evaluate(()=>{const q=s=>document.querySelector(s),y=e=>e?e.getBoundingClientRect().top+scrollY:NaN;const h=y(q('.hx')),r=y(q('.startb')),i=y(q('.cvB')),c=y(q('.hp-head'));return h<r&&r<i&&i<c&&!q('.introfold');}));
  ok(`první použití, ${dev}: Co je SPOCK je rozbalené s videem`, await p.locator('.cvB video').count()===1 && await p.locator('.cvB').isVisible());
  ok(`první použití, ${dev}: bez chyb v konzoli`, errs.length===0, errs.slice(0,2).join(' | '));
  if(dev==='mobil'){await p.locator('.startb [data-role=pd]').click();await settle(p,150);ok('první použití: po výběru role na stránce banner nabídne rozcestí', (await loadState(p)).role==='pd' && await p.locator('.exfork').count()===1);}
  await ctx.close();
 }
 const ctx=await b.newContext({viewport:{width:1280,height:900}});const p=await ctx.newPage();await p.goto(F);await settle(p,300);
 ok('úvod: tlačítko Co vás čeká pustí pitch video', await p.locator('.hx [data-playvideo=pitch]').count()===1 && await p.evaluate(()=>{document.querySelector('.hx [data-playvideo=pitch]').click();return !!document.querySelector('.vidov video source[src="spock-pitch.mp4"]');}));
 await ctx.close();
}));
// 10) ikona aplikace: záložka prohlížeče a plocha telefonu
runs.push(scenario('ikona',async()=>{
 const ctx=await b.newContext({viewport:{width:390,height:844}});const p=await ctx.newPage();CUR=p;
 await p.goto(F);await p.waitForSelector('.startb [data-role]');
 const ic=await p.evaluate(async()=>{const size=h=>new Promise(r=>{const i=new Image();i.onload=()=>r([i.naturalWidth,i.naturalHeight]);i.onerror=()=>r(null);i.src=h;});
  const a=document.querySelector('link[rel="apple-touch-icon"]'),f=document.querySelector('link[rel="icon"]'),t=document.querySelector('meta[name="theme-color"]'),n=document.querySelector('meta[name="apple-mobile-web-app-title"]');
  return {touch:a?await size(a.href):null,fav:f?await size(f.href):null,theme:t&&t.content,name:n&&n.content};});
 ok('ikona: ikona pro plochu telefonu je ve stránce a má 180 × 180 px', !!ic.touch&&ic.touch[0]===180&&ic.touch[1]===180, JSON.stringify(ic.touch));
 ok('ikona: ikona pro záložku prohlížeče se načte', !!ic.fav&&ic.fav[0]>0, JSON.stringify(ic.fav));
 ok('ikona: stránka má barvu lišty a krátký název SPOCK pro plochu', ic.theme==='#1068D2'&&ic.name==='SPOCK', JSON.stringify(ic));
 const dir=path.join(path.resolve(__dirname,'..','..'),'web','ikona');const m=JSON.parse(fs.readFileSync(path.join(dir,'manifest.webmanifest'),'utf8'));
 ok('ikona: manifest pro vlastní server odkazuje na existující soubory', m.short_name==='SPOCK'&&m.icons.length>=2&&m.icons.every(i=>fs.existsSync(path.join(dir,i.src))));
 await ctx.close();
}));
// 8) offline režim: bez sítě jde dál hrát a učit se, po připojení se vše odešle
runs.push(scenario('offline',async()=>{
 const ctx=await b.newContext({viewport:{width:1280,height:900}});const p=await ctx.newPage();CUR=p;const errs=[];p.on('pageerror',e=>errs.push(e.message));
 const clean=()=>p.evaluate(()=>{for(const e of document.querySelectorAll('.cel'))e.remove();});
 const cards=async n=>{for(let i=0;i<n;i++){await clean();const k=await p.evaluate(()=>{const o=document.querySelector('.lpanel .lcard.cur .lc-opt:not([disabled])');if(o){o.click();return 1}return 0});if(!k)break;await settle(p);}await clean();};
 await p.goto(F);await p.waitForSelector('.startb [data-role]');await p.locator('.startb [data-role=pm]').click();await settle(p,80);
 ok('offline: online se štítek Offline neukazuje', await p.locator('#pill-net').isHidden());
 await ctx.setOffline(true);await settle(p,50);
 ok('offline: po ztrátě připojení je v hlavičce štítek Offline s vysvětlením', await p.locator('#pill-net').isVisible() && /pokrok se ukládá v zařízení/.test(await p.locator('#pill-net').getAttribute('title')));
 const x0=(await loadState(p)).xp;
 await p.locator('.exfork [data-golesson]').click();await p.waitForSelector('.lpanel');await cards(3);
 const x1=(await loadState(p)).xp;
 ok('offline: lekce a karty jdou dál, XP přibývají a ukládají se v zařízení', x1>x0, x0+' → '+x1);
 await p.evaluate(()=>document.querySelector('[data-fbopen]').click());await p.waitForSelector('#fb-text');
 await p.fill('#fb-text','Offline test: karta je nejasná');await p.locator('#fb-form button[type=submit]').click();await settle(p,80);
 const q=await p.evaluate(()=>JSON.parse(localStorage.getItem('spock-fb-outbox')||'[]').length);
 ok('offline: zpětná vazba se uloží do fronty v zařízení a okno se zavře', q===1 && await p.locator('#fb').count()===0, 'fronta '+q);
 ok('offline: štítek ukazuje počet zpráv ve frontě', /· 1/.test(await p.locator('#pill-net').innerText()));
 const sent0=await p.evaluate(()=>window.__sent.length);
 await p.evaluate(()=>document.querySelector('#home-btn').click());await settle(p,50);await p.evaluate(()=>document.querySelector('[data-open-spock]').click());await p.waitForSelector('#g-in');
 await p.locator('#g-in').fill('Jak spustím task?');await p.locator('#g-send').click();await settle(p,80);
 ok('offline: chat se Spockem vysvětlí, že je offline, nabídne tahák a otázku ponechá', await p.evaluate(()=>window.__sent.length)===sent0 && /offline/i.test(await p.locator('#g-log').innerText()) && await p.locator('#g-log [data-go=cheat]').count()===1 && await p.locator('#g-in').inputValue()==='Jak spustím task?');
 await p.keyboard.press('Escape');
 ok('offline: do databáze se nic nezapsalo', await p.evaluate(()=>!window.__db['feedback/u_ja']));
 await ctx.setOffline(false);
 await p.waitForFunction(()=>window.__db['feedback/u_ja']&&window.__db['data/users/u_ja/progress'],null,{timeout:8000}).catch(()=>{});
 const db=await p.evaluate(()=>({fb:(window.__db['feedback/u_ja']||{}).items||[],pr:window.__db['data/users/u_ja/progress'],tr:window.__db['track/u_ja']}));
 ok('offline: po připojení zmizí štítek a odejde zpětná vazba z fronty', await p.locator('#pill-net').isHidden() && db.fb.some(x=>x.text==='Offline test: karta je nejasná') && await p.evaluate(()=>!localStorage.getItem('spock-fb-outbox')), db.fb.length+' zpráv');
 ok('offline: po připojení je pokrok z doby offline uložený pod účtem', db.pr && db.pr.state && db.pr.state.xp>=x1, db.pr&&db.pr.state&&db.pr.state.xp);
 ok('offline: měření zaznamená výpadek i návrat připojení', !!db.tr && db.tr.ev.some(e=>e[1]==='připojení'&&e[2]==='offline') && db.tr.ev.some(e=>e[1]==='připojení'&&e[2]==='zpět online'));
 ok('offline: bez chyb v konzoli', errs.length===0, errs.slice(0,2).join(' | '));
 await ctx.close();
}));
// 9) spuštění bez připojení: aplikace se načte a po připojení se k účtu připojí sama
runs.push(scenario('start offline',async()=>{
 const ctx=await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const p=await ctx.newPage();CUR=p;const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto(F);await ctx.setOffline(true);await p.reload();await p.waitForSelector('.startb [data-role]');
 await p.locator('.startb [data-role=se]').click();await settle(p,80);
 ok('start offline: role jde vybrat a úvod funguje', (await loadState(p)).role==='se');
 ok('start offline: na mobilu je štítek Offline vidět jako kompaktní ikona', await p.locator('#pill-net').isVisible() && (await p.locator('#pill-net').boundingBox()).width<60);
 await ctx.setOffline(false);
 await p.waitForFunction(()=>window.__db['data/users/u_ja/progress'],null,{timeout:8000}).catch(()=>{});
 const pr=await p.evaluate(()=>window.__db['data/users/u_ja/progress']);
 ok('start offline: po připojení se aplikace sama připojí k účtu a uloží pokrok', !!(pr&&pr.state&&pr.state.role), JSON.stringify(pr&&pr.state&&pr.state.role));
 ok('start offline: bez chyb v konzoli', errs.length===0, errs.slice(0,2).join(' | '));
 await ctx.close();
}));
// 7) expresní cesta: od výběru role po odznak Expres
runs.push(scenario('expresní cesta',async()=>{
 const ctx=await b.newContext({viewport:{width:1280,height:900}});const p=await ctx.newPage();CUR=p;const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto(F);await p.waitForSelector('.startb [data-role]');await p.locator('.startb [data-role=se]').click();await settle(p,50);
 ok('expresní cesta: po výběru role banner nabídne dvě rovnocenné karty jako ve videu, celou cestu a expres do 2 hodin', await p.locator('.hx .exfork .exf-opts .exf').count()===2 && /1 h \d+ min/.test(await p.locator('.exfork .exf.fast').innerText()) && await p.locator('.exf.fast[data-express=on]').count()===1);
 ok('expresní cesta: v rozcestí je zaměřená první volba (klávesnice)', await p.evaluate(()=>document.activeElement&&document.activeElement.matches('.exfork .exf')));
 await p.locator('.exfork [data-express=on]').click();await settle(p,50);
 ok('expresní cesta: banner ukazuje další krok a v úvodu je jen jedno hlavní tlačítko', (await p.locator('.hx-next.ex .hx-nt').innerText()).includes('přístupy') && await p.locator('.hx .btn.primary').count()===1 && await p.locator('.exfork').count()===0);
 ok('expresní cesta: má 7 kroků v rozbalovacím seznamu a 7 dílků postupu', await p.locator('.exall .exlist li').count()===7 && await p.locator('.hx-next.ex .exseg i').count()===7);
 await p.locator('.exsw-l [data-express=off]').click();await settle(p,50);
 ok('expresní cesta: jde přepnout na celou cestu a zpět odkazem v banneru', await p.locator('.hx-next.ex').count()===0 && await p.locator('.hx .exsw-l [data-express=on]').count()===1);
 await p.locator('.hx .exsw-l [data-express=on]').click();await settle(p,50);
 const home=async()=>{await p.evaluate(()=>{for(const e of document.querySelectorAll('.cel,.notice'))e.remove();document.querySelector('#home-btn').click();});await settle(p,50);};
 const next=()=>p.evaluate(()=>{const b=document.querySelector('.hx-next.ex .hx-cta .btn.primary');const v=b&&b.dataset.express;b&&b.click();return v||'';});
 // 1) lekce 1.1 jako první krok: schválení přístupů trvá dny (Příprava je jinak zamčená, expresní cesta ji otevře k nahlédnutí)
 ok('expresní cesta: první krok je objednání přístupů, lekce 1.1 se otevře, i když Příprava ještě není odemčená', (await next())==='step:l1' && (await p.locator('.lpanel .lp-head').innerText()).includes('1.1'));
 for(let i=0;i<8;i++){const n=await p.evaluate(()=>{const o=document.querySelector('.lpanel .lcard.cur .lc-opt:not([disabled])');if(o){o.click();return 1}const t=document.querySelector('.lpanel input[data-todo]:not(:checked):not([disabled])');if(t){t.click();return 1}return 0});await p.evaluate(()=>{for(const e of document.querySelectorAll('.cel'))e.remove();});if(!n)break;await settle(p);}
 await p.evaluate(()=>__kviz.state(S=>{const w=0;for(let t=0;t<6;t++)S.todo['l1.0.'+t]=true;}));
 await home();
 // 2) simulace
 ok('expresní cesta: druhý krok spustí simulaci', (await next())==='step:sim' && await p.locator('#sim').count()===1);
 for(const st of ['next','o-sol','o-ok','sign','load','sign','next','sol-1','why-2','sign','mvp-0','sign','sign','sign','trace','finish']){await p.locator(`[data-sim="${st}"]`).first().click();await settle(p);}
 await home();
 // 3–5) karty lekcí 0.1–0.3
 for(const step of ['step:l0c0','step:l0c1','step:l0c2']){
  const v=await next();await p.waitForSelector('.lpanel');
  for(let i=0;i<12;i++){const n=await p.evaluate(()=>{const o=document.querySelector('.lpanel .lcard.cur .lc-opt:not([disabled])');if(o){o.click();return 1}return 0});await p.evaluate(()=>{for(const e of document.querySelectorAll('.cel'))e.remove();});if(!n)break;await settle(p);}
  ok(`expresní cesta: krok ${step} otevře správnou lekci a karty jdou projít`, v===step);
  await home();
 }
 // 6) video
 ok('expresní cesta: krok s videem pustí video krok za krokem', (await next())==='step:vid' && await p.locator('.vidov video').count()===1);
 await p.keyboard.press('Escape');await home();
 // 7) tahák
 ok('expresní cesta: poslední krok otevře tahák tasků', (await next())==='step:cheat' && await p.locator('.main h1').innerText().then(t=>/tah/i.test(t)));
 await settle(p,100);
 const st=await loadState(p);
 ok('expresní cesta: po všech krocích odznak Expres a 50 XP navíc', st.got&&st.got['express']===true&&st.badges&&st.badges['got.express'], JSON.stringify(Object.keys(st.got||{}).filter(k=>/expr/.test(k))));
 await home();
 ok('expresní cesta: úvod nabídne pokračovat Přípravou', (await p.locator('.hx-next.ex').innerText()).includes('Pokračovat Přípravou'));
 ok('expresní cesta: bez chyb v konzoli', errs.length===0, errs.slice(0,2).join(' | '));
 await ctx.close();
}));
// 10) důkaz z běhu: první hodnota (G1 ve vlastním běhu) se ověří z RUN-STATE.md v prohlížeči
runs.push(scenario('důkaz z běhu',async()=>{
 const ctx=await b.newContext({viewport:{width:1280,height:900}});const p=await ctx.newPage();CUR=p;const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto(F);await p.waitForSelector('.startb [data-role]');await p.locator('.startb [data-role=pm]').click();await settle(p,50);
 await p.evaluate(()=>__kviz.state(S=>{S.unlocked.pm=true;S.express=false;}));
 const go=async()=>{await p.evaluate(()=>{for(const e of document.querySelectorAll('.cel,.notice'))e.remove();const x=document.createElement('button');x.dataset.golesson='pm:0';document.body.appendChild(x);x.click();x.remove();});await p.waitForSelector('.lpanel');await p.evaluate(()=>{for(const d of document.querySelectorAll('.lpanel details.tfold'))d.open=true;});};
 await go();
 const K='pm.0.3',TA='#re-pm-0-3',BOX='#t-pm-0-3';
 ok('důkaz z běhu: úkol Schvalte brief (G1) má pole pro RUN-STATE.md a bez důkazu nejde odškrtnout', await p.locator(TA).count()===1 && await p.locator(BOX).isDisabled());
 const sample=['---','run_id: 2026-09-spending-insights','record: run-state','stages:','  - id: 1','    name: Brief','    status: accepted','    decision_gates:','      - id: G1','        decided_by: Jana Novakova','        decided_at: 2026-09-08','        by_agent: false','  - id: 2','    name: Problems','    status: pending'].join('\n');
 const check=async txt=>{await p.locator(TA).fill(txt);await p.locator(`[data-runev="${K}"]`).click();await settle(p,50);await p.evaluate(()=>{for(const d of document.querySelectorAll('.lpanel details.tfold'))d.open=true;});};
 await check(sample);
 ok('důkaz z běhu: ukázkový běh ze SPOCKu se nepřijme a řekne proč', /ukázkový běh/.test(await p.locator('.tchk.run .lc-why.bad').innerText().catch(()=>'')) && !(await loadState(p)).runev);
 await check(sample.replace('2026-09-spending-insights','2026-11-moje-iniciativa').replace('      - id: G1','      - id: G9'));
 ok('důkaz z běhu: chybějící podpis G1 se nepřijme a odkáže na task approve', /approve what is in front of me/.test(await p.locator('.tchk.run .lc-why.bad').innerText().catch(()=>'')));
 await check(sample.replace('2026-09-spending-insights','2026-11-moje-iniciativa'));
 const st=await loadState(p);
 ok('důkaz z běhu: vlastní běh se schváleným G1 úkol odškrtne a zapíše první hodnotu ověřenou z běhu', st.todo&&st.todo[K]===true && st.runev&&st.runev[K]&&st.runev[K].signed==='2026-09-08' && st.fv&&st.fv.lvl==='run'&&st.fv.gate==='G1', JSON.stringify({fv:st.fv,ev:st.runev}));
 ok('důkaz z běhu: obsah RUN-STATE.md ani jméno se neukládají', !JSON.stringify(st).includes('Jana') && !JSON.stringify(st).includes('moje-iniciativa'));
 ok('důkaz z běhu: po ověření úkol ukáže potvrzení místo pole', await p.locator('.tchk.run .lc-why.ok').count()===1 && await p.locator(TA).count()===0);
 // náhradní cesta: bez důkazu jde úkol odškrtnout, ale zapíše se jako bez důkazu
 await p.evaluate(()=>__kviz.state(S=>{delete S.runev;delete S.fv;S.todo['pm.0.3']=false;}));await go();
 await p.locator(`[data-runself="${K}"]`).click();await settle(p,50);
 const s2=await loadState(p);
 ok('důkaz z běhu: „Nejde to?“ úkol odškrtne a první hodnotu zapíše jako bez důkazu', s2.todo[K]===true && s2.selfok&&s2.selfok[K] && s2.fv&&s2.fv.lvl==='self');
 ok('důkaz z běhu: bez chyb v konzoli', errs.length===0, errs.slice(0,2).join(' | '));
 await ctx.close();
}));
// 6) videa: soubory existují, jsou to MP4, mají náhled a okno je pustí
runs.push(scenario('videa',async()=>{
 const media=path.join(path.resolve(__dirname,'..','..'),'web','media');const mp4=fs.readdirSync(media).filter(f=>f.endsWith('.mp4'));
 const badFiles=mp4.filter(f=>{const buf=fs.readFileSync(path.join(media,f));return buf.length<20000||buf.slice(4,8).toString()!=='ftyp'||!fs.existsSync(path.join(media,f.replace('.mp4','-poster.jpg')));});
 ok(`videa: všech ${mp4.length} souborů je platné MP4 s náhledovým obrázkem`, mp4.length>=9&&badFiles.length===0, badFiles.join(', '));
 const ctx=await b.newContext({viewport:{width:1280,height:900}});const p=await ctx.newPage();CUR=p;
 await p.goto(F);await p.waitForSelector('.startb [data-role]');await p.locator('.startb [data-role=pm]').click();await settle(p,50);
 await p.locator('[data-golesson],[data-week=l0]').first().click();await p.waitForSelector('.lpanel');
 await p.evaluate(()=>document.querySelector('[data-playvideo]').click());await p.waitForSelector('.vidov video');
 const v=await p.evaluate(()=>new Promise(r=>{const el=document.querySelector('.vidov video');const done=()=>r({src:el.currentSrc||el.querySelector('source')?.src||'',poster:el.poster,ready:el.readyState,err:el.error&&el.error.code});if(el.readyState>=1)done();else{el.addEventListener('loadedmetadata',done,{once:true});el.addEventListener('error',done,{once:true});setTimeout(done,3000);}}));
 const posterOk=await p.evaluate(src=>new Promise(r=>{const i=new Image();i.onload=()=>r(i.naturalWidth>0);i.onerror=()=>r(false);i.src=src;}),v.poster);
 ok('videa: okno s videem má zdroj a načte se náhledový obrázek', /\.mp4$/.test(v.src)&&posterOk, JSON.stringify(v));
 { /* mobil: video v okně se nespouští skriptem (iPhone ho blokuje), ukáže tlačítko a pustí se klepnutím */
  const mc=await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const mp=await mc.newPage();
  await mp.goto(F);await settle(mp,400);await mp.locator('[data-playvideo=pitch]').first().tap();await settle(mp,300);
  const before=await mp.evaluate(()=>{const v=document.querySelector('.vidov video');return {go:!!document.querySelector('.vidov .vid-go'),paused:v&&v.paused,h:v?v.getBoundingClientRect().height:0};});
  ok('videa, mobil: okno ukáže tlačítko Přehrát místo spuštění skriptem a video má výšku', before.go && before.paused && before.h>100, JSON.stringify(before));
  await mp.locator('.vidov .vid-go').tap();await mp.waitForTimeout(1200);
  ok('videa, mobil: klepnutí na Přehrát video spustí a tlačítko zmizí', await mp.evaluate(()=>{const v=document.querySelector('.vidov video');return !!v&&!v.paused&&!document.querySelector('.vidov .vid-go');}));
  await mc.close(); }
 await ctx.close();
}));
await Promise.all(runs);await Promise.all(SHOTS);await b.close();
const f=R.filter(r=>r[0]==='FAIL');
const SRC=(fs.readFileSync(path.join(DIST,'spock-user-onboarding.html'),'utf8').match(/"src": ?"([0-9a-f]+)"/)||[])[1]||'';
fs.writeFileSync(path.join(DIST,'scenare-report.json'),JSON.stringify({src:SRC,at:Date.now(),total:R.length,pass:R.length-f.length,fail:f.length,failed:f.map(r=>r[1]+(r[2]?' ('+String(r[2]).slice(0,160)+')':'')),durMs:Date.now()-T0}));
R.forEach(r=>console.log(r[0],r[1],r[2]||''));console.log(`\nCELKEM ${R.length}, PASS ${R.length-f.length}, FAIL ${f.length}`);process.exit(f.length?1:0);
})();
