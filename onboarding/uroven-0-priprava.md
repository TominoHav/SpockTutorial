# Úroveň 0: Příprava (všichni, 2–3 h)

**Cíl:** Máte všechno, co SPOCK potřebuje, ještě než ho poprvé spustíte: přístupy a licence, nainstalované nástroje, přihlášený GitHub Copilot ve VS Code, svou kopii SPOCKu, prošlou kontrolu nastavení a šest viditelných agentů. A znáte pět pravidel, která se nikdy neporušují.

**Proč:** Když instalace není v pořádku, agenti se chovají nepředvídatelně a nepoznáte, jestli je chyba ve SPOCKu, nebo ve vašem počítači. Některé přístupy se schvalují i několik dní, takže **lekci 0.1 udělejte jako první**, ještě dnes. Celkem počítejte se 2–3 hodinami práce, rozloženými do několika dní kvůli čekání na přístupy.

**Jak tu lekci používat:** Kroky dělejte popořadě a za každým si ověřte výsledek. Postup vychází ze `SETUP.md` (release 1.16.1). Když se vaše kopie SPOCKu liší, platí její `SETUP.md`. Kde se postup liší podle systému, jsou kroky zvlášť pro **Mac** a **Windows**.

> **Co v podkladech SPOCKu není:** přesný interní postup ČS, jak si zažádat o GitHub účet, licenci Copilota nebo přístup k repozitáři. Lekce říká, *co* potřebujete a *co* napsat do žádosti. *Kam* žádost poslat, si ověřte u Igora Tadiće nebo u svého IT.

## 0.1 — Přístupy a licence

### Ke studiu (asi 10 min)

- 📄 **`SETUP.md`** §1 („What you need installed“), tabulka nahoře

### Klíčové myšlenky

- **SPOCK běží ve VS Code s GitHub Copilot a Copilot Chat, přihlášenými vaším GitHub účtem České spořitelny** (`SETUP.md` §1). Bez Copilota se agenti SPOCKu nespustí.
- **Potřebujete čtyři přístupy:** GitHub účet ČS, licenci GitHub Copilot, adresu repozitáře SPOCKu s právem ho stáhnout a oprávnění instalovat software (nebo pomoc IT, která ho nainstaluje).
- **Copilot musí ve vaší firemní konfiguraci povolit agent mode a vlastní agenty** (custom agents) a v nabídce modelů musí být **Claude Sonnet 5**. Když agenti chybí, bývá příčinou firemní nastavení Copilota (`SETUP.md` §5).
- **Testeři potřebují navíc** přístup k repozitáři AI Lab se složkou `SPOCK | Workflow Documentation` a testovacími scénáři (`TESTER-GUIDE.md` úvod).

### Úkoly

