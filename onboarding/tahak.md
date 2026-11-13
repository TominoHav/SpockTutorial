# Tahák

## Terminál ve VS Code

| Příkaz / zkratka | Co dělá | Ve VS Code |
|---|---|---|
| `Terminal → New Terminal` | otevře terminál dole ve VS Code, rovnou ve složce projektu (jinak Cmd+Shift+P → Terminal: Create New Terminal) | — |
| `Cmd+K (kurzor v terminálu)` | vyčistí obrazovku terminálu | — |
| `Cmd+C / Cmd+V` | zkopíruje označený výstup / vloží příkaz | — |
| `Enter` | spustí napsaný příkaz | — |
| `ikona koše / + v panelu terminálu` | zavře terminál / otevře další | — |

## Kde jsem a co tu je

| Příkaz / zkratka | Co dělá | Ve VS Code |
|---|---|---|
| `pwd` | vypíše, ve které složce terminál je | — |
| `ls` | vypíše, co ve složce je | Explorer vlevo |
| `cd složka / cd ..` | vejde do složky / o úroveň výš | Terminal → New Terminal otevře terminál rovnou ve složce projektu |

## Git: stav a změny

| Příkaz / zkratka | Co dělá | Ve VS Code |
|---|---|---|
| `git status` | na jaké jsem větvi a co je změněné, ale neuložené | Source Control vlevo (ikona větvení) |
| `git diff` | co přesně se změnilo (− staré, + nové; q = konec) | klik na soubor v Source Control |
| `git restore .` | zahodí všechny neuložené změny (natrvalo) | Source Control → šipka Discard All Changes |
| `git commit -am "proč"` | uloží změny jako verzi s popisem | Source Control → zpráva → Commit |
| `git add soubor / git add .` | připraví změny k uložení (jeden soubor / všechny); commit -am to dělá za vás u už sledovaných souborů | Source Control → + u souboru |
| `git restore soubor` | vrátí jeden soubor do stavu posledního commitu (stejné jako git checkout -- soubor) | Source Control → šipka Discard Changes u souboru |
| `git stash / git stash pop` | odloží rozpracované změny stranou / vrátí je zpět, třeba když potřebujete rychle přepnout větev | Source Control → … → Stash |

## Git: větve

| Příkaz / zkratka | Co dělá | Ve VS Code |
|---|---|---|
| `git checkout main` | přepne na hlavní větev | název větve vlevo dole ve VS Code → vybrat |
| `git checkout -b pokus/nazev` | založí zkušební větev a přepne na ni | název větve vlevo dole → Create new branch |
| `git log --oneline` | historie verzí, HEAD = kde jste | Source Control → Graph |
| `git branch` | vypíše větve; hvězdička = ta, na které jste | — |
| `git branch -d pokus/nazev` | smaže větev, jen pokud je už sloučená (bezpečné); u nesloučené odmítne a napíše „not fully merged“ | — |
| `git branch -D pokus/nazev` | smaže větev i se změnami, které nikde jinde nejsou (natrvalo; pro zkušební větve) | — |
| `git switch nazev` | novější a čitelnější varianta git checkout nazev; git switch -c nazev založí novou větev | — |

## Git: GitHub a vzdálený repozitář

| Příkaz / zkratka | Co dělá | Ve VS Code |
|---|---|---|
| `git remote -v` | ukáže, kam vede origin (odkud jste repozitář stáhl a kam by šel push) | — |
| `git pull` | stáhne novinky z origin do aktuální větve | Source Control → … → Pull |
| `git push` | nahraje vaše commity do origin; nejdřív ověřte git remote -v, ať nepushujete do cizího repozitáře | Source Control → Sync Changes |
| `git push -u moje nazev-vetve` | poprvé nahraje větev do vašeho vlastního remote (moje), další push už stačí bez parametrů | — |

## Soubory a složky

| Příkaz / zkratka | Co dělá | Ve VS Code |
|---|---|---|
| `mkdir -p slozka` | založí složku (a s -p i chybějící nadřazené); když existuje, nic neudělá | Explorer → ikona nové složky |
| `cp -R zdroj cil` | zkopíruje složku i s obsahem, např. ukázkový běh do runs/ | — |
| `rm -rf slozka` | natrvalo smaže složku i s obsahem, bez koše; používejte jen na vlastní kopie (runs/test-…) | Explorer → Delete (jde do koše) |
| `cat soubor / less soubor` | vypíše soubor / zobrazí ho po stránkách (q = konec) | Cmd+P → název souboru |
| `open .` | otevře aktuální složku ve Finderu | Explorer → pravé tlačítko → Reveal in Finder |
| `příkaz | grep text` | z výstupu příkazu vybere jen řádky s textem, např. check.mjs runs/x | grep C900 | — |
| `příkaz | head -20` | ukáže jen prvních 20 řádků výstupu | — |

## SPOCK

| Příkaz / zkratka | Co dělá | Ve VS Code |
|---|---|---|
| `node .github/scripts/check.mjs runs/<běh>` | spustí kontroly nad během a vypíše PASS / FAIL | Tasks: Run Task → SPOCK: check the whole run |
| `… --gates` | ukáže, které kontroly patří ke které bráně | — |
| `node .github/scripts/repo-check.mjs` | ověří, že registry, wrappery a skilly spolu sedí | — |
| `grep -rn "text" .github` | najde text ve všech souborech | Cmd+Shift+F |

## Když se něco zasekne

| Příkaz / zkratka | Co dělá | Ve VS Code |
|---|---|---|
| `:` | dlouhý výstup po stránkách: mezerník = dál, q = konec | — |
| `šipka nahoru` | vrátí poslední příkaz, můžete ho opravit | — |
| `Ctrl+C` | zastaví běžící příkaz | — |
| `clear` | vyčistí obrazovku terminálu (stejně jako Cmd+K) | — |
| `Tab` | doplní začátek názvu souboru nebo složky | — |
