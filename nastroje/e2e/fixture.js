// Testovací prostředí webu: smyšlená databáze, uživatel (vlastník) a chat se Spockem.
// Nic se neodesílá ven. window.__E2E zapne v aplikaci testovací háčky (window.__kviz).
const stub=`<script>window.__E2E=true;window.__sent=[];window.__db={'track/u_novak':(function(){var t=Date.now()-3e8,e=[],v=function(d,ty,k){t+=d;e.push([t,ty,k])};v(0,'návštěva','mobil');v(1e3,'view','home');v(4e4,'view','l0/0.1');v(9e4,'karta','l0.0.0 špatně');v(6e4,'karta','l0.0.1 správně');v(4e4,'view','map');v(2e4,'view','l0/0.1');v(2e4,'view','map');v(1.5e4,'view','l0/0.1');v(3e5,'view','l0/0.2');v(1e3,'klik','modul l1');v(500,'zamčeno','l1');v(400,'opakovaný klik','modul l1');v(2e4,'view','l0/0.2');t+=4e6;v(0,'návštěva','mobil');v(1e3,'view','home');v(3e4,'view','l0/0.2');v(5e4,'karta','l0.1.0 špatně');v(4e4,'karta','l0.1.1 špatně');return {v:1,first:Date.now()-3e8,last:t,visits:{},secs:{},dev:{mobile:true},role:'pd',prog:{xp:40,pct:5,loc:'l0/0.2',mods:{}},ses:[],ev:e,pv:{},tm:{},clicks:{},locked:{l1:1},quiz:{},perf:{load:[],fcp:[],render:[],errs:[]},spock:{n:0,tin:0,tout:0,ms:[],err:0}}})(),'track/u_kolega':{v:1,first:Date.now()-9e8,last:Date.now()-5e8,visits:{'2026-11-01':2},secs:{'2026-11-01':900},dev:{mobile:true,w:390,h:844},role:'pm',prog:{xp:120,pct:12,loc:'l0/0.2',mods:{l0:[9,31,1,4,0,9,22]}},pv:{'l0/0.1':3,'l0/0.2':2},tm:{'l0/0.1':600},clicks:{'modul l0':2,'modul l3':1},locked:{l3:1},quiz:{},wrong:['l0.0.1','l0.1.0'],perf:{load:[820],fcp:[640],render:[12],size:480000,errs:[]},spock:{n:2,tin:30000,tout:400,ms:[2100,3400],err:0},ses:[[Date.now()-5e8,Date.now()-5e8+7.2e5,600],[Date.now()-6e8,Date.now()-6e8+3e5,300]],ev:[[Date.now()-5e8,'view','l0/0.2']]},'feedback/u_kolega':{items:[{id:'f1',at:Date.now()-5e8,loc:'l0/0.2',where:'Poznejte SPOCK › 0.2',kind:'nejasne',text:'Nerozumím rozdílu Q a G brány.',fix:'Přidat příklad.',role:'pm'}]}};
const __off=()=>{if(!navigator.onLine){const e=new Error('offline');e.code='unavailable';throw e;}};
const __fdb={doc:p=>({id:p.split('/').pop(),path:p,get:async()=>(__off(),{id:p.split('/').pop(),exists:p in window.__db,data:()=>window.__db[p]}),set:async d=>{__off();window.__db[p]=JSON.parse(JSON.stringify(d))}}),collection:p=>{const mk=(f)=>{const q={where:(fld,op,val)=>mk(d=>f(d)&&(op==='>'?d[fld]>val:true)),limit:()=>q,get:async()=>{const docs=Object.keys(window.__db).filter(k=>k.startsWith(p+'/')&&k.slice(p.length+1).indexOf('/')<0&&f(window.__db[k])).map(k=>({id:k.slice(p.length+1),exists:true,data:()=>window.__db[k]}));return {docs,size:docs.length,empty:!docs.length}}};return q};return mk(()=>true)}};
const __fuser={me:async()=>({id:'u_ja',name:'Já',isOwner:true,canEdit:true}),id:async()=>'u_ja',isOwner:async()=>true,profiles:async ids=>Object.fromEntries(ids.map(i=>[i,{id:i,name:i==='u_ja'?'Já Vlastník':'Kolega Testovací'}]))};
window.claude={use:async n=>{if(n!=='sample')__off();if(n==='db')return __fdb;if(n==='user')return __fuser;if(n!=='sample')return null;const f=async(msgs,o)=>{window.__sent.push(msgs);await new Promise(r=>setTimeout(r,50));return {text:'Task spustíte přes **Command Palette**: Tasks: Run Task.',truncated:false};};f.limits=async()=>({tools:false});return f;}};</script>`;

const fs=require('fs');const path=require('path');
/* Sestaví web/dist/e2e.html: sestavený web + testovací prostředí. */
function buildE2E(){
  const ROOT=path.resolve(__dirname,'..','..'),DIST=path.join(ROOT,'web','dist');
  const html=fs.readFileSync(path.join(DIST,'spock-user-onboarding.html'),'utf8');
  for(const f of fs.readdirSync(path.join(ROOT,'web','media')))fs.copyFileSync(path.join(ROOT,'web','media',f),path.join(DIST,f));
  fs.writeFileSync(path.join(DIST,'e2e.html'),'<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'+stub+'</head><body style="margin:0">'+html+'</body></html>');
  return {ROOT,DIST,html};
}
/* Počká, až prohlížeč dokreslí (dva snímky), místo pevné pauzy. */
const settle=(p,extra)=>p.evaluate(ms=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(()=>setTimeout(r,ms||0)))),extra||0);
/* Výběr prohlížeče: E2E_BROWSER=webkit pustí test v jádru Safari. */
function browserType(){const pw=require('playwright');return pw[process.env.E2E_BROWSER||'chromium'];}
/* Při selhání uloží snímek obrazovky do web/dist/e2e-chyby/. */
let SHOTN=0;function failShot(DIST,p,name){if(!p)return Promise.resolve();const dir=path.join(DIST,'e2e-chyby');fs.mkdirSync(dir,{recursive:true});const f=path.join(dir,String(++SHOTN).padStart(3,'0')+'-'+name.replace(/[^\p{L}\d]+/gu,'-').slice(0,60)+'.png');return p.screenshot({path:f,fullPage:false}).catch(()=>{});}
module.exports={stub,buildE2E,settle,browserType,failShot};
