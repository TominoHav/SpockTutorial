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
@media (max-width:1100px){.journey.four{grid-template-columns:repeat(2,minmax(0,1fr))}}
.jstep.other{opacity:.6}
.jstep.other:hover{opacity:1}
.rail button.dim{opacity:.55}
.tw{overflow-x:auto;border:1px solid var(--line);border-radius:8px;margin-bottom:10px}
.tw table{border-collapse:collapse;width:100%;font-size:14px}
.tw th,.tw td{text-align:left;vertical-align:top;padding:8px 12px;border-bottom:1px solid var(--line)}
.tw th{background:var(--surface-2);font-size:12px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--ink-3)}
.tw tr:last-child td{border-bottom:0}
.keys li > span{min-width:0}
.main a[data-week]{font-weight:600}
@media (max-width:760px){.journey.two,.journey.four{grid-template-columns:1fr}}
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
head = head.replace('<span class="pill num" id="pill-prog">0 %</span>', '<span class="pill num" id="pill-streak" title="Série"></span><span class="pill num hide-sm" id="pill-xp" title="XP"></span><span class="pill num hide-sm" id="pill-prog">0 %</span>')
fab = '<button class="g-fab" id="g-fab" type="button" aria-label="Spock, průvodce onboardingem. Klikněte pro otázku, přetažením nebo šipkami ho přesunete." hidden><span class="g-bubble" id="g-fab-t">Jsem Spock. Klikněte, nebo mě přetáhněte.</span></button>'
head, n1 = _re.subn(r'<button class="g-fab".*?</button>', lambda m: fab, head, count=1, flags=_re.S)
head, n2 = _re.subn(r'<svg class="g-bot" id="g-bot-head".*?</svg>', '<span id="g-head-bot"></span>', head, count=1, flags=_re.S)
assert n1 == 1 and n2 == 1
head = head.replace('placeholder="Např. Jak mám začít se SPOCKem?"', 'placeholder="Zeptejte se Spocka…"')
head = head.replace('<b>Průvodce SPOCK</b>', '<b>Spock</b>').replace('Zná celý tento onboarding. Odpovídá z vašeho Claude účtu.', 'Průvodce onboardingem. Zná všechny lekce a odpovídá z vašeho Claude účtu.')
head = head.replace('aria-label="Průvodce SPOCK onboardingem"', 'aria-label="Spock, průvodce onboardingem"')
os.makedirs('dist', exist_ok=True)
app = (open('app.js',encoding='utf-8').read() + '\n' + open('sim.js',encoding='utf-8').read()).replace('__DATA__', json.dumps(json.load(open(os.path.join('dist','data.json'),encoding='utf-8')), ensure_ascii=False))
tail = "\n$('#g-fab').insertAdjacentHTML('afterbegin', spockSVG('fab'));\n$('#g-head-bot').outerHTML = spockSVG('head');\n$('#home-btn').addEventListener('click', () => go('home'));\nrender();\n})();\n</script>\n"
out = head + app + "\n\n" + bot + tail
open(os.path.join('dist','spock-user-onboarding.html'),'w',encoding='utf-8').write(out)
print(len(out))
