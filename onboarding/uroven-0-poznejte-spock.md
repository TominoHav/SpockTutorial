# Úroveň 0: Poznejte SPOCK (všichni, asi 1,5 h, jen na webu)

**Cíl:** Víte, proč SPOCK vzniká, co dělá a co ne, znáte 7 fází, agenty a brány, pět pravidel, která se neporušují, a víte, jak se SPOCKem pracovat. Nic přitom neinstalujete.

**Proč:** Než začnete instalovat, potřebujete vědět, co vás čeká a proč. Tuhle úroveň projdete na webu, klidně zatímco čekáte na schválení rolí v REDIMu.

## 0.1 — Co SPOCK dělá a proč

### Karty (asi 15 min, jen na webu)

#### Proč SPOCK vzniká

Týmy dnes dělají discovery každý jinak. Opakovaně skládají stejný kontext, zavazují se k řešení dřív, než ověří předpoklady, a riziko, compliance a bezpečnost přizvou až těsně před vydáním. Kvalita pak závisí na tom, kdo discovery zrovna vede.

SPOCK má discovery **zrychlit, sjednotit, opřít o důkazy a udělat dohledatelnou**.

**Otázka:** Který problém SPOCK řeší?
- [ ] Nedostatek vývojářů v týmech
- [x] Discovery, které každý tým dělá jinak, bez opory v důkazech a bez dohledatelných rozhodnutí
- [ ] Pomalé nasazování do produkce

**Proč:** SPOCK pokrývá discovery, tedy práci před vývojem. Vývoj a nasazování neřeší.

#### Agenti připravují, lidé rozhodují

Ve SPOCKu pracují AI agenti. Připraví brief, rozeberou materiál, zmapují trh, navrhnou řešení i PRD. **Každé schválení, výběr a podpis ale dělá jmenovitě člověk se svou rolí.** Žádný agent nic neschvaluje ani nehodnotí sám sebe.

SPOCK podporuje produktové myšlení, nenahrazuje ho.

**Otázka:** Kdo vybere řešení, které tým bude dál rozpracovávat?
- [ ] Agent, který řešení navrhl
- [x] Člověk, svým jménem a rolí
- [ ] Ten, kdo má nejvyšší skóre

**Proč:** Agenti řešení navrhnou, ale neseřadí ani nedoporučí. Vybírá člověk.

#### Sedm fází od briefu k iniciativě

| Fáze | Co vznikne | Kdo rozhoduje |
|---|---|---|
| 1 | Brief | Vy přijmete brief (G1) |
| 2 | Problémy a příležitosti | Vy je potvrdíte a seřadíte (G2) |
| 3 | Trh: konkurence a trendy | Nikdo, přijme ji automatická kontrola |
| 4 | Řešení a výběr jednoho | Vy vyberete jedno (G4) |
| 5 | MVP | Vy zvolíte variantu a přijmete rozpracování (G5b) |
| 6 | PRD | Vy odsouhlasíte (G6) |
| 7 | Iniciativa pro delivery | Vy schválíte (G7) |

**Otázka:** Ve které fázi nerozhoduje člověk?
- [ ] Ve fázi 1
- [x] Ve fázi 3
- [ ] Ve fázi 7

**Proč:** Fáze 3 vyrábí jen podklady o trhu. S jejími výsledky se člověk setká až při výběru řešení ve fázi 4.

#### Metoda: Opportunity Solution Tree

SPOCK nese metodu, kterou používá Česká spořitelna: **výsledek (outcome) → problémy → příležitosti → řešení**. Brief se zaváže k výsledku, problémy se hledají v materiálu, který tým má, a teprve pak přicházejí řešení.

Každá fáze čte jen to, co vzniklo před ní. Proto se dá i za dva roky dohledat, na čem rozhodnutí stojí.

**Otázka:** Proč se nemá skočit rovnou k řešení?
- [ ] Protože to SPOCK technicky neumožní
- [x] Protože řešení má sloužit ověřené příležitosti, ne prvnímu nápadu
- [ ] Protože řešení vymýšlí jen agent

