import re, json, sys
import os
HERE = os.path.dirname(os.path.abspath(__file__))
SRC = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, '..', 'onboarding')
OUT = sys.argv[2] if len(sys.argv) > 2 else os.path.join(HERE, 'dist', 'data.json')
os.makedirs(os.path.dirname(OUT), exist_ok=True)
MODS = [
 ('l0','uroven-0-priprava.md','pink',None,'Úroveň 0','Příprava','Přístupy a licence Copilota, instalace VS Code, Node.js a Gitu, kontrola nastavení a 5 pravidel.'),
 ('l1','uroven-1-zaklady.md','pink',None,'Úroveň 1','Základy','7 fází, Q a G brány, agenti, tasky a čtení hotového běhu.'),
 ('l1b','uroven-1b-faze-do-hloubky.md','pink',None,'Úroveň 1b','Fáze do hloubky','Sedm fází podle jejich specifikací: kroky, pravidla, brány, rozhodnutí a co fáze neopraví.'),
 ('pm','role-pm.md','purple','pm','Úroveň 2 · PM','Product Manager','Vlastní běh od briefu po iniciativu a každý podpis.'),
 ('pd','role-designer.md','purple','pd','Úroveň 2 · PD','Product Designer','Výzkum do fáze 2, trust tag, řešení, MVP a uživatelská část PRD.'),
 ('se','role-engineer.md','purple','se','Úroveň 2 · SWE','Software Engineer','Proveditelnost před G4, PRD jako vstup pro delivery, čtení kontrol.'),
 ('gm','role-guild-master.md','purple','gm','Úroveň 2 · GM','Guild Master','Správce PM metodiky: metodická revize běhů, změny know-how, komunita PM.'),
 ('l3','uroven-3-pokrocily.md','indigo',None,'Úroveň 3','Pokročilý','Vrácení fáze, neprošlá brána, předání běhu, free-roam a aktualizace.'),
 ('l4','uroven-4-superuser.md','blue',None,'Úroveň 4','Superuser','Co výstup dokazuje, sondy chování agentů, nálezy a mentoring.'),
]
FILE2MOD = {m[1]:m[0] for m in MODS}
NAMES = {m[1]:'modul '+m[5] for m in MODS}
def inline(s):
    s = s.strip()
    s = re.sub(r'\[([^\]]+)\]\(([A-Za-z0-9-]+\.md)\)', lambda m: f"[[{FILE2MOD.get(m.group(2),'home')}|{NAMES.get(m.group(2), m.group(1)) if m.group(1).endswith('.md') else m.group(1)}]]", s)
    return s
def mins(s):
    m = re.search(r'(\d+)\s*min', s); return int(m.group(1)) if m else 0
def parse_table(lines):
    rows=[[c.strip() for c in l.strip().strip('|').split('|')] for l in lines if l.strip().startswith('|')]
    rows=[r for r in rows if not all(re.fullmatch(r':?-{2,}:?',c) for c in r)]
    return {'head':[inline(c) for c in rows[0]], 'rows':[[inline(c) for c in r] for r in rows[1:]]}
def parse_quiz(text):
    out=[]
    parts = re.split(r'^\*\*\d+\.\s*(.+?)\*\*\s*$', text, flags=re.M)
    for i in range(1,len(parts),2):
        q = inline(parts[i]); body = parts[i+1]
        opts = [inline(m.group(2)) for m in re.finditer(r'^\s*([a-e])\)\s+(.+)$', body.split('<details>')[0], flags=re.M)]
        ans = re.search(r'<summary>Odpověď</summary>\s*(.+?)\s*</details>', body, flags=re.S).group(1).strip()
        ans = re.sub(r'\s*\n\s*', ' ', ans)
        if opts:
            m = re.match(r'([a-e])\)\s*(.*)', ans, flags=re.S)
            a = 'abcde'.index(m.group(1)); e = inline(m.group(2))
            # drop restated option text before " — " or first sentence duplicate
            if e.startswith(opts[a]): e = e[len(opts[a]):].lstrip(' —.:')
            out.append({'q':q,'o':opts,'a':a,'e':e})
        else:
            out.append({'q':q,'o':[],'a':-1,'e':inline(ans)})
    return out
