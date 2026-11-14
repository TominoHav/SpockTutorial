# Úroveň 2: Software Engineer (4–5 h)

**Cíl:** Rozumíte, jak SPOCK funguje technicky z pohledu uživatele. Posoudíte proveditelnost řešení před výběrem v G4, přečtete MVP, PRD a iniciativu jako vstup pro delivery a umíte číst záznamy a výsledky kontrol.

**Proč:** V triu **vede SWE v otázkách proveditelnosti** (`method-canon.md` §14.1). SPOCK přitom **technickou složitost vůbec nehodnotí**: „a three-year build and a three-week build look the same to the workflow“ (`BUSINESS-LOGIC-OVERVIEW.md` §3, fáze 4). Jedinou pojistkou je člověk u G4, a ten potřebuje váš názor.

**Než začnete:** Mějte hotové úrovně 0 a 1. Z [příručky Fáze do hloubky](uroven-1b-faze-do-hloubky.md) se vám budou hodit hlavně lekce 1F.4 až 1F.6.

## 2E.1 — Jak SPOCK funguje uvnitř (pro uživatele)

### Karty (asi 8 min, jen na webu)

#### Agenti, tasky a Node skripty

**Agenti jsou Copilot agenti** (`.github/agents/*.agent.md`) a každý má jen nástroje, které má povolené. **Tasky** (`.vscode/tasks.json`) spouštějí malé **Node skripty** v `.github/scripts/`. Kromě Node se nic dalšího neinstaluje (`SETUP.md` §1).

**Otázka:** Co spouští task `SPOCK: …`?
- [ ] Agenta Copilota
- [x] Malý Node skript v `.github/scripts/`
- [ ] Docker kontejner

**Proč:** Tasky z `.vscode/tasks.json` spouštějí Node skripty. Nic dalšího se neinstaluje.

#### Běh, záznam a dokument

**Běh je složka v `runs/`**, mimo git. Artefakt je **záznam** v `records/` (pole, která čtou kontroly) a **dokument** pro člověka s front matter.

**Otázka:** Co z artefaktu čtou kontroly?
- [x] Záznam v `records/`
- [ ] Jen dokument pro člověka

**Proč:** Kontroly čtou strojová pole záznamu. Dokument je pro čtenáře.

#### Zelená brána a `incomplete`

**Kontrola vrací `pass`, `fail` nebo `incomplete`, a `incomplete` není pass.** Zelená brána znamená, že prošla její **mechanická polovina**. Posuzovaná pravidla (judged rules) nehodnotí žádný automatický soudce (`BUSINESS-LOGIC-OVERVIEW.md` §6).

**Otázka:** Kontrola vrátí `incomplete`. Je to pass?
- [ ] Ano
- [x] Ne

**Proč:** `incomplete` není pass. A zelená brána znamená jen to, že prošla mechanická polovina.

#### Ani SWE neupravuje workflow

**Ani jako SWE neupravujte `.github/` ani `.vscode/`** (`SETUP.md` §9). Chybu ve workflow nahlaste (úroveň 4).

**Otázka:** Najdete chybu ve skriptu kontroly. Co uděláte?
- [ ] Opravím ho ve své kopii
- [x] Nahlásím ji týmu CoE Product Management

**Proč:** Úprava `.github/` shodí kontrolu C189 a při aktualizaci zmizí.

### Úkoly

- [ ] **Projděte strukturu ukázkového běhu** (20 min, ve VS Code)
  - *Proč:* Když víte, co je dokument a co záznam, najdete rychle, odkud se vzala hodnota v textu.
  1. Otevřete `fixtures/2026-01-mortgage-onboarding/`.
  2. Porovnejte `6-prd/2-prd-agreed.md` a odpovídající soubor v `records/6-prd/`. Co je jen v záznamu?
  3. Otevřete `RUN-STATE.md` a najděte, kterou verzi know-how fáze 6 četla.
