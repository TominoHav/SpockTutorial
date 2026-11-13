# Úroveň 2: Guild Master, správce PM metodiky (5–6 h)

**Cíl:** Víte, kde ve SPOCKu žije produktová metodika a kdo ji vlastní. Umíte metodicky posoudit hotový běh (tu polovinu bran, kterou žádný automat nehodnotí), navrhnout a provést změnu know-how správným postupem a vést komunitu PM, kteří se SPOCKem pracují.

**Proč:** Kontroly SPOCKu hlídají, že dokumenty jsou mechanicky v pořádku. **Jestli je outcome dobře formulovaný a příležitosti jsou ty správné, neposuzuje žádná kontrola**: posuzovaná pravidla nečte žádný automatický soudce (`BUSINESS-LOGIC-OVERVIEW.md` §6). Know-how oblastí **Method** a **Product** vlastní Česká spořitelna a osoba v ČS, která je udržuje, zatím není jmenovaná (`specifications/onboarding/KNOW-HOW-OWNERS.md` §1). Šablona iniciativy Product Management Guildy je pro SPOCK závazná (`initiative-template.md`). Guild Master je člověk, který tohle drží pohromadě.

**Než začnete:** Mějte hotové úrovně 0 a 1 a ideálně i [role-pm.md](role-pm.md). Metodiku nejde posuzovat bez vlastního běhu.

> Guild Master mění **zdroj** know-how v `specifications/definitions/know-how/`. Nikdy neupravuje `.github/`: kopii pro agenty generuje a ověřuje engineer (`KNOW-HOW-OWNERS.md` §3–4).

## 2G.1 — Kde metodika ve SPOCKu žije

### Ke studiu (asi 40 min)

- 📄 **`specifications/onboarding/KNOW-HOW-OWNERS.md`** §1–3
- 📄 **`specifications/definitions/know-how/method/method-canon.md`** §1–4

### Klíčové myšlenky

- **Know-how je to, co agenti čtou a nikdy nepíší**: co je důkaz, co musí obsahovat brief, PRD a iniciativa, jak se mluví s člověkem. Mění se jen rukou člověka, mimo jakýkoli běh (`KNOW-HOW-OWNERS.md` úvod).
- **Pět oblastí:** Compliance, Market, Method, Product a Writing. Pro PM metodiku jsou klíčové **Method** (Method Canon, Evidence Standards, Opportunity Framing, Discovery Craft) a **Product** (Brief Fields, PRD Template, Initiative Template, Strategy Basis a Stage Shapes).
- **Zdroj je jen jeden:** `specifications/definitions/know-how/`. Kopie v `.github/know-how/` se generuje. Úprava kopie selže v kontrole `C41` a při dalším generování zmizí.
- **Každý běh si zapisuje verzi každého know-how, které přečetl.** Proto má každá změna novou verzi.

### Úkoly

- [ ] **Zmapujte know-how oblastí Method a Product** (30 min)
  - *Proč:* Tohle jsou dokumenty, za které budete odpovídat. Musíte vědět, v jakém stavu jsou.
  1. Otevřete každý soubor ve `specifications/definitions/know-how/method/` a `…/product/`.
  2. Z hlavičky si zapište **Version**, **Status** a **Owner** (např. Method Canon: 0.4, For review).
  3. Označte si, které mají status *Approved* a které ještě ne. Schválení je práce jmenované osoby v ČS (`KNOW-HOW-OWNERS.md` §4 krok 3).
- [ ] **Najděte, které verze know-how běh četl** (15 min)
  - *Proč:* Když se změní metodika, potřebujete vědět, které běhy vznikly podle staré verze.
  1. Otevřete `RUN-STATE.md` ukázkového běhu `fixtures/2026-09-spending-insights/`.
  2. U fáze 1 najděte řádek `know_how:` a verzi `brief-fields` (v tomto běhu `brief-fields@0.4`).
  3. Porovnejte ji s aktuální verzí ve zdroji (`product/brief-fields.md`, dnes 0.7). Zapište si, co se mezi verzemi změnilo (blok historie v hlavičce).

## 2G.2 — Šablona Guildy a co z ní SPOCK dělá

### Ke studiu (asi 40 min)

- 📄 **`specifications/definitions/know-how/product/initiative-template.md`**: úvod a uzavřená otázka dvou šablon
- 📄 **`specifications/definitions/know-how/product/brief-fields.md`** §2 a §4

### Klíčové myšlenky

