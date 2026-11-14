# Úroveň 2: Product Manager (6–8 h)

**Cíl:** Projdete jeden vlastní běh od briefu až po iniciativu a každé rozhodnutí podepíšete sami. Budete vědět, co máte v které fázi dodat a jak vypadá správné chování agenta.

**Proč:** SPOCK je postavený kolem PM. Pět ze šesti rozhodovacích bran podepisuje Product Manager (`BUSINESS-LOGIC-OVERVIEW.md` §4) a u G2 je to PM, nebo Researcher. Bez vás se běh nepohne.

**Než začnete:** Mějte hotové úrovně 0, 1 a [1b](uroven-1b-faze-do-hloubky.md). Před každou fází si zopakujte její lekci z úrovně 1b (1F.1 až 1F.7): u G-bran podepisujete věci, které podrobně popisují specifikace fází. Zvolte si **téma, které znáte**, a připravte si k němu **vymyšlený nebo anonymizovaný** materiál. V cvičném běhu nepoužívejte skutečná klientská data (`TESTER-GUIDE.md` §2). Mějte otevřenou tabulku „Should happen“ z `TESTER-GUIDE.md` §4. Ta říká, co je správné chování.

## 2P.1 — Fáze 1: brief

### Ke studiu (asi 20 min)

- 📄 **`SETUP.md`** §6 („Your first run“)
- 📄 **`TESTER-GUIDE.md`** §3.3 a §4 „Stage 1 · Brief“

### Klíčové myšlenky

- Běh založíte povelem **`Start a discovery run.`** u agenta Product Manager. Název běhu, své jméno a roli zadáváte v tasku `SPOCK: start a run`, ne v chatu.
- Když přinesete vlastní dokument, agent ho **vyslýchá, ne přepisuje**: začne tím, co je slabé nebo chybí, a u každého pole řekne, odkud je (STAGE-1 R3.0.1–R3.0.4).
- Agent se ptá **po jednom poli**, ne formulářem. Jako první se zeptá na jazyk. Když jazyk neuvedete, zapíše `cs` a řekne vám to.
- Co nedodáte, označí jako **unknown s důvodem**. Pole si nikdy nevymýšlí. Agent také **nikdy nenapíše větu, která spojuje vaši metriku s key resultem**. To je vaše práce (`TESTER-GUIDE.md` §4).

### Úkoly

- [ ] **Založte běh** (15 min)
  - *Proč:* Název, jméno a roli zadáváte vy. Agent, který by běh pojmenoval sám, se chová chybně.
  1. Nový chat → agent **Product Manager** → model Claude Sonnet 5, High, 1M.
  2. Napište `Start a discovery run.`
  3. Agent vás pošle na task `SPOCK: start a run`. Spusťte ho a vyplňte název (`2026-11-<krátký-název>`, malými písmeny), jméno a roli (`Product Manager`).
- [ ] **Projděte brief se schválnou chybou** (45 min)
  - *Proč:* Ověříte si, že agent hlídá metodiku. Outcome má být změna chování nebo výsledku, ne řešení.
  1. Jako outcome napište řešení, např. „postavit kalkulačku hypotéky“.
  2. Agent by měl navrhnout přeformulování, **nejvýš dvakrát**. Zapište si do deníku, jak to udělal.
  3. Až nabídne více key resultů, vyberte si sami. Agent za vás vybírat nesmí.
  4. Na jedno pole schválně odpovězte „nevím“ a pak ověřte, že je v briefu jako unknown s důvodem.
- [ ] **Schvalte brief (G1)** (15 min)
  - *Proč:* Uvidíte, co se zapíše, když rozhodnete. Tenhle záznam je důkaz, kdo za briefem stojí.
  1. Agent nejdřív spustí kontrolu a opraví, co najde. **Teprve pak** vás požádá o schválení.
  2. Spusťte `SPOCK: approve what is in front of me`. Má 4 políčka: jméno, roli, odpovědi na otázky brány (nepovinné, např. `1y 2n`) a co jste chtěli změnit (nepovinné).
  3. Otevřete `runs/<běh>/README.md` a `RUN-STATE.md` a najděte svůj podpis G1.

## 2P.2 — Fáze 2: problémy a příležitosti

### Ke studiu (asi 20 min)

- 📄 **`TESTER-GUIDE.md`** §2.3 (jaký materiál SPOCK přečte) a §4 „Stage 2“
- 📄 **`BUSINESS-LOGIC-OVERVIEW.md`** §3, fáze 2 a tabulka trust tagu

### Klíčové myšlenky

- **Bez materiálu fáze 2 nezačne.** Agent nic nedoplní ani nevymyslí. Materiál dáte jako soubory do `runs/<běh>/2-problems/supplied/`.
- **Trust tag** (strong, weak, unrated) se odvozuje z důkazů, agent ho nikdy jen neprohlásí. *Strong* potřebuje alespoň dva nezávislé zdroje a aspoň jeden z první ruky.
- Příležitosti se dělí na **1–3 primární, 0–5 sekundárních** a odložené (parked). Odložené zůstávají v záznamu.
- Ve fázi 2 je **karanténa**. Pokyn schovaný v materiálu je jen text, podle kterého se nejedná.

