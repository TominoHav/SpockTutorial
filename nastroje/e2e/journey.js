// End-to-end test webu SPOCK Tutorialu: projde cestu uživatele na počítači i na mobilu.
// Spuštění (potřebuje Node.js a Playwright s Chromiem):
//   python3 web/parse.py && python3 web/build.py && node nastroje/e2e/journey.js
// Chat se Spockem je nahrazený zkušební odpovědí, nic se neodesílá ven.
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const ROOT=path.resolve(__dirname,'..','..');const DIST=path.join(ROOT,'web','dist');
const html=fs.readFileSync(path.join(DIST,'spock-user-onboarding.html'),'utf8');
for(const f of fs.readdirSync(path.join(ROOT,'web','media')))fs.copyFileSync(path.join(ROOT,'web','media',f),path.join(DIST,f));
const stub=`<script>window.__sent=[];window.claude={use:async n=>{if(n!=='sample')return null;const f=async(msgs,o)=>{window.__sent.push(msgs);await new Promise(r=>setTimeout(r,50));return {text:'Task spustíte přes **Command Palette**: Tasks: Run Task.',truncated:false};};f.limits=async()=>({tools:false});return f;}};</script>`;
fs.writeFileSync(path.join(DIST,'e2e.html'),'<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'+stub+'</head><body style="margin:0">'+html+'</body></html>');
const R=[];const ok=(n,c,d='')=>{R.push([c?'PASS':'FAIL',n,d]);};
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
 ok(T('nováček vidí úvod „Seznamte se se SPOCKem“'), await p.locator('.hx-first h1').innerText().then(t=>t.includes('Seznamte')));
 // simulace
 await p.locator('.hx [data-simstart]').click();
 for(const s of ['next','o-sol','o-ok','sign','load','sign','next','sol-1','why-2','sign','mvp-0','sign','sign','sign','trace']){await p.locator(`[data-sim="${s}"]`).first().click();await p.waitForTimeout(60);}
 ok(T('simulace prošla všech 7 fází až k iniciativě'), await p.locator('.sim-done').count()===1);
 ok(T('stopa tvrzení ukazuje 4 kroky'), await p.locator('.sim-trace li').count()===4);
 await p.locator('[data-sim=finish]').click();await p.waitForTimeout(200);await dismiss();
 ok(T('odznak Pilot nanečisto a 30 XP'), (await st()).badges['got.sim'] && (await st()).xp===30);
 // role
 await p.locator('.startb [data-role=gm]').click();await p.waitForTimeout(200);
 ok(T('výběr role → upozornění na odznak Na palubě, bez překrytí obrazovky'), (await p.locator('.notice').allInnerTexts()).some(t=>t.includes('Na palubě')) && !(await p.locator('.cel').count()));await dismiss();
 ok(T('po výběru role „Vítejte zpět“'), (await p.locator('.hx .eyebrow').first().innerText()).toLowerCase().includes('zpět'));
 // lekce 0.1 – karty a úkoly
 const answerCards=async()=>{let g=0;while(g++<40){await dismiss();const n=await p.evaluate(()=>{const e=document.querySelector('.lpanel .lcard.cur .lc-opt:not([disabled])');if(!e)return 0;e.scrollIntoView({block:'center'});e.click();return 1;});if(!n)break;await p.waitForTimeout(90);}await dismiss();};
 const doLesson=async()=>{await answerCards();let guard=0;while(await p.locator('.lpanel input[data-todo]:not(:checked)').count() && guard++<12){await checkNext();}};
 await p.locator('[data-golesson], [data-week=l0]').first().click();await p.waitForTimeout(250);
 ok(T('lekce 0.1 začíná první kartou, další jsou skryté'), await p.locator('.lpanel .lcard').count()===1 && await p.locator('.lpanel .lc-opt').count()>1);
 ok(T('karta má štítek „jen na webu“'), (await p.locator('.lpanel').first().innerText()).toLowerCase().includes('jen na webu'));
 const x0=(await st()).xp;await p.evaluate(()=>document.querySelector('.lpanel .lcard.cur .lc-opt').click());await p.waitForTimeout(150);await dismiss();
 ok(T('odpověď ukáže vysvětlení a otevře další kartu'), await p.locator('.lpanel .lc-why').count()===1 && await p.locator('.lpanel .lcard').count()===2, 'XP '+x0+' → '+(await st()).xp);
 const nb=await p.locator('.lpanel input[data-todo]').count();
 await doLesson();
 const s1=await st();ok(T(`lekce 0.1: karty zodpovězené, ${nb} úkoly odškrtnuté, lekce hotová`), s1.got['lesson.l0.0']===true, 'karet '+Object.keys(s1.cards||{}).length+', XP '+s1.xp);
 ok(T('po lekci se otevře lekce 0.2'), (await p.locator('.lp-head, .lpanel').first().innerText()).includes('0.2'));
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
  ok(T('chat Spock dostane obsah lekcí'), sent>20000, 'kontext '+sent+' znaků');
  ok(T('odznak Kamarád Spocka'), !!(await st()).badges['got.spock']);
  await dismiss();await p.locator('#g-x').click();}
 else ok(T('chat Spock se otevře'), false);
 // trvalost
 await dismiss();const before=await st();await p.reload();await p.waitForTimeout(300);const after=await st();
 ok(T('pokrok přežije obnovení stránky'), before.xp===after.xp && after.role==='gm', 'před '+before.xp+' po '+after.xp+' role '+after.role);
 ok(T('bez chyb v konzoli'), errs.length===0, errs.slice(0,2).join(' | '));
 // přístupnost: tlačítka bez názvu, obrázky bez alt
 await p.evaluate(()=>document.querySelector('#home-btn').click());await p.waitForTimeout(150);
 const a11y=await p.evaluate(()=>[...document.querySelectorAll('button,a,input,textarea')].filter(e=>e.offsetParent!==null).filter(e=>!(e.innerText||'').trim()&&!e.getAttribute('aria-label')&&!e.getAttribute('title')&&!(e.labels&&e.labels.length)&&!e.querySelector('img[alt],svg title')).map(e=>e.outerHTML.slice(0,80)));
 ok(T('ovládací prvky mají název'), a11y.length===0, a11y.slice(0,3).join(' | '));
 await ctx.close();}
await b.close();
const f=R.filter(r=>r[0]==='FAIL');R.forEach(r=>console.log(r[0],r[1],r[2]||''));console.log(`\nCELKEM ${R.length}, PASS ${R.length-f.length}, FAIL ${f.length}`);process.exit(f.length?1:0);})();