- **ČS má pro jeden Jira objekt dvě šablony.** Stakeholder rozhodl, že platí šablona **Product Management Guildy**. Kde se šablony liší, vyhrává Guilda. **Kde Guilda mlčí, zůstávají převzaté sekce**, protože mlčení není nesouhlas (`initiative-template.md`).
- **Iniciativa má 13 sekcí**, hodnotový příběh tvoří čtyři sekce Guildy: insight, business goal, outcome a success metrics.
- **Brief je sada polí.** Co nikdo nedodal, je unknown s důvodem, a cíl jsou čtyři věci: produktový cíl, metrika, key result a písemná vazba mezi nimi (`STAGE-1-SPEC.md`, krok 4).

### Úkoly

- [ ] **Porovnejte šablonu Guildy se SPOCKem** (45 min)
  - *Proč:* Jste ten, kdo ví, co Guilda chce. Rozdíly, které nikdo nezapsal, se projeví v každé iniciativě.
  1. Vedle sebe otevřete aktuální šablonu iniciativy Guildy a `initiative-template.md`.
  2. U každé ze 13 sekcí si zapište: odpovídá, liší se, nebo Guilda mlčí.
  3. Rozdíly, kde Guilda mezitím šablonu změnila, si zapište jako kandidáty na změnu know-how (lekce 2G.4).

## 2G.3 — Metodická revize běhu

### Ke studiu (asi 40 min)

- 📄 **`BUSINESS-LOGIC-OVERVIEW.md`** §6 (co kontroly dělají a co ne)
- 📄 **`specifications/stage-specs/STAGE-1-SPEC.md`**: odstavec o posuzovaných pravidlech u `G1`
- 📄 **`method-canon.md`** §9.2 (osm způsobů, jak se outcome formuluje špatně) a §10.4 (dobře formulovaná příležitost)

### Klíčové myšlenky

- **Každá brána má mechanickou a posuzovanou polovinu.** Mechanickou spouští kód. **Posuzovanou nehodnotí žádný automat**, protože všechny agenty pilotu pohání jedna rodina modelů a kontrola stejnou rodinou by byla producent souhlasící sám se sebou.
- **Kdo podepisuje bránu, může posuzovaná pravidla zodpovědět** ve třetím políčku `SPOCK: approve what is in front of me`: `y`, `n` nebo `?` s číslem otázky. Přeskočené se zapíše jako skipped a kontrola `C180` hlídá, že odpovědi mají jméno a roli.
- **Guild Master posuzuje kvalitu, ne formu:** jestli je outcome změna chování, jestli příležitost popisuje potřebu, a ne řešení, a jestli trust tag sedí s tím, co za ním je.

### Úkoly

- [ ] **Udělejte metodickou revizi ukázkového běhu** (60 min)
  - *Proč:* Tohle je jádro vaší role: posoudit to, na co kontroly nedosáhnou.
  1. Vyberte hotový ukázkový běh (např. `fixtures/2026-09-savings-goals/`).
  2. Brief: projděte outcome proti osmi chybám z `method-canon.md` §9.2.
  3. Příležitosti: u tří ověřte kritéria z §10.4 a trust tag proti `evidence-standards.md`.
  4. Iniciativa: sedí s šablonou Guildy?
  5. Výsledek zapište jako revizi: co je dobře, co je slabé a jestli jde o slabý materiál, nebo o mezeru v metodice.
- [ ] **Odpovězte na posuzovaná pravidla u vlastního podpisu** (20 min)
  - *Proč:* Vaše odpovědi zůstávají v záznamu a jsou jediným lidským hodnocením kvality, které pilot má.
  1. U příští brány ve cvičném běhu si nechte od agenta vypsat otázky brány.
  2. Ve třetím políčku `SPOCK: approve what is in front of me` je zodpovězte (např. `1y 2n 3?`).
  3. V `RUN-STATE.md` ověřte, že se odpovědi zapsaly s vaším jménem.

## 2G.4 — Změna know-how

### Ke studiu (asi 20 min)

- 📄 **`KNOW-HOW-OWNERS.md`** §4 („How a change is made“)

### Klíčové myšlenky

- **Postup změny:** osoba v ČS rozhodne a upraví **zdroj** → zvýší **Version**, nastaví **Date** a do bloku historie připíše jeden řádek, co se změnilo a proč → **engineer** vygeneruje kopii pro agenty a spustí kontroly → teprve když projdou, se změna commitne.
- **Změna bez nové verze je chyba.** Běh si zapisuje verzi, kterou četl, a změnu pod stejným číslem by nešlo odlišit od toho, co bylo předtím.
- **Status *Approved*** a vaše jméno v řádku Owner patří do hlavičky až po revizi **celého** dokumentu. Řádek *Written by* zůstává autorovi z pilotního týmu.
- **Jedna změna najednou.** Pak víte, co způsobila.

