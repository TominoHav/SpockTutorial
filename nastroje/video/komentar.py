#!/usr/bin/env python3
"""Namluví anglický komentář k videím hlasem Piper a spočítá časování titulků podle délky vět.

Použití: python3 nastroje/video/komentar.py <cesta k hlasu .onnx>
Potřebuje balíček piper-tts a ffmpeg. Výstup: nastroje/video/audio/ (není v gitu):
  <scéna>-<n>.wav, <scéna>.wav (celá scéna), vse.wav (dlouhé video) a timing.js.
Pak: node nastroje/video/record.js vse --en
"""
import json, os, re, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__)); AUD = os.path.join(HERE, 'audio'); os.makedirs(AUD, exist_ok=True)
voice = sys.argv[1]
EN = json.load(open(os.path.join(HERE, 'komentar-en.json'), encoding='utf-8'))
html = open(os.path.join(HERE, 'video.html'), encoding='utf-8').read()
dur = lambda f: float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f], capture_output=True, text=True).stdout.strip())
timing = {}; order = []
for sid, lines in EN.items():
    m = re.search(r"\{id:'" + sid + r"', dur:(\d+).*?caps:\[(.*?)\]\]\}", html, re.S)
    odur = float(m.group(1)); caps = [(float(a), float(b)) for a, b in re.findall(r"\[([\d.]+),([\d.]+),'", m.group(2))]
    assert len(caps) == len(lines), sid
    out = []; prev_end = 0; inputs = []; filt = []
    for i, (line, (cs, ce)) in enumerate(zip(lines, caps)):
        wav = os.path.join(AUD, f'{sid}-{i}.wav')
        subprocess.run([sys.executable, '-m', 'piper', '-m', voice, '-f', wav], input=line, text=True, check=True, capture_output=True)
        d = dur(wav); start = max(cs, prev_end + 0.35); end = start + max(ce - cs, d + 0.3); prev_end = end
        out.append([round(start, 2), round(end, 2)])
        inputs += ['-i', wav]; filt.append(f'[{i}:a]adelay={int(start * 1000)}:all=1[a{i}]')
    sdur = max(odur, round(prev_end + 0.8, 2)); sdur = round(sdur * 25) / 25
    timing[sid] = {'dur': sdur, 'caps': out}; order.append(sid)
    fc = ';'.join(filt) + ';' + ''.join(f'[a{i}]' for i in range(len(lines))) + f'amix=inputs={len(lines)}:normalize=0,apad=whole_dur={sdur},atrim=0:{sdur}[o]'
    subprocess.run(['ffmpeg', '-v', 'error', '-y'] + inputs + ['-filter_complex', fc, '-map', '[o]', '-ar', '48000', '-ac', '2', os.path.join(AUD, sid + '.wav')], check=True)
    print(sid, 'původně', odur, 's → s komentářem', sdur, 's')
lst = os.path.join(AUD, 'vse.txt'); open(lst, 'w').write(''.join(f"file '{os.path.join(AUD, s + '.wav')}'\n" for s in order))
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lst, '-c', 'copy', os.path.join(AUD, 'vse.wav')], check=True)
open(os.path.join(AUD, 'timing.js'), 'w').write('window.__TIMING = ' + json.dumps(timing) + ';\n')
print('celkem', sum(t['dur'] for t in timing.values()), 's')
