# Úroveň 1: Základy (všichni, 3–4 h)

**Cíl:** Umíte vysvětlit, co SPOCK dělá a co ne, znáte 7 fází, 6 agentů a rozdíl mezi Q a G bránou a přečtete hotový běh od iniciativy zpátky k materiálu.

**Proč:** Bez téhle mapy nepoznáte, jestli se agent chová správně. Každá role, PM, designer i engineer, potřebuje vědět, v jaké fázi se nachází a kdo v ní rozhoduje.

## 1.1 — Co SPOCK dělá

### Ke studiu (asi 45 min)

- 📄 **`specifications/BUSINESS-LOGIC-OVERVIEW.md`**, sekce 0–3. Sekce 0 („co je postavené a co nikdo nedokázal“) čtěte jako první.
- 📄 **Claude jako učitel:** vložte sekci 3 a napište: „Vysvětli mi těchto 7 fází, jako bych byl/a nový/á v produktovém týmu. Ke každé fázi jedna věta.“

### Klíčové myšlenky

- **SPOCK vede iniciativu od briefu až k iniciativě připravené pro delivery** v 7 fázích. Kromě průzkumu trhu (fáze 3) rozhoduje v každé fázi člověk.
- **Metoda je Opportunity Solution Tree:** outcome → problémy → příležitosti → řešení. Každá fáze smí číst jen to, co vyprodukovaly fáze před ní, takže se dá zpětně dohledat, na čem které rozhodnutí stojí (`BUSINESS-LOGIC-OVERVIEW.md` §2).
- **SPOCK netestuje.** Nedělá experimenty, prototypy ani validaci se zákazníky. Končí definicí iniciativy, testování přichází až v Execution (`method-canon.md` §3).

| Fáze | Co vznikne | Agent | Kdo rozhoduje |
|---|---|---|---|
| 1 | Brief (A1) | Product Manager | G1: přijmete brief |
| 2 | Problémy a příležitosti (A2b–A4) | Opportunity Designer | G2: potvrdíte a seřadíte |
| 3 | Trh: konkurence a trendy (A5–A7) | Competitive Analysis | nikdo, přijme ji Q3 |
| 4 | Řešení a výběr jednoho (A8, A9) | Product Manager | G4: vyberete jedno |
| 5 | Varianty MVP a rozpracování vybrané (A10, A11) | Product Manager | volba varianty, pak G5b |
| 6 | PRD (A12 draft, A13 agreed) | Business Analyst | G6: odsouhlasíte |
| 7 | Iniciativa pro delivery (A14) | Business Analyst | G7: schválíte |

### Úkoly

- [ ] **Nechte SPOCK popsat sám sebe** (10 min)
  - *Proč:* Čísla (kolik je kontrol, běhů, skillů) neopisujte z dokumentů, protože stárnou. Vždy je zjistí tento task.
  1. Tasks: Run Task → `SPOCK: what this build can say about itself`.
  2. Najděte ve výpisu počet agentů a počet registrovaných kontrol a zapište si je do deníku.
- [ ] **Pojmenujte, co SPOCK neumí** (15 min)
  - *Proč:* Superuser musí kolegům poctivě říct, co SPOCK neprokazuje. Jinak budou výstupu věřit víc, než si zaslouží.
  1. V `BUSINESS-LOGIC-OVERVIEW.md` §0 najděte tři řádky, které jsou „designed“ nebo „never produced“ (např. Jira iniciativa, automatické spouštění fází).
  2. Zapište si je do deníku vlastními slovy.

## 1.2 — Agenti, tasky a brány

### Ke studiu (asi 30 min)

- 📄 **`specifications/onboarding/TESTER-GUIDE.md`** §3.1 a §3.2
- 📄 **`BUSINESS-LOGIC-OVERVIEW.md`** §4 (kdo rozhoduje) a §8 (slovník)

### Klíčové myšlenky

- **Šest agentů.** Čtyři vedou fáze: Product Manager, Opportunity Designer, Competitive Analysis a Business Analyst. Dva pomáhají a nic nepíší: **Workflow Support** řekne, kde běh stojí a co dál, **Methodology Coach** odpovídá na otázky k metodě.
- **Q brána (Q1–Q7)** je automatická kontrola kódem, kterou spouští někdo jiný než agent, který dokument napsal. **G brána (G1, G2, G4, G5b, G6, G7)** je vaše rozhodnutí, zapsané s vaším jménem, rolí a datem.
- **Každá fáze má stejný rytmus:** agent ověří vstupy → pracuje a ptá se → zapíše → spustí kontrolu a sám opraví, co našla → teprve pak vás požádá o schválení → vy schválíte taskem → agent řekne, co přijde dál a kdo to povede (`TESTER-GUIDE.md` §3.2).
- **Žádná fáze nezačne sama.** Další fázi spustíte tak, že vyberete jejího agenta.

### Úkoly

- [ ] **Nakreslete si rytmus jedné fáze** (15 min)
  - *Proč:* Když víte, jaký krok má přijít, okamžitě poznáte, když agent nějaký přeskočí. Například když vás žádá o schválení dřív, než proběhla kontrola, je to chyba (`TESTER-GUIDE.md` §3.2).
  1. Do deníku napište 7 kroků z §3.2 vlastními slovy.
  2. U každého kroku poznamenejte, kdo ho dělá: agent, task, nebo vy.
