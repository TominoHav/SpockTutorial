# Příručka: Fáze do hloubky (volitelná, hlavně pro GM a superusery, 8–10 h)

**Cíl:** Rozumíte každé ze sedmi fází tak, jak je popisuje její specifikace: co fáze čte, jaké kroky dělá, co přesně vyrobí, co hlídá brána, o čem rozhodujete vy, co fáze záměrně nedělá a co se stane, když se vracíte. Poznáte správné chování agenta podle pravidel, ne podle pocitu.

**Proč:** Úroveň 0 vám dala mapu. Tady se učíte, jak SPOCK doopravdy funguje uvnitř každé fáze. Kdo zná pravidla fáze, pozná, kdy agent rozhoduje za vás, kdy si vymýšlí a kdy brána zezelená, i když je výsledek špatný. Každá specifikace má na konci část „What this spec does not fix“. Ta je pro uživatele nejdůležitější, protože říká, čemu výstup věřit nelze.

**Než začnete:** Mějte hotové úrovně 0 a 1. Příručku nemusíte projít celou a nic dalšího nezamyká: vracejte se k fázi, kterou zrovna potřebujete. Podklady jsou ve vaší kopii SPOCKu v `specifications/stage-specs/`. Každá specifikace má stejných 13 částí (`stage-specs/README.md`): účel, vstupy, kroky, výstupy, compliance, skóre, artefakty, brány, rozhodnutí, návraty, limity, co ještě není postavené a otevřené otázky.

> Ukázkové běhy ve `fixtures/` jsou starší a některé vznikly podle dřívějších pravidel. Starší běh se čte jen proti kontrolám, které na něj dosáhnou svým datem (`fixtures/README.md`). Nejbližší současnému tvaru je `fixtures/2026-09-digital-onboarding-dropoff/`. Podle `BUSINESS-LOGIC-OVERVIEW.md` §0 obsahuje skutečný materiál ČS, takže z něj nic nekopírujte mimo svou kopii SPOCKu.

## 1F.0 — Co platí v každé fázi

### Karty (asi 10 min, jen na webu)

#### Zapsat, zkontrolovat, posunout, zeptat se

**Pořadí v každé fázi je vždy stejné: zapsat, zkontrolovat, posunout, teprve pak se zeptat.** Agent spustí `SPOCK: check what is written, then continue`, přečte výsledek a opraví, co kontrola našla. Teprve potom vás požádá o rozhodnutí (STAGE-1 R3.8.1–2).

**Víc do hloubky:**
- **Kam jde neprošlá kontrola, záleží na tom, čeho se týká.** Co může agent opravit, vrací se agentovi a vás se nikdo na nic neptá. Selhání týkající se už přijaté fáze jde k vám jako výjimka k podpisu. Chybějící označení PRD jako odsouhlaseného jde vždy k vám (STAGE-1 R3.8.2).
- **Spustit kontrolu neznamená ji vyhodnotit.** Agent kontrolu jen spustí jako samostatný proces. Kdyby výsledek zapsal sám, porušil by pravidlo. Zapisovač navíc odmítne záznam brány se jménem agenta (R3.8.4).

**Otázka:** Kdy vás agent požádá o rozhodnutí?
- [ ] Hned po napsání dokumentu
- [x] Až spustí kontrolu, přečte výsledek a opraví, co našla

**Proč:** Pořadí je v každé fázi stejné.

#### Kontroly, které nejde podepsat

**Osm kontrol nejde podepsat nikdy:** `C14`, `C32`, `C38`, `C51`, `C143`, `C168`, `C189` a `C190`. Drží poctivost záznamu a souborů workflow (STAGE-1 R3.8.2).

**Víc do hloubky:**
- **Každá brána má kromě vlastních kontrol i 45 univerzálních.** Fáze nejčastěji padá právě na univerzálních: chybějící sekce, chybějící závěrečné sekce „What we could not establish“ a „How this was produced“, nebo mezera bez záznamu, že se agent zeptal (`C98`, `C100`, `C163`).

**Otázka:** Proč nejde podepsat kontrolu `C189`?
- [x] Drží poctivost souborů workflow
- [ ] Je to jen varování

**Proč:** Osm kontrol drží poctivost záznamu a souborů workflow, a výjimka je nepřekoná.

#### Stavy fáze a zastarání

**Stavy fáze:** `pending`, `running`, `produced`, `q_failed`, `in_review`, `refined`, `accepted`, `stale` a `superseded`. Fáze je `accepted` jen tehdy, když prošla kvalitní branou (nebo jsou podepsané všechny výjimky) a existuje rozhodnutí člověka (`run-state.md` §4).

**Víc do hloubky:**
- **Zastarání (stale):** když se fáze vrátí nebo spustí znovu, každá pozdější fáze s výsledkem brány nebo s přijetím se označí `stale`. Nic se nesmaže. Přes zastaralý vstup se běh posune jen s vaším zapsaným přijetím (`run-state.md` §5).
- **Každý běh si zapisuje verzi každého know-how, které přečetl.** Dva běhy, které se chovaly jinak, tak jde vysvětlit (`run-state.md` §6).

**Otázka:** Kdy je fáze `accepted`?
- [ ] Když agent napíše, že je hotová
- [x] Když prošla bránou (nebo jsou podepsané výjimky) a existuje rozhodnutí člověka

**Proč:** Bez rozhodnutí člověka fáze přijatá není.

#### Kostra a pole `could_not_verify`

**Workflow připraví kostru dokumentu dřív, než agent píše.** Místa, která má vyplnit agent, jsou označená `[[fill: …]]` a dokument s neodstraněnou značkou nikdo nečte (STAGE-2 část 4).

**Pole `could_not_verify` na každém dokumentu** vypisuje pravidla, která žádná kontrola nerozhodne. Je určené pro vás, kdo o dokumentu rozhoduje (STAGE-1 §4.4).

**Otázka:** Pro koho je pole `could_not_verify`?
- [ ] Pro kontroly
- [x] Pro vás, kdo o dokumentu rozhoduje

**Proč:** Vypisuje pravidla, která žádná kontrola nerozhodne.

#### Jak má agent mluvit

**Jak má agent mluvit:** jako kolega, který podává zprávu. Na začátku řekne, co fáze vyrobí, ptá se v dávkách, nabízí možnosti, o pokroku hlásí výsledky a ne postup a končí shrnutím (co zapsal, kde to je, na co čeká, co se nepodařilo zjistit). Nikdy neřekne, že fáze prošla, nikdy vám nedá příkaz k napsání ani hodnotu do políčka a nikdy nenavrhuje měnit build (`agent-interaction.md` §1–11).

