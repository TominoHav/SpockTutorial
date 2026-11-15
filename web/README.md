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

End-to-end test projde cestu uživatele na počítači i na mobilu: simulaci, výběr role, karty, kvíz, zámky a skokový test, všech 9 modulů, oporu, dotazník, chat se Spockem, obnovení stránky a přístupnost. Potřebuje Node.js a Playwright s Chromiem.

## Publikace

Web je stránka na claude.ai (artifact). Po sloučení změny do `main` se **sám neaktualizuje**.

**S Claudem (běžná cesta):** v Claude Code napište „Sestav web z main a publikuj ho na stejnou adresu“. Claude web sestaví, pustí testy a zeptá se na souhlas. Adresa webu a stránky s architekturou je v [ARCHITEKTURA.md](../ARCHITEKTURA.md).

**Bez Clauda:** hotový soubor si stáhnete z GitHubu. V repozitáři otevřete **Actions → Kontroly → poslední běh na `main` → Artifacts → spock-user-onboarding**. V balíčku je `spock-user-onboarding.html` a složka `media/`. Soubor a obě média dejte vedle sebe na interní web (SharePoint, Confluence, webový server). Mimo claude.ai funguje všechno kromě chatu se Spockem.

**Oprávnění stránky:** web potřebuje na claude.ai tři oprávnění: `sample` (chat se Spockem), `db` (měření a zpětná vazba) a `user` se jmény (dashboard). Pravidla databáze: `track` a `feedback` čtou jen vlastník a editoři, každý člověk zapisuje jen svůj dokument; `todo` čte a píše jen vlastník a editoři. Při publikaci je Claude předává nástroji Artifact, bez nich se měření tiše vypne.

**Verze:** v patičce webu je commit tutoriálu, datum a vydání SPOCKu, podle kterého je tutoriál napsaný. Podle ní poznáte, jestli je publikovaná nejnovější verze.

## Co je kde

| Soubor | Co dělá |
|---|---|
| `parse.py` | Přečte `onboarding/*.md` a uloží obsah do `dist/data.json` |
| `build.py` | Složí stránku: `base-head.html` (vzhled), CSS soubory, `app.js`, `sim.js` a data |
| `app.js` | Aplikace: úvodní stránka, cesta, lekce, kvízy, odznaky, průvodce Spock |
| `sim.js` | Simulace SPOCK nanečisto, vysvětlivky pojmů, dotazník |
| `*.css` | Vzhled jednotlivých částí |
| `media/` | Video a náhled videa |

## Na co dát pozor

- **Pořadí úkolů v lekci je klíč uloženého pokroku** (`modul.lekce.úkol` v prohlížeči). Nový úkol přidávejte na konec lekce, novou lekci na konec modulu. Jinak se uživatelům posune zaškrtnutý pokrok.
- **Fakta v simulaci** (`sim.js`) jsou ručně napsaná podle SPOCKu. Při kontrole aktuálnosti je projděte také.
- Text ve slovníku vysvětlivek (`TERMS` v `sim.js`) a popisy rolí (`ROLE_WHO` v `app.js`) jsou mimo markdown.
