# SPOCK User Onboarding

Onboarding pro **uživatele** SPOCKu: Product Managera, Product Designera, Software Engineera a Guild Mastera, správce PM metodiky. Vede od první instalace až na úroveň **superusera**, který SPOCK ovládá bez nápovědy, pozná, když se agent chová špatně, a provede jím kolegy.

Všechno tady vychází ze zdrojového repozitáře SPOCKu ([SPOCK-Workflow-1.0](https://github.com/TominoHav/SPOCK-Workflow-1.0), release 1.16.1). Kde lekce odkazuje na soubor jako `SETUP.md` nebo `specifications/…`, myslí se soubor ve vaší kopii SPOCKu.

> **Tohle není onboarding pro buildera.** Nic tady nemění soubory pod `.github/` ani `.vscode/`. Podle `SETUP.md` §9 jsou to soubory workflow a jejich změna by změnila chování každého agenta.

## Cesta

```
Úroveň 0  Příprava        ─┐
Úroveň 1  Základy          ├─ všichni
                           │
Úroveň 2  Vaše role       ─┼─ Product Manager │ Product Designer │ Software Engineer │ Guild Master
                           │
Úroveň 3  Pokročilý        ├─ všichni
Úroveň 4  Superuser       ─┘
```

| Úroveň | Soubor | Pro koho | Čas | Na konci umíte |
|---|---|---|---|---|
| 0 | [Příprava](uroven-0-priprava.md) | všichni | 1–1,5 h | Mít SPOCK nainstalovaný, ověřený a znát pět pravidel, která se neporušují. |
| 1 | [Základy](uroven-1-zaklady.md) | všichni | 3–4 h | Vysvětlit 7 fází, rozdíl mezi Q a G bránou, 6 agentů a přečíst hotový běh. |
| 2 | [Product Manager](role-pm.md) | PM | 6–8 h | Projít vlastní běh od briefu po iniciativu a podepsat každé rozhodnutí. |
| 2 | [Product Designer](role-designer.md) | Designer | 4–5 h | Dodat výzkum do fáze 2, posoudit příležitosti a přispět k řešení, MVP a PRD. |
| 2 | [Software Engineer](role-engineer.md) | Engineer | 4–5 h | Posoudit proveditelnost před výběrem řešení, přečíst PRD a záznamy běhu. |
| 2 | [Guild Master](role-guild-master.md) | správce PM metodiky | 5–6 h | Metodicky posoudit běh, změnit know-how správným postupem a vést komunitu PM. |
| 3 | [Pokročilý](uroven-3-pokrocily.md) | všichni | 3–4 h | Vrátit fázi, vyřešit neprošlou bránu, předat běh kolegovi, aktualizovat kopii. |
| 4 | [Superuser](uroven-4-superuser.md) | všichni | 4–6 h | Prověřit chování agentů, poslat použitelný nález a provést kolegu onboardingem. |

**Doporučené pořadí:** 0 → 1 → vaše role → 3 → 4. Na úrovni 2 se vyplatí přečíst si i úvod ostatních rolí, protože SPOCK počítá s **triem** PM, designer a engineer (`specifications/definitions/know-how/method/method-canon.md` §14.1). Guild Master by měl mít za sebou i modul Product Manager.

Tempo si určujete sami, pevná data tu nejsou.

## Podklady

- [Pokrok](POKROK.md): zaškrtávací seznam všech úkolů
- [Tahák](tahak.md): všechny tasky, které jako uživatel spouštíte, a kdy
- [Slovník](slovnik.md)
- [Diagnostika](diagnostika.md): co vidím → co udělám
- [Zásady](zasady.md): principy SPOCKu a časté chyby uživatelů
- [Připravenost](pripravenost.md): sebehodnocení pro každou úroveň

## Jak s tím pracovat v Claude Code

Ve složce tohoto repa spusťte `claude` a napište `/spock-onboarding`. Průvodce se zeptá na vaši roli, z `POKROK.md` zjistí, kde jste přestali, a provede vás lekcí, úkoly a kvízem.

Aby průvodce mohl odpovídat podle skutečných souborů SPOCKu, přidejte mu jeho složku:

```bash
claude --add-dir ../SPOCK-Workflow-1.0
```

## Kde se SPOCK doopravdy používá

Samotná práce v SPOCKu (agenti, tasky, běhy) probíhá ve **VS Code s GitHub Copilot Chat**, ne v Claude Code. Claude Code tu slouží jen jako průvodce onboardingem.
