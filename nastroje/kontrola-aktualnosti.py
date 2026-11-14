#!/usr/bin/env python3
"""Mechanická kontrola aktuálnosti onboardingu vůči repozitáři SPOCKu.

Použití: python3 nastroje/kontrola-aktualnosti.py [cesta/ke/SPOCKu]

Nic nemění. Vypíše zprávu v markdownu:
  1. verzi SPOCKu zapsanou v SPOCK-VERZE.md a verzi v dodané kopii,
  2. odkazy z lekcí, které ve SPOCKu neexistují (tasky, soubory, oddíly §),
  3. soubory SPOCKu změněné od zapsaného commitu a lekce, které na ně odkazují.
Návratový kód: 0 = vše sedí, 1 = něco k posouzení, 2 = chyba použití.
"""
import glob, os, re, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
LESSONS = sorted(glob.glob(os.path.join(ROOT, 'onboarding', '*.md'))) + [os.path.join(ROOT, 'README.md')]

def rel(p): return os.path.relpath(p, ROOT)

def recorded():
    t = open(os.path.join(ROOT, 'SPOCK-VERZE.md'), encoding='utf-8').read()
    get = lambda k: (re.search(r'^' + k + r':\s*(\S+)', t, re.M) or [None, None])[1]
    return get('release'), get('commit'), get('overeno')

def spock_release(spock):
    p = os.path.join(spock, 'RELEASE-NOTES.md')
    if not os.path.exists(p): return None
    m = re.search(r'^# SPOCK Workflow (\S+)', open(p, encoding='utf-8').read(), re.M)
    return m.group(1).rstrip(':') if m else None

def git(spock, *args):
    try: return subprocess.run(['git', '-C', spock, *args], capture_output=True, text=True, check=True).stdout.strip()
    except Exception: return None

def main():
    spock = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, '..', 'SPOCK-Workflow-1.0')
    if not os.path.isdir(os.path.join(spock, '.github')):
        print(f'Nenašel jsem SPOCK v {spock}. Zadejte cestu: python3 nastroje/kontrola-aktualnosti.py <cesta>'); return 2
    rel_rec, com_rec, date_rec = recorded()
    rel_now, com_now = spock_release(spock), git(spock, 'rev-parse', 'HEAD')
    issues = 0
    out = ['# Kontrola aktuálnosti onboardingu', '',
           f'- Onboarding napsán pro SPOCK **{rel_rec}** (commit `{(com_rec or "?")[:7]}`, ověřeno {date_rec})',
           f'- Dodaná kopie SPOCKu: **{rel_now or "?"}** (commit `{(com_now or "?")[:7]}`)', '']
    if rel_now and rel_rec and rel_now != rel_rec:
        out.append(f'**Vydání se liší ({rel_rec} → {rel_now}).** Přečtěte `RELEASE-NOTES.md` od verze {rel_rec}.'); out.append(''); issues += 1

    # 2. odkazy
    tasks = set(re.findall(r'"label":\s*"([^"]+)"', open(os.path.join(spock, '.vscode', 'tasks.json'), encoding='utf-8').read()))
    allf = glob.glob(os.path.join(spock, '**', '*'), recursive=True) + glob.glob(os.path.join(spock, '.github', '**', '*'), recursive=True) + glob.glob(os.path.join(spock, '.vscode', '*'))
    names = {os.path.basename(p) for p in allf}
    # Záměrné výjimky: soubory, které vznikají až při běhu, příkladové názvy a soubory, o kterých lekce
    # výslovně říká, že ve vydané kopii nejsou. Když přidáte výjimku, napište k ní důvod.
    generated = {'last-task.md', 'POKROK.md', 'denik.md',      # vzniká při běhu / soubor onboardingu
                 'rozhovory-2026-03.md', 'rozhovory.md',        # příklad v lekci PM
                 'repo-check.mjs', 'check.test.mjs'}            # jen ve vývojovém repozitáři (lekce 2G.4)
    bad = []
    for f in LESSONS:
        t = open(f, encoding='utf-8').read()
        for m in sorted(set(re.findall(r'`(SPOCK: [^`]+)`', t))):
            if m not in tasks and '…' not in m: bad.append((rel(f), 'task', m))
        for m in sorted(set(re.findall(r'`([^`\s]+\.(?:md|mjs|json|yaml|yml))`', t))):
            p = m.strip('/')
            if p.startswith('runs/') or 'SOLn' in p or '<' in p or '*' in p or '…' in p or os.path.basename(p) in generated: continue
            if not (os.path.exists(os.path.join(spock, p)) or os.path.basename(p) in names): bad.append((rel(f), 'soubor', m))
        for d, sec in sorted(set(re.findall(r'`([A-Z][A-Z0-9-]*\.md)` §([0-9]+(?:\.[0-9]+)?)', t))):
            c = glob.glob(os.path.join(spock, '**', d), recursive=True)
            if not c: continue
            if not re.search(r'^#+\s*(?:§\s*)?' + re.escape(sec) + r'(?:[.\s)]|$)', open(c[0], encoding='utf-8').read(), re.M):
                bad.append((rel(f), 'oddíl', f'{d} §{sec}'))
    out += ['## Odkazy, které ve SPOCKu neexistují', '']
    out += [f'- `{f}`: {k} `{v}`' for f, k, v in bad] or ['Žádné. Všechny tasky, soubory a oddíly z lekcí ve SPOCKu existují.']
    out.append(''); issues += bool(bad)

    # 3. změny od zapsaného commitu
    out += ['## Soubory SPOCKu změněné od zapsané verze', '']
    changed = git(spock, 'diff', '--name-only', f'{com_rec}..HEAD') if com_rec and com_now and com_rec != com_now else ''
    if changed is None:
        out.append(f'Commit `{com_rec[:7]}` v této kopii SPOCKu není (mělký klon?). Spusťte `git -C {spock} fetch --unshallow` a kontrolu opakujte.'); issues += 1
    elif not changed:
        out.append('Žádné. Kopie SPOCKu je na stejném commitu jako onboarding.')
    else:
        files = changed.split('\n'); issues += 1
        texts = {f: open(f, encoding='utf-8').read() for f in LESSONS}
        hit, other = [], 0
        for c in files:
            b = os.path.basename(c)
            refs = [rel(f) for f, t in texts.items() if b in t or c in t]
            if refs: hit.append(f'- `{c}` → {", ".join(refs)}')
            else: other += 1
        out.append(f'Změněno {len(files)} souborů. Na {len(hit)} z nich lekce přímo odkazují:'); out.append('')
        out += hit or ['- žádný']
        out += ['', f'Dalších {other} změněných souborů lekce nejmenují. I ty mohou změnit chování (agenti, skilly, kontroly), projděte je v `RELEASE-NOTES.md`.']
    print('\n'.join(out))
    return 1 if issues else 0

if __name__ == '__main__':
    sys.exit(main())