**Proč:** Řešení navázané na příležitost s důkazy má větší šanci, že řeší skutečný problém klientů.

#### Co SPOCK nedělá

SPOCK **netestuje**: nedělá experimenty, prototypy ani validaci s klienty. Končí definicí iniciativy pro delivery. Sám **nevytváří nic v Jiře** a neodhaduje pracnost, cenu ani termíny. O tom, jestli je řešení v souladu s předpisy, rozhodují týmy compliance, SPOCK jen vypíše, čeho se řešení dotýká.

**Otázka:** Co od SPOCKu na konci běhu dostanete?
- [ ] Hotový prototyp ověřený s klienty
- [x] Iniciativu připravenou pro delivery, kterou do Jiry přenesete vy
- [ ] Založenou iniciativu v Jiře i s odhadem pracnosti

**Proč:** Jira klíč zapisuje člověk až po přenesení iniciativy. Odhady pracnosti SPOCK nedělá.

#### Pilot a kdo SPOCK vlastní

SPOCK je **interní nástroj České spořitelny v pilotu**. Vlastní a rozvíjí ho **CoE Product Management a CoE Product Design**, za kvalitu výstupů odpovídají hlavně jejich Guild Masteři. Pilot pokrývá přední část discovery, od briefu po první přírůstek (MVP) a iniciativu.

**Víc do hloubky:** V plné verzi (plán 2027) přibude výzkum s klienty, prototypy, roadmapa více přírůstků, funkční a nefunkční specifikace a napojení na delivery. Cílem je jedna řízená platforma se sdíleným know-how napříč týmy.

**Otázka:** Na koho se obrátíte s otázkou k přístupu do pilotu?
- [x] Na SPOCK core tým (Veronika Bedáňová, Ines Bamburać-Alibašić)
- [ ] Na agenta Product Manager
- [ ] Na IT podporu

**Proč:** O přístupu k pilotu rozhoduje core tým. IT řeší instalaci a běžné technické potíže.

### Úkoly

- [ ] **Pusťte si video o SPOCKu** (3 min, jen na webu)
  - *Proč:* Za dvě minuty uvidíte celý příběh SPOCKu v obrazech.
  1. Na úvodní stránce v části „O SPOCKu“ spusťte video.
- [ ] **Vyzkoušejte SPOCK nanečisto** (5 min, jen na webu)
  - *Proč:* Zažijete celý běh od briefu po iniciativu dřív, než cokoli instalujete.
  1. Na úvodní stránce nebo v Opoře spusťte „SPOCK nanečisto“ a projděte všech 7 fází.

### Pro zvídavé (anglicky, ve vaší kopii SPOCKu)

- 📄 **`specifications/BUSINESS-LOGIC-OVERVIEW.md`** sekce 0–3: co je postavené a jak fáze navazují
- 📄 **`materialy/bootcamp/product-overview-about-spock.pdf`** v repozitáři tutoriálu: produktový přehled SPOCKu

## 0.2 — Agenti, tasky a brány

### Karty (asi 15 min, jen na webu)

#### Šest agentů, každý má svou práci

Se SPOCKem mluvíte přes agenty v Copilot Chatu. **Čtyři vedou fáze:** Product Manager (fáze 1, 4 a 5), Opportunity Designer (2), Competitive Analysis (3) a Business Analyst (6 a 7). **Dva pomáhají a nic nepíší:** Workflow Support řekne, kde běh stojí a co dál, Methodology Coach odpovídá na otázky k metodě.

**Otázka:** Nevíte, který krok běh posune dál. Koho se zeptáte?
- [ ] Methodology Coache
- [x] Workflow Support
- [ ] Product Managera

**Proč:** Workflow Support přečte záznam běhu a řekne jeden task, který běh posune. Methodology Coach vysvětluje metodu, ne stav běhu.

