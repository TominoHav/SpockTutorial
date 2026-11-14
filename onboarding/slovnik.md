# Slovník

| Pojem | Význam |
|---|---|
| **Běh (run)** | Jedna iniciativa procházející 7 fázemi. Celá je ve složce `runs/<běh>/` na vašem počítači, mimo git. |
| **Fáze (stage)** | Jedna ze 7. Má agenta, vstupy, artefakty, kvalitní bránu a většinou rozhodnutí člověka. |
| **Agent** | Identita, se kterou mluvíte v Copilot Chatu. Šest agentů: čtyři vedou fáze, dva pomáhají. |
| **Task** | Krok, který udělá systém: zápis do záznamu, podpis, kontrola. Spouští se přes `Tasks: Run Task`. |
| **Políčko (box)** | Vstup, který task otevře nahoře v okně. Políčko na jméno, roli, důvod nebo rozhodnutí vyplňujete jen vy. |
| **Artefakt (A1–A15)** | Dokument, který fáze vyprodukuje, plus záznam za ním. |
| **Output / asset** | Output musí člověk schválit a má rozhodovací bránu. Asset je mezivýsledek bez podpisu. |
| **Q1–Q7** | Kvalitní brány: automatické kontroly, které nespouští agent, který dokument napsal. |
| **G1, G2, G4, G5b, G6, G7** | Rozhodovací brány: rozhoduje člověk svým jménem, rolí a datem. |
| **pass / fail / incomplete** | Výsledek brány. `incomplete` není pass. |
| **Mechanická / posuzovaná polovina** | Pravidla, která rozhodne kód / pravidla, která musí posoudit člověk. Zelená brána znamená, že prošla mechanická polovina. |
| **Výjimka (sign-off)** | Podepsané „tuto kontrolu běh nemůže splnit“. Brána zůstane `fail`. |
| **Stale** | Pozdější fáze, jejíž podklad se změnil. Buď se ponechá, nebo přepracuje. |
| **Trust tag** | strong / weak / unrated. Odvozuje se z důkazů za problémem, nikdy se jen neprohlásí. |
| **Karanténa** | Fáze 2: materiál zákazníka čte agent bez přístupu ven a pokyn v materiálu bere jen jako text. |
| **Supplied** | Složka fáze, do které dáváte svůj materiál (`2-problems/supplied/`, `3-competitive-analysis/supplied/`). |
| **Touchpoint** | Místo, kde řešení naráží na regulatorní povinnost. Porovnávají se ve fázi 4 místo skóre. |
| **Titulní stránka běhu** | `runs/<běh>/README.md`. Říká, kde běh stojí, a vede na hlavní dokumenty. |
| **RUN-STATE.md** | Záznam běhu: stav fází, podpisy, verze know-how. |
| **Free-roam** | Práce mimo běh, bez bran a bez záznamu. Zpráva musí začínat doslovně `free-roam:`. |
| **PM, PD, SWE, GM** | Zkratky rolí: Product Manager, Product Designer, Software Engineer a Guild Master, správce PM metodiky. |
| **Trio** | PM, PD a SWE dělající discovery spolu. Každý vede ve své oblasti, odpovídají společně. |
| **Opportunity Solution Tree** | Metoda SPOCKu: outcome → příležitosti → řešení → artefakty. |
| **Tvrdá zastávka (hard stop)** | Fáze odmítne běžet, např. bez materiálu nebo bez primární příležitosti. Není to neprošlá kontrola. |
| **Univerzální kontroly** | 45 kontrol, které běží na každé bráně. Fáze nejčastěji padá právě na nich. |
| **Nepodepsatelné kontroly** | `C14`, `C32`, `C38`, `C51`, `C143`, `C168`, `C189` a `C190`. Výjimku k nim podepsat nejde. |
| **could_not_verify** | Pole v hlavičce dokumentu se seznamem pravidel, která žádná kontrola nerozhodne. Je určené pro toho, kdo rozhoduje. |
| **[[fill: …]]** | Značka v kostře dokumentu, kterou má vyplnit agent. Dokument s neodstraněnou značkou nikdo nečte. |
| **origin: person** | Příležitost, řešení nebo varianta MVP, kterou přinesl člověk, ne agent. |
| **Strategy Basis** | Sedm pilířů, šest cílů a 25 key resultů ČS. Proti nim se čte strategický soulad. Cíle tu nemají čísla. |
| **North Star (produktový cíl)** | Cíl, za který běh odpovídá. Metrika produktu nikdy nesmí být key result banky. |
| **Escalation trigger** | Podmínka v kartě oblasti, která jmenuje specialistu. Workflow sám nic nepřesměrovává. |
| **Store (úložiště konkurentů)** | Karty konkurentů, které přežijí běh. Opakované použití je pozastavené. |
| **Outcome** | Změna chování nebo výsledku, ke které se brief zavazuje. Není to řešení. |
