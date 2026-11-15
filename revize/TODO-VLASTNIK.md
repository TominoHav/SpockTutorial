# Úkoly pro vlastníka tutoriálu

Věci, které nejde vyřešit v repozitáři ani je nemůže udělat Claude. Jsou to rozhodnutí a práce lidí v ČS. Hotové zaškrtněte `[x]` a připište, jak to dopadlo.

## A. Před sdílením s kolegy (nejdřív)

- [ ] **Ověřit, že interní údaje smí být tam, kde jsou.** Repozitář `TominoHav/SpockTutorial` i web obsahují jména a e-maily SPOCK core týmu, názvy rolí v REDIMu, odkaz na `csas-dev/spock-pilot` a PDF z bootcampu (`materialy/bootcamp/`). Zeptejte se bezpečnosti ČS, jestli to smí být v osobním repozitáři na GitHubu a na osobním účtu claude.ai. Když ne: přesunout repozitář pod organizaci ČS, nebo údaje a PDF odstranit.
  - Výsledek:
- [ ] **Rozhodnout, kde web trvale poběží.** Teď je na vašem osobním účtu claude.ai. Na něm visí sdílení, chat se Spockem i existence stránky. Možnosti: nechat na claude.ai (účet organizace), nebo interní web (soubor z GitHub Actions, viz `web/README.md`).
  - Výsledek:
- [ ] **Rozhodnout, jak poběží chat se Spockem pro celou banku.** Na claude.ai funguje každému s přístupem ke Claudovi. Mimo claude.ai je potřeba model schválený IT a malá serverová služba, nebo jen agent Spock průvodce v GitHub Copilotu.
  - Výsledek:
- [ ] **Sdílet web** kolegům přes menu Sdílet na stránce webu (jmenovitě nebo organizaci, ne „komukoli s odkazem“).

## B. Vlastnictví a provoz

- [ ] **Určit vlastníka obsahu a zástup.** Kdo schvaluje změny lekcí, kdo vás zastoupí a komu chodí nálezy od uživatelů. Jména doplňte do `ARCHITEKTURA.md`.
  - Vlastník: · Zástup: · Nálezy chodí:
- [ ] **Hlídat shodu `csas-dev/spock-pilot` a `TominoHav/SPOCK-Workflow-1.0`.** Měsíční kontrola aktuálnosti běží proti kopii `SPOCK-Workflow-1.0`. Uživatelé pracují s `spock-pilot`. Když vyjde nová verze v `spock-pilot`, nahrajte ji i do kopie, nebo pusťte kontrolu proti klonu `spock-pilot` (`python3 nastroje/kontrola-aktualnosti.py <cesta>`). Claude k `spock-pilot` přístup nemá.
  - Kdo to hlídá: · Jak často:
- [ ] **Zajistit měsíční kontrolu aktuálnosti nezávisle na jednom sezení.** Naplánovaná úloha (1. v měsíci, 8:56) je navázaná na jedno sezení Clauda. Když sezení zanikne, kontrola tiše přestane. Dejte si do kalendáře připomínku na 1. v měsíci: přišla zpráva o kontrole? Když ne, v Claude Code spusťte `/spock-aktualnost`.
- [ ] **Po každém sloučení změny publikovat web.** Sám se neaktualizuje. Postup je ve `web/README.md`. Verzi poznáte v patičce webu.

## C. Ověření lidmi

- [ ] **Odborná kontrola obsahu** podle [ODBORNA-KONTROLA.md](ODBORNA-KONTROLA.md) (289 položek, asi 8 hodin, rozdělit mezi GM, PM, SWE, PD a SPOCK core tým). Odpovědi u karet a kvízů se 14. 11. 2026 přeformulovaly, ověřte hlavně je.
- [ ] **Pilot s 3–5 nováčky** podle [PILOT-S-NOVACKY.md](PILOT-S-NOVACKY.md). Role v REDIMu ať si objednají týden předem.
- [ ] **Vyzkoušet agenta Spock průvodce** ve VS Code s GitHub Copilotem: otevřít repozitář tutoriálu v samostatném okně, vybrat „Spock průvodce“, napsat „Co mám dělat dál?“. Ověřit, že se objeví ve výběru, odpovídá z lekcí a zapisuje jen `POKROK.md`.
- [ ] **Vyzkoušet web na skutečných zařízeních:** iPhone, telefon s Androidem, iPad a firemní notebook s firemním prohlížečem. Dosud se testovalo jen v emulaci.
- [ ] **Ověřit, že kolegové mají přístup ke Claudovi** (kvůli chatu se Spockem), a zkusit chat pod cizím účtem.

## D. Později, podle potřeby

- [ ] **Sledování pokroku napříč lidmi.** Pokrok je jen v prohlížeči každého uživatele: nevidíte, kolik lidí co dokončilo ani kde odpadají. Na claude.ai jde doplnit sdílená databáze stránky (po rozhodnutí, jestli se smí sbírat pokrok jmenovitě). Mimo claude.ai je potřeba interní služba.
- [ ] **Sběr dotazníku.** Odpovědi se teď kopírují do schránky a posílají ručně. Rozhodněte, kam mají chodit.
- [ ] **České titulky nebo komentář k videu.** Video je anglicky.
- [ ] **Audit přístupnosti** (WCAG) někým, kdo to dělá. Automatický test hlídá jen názvy ovládacích prvků.
