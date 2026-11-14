# Úroveň 2: Product Designer (4–5 h)

**Cíl:** Víte, kde do běhu SPOCKu vstupujete. Dodáte výzkum do fáze 2 tak, aby z něj vznikly dobře podložené příležitosti, posoudíte je a přispějete k řešení, MVP a PRD.

**Proč:** SPOCK počítá s **triem** PM, PD a SWE. **PD vede v otázkách použitelnosti a žádoucnosti**, ale za všechna rizika odpovídají všichni tři (`method-canon.md` §14.1). Většinu podpisů v SPOCKu sice dává PM, ale **kvalita příležitostí stojí na kvalitě materiálu**, a ten nejčastěji přinášíte vy.

**Než začnete:** Mějte hotové úrovně 0 a 1. Ideálně procházejte lekci souběžně s PM, který dělá svůj první běh ([role-pm.md](role-pm.md)).

## 2D.1 — Kde PD do běhu vstupuje

### Karty (asi 5 min, jen na webu)

#### Kde PD do běhu vstupuje

| Fáze | Co tu jako PD děláte |
|---|---|
| 2 | **Dodáváte materiál** (rozhovory, testy použitelnosti, tikety). Posuzujete rámované příležitosti a trust tag. Fázi můžete i vést. |
| 4 | Posuzujete, jestli řešení opravdu řeší problém pro daného uživatele. **Můžete přidat vlastní řešení**, které bude označené jako vaše. |
| 5 | Pomáháte vybrat variantu MVP a můžete přidat vlastní. |
| 6–7 | Kontrolujete, že PRD a iniciativa správně popisují uživatele, srozumitelnost textů pro klienta a přístupnost. |

**Otázka:** Ve které fázi máte jako PD největší vliv na kvalitu příležitostí?
- [x] Ve fázi 2, kde dodáváte materiál
- [ ] Ve fázi 7, kde vzniká iniciativa
- [ ] Ve fázi 3, kde se zkoumá trh

**Proč:** Kvalita příležitostí stojí na kvalitě materiálu, a ten nejčastěji přinášíte vy.

#### SPOCK žádoucnost neověřuje

**SPOCK neověřuje žádoucnost.** Varianty MVP se porovnávají jen na papíře. Prototypy a testy s uživateli přijdou až v Execution. Výstup SPOCKu je **definice, ne důkaz** (`method-canon.md` §3).

**Otázka:** Co výstup SPOCKu je?
- [ ] Důkaz, že klienti řešení chtějí
- [x] Definice toho, co postavit, ne důkaz
- [ ] Otestovaný prototyp

**Proč:** Prototypy a testy s uživateli přijdou až v Execution.

### Úkoly

- [ ] **Najděte v ukázkovém běhu, kde by pomohl PD** (30 min, ve VS Code)
  - *Proč:* Uvidíte, kde ve hotovém běhu leží uživatelské otázky a kde chybí.
  1. Otevřete `fixtures/2026-09-spending-insights/2-problems/4-framed-opportunities.md`.
  2. U dvou příležitostí si zapište, pro koho jsou, co by chtělo ověřit testem a jakým (podle `method-canon.md` §13.4).
- [ ] **Zeptejte se Methodology Coache na trio** (10 min, ve VS Code)
  - *Proč:* Naučíte se Coache používat na otázky k metodě, místo abyste hádali.
  1. Agent **Methodology Coach** → „Co dělá PD v triu a co z toho pilot nedělá?“
  2. Ověřte, že odpověď odkazuje na kánon metody.

### Pro zvídavé (anglicky, ve vaší kopii SPOCKu)

- 📄 **`specifications/definitions/know-how/method/method-canon.md`** §14.1 (trio) a §13.3–13.4 (pět druhů předpokladů a jejich testování)
- 📄 **`method-canon.md`** §3: SPOCK končí před Execution a nic netestuje

## 2D.2 — Materiál do fáze 2

### Karty (asi 8 min, jen na webu)

#### Co SPOCK přečte a co ne

**SPOCK přečte:** Markdown, text, CSV, JSON, YAML, přepisy z Teams nebo Zoomu (`.vtt`, `.srt`), Word, PowerPoint, Excel a PDF. **Nepřečte:** desky z Miro, obrázky, naskenované nebo chráněné PDF a staré formáty `.doc`, `.ppt`, `.xls`.

**Víc do hloubky:**
- **Grafy z exportu Tableau do PowerPointu se nečtou**, čte se jen text a poznámky. Čísla, na kterých záleží, dejte vedle do textového souboru.

