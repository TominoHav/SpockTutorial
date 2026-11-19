// Doplňkové snímky pro krátké video pro Ines: kroky lekce, kvíz u překážky, certifikát finále, testování kurzu.
// Použití: node nastroje/video/pitch/snimky-ines.js (po python3 web/build.py)
const {chromium}=require('playwright');const path=require('path');
const ROOT=path.resolve(__dirname,'..','..','..'),DIST=path.join(ROOT,'web','dist'),OUT=path.join(DIST,'pitch');
require(path.join(ROOT,'nastroje','e2e','fixture.js')).buildE2E();const F='file://'+path.join(DIST,'e2e.html');
const clean=p=>p.evaluate(()=>{for(const e of document.querySelectorAll('.notices,.notice,.cel,.g-bubble,.xp-pop,.xpf,.toast,#xp-pop'))e.remove();});
(async()=>{const b=await chromium.launch();
 const ctx=await b.newContext({viewport:{width:1280,height:800},deviceScaleFactor:1.5,reducedMotion:'reduce'});const p=await ctx.newPage();
 const shot=async n=>{await clean(p);await p.waitForTimeout(250);await p.screenshot({path:path.join(OUT,n+'.jpg'),type:'jpeg',quality:90});};
 await p.goto(F);await p.waitForTimeout(600);await p.locator('.startb [data-role=pm]').click();await p.waitForTimeout(300);
 // kroky lekce: praktická lekce Přípravy, karty hotové, úkol na řadě
 await p.evaluate(()=>{__kviz.state(S=>{S.unlocked={l1:true};});});await p.evaluate(()=>__kviz.open('l1'));await p.waitForTimeout(300);
 await p.evaluate(()=>{const e=document.querySelector('.pd-in-card [data-lesson="3"]');e&&e.click();});await p.waitForTimeout(300);
 await p.evaluate(()=>{document.querySelectorAll('.lstep').forEach(d=>{d.open=d.dataset.step!=='learn'});const s=document.querySelector('.lsteps');s.scrollIntoView({block:'start'});scrollBy(0,-160);});await shot('kroky');
 // kvíz u překážky
 await p.evaluate(()=>{__kviz.finish();});await p.evaluate(()=>document.querySelector('#home-btn').click());await p.waitForTimeout(300);
 await p.evaluate(()=>__kviz.open('l0'));await p.waitForTimeout(300);
 await p.evaluate(()=>{const b=[...document.querySelectorAll('.pd-in-card [data-lesson]')];b[b.length-1].click();});await p.waitForTimeout(300);
 await clean(p);await p.locator('.qlaunch [data-quiz=l0]').click();await p.waitForTimeout(500);await shot('kviz');
 await p.locator('#ses [data-sclose]').click();await p.waitForTimeout(200);
 // testování kurzu
 await p.evaluate(()=>document.querySelector('[data-go=admin]').click());await p.waitForTimeout(400);await shot('testovani');
 // finále: certifikát
 await p.evaluate(()=>document.querySelector('#home-btn').click());await p.waitForTimeout(300);
 await p.evaluate(()=>__kviz.scenes());await p.waitForTimeout(400);
 for(let i=0;i<20;i++){const k=await p.evaluate(()=>document.querySelector('#story .st-stage').className);if(/k-cert/.test(k))break;await p.locator('#story [data-st=next]').click();await p.waitForTimeout(150);}
 await p.waitForFunction(()=>{const im=document.querySelector('#story .fn-cert img');return im&&im.complete&&im.naturalWidth>0;},null,{timeout:5000}).catch(()=>{});
 await p.waitForTimeout(400);await p.screenshot({path:path.join(OUT,'certifikat.jpg'),type:'jpeg',quality:90});
 await b.close();console.log('hotovo');})();
