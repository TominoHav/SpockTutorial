# Když agent dělá něco špatně: žebříček diagnostiky

Postupujte shora dolů.

| # | Otázka | Kde se podívat | Oprava |
|---|---|---|---|
| 1 | Měl agent správné vstupy? | RUN-STATE.md, složky read/ a supplied/ běhu | Doplnit materiál nebo splnit předpoklad fáze. |
| 2 | Načetl agent skill a know-how? | RUN-STATE.md (které know-how a verze), záznam hlídače v .github/.guard/ | Nový chat, oprava odkazu ve wrapperu nebo v skills.yaml. |
| 3 | Říká instrukce opravdu to, co chcete? | SKILL.md a know-how | Přesnější věta a důvod. |
| 4 | Neodporuje instrukci příklad? | Příklady pod pravidly v know-how | Opravit příklad. Má přednost před pravidlem. |
| 5 | Neodporují si dvě místa? | grep -rn přes skilly, know-how a instrukce; rule-echoes.yaml | Jedna pravda na jednom místě. |
| 6 | Měl agent nástroj, který potřeboval, a nic navíc? | tools: ve wrapperu, agents.yaml, settings.json | Upravit práva. |
| 7 | Zachytila to kontrola? | check.mjs --gates, task explain what the gate failed | Nová kontrola s negativním případem. |
| 8 | Děje se to opakovaně, i když je instrukce jasná? | Záznam hlídače | Nové pravidlo hlídače (hook). |
