# Úroveň 3: Pokročilý (všichni, 3–4 h)

**Cíl:** Zvládnete situace mimo šťastnou cestu: vrátit fázi, vyřešit neprošlou bránu, opravit záznam, předat běh kolegovi, pracovat mimo workflow a aktualizovat svou kopii SPOCKu.

**Proč:** Skutečné běhy se šťastnou cestou nedrží. Přijde nový materiál, kolega odjede na dovolenou, kontrolu nejde splnit. SPOCK má na každou z těchto situací task, a ten zanechá záznam. Bez něj by se běh, který změnil názor, nedal obhájit.

**Pracujte na cvičném běhu** z úrovně 2.

## 3.1 — Vrácení a změny

### Karty (asi 8 min, jen na webu)

#### Vrácení fáze

**Vrácení fáze** (`SPOCK: send a stage back to be redone`) zruší její přijetí a podpis. **Každou pozdější fázi**, která už prošla bránou, označí jako **stale**. Nic se nemaže, důvod se zapíše.

**Otázka:** Vrátíte fázi 2. Co se stane s fází 4, která už prošla bránou?
- [ ] Smaže se
- [x] Označí se jako stale
- [ ] Nic

**Proč:** Každá pozdější fáze se označí jako zastaralá. Nic se nemaže.

#### Stale fáze: přepracovat, nebo ponechat

**Stale fázi** buď přepracujete, nebo ji ponecháte taskem `SPOCK: keep a later stage as it is`. Ten na ní znovu spustí bránu a fázi přijme, jen když projde.

**Otázka:** Co udělá `SPOCK: keep a later stage as it is`?
- [ ] Přijme fázi bez kontroly
- [x] Znovu na ní spustí bránu a přijme ji, jen když projde

**Proč:** Ponechání stale fáze není zkratka kolem brány.

#### Ruční úprava a nic se nemaže

**Ruční úprava dokumentu** během psaní nebo review se zapisuje taskem `SPOCK: record that I edited a document`. Jinak by záznam tvrdil, že dokument napsal agent.

**Nic se nemaže.** `SPOCK: take something back` přesune soubor do `superseded/` i s důvodem.

**Otázka:** Upravili jste dokument ručně. Co uděláte?
- [x] Spustím `SPOCK: record that I edited a document`
- [ ] Nic, agent to pozná

**Proč:** Jinak by záznam tvrdil, že dokument napsal agent.

#### Špatný soubor v materiálu

**Dodaný materiál tímto taskem nevrátíte.** Soubory ve složce `supplied/` jsou materiál zákazníka a task je odmítne. Špatný soubor přesuňte ze `supplied/` a spusťte `SPOCK: add problem material` → `yes`, který změnu zapíše: přesunutý soubor se přestane počítat a nic se nepřečísluje. Když je fáze 2 ve schvalování nebo už přijatá, nejdřív ji vraťte (`SPOCK: send a stage back to be redone`).

**Otázka:** Do `supplied/` jste omylem dali špatný soubor. Jak ho odstraníte?
- [ ] Taskem `SPOCK: take something back`
- [x] Přesunu ho ze `supplied/` a spustím `SPOCK: add problem material` → `yes`

**Proč:** `take something back` soubory v `supplied/` odmítne, jsou to materiál zákazníka.

### Úkoly

- [ ] **Vraťte fázi 2 kvůli novému materiálu** (40 min, ve VS Code)
  - *Proč:* Nový materiál po schválení fáze 2 mění to, o čem se rozhodovalo. Proto se fáze nejdřív vrátí (`SETUP.md` §6 krok 5).
  1. Ve cvičném běhu, který je už za fází 2, spusťte `SPOCK: send a stage back to be redone` → fáze `2`, jméno, důvod a roli.
  2. Na titulní stránce běhu ověřte, které fáze jsou teď stale.
  3. Přidejte nový soubor do `2-problems/supplied/` a vezměte ho taskem `SPOCK: add problem material` → `yes`.
  4. Nechte fázi 2 přepsat a schvalte ji. U fáze 3 zvažte: ponechat (`keep a later stage as it is`), nebo přepracovat?
- [ ] **Zapište ruční úpravu** (15 min, ve VS Code)
  - *Proč:* Záznam má říkat pravdu o tom, kdo co napsal.
  1. Během review fáze ručně upravte jednu větu v dokumentu.
  2. Spusťte `SPOCK: record that I edited a document` → cesta, co, proč a jméno.

