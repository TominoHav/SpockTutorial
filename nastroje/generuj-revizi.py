#!/usr/bin/env python3
"""Vygeneruje revize/ODBORNA-KONTROLA.md: kontrolní seznam pro odbornou kontrolu obsahu.

Každá karta, otázka kvízu a sada úkolů lekce je jeden řádek k zaškrtnutí.
Zaškrtnuté řádky ([x]) a poznámky pod nimi se při novém vygenerování zachovají podle textu řádku.

Použití: python3 nastroje/generuj-revizi.py
"""
import json, os, re, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
subprocess.run([sys.executable, os.path.join(ROOT, 'web', 'parse.py')], check=True, stdout=subprocess.DEVNULL)
data = json.load(open(os.path.join(ROOT, 'web', 'dist', 'data.json'), encoding='utf-8'))
P = os.path.join(ROOT, 'revize', 'ODBORNA-KONTROLA.md')
os.makedirs(os.path.dirname(P), exist_ok=True)
old = open(P, encoding='utf-8').read() if os.path.exists(P) else ''

# zachovat zaškrtnutí a poznámky (řádky "  - Nález: …" pod položkou)
kept = {}
cur = None
for ln in old.split('\n'):
    m = re.match(r'^- \[([ x])\] (.+)$', ln)
    if m: cur = m.group(2).strip(); kept[cur] = [m.group(1) == 'x', []]; continue
    if cur and ln.startswith('  - '): kept[cur][1].append(ln)
    elif not ln.strip(): continue
    else: cur = None

plain = lambda s: re.sub(r'\s+', ' ', re.sub(r'\[\[[a-z0-9]+\|([^\]]+)\]\]', r'\1', s or '')).strip()
def item(text):
    k = kept.get(text, [False, []])
    return [f"- [{'x' if k[0] else ' '}] {text}"] + k[1]

# pořadí podle rizika: co je nejhlubší a nejméně ověřené, jde první
ORDER = ['gm', 'l1b', 'pm', 'se', 'pd', 'l3', 'l4', 'l1', 'l0']
WHO = {
    'gm': 'Guild Master Product Management (metodika, know-how, architektura)',
    'l1b': 'Guild Master Product Management a SWE se znalostí specifikací fází',
    'pm': 'zkušený PM ze SPOCK pilotu',
    'se': 'SWE ze SPOCK pilotu, u compliance i někdo z compliance',
    'pd': 'Product Designer ze SPOCK pilotu nebo Guild Master CoE Product Design',
    'l3': 'superuser nebo SPOCK core tým',
    'l4': 'SPOCK core tým',
    'l1': 'Ilya Shramov (repozitář a prostředí) a SPOCK core tým (přístupy, data)',
    'l0': 'SPOCK core tým',
}
mods = {w['id']: w for w in data['W']}
tot_cards = sum(len(l.get('cards', [])) for w in data['W'] for l in w['days'])
tot_quiz = sum(len(w['quiz']) for w in data['W'])

out = ['# Odborná kontrola obsahu', '',
       f'Kontrolní seznam všech karet ({tot_cards}), kvízových otázek ({tot_quiz}) a úkolů tutoriálu. Moduly jsou seřazené podle rizika: nejdřív obsah, který je nejhlubší a nejméně ověřený.', '',
       '**Jak kontrolovat:** Mějte vedle otevřený web tutoriálu (modul a lekci podle nadpisu). U každé položky ověřte čtyři věci:', '',
       '1. **Fakta:** odpovídá to SPOCKu (verze v `SPOCK-VERZE.md`) a praxi v ČS?',
       '2. **Odpověď:** je správná odpověď jednoznačně správná a ostatní jasně špatné?',
       '3. **Srozumitelnost:** pochopí to nováček bez dalšího vysvětlení?',
       '4. **Citlivost:** nejsou tam jména, data nebo interní údaje, které tam být nemají?', '',
       '**Jak zapisovat:** Když je vše v pořádku, změňte `[ ]` na `[x]`. Když ne, napište pod položku řádek začínající dvěma mezerami a pomlčkou, např. `  - Nález: správně je … (zdroj: …)`, a položku nechte nezaškrtnutou. Nálezy pak předejte Claudovi k opravě, nebo pošlete komentář přímo na webu.', '',
       '**Obnovení seznamu:** `python3 nastroje/generuj-revizi.py`. Zaškrtnutí i nálezy zůstanou zachované.', '']

for mid in ORDER:
    w = mods.get(mid)
    if not w: continue
    nc = sum(len(l.get('cards', [])) for l in w['days']); nq = len(w['quiz'])
    mins = round((nc * 1.5 + nq * 1 + sum(len(l['todo']) for l in w['days']) * 2) / 5) * 5
    out += [f"## {w['lab']}: {w['title']}", '',
            f"**Kdo by měl kontrolovat:** {WHO.get(mid, '')}  ",
            f"**Rozsah:** {nc} karet, {nq} kvízových otázek · asi {mins} minut", '']
    for l in w['days']:
        out += [f"### {l['d']} {plain(l['t'])}", '']
        for c in l.get('cards', []):
            ans = plain(c['o'][c['a']]) if c.get('o') and c.get('a', -1) >= 0 else '—'
            out += item(f"Karta „{plain(c['t'])}“ · otázka: {plain(c['q'])} → správně: {ans}")
        if l['todo']:
            out += item(f"Úkoly lekce {l['d']} ({len(l['todo'])}): " + '; '.join(plain(t['t']) for t in l['todo']) + ' · kroky a čas sedí')
        out += ['']
    if w['quiz']:
        out += ['### Kvíz modulu', '']
        for q in w['quiz']:
            ans = plain(q['o'][q['a']]) if q['o'] else '—'
            out += item(f"Kvíz: {plain(q['q'])} → správně: {ans}")
        out += ['']

out += ['## Mimo moduly', '']
for t in ['Slovník (`onboarding/slovnik.md`): definice pojmů sedí', 'Tahák (`onboarding/tahak.md`): názvy tasků a kdy je spustit',
          'Diagnostika (`onboarding/diagnostika.md`): příznak → příčina → co udělat', 'Zásady (`onboarding/zasady.md`): principy a časté chyby',
          'Připravenost (`onboarding/pripravenost.md`): sebehodnocení ke každé úrovni', 'Simulace SPOCK nanečisto (na webu): průběh sedmi fází a texty rozhodnutí',
          'Kontakty v lekci 1.1: jména, role a e-maily jsou aktuální']:
    out += item(t)
open(P, 'w', encoding='utf-8').write('\n'.join(out).rstrip('\n') + '\n')
n = sum(1 for x in out if x.startswith('- ['))
print(f"ODBORNA-KONTROLA.md: {n} položek, zachováno zaškrtnutých: {sum(1 for v in kept.values() if v[0])}")
