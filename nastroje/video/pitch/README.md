# Pitch video onboardingu do SPOCKu

Asi 80 s: anglický komentář hlasem Piper `en-us-ryan`, české titulky v obraze, snímky skutečné aplikace.
Scénář (anglický komentář, české titulky, nadpisy scén) je v `scenar.json`.

```bash
python3 web/build.py
node nastroje/video/pitch/snimky.js
python3 nastroje/video/pitch/render.py <cesta k en-us-ryan-high.onnx>
```

Výstup: `web/dist/pitch/spock-onboarding-pitch.mp4` a náhled `-poster.jpg` (nejsou v gitu).
Po úpravě jen vzhledu (`pitch.html`) stačí `node nastroje/video/pitch/zaznam.js`, komentář se znovu nenamlouvá.