### Úkoly

- [ ] **Napište návrh změny metodiky** (45 min)
  - *Proč:* Návrh vás donutí promyslet dopad dřív, než se cokoli změní, a dá Igorovi i engineerovi co revidovat.
  1. Z revize v 2G.3 nebo z porovnání v 2G.2 vyberte jeden problém.
  2. Napište: problém, kterého dokumentu se týká, co přesně změníte, novou verzi a jak poznáte, že změna funguje (na kterém běhu ji ověříte).
  3. Projděte návrh s Igorem.
- [ ] **Proveďte změnu s engineerem** (60 min, volitelné)
  - *Proč:* Celý cyklus jednou projdete sami: od rozhodnutí po ověřený commit.
  1. Na zkušební větvi upravte **jen zdrojový** soubor ve `specifications/definitions/know-how/`: text, Version, Date a řádek historie.
  2. Engineer spustí generování a kontroly z `KNOW-HOW-OWNERS.md` §4 krok 4.
  3. Když kontroly projdou, změnu nechte zrevidovat a commitnout.

## 2G.5 — Vedení komunity PM

### Klíčové myšlenky

- **Methodology Coach** odpovídá jen z Method Canonu. Co v kánonu není, neřekne. Mezery, na které PM narážejí, jsou pro vás signál ke změně.
- **Co pilot z metody vynechává** (`method-canon.md` §15: průběžné rozhovory, strukturovaný strom příležitostí, testování) musí Guilda říkat na rovinu, aby PM nebrali výstup SPOCKu jako ověřený.
- **Výjimky označené „the workflow looks wrong“** se sčítají v `SPOCK: how the workflow performed`. Opakující se výjimka u stejné kontroly je podnět k revizi metodiky nebo kontroly.

### Úkoly

- [ ] **Najděte vzor ve zpětné vazbě** (30 min)
  - *Proč:* Jeden nález je náhoda, tři stejné jsou úkol pro metodiku.
  1. Spusťte `SPOCK: how the workflow performed` nad běhy, které máte k dispozici.
  2. Projděte deníky a nálezy PM z vaší komunity.
  3. Zapište jeden opakující se vzor a rozhodněte: materiál, metodika, nebo workflow (to předáte Igorovi)?
- [ ] **Připravte 30minutové intro pro Guildu** (45 min)
  - *Proč:* PM se SPOCK naučí rychleji od vás než z dokumentace.
  1. Osnova: co SPOCK dělá (7 fází), kde rozhoduje člověk, co výstup dokazuje a co ne a kde je onboarding.
  2. Jako ukázku použijte vlastní revizi z 2G.3.

## Kvíz

**1. Chcete upravit pravidlo v Brief Fields. Který soubor upravíte?**

   a) `.github/know-how/product/brief-fields.md`, ten čtou agenti
   b) `specifications/definitions/know-how/product/brief-fields.md` a zvýšíte Version
   c) Oba, ať jsou stejné

<details><summary>Odpověď</summary>

b) Zdroj je jediná kopie, kterou kdo upravuje. Kopii v `.github/know-how/` generuje engineer. Ruční úprava kopie selže v `C41` a zmizí (`KNOW-HOW-OWNERS.md` §3).

</details>

**2. Všechny brány běhu jsou zelené, ale outcome v briefu je „spustit nový onboarding“. Co z toho plyne?**

   a) Je to v pořádku, brány prošly
   b) Kontroly hlídají formu, ne metodickou kvalitu. Tohle je řešení, ne outcome, a je to úkol pro metodickou revizi

<details><summary>Odpověď</summary>

b) Posuzovanou polovinu bran nečte žádný automat. Outcome formulovaný jako řešení je jedna z chyb v `method-canon.md` §9.2.

</details>

**3. Šablona Guildy pro iniciativu k jedné sekci nic neříká. Co SPOCK dělá?**

   a) Sekci vynechá
   b) Ponechá převzatou sekci, protože mlčení Guildy není nesouhlas
   c) Nechá ji napsat agenta podle jeho uvážení

<details><summary>Odpověď</summary>

b) Kde se šablony liší, vyhrává Guilda. Kde mlčí, zůstávají převzaté sekce (`initiative-template.md`).

</details>