**Otázka:** Máte výsledky ve formě desky v Miru. Co uděláte?
- [ ] Vložím odkaz na desku
- [x] Přepíšu podstatné do textového souboru, desku SPOCK nepřečte
- [ ] Udělám screenshot

**Proč:** Desky z Mira ani obrázky SPOCK nečte.

#### Blízkost ke zdroji

**Každé pozorování má blízkost ke zdroji:** `first_hand` (účastník o své zkušenosti), `relayed` (zprostředkovaně), `aggregated` (souhrn) nebo `unestablished` (nejde zjistit). **Trust tag *strong* potřebuje alespoň dva nezávislé zdroje a aspoň jeden z první ruky** (`BUSINESS-LOGIC-OVERVIEW.md` §3).

**Otázka:** Kolega vám převyprávěl, co mu řekl klient. Jaká je blízkost ke zdroji?
- [ ] `first_hand`
- [x] `relayed`
- [ ] `aggregated`

**Proč:** Z první ruky je jen to, co účastník řekl o své vlastní zkušenosti.

#### Surový materiál, jeden dokument na soubor

**Dávejte surový materiál, ne jen hotové závěry:** poznámky a přepisy rozhovorů, zpětnou vazbu klientů, výsledky průzkumů, souhrny z analytiky, starší výzkum, podněty z klientského servisu. Pilot zkoumá, jak SPOCK pracuje s podkladovými důkazy. Ideální formát je `.md`. S převodem do `.md` vám pomůže SPOCK core tým (Veronika Bedáňová, Ines Bamburać-Alibašić).

**Víc do hloubky:**
- **Každý dokument je samostatný soubor.** Datum v materiálu pomáhá. Soubory bez data musí PM nebo vy datovat taskem.
- **Karanténa:** agent bere pokyn schovaný v materiálu jako text, který někdo napsal, a nejedná podle něj.

**Otázka:** Co do fáze 2 dáte radši?
- [x] Přepisy rozhovorů a poznámky
- [ ] Jen slide s hotovými závěry

**Proč:** Pilot zkoumá, jak SPOCK pracuje s podkladovými důkazy. Z hotových závěrů je nepozná.

#### Jen povolená data

**Jen povolená data:** pouze klasifikace C1, anonymizovaná nebo syntetická. Nikdy C2, C3 ani C4, produkční klientská data, osobní údaje, bankovní tajemství, hesla, tokeny ani API klíče. Když si nejste jistí, zeptejte se SPOCK core týmu dřív, než materiál vložíte.

**Otázka:** Máte přepis rozhovoru se jménem a číslem účtu klienta. Smíte ho vložit?
- [ ] Ano, je to cvičný běh
- [x] Ne, nejdřív ho anonymizujte, osobní údaje do SPOCKu nepatří

**Proč:** Do SPOCKu smí jen data s klasifikací C1, anonymizovaná nebo syntetická.

### Úkoly

- [ ] **Připravte materiál pro cvičný běh** (45 min, ve VS Code)
  - *Proč:* Uvidíte, jak forma materiálu ovlivní trust tag. Slabý materiál dá *weak* a to je správně, ne chyba (`evidence-standards.md`).
  1. Připravte 3 **vymyšlené nebo anonymizované** soubory: dva přepisy rozhovorů, kde účastník mluví o vlastní zkušenosti, a jeden souhrn tiketů.
  2. Do každého dejte datum nebo období.
  3. Předejte je PM do `runs/<běh>/2-problems/supplied/` (nebo je tam vložte sami, pokud fázi 2 vedete).
- [ ] **Veďte fázi 2 pod svým jménem** (volitelné, ve VS Code, 20 min)
  - *Proč:* Když práci na fázi dělá někdo jiný než ten, kdo ji schválí, má to být v záznamu vidět.
  1. Na začátku fáze 2 spusťte `SPOCK: record who owns this stage` → své jméno a roli (např. `Researcher` nebo `Product Designer`).
  2. G2 pak podepíše jeden člověk. Kontrakt jmenuje Researchera a PM (`BUSINESS-LOGIC-OVERVIEW.md` §4).

### Pro zvídavé (anglicky, ve vaší kopii SPOCKu)

- 📄 **`TESTER-GUIDE.md`** §2.3 („What the workflow reads“)
- 📄 **`specifications/definitions/know-how/method/evidence-standards.md`** §4.3 (blízkost zdroje)

## 2D.3 — Posouzení příležitostí

### Karty (asi 5 min, jen na webu)

#### Příležitost popisuje potřebu, ne řešení

