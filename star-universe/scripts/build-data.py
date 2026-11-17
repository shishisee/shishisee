# Builds src/data/sky.json from d3-celestial (BSD-3, (c) Olaf Frohn) data files.
import json, sys, os
src = sys.argv[1]
J = lambda f: json.load(open(os.path.join(src, f), encoding='utf-8'))
stars = J('stars.6.json')['features']
names = J('starnames.json')
cons = J('constellations.json')['features']
lines = {f['id']: f['geometry']['coordinates'] for f in J('constellations.lines.json')['features']}
out_stars = []
for s in stars:
    ra, dec = s['geometry']['coordinates']
    m = s['properties']['mag']
    try: bv = float(s['properties']['bv'])
    except: bv = 0.6
    out_stars.append([round(ra % 360, 3), round(dec, 3), round(m, 2), round(bv, 2)])
named = []
want = {'Sirius','Canopus','Arcturus','Vega','Capella','Rigel','Procyon','Betelgeuse','Altair','Aldebaran','Antares','Spica','Pollux','Fomalhaut','Deneb','Regulus','Polaris','Castor','Bellatrix'}
for k, v in names.items():
    if v.get('name') in want:
        s = next((x for x in stars if str(x['id']) == k), None)
        if s:
            ra, dec = s['geometry']['coordinates']
            named.append({'n': v.get('ko') or v['name'], 'ra': round(ra % 360, 3), 'dec': round(dec, 3)})
fix = {'폴라리스': '북극성', '베가': '직녀성(베가)', '알타이르': '견우성(알타이르)'}
for n in named: n['n'] = fix.get(n['n'], n['n'])
out_cons = []
for f in cons:
    cid = f['id']; p = f['properties']
    lab = f['geometry']['coordinates']
    ls = [[[round(a % 360, 3), round(b, 3)] for a, b in seg] for seg in lines.get(cid, [])]
    out_cons.append({'id': cid, 'ko': p.get('ko', p['name']), 'en': p['name'], 'ra': round(lab[0] % 360, 2), 'dec': lab[1], 'rank': int(p.get('rank', 3)), 'lines': ls})
json.dump({'stars': out_stars, 'named': named, 'cons': out_cons}, open(sys.argv[2], 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
print(len(out_stars), len(named), len(out_cons))
