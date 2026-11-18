#!/usr/bin/env bash
# Sestaví web a pustí všechny čtyři sady testů (měřicí samostatně, ostatní souběžně). Vypíše jen souhrn a selhání,
# ať se při každé úpravě nečte dlouhý výstup. Druhé sestavení vloží výsledky testů do stránky.
# Použití: nastroje/over.sh            (vše)
#          nastroje/over.sh scenare    (jen vybrané sady)
set -u
cd "$(dirname "$0")/.."
SADY=${*:-journey scenare pristupnost vykon}
(cd web && python3 parse.py >/dev/null && python3 build.py >/dev/null) || { echo "SESTAVENÍ SELHALO"; exit 1; }
TMP=$(mktemp -d)
# journey a vykon měří rychlost načtení: běží samy, souběžné sady by jim čas zkreslily (88 ms → 143 ms)
for t in journey vykon; do case " $SADY " in *" $t "*) node "nastroje/e2e/$t.js" >"$TMP/$t.log" 2>&1;; esac; done
for t in $SADY; do case $t in journey|vykon) ;; *) node "nastroje/e2e/$t.js" >"$TMP/$t.log" 2>&1 & ;; esac; done
wait
RC=0
for t in $SADY; do
  printf '%-12s %s\n' "$t" "$(grep -E '^CELKEM' "$TMP/$t.log" | tail -1 || true)"
  grep -E '^FAIL' "$TMP/$t.log" | cut -c1-240
  grep -qE '^CELKEM' "$TMP/$t.log" || { echo "  sada nedoběhla, konec výpisu:"; tail -5 "$TMP/$t.log" | cut -c1-240; }
  grep -qE 'FAIL 0$' "$TMP/$t.log" || RC=1
done
(cd web && python3 build.py | tail -1 | sed 's/^/velikost stránky (B): /')
rm -rf "$TMP"; exit $RC
