// Vyrenderuje snímky pitch.html po 1/25 s a složí je s komentářem do MP4.
const {chromium}=require('playwright');const path=require('path');const fs=require('fs');const {execFileSync}=require('child_process');
const HERE=__dirname,ROOT=path.resolve(HERE,'..','..','..'),OUT=path.join(ROOT,'web','dist','pitch'),AUD=path.join(OUT,'audio'),FR=path.join(OUT,'frames'),FPS=25;
const VER=process.argv[2]||'uzivatele';
/* logo PDE z aplikace do finále */
const APP=fs.readFileSync(path.join(ROOT,'web','app.js'),'utf8');const PDE=(APP.match(/function pdeLogo\(cls\)\{[\s\S]*?\n\}/)||[''])[0];
const SC=JSON.parse(fs.readFileSync(path.join(HERE,'scenar-'+VER+'.json'),'utf8')).map(s=>Object.assign(s,{src:s.img?'data:image/jpeg;base64,'+fs.readFileSync(path.join(OUT,s.img)).toString('base64'):'',msrc:(s.montage||[]).map(f=>'data:image/jpeg;base64,'+fs.readFileSync(path.join(OUT,f)).toString('base64'))}));
const T=JSON.parse(fs.readFileSync(path.join(AUD,'timing-'+VER+'.json'),'utf8'));
(async()=>{fs.rmSync(FR,{recursive:true,force:true});fs.mkdirSync(FR,{recursive:true});
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:720}});
await p.addInitScript(([s,t,pde])=>{window.__SCENES=s;window.__T=t;window.__PDE=pde;},[SC,T,PDE]);
await p.goto('file://'+path.join(HERE,'pitch.html'));await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(300);
const total=await p.evaluate(()=>window.__total),n=Math.round(total*FPS);
for(let i=0;i<n;i++){await p.evaluate(t=>window.__seek(t),i/FPS);await p.screenshot({path:path.join(FR,String(i).padStart(5,'0')+'.jpg'),type:'jpeg',quality:90});}
await b.close();
const mp4=path.join(OUT,'spock-onboarding-pitch-'+VER+'.mp4');
execFileSync('ffmpeg',['-v','error','-y','-framerate',String(FPS),'-i',path.join(FR,'%05d.jpg'),'-i',path.join(AUD,'pitch-'+VER+'.wav'),'-c:v','libx264','-preset','slow','-crf','22','-pix_fmt','yuv420p','-c:a','aac','-b:a','160k','-shortest','-movflags','+faststart',mp4]);
fs.copyFileSync(path.join(FR,String(Math.round(4*FPS)).padStart(5,'0')+'.jpg'),mp4.replace('.mp4','-poster.jpg'));
fs.rmSync(FR,{recursive:true,force:true});console.log(path.basename(mp4),total.toFixed(1)+' s',Math.round(fs.statSync(mp4).size/1024)+' kB');})();
