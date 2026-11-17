"""Připraví zveřejnění po sloučení PR: zapíše záznam verze (pro databázi versions) a zkopíruje stránku.
Použití: python3 nastroje/vydej.py <cílová složka>
Předtím spusťte nastroje/over.sh, aby stránka nesla výsledky testů."""
import json, os, shutil, sys, time
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
out = sys.argv[1] if len(sys.argv) > 1 else '.'
os.makedirs(out, exist_ok=True)
b = json.load(open(os.path.join(ROOT, 'web', 'dist', 'build.json'), encoding='utf-8'))
b['seen'] = int(time.time() * 1000)
json.dump(b, open(os.path.join(out, 'ver.json'), 'w', encoding='utf-8'), ensure_ascii=False)
shutil.copy(os.path.join(ROOT, 'web', 'dist', 'spock-user-onboarding.html'), out)
r = lambda k: (b.get(k) or {}).get('pass')
print(b['ver'], 'journey', r('e2e'), 'scénáře', r('scen'), 'přístupnost', r('a11y'), 'výkon', r('perf'))