**Dobře formulovaná příležitost** popisuje potřebu, bolest nebo touhu zákazníka, ne řešení (`method-canon.md` §10.4).

**Otázka:** Je „Poradci by používali samoobslužný nástroj“ dobře formulovaná příležitost?
- [ ] Ano
- [x] Ne, je to řešení převlečené za problém

**Proč:** Test tvaru: mohlo by problém vyřešit víc než jedna věc? Tady už je řešení vybrané.

#### Pořadí, které materiál neřekne

**Co materiál neřekne, odpovídáte vy, jako pořadí přes celou sadu:** které příležitosti zasáhnou nejvíc zákazníků a které je bolí nejvíc. Jako PD na to máte nejlepší data (STAGE-2 R3.3.6).

**Víc do hloubky:**
- **Příležitost, kterou přinesete sami,** nepotřebuje hypotézu, dostane `origin: person` a v dokumentu je označená jako vaše (R3.3.7).
- **Alternativy zůstávají prázdné s důvodem.** Řešení napsané ve fázi 2 by bylo o tři fáze dřív (`TESTER-GUIDE.md` §4, Stage 2).

**Otázka:** Kdo určí, které příležitosti bolí klienty nejvíc, když to materiál neřekne?
- [ ] Agent odhadem
- [x] Člověk, typicky PD nebo PM, jako pořadí přes celou sadu

**Proč:** Co materiál neřekne, agent nedoplňuje. Ptá se vás.

### Úkoly

- [ ] **Projděte rámované příležitosti s PM před G2** (30 min, ve VS Code)
  - *Proč:* Tady se rozhoduje, na čem bude běh stát. Pozdější oprava znamená vrátit fázi a přepsat vše za ní.
  1. U každé příležitosti ověřte, jestli **cituje váš soubor** a jestli trust tag odpovídá tomu, kolik zdrojů z první ruky za ní je.
  2. Hledejte příležitosti, které jsou ve skutečnosti řešení („chybí tlačítko X“), a navrhněte PM přeformulování.
  3. Když agent shrnuje soubor, který nemohl přečíst, je to nález. Zapište si ho.

## 2D.4 — Řešení a MVP z pohledu PD

### Karty (asi 6 min, jen na webu)

#### Řešení jsou různé kombinace příležitostí

**Každé řešení je jiná kombinace příležitostí, ne varianta jednoho řešení.** Vlastní řešení, které řeší jen podmnožinu existujícího, SPOCK odmítne, a to správně (`TESTER-GUIDE.md` §4, Stage 4).

**Otázka:** Přidáte řešení, které řeší jen část příležitostí existujícího řešení. Co SPOCK udělá?
- [ ] Přijme ho jako variantu
- [x] Odmítne ho, a to správně

**Proč:** Každé řešení má být jiná kombinace příležitostí, ne podmnožina jiného.

#### Zážitek, ne architektura

**Sekce řešení *How it does it* popisuje zážitek klienta a pracovníka, ne architekturu**, a *What it does* změnu chování klienta, ne obrazovky. Tady je váš pohled nejcennější (STAGE-4 §4.2).

**Otázka:** Co patří do sekce *How it does it*?
- [x] Zážitek klienta a pracovníka
- [ ] Architektura systému
- [ ] Seznam obrazovek

**Proč:** Tady je pohled PD nejcennější. Architektura do řešení nepatří.

#### Varianta MVP nemění, kdo s řešením pracuje

**Varianta MVP nesmí změnit, kdo s řešením pracuje.** Smí zúžit kanál nebo skupinu klientů. Varování pro klienta přesunuté na obrazovku pracovníka je jiné řešení (STAGE-5 R3.1.4b).

**Víc do hloubky:**
- **Varianty MVP se liší v tom, jak se řešení postaví**, ne v tom, co se staví. Překryv mezi nimi je tu v pořádku (`BUSINESS-LOGIC-OVERVIEW.md` §3, fáze 5).

**Otázka:** Varianta MVP přesune varování z aplikace klienta na obrazovku pracovníka. Je to varianta?
- [ ] Ano, jen užší kanál
- [x] Ne, je to jiné řešení

**Proč:** Varianta smí zúžit kanál nebo skupinu klientů, ale ne změnit, kdo s řešením pracuje.

### Úkoly

- [ ] **Navrhněte řešení nebo variantu MVP** (40 min, ve VS Code)
  - *Proč:* Uvidíte, jak SPOCK zachází se vstupem člověka a jak ho označí.
  1. Ve fázi 4 navrhněte s PM vlastní řešení, které kombinuje jiné příležitosti než ta navržená.
  2. Ve fázi 5 navrhněte variantu MVP, která se liší přístupem k uživateli (např. asistovaný kanál proti samoobsluze).
  3. Ověřte, že je ve výstupu označená jako vaše a že ji agent nepřepsal.