#### Co je task

**Task je předem připravený příkaz SPOCKu.** Zapisuje, podepisuje, kontroluje. Všechny začínají `SPOCK:`. Spouštíte je ve VS Code přes nabídku Tasks: Run Task.

Některé tasky otevřou nahoře v okně **políčka** na vaše jméno, roli nebo důvod. **Task s políčky spouštíte jen vy.** Task bez políček smí spustit i agent.

**Otázka:** Agent napíše: „Teď spustím task, který schválí brief, a vyplním vaše jméno.“ Co uděláte?
- [ ] Nechám ho, ušetří mi to práci
- [x] Odmítnu to. Task s políčky na jméno spouštím já
- [ ] Nechám ho a jméno pak opravím

**Proč:** Políčka jsou záznam, že rozhodl člověk. Agent je vyplnit nesmí.

#### Dva druhy bran: Q a G

Každá fáze končí branou. **Q brána** je automatická kontrola kódem a spouští ji někdo jiný než agent, který dokument napsal. **G brána** je vaše rozhodnutí, zapsané s vaším jménem, rolí a datem. Fáze 3 G bránu nemá.

**Víc do hloubky:** G brány jsou G1, G2, G4, G5b, G6 a G7. Ve fázi 5 navíc vybíráte variantu MVP ještě před G5b. Q brány jsou Q1 až Q7 a hlídají formu a stopu ke zdroji, ne kvalitu myšlenek. Tu posuzujete vy.

**Otázka:** Agent v chatu napíše „Brána prošla, schválil jsem brief.“ Platí to?
- [ ] Ano, agent bránu schválil
- [x] Ne. Schválení (G) dává jen člověk a o kontrole (Q) svědčí výstup tasku, ne věta agenta

**Proč:** Agent nikdy neschvaluje a nehodnotí sám sebe. Kdyby tvrdil opak, je to nález, který hlásíte.

#### Rytmus každé fáze

Každá fáze běží stejně: agent **ověří vstupy** → **pracuje a ptá se** → **zapíše** dokument → **spustí kontrolu** a sám opraví, co našla → **teprve pak vás požádá o schválení** → vy schválíte taskem → agent řekne, co přijde dál a kdo to povede.

**Otázka:** Agent vás žádá o schválení, ale kontrolu ještě nespustil. Co to je?
- [ ] Normální zkratka
- [x] Chyba v rytmu fáze, kterou si zapíšete a nahlásíte

**Proč:** O schválení se žádá až po kontrole. Když agent krok přeskočí, porušuje rytmus fáze.

#### Žádná fáze nezačne sama

Po schválení se běh sám nepohne. **Další fázi spustíte tak, že otevřete nový chat a vyberete jejího agenta.** Nový chat začíná s know-how nové fáze a nenese nic z předchozí konverzace, takže posouzení další fáze je nezávislé.

**Otázka:** Schválili jste fázi 2. Jak začne fáze 3?
- [ ] Sama, hned po schválení
- [ ] Napíšete stejnému agentovi „pokračuj“
- [x] Otevřete nový chat a vyberete agenta Competitive Analysis

**Proč:** Každá fáze má svého agenta a začíná v novém chatu.

#### Kdo co hlídá

**Agent píše, kód kontroluje, člověk podepisuje.** Navíc za běhu hlídají **hlídače**: zastaví špatný krok agenta dřív, než se stane, a agent vám řekne proč.

**Víc do hloubky:** Co od hlídačů uvidíte: agent nesmí zapsat nic mimo svou fázi, do už schválené fáze ani do vašeho materiálu. Nespustí task s políčky pro vaše jméno. Po třetím stejném tasku bez změny se zastaví (pojistka proti zacyklení). Nečte kód kontrol, aby psal podle metodiky a ne „na test“. Hláška „A hook prevented chat from continuing“ není chyba.

