# Úroveň 1: Příprava (všichni, 2–3 h práce plus čekání na role)

**Cíl:** Máte všechno, co SPOCK potřebuje: schválené role v REDIMu, nainstalované nástroje a SSH certifikát, přihlášený GitHub Copilot ve VS Code, svou kopii SPOCKu, prošlou kontrolu nastavení a šest viditelných agentů. A jednou jste prošli hotový ukázkový běh.

**Proč:** Když instalace není v pořádku, agenti se chovají nepředvídatelně a nepoznáte, jestli je chyba ve SPOCKu, nebo ve vašem počítači. **Role v REDIMu objednejte jako první**, schválení trvá i několik dní. Mezitím můžete procházet úroveň 0.

**Jak tu úroveň používat:** Kroky dělejte popořadě a za každým si ověřte výsledek. Kde se postup liší podle systému, jsou kroky zvlášť pro **Mac** a **Windows**. Interní postup ČS vychází z materiálů bootcampu ve složce `materialy/bootcamp/` tohoto repozitáře.

## 1.1 — Přístupy a role v REDIMu

### Karty (asi 5 min, jen na webu)

#### Přístupy se objednávají v REDIMu

V ČS se oprávnění objednávají jako **role v REDIMu**, interním systému pro žádosti. Pro SPOCK potřebujete tři role. Schválení může trvat dny, proto je objednejte hned:

| Role v REDIMu | K čemu |
|---|---|
| `CSIN\vcs_github_copilot` | GitHub Copilot (plán Business nebo Enterprise) |
| `CSIN\GHB_DEV_SPOCK_WRITE` | Repozitář SPOCKu `https://github.com/csas-dev/spock-pilot` |
| `CSIN\CAAUTH_USR` | SSH certifikát pro připojení k repozitáři |

**Otázka:** Čeká vás bootcamp za týden. Kdy objednáte role?
- [x] Dnes, schválení může trvat dny
- [ ] Den předem, schválení je automatické
- [ ] Až na bootcampu, kde s tím pomohou

**Proč:** Bez schválených rolí nenaklonujete SPOCK ani nespustíte Copilota.

#### Nejdřív oficiální onboarding GitHubu

Oficiální postup ČS je na Wiki České spořitelny, stránka **GitHub – Onboarding uživatele**. Na jejím konci máte aktivní firemní GitHub účet, autorizovanou organizaci, SSH certifikát, přístup k repozitářům a zapnutý Copilot Enterprise. Soukromý GitHub účet nestačí.

**Víc do hloubky:** Copilot musí ve firemní konfiguraci povolit **agent mode** (asistent smí pracovat se soubory) a **vlastní agenty** (asistenti, které si SPOCK přináší) a v nabídce modelů musí být **Claude Sonnet 5**. Nastavovat to nemusíte, jen to uveďte v žádosti.

**Otázka:** Můžete pro SPOCK použít svůj soukromý GitHub účet?
- [ ] Ano, když na něm máte vlastní licenci Copilota
- [x] Ne, potřebujete firemní účet

**Proč:** Přístupy a licence se přidělují firemnímu účtu ČS.

#### Kdo vám pomůže

| S čím | Na koho se obrátit |
|---|---|
| Přístup k pilotu, materiály a data | SPOCK core tým: Veronika Bedáňová (vbedanova@csas.cz), Ines Bamburać-Alibašić (ibamburac-alibasic@csas.cz) |
| Repozitář a prostředí SPOCKu | Ilya Shramov |
| SPOCK | CoE Product Management a CoE Product Design |
| Onboarding Tutorial | Tomáš Havlíček, Guild Master Product Management |
| Instalace a běžné technické potíže | Nejdřív support engineer ve vašem týmu, pak IT podpora ČS |

**Otázka:** Nejde vám otevřít repozitář `csas-dev/spock-pilot`, i když máte role schválené. Komu napíšete?
- [x] Ilyovi Shramovovi
- [ ] Tomáši Havlíčkovi
- [ ] Agentovi Workflow Support

**Proč:** Repozitář a prostředí SPOCKu má na starosti Ilya Shramov.

### Úkoly

