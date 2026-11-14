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
