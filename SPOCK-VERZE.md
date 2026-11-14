# Verze SPOCKu, podle které je onboarding napsaný

Onboarding popisuje konkrétní vydání SPOCKu. Když se SPOCK změní, porovnejte ho s touto verzí (viz [Údržba](#údržba)).

release: 1.16.1
commit: d39b0145d5c0fee0b3490d1360ec6d07da8fb494
repozitar: https://github.com/TominoHav/SPOCK-Workflow-1.0
overeno: 2026-11-14

Řádky výše čte `nastroje/kontrola-aktualnosti.py`. Vedle nich je v `nastroje/spock-otisk.json` **otisk všech souborů SPOCKu** v této verzi (cesta a kontrolní součet). Díky otisku skript pozná, co se ve SPOCKu změnilo, i když nová verze vyjde jako nový repozitář bez společné historie gitu (dnešní repozitář SPOCKu má jediný commit).

Po každé schválené aktualizaci onboardingu přepište řádky výše na novou verzi SPOCKu a dnešní datum a uložte nový otisk:

```bash
python3 nastroje/kontrola-aktualnosti.py ../SPOCK-Workflow-1.0 --zapis-otisk
```

## Údržba

Jednou měsíčně (a po každém novém vydání SPOCKu) spusťte v Claude Code ve složce tohoto repozitáře:

```bash
claude --add-dir ../SPOCK-Workflow-1.0
```

a napište `/spock-aktualnost`. Příkaz:

1. spustí `nastroje/kontrola-aktualnosti.py`, který mechanicky porovná onboarding se SPOCKem,
2. projde změny ve SPOCKu od verze výše a určí, které lekce a úkoly ovlivňují,
3. vypíše zastaralé části se závažností a návrhem konkrétní úpravy,
4. **nic nezmění bez vašeho schválení.**

Skript jde spustit i samostatně:

```bash
python3 nastroje/kontrola-aktualnosti.py ../SPOCK-Workflow-1.0
```