**Víc do hloubky:**
- **Když nástroj nic nevrátí, agent to tak řekne a nevymýšlí důvod** (§9a). Vymyšlený důvod prázdného výsledku je nález.
- **Role u podpisu:** když podepíšete pod jinou rolí, než kterou bráně dává Pilot Definition, zapíše se to, jak jste napsali, s upozorněním (heads-up). Role, která vypadá jako překlep, se odmítne (STAGE-1 část 9).

**Otázka:** Agent napíše „Fáze prošla, schvalte ji“. Je to správně?
- [ ] Ano
- [x] Ne, agent nikdy neříká, že fáze prošla

**Proč:** O průchodu rozhoduje kontrola a o přijetí vy.

### Úkoly

- [ ] **Přečtěte si titulní stránku a stav běhu** (20 min, ve VS Code)
  - *Proč:* Stav fáze a její výsledek brány musíte umět přečíst bez agenta.
  1. Otevřete `fixtures/2026-09-savings-goals/RUN-STATE.md`.
  2. U dvou fází najděte stav, výsledek brány, kdo fázi vlastní a které know-how a v jaké verzi četla.
  3. Ve `fixtures/2026-09-savings-goals/1-brief/initiative-brief.md` najděte v hlavičce `could_not_verify` a `decision`.
- [ ] **Sepište si, jak má agent mluvit** (20 min, ve VS Code)
  - *Proč:* Většinu odchylek poznáte podle toho, jak agent mluví, dřív než podle výstupu.
  1. Z `agent-interaction.md` §7 a §11 si vypište, co agent nikdy nedělá.
  2. Nechte si na vedlejší straně papíru místo pro příklady z vašeho cvičného běhu.

### Pro zvídavé (anglicky, ve vaší kopii SPOCKu)

- 📄 **`specifications/stage-specs/README.md`**: 13 částí každé specifikace
- 📄 **`stage-specs/STAGE-1-SPEC.md`** krok 8 (R3.8.1–R3.8.4): pořadí zapsat, zkontrolovat, posunout, zeptat se
- 📄 **`specifications/definitions/cross-cutting/run-state.md`** §4–6: stavy fáze, zastarání a verze know-how
- 📄 **`specifications/definitions/know-how/writing/agent-interaction.md`** §1–11: jak s vámi má agent mluvit

## 1F.1 — Fáze 1: brief do hloubky

### Karty (asi 10 min, jen na webu)

#### Fáze 1 zavazuje běh k outcome

**Fáze 1 je jediná, která nic nečte z workflow.** Zavazuje běh k outcome a všechno další čte tenhle závazek, místo aby ho odvozovalo znovu (§1.1).

**Je to rozhovor, ne formulář.** Pevný počet otázek neexistuje. Limit 40 výměn je zastávka, ne cíl (§1.1, část 11).

**Otázka:** Kolik otázek má rozhovor ve fázi 1?
- [ ] Pevně 20
- [x] Pevný počet neexistuje, 40 výměn je zastávka, ne cíl

**Proč:** Je to rozhovor, ne formulář.

#### Dokument, jazyk a problémový prostor

**Krok 0: když přinesete dokument, agent ho vyslýchá, ne přepisuje.** Začne tím, co je slabé nebo chybí, ne potvrzením, že dokument dostal. U každého pole řekne, odkud je: z vašeho dokumentu, z rozhovoru, nebo stále chybí. Co v dokumentu stojí, je vaše. Co z něj agent jen vyvodí, smí nabídnout jen jako návrh (R3.0.1–R3.0.4).

**Víc do hloubky:**
- **Jako první se ptá na jazyk**, jako uzavřenou volbu `cs` nebo `en`. Jazyk se pak už nemění a řídí se jím všechny dokumenty i všichni agenti. Názvy polí, id a hodnoty záznamů zůstávají anglicky, aby český i anglický běh prošel stejnými branami (R3.1.3–R3.1.4).
- **Ptá se na problémový prostor, ne na produkt.** Otázka, která jmenuje produkt, si produkt přivolá (R3.1.1). Ptá se taky, jaké konkurenty už znáte. Prázdný seznam je běžná odpověď a agent ho nedohledává (R3.1.5).

**Otázka:** Na co se agent ptá jako první?
- [x] Na jazyk běhu, `cs` nebo `en`
- [ ] Na název produktu

**Proč:** Jazyk se pak už nemění a řídí se jím všechny dokumenty.

#### Outcome a cíl ze čtyř částí

**Outcome:** když odpovíte řešením, agent navrhne přeformulování, nejvýš dvakrát. Pomoc s formulací, o kterou si řeknete, se do limitu nepočítá (R3.2.1–R3.2.3).

**Cíl má čtyři části:** produktový cíl (North Star), metrika, key result ze Strategy Basis a písemná vazba mezi nimi. Produktový cíl se ptá jednou. Když ho nemáte, je to unknown a agent ho nikdy nenapíše za vás (R3.4.1–R3.4.2).

**Otázka:** Kolikrát agent navrhne přeformulování outcome, když odpovíte řešením?
- [ ] Neomezeně
- [x] Nejvýš dvakrát

**Proč:** Pomoc, o kterou si sami řeknete, se do limitu nepočítá.

#### Key result vybíráte vy, vazbu píšete vy

**Key result se vyhledá, nevybírá ho agent.** Strategy Basis má 25 key resultů pod šesti cíli. Agent vám je ukáže všechny, seskupené podle cíle, řekne, na které dva nebo tři by se podíval nejdřív a proč, a vybíráte vy (R3.4.3). Tohle je jediný krok, kde agent vysvětluje i bez vyzvání (R3.4.4).

**Vazbu agent nikdy nenapíše.** Když ji nedokážete říct, cíl je neúplný a označí se jako unknown. Částečný cíl by se dál četl jako dodaný (R3.4.7). Je to **největší nehlídaný úsudek celého workflow** a jedinou pojistkou je, že ho čtete u G1 (konec specifikace).

**Víc do hloubky:**
- **Pravidlo ČS:** metrika produktu nikdy nesmí být key result banky. „Víc klientů obsloužených digitálně“ je metrika banky. Otázka zní, co pohne tento běh (R3.4.8, `strategy-basis.md` §3).
- **Love Brand** nemá žádný key result, takže se zapíše `key_result: unavailable` a cíl se neoznačí jako unknown (R3.4.10).

