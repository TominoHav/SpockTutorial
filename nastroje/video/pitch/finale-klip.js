// Nahraje krátký klip skutečného finále aplikace (Setkání se Spockem a medaile absolventa) pro náznak v pitch videu.
// Použití: node nastroje/video/pitch/finale-klip.js  →  web/dist/pitch/finale.mp4
const {chromium}=require('playwright');const path=require('path');const fs=require('fs');const {execFileSync}=require('child_process');
const ROOT=path.resolve(__dirname,'..','..','..'),DIST=path.join(ROOT,'web','dist'),OUT=path.join(DIST,'pitch'),VD=path.join(OUT,'klip');
require(path.join(ROOT,'nastroje','e2e','fixture.js')).buildE2E();fs.rmSync(VD,{recursive:true,force:true});fs.mkdirSync(VD,{recursive:true});
(async()=>{const b=await chromium.launch();
 const ctx=await b.newContext({viewport:{width:1280,height:720},recordVideo:{dir:VD,size:{width:1280,height:720}}});const p=await ctx.newPage();const t0=Date.now();
 await p.goto('file://'+path.join(DIST,'e2e.html'));await p.waitForSelector('.startb [data-role]');await p.locator('.startb [data-role=pm]').click();
 await p.evaluate(()=>{__kviz.state(S=>{S.xp=1780;});__kviz.finish();});await p.waitForTimeout(300);
 await p.evaluate(()=>{for(const e of document.querySelectorAll('.cel,.notices,.notice'))e.remove();const x=document.createElement('button');x.dataset.story='';x.hidden=true;document.body.append(x);x.click();});
 await p.waitForSelector('#story');await p.evaluate(()=>{const s=document.querySelector('[data-st=snd]');if(s&&s.getAttribute('aria-pressed')==='true')s.click();});
 // na scénu Setkání se Spockem
 for(let i=0;i<20;i++){const h=await p.locator('#story .st-cap h2').innerText().catch(()=>'');if(/Setkání se Spockem/.test(h))break;await p.evaluate(()=>{const n=document.querySelector('[data-st=next]');n&&n.click();});await p.waitForTimeout(120);}
 await p.evaluate(()=>{const b=document.querySelector('[data-st=pause]');if(b&&/Pozastavit/.test(b.textContent))b.click();});
 const a=(Date.now()-t0)/1000;await p.waitForTimeout(3600);
 await p.evaluate(()=>{const n=document.querySelector('[data-st=next]');n&&n.click();});await p.evaluate(()=>{const b=document.querySelector('[data-st=pause]');if(b&&/Pozastavit/.test(b.textContent))b.click();});
 await p.waitForTimeout(3000);const z=(Date.now()-t0)/1000;
 const vp=await p.video().path();await ctx.close();await b.close();
 execFileSync('ffmpeg',['-v','error','-y','-ss',String(a+0.2),'-to',String(z),'-i',vp,'-r','25','-c:v','libx264','-crf','18','-pix_fmt','yuv420p','-an',path.join(OUT,'finale.mp4')]);
 fs.rmSync(VD,{recursive:true,force:true});console.log('finale.mp4',(z-a-0.2).toFixed(1)+' s');})();
