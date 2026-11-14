# Úroveň 2: Product Designer (4–5 h)

**Cíl:** Víte, kde do běhu SPOCKu vstupujete. Dodáte výzkum do fáze 2 tak, aby z něj vznikly dobře podložené příležitosti, posoudíte je a přispějete k řešení, MVP a PRD.

**Proč:** SPOCK počítá s **triem** PM, PD a SWE. **PD vede v otázkách použitelnosti a žádoucnosti**, ale za všechna rizika odpovídají všichni tři (`method-canon.md` §14.1). Většinu podpisů v SPOCKu sice dává PM, ale **kvalita příležitostí stojí na kvalitě materiálu**, a ten nejčastěji přinášíte vy.

**Než začnete:** Mějte hotové úrovně 0 a 1. Ideálně procházejte lekci souběžně s PM, který dělá svůj první běh ([role-pm.md](role-pm.md)).

## 2D.1 — Kde PD do běhu vstupuje

### Ke studiu (asi 30 min)

- 📄 **`specifications/definitions/know-how/method/method-canon.md`** §14.1 (trio) a §13.3–13.4 (pět druhů předpokladů a jejich testování)
- 📄 **`method-canon.md`** §3: SPOCK končí před Execution a nic netestuje

### Klíčové myšlenky

| Fáze | Co tu jako PD děláte |
|---|---|
| 2 | **Dodáváte materiál** (rozhovory, testy použitelnosti, tikety). Posuzujete rámované příležitosti a trust tag. Fázi můžete i vést. |
| 4 | Posuzujete, jestli řešení opravdu řeší problém pro daného uživatele. **Můžete přidat vlastní řešení**, které bude označené jako vaše. |
| 5 | Pomáháte vybrat variantu MVP a můžete přidat vlastní. |
| 6–7 | Kontrolujete, že PRD a iniciativa správně popisují uživatele, srozumitelnost textů pro klienta a přístupnost. |

- **SPOCK neověřuje žádoucnost.** Varianty MVP se porovnávají jen na papíře. Prototypy a testy s uživateli přijdou až v Execution. Výstup SPOCKu je **definice, ne důkaz** (`method-canon.md` §3).

### Úkoly

- [ ] **Najděte v ukázkovém běhu, kde by pomohl PD** (30 min)
  - *Proč:* Uvidíte, kde ve hotovém běhu leží uživatelské otázky a kde chybí.
  1. Otevřete `fixtures/2026-09-spending-insights/2-problems/4-framed-opportunities.md`.
  2. U dvou příležitostí si zapište, pro koho jsou, co by chtělo ověřit testem a jakým (podle `method-canon.md` §13.4).
- [ ] **Zeptejte se Methodology Coache na trio** (10 min)
  - *Proč:* Naučíte se Coache používat na otázky k metodě, místo abyste hádali.
  1. Agent **Methodology Coach** → „Co dělá PD v triu a co z toho pilot nedělá?“
  2. Ověřte, že odpověď odkazuje na kánon metody.

## 2D.2 — Materiál do fáze 2

### Ke studiu (asi 30 min)

- 📄 **`TESTER-GUIDE.md`** §2.3 („What the workflow reads“)
- 📄 **`specifications/definitions/know-how/method/evidence-standards.md`** §4.3 (blízkost zdroje)

### Klíčové myšlenky