def parse_module(fn):
    t = open(f'{SRC}/{fn}',encoding='utf-8').read()
    head, _, rest = t.partition('\n## ')
    rest = '## ' + rest
    title = re.match(r'# (.+)', head).group(1)
    tm = re.search(r'\(([^)]*h)\)\s*$', title)
    meta = {}
    for k in ['Cíl','Proč','Než začnete']:
        m = re.search(r'\*\*'+k+r':\*\*\s*(.+)', head)
        meta[k] = inline(m.group(1)) if m else ''
    quiz=[]
    if '\n## Kvíz' in rest:
        rest, qtext = rest.split('\n## Kvíz',1); quiz = parse_quiz(qtext)
    lessons=[]
    for blk in re.split(r'^## ', rest, flags=re.M)[1:]:
        hl, _, body = blk.partition('\n')
        lid, ltitle = [x.strip() for x in hl.split('—',1)]
        L = {'d':lid,'t':inline(ltitle),'learn':[],'learnMin':0,'key':[],'tables':[],'todo':[]}
        for sec in re.split(r'^### ', body, flags=re.M)[1:]:
            sh, _, sb = sec.partition('\n')
            if sh.startswith('Ke studiu'):
                L['learnMin'] = mins(sh)
                for m in re.finditer(r'^- 📄 (.+)$', sb, flags=re.M):
                    s = m.group(1)
                    mm = re.match(r'\*\*(.+?)\*\*[,:]?\s*(.*)', s)
                    if mm: L['learn'].append({'k':'text','l':inline(mm.group(1)),'n':inline(mm.group(2).lstrip('— ').lstrip(', '))})
                    else: L['learn'].append({'k':'text','l':inline(s),'n':''})
            elif sh.startswith('Klíčové'):
                lines = sb.split('\n'); tbl=[]
                for ln in lines:
                    if ln.strip().startswith('|'): tbl.append(ln); continue
                    if tbl: t_=parse_table(tbl); t_['at']=len(L['key']); L['tables'].append(t_); tbl=[]
                    m = re.match(r'^(?:-|\d+\.)\s+(.+)$', ln)
                    if m: L['key'].append(inline(m.group(1)))
                if tbl: t_=parse_table(tbl); t_['at']=len(L['key']); L['tables'].append(t_)
            elif sh.startswith('Úkoly'):
                for tb in re.split(r'^- \[ \] ', sb, flags=re.M)[1:]:
                    first, _, tr = tb.partition('\n')
                    m = re.match(r'\*\*(.+?)\*\*\s*(\((.+?)\))?', first)
                    task = {'t':inline(m.group(1)),'min':mins(m.group(3) or ''),'why':'','how':[]}
                    if m.group(3) and not re.fullmatch(r'\d+\s*min', m.group(3).strip()):
                        extra = re.sub(r'\d+\s*min,?\s*','',m.group(3)).strip(' ,–-')
                        if extra: task['note']=extra
                    for ln in tr.split('\n'):
                        w = re.match(r'^\s+- \*Proč:\*\s*(.+)$', ln)
                        if w: task['why']=inline(w.group(1)); continue
                        h = re.match(r'^\s+\d+\.\s+(.+)$', ln)
                        if h: task['how'].append(inline(h.group(1)))
                    L['todo'].append(task)
        lessons.append(L)
    return title, tm.group(1) if tm else '', meta, lessons, quiz
mods=[]
for mid,fn,c,role,lab,name,short in MODS:
    title,time,meta,lessons,quiz = parse_module(fn)
    mods.append({'id':mid,'c':c,'role':role,'lab':lab,'title':name,'short':short,'time':time,
      'goal':meta['Cíl'],'why':meta['Proč'],'before':meta['Než začnete'],'days':lessons,'quiz':quiz})
def tables_by_h2(fn):
    t=open(f'{SRC}/{fn}',encoding='utf-8').read(); res=[]
    for blk in re.split(r'^## ', t, flags=re.M)[1:]:
        h,_,b = blk.partition('\n'); tl=[l for l in b.split('\n') if l.strip().startswith('|')]
        if tl: res.append({'g':inline(h),'t':parse_table(tl)})
    return res
gl = parse_table([l for l in open(f'{SRC}/slovnik.md',encoding='utf-8') if l.startswith('|')])
GLOSS = [[re.sub(r'\*\*','',r[0]), r[1]] for r in gl['rows']]
CHEAT = tables_by_h2('tahak.md')
ct = open(f'{SRC}/tahak.md',encoding='utf-8').read()
CHEAT_INTRO = [inline(p) for p in ct.split('\n## ')[0].split('\n\n')[1:] if p.strip()]
DIAG = tables_by_h2('diagnostika.md')
dt = open(f'{SRC}/diagnostika.md',encoding='utf-8').read()
DIAG_INTRO = inline(dt.split('\n\n')[1])
zt = open(f'{SRC}/zasady.md',encoding='utf-8').read()
z1, z2 = zt.split('## Časté chyby uživatelů')
PRINCIPLES = [inline(m.group(1)) for m in re.finditer(r'^- (.+)$', z1, flags=re.M)]
MISTAKES = [[m.group(1), inline(m.group(2))] for m in re.finditer(r'^- \*\*(.+?)\*\*\s*(.*)$', z2, flags=re.M)]
rt = open(f'{SRC}/pripravenost.md',encoding='utf-8').read()
READY=[]
RC={'0':'pink','1':'pink','1b':'pink','2':'purple','3':'indigo','4':'blue'}
RR={'Product Manager':'pm','Product Designer':'pd','Software Engineer':'se','Guild Master':'gm'}
for blk in re.split(r'^## ', rt, flags=re.M)[1:]:
    h,_,b = blk.partition('\n'); lvl = re.search(r'Úroveň (\d\w?)',h).group(1)
    cur={'g':h,'c':RC[lvl],'role':None,'i':[]}; READY.append(cur)
    for ln in b.split('\n'):
        m = re.match(r'^\*\*(.+)\*\*$', ln.strip())
        if m:
            cur={'g':h+' · '+m.group(1),'c':RC[lvl],'role':RR[m.group(1)],'i':[]}; READY.append(cur); continue
        m = re.match(r'^- \[ \] (.+)$', ln)
        if m: cur['i'].append(inline(m.group(1)))
READY=[g for g in READY if g['i']]
json.dump({'W':mods,'GLOSS':GLOSS,'CHEAT':CHEAT,'CHEAT_INTRO':CHEAT_INTRO,'DIAG':DIAG,'DIAG_INTRO':DIAG_INTRO,'PRINCIPLES':PRINCIPLES,'MISTAKES':MISTAKES,'READY':READY}, open(OUT,'w',encoding='utf-8'), ensure_ascii=False, indent=0)
for m in mods: print(m['id'], m['time'], len(m['days']), [len(d['todo']) for d in m['days']], len(m['quiz']), [q['a'] for q in m['quiz']])
print('gloss',len(GLOSS),'cheat',[ (c['g'],len(c['t']['rows'])) for c in CHEAT],'diag',[len(d['t']['rows']) for d in DIAG],'pr',len(PRINCIPLES),'mist',len(MISTAKES),'ready',[(g['g'][:30],len(g['i'])) for g in READY])
