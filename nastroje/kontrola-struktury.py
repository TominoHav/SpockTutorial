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
print(f'Moduly: {len(mods)}.', 'Struktura sedí.' if not bad else 'Nesedí:')
for b in bad: print(' -', b)
sys.exit(1 if bad else 0)