### Pro zvídavé (anglicky, ve vaší kopii SPOCKu)

- 📄 **`specifications/onboarding/TASKS.md`**: `send a stage back to be redone`, `keep a later stage as it is`, `take something back`, `record that I edited a document`, `replace a decision that no longer stands`

## 3.2 — Když brána neprojde

### Karty (asi 6 min, jen na webu)

#### Neprošlá brána obvykle k vám nedojde

**Neprošlá brána obvykle k vám vůbec nedojde.** Fáze se vrátí agentovi, ten ji opraví a vás se ptá až potom. Když tatáž kontrola selže i **po jeho druhé opravě**, agent se zastaví, řekne, co kontrola chce, a odkáže na Workflow Support. To je správné chování.

**Otázka:** Tatáž kontrola selže i po druhé opravě agenta. Co je správné chování?
- [ ] Agent zkouší dál
- [x] Agent se zastaví, řekne, co kontrola chce, a odkáže na Workflow Support

**Proč:** Zastavení po druhé opravě je záměr, ne chyba.

**`SPOCK: explain what the gate failed`** ke každé neprošlé kontrole řekne, co selhalo, k čemu kontrola je a jaký tvar projde.

#### Výjimka zůstává `fail`

**Výjimka:** když kontrolu běh opravdu splnit nemůže, podepíšete ji taskem `SPOCK: sign off a check this run cannot meet` (6 políček). **Brána zůstane `fail`** a fáze pokračuje i se selháním. Zelená brána na výjimce by byla chyba.

**Otázka:** Podepíšete výjimku. Jakou barvu má brána?
- [ ] Zelenou
- [x] Zůstává `fail` a fáze pokračuje i se selháním

**Proč:** Zelená brána na výjimce by byla chyba.

#### Kam výjimka míří

Poslední políčko výjimky rozhoduje, kam nález jde. **„the workflow looks wrong“** značí podezření na chybu workflow (objeví se v `SPOCK: how the workflow performed`). **„the material cannot meet it“** znamená, že kontrolu nemůže splnit váš materiál.

**Některé kontroly podepsat nejde nikdy.** Task je odmítne a řekne, co místo toho pomůže.

**Otázka:** Myslíte si, že kontrola je ve workflow špatně. Co zvolíte v posledním políčku?
- [x] „the workflow looks wrong“
- [ ] „the material cannot meet it“

**Proč:** Tahle volba se objeví v `SPOCK: how the workflow performed` jako podezření na chybu workflow.

### Úkoly

- [ ] **Projděte jednu neprošlou kontrolu** (30 min, ve VS Code)
  - *Proč:* Naučíte se rozlišit chybu materiálu od chyby workflow. Na tom stojí kvalita vaší zpětné vazby.
  1. Až ve cvičném běhu brána neprojde, nechte agenta opravovat.
  2. Pokud se zastaví, zeptejte se agenta **Workflow Support**: „Co teď s tímto během?“ Jeho odpověď má končit konkrétním taskem a jeho políčky.
  3. Spusťte `SPOCK: explain what the gate failed` a do deníku zapište: materiál, nebo workflow?

### Pro zvídavé (anglicky, ve vaší kopii SPOCKu)

- 📄 **`TESTER-GUIDE.md`** §7 („When it breaks“)

## 3.3 — Předání běhu, vlastnictví a jména

### Karty (asi 5 min, jen na webu)

#### Předání běhu

**Běh se předává zkopírováním celé složky**, nikdy přes git. Oba nejdřív zavřou své chaty. Kdo běh přebírá, nesmí mít jiný nedokončený běh. **Když jsou ve složce dva nedokončené běhy, tasky odmítnou pracovat**, protože nepoznají, který myslíte.

**Otázka:** Jak běh předáte kolegovi?
- [ ] Přes git push
- [x] Zkopírováním celé složky běhu, oba nejdřív zavřou chaty

**Proč:** Běhy nejsou v gitu. Ve složce smí být jen jeden nedokončený běh.

#### Nový vlastník a oprava jména

Nový vlastník otevře nový chat s agentem dané fáze, spustí `SPOCK: record who owns this stage` se svým jménem a pokračuje taskem `SPOCK: continue`.