- [ ] **Ověřte si GitHub účet ČS** (10 min)
  - *Proč:* Copilot i repozitář SPOCKu jsou navázané na firemní GitHub účet. Soukromý účet nestačí.
  1. Přihlaste se na [github.com](https://github.com) účtem, který používáte pro práci v ČS.
  2. Ověřte, že jste členem organizace ČS (profil → Organizations). Pokud ne, nebo účet nemáte, požádejte o něj přes IT.
  3. Zapište si své uživatelské jméno na GitHubu. Budete ho uvádět v žádostech.
- [ ] **Požádejte o licenci GitHub Copilot pro VS Code** (15 min, schválení může trvat dny)
  - *Proč:* Agenti SPOCKu jsou Copilot agenti. Bez licence nic nespustíte.
  1. Zjistěte u Igora nebo IT, kudy se v ČS o Copilota žádá.
  2. Do žádosti napište: své GitHub uživatelské jméno, že potřebujete **GitHub Copilot a Copilot Chat ve Visual Studio Code**, k čemu (pilot SPOCK, discovery workflow), a že potřebujete **agent mode, vlastní agenty (custom agents) a model Claude Sonnet 5**.
  3. Když je licence přidělená, na [github.com/settings/copilot](https://github.com/settings/copilot) uvidíte, že Copilot máte aktivní.
- [ ] **Vyžádejte si přístup k repozitáři SPOCKu** (10 min)
  - *Proč:* SPOCK si do počítače naklonujete z repozitáře. Bez přístupu ho nestáhnete ani neaktualizujete.
  1. Požádejte Igora o adresu repozitáře SPOCKu a o přístup pro své GitHub jméno.
  2. Ověřte, že stránku repozitáře v prohlížeči otevřete.
  3. Testeři navíc požádají o přístup k repozitáři AI Lab se složkou `SPOCK | Workflow Documentation`.
- [ ] **Ověřte, jestli smíte instalovat software** (5 min)
  - *Proč:* VS Code, Node.js a Git musí být na vašem počítači. Na firemním počítači to někdy dělá IT.
  1. Zkuste nainstalovat jakoukoli aplikaci nebo se podívejte do firemního katalogu softwaru.
  2. Pokud instalovat nesmíte, požádejte IT o **VS Code** (aktuální verze), **Node.js 22 LTS** a **Git**.

## 0.2 — Instalace nástrojů

### Ke studiu (asi 5 min)

- 📄 **`SETUP.md`** §1

### Klíčové myšlenky

- **Čtyři věci, nic dalšího:** VS Code (aktuální verze), GitHub Copilot a Copilot Chat, **Node.js 20 nebo 22** a Git. Všechno, co SPOCK spouští, je malý Node skript. Nic dalšího se neinstaluje (`SETUP.md` §1).
- **Node.js volte verzi 22, LTS** (dlouhodobá podpora). SPOCK je testovaný na verzích 20 a 22. Jinou verzi kontrola nastavení ohlásí jako chybějící.
- **Po instalaci Node.js nebo Gitu VS Code zavřete a znovu otevřete.** Jinak nástroj nenajde.
- **Command Palette je ve VS Code vyhledávací řádek pro všechny příkazy.** Místo hledání v menu napíšete, co chcete udělat, a VS Code příkaz najde. Otevřete ji klávesovou zkratkou **Cmd+Shift+P** (Mac) nebo **Ctrl+Shift+P** (Windows), případně z menu **View → Command Palette**. Nahoře uprostřed okna se objeví řádek se znakem `>`. Napište část názvu příkazu (např. `git clone`), šipkami vyberte příkaz ze seznamu a potvrďte **Enter**. Zavřete ji klávesou **Esc**. SPOCK ji používá na všechno: klonování, spouštění tasků i znovunačtení okna.

### Úkoly

- [ ] **Nainstalujte VS Code** (10 min)
  - *Proč:* SPOCK běží uvnitř VS Code. Agenti, tasky i nastavení jsou soubory, které čte VS Code.
  1. Otevřete [code.visualstudio.com](https://code.visualstudio.com/) a stáhněte verzi pro svůj systém. Jde o **Visual Studio Code**, ne o „Visual Studio“ (to je jiný, velký program).
  2. **Mac:** rozbalte stažený soubor a aplikaci *Visual Studio Code* přetáhněte do složky *Aplikace*. Spusťte ji odtud.
  3. **Windows:** spusťte instalátor (User Installer) a nechte zaškrtnuté **Add to PATH**. Ostatní volby nechte výchozí.
  4. Ověření: VS Code se otevře.
  5. Vyzkoušejte si Command Palette: stiskněte **Cmd+Shift+P** (Mac) nebo **Ctrl+Shift+P** (Windows), napište `theme`, šipkami vyberte **Preferences: Color Theme**, potvrďte Enter a pak Esc. Tak budete spouštět všechny příkazy v dalších krocích.
  6. Volitelně, jen na Macu: v Command Palette napište `shell command`, vyberte **Shell Command: Install 'code' command in PATH** a potvrďte Enter. Pak půjde VS Code otevřít i z terminálu příkazem `code`.
- [ ] **Nainstalujte Node.js 22 LTS** (10 min)
  - *Proč:* Každý task SPOCKu (kontroly, zápisy, podpisy) spouští Node skript. Bez Node žádný task nefunguje.
  1. Otevřete [nodejs.org/en/download](https://nodejs.org/en/download) a zvolte **verzi 22, LTS**.
  2. **Mac:** stáhněte instalátor `.pkg` a projděte ho s výchozími volbami.
  3. **Windows:** stáhněte instalátor `.msi` a projděte ho s výchozími volbami. Volbu instalace nástrojů pro nativní moduly (Chocolatey) SPOCK nepotřebuje, můžete ji nechat vypnutou.
  4. Ověření: ve VS Code otevřete Terminal → New Terminal a napište `node -v`. Musí vypsat `v22.…` (nebo `v20.…`).
- [ ] **Nainstalujte Git** (10 min)
  - *Proč:* Gitem SPOCK naklonujete a později jedním taskem aktualizujete. Bez Gitu kontrola nastavení ohlásí, že kopii nejde aktualizovat (`SETUP.md` §2 a §8).
  1. **Mac:** v Terminálu napište `git --version`. Když Git chybí, Mac sám nabídne instalaci nástrojů pro vývojáře (Command Line Tools). Potvrďte ji. Případně stáhněte Git z [git-scm.com/downloads](https://git-scm.com/downloads).
  2. **Windows:** stáhněte **Git for Windows** z [git-scm.com/downloads](https://git-scm.com/downloads) a nainstalujte s výchozími volbami.
  3. Ověření: zavřete a znovu otevřete VS Code, v novém terminálu napište `git --version`. Musí vypsat číslo verze.
  4. Doporučené: nastavte si jméno a e-mail pro Git, `git config --global user.name "Jméno Příjmení"` a `git config --global user.email "vas.email@…"` (firemní e-mail).

## 0.3 — GitHub Copilot ve VS Code

### Ke studiu (asi 10 min)

- 📄 **`SETUP.md`** §1, §5 a §6 (odstavec o modelu)
- 📄 **`SETUP.md`** §3 (odstavec o tom, co Copilot zaznamenává)

### Klíčové myšlenky

- **Copilot a Copilot Chat** se do VS Code přidávají jako rozšíření a přihlašují se GitHub účtem ČS (`SETUP.md` §1). V novějších verzích VS Code je Copilot nabízený rovnou a přihlášení stačí.
- **Agenti SPOCKu se vybírají ve výběru agenta v okně Copilot Chatu.** Pokud tam nejsou, firemní nastavení Copilota nejspíš nepovoluje vlastní agenty nebo agent mode (`SETUP.md` §5).
- **Model se volí ručně před první zprávou: Claude Sonnet 5, effort High, kontext 1M.** Agenti nevidí, jaký model běží, takže to za vás nikdo nezkontroluje (`SETUP.md` §6).
- **Copilot si může zapisovat lokální záznam (trace)** jen tehdy, když ho zapnete ve vlastním uživatelském nastavení. Záznam obsahuje názvy nástrojů, cesty souborů, modely a počty tokenů, ale ne text promptů ani dokumentů. Vypnete ho nastavením `"github.copilot.chat.otel.enabled": false` (`SETUP.md` §3).

### Úkoly

- [ ] **Nainstalujte a přihlaste Copilota** (15 min)
  - *Proč:* Bez přihlášeného Copilota se okno chatu neotevře a agenti SPOCKu nejsou k dispozici.
  1. Ve VS Code otevřete Extensions (ikona čtverečků vlevo), vyhledejte **GitHub Copilot** a **GitHub Copilot Chat** a nainstalujte je, pokud tam ještě nejsou.
  2. VS Code vás vyzve k přihlášení. Zvolte **Sign in with GitHub** a přihlaste se **účtem ČS**. Pokud výzva nepřijde, klikněte na ikonu účtu vlevo dole (Accounts) a přihlaste se odtud.
  3. Otevřete okno chatu (ikona Copilota nahoře nebo View → Chat).
  4. Ověření: v chatu napište „ahoj“ a dostanete odpověď. Když chat hlásí, že nemáte licenci, vraťte se k úkolu o licenci v lekci 0.1.
- [ ] **Ověřte agent mode a výběr modelu** (5 min)
  - *Proč:* SPOCK potřebuje agenty a konkrétní model. Když chybí, zjistíte to teď a ne uprostřed běhu.
  1. V okně chatu najděte výběr režimu nebo agenta a ověřte, že nabízí **Agent**.
  2. Ve výběru modelu najděte **Claude Sonnet 5**. Pokud tam není, firemní nastavení Copilota ho nepovoluje. Napište to IT nebo Igorovi spolu se screenshotem výběru.

## 0.4 — SPOCK ve vašem počítači

### Ke studiu (asi 15 min)

- 📄 **`README.md`** v kořeni SPOCKu, jedna obrazovka s přehledem 7 fází
- 📄 **`SETUP.md`**, kroky 2–6

### Klíčové myšlenky

- **SPOCK naklonujte, nestahujte jako ZIP.** Klon se později aktualizuje jedním taskem, ZIP by se musel stahovat znovu (`SETUP.md` §2 a §8).
- **Ve VS Code otevírejte složku, která přímo obsahuje `.github` a `.vscode`,** a autorům složky důvěřujte. V restricted mode se tasky nespustí (`SETUP.md` §3).
- **Všechno, co SPOCK dělá za vás, je task.** Task je předem připravený příkaz, který spustí skript SPOCKu, a jejich seznam je v souboru `.vscode/tasks.json` vaší kopie. Spustíte ho dvěma způsoby: buď **Command Palette → napíšete `run task` → vyberete `Tasks: Run Task` → Enter**, nebo z menu **Terminal → Run Task…**. Pak se ukáže seznam tasků. Napište část názvu (např. `check my setup`), vyberte task a potvrďte Enter.
- **Když task něco potřebuje, otevře nahoře v okně políčko** (box). Vyplníte ho a potvrdíte Enterem. Esc task zruší a nic se nezapíše. Výpis tasku se ukáže dole v panelu Terminal a celý je i v souboru `.github/last-task.md`.
- **Rozšíření pro webové vyhledávání nepotřebujete.** Fáze 3 funguje se seznamem konkurentů. Vyhledávání vyžaduje zvlášť instalované rozšíření a klíč a je jen pro testování (`SETUP.md` §6 krok 5).

### Úkoly

- [ ] **Naklonujte SPOCK a otevřete ho** (15 min)
  - *Proč:* Jen ze správně otevřené složky najde VS Code agenty, tasky a nastavení SPOCKu.
  1. Otevřete Command Palette (**Cmd+Shift+P** na Macu, **Ctrl+Shift+P** na Windows, nebo **View → Command Palette**).
  2. Napište `git clone`, vyberte **Git: Clone** a potvrďte Enter.
  3. Do políčka, které se objeví, vložte adresu repozitáře SPOCKu z lekce 0.1 (Cmd+V nebo Ctrl+V) a potvrďte Enter. Když VS Code nabídne přihlášení ke GitHubu, přihlaste se účtem ČS.
  4. Zvolte místo na disku, kam kopii uložíte, ne do sdílené složky.
  5. Až se VS Code zeptá, zvolte **Open**.
  6. Na otázku, jestli důvěřujete autorům, odpovězte, že ano.
  7. Ověření: v Exploreru vlevo vidíte přímo složky `.github` a `.vscode`.
- [ ] **Spusťte SPOCK: check my setup** (15 min)
  - *Proč:* Kontrola ověří Node, Git, vaši kopii, agenty a model najednou. Dokud SPOCK neví, v jakém nástroji pracujete, nezaloží žádný běh (`SETUP.md` §4).
  1. Otevřete seznam tasků: z menu **Terminal → Run Task…**, nebo v Command Palette napište `run task` a vyberte **Tasks: Run Task**.
  2. V seznamu napište `check my setup`, vyberte **SPOCK: check my setup** a potvrďte Enter.
  3. Nahoře se objeví políčko s otázkou, jaký nástroj používáte. Vyberte **GitHub Copilot** a potvrďte Enter.
  4. Dole se otevře panel Terminal s výpisem.
  5. Projděte výpis řádek po řádku. Opravte, co je označené jako *missing*, a task spouštějte znovu, dokud poslední řádek nehlásí, že je vše na místě.
  6. Když v seznamu tasků není nic, co začíná `SPOCK:`, máte otevřenou jinou složku nebo jste v restricted mode. Vraťte se k předchozímu úkolu.
- [ ] **Zkontrolujte šest agentů** (5 min)
  - *Proč:* Agent navíc nebo chybějící agent znamená jinou konfiguraci, než SPOCK předpokládá, a výsledky by neplatily (`TESTER-GUIDE.md` §2.2).
  1. Otevřete výběr agenta v Copilot Chatu.
  2. Musí tam být přesně těchto šest: **Business Analyst, Competitive Analysis, Methodology Coach, Opportunity Designer, Product Manager, Workflow Support**.
  3. Když nějaký chybí nebo přebývá, zastavte se a pošlete Igorovi screenshot výběru se jmény agentů.
- [ ] **Nastavte model a zkontrolujte náhled dokumentů** (5 min)
  - *Proč:* Agenti nevidí, jaký model běží. A jedno rozšíření umí zkazit náhled dokumentů SPOCKu.
  1. Ve výběru modelu v chatu zvolte **Claude Sonnet 5**, effort **High** a kontext **1M** (`SETUP.md` §6).
  2. Otevřete libovolný dokument ukázkového běhu (např. `fixtures/2026-09-savings-goals/1-brief/initiative-brief.md`) a dejte náhled (Cmd+Shift+V nebo Ctrl+Shift+V).
  3. Když dokument začíná tabulkou `[object Object]`, vypněte rozšíření `bierner.markdown-yaml-preamble` (`TESTER-GUIDE.md` §2.5).

## 0.5 — Pět pravidel, která se neporušují

### Ke studiu (asi 20 min)

- 📄 **`SETUP.md`** kroky 6–10 a **§9 What not to change**

### Klíčové myšlenky

1. **Rozhodnutí podepisujete vy, sami a svým jménem.** Task, který otevírá políčka na jméno, roli, důvod nebo rozhodnutí, spouštíte jen vy. Když se o to pokusí agent, odmítněte to (`SETUP.md` §6 krok 3–4).
2. **Do chatu nepřikládejte soubory.** Jedinou výjimkou je brief ve fázi 1. Příloha se posílá s každou další zprávou, prodražuje ji a PDF může rozbít konverzaci. Materiál patří do složky `supplied/` dané fáze (`SETUP.md` §6 krok 8).
3. **Běhy zůstávají u vás.** Složka `runs/` je mimo git a může obsahovat klientský materiál. Nikam ji nekopírujte. Celý běh se posílá jen Igorovi a jen jako ZIP (`SETUP.md` §6 krok 6 a §10).
4. **Nic pod `.github/` ani `.vscode/` neupravujte.** To je samotné workflow (`SETUP.md` §9).
5. **Výchozí schvalování ve VS Code nechte zapnuté** a nevolte „Allow All“. Tasky `SPOCK:` bez políček agent spustit smí, cokoli mimo složku SPOCKu odmítněte (`SETUP.md` §6 krok 4).

### Úkoly

- [ ] **Najděte v `TASKS.md` tři tasky, které otevírají políčka** (15 min)
  - *Proč:* Podle toho, jestli task otevírá políčka, poznáte, kdo ho smí spustit. Tasky s políčky jsou vaše, tasky bez políček smí spustit i agent.
  1. Otevřete `specifications/onboarding/TASKS.md`.
  2. Vypište si tři tasky s řádkem „Opens N boxes“ a tři s „Opens no box“.
  3. U každého jednou větou: proč ho asi spouští člověk, nebo proč ho smí spustit agent?
- [ ] **Založte si deník** (5 min)
  - *Proč:* Do deníku si zapisujete, co agent udělal jinak, než jste čekali. Z těchhle zápisků vzniká zpětná vazba pro Igora (úroveň 4).
  1. Vytvořte si soubor `denik.md` **mimo** složku SPOCKu.
  2. První zápis: datum, verze SPOCKu (nahoře v `SETUP.md`, např. 1.16.1), model, který jste zvolili, a výsledek `check my setup`.

## Kvíz

**1. Copilot Chat ve VS Code funguje, ale ve výběru agentů nevidíte žádného agenta SPOCKu. Co je nejpravděpodobnější příčina?**

   a) Špatná verze Node.js
   b) Otevřená jiná složka, nebo firemní nastavení Copilota nepovoluje vlastní agenty
   c) Chybí rozšíření pro webové vyhledávání

<details><summary>Odpověď</summary>

b) Agenti se načítají ze složky `.github/agents/` otevřené kopie. Když složka sedí a agenti přesto chybí, firemní nastavení Copilota nejspíš nepovoluje vlastní agenty nebo agent mode (`SETUP.md` §3 a §5).

</details>

**2. `SPOCK: check my setup` hlásí „Node.js: missing: Node.js 18 is installed“. Co uděláte?**

   a) Nic, SPOCK poběží
   b) Nainstaluji Node.js 22 LTS z nodejs.org, zavřu a znovu otevřu VS Code a spustím kontrolu znovu
   c) Přeinstaluji VS Code