**Otázka:** Agent napíše, že jeho zápis do schváleného briefu byl odmítnut. Co se stalo?
- [x] Hlídač zastavil krok, který agent nesmí udělat. Schválenou fázi změníte jen tak, že ji sami vrátíte
- [ ] SPOCK je rozbitý a je potřeba volat podporu

**Proč:** Schválená fáze se mění jen vrácením, které spouští člověk (`SPOCK: send a stage back to be redone`).

### Úkoly

- [ ] **Nakreslete si rytmus jedné fáze** (10 min, stačí papír)
  - *Proč:* Když víte, jaký krok má přijít, okamžitě poznáte, když agent nějaký přeskočí.
  1. Napište 7 kroků rytmu z karty výše vlastními slovy.
  2. U každého poznamenejte, kdo ho dělá: agent, task, nebo vy.

### Pro zvídavé (anglicky, ve vaší kopii SPOCKu)

- 📄 **`specifications/onboarding/TESTER-GUIDE.md`** §3.1 a §3.2: rytmus fáze podrobně
- 📄 **`BUSINESS-LOGIC-OVERVIEW.md`** §4 (kdo rozhoduje) a §8 (slovník)

## 0.3 — Pět pravidel, která se neporušují

### Karty (asi 10 min, jen na webu)

#### 1. Rozhodnutí podepisujete vy

Task, který otevírá políčka na jméno, roli, důvod nebo rozhodnutí, spouštíte **jen vy, sami a svým jménem**. Když se o to pokusí agent, odmítněte to.

**Otázka:** Proč nestačí, aby rozhodnutí do políčka vyplnil agent podle toho, co jste mu napsali v chatu?
- [ ] Stačí, je to rychlejší
- [x] Záznam musí dokazovat, že rozhodl člověk, ne že to stálo v nějakém textu

**Proč:** Políčka vyplněná člověkem jsou jediný důkaz, kdo za rozhodnutím stojí.

#### 2. Do chatu nepřikládejte soubory

Materiál patří do složky `supplied/` dané fáze, ne do chatu. **Jedinou výjimkou je brief ve fázi 1.** Příloha se posílá s každou další zprávou, prodražuje ji a PDF může rozbít konverzaci.

**Otázka:** Máte k fázi 2 dvacetistránkové PDF s výzkumem. Kam s ním?
- [ ] Přiložím ho do chatu
- [ ] Vložím jeho text do chatu
- [x] Uložím ho do složky `2-problems/supplied/` běhu tak, jak je

**Proč:** SPOCK si PDF ze složky sám převede na text a zapíše, odkud co pochází.

#### 3. Jen povolená data a běhy zůstávají u vás

Do Copilota a do SPOCKu vkládejte **pouze obsah klasifikace C1**, anonymizovaný nebo syntetický. Nikdy C2, C3 ani C4, produkční klientská data, osobní údaje, bankovní tajemství, hesla, tokeny ani API klíče. Složka s běhy zůstává ve vašem počítači a nikam se nekopíruje.

**Otázka:** Máte přepis rozhovoru s klientem i s jeho jménem a číslem účtu. Co s ním?
- [ ] Vložím ho, SPOCK je interní nástroj
- [x] Nejdřív ho anonymizuji, nebo se zeptám SPOCK core týmu, jestli ho smím použít
- [ ] Vložím ho do chatu místo do složky

**Proč:** Osobní údaje a klientská data do SPOCKu nepatří. Když si nejste jistí, zeptejte se core týmu.

#### 4. Nic pod .github ani .vscode neupravujte

Složky `.github` a `.vscode` ve vaší kopii SPOCKu jsou **samotné workflow**: agenti, pravidla, kontroly a tasky. Úprava by změnila chování každého agenta a kontrola C189 by ji odhalila. Workflow se mění jen novým vydáním.

**Otázka:** Agent vám radí upravit soubor v `.github`, aby kontrola prošla. Co uděláte?
- [ ] Upravím ho, agent to ví nejlépe
- [x] Neupravím. Je to nález, který nahlásím

