#!/usr/bin/env python3
"""Hlídá, že seznam modulů je všude stejný.

Zdroj je MODS ve web/parse.py. Každý soubor modulu musí existovat a být odkázaný
v onboarding/README.md. Průvodci (skill a agent) seznam lekcí neopakují, odkazují na README.

Použití: python3 nastroje/kontrola-struktury.py
"""
import os, re, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
rd = lambda *p: open(os.path.join(ROOT, *p), encoding='utf-8').read()
mods = re.findall(r"^ \('(\w+)','([\w-]+\.md)'", rd('web', 'parse.py'), re.M)
readme = rd('onboarding', 'README.md'); bad = []
for mid, fn in mods:
    if not os.path.exists(os.path.join(ROOT, 'onboarding', fn)): bad.append(f'{fn}: soubor modulu {mid} neexistuje')
    if f']({fn})' not in readme: bad.append(f'{fn}: chybí odkaz v onboarding/README.md')
for fn in sorted(os.listdir(os.path.join(ROOT, 'onboarding'))):
    if re.match(r'(uroven|role)-.*\.md$', fn) and fn not in [m[1] for m in mods]: bad.append(f'{fn}: soubor lekcí není v MODS ve web/parse.py, na webu nebude')
for p in [('.claude', 'skills', 'spock-onboarding', 'SKILL.md'), ('.github', 'agents', 'spock-pruvodce.agent.md')]:
    t = rd(*p)
    for f in re.findall(r'`((?:uroven|role)-[\w-]+\.md)`', t):
        if f not in [m[1] for m in mods]: bad.append(f"{'/'.join(p)}: odkazuje na {f}, který mezi moduly není")
# videa v lekcích musí mít soubor a náhled ve web/media
for fn in sorted(os.listdir(os.path.join(ROOT, 'onboarding'))):
    if not fn.endswith('.md'): continue
    t = rd('onboarding', fn)
    for vid in set(re.findall(r'\{\{video:([a-z0-9-]+)\}\}', t)):
        for f in (f'spock-{vid}.mp4', f'spock-{vid}-poster.jpg'):
            if not os.path.exists(os.path.join(ROOT, 'web', 'media', f)): bad.append(f'{fn}: video {vid} nemá soubor web/media/{f}')
    # ověření u úkolů: aspoň dvě možnosti a právě jedna správná
    for m in re.finditer(r'^  - \*(Ověření|Co jste viděli):\* (.+)\n((?:    - \[[ x]\] .+\n?)*)', t, re.M):
        o = re.findall(r'^    - \[([ x])\]', m.group(3), re.M)
        if len(o) < 2 or o.count('x') != 1: bad.append(f'{fn}: ověření „{m.group(2)[:50]}“ má {len(o)} možností a {o.count("x")} správných')
print(f'Moduly: {len(mods)}.', 'Struktura sedí.' if not bad else 'Nesedí:')
for b in bad: print(' -', b)
sys.exit(1 if bad else 0)
