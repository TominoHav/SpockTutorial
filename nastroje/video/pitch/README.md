# Pitch video onboardingu do SPOCKu

Asi 80 s: anglický komentář hlasem Piper `en-us-ryan`, české titulky v obraze, snímky skutečné aplikace.
Dvě verze se stejnými snímky:
- `scenar-vedeni.json`: pro Head of Product a Head of Design (proč to zavést, co je hotové, další krok: pilot), asi 90 s.
- `scenar-uzivatele.json`: pro 1 500 lidí, kteří budou SPOCK používat (co je čeká a proč začít), asi 75 s.

```bash
python3 web/build.py
node nastroje/video/pitch/snimky.js
python3 nastroje/video/pitch/render.py <cesta k en-us-ryan-high.onnx> vedeni
python3 nastroje/video/pitch/render.py <cesta k en-us-ryan-high.onnx> uzivatele
```

Výstup: `web/dist/pitch/spock-onboarding-pitch-vedeni.mp4` a `-uzivatele.mp4` a náhled `-poster.jpg` (nejsou v gitu).
Po úpravě jen vzhledu (`pitch.html`) stačí `node nastroje/video/pitch/zaznam.js vedeni` (nebo `uzivatele`), komentář se znovu nenamlouvá.