**Proč:** Workflow mění jen jeho vlastníci a nové vydání, nikdy uživatel v pracovní kopii.

#### 5. Schvalování ve VS Code nechte zapnuté

VS Code se vás ptá, než agent něco spustí nebo otevře. **Nevolte „Allow All“.** Tasky `SPOCK:` bez políček agent spustit smí, cokoli mimo složku SPOCKu odmítněte.

**Otázka:** Proč nezapínat „Allow All“?
- [ ] Zpomaluje VS Code
- [x] Neuvidíte, co agent spouští a otevírá
- [ ] Vypne agenty

**Proč:** Výchozí schvalování je vaše kontrola nad tím, co agent dělá ve vašem počítači.

## 0.4 — Jak se SPOCKem pracovat

### Karty (asi 15 min, jen na webu)

#### SPOCK není stroj na odpovědi

SPOCK je workflow, kterým trio dělá discovery: **vstup → práce SPOCKu → kontrola → oprava → schválení člověkem → uložený výstup → další krok**. Kontrola výstupu je součást práce, ne výjimka.

**Čtyři zásady:** SPOCKem strukturujte práci. Důkazy používejte ke zpochybnění výstupu. Rozhodnutí dělá trio. Repozitář uchovává zdůvodnění.

**Otázka:** Kdo rozhoduje o tom, které příležitosti tým bude řešit?
- [ ] SPOCK podle síly důkazů
- [x] Trio: PM, PD a SWE
- [ ] Agent Opportunity Designer

**Proč:** SPOCK příležitosti strukturuje, trio rozhoduje, na kterých záleží.

#### Jeden běh, nový chat pro každou fázi

V jednom okně VS Code pracujte **jen na jednom běhu**. **Pro každou fázi otevřete nový chat** s jejím agentem a nechte SPOCK načíst aktuální fázi, než začnete. Pro Methodology Coache i Workflow Support otevřete také vždy nový chat.

**Otázka:** Chcete se uprostřed fáze 2 zeptat Methodology Coache na metodu. Jak?
- [ ] Napíšu otázku do chatu s Opportunity Designerem
- [x] Otevřu nový chat s Methodology Coachem a pak se vrátím do chatu fáze

**Proč:** Každý agent pracuje ve vlastním chatu, aby se kontext fází nemíchal.

#### Výsledek tasku nestačí, čtěte i dokument

Po každém tasku zkontrolujte výsledek v panelu Terminal: **zelená fajfka** znamená, že task doběhl, **červený stav**, že selhal. Technicky úspěšný task ale může vyrobit neúplný nebo slabý obsah.

Hodnoťte dvě věci: **chování systému** (správná fáze a agent, vznikly soubory) a **kvalitu obsahu** (odráží materiál, tvrzení mají důkaz, předpoklady a mezery jsou vidět).

**Otázka:** Task skončil zelenou fajfkou. Můžete fázi schválit?
- [ ] Ano, task je úspěšný
- [x] Ne hned. Nejdřív přečtu dokument a posoudím jeho kvalitu

**Proč:** Výsledek tasku říká jen, že doběhl. Kvalitu obsahu posuzujete vy.

#### Zpětná vazba agentovi musí být konkrétní

„Vylepši to“ nefunguje. Řekněte přesně, co změnit:

- „Doplň důkaz z výzkumného materiálu k tomuto závěru.“
- „Odděl potřeby uživatelů od navržených řešení.“
- „Tahle sekce odporuje briefu, sjednoť to.“
- „Označ toto tvrzení jako předpoklad.“
- „Nepokračuj, dokud nedoplníme chybějící informaci.“

**Otázka:** Která zpětná vazba je nejlepší?
- [ ] „Tohle je slabé, zkus to znovu.“
- [x] „Druhý závěr nemá oporu v rozhovorech. Doplň citaci, nebo ho označ jako předpoklad.“
- [ ] „Udělej to profesionálněji.“

