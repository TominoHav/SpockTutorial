# Týden 2 (16.–22. 11.): SPOCK jako uživatel

**Cíl:** Projdete jeden celý běh a všechny 4 testovací scénáře. Budete vědět, co má agent v každé fázi dělat a kdy se chová špatně.

**Proč:** Nejdřív to musíte umět používat, až pak měnit. Owner metodiky musí znát workflow z pohledu PM, který s ním pracuje.

## Po 16. 11. — Co SPOCK dělá a instalace

### Ke studiu (asi 60 min)

- 📄 **WORKFLOW-INTRODUCTION.md** — SPOCK-workflow-intro.zip · cca 30 min čtení
- 📺 **Prezentace SPOCK – The Discovery Workflow** — .pptx ve stejném zipu · místo čtení
- 📄 **Claude jako učitel** — Vložte BUSINESS-LOGIC-OVERVIEW.md: „Shrň mi to do 10 bodů pro začátečníka."

### Klíčové myšlenky

- SPOCK vede PM od problému k iniciativě v 7 fázích.
- Agentů je 6, skillů 17. Aktuální čísla vypíše facts.mjs.

### Úkoly

- [ ] **Nainstalujte SPOCK a ověřte nastavení** (20 min)
  - *Proč:* Bez správného nastavení se agenti chovají nepředvídatelně a nepoznáte, jestli je chyba ve SPOCKu, nebo v počítači.
  1. Projděte SETUP.md krok po kroku.
  2. Tasks: Run Task → SPOCK: check my setup.
  3. Opravte, co task označí, a spusťte ho znovu.
- [ ] **Nechte SPOCK popsat sám sebe** (10 min)
  - *Proč:* Čísla (skilly, agenti, kontroly) nikdy neopisujte z dokumentů. Vždy je zjistíte tímto taskem.
  1. Tasks: Run Task → SPOCK: what this build can say about itself.
  2. Ověřte 17 skillů a 6 agentů.
- [ ] **Projděte ukázkový běh** (60 min)
  - *Proč:* Uvidíte, jak vypadá hotový výstup každé fáze. Podle toho pak poznáte, když se agent odchýlí.
  1. Rozbalte SPOCK-sample-runs.zip.
  2. V běhu 2026-09-payment-status-clarity otevírejte složky 1-brief až 7-initiative.
  3. U každé si zapište jednou větou, co z ní vzešlo.
- [ ] **Dohledejte tvrzení zpět ke zdroji** (30 min)
  - *Proč:* Dohledatelnost je hlavní slib SPOCKu. Jako owner metodiky ji musíte umět ověřit.
  1. V 7-initiative vyberte jedno tvrzení.
  2. Hledejte ho zpět přes PRD, řešení a příležitosti.
  3. Skončete v 2-problems/1-problem-material.md.

## Út 17. 11. — Fáze 1 a 2: brief a problémy

### Ke studiu (asi 30 min)

- 📄 **TESTER-GUIDE.md** — specifications/onboarding
- 📄 **Scénář 1 – INSTRUCTIONS.md** — SPOCK-testing-scenarios.zip

### Klíčové myšlenky

- Na název, jméno a roli se ptá task SPOCK: start a run, ne agent.
- Schválení (G) dělá vždy člověk svým jménem přes task.

### Úkoly

- [ ] **Založte běh** (10 min)
  - *Proč:* Jméno a roli zadává task, ne agent. Každé rozhodnutí je tak podepsané člověkem.
  1. Tasks: Run Task → SPOCK: start a run.
  2. Zadejte název (2026-11-moje-zkouska), své jméno a roli.
- [ ] **Projděte fázi 1 se schválnou chybou** (45 min)
  - *Proč:* Ověříte, že agent opravdu hlídá metodiku: outcome má být změna chování, ne řešení.
  1. V Copilot Chatu zvolte agenta Product Manager.
  2. Jako outcome napište „postavit kalkulačku".
  3. Sledujte, jestli navrhne přeformulování. Zapište do RESULT-SHEET.md.
- [ ] **Schvalte brief** (15 min)
  - *Proč:* Uvidíte, co se zapíše, když rozhodnete. Tenhle záznam budete od ledna číst nejčastěji.
  1. Až agent požádá o review, napište, že souhlasíte.
  2. Tasks: Run Task → SPOCK: approve what is in front of me.
  3. Otevřete runs/<id>/RUN-STATE.md a najděte svůj podpis.
- [ ] **Projděte fázi 2** (50 min)
  - *Proč:* Fáze 2 je jádro discovery: z materiálu vzniknou příležitosti. Materiál přitom čte agent v karanténě.
  1. Zvolte agenta Opportunity Designer.
  2. Tasks: Run Task → SPOCK: add problem material a vložte materiál ze scénáře.
  3. Projděte až po seřazené příležitosti O1, O2…

## St 18. 11. — Fáze 3 a 4: trh a řešení

### Ke studiu (asi 20 min)

- 📄 **MARKET-SCAN-PROMPT-instructions v1.3** — SPOCK-Workflow Documentation

### Klíčové myšlenky

- Fáze 3 nemá rozhodnutí člověka. Celou ji přijímá brána Q3.
- Ve fázi 3 musí být každý zdroj stránka, kterou agent opravdu otevřel.

### Úkoly

- [ ] **Fáze 3 s vyhledáváním** (45 min)
  - *Proč:* Uvidíte, jak agent hledá konkurenci a jak musí citovat stránky, které opravdu otevřel.
  1. Zvolte agenta Competitive Analysis.
  2. Nechte ho hledat a zkontrolujte 2 citace: vede odkaz opravdu na tu stránku?
