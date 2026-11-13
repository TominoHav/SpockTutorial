# Týden 5 (7.–13. 12.): Stavíte nové

**Cíl:** Přidáte do SPOCKu nový skill, ke kontrole napíšete negativní případ, postavíte vlastní hook a architekturu přenesete do Claude Code.

**Proč:** Po tomto týdnu nejste jen správce, ale builder.

## Po 7. 12. — Nový skill bez brány

### Ke studiu (asi 20 min)

- 📺 [Claude Agent Skills Explained](https://www.youtube.com/watch?v=fOxC44g8vig) — Anthropic · 3 min
- 📄 [Equipping agents with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills) — Anthropic · článek

### Klíčové myšlenky

- Zadání: skill brief-review pro Methodology Coache. Čte brief a podle method-canon §9 řekne, kde je outcome špatně.
- Vzorem je methodology-guidance. Skill nesmí potřebovat víc než readFile a listDirectory.

### Úkoly

- [ ] **Napište SKILL.md** (45 min)
  - *Proč:* Váš první skill od nuly.
  1. Vytvořte .github/skills/brief-review/SKILL.md.
  2. Kostra: frontmatter, Kontrakt, Postup, Meze. Vzor: methodology-guidance.
- [ ] **Zapište skill do registrů** (30 min)
  - *Proč:* Skill, který není v registru, pro SPOCK neexistuje.
  1. registry/skills.yaml: nový záznam.
  2. registry/agents.yaml: bindings a covers u methodology-coach.
- [ ] **Napojte skill na agenta** (15 min)
  - *Proč:* Agent musí vědět, že má skill načíst.
  1. Dopište ho do methodology-coach.agent.md.
- [ ] **Ověřte** (30 min)
  - *Proč:* Kontroly vám řeknou, co jste vynechal.
  1. Spusťte register.mjs --verify a repo-check.mjs.
  2. Opravte, co selže (typicky C47 nebo C85).

## Út 8. 12. — Evaluace nového skillu

### Ke studiu (asi 10 min)

- 📄 **Claude jako sparing partner** — „Navrhni 5 testovacích briefů, včetně jednoho s podstrčenou instrukcí."

### Klíčové myšlenky

- 5 vstupů: 2 s outcome ve tvaru řešení, 1 dobrý, 1 hraniční, 1 s podstrčenou instrukcí.
- Ke každému předem napište, co musí skill říct.

### Úkoly

- [ ] **Připravte testovací briefy** (45 min)
  - *Proč:* Bez testů nevíte, jestli skill funguje.
  1. 5 briefů: 2 s řešením místo outcome, 1 dobrý, 1 hraniční, 1 s podstrčenou instrukcí.
  2. Ke každému předem napište, co musí skill říct.
- [ ] **Otestujte a vylepšete** (75 min)
  - *Proč:* Evaluace z dobrého skillu udělá spolehlivý.
  1. Každý brief pusťte 2× v novém chatu.
  2. Výsledky do tabulky. Kde skill selže, upravte postup nebo přidejte příklad a zkuste znovu.

## St 9. 12. — Nová kontrola a její negativní případ

### Ke studiu (asi 30 min)

- 📄 **ENGINEERING-HANDOVER.md §6.6, §6.8, §6.9** — přidání kontroly, tvaru artefaktu a fáze

### Klíčové myšlenky

- Každá kontrola má pole why, tedy proč existuje.
- Nová celá fáze je nejdražší změna v buildu. Bez Igora ji nezkoušejte.

### Úkoly

- [ ] **Napište kontrolu** (60 min)
  - *Proč:* Pravidlo, které hlídá kód, ne agent.
  1. S Claudem ji implementujte v check.mjs.
  2. Zaregistrujte ji v gates.mjs i s polem why.
- [ ] **Napište negativní případ** (45 min)
  - *Proč:* Důkaz, že kontrola umí selhat.
  1. V check.test.mjs záměrně rozbitý běh a očekávaná hláška.
  2. Spusťte celou sadu.

## Čt 10. 12. — Vlastní hook

### Ke studiu (asi 30 min)

- 📄 [Hooks reference – Claude Code](https://code.claude.com/docs/en/hooks) — Dokumentace Claude Code
- 📺 [Claude Code best practices](https://www.youtube.com/watch?v=gv0WHhKelSE) — Anthropic

### Klíčové myšlenky

- Hook PreToolUse dostane popis volání nástroje a vrátí rozhodnutí jako JSON.
- Hlídače SPOCKu čtou práva agentů z registry/agents.yaml.

### Úkoly

- [ ] **Napište hook** (75 min)
  - *Proč:* Vynutíte pravidlo, které samotná instrukce neudrží.
  1. Na větvi pokus/hook si v guard-rules.mjs prohlédněte, jak je zapsané existující pravidlo.
  2. S Claudem přidejte stejným stylem pravidlo, které odmítne zápis do specifications/ a vrátí důvod.
- [ ] **Otestujte hook** (30 min)
  - *Proč:* Hook, který jste neviděl zasáhnout, nefunguje.
  1. Požádejte agenta, ať zapíše soubor mimo runs/.
  2. Ověřte, že to neudělá.

## Pá 11. 12. — Stejná architektura v Claude Code

### Ke studiu (asi 30 min)

- 📄 [Extend Claude Code](https://code.claude.com/docs/en/features-overview) — Dokumentace Claude Code
- 📄 [Subagents](https://code.claude.com/docs/en/sub-agents) — Dokumentace Claude Code
- 📺 [Claude Code best practices](https://www.youtube.com/watch?v=gv0WHhKelSE) — Anthropic · celé

### Klíčové myšlenky

- Agent patří do .claude/agents/, skill do .claude/skills/, hook do .claude/settings.json.
- Architektura nezávisí na tom, jaký nástroj ji spouští.

### Úkoly

- [ ] **Přeneste kousek SPOCKu do Claude Code** (75 min)
  - *Proč:* Uvidíte, že architektura nezávisí na nástroji.
  1. Založte novou prázdnou složku (např. spock-claude-code), ať nesaháte do SPOCKu.
  2. Zkopírujte do ní product-manager.agent.md, skill brief-creation a svůj hook.
  3. Agent do .claude/agents/, skill do .claude/skills/, hook do .claude/settings.json.
  4. Formát si ověřte v dokumentaci.
- [ ] **Prostudujte složku prototype** (30 min)
  - *Proč:* Skutečný plugin s hooky a poctivý report.
  1. Projděte složku prototype a REPORT.md.
- [ ] **Volitelně: uc-v-prompts jako skill** (30 min)
  - *Proč:* První vlastní produkt mimo SPOCK.
  1. Validaci udělejte v kódu místo v promptu.

## Kvíz

**1. Proč nedat agentovi nástroj „pro jistotu"?**

   a) Zpomalí to chat
   b) Každý nástroj navíc je riziko, hlavně u agenta, který čte cizí materiál
   c) Copilot to nedovolí

<details><summary>Odpověď</summary>

b) Každý nástroj navíc je riziko, hlavně u agenta, který čte cizí materiál — Nejmenší možná práva. Co agent nemá, to nemůže zneužít ani podstrčená instrukce.

</details>

**2. K čemu je negativní případ kontroly?**

   a) Dokazuje, že kontrola umí selhat
   b) Zrychluje kontrolu
   c) Je to dokumentace

<details><summary>Odpověď</summary>

a) Dokazuje, že kontrola umí selhat — Kontrola, kterou nikdo neviděl selhat, není kontrola. Negativní případ to dokazuje.

</details>

**3. Co je nejdražší změna v SPOCKu?**

   a) Oprava překlepu ve skillu
   b) Nová kontrola
   c) Nová celá fáze

<details><summary>Odpověď</summary>

c) Nová celá fáze — Fáze se dotýká kontraktu, bran, registrů, wrapperu, tvaru artefaktů, stromu běhu a negativní sady.

</details>