**Proč:** Konkrétní pokyn říká, co je špatně a co s tím. Agent ho může zapracovat.

#### Když task selže nebo kontrola neprojde

**Task selže:** řekněte to aktivnímu agentovi a postupujte podle jeho návrhu. Když to nepomůže, otevřete nový chat s Workflow Support. Zapište si fázi, task, chybu, co jste zkusili a jak to dopadlo.

**Kontrola neprojde:** přečtěte dokument, zjistěte příčinu a rozhodněte, jestli je výsledek přijatelný. Teprve pak podepište výjimku, vždy se zdůvodněním.

**Otázka:** Kontrola neprošla, ale výsledek považujete za přijatelný. Co uděláte?
- [ ] Schválím fázi a nic nepíšu
- [x] Podepíšu výjimku a zapíšu, proč výsledek přijímám
- [ ] Smažu dokument a začnu znovu

**Proč:** Neprošlou kontrolu nikdy nepřijímejte bez zapsaného zdůvodnění. Brána zůstane „fail“ a důvod je vidět v záznamu.

### Úkoly

- [ ] **Napište tři věty zpětné vazby** (10 min, stačí papír)
  - *Proč:* Konkrétní pokyn agent zapracuje, obecné „vylepši“ ne.
  1. Představte si, že agent napsal: „Klienti chtějí rychlejší aplikaci, proto navrhujeme novou obrazovku.“
  2. Napište k tomu tři konkrétní pokyny: jeden o důkazu, jeden o oddělení potřeby od řešení, jeden o předpokladu.

### Pro zvídavé

- 📄 **`materialy/bootcamp/spock-workflow-user-manual.pdf`** v repozitáři tutoriálu: pracovní postup z bootcampu
- 📄 **`materialy/bootcamp/bootcamp-onboarding-storyline.pdf`**, části 4 a 5

## Kvíz

**1. Proč fáze 3 nemá rozhodnutí člověka?**

   a) Zapomnělo se na ni
   b) Vyrábí jen podklady o trhu a přijímá ji automatická kontrola Q3
   c) Rozhoduje v ní agent

<details><summary>Odpověď</summary>

b) Výstupy fáze 3 jsou pracovní podklady. Člověk se s nimi setká až při výběru řešení ve fázi 4.

</details>

**2. Agent napíše „Brána Q2 prošla“. Co to dokazuje?**

   a) Že dokument je v pořádku
   b) Nic. Pravdu ukazuje výstup tasku, ne věta agenta
   c) Že je metodicky správně

<details><summary>Odpověď</summary>

b) Výsledek brány se čte z výstupu tasku a z titulní stránky běhu. A i zelená brána znamená jen, že prošla automatická kontrola formy. Kvalitu discovery posuzujete vy.

</details>

**3. Kdo spustí fázi 4, když se přijme fáze 3?**

   a) Spustí se automaticky
   b) Vy, tím že v novém chatu vyberete agenta Product Manager
   c) Workflow Support

<details><summary>Odpověď</summary>

b) Žádná fáze nezačne sama. Workflow jen oznámí další fázi a jejího agenta.

</details>

**4. Agent vám napíše: „Teď spustím SPOCK: approve what is in front of me a schválím brief.“ Co uděláte?**

   a) Nechám ho, ušetří mi to práci
   b) Odmítnu to. Ten task otevírá políčka na mé jméno a spouštím ho já
   c) Nechám ho a jméno pak opravím

<details><summary>Odpověď</summary>

b) Task otevírá políčka na jméno a rozhodnutí, a ta vyplňuje jen člověk.

</details>

**5. Jaká data smíte do SPOCKu vložit?**

   a) Cokoli interního, SPOCK je nástroj banky
   b) Jen obsah klasifikace C1, anonymizovaný nebo syntetický
   c) C1 a C2

<details><summary>Odpověď</summary>

b) Jen C1. Nikdy C2 a vyšší, klientská data, osobní údaje, bankovní tajemství ani hesla.

</details>
