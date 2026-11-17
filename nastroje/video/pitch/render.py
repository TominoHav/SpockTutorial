#!/usr/bin/env python3
"""Pitch video onboardingu do SPOCKu: anglický komentář (Piper), české titulky v obraze, snímky skutečné aplikace.

Použití (z kořene repozitáře, po python3 web/build.py):
  node nastroje/video/pitch/snimky.js
  python3 nastroje/video/pitch/render.py <cesta k hlasu en-us-ryan-high.onnx> vedeni|uzivatele
Výstup: web/dist/pitch/spock-onboarding-pitch-<verze>.mp4 (není v gitu).
"""
import json, os, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
OUT = os.path.join(ROOT, 'web', 'dist', 'pitch'); AUD = os.path.join(OUT, 'audio'); os.makedirs(AUD, exist_ok=True)
voice = sys.argv[1]; VER = sys.argv[2] if len(sys.argv) > 2 else 'uzivatele'
SC = json.load(open(os.path.join(HERE, 'scenar-' + VER + '.json'), encoding='utf-8'))
dur = lambda f: float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f], capture_output=True, text=True).stdout.strip())
scenes = []; inputs = []; filt = []; t0 = 0.0; n = 0; mus0 = None
for s in SC:
    caps = []; lt = s.get('lead', 3.4 if s.get('finale') else 0.7)
    for j, (en, cs) in enumerate(zip(s['en'], s['cs'])):
        wav = os.path.join(AUD, f"{VER}-{s['id']}-{j}.wav")
        subprocess.run([sys.executable, '-m', 'piper', '-m', voice, '-f', wav, '--length-scale', '0.97'], input=en, text=True, check=True, capture_output=True)
        d = dur(wav); caps.append([round(lt, 2), round(lt + d, 2), cs])
        inputs += ['-i', wav]; filt.append(f'[{n}:a]adelay={int((t0 + lt) * 1000)}:all=1[a{n}]'); n += 1
        lt += d + 0.45
    sd = round((lt + s.get('tail', 0.6)) * 25) / 25
    scenes.append({'dur': sd, 'caps': caps})
    if s.get('music') and mus0 is None: mus0 = t0
    t0 += sd
total = round(t0, 2)
music = []
if mus0 is not None:
    # podkres finále: akord C dur s nástupem, zesílením při výbuchu a doznění (syntetizovaný, bez cizí hudby)
    md = round(total - mus0, 2); mw = os.path.join(AUD, VER + '-podkres.wav')
    env = f"(min(t/4,1)*0.55+0.45*between(t,{md - 11.5:.2f},{md})*min(max(t-{md - 11.5:.2f},0)/1.2,1))*min(({md}-t)/2.5,1)"
    tone = '+'.join(f"{a}*sin(2*PI*{f}*t)" for f, a in [(130.81, .35), (261.63, .3), (329.63, .22), (392.0, .22), (523.25, .14), (659.25, .08), (783.99, .06)])
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'lavfi', '-i', "aevalsrc=exprs='" + f"({tone})*{env}*0.32" + f"':s=48000:d={md}", '-af', 'aecho=0.8:0.6:120:0.25,lowpass=f=3000', '-ac', '2', mw], check=True)
    inputs += ['-i', mw]; filt.append(f'[{n}:a]adelay={int(mus0 * 1000)}:all=1[a{n}]'); n += 1
fc = ';'.join(filt) + ';' + ''.join(f'[a{i}]' for i in range(n)) + f'amix=inputs={n}:normalize=0,apad=whole_dur={total},atrim=0:{total}[o]'
subprocess.run(['ffmpeg', '-v', 'error', '-y'] + inputs + ['-filter_complex', fc, '-map', '[o]', '-ar', '48000', '-ac', '2', os.path.join(AUD, 'pitch-' + VER + '.wav')], check=True)
json.dump({'scenes': scenes}, open(os.path.join(AUD, 'timing-' + VER + '.json'), 'w'), ensure_ascii=False)
print('délka', total, 's')
subprocess.run(['node', os.path.join(HERE, 'zaznam.js'), VER], check=True, cwd=ROOT)