**Jméno s překlepem** opravíte taskem `SPOCK: correct a name on the record`. Nic se znovu neschvaluje. Cizí jméno tímhle taskem přepsat nejde.

**Otázka:** V podpisu máte překlep ve jméně. Musíte znovu schvalovat?
- [ ] Ano
- [x] Ne, opravíte ho taskem `SPOCK: correct a name on the record`

**Proč:** Oprava jména nic znovu neschvaluje. Cizí jméno ale přepsat nejde.

### Úkoly

- [ ] **Předejte běh kolegovi z tria** (30 min, ve VS Code)
  - *Proč:* Běh musí přežít dovolenou i změnu člověka, a to bez toho, aby si někdo musel cokoli pamatovat.
  1. Postupujte přesně podle `TESTER-GUIDE.md` §3.4, kroky 1–5.
  2. Kolega ověří na titulní stránce běhu, že vidí stejný stav jako vy.

### Pro zvídavé (anglicky, ve vaší kopii SPOCKu)

- 📄 **`TESTER-GUIDE.md`** §3.4 („Handing a run to a colleague“) a konec §3.2 (oprava jména)

## 3.4 — Pomocníci a práce mimo workflow

### Karty (asi 5 min, jen na webu)

#### Dva pomocníci

**Workflow Support** řekne, v jakém stavu běh je a **jaký jeden task** ho posune, nebo řekne na rovinu, že tu nic nepomůže. Nic nemění.

**Methodology Coach** odpovídá na otázky k metodě jen z kánonu. Nic nepíše.

**Otázka:** Nevíte, jaký task běh posune. Koho se zeptáte?
- [x] Workflow Support
- [ ] Methodology Coache
- [ ] Business Analysta

**Proč:** Workflow Support řekne jeden task, který běh posune. Nic nemění.

#### Free-roam

**Free-roam:** chcete-li s agentem jen přemýšlet mimo běh, zprávu musíte začít doslovně **`free-roam:`**. Agent si to nikdy neodvodí z formulace. Takhle vzniklá práce **nemá záznam běhu a neprošla žádnou bránou**. Free-roam funguje u Product Managera, Opportunity Designera, Competitive Analysis a Business Analysta, **ne** u příjmu materiálu (`specifications/definitions/cross-cutting/free-roam.md`).

**Otázka:** Napíšete „jen si to promysleme mimo běh“. Přepne agent do free-roam?
- [ ] Ano
- [x] Ne, zpráva musí začínat doslovně `free-roam:`

**Proč:** Agent free-roam nikdy neodvozuje z formulace.

### Úkoly

- [ ] **Vyzkoušejte free-roam a jeho hranici** (15 min, ve VS Code)
  - *Proč:* Naučíte se, kdy agent zůstane v řízeném běhu a kdy z něj odejde.
  1. Agentovi Product Manager napište: „Pojďme jen tak promyslet pár nápadů.“ Má pokračovat v řízeném běhu, ne odejít mimo něj.
  2. Pak napište: `free-roam: tři nápady, jak snížit odchody v onboardingu`. Výstup nemá mít skóre ani doporučení a nemá patřit k běhu.

## 3.5 — Údržba kopie a ukončení běhu

### Karty (asi 5 min, jen na webu)

#### Aktualizace kopie

**Běh dokončete na verzi, na které začal.** Pak zavřete chaty a spusťte `SPOCK: update this copy to the latest release` → `update`. Když kontrola `C189` hlásí, že se soubory SPOCKu liší od vydání (někdo je upravil), napište místo toho `update, and set aside my changes to the workflow's own files`: task si změněné soubory odloží a vrátí ty z vydání. Potom Command Palette → `Developer: Reload Window`.

**Otázka:** Kdy aktualizujete svou kopii SPOCKu?
- [ ] Hned, uprostřed běhu
- [x] Až dokončíte běh na verzi, na které začal

**Proč:** Běh se dokončuje na verzi, na které začal.

#### Začít znovu, nebo ukončit

**Když chcete začít znovu před koncem běhu**, nejdřív přesuňte složku `runs/<běh>/` mimo SPOCK na nesdílené místo.

**Ukončení běhu** taskem `SPOCK: stop this run` (důvod `low_value`, `small_impact`, `high_risk` nebo `out_of_boundary`) je trvalé. Dokumenty zůstanou čitelné, ale žádný task běh znovu nespustí.

