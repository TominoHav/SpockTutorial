# Úroveň 2: Software Engineer (4–5 h)

**Cíl:** Rozumíte, jak SPOCK funguje technicky z pohledu uživatele. Posoudíte proveditelnost řešení před výběrem v G4, přečtete MVP, PRD a iniciativu jako vstup pro delivery a umíte číst záznamy a výsledky kontrol.

**Proč:** V triu **vede engineer v otázkách proveditelnosti** (`method-canon.md` §14.1). SPOCK přitom **technickou složitost vůbec nehodnotí**: „a three-year build and a three-week build look the same to the workflow“ (`BUSINESS-LOGIC-OVERVIEW.md` §3, fáze 4). Jedinou pojistkou je člověk u G4, a ten potřebuje váš názor.

**Než začnete:** Mějte hotové úrovně 0 a 1.

## 2E.1 — Jak SPOCK funguje uvnitř (pro uživatele)

### Ke studiu (asi 40 min)

- 📄 **`specifications/REPOSITORY-MAP.md`**: rozložení repozitáře
- 📄 **`specifications/onboarding/TASKS.md`**: úvod a pár tasků
- 📄 **`BUSINESS-LOGIC-OVERVIEW.md`** §5–6 (artefakty, záznamy a kontroly)

### Klíčové myšlenky

- **Agenti jsou Copilot agenti** (`.github/agents/*.agent.md`) a každý má jen nástroje, které má povolené. **Tasky** (`.vscode/tasks.json`) spouštějí malé **Node skripty** v `.github/scripts/`. Kromě Node se nic dalšího neinstaluje (`SETUP.md` §1).
- **Běh je složka v `runs/`**, mimo git. Artefakt je **záznam** v `records/` (pole, která čtou kontroly) a **dokument** pro člověka s front matter.
- **Kontrola vrací `pass`, `fail` nebo `incomplete`, a `incomplete` není pass.** Zelená brána znamená, že prošla její **mechanická polovina**. Posuzovaná pravidla (judged rules) nehodnotí žádný automatický soudce (`BUSINESS-LOGIC-OVERVIEW.md` §6).
- **Ani jako engineer neupravujte `.github/` ani `.vscode/`** (`SETUP.md` §9). Chybu ve workflow nahlaste (úroveň 4).

### Úkoly

- [ ] **Projděte strukturu ukázkového běhu** (20 min)
  - *Proč:* Když víte, co je dokument a co záznam, najdete rychle, odkud se vzala hodnota v textu.
  1. Otevřete `fixtures/2026-01-mortgage-onboarding/`.
  2. Porovnejte `6-prd/2-prd-agreed.md` a odpovídající soubor v `records/6-prd/`. Co je jen v záznamu?
  3. Otevřete `RUN-STATE.md` a najděte, kterou verzi know-how fáze 6 četla.
- [ ] **Spusťte kontroly nad ukázkovým během** (15 min, volitelné)
  - *Proč:* Uvidíte, jak vypadá výstup brány, a budete ho umět přečíst i u vlastního běhu.
  1. V terminálu ve složce SPOCKu: `node .github/scripts/check.mjs fixtures/2026-01-mortgage-onboarding` (příkaz je v `fixtures/README.md`). Spouštíte ho jen nad ukázkovým během, ne místo tasků ve vlastním běhu.
  2. Najděte, kolik kontrol proběhlo a proti kolika z registrovaných se tento starší běh čte. Starší běh se čte jen proti kontrolám, které na něj dosáhnou svým datem a artefakty.
  3. Výpis pravděpodobně ukáže, že pár kontrol neprošlo. To je záměr: `fixtures/README.md` vysvětluje, že některé ukázkové běhy selhávají schválně a proč se nespravují. Najděte ve výpisu, co se stane s fází, která neprojde.

## 2E.2 — Proveditelnost před G4

### Ke studiu (asi 20 min)

- 📄 **`BUSINESS-LOGIC-OVERVIEW.md`** §3 fáze 4 a §7 (compliance)

### Klíčové myšlenky

- Každé řešení v sadě (`4-solutions/1-solution-set.md`) má části **„What it is“, „What it does“, „How it does it“** a sekci **Compliance** se čtyřmi oblastmi, včetně **ICT and security**.
- Compliance část vzniká tak, že producent odpoví na uzavřené otázky a skript z odpovědí odvodí touchpointy. **Správnost odpovědí žádná kontrola neověřuje** (`BUSINESS-LOGIC-OVERVIEW.md` §7). Tři ze čtyř karet oblastí navíc nikdo z banky nerevidoval.

### Úkoly