## 2D.5 — PRD a iniciativa

### Úkoly

- [ ] **Zkontrolujte uživatelskou část PRD** (30 min, ve VS Code)
  - *Proč:* PRD je to, podle čeho se staví. Co v něm o uživateli chybí, v delivery nikdo nedoplní.
  1. V draftu PRD (`6-prd/1-prd-draft.md`) projděte sekci o uživatelích a požadavky.
  2. Ověřte, že každý požadavek jmenuje měřítko, kterému slouží.
  3. Hledejte požadavky na přístupnost a srozumitelnost textů pro klienta. Když chybí, řekněte to PM ještě před označením PRD jako agreed.
  4. Přečtěte sekci „What we could not establish“. To jsou otevřené otázky, které jdou do Execution, často právě k vám.

## Kvíz

Kvíz losuje 5 otázek z této zásoby. Pořadí otázek i možností se při každém spuštění zamíchá.

**1. Máte výsledky testu použitelnosti jako desku v Miro a pár screenshotů. Co s nimi?**

   a) Přiložím je, SPOCK je přečte
   b) Podstatné přepíšu do textového souboru. Desky ani obrázky SPOCK nečte
   c) Pošlu je agentovi do chatu

<details><summary>Odpověď</summary>

b) SPOCK přečte text, tabulky a dokumenty, ale ne desky z Mira ani obrázky.

</details>

**2. Za příležitostí stojí jeden přepis rozhovoru z první ruky a jeden souhrn tiketů. Agent dal *weak*. Je to chyba?**

   a) Ano, má být strong
   b) Záleží na provenienci. Jsou-li oba zdroje nezávislé a úplně doložené, mělo by to být strong
   c) Ne, tikety se nepočítají

<details><summary>Odpověď</summary>

b) Strong chce dva nezávislé původy s úplnou proveniencí a aspoň jeden z první ruky. Kontrola tag přepočítá.

</details>

**3. Řekne SPOCK, jestli uživatelé o řešení stojí?**

   a) Ano, ve fázi 5
   b) Ne. Výstup je definice, ne důkaz. Žádoucnost se ověří až v Execution
   c) Ano, trust tag to měří

<details><summary>Odpověď</summary>

b) SPOCK nic netestuje (`method-canon.md` §3).

</details>

**4. Export z Tableau do PowerPointu obsahuje graf konverze, na kterém závisí příležitost. Co uděláte?**

   a) Nic, PowerPoint SPOCK přečte
   b) Čísla z grafu přepíšu do textového souboru vedle prezentace
   c) Udělám z grafu obrázek

<details><summary>Odpověď</summary>

b) Z PowerPointu se čte jen text a poznámky. Grafy ne.

</details>

**5. PM navrhuje příležitost „Chceme chatbota v aplikaci“. Co namítnete?**

   a) Nic, je to jasná potřeba
   b) Je to řešení, ne potřeba. Přeformulujte ji na potřebu, kterou by šlo vyřešit víc způsoby
   c) Je moc široká

<details><summary>Odpověď</summary>

b) Test tvaru: mohlo by problém vyřešit víc než jedna věc?

</details>

**6. V rozhovoru klient zmínil své rodné číslo. Chcete přepis dát do fáze 2. Co uděláte?**

   a) Vložím přepis, je to cvičný běh
   b) Osobní údaje odstraním a do SPOCKu dám jen anonymizovanou verzi
   c) Vložím ho, ale soubor pojmenuji „citlivé“

<details><summary>Odpověď</summary>

b) Do SPOCKu jdou jen data C1, anonymizovaná nebo syntetická. Osobní údaje nikdy.

</details>

**7. Ve fázi 5 chcete přidat vlastní variantu MVP. Kolik jich smíte přidat?**

   a) Žádnou
   b) Až tři
   c) Neomezeně

<details><summary>Odpověď</summary>

b) Agent navrhne tři, vy přidáte až tři vlastní. Hotová sada má 2–6 variant.

</details>

**8. V sekci *What it does* řešení stojí „nová obrazovka se třemi záložkami“. Co je špatně?**

   a) Nic
   b) Sekce má popisovat změnu chování klienta, ne obrazovky
   c) Chybí architektura

<details><summary>Odpověď</summary>

b) *What it does* je změna chování, *How it does it* zážitek klienta a pracovníka.

</details>
