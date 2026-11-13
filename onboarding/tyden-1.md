# Týden 1 (9.–15. 11.): Základy: jak fungují AI agenti

**Cíl:** Rozumíte pojmům, na kterých SPOCK stojí, umíte napsat dobrou instrukci a nebojíte se terminálu, gitu ani YAML.

**Proč:** Bez tohoto základu by další týdny byly jen opisování. Vibecoding vás naučil s AI mluvit; tady pochopíte, co se děje uvnitř.

## Po 9. 11. — Co je LLM a co je agent

### Ke studiu (asi 60 min)

- 📄 [Building effective agents](https://www.anthropic.com/research/building-effective-agents) — Anthropic · článek
- 📺 [Intro to Large Language Models](https://www.youtube.com/watch?v=zjkBMFhNj_g) — Andrej Karpathy · asi 1 h
- 📺 [How We Build Effective Agents](https://www.youtube.com/watch?v=D7_ipDqhtwk) — Barry Zhang, Anthropic · přednáška

### Klíčové myšlenky

- LLM dostane text a pokračuje v něm. Mezi konverzacemi si nic nepamatuje.
- Kontext je všechno, co model právě vidí. Co v kontextu není, model neví.
- Nástroj (tool) je funkce, o kterou model požádá. Spustí ji prostředí, například VS Code.
- Agent je model ve smyčce: přemýšlí, zavolá nástroj, přečte výsledek a pokračuje, dokud není hotovo.
- Workflow je předem dané pořadí kroků. SPOCK je workflow, které v každém kroku používá agenta.
- Model se mýlí a není deterministický. Proto SPOCK všechno kontroluje kódem.

### Úkoly

- [ ] **Otestujte, jestli si model vymýšlí** (15 min)
  - *Proč:* Halucinaci uvidíte na vlastní oči. Pak pochopíte, proč SPOCK nic nebere za ověřené bez kontroly kódem.
  1. Otevřete claude.ai a nový chat.
  2. Zeptejte se: „Jaké je interní číslo projektu SPOCK v České spořitelně?"
  3. Sledujte, jestli model přizná, že to neví, nebo si něco vymyslí. Zapište si to do deníku.
- [ ] **Porovnejte tři odpovědi na stejnou otázku** (15 min)
  - *Proč:* Model není deterministický: stejná otázka dá pokaždé trochu jinou odpověď. Proto se ve SPOCKu každá změna testuje víckrát.
  1. Ve třech nových chatech položte stejnou otázku: „Napiš outcome pro iniciativu: klienti nevyužívají nový účet."
  2. Odpovědi vložte vedle sebe do deníku.
  3. Zapište, v čem se liší a co mají společné.
- [ ] **Vyzkoušejte, co model „uvidí" v dlouhém textu** (20 min)
  - *Proč:* Kontext má limity a v dlouhém textu se detaily ztrácejí. Proto SPOCK dává agentovi jen to, co v dané fázi potřebuje.
  1. Vložte do chatu dlouhý dokument, třeba WORKFLOW-INTRODUCTION.md.
  2. Zeptejte se na konkrétní detail z prostředka textu.
  3. Odpověď si ověřte v dokumentu.
- [ ] **Založte si deník** (10 min)
  - *Proč:* Za 6 týdnů uvidíte, kam jste se posunul, a na páteční schůzky budete mít připravené otázky.
  1. Vytvořte soubor denik.md mimo repozitář SPOCKu (třeba v Dokumentech), ať se vám nedostane do commitů.
  2. Zapište 3 věci: co jste se naučil, co vás překvapilo, čemu nerozumíte. Takhle každý den.

## Út 10. 11. — Psaní instrukcí

### Ke studiu (asi 45 min)

- 📄 [Prompt engineering overview](https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/overview) — Dokumentace Claude
- 📺 [AI prompt engineering: A deep dive](https://www.youtube.com/watch?v=T9aRN5JkmL8) — Anthropic · diskuse

### Klíčové myšlenky

- Buďte konkrétní: kdo je čtenář, jaký je cíl a jak vypadá hotový výsledek.
- Příklad je silnější než pravidlo. Model spíš napodobí příklad, než aby poslechl větu.
- Říkejte, co dělat, ne jen co nedělat. U zákazu vždy uveďte důvod.
- Složitý úkol rozdělte na kroky a každému dejte jasný výstup.

### Úkoly

- [ ] **Napište stejnou instrukci ve třech verzích** (30 min)
  - *Proč:* Uvidíte, jak moc výsledek závisí na formulaci. Přesně tohle budete od ledna dělat ve skillech.
  1. Verze A: jedna věta „Pomoz mi sepsat brief iniciativy."
  2. Verze B: odstavec s pravidly: co má brief obsahovat, co nedomýšlet, jak se ptát.
  3. Verze C: stejná pravidla a k tomu jeden vzorový brief.
- [ ] **Porovnejte výsledky** (30 min)
  - *Proč:* Naučíte se poznat dobrou instrukci podle výsledku, ne podle pocitu.
  1. Každou verzi pusťte v novém chatu se stejným zadáním: „Klienti nevyužívají nový účet."
  2. Do tabulky v deníku zapište: ptal se model? domýšlel? jak vypadal výsledek?
  3. Která verze vyhrála a proč?
- [ ] **Najděte stejné techniky ve skutečném skillu** (30 min)
  - *Proč:* Uvidíte, že skill SPOCKu je jen velmi pečlivě napsaná instrukce, stejná jako ta vaše.
  1. Ve VS Code otevřete (Cmd+P) brief-creation/SKILL.md.
  2. Najděte, kde jsou pravidla, kde příklad, kde zákaz s důvodem a kde kroky.
  3. Zapište 3 věci, které byste ve své instrukci udělal jinak.

## St 11. 11. — Terminál a git

### Ke studiu (asi 60 min)

- 📺 [Absolute Beginner Guide to the Mac OS Terminal](https://www.youtube.com/watch?v=aKRYQsKR46I) — YouTube · pro úplné začátečníky
- 📺 [Git Tutorial for Beginners: Learn Git in 1 Hour](https://www.youtube.com/watch?v=8JJ101D3knE) — Programming with Mosh · stačí prvních 40 min
- 📄 **Claude jako učitel** — „Vysvětli mi git jako začátečníkovi a dej mi 5 cvičení."

### Klíčové myšlenky

- Terminál: cd, ls, pwd, spuštění příkazu a čtení jeho výstupu. Ve VS Code ho na Macu otevřete v menu Terminal → New Terminal, nebo přes Command+Shift+P a příkaz Terminal: Create New Terminal.
- Git: repozitář, commit, větev a diff.
- Každá změna metodiky má v gitu autora, datum a důvod. Kontroly SPOCKu historii gitu čtou.

### Příkazy

```bash
git init                       # 1. založí ve složce git (jen poprvé)
git add .                      # 2. připraví všechny soubory k uložení
git commit -m "První commit"   # 3. uloží je jako první verzi
git checkout -b zkouska        # 4. založí větev zkouska a přepne se na ni
                               # 5. teď ve VS Code změňte jednu větu ve skillu a uložte (Cmd+S)
git diff                       # 6. ukáže, co se změnilo (klávesa q = konec)
git commit -am "Moje změna"    # 7. uloží změnu na větvi zkouska
```

### Úkoly

- [ ] **Naučte se pohyb v terminálu** (20 min)
  - *Proč:* Kontroly SPOCKu se spouštějí v terminálu. Musíte se v něm umět pohybovat bez obav.
  1. Ve VS Code otevřete terminál: Terminal → New Terminal.
  2. Zkuste pwd (kde jsem), ls (co tu je), cd .github (vejdi do složky), cd .. (o úroveň výš).
  3. Tip: napište začátek názvu a stiskněte Tab, terminál ho doplní.
- [ ] **Uložte první verzi v gitu** (20 min)
  - *Proč:* Git je paměť metodiky. Každá změna má autora, datum a důvod a dá se vrátit.
  1. Napište příkazy 1–3 z rámečku výše, každý potvrďte Enterem. Text za # nepište.
  2. „nothing to commit" znamená, že je vše už uložené. To je v pořádku.
- [ ] **Udělejte změnu na vlastní větvi** (30 min)
  - *Proč:* Na větvi zkoušíte bezpečně. Hlavní verze (main) zůstane nedotčená.
  1. Příkaz 4: git checkout -b zkouska.
  2. Ve VS Code změňte jednu větu ve skillu a uložte (Cmd+S).
  3. git diff ukáže změnu (q = konec výpisu), příkaz 7 ji uloží.
- [ ] **Vraťte se na hlavní větev** (10 min)
  - *Proč:* Přepínání větví budete dělat při každé změně metodiky.
  1. git checkout main (nebo klikněte na název větve vlevo dole ve VS Code).
  2. git log --oneline ukáže, kde jste: HEAD -> main.
  3. Vaše změna zůstala uložená na větvi zkouska.

## Čt 12. 11. — Markdown, YAML, JSON a Node

### Ke studiu (asi 30 min)

- 📺 [Learn YAML in 17 Minutes](https://www.youtube.com/watch?v=qn1aoRBXeHo) — YouTube · volitelné, obecný úvod
- 📄 **Claude jako učitel** — Vložte jednu kontrolu z check.mjs (třeba C6): „Vysvětli mi ji řádek po řádku."

### Klíčové myšlenky

- Markdown (.md): skilly, know-how a dokumenty běhu. Náhled ve VS Code: Cmd+Shift+V.
- YAML (.yaml): registry a kontrakty. Na odsazení záleží.
- JSON (.json): tasks.json a settings.json.
- Node.js spouští skripty .mjs. Psát je nemusíte, ale musíte umět přečíst, co kontrolují.

### Cvičení (YAML): `.github/registry/skills.yaml`

V skills.yaml najděte (Cmd+F) id: brief-creation a zapište si agenta, fázi, ownera a počet souborů know-how. Pak na větvi zkouska změňte ownera, prohlédněte si git diff a změnu vraťte.

*Proč:* Sem zapíšete každý nový skill. Tady se rozhoduje, ke kterému agentovi patří a jaké know-how čte.

```
  - id: brief-creation
    name: Brief creation
    path: .github/skills/brief-creation/SKILL.md
    agent: product-manager
    stage: "1.1"
    owner: igor.tadic
    know_how:
      - .github/know-how/product/stage-1-shapes.md
      # komentář: tento řádek SPOCK ignoruje
```

- „- " na začátku = jedna položka seznamu. Tady jeden skill.
- „klíč: hodnota" = jedna informace, třeba agent: product-manager.
- know_how: je seznam. Jeho položky jsou odsazené o dvě mezery víc. Špatné odsazení = rozbitý soubor.
- # = komentář pro lidi. V registru jich je hodně, vysvětlují, proč je něco tak, jak je.

### Cvičení (Markdown): `.github/skills/brief-creation/SKILL.md`

Otevřete SKILL.md a stiskněte Cmd+Shift+V. Porovnejte text vlevo s náhledem vpravo. Pak na větvi zkouska ztučněte jedno slovo (**slovo**), sledujte náhled, prohlédněte si git diff a změnu vraťte.

*Proč:* Tohle je skill, tedy přesně to, co budete jako owner metodiky upravovat nejčastěji.

```
---
name: brief-creation
description: >
  Elicit and assemble an initiative brief through conversation…
---
# brief-creation

## Contract

- **Inputs:** user dialogue · any document the person supplies…
```

- Mezi --- a --- nahoře je hlavička v YAML. Podle description pozná VS Code, kdy skill použít.
- # a ## jsou nadpisy první a druhé úrovně.
- - je odrážka, **text** je tučně.
- Všechno ostatní je obyčejný text: instrukce, kterou agent čte.

### Cvičení (JSON): `.vscode/tasks.json`

V tasks.json najděte (Cmd+F) approve what is in front of me a zapište si label, command a kde je ${input:approver}. Pak Cmd+Shift+P → Tasks: Run Task a najděte stejný název v seznamu (nespouštějte ho).

*Proč:* Tady jsou tlačítka SPOCK: …, která spouštíte. Uvidíte, proč agent nemůže schválit za vás.

```
{
  "label": "SPOCK: approve what is in front of me",
  "type": "shell",
  "command": "node .github/scripts/task.mjs advance.mjs --approve …",
  "options": {
    "env": {
      "SPOCK_BOX_approver": "${input:approver}",
      "SPOCK_BOX_role": "${input:role}"
    }
  }
}
```

- { } ohraničují jeden záznam. Uvnitř je "klíč": hodnota a mezi položkami čárka.
- label = název, který vidíte v menu Tasks: Run Task.
- command = příkaz, který se spustí. Stejný, jako byste ho napsal do terminálu.
- ${input:approver} = okno, do kterého píšete své jméno. Vyplní ho jen člověk, proto agent nemůže schválit sám.

### Cvičení (Node (JavaScript)): `.github/scripts/gates.mjs`

V gates.mjs najděte řádek Q1: a opište si jeho C-čísla. Pak v terminálu spusťte node .github/scripts/check.mjs fixtures/2026-04-card-disputes --gates a najděte ve výstupu stejnou bránu.

*Proč:* Když brána neprojde, tady zjistíte, které kontroly do ní patří.

```
export const UNIVERSAL = ['C6', 'C14', 'C17', …];

Q2: { stage: 2, name: 'Opportunities',
      checks: ['C1', 'C2', 'C27', …] },
```

- UNIVERSAL = seznam kontrol, které běží v každé fázi.
- Q2 = brána fáze 2 a seznam jejích kontrol.
- Postup při chybě: C-číslo z hlášky najdete tady, pak v check.mjs zjistíte, co přesně kontroluje.
- Psát to nemusíte. Stačí to umět přečíst.

### Úkoly

- [ ] **YAML: přečtěte záznam skillu** (15 min)
  - *Proč:* Do registru skills.yaml zapíšete každý nový skill. Musíte v něm umět číst.
  1. Cmd+P → skills.yaml, pak Cmd+F → id: brief-creation.
  2. Zapište si agent, stage, owner a počet řádků v know_how.
  3. Totéž pro id: material-intake a porovnejte.
- [ ] **YAML: změňte a vraťte** (15 min)
  - *Proč:* Procvičíte celý cyklus změny: upravit, prohlédnout, vrátit.
  1. Na větvi zkouska změňte owner: igor.tadic na své jméno a uložte.
  2. git diff ukáže změnu: − je staré, + nové.
  3. git checkout -- .github/registry/skills.yaml ji vrátí. Prázdný git diff = hotovo.
- [ ] **Markdown: porovnejte text a náhled** (15 min)
  - *Proč:* Skilly a know-how jsou v Markdownu. Musíte vědět, co který znak dělá.
  1. Cmd+P → brief-creation/SKILL.md, pak Cmd+Shift+V.
  2. Porovnejte #, ** a - s náhledem.
  3. Volitelně: ztučněte slovo, prohlédněte git diff a změnu vraťte.
- [ ] **JSON: najděte schvalovací tlačítko** (15 min)
  - *Proč:* Pochopíte, proč agent nemůže schválit za vás. Je to hlavní pojistka SPOCKu.
  1. Cmd+P → tasks.json, Cmd+F → approve what is in front of me.
  2. Najděte label, command a ${input:approver}.
  3. Cmd+Shift+P → Tasks: Run Task a najděte stejný název (nespouštějte).
- [ ] **Node: přečtěte bránu Q1** (20 min)
  - *Proč:* Když vám PM napíše, že mu neprojde brána, tady začnete hledat příčinu.
  1. Pokud nemáte Node, nainstalujte ho z nodejs.org (LTS) a restartujte VS Code (Cmd+Q).
  2. Cmd+P → gates.mjs, najděte řádek Q1: a opište si C-čísla.
  3. Spusťte node .github/scripts/check.mjs fixtures/2026-04-card-disputes --gates a najděte řádek Q1.
- [ ] **Nechte si vysvětlit kontrolu** (30 min)
  - *Proč:* Kontroly psát nebudete, ale musíte je umět přečíst.
  1. Ve své kopii SPOCKu otevřete (Cmd+P) .github/scripts/check.mjs. Je dlouhý, celý ho číst nemusíte.
  2. Cmd+F najděte C6 a zkopírujte celou tu kontrolu (pár řádků).
  3. Vložte ji Claudovi: „Tohle je kontrola ze SPOCKu. Vysvětli mi ji řádek po řádku jako začátečníkovi."
  4. Zeptejte se, co by se stalo, kdyby brief neměl metric.
- [ ] **Přidejte vlastní zkušební kontrolu** (45 min)
  - *Proč:* Poprvé sami vytvoříte pravidlo, které hlídá kód. To je jádro práce buildera. Pracujete ve své kopii SPOCKu na zkušební větvi, kterou na konci smažete, takže hlavní verze zůstane nedotčená.
  1. Čistý start: v terminálu git status. Musí psát „nothing to commit, working tree clean". Když vypíše „modified:" se soubory z předchozích cvičení, prohlédněte si je (git diff) a zahoďte: git restore . a znovu git status. Když změnu chcete nechat, uložte ji místo toho: git commit -am "Rozpracované".
  2. git checkout main a pak git checkout -b pokus/c900. Vlevo dole ve VS Code teď musí být pokus/c900.
  3. Číslo C7 je ve SPOCKu nejspíš obsazené. Cmd+Shift+F (hledání v celém projektu) hledejte C900. Když nic nenajde, je volné.
  4. Najděte, kde je nějaká existující kontrola napsána. Kontroly nemusí být přímo v check.mjs, proto v terminálu napište: grep -rn "C10" .github/scripts | head -20 a otevřete soubor, kde je kontrola definovaná (ne jen zmíněná v seznamu). Když si nevíte rady, výstup vložte Claudovi.
  5. Kód nepište sám. V Copilot Chatu (s otevřeným souborem, kde jste kontrolu našel) napište: „Přidej vedle kontroly C10 novou kontrolu C900: metric v briefu musí obsahovat číslo nebo %. Napiš ji stejným stylem jako C10 a nic jiného neměň."
  6. git diff: musí v něm být jen nové řádky (+). Když se změnilo i něco jiného, vraťte to (git restore .) a zkuste znovu.
  7. Na originální ukázku nesahejte, udělejte si kopii: cp -R fixtures/2026-04-card-disputes runs/test-c900
  8. Test, že projde: v runs/test-c900 otevřete brief ve složce 1-brief, najděte metric, nastavte „20 % účtů s platbou do 7 dní" a uložte. Spusťte node .github/scripts/check.mjs runs/test-c900 a najděte C900 jako splněnou.
  9. Když C900 ve výstupu vůbec není, SPOCK ji nespouští, dokud není v gates.mjs. Požádejte Copilota: „Přidej C900 do brány Q1 v gates.mjs." a spusťte znovu.
  10. Test, že selže: změňte metric na „spokojenost", uložte a spusťte znovu. C900 musí selhat. Teprve tím víte, že kontrola opravdu funguje.
  11. Když něco nefunguje, chybu z terminálu vložte Claudovi.
  12. Úklid: rm -rf runs/test-c900, pak git checkout -- . (zahodí změny), git checkout main a git branch -D pokus/c900. Jste přesně tam, kde jste začal.
  13. Proč kontrolu neuchováte: skutečná kontrola ve SPOCKu potřebuje i pole why a negativní případ v check.test.mjs. To přijde v Týdnu 5.

## Pá 13. 11. — První agent ve VS Code

### Ke studiu (asi 30 min)

- 📄 [Custom agents in VS Code](https://code.visualstudio.com/docs/copilot/customization/custom-agents) — Dokumentace VS Code
- 📄 [Agent Skills](https://code.visualstudio.com/docs/agent-customization/agent-skills) — Dokumentace VS Code
- 📺 [Customize your agents](https://www.youtube.com/watch?v=flpKLkZla2Q) — Visual Studio Code · oficiální kanál

### Klíčové myšlenky

- Wrapper agenta (.agent.md) určuje, kdo agent je a jaké nástroje smí.
- Wrapper se načte jen při startu chatu. Po změně vždy otevřete nový chat.

### Úkoly

- [ ] **Projděte brief s agentem ve své kopii SPOCKu** (45 min)
  - *Proč:* Poprvé uvidíte agenta pracovat podle skillu a kontrolu ho hlídat. Fázi 1 si v Týdnu 2 projdete znovu a důkladněji.
  1. Ve VS Code mějte otevřenou svou kopii SPOCKu (File → Open Folder).
  2. Jen poprvé: Tasks: Run Task → SPOCK: check my setup a zvolte copilot (používáte Copilot Chat ve VS Code). Bez toho SPOCK běh nezaloží. Opravte, co task označí.
  3. Tasks: Run Task → SPOCK: start a run. Zadejte název (2026-11-pokus), své jméno a roli.
  4. V Copilot Chatu vyberte agenta Product Manager.
  5. Napište úvodní povel přesně podle SETUP.md, krok 6 (např. „Začni discovery"), a pak popište problém: „Klienti nevyužívají nový účet". Odpovídejte na otázky.
  6. Až agent požádá o review, spusťte Tasks: Run Task → SPOCK: approve what is in front of me.
- [ ] **Odeberte agentovi nástroj** (40 min)
  - *Proč:* O co jde: každý agent má v souboru .agent.md (wrapper) seznam nástrojů, které smí používat, něco jako seznam klíčů. Jeden z nich mu dovoluje spouštět kontroly SPOCKu. Ten mu na zkoušku vezmete a podíváte se, co agent udělá, když kontrolu spustit nemůže. Uvidíte na vlastní oči, že co agent v tools: nemá, to opravdu neudělá, a jestli si pak něco nevymyslí. Na konci vše vrátíte.
  1. Čistý start: v terminálu git status. Musí psát „working tree clean". Když ne, git restore . a znovu git status.
  2. Zkušební větev: git checkout main a pak git checkout -b pokus/tools. Vlevo dole ve VS Code musí být pokus/tools.
  3. Otevřete wrapper: Cmd+P → product-manager.agent.md. Nahoře mezi --- a --- je hlavička v YAML a v ní řádek tools: se seznamem nástrojů.
  4. Opište si do deníku celý seznam tools: beze změny. Budete ho porovnávat.
  5. Najděte nástroj na spouštění tasků (obvykle runTask nebo runTasks). Když si nejste jistý, vložte řádek tools: Claudovi a zeptejte se.
  6. Smažte jen tuto jednu položku i s čárkou, aby seznam zůstal platný (např. z [readFile, runTask, editFiles] vznikne [readFile, editFiles]). Uložte (Cmd+S).
  7. git diff: musí ukázat jediný změněný řádek, tools: bez toho nástroje.
  8. Otevřete nový chat (ikona + v Copilot Chatu). Wrapper se načítá jen při startu chatu, ve starém chatu by agent nástroj pořád měl.
  9. Zvolte agenta Product Manager a napište: „Spusť kontrolu briefu v aktuálním běhu a řekni mi výsledek."
  10. Sledujte a zapište si: Přizná, že kontrolu spustit nemůže? Požádá vás, ať ji spustíte sami? Nebo si výsledek vymyslí („kontrola prošla")? Poslední možnost je přesně důvod, proč SPOCK věří jen výstupu kódu.
  11. Volitelně: node .github/scripts/repo-check.mjs. Nejspíš selže kontrola C85, protože wrapper už nesedí s registry/agents.yaml. Tak SPOCK hlídá, aby se práva agenta neměnila potichu.
  12. Úklid: git restore . (vrátí wrapper), git checkout main a git branch -D pokus/tools. Pak otevřete nový chat, ať má agent zase své nástroje.
- [ ] **Páteční schůzka s Igorem** (30 min)
  - *Proč:* Otázky, na které jste nenašel odpověď, vyřešíte za 30 minut místo hodin.
  1. Vezměte si deník a projděte, co jste udělal a čemu nerozumíte.
  2. Požádejte o celý git repozitář (potřebujete ho do 20. 11.).

## Kvíz

**1. Proč je SPOCK workflow, a ne jeden velký agent?**

   a) Pořadí fází je dané předem a o postupu rozhodují kontroly a člověk
   b) Agenti jsou dražší než workflow
   c) VS Code jiné agenty nepodporuje

<details><summary>Odpověď</summary>

a) Pořadí fází je dané předem a o postupu rozhodují kontroly a člověk — Pořadí 7 fází je pevně v kontraktech. Agent pracuje jen uvnitř fáze, v mezích skillu a nástrojů.

</details>

**2. Agent v chatu napíše „kontrola prošla". Co uděláte?**

   a) Věřím mu
   b) Podívám se na výstup tasku nebo kontroly
   c) Zeptám se ho, jestli si je jistý

<details><summary>Odpověď</summary>

b) Podívám se na výstup tasku nebo kontroly — Pravdu říká výstup kódu, ne věta modelu. Model umí s jistotou tvrdit nepravdu.

</details>

**3. Kdo doopravdy spouští nástroj, který agent zavolá?**

   a) Model sám
   b) Prostředí, ve kterém agent běží (VS Code)
   c) Uživatel ručně

<details><summary>Odpověď</summary>

b) Prostředí, ve kterém agent běží (VS Code) — Model jen požádá o volání. Akci provede VS Code, a proto jde volání hlídat hooky.

</details>