**Otázka:** Co je největší nehlídaný úsudek celého workflow?
- [ ] Výběr řešení
- [x] Písemná vazba mezi metrikou a key resultem

**Proč:** Jedinou pojistkou je, že ji čtete u G1.

#### Unknown je dobrý záznam

**Unknown je záznam s důvodem:** `not_known`, `not_yet_available`, `not_applicable` nebo `declined`, a záznam, že se agent zeptal (§4.3, `C163`). „Declined“ znamená rozhodnutí, „unknown“ mezeru (§2.3).

**Brief se čtyřmi poli unknown s důvodem je dobrý brief.** Brief napsaný jako souvislý text spadne na třech kontrolách naráz (§1.4–1.5).

**Víc do hloubky:**
- **Fáze 1 nedělá compliance.** Regulatorní screening proběhne až ve fázi 4 u konkrétního řešení (část 5).

**Otázka:** Brief má čtyři pole jako unknown s důvodem. Je to špatný brief?
- [ ] Ano
- [x] Ne, je to dobrý brief

**Proč:** Poctivá mezera je lepší než vymyšlené pole.

### Úkoly

- [ ] **Rozeberte brief ukázkového běhu** (30 min, ve VS Code)
  - *Proč:* Uvidíte, jak vypadá cíl o čtyřech částech a záznam unknown.
  1. Otevřete `fixtures/2026-09-savings-goals/1-brief/initiative-brief.md`.
  2. Najděte produktový cíl, metriku, key result a vazbu. Je vazba mechanismus, nebo jen tvrzení?
  3. Najděte sekci „What we could not establish“ a důvody unknown.
- [ ] **Projděte Strategy Basis** (20 min, ve VS Code)
  - *Proč:* U G1 budete vybírat key result z tohoto seznamu.
  1. Otevřete `strategy-basis.md` §2 a projděte cíle a key resulty.
  2. Ke svému tématu z cvičného běhu najděte dva možné key resulty a napište vazbu vlastními slovy.

### Pro zvídavé (anglicky, ve vaší kopii SPOCKu)

- 📄 **`stage-specs/STAGE-1-SPEC.md`**, celé
- 📄 **`definitions/know-how/product/strategy-basis.md`** §2.1 a §3
- 📄 **`definitions/know-how/method/method-canon.md`** §9.2: osm způsobů, jak se outcome formuluje špatně

## 1F.2 — Fáze 2: problémy a příležitosti do hloubky

### Karty (asi 10 min, jen na webu)

#### Čtyři kroky, každý dál od surového textu

**Čtyři kroky v jedné fázi s jedním agentem:** příjem materiálu, hypotézy, rámování příležitostí a prioritizace (§1.1).

**Každý krok je o krok dál od surového textu.** Příjem čte materiál, hypotézy čtou jen záznam příjmu (A2b), rámování ani materiál, ani A2b. **Tuhle hranici drží jen instrukce**: jeden agent nese všechny čtyři kroky a smí číst soubory (§2.1).

**Otázka:** Co drží hranici mezi kroky fáze 2?
- [ ] Oddělení agentů
- [x] Jen instrukce, všechny kroky nese jeden agent

**Proč:** Proto je dobré vědět, kdy agent hranici překročil.

#### Karanténa a materiál

**Karanténa:** příjem nemá žádné nástroje ven. Pokyn v materiálu je informace o jeho autorovi, nikdy příkaz. Kontrola `C151` hledá pokyn, který prošel, ale **nevidí agenta, který pokyn poslechl a nezanechal stopu** (část 5).

**Víc do hloubky:**
- **Materiál jde do `2-problems/supplied/`.** Uvolněný materiál v `2-problems/` agent žádá přesunout, nikdy smazat (§2.2). Od brány fáze 3 musí být každý soubor ve `supplied/` načtený a nezměněný, a to je kontrola, kterou nejde podepsat (`C190`).

**Otázka:** Co kontrola `C151` nevidí?
- [ ] Pokyn v materiálu
- [x] Agenta, který pokyn poslechl a nezanechal stopu

**Proč:** Pojistkou je karanténa bez nástrojů ven.

#### Hypotézy a trust tag

**Test tvaru hypotézy: mohlo by tohle vyřešit víc než jedna věc?** Když ne, hypotéza už si vybrala řešení (R3.2.2).

**Trust tag:** *strong* znamená dva nebo víc různých původů s úplnou provenienci a aspoň jeden z první ruky. *Weak* znamená, že důkaz je, ale tohle neplatí. *Unrated* znamená žádné odkazy. Kontrola tag přepočítá, takže ho agent nemůže nafouknout (R3.2.3, R3.2.5).

**Víc do hloubky:**
- **Hypotéza se nikdy nezahodí kvůli slabému tagu.** Sada se čtyřmi slabými tagy a seznamem odložených je dobrý výstup (R3.2.4, §1.4).
- **Rozpor:** když důkaz odporuje dřívějšímu dokumentu fáze, agent ho zapíše a fáze čeká na vaše rozhodnutí. Buď se tvrzení opraví, nebo se ponechá s podepsanou výjimkou (R3.2.6, `C193`).

**Otázka:** Zahodí se hypotéza se slabým tagem?
- [ ] Ano
- [x] Ne, sada se čtyřmi slabými tagy je dobrý výstup

**Proč:** Tag měří důkazy. Slabý důkaz není důvod hypotézu skrýt.

#### Rámování a pořadí

**Rámování: jedna příležitost na hypotézu, přesně jednou.** Tržní faktory jsou *deferred*, ne unknown, protože trh se ještě nezkoumal. Alternativy zůstávají prázdné s důvodem (R3.3.1, R3.3.4, R3.3.5).

**Víc do hloubky:**
- **Co materiál neřekne, se ptá jako pořadí přes celou sadu:** které příležitosti zasáhnou nejvíc zákazníků a které bolí nejvíc. Shody v pořadí jsou povolené. Když pořadí určit nemůžete, je to unknown s vaším důvodem (R3.3.6).
- **Příležitost, kterou přinesete vy,** nepotřebuje hypotézu, má `origin: person` a v dokumentu je označená jako vaše (R3.3.7). Id je `O1` a nadpis říká, z čeho vychází: `O1 (H1)`, nebo `O15 (vaše)` (R3.3.8).

