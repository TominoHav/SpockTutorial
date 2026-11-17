#!/usr/bin/env python3
"""Pitch video onboardingu do SPOCKu: anglický komentář (Piper), české titulky v obraze, snímky skutečné aplikace.

Použití (z kořene repozitáře, po python3 web/build.py):
  node nastroje/video/pitch/snimky.js
  python3 nastroje/video/pitch/render.py <cesta k hlasu en-us-ryan-high.onnx>
Výstup: web/dist/pitch/spock-onboarding-pitch.mp4 (není v gitu).
"""
import json, os, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
OUT = os.path.join(ROOT, 'web', 'dist', 'pitch'); AUD = os.path.join(OUT, 'audio'); os.makedirs(AUD, exist_ok=True)
voice = sys.argv[1]
SC = json.load(open(os.path.join(HERE, 'scenar.json'), encoding='utf-8'))
dur = lambda f: float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f], capture_output=True, text=True).stdout.strip())
scenes = []; inputs = []; filt = []; t0 = 0.0; n = 0
for s in SC:
    caps = []; lt = 0.7
    for j, (en, cs) in enumerate(zip(s['en'], s['cs'])):
        wav = os.path.join(AUD, f"{s['id']}-{j}.wav")
        subprocess.run([sys.executable, '-m', 'piper', '-m', voice, '-f', wav, '--length-scale', '0.97'], input=en, text=True, check=True, capture_output=True)
        d = dur(wav); caps.append([round(lt, 2), round(lt + d, 2), cs])
        inputs += ['-i', wav]; filt.append(f'[{n}:a]adelay={int((t0 + lt) * 1000)}:all=1[a{n}]'); n += 1
        lt += d + 0.45
    sd = round((lt + 0.6) * 25) / 25
    scenes.append({'dur': sd, 'caps': caps}); t0 += sd
total = round(t0, 2)
fc = ';'.join(filt) + ';' + ''.join(f'[a{i}]' for i in range(n)) + f'amix=inputs={n}:normalize=0,apad=whole_dur={total},atrim=0:{total}[o]'
subprocess.run(['ffmpeg', '-v', 'error', '-y'] + inputs + ['-filter_complex', fc, '-map', '[o]', '-ar', '48000', '-ac', '2', os.path.join(AUD, 'pitch.wav')], check=True)
json.dump({'scenes': scenes}, open(os.path.join(AUD, 'timing.json'), 'w'), ensure_ascii=False)
print('délka', total, 's')
subprocess.run(['node', os.path.join(HERE, 'zaznam.js')], check=True, cwd=ROOT)