<details><summary>Odpověď</summary>

b) SPOCK je testovaný na Node.js 20 a 22 a kontrola radí nainstalovat verzi 22 LTS. Po instalaci je potřeba VS Code otevřít znovu, aby novou verzi našel.

</details>

**3. Agent vám napíše: „Teď spustím SPOCK: approve what is in front of me a schválím brief.“ Co uděláte?**

   a) Nechám ho, ušetří mi to práci
   b) Odmítnu to. Ten task otevírá políčka na mé jméno a spouštím ho já
   c) Nechám ho a jméno pak opravím

<details><summary>Odpověď</summary>

b) Task otevírá políčka na jméno a rozhodnutí, a ta vyplňuje jen člověk. Podle `TASKS.md` agent tento task spustit nesmí: políčka jsou záznam, že rozhodl člověk.

</details>

**4. Máte k fázi 2 dvacetistránkové PDF s výzkumem. Kam s ním?**

   a) Přiložím ho do chatu
   b) Vložím jeho text do chatu
   c) Uložím ho do `runs/<běh>/2-problems/supplied/` tak, jak je

<details><summary>Odpověď</summary>

c) Materiál patří do složky `supplied/`. SPOCK si PDF sám převede na text. Příloha v chatu by se posílala s každou další zprávou (`SETUP.md` §6 krok 8).

</details>
