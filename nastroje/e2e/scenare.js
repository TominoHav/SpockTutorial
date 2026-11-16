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
  for(const v of ['home','lesson','badges','map','cheat','ready']){await open(p,v);await settle(p,30);const o=await overflow(p);if(o>0)bad.push(v+' +'+o);}
  await p.evaluate(()=>document.querySelector('[data-go=dash]').click());await p.waitForSelector('#dash .ds-tabs');
  for(const t of ['lide','pohyb','ver']){await p.evaluate(t=>document.querySelector('[data-dash="tab:'+t+'"]').click(),t);await settle(p,30);const o=await overflow(p);if(o>0)bad.push('dashboard '+t+' +'+o);}
  ok(`${name}: žádná stránka ani dashboard nepřetéká do strany`, bad.length===0, bad.join(', '));
  if(scheme==='dark'){const bg=await p.evaluate(()=>getComputedStyle(document.body).backgroundColor);ok(`${name}: stránka je opravdu tmavá`, /rgb\((\d+), (\d+), (\d+)\)/.test(bg)&&bg.match(/\d+/g).slice(0,3).every(x=>+x<80), bg);}
  ok(`${name}: bez chyb v konzoli`, errs.length===0, errs.slice(0,2).join(' | '));
  await ctx.close();
 }));
}
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
 await ctx.close();
}));
await Promise.all(runs);await Promise.all(SHOTS);await b.close();
const f=R.filter(r=>r[0]==='FAIL');
const SRC=(fs.readFileSync(path.join(DIST,'spock-user-onboarding.html'),'utf8').match(/"src": ?"([0-9a-f]+)"/)||[])[1]||'';
fs.writeFileSync(path.join(DIST,'scenare-report.json'),JSON.stringify({src:SRC,at:Date.now(),total:R.length,pass:R.length-f.length,fail:f.length,failed:f.map(r=>r[1]+(r[2]?' ('+String(r[2]).slice(0,160)+')':'')),durMs:Date.now()-T0}));
R.forEach(r=>console.log(r[0],r[1],r[2]||''));console.log(`\nCELKEM ${R.length}, PASS ${R.length-f.length}, FAIL ${f.length}`);process.exit(f.length?1:0);
})();
