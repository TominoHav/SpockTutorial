import json
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
os.chdir(HERE)
head = open('base-head.html', encoding='utf-8').read()
bot = ''
def rep(s,a,b,count=1):
    assert a in s, a[:60]; return s.replace(a,b,count)
head = rep(head,'<title>SPOCK Builder Onboarding</title>','<title>SPOCK User Onboarding</title>')
head = rep(head,"/* Layout: sticky top bar · home = hero + 6týdenní cesta + SPOCK v kostce · modul = rail týdnů | lekce po dnech (nauč se / udělej / ověř se).",
 "/* Layout: sticky top bar · home = hero + cesta po úrovních a rolích + SPOCK v kostce · modul = rail modulů | lekce (nauč se / co si odnést / udělej) a kvíz.")
head = rep(head,'<span>SPOCK Builder<small id="brand-sub">Onboarding do 17. 12. 2026</small></span>','<span>SPOCK User<small id="brand-sub">Onboarding pro PM · PD · SWE · GM</small></span>')
head = rep(head,'<button class="pill lang-btn" id="lang-btn" type="button" aria-label="Switch to English">EN</button>','')
head = rep(head,'Chceš poradit?','Potřebujete poradit?')
extra_css = """
/* uživatelský onboarding: role, tabulky v lekcích */
.roles{display:flex;flex-wrap:wrap;gap:6px}
.rolebtn{border:1px solid var(--line);background:var(--bg);color:var(--ink);border-radius:99px;padding:6px 12px;font-size:13px;font-weight:600;cursor:pointer}
.rolebtn:hover{border-color:var(--blue-2)}
.rolebtn.on{background:var(--blue);border-color:var(--blue);color:var(--on-blue)}
.journey.two{grid-template-columns:repeat(2,minmax(0,1fr))}
.journey.four{grid-template-columns:repeat(4,minmax(0,1fr))}
.journey.three{grid-template-columns:repeat(3,minmax(0,1fr))}
@media (max-width:1100px){.journey.four{grid-template-columns:repeat(2,minmax(0,1fr))}}
.jstep.other{opacity:.85}
.jstep.other:hover{opacity:1}
.rail button.dim{color:var(--ink-3)}
.tw{overflow-x:auto;border:1px solid var(--line);border-radius:8px;margin-bottom:10px}
.tw table{border-collapse:collapse;width:100%;font-size:14px}
.tw th,.tw td{text-align:left;vertical-align:top;padding:8px 12px;border-bottom:1px solid var(--line)}
.tw th{background:var(--surface-2);font-size:12px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--ink-3)}
.tw tr:last-child td{border-bottom:0}
.keys li > span{min-width:0}
.main a[data-week]{font-weight:600}
@media (max-width:760px){.journey.two,.journey.three,.journey.four{grid-template-columns:1fr}}
</style>"""
i = head.index('</style>'); head = head[:i] + extra_css + head[i+len('</style>'):]
import re as _re
i = head.rindex('</style>'); head = head[:i] + open('spock.css',encoding='utf-8').read() + head[i:]
i = head.rindex('</style>'); head = head[:i] + open('game.css',encoding='utf-8').read() + head[i:]
i = head.rindex('</style>'); head = head[:i] + open('path.css',encoding='utf-8').read() + head[i:]
i = head.rindex('</style>'); head = head[:i] + open('intro.css',encoding='utf-8').read() + head[i:]
i = head.rindex('</style>'); head = head[:i] + open('home.css',encoding='utf-8').read() + head[i:]
i = head.rindex('</style>'); head = head[:i] + open('pathvar.css',encoding='utf-8').read() + head[i:]
i = head.rindex('</style>'); head = head[:i] + open('sim.css',encoding='utf-8').read() + head[i:]
_h = open('hand.path').read().strip()
_old = '<span class="logo" aria-hidden="true"></span><span>SPOCK User<small id="brand-sub">Onboarding pro PM · PD · SWE · GM</small></span>'
assert _old in head, 'brand'
head = head.replace(_old, '<svg class="sp-logo hdr" viewBox="0 0 100 100" aria-hidden="true"><rect width="100" height="100" rx="22" fill="#1068D2"/><path d="'+_h+'" fill="#fff"/></svg><span>SPOCK <span class="brand-u">User Onboarding</span><small id="brand-sub">PM · PD · SWE · GM</small></span>')
assert '<span class="pill num" id="pill-prog">0 %</span>' in head
head = head.replace('<span class="pill num" id="pill-prog">0 %</span>', '<button class="pill ntf-pill" id="pill-ntf" type="button" hidden aria-expanded="false" aria-controls="ntf-pop" aria-label="Upozornění"></button><span class="pill num" id="pill-streak" title="Série"></span><span class="pill num hide-sm" id="pill-xp" title="XP"></span><span class="pill num hide-sm" id="pill-prog">0 %</span><button class="pill fb-pill" id="pill-fb" type="button" data-fbopen aria-label="Napsat zpětnou vazbu k tutoriálu" title="Napsat zpětnou vazbu k tutoriálu"><svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><path d="M4 5h16v11H9l-5 4z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg><span class="fb-t">Zpětná vazba</span></button>')
fab = '<button class="g-fab" id="g-fab" type="button" aria-label="Spock, průvodce onboardingem. Klikněte pro otázku, přetažením nebo šipkami ho přesunete." hidden><span class="g-bubble" id="g-fab-t">Jsem Spock. Klikněte, nebo mě přetáhněte.</span></button>'
head, n1 = _re.subn(r'<button class="g-fab".*?</button>', lambda m: fab, head, count=1, flags=_re.S)
head, n2 = _re.subn(r'<svg class="g-bot" id="g-bot-head".*?</svg>', '<span id="g-head-bot"></span>', head, count=1, flags=_re.S)
assert n1 == 1 and n2 == 1
head = head.replace('placeholder="Např. Jak mám začít se SPOCKem?"', 'placeholder="Zeptejte se Spocka…"')
head = head.replace('<b>Průvodce SPOCK</b>', '<b>Spock</b>').replace('Zná celý tento onboarding. Odpovídá z vašeho Claude účtu.', 'Průvodce onboardingem. Zná všechny lekce a odpovídá z vašeho Claude účtu.')
head = head.replace('aria-label="Průvodce SPOCK onboardingem"', 'aria-label="Spock, průvodce onboardingem"')
# ikona aplikace (záložka prohlížeče a plocha telefonu): vložená přímo do stránky, aby fungovala i bez dalších souborů.
# Pro vlastní server jsou stejné soubory a manifest ve složce web/ikona/.
import base64 as _b64
_b = lambda f: _b64.b64encode(open(os.path.join('ikona', f), 'rb').read()).decode()
_icons = ('<link rel="icon" type="image/svg+xml" href="data:image/svg+xml;base64,' + _b('ikona.svg') + '">'
          '<link rel="apple-touch-icon" sizes="180x180" href="data:image/png;base64,' + _b('ikona-180.png') + '">'
          '<meta name="theme-color" content="#1068D2"><meta name="apple-mobile-web-app-title" content="SPOCK"><meta name="application-name" content="SPOCK">\n')
