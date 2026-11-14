# Úroveň 2: Guild Master, správce PM metodiky (6–7 h)

**Cíl:** Víte, kde ve SPOCKu žije produktová metodika a kdo ji vlastní. Umíte metodicky posoudit hotový běh (tu polovinu bran, kterou žádný automat nehodnotí), navrhnout a provést změnu know-how správným postupem a vést komunitu PM, kteří se SPOCKem pracují.

**Proč:** Kontroly SPOCKu hlídají, že dokumenty jsou mechanicky v pořádku. **Jestli je outcome dobře formulovaný a příležitosti jsou ty správné, neposuzuje žádná kontrola**: posuzovaná pravidla nečte žádný automatický soudce (`BUSINESS-LOGIC-OVERVIEW.md` §6). Know-how oblastí **Method** a **Product** vlastní Česká spořitelna a osoba v ČS, která je udržuje, zatím není jmenovaná (`specifications/onboarding/KNOW-HOW-OWNERS.md` §1). Šablona iniciativy Product Management Guildy je pro SPOCK závazná (`initiative-template.md`). Guild Master je člověk, který tohle drží pohromadě.

**Než začnete:** Mějte hotové úrovně 0 a 1 a ideálně i [role-pm.md](role-pm.md). Při revizi mějte po ruce [příručku Fáze do hloubky](uroven-1b-faze-do-hloubky.md). Metodiku nejde posuzovat bez vlastního běhu.

> Guild Master mění **zdroj** know-how v `specifications/definitions/know-how/`. Nikdy neupravuje `.github/`: kopii pro agenty generuje a ověřuje SWE (`KNOW-HOW-OWNERS.md` §3–4).

## 2G.1 — Kde metodika ve SPOCKu žije

### Karty (asi 8 min, jen na webu)

#### Know-how: co agenti čtou a nikdy nepíší

**Know-how je to, co agenti čtou a nikdy nepíší**: co je důkaz, co musí obsahovat brief, PRD a iniciativa, jak se mluví s člověkem. Mění se jen rukou člověka, mimo jakýkoli běh (`KNOW-HOW-OWNERS.md` úvod).

**Otázka:** Kdo smí měnit know-how?
- [ ] Agent, když najde chybu
- [x] Jen člověk, mimo jakýkoli běh

**Proč:** Know-how agenti čtou a nikdy nepíší.

#### Pět oblastí, zdroj jen jeden

**Pět oblastí:** Compliance, Market, Method, Product a Writing. Pro PM metodiku jsou klíčové **Method** (Method Canon, Evidence Standards, Opportunity Framing, Discovery Craft) a **Product** (Brief Fields, PRD Template, Initiative Template, Strategy Basis a Stage Shapes).

**Zdroj je jen jeden:** `specifications/definitions/know-how/`. Kopie v `.github/know-how/` se generuje. Úprava kopie selže v kontrole `C41` a při dalším generování zmizí.

**Otázka:** Upravíte soubor v `.github/know-how/`. Co se stane?
- [ ] Změna začne platit
- [x] Selže kontrola `C41` a při dalším generování změna zmizí

**Proč:** `.github/know-how/` je generovaná kopie. Zdroj je jen `specifications/definitions/know-how/`.

#### Každá změna má novou verzi

**Každý běh si zapisuje verzi každého know-how, které přečetl.** Proto má každá změna novou verzi.

**Otázka:** Proč musí mít každá změna know-how novou verzi?
- [x] Běh si zapisuje verzi, kterou četl, a jinak by nešlo poznat, podle čeho vznikl
- [ ] Kvůli gitu

**Proč:** Verze dovoluje vysvětlit, proč se dva běhy chovaly jinak.

#### SPOCK podporuje metodiku banky

**SPOCK podporuje metodiku banky, nenahrazuje ji.** Discovery v něm odpovídá části Product Development Lifecycle a Product Compass. Metoda uvnitř je Opportunity Solution Tree: brief → rámování příležitostí → hypotézy a analýza konkurence → nápady na řešení → MVP → PRD → iniciativa. GM vysvětluje týmům rozdíl mezi důkazem, předpokladem, příležitostí a řešením a proč se nemá skákat rovnou k řešení.

**Za kvalitu výstupů SPOCKu odpovídají hlavně Guild Masteři** CoE Product Management a CoE Product Design. SPOCK vlastní a řídí oba CoE: produkt, metodiku, workflow, šíření i roadmapu.

**Otázka:** Kdo odpovídá hlavně za kvalitu výstupů SPOCKu?
- [ ] Agenti
- [x] Guild Masteři CoE Product Management a CoE Product Design
- [ ] IT podpora