- [ ] **Projděte onboarding GitHubu v ČS** (20 min, v prohlížeči)
  - *Proč:* Copilot i repozitář SPOCKu jsou navázané na firemní GitHub účet. Soukromý účet nestačí.
  1. Otevřete na Wiki ČS stránku *GitHub – Onboarding uživatele* a projděte ji. Je to oficiální postup pro účet, organizaci, SSH certifikát i Copilota.
  2. Přihlaste se na [github.com](https://github.com) účtem, který používáte pro práci v ČS (profil Spořitelny).
  3. Ověřte, že jste členem organizace ČS (profil → Organizations). Pokud ne, nebo účet nemáte, postupujte podle stránky z kroku 1.
  4. Zapište si své uživatelské jméno na GitHubu. Budete ho uvádět v žádostech.
- [ ] **Objednejte roli pro GitHub Copilot** (10 min, v REDIMu, schválení může trvat dny)
  - *Proč:* Agenti SPOCKu jsou Copilot agenti. Bez licence nic nespustíte.
  1. V REDIMu objednejte roli `CSIN\vcs_github_copilot`. Potřebujete plán Copilot Business nebo Enterprise.
  2. Do zdůvodnění napište: pilot SPOCK (discovery workflow), potřebujete **GitHub Copilot a Copilot Chat ve Visual Studio Code**, **agent mode, vlastní agenty (custom agents) a model Claude Sonnet 5**.
  3. Když je role schválená, na [github.com/settings/copilot](https://github.com/settings/copilot) uvidíte, že Copilot máte aktivní.
- [ ] **Objednejte přístup k repozitáři SPOCKu a SSH certifikátu** (10 min, v REDIMu, schválení může trvat dny)
  - *Proč:* SPOCK si do počítače naklonujete z repozitáře. Bez přístupu ho nestáhnete ani neaktualizujete.
  1. V REDIMu objednejte roli `CSIN\GHB_DEV_SPOCK_WRITE`. To je přístup k repozitáři `https://github.com/csas-dev/spock-pilot`.
  2. Objednejte také roli `CSIN\CAAUTH_USR`. Bez ní nenainstalujete SSH certifikát, kterým se k repozitáři připojíte.
  3. Až jsou role schválené, ověřte, že stránku repozitáře v prohlížeči otevřete. Když ne, napište Ilyovi Shramovovi.
  4. Testeři navíc požádají o přístup k repozitáři AI Lab se složkou `SPOCK | Workflow Documentation`.

### Pro zvídavé

- 📄 **`materialy/bootcamp/technical-setup-instructions.pdf`** v repozitáři tutoriálu: interní postup ČS i s odkazy na Wiki a Confluence

## 1.2 — Instalace nástrojů a SSH certifikát

### Karty (asi 5 min, jen na webu)

#### Co budete instalovat

Pro SPOCK potřebujete **VS Code** (program na práci se soubory), **Git** (stahuje a aktualizuje SPOCK), **Node.js 22** (spouští skripty SPOCKu) a v ČS navíc **caauth-cli** pro SSH certifikát. Jde o **Visual Studio Code**, ne o „Visual Studio“, to je jiný program.

**Otázka:** Proč potřebujete Node.js, když v něm nic nepíšete?
- [ ] Nepotřebujete ho, instaluje se jen pro vývojáře
- [x] Každý task SPOCKu spouští malý Node skript
- [ ] Kvůli Copilotovi, který na Node.js běží

**Proč:** Bez Node.js žádný task nefunguje: kontroly, zápisy ani podpisy.

#### Instalace z firemního katalogu

Na firemním počítači neinstalujete z internetu, ale z katalogu: **Solveo** na Windows, **Self Service+** na Macu. Některé aplikace se v katalogu ukážou až po schválení role v REDIMu. Po instalaci Node.js nebo Gitu **VS Code zavřete a znovu otevřete**, jinak nástroj nenajde.

**Otázka:** V Self Service+ nevidíte Node.js. Co to nejspíš znamená?
- [ ] Node.js na firemním Macu nainstalovat nejde
- [x] Chybí vám role v REDIMu
- [ ] Musíte si ho stáhnout z internetu sami

**Proč:** Na Macu se Node.js v katalogu objeví až po schválení této role.

#### Command Palette: příkazy bez hledání v menu

**Command Palette je ve VS Code vyhledávací řádek pro všechny příkazy.** Otevřete ji **Cmd+Shift+P** (Mac) nebo **Ctrl+Shift+P** (Windows). Napíšete část názvu, šipkami vyberete a potvrdíte Enter. Esc ji zavře. SPOCK ji používá na všechno: klonování, tasky i znovunačtení okna.

**Otázka:** Jak nejrychleji ve VS Code najdete příkaz, jehož umístění v menu neznáte?
- [ ] Projdu postupně všechna menu a podmenu
- [x] Napíšu část názvu do Command Palette

**Proč:** Command Palette najde jakýkoli příkaz podle názvu.

### Úkoly

- [ ] **Najděte firemní katalog softwaru** (5 min, z firemního katalogu)
  - *Proč:* Na firemním počítači se programy instalují z katalogu, ne z internetu. VS Code, Git, Node.js i caauth-cli najdete tam.
  1. **Windows:** otevřete v prohlížeči katalog **Solveo** (Instalovat software). Když se vám nezobrazí vaše zařízení, kontaktujte svého Delivery Managera.
  2. **Mac:** otevřete aplikaci **Self Service+** a v ní **Catalog**.
  3. Najděte v katalogu **Visual Studio Code**. Některé aplikace se ukážou až po schválení speciální role v REDIMu. Když aplikace chybí, najděte potřebnou roli na interní stránce Confluence k dané aplikaci.
- [ ] **Nainstalujte VS Code** (10 min, z firemního katalogu)
  - *Proč:* SPOCK běží uvnitř VS Code. Agenti, tasky i nastavení jsou soubory, které čte VS Code.
  1. Hledejte **Visual Studio Code**, ne „Visual Studio“ (jiný program).
  2. **Windows (Solveo):** Visual Studio Code → prostředí **Workstation** → **Moje zařízení** → vyberte svůj počítač → košík → objednat.
  3. **Mac (Self Service+):** Catalog → Visual Studio Code → nainstalovat.
  4. Ověření: VS Code se otevře a **Cmd+Shift+P** (Mac) nebo **Ctrl+Shift+P** (Windows) otevře Command Palette. Esc ji zavře.
  - *Ověření:* Co se stane, když ve VS Code stisknete Cmd+Shift+P nebo Ctrl+Shift+P?
    - [x] Nahoře se otevře řádek pro hledání příkazů
    - [ ] Dole se otevře terminál
    - [ ] Otevře se nastavení VS Code
  - *Nápověda:* Zkuste zkratku přímo ve VS Code. Hledáte Command Palette.
- [ ] **Nainstalujte Git** (10 min, z firemního katalogu)
  - *Proč:* Gitem SPOCK naklonujete a později jedním taskem aktualizujete. Bez Gitu kontrola nastavení ohlásí, že kopii nejde aktualizovat (`SETUP.md` §2 a §8).
  1. **Mac:** Git obvykle už máte. Když chybí, je v Self Service+.
  2. **Windows:** objednejte **Git** v Solveo (obsahuje i Git Bash).
  3. Ověření: restartujte VS Code a v terminálu napište `git --version`. Musí vypsat číslo verze.
  4. Doporučené: `git config --global user.name "Jméno Příjmení"` a `git config --global user.email "vas.email@…"` (firemní e-mail).
  - *Ověření:* Co vypíše `git --version` v terminálu VS Code?
    - [x] `git version` a číslo verze
    - [ ] `command not found`
    - [ ] Nic, příkaz jen skončí
  - *Nápověda:* Když Git chybí nebo terminál příkaz nezná, zavřete a znovu otevřete VS Code a zkuste to znovu.
- [ ] **Nainstalujte Node.js 22** (10 min, z firemního katalogu)
  - *Proč:* Každý task SPOCKu (kontroly, zápisy, podpisy) spouští Node skript. Bez Node žádný task nefunguje.
  1. Potřebujete **Node.js verze 22**.
  2. **Mac:** v REDIMu objednejte roli `APP_INSTALL_MACOS_NODEJS` (dlaždice Windows). Po schválení v Self Service+ klikněte u položky **Upload inventory to Yaml** na **Run**, počkejte na dokončení, pak vyhledejte **Node** a nainstalujte ho.
  3. **Windows:** objednejte Node.js v Solveo (položka katalogu je odkázaná v *Technical setup instructions*, část 7).
  4. Ověření: ve VS Code otevřete Terminal → New Terminal a napište `node -v`. Musí vypsat `v22.…` (nebo `v20.…`).
  - *Ověření:* Čím začíná číslo, které vypíše `node --version`?
    - [x] `v22`
    - [ ] `v18`
    - [ ] `v16`
  - *Nápověda:* SPOCK potřebuje Node.js 22. Jinou verzi přeinstalujte z firemního katalogu.
- [ ] **Nainstalujte caauth-cli a ověřte SSH certifikát** (20 min, až po schválení role `CSIN\CAAUTH_USR`)
  - *Proč:* K repozitáři SPOCKu se v ČS připojujete přes SSH certifikát. Bez něj SPOCK nenaklonujete.
  1. **Mac:** nainstalujte **caauth-cli** ze Self Service+.
  2. **Windows:** vyhledejte na počítači **PowerShell** a pokračujte podle oficiálního onboardingu GitHubu na Wiki ČS.
  3. Projděte autorizaci v caauth-cli a v jeho nabídce zvolte **Desktop Management → Test Certificate**.
  4. Když SSH hlásí chybu **225** nebo **255**, postupujte podle diagnostiky (řádek „SSH hlásí chybu 225 nebo 255“).

### Pro zvídavé (anglicky)

- 📄 **`SETUP.md`** §1 ve vaší kopii SPOCKu
- 📄 **`materialy/bootcamp/technical-setup-instructions.pdf`**, části 1, 2 a 7

## 1.3 — GitHub Copilot ve VS Code

### Karty (asi 5 min, jen na webu)

#### Copilot, agenti a model

Copilot a Copilot Chat se do VS Code přidávají jako rozšíření a přihlašují se **firemním GitHub účtem**. Agenti SPOCKu se vybírají ve **výběru agenta** v okně chatu. **Model se volí ručně před první zprávou: Claude Sonnet 5**, effort High, kontext 1M. Agenti nevidí, jaký model běží, takže to za vás nikdo nezkontroluje.

**Otázka:** Kdo pohlídá, že pracujete se správným modelem?
- [ ] Agent Product Manager, při startu běhu
- [x] Vy, model volíte ručně
- [ ] Kontrola nastavení při každé zprávě

**Proč:** Agenti model nevidí. Zvolit ho musíte sami.

#### AI kredity

Copilot čerpá **AI kredity**. Stav vidíte vpravo dole ve VS Code u ikony Copilota vedle zvonku s upozorněními. Když kredity dojdou uprostřed fáze, agent se zastaví.

**Otázka:** Agent se uprostřed práce zastavil bez vysvětlení. Co zkontrolujete jako první?
- [x] AI kredity u ikony Copilota vpravo dole
- [ ] Verzi Gitu a Node.js v terminálu
- [ ] Soubor surface ve složce `.github`

**Proč:** Došlé kredity jsou častá příčina, proč agent přestane odpovídat.

### Úkoly

- [ ] **Nainstalujte a přihlaste Copilota** (15 min, ve VS Code)
  - *Proč:* Bez přihlášeného Copilota se okno chatu neotevře a agenti SPOCKu nejsou k dispozici.
  1. Extensions (ikona čtverečků vlevo) → nainstalujte **GitHub Copilot** a **GitHub Copilot Chat**, pokud chybí.
  2. **Sign in with GitHub** → přihlaste se **účtem ČS**. Bez výzvy: ikona účtu vlevo dole (Accounts).
  3. Ověření: otevřete chat (View → Chat), napište „ahoj“ a dostanete odpověď. Hlášení o chybějící licenci znamená, že role `CSIN\vcs_github_copilot` ještě není schválená (lekce 1.1).
- [ ] **Ověřte agent mode a výběr modelu** (5 min, ve VS Code)
  - *Proč:* SPOCK potřebuje agenty a konkrétní model. Když chybí, zjistíte to teď a ne uprostřed běhu.
  1. V okně chatu najděte výběr režimu nebo agenta a ověřte, že nabízí **Agent**.
  2. Ve výběru modelu najděte **Claude Sonnet 5**. Pokud tam není, firemní nastavení Copilota ho nepovoluje. Napište to IT nebo týmu CoE Product Management spolu se screenshotem výběru.
  3. Vpravo dole ve VS Code klikněte na ikonu Copilota vedle zvonku a ověřte, že máte dost AI kreditů.

### Pro zvídavé (anglicky)

- 📄 **`SETUP.md`** §1, §3 a §5 ve vaší kopii SPOCKu
- 📄 **`materialy/bootcamp/working-with-vs-code-and-github-copilot.pdf`**

## 1.4 — SPOCK ve vašem počítači

### Karty (asi 5 min, jen na webu)

#### Naklonovat, ne stáhnout

SPOCK si do počítače **naklonujete** z repozitáře `csas-dev/spock-pilot` přes SSH certifikát. Klon se později aktualizuje jedním taskem, stažený ZIP by se musel stahovat znovu. Ve VS Code otevírejte **složku, která přímo obsahuje `.github` a `.vscode`**, a autorům složky důvěřujte, jinak se tasky nespustí.

**Otázka:** V seznamu tasků nevidíte nic, co začíná `SPOCK:`. Proč?
- [ ] SPOCK je rozbitý a je potřeba ho naklonovat znovu
- [x] Máte otevřenou jinou složku
- [ ] Chybí vám kredity

**Proč:** Tasky se načtou jen ze správně otevřené složky v důvěryhodném režimu.

#### Soubor surface a kontrola nastavení

Soubor `.github/surface` říká SPOCKu, v jakém nástroji pracujete. Musí v něm být **`copilot`**. Pak spustíte **`SPOCK: check my setup`**: ověří Node, Git, vaši kopii, agenty i model najednou.

**Otázka:** V souboru surface je `unset`. Co uděláte?
- [x] Přepíšu ho na `copilot`
- [ ] Nechám ho být, SPOCK si nástroj při prvním běhu zjistí sám

**Proč:** S `unset` SPOCK žádný běh nezaloží.

#### Šest agentů a nic navíc

Ve výběru agenta musí být **přesně šest agentů SPOCKu**. Vedle nich uvidíte vestavěné režimy **Agent, Ask, Plan** a firemního agenta **CSAS Copilot Ecosystem Architect**. Ty k SPOCKu nepatří a pro SPOCK je nevybírejte.

**Otázka:** Ve výběru vidíte jen pět agentů SPOCKu. Co uděláte?
- [ ] Pokračuji, pět agentů na první fáze stačí a šestý se doinstaluje
- [x] Zastavím se a pošlu screenshot týmu

**Proč:** Jiná sada agentů znamená jinou konfiguraci a výsledky by neplatily.

### Úkoly

- [ ] **Naklonujte SPOCK a otevřete ho** (15 min, ve VS Code)
  - *Proč:* Jen ze správně otevřené složky najde VS Code agenty, tasky a nastavení SPOCKu.
  1. Nejjednodušší: v Copilot Chatu napište „Přidej a naklonuj https://github.com/csas-dev/spock-pilot“ a postupujte podle něj.
  2. Ručně: Command Palette → **Git: Clone** → vložte `git@github.com:csas-dev/spock-pilot.git` → přihlaste se účtem ČS, když se VS Code zeptá.
  3. Uložte kopii na svůj disk, ne do sdílené složky. Pak zvolte **Open** a autorům důvěřujte.
  4. Ověření: v Exploreru vlevo vidíte přímo složky `.github` a `.vscode`.
  - *Ověření:* Které dvě složky vidíte v Exploreru vlevo hned nahoře?
    - [x] `.github` a `.vscode`
    - [ ] `src` a `dist`
    - [ ] `spock-pilot` a v ní teprve další složky
  - *Nápověda:* Když vidíte jen složku `spock-pilot`, máte otevřenou složku o úroveň výš. Otevřete přímo tu, která obsahuje `.github` a `.vscode`.
- [ ] **Ověřte soubor surface** (5 min, ve VS Code)
  - *Proč:* Soubor `surface` říká SPOCKu, v jakém nástroji pracujete. Dokud v něm není `copilot`, SPOCK běh nezaloží.
  1. V Exploreru vlevo otevřete `.github/surface`.
  2. Když v něm je `unset`, přepište ho na `copilot` a uložte (Cmd+S nebo Ctrl+S). Task `SPOCK: check my setup` s volbou GitHub Copilot ho zapíše také.
  3. Ověření: soubor obsahuje jen slovo `copilot`.
  - *Ověření:* Co je v souboru `.github/surface`, když je nastavený správně?
    - [x] `copilot`
    - [ ] `unset`
    - [ ] `vscode`
- [ ] **Spusťte SPOCK: check my setup** (15 min, ve VS Code)
  - *Proč:* Kontrola ověří Node, Git, vaši kopii, agenty a model najednou. Dokud SPOCK neví, v jakém nástroji pracujete, nezaloží žádný běh (`SETUP.md` §4).
  1. Command Palette → `run task` → **Tasks: Run Task** → `check my setup` → **SPOCK: check my setup**.
  2. Na otázku, jaký nástroj používáte, vyberte **GitHub Copilot**.
  3. Dole v panelu Terminal opravte vše, co je *missing*, a task spouštějte znovu, dokud poslední řádek nehlásí, že je vše na místě.
  4. Žádný task `SPOCK:` v seznamu? Máte otevřenou jinou složku nebo jste autorům nedůvěřovali. Vraťte se k předchozímu úkolu.
  - *Ověření:* Na co se task zeptá v políčku nahoře?
    - [x] Jaký nástroj používáte
    - [ ] Jak se jmenujete a jakou máte roli
    - [ ] Jak se má jmenovat běh
  - *Nápověda:* Task otevře jedno políčko. Spusťte ho a podívejte se.
- [ ] **Zkontrolujte šest agentů** (5 min, ve VS Code)
  - *Proč:* Agent navíc nebo chybějící agent znamená jinou konfiguraci, než SPOCK předpokládá, a výsledky by neplatily (`TESTER-GUIDE.md` §2.2).
  1. Otevřete výběr agenta v Copilot Chatu.
  2. Musí tam být přesně těchto šest agentů SPOCKu: **Business Analyst, Competitive Analysis, Methodology Coach, Opportunity Designer, Product Manager, Workflow Support**. Vedle nich uvidíte i vestavěné režimy **Agent, Ask, Plan** a firemního agenta **CSAS Copilot Ecosystem Architect**. Ty k SPOCKu nepatří a pro práci se SPOCKem je nevybírejte.
  3. Když nějaký chybí nebo přebývá, zastavte se a pošlete týmu CoE Product Management screenshot výběru se jmény agentů.
  - *Ověření:* Kolik agentů SPOCKu vidíte ve výběru agenta?
    - [x] Šest
    - [ ] Pět
    - [ ] Sedm nebo víc
  - *Nápověda:* Jiný počet než šest je nález. Zastavte se a pošlete screenshot týmu CoE Product Management.
- [ ] **Nastavte model a zkontrolujte náhled dokumentů** (5 min, ve VS Code)
  - *Proč:* Agenti nevidí, jaký model běží. A jedno rozšíření umí zkazit náhled dokumentů SPOCKu.
  1. Ve výběru modelu v chatu zvolte **Claude Sonnet 5**, effort **High** a kontext **1M** (`SETUP.md` §6).
  2. Otevřete libovolný dokument ukázkového běhu (např. `fixtures/2026-09-savings-goals/1-brief/initiative-brief.md`) a dejte náhled (Cmd+Shift+V nebo Ctrl+Shift+V).
  3. Když dokument začíná tabulkou `[object Object]`, vypněte rozšíření `bierner.markdown-yaml-preamble` (`TESTER-GUIDE.md` §2.5).

### Pro zvídavé (anglicky)

- 📄 **`README.md`** v kořeni SPOCKu a **`SETUP.md`**, kroky 2–6

## 1.5 — První kroky ve SPOCKu

### Karty (asi 5 min, jen na webu)

#### Běh je složka

Každý běh je složka ve vaší kopii SPOCKu. Uvnitř jsou fáze `1-brief` až `7-initiative`, `records/` (strojové záznamy pro kontroly), `RUN-STATE.md` (stav a podpisy) a `README.md`, titulní stránka, která říká, kde běh stojí.

**Otázka:** Kde zjistíte, kdo schválil brief?
- [ ] V chatu s agentem, který brief psal
- [x] V `RUN-STATE.md` běhu
- [ ] Nikde, nezapisuje se to

**Proč:** Každý podpis je v záznamu běhu. Chat se nikam neukládá.

#### Každý dokument má dva soubory

Artefakt jsou **dva soubory**: dokument pro čtenáře a záznam pro kontroly. Tabulka v hlavičce dokumentu je záměrná. Když se v náhledu ukáže jako `[object Object]`, vypněte rozšíření `bierner.markdown-yaml-preamble`.

**Otázka:** Dokument začíná nesrozumitelnou tabulkou `[object Object]`. Je rozbitý?
- [ ] Ano, soubor je poškozený a je potřeba ho vytvořit znovu
- [x] Ne, stačí vypnout jedno rozšíření

**Proč:** Soubor je v pořádku, jen ho jedno rozšíření špatně zobrazuje.

#### Průvodce i ve VS Code

Spocka, průvodce z tohoto webu, máte i jako agenta **Spock průvodce** v GitHub Copilotu. Naklonujte si repozitář tutoriálu a otevřete ho ve VS Code v **samostatném okně**. Průvodce odpovídá z lekcí, vede vás úkoly a kvízem a se souhlasem zaškrtává pokrok.

**Otázka:** Otevřete tutoriál i SPOCK v jednom okně a ve výběru vidíte sedm agentů. Co uděláte?
- [ ] Nahlásím nález, agentů má být šest
- [x] Otevřu tutoriál v samostatném okně
- [ ] Smažu soubor Spock průvodce z repozitáře

**Proč:** Ve SPOCKu má být ve výběru přesně šest agentů. Spock průvodce k SPOCKu nepatří, jen se načetl z otevřeného tutoriálu.

### Úkoly

- [ ] **Najděte v `TASKS.md` tři tasky, které otevírají políčka** (15 min, ve VS Code)
  - *Proč:* Podle toho, jestli task otevírá políčka, poznáte, kdo ho smí spustit. Tasky s políčky jsou vaše, tasky bez políček smí spustit i agent.
  1. Otevřete `specifications/onboarding/TASKS.md`.
  2. Vypište si tři tasky s řádkem „Opens N boxes“ a tři s „Opens no box“.
  3. U každého jednou větou: proč ho asi spouští člověk, nebo proč ho smí spustit agent?
  - *Ověření:* Kolik políček podle `TASKS.md` otevírá `SPOCK: start a run`?
    - [x] Tři
    - [ ] Jedno
    - [ ] Žádné
  - *Nápověda:* V `specifications/onboarding/TASKS.md` najděte nadpis tasku a řádek „Opens … boxes“.
- [ ] **Založte si deník** (5 min, mimo VS Code)
  - *Proč:* Do deníku si zapisujete, co agent udělal jinak, než jste čekali. Z těchhle zápisků vzniká zpětná vazba pro tým CoE Product Management (úroveň 4).
  1. Vytvořte si soubor `denik.md` **mimo** složku SPOCKu.
  2. První zápis: datum, verze SPOCKu (nahoře v `SETUP.md`, např. 1.16.1), model, který jste zvolili, a výsledek `check my setup`.
- [ ] **Projděte ukázkový běh** (60 min, ve VS Code)
  - *Proč:* Uvidíte, jak vypadá správný výstup každé fáze, a na vlastním běhu pak poznáte odchylku.
  1. Pusťte si {{video:krok-za-krokem}}. Uvidíte stejný běh fázi po fázi dřív, než ho otevřete. Komentář je anglicky, titulky česky.
  2. Otevřete `fixtures/2026-09-spending-insights/README.md`. Tento běh je česky a je hotový. Kdo radši čte anglicky, může použít `fixtures/2026-01-mortgage-onboarding/`.
  3. Otevírejte postupně dokumenty ve složkách `1-brief` až `7-initiative`. Ve `1-brief` najdete i `initiative-screen.md` (regulatorní screening, A1b). Vznikl podle starších pravidel: od 1. září 2026 fáze 1 screening nedělá a regulace se posuzuje až u konkrétních řešení ve fázi 4 (`STAGE-1-SPEC.md`). Ve svém běhu ho neuvidíte.
  4. U každé fáze si zapište jednou větou, co z ní vzešlo.
  - *Ověření:* Co říká `README.md` běhu `2026-09-spending-insights` o jeho stavu?
    - [x] `complete`, přijaté fáze 7/7
    - [ ] `running`, přijaté fáze 5/7
    - [ ] `stale`, přijaté fáze 3/7
  - *Nápověda:* Stav je hned pod nadpisem v `fixtures/2026-09-spending-insights/README.md`.
- [ ] **Dohledejte jedno tvrzení zpět ke zdroji** (30 min, ve VS Code)
  - *Proč:* Dohledatelnost je hlavní slib SPOCKu. PM jím obhájí rozhodnutí, PD uvidí, na jakém výzkumu řešení stojí, a SWE, odkud se vzal požadavek.
  1. V `7-initiative/initiative.md` vyberte jedno kritérium úspěchu nebo jeden požadavek.
  2. Najděte ho v PRD (`6-prd/`), pak v rozpracovaném MVP (`5-mvp/`), ve vybraném řešení (soubor `…selected-solution.md` ve `4-solutions/`) a v příležitostech (`2-problems/`).
  3. Skončete u materiálu v `2-problems/1-problem-material.md`.
  4. Pozor: starší ukázkové běhy mají ve fázi 4 i soubory, které nové běhy nevytvářejí (např. `solution-scores`). Skóre řešení bylo zrušeno.
  - *Ověření:* Kolik řešení je v sadě `4-solutions/1-solution-set.md` ukázkového běhu?
    - [x] Pět (I1 až I5)
    - [ ] Tři
    - [ ] Deset
  - *Nápověda:* Spočítejte nadpisy začínající `I1`, `I2`… v `4-solutions/1-solution-set.md`.
- [ ] **Najděte v běhu podpisy** (10 min, ve VS Code)
  - *Proč:* Každé rozhodnutí má jméno a roli. Právě to vám dá jistotu, že výstup nikdo „nepodepsal za vás“.
  1. Otevřete `RUN-STATE.md` ukázkového běhu.
  2. Najděte, kdo a kdy podepsal G1 a G7.
  - *Ověření:* Jaké datum má podpis G1 v `RUN-STATE.md` ukázkového běhu?
    - [x] 28. 8. 2026
    - [ ] 1. 9. 2026
    - [ ] 15. 9. 2026
  - *Nápověda:* Hledejte `G1` a řádek `decided_at` v `RUN-STATE.md`.
- [ ] **Zeptejte se Methodology Coache** (10 min, ve VS Code)
  - *Proč:* Coach odpovídá jen z psaného kánonu metody, ne z paměti, a má říct, odkud odpověď bere.
  1. Nový chat → agent **Methodology Coach**.
  2. Zeptejte se: „Proč fáze 3 nemá rozhodnutí člověka?“
  3. Zkontrolujte, jestli odpověď odkazuje na konkrétní dokument.
  - *Co jste viděli:* Odkázal Coach v odpovědi na konkrétní dokument nebo oddíl?
    - [x] Ano, jmenoval, odkud odpověď bere
    - [ ] Ne, odpověděl obecně bez zdroje

### Pro zvídavé (anglicky, ve vaší kopii SPOCKu)

- 📄 **`BUSINESS-LOGIC-OVERVIEW.md`** §5 (artefakty a záznamy)
- 📄 **`fixtures/README.md`**: ukázkové běhy jsou vymyšlené a slouží jako příklad, ne jako důkaz

## Kvíz

Kvíz losuje 5 otázek z této zásoby. Pořadí otázek i možností se při každém spuštění zamíchá.

**1. Copilot Chat ve VS Code funguje, ale ve výběru agentů nevidíte žádného agenta SPOCKu. Co je nejpravděpodobnější příčina?**

   a) Chybí licence Copilota pro agent mode
   b) Ve VS Code je otevřená jiná složka
   c) Agenti se objeví až po prvním běhu