head = rep(head, '<meta name="claude:viewport-fit-sides" content="cover">', '<meta name="claude:viewport-fit-sides" content="cover">\n' + _icons)
os.makedirs('dist', exist_ok=True)
import hashlib, glob as _glob
_srcs = ['app.js', 'sim.js', 'track.js'] + sorted(_glob.glob('*.css')) + ['base-head.html', os.path.join('dist', 'data.json')] + sorted(_glob.glob(os.path.join('ikona', '*')))
_src = hashlib.sha1(b''.join(open(f, 'rb').read() for f in _srcs)).hexdigest()[:12]
_tok = lambda n: round(n / 3.5)
_sz = lambda fs: sum(os.path.getsize(f) for f in fs)
_data = json.load(open(os.path.join('dist', 'data.json'), encoding='utf-8'))
_les = sorted(_glob.glob(os.path.join('..', 'onboarding', '*.md')))
_edit = {'lekce': _tok(_sz(_les)), 'aplikace': _tok(_sz(['app.js', 'sim.js', 'track.js'])), 'vzhled': _tok(_sz(sorted(_glob.glob('*.css')) + ['base-head.html'])),
         'testy': _tok(_sz(sorted(_glob.glob(os.path.join('..', 'nastroje', '*.py'))) + [os.path.join('..', 'nastroje', 'e2e', 'journey.js')])),
         'top': sorted([[os.path.basename(f), _tok(os.path.getsize(f))] for f in _les + ['app.js', 'sim.js', 'track.js']], key=lambda x: -x[1])[:8]}
_edit['celkem'] = _edit['lekce'] + _edit['aplikace'] + _edit['vzhled'] + _edit['testy']
_rep = None
try:
    _r = json.load(open(os.path.join('dist', 'e2e-report.json'), encoding='utf-8'))
    if _r.get('src') == _src: _rep = _r
except Exception: pass
def _report(name):
    # zpráva z testu se přiloží jen tehdy, když test běžel nad stejnými zdroji jako toto sestavení
    try:
        r = json.load(open(os.path.join('dist', name), encoding='utf-8'))
        return r if r.get('src') == _src else None
    except Exception: return None