**Otázka:** Proč jsou tržní faktory ve fázi 2 *deferred*, a ne unknown?
- [x] Trh se ještě nezkoumal
- [ ] Nikoho nezajímají

**Proč:** Trh přijde až ve fázi 3.

#### Prioritizace, zastávky a limity

**Prioritizace:** 1–3 primární, 0–5 sekundárních, zbytek odložené. Bez primární příležitosti fáze nepokračuje (`no_primary_problem`). Agent pořadí jen navrhuje a povýšení je vaše u G2 (R3.4.1–R3.4.4).

**Víc do hloubky:**
- **Pět tvrdých zastávek:** chybí materiál, materiál napsal agent, není primární příležitost, chybí stopa, chybí lidský podpis. Tvrdá zastávka zatím nezapisuje žádný záznam (§8.2).
- **G2 má dvě otázky:** Researcher se ptá na důkazy, PM na rozsah. Podepisuje ale jeden člověk (část 9).
- **Limity:** 50 položek nebo 500 stran materiálu, 5 doptávacích kol, 20 hypotéz, 3 kola rámování (část 11).

**Otázka:** Co se stane, když není žádná primární příležitost?
- [x] Fáze nepokračuje (`no_primary_problem`)
- [ ] Agent jednu vybere

**Proč:** Povýšení je vaše u G2.

**Co fáze neopraví:** tým, který dodá špatný materiál, dostane dobře formulovanou sadu špatných problémů. Trust tag měří důkazy, ne problém (konec specifikace).

### Úkoly

- [ ] **Projděte řetěz fáze 2 v ukázkovém běhu** (40 min, ve VS Code)
  - *Proč:* Uvidíte, jak se z materiálu stane příležitost a kde se drží stopa.
  1. Ve `fixtures/2026-09-savings-goals/2-problems/` projděte soubory 1 až 5 v tomto pořadí.
  2. U jedné příležitosti z `5-prioritised-opportunities.md` dohledejte hypotézu, pozorování a položku materiálu.
  3. Ověřte trust tag ručně: kolik různých původů, kolik z první ruky?
- [ ] **Napište hypotézu, která neprojde testem tvaru** (10 min, ve VS Code)
  - *Proč:* Naučíte se poznat řešení převlečené za problém.
  1. Napište dvě věty o svém tématu: jednu, kterou by vyřešila jen jedna věc, a jednu, kterou by mohlo vyřešit víc věcí.

### Pro zvídavé (anglicky, ve vaší kopii SPOCKu)

- 📄 **`stage-specs/STAGE-2-SPEC.md`**, celé
- 📄 **`definitions/know-how/method/evidence-standards.md`** §4 (původ a blízkost zdroje)

## 1F.3 — Fáze 3: trh do hloubky

### Karty (asi 10 min, jen na webu)

#### Jediná fáze, která sahá ven

**Fáze 3 zjišťuje, co trh už dělá s těmito příležitostmi**, aby fáze 4 nevymýšlela naslepo. Je to jediná fáze, která sahá mimo repozitář (§1.1).

**Nikdo ji nepodepisuje, a to je rozhodnutí.** Brána Q3 je celé její přijetí a další, kdo výsledek čte, jste vy ve fázi 4 (§1.2, část 9).

**Otázka:** Kdo fázi 3 podepisuje?
- [ ] PM
- [x] Nikdo, přijme ji brána Q3

**Proč:** Výsledek čtete až vy ve fázi 4.

#### Režim určuje složka `supplied/`

**Režim určuje složka `3-competitive-analysis/supplied/`.** Soubor v ní znamená, že agent má pracovat jen z vašeho seznamu. Že nebude hledat, ale není záruka, pokud je nainstalované rozšíření pro vyhledávání. Prázdná složka znamená, že agent hledá sám (§2.1).

**Víc do hloubky:**
- **Než začne psát karty, agent se jednou zeptá, jestli je něco ze `supplied/` interní nebo neveřejné.** Karty na takovém materiálu dostanou `confidential: yes` a při uchování konkurentů zůstanou v běhu (R3.3.9).
- **Agent píše jen z výtahu, nikdy ze stažené stránky.** Stránka se nejdřív zredukuje na fakta. Tohle pravidlo nehlídá žádná kontrola (R3.1.1, §8.2).

**Otázka:** Je soubor v `supplied/` záruka, že agent nebude hledat na webu?
- [ ] Ano
- [x] Ne, pokud je nainstalované rozšíření pro vyhledávání

**Proč:** Soubor říká, že má pracovat jen z vašeho seznamu. Hlídejte to.

#### Zdroje a jejich nezávislost

**Zdroje karty:** aspoň čtyři nezávislé, dva když seznam dodal člověk, a aspoň jeden primární (co o sobě zveřejnil sám účastník). **Tisková zpráva a tři média, která o ní píšou, jsou jeden zdroj.** Nezávislost se určuje podle vydavatele, ne podle podobnosti textu (R3.3.4, §1.5).

**Na dodaném trhu musí každý zdroj být stránka, kterou agent opravdu otevřel**, ze seznamu nebo pod adresou ze seznamu. Od buildu 1.16 se odmítne i titulní stránka webu jako zdroj (R3.3.10, `C184`).

**Otázka:** Tisková zpráva a tři média, která o ní píšou. Kolik je to zdrojů?
- [x] Jeden
- [ ] Čtyři

**Proč:** Nezávislost se určuje podle vydavatele.

#### Trendy, čerstvost a důvěryhodnost

**Trendy:** business, technology a regulatory, 3 až 5 v každé třídě. Pět je strop, ne cíl. Regulatorní trend jmenuje předpis a datum účinnosti (R3.1.4–R3.1.5).

**Čerstvost:** 180 dní pro přímého konkurenta, 365 pro sousedního nebo náhradního. Zastaralá karta se zkoumá znovu, nikdy se neupravuje (R3.3.6).

**Víc do hloubky:**
- **Důvěryhodnost (confidence) se přepočítá**, agent ji nemůže napsat (R3.3.7).
- **Počet karet:** cílem je 10. Na dodaném trhu je cílem počet položek seznamu, mezi 3 a 10. Seznam tří projde bez podpisu, seznam dvou na bráně neprojde (`C75`).

**Otázka:** Karta přímého konkurenta je 200 dní stará. Co s ní?
- [ ] Upraví se
- [x] Zkoumá se znovu