- [ ] **Spusťte kontroly nad ukázkovým během** (15 min, ve VS Code, volitelné)
  - *Proč:* Uvidíte, jak vypadá výstup brány, a budete ho umět přečíst i u vlastního běhu.
  1. V terminálu ve složce SPOCKu: `node .github/scripts/check.mjs fixtures/2026-01-mortgage-onboarding` (příkaz je v `fixtures/README.md`). Spouštíte ho jen nad ukázkovým během, ne místo tasků ve vlastním běhu.
  2. Najděte, kolik kontrol proběhlo a proti kolika z registrovaných se tento starší běh čte. Starší běh se čte jen proti kontrolám, které na něj dosáhnou svým datem a artefakty.
  3. Výpis pravděpodobně ukáže, že pár kontrol neprošlo. To je záměr: `fixtures/README.md` vysvětluje, že některé ukázkové běhy selhávají schválně a proč se nespravují. Najděte ve výpisu, co se stane s fází, která neprojde.

### Pro zvídavé (anglicky, ve vaší kopii SPOCKu)

- 📄 **`specifications/REPOSITORY-MAP.md`**: rozložení repozitáře
- 📄 **`specifications/onboarding/TASKS.md`**: úvod a pár tasků
- 📄 **`BUSINESS-LOGIC-OVERVIEW.md`** §5–6 (artefakty, záznamy a kontroly)

## 2E.2 — Proveditelnost před G4

### Karty (asi 5 min, jen na webu)

#### Co v řešení posuzujete

Každé řešení v sadě (`4-solutions/1-solution-set.md`) má části **„What it is“, „What it does“, „How it does it“** a sekci **Compliance** se čtyřmi oblastmi, včetně **ICT and security**.

**Otázka:** Která oblast compliance je nejblíž práci SWE?
- [ ] GDPR and privacy
- [x] ICT and security
- [ ] Legal and contracts

**Proč:** ICT and security se týká bezpečnosti a provozu systémů.

#### Odpovědi nikdo neověřuje

Compliance část vzniká tak, že producent odpoví na uzavřené otázky a skript z odpovědí odvodí touchpointy. **Správnost odpovědí žádná kontrola neověřuje** (`BUSINESS-LOGIC-OVERVIEW.md` §7). Tři ze čtyř karet oblastí navíc nikdo z banky nerevidoval.

**Otázka:** Projde řešení, u kterého agent na otázku odpověděl „ne“, i když poctivá odpověď je „ano“?
- [x] Ano, žádná kontrola správnost odpovědí neověřuje
- [ ] Ne, kontrola to pozná

**Proč:** Proto je váš technický pohled před G4 tak důležitý.

### Úkoly

- [ ] **Napište PM krátké technické posouzení řešení** (45 min, ve VS Code)
  - *Proč:* Bez něj PM vybírá řešení bez informace o tom, co stavba stojí.
  1. V ukázkovém běhu otevřete sadu řešení ve `4-solutions/`.
  2. U každého řešení napište 2–3 věty: na jakých systémech závisí, kde je největší technické riziko a jestli je to spíš týdny, měsíce, nebo roky.
  3. U ICT and security touchpointů ověřte, jestli odpovídají tomu, co o systémech víte. Kde ne, je to otázka pro PM a pro compliance tým, ne oprava dokumentu.

### Pro zvídavé (anglicky, ve vaší kopii SPOCKu)

- 📄 **`BUSINESS-LOGIC-OVERVIEW.md`** §3 fáze 4 a §7 (compliance)

## 2E.3 — MVP a PRD jako vstup pro delivery

### Karty (asi 5 min, jen na webu)

#### Rozpracované MVP

**Rozpracované MVP** (`5-mvp/2-expanded-mvp.md`) říká rozsah, hranice, co je záměrně mimo a **„What the requirement stage needs“**.

**Otázka:** Kde najdete, co je z MVP záměrně mimo rozsah?
- [x] V rozpracovaném MVP `5-mvp/2-expanded-mvp.md`
- [ ] V briefu

