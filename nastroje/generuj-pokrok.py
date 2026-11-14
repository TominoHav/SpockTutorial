#!/usr/bin/env python3
"""Vygeneruje onboarding/POKROK.md z lekcí. Zaškrtnuté úkoly ([x]) zachová podle jejich textu.

Použití: python3 nastroje/generuj-pokrok.py
Spusťte po každé změně úkolů v lekcích (přidání, přejmenování, přesun).
"""
import json, os, re, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
subprocess.run([sys.executable, os.path.join(ROOT, 'web', 'parse.py')], check=True, stdout=subprocess.DEVNULL)
data = json.load(open(os.path.join(ROOT, 'web', 'dist', 'data.json'), encoding='utf-8'))
P = os.path.join(ROOT, 'onboarding', 'POKROK.md')
old = open(P, encoding='utf-8').read() if os.path.exists(P) else ''
done = {m.group(1).strip() for m in re.finditer(r'^- \[x\] (.+)$', old, re.M)}
role = re.search(r'^\*\*Moje role:\*\*.*$', old, re.M)
plain = lambda s: re.sub(r'\[\[[a-z0-9]+\|([^\]]+)\]\]', r'\1', re.sub(r'[*`]', '', s)).strip()
out = ['# Pokrok v onboardingu', '', 'Zaškrtávejte `[x]`. Průvodce (`/spock-onboarding`) tento soubor čte a po vašem souhlasu ho aktualizuje.', '',
       role.group(0) if role else '**Moje role:** _(PM / PD / SWE / GM)_', '']
line = lambda t: f"- [{'x' if t in done else ' '}] {t}"
for w in data['W']:
    lab = w['lab'].split(' · ')[0]
    out += [f"## {lab}: {w['title']}", '']
    for d in w['days']:
        out += [f"**{d['d']} — {plain(d['t'])}**", '']
        out += [line(f"{d['d']} {plain(t['t'])}") for t in d['todo']] + ['']
    out += [line(f"Kvíz: {lab}: {w['title']}"), '']
open(P, 'w', encoding='utf-8').write('\n'.join(out).rstrip('\n') + '\n')
print(f"POKROK.md: {sum(len(d['todo']) for w in data['W'] for d in w['days'])} úkolů, zachováno zaškrtnutých: {len(done)}")
