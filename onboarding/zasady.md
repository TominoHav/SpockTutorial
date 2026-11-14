# Zásady

## Jak SPOCK přemýšlí

- **Člověk rozhoduje svým jménem a rolí.** Žádný agent nezapisuje lidské rozhodnutí.
- **Producent nehodnotí sám sebe.** Kontrolu spouští někdo jiný než ten, kdo dokument napsal.
- **Co nikdo nedodal, je unknown s důvodem.** Pravděpodobné pole, které nikdo neuvedl, je přesně chyba, které má SPOCK bránit.
- **Pořadí fází je smysl.** Každá fáze čte jen to, co vzniklo před ní. Proto se dá rozhodnutí za dva roky dohledat.
- **Nic se nemaže.** Vrácení, výjimka i oprava zůstávají v záznamu i s důvodem.
- **Dokument, který vypadá dobře, sám nic nedokazuje.** Rozhoduje chování a výstup kontroly.

## Čtyři zásady z bootcampu

- **SPOCKem strukturujte práci.**
- **Důkazy používejte ke zpochybnění výstupu.**
- **Rozhodnutí dělá trio.**
- **Repozitář uchovává zdůvodnění.** Je to sdílená paměť discovery.

## Časté chyby uživatelů

- **Věří větě agenta.** „Kontrola prošla“ v chatu nic neznamená, pravdu ukazuje výstup tasku.
- **Přikládá soubory do chatu.** Materiál patří do `supplied/`. Přiložit se smí jen brief ve fázi 1.
- **Nechá agenta spustit task s políčky.** Podpis musí dát člověk.
- **Zapne „Allow All“.** Pak neuvidíte, co agent otevírá a spouští.
- **Píše outcome jako řešení.** „Postavit kalkulačku“ není outcome.
- **Vybírá řešení bez SWE.** SPOCK technickou složitost nehodnotí.
- **Dává do fáze 2 materiál, který SPOCK nepřečte.** Miro, obrázky, sken PDF nebo grafy z Tableau.
- **Vkládá data, která tam nepatří.** Jen C1, anonymizovaná nebo syntetická. Nikdy C2 a vyšší. Nikdy klientská data, osobní údaje ani hesla.
- **Používá SPOCK jako stroj na odpovědi.** SPOCK je workflow, kterým trio dělá discovery, ne chat, který řekne výsledek.
- **Dává obecnou zpětnou vazbu.** „Vylepši to“ nefunguje. Řekněte konkrétně, co změnit a proč.
- **Přidá materiál po schválení fáze 2.** Nejdřív musí fázi vrátit.
- **Má dva nedokončené běhy najednou.** Tasky pak odmítnou pracovat.
- **Posílá screenshot místo exportu chatu.** Screenshot ukáže jen část, export celou konverzaci.
- **Upravuje soubory pod `.github/`.** Mění tím chování všech agentů.
- **Zapíše `pass` bez jistoty.** `unclear` je platný a užitečnější výsledek.
