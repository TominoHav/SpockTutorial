# Pilot s nováčky: scénář

**Cíl:** Zjistit, kde se člověk, který o SPOCKu nikdy neslyšel, v tutoriálu zasekne, co nepochopí a jestli ho to bavilo. Netestujeme lidi, testujeme tutoriál.

**Kdo:** 3–5 lidí, kteří SPOCK nikdy nepoužili. Ideálně mix rolí: PM, PD, SWE a jeden GM. Nikdo ze SPOCK core týmu ani ten, kdo tutoriál psal.

**Kolik času:** sezení 1 (60 min) pro každého, sezení 2 (90 min) jen pro ty, kteří mají schválené role v REDIMu.

## Příprava (týden předem)

- [ ] Vyberte účastníky a domluvte termíny.
- [ ] Sdílejte jim web tutoriálu (menu **Sdílet** na stránce webu) a ověřte, že ho otevřou a že mají přístup ke Claudovi (kvůli chatu se Spockem).
- [ ] Požádejte je, ať si **hned** objednají role v REDIMu (`CSIN\vcs_github_copilot`, `CSIN\GHB_DEV_SPOCK_WRITE`, `CSIN\CAAUTH_USR`). Schválení trvá dny a bez nich se sezení 2 nedá udělat.
- [ ] Připravte si pozorovací list (níže), jeden na účastníka.
- [ ] Ať účastníci otevřou web v anonymním okně nebo v prohlížeči, kde ho ještě neměli. Pokrok se ukládá v prohlížeči a začínat se má od nuly.

## Sezení 1: Poznejte SPOCK (60 min, jen web)

**Pravidla pro moderátora:** Nenapovídejte. Když se účastník zeptá, odpovězte „Co byste teď udělal(a), kdybych tu nebyl(a)?“. Pomozte jen tehdy, když se 3 minuty nehne dál, a zapište si to. Účastník mluví nahlas, co si myslí („myslím, že tohle tlačítko…“).

| Čas | Co účastník dělá | Na co se díváte |
|---|---|---|
| 0–5 min | Otevře web a bez návodu začne | Pochopí, co je SPOCK a kde začít? Vybere si roli? |
| 5–15 min | SPOCK nanečisto nebo video (podle sebe) | Projde simulaci do konce? Co ho zaujalo, co přeskočil? |
| 15–45 min | Úroveň 0: lekce 0.1–0.4 (karty a úkoly) | Kde čte dlouho, kde odpovídá špatně, co přeskakuje? Rozumí štítkům „jen na webu“ a „ve VS Code“? |
| 45–52 min | Kvíz úrovně 0 | Splní napoprvé (4 z 5)? Které otázky ho zaskočily? |
| 52–60 min | Rozhovor (otázky níže) | |

Kdo nestihne celou úroveň 0, nevadí. Zapište, kde skončil.

## Sezení 2: Příprava (90 min, VS Code, volitelné)

Jen pro účastníky se schválenými rolemi. Projdou úroveň 1 na vlastním počítači.

| Co sledovat | Proč |
|---|---|
| Kde instalace selže (katalog, Node.js, SSH certifikát, klonování) | Tady odpadá nejvíc lidí |
| Jestli najdou Command Palette a tasky `SPOCK:` | Bez toho nic dalšího nefunguje |
| Jestli vidí přesně šest agentů a zvolí správný model | Častá chyba nastavení |
| Kolik času zabrala každá lekce oproti odhadu | Odhady v tutoriálu jsou zatím teoretické |

## Pozorovací list (jeden na účastníka)

**Účastník:** role ______ · zkušenost s AI nástroji (žádná / trochu / hodně) ______ · zařízení (počítač / telefon) ______

| Lekce | Čas | Kde se zasekl(a) nebo zaváhal(a) | Co pochopil(a) špatně | Citát |
|---|---|---|---|---|
| Úvod a výběr role | | | | |
| SPOCK nanečisto / video | | | | |
| 0.1 | | | | |
| 0.2 | | | | |
| 0.3 | | | | |
| 0.4 | | | | |
| Kvíz | výsledek __ z 5 | | | |

**Ptal(a) se Spocka?** ano / ne · na co: ______

## Otázky po sezení

1. Jednou větou: co je SPOCK a k čemu vám bude?
2. Kdo ve SPOCKu rozhoduje, agent, nebo vy? Podle čeho to poznáte?
3. Jaká data do SPOCKu smíte vložit?
4. Co bylo nejtěžší nebo nejvíc matoucí?
5. Co vás bavilo, nebo překvapilo?
6. Na škále 1–5: chcete pokračovat Přípravou? Proč?

Otázky 1–3 ověřují, že úroveň 0 splnila účel. Když na ně účastník odpoví špatně, je to nález na obsah, ne na účastníka.

Nakonec požádejte účastníka, ať vyplní **dotazník na webu** (stránka Připravenost). Odpovědi se zkopírují do schránky a pošle vám je.

## Co z pilotu vyhodnotit

| Měřítko | Cíl |
|---|---|
| Úroveň 0 dokončená do 45 minut | aspoň 3 z 5 účastníků |
| Kvíz úrovně 0 napoprvé (4 z 5) | aspoň 3 z 5 |
| Správné odpovědi na otázky 1–3 po sezení | všichni |
| Místa, kde se zasekli aspoň dva lidé | 0 (každé takové místo je oprava) |
| Hodnocení „chci pokračovat“ | průměr aspoň 4 |

## Jak předat výsledky

Pozorovací listy a odpovědi na otázky dejte Claudovi (vložte je do chatu nebo uložte do `revize/pilot-vysledky.md`). Claude z nich navrhne konkrétní úpravy lekcí jako PR ke schválení. **Jména účastníků nezapisujte**, stačí role.