**Proč:** SPOCK vlastní a řídí oba CoE, kvalitu výstupů hlídají jejich Guild Masteři.

### Úkoly

- [ ] **Zmapujte know-how oblastí Method a Product** (30 min, ve VS Code)
  - *Proč:* Tohle jsou dokumenty, za které budete odpovídat. Musíte vědět, v jakém stavu jsou.
  1. Otevřete každý soubor ve `specifications/definitions/know-how/method/` a `…/product/`.
  2. Z hlavičky si zapište **Version**, **Status** a **Owner** (např. Method Canon: 0.4, For review).
  3. Označte si, které mají status *Approved* a které ještě ne. Schválení je práce jmenované osoby v ČS (`KNOW-HOW-OWNERS.md` §4 krok 3).
- [ ] **Najděte, které verze know-how běh četl** (15 min, ve VS Code)
  - *Proč:* Když se změní metodika, potřebujete vědět, které běhy vznikly podle staré verze.
  1. Otevřete `RUN-STATE.md` ukázkového běhu `fixtures/2026-09-spending-insights/`.
  2. U fáze 1 najděte řádek `know_how:` a verzi `brief-fields` (v tomto běhu `brief-fields@0.4`).
  3. Porovnejte ji s aktuální verzí ve zdroji (`product/brief-fields.md`, dnes 0.7). Zapište si, co se mezi verzemi změnilo (blok historie v hlavičce).

### Pro zvídavé (anglicky, ve vaší kopii SPOCKu)

- 📄 **`specifications/onboarding/KNOW-HOW-OWNERS.md`** §1–3
- 📄 **`specifications/definitions/know-how/method/method-canon.md`** §1–4

## 2G.2 — Šablona Guildy a co z ní SPOCK dělá

### Karty (asi 5 min, jen na webu)

#### Dvě šablony, platí Guilda

**ČS má pro jeden Jira objekt dvě šablony.** Stakeholder rozhodl, že platí šablona **Product Management Guildy**. Kde se šablony liší, vyhrává Guilda. **Kde Guilda mlčí, zůstávají převzaté sekce**, protože mlčení není nesouhlas (`initiative-template.md`).

**Otázka:** Šablona Guildy o jedné sekci mlčí. Co s ní?
- [ ] Vypustí se
- [x] Zůstává převzatá, mlčení není nesouhlas

**Proč:** Kde se šablony liší, vyhrává Guilda. Kde Guilda mlčí, zůstávají převzaté sekce.

#### Iniciativa a brief

**Iniciativa má 13 sekcí**, hodnotový příběh tvoří čtyři sekce Guildy: insight, business goal, outcome a success metrics.

**Brief je sada polí.** Co nikdo nedodal, je unknown s důvodem, a cíl jsou čtyři věci: produktový cíl, metrika, key result a písemná vazba mezi nimi (`STAGE-1-SPEC.md`, krok 4).

**Otázka:** Kolik částí má cíl v briefu?
- [ ] Jednu
- [x] Čtyři: produktový cíl, metrika, key result a písemná vazba

**Proč:** Bez písemné vazby je cíl neúplný.

### Úkoly

- [ ] **Porovnejte šablonu Guildy se SPOCKem** (45 min, ve VS Code)
  - *Proč:* Jste ten, kdo ví, co Guilda chce. Rozdíly, které nikdo nezapsal, se projeví v každé iniciativě.
  1. Vedle sebe otevřete aktuální šablonu iniciativy Guildy a `initiative-template.md`.
  2. U každé ze 13 sekcí si zapište: odpovídá, liší se, nebo Guilda mlčí.
  3. Rozdíly, kde Guilda mezitím šablonu změnila, si zapište jako kandidáty na změnu know-how (lekce 2G.4).

### Pro zvídavé (anglicky, ve vaší kopii SPOCKu)

- 📄 **`specifications/definitions/know-how/product/initiative-template.md`**: úvod a uzavřená otázka dvou šablon
- 📄 **`specifications/definitions/know-how/product/brief-fields.md`** §2 a §4

## 2G.3 — Metodická revize běhu

### Karty (asi 8 min, jen na webu)

#### Mechanická a posuzovaná polovina

**Každá brána má mechanickou a posuzovanou polovinu.** Mechanickou spouští kód. **Posuzovanou nehodnotí žádný automat**, protože všechny agenty pilotu pohání jedna rodina modelů a kontrola stejnou rodinou by byla producent souhlasící sám se sebou.

**Otázka:** Proč posuzovanou polovinu brány nehodnotí automat?
- [ ] Ještě není hotový
- [x] Všechny agenty pohání jedna rodina modelů a producent by souhlasil sám se sebou