### Úkoly

- [ ] **Dodejte materiál a načtěte ho** (20 min)
  - *Proč:* Materiál je jediná věc v běhu, kterou nenapsal ani systém, ani tým. Proto se načítá tímhle zvláštním způsobem.
  1. Vložte 2–4 soubory (poznámky z rozhovorů, tikety, průzkum) do `2-problems/supplied/`. Ideálně si je připraví designer (viz [role-designer.md](role-designer.md)).
  2. Nový chat → agent **Opportunity Designer**.
  3. Agent spustí `SPOCK: read in the problem material`. Když ohlásí soubory bez data, spusťte `SPOCK: date the material that arrived without dates` a období vyplňte sami.
- [ ] **Přidejte problém vlastními slovy** (10 min)
  - *Proč:* Některé věci víte, ale nemáte je napsané. Takhle se dostanou do materiálu jako váš výrok.
  1. Spusťte `SPOCK: add a problem in my own words` a napište jeden problém.
- [ ] **Potvrďte a seřaďte příležitosti (G2)** (40 min)
  - *Proč:* Rozhodujete, které příležitosti tenhle běh sleduje. Na nich stojí všechno, co přijde potom.
  1. Projděte rámované příležitosti s designerem, pokud ho máte. U každé zkontrolujte trust tag a ze kterých souborů vychází.
  2. Ověřte, že agent sám nic nepovýšil a nevyprázdnil odložené.
  3. Schvalte taskem `SPOCK: approve what is in front of me`.

## 2P.3 — Fáze 3: trh

### Ke studiu (asi 20 min)

- 📄 **`SETUP.md`** §6 krok 5 („Stage 3, your market list, or none“) a krok 7
- 📄 **`TESTER-GUIDE.md`** §4 „Stage 3 · Market“

### Klíčové myšlenky

- Fáze 3 má **dva způsoby práce**. Buď **seznam konkurentů** jako jeden soubor v `3-competitive-analysis/supplied/`, nebo prázdná složka, a pak agent hledá sám. Hledání ale potřebuje rozšíření pro webové vyhledávání a klíč, které běžná instalace nemá. **Použijte seznam.**
- **Fáze 3 nemá vaše schválení.** Kdyby vás agent o schválení fáze 3 žádal, je to nález. Fázi přijme brána Q3.
- Než agent otevře webovou stránku, VS Code se vás zeptá. Povolte jen adresy ze seznamu a jakoukoli jinou odmítněte a zapište si ji.

### Úkoly

- [ ] **Připravte seznam trhu a projděte fázi 3** (60 min)
  - *Proč:* V bance nebude vždy dovolené volně hledat na webu. Se seznamem máte přehled, co odchází ven.
  1. Nový chat → agent **Competitive Analysis**. Agent popíše oba způsoby a čeká.
  2. Podle jeho úvodní zprávy připravte soubor se 3–10 konkurenty a jejich adresami. **Každou adresu nejdřív sami otevřete.** Nefunkční vyhoďte.
  3. Soubor uložte do `3-competitive-analysis/supplied/` a spusťte `SPOCK: what market material has been supplied` → `yes`.
  4. Kontrolujte, jestli agent otevírá jen adresy ze seznamu. Zapisujte si každou cizí adresu.
  5. Na konci ve výstupu ověřte, že trendy jsou ve třech třídách (business, technology, regulatory) a že regulatorní trend uvádí předpis a datum.

## 2P.4 — Fáze 4: řešení

### Ke studiu (asi 15 min)

- 📄 **`BUSINESS-LOGIC-OVERVIEW.md`** §3, fáze 4, včetně odstavce „What that costs“
- 📄 **`TESTER-GUIDE.md`** §4 „Stage 4“

### Klíčové myšlenky

- **Fáze 4 nemá žádné skóre**, žádné pořadí ani číslo. Porovnáváte **seznam touchpointů a jejich počet** u každého řešení.
- **Tříletá a třítýdenní stavba vypadají pro workflow stejně.** Na technickou složitost se proto před výběrem zeptejte engineera (viz [role-engineer.md](role-engineer.md)).
- Výběr jsou dvě akce: nejdřív zapíšete volbu i s důvodem, pak schválíte. **Důvod se slovo od slova přepíše do vybraného řešení** pod „Why this one“ a je to jediné, co z rozhodnutí zbude pro fáze 5–7 (STAGE-4 R9.3).
- Možnost „nic z toho“ neexistuje. Když se vám žádné řešení nelíbí, změňte některé nebo přidejte vlastní, až do deseti (STAGE-4 R9.7).

### Úkoly

- [ ] **Vyberte řešení (G4)** (45 min)
  - *Proč:* Výběr řešení je rozhodnutí člověka. SPOCK u něj chce **důvod vlastními slovy**, aby se dal za dva roky obhájit.
  1. Nový chat → **Product Manager**. Projděte sadu řešení (`4-solutions/1-solution-set.md`).
  2. Pokud chcete, přidejte vlastní řešení. Bude označené jako vaše.
  3. Zapište volbu: `SPOCK: record a decision I made` → druh `choice`, id řešení (např. `SOL2`), proč, jméno a roli.
  4. Schvalte: `SPOCK: approve what is in front of me`.

