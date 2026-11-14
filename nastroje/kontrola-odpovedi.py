#!/usr/bin/env python3
"""Hlídá, aby se správná odpověď nedala uhodnout podle délky nebo pořadí.

Použití: python3 nastroje/kontrola-odpovedi.py [--vypis]
Skončí chybou, když je správná odpověď nejdelší možností ve více než 50 % karet nebo kvízových otázek.
"""
import glob, os, re, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def bloky(text):
    """Vrátí seznam (druh, otázka, [možnosti], index správné)."""
    out = []
    for m in re.finditer(r'^\*\*Otázka:\*\* (.+)\n((?:- \[[ x]\] .+\n?)+)', text, re.M):
        o = re.findall(r'^- \[([ x])\] (.+)$', m.group(2), re.M)
        out.append(('karta', m.group(1), [x[1] for x in o], [i for i, x in enumerate(o) if x[0] == 'x'][0]))
    kv = text.split('\n## Kvíz', 1)
    if len(kv) == 2:
        for m in re.finditer(r'^\*\*\d+\. (.+?)\*\*\s*\n\n((?:   [a-e]\) .+\n)+)\n<details><summary>Odpověď</summary>\n\n([a-e])\)', kv[1], re.M):
            o = re.findall(r'^   [a-e]\) (.+)$', m.group(2), re.M)
            out.append(('kvíz', m.group(1), o, 'abcde'.index(m.group(3))))
    return out
if __name__ == '__main__':
    st = {'karta': [0, 0], 'kvíz': [0, 0]}
    for fn in sorted(glob.glob(os.path.join(ROOT, 'onboarding', '*.md'))):
        for druh, q, o, a in bloky(open(fn, encoding='utf-8').read()):
            L = [len(x) for x in o]; nej = L[a] == max(L) and L.count(max(L)) == 1
            st[druh][0] += 1; st[druh][1] += nej
            if nej and '--vypis' in sys.argv: print(f"{os.path.basename(fn)} | {q}\n   " + '\n   '.join(('* ' if i == a else '- ') + x for i, x in enumerate(o)))
    bad = False
    for d, (n, k) in st.items():
        p = round(100 * k / n) if n else 0; print(f"{d}: správná odpověď je nejdelší u {k} z {n} ({p} %)"); bad |= p > 50
    sys.exit(1 if bad else 0)
