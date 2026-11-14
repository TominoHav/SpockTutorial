# SPOCK User Onboarding

Onboarding pro **uživatele** SPOCKu: Product Managera, Product Designera, Software Engineera a Guild Mastera, správce PM metodiky. Vede od první instalace až na úroveň **superusera**, který SPOCK ovládá bez nápovědy, pozná, když se agent chová špatně, a provede jím kolegy.

**Zkratky rolí v celém onboardingu:** **PM** = Product Manager, **PD** = Product Designer, **SWE** = Software Engineer, **GM** = Guild Master.

Všechno tady vychází ze zdrojového repozitáře SPOCKu ([SPOCK-Workflow-1.0](https://github.com/TominoHav/SPOCK-Workflow-1.0), release 1.16.1). Kde lekce odkazuje na soubor jako `SETUP.md` nebo `specifications/…`, myslí se soubor ve vaší kopii SPOCKu.

> **Tohle není onboarding pro buildera.** Nic tady nemění soubory pod `.github/` ani `.vscode/`. Podle `SETUP.md` §9 jsou to soubory workflow a jejich změna by změnila chování každého agenta.

## Cesta

```
Úroveň 0  Poznejte SPOCK  ─┐  jen na webu, nic neinstalujete
Úroveň 1  Příprava         ├─ všichni
                           │
Úroveň 2  Vaše role       ─┼─ Product Manager │ Product Designer │ Software Engineer │ Guild Master
                           │
Úroveň 3  Pokročilý        ├─ všichni
Úroveň 4  Superuser       ─┘

Příručka  Fáze do hloubky    volitelně, hlavně GM a superuser
```

| Úroveň | Soubor | Pro koho | Čas | Na konci umíte |
|---|---|---|---|---|
| 0 | [Poznejte SPOCK](uroven-0-poznejte-spock.md) | všichni | asi 1,5 h, jen na webu | Vysvětlit, proč SPOCK vzniká, 7 fází, 6 agentů, co je task, rozdíl mezi Q a G bránou a pět pravidel, která se neporušují. |
| 1 | [Příprava](uroven-1-priprava.md) | všichni | 2–3 h (plus čekání na role) | Mít schválené role v REDIMu, z firemního katalogu VS Code, Git, Node.js a SSH certifikát, SPOCK naklonovaný a ověřený a jednou projít hotový ukázkový běh. |
| 2 | [Product Manager](role-pm.md) | PM | 6–8 h | Projít vlastní běh od briefu po iniciativu a podepsat každé rozhodnutí. |
| 2 | [Product Designer](role-designer.md) | PD | 4–5 h | Dodat výzkum do fáze 2, posoudit příležitosti a přispět k řešení, MVP a PRD. |
| 2 | [Software Engineer](role-engineer.md) | SWE | 4–5 h | Posoudit proveditelnost před výběrem řešení, přečíst PRD a záznamy běhu. |
| 2 | [Guild Master](role-guild-master.md) | GM, správce PM metodiky | 6–7 h | Metodicky posoudit běh, změnit know-how správným postupem, odhadnout dopad změny na architekturu SPOCKu a vést komunitu PM. |
| 3 | [Pokročilý](uroven-3-pokrocily.md) | všichni | 3–4 h | Vrátit fázi, vyřešit neprošlou bránu, předat běh kolegovi, aktualizovat kopii. |
| 4 | [Superuser](uroven-4-superuser.md) | všichni | 4–6 h | Prověřit chování agentů, poslat použitelný nález a provést kolegu onboardingem. |
| Příručka | [Fáze do hloubky](uroven-1b-faze-do-hloubky.md) | volitelně, hlavně GM a superuser | 8–10 h | U každé fáze vysvětlit kroky, pravidla, bránu, rozhodnutí a to, co fáze záměrně nedělá a neopraví. |

**Doporučené pořadí:** 0 → 1 → vaše role → 3 → 4. Úroveň 0 projdete celou na webu, a mezitím si objednejte role v REDIMu pro Přípravu. Příručka Fáze do hloubky stojí na specifikacích fází ve `specifications/stage-specs/`. Je to nejhlubší část onboardingu, nic nezamyká a vracíte se k ní podle potřeby.

**Jak lekce vypadají:** Každá lekce začíná krátkými **kartami** (asi 60–80 slov a jedna otázka s okamžitou odpovědí). Další karta se otevře, až odpovíte. Delší vysvětlení je pod „Víc do hloubky“, anglické podklady pod „Pro zvídavé“. U každého úkolu je napsané, kde ho děláte: **jen na webu**, **stačí papír**, nebo **ve VS Code**.

**Kvíz modulu** se odemkne, až zodpovíte všechny karty modulu (úkoly můžete dodělat i potom). Losuje 5 otázek ze zásoby 8 a pořadí otázek i možností se při každém spuštění zamíchá. Otázky nejsou opakováním karet, ale situacemi z praxe. Splněný je při 4 z 5 správně napoprvé. **Skokový test** zamčeného modulu losuje 5 otázek z kvízu i z karet modulu a chce aspoň 4 správně. Na úrovni 2 se vyplatí přečíst si i úvod ostatních rolí, protože SPOCK počítá s **triem** PM, PD a SWE (`specifications/definitions/know-how/method/method-canon.md` §14.1). Guild Master by měl mít za sebou i modul Product Manager.

Tempo si určujete sami, pevná data tu nejsou.

## Podklady

- [Pokrok](POKROK.md): zaškrtávací seznam všech úkolů
- [Tahák](tahak.md): všechny tasky, které jako uživatel spouštíte, a kdy
- [Slovník](slovnik.md)
- [Diagnostika](diagnostika.md): co vidím → co udělám
- [Zásady](zasady.md): principy SPOCKu a časté chyby uživatelů
- [Připravenost](pripravenost.md): sebehodnocení pro každou úroveň
- Materiály z bootcampu SPOCKu (PDF) ve složce [`materialy/bootcamp/`](../materialy/bootcamp/): technické nastavení, práce ve VS Code, uživatelský manuál, struktura briefu, soubor trhu, přehled produktu

## Jak s tím pracovat v Claude Code

Ve složce tohoto repa spusťte `claude` a napište `/spock-onboarding`. Průvodce se zeptá na vaši roli, z `POKROK.md` zjistí, kde jste přestali, a provede vás lekcí, úkoly a kvízem.

Aby průvodce mohl odpovídat podle skutečných souborů SPOCKu, přidejte mu jeho složku:

```bash
claude --add-dir ../SPOCK-Workflow-1.0
```

## Kde se SPOCK doopravdy používá

Samotná práce v SPOCKu (agenti, tasky, běhy) probíhá ve **VS Code s GitHub Copilot Chat**, ne v Claude Code. Claude Code tu slouží jen jako průvodce onboardingem.
