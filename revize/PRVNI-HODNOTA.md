# Od tréninku k adopci: první hodnota ve SPOCKu

Hodnocení onboardingu podle jednoho měřítka: **jak rychle a spolehlivě se nový uživatel dostane k vlastní práci ve SPOCKu bez instruktora.** Stav k 17. 11. 2026, tutoriál na commitu `6869c83`, SPOCK 1.16.1 (`d39b014`).

Značky u tvrzení: **[kód]** ověřeno ze zdrojáků, **[dok]** doloženo dokumentací, **[hyp]** hypotéza k ověření, **[?]** nevíme.

---

## 1. Současný stav

### Co funguje
- Jeden zdroj obsahu (`onboarding/*.md`) → web, průvodce v Claude Code i v Copilotu. Údržba proti verzi SPOCKu (`kontrola-aktualnosti.py`, `spock-otisk.json`). **[kód]**
- 9 modulů, 46 lekcí, 162 karet, 72 kvízových otázek, 93 úkolů. **[kód]** Testy: journey 209, scénáře 119, přístupnost 88, výkon 10, Safari 2 × 101. Číslo „217 testů“ ze zadání neodpovídá žádné sadě. **[kód]**
- Pokrok pod účtem a měření průchodu jmenovitě s dashboardem (`web/track.js`). **[kód]**

### Dnešní cesta k první vlastní práci (PM)
Role → rozcestí (celá cesta / expres 1 h 40 min) → **úroveň 0** (87 min, jen teorie a web) → **úroveň 1** (316 min: REDIM, instalace, Copilot, ukázkový běh 60 + 30 min) → modul PM → **2P.1, první vlastní běh**. Další modul se odemkne až při 80 % předchozího (`isLocked`, `app.js:219`). **[kód]**

**Odhad tutoriálu do podpisu G1 na vlastním tématu je 514 min aktivní práce, k tomu dny čekání na schválení rolí v REDIMu.** **[kód]** Z 46 lekcí vede k první hodnotě přímo jen 1.1 (přístupy), 1.2–1.4 (instalace a kontrola) a 2P.1. PD a SWE se k vlastnímu běhu v modulech nedostanou vůbec (2D.2 „veďte fázi 2“ je volitelné). **[kód]**