**Proč:** Posouzení kvality proto zůstává na člověku.

#### Posuzovaná pravidla u podpisu

**Kdo podepisuje bránu, může posuzovaná pravidla zodpovědět** ve třetím políčku `SPOCK: approve what is in front of me`: `y`, `n` nebo `?` s číslem otázky. Přeskočené se zapíše jako skipped a kontrola `C180` hlídá, že odpovědi mají jméno a roli.

**Otázka:** Jak odpovíte na posuzovaná pravidla?
- [x] Ve třetím políčku `SPOCK: approve what is in front of me`, např. `1y 2n`
- [ ] V chatu agentovi

**Proč:** Odpovědi se zapíšou se jménem a rolí a hlídá je kontrola `C180`.

#### Nejslabší místo běhu je trh

**Kde posuzovaná polovina chybí nebo nikoho nemá:** Q6 posuzovanou polovinu nemá vůbec, každé pravidlo tu rozhoduje kontrola (STAGE-6 §8.2). Q3 posuzovanou polovinu má, ale fáze 3 nemá schválení, takže se na její otázky nikdo nezeptá (STAGE-3 §8.4). **Metodicky nejslabší místo běhu je proto trh**, a ten čte až člověk ve fázi 4.

**Otázka:** Kde je metodicky nejslabší místo běhu?
- [ ] V briefu
- [x] V trhu, fázi 3 nikdo neschvaluje
- [ ] V iniciativě

**Proč:** Q3 se na posuzované otázky nikoho nezeptá. Výsledek čte až člověk ve fázi 4.

#### Body vaší revize

**Co žádná specifikace neopraví** (konec každé STAGE-N-SPEC): špatný materiál dá dobře formulované špatné problémy, sebejistý a dobře ozdrojovaný špatný obraz trhu projde, tři varianty MVP mohou být jednou variantou popsanou třikrát a dobře formulovaná iniciativa pro špatný nápad projde. To jsou body vaší revize.

**Guild Master posuzuje kvalitu, ne formu:** jestli je outcome změna chování, jestli příležitost popisuje potřebu, a ne řešení, a jestli trust tag sedí s tím, co za ním je.

**Otázka:** Co jako GM posuzujete?
- [ ] Formu: nadpisy a pole
- [x] Kvalitu: outcome jako změna chování, příležitost jako potřeba, trust tag podle důkazů

**Proč:** Formu hlídají kontroly. Kvalitu nehlídá nikdo jiný.

### Úkoly

- [ ] **Udělejte metodickou revizi ukázkového běhu** (60 min, ve VS Code)
  - *Proč:* Tohle je jádro vaší role: posoudit to, na co kontroly nedosáhnou.
  1. Vyberte hotový ukázkový běh (např. `fixtures/2026-09-savings-goals/`).
  2. Brief: projděte outcome proti osmi chybám z `method-canon.md` §9.2.
  3. Příležitosti: u tří ověřte kritéria z §10.4 a trust tag proti `evidence-standards.md`.
  4. Iniciativa: sedí s šablonou Guildy?
  5. Výsledek zapište jako revizi: co je dobře, co je slabé a jestli jde o slabý materiál, nebo o mezeru v metodice.
- [ ] **Odpovězte na posuzovaná pravidla u vlastního podpisu** (20 min, ve VS Code)
  - *Proč:* Vaše odpovědi zůstávají v záznamu a jsou jediným lidským hodnocením kvality, které pilot má.
  1. U příští brány ve cvičném běhu si nechte od agenta vypsat otázky brány.
  2. Ve třetím políčku `SPOCK: approve what is in front of me` je zodpovězte (např. `1y 2n 3?`).
  3. V `RUN-STATE.md` ověřte, že se odpovědi zapsaly s vaším jménem.

### Pro zvídavé (anglicky, ve vaší kopii SPOCKu)

- 📄 **`BUSINESS-LOGIC-OVERVIEW.md`** §6 (co kontroly dělají a co ne)
- 📄 **`specifications/stage-specs/STAGE-1-SPEC.md`**: odstavec o posuzovaných pravidlech u `G1`
- 📄 **`method-canon.md`** §9.2 (osm způsobů, jak se outcome formuluje špatně) a §10.4 (dobře formulovaná příležitost)

## 2G.4 — Změna know-how

### Karty (asi 6 min, jen na webu)

#### Postup změny know-how

**Postup změny:** osoba v ČS rozhodne a upraví **zdroj** → zvýší **Version**, nastaví **Date** a do bloku historie připíše jeden řádek, co se změnilo a proč → **SWE** vygeneruje kopii pro agenty a spustí kontroly → teprve když projdou, se změna commitne.

