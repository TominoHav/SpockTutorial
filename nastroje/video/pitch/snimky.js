// Snímky skutečné aplikace pro pitch video. Použití: node nastroje/video/pitch/snimky.js (po python3 web/build.py)
const {chromium}=require('playwright');const path=require('path');const fs=require('fs');
const ROOT=path.resolve(__dirname,'..','..','..'),DIST=path.join(ROOT,'web','dist'),OUT=path.join(DIST,'pitch');fs.mkdirSync(OUT,{recursive:true});
require(path.join(ROOT,'nastroje','e2e','fixture.js')).buildE2E();const F='file://'+path.join(DIST,'e2e.html');
const clean=p=>p.evaluate(()=>{for(const e of document.querySelectorAll('.notices,.notice,.cel,.g-bubble,.xp-pop,.xpf,.toast'))e.remove();});
(async()=>{const b=await chromium.launch();
 const ctx=await b.newContext({viewport:{width:1280,height:800},deviceScaleFactor:1.5});const p=await ctx.newPage();
 const shot=async n=>{await clean(p);await p.waitForTimeout(250);await p.screenshot({path:path.join(OUT,n+'.jpg'),type:'jpeg',quality:90});};
 await p.goto(F);await p.waitForTimeout(700);await shot('uvod');
 // simulace
 await p.locator('[data-simstart]').first().click();await p.waitForTimeout(400);
 for(const s of ['next','o-sol','o-ok']){await p.locator(`[data-sim="${s}"]`).first().click();await p.waitForTimeout(200);}
 await shot('simulace');
 await p.locator('[data-sim="close"]').first().click().catch(()=>{});await p.evaluate(()=>document.querySelector('#home-btn').click());await p.waitForTimeout(300);
 // role
 await p.evaluate(()=>{document.querySelector('.startb').scrollIntoView({block:'start'});scrollBy(0,-90);});await shot('role');
 await p.locator('.startb [data-role=pm]').click();await p.waitForTimeout(400);await p.evaluate(()=>scrollTo(0,0));await shot('rozcesti');
 // lekce s kartou
 await p.locator('.exfork [data-golesson]').click();await p.waitForSelector('.lpanel');
 await p.evaluate(()=>{const o=document.querySelector('.lpanel .lcard.cur .lc-opt');o&&o.click();});await p.waitForTimeout(300);
 await p.evaluate(()=>document.querySelector('.lpanel .lcard').scrollIntoView({block:'start'}));await p.evaluate(()=>scrollBy(0,-90));await shot('lekce');
 // Spock
 await p.evaluate(()=>document.querySelector('#home-btn').click());await p.waitForTimeout(300);
 await p.evaluate(()=>document.querySelector('[data-open-spock]').click());await p.waitForSelector('#g-in');
 await p.locator('#g-in').fill('Jak spustím task?');await p.locator('#g-send').click();await p.waitForTimeout(500);await shot('spock');
 await p.evaluate(()=>document.querySelector('#g-x').click());await p.waitForTimeout(300);
 // hra: postup a mapa
 await p.evaluate(()=>__kviz.state(S=>{S.xp=640;S.streakDays=5;}));await p.evaluate(()=>document.querySelector('#home-btn').click());await p.waitForTimeout(400);
 await p.evaluate(()=>{const m=document.querySelector('.hpcard');m&&m.scrollIntoView({block:'start'});scrollBy(0,-80);});await shot('hra');
 // dashboard
 await p.evaluate(()=>document.querySelector('[data-go=dash]').click());await p.waitForSelector('#dash .ds-tabs');await p.waitForTimeout(500);
 await p.evaluate(()=>document.querySelector('[data-dash="tab:pohyb"]').click());await p.waitForTimeout(700);await p.evaluate(()=>scrollTo(0,0));await p.waitForTimeout(300);await shot('dashboard');
 await ctx.close();
 // mobil
 const m=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});const q=await m.newPage();
 await q.goto(F);await q.waitForTimeout(500);await q.locator('.startb [data-role=pd]').click();await q.waitForTimeout(300);
 await q.evaluate(()=>document.querySelector('[data-express=on]').click());await q.waitForTimeout(300);
 await m.setOffline(true);await q.waitForTimeout(300);
 await q.evaluate(()=>{for(const e of document.querySelectorAll('.notice,.cel'))e.remove();const h=document.querySelector('.hx-brand');h&&h.scrollIntoView({block:'start'});scrollBy(0,-70);});
 await q.waitForTimeout(2500);await q.evaluate(()=>{for(const e of document.querySelectorAll('.notice,.cel,.toast'))e.remove();});await q.screenshot({path:path.join(OUT,'mobil.jpg'),type:'jpeg',quality:90});
 await b.close();console.log(fs.readdirSync(OUT).join(' '));})();