### Co brzdí
| Bariéra | Důkaz |
|---|---|
| Přístupy se objednávají pozdě. Expresní cesta je měla jako 6. krok, až po ~50 min teorie. | `EXPRESS` v `app.js` **[kód]**; „schválení může trvat dny“ (lekce 1.1) **[dok]** |
| Expresní cesta končí bez jediného kroku ve SPOCKu. | `EXPRESS` **[kód]** |
| Před vlastní prací je teorie a ukázkový běh. | úrovně 0 a 1 **[kód]** |
| Gamifikace roste rychleji než důkazy (XP, hodnosti, vzhledy, světy, minihry, příběh, série, týmy: PR #43–#72). Nic neříká, že zvyšuje adopci. | historie v `ARCHITEKTURA.md` **[kód]**, účinek **[?]** |
| Pauza delší než 5 min v chatu zdražuje další zprávy (medián 100 kreditů proti 11). U uživatele, kterého neustále přerušují, to vadí. | `SETUP.md` §6.8 **[dok]** |

### Co jde měřit a co ne
- **Jde měřit:** návštěvy, aktivní čas, kliky, odpovědi na karty a kvízy, odchylky agentů („Co jste viděli“). **[kód]**
- **Nejde ověřit:** že kdokoli SPOCK použil. 64 z 93 úkolů je jen zaškrtávátko. 29 „ověření“ jsou otázky se stejnou odpovědí pro všechny a některé ji prozrazují v nápovědě (u G1 v 2P.1 tomu tak bylo do této změny). **[kód]** Běhy jsou jen na počítači uživatele a do gitu se nedostanou (`SETUP.md` §6), stopy Copilota jsou lokální. Žádná telemetrie ze SPOCKu není. **[dok]**
- **Nevíme:** výchozí data z bootcampu, co znamená „2–4 MD“, výsledky pilotu s nováčky (`PILOT-S-NOVACKY.md` neproběhl, `TODO-VLASTNIK.md` C), skutečná data z dashboardu (jsou jmenovitá a souhlas pověřence chybí, proto jsem je nečetl), rozdíly `csas-dev/spock-pilot` proti kopii. **[?]**

### Zásadní kontext
- **SPOCK je v pilotu pro vybrané týmy a vybrané lidi.** Plošné nasazení se teprve plánuje (product overview, kap. 3). **[dok]** Oprávněných uživatelů je tedy málo, experimenty budou malé a „škálovat onboarding“ je zatím předčasné.
- **Bootcamp není přednáška.** Jsou to 2 dny, kdy tria pracují na skutečném tématu do PRD a iniciativy s facilitátory a s technickým nastavením hotovým předem (`bootcamp-onboarding-storyline.pdf`). **[dok]** Nahrazujeme tedy facilitovanou práci, ne výuku. Tomu musí odpovídat i srovnání.
- **„2–4 MD“ je potřeba upřesnit.** Bootcamp podle podkladů vede 4–5 lidí (CoE lead, GM, 2 techničtí facilitátoři) 2 dny, plus příprava. Účastník tráví 2 dny. Na trio jsou to 2 × 3 = 6 MD účastníků. Úspora se dá spočítat až po rozlišení instruktorské a účastnické práce. **[?]**

---

## 2. Definice produktu

**Vision:** Každý oprávněný člen tria se dostane od nuly k samostatné práci ve SPOCKu na vlastní iniciativě bez bootcampu.

**Segmenty**
| Segment | První hodnota (First Value) | Poznámka |
|---|---|---|
| **PM s živou iniciativou v pilotním týmu** (primární) | Fáze 1 jeho běhu schválená, G1 podepsal on | Jediný segment, kde dnes umíme první hodnotu ověřit |
| PD a SWE v triu | Vlastní příspěvek do běhu tria: materiál do fáze 2 (PD), technické posouzení před G4 (SWE) | Ověření z běhu zatím chybí |
| GM, správce know-how | Metodické posouzení běhu | Hlubší modul, instruktor dává smysl dál |
| Bez přístupu nebo bez iniciativy | Není oprávněný | Netlačit. Dnes jen orientace (úroveň 0) |

**JTBD (PM):** „Když mám rozpracovanou iniciativu a málo času, chci dostat brief, který obstojí před vedením, bez učení nového nástroje, abych mohl/a rychle přejít k ověřování problému.“ **[hyp]**

**Product Promise:** první ověřený výsledek ve SPOCKu na vlastním tématu v jednom sezení po zpřístupnění. **[hyp]**

**Úprava slibu 15 minut:** Od pozvánky je to nesplnitelné, protože schválení rolí trvá dny. Měříme proto odděleně:
- **TTFA** = pozvánka → první sezení ve SPOCKu, s rozpadem na *pozvánka → přístupy schválené → setup prošel → první sezení*,
- **TTFV** = začátek prvního sezení → G1 podepsané.

15 min drží jako cíl pro **první užitečnou zpětnou vazbu** (agent u vlastního briefu ukáže slabá a chybějící pole). Pro G1 je realistický odhad 30–45 min aktivního času: rozhovor po jednom poli, kontrola Q1, podpis. **[hyp]**

---

## 3. Opportunity Solution Tree

```
Business outcome: méně instruktorské práce na onboarding při stejné nebo lepší samostatné kompetenci
└─ Product outcome: % oprávněných startujících s ověřenou první hodnotou (G1) a TTFV
   ├─ O1 Přístupy trvají dny a lidé je objednají pozdě ............. [dok]
   │   ├─ S: přístupy jako 1. krok (HOTOVO)        E: měřit dny od objednání po schválení u 10 lidí
   │   └─ S: objednání rolí hromadně za tým před startem   E: porovnat TTFA s individuálním objednáním
   ├─ O2 Nevědí, proč by měli SPOCK zkusit právě teď ............. [hyp]
   │   └─ S: pozvánka „nechte si posoudit brief vaší iniciativy“ místo „naučte se SPOCK“   E: A/B text pozvánky, měřit TTFA
   ├─ O3 Před vlastní prací je 8,5 h teorie a ukázkového běhu ...... [kód]
   │   └─ S: „Rychlý start: váš první brief“ (1.1 → 1.2–1.4 → 2P.1, bez zámků)   E: 5 PM se stopkami
   ├─ O4 Nevíme, jestli kdo SPOCK skutečně použil .................. [kód]
   │   └─ S: důkaz z běhu (RUN-STATE.md) u G1 (HOTOVO), dál G2 a check my setup
   ├─ O5 Přerušení zdražuje a láme sezení ......................... [dok]
   │   └─ S: hranice sezení na hranici fáze, návod „jak se vrátit“   E: pozorování
   └─ O6 Po prvním běhu se vrátí ke starým postupům ............... [hyp]
       └─ S: druhý úkol bez návodu (G2 do 7 dní)   E: kohorta, důkaz z běhu G2
```

---

## 4. Nejkratší cesta k první hodnotě (příklad)

**PM Jana, iniciativa „předčasné splacení hypotéky online“.** Všechny kroky existují ve SPOCKu 1.16.1 nebo v tutoriálu.

| Kdy | Co Jana dělá | Čas | Zdroj |
|---|---|---|---|
| Den 0, mezi schůzkami | Otevře tutoriál, vybere expres, **1. krok: objedná 3 role v REDIMu** | 10 min | lekce 1.1 |
| Den 0–N, čeká | Sepíše 8 polí briefu vlastními slovy. Tuhle práci by dělala tak jako tak. | 20 min | 2P.1, struktura z bootcampu |
| Den N, přístupy schválené | Instalace z katalogu, klon, `SPOCK: check my setup` prošel, vidí 6 agentů | 45–60 min | 1.2–1.4, `SETUP.md` §1–5 (SETUP slibuje 15 min bez firemních kroků) |
| Den N+, jedno sezení | Product Manager → `Start a discovery run.` → `SPOCK: start a run` → přiloží svůj brief → agent doptává po jednom poli → kontrola Q1 → `SPOCK: approve what is in front of me` | 30–45 min | `SETUP.md` §6, 2P.1 |
| hned potom | Vloží `RUN-STATE.md` do úkolu „Schvalte brief (G1)“ → **první hodnota ověřená z běhu** | 1 min | nové v této změně |
| do 7 dní, sama | Dá vlastní materiál do `2-problems/supplied/` → fáze 2 → G2. Když se zasekne, zeptá se Workflow Support. | 60+ min | 2P.2, `SETUP.md` §6.5 |

---

## 5. Pro člověka s 5 minutami mezi schůzkami

1. **Prvních 5 minut je objednání přístupů, ne teorie.** Dnešní minuta se tím promění v čas, kdy schvalování běží samo.
2. **Čekání na přístupy vyplní práce, kterou dělá tak jako tak:** brief vlastními slovy. Výsledek se dá použít i bez SPOCKu.
3. **Jedno nepřerušené sezení na fázi 1 (30–45 min).** Přerušení v chatu stojí kredity, proto doporučit: zablokovat si slot a fázi dokončit. Běh je uložený na disku, a když sezení přeruší, pokračuje v novém chatu (`SETUP.md` §6.8). **[dok]**
4. **Teorie jen když je potřeba:** karty 0.1–0.3 a „Proč to tak je“ jako volitelné, ne jako vstupní brána.
5. **Návrat bez hledání:** tutoriál už nabízí „Pokračovat, kde jste skončil(a)“ **[kód]**. SPOCK sám ví, kde běh stojí (Workflow Support). **[dok]**

---

## 6. Měření

| Metrika | Výpočet | Zdroj dnes | Omezení |
|---|---|---|---|
| **TTFA** | medián a P80 (první sezení ve SPOCKu − pozvánka), rozpad na přístupy a setup | pozvánka a REDIM: ručně; setup: zatím jen otázka v 1.4 | bez důkazu ze setupu jen přibližně |
| **Activation** | ověřená první hodnota (`fv.lvl = run`) / oprávnění, kdo začali | `track/<člověk>.fv` **(nové)** | zdroj je záznam o průchodu tutoriálem; kdo SPOCK použije bez tutoriálu, nezapočítá se |
| **TTFV** | `fv.at − first`, P50/P80/P90; kdo první hodnoty nedosáhl, je ve jmenovateli jako „> 15 / 45 min“ | `fv.at` **(nové)**, `first` (už bylo) | je to *uplynulý* čas od první návštěvy tutoriálu včetně čekání na přístupy; aktivní čas je v `secs` po stránkách |
| % do 15 / 45 min | podíl všech startujících | jako výše | |
| **Síla důkazu** | počet hotových úkolů podle ověření: `self`, `proof`, `seen`, `run`, `runself` | `track.ver` **(nové)** | |
| **Independent success** | G2 ověřené z běhu do 7 dní bez žádosti o pomoc | zatím ne (další krok: důkaz u G2) | „bez pomoci“ jen z pozorování nebo dotazu |
| **Repeat / adoption 7 a 30 dní** | nový běh nebo další brána | **nejde pozorovat**, běhy jsou lokální | potřebuje podporu na straně SPOCKu (trust index, SPOCK-origin ratio z product overview) |
| **Instructor effort** | hodiny facilitátorů na trio nebo člověka | ručně, výkaz | baseline chybí |
| Guardrails | odchylky agentů (už se měří), neprošlé brány podepsané bez důvodu, dotazy na Spocka „nevím jak“, chyby v datech | dashboard, záznamy běhu | |

Události a vlastnosti, které tahle změna přidala do záznamu průchodu: `úkol <klíč> bez ověření | otázka | co viděli | z běhu | bez důkazu`, `první hodnota G1 ověřeno z běhu | bez důkazu`, `důkaz z běhu G1 nesedí`. Trvale (mimo kruhový buffer 300 kroků) se ukládá `fv {at, lvl, gate, selfAt}` a `ver {...}`. **Jméno, obsah běhu ani název iniciativy se neukládají.** Ukládá se jen datum podpisu a 32bitový otisk názvu běhu. Jmenovité měření jako celek dál čeká na souhlas pověřence (`TODO-VLASTNIK.md` A).

---

## 7. Ověření: nejmenší experimenty

| # | Riziko (Cagan) | Předpoklad | Experiment | Úspěch / neúspěch | Rozhodnutí |
|---|---|---|---|---|---|
| E1 | Viability | Přístupy jsou největší zdržení TTFA | Další 10 lidí: datum objednání a schválení 3 rolí (REDIM) | medián > 3 dny → hlavní páka je mimo tutoriál | Domluvit s IT hromadné přidělení rolí pilotním týmům |
| E2 | Value | PM vyzkouší SPOCK, když nabídka zní jako pomoc s jeho briefem | 2 varianty pozvánky (po ~6 lidech), měřit kliknutí a TTFA | rozdíl ≥ 2× ve startu do 7 dní | Přepsat úvod a pozvánku |
| E3 | Usability | PM s připravenými přístupy dojde k G1 sám za ≤ 45 min | 5 PM, vlastní téma, pozorování bez nápovědy (protokol jako `PILOT-S-NOVACKY.md`, sezení 2) | ≥ 4/5 G1 bez pomoci; < 3/5 → oprava zaseknutých míst | Zavést „Rychlý start“ jako výchozí pro PM |
| E4 | Value/Usability | Po prvním běhu zvládne další fázi sám | Stejných 5 lidí: G2 do 7 dní, důkaz z běhu | ≥ 3/5 | Pokračovat k srovnání kohort |
| E5 | Viability | Self-service nahradí bootcamp bez ztráty kompetence | Kohorta A (příští bootcamp) a kohorta B (self-service + 1 h office hours), 2–3 tria v každé, stejné úkoly: G1 a G2 do 7 dní, hodnocení kvality briefu GM naslepo, hodiny instruktorů | B ≥ A v podílu G1 a G2 a v kvalitě, ≥ 80 % méně instruktorských hodin | Nahradit bootcamp pro PM segment, zbytek ponechat |

**Limity:** při n = 5 až 15 jde jen o směr, ne o statistický důkaz. Rozhoduje se podle velkých rozdílů a podle toho, kde se lidé zasekávají, ne podle procent.

**Rozhodovací rámec:** *pokračovat v testu*, když E3 dá 3/5. *Opravit tření*, když se aspoň 2 lidé zaseknou na stejném místě. *Nahradit pro segment PM*, když E5 splní všechna kritéria. *Ponechat instruktora* pro GM a pro tria bez živé iniciativy. *Škálovat* až po plošném nasazení SPOCKu.

---

## 8. Backlog podle dopadu

**Hotovo v této změně**
1. Přístupy jako 1. krok expresní cesty.
2. Důkaz z běhu u G1 (první hodnota ověřená, ne zaškrtnutá) a oddělený záznam „bez důkazu“.
3. Měření `fv` a `ver`.

**Experimenty (další na řadě)**
4. **„Rychlý start: váš první brief“ pro PM:** 1.1 → 1.2–1.4 → 2P.1 bez zámků a bez ukázkového běhu, se ~4 kartami pravidel (data, kdo rozhoduje). Zapnout jako variantu pro E3, ne jako výchozí. *Velký dopad na TTFV, střední pracnost.*
5. Pozvánka a úvod ve dvou variantách (E2).

**UX a obsah**
6. Odstranit úkol „Projděte brief se schválnou chybou“ z cesty k první hodnotě (45 min, cvičení metodiky, ne výsledek). Přesunout do 3.x.
7. Nápovědy u „Ověření“, které prozrazují odpověď: přepsat tak, aby říkaly *kde* hledat, ne *co*. Projde je odborná kontrola.
8. Důkaz z běhu i pro G2 (2P.2) a pro výstup `SPOCK: check my setup` (1.4). Pro setup je potřeba ověřit formát poslední řádky v `setup-check.mjs`.
9. První hodnota pro PD a SWE: příspěvek do běhu tria, ověřitelný z `RUN-STATE.md` (owner nebo decision u fáze 2, resp. 4).

**Měření**
10. Dashboard: dlaždice „První hodnota ověřená / bez důkazu / TTFV P50, P80“ z `fv`. *Až po souhlasu pověřence s jmenovitým měřením.*

**Neodkládat mimo tutoriál**
11. Hromadné přidělení rolí v REDIMu pro pilotní týmy (IT, vlastník SPOCKu).
12. Spolupráce se SPOCK týmem: krátký „first run“ režim v agentovi Workflow Support a jedna hodnota pro adopci (trust index, SPOCK-origin ratio). Tutoriál nemá měnit `.github/` ve SPOCKu (`SETUP.md` §9).

**Nedělat**
- Další gamifikaci (vzhledy, světy, minihry, týmové žebříčky) ani další videa, dokud E3 a E5 neukážou, že brzdou je motivace v tutoriálu.
- AI generování obsahu, vlastní backend nebo PWA kvůli onboardingu.
- Digitalizaci celého bootcampu do dalších karet.
- Integraci, která by četla `runs/` automaticky. Běhy mohou obsahovat klientská data a mají zůstat na počítači uživatele.

---

## 9. Implementace

| Změna | Soubory | Výsledek | Testy |
|---|---|---|---|
| Nový typ ověření `*Důkaz z běhu:* G1` | `web/parse.py` (parser; `SAMPLES` z `nastroje/spock-otisk.json`), `onboarding/role-pm.md` (2P.1) | Úkol G1 se odškrtne jen platným `RUN-STATE.md` vlastního běhu | `scenare.js` „důkaz z běhu“ (8 kontrol) |
| Ověření v prohlížeči | `web/app.js` (`runEvidence`, `runBlock`, obsluha `data-runev` / `data-runself`), `web/sim.css` | Ukázkový běh, chybějící podpis, neschválená fáze, podpis od agenta a cizí text se odmítnou se srozumitelným důvodem | ověřeno i na skutečných `RUN-STATE.md` ze SPOCKu (nový formát `decision_gates` i starší `decision_gate`, CRLF) |
| Měření síly důkazu a první hodnoty | `web/app.js` (událost `úkol`), `web/track.js` (`tSnapshot`: `fv`, `ver`; `pMerge`: `runev`, `selfok`, `fv`) | Odlišení ověřeného a samohlášeného postupu | `scenare.js` (stav po ověření, nic citlivého se neuloží) |
| Přístupy první | `web/app.js` (`EXPRESS`), `nastroje/e2e/scenare.js` | Kratší TTFA o čas teorie před objednáním | `scenare.js` „expresní cesta“ |

**Rizika:** formát `RUN-STATE.md` se může s verzí SPOCKu změnit. Validátor proto odkazuje na `run-state.mjs` a měsíční kontrola aktuálnosti ho má hlídat. Uživatel může záznam podvrhnout: jde o důkaz ze SPOCKu, ne o kryptografické ověření, a v datech je proto označený jako „z běhu“, ne jako „ověřeno systémem“. `csas-dev/spock-pilot` může mít jiný formát (`TODO-VLASTNIK.md` C).

**Definition of Done pro další přírůstky:** zelené `kontrola-struktury`, `kontrola-odpovedi`, journey, scénáře, přístupnost a výkon. Nový úkol jen na konec lekce. Řádek v historii `ARCHITEKTURA.md`. Žádné tvrzení o zlepšení adopce bez dat z E3 a E5.