**Víc do hloubky:**
- **Změna bez nové verze je chyba.** Běh si zapisuje verzi, kterou četl, a změnu pod stejným číslem by nešlo odlišit od toho, co bylo předtím. **Výjimka existuje a je vzácná:** Method Canon zapisuje úpravu jedné věty se zachovanou verzí 0.4, protože na tu verzi odkazují citace Methodology Coache a žádný oddíl se nepřesunul. I taková úprava má řádek v historii s důvodem. O výjimce nerozhodujete sami: projděte ji s týmem CoE Product Management.
- **Status *Approved*** a vaše jméno v řádku Owner patří do hlavičky až po revizi **celého** dokumentu. Řádek *Written by* zůstává autorovi z pilotního týmu.

**Otázka:** Kdo vygeneruje kopii know-how pro agenty a spustí kontroly?
- [ ] Guild Master
- [x] SWE
- [ ] Agent

**Proč:** GM mění zdroj, SWE generuje kopii a ověřuje ji.

#### Změna se dělá ve vývojovém repozitáři

**Know-how se nikdy nemění ve vlastní pracovní kopii SPOCKu.** Vygenerovaná kopie v `.github/know-how/` patří k vydání. Jakákoli změna v ní, i ta provedená správným postupem, shodí v běhu kontrolu **`C189`** („soubory workflow se liší od vydání“). Tu nejde podepsat jako výjimku. Změna se dělá ve **vývojovém repozitáři pilotního týmu**, vyjde v **novém vydání** a k uživatelům se dostane taskem `SPOCK: update this copy to the latest release` po dokončení jejich běhů.

**Kontroly z `KNOW-HOW-OWNERS.md` §4 krok 4 ve vydané kopii nejsou.** `repo-check.mjs` a `check.test.mjs` má jen vývojový repozitář. SWE, se kterým změnu děláte, k němu potřebuje přístup od pilotního týmu.

**Otázka:** Upravíte know-how ve své pracovní kopii SPOCKu správným postupem. Projde to?
- [ ] Ano, postup byl správný
- [x] Ne, kontrola `C189` selže a nejde podepsat jako výjimka

**Proč:** Změna patří do vývojového repozitáře a k lidem se dostane novým vydáním.

#### Jedna změna najednou

**Jedna změna najednou.** Pak víte, co způsobila.

**Otázka:** Proč dělat změny po jedné?
- [x] Pak víte, co která změna způsobila
- [ ] Kvůli kreditům

**Proč:** Víc změn najednou nejde od sebe odlišit.

### Úkoly

- [ ] **Napište návrh změny metodiky** (45 min, ve VS Code)
  - *Proč:* Návrh vás donutí promyslet dopad dřív, než se cokoli změní, a dá týmu CoE Product Management i SWE co revidovat.
  1. Z revize v 2G.3 nebo z porovnání v 2G.2 vyberte jeden problém.
  2. Napište: problém, kterého dokumentu se týká, co přesně změníte, novou verzi a jak poznáte, že změna funguje (na kterém běhu ji ověříte).
  3. Projděte návrh s týmem CoE Product Management.
- [ ] **Proveďte změnu se SWE** (60 min, ve VS Code, volitelné)
  - *Proč:* Celý cyklus jednou projdete sami: od rozhodnutí po ověřený commit.
  1. Ve **vývojovém repozitáři pilotního týmu** (ne ve své pracovní kopii SPOCKu) založte zkušební větev a upravte **jen zdrojový** soubor ve `specifications/definitions/know-how/`: text, Version, Date a řádek historie.
  2. SWE spustí generování a kontroly z `KNOW-HOW-OWNERS.md` §4 krok 4.
  3. Když kontroly projdou, změnu nechte zrevidovat a commitnout.

### Pro zvídavé (anglicky, ve vaší kopii SPOCKu)

- 📄 **`KNOW-HOW-OWNERS.md`** §4 („How a change is made“)

## 2G.5 — Vedení komunity PM

### Karty (asi 6 min, jen na webu)

#### Mezery v kánonu jsou signál

**Methodology Coach** odpovídá jen z Method Canonu. Co v kánonu není, neřekne. Mezery, na které PM narážejí, jsou pro vás signál ke změně.

**Otázka:** PM se opakovaně ptají Methodology Coache na věc, kterou neumí odpovědět. Co to pro vás je?
- [ ] Chyba agenta
- [x] Signál, že v kánonu chybí, a podnět ke změně

