# Týden 3 (23.–29. 11.): Jak je SPOCK postavený

**Cíl:** U kteréhokoli agenta umíte říct, které skilly načítá, co smí, co čte, co ho hlídá a kde je zapsaný. Výsledek brány umíte dohledat až ke kontrole.

**Proč:** Tady se z uživatele stáváte builderem. Interaktivní mapu vrstev najdete v části SPOCK v kostce.

## Po 23. 11. — Agenti a jejich práva

### Ke studiu (asi 60 min)

- 📄 **ENGINEERING-HANDOVER.md §1–4** — SPOCK-engineering peak.zip
- 📄 **Komentáře v .vscode/settings.json** — proč je každé nastavení takové, jaké je

### Klíčové myšlenky

- Seznam tools: ve wrapperu je minimum, ne maximum. Proto se další nástroje vypínají v settings.json.
- Soubor Opportunity Designer je v registru veden jako hypothesis-designer a běží pod ním i material-intake.

### Úkoly

- [ ] **Zmapujte všech 6 agentů** (45 min)
  - *Proč:* Při každé chybě je první otázka: měl agent správné nástroje? Musíte vědět, kdo co smí.
  1. Otevřete všech 6 souborů v .github/agents/.
  2. Do tabulky: agent | tools: | skilly, které načítá.
- [ ] **Ověřte wrapper proti registru** (30 min)
  - *Proč:* Wrapper a registr musí říkat totéž. Když se rozejdou, selže kontrola C85.
  1. V registry/agents.yaml najděte id: product-manager a agent_file:.
  2. Porovnejte tools: s wrapperem.
- [ ] **Přečtěte komentáře v settings.json** (30 min)
  - *Proč:* Jsou to zkušenosti z pilotu: proč je každé nastavení takové, jaké je.
  1. Cmd+P → settings.json.
  2. U 3 nastavení si zapište, jaký problém řeší.

## Út 24. 11. — Skilly a know-how

### Ke studiu (asi 45 min)

- 📄 **KNOW-HOW-OWNERS.md §1–3** — mapa toho, co budete od ledna vlastnit
- 📄 **PATTERN-CATALOGUE.md** — specifications/definitions

### Klíčové myšlenky

- Skill = kontrakt (vstupy, výstup, zákazy) a postup krok za krokem.
- Know-how = co znamená „dobře". Skill ho čte a nikdy nepíše.
- Zdroj know-how je v specifications/definitions/know-how, do .github/know-how se generuje.

### Úkoly

- [ ] **Zmapujte know-how skillu brief-creation** (40 min)
  - *Proč:* Know-how budete vlastnit. Musíte vědět, který skill z něj čte.
  1. V skills.yaml najděte know_how u brief-creation.
  2. Každý soubor otevřete a jednou větou zapište, proč ho skill čte.
- [ ] **Prohlédněte si karanténu** (20 min)
  - *Proč:* Material-intake je bezpečnostní hranice celého workflow.
  1. Najděte material-intake v skills.yaml.
  2. Všimněte si tools: [] a vzoru quarantined-extract. Zapište, proč tam jsou.
- [ ] **Projděte katalog vzorů** (30 min)
  - *Proč:* Nový skill budete stavět podle jednoho z těchto vzorů.
  1. Otevřete PATTERN-CATALOGUE.md.
  2. U každého vzoru jednou větou, k čemu je.

## St 25. 11. — Registry a kontrakty

### Ke studiu (asi 30 min)

- 📄 **discovery.workflow.yaml a problems.workflow.yaml** — .github/workflow-contracts

### Klíčové myšlenky

- Jedna pravda na jednom místě. Číslo nebo pravidlo na dvou místech se dřív nebo později rozejde.
- Proto existují claims.yaml a rule-echoes.yaml.

### Úkoly

- [ ] **Rozeberte kontrakt fáze 1 a 2** (60 min)
  - *Proč:* Kontrakt je proces SPOCKu. Při změně fáze ho budete číst jako první.
  1. Otevřete discovery.workflow.yaml a problems.workflow.yaml.
  2. U každého kroku zapište requires, produces a gate.criteria.
- [ ] **Projděte registry** (45 min)
  - *Proč:* Jedna pravda na jednom místě. Musíte vědět, kde která pravda je.
  1. Otevřete složku .github/registry/.
  2. U každého souboru jednou větou, co drží.

## Čt 26. 11. — Kontroly a brány

### Ke studiu (asi 30 min)

- 📄 **gates.mjs – bloky UNIVERSAL a QUALITY_GATES** — .github/scripts
- 📄 **Claude jako učitel** — „Vysvětli mi výstup check.mjs --gates, řádek po řádku."

