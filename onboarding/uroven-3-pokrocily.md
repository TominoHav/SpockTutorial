# Úroveň 3: Pokročilý (všichni, 3–4 h)

**Cíl:** Zvládnete situace mimo šťastnou cestu: vrátit fázi, vyřešit neprošlou bránu, opravit záznam, předat běh kolegovi, pracovat mimo workflow a aktualizovat svou kopii SPOCKu.

**Proč:** Skutečné běhy se šťastnou cestou nedrží. Přijde nový materiál, kolega odjede na dovolenou, kontrolu nejde splnit. SPOCK má na každou z těchto situací task, a ten zanechá záznam. Bez něj by se běh, který změnil názor, nedal obhájit.

**Pracujte na cvičném běhu** z úrovně 2.

## 3.1 — Vrácení a změny

### Ke studiu (asi 30 min)

- 📄 **`specifications/onboarding/TASKS.md`**: `send a stage back to be redone`, `keep a later stage as it is`, `take something back`, `record that I edited a document`, `replace a decision that no longer stands`

### Klíčové myšlenky

- **Vrácení fáze** (`SPOCK: send a stage back to be redone`) zruší její přijetí a podpis. **Každou pozdější fázi**, která už prošla bránou, označí jako **stale**. Nic se nemaže, důvod se zapíše.
- **Stale fázi** buď přepracujete, nebo ji ponecháte taskem `SPOCK: keep a later stage as it is`. Ten na ní znovu spustí bránu a fázi přijme, jen když projde.
- **Ruční úprava dokumentu** během psaní nebo review se zapisuje taskem `SPOCK: record that I edited a document`. Jinak by záznam tvrdil, že dokument napsal agent.
- **Nic se nemaže.** `SPOCK: take something back` přesune soubor do `superseded/` i s důvodem.

### Úkoly

- [ ] **Vraťte fázi 2 kvůli novému materiálu** (40 min)
  - *Proč:* Nový materiál po schválení fáze 2 mění to, o čem se rozhodovalo. Proto se fáze nejdřív vrátí (`SETUP.md` §6 krok 5).
  1. Ve cvičném běhu, který je už za fází 2, spusťte `SPOCK: send a stage back to be redone` → fáze `2`, jméno, důvod a roli.
  2. Na titulní stránce běhu ověřte, které fáze jsou teď stale.
  3. Přidejte nový soubor do `2-problems/supplied/` a vezměte ho taskem `SPOCK: add problem material` → `yes`.
  4. Nechte fázi 2 přepsat a schvalte ji. U fáze 3 zvažte: ponechat (`keep a later stage as it is`), nebo přepracovat?
- [ ] **Zapište ruční úpravu** (15 min)
  - *Proč:* Záznam má říkat pravdu o tom, kdo co napsal.
  1. Během review fáze ručně upravte jednu větu v dokumentu.
  2. Spusťte `SPOCK: record that I edited a document` → cesta, co, proč a jméno.

## 3.2 — Když brána neprojde

### Ke studiu (asi 20 min)

- 📄 **`TESTER-GUIDE.md`** §7 („When it breaks“)

### Klíčové myšlenky

- **Neprošlá brána obvykle k vám vůbec nedojde.** Fáze se vrátí agentovi, ten ji opraví a vás se ptá až potom. Když tatáž kontrola selže i **po jeho druhé opravě**, agent se zastaví, řekne, co kontrola chce, a odkáže na Workflow Support. To je správné chování.
- **`SPOCK: explain what the gate failed`** ke každé neprošlé kontrole řekne, co selhalo, k čemu kontrola je a jaký tvar projde.
- **Výjimka:** když kontrolu běh opravdu splnit nemůže, podepíšete ji taskem `SPOCK: sign off a check this run cannot meet` (6 políček). **Brána zůstane `fail`** a fáze pokračuje i se selháním. Zelená brána na výjimce by byla chyba.
- Poslední políčko výjimky rozhoduje, kam nález jde. **„the workflow looks wrong“** značí podezření na chybu workflow (objeví se v `SPOCK: how the workflow performed`). **„the material cannot meet it“** znamená, že kontrolu nemůže splnit váš materiál.
- **Některé kontroly podepsat nejde nikdy.** Task je odmítne a řekne, co místo toho pomůže.

### Úkoly

- [ ] **Projděte jednu neprošlou kontrolu** (30 min)
  - *Proč:* Naučíte se rozlišit chybu materiálu od chyby workflow. Na tom stojí kvalita vaší zpětné vazby.
  1. Až ve cvičném běhu brána neprojde, nechte agenta opravovat.
  2. Pokud se zastaví, zeptejte se agenta **Workflow Support**: „Co teď s tímto během?“ Jeho odpověď má končit konkrétním taskem a jeho políčky.
  3. Spusťte `SPOCK: explain what the gate failed` a do deníku zapište: materiál, nebo workflow?

## 3.3 — Předání běhu, vlastnictví a jména

### Ke studiu (asi 15 min)

- 📄 **`TESTER-GUIDE.md`** §3.4 („Handing a run to a colleague“) a konec §3.2 (oprava jména)