**Proč:** Coach odpovídá jen z Method Canonu.

#### Co pilot z metody vynechává

**Co pilot z metody vynechává** (`method-canon.md` §15: průběžné rozhovory, strukturovaný strom příležitostí, testování) musí Guilda říkat na rovinu, aby PM nebrali výstup SPOCKu jako ověřený.

**Otázka:** Co musí Guilda říkat na rovinu?
- [x] Že pilot nedělá průběžné rozhovory ani testování a výstup není ověřený
- [ ] Že SPOCK nahrazuje metodiku banky

**Proč:** Jinak by PM brali výstup SPOCKu jako ověřený.

#### Opakované výjimky

**Výjimky označené „the workflow looks wrong“** se sčítají v `SPOCK: how the workflow performed`. Opakující se výjimka u stejné kontroly je podnět k revizi metodiky nebo kontroly.

**Otázka:** Tři PM podepsali výjimku u stejné kontroly s „the workflow looks wrong“. Co uděláte?
- [ ] Nic, výjimky jsou běžné
- [x] Projdu, jestli nejde o chybu metodiky nebo kontroly

**Proč:** Opakující se výjimka je podnět k revizi.

### Úkoly

- [ ] **Najděte vzor ve zpětné vazbě** (30 min, ve VS Code)
  - *Proč:* Jeden nález je náhoda, tři stejné jsou úkol pro metodiku.
  1. Spusťte `SPOCK: how the workflow performed` nad běhy, které máte k dispozici.
  2. Projděte deníky a nálezy PM z vaší komunity.
  3. Zapište jeden opakující se vzor a rozhodněte: materiál, metodika, nebo workflow (to předáte týmu CoE Product Management)?
- [ ] **Připravte 30minutové intro pro Guildu** (45 min, ve VS Code)
  - *Proč:* PM se SPOCK naučí rychleji od vás než z dokumentace.
  1. Osnova: co SPOCK dělá (7 fází), kde rozhoduje člověk, co výstup dokazuje a co ne a kde je onboarding.
  2. Jako ukázku použijte vlastní revizi z 2G.3.

## 2G.6 — Architektura pro správce metodiky

### Karty (asi 14 min, jen na webu)

#### Proč architekturu znát

**Proč to Guild Master potřebuje:** agenti nesmějí číst kód kontrol a píší podle know-how. **Kvalita know-how je proto přímo kvalita výstupu.** A jedna změna know-how se projeví v každém skillu, který ho čte.

{{schema-architektury}}

**Otázka:** Kde je nejsilnější páka GM na kvalitu výstupu?
- [ ] V nastavení modelu
- [x] V know-how
- [ ] V tascích

**Proč:** Agenti píší podle know-how a kód kontrol číst nesmějí.

#### Čtyři otázky architektury

**Jak do sebe SPOCK zapadá: čtyři otázky.** Celou architekturu pochopíte, když u každé části víte, na kterou z nich odpovídá:

- **1. Co agent ví?** Jen tři věci: pravidla pro všechny (pracovní řád), **skill** (postup pro jeden dokument) a **know-how** (co znamená „dobře“). Jinou paměť nemá. Kód kontrol číst nesmí, takže kvalita jeho práce stojí na skillu a know-how.
- **2. Co agent smí?** Jen to, co má ve svém seznamu nástrojů. Za běhu ho navíc hlídají **hlídače**: zastaví zápis mimo jeho fázi, do schválené fáze nebo do vašeho materiálu a nepustí ho k tasku, kde se podepisuje člověk.
- **3. Kdo ověří, co agent napsal?** **Kód kontrol** (Q brána), ne agent sám. Které kontroly patří ke které bráně, určují kontrakty a registry. Kontrola hlídá formu a stopu ke zdroji, kvalitu metodiky posuzuje člověk.
- **4. Kdo rozhoduje?** **Člověk**, podpisem přes task s políčky (G brána). Podpis, jméno, role a verze každého know-how, které agent četl, se zapíšou do záznamu běhu (`RUN-STATE.md`).

**Otázka:** Kdo ověří, co agent napsal?
- [ ] Agent sám
- [x] Kód kontrol, kvalitu metodiky pak člověk
- [ ] Methodology Coach

**Proč:** Psaní a kontrola jsou oddělené. Agent nemůže prohlásit, že prošel.

#### Proč je to postavené takhle

**Proč je to postavené právě takhle:**

