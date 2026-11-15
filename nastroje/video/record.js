// Vyrobí videa "SPOCK krok za krokem": jedno dlouhé a klipy po fázích. Bez zvuku, české titulky jsou v obraze.
// Použití: node nastroje/video/record.js [id scény | vse]   (potřebuje Playwright a ffmpeg)
const {chromium}=require('playwright');const path=require('path');const fs=require('fs');const {execFileSync}=require('child_process');
const HERE=__dirname,OUT=path.resolve(HERE,'..','..','web','media'),TMP=path.resolve(HERE,'..','..','web','dist','video');const FPS=25;
(async()=>{const want=process.argv[2]||'vse';const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:720}});
await p.goto('file://'+path.join(HERE,'video.html'));await p.evaluate(()=>document.fonts.ready);
const scenes=await p.evaluate(()=>window.__scenes);
const jobs=want==='vse'?[{id:'vse',q:''}].concat(scenes.filter(s=>s.id.startsWith('faze-')).map(s=>({id:s.id,q:'?scene='+s.id}))):[{id:want,q:want==='vse'?'':'?scene='+want}];
for(const j of jobs){const dir=path.join(TMP,j.id);fs.rmSync(dir,{recursive:true,force:true});fs.mkdirSync(dir,{recursive:true});
 await p.goto('file://'+path.join(HERE,'video.html')+j.q);await p.evaluate(()=>document.fonts.ready);
 const total=await p.evaluate(()=>window.__total),n=Math.round(total*FPS);
 for(let i=0;i<n;i++){await p.evaluate(t=>window.__seek(t),i/FPS);await p.screenshot({path:path.join(dir,String(i).padStart(5,'0')+'.jpg'),type:'jpeg',quality:92});}
 const mp4=path.join(OUT,'spock-'+(j.id==='vse'?'krok-za-krokem':j.id)+'.mp4');
 execFileSync('ffmpeg',['-v','error','-y','-framerate',String(FPS),'-i',path.join(dir,'%05d.jpg'),'-c:v','libx264','-preset','slow','-crf','24','-pix_fmt','yuv420p','-movflags','+faststart',mp4]);
 const posterFrame=Math.min(n-1,Math.round((j.id==='vse'?3:9)*FPS));fs.copyFileSync(path.join(dir,String(posterFrame).padStart(5,'0')+'.jpg'),mp4.replace('.mp4','-poster.jpg'));
 fs.rmSync(dir,{recursive:true,force:true});console.log(path.basename(mp4),total+' s',Math.round(fs.statSync(mp4).size/1024)+' kB');}
await b.close();})();