**Proč:** Čerstvost je 180 dní pro přímého konkurenta a zastaralá karta se nikdy neupravuje.

#### Úložiště, limity a co fáze neopraví

**Úložiště konkurentů (store)** je jediná věc, která přežije běh, ale **opakované použití je pozastavené**: agent zkoumá každého účastníka znovu, protože karta odpovídá na otázku svého běhu (§7.1).

**Víc do hloubky:**
- **Limity:** 25 zmapovaných účastníků, 8 kol hledání, 10 zkoumaných na jedno spuštění, 90 minut (část 11). Druhé kolo hledání je běžné.

**Otázka:** Projde Q3 sebejistý, dobře ozdrojovaný, ale špatný obraz trhu?
- [x] Ano
- [ ] Ne

**Proč:** Proto musíte trh číst ve fázi 4.

**Co fáze neopraví:** sebejistý, dobře ozdrojovaný, ale špatný obraz trhu projde Q3 (konec specifikace).

### Úkoly

- [ ] **Zkontrolujte jednu kartu konkurenta** (30 min, ve VS Code)
  - *Proč:* Fázi 3 nikdo nepodepisuje. Jediným čtenářem karet jste vy ve fázi 4.
  1. Otevřete `fixtures/2026-09-savings-goals/3-competitive-analysis/2-competitor-cards.md`.
  2. U jedné karty spočítejte nezávislé vydavatele a najděte primární zdroj.
  3. Najděte datum výzkumu. Byla by karta dnes ještě čerstvá?

### Pro zvídavé (anglicky, ve vaší kopii SPOCKu)

- 📄 **`stage-specs/STAGE-3-SPEC.md`**, celé
- 📄 **`definitions/know-how/market/competitive-analysis-standards.md`** §3.2 (nezávislé zdroje) a §5 (čerstvost)

## 1F.4 — Fáze 4: řešení a compliance do hloubky

### Karty (asi 10 min, jen na webu)

#### Teprve tady je řešení legitimní

**Teprve tady je řešení legitimní.** Řešení se generují proti příležitostem, několik na každou, aby vybrané bylo vybrané z alternativ a ne obhajované zpětně (R1.2).

**Osm kroků:** slate (jen jména sady, žádný obsah) → napsání každého řešení → compliance sweep → odvození (skript) → strategický soulad → sestavení (skript) → představení → výběr a podpis. **Člověk je potřeba jen v krocích 7 a 8** (část 3).

**Otázka:** Ve kterých krocích fáze 4 je potřeba člověk?
- [ ] Ve všech
- [x] Jen v krocích 7 a 8, představení a výběr

**Proč:** Ostatní kroky dělá agent a skript.

#### Kolik řešení a jak odlišných

**Agent generuje 5 řešení, minimum 3, strop 10.** Strop je pro vás: řešení nad pět přidáváte vy, když je sada představená. Každé řešení navíc znamená sedm sekcí a další průchod čtyřmi kartami (R3.1.4).

**Víc do hloubky:**
- **Aritmetika omezuje počet odlišných řešení.** Se třemi příležitostmi jsou nejvýš tři kombinace, z nichž žádná není podmnožinou jiné. Se čtyřmi šest, s pěti deset. Když aritmetika pět neunese, agent to řekne (R3.1.4a).
- **Pravidlo pokrytí:** když jsou dvě nebo víc primárních příležitostí, sada musí řešit aspoň dvě různé. Není to cíl rozložení: čtyři silná řešení na O1 a jedno na O2 projdou (R3.1.5).
- **Stejný seznam příležitostí smí sdílet nejvýš tři řešení.** Čtyři řešení na přesně stejné příležitosti jsou jedna sázka ve čtyřech kostýmech (část 11, `C103`).

**Otázka:** Kolik řešení smí sdílet přesně stejný seznam příležitostí?
- [ ] Neomezeně
- [x] Nejvýš tři

**Proč:** Čtyři řešení na stejné příležitosti jsou jedna sázka ve čtyřech kostýmech.

#### Osm sekcí řešení

**Každé řešení má osm sekcí** a každá má délku, povinnou citaci a to, co obsahovat nesmí: *What it is*, *What it does* (změna chování klienta, ne mechanismus), *How it does it* (zážitek klienta a pracovníka, ne architektura), *The problem it solves, and for whom*, *Opportunities it is built on*, *Against the market* (prvky syntézy podle id), *Strategic alignment* a *Compliance* (generovaná) (§4.2).

**Otázka:** Co patří do *What it does*?
- [x] Změna chování klienta
- [ ] Popis mechanismu

**Proč:** Mechanismus nebo architektura do řešení nepatří.

#### Compliance sweep a odvození

**Compliance sweep:** agent u každého řešení odpoví na všech 128 otázek čtyř karet (39 compliance, 32 GDPR, 27 ICT security, 30 legal) jako `yes`, `no` nebo `cannot_tell`. U `cannot_tell` jmenuje vstup, který by to rozhodl (R3.3.2–R3.3.3, část 11).

**Odpovědi zůstávají v záznamu, k vám jdou jen touchpointy s `yes`, a to doslovně z karty.** Doslovnost dovoluje skriptu je porovnat s kartou. Parafráze se porovnat nedá (R3.3.5–R3.3.7).

**Víc do hloubky:**
- **Skript, ne model, odvodí** oblasti ve hře, eskalační příznak, otevřené položky a **počet touchpointů**. Oblast bez ničeho ve hře je napsaná jako prázdná, nikdy nechybí (R3.4.1–R3.4.3).
- **Žádné skóre.** Počet touchpointů je jen počet. Nezodpovězené otázky počet nemění: řešení s 18 otevřenými otázkami není složitější, jen **méně známé** (R6.3–R6.4).
- **Compliance má hranice:** AI regulace ani outsourcing a DORA nejsou v žádné ze čtyř oblastí. AI se jen přesměruje na specialistu. Tři ze čtyř karet napsal pilotní tým a nikdo z banky je nerevidoval (`COMPLIANCE-REQUIREMENTS.md` §1).

**Otázka:** Řešení má 18 nezodpovězených otázek. Je složitější?
- [ ] Ano
- [x] Ne, je jen méně známé

**Proč:** Nezodpovězené otázky počet touchpointů nemění.

#### Strategický soulad a výběr

**Strategický soulad je věta, ne číslo:** pilíř ze Strategy Basis, key result s řetězem, nebo důvod, proč žádný nesedí (R6.6).