- **Psaní a kontrola jsou oddělené.** Kdo dokument píše, ten ho neschvaluje. Agent nemůže prohlásit, že prošel.
- **Každá fáze začíná v novém chatu.** Chat začíná s know-how fáze, do které vstupujete, a nenese nic z předchozí konverzace. Posouzení další fáze je tak nezávislé.
- **Cizí materiál čte agent bez nástrojů.** Krok čtení materiálu ve fázi 2 (`material-intake`) běží v karanténě. Pokyn schovaný v rozhovoru nebo dokumentu nemůže proměnit v akci.
- **Běh si pamatuje, podle čeho vznikl.** Protože se zapisuje verze každého know-how, víte u každého běhu, podle jaké metodiky byl napsaný. Proto musí mít každá změna know-how novou verzi.
- **Workflow se mění jen novým vydáním.** Úprava souborů SPOCKu v pracovní kopii shodí kontrolu C189. Vaše změny metodiky se k lidem dostanou až s vydáním.

**Otázka:** Proč čte agent cizí materiál bez nástrojů?
- [x] Aby pokyn schovaný v materiálu nemohl proměnit v akci
- [ ] Aby byl rychlejší

**Proč:** Krok `material-intake` běží v karanténě.

#### Devět vrstev, vaše je jedna

**SPOCK má devět vrstev.** Vy vlastníte jednu (know-how), ostatní mění SWE:

| Vrstva | Kde žije | Co dělá |
|---|---|---|
| Pravidla pro všechny | `.github/copilot-instructions.md`, `.github/instructions/` | Pracovní řád: piš jen do běhu, nic nedomýšlej, sám nic neschvaluj |
| Agenti (6) | `.github/agents/*.agent.md` | Kdo agent je a jaké má nástroje |
| Skilly (17) | `.github/skills/*/SKILL.md` | Postup krok za krokem pro jeden dokument |
| **Know-how (22 v 5 oblastech)** | zdroj `specifications/definitions/know-how/` | **Co znamená „dobře“: metodika, šablony, regulace. Vaše vrstva** |
| Kontrakty | `.github/workflow-contracts/*.yaml` | Pořadí fází a kritéria bran |
| Registry | `.github/registry/*.yaml` | Seznam všeho, co existuje: agenti, skilly, kontroly, povolený web |
| Kontroly | `.github/scripts/check.mjs`, `gates.mjs` | Kód, který po agentovi ověří výstup (Q brány) |
| Hlídače | `.github/hooks/step-guards.json` → `step-guard.mjs` | Za běhu zastaví špatný krok dřív, než se stane |
| Tasky (46) | `.vscode/tasks.json` | Tlačítka `SPOCK: …`. Políčka pro jméno a roli vyplní jen člověk |

**Otázka:** Kterou vrstvu vlastní Guild Master?
- [ ] Kontroly
- [x] Know-how
- [ ] Tasky

**Proč:** Ostatní vrstvy mění SWE a pilotní tým.

#### Agenti a hlídače

**Agenti a jejich nástroje.** Co agent nemá v `tools:`, to neudělá:

| Agent | Fáze | Nástroje |
|---|---|---|
| Product Manager | 1, 4, 5 | čte, píše soubory, spouští tasky bez políček |
| Opportunity Designer | 2 | totéž; čtení materiálu (`material-intake`) běží v karanténě |
| Competitive Analysis | 3 | totéž a navíc **web** (`fetch`, `websearch`). Jediný agent s webem |
| Business Analyst | 6, 7 | čte, píše soubory, spouští tasky bez políček |
| Methodology Coach | radí | jen čte |
| Workflow Support | radí | jen čte |

**Hlídače: co který zastaví.** Každé jejich rozhodnutí se zapisuje do `.github/.guard/decisions.jsonl` ve vaší kopii (soubor není v gitu):

| Kdy | Hlídač | Co dělá |
|---|---|---|
| Start chatu | `SessionStart` | Dá agentovi poznámku o stavu běhu a o tom, co smí |
| Vaše zpráva | `SG7` | Když jste mezitím spustili task, předá agentovi jeho výstup |
| Před zápisem | `write` | Odmítne zápis mimo běžící fázi, do `.github/` a `.vscode/`, do schválené fáze, do `supplied/` a do souborů, které píše workflow |
| Před zápisem | `SG3` | Odmítne zápis dokumentu, když agent v tomto chatu neotevřel jeho skill |
| Před čtením | `checker` | Agent nesmí číst kód kontrol |
| Před taskem | `SG1` | Agent nesmí spustit task s políčky pro člověka |
| Před taskem | smyčka | Stejný task potřetí bez změny v běhu → zastaví |
| Před webem | `SG4` | Ve fázi 3 nepustí hledání před úvodní zprávou fáze |
| Po tasku | `SG2` | Dá agentovi celý výstup tasku: „jednej podle celého“ |
| Konec tahu | `SG5`, `SG6` | Vrátí tah, když agent chce po člověku, co má udělat sám, nebo když žádosti o schválení chybí povinné věty |

