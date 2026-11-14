# Tahák pro uživatele SPOCKu

**Jak task spustit:** otevřete Command Palette (**Cmd+Shift+P** na Macu, **Ctrl+Shift+P** na Windows, nebo **View → Command Palette**), napište `run task`, vyberte **Tasks: Run Task** a potvrďte Enter. Stejný seznam otevře i menu **Terminal → Run Task…**. V seznamu napište část názvu tasku, vyberte ho a potvrďte Enter. Když task otevře nahoře políčko, vyplňte ho a potvrďte Enter. Esc ho zruší a nic se nezapíše. Celý seznam tasků je v `specifications/onboarding/TASKS.md` ve vaší kopii SPOCKu.

**Pravidlo:** task, který **otevírá políčka**, spouštíte jen **vy**. Task bez políček smí spustit i agent.

## Začátek a nastavení

| Task | Kdy | Políčka |
|---|---|---|
| `SPOCK: check my setup` | po instalaci a vždy, když něco nefunguje | nástroj (GitHub Copilot) |
| `SPOCK: start a run` | na začátku běhu, když vás na něj pošle Product Manager | id běhu, jméno, role |
| `SPOCK: update this copy to the latest release` | po dokončení běhu, se zavřenými chaty | update |
| `SPOCK: what this build can say about itself` | když potřebujete aktuální čísla | — |

## Během běhu

| Task | Kdy | Políčka |
|---|---|---|
| `SPOCK: continue` | posune běh k dalšímu místu, kde rozhodujete | — |
| `SPOCK: approve what is in front of me` | schválení (G1, G2, G4, G5b, G6, G7) | jméno, role, odpovědi na otázky brány, co jste chtěli změnit |
| `SPOCK: record a decision I made` | volba řešení (fáze 4) a varianty MVP (fáze 5) | druh, id, proč, jméno, role |
| `SPOCK: record who owns this stage` | na začátku fáze, když práci dělá někdo jiný, než kdo ji schválí | jméno, role |
| `SPOCK: mark the PRD agreed` | fáze 6, před schválením G6 | jméno |
| `SPOCK: record the Jira key` | fáze 7 | klíč nebo `none yet` |

## Materiál

| Task | Fáze | Políčka |
|---|---|---|
| `SPOCK: read in the problem material` | 2: první načtení souborů ze `supplied/` | — |
| `SPOCK: date the material that arrived without dates` | 2: soubory bez data | období (`as listed`, opravy za středník: `as listed; soubor.md: 2026-Q2`; období je `2026`, `2026-Q2` nebo `2026-04`), jméno |
| `SPOCK: add problem material` | 2: nový nebo změněný soubor | yes / no |
| `SPOCK: add a problem in my own words` | 2 | problém |
| `SPOCK: take in what I pasted in the chat` | 2 nebo 3: text zkopírovaný ve schránce | jméno |
| `SPOCK: what market material has been supplied` | 3: váš seznam trhu v `supplied/` | yes / no |

## Kontroly a stav

| Task | Co udělá |
|---|---|
| `SPOCK: run one gate` | spustí bránu aktuální fáze: pass / fail / incomplete |
| `SPOCK: explain what the gate failed` | ke každé neprošlé kontrole řekne, co a proč |
| `SPOCK: check the whole run` | všechny kontroly nad celým během |
| `SPOCK: which gates can run in full` | která polovina které brány proběhla |
| `SPOCK: how the workflow performed` | přehled ze záznamů běhů |

## Když něco nejde podle plánu

| Task | Kdy | Políčka |
|---|---|---|
| `SPOCK: send a stage back to be redone` | fázi je potřeba přepracovat | fáze, jméno, důvod, role |
| `SPOCK: keep a later stage as it is` | stale fáze stále platí | fáze, jméno, důvod, role |
| `SPOCK: sign off a check this run cannot meet` | kontrolu běh opravdu splnit nemůže | 6 políček |
| `SPOCK: record that I edited a document` | dokument jste ručně upravili | cesta, co, proč, jméno |
| `SPOCK: take something back` | soubor do běhu nepatří | soubor, důvod, jméno |
| `SPOCK: replace a decision that no longer stands` | rozhodnutí už neplatí | 8 políček |
| `SPOCK: correct a name on the record` | překlep ve jméně | 4 políčka |
| `SPOCK: stop this run` | běh končí natrvalo | jméno, důvod (jen `low_value`, `small_impact`, `high_risk` nebo `out_of_boundary`), poznámka |

## Agenti

| Agent | Kdy |
|---|---|
| Product Manager | fáze 1, 4 a 5. Začátek: `Start a discovery run.` |
| Opportunity Designer | fáze 2 |
| Competitive Analysis | fáze 3 |
| Business Analyst | fáze 6 a 7 |
| Workflow Support | „Kde běh stojí a co mám udělat?“ |
| Methodology Coach | otázky k metodě |

## Zkratky ve VS Code

| Co | Jak |
|---|---|
| Command Palette | View → Command Palette (Cmd+Shift+P / Ctrl+Shift+P) |
| Nový chat | ikona **+** v Copilot Chatu |
| Export chatu | Command Palette → `Chat: Export Chat...` |
| Znovu načíst okno | Command Palette → `Developer: Reload Window` |
| Celý text tasku | panel Terminal nebo `.github/last-task.md` |