**Výběr jsou dva tasky:** `SPOCK: record a decision I made` s důvodem, pak `SPOCK: approve what is in front of me`. **Důvod je povinný**, slovo od slova se přepíše do vybraného řešení (A9) pod „Why this one“. A9 nepíše žádný agent (část 9).

**Víc do hloubky:**
- **Možnost „nic z toho“ neexistuje.** Když se vám nelíbí žádné řešení, změníte nějaké nebo přidáte vlastní (R9.7).
- **Změna řešení po kontrole:** přepíše se jen to řešení a Q4 se při schválení spustí znovu. Změněné řešení potřebuje znovu zodpovědět compliance otázky (R10.1–R10.2).
- **Volbu lze nahradit i po schválení**, bez vracení fáze, taskem `SPOCK: replace a decision that no longer stands`. Fáze 5 a dál se pak označí jako zastaralé (R10.4a).

**Otázka:** Je strategický soulad číslo?
- [ ] Ano, procento
- [x] Ne, věta: pilíř, key result s řetězem, nebo důvod, proč žádný nesedí

**Proč:** Fáze 4 nemá žádné skóre.

**Co fáze neopraví:** nic neřekne, jak těžké je řešení postavit. Tříletá a třítýdenní stavba vypadají stejně (konec specifikace).

### Úkoly

- [ ] **Rozeberte jedno řešení a jeho compliance** (45 min, ve VS Code)
  - *Proč:* Sada řešení je jediný dokument, který u G4 čtete, a musíte v něm najít podstatné.
  1. Otevřete `fixtures/2026-09-digital-onboarding-dropoff/4-solutions/1-solution-set.md`.
  2. U jednoho řešení projděte osm sekcí. Dodržuje *What it does*, že popisuje změnu chování, a ne mechanismus?
  3. V sekci *Compliance* najděte počet touchpointů, oblasti ve hře a eskalační příznak.
  4. Porovnejte `4-solutions/parts/SOL1.md` a `SOL1.compliance.md` se sestaveným dokumentem: kdo napsal kterou část?
- [ ] **Najděte důvod volby** (10 min, ve VS Code)
  - *Proč:* Důvod je to, co z rozhodnutí zbude za dva roky.
  1. Otevřete `4-solutions/2-selected-solution.md` téhož běhu a najděte „Why this one“.

### Pro zvídavé (anglicky, ve vaší kopii SPOCKu)

- 📄 **`stage-specs/STAGE-4-SPEC.md`** části 1–6 a 9–11
- 📄 **`specifications/COMPLIANCE-REQUIREMENTS.md`** §1 (čtyři oblasti a co je mimo rozsah)
- 📄 **`definitions/know-how/method/discovery-craft.md`** §6 a §8

## 1F.5 — Fáze 5: MVP do hloubky

### Karty (asi 8 min, jen na webu)

#### Zmenšit, pak definovat

**Fáze 5 zmenšuje jedno vybrané řešení na něco, co jde pilotovat, a pak to definuje.** Má dvě poloviny a dvě rozhodnutí: zapsanou volbu varianty a G5b nad rozpracováním (§1.1).

**Volba varianty není brána, ale zapsané rozhodnutí.** G5b přijímá rozpracování, takže rozpracování nemůže na G5b čekat. Volba se proto dělá za běhu fáze (§1.5).

**Otázka:** Je volba varianty MVP brána?
- [ ] Ano
- [x] Ne, je to zapsané rozhodnutí za běhu fáze

**Proč:** G5b přijímá rozpracování, takže volba musí přijít dřív.

#### Jak se liší varianty

**Varianty se liší v tom, jak se řešení postaví, ne v tom, které řešení to je.** Pravidlo odlišnosti z fáze 4 tu záměrně neplatí. Velký překryv je poctivý tvar volby. Každá varianta ale musí říct, čím se liší (`C58`) (§1.2).

**Tři zákazy:** žádná varianta není preferovaná, žádná není seřazená („nejdřív tohle, pak tamto“) a žádná není podmnožinou nebo fází jiné. Každý zákaz selže jinak: preference bere volbu, řazení z ní dělá plán a podmnožina dělá z varianty fázi jiné (R3.1.4).

**Otázka:** Varianty se z velké části překrývají. Je to chyba?
- [ ] Ano
- [x] Ne, liší se v tom, jak se řešení postaví, a každá musí říct čím

**Proč:** Pravidlo odlišnosti z fáze 4 tu záměrně neplatí.

#### Horizont a kdo s řešením pracuje

**Každou variantu jde pilotovat v časovém horizontu briefu.** Co by trvalo déle, patří do sekce „Later, beyond the brief's horizon“ a do minima variant se nepočítá (R3.1.4a).

**Varianta nemění, kdo s řešením pracuje.** Smí zúžit kanál, skupinu klientů nebo rozsah. Kdo řešení vidí, používá nebo podle něj rozhoduje, ale zůstává. Varování pro klienta přesunuté na obrazovku pracovníka není varianta, ale jiné řešení (R3.1.4b).

**Otázka:** Co patří do sekce „Later, beyond the brief's horizon“?
- [x] Co by trvalo déle než horizont briefu
- [ ] Odložené příležitosti

**Proč:** Do minima variant se tyhle položky nepočítají.

#### Rozpracování jedné varianty

**Agent navrhne 3 varianty, vy přidáte až 3 vlastní, hotová sada má 2–6** (část 11). Vaše má `origin: person`.

**Rozpracovává se přesně jedna varianta**, ta zvolená. Rozpracování nepřidává nic, co varianta nenesla, a ostatní varianty nekomentuje. Metriky se berou z rámovaných příležitostí, nevymýšlejí se tady (R3.2.1–R3.2.4).

**Víc do hloubky:**
- **Touchpointy vybraného řešení se nesmí ztratit.** Každý je v rozpracování jmenovaný identifikátorem a sekce *What has to be handled* má tři bloky: vyřešené, zúžené mimo rozsah a otevřené (R3.2.5, `C171`, `C185`).

**Otázka:** Smí se v rozpracování objevit nová metrika?
- [ ] Ano
- [x] Ne, metriky se berou z rámovaných příležitostí

**Proč:** Rozpracování nepřidává nic, co varianta nenesla.

**Co fáze neopraví:** tři varianty, které jsou jednou variantou popsanou třikrát, projdou každou kontrolou. Odhad nákladů nikde v běhu není (konec specifikace).

