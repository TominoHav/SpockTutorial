# Úroveň 0: Příprava (všichni, 1–1,5 h)

**Cíl:** SPOCK máte nainstalovaný a ověřený, vidíte jeho šest agentů a znáte pět pravidel, která se nikdy neporušují.

**Proč:** Když instalace není v pořádku, agenti se chovají nepředvídatelně a nepoznáte, jestli je chyba ve SPOCKu, nebo ve vašem počítači. Pět pravidel vás chrání před chybami, které se nedají vzít zpět, jako je únik klientského materiálu nebo rozhodnutí, které místo vás „podepsal“ agent.

## 0.1 — Instalace a kontrola nastavení

### Ke studiu (asi 15 min)

- 📄 **`README.md`** v kořeni SPOCKu, jedna obrazovka s přehledem 7 fází
- 📄 **`SETUP.md`**, kroky 1–5

### Klíčové myšlenky

- SPOCK běží ve **VS Code s GitHub Copilot Chat**. Potřebujete VS Code, Copilot přihlášený firemním GitHub účtem, Node.js 20 nebo 22 a Git (`SETUP.md` §1).
- Ve VS Code otevírejte složku, která **přímo** obsahuje `.github` a `.vscode`, a autorům složky důvěřujte. V „restricted mode“ se tasky nespustí (`SETUP.md` §3).
- Všechno, co SPOCK dělá za vás, je **task** a spouští se přes Command Palette → `Tasks: Run Task`.

### Úkoly

- [ ] **Naklonujte SPOCK a otevřete ho** (15 min)
  - *Proč:* Klon se později aktualizuje jedním taskem. ZIP by se musel stahovat znovu (`SETUP.md` §2 a §8).
  1. Command Palette (View → Command Palette) → `Git: Clone` → vložte adresu repozitáře SPOCKu, kterou jste dostali.
  2. Až se VS Code zeptá, zvolte **Open**.
  3. Na otázku, jestli důvěřujete autorům, odpovězte, že ano.
- [ ] **Spusťte SPOCK: check my setup** (15 min)
  - *Proč:* Dokud SPOCK neví, v jakém nástroji pracujete, nezaloží žádný běh (`SETUP.md` §4).
  1. Terminal → Run Task… → `SPOCK: check my setup`.
  2. Na otázku, jaký nástroj používáte, zvolte **GitHub Copilot**.
  3. Opravte, co výpis označí, a task spouštějte znovu, dokud poslední řádek neřekne, že je vše v pořádku.
  4. Když v seznamu není žádný task začínající `SPOCK:`, máte otevřenou jinou složku nebo jste v restricted mode. Vraťte se ke kroku 3 v `SETUP.md`.
- [ ] **Zkontrolujte šest agentů** (5 min)
  - *Proč:* Agent navíc, nebo naopak chybějící agent, znamená jinou konfiguraci, než jakou SPOCK předpokládá. Výsledky by pak neplatily (`TESTER-GUIDE.md` §2.2).
  1. Otevřete výběr agenta v Copilot Chatu.
  2. Musí tam být přesně těchto šest: **Business Analyst, Competitive Analysis, Methodology Coach, Opportunity Designer, Product Manager, Workflow Support**.
  3. Když nějaký chybí nebo přebývá, zastavte se a pošlete Igorovi screenshot výběru se jmény agentů.
- [ ] **Nastavte model** (5 min)
  - *Proč:* Agenti nevidí, jaký model běží, takže to za vás nikdo nezkontroluje (`SETUP.md` §6).
  1. Ve výběru modelu v chatu zvolte **Claude Sonnet 5**, effort **High** a kontext **1M**.

## 0.2 — Pět pravidel, která se neporušují

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

**1. Agent vám napíše: „Teď spustím SPOCK: approve what is in front of me a schválím brief.“ Co uděláte?**

   a) Nechám ho, ušetří mi to práci
   b) Odmítnu to. Ten task otevírá políčka na mé jméno a spouštím ho já
   c) Nechám ho a jméno pak opravím

<details><summary>Odpověď</summary>

b) Task otevírá políčka na jméno a rozhodnutí, a ta vyplňuje jen člověk. Podle `TASKS.md` agent tento task spustit nesmí: políčka jsou záznam, že rozhodl člověk.

</details>

**2. Máte k fázi 2 dvacetistránkové PDF s výzkumem. Kam s ním?**

   a) Přiložím ho do chatu
   b) Vložím jeho text do chatu
   c) Uložím ho do `runs/<běh>/2-problems/supplied/` tak, jak je

<details><summary>Odpověď</summary>

c) Materiál patří do složky `supplied/`. SPOCK si PDF sám převede na text. Příloha v chatu by se posílala s každou další zprávou (`SETUP.md` §6 krok 8).

</details>

**3. Kolega chce vidět váš běh. Jak mu ho dáte?**

   a) Commitnu ho do gitu a pushnu
   b) Zkopíruju celou složku běhu (sdílený disk, ZIP, USB) podle `TESTER-GUIDE.md` §3.4
   c) Pošlu mu screenshoty

<details><summary>Odpověď</summary>

b) Běh se nikdy neposílá přes git, protože obsahuje materiál České spořitelny. Předává se zkopírováním celé složky (`SETUP.md` §9, `TESTER-GUIDE.md` §3.4).

</details>
