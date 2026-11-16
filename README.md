# SPOCK Tutorial

Uživatelský onboarding do SPOCKu pro **Product Managera, Product Designera, Software Engineera a Guild Mastera (správce know-how)**, od instalace po vlastní běh, Guild Mastera až po superusera. Vychází ze zdrojového repozitáře [SPOCK-Workflow-1.0](https://github.com/TominoHav/SPOCK-Workflow-1.0).

- `onboarding/`: lekce podle úrovní a rolí, tahák, slovník, diagnostika, pokrok
- `.claude/skills/spock-onboarding/`: průvodce, v Claude Code se spouští příkazem `/spock-onboarding`
- `.github/agents/spock-pruvodce.agent.md`: stejný průvodce jako agent **Spock průvodce** v GitHub Copilotu ve VS Code (tutoriál otevírejte v samostatném okně, ne se SPOCKem)
- `materialy/bootcamp/`: původní materiály z bootcampu SPOCKu (PDF), ze kterých lekce čerpají interní postup ČS
- [revize/TODO-VLASTNIK.md](revize/TODO-VLASTNIK.md): úkoly, které musí udělat lidé v ČS (rozhodnutí, ověření, provoz)
- `revize/`: [odborná kontrola obsahu](revize/ODBORNA-KONTROLA.md) (kontrolní seznam všech karet, kvízů a úkolů, obnoví ho `nastroje/generuj-revizi.py`) a [scénář pilotu s nováčky](revize/PILOT-S-NOVACKY.md)
- [ARCHITEKTURA.md](ARCHITEKTURA.md): jak tutoriál funguje, kudy jde která změna a historie změn
- `web/`: interaktivní web sestavený z lekcí (návod v [web/README.md](web/README.md))
- `SPOCK-VERZE.md`: verze SPOCKu, podle které je onboarding napsaný, a jak ho udržovat aktuální
- `nastroje/kontrola-aktualnosti.py` a `.claude/skills/spock-aktualnost/`: měsíční kontrola aktuálnosti, v Claude Code příkazem `/spock-aktualnost`

Začněte v [onboarding/README.md](onboarding/README.md).