- [ ] **Fáze 3 s vlastním souborem trhu** (30 min)
  - *Proč:* V bance nebude vždy dovolené hledat na webu. Tak poznáte druhou cestu.
  1. Připravte soubor podle MARKET-SCAN-PROMPT-instructions.
  2. Pusťte fázi 3 znovu a porovnejte karty konkurentů.
- [ ] **Fáze 4: vyberte řešení** (45 min)
  - *Proč:* Výběr řešení je rozhodnutí člověka. Naučíte se task, který ho zapíše i s volbou.
  1. Zvolte agenta Product Manager a projděte nápady.
  2. Tasks: Run Task → SPOCK: approve and record which one I chose.

## Čt 19. 11. — Fáze 5 až 7: MVP, PRD a iniciativa

### Ke studiu (asi 15 min)

- 📄 **Claude jako učitel** — Vložte výstup fáze 6: „Co v tom PRD chybí a proč?"

### Klíčové myšlenky

- Fáze 6 a 7 vede agent Business Analyst.

### Úkoly

- [ ] **Fáze 5: přidejte vlastní variantu MVP** (40 min)
  - *Proč:* Ověříte, že agent pracuje s vaším vstupem a nepřepíše ho.
  1. Až agent navrhne varianty, přidejte jednu svou.
  2. Sledujte, jak s ní naloží.
- [ ] **Fáze 6 a 7: PRD a iniciativa** (60 min)
  - *Proč:* S tímhle výstupem jde PM dál. Jako owner budete posuzovat, jestli má správnou kvalitu.
  1. Zvolte agenta Business Analyst.
  2. V PRD si přečtěte prohlášení o souladu se strategií.
  3. Dokončete iniciativu.
- [ ] **Zkontrolujte celý běh** (20 min)
  - *Proč:* Takhle budete od ledna ověřovat běhy, které vám PM pošlou.
  1. Tasks: Run Task → SPOCK: check the whole run.
  2. Tasks: Run Task → SPOCK: how the workflow performed.

## Pá 20. 11. — Scénáře 2–4: když jde něco špatně

### Ke studiu (asi 20 min)

- 📺 [Prompt Injection, explained](https://www.youtube.com/watch?v=FgxwCaL6UTA) — Simon Willison · ke scénáři 3

### Klíčové myšlenky

- Scénář 2: neúplné odpovědi. Agent nesmí domýšlet, chybějící údaje patří do unknowns.
- Scénář 3: podstrčená instrukce v materiálu (prompt injection). Proto je ve fázi 2 karanténa.
- Scénář 4: změna názoru. Fázi jde vrátit, rozhodnutí vzít zpět nebo nahradit.

### Úkoly

- [ ] **Scénář 3: podstrčená instrukce** (45 min)
  - *Proč:* Prompt injection je největší bezpečnostní riziko agentů. Musíte vidět, jak se SPOCK brání.
  1. Projděte INSTRUCTIONS.md scénáře 3.
  2. Sledujte, co agent s podstrčeným pokynem udělá.
  3. Zapište do RESULT-SHEET.md.
- [ ] **Scénáře 2 a 4 zkráceně** (45 min)
  - *Proč:* Neúplné odpovědi a změna názoru jsou nejčastější situace v praxi.
  1. Scénář 2: odpovídejte neúplně a sledujte, co se objeví v unknowns.
  2. Scénář 4: vyzkoušejte SPOCK: send a stage back to be redone a SPOCK: take something back.
- [ ] **Vyzkoušejte nouzová tlačítka** (15 min)
  - *Proč:* Až vám PM zavolá, že něco nefunguje, musíte vědět, co poradit.
  1. SPOCK: explain what the gate failed.
  2. SPOCK: stop this run.
- [ ] **Požádejte Igora o celý repozitář** (10 min)
  - *Proč:* Kontrolní bod 20. 11. Bez repozitáře nejdou dokončit Týdny 4 a 5.
  1. Napište Igorovi, že potřebujete celý git repozitář včetně stavebních skriptů a testů.

## Kvíz

**1. Jaký je rozdíl mezi bránou Q a G?**

   a) Q kontroluje kód, G rozhoduje člověk svým jménem
   b) Q je pro fáze 1–3, G pro 4–7
   c) Žádný, jsou to synonyma

<details><summary>Odpověď</summary>

a) Q kontroluje kód, G rozhoduje člověk svým jménem — Kvalitní brána (Q) je mechanická kontrola. Rozhodovací brána (G) je podpis člověka.

</details>

**2. Proč agent nemůže schválit G bránu sám?**

   a) Nemá na to dost tokenů
   b) Jméno a roli zadává člověk do okna tasku, které agent vyplnit neumí
   c) Schvalování je zakázané jen v pátek

<details><summary>Odpověď</summary>

b) Jméno a roli zadává člověk do okna tasku, které agent vyplnit neumí — Task používá ${input:...}. Okno vyplní jen člověk, takže schválení bez člověka nevznikne.

</details>

**3. Proč Material Intake nemá přístup na web ani k jiným souborům?**

   a) Kvůli rychlosti
   b) Čte cizí materiál, který může obsahovat podstrčené pokyny
   c) Je to starší agent

<details><summary>Odpověď</summary>

b) Čte cizí materiál, který může obsahovat podstrčené pokyny — Agent v karanténě nemůže podstrčený pokyn proměnit v akci. To je obrana proti prompt injection.

</details>
