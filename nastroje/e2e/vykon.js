// Výkonnostní test webu SPOCK Tutorialu s rozpočty. Když se některý překročí, test selže.
// Spuštění (po sestavení webu): node nastroje/e2e/vykon.js
// Rozpočty jsou volné schválně: mají chytit zhoršení o desítky procent, ne kolísání stroje.
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');const zlib=require('zlib');
const ROOT=path.resolve(__dirname,'..','..');const DIST=path.join(ROOT,'web','dist');const FILE=path.join(DIST,'spock-user-onboarding.html');
const BUDGET={htmlKB:700, gzipKB:230, fcpMs:1500, lessonMs:150, viewMs:200, idleCalmMs:100, domNodes:900, dashMs:600, dashFilterMs:300, dashDom:2500};
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

 // dashboard vlastníka pod zátěží: 500 smyšlených lidí po 600 krocích (očekávaný počet uživatelů)
 {
  const N=500, gen=`<script>(function(){var L=['home','l0/0.1','l0/0.2','l0/0.3','l0/0.4','l1/1.1','l1/1.2','l1/1.3','map','diag','badges','cheat','pm/2P.1','pm/2P.2'];var db={},s=7;function rnd(){s=(s*16807)%2147483647;return s/2147483647}for(var u=0;u<${N};u++){var t=Date.now()-rnd()*20*864e5,e=[],ses=[];for(var i=0;i<600;i++){if(i%40===0){t+=36e5+rnd()*864e5;ses.push([t,t+9e5,600]);e.push([t,'návštěva','mobil'])}t+=5e3+rnd()*12e4;var r=rnd();if(r<.5)e.push([t,'view',L[(rnd()*L.length)|0]]);else if(r<.8)e.push([t,'klik','karta l0.0.'+(i%5)]);else if(r<.9)e.push([t,'karta','l0.0.'+(i%5)+(rnd()<.3?' špatně':' správně')]);else if(r<.93)e.push([t,'opakovaný klik','modul l1']);else e.push([t,'zamčeno','l3'])}db['track/u'+u]={v:1,first:e[0][0],last:t,visits:{},secs:{},dev:{mobile:u%2==0},role:['pm','pd','se','gm'][u%4],prog:{xp:100,pct:30,loc:'l0/0.2',mods:{}},ses:ses,ev:e,pv:{},tm:{},clicks:{},locked:{},quiz:{},perf:{load:[],fcp:[],render:[],errs:[]},spock:{n:0,tin:0,tout:0,ms:[],err:0}}}
var fdb={doc:function(p){return {get:async function(){return {exists:p in db,data:function(){return db[p]}}},set:async function(d){db[p]=d}}},collection:function(p){var q={limit:function(){return q},get:async function(){return {docs:Object.keys(db).filter(function(k){return k.indexOf(p+'/')===0}).map(function(k){return {id:k.split('/')[1],data:function(){return db[k]}}})}}};return q}};
var fu={me:async function(){return {id:'u_ja',isOwner:true,canEdit:true}},profiles:async function(ids){var o={};ids.forEach(function(i){o[i]={name:'Člověk '+i}});return o}};window.claude={use:async function(n){return n==='db'?fdb:n==='user'?fu:null}};})();</script>`;
  const DF=path.join(DIST,'vykon-dashboard.html');fs.writeFileSync(DF,'<!doctype html><html><head><meta charset="utf-8">'+gen+'</head><body>'+html.toString('utf8')+'</body></html>');
  const p=await b.newPage({viewport:{width:1280,height:900}});await p.goto('file://'+DF);await p.waitForTimeout(800);
  await p.locator('.startb [data-role=pm]').click();await p.waitForTimeout(300);
  await p.evaluate(()=>document.querySelector('[data-go=dash]').click());await p.waitForFunction(()=>document.querySelector('#dash .ds-tabs'),null,{timeout:60000});
  const t=sel=>p.evaluate(s=>{const t0=performance.now();document.querySelector(s).click();document.body.offsetHeight;return Math.round(performance.now()-t0)},sel);
  const tabs=[await t('[data-dash="tab:pohyb"]')];await t('[data-dash="tab:lide"]');tabs.push(await t('[data-dash="tab:pohyb"]'));
  const filt=Math.max(await t('[data-dash="frole:pm"]'),await t('[data-dash="frole:"]'),await t('[data-dash^="fplace:"]'));
  const ddom=await p.evaluate(()=>document.querySelectorAll('#dash *').length);
  ok('dashboard s 500 lidmi: záložka Pohyb (nejhorší ze 2)',Math.max(...tabs),BUDGET.dashMs,'ms');
  ok('dashboard s 500 lidmi: filtr a výběr místa (nejhorší)',filt,BUDGET.dashFilterMs,'ms');
  ok('dashboard s 500 lidmi: počet prvků',ddom,BUDGET.dashDom,'prvků');
  await p.close();
 }
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
