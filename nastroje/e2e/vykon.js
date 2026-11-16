// Výkonnostní test webu SPOCK Tutorialu s rozpočty. Když se některý překročí, test selže.
// Spuštění (po sestavení webu): node nastroje/e2e/vykon.js
// Rozpočty jsou volné schválně: mají chytit zhoršení o desítky procent, ne kolísání stroje.
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');const zlib=require('zlib');
const ROOT=path.resolve(__dirname,'..','..');const DIST=path.join(ROOT,'web','dist');const FILE=path.join(DIST,'spock-user-onboarding.html');
const BUDGET={htmlKB:700, gzipKB:230, fcpMs:1500, lessonMs:150, viewMs:200, idleCalmMs:100, domNodes:900};
const R=[];const ok=(n,val,max,unit)=>R.push([val<=max?'PASS':'FAIL',n,`${val} ${unit} (rozpočet ${max} ${unit})`,val,max]);
const med=a=>{a=a.slice().sort((x,y)=>x-y);return a[Math.floor(a.length/2)];};
(async()=>{
 const html=fs.readFileSync(FILE);
 ok('velikost stránky',Math.round(html.length/1024),BUDGET.htmlKB,'kB');
 ok('velikost stránky po kompresi (gzip)',Math.round(zlib.gzipSync(html).length/1024),BUDGET.gzipKB,'kB');
 const b=await chromium.launch();const fcp=[],lesson=[],views=[];let dom=0,calm=0;
 for(let i=0;i<3;i++){
  const c=await b.newContext({viewport:{width:390,height:850}});const p=await c.newPage();const s=await c.newCDPSession(p);await s.send('Performance.enable');
  await p.goto('file://'+FILE);await p.waitForTimeout(900);
  fcp.push(await p.evaluate(()=>{const f=performance.getEntriesByName('first-contentful-paint')[0];return Math.round(f?f.startTime:0);}));
  await p.locator('.startb [data-role=pm]').click();await p.waitForTimeout(300);
  lesson.push(await p.evaluate(()=>{const t=performance.now();document.querySelector('[data-week=l0]').click();document.body.offsetHeight;return Math.round(performance.now()-t);}));
  for(const v of ['badges','map','cheat']) views.push(await p.evaluate(v=>{const t=performance.now();document.querySelector('[data-go='+v+']').click();document.body.offsetHeight;return Math.round(performance.now()-t);},v));
  dom=Math.max(dom,await p.evaluate(()=>document.querySelectorAll('*').length));
  if(i===0){ // nečinnost: po 15 s se dekorativní animace mají pozastavit
   await p.locator('#home-btn').click();await p.waitForTimeout(16500);
   const g=(m,n)=>m.find(x=>x.name===n).value;const m0=(await s.send('Performance.getMetrics')).metrics;await p.waitForTimeout(5000);const m1=(await s.send('Performance.getMetrics')).metrics;
   calm=Math.round((g(m1,'TaskDuration')-g(m0,'TaskDuration'))*1000);
  }
  await c.close();}
 await b.close();
 ok('první vykreslení stránky (medián)',med(fcp),BUDGET.fcpMs,'ms');
 ok('vykreslení lekce (medián)',med(lesson),BUDGET.lessonMs,'ms');
 ok('vykreslení stránek opory (nejhorší)',Math.max(...views),BUDGET.viewMs,'ms');
 ok('procesor po 15 s nečinnosti za 5 s',calm,BUDGET.idleCalmMs,'ms');
 ok('počet prvků na stránce (nejvíc)',dom,BUDGET.domNodes,'prvků');
 const f=R.filter(r=>r[0]==='FAIL');
 fs.writeFileSync(path.join(DIST,'vykon-report.json'),JSON.stringify({src:(fs.readFileSync(path.join(DIST,'spock-user-onboarding.html'),'utf8').match(/"src": ?"([0-9a-f]+)"/)||[])[1]||'',at:Date.now(),total:R.length,pass:R.length-f.length,fail:f.length,failed:f.map(r=>r[1]+': '+r[2]),mereni:R.map(r=>({co:r[1],hodnota:r[3],rozpocet:r[4]}))}));
 R.forEach(r=>console.log(r[0],r[1]+':',r[2]));console.log(`\nCELKEM ${R.length}, PASS ${R.length-f.length}, FAIL ${f.length}`);process.exit(f.length?1:0);
})();