**Otázka:** Co se stane po `SPOCK: stop this run`?
- [ ] Běh se dá později obnovit
- [x] Ukončení je trvalé, dokumenty zůstanou čitelné

**Proč:** Žádný task ukončený běh znovu nespustí.

### Úkoly

- [ ] **Aktualizujte kopii** (15 min, ve VS Code, až vyjde nová verze)
  - *Proč:* Starý chat po aktualizaci pořád pracuje se starými instrukcemi. Proto zavřít chaty a znovu načíst okno.
  1. Dokončete nebo odsuňte rozpracovaný běh.
  2. Spusťte update, pak reload okna a `SPOCK: check my setup`.
  3. Do deníku zapište verzi před aktualizací a po ní.

### Pro zvídavé (anglicky, ve vaší kopii SPOCKu)

- 📄 **`SETUP.md`** §7 („Starting again“) a §8 („When a new version arrives“)

## Kvíz

Kvíz losuje 5 otázek z této zásoby. Pořadí otázek i možností se při každém spuštění zamíchá.

**1. Fáze 4 je schválená a přijde nový výzkum, který mění příležitosti. Co uděláte?**

   a) Upravím příležitosti ručně
   b) Vrátím fázi 2 taskem `SPOCK: send a stage back to be redone`, pozdější fáze se označí jako stale
   c) Založím nový běh

<details><summary>Odpověď</summary>

b) Vrácení zapíše důvod a nic nesmaže. Stale fáze pak přepracujete nebo ponecháte.

</details>

**2. Fáze 5 je stale, ale vrácení ji podle vás neovlivnilo. Co uděláte?**

   a) Nic, stale nevadí
   b) Spustím `SPOCK: keep a later stage as it is`. Přijme se, jen když znovu projde bránou
   c) Smažu příznak stale v záznamu

<details><summary>Odpověď</summary>

b) Ponechání není zkratka kolem brány.

</details>

**3. V `runs/` máte dva nedokončené běhy. Co se stane?**

   a) Tasky pracují s novějším
   b) Tasky odmítnou pracovat, protože nepoznají, který myslíte
   c) Nic

<details><summary>Odpověď</summary>

b) Proto kdo běh přebírá, nesmí mít jiný nedokončený běh.

</details>

**4. Přepsali jste ručně dva odstavce v PRD a nic jste nezapsali. Co je problém?**

   a) Žádný
   b) Záznam tvrdí, že dokument napsal agent. Spusťte `SPOCK: record that I edited a document`
   c) Brána Q6 úpravu odmítne

<details><summary>Odpověď</summary>

b) Ruční úprava se zapisuje taskem, jinak záznam neodpovídá skutečnosti.

</details>

**5. Chcete s agentem promyslet nápad mimo běh. Jak začnete zprávu?**

   a) „Jen mimo záznam:“
   b) Doslovně `free-roam:`
   c) Stačí, když to napíšete srozumitelně

<details><summary>Odpověď</summary>

b) Agent free-roam nikdy neodvozuje z formulace. Práce pak nemá záznam ani bránu.

</details>

**6. Vyšla nová verze SPOCKu a jste uprostřed fáze 4. Co uděláte?**

   a) Hned aktualizuji
   b) Dokončím běh na verzi, na které začal, a pak aktualizuji
   c) Zkopíruji si nové soubory ručně

<details><summary>Odpověď</summary>

b) Běh se dokončuje na verzi, na které začal (`SETUP.md` §8).

</details>

**7. Kontrolu nejde v tomto běhu splnit, protože materiál prostě neexistuje. Co zvolíte v posledním políčku výjimky?**

   a) „the workflow looks wrong“
   b) „the material cannot meet it“
   c) Nechám prázdné

<details><summary>Odpověď</summary>

b) „the workflow looks wrong“ je jen pro podezření na chybu workflow.

</details>

**8. Projekt byl zrušen a chcete běh ukončit. Co platí po `SPOCK: stop this run`?**

   a) Běh jde později obnovit
   b) Je to trvalé. Dokumenty zůstanou čitelné, ale žádný task běh znovu nespustí
   c) Běh se smaže

<details><summary>Odpověď</summary>

b) Ukončení se zapíše s důvodem a je trvalé.

</details>
