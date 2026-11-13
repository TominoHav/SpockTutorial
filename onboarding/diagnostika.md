# Diagnostika: co vidím → co udělám

Postupujte shora dolů. **Než cokoli zkusíte znovu, uložte si stav**: export chatu a výstup tasku. Nový pokus přepíše stav, který vysvětluje, co se stalo (`TESTER-GUIDE.md` §7).

## Nastavení

| Co vidím | Co udělám |
|---|---|
| V seznamu tasků není nic `SPOCK:` | Otevřená je jiná složka nebo je VS Code v restricted mode. Otevřete složku s `.github` a `.vscode` a autorům důvěřujte (`SETUP.md` §3). |
| Agent chybí nebo přebývá | Zastavte se a pošlete Igorovi jména agentů se screenshotem (`SETUP.md` §5). |
| Běh nejde založit | Spusťte `SPOCK: check my setup` a zvolte GitHub Copilot. |
| Dokumenty začínají tabulkou `[object Object]` | Vypněte rozšíření `bierner.markdown-yaml-preamble`. Soubor je v pořádku (`TESTER-GUIDE.md` §2.5). |
| Po aktualizaci se agent chová postaru | Zavřete chaty a spusťte `Developer: Reload Window`. |

## Během běhu

| Co vidím | Co udělám |
|---|---|
| Agent čeká a říká, co potřebuje | Je to správné chování. Dodejte to, nebo zapište, že to dodat nejde. |
| Agent nic nevytvoří a jen mluví | Zeptejte se, na co čeká. Nejspíš mu chybí vstup, který nepojmenoval. |
| VS Code hlásí, že task selhal | Přečtěte `.github/last-task.md` nebo panel Terminal. Agent má říct, co to znamená. Když řekne jen „failed“, je to nález. |
| Brána neprošla | Nechte agenta opravovat. Po druhé neúspěšné opravě se zastaví, a to je správně. Pak `SPOCK: explain what the gate failed` a agent **Workflow Support**. |
| Kontrolu běh opravdu splnit nemůže | `SPOCK: sign off a check this run cannot meet`, poslední políčko podle toho, jestli jde o materiál, nebo o workflow. |
| Nevím, kde běh stojí | Titulní stránka `runs/<běh>/README.md`, nebo agent **Workflow Support**. |
| „A hook prevented chat from continuing“ | Není to chyba. Workflow zastavil krok agenta a agent vám řekne, co dělat místo toho (`SETUP.md` §9). |
| Tasky odmítají pracovat | Máte dva nedokončené běhy. Jeden přesuňte mimo SPOCK (`SETUP.md` §7). |
| Chat zdraží nebo hlásí *Could not process PDF* | V chatu je příloha. Otevřete nový chat se stejným agentem a napište „continue the run <název>“ (`SETUP.md` §6 krok 8). |

## Nálezy, které hlásíte

| Co vidím | Proč je to nález |
|---|---|
| Agent chce sám spustit task s políčky | Podpis musí dát člověk. |
| Agent vám dá příkaz k napsání do terminálu | Tasky se spouštějí z Command Palette. |
| Agent se ptá na id běhu | Id si odvozuje sám. |
| Žádá o schválení dřív, než proběhla kontrola | Porušuje rytmus fáze (`TESTER-GUIDE.md` §3.2). |
| Pole, které jste nedodali, je vyplněné | **Hlásit hned** (`TESTER-GUIDE.md` §8). |
| Pokyn z materiálu se provedl | **DR-04, hlásit hned.** |
| Skóre nebo pořadí ve fázi 4, doporučení ve fázi 5 | Rozhodnutí patří člověku. |
| Žádost o schválení fáze 3 | Fáze 3 nemá rozhodnutí člověka. |
| Agent odpovídá v jiném jazyce než běh | Porušuje jazyk deklarovaný v briefu. |

Jak nález poslat: [úroveň 4, lekce 4.4](uroven-4-superuser.md).