- [ ] **Zeptejte se Methodology Coache** (15 min)
  - *Proč:* Coach odpovídá jen z psaného kánonu metody, ne z paměti, a má říct, odkud odpověď bere.
  1. Nový chat → agent **Methodology Coach**.
  2. Zeptejte se: „Proč fáze 3 nemá rozhodnutí člověka?“
  3. Zkontrolujte, jestli odpověď odkazuje na konkrétní dokument. Zapište si to.

## 1.3 — Čtení hotového běhu

### Ke studiu (asi 15 min)

- 📄 **`BUSINESS-LOGIC-OVERVIEW.md`** §5 (artefakty a záznamy)
- 📄 **`fixtures/README.md`**: ukázkové běhy jsou vymyšlené a slouží jako příklad, ne jako důkaz

### Klíčové myšlenky

- **Běh je složka.** Uvnitř jsou fáze `1-brief` až `7-initiative`, `records/` (strojové záznamy), `read/` (čistá kopie iniciativy), `RUN-STATE.md` (stav a podpisy) a `README.md` (titulní stránka).
- **Titulní stránka běhu** (`README.md`) říká, kde běh stojí, a jmenuje tři dokumenty, které z běhu odcházejí: brief, schválené PRD a iniciativu.
- **Artefakt jsou dva soubory:** dokument pro čtenáře a záznam pro kontroly. Tabulka v hlavičce dokumentu (front matter) je záměrná. Když se v náhledu zobrazuje jako `[object Object]`, je to rozšíření VS Code (`TESTER-GUIDE.md` §2.5).

### Úkoly

- [ ] **Projděte ukázkový běh** (60 min)
  - *Proč:* Uvidíte, jak vypadá správný výstup každé fáze, a na vlastním běhu pak poznáte odchylku.
  1. Otevřete `fixtures/2026-09-spending-insights/README.md`. Tento běh je česky a je hotový (7/7). Kdo radši čte anglicky, může použít `fixtures/2026-01-mortgage-onboarding/`.
  2. Otevírejte postupně dokumenty ve složkách `1-brief` až `7-initiative`. Ve `1-brief` najdete i `initiative-screen.md` (regulatorní screening, A1b). Ten vznikl podle starších pravidel: od 1. září 2026 fáze 1 screening nedělá a regulace se posuzuje až u konkrétních řešení ve fázi 4 (`STAGE-1-SPEC.md`). Ve svém běhu ho neuvidíte.
  3. U každé fáze si zapište jednou větou, co z ní vzešlo.
- [ ] **Dohledejte jedno tvrzení zpět ke zdroji** (30 min)
  - *Proč:* Dohledatelnost je hlavní slib SPOCKu. Každá role ji potřebuje: PM, aby obhájil rozhodnutí, designer, aby viděl, na jakém výzkumu řešení stojí, a engineer, aby věděl, odkud se vzal požadavek.
  1. V `7-initiative/initiative.md` vyberte jedno kritérium úspěchu nebo jeden požadavek.
  2. Najděte ho v PRD (`6-prd/`), pak v rozpracovaném MVP (`5-mvp/`), ve vybraném řešení (soubor `…selected-solution.md` ve `4-solutions/`) a v příležitostech (`2-problems/`).
  3. Skončete u materiálu v `2-problems/1-problem-material.md`.
  4. Pozor: starší ukázkové běhy mají ve fázi 4 i soubory, které už nové běhy nevytvářejí (např. `solution-scores`). Skóre řešení bylo zrušeno (`BUSINESS-LOGIC-OVERVIEW.md` §3, fáze 4).
- [ ] **Najděte v běhu podpisy** (10 min)
  - *Proč:* Každé rozhodnutí má jméno a roli. Právě tohle vám dá jistotu, že výstup nikdo „nepodepsal za vás“.
  1. Otevřete `RUN-STATE.md` ukázkového běhu.
  2. Najděte, kdo a kdy podepsal G1 a G7.

## Kvíz

**1. Proč fáze 3 nemá rozhodnutí člověka?**

   a) Zapomnělo se na ni
   b) Produkuje jen assety (mapu trhu, karty konkurentů, syntézu) a přijímá ji kvalitní brána Q3
   c) Rozhoduje v ní agent

<details><summary>Odpověď</summary>

b) Artefakty fáze 3 jsou třídy *asset*. Rozhodovací bránu mají jen *outputy*. Další setkání člověka s výsledky trhu je ve fázi 4 (`BUSINESS-LOGIC-OVERVIEW.md` §3 a §5).

</details>

**2. Agent napíše „Brána Q2 prošla“. Co to dokazuje?**

   a) Že dokument je v pořádku
   b) Nic. Pravdu ukazuje výstup tasku nebo kontroly, ne věta agenta
   c) Že je metodicky správně

<details><summary>Odpověď</summary>

b) Výsledek brány se čte z výstupu tasku a z titulní stránky běhu. Producent podle `TESTER-GUIDE.md` §4 na otázku „prošli jsme bránou?“ odpovídat nemá vůbec. A i zelená brána znamená jen to, že prošla její mechanická polovina. Kvalitu discovery žádná kontrola neposuzuje (§1.2).

</details>

**3. Kdo spustí fázi 4, když se přijme fáze 3?**

   a) Spustí se automaticky
   b) Vy, tím že vyberete agenta Product Manager. Agent pak ověří předpoklady
   c) Workflow Support

<details><summary>Odpověď</summary>

b) Automatické spouštění fází postavené není. Workflow jen oznámí další fázi a jejího agenta (`BUSINESS-LOGIC-OVERVIEW.md` §0).

</details>