### Klíčové myšlenky

- Kontrola, kterou nikdo neviděl selhat, není kontrola.
- incomplete neznamená pass.
- Výjimka nezmění fail na pass.

### Příkazy

```bash
node .github/scripts/check.mjs fixtures/2026-04-card-disputes --gates
```

### Úkoly

- [ ] **Spusťte brány nad ukázkovým během** (20 min)
  - *Proč:* Naučíte se číst výstup, který uvidíte při každé chybě.
  1. Spusťte příkaz z rámečku.
  2. Zapište, kolik pravidel každé brány rozhoduje kód a kolik člověk.
- [ ] **Propojte kritéria s kontrolami** (40 min)
  - *Proč:* Propojíte metodiku (kritérium) s kódem (kontrolou).
  1. V kontraktu najděte krok brief a jeho criteria.
  2. V gates.mjs najděte C6, C10 a C77 a přečtěte si pole why.
- [ ] **Rozbijte kopii a sledujte chybu** (40 min)
  - *Proč:* Uvidíte kontrolu selhat. Kontrola, kterou nikdo neviděl selhat, není kontrola.
  1. Zkopírujte fixtures/2026-04-card-disputes do runs/test-rozbity.
  2. V briefu smažte povinné pole a spusťte check.mjs nad kopií.
  3. Přečtěte chybu, pak kopii smažte.

## Pá 27. 11. — Hlídače kroků (hooks)

### Ke studiu (asi 30 min)

- 📄 [Hooks – dokumentace VS Code](https://code.visualstudio.com/docs/agent-customization/hooks) — Dokumentace VS Code
- 📺 [Claude Code best practices](https://www.youtube.com/watch?v=gv0WHhKelSE) — Anthropic · část o hooks

### Klíčové myšlenky

- VS Code spustí skript na začátku chatu, před každým nástrojem, po něm a na konci tahu.
- Skript může krok odmítnout: zápis mimo běžící fázi, dokument před otevřením skillu, task pro člověka, hledání před fází 3.
- Instrukce říká, co má agent dělat. Hook zajistí, že to opravdu udělá.

### Úkoly

- [ ] **Prohlédněte nastavení hlídačů** (20 min)
  - *Proč:* Hooks jsou nejnovější vrstva. Musíte vědět, kdy se spouštějí.
  1. Otevřete .github/hooks/step-guards.json.
  2. Najděte čtyři okamžiky, kdy se hlídač spouští.
- [ ] **Najděte rozhodnutí hlídače** (60 min)
  - *Proč:* Tak zjistíte, proč agent něco nesměl udělat.
  1. Otevřete .github/.guard/decisions.jsonl po svém běhu z Týdne 2.
  2. Najděte 3 odmítnutí a s Claudem dohledejte pravidla v guard-rules.mjs.
- [ ] **Páteční schůzka s Igorem** (30 min)
  - *Proč:* Architektura je nejtěžší týden. Projděte nejasnosti, dokud jsou čerstvé.
  1. Deník a otázky.

## Kvíz

**1. Agent opakovaně zapisuje mimo svou fázi, i když to skill zakazuje. Kam patří oprava?**

   a) Přidat do skillu větu velkými písmeny
   b) Pravidlo hlídače (hook)
   c) Nic, model se to časem naučí

<details><summary>Odpověď</summary>

b) Pravidlo hlídače (hook) — Když instrukce nestačí a porušení jde poznat z volání nástroje, patří pravidlo do hooku.

</details>

**2. Proč se nesmí editovat .github/know-how/ přímo?**

   a) Je to generovaný soubor, změna by zmizela a C41 by ji odhalila
   b) Je jen pro čtení na Macu
   c) Patří Copilotu

<details><summary>Odpověď</summary>

a) Je to generovaný soubor, změna by zmizela a C41 by ji odhalila — Zdroj je v specifications/definitions/know-how. Generovaný soubor se při dalším know-how.mjs --write přepíše.

</details>

**3. Co znamená, že tools: ve wrapperu je „minimum, ne maximum"?**

   a) Agent může dostat i jiné zapnuté nástroje, proto se vypínají v settings.json
   b) Agent smí použít jen polovinu nástrojů
   c) Nástroje se načítají postupně

<details><summary>Odpověď</summary>

a) Agent může dostat i jiné zapnuté nástroje, proto se vypínají v settings.json — VS Code přidává nástroje navíc. SPOCK je proto ručně vypíná, aby agent neměl víc práv, než má.

</details>
