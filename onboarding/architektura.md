# Architektura SPOCKu

## 7 fází běhu

| # | Fáze | Agent | Brány | Vstup | Výstup | Poznámka |
|---|---|---|---|---|---|---|
| 1 | Brief | Product Manager | Q1 · G1 | Rozhovor s PM, případně přiložený brief. | Initiative brief s cílem, segmentem, metrikou a unknowns. | Outcome musí být změna chování zákazníka, ne řešení. |
| 2 | Problémy a příležitosti | Opportunity Designer + Material Intake | Q2 · G2 | Materiál od uživatele: rozhovory, data, tickety. | Hypotézy a seřazené příležitosti O1, O2… | Materiál čte agent v karanténě, bez přístupu ven. |
| 3 | Trh | Competitive Analysis | Q3 · bez G | Vyhledávání nebo soubor trhu od uživatele. | Karty konkurentů s citovanými zdroji. | Jediná fáze bez rozhodnutí člověka. Každý zdroj musí být otevřená stránka. |
| 4 | Řešení | Product Manager | Q4 · G4 | Příležitosti a trh. | Nápady na řešení a vybrané řešení. | Člověk vybírá taskem approve and record which one I chose. |
| 5 | MVP | Product Manager | Q5 · G5a, G5b | Vybrané řešení. | Varianty MVP a rozhodnutí. | Dvě rozhodnutí: varianta a její potvrzení. |
| 6 | PRD | Business Analyst | Q6 · G6 | MVP a strategie. | PRD s prohlášením o souladu se strategií. |  |
| 7 | Iniciativa | Business Analyst | Q7 · G7 | PRD. | Iniciativa podle šablony Product Management Guildu. | Každé tvrzení jde dohledat zpět k materiálu. |

## Vrstvy

| Vrstva | Soubory | Kdo upravuje | Co dělá | Přirovnání |
|---|---|---|---|---|
| Sdílená pravidla | `.github/copilot-instructions.md, instructions/*.md` | builder | Pravidla, která platí pro všechny agenty: obálka výstupu, stav běhu, co se nesmí nikdy. | Pracovní řád firmy. Platí pro všechny zaměstnance. |
| Agent (wrapper) | `.github/agents/*.agent.md` | builder | Identita agenta, jeho nástroje (tools:) a které skilly načte. Záměrně tenký. | Pracovní smlouva: kdo jsem a co smím. |
| Skill | `.github/skills/{id}/SKILL.md` | vy | Kontrakt kroku (vstupy, výstup, zákazy) a postup krok za krokem. Tady žije chování. | Pracovní postup: jak se tahle práce dělá. |
| Know-how | `specifications/definitions/know-how/ → .github/know-how/` | vy | Co znamená „dobře": metodika, šablony, regulatorika. Skill ho čte, nikdy nepíše. Zdroj se edituje, cíl se generuje. | Odborná příručka, ze které se zaměstnanec učí. |
| Registry | `.github/registry/*.yaml` | builder | Jediný zdroj pravdy o tom, co existuje: agenti, skilly, kontroly, zdroje, vlastníci. | Organizační schéma a evidence. |
| Kontrakty | `.github/workflow-contracts/*.yaml` | builder | Pořadí kroků, co každý potřebuje a vyrobí a kritéria bran. | Proces: co následuje po čem. |
| Kontroly a brány | `.github/scripts/check.mjs, gates.mjs` | builder | Po zápisu kód ověří výstup. Každá kontrola má pole why a negativní případ. | Kontrola kvality na konci linky. |
| Hlídače kroků (hooks) | `.github/hooks/ → step-guard.mjs → guard-rules.mjs` | builder | Za běhu odmítají špatné kroky agenta ještě předtím, než se stanou. Záznam je v .github/.guard/. | Turniket: nepustí vás, kam nemáte. |
| Tasky | `.vscode/tasks.json` | builder | Tlačítka, kterými agent i člověk spouštějí skripty. Schválení má okno pro jméno, které vyplní jen člověk. | Razítko a podpis. |
