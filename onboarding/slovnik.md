# Slovník

| Pojem | Význam | Oblast |
|---|---|---|
| **LLM** | Velký jazykový model. Dostane text a pokračuje v něm, mezi konverzacemi si nic nepamatuje. | základ |
| **Kontext** | Všechen text, který model právě vidí: instrukce, konverzace, přečtené soubory. | základ |
| **Instrukce (system prompt)** | Text, který model dostane před zprávou uživatele. Ve SPOCKu instrukce, wrapper a skill. | základ |
| **Nástroj (tool)** | Funkce, o jejíž spuštění model požádá a prostředí ji provede. | základ |
| **Agent** | Model, který ve smyčce přemýšlí, volá nástroje a čte výsledky, dokud není hotovo. | základ |
| **Workflow** | Předem dané pořadí kroků. SPOCK je workflow s agentem v každém kroku. | základ |
| **Halucinace** | Model s jistotou tvrdí něco nepravdivého. Proto se vše ověřuje kódem. | základ |
| **Prompt injection** | Pokyn pro AI ukrytý v materiálu, který agent čte. Obranou je agent bez přístupu ven. | základ |
| **Eval (evaluace)** | Sada vstupů s předem známým správným chováním. Spouští se před změnou a po ní. | základ |
| **Git, commit, větev, diff** | Verzování: uložená změna, paralelní linie práce a rozdíl mezi verzemi. | základ |
| **Pull request** | Návrh změny v gitu, který si před sloučením někdo zreviduje. | základ |
| **Run (běh)** | Jedna iniciativa procházející 7 fázemi ve vlastní složce runs/. | SPOCK |
| **Wrapper** | Soubor .agent.md, tenká identita agenta. | SPOCK |
| **Binding** | Vazba skillu na agenta v agents.yaml. | SPOCK |
| **Know-how** | Znalost, kterou skill čte a nikdy nepíše. Vlastní ji ČS. | SPOCK |
| **Q1–Q7** | Kvalitní brány. Kontroluje je kód. | SPOCK |
| **G1–G7** | Rozhodovací brány. Rozhoduje člověk svým jménem. | SPOCK |
| **Mechanical / judged** | Pravidlo rozhoduje kód / pravidlo musí posoudit člověk. | SPOCK |
| **Negativní případ (arm)** | Záměrné rozbití, které dokazuje, že kontrola umí selhat. | SPOCK |
| **Hook / step guard** | Skript, který VS Code spustí v určitém okamžiku tahu agenta a který může krok odmítnout. | SPOCK |
| **Karanténa** | Fáze 2: materiál zákazníka čte agent bez přístupu ven. | SPOCK |
| **Declared reduction** | Skill, kterému chybí know-how, to přizná a pokračuje v omezeném rozsahu. | SPOCK |
| **Free-roam** | Režim mimo workflow, bez bran. Spouští se prefixem free-roam:. | SPOCK |
| **Output / asset** | Výstup fáze pro člověka / trvalý podklad, ze kterého čtou další fáze. | SPOCK |