**Otázka:** Který agent jediný smí na web?
- [ ] Product Manager
- [x] Competitive Analysis
- [ ] Business Analyst

**Proč:** Jen Competitive Analysis má v `tools:` `fetch` a `websearch`.

#### Jeden tah fáze 1

**Jeden tah fáze 1, krok za krokem, a kdo ho dělá** (9 kroků níže).

1. **Vy (task):** `SPOCK: start a run` založí běh a kostru briefu.
2. **Hlídač:** při startu chatu s Product Managerem dá agentovi poznámku o běhu.
3. **Agent:** otevře skill `brief-creation` a jeho know-how (Method Canon, Brief Fields, Stage 1 Shapes, Strategy Basis a další).
4. **Agent:** vede rozhovor. Co nevíte, zapíše jako `unknown` s důvodem. Rozhovor má strop 40 výměn.
5. **Hlídač:** před zápisem ověří, že soubor patří do běžící fáze a že agent otevřel skill.
6. **Kód:** agent spustí kontrolu, Q1 projde mechanickou polovinu, výsledek jde do `.github/last-task.md`.
7. **Hlídač:** předá agentovi celý výstup. Když něco neprošlo, agent opraví a kontrolu zopakuje.
8. **Hlídač:** na konci tahu ověří, že žádost o schválení má povinné věty.
9. **Vy (task):** `SPOCK: approve what is in front of me` zapíše podpis G1 a běh postoupí.

**Otázka:** Kdo zapíše podpis G1?
- [ ] Agent po kontrole
- [x] Vy, taskem `SPOCK: approve what is in front of me`
- [ ] Hlídač na konci tahu

**Proč:** Task s políčky pro člověka agent spustit nesmí.

#### Mapa dopadu změny

**Mapa dopadu: které skilly čtou které know-how** (`.github/registry/skills.yaml`):

| Know-how | Kolik skillů | Které |
|---|---|---|
| Method Canon | 16 | všechny skilly kromě `workflow-support` |
| Evidence Standards | 4 | `brief-creation`, `material-intake`, `hypothesis-authoring`, `methodology-guidance` |
| Opportunity Framing | 3 | `opportunity-framing`, `prioritisation`, `methodology-guidance` |
| Discovery Craft | 2 | `ideation`, `methodology-guidance` |
| Strategy Basis | 4 | `brief-creation`, `ideation`, `mvp-expansion`, `prd` |
| Brief Fields, Stage 1 Shapes | 1 | `brief-creation` |
| Stage 3 Shapes | 3 | `landscape-mapping`, `deep-dive`, `synthesis` |
| Stage 4 Shapes | 1 | `ideation` |
| PRD Template | 1 | `prd` |
| Initiative Template | 1 | `initiative-authoring` |

**Víc do hloubky:**
- **Co z mapy plyne:** změna Method Canonu zasáhne celý běh od briefu po iniciativu, změna PRD Template jen fázi 6. Čím víc skillů know-how čte, tím pečlivěji změnu ověřujte a tím víc běhů ji uvidí. Methodology Coach (`methodology-guidance`) čte celou oblast Method, takže změnu Method uslyší PM i v odpovědích na otázky.

**Otázka:** Která změna zasáhne víc běhu?
- [x] Změna Method Canonu
- [ ] Změna PRD Template

**Proč:** Method Canon čte 16 skillů, PRD Template jen jeden.

### Úkoly

- [ ] **Zmapujte dopad jedné změny** (20 min, ve VS Code)
  - *Proč:* Než navrhnete změnu know-how, musíte vědět, které fáze a skilly zasáhne.
  1. Vezměte návrh změny z lekce 2G.4 nebo vyberte jedno know-how z oblasti Method.
  2. V `.github/registry/skills.yaml` najděte všechny skilly, které ho čtou, a k nim fázi (`stage:`) a agenta (`agent:`).
  3. Do návrhu změny dopište: kterých fází a agentů se změna týká a na kterém ukázkovém běhu ji ověříte.
- [ ] **Projděte jeden tah ve vlastním běhu a určete, kdo co dělal** (30 min, ve VS Code)
  - *Proč:* Když umíte u každého kroku říct, jestli ho udělal agent, kód, hlídač, nebo člověk, poznáte, kde se metodika do výstupu dostala a kde ne.
  1. Ve cvičném běhu projděte fázi 1 až po schválení G1.
  2. Otevřete `.github/.guard/decisions.jsonl` a najděte rozhodnutí hlídačů z tohoto chatu (podle času).
  3. K devíti krokům tahu výše si zapište, co jste u každého viděli.