### Úkoly

- [ ] **Posuďte varianty MVP** (30 min, ve VS Code)
  - *Proč:* Jen vy poznáte, jestli jsou varianty opravdu různé způsoby, jak řešení postavit.
  1. Otevřete `fixtures/2026-09-digital-onboarding-dropoff/5-mvp/1-mvp-options.md`.
  2. U každé varianty najděte, čím se liší. Je to skutečný rozdíl, nebo jen jiná míra?
  3. V `2-expanded-mvp.md` najděte *What has to be handled* a jeho tři bloky.

### Pro zvídavé (anglicky, ve vaší kopii SPOCKu)

- 📄 **`stage-specs/STAGE-5-SPEC.md`**, celé
- 📄 **`definitions/know-how/method/discovery-craft.md`** §9

## 1F.6 — Fáze 6: PRD do hloubky

### Karty (asi 8 min, jen na webu)

#### Největší syntéza běhu

**Fáze 6 je největší syntéza běhu: šest vstupů do jednoho dokumentu.** Proto má nejvyšší deklarované úsilí (`effort: high`) (§1.1, část 2).

**Dva artefakty:** A12 je draft, **A13 je jiný dokument**, ne stav draftu. Vznikne doslovně z draftu až ve chvíli, kdy ho označíte taskem `SPOCK: mark the PRD agreed`. Dokument, se kterým jste souhlasili, a dokument, který čte fáze 7, je tak stejný text (§1.2).

**Otázka:** Je odsouhlasené PRD (A13) stav draftu?
- [ ] Ano
- [x] Ne, je to jiný dokument, vzniklý doslovně z draftu

**Proč:** Fáze 7 tak čte přesně ten text, se kterým jste souhlasili.

#### Blok souhlasu a měřítka

**Agent nikdy nepíše do bloku souhlasu.** Draft, který se po souhlasu změní, se označí znovu a A13 se napíše znovu (R3.3.1–R3.3.3).

**Každý požadavek jmenuje měřítko, kterému slouží**, a PRD má **alignment statement**. Požadavek, který nic neslouží, je tak vidět, místo aby se předpokládal (§1.5, R3.1.2–R3.1.3).

**Víc do hloubky:**
- **Měřítka se přenášejí, neodvozují se znovu.** Měřítko vymyšlené ve fázi 6 by nikdo u G2 ani G5b neviděl (R2.1).

**Otázka:** Agent zapíše do bloku souhlasu. Je to v pořádku?
- [ ] Ano
- [x] Ne, do bloku souhlasu agent nikdy nepíše

**Proč:** Souhlas je váš úkon.

#### Touchpointy a G6

**Touchpointy se dědí z rozpracovaného MVP.** Každý je řešený v pojmenovaném požadavku, jako přijatá otevřená položka s vlastníkem a termínem rozhodnutí, nebo s důvodem, proč ho zúžení rozsahu vyřadilo. Vyřazení potřebuje důvod a jméno toho, kdo rozhodl (R3.1.4, `C130`, `C131`).

**G6 jsou dva úkony:** označit PRD jako odsouhlasené (jedno políčko, vaše jméno) a pak schválit (část 9).

**Otázka:** Kolik úkonů má G6?
- [ ] Jeden
- [x] Dva: označit PRD jako odsouhlasené a schválit

**Proč:** Nejdřív vznikne odsouhlasené PRD, pak ho schválíte.

#### Opravy a co fáze neopraví

**Opravy:** agent opravuje tvar nejvýš ve třech cyklech, pak vrací problém vám. Po pěti kolech úprav, o které požádáte, eskaluje na PM. Nic tyto cykly nepočítá, jde jen o instrukce (část 10–11).

**Q6 nemá posuzovanou polovinu.** Každé pravidlo kvality tady rozhoduje kontrola (§8.2).

**Víc do hloubky:**
- **Co fáze neopraví:** nic neříká, jestli jde požadavek postavit nebo zaplatit. Otázku, kterou delivery tým položí jako první, nemá nikde v běhu odpověď. Otevřené compliance položky se do PRD zatím nepřenášejí (část 12, konec specifikace).

**Otázka:** Má Q6 posuzovanou polovinu?
- [ ] Ano
- [x] Ne, každé pravidlo kvality rozhoduje kontrola

**Proč:** Fáze 6 je jediná taková.

### Úkoly

- [ ] **Projděte PRD a jeho alignment statement** (30 min, ve VS Code)
  - *Proč:* U G6 souhlasíte s tím, podle čeho se bude stavět.
  1. Otevřete `fixtures/2026-09-digital-onboarding-dropoff/6-prd/1-prd-draft.md` a `2-prd-agreed.md`.
  2. Najděte rozdíl mezi nimi: blok souhlasu.
  3. U tří požadavků najděte měřítko, kterému slouží, a touchpointy, které nesou.

### Pro zvídavé (anglicky, ve vaší kopii SPOCKu)

- 📄 **`stage-specs/STAGE-6-SPEC.md`**, celé
- 📄 **`definitions/know-how/product/prd-template.md`**: osm sekcí

## 1F.7 — Fáze 7: iniciativa do hloubky

### Karty (asi 8 min, jen na webu)

#### Dokument, který banka dostane

**Fáze 7 píše dokument, který Česká spořitelna skutečně dostane**, podle 13sekční šablony Product Management Guildy. Je to jediná fáze, jejíž formát patří zákazníkovi (§1.1).

**Čte jediný dokument: odsouhlasené PRD.** Plus jazyk z briefu a Jira klíč ze záznamu běhu. Před začátkem ověří souhlas, protože PRD bez bloku souhlasu není A13 (část 2, R2.1).

**Otázka:** Co čte fáze 7?
- [x] Jen odsouhlasené PRD, jazyk z briefu a Jira klíč
- [ ] Všechny dokumenty běhu

**Proč:** Fáze 7 nic nového nesyntetizuje.

#### Tvrzení a nadpisy

**Každé tvrzení pochází z odsouhlaseného PRD, nebo je označené jako předpoklad.** Fáze nic nového nesyntetizuje (R3.1.3). **Žádná kontrola ale nesrovnává obsah iniciativy s PRD**, takže iniciativa může projít Q7 s tvrzením, které PRD nepodporuje (§8.1–8.2).

**Nadpisy píše systém v jazyce běhu.** Agent by šablonu zkopíroval v jejím jazyce a všechny kontroly by prošly (§1.5, část 4).