<details><summary>Odpověď</summary>

b) Agenti se načítají z otevřené složky SPOCKu. Otevřete složku, která přímo obsahuje `.github` a `.vscode`, a důvěřujte autorům.

</details>

**2. `SPOCK: check my setup` hlásí „Node.js: missing: Node.js 18 is installed“. Co uděláte?**

   a) Nic, Node.js nainstalovaný je a verze nerozhoduje
   b) Nainstaluji Node.js 22 a restartuji VS Code
   c) Napíšu agentovi, ať Node.js aktualizuje

<details><summary>Odpověď</summary>

b) SPOCK potřebuje Node.js 22. Po instalaci je nutné VS Code restartovat, jinak novou verzi nenajde.

</details>

**3. Kolega instaluje SPOCK a v nabídce vidí „Visual Studio 2022“. Je to správný program?**

   a) Ano, je to totéž
   b) Ne, potřebuje Visual Studio Code
   c) Ano, pokud má Copilot

<details><summary>Odpověď</summary>

b) Visual Studio a Visual Studio Code jsou dva různé programy. SPOCK běží ve VS Code.

</details>

**4. Repozitář SPOCKu jste si stáhli jako ZIP a rozbalili. Co bude problém?**

   a) Nic, funguje to stejně
   b) Kopie se nebude dát aktualizovat taskem
   c) ZIP nejde otevřít ve VS Code