BUILD = {'a11y': _report('pristupnost-report.json'), 'perf': _report('vykon-report.json'), 'scen': _report('scenare-report.json'), 'src': _src, 'size': {'js': _sz(['app.js', 'sim.js', 'track.js']), 'css': _sz(sorted(_glob.glob('*.css'))), 'data': os.path.getsize(os.path.join('dist', 'data.json'))},
         'counts': {'moduly': len(_data['W']), 'lekce': sum(len(w['days']) for w in _data['W']), 'karty': sum(len(d.get('cards', [])) for w in _data['W'] for d in w['days']),
                    'ukoly': sum(len(d['todo']) for w in _data['W'] for d in w['days']), 'kviz': sum(len(w['quiz']) for w in _data['W'])},
         'edit': _edit, 'e2e': _rep}
def _minjs(js):
    # výkon: z JavaScriptu se vypustí řádky, které jsou celé komentář (// … a /* … */ na vlastních řádcích), a odsazení. Kód se nemění.
    js = _re.sub(r'^[ \t]*/\*(?:(?!\*/).)*\*/[ \t]*\n', '', js, flags=_re.S | _re.M)
    js = _re.sub(r'^[ \t]*//[^\n]*\n', '', js, flags=_re.M)
    # odsazení řádků se vypustí taky: v šablonách HTML na něm nezáleží a bloky kódu (<pre>) se plní z dat, ne z odsazeného textu
    return _re.sub(r'^[ \t]+', '', js, flags=_re.M)
app = _minjs(open('app.js',encoding='utf-8').read() + '\n' + open('sim.js',encoding='utf-8').read() + '\n' + open('track.js',encoding='utf-8').read()).replace('__DATA__', "JSON.parse('" + json.dumps(json.load(open(os.path.join('dist','data.json'),encoding='utf-8')), ensure_ascii=False, separators=(',',':')).replace('\\', '\\\\').replace("'", "\\'").replace('</', '<\\/') + "')")
# verze v patičce: commit tutoriálu a vydání SPOCKu, podle kterého je napsaný
import subprocess
def _git(*a):
    try: return subprocess.run(['git', *a], capture_output=True, text=True, cwd=HERE).stdout.strip()
    except Exception: return ''
_ver = _git('log', '-1', '--format=%h') or 'neznámá'; _date = _git('log', '-1', '--format=%cd', '--date=format:%-d. %-m. %Y')
BUILD.update({'ver': _ver, 'date': _date, 'ts': int(_git('log', '-1', '--format=%ct') or 0) * 1000, 'title': _git('log', '-1', '--format=%s')[:120]})
_sv = open(os.path.join('..', 'SPOCK-VERZE.md'), encoding='utf-8').read()
_rel = (_re.search(r'^release:\s*(\S+)', _sv, _re.M) or [None, '?'])[1]
foot = '<footer class="ver"><span class="ver-n">Tutoriál zaznamenává váš průchod (návštěvy, kliknutí, odpovědi, dotazy na Spocka) pro vlastníka tutoriálu, aby ho mohl zlepšovat.</span>Tutoriál: verze ' + _ver + (' z ' + _date if _date else '') + ' · napsaný podle SPOCKu ' + _rel + '</footer>'
tail = "\ndocument.querySelector('#app').insertAdjacentHTML('afterend', " + json.dumps(foot, ensure_ascii=False) + ");" + "\n$('#g-fab').insertAdjacentHTML('afterbegin', spockSVG('fab'));\n$('#g-head-bot').outerHTML = spockSVG('head');\n$('#home-btn').addEventListener('click', () => go('home'));\nrender();\n})();\n</script>\n"
_rel_ = _rel
BUILD['spock'] = _rel_
# výkon: písmo se načte až po prvním vykreslení (neblokuje ho), styly bez komentářů a zbytečných mezer
_font = "(function(){const l=document.createElement('link');l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap';document.head.append(l);})();\n"
assert "render();\n})();" in tail
tail = tail.replace("render();\n})();", "render();\n" + _font + "})();")
def _mincss(m):
    c = _re.sub(r'/\*.*?\*/', '', m.group(1), flags=_re.S)
    c = _re.sub(r'\s*\n\s*', '\n', c)
    c = _re.sub(r'[ \t]*([{};])[ \t]*', r'\1', c)
    c = _re.sub(r';}', '}', c)
    return '<style>' + c.strip() + '</style>'
head = _re.sub(r'<style>(.*?)</style>', _mincss, head, flags=_re.S)
out = head + app + "\n\n" + bot + tail
BUILD['size']['html'] = len(out.encode('utf-8'))
out = out.replace('__BUILD__', json.dumps(BUILD, ensure_ascii=False))
open(os.path.join('dist','spock-user-onboarding.html'),'w',encoding='utf-8').write(out)
print(len(out))
