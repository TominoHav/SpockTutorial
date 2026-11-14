---
name: spock-aktualnost
description: Měsíční kontrola, jestli je onboarding SPOCKu pořád aktuální. Porovná repozitář SPOCKu s lekcemi tohoto repozitáře, najde zastaralé části, určí jejich závažnost a navrhne úpravy. Nic nemění bez schválení. Použij, když uživatel napíše /spock-aktualnost nebo se ptá, jestli je onboarding aktuální vůči SPOCKu.
---

# Kontrola aktuálnosti onboardingu

Porovnej aktuální repozitář SPOCKu s tímto repozitářem (Onboarding Tutorial). Identifikuj změny, které ovlivňují jednotlivé lekce a praktické úkoly. Vypiš zastaralé části, jejich závažnost a navrhni konkrétní aktualizace. **Nic neměň bez schválení uživatele.**

Mluv česky, vykej. Fakta o SPOCKu ber jen ze souborů SPOCKu, ne z paměti.

## Postup

1. **Najdi SPOCK.** Obvykle `../SPOCK-Workflow-1.0` (uživatel ho přidal přes `claude --add-dir`). Když chybí, požádej o cestu a skonči. Doporuč `git -C <cesta> pull`, aby kopie byla aktuální.
2. **Spusť mechanickou kontrolu:** `python3 nastroje/kontrola-aktualnosti.py <cesta-ke-SPOCKu>`. Vypíše verzi z `SPOCK-VERZE.md` proti verzi SPOCKu, odkazy z lekcí, které ve SPOCKu nejsou, a změněné soubory SPOCKu s lekcemi, které na ně odkazují.
3. **Přečti, co se ve SPOCKu změnilo:**
   - `RELEASE-NOTES.md` od verze zapsané v `SPOCK-VERZE.md`,
   - `git -C <SPOCK> log --oneline <commit ze SPOCK-VERZE.md>..HEAD` a u souborů ze zprávy skriptu jejich `git diff`.
   - Zvlášť si všimni: `.vscode/tasks.json` (názvy tasků a jejich políčka), `.github/agents/` (agenti a nástroje), `.github/hooks/` a `guard-rules.mjs` (hlídače), `specifications/stage-specs/` (fáze), `SETUP.md`, `specifications/onboarding/` (TASKS, TESTER-GUIDE, KNOW-HOW-OWNERS), know-how a `.github/registry/skills.yaml` (mapa dopadu v lekci 2G.6), počty agentů, skillů, tasků a know-how.
4. **Přiřaď změny k lekcím.** Pro každou změnu najdi v `onboarding/*.md` lekci, úkol, kvízovou otázku, řádek taháku nebo slovníku, které popisují původní stav. Prohledávej i bez přímého odkazu na soubor (název tasku, pojem, číslo kontroly, počet).
5. **Ověř, co jde ověřit prakticky.** Když se změnil task, vyzkoušej ho na kopii SPOCKu ve dočasné složce (`node .github/scripts/task.mjs …` s políčky v proměnných `SPOCK_BOX_<id>`). Originální kopii SPOCKu neměň.
6. **Vypiš zprávu** v tomto tvaru:

| Závažnost | Kde v onboardingu | Co se ve SPOCKu změnilo | Navržená úprava |
|---|---|---|---|

   Závažnost:
   - **kritická**: postup v lekci nefunguje (task neexistuje, jiná políčka, jiný postup instalace) nebo vede k chybě v běhu,
   - **vysoká**: lekce tvrdí něco, co už neplatí (pravidlo, brána, počet, agent),
   - **střední**: chybí nová funkce nebo změna, kterou by uživatel měl znát,
   - **nízká**: formulace, odkaz na oddíl, kosmetika.

   Na konec dej souhrn: kolik nálezů podle závažnosti a které lekce jsou nejvíc dotčené. Když nic nenajdeš, řekni to rovnou.
7. **Počkej na schválení.** Zeptej se, které úpravy provést. Bez výslovného souhlasu nic neměň.

## Po schválení

1. Uprav jen schválené části v `onboarding/*.md` (případně `.claude/skills/spock-onboarding/SKILL.md`). Piš stejným stylem: česky, vykání, krátké věty, zkratky rolí PM, PD, SWE, GM.
2. Když přidáváš úkol nebo kvízovou otázku, přidej je **na konec** lekce nebo kvízu. Pořadí stávajících úkolů ovlivňuje uložený pokrok uživatelů webu. Nové úkoly doplň i do `onboarding/POKROK.md`.
3. Přepiš `SPOCK-VERZE.md`: nové `release`, `commit` a dnešní datum v `overeno`.
4. Znovu spusť `python3 nastroje/kontrola-aktualnosti.py <SPOCK>` a ověř, že odkazy sedí.
5. Sestav web: `python3 web/parse.py && python3 web/build.py` (návod v `web/README.md`).
6. Commit a push dělej jen na pokyn uživatele, na nové větvi, a nabídni pull request. Publikaci webu nech na uživateli.