- **SPOCK přečte:** Markdown, text, CSV, JSON, YAML, přepisy z Teams nebo Zoomu (`.vtt`, `.srt`), Word, PowerPoint, Excel a PDF. **Nepřečte:** desky z Miro, obrázky, naskenované nebo chráněné PDF a staré formáty `.doc`, `.ppt`, `.xls`.
- **Grafy z exportu Tableau do PowerPointu se nečtou**, čte se jen text a poznámky. Čísla, na kterých záleží, dejte vedle do textového souboru.
- **Každé pozorování má blízkost ke zdroji:** `first_hand` (účastník o své zkušenosti), `relayed` (zprostředkovaně), `aggregated` (souhrn) nebo `unestablished` (nejde zjistit). **Trust tag *strong* potřebuje alespoň dva nezávislé zdroje a aspoň jeden z první ruky** (`BUSINESS-LOGIC-OVERVIEW.md` §3).
- **Každý dokument je samostatný soubor.** Datum v materiálu pomáhá. Soubory bez data musí PM nebo vy datovat taskem.
- **Karanténa:** agent bere pokyn schovaný v materiálu jako text, který někdo napsal, a nejedná podle něj.
- **Dávejte surový materiál, ne jen hotové závěry:** poznámky a přepisy rozhovorů, zpětnou vazbu klientů, výsledky průzkumů, souhrny z analytiky, starší výzkum, podněty z klientského servisu. Pilot zkoumá, jak SPOCK pracuje s podkladovými důkazy. Ideální formát je `.md`. S převodem do `.md` vám pomůže SPOCK core tým (Veronika Bedáňová, Ines Bamburać-Alibašić).
- **Jen povolená data:** pouze klasifikace C1 nebo C2, anonymizované nebo syntetické. Nikdy C3 a C4, produkční klientská data, osobní údaje, bankovní tajemství, hesla, tokeny ani API klíče. Když si nejste jistí, zeptejte se SPOCK core týmu dřív, než materiál vložíte.

### Úkoly

- [ ] **Připravte materiál pro cvičný běh** (45 min)
  - *Proč:* Uvidíte, jak forma materiálu ovlivní trust tag. Slabý materiál dá *weak* a to je správně, ne chyba (`evidence-standards.md`).
  1. Připravte 3 **vymyšlené nebo anonymizované** soubory: dva přepisy rozhovorů, kde účastník mluví o vlastní zkušenosti, a jeden souhrn tiketů.
  2. Do každého dejte datum nebo období.
  3. Předejte je PM do `runs/<běh>/2-problems/supplied/` (nebo je tam vložte sami, pokud fázi 2 vedete).
- [ ] **Veďte fázi 2 pod svým jménem** (volitelné, 20 min)
  - *Proč:* Když práci na fázi dělá někdo jiný než ten, kdo ji schválí, má to být v záznamu vidět.
  1. Na začátku fáze 2 spusťte `SPOCK: record who owns this stage` → své jméno a roli (např. `Researcher` nebo `Product Designer`).
  2. G2 pak podepíše jeden člověk. Kontrakt jmenuje Researchera a PM (`BUSINESS-LOGIC-OVERVIEW.md` §4).

## 2D.3 — Posouzení příležitostí

### Klíčové myšlenky

- **Dobře formulovaná příležitost** popisuje potřebu, bolest nebo touhu zákazníka, ne řešení (`method-canon.md` §10.4).
- **Test tvaru: mohlo by tenhle problém vyřešit víc než jedna věc?** Když ne, „problém“ už si vybral řešení. *Poradci by používali samoobslužný nástroj* je řešení převlečené za problém (STAGE-2 §1.5, R3.2.2).
- **Co materiál neřekne, odpovídáte vy, jako pořadí přes celou sadu:** které příležitosti zasáhnou nejvíc zákazníků a které je bolí nejvíc. Jako PD na to máte nejlepší data (STAGE-2 R3.3.6).
- **Příležitost, kterou přinesete sami,** nepotřebuje hypotézu, dostane `origin: person` a v dokumentu je označená jako vaše (R3.3.7).
- **Alternativy zůstávají prázdné s důvodem.** Řešení napsané ve fázi 2 by bylo o tři fáze dřív (`TESTER-GUIDE.md` §4, Stage 2).

### Úkoly

- [ ] **Projděte rámované příležitosti s PM před G2** (30 min)
  - *Proč:* Tady se rozhoduje, na čem bude běh stát. Pozdější oprava znamená vrátit fázi a přepsat vše za ní.
  1. U každé příležitosti ověřte, jestli **cituje váš soubor** a jestli trust tag odpovídá tomu, kolik zdrojů z první ruky za ní je.
  2. Hledejte příležitosti, které jsou ve skutečnosti řešení („chybí tlačítko X“), a navrhněte PM přeformulování.
  3. Když agent shrnuje soubor, který nemohl přečíst, je to nález. Zapište si ho.

