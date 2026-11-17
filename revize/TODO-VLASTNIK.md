# Úkoly pro vlastníka tutoriálu

Věci, které nejde vyřešit v repozitáři ani je nemůže udělat Claude. Jsou to rozhodnutí a práce lidí v ČS. Hotové zaškrtněte `[x]` a připište, jak to dopadlo.

## A. Před sdílením s kolegy (nejdřív)

- [ ] **Ověřit, že interní údaje smí být tam, kde jsou.** Repozitář `TominoHav/SpockTutorial` i web obsahují jména a e-maily SPOCK core týmu, názvy rolí v REDIMu, odkaz na `csas-dev/spock-pilot` a PDF z bootcampu (`materialy/bootcamp/`). Zeptejte se bezpečnosti ČS, jestli to smí být v osobním repozitáři na GitHubu a na osobním účtu claude.ai. Když ne: přesunout repozitář pod organizaci ČS, nebo údaje a PDF odstranit.
  - Výsledek:
- [ ] **Rozhodnout, kde web trvale poběží.** Teď je na vašem osobním účtu claude.ai. Na něm visí sdílení, chat se Spockem i existence stránky. Možnosti: nechat na claude.ai (účet organizace), nebo interní web (soubor z GitHub Actions, viz `web/README.md`).
  - Výsledek:
- [ ] **Rozhodnout, jak poběží chat se Spockem pro celou banku.** Na claude.ai funguje každému s přístupem ke Claudovi. Mimo claude.ai je potřeba model schválený IT a malá serverová služba, nebo jen agent Spock průvodce v GitHub Copilotu.
  - Výsledek:
- [ ] **Posoudit licenci hlasu ve videích.** Videa „SPOCK krok za krokem“ namluvil syntetický hlas `en-us-ryan` (nástroj Piper). Jeho licence je CC BY-NC-SA 4.0: jen nekomerční použití a uvedení zdroje (RyanSpeech). Ověřte u právníků nebo bezpečnosti ČS, jestli se smí použít pro interní školení. Když ne, napište Claudovi, ať videa namluví jiným hlasem (například `libritts`, CC BY 4.0), nebo vrátí verze bez zvuku.
  - Výsledek:
- [ ] **Sdílet web** kolegům přes menu Sdílet na stránce webu (jmenovitě nebo organizaci, ne „komukoli s odkazem“). **Sdílejte jako Přispěvatel (Contributor).** Kdo má jen čtení, toho web neměří a jeho zpětná vazba se neuloží (dostane ji jen do schránky).
- [ ] **Ověřit, že smíte měřit průchod jmenovitě.** Web zaznamenává u každého přihlášeného člověka návštěvy, kliknutí, odpovědi, čas, zařízení a dotazy na Spocka a vy je v Dashboardu vidíte po jménech. Jde o sledování zaměstnanců: zeptejte se pověřence pro ochranu osobních údajů nebo bezpečnosti ČS, jestli je to v pořádku a jestli stačí oznámení v patičce webu. Když ne, napište Claudovi, ať měření vypne nebo anonymizuje.
  - Výsledek:

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
- [ ] **Ověřit odpovědi u úkolů „Ověření z VS Code“ proti `csas-dev/spock-pilot`.** Správné odpovědi (stav ukázkového běhu, počet řešení a variant MVP, datum podpisu G1, verze `brief-fields`, počty políček tasků) jsou ověřené proti kopii `SPOCK-Workflow-1.0` verze 1.16.1. Když se interní repozitář liší, uživatelé správnou odpověď nenajdou a úkol neodškrtnou.
- [ ] **Vyzkoušet agenta Spock průvodce** ve VS Code s GitHub Copilotem: otevřít repozitář tutoriálu v samostatném okně, vybrat „Spock průvodce“, napsat „Co mám dělat dál?“. Ověřit, že se objeví ve výběru, odpovídá z lekcí a zapisuje jen `POKROK.md`.
- [ ] **Vyzkoušet web na skutečných zařízeních:** iPhone, telefon s Androidem, iPad a firemní notebook s firemním prohlížečem. Dosud se testovalo jen v emulaci.
- [ ] **Ověřit, že kolegové mají přístup ke Claudovi** (kvůli chatu se Spockem), a zkusit chat pod cizím účtem.

## E. Přesun na vlastní server banky

