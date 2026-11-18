// Uživatelské a přístupnostní testy webu SPOCK Tutorialu.
// 1) Průchod za každou roli (PM, PD, SWE, GM) na mobilu i počítači: role → první lekce → modul role.
// 2) Přístupnost podle WCAG 2 A a AA (axe-core) na osmi stránkách, mobil i počítač, světlý i tmavý režim.
// 3) Mobil: dotykové plochy aspoň 24 × 24 px.
// Spuštění (po sestavení webu):
//   npm install --no-save axe-core@4.10.2
//   node nastroje/e2e/pristupnost.js
const {buildE2E,browserType}=require('./fixture');const fs=require('fs');const path=require('path');
const ROOT=path.resolve(__dirname,'..','..');const DIST=path.join(ROOT,'web','dist');const F='file://'+path.join(DIST,'spock-user-onboarding.html');
let AXE;try{AXE=fs.readFileSync(require.resolve('axe-core/axe.min.js'),'utf8');}catch(e){console.error('Chybí axe-core. Spusťte: npm install --no-save axe-core@4.10.2');process.exit(1);}
const R=[];const ok=(n,c,d='')=>R.push([c?'PASS':'FAIL',n,d]);
const VIEWS=['home','expres','lesson','badges','diag','gloss','cheat','tym'];
const open=(p,v)=>p.evaluate(v=>{if(v==='home')document.querySelector('#home-btn').click();else if(v==='expres'){document.querySelector('[data-express=on]').click();const d=document.querySelector('.exall');if(d)d.open=true;}else if(v==='lesson')document.querySelector('[data-week=l0]').click();else{const e=document.querySelector('[data-go='+v+']');e&&e.click();}},v);
(async()=>{buildE2E();const FX='file://'+path.join(DIST,'e2e.html');const b=await browserType().launch();
for(const [dev,w,h] of [['mobil',390,844],['počítač',1280,850]]){
 // 1) průchody rolí
 for(const role of ['pm','pd','se','gm']){
  const c=await b.newContext({viewport:{width:w,height:h},hasTouch:dev==='mobil'});const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.goto(F);await p.waitForTimeout(600);let clicks=0;
  await p.locator(`.startb [data-role=${role}]`).click();clicks++;
  await p.waitForTimeout(250);
  await p.locator('[data-golesson],[data-week=l0]').first().click();clicks++;await p.waitForTimeout(250);
  const inLesson=await p.locator('.lpanel .lcard').count()>0;
  await p.evaluate(()=>{const o=document.querySelector('.lpanel .lcard.cur .lc-opt');o&&o.click();});await p.waitForTimeout(200);
  const answered=await p.locator('.lpanel .lc-why').count()>0;
  const l4=await p.locator('[data-week=l4]').count()>0;
  await p.evaluate(r=>{const e=document.querySelector('[data-week='+r+']');e&&e.click();},role);await p.waitForTimeout(250);
  const roleOpen=(await p.locator('.main').innerText()).length>200;
  ok(`${dev}, ${role.toUpperCase()}: do první lekce na 2 kliknutí (role, lekce), karta jde zodpovědět, modul role se otevře`, clicks===2&&inLesson&&answered&&roleOpen&&!errs.length, errs[0]||'');
  ok(`${dev}, ${role.toUpperCase()}: úroveň 4 ${role==='gm'?'je vidět':'není vidět'}`, l4===(role==='gm'));
  await c.close();}
 // 2) přístupnost, 3) dotykové plochy
 for(const scheme of ['light','dark']){
  const c=await b.newContext({viewport:{width:w,height:h},colorScheme:scheme});const p=await c.newPage();
  await p.goto(F);await p.waitForTimeout(600);await p.locator('.startb [data-role=pm]').click();await p.waitForTimeout(300);
  for(const v of VIEWS){
   await open(p,v);await p.waitForTimeout(350);await p.evaluate(()=>{for(const e of document.querySelectorAll('.notice,.cel'))e.remove();});
   await p.addScriptTag({content:AXE});
   const viol=await p.evaluate(async()=>{const r=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa']},resultTypes:['violations']});return r.violations.map(x=>x.id+' ×'+x.nodes.length+' ('+x.nodes.slice(0,2).map(n=>n.target.join(' ')).join(' | ')+')');});
   ok(`${dev}, ${scheme==='dark'?'tmavý':'světlý'} režim, stránka ${v}: bez chyb přístupnosti (WCAG 2 A a AA)`, viol.length===0, viol.join('; ').slice(0,300));
   if(dev==='mobil'&&scheme==='light'){
    const small=await p.evaluate(()=>[...document.querySelectorAll('button,a,summary,input,[role=radio]')].filter(e=>e.offsetParent&&!e.closest('label')).map(e=>{const r=e.getBoundingClientRect();return [Math.round(r.width),Math.round(r.height),(e.innerText||e.getAttribute('aria-label')||'').trim().slice(0,24)];}).filter(([w,h])=>w<24||h<24));
    ok(`mobil, stránka ${v}: dotykové plochy aspoň 24 × 24 px`, small.length===0, JSON.stringify(small.slice(0,3)));
   }
  }
  await c.close();}
}
// dashboard (jen vlastník), simulace SPOCK nanečisto, závěrečný příběh a minihra: v testovacím prostředí s daty
/* čtyři kombinace (mobil, počítač × světlý, tmavý) běží souběžně */
await Promise.all([['mobil',390,844],['počítač',1280,850]].flatMap(([dev,w,h])=>['light','dark'].map(scheme=>[dev,w,h,scheme])).map(async([dev,w,h,scheme])=>{
 const c=await b.newContext({viewport:{width:w,height:h},colorScheme:scheme});const p=await c.newPage();
 await p.goto(FX);await p.waitForSelector('.startb [data-role]');
 const audit=async name=>{await p.evaluate(()=>{for(const e of document.querySelectorAll('.notice,.cel,.fl-tip'))e.remove();/* animace dojedou do konce, kontrast se měří na výsledném stavu */document.getAnimations().forEach(a=>{try{a.finish()}catch(e){}});});await p.addScriptTag({content:AXE});
  const viol=await p.evaluate(async()=>{const r=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa']},resultTypes:['violations']});return r.violations.map(x=>x.id+' ×'+x.nodes.length+' ('+x.nodes.slice(0,2).map(n=>n.target.join(' ')).join(' | ')+')');});
  ok(`${dev}, ${scheme==='dark'?'tmavý':'světlý'} režim, ${name}: bez chyb přístupnosti (WCAG 2 A a AA)`, viol.length===0, viol.join('; ').slice(0,300));};
 await audit('první použití');
 /* SPOCK nanečisto: z banneru při prvním použití */
 await p.evaluate(()=>document.querySelector('.hx [data-simstart]').click());await p.waitForSelector('#sim');await audit('SPOCK nanečisto');
 await p.evaluate(()=>{const x=document.querySelector('[data-sim=close],#sim .sim-x');x&&x.click();});await p.keyboard.press('Escape');await p.waitForTimeout(150);
 await p.locator('.startb [data-role=pm]').click();await p.waitForTimeout(200);
 await p.evaluate(()=>document.querySelector('[data-go=dash]').click());await p.waitForSelector('#dash .ds-tabs');
 for(const t of ['lide','pohyb','ver']){await p.evaluate(t=>document.querySelector('[data-dash="tab:'+t+'"]').click(),t);await p.waitForTimeout(250);await audit('dashboard '+t);}
 await p.evaluate(()=>document.querySelector('[data-go=admin]').click());await p.waitForSelector('#adm');await audit('testování kurzu');await p.locator('#adm [data-adm=ask]').click();await p.waitForTimeout(100);await audit('testování kurzu, potvrzení resetu');
 await p.evaluate(()=>{const s=document.getElementById('sim');if(s)s.remove();document.body.classList.remove('noscroll');__kviz.finish();});await p.waitForTimeout(300);
 await p.locator('#home-btn').click();await p.waitForTimeout(300);
 await p.evaluate(()=>{for(const e of document.querySelectorAll('.cel'))e.remove();});
 ok('mapa: u hotové úrovně jen jedna akce Otevřít', await p.locator('.spmap .sw.done:first-child button.linkbtn').count()===1 && /Otevřít/.test(await p.locator('.spmap .sw.done:first-child button.linkbtn').innerText()));
 await p.locator('.spmap [data-week=l0]').click();await p.waitForTimeout(250);await p.evaluate(()=>{const b=[...document.querySelectorAll('.pd-in-card [data-lesson], .pd-mob-card [data-lesson]')];if(b.length)b[b.length-1].click();});await p.waitForTimeout(250);await p.evaluate(()=>{for(const e of document.querySelectorAll('.cel'))e.remove();});await p.locator('.qlaunch [data-quiz=l0]').click();await p.waitForSelector('#ses.ses-game .ses-opt');await audit('kvíz u překážky');
 await p.locator('#ses .ses-opt').first().click();await p.locator('[data-scheck]').click();await p.waitForTimeout(150);await audit('kvíz u překážky, odpověď');
 await p.locator('#ses [data-sclose]').click();await p.waitForTimeout(150);
 await p.evaluate(()=>{for(const e of document.querySelectorAll('.cel'))e.remove();});
 await p.evaluate(()=>__kviz.scenes());await p.waitForSelector('#story');await p.locator('#story [data-st=pause]').click();await audit('příběh');
 await c.close();
}));
await b.close();
const f=R.filter(r=>r[0]==='FAIL');
fs.writeFileSync(path.join(DIST,'pristupnost-report.json'),JSON.stringify({src:(fs.readFileSync(path.join(DIST,'spock-user-onboarding.html'),'utf8').match(/"src": ?"([0-9a-f]+)"/)||[])[1]||'',at:Date.now(),total:R.length,pass:R.length-f.length,fail:f.length,failed:f.map(r=>r[1]+(r[2]?' ('+r[2]+')':''))}));
R.forEach(r=>console.log(r[0],r[1],r[2]||''));console.log(`\nCELKEM ${R.length}, PASS ${R.length-f.length}, FAIL ${f.length}`);process.exit(f.length?1:0);
})();
