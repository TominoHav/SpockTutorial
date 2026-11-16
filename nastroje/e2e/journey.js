// End-to-end test webu SPOCK Tutorialu: projde cestu uživatele na počítači i na mobilu.
// Spuštění (potřebuje Node.js a Playwright s Chromiem):
//   python3 web/parse.py && python3 web/build.py && node nastroje/e2e/journey.js
// Chat se Spockem je nahrazený zkušební odpovědí, nic se neodesílá ven.
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const ROOT=path.resolve(__dirname,'..','..');const DIST=path.join(ROOT,'web','dist');
const html=fs.readFileSync(path.join(DIST,'spock-user-onboarding.html'),'utf8');
for(const f of fs.readdirSync(path.join(ROOT,'web','media')))fs.copyFileSync(path.join(ROOT,'web','media',f),path.join(DIST,f));
const stub=`<script>window.__sent=[];window.__db={'track/u_novak':(function(){var t=Date.now()-3e8,e=[],v=function(d,ty,k){t+=d;e.push([t,ty,k])};v(0,'návštěva','mobil');v(1e3,'view','home');v(4e4,'view','l0/0.1');v(9e4,'karta','l0.0.0 špatně');v(6e4,'karta','l0.0.1 správně');v(4e4,'view','map');v(2e4,'view','l0/0.1');v(2e4,'view','map');v(1.5e4,'view','l0/0.1');v(3e5,'view','l0/0.2');v(1e3,'klik','modul l1');v(500,'zamčeno','l1');v(400,'opakovaný klik','modul l1');v(2e4,'view','l0/0.2');t+=4e6;v(0,'návštěva','mobil');v(1e3,'view','home');v(3e4,'view','l0/0.2');v(5e4,'karta','l0.1.0 špatně');v(4e4,'karta','l0.1.1 špatně');return {v:1,first:Date.now()-3e8,last:t,visits:{},secs:{},dev:{mobile:true},role:'pd',prog:{xp:40,pct:5,loc:'l0/0.2',mods:{}},ses:[],ev:e,pv:{},tm:{},clicks:{},locked:{l1:1},quiz:{},perf:{load:[],fcp:[],render:[],errs:[]},spock:{n:0,tin:0,tout:0,ms:[],err:0}}})(),'track/u_kolega':{v:1,first:Date.now()-9e8,last:Date.now()-5e8,visits:{'2026-11-01':2},secs:{'2026-11-01':900},dev:{mobile:true,w:390,h:844},role:'pm',prog:{xp:120,pct:12,loc:'l0/0.2',mods:{l0:[9,31,1,4,0,9,22]}},pv:{'l0/0.1':3,'l0/0.2':2},tm:{'l0/0.1':600},clicks:{'modul l0':2,'modul l3':1},locked:{l3:1},quiz:{},wrong:['l0.0.1','l0.1.0'],perf:{load:[820],fcp:[640],render:[12],size:480000,errs:[]},spock:{n:2,tin:30000,tout:400,ms:[2100,3400],err:0},ses:[[Date.now()-5e8,Date.now()-5e8+7.2e5,600],[Date.now()-6e8,Date.now()-6e8+3e5,300]],ev:[[Date.now()-5e8,'view','l0/0.2']]},'feedback/u_kolega':{items:[{id:'f1',at:Date.now()-5e8,loc:'l0/0.2',where:'Poznejte SPOCK › 0.2',kind:'nejasne',text:'Nerozumím rozdílu Q a G brány.',fix:'Přidat příklad.',role:'pm'}]}};
const __fdb={doc:p=>({id:p.split('/').pop(),path:p,get:async()=>({id:p.split('/').pop(),exists:p in window.__db,data:()=>window.__db[p]}),set:async d=>{window.__db[p]=JSON.parse(JSON.stringify(d))}}),collection:p=>{const q={limit:()=>q,get:async()=>{const docs=Object.keys(window.__db).filter(k=>k.startsWith(p+'/')&&k.slice(p.length+1).indexOf('/')<0).map(k=>({id:k.slice(p.length+1),exists:true,data:()=>window.__db[k]}));return {docs,size:docs.length,empty:!docs.length}}};return q}};
const __fuser={me:async()=>({id:'u_ja',name:'Já',isOwner:true,canEdit:true}),id:async()=>'u_ja',isOwner:async()=>true,profiles:async ids=>Object.fromEntries(ids.map(i=>[i,{id:i,name:i==='u_ja'?'Já Vlastník':'Kolega Testovací'}]))};
window.claude={use:async n=>{if(n==='db')return __fdb;if(n==='user')return __fuser;if(n!=='sample')return null;const f=async(msgs,o)=>{window.__sent.push(msgs);await new Promise(r=>setTimeout(r,50));return {text:'Task spustíte přes **Command Palette**: Tasks: Run Task.',truncated:false};};f.limits=async()=>({tools:false});return f;}};</script>`;
fs.writeFileSync(path.join(DIST,'e2e.html'),'<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'+stub+'</head><body style="margin:0">'+html+'</body></html>');
const T0=Date.now();const LAB={};let CTX=null,SRC='';const R=[];const ok=(n,c,d='')=>{R.push([c?'PASS':'FAIL',n,d]);};
(async()=>{const b=await chromium.launch();
for (const [W,H,tag] of [[1280,900,'počítač'],[390,844,'mobil']]){
 const ctx=await b.newContext({viewport:{width:W,height:H}});await ctx.grantPermissions(['clipboard-read','clipboard-write']);
 // Bez zápisů do úložiště z testu: zápis z testu během obnovení stránky v Chromiu soupeří s ukládáním stránky.
 const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
 const st=()=>p.evaluate(()=>JSON.parse(localStorage.getItem('spock-user-onboarding-v1')||'{}'));
 const dismiss=async()=>{for(let i=0;i<8;i++){const c=p.locator('.cel-go');if(await c.count()){await c.first().click();await p.waitForTimeout(80);}else break;}};
 const checkNext=async()=>{await dismiss();await p.evaluate(()=>{const e=document.querySelector('.lpanel input[data-todo]:not(:checked)');if(e){e.scrollIntoView({block:'center'});e.click();}});await p.waitForTimeout(150);await dismiss();};
 const ov=async()=>p.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
 await p.goto('file://'+path.join(DIST,'e2e.html'));await p.waitForTimeout(400);
 const T=s=>tag+': '+s;
 LAB[tag]={load:await p.evaluate(()=>{const n=performance.getEntriesByType('navigation')[0];return n?Math.round(n.domContentLoadedEventEnd):null})};
 SRC=await p.evaluate(()=>__kviz.build().src);
 ok(T('nováček vidí úvod „Seznamte se se SPOCKem“'), await p.locator('.hx-first h1').innerText().then(t=>t.includes('Seznamte')));
 ok(T('úvod: na mobilu jeden sloupec, na počítači dva'), (await p.evaluate(()=>getComputedStyle(document.querySelector('.hx-first')).gridTemplateColumns.split(' ').length))===(W>980?2:1));
 // simulace
 await p.locator('.hx [data-simstart]').click();
 for(const s of ['next','o-sol','o-ok','sign','load','sign','next','sol-1','why-2','sign','mvp-0','sign','sign','sign','trace']){await p.locator(`[data-sim="${s}"]`).first().click();await p.waitForTimeout(60);}
 ok(T('simulace prošla všech 7 fází až k iniciativě'), await p.locator('.sim-done').count()===1);
 ok(T('stopa tvrzení ukazuje 4 kroky'), await p.locator('.sim-trace li').count()===4);
 await p.locator('[data-sim=finish]').click();await p.waitForTimeout(200);await dismiss();
 ok(T('odznak Pilot nanečisto a 30 XP'), (await st()).badges['got.sim'] && (await st()).xp===30);
 ok(T('bez role: cesta končí úrovní 3, odznak Superuser se nenabízí'), await p.evaluate(()=>!__kviz.path().includes('l4') && !__kviz.badges().includes('superuser') && __kviz.badges().includes('path')));
 ok(T('bez role GM není úroveň 4 nikde vidět'), await p.locator('[data-week=l4]').count()===0 && !(await p.locator('body').innerText()).includes('Superuser'));
 // role
 await p.locator('.startb [data-role=gm]').click();await p.waitForTimeout(200);
 ok(T('hlášky se ukazují po jedné'), await p.locator('.notice').count()===1);
 await p.locator('.notice',{hasText:'Na palubě'}).waitFor({timeout:15000}).catch(()=>{});
 ok(T('výběr role → upozornění na odznak Na palubě, bez překrytí obrazovky'), (await p.locator('.notice').allInnerTexts()).some(t=>t.includes('Na palubě')) && !(await p.locator('.cel').count()));await dismiss();
 ok(T('po výběru role „Vítejte zpět“'), (await p.locator('.hx .eyebrow').first().innerText()).toLowerCase().includes('zpět'));
 ok(T('po výběru role jsou na úvodu tři denní výzvy'), await p.locator('.quests li').count()===3);
 // lekce 0.1 – karty a úkoly
 const answerCards=async()=>{let g=0;while(g++<40){await dismiss();const n=await p.evaluate(()=>{const e=document.querySelector('.lpanel .lcard.cur .lc-opt:not([disabled])');if(!e)return 0;e.scrollIntoView({block:'center'});e.click();return 1;});if(!n)break;await p.waitForTimeout(90);}await dismiss();};
 const lessonHead=()=>p.evaluate(()=>(document.querySelector('.lp-head')||{}).innerText||'');
 const doLesson=async()=>{const h0=(await lessonHead()).slice(0,6);await answerCards();let guard=0;while((await lessonHead()).slice(0,6)===h0 && await p.locator('.lpanel input[data-todo]:not(:checked)').count() && guard++<12){await p.evaluate(()=>{const e=document.querySelector('.lpanel input[data-todo]:not(:checked)');if(e){e.scrollIntoView({block:'center'});e.click();}});await p.waitForTimeout(150);}await dismiss();};
 await p.locator('[data-golesson], [data-week=l0]').first().click();await p.waitForTimeout(250);
 ok(T('lekce 0.1 začíná první kartou, další jsou skryté'), await p.locator('.lpanel .lcard').count()===1 && await p.locator('.lpanel .lc-opt').count()>1);
 ok(T('úkol s videem má tlačítko, které video pustí v okně'), await (async()=>{const bt=p.locator('.lpanel [data-playvideo]');if(!(await bt.count()))return false;await bt.first().click();await p.waitForTimeout(200);const n=await p.locator('.vidov video').count();await p.locator('.vidov-x').click();return n===1 && !(await p.locator('.vidov').count());})());
 ok(T('karta má štítek „jen na webu“'), (await p.locator('.lpanel').first().innerText()).toLowerCase().includes('jen na webu'));
 const x0=(await st()).xp;await p.evaluate(()=>document.querySelector('.lpanel .lcard.cur .lc-opt').click());await p.waitForTimeout(150);await dismiss();
 ok(T('odpověď ukáže vysvětlení a otevře další kartu'), await p.locator('.lpanel .lc-why').count()===1 && await p.locator('.lpanel .lcard').count()===2, 'XP '+x0+' → '+(await st()).xp);
 const nb=await p.locator('.lpanel input[data-todo]').count();
 await doLesson();
 const s1=await st();ok(T(`lekce 0.1: karty zodpovězené, ${nb} úkoly odškrtnuté, lekce hotová`), s1.got['lesson.l0.0']===true, 'karet '+Object.keys(s1.cards||{}).length+', XP '+s1.xp);
 ok(T('po lekci se otevře lekce 0.2'), (await p.locator('.lp-head, .lpanel').first().innerText()).includes('0.2'));
 ok(T('po dokončení lekce je vidět začátek další lekce'), await p.evaluate(()=>{const t=document.getElementById('lpanel').getBoundingClientRect().top;return t>=0 && t<200}), 'top '+await p.evaluate(()=>Math.round(document.getElementById('lpanel').getBoundingClientRect().top)));
 ok(T('vysvětlivky pojmů v lekci'), await p.locator('.lpanel .gl').count()>0);
 // dokončit celý modul l0
 for(let li=1;li<4;li++){await dismiss();await p.evaluate(li=>{const e=document.querySelector(`.pd-in-card [data-lesson="${li}"], .pd-mob-card [data-lesson="${li}"]`);e&&e.click()},li);await p.waitForTimeout(120);await doLesson();}
 const s1b=await st();ok(T('všechny 4 lekce úrovně 0 hotové jen na webu'), [0,1,2,3].every(i=>s1b.got['lesson.l0.'+i]), Object.keys(s1b.got).filter(k=>k.startsWith('lesson.l0')).join(','));
 // kvíz: před kartami zamčený (ověřeno na modulu Příprava), po kartách losuje 5 otázek
 const runQuiz=async(wid,good)=>{await dismiss();await p.evaluate(w=>document.querySelector(`.qlaunch [data-quiz="${w}"]`).click(),wid);await p.waitForTimeout(100);let g=0,seen=[];
   while(await p.locator('#ses').count() && g++<40){
     const key=await p.evaluate(()=>(S=>S.items[S.qs[S.i]])(__kviz.ses()).key);const bad=!good && !seen.includes(key);seen.push(key);
     const pick=await p.evaluate(bad=>{const it=(S=>S.items[S.qs[S.i]])(__kviz.ses());return bad?(it.a+1)%it.o.length:it.a},bad);
     await p.locator('.ses-opt').nth(pick).click();await p.locator('[data-scheck]').click();await p.waitForTimeout(40);
     await p.locator('[data-snext]').click();await p.waitForTimeout(40);}
   return seen;};
 const sz=await p.evaluate(()=>__kviz.pool('l0'));
 const k1=await runQuiz('l0',false);
 ok(T('kvíz losuje 5 otázek ze zásoby '+sz+', špatné odpovědi se opakují'), new Set(k1).size===5 && k1.length>5, k1.length+' kroků');
 ok(T('s chybami kvíz nesplněný'), !(await st()).qpass?.l0 && (await p.locator('.cel-card').innerText()).includes('nesplněný'));
 await dismiss();
 const k2=await runQuiz('l0',true);
 ok(T('opakovaný kvíz má jiný výběr nebo pořadí'), k1.slice(0,5).join()!==k2.join(), k2.join(' '));
 ok(T('kvíz modulu dokončen (správně napoprvé)'), !!(await st()).qpass?.l0, JSON.stringify((await st()).qpass||{}));
 await dismiss();
 const s2=await st();ok(T('modul Poznejte SPOCK hotový (100 %) a odznaky'), s2.got['module.l0']===true, `XP ${s2.xp}, odznaky ${Object.keys(s2.badges).filter(k=>k.startsWith('got.')).length}`);
 await p.evaluate(()=>document.querySelector('[data-week=l1]').click());await p.waitForTimeout(150);
 ok(T('kvíz Přípravy je před kartami zamčený'), await p.locator('.qlaunch [data-quiz][disabled]').count()===1);
 // praktická lekce: nejdřív práce ve VS Code, úkol se odškrtne až ověřením
 await p.evaluate(()=>{const e=document.querySelector('.pd-in-card [data-lesson="1"], .pd-mob-card [data-lesson="1"]');e&&e.click()});await p.waitForTimeout(150);
 ok(T('praktická lekce začíná prací ve VS Code, karty jsou až potom'), await p.evaluate(()=>{const h=[...document.querySelectorAll('.lpanel .blk h4')].map(x=>x.innerText);return h.length>=2 && /Vyzkoušejte ve SPOCKu/i.test(h[0]) && /Proč to tak je/i.test(h[1])}));
 const pk=await p.evaluate(()=>{const b=document.querySelector('.lpanel .tchk.proof [data-proof]');return b?b.dataset.proof.split(':')[0]:''});
 ok(T('úkol s ověřením nejde odškrtnout bez odpovědi'), !!pk && await p.evaluate(k=>document.getElementById('t-'+k.replace(/\./g,'-')).disabled,pk));
 const pa=await p.evaluate(k=>{const [w,d,t]=k.split('.');return __kviz.check(w,+d,+t)},pk);
 await p.evaluate(([k,a])=>document.querySelector(`[data-proof="${k}:${(a+1)%3}"]`).click(),[pk,pa]);await p.waitForTimeout(150);
 ok(T('špatné ověření úkol neodškrtne a napoví'), !(await st()).todo[pk] && (await p.locator('.lpanel .tchk .lc-why.bad').count())===1);
 await p.evaluate(([k,a])=>document.querySelector(`[data-proof="${k}:${a}"]`).click(),[pk,pa]);await p.waitForTimeout(200);await dismiss();
 ok(T('správné ověření úkol odškrtne'), (await st()).todo[pk]===true && (await st()).proof[pk]===pa);
 ok(T('Příprava se odemkla'), await p.evaluate(()=>!document.querySelector('.pd-s.c-pink:nth-child(2).st-lock')));
 // zamčený modul a skokový test
 await p.evaluate(()=>document.querySelector('[data-week=l3]').click());await p.waitForTimeout(150);
 ok(T('zamčený modul ukáže kartu se skokovým testem'), await p.locator('[data-jump]').count()>0);
 await p.locator('[data-jump]').first().click();await p.waitForTimeout(100);
 for(let g=0;g<6 && await p.locator('#ses').count();g++){const pick=await p.evaluate(()=>{const it=(S=>S.items[S.qs[S.i]])(__kviz.ses());return (it.a+1)%it.o.length});await p.locator('.ses-opt').nth(pick).click();await p.locator('[data-scheck]').click();await p.locator('[data-snext]').click();await p.waitForTimeout(40);}
 ok(T('skokový test: dvě chyby a konec, modul zůstane zamčený'), (await p.locator('.cel-card').innerText()).includes('nevyšel') && !(await st()).unlocked?.l3);
 await dismiss();
 await p.locator('[data-peek]').first().click().catch(()=>{});await p.waitForTimeout(120);
 ok(T('náhled zamčeného modulu otevře lekce'), await p.locator('.lpanel').count()>0);
 // GM lekce 2G.6 se schématem
 await p.evaluate(()=>document.querySelector('[data-week=gm]').click());await p.waitForTimeout(150);
 await p.locator('[data-peek]').first().click().catch(()=>{});await p.waitForTimeout(120);
 await p.evaluate(()=>{const e=document.querySelector('.pd-in-card [data-lesson="5"], .pd-mob-card [data-lesson="5"]');e&&e.click()});await p.waitForTimeout(150);
 ok(T('GM 2G.6: schéma architektury v první kartě'), await p.locator('.lpanel .lcard .archfig svg').count()===1);
 // volitelná příručka 1b se nezamyká
 await p.evaluate(()=>document.querySelector('[data-week=l1b]').click());await p.waitForTimeout(150);
 ok(T('příručka Fáze do hloubky je volitelná a otevřená'), !(await p.locator('[data-jump]').count()) && await p.locator('.lpanel .lcard').count()>0);
 // průchod všemi moduly včetně příručky a modulů jiných rolí: přepínač lekcí, karty, přetečení
 await p.evaluate(()=>document.querySelector('#home-btn').click());await p.waitForTimeout(100);
 const mods=await p.evaluate(()=>__kviz.mods());const miss=[],ovf=[];
 for(const m of mods){await dismiss();
  const nav=await p.evaluate(id=>{const e=document.querySelector(`.rail [data-week="${id}"]`)||document.querySelector(`[data-week="${id}"]`);if(!e)return 0;e.click();return 1},m.id);
  if(!nav){miss.push(m.id+': chybí v menu');continue;}
  await p.waitForTimeout(80);await p.evaluate(()=>{const e=document.querySelector('[data-peek]');e&&e.click()});await p.waitForTimeout(60);
  for(let li=0;li<m.lessons;li++){await dismiss();
   const sw=await p.evaluate(li=>{const e=[...document.querySelectorAll(`.pd-in-card [data-lesson="${li}"], .pd-mob-card [data-lesson="${li}"]`)].find(x=>x.offsetParent!==null);if(!e)return 0;e.click();return 1},li);
   if(!sw){miss.push(m.id+': chybí přepínač lekce '+(li+1));break;}
   await p.waitForTimeout(40);
   for(let g=0;g<30;g++){await dismiss();const k=await p.evaluate(()=>{const e=document.querySelector('.lpanel .lcard.cur .lc-opt:not([disabled])');if(!e)return 0;e.click();return 1});if(!k)break;await p.waitForTimeout(25);}
   const o=await ov();if(o>0)ovf.push(m.id+' '+(li+1)+' +'+o);}}
 await dismiss();
 const sc=await st();const tot=mods.reduce((n,m)=>n+m.cards,0);
 ok(T('všech '+mods.length+' modulů je v menu a má přepínač lekcí'), miss.length===0, miss.join(' | '));
 ok(T('všechny karty všech modulů jdou zodpovědět'), Object.keys(sc.cards||{}).length===tot, Object.keys(sc.cards||{}).length+' z '+tot);
 ok(T('žádná lekce nepřetéká do strany'), ovf.length===0, ovf.join(', '));
 // opora
 for(const v of ['map','diag','cheat','gloss','badges','ready']){await p.evaluate(v=>{const e=document.querySelector(`[data-go="${v}"]`);e&&e.click()},v);await p.waitForTimeout(100);ok(T('stránka '+v+' bez přetékání'), (await ov())<=0);}
 await p.evaluate(()=>document.querySelector('[data-go="gloss"]').click());await p.fill('#gloss-q','trust');await p.waitForTimeout(100);
 ok(T('slovník: hledání „trust“'), (await p.locator('.gloss dt').count())>=1 && (await p.locator('.gloss dt').count())<5);
 // dotazník
 await p.evaluate(()=>document.querySelector('[data-go="ready"]').click());await p.waitForTimeout(100);
 for(const v of ['0:4','1:5','2:3'])await p.locator(`[data-svy="${v}"]`).click();
 await p.fill('#svy-txt','Test e2e');await p.locator('[data-svy-send]').click();await p.waitForTimeout(250);
 const clip=await p.evaluate(()=>navigator.clipboard.readText().catch(()=> ''));
 ok(T('dotazník zkopíruje odpovědi'), clip.includes('4/5') && clip.includes('Test e2e'));
 // chat se Spockem
 await p.locator('[data-open-spock]').first().click().catch(async()=>{await p.locator('#g-fab').click()});await p.waitForTimeout(200);
 const open=await p.locator('#g-panel:not([hidden])').count();
 if(open){await p.fill('#g-in','Jak spustím task?');await p.locator('#g-send').click();await p.waitForTimeout(500);
  const sent=await p.evaluate(()=>window.__sent.length?JSON.stringify(window.__sent[0]).length:0);
  ok(T('chat Spock: odpověď se zobrazí'), (await p.locator('#g-log .g-msg.a').last().innerText()).includes('Command Palette'));
  ok(T('chat Spock dostane obsah lekcí'), sent>20000 && sent<120000, 'kontext '+sent+' znaků');
  ok(T('odznak Kamarád Spocka'), !!(await st()).badges['got.spock']);
  await dismiss();await p.locator('#g-x').click();}
 else ok(T('chat Spock se otevře'), false);
 // měření, zpětná vazba a dashboard (databáze a uživatel jsou v testu nahrazené)
 await dismiss();await p.evaluate(()=>document.querySelector('#home-btn').click());await p.waitForTimeout(100);
 await p.locator('[data-fbopen]').click();await p.waitForTimeout(100);
 await p.fill('#fb-text','Test: karta je nejasná');await p.fill('#fb-fix','Zkrátit ji');await p.locator('#fb-form button[type=submit]').click();await p.waitForTimeout(250);
 const fbd=await p.evaluate(()=>window.__db['feedback/u_ja']);
 ok(T('zpětná vazba se uloží s místem a návrhem'), !!fbd && fbd.items.length===1 && fbd.items[0].fix==='Zkrátit ji' && !!fbd.items[0].where, fbd?JSON.stringify(fbd.items[0]).slice(0,90):'');
 await dismiss();await p.locator('#pill-dash').click();await p.waitForTimeout(600);
 const trd=await p.evaluate(()=>window.__db['track/u_ja']);
 ok(T('průchod se zaznamená: stránky, kliknutí, kvíz, pokrok'), !!trd && Object.keys(trd.pv).length>5 && Object.keys(trd.clicks).length>5 && trd.ev.length>20 && !!trd.quiz['l0:quiz'] && trd.prog.mods.l0[0]===trd.prog.mods.l0[1], trd?`stránek ${Object.keys(trd.pv).length}, druhů kliknutí ${Object.keys(trd.clicks).length}, kroků ${trd.ev.length}`:'nic');
 ok(T('dotaz na Spocka se započítá s odhadem tokenů'), !!trd && trd.spock.n>=1 && trd.spock.tin>10000, trd?JSON.stringify(trd.spock).slice(0,80):'');
 const dtx=await p.locator('#dash').innerText().catch(()=>'');
 ok(T('dashboard ukáže lidi, trychtýř, výkon a tokeny'), dtx.includes('Kolega Testovací') && dtx.includes('Trychtýř cesty') && dtx.includes('Výkon a rychlost') && dtx.includes('Spock a tokeny') && await p.locator('.ds-tile').count()>=20);
 ok(T('dashboard: lidé mají čas první a poslední návštěvy a počet sezení'), await p.evaluate(()=>{const h=[...document.querySelectorAll('#dash th')].map(e=>e.innerText.toLowerCase());return h.includes('poprvé')&&h.includes('naposledy')&&h.includes('sezení')}));
 ok(T('dashboard: přehled, kdy lidé tutoriál používají (den × hodina)'), await p.locator('#dash .ds-heat .hc').count()===168);
 ok(T('dashboard ukáže zpětnou vazbu jako úkoly'), await p.locator('.ds-fbi').count()===2 && dtx.includes('Přidat příklad'));
 await p.evaluate(()=>{const b=[...document.querySelectorAll('#dash [data-dash^="who:u_"]')].find(e=>e.dataset.dash!=='who:u_ja');b&&b.click();});await p.waitForTimeout(250);
 ok(T('dashboard: u člověka je vidět, kdy aplikaci používal (sezení s časem od–do)'), (await p.locator('#dash .ds-who').first().innerText()).includes('Kdy aplikaci používal') && await p.locator('#dash .ds-who').first().locator('tbody tr').count()===2 && await p.locator('#dash .ds-hours span').count()===24);
 await p.locator('#dash [data-dash="tab:pohyb"]').click();await p.waitForTimeout(300);
 const fl=await p.locator('#dash').innerText();
 ok(T('pohyb: automatické závěry a problémová místa'), await p.locator('#dash .fl-ins li').count()>=3 && await p.locator('#dash .fl-places li').count()>=1 && fl.includes('Největší problémové místo'));
 ok(T('pohyb: problémové místo uvádí důvody (chyby, bloudění, zámek, opakované klikání)'), ['špatná odpověď','tam a zpět','zamčený modul','opakované klikání'].every(x=>fl.includes(x)), fl.slice(0,0));
 ok(T('pohyb: přechody odkud kam, vstupy, odchody a vzorce'), ['Odkud kam lidé jdou','Kde lidé začínají','Kde lidé končí','Opakující se vzorce'].every(x=>fl.includes(x)) && await p.locator('#dash table').count()>=5);
 await p.locator('#dash [data-dash="flow:u_novak"]').click();await p.waitForTimeout(250);
 ok(T('pohyb: cesta člověka krok za krokem po sezeních, problémové kroky označené'), await p.locator('#dash .fl-ses').count()===2 && await p.locator('#dash .fl-who .fl-st.warn').count()>=2 && (await p.locator('#dash .fl-who').innerText()).includes('bloudí'));
 ok(T('pohyb: stránka nepřetéká'), (await ov())<=0);
 await p.locator('#dash [data-dash="tab:lide"]').click();await p.waitForTimeout(200);
 await p.locator('.ds-fbi input').first().check();await p.waitForTimeout(200);
 ok(T('odškrtnutí zpětné vazby se uloží'), Object.keys((await p.evaluate(()=>window.__db['todo/state']||{done:{}})).done).length===1);
 ok(T('dashboard bez přetékání'), (await ov())<=0);
 ok(T('nečinnost se do času na stránce nepočítá'), (await p.evaluate(()=>__kviz.idle(30)))<=2);
 // záložka Verze a kvalita
 await p.locator('[data-dash="tab:ver"]').click();await p.waitForTimeout(300);
 const vtx=await p.locator('#dash').innerText().catch(()=>'');
 ok(T('záložka Verze a kvalita ukáže testy, výkon a tokeny verze'), vtx.includes('End-to-end testy') && vtx.includes('Náročnost na tokeny') && vtx.includes('Historie verzí'));
 ok(T('verze se zapíše do historie'), Object.keys(await p.evaluate(()=>window.__db)).some(k=>k.startsWith('versions/')));
 ok(T('záložka Verze bez přetékání'), (await ov())<=0);
 {const r=((await p.evaluate(()=>window.__db['track/u_ja']))||{perf:{render:[]}}).perf.render.slice().sort((a,b)=>a-b);LAB[tag].render=r.length?r[Math.floor(r.length/2)]:null;LAB[tag].renderP90=r.length?r[Math.min(r.length-1,Math.floor(r.length*.9))]:null;}
 if(!CTX)CTX=await p.evaluate(()=>__kviz.ctx());
 // trvalost
 await dismiss();const before=await st();await p.reload();await p.waitForTimeout(300);const after=await st();
 await p.locator('#home-btn').click();await p.waitForTimeout(200);
 ok(T('úvod: vesmírná mapa má svět pro každou úroveň cesty a cíl se Spockem'), await p.locator('.spmap .sw').count()===6 && await p.locator('.spmap .sw.end').count()===1);
 ok(T('šatna je zamčená, dokud cesta není hotová'), await p.locator('[data-wardrobe]').count()===0);
 await p.evaluate(()=>__kviz.finish());await p.waitForTimeout(300);await dismiss();
 await p.locator('.spmap [data-wardrobe]').click();await p.waitForTimeout(200);
 await p.locator('[data-av="acc:cape"]').click();await p.waitForTimeout(150);
 ok(T('cíl cesty: šatna oblékne postavičku'), (await st()).av.acc==='cape' && await p.locator('#wardrobe .avatar').count()===1);
 await p.locator('[data-fly]').click();await p.waitForTimeout(300);
 ok(T('odlet spustí příběh cesty se scénou pro každý svět a setkáním se Spockem'), (await p.locator('#story .st-cap .eyebrow').innerText()).includes('1/9'));
 for(let i=0;i<8;i++){await p.locator('#story [data-st=next]').click();await p.waitForTimeout(80);if(i===5)ok(T('příběh má scénu setkání se Spockem s vlajkou'), (await p.locator('#story .st-cap h2').innerText())==='Setkání se Spockem' && await p.locator('#story .st-flag').count()===1);if(i===5)ok(T('setkání je oslava: nápis, paprsky, posádka agentů a ohňostroj'), (await p.locator('#story .st-banner').innerText()).includes('Dokázali') && await p.locator('#story .st-rays').count()===1 && await p.locator('#story .st-crowd .cw').count()===6 && await p.locator('#story canvas.st-fw').count()===1);if(i===6)ok(T('souhrn ukazuje medaili absolventa s rolí'), await p.locator('#story .st-medal .medal').count()===1 && (await p.locator('#story .st-medal').innerHTML()).includes('Guild Master'));if(i===6)ok(T('souhrn příběhu skloňuje počty správně'), !/ 1 (odznaků|světů|lekcí|úkolů)/.test(await p.locator('#story .st-cap p').innerText()));}
 ok(T('odlet: postavička i Spock jsou v lodi'), await p.locator('#story .st-crew .avatar').count()===1 && await p.locator('#story .st-crew .spock').count()===1);
 ok(T('příběh jde projít do konce a zavřít'), (await p.locator('#story .st-cap h2').innerText())==='Odlet');
 await p.locator('#story [data-st=next]').click();await p.waitForTimeout(200);
 ok(T('po příběhu se stránka vrátí a nepřetéká'), await p.locator('#story').count()===0 && (await ov())<=0);
 await p.locator('.spmap [data-mgame=l0]').click();await p.waitForTimeout(200);
 ok(T('minihra u překážky se otevře s otázkou a jde přeskočit'), await p.locator('#mg .mg-opt').count()>1 && await p.locator('#mg [data-mg=close]').count()===1);
 for(let g=0;g<60;g++){const n=await p.locator('#mg .mg-opt').count();if(!n)break;await p.evaluate(k=>document.querySelectorAll('#mg .mg-opt')[k].click(),g%n);await p.waitForTimeout(40);}
 ok(T('minihra: po pěti správných volbách je překážka proletěná'), await p.locator('#mg .mg-end').count()===1);
 await p.locator('#mg [data-mg=close]').click();await p.waitForTimeout(200);await dismiss();
 ok(T('dohraná minihra dá +15 XP'), (await st()).got['mg.l0']===true && await p.locator('#mg').count()===0);
 await p.locator('.spmap [data-mgame=l1]').click();await p.waitForTimeout(200);await p.locator('#mg [data-mg=close]').click();await p.waitForTimeout(200);
 ok(T('přeskočená minihra nic nepřičte a zavře se'), !(await st()).got['mg.l1'] && await p.locator('#mg').count()===0);
 await p.locator('.spmap [data-recap=l0]').click();await p.waitForTimeout(250);
 ok(T('shrnutí úrovně má scénu pro každou lekci'), (await p.locator('#story .st-cap .eyebrow').innerText()).includes('1/6'));
 await p.locator('#story [data-st=next]').click();await p.waitForTimeout(150);
 ok(T('shrnutí ukazuje, co se v lekci probralo'), await p.locator('#story .st-cap li').count()>=3);
 await p.locator('#story [data-st=snd]').click();await p.waitForTimeout(100);
 ok(T('zvuk jde vypnout a volba se uloží'), (await st()).sound===false);
 await p.locator('#story [data-st=snd]').click();await p.locator('#story [data-st=close]').click();await p.waitForTimeout(200);
 ok(T('shrnutí jde přeskočit'), await p.locator('#story').count()===0);
 await p.evaluate(()=>document.querySelector('[data-go=badges]').click());await p.waitForTimeout(200);
 ok(T('profil: postup v hodnostech a odemčené vzhledy Spocka'), await p.locator('.ladder li').count()===7 && await p.locator('.skin[data-setskin]').count()>=2 && await p.locator('.ladder li.cur').count()===1);
 await p.locator('.skin[data-setskin]').nth(1).click();await p.waitForTimeout(150);
 ok(T('vzhled Spocka jde přepnout'), await p.evaluate(()=>document.body.dataset.spockskin==='ocean' && !!document.querySelector('#g-fab .spock.sk-ocean')));
 await p.locator('#home-btn').click();await p.waitForTimeout(200);
 ok(T('Guild Master: úroveň 4 je na cestě a odznak Superuser se nabízí'), await p.evaluate(()=>__kviz.path().join()==='l0,l1,gm,l3,l4' && __kviz.badges().includes('superuser')));
 ok(T('pokrok přežije obnovení stránky'), before.xp===after.xp && after.role==='gm', 'před '+before.xp+' po '+after.xp+' role '+after.role);
 ok(T('bez chyb v konzoli'), errs.length===0, errs.slice(0,2).join(' | '));
 // přístupnost: tlačítka bez názvu, obrázky bez alt
 await p.evaluate(()=>document.querySelector('#home-btn').click());await p.waitForTimeout(150);
 const a11y=await p.evaluate(()=>[...document.querySelectorAll('button,a,input,textarea')].filter(e=>e.offsetParent!==null && !(e.closest('details:not([open])') && !e.closest('summary'))).filter(e=>!(e.innerText||'').trim()&&!e.getAttribute('aria-label')&&!e.getAttribute('title')&&!(e.labels&&e.labels.length)&&!e.querySelector('img[alt],svg title')).map(e=>e.outerHTML.slice(0,80)));
 ok(T('ovládací prvky mají název'), a11y.length===0, a11y.slice(0,3).join(' | '));
 await ctx.close();}
// ---- doplňkové scénáře: oslava po dokončení úrovně, mluvený komentář, zmrazení série ----
{
 const ctx=await b.newContext({viewport:{width:1280,height:900}});
 // Zkušební český hlas: testovací prohlížeč žádný nemá. Zapisuje, co se má přečíst, a hned ohlásí konec čtení.
 await ctx.addInitScript(()=>{window.__spoken=[];const fake={getVoices:()=>[{lang:'cs-CZ',name:'Zkušební hlas',default:true}],speak:u=>{window.__spoken.push({text:u.text,lang:u.lang});setTimeout(()=>u.onend&&u.onend(),30)},cancel:()=>{},onvoiceschanged:null};Object.defineProperty(window,'speechSynthesis',{value:fake,configurable:true});window.SpeechSynthesisUtterance=function(t){this.text=t;};});
 const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 const st=()=>p.evaluate(()=>JSON.parse(localStorage.getItem('spock-user-onboarding-v1')||'{}'));
 const T=s=>'doplňky: '+s;
 await p.goto('file://'+path.join(DIST,'e2e.html'));await p.waitForTimeout(400);
 await p.locator('.startb [data-role=pm]').click();await p.waitForTimeout(300);
 // dokončení úrovně opravdovým kliknutím na poslední úkol → oslava s nabídkou
 const finishBy=async wid=>{const left=await p.evaluate(w=>__kviz.almost(w),wid);await p.evaluate(w=>document.querySelector('[data-week='+w+']').click(),wid);await p.waitForTimeout(200);
  await p.evaluate(di=>{const e=document.querySelector('[data-lesson="'+di+'"]');if(e)e.click()},left[0]);await p.waitForTimeout(200);
  await p.evaluate(()=>{const e=document.querySelector('.lpanel input[data-todo]:not(:checked)');e.scrollIntoView({block:'center'});e.click();});await p.waitForTimeout(300);
  for(let i=0;i<10 && !(await p.locator('.cel .cel-recap').count());i++){const c=p.locator('.cel .cel-go');if(!(await c.count()))break;await c.first().click();await p.waitForTimeout(120);}};
 await finishBy('l0');
 ok(T('dokončená úroveň: oslava překonané překážky nabízí shrnutí, minihru i přeskočení'), await p.locator('.cel .cel-recap').count()===1 && await p.locator('.cel .cel-game').count()===1 && await p.locator('.cel .cel-go').count()===1 && (await p.locator('.cel h2').innerText()).includes('Mlhovina nejasností'));
 await p.locator('.cel .cel-recap').click();await p.waitForTimeout(300);
 ok(T('„Přehrát shrnutí úrovně“ v oslavě spustí shrnutí'), (await p.locator('#story .st-cap .eyebrow').innerText()).toLowerCase().includes('shrnutí úrovně') && await p.locator('.cel').count()===0);
 const sp=await p.evaluate(()=>window.__spoken);
 ok(T('komentář se čte českým hlasem a obsahuje text scény'), sp.length>=1 && sp[0].lang==='cs-CZ' && sp[0].text.includes('Shrnutí'), sp.length+' promluv');
 await p.waitForTimeout(1300);
 ok(T('po dočtení komentáře se scéna sama přepne'), !(await p.locator('#story .st-cap .eyebrow').innerText()).includes('1/'));
 await p.locator('#story [data-st=snd]').click();await p.waitForTimeout(100);const n0=(await p.evaluate(()=>window.__spoken)).length;
 await p.locator('#story [data-st=next]').click();await p.waitForTimeout(200);
 ok(T('s vypnutým zvukem se komentář nečte'), (await p.evaluate(()=>window.__spoken)).length===n0);
 await p.locator('#story [data-st=snd]').click();await p.locator('#story [data-st=close]').click();await p.waitForTimeout(200);
 for(let i=0;i<8;i++){const c=p.locator('.cel .cel-go');if(await c.count()){await c.first().click();await p.waitForTimeout(100);}else break;}
 await finishBy('l1');
 await p.locator('.cel .cel-game').click();await p.waitForTimeout(300);
 ok(T('„Zahrát minihru“ v oslavě spustí minihru dané úrovně'), await p.locator('#mg .mg-opt').count()>1 && (await p.locator('#mg h2').innerText()).includes('Asteroidové pole') && await p.locator('.cel').count()===0);
 await p.locator('#mg [data-mg=close]').click();await p.waitForTimeout(200);
 for(let i=0;i<8;i++){const c=p.locator('.cel .cel-go');if(await c.count()){await c.first().click();await p.waitForTimeout(100);}else break;}
 // zmrazení série: včera nic, předtím dva dny s XP, jedno zmrazení v zásobě
 const day=o=>{const d=new Date();d.setDate(d.getDate()-o);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
 await p.evaluate(([d2,d3])=>__kviz.state(S=>{S.days={};S.days[d2]=30;S.days[d3]=30;S.frozen={};S.freeze=1;}),[day(2),day(3)]);
 await p.waitForTimeout(100);await p.reload();await p.waitForTimeout(500);
 const s1=await st();
 ok(T('zmrazení zakryje jeden vynechaný den a série pokračuje'), s1.frozen[day(1)]===1 && s1.freeze===0 && await p.evaluate(()=>__kviz.streak())===3, 'série '+await p.evaluate(()=>__kviz.streak())+', zmrazení '+s1.freeze);
 ok(T('o zachráněné sérii se člověk dozví'), (await p.locator('.notice').allInnerTexts()).some(t=>t.includes('Zmrazení zachránilo')));
 // dva vynechané dny a jen jedno zmrazení: série propadne a zmrazení zůstane
 await p.evaluate(([d3,d4])=>__kviz.state(S=>{S.days={};S.days[d3]=30;S.days[d4]=30;S.frozen={};S.freeze=1;}),[day(3),day(4)]);
 await p.waitForTimeout(100);await p.reload();await p.waitForTimeout(500);
 const s2=await st();
 ok(T('na dva vynechané dny jedno zmrazení nestačí: série propadne, zmrazení zůstane'), s2.freeze===1 && !Object.keys(s2.frozen||{}).length && await p.evaluate(()=>__kviz.streak())===0);
 ok(T('stránka má jazyk čeština pro čtečky obrazovky'), await p.evaluate(()=>document.documentElement.lang==='cs'));
 await p.setViewportSize({width:390,height:844});await p.evaluate(()=>document.querySelector('#home-btn').click());await p.waitForTimeout(300);
 const small=await p.evaluate(()=>[...document.querySelectorAll('button,a,summary,input')].filter(e=>e.offsetParent&&!e.closest('label')).map(e=>{const r=e.getBoundingClientRect();return [Math.round(r.width),Math.round(r.height),(e.innerText||e.getAttribute('aria-label')||'').trim().slice(0,24)]}).filter(([w,h])=>w<24||h<24));
 ok(T('mobil: dotykové plochy aspoň 24 × 24 px (WCAG 2.2)'), small.length===0, JSON.stringify(small.slice(0,3)));
 const t0=await p.evaluate(()=>{const t=performance.now();document.querySelector('[data-week=l0]').click();return performance.now()-t;});
 ok(T('výkon: lekce se vykreslí do 150 ms'), t0<150, Math.round(t0)+' ms');
 ok(T('doplňkové scénáře bez chyb v konzoli'), errs.length===0, errs.slice(0,2).join(' | '));
 await ctx.close();
}
await b.close();
const f=R.filter(r=>r[0]==='FAIL');
fs.writeFileSync(path.join(DIST,'e2e-report.json'),JSON.stringify({src:SRC,at:Date.now(),total:R.length,pass:R.length-f.length,fail:f.length,failed:f.map(r=>r[1]+(r[2]?' ('+String(r[2]).slice(0,120)+')':'')),durMs:Date.now()-T0,lab:LAB,ctx:CTX}));R.forEach(r=>console.log(r[0],r[1],r[2]||''));console.log(`\nCELKEM ${R.length}, PASS ${R.length-f.length}, FAIL ${f.length}`);process.exit(f.length?1:0);})();