## 2P.5 — Fáze 5: MVP

### Klíčové myšlenky

- Agent navrhne **tři** varianty a vy můžete přidat **až tři vlastní**. Varianty přicházejí **nevybrané** a žádná není doporučená. Doporučení by bylo nálezem.
- **Dvě rozhodnutí:** volba varianty (`record a decision I made`) a pak přijetí rozpracování (G5b).

### Úkoly

- [ ] **Přidejte vlastní variantu a vyberte** (40 min)
  - *Proč:* Ověříte, že agent pracuje s vaším vstupem a nepřepíše ho, a uvidíte, že rozpracuje jen tu jednu variantu, kterou vyberete.
  1. Až agent navrhne varianty, přidejte jednu svou.
  2. Zkontrolujte, že žádná varianta není „fáze“ jiné. Text typu „nejdřív tohle, pak tamto“ je chyba.
  3. Zapište volbu a po rozpracování schvalte G5b.

## 2P.6 — Fáze 6 a 7: PRD a iniciativa

### Klíčové myšlenky

- Fáze 6 a 7 vede **Business Analyst**. PRD má **osm sekcí**, každý požadavek jmenuje měřítko, kterému slouží, a obsahuje **alignment statement**.
- **Odsouhlasené PRD je samostatný dokument.** Vznikne doslovně z draftu až ve chvíli, kdy ho označíte taskem `SPOCK: mark the PRD agreed`.
- Iniciativa má **13 sekcí** podle šablony Product Management Guildy ČS. **Jira klíč agent nikdy nevymyslí.** Zadáte ho sami přes `SPOCK: record the Jira key`, nebo napíšete `none yet`.

### Úkoly

- [ ] **Odsouhlaste PRD (G6)** (40 min)
  - *Proč:* Na PRD staví delivery. Musíte vědět, s čím souhlasíte.
  1. Nový chat → **Business Analyst**. Projděte draft (`6-prd/1-prd-draft.md`) s engineerem a designerem.
  2. `SPOCK: mark the PRD agreed` → vaše jméno.
  3. `SPOCK: approve what is in front of me`.
- [ ] **Schvalte iniciativu (G7)** (30 min)
  - *Proč:* Iniciativa je dokument, který banka skutečně dostane.
  1. Až se agent zeptá, spusťte `SPOCK: record the Jira key` (`none yet`, když klíč ještě nemáte).
  2. Projděte `7-initiative/initiative.md` a schvalte G7.
  3. Čistou kopii bez hlavičky najdete ve složce `read/` běhu.

## 2P.7 — Po běhu

### Úkoly

- [ ] **Zkontrolujte celý běh** (15 min)
  - *Proč:* Ověříte, že je celý běh v pořádku. Výsledek čtete z výstupu tasku, ne z věty agenta.
  1. `SPOCK: check the whole run`.
  2. Otevřete `runs/<běh>/README.md`. Musí ukazovat 7/7 fází a podpisy.
- [ ] **Exportujte chaty a zapište nálezy** (15 min)
  - *Proč:* Chat je jediný záznam toho, co agent doopravdy řekl. Bez něj se nález nedá ověřit.
  1. Pro každou fázi otevřete její chat → Command Palette → `Chat: Export Chat...` → uložte.
  2. Do deníku zapište, kde se agent choval jinak, než říká `TESTER-GUIDE.md` §4.

## Kvíz

**1. Agent v briefu sám dopsal větu „Metrika X přímo podporuje key result Y“. Je to v pořádku?**

   a) Ano, ušetřil mi práci
   b) Ne. Tuhle vazbu agent nikdy nepíše. Je to největší nehlídaný úsudek celého workflow
   c) Ano, pokud je věta pravdivá

<details><summary>Odpověď</summary>

b) `TESTER-GUIDE.md` §4 (Stage 1): agent tu větu nikdy nepíše. Nic dalšího v běhu nepozná rozdíl mezi vazbou, kterou napsal agent, a skutečnou vazbou.

</details>

**2. Agent ve fázi 5 napíše „Doporučuji variantu B“. Co to je?**

   a) Užitečná rada
   b) Nález. Varianty mají přijít nevybrané a žádná nemá být preferovaná

<details><summary>Odpověď</summary>

b) Doporučením agent udělal rozhodnutí, kvůli kterému tam jste vy (`TESTER-GUIDE.md` §4, Stage 5).

</details>

**3. Ve fázi 4 vám chybí informace o technické složitosti řešení. Kde ji najdete?**

   a) Ve skóre řešení
   b) Nikde. SPOCK složitost nehodnotí, zeptejte se engineera před G4
   c) V Q4

<details><summary>Odpověď</summary>

b) „A three-year build and a three-week build look the same to the workflow.“ Jedinou pojistkou je člověk, který vybírá u G4 (`BUSINESS-LOGIC-OVERVIEW.md` §3).

</details>