**Proč:** Rozpracované MVP říká rozsah, hranice i to, co je záměrně mimo.

#### PRD pro delivery

**PRD má osm sekcí.** Každý požadavek (R1, R2…) jmenuje měřítko, kterému slouží, a má akceptační kritéria. Jsou tu i nefunkční požadavky, závislosti, „Out of scope“ a **„What we could not establish“**.

**Víc do hloubky:**
- **Odsouhlasené PRD je samostatný dokument**, vzniklý z draftu doslovně, když PM označí PRD jako agreed. Odsouhlasené PRD, které existuje dřív, nebo říká něco jiného než draft, je nález (`TESTER-GUIDE.md` §4, Stage 6).

**Otázka:** Co v PRD najdete pod „What we could not establish“?
- [ ] Seznam chyb agenta
- [x] Co se v běhu nepodařilo zjistit

**Proč:** Mezery jsou v PRD vidět. Nejsou schované za sebejistým textem.

### Úkoly

- [ ] **Přečtěte PRD jako SWE** (40 min, ve VS Code)
  - *Proč:* PRD je to, co dostanete do backlogu. Nejasnosti je levnější najít teď než ve sprintu.
  1. Otevřete `fixtures/2026-01-mortgage-onboarding/6-prd/1-prd-draft.md`.
  2. U tří požadavků ověřte, že akceptační kritérium je testovatelné.
  3. Vypište nefunkční požadavky a závislosti, které v PRD chybí a vy byste je čekali.
  4. Novější běhy mají v PRD sekci „What we could not establish“ (např. `fixtures/2026-09-savings-goals/6-prd/`). Označte, co z ní je technické rozhodnutí, které čeká na vás.
- [ ] **Přečtěte iniciativu** (15 min, ve VS Code)
  - *Proč:* Iniciativa je dokument, který jde do backlogu ČS.
  1. Otevřete `7-initiative/initiative.md` téhož běhu.
  2. Najděte akceptační kritéria a Jira klíč. Jira klíč nikdy nevymýšlí agent, zadává ho člověk. Jira iniciativa (A15) se zatím nevytváří.

## 2E.4 — Záznamy a kontroly ve vlastním běhu

### Karty (asi 5 min, jen na webu)

#### Když task selže

Když task selže, celý jeho text je v panelu Terminal ve VS Code a v souboru **`.github/last-task.md`** (`SETUP.md` §6 krok 3).

Užitečné tasky bez políček: **`SPOCK: check the whole run`**, **`SPOCK: run one gate`**, **`SPOCK: explain what the gate failed`** a **`SPOCK: which gates can run in full`**.

**Otázka:** Kde najdete celý text neúspěšného tasku?
- [ ] Jen v chatu
- [x] V panelu Terminal a v `.github/last-task.md`

**Proč:** Celý výstup tasku je v terminálu i v souboru.

### Úkoly

- [ ] **Vysvětlete PM jednu neprošlou kontrolu** (20 min, ve VS Code)
  - *Proč:* V triu jste obvykle ten, kdo výstup kontroly přečte nejrychleji.
  1. Ve vlastním (cvičném) běhu, až některá brána neprojde, spusťte `SPOCK: explain what the gate failed`.
  2. Najděte C-číslo kontroly v `.github/COVERAGE-CHECKS.md` a přečtěte, k čemu slouží.
  3. Řekněte PM, jestli jde o materiál, nebo o chybu workflow. Jak se s tím dál zachází, popisuje úroveň 3.

## 2E.5 — Compliance do hloubky

### Karty (asi 6 min, jen na webu)

#### Čtyři oblasti a jejich hranice

**Čtyři oblasti:** Compliance, conduct and product regulation (karta od ČS), GDPR and privacy, Legal and contracts a ICT and security. **Poslední tři napsal pilotní tým z veřejného práva a ČS je nepotvrdila.** AI regulace ani outsourcing a DORA nejsou v žádné oblasti. AI se jen přesměruje na specialistu (`COMPLIANCE-REQUIREMENTS.md` §1).