- [ ] **Napište PM krátké technické posouzení řešení** (45 min)
  - *Proč:* Bez něj PM vybírá řešení bez informace o tom, co stavba stojí.
  1. V ukázkovém běhu otevřete sadu řešení ve `4-solutions/`.
  2. U každého řešení napište 2–3 věty: na jakých systémech závisí, kde je největší technické riziko a jestli je to spíš týdny, měsíce, nebo roky.
  3. U ICT and security touchpointů ověřte, jestli odpovídají tomu, co o systémech víte. Kde ne, je to otázka pro PM a pro compliance tým, ne oprava dokumentu.

## 2E.3 — MVP a PRD jako vstup pro delivery

### Klíčové myšlenky

- **Rozpracované MVP** (`5-mvp/2-expanded-mvp.md`) říká rozsah, hranice, co je záměrně mimo a **„What the requirement stage needs“**.
- **PRD má osm sekcí.** Každý požadavek (R1, R2…) jmenuje měřítko, kterému slouží, a má akceptační kritéria. Jsou tu i nefunkční požadavky, závislosti, „Out of scope“ a **„What we could not establish“**.
- **Odsouhlasené PRD je samostatný dokument**, vzniklý z draftu doslovně, když PM označí PRD jako agreed. Odsouhlasené PRD, které existuje dřív, nebo říká něco jiného než draft, je nález (`TESTER-GUIDE.md` §4, Stage 6).

### Úkoly

- [ ] **Přečtěte PRD jako engineer** (40 min)
  - *Proč:* PRD je to, co dostanete do backlogu. Nejasnosti je levnější najít teď než ve sprintu.
  1. Otevřete `fixtures/2026-01-mortgage-onboarding/6-prd/1-prd-draft.md`.
  2. U tří požadavků ověřte, že akceptační kritérium je testovatelné.
  3. Vypište nefunkční požadavky a závislosti, které v PRD chybí a vy byste je čekali.
  4. Novější běhy mají v PRD sekci „What we could not establish“ (např. `fixtures/2026-09-savings-goals/6-prd/`). Označte, co z ní je technické rozhodnutí, které čeká na vás.
- [ ] **Přečtěte iniciativu** (15 min)
  - *Proč:* Iniciativa je dokument, který jde do backlogu ČS.
  1. Otevřete `7-initiative/initiative.md` téhož běhu.
  2. Najděte akceptační kritéria a Jira klíč. Jira klíč nikdy nevymýšlí agent, zadává ho člověk. Jira iniciativa (A15) se zatím nevytváří.

## 2E.4 — Záznamy a kontroly ve vlastním běhu

### Klíčové myšlenky

- Když task selže, celý jeho text je v panelu Terminal ve VS Code a v souboru **`.github/last-task.md`** (`SETUP.md` §6 krok 3).
- Užitečné tasky bez políček: **`SPOCK: check the whole run`**, **`SPOCK: run one gate`**, **`SPOCK: explain what the gate failed`** a **`SPOCK: which gates can run in full`**.

### Úkoly

- [ ] **Vysvětlete PM jednu neprošlou kontrolu** (20 min)
  - *Proč:* V triu jste obvykle ten, kdo výstup kontroly přečte nejrychleji.
  1. Ve vlastním (cvičném) běhu, až některá brána neprojde, spusťte `SPOCK: explain what the gate failed`.
  2. Najděte C-číslo kontroly v `.github/COVERAGE-CHECKS.md` a přečtěte, k čemu slouží.
  3. Řekněte PM, jestli jde o materiál, nebo o chybu workflow. Jak se s tím dál zachází, popisuje úroveň 3.

## Kvíz

**1. Brána vrátila `incomplete`. Můžete pokračovat?**

   a) Ano, nic neselhalo
   b) Ne. `incomplete` znamená, že brána jmenuje kontrolu, kterou zatím nikdo nenapsal, takže není známo, jestli je fáze v pořádku

<details><summary>Odpověď</summary>

b) „Treating an incomplete as a pass is the mistake this repository exists to prevent“ (`BUSINESS-LOGIC-OVERVIEW.md` §6).

</details>

**2. Compliance sekce řešení neuvádí žádný ICT touchpoint, ale vy víte, že řešení mění autentizaci. Co uděláte?**

   a) Opravím dokument ručně
   b) Řeknu to PM před G4. Odpovědi producenta žádná kontrola neověřuje a compliance rozhodnutí patří compliance týmu
   c) Nic, brána prošla

<details><summary>Odpověď</summary>

b) Odpověď „ne“ tam, kde je poctivá odpověď „ano“, projde a nic ji nezachytí (`BUSINESS-LOGIC-OVERVIEW.md` §7).

</details>

**3. Kde najdete celý text tasku, který selhal?**

<details><summary>Odpověď</summary>

V panelu Terminal ve VS Code a v `.github/last-task.md` (`SETUP.md` §6 krok 3).

</details>
