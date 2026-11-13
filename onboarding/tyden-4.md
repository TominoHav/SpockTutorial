# Týden 4 (30. 11.–6. 12.): Měníte metodiku

**Cíl:** Sami provedete skutečnou změnu know-how nebo skillu, ověříte ji a necháte ji Igora zrevidovat.

**Proč:** Tohle bude od ledna vaše nejčastější práce. Předpoklad: celý git repozitář od Igora.

## Po 30. 11. — Ověřovací sada

### Ke studiu (asi 45 min)

- 📄 **ENGINEERING-HANDOVER.md §5.3–5.5, §8, §9** — SPOCK-engineering peak.zip

### Klíčové myšlenky

- check.test.mjs nikdy nepouštějte rourou (| less) ani souběžně s jiným příkazem.
- Výsledek čtěte odspodu: MISS, BROKEN TEST, BROKEN HARNESS.

### Příkazy

```bash
node .github/scripts/register.mjs --verify
node .github/scripts/repo-check.mjs
node .github/scripts/check.test.mjs > test-vystup.txt
node .github/scripts/eval.mjs
```

### Úkoly

- [ ] **Spusťte ověřovací sadu** (60 min)
  - *Proč:* Tohle spustíte po každé změně metodiky. Musíte rozumět výsledku.
  1. V plném repozitáři spusťte čtyři příkazy z rámečku.
  2. Výstup check.test.mjs čtěte odspodu.
  3. S Claudem si vysvětlete řádky MISS a BROKEN.

## Út 1. 12. — Postup změny know-how

### Ke studiu (asi 45 min)

- 📄 **KNOW-HOW-OWNERS.md §4** — oficiální postup změny
- 📄 **method-canon.md (verze 0.4)** — celý

### Klíčové myšlenky

- Začněte větou, ne souborem: co má agent dělat jinak a podle čeho to poznáte.
- Upravujte zdroj, nikdy generovaný soubor.
- Zvyšte Version:, nastavte Date: a doplňte řádek do bloku <!-- history -->.
- Příklad má přednost před pravidlem, takže upravte i příklad.
- Nejdřív know-how, pak checker. Opravený checker bez opraveného know-how nic neopraví.

### Příkazy

```bash
git checkout -b metodika/nazev-zmeny
node .github/scripts/know-how.mjs --write
```

### Úkoly

- [ ] **Přidejte příklad do Method Canonu** (60 min)
  - *Proč:* Vaše první změna metodiky podle oficiálního postupu.
  1. git checkout -b metodika/priklad-outcome
  2. Do method-canon.md §9 přidejte český příklad špatného outcome.
  3. Zvyšte Version: na 0.5, nastavte Date: a přidejte řádek do <!-- history -->.
  4. Spusťte know-how.mjs --write a ověřte kontrolu C41.
- [ ] **Commitněte změnu** (15 min)
  - *Proč:* Každá změna metodiky má v gitu autora a důvod.
  1. git diff a zkontrolujte změnu.
  2. git commit -am "Method canon 0.5: příklad outcome"

## St 2. 12. — Změna skillu a měření rozdílu

### Ke studiu (asi 30 min)

- 📺 [Why AI evals are the hottest new skill for product builders](https://www.youtube.com/watch?v=BsWxPI9UM4c) — úvod pro produktové lidi
- 📺 [LLM Evals: Common Mistakes](https://www.youtube.com/watch?v=GL0XhAj5LPE) — Hamel Husain · asi 26 min

### Klíčové myšlenky

- Eval je sada vstupů, u kterých předem víte, co musí agent udělat.
- Jedna zkouška nic nedokazuje. Vždy 2–3 běhy před změnou a po ní.

### Úkoly

- [ ] **Změňte otázku ve skillu** (20 min)
  - *Proč:* Nejčastější typ změny: jak se agent ptá.
  1. V brief-creation/SKILL.md změňte jednu otázku.
- [ ] **Změřte rozdíl** (90 min)
  - *Proč:* Jedna zkouška nic nedokazuje. Naučíte se porovnávat.
  1. Scénář 1 projděte 2× před změnou (git checkout main) a 2× po ní.
  2. Do tabulky zapište, co se zlepšilo a co zhoršilo.

## Čt 3. 12. — První skutečná změna

### Ke studiu (asi 15 min)

- 📄 **Claude jako sparing partner** — „Tady je můj návrh změny. Co jsem přehlédl a co může rozbít?"

### Klíčové myšlenky

- Návrh změny: problém, příčina, změna, dotčené soubory a jak poznáte, že funguje.

### Úkoly

- [ ] **Vyberte skutečný problém** (30 min)
  - *Proč:* Od ledna vám budou podněty posílat PM. Naučíte se z nich vybrat ten pravý.
  1. Projděte deník, výsledky testů a RELEASE-NOTES.md.
- [ ] **Napište návrh změny** (30 min)
  - *Proč:* Návrh vás donutí promyslet dopad dřív, než něco změníte.
  1. Problém, příčina, změna, dotčené soubory a jak poznáte, že funguje.
- [ ] **Proveďte změnu** (60 min)
  - *Proč:* Celý cyklus poprvé samostatně.
  1. Postup z úterý.
  2. Pošlete Igorovi diff nebo pull request.

## Pá 4. 12. — Revize s Igorem

### Klíčové myšlenky

- Zeptejte se: „Co bys udělal jinak a co jsem přehlédl?"

### Úkoly

- [ ] **Revize s Igorem** (45 min)
  - *Proč:* Kontrolní bod 4. 12.
  1. Projděte návrh i změnu.
  2. Zeptejte se: „Co bys udělal jinak a co jsem přehlédl?"
- [ ] **Zapište si pravidla** (15 min)
  - *Proč:* Igorovy připomínky jsou know-how, které nikde jinde není.
  1. Do deníku jako pravidla, která budete dodržovat.

## Kvíz

**1. Proč se musí při každé změně know-how zvýšit verze?**

   a) Kvůli hezčímu číslování
   b) Běh si ukládá verzi know-how, které četl. Bez nové verze nejde změnu rozlišit
   c) Git to vyžaduje

<details><summary>Odpověď</summary>

b) Běh si ukládá verzi know-how, které četl. Bez nové verze nejde změnu rozlišit — Díky verzi víte, který běh vznikl podle staré a který podle nové metodiky.

</details>

**2. Po změně skillu proběhl jeden test a dopadl dobře. Stačí to?**

   a) Ano
   b) Ne, model není deterministický. Potřebuji víc běhů před změnou a po ní
   c) Ano, pokud prošly kontroly

<details><summary>Odpověď</summary>

b) Ne, model není deterministický. Potřebuji víc běhů před změnou a po ní — Jedna zkouška může být náhoda. Porovnávejte víc běhů na stejných vstupech.

</details>

**3. Kontrola odmítá správný výstup. Co opravíte nejdřív?**

   a) Checker
   b) Know-how, které říká, co je správně, a teprve pak checker
   c) Wrapper agenta

<details><summary>Odpověď</summary>

b) Know-how, které říká, co je správně, a teprve pak checker — Agent píše podle know-how. Opravený checker bez opraveného know-how nic neopraví.

</details>