**Otázka:** Řešení pracuje s AI. Pokryje to compliance sweep SPOCKu?
- [ ] Ano, AI je v oblasti ICT
- [x] Ne, AI regulace v žádné oblasti není, jen se přesměruje na specialistu

**Proč:** AI regulace, outsourcing ani DORA nejsou v žádné ze čtyř oblastí.

#### 128 otázek na každé řešení

**U každého řešení agent odpoví na 128 otázek:** 39 compliance, 32 GDPR, 27 ICT security a 30 legal. Odpověď je `yes`, `no` nebo `cannot_tell`. `cannot_tell` jmenuje vstup, který by otázku rozhodl (STAGE-4 R3.3.2–R3.3.3).

**Víc do hloubky:**
- **Odpovědi zůstávají v záznamu řešení v `records/4-solutions/`.** Do dokumentu jdou jen touchpointy s `yes`, a to **doslovně z karty**, aby je skript mohl porovnat s originálem (R3.3.5–R3.3.7).
- **Tři soubory na řešení, každý s jedním autorem:** `parts/SOLn.md` (sekce 1–7, píše agent), záznam se 128 odpověďmi (píše agent, do dokumentu nejde) a `parts/SOLn.compliance.md` (píše skript). Sestavení skládá první a třetí soubor slovo od slova a odvozený soubor nese hash řešení, takže zastaralá compliance neprojde (R3.4.4–R3.4.5).

**Otázka:** Které touchpointy se dostanou do dokumentu řešení?
- [ ] Všechny odpovědi
- [x] Jen touchpointy s odpovědí `yes`, doslovně z karty

**Proč:** Doslovnost dovoluje skriptu porovnat touchpoint s kartou.

#### Co compliance nehlídá

**Eskalační příznak se spustí, jen když karta jmenuje oblast, kterou odpovědi nechaly nevyřešenou.** Spuštěný trigger jmenuje roli, na kterou se má přesměrovat, ale **workflow nic nepřesměrovává ani nikoho neupozorní** (`COMPLIANCE-REQUIREMENTS.md` §8).

**Víc do hloubky:**
- **Odpovědi producenta žádná kontrola neověřuje.** Odpověď „ne“ tam, kde poctivá odpověď zní „ano“, projde (`BUSINESS-LOGIC-OVERVIEW.md` §7).
- **Otevřené compliance položky se zatím nepřenášejí do PRD** (STAGE-4 část 12, STAGE-6 část 12). Hlídejte je sami, až budete PRD číst.

**Otázka:** Spustí workflow eskalaci na compliance tým?
- [ ] Ano, pošle e-mail
- [x] Ne, jen jmenuje roli. Přesměrovat musí člověk

**Proč:** Workflow nikoho neupozorní. Otevřené položky se navíc zatím nepřenášejí do PRD.

### Úkoly

- [ ] **Projděte ICT touchpointy jednoho řešení** (40 min, ve VS Code)
  - *Proč:* Jste jediný v triu, kdo pozná, jestli odpovědi na ICT otázky odpovídají skutečným systémům.
  1. Otevřete `fixtures/2026-09-digital-onboarding-dropoff/4-solutions/parts/SOL1.compliance.md` a příslušnou sekci *ICT and security* v `1-solution-set.md`.
  2. U každého touchpointu se zeptejte: platí to pro naše systémy? Chybí něco, co by mělo odpovědět `yes`?
  3. Zapište si otevřené položky a ověřte, jestli se objevují v PRD (`6-prd/1-prd-draft.md`).

### Pro zvídavé (anglicky, ve vaší kopii SPOCKu)

- 📄 **`specifications/stage-specs/STAGE-4-SPEC.md`** kroky 3 a 4 a části 5 a 6
- 📄 **`specifications/COMPLIANCE-REQUIREMENTS.md`** §1 a §8
- 📄 **`specifications/definitions/know-how/compliance/area-ict-security.md`**: karta vaší oblasti

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