<details><summary>Odpověď</summary>

b) Klon přes SSH certifikát se aktualizuje jedním taskem. Stažený ZIP byste musel(a) stahovat znovu.

</details>

**5. V REDIMu máte schválenou roli pro Copilota, ale klonování SPOCKu hlásí chybu přístupu. Co nejspíš chybí?**

   a) Licence Copilota Enterprise
   b) Role k repozitáři nebo SSH certifikát
   c) Node.js 22 z firemního katalogu

<details><summary>Odpověď</summary>

b) K repozitáři potřebujete přístupovou roli a SSH certifikát. Licence Copilota na klonování nestačí.

</details>

**6. Ve výběru modelů vidíte jiný model než Claude Sonnet 5 a agenti fungují. Co uděláte?**

   a) Nechám to, agenti si model hlídají sami
   b) Přepnu na Claude Sonnet 5 ručně
   c) Napíšu Workflow Supportu, ať model přepne

<details><summary>Odpověď</summary>

b) Model volíte ručně před první zprávou. Agenti nevědí, na jakém modelu běží.

</details>

**7. Ve výběru agentů vidíte kromě šesti agentů SPOCKu i „CSAS Copilot Ecosystem Architect“. Co to znamená?**

   a) Instalace je vadná a je potřeba ji zopakovat
   b) Nic, je to firemní agent mimo SPOCK
   c) Je to sedmý agent SPOCKu

<details><summary>Odpověď</summary>

b) Vedle agentů SPOCKu uvidíte vestavěné režimy a firemního agenta. K SPOCKu nepatří.

</details>

**8. V ukázkovém běhu hledáte, kdo a kdy schválil iniciativu. Kam se podíváte?**

   a) Do chatu, kde se schvalovalo
   b) Do `RUN-STATE.md` běhu
   c) Do `README.md` v kořeni SPOCKu

<details><summary>Odpověď</summary>

b) Podpisy se jménem, rolí a datem jsou v záznamu běhu `RUN-STATE.md`.

</details>
