# SPOCK Onboarding Tutorial: pracovní poznámky pro Claude

Krátká mapa, aby se při každé úpravě nemusel znovu procházet celý kód. Podrobnosti: `ARCHITEKTURA.md`.

## Pravidla (vždy)
- Texty česky, vykání, genderově neutrálně. Nevymýšlet interní procesy ČS ani schopnosti SPOCKu: fakta jen z `onboarding/` a z repozitáře SPOCKu (`../spock-workflow-1.0`, pokud je v relaci).
- Do SPOCKu ani Copilota jen data C1. Nikdy C2–C4, klientská a osobní data, bankovní tajemství, hesla, tokeny.
- Nikdy needitovat `.github/` ani `.vscode/` v repozitáři SPOCKu (tady `.github/` měnit lze).
- PR se slučuje a web zveřejňuje jen po výslovném „ano, slouč PR #N“ od uživatele.

## Kde co je
- `onboarding/*.md`: obsah lekcí (karty, úkoly, ověření `*Ověření:*` / `*Co jste viděli:*`, kvízy). `web/parse.py` z nich dělá `web/dist/data.json`.
- `web/app.js`: aplikace. Sekce hledej podle komentářů `/* ---------- název ---------- */` (`grep -n "^/\* ---" web/app.js`). Hlavní: stav `S` a `save()`, hra (XP, odznaky), kvíz `startSession`/`renderSession`, mapa `spmap`, úvod `homeV4`/`heroFirst`/`heroStable`, modul `renderWeek`, lekce `lessonPanel`, menu `shell`.
- `web/sim.js`: SPOCK nanečisto, dotazník `surveyCard`. `web/track.js`: měření, zpětná vazba `fbStore`, dashboard, tým, offline.
- CSS: `web/base-head.html` (základ a barvy `--…` pro světlý i tmavý režim), `home.css`, `game.css`, `sim.css`, `intro.css`, `path.css`. Nové styly přidávej na konec `sim.css`.
- `web/build.py`: spojí vše do jedné stránky `web/dist/spock-user-onboarding.html`, zmenší JS (esbuild), `BUILD` uloží i do `dist/build.json`.
- Testy: `nastroje/e2e/` (journey, scenare, pristupnost, vykon; testovací háčky `window.__kviz` jen v `e2e.html`). Rozpočet stránky 700 kB.

## Postup úpravy (šetří čas i tokeny)
1. Najdi místo cíleně: `grep -n` podle textu z UI nebo názvu funkce, čti jen pár řádků kolem (`sed -n a,bp`). Nečti celé soubory.
2. Uprav (Python `str.replace` s kontrolou `assert`, nebo Edit).
3. `nastroje/over.sh` sestaví a pustí všechny testy souběžně a vypíše jen souhrn a selhání (`nastroje/over.sh scenare` jen jednu sadu).
4. Přidej řádek PR do historie v `ARCHITEKTURA.md` (a počty kontrol v tabulce testů, když se změní).
5. Commit, push, PR přes `gh api repos/TominoHav/SpockTutorial/pulls` (GraphQL je blokované), počkat na CI.
6. Po „ano, slouč“: sloučit, `nastroje/over.sh`, `python3 nastroje/vydej.py <složka>`, zveřejnit stránku a záznam verze (`versions/<sha>`).

## Pasti
- `npm install --no-save` maže ostatní balíčky: instaluj `esbuild@0.24.2 axe-core@4.10.2` najednou. Playwright je globálně.
- Text v `.eyebrow` je přes CSS velkými písmeny: v testech porovnávej bez ohledu na velikost (`/…/i`).
- Kontrast: nová barva textu musí projít WCAG AA ve světlém i tmavém režimu (test přístupnosti).