- [ ] **Vysvětlete kolegovi z PM komunity tři pojistky** (15 min, ve VS Code)
  - *Proč:* PM přicházejí s otázkou „proč agent tohle nechce udělat“. Odpověď má být krátká a bez techniky.
  1. Připravte si tři věty: agent píše, kód kontroluje, člověk podepisuje; a hlídače zastaví špatný krok dřív, než se stane.
  2. Ke každé větě dejte jeden příklad z vlastního běhu.

### Pro zvídavé (anglicky, ve vaší kopii SPOCKu)

- 📄 **`.github/agents/*.agent.md`**: v každém souboru jen řádek `tools:`
- 📄 **`.github/registry/skills.yaml`**: u každého skillu řádky `agent:`, `stage:` a `know_how:` (jen čtete, nic neměníte)
- 📄 **Hlavičky know-how** ve `specifications/definitions/know-how/`: řádek **Read by**

## Kvíz

Kvíz losuje 5 otázek z této zásoby. Pořadí otázek i možností se při každém spuštění zamíchá.

**1. Chcete upravit pravidlo v Brief Fields. Který soubor upravíte?**

   a) `.github/know-how/product/brief-fields.md`
   b) Zdroj ve `specifications/definitions/know-how/product/`, ve vývojovém repozitáři
   c) Skill `brief-creation`

<details><summary>Odpověď</summary>

b) Zdroj je jen jeden. Kopie v `.github/know-how/` se generuje a její úprava shodí kontrolu.

</details>

**2. Všechny brány běhu jsou zelené, ale outcome v briefu je „spustit nový onboarding“. Co z toho plyne?**

   a) Běh je v pořádku
   b) Outcome je řešení, ne změna chování. Kontroly to neposoudí, posoudí to člověk
   c) Brána Q1 je rozbitá

<details><summary>Odpověď</summary>

b) Zelená brána je jen mechanická polovina. Kvalitu outcome hlídá GM.

</details>

**3. Opravili jste v know-how překlep a verzi jste nezměnili. Je to v pořádku?**

   a) Ano, je to drobnost
   b) Obvykle ne. Každá změna má novou verzi a řádek v historii. Výjimku projděte s týmem CoE Product Management
   c) Ano, pokud to schválí SWE

<details><summary>Odpověď</summary>

b) Běh si zapisuje verzi know-how. Změnu pod stejným číslem by nešlo odlišit.

</details>

**4. Chcete upravit Method Canon. Proč to vyžaduje víc ověřování než změna PRD Template?**

   a) Method Canon je delší
   b) Čte ho 16 skillů, takže změna zasáhne celý běh. PRD Template čte jen jeden
   c) PRD Template se nemění

<details><summary>Odpověď</summary>

b) Čím víc skillů know-how čte, tím pečlivěji změnu ověřujte.

</details>

**5. Proč agenti nesmějí číst kód kontrol a co to znamená pro vás?**

   a) Kvůli rychlosti. Pro GM nic
   b) Aby psali podle know-how, ne pro kontrolu. Kvalita know-how je proto kvalita výstupu
   c) Kód je tajný

<details><summary>Odpověď</summary>

b) Agent, který by znal kontroly, by psal tak, aby prošel. Takhle píše podle know-how.

</details>

**6. Pět PM za měsíc podepsalo výjimku u stejné kontroly s „the workflow looks wrong“. Kde to uvidíte?**

   a) V `SPOCK: how the workflow performed`
   b) V Methodology Coachi
   c) Nikde, výjimky se nesčítají

<details><summary>Odpověď</summary>

a) Výjimky označené jako podezření na chybu workflow se sčítají v tomto tasku.

</details>

**7. PM se ptá, proč by měl brát výstup SPOCKu opatrně, když všechno prošlo. Co mu řeknete?**

   a) Nemusí, výstup je ověřený
   b) Pilot nedělá průběžné rozhovory ani testování. Výstup je definice, ne důkaz
   c) Že agenti dělají chyby

<details><summary>Odpověď</summary>

b) Co pilot z metody vynechává (`method-canon.md` §15), musí Guilda říkat na rovinu.

</details>

**8. Která vrstva SPOCKu zastaví agenta, který chce zapsat do už schválené fáze?**

   a) Kontroly
   b) Hlídače
   c) Tasky

<details><summary>Odpověď</summary>

b) Hlídač `write` odmítne zápis mimo běžící fázi i do schválené fáze dřív, než se stane.

</details>
