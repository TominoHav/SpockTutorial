# Web onboardingu

Interaktivní web (Duolingo styl, simulace SPOCK nanečisto, průvodce Spock) se **sestavuje z lekcí v `onboarding/`**. Obsah se mění jen v markdownu, nikdy přímo v HTML.

## Sestavení

```bash
python3 web/parse.py
```

```bash
python3 web/build.py
```

Výsledek je `web/dist/spock-user-onboarding.html` (složka `dist/` není v gitu). Stránka načítá video a obrázek z `media/`. Při publikaci je dejte vedle stránky pod názvy `spock-intro.mp4` a `spock-intro-poster.jpg`.

## Test

Po každé změně spusťte kontroly. Na GitHubu běží samy při každém pull requestu a po sloučení do `main` (`.github/workflows/kontroly.yml`).

```bash
python3 nastroje/kontrola-struktury.py
```

```bash
python3 nastroje/kontrola-odpovedi.py
```

```bash
node nastroje/e2e/journey.js
```

```bash
npm install --no-save axe-core@4.10.2
```

```bash
node nastroje/e2e/scenare.js
```

```bash
node nastroje/e2e/pristupnost.js
```

```bash
node nastroje/e2e/vykon.js
```

End-to-end test projde cestu uživatele na počítači i na mobilu: simulaci, výběr role, karty, kvíz, zámky a skokový test, všech 9 modulů, oporu, dotazník, chat se Spockem, obnovení stránky a přístupnost. Potřebuje Node.js a Playwright s Chromiem.

Neprošlý test uloží snímek obrazovky do `web/dist/e2e-chyby/`. Test v Safari: `E2E_BROWSER=webkit E2E_ONLY=počítač node nastroje/e2e/journey.js` (potřebuje `npx playwright install webkit`).

## Publikace

Web je stránka na claude.ai (artifact). Po sloučení změny do `main` se **sám neaktualizuje**.

**Pořadí při publikaci:** sestavit (`parse.py`, `build.py`), pustit `node nastroje/e2e/journey.js`, `node nastroje/e2e/scenare.js`, `node nastroje/e2e/pristupnost.js` a `node nastroje/e2e/vykon.js`, a **znovu** `build.py`. Test zapíše zprávu `web/dist/e2e-report.json` (výsledky, rychlost v testu, velikost kontextu Spocka) a druhé sestavení ji vloží do stránky. Dashboard ji ukáže v záložce **Verze a kvalita** a zapíše verzi do historie, když ji vlastník poprvé otevře. Když se zdroje po testu změní, zpráva se nevloží a záložka hlásí, že testy pro tuto verzi neběžely.

**S Claudem (běžná cesta):** v Claude Code napište „Sestav web z main a publikuj ho na stejnou adresu“. Claude web sestaví, pustí testy a zeptá se na souhlas. Adresa webu a stránky s architekturou je v [ARCHITEKTURA.md](../ARCHITEKTURA.md).

**Bez Clauda:** hotový soubor si stáhnete z GitHubu. V repozitáři otevřete **Actions → Kontroly → poslední běh na `main` → Artifacts → spock-user-onboarding**. V balíčku je `spock-user-onboarding.html` a složka `media/`. Soubor a obě média dejte vedle sebe na interní web (SharePoint, Confluence, webový server). Mimo claude.ai funguje všechno kromě chatu se Spockem.

**Oprávnění stránky:** web potřebuje na claude.ai tři oprávnění: `sample` (chat se Spockem), `db` (měření a zpětná vazba) a `user` se jmény (dashboard). Pravidla databáze: `track` a `feedback` čtou jen vlastník a editoři, každý člověk zapisuje jen svůj dokument; `todo` a `versions` čtou a píší jen vlastník a editoři. Při publikaci je Claude předává nástroji Artifact, bez nich se měření tiše vypne.

**Verze:** v patičce webu je commit tutoriálu, datum a vydání SPOCKu, podle kterého je tutoriál napsaný. Podle ní poznáte, jestli je publikovaná nejnovější verze.

## Videa „SPOCK krok za krokem“

Jedno dlouhé video přes všech sedm fází a sedm krátkých klipů po fázích. Ukazují hotový ukázkový běh ze SPOCKu (`fixtures/2026-09-spending-insights`). Mají anglický komentář syntetickým hlasem a české titulky přímo v obraze.

- Scény, texty a titulky: `nastroje/video/video.html` (pole `SC`).
- Výroba: `node nastroje/video/record.js` vykreslí snímky v prohlížeči a ffmpeg z nich složí `web/media/spock-krok-za-krokem.mp4` a `spock-faze-1.mp4` až `spock-faze-7.mp4` i s náhledy. Jeden klip: `node nastroje/video/record.js faze-3`.
- V lekci se video vloží zápisem `{{video:krok-za-krokem}}` nebo `{{video:faze-3}}`. Úvodní video je `{{video}}`.
- **Anglický komentář:** text je v `nastroje/video/komentar-en.json`, jedna věta ke každému titulku. `python3 nastroje/video/komentar.py <hlas.onnx>` ho namluví syntetickým hlasem (nástroj Piper) a spočítá časování titulků podle délky vět. `node nastroje/video/record.js vse --en` pak vykreslí verze se zvukem do `web/dist/video-en/` (nejsou v gitu).
- **Verze v tutoriálu jsou ty s komentářem** (rozhodnutí vlastníka tutoriálu z 15. 11. 2026). Po vykreslení se soubory z `web/dist/video-en/` zkopírují do `web/media/` pod názvy bez `-en`.
- **Licence hlasu:** hlas `en-us-ryan` (Piper, data RyanSpeech) má licenci CC BY-NC-SA 4.0, tedy jen pro nekomerční použití. Použití v bance je potřeba posoudit, úkol je v `revize/TODO-VLASTNIK.md`. Jiný hlas stačí předat skriptu jako jiný soubor `.onnx` a videa vykreslit znovu.

## Co je kde

| Soubor | Co dělá |
|---|---|
| `parse.py` | Přečte `onboarding/*.md` a uloží obsah do `dist/data.json` |
| `build.py` | Složí stránku: `base-head.html` (vzhled), CSS soubory, moduly `js/*.js` a data |
| `js/10–22-*.js` | Aplikace: úvodní stránka, cesta, lekce, kvízy, odznaky, průvodce Spock |
| `js/60–61-*.js` | Simulace SPOCK nanečisto, vysvětlivky pojmů, dotazník |
| `js/70–76-*.js` | Měření, zpětná vazba, dashboard, pokrok pod účtem, tým |
| `*.css` | Vzhled jednotlivých částí |
| `media/` | Video a náhled videa |

## Na co dát pozor

- **Pořadí úkolů v lekci je klíč uloženého pokroku** (`modul.lekce.úkol` v prohlížeči). Nový úkol přidávejte na konec lekce, novou lekci na konec modulu. Jinak se uživatelům posune zaškrtnutý pokrok.
- **Fakta v simulaci** (`js/60-spock-nanecisto-zkraceny.js`) jsou ručně napsaná podle SPOCKu. Při kontrole aktuálnosti je projděte také.
- Text ve slovníku vysvětlivek (`TERMS_SRC` v `js/61-vysvetlivky-odbornych-slov.js`) a popisy rolí (`ROLE_WHO` v `js/`, najdete přes `grep -l ROLE_WHO web/js/*.js`) jsou mimo markdown.