### Klíčové myšlenky

- **Běh se předává zkopírováním celé složky**, nikdy přes git. Oba nejdřív zavřou své chaty. Kdo běh přebírá, nesmí mít jiný nedokončený běh. **Když jsou ve složce dva nedokončené běhy, tasky odmítnou pracovat**, protože nepoznají, který myslíte.
- Nový vlastník otevře nový chat s agentem dané fáze, spustí `SPOCK: record who owns this stage` se svým jménem a pokračuje taskem `SPOCK: continue`.
- **Jméno s překlepem** opravíte taskem `SPOCK: correct a name on the record`. Nic se znovu neschvaluje. Cizí jméno tímhle taskem přepsat nejde.

### Úkoly

- [ ] **Předejte běh kolegovi z tria** (30 min)
  - *Proč:* Běh musí přežít dovolenou i změnu člověka, a to bez toho, aby si někdo musel cokoli pamatovat.
  1. Postupujte přesně podle `TESTER-GUIDE.md` §3.4, kroky 1–5.
  2. Kolega ověří na titulní stránce běhu, že vidí stejný stav jako vy.

## 3.4 — Pomocníci a práce mimo workflow

### Klíčové myšlenky

- **Workflow Support** řekne, v jakém stavu běh je a **jaký jeden task** ho posune, nebo řekne na rovinu, že tu nic nepomůže. Nic nemění.
- **Methodology Coach** odpovídá na otázky k metodě jen z kánonu. Nic nepíše.
- **Free-roam:** chcete-li s agentem jen přemýšlet mimo běh, zprávu musíte začít doslovně **`free-roam:`**. Agent si to nikdy neodvodí z formulace. Takhle vzniklá práce **nemá záznam běhu a neprošla žádnou bránou**. Free-roam funguje u Product Managera, Opportunity Designera, Competitive Analysis a Business Analysta, **ne** u příjmu materiálu (`specifications/definitions/cross-cutting/free-roam.md`).

### Úkoly

- [ ] **Vyzkoušejte free-roam a jeho hranici** (15 min)
  - *Proč:* Naučíte se, kdy agent zůstane v řízeném běhu a kdy z něj odejde.
  1. Agentovi Product Manager napište: „Pojďme jen tak promyslet pár nápadů.“ Má pokračovat v řízeném běhu, ne odejít mimo něj.
  2. Pak napište: `free-roam: tři nápady, jak snížit odchody v onboardingu`. Výstup nemá mít skóre ani doporučení a nemá patřit k běhu.

## 3.5 — Údržba kopie a ukončení běhu

### Ke studiu (asi 15 min)

- 📄 **`SETUP.md`** §7 („Starting again“) a §8 („When a new version arrives“)

### Klíčové myšlenky

- **Běh dokončete na verzi, na které začal.** Pak zavřete chaty a spusťte `SPOCK: update this copy to the latest release` → `update`. Potom Command Palette → `Developer: Reload Window`.
- **Když chcete začít znovu před koncem běhu**, nejdřív přesuňte složku `runs/<běh>/` mimo SPOCK na nesdílené místo.
- **Ukončení běhu** taskem `SPOCK: stop this run` (důvod `low_value`, `small_impact`, `high_risk` nebo `out_of_boundary`) je trvalé. Dokumenty zůstanou čitelné, ale žádný task běh znovu nespustí.

### Úkoly

- [ ] **Aktualizujte kopii** (15 min, až vyjde nová verze)
  - *Proč:* Starý chat po aktualizaci pořád pracuje se starými instrukcemi. Proto zavřít chaty a znovu načíst okno.
  1. Dokončete nebo odsuňte rozpracovaný běh.
  2. Spusťte update, pak reload okna a `SPOCK: check my setup`.
  3. Do deníku zapište verzi před aktualizací a po ní.

## Kvíz

**1. Fáze 4 je schválená a přijde nový výzkum, který mění příležitosti. Co uděláte?**

   a) Vložím ho do `supplied/` a pokračuji
   b) Vrátím fázi 2 (`send a stage back to be redone`), přidám materiál a pak rozhodnu o stale fázích 3 a 4
   c) Upravím ručně dokument příležitostí

<details><summary>Odpověď</summary>

b) Po review fáze 2 by nový materiál změnil to, o čem se rozhodovalo. Proto se fáze vrací a pozdější fáze se stanou stale (`SETUP.md` §6 krok 5, `TASKS.md`).

</details>

**2. Podepsal(a) jste výjimku ke kontrole. Jakou barvu má teď brána?**

   a) Zelenou
   b) Pořád `fail`, s podepsanou výjimkou vedle

<details><summary>Odpověď</summary>

b) „A gate turning green on an exception would be the defect“ (`TESTER-GUIDE.md` §7).

</details>

**3. V `runs/` máte dva nedokončené běhy. Co se stane?**

<details><summary>Odpověď</summary>

Každý task, který pracuje s během, odmítne, protože nepozná, který myslíte. Jeden běh přesuňte ven (`SETUP.md` §7).

</details>