Dnes web běží na claude.ai: identitu, databázi (pokrok, měření, zpětná vazba) a chat se Spockem poskytuje claude.ai. Pokrok je od listopadu 2026 uložený pod účtem každého člověka (`data/users/<člověk>/progress`), takže se dá pokračovat i z jiného zařízení. Na vlastním serveru je potřeba tyto části nahradit. Domluvit s IT banky:

- [ ] **Hosting stránky.** Kde poběží (interní web server), kdo ho spravuje a jak se na něj publikuje nová verze. Stránka je jeden soubor HTML a složka `media/`.
- [ ] **Přihlášení přes firemní identitu.** Jednotné přihlášení, aby web věděl, kdo je kdo. Bez něj nejde ukládat pokrok pod účtem ani měřit průchod.
- [ ] **Úložiště pokroku.** Jeden záznam na člověka, asi 50 kB. Načíst při otevření, uložit při změně. V kódu je to jedno místo: funkce `pLoad` a `pPush` ve `web/track.js`.
- [ ] **Úložiště měření a zpětné vazby pro dashboard.** Jeden záznam na člověka (nejvýš asi 20 kB, posledních 300 kroků), zpětná vazba a stav vyřízení. Při 500 lidech asi 10 MB. Dashboard potřebuje načíst všechny záznamy a pak jen změněné (podle času poslední aktivity).
- [ ] **Chat se Spockem.** Dnes používá Claude přes účet každého uživatele. Na vlastním serveru potřebuje schválený přístup k jazykovému modelu, nebo se vypne.
- [ ] **Tým a sdílený souhrn postupu.** Členové týmu vidí souhrn kolegů (role, hodnost, XP, postup, poslední aktivita) po souhlasu při připojení. Na claude.ai pravidla databáze neumí omezit čtení jen na členy stejného týmu, souhrny může technicky číst kdokoli s přístupem k aplikaci. Na vlastním serveru omezit čtení na členy týmu a projít s pověřencem pro ochranu osobních údajů.
- [ ] **Bezpečnost a ochrana osobních údajů.** Měření je jmenovité (kdo, kdy, kam klikal). Projít s bezpečností a pověřencem pro ochranu osobních údajů, doba uchování, kdo vidí dashboard.
- [ ] **Ikona na ploše telefonu.** Ikona (hlava Spocka na hvězdném nebi) je vložená ve stránce a připravená ve složce `web/ikona/` včetně manifestu. Na claude.ai ikonu při uložení na plochu určuje claude.ai; na vlastním serveru stačí složku nahrát vedle stránky a do hlavičky přidat odkaz na `manifest.webmanifest`.
- [ ] **Otevření úplně bez sítě.** Dnes funguje offline režim po načtení stránky: lekce, kvízy a hra jdou dál, pokrok se ukládá v zařízení, zpětná vazba čeká ve frontě a vše se odešle po připojení. Aby šla stránka i *otevřít* bez sítě (vlak, letadlo), potřebuje vlastní server s instalací jako aplikace (PWA, service worker, ukládání stránky a videí do zařízení). Na claude.ai to nejde.
- [ ] **Převod pokroku z claude.ai.** Lidé, kteří začnou na claude.ai, by po přesunu neměli začínat znovu. Domluvit jednorázový převod záznamů `data/users/*/progress` a `track/*`.
  - Kontakt v IT: · Termín:

## D. Později, podle potřeby

- [ ] **Po každé publikaci otevřít v Dashboardu záložku Verze a kvalita.** Tím se verze zapíše do historie a uvidíte, jestli prošly testy a co se zhoršilo (velikost, rychlost, tokeny). Bez otevření se verze do historie nedostane.
- [ ] **Procházet Dashboard a zpětnou vazbu**, ideálně jednou týdně: kde se lidé ztrácejí, které karty dělají potíže, otevřená zpětná vazba. Vyřízenou odškrtněte. Postup přepisu do repozitáře je v [TODO-ZPETNA-VAZBA.md](TODO-ZPETNA-VAZBA.md).
- [ ] **Měření mimo claude.ai.** Dashboard i zpětná vazba fungují jen na claude.ai. Při přesunu na interní server viz část E.
- [ ] **Sběr dotazníku.** Odpovědi z dotazníku na stránce Připravenost se pořád kopírují do schránky. Tlačítko Zpětná vazba už chodí do Dashboardu.
- [ ] **České titulky nebo komentář k videu.** Video je anglicky.
- [ ] **Audit přístupnosti** (WCAG) někým, kdo to dělá. Automatický test hlídá jen názvy ovládacích prvků.