**Otázka:** Kontroluje Q7, že iniciativa říká totéž co PRD?
- [ ] Ano
- [x] Ne, obsah s PRD žádná kontrola nesrovnává

**Proč:** Iniciativu proto čtete proti PRD sami.

#### Jira klíč a čitelná kopie

**Jira klíč nikdy nevymýšlí agent.** Zadáte ho taskem `SPOCK: record the Jira key`, nebo napíšete `none yet`. Nový klíč zapíšete stejným taskem znovu (R3.1.5, část 10).

**Čitelná kopie bez strojového záznamu** vzniká taskem `SPOCK: stage 7 — the reading copy` ve složce `read/`. Iniciativa upravená po vzniku kopie neprojde bránou, dokud se kopie nevytvoří znovu (R3.1.7).

**Víc do hloubky:**
- **Žádný rozpad na epiky.** Pilot ho odstranil, protože by to byl delivery krok udělaný v discovery (§1.3).
- **Jira iniciativa (A15) je zaparkovaná** a nikdy nevznikla. Čeká se na rozhodnutí, která instance Jiry je ta správná. Neznamená to „pokus se nepovedl“, ale „nezkoušelo se a není napojené“ (§1.2).

**Otázka:** Upravíte iniciativu po vzniku čitelné kopie. Co dál?
- [ ] Nic
- [x] Vytvořím kopii znovu, jinak iniciativa neprojde bránou

**Proč:** Čitelná kopie musí odpovídat iniciativě.

#### G7 uzavírá běh

**G7 je poslední rozhodnutí a označí běh jako hotový.** Kdo podepisuje G7, podepisuje práci, jejíž tvar možná nevidí. Proto musí mít každé dřívější rozhodnutí v záznamu jméno a roli (část 9).

**Co fáze neopraví:** dobře formulovaná iniciativa pro špatný nápad projde Q7. Nic si nevšimne, když Guilda změní svou šablonu (konec specifikace).

**Otázka:** Projde Q7 dobře napsaná iniciativa pro špatný nápad?
- [x] Ano
- [ ] Ne

**Proč:** Kvalitu nápadu žádná kontrola neposuzuje.

### Úkoly

- [ ] **Porovnejte iniciativu s PRD** (25 min, ve VS Code)
  - *Proč:* Tohle žádná kontrola nedělá a u G7 to musíte udělat vy.
  1. Otevřete `fixtures/2026-09-digital-onboarding-dropoff/7-initiative/initiative.md` a `6-prd/2-prd-agreed.md`.
  2. U tří tvrzení v iniciativě najděte oporu v PRD.
  3. Najděte Jira klíč a porovnejte iniciativu s její čitelnou kopií v `read/7-initiative/`.

### Pro zvídavé (anglicky, ve vaší kopii SPOCKu)

- 📄 **`stage-specs/STAGE-7-SPEC.md`**, celé
- 📄 **`definitions/know-how/product/initiative-template.md`**: šablona Guildy

## Kvíz

Kvíz losuje 5 otázek z této zásoby. Pořadí otázek i možností se při každém spuštění zamíchá.

**1. Agent v briefu sám vybral key result „nejbližší tématu“ a zapsal ho. Je to v pořádku?**

   a) Ano, šetří čas
   b) Ne. Agent key resulty ukáže a doporučí, na které se podívat, ale vybíráte vy
   c) Ano, pokud je ze Strategy Basis

<details><summary>Odpověď</summary>

b) Key result se ve fázi 1 vyhledává, nevybírá ho agent (STAGE-1 R3.4.3).

</details>

**2. Příležitost stojí na dvou pozorováních od dvou různých lidí, ale jedno nemá úplnou provenienci. Jaký bude tag?**

   a) strong
   b) weak
   c) unrated

<details><summary>Odpověď</summary>

b) Strong chce dva a víc různých původů s úplnou proveniencí a aspoň jeden z první ruky. Jinak je důkaz weak.

</details>

**3. Řešení A má 12 touchpointů a všechny otázky zodpovězené. Řešení B má 12 touchpointů a 18 otázek `cannot_tell`. Co platí?**

   a) B je složitější
   b) Počet je stejný, B je jen méně známé
   c) B je jednodušší, má méně odpovědí

<details><summary>Odpověď</summary>

b) Nezodpovězené otázky počet touchpointů nemění. Řešení je jen méně známé.

</details>

**4. Ve fázi 5 jsou varianty „mobilní aplikace pro všechny klienty“ a „nejdřív web, potom aplikace“. Co je špatně?**

   a) Nic
   b) Druhá varianta je seřazená. Varianta nesmí být plán „nejdřív, potom“
   c) Varianty se překrývají

<details><summary>Odpověď</summary>

b) Varianty nesmí být preferované, seřazené ani podmnožinou jiné. Překryv je naopak v pořádku.

</details>

**5. Po souhlasu s PRD jste v draftu opravili jednu větu. Co platí?**

   a) Nic, odsouhlasené PRD se aktualizuje samo
   b) Draft se musí znovu označit jako odsouhlasený a odsouhlasené PRD se napíše znovu
   c) Oprava je zakázaná

<details><summary>Odpověď</summary>

b) Odsouhlasené PRD vzniká doslovně z draftu. Po změně draftu ho musíte označit znovu.

</details>

**6. Která kontrola v Q7 porovnává tvrzení iniciativy s odsouhlaseným PRD?**

   a) `C130`
   b) `C189`
   c) Žádná

<details><summary>Odpověď</summary>

c) Obsah iniciativy s PRD nesrovnává žádná kontrola. Porovnat je musíte sami.

</details>

**7. Kontrola ve fázi 2 selhala na věci, kterou agent může opravit. Kdo se to dozví první?**

   a) Agent. Opraví ji a vás se zeptá až potom
   b) Vy, jako výjimka k podpisu
   c) Workflow Support

<details><summary>Odpověď</summary>

a) Co může opravit agent, jde k agentovi. K vám jde jen selhání přijaté fáze nebo chybějící souhlas s PRD.

</details>

**8. Vrátili jste fázi 2. Fáze 3 a 4 už prošly bránou. V jakém jsou stavu?**

   a) `accepted`
   b) `stale`
   c) `superseded`

<details><summary>Odpověď</summary>

b) Každá pozdější fáze s výsledkem brány se označí jako zastaralá. Nic se nemaže.

</details>