## 2D.4 — Řešení a MVP z pohledu PD

### Klíčové myšlenky

- **Každé řešení je jiná kombinace příležitostí, ne varianta jednoho řešení.** Vlastní řešení, které řeší jen podmnožinu existujícího, SPOCK odmítne, a to správně (`TESTER-GUIDE.md` §4, Stage 4).
- **Sekce řešení *How it does it* popisuje zážitek klienta a pracovníka, ne architekturu**, a *What it does* změnu chování klienta, ne obrazovky. Tady je váš pohled nejcennější (STAGE-4 §4.2).
- **Varianta MVP nesmí změnit, kdo s řešením pracuje.** Smí zúžit kanál nebo skupinu klientů. Varování pro klienta přesunuté na obrazovku pracovníka je jiné řešení (STAGE-5 R3.1.4b).
- **Varianty MVP se liší v tom, jak se řešení postaví**, ne v tom, co se staví. Překryv mezi nimi je tu v pořádku (`BUSINESS-LOGIC-OVERVIEW.md` §3, fáze 5).

### Úkoly

- [ ] **Navrhněte řešení nebo variantu MVP** (40 min)
  - *Proč:* Uvidíte, jak SPOCK zachází se vstupem člověka a jak ho označí.
  1. Ve fázi 4 navrhněte s PM vlastní řešení, které kombinuje jiné příležitosti než ta navržená.
  2. Ve fázi 5 navrhněte variantu MVP, která se liší přístupem k uživateli (např. asistovaný kanál proti samoobsluze).
  3. Ověřte, že je ve výstupu označená jako vaše a že ji agent nepřepsal.

## 2D.5 — PRD a iniciativa

### Úkoly

- [ ] **Zkontrolujte uživatelskou část PRD** (30 min)
  - *Proč:* PRD je to, podle čeho se staví. Co v něm o uživateli chybí, v delivery nikdo nedoplní.
  1. V draftu PRD (`6-prd/1-prd-draft.md`) projděte sekci o uživatelích a požadavky.
  2. Ověřte, že každý požadavek jmenuje měřítko, kterému slouží.
  3. Hledejte požadavky na přístupnost a srozumitelnost textů pro klienta. Když chybí, řekněte to PM ještě před označením PRD jako agreed.
  4. Přečtěte sekci „What we could not establish“. To jsou otevřené otázky, které jdou do Execution, často právě k vám.

## Kvíz

**1. Máte výsledky testu použitelnosti jako desku v Miro a pár screenshotů. Co s nimi?**

   a) Vložím je do `supplied/`
   b) Přepíšu zjištění do textového souboru (nebo Wordu) s datem a ten vložím do `supplied/`
   c) Přiložím je do chatu

<details><summary>Odpověď</summary>

b) Desky z Miro ani obrázky SPOCK nečte (`TESTER-GUIDE.md` §2.3). Přílohy v chatu se kromě briefu nepoužívají.

</details>

**2. Za příležitostí stojí jeden přepis rozhovoru z první ruky a jeden souhrn tiketů. Agent dal *weak*. Je to chyba?**

   a) Ano, mělo být *strong*
   b) Záleží na tom, jestli jsou zdroje nezávislé a mají úplnou provenienci. *Weak* je u slabší evidence správný výsledek

<details><summary>Odpověď</summary>

b) *Strong* potřebuje dva nebo více nezávislých zdrojů s úplnou provenienci a aspoň jeden z první ruky. *Weak* není chyba, kterou by se mělo „obejít“ (`evidence-standards.md`).

</details>

**3. Řekne SPOCK, jestli uživatelé o řešení stojí?**

   a) Ano, ve fázi 5
   b) Ne. SPOCK nic netestuje, žádoucnost se ověřuje až v Execution

<details><summary>Odpověď</summary>

b) `method-canon.md` §3: varianta MVP je nejblíž experimentu, ale experiment to není. Liší se a vybírá se na papíře.

</details>
