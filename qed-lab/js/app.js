/* Q.E.D. 연구소 — 앱 (대시보드, 연구실, 결투장, 진도) */
(() => {
  const { el } = Q;
  const KEY = 'qed-lab-v1';
  let S = { done: {}, solved: {}, wrong: {}, days: [] };
  try { const s = JSON.parse(localStorage.getItem(KEY) || 'null'); if (s) S = Object.assign(S, s); } catch (e) {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };
  const today = () => { const d = new Date(); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; };
  function touch() { const t = today(); if (!S.days.includes(t)) { S.days.push(t); S.days = S.days.slice(-400); } save(); }
  function streak() {
    let n = 0; const d = new Date();
    for (;;) { const k = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; if (S.days.includes(k)) { n++; d.setDate(d.getDate() - 1); } else if (n === 0 && k === today()) { d.setDate(d.getDate() - 1); } else break; }
    return n;
  }

  // 색인
  const ROOMS = [], BYID = {};
  QED.subjects.forEach(s => s.units.forEach(u => u.rooms.forEach(r => { r.subject = s; r.unit = u; ROOMS.push(r); BYID[r.id] = r; })));
  const pid = (r, i) => `${r.id}-${i}`;
  const totalProbs = ROOMS.reduce((a, r) => a + (r.probs || []).length, 0);

  const RANKS = [[0, '학부 연구생'], [0.08, '석사 과정'], [0.2, '박사 과정'], [0.38, '박사후 연구원'], [0.55, '조교수'], [0.75, '정교수'], [1, '필즈상 수상자']];
  const rank = () => { const p = Object.keys(S.done).filter(k => BYID[k]).length / ROOMS.length; let r = RANKS[0][1]; RANKS.forEach(([t, n]) => { if (p >= t) r = n; }); return r; };

  const main = document.getElementById('main');
  const typeset = node => { const MJ = window.MathJax; if (MJ && MJ.typesetPromise) MJ.typesetPromise([node]).catch(() => {}); else document.addEventListener('mj-ready', () => typeset(node), { once: true }); };

  function header() {
    document.getElementById('rank').textContent = rank();
    const s = streak(); document.getElementById('streak').textContent = s ? `연구 일지 ${s}일째` : '오늘 첫 기록을 남겨봐';
    const w = Object.keys(S.wrong).length; document.getElementById('wrongCount').textContent = w ? `(${w})` : '';
  }

  /* ---------- 대시보드 ---------- */
  function dashboard() {
    const doneN = ROOMS.filter(r => S.done[r.id]).length, solvedN = Object.keys(S.solved).length;
    const day = Math.floor(Date.now() / 864e5), tr = ROOMS[day % ROOMS.length];
    const next = ROOMS.find(r => !S.done[r.id]);
    const v = el('div', { class: 'dash' });
    v.append(el('section', { class: 'hero' },
      el('div', { class: 'hero-main' },
        el('p', { class: 'eyebrow' }, '오늘의 정리'),
        el('blockquote', { class: 'today', html: tr.card }),
        el('p', { class: 'today-who' }, `${tr.who}, ${tr.year} · `, el('a', { href: '#r-' + tr.id }, `${tr.title} 연구실로 →`))),
      el('div', { class: 'stats' },
        stat(`${doneN}<small>/${ROOMS.length}</small>`, '증명 끝낸 연구실'),
        stat(`${solvedN}<small>/${totalProbs}</small>`, '격파한 문제'),
        stat(`${streak()}<small>일</small>`, '연속 연구'),
        next ? el('a', { class: 'btn primary cont', href: '#r-' + next.id, html: `이어서 하기<br><small>${next.subject.short} · ${next.title}</small>` }) : el('p', { class: 'cont' }, '모든 연구실 정복! 🏅'))));

    const board = el('section', { class: 'board', 'aria-label': '연구실 지도' });
    QED.subjects.forEach(s => {
      const rs = s.units.flatMap(u => u.rooms), d = rs.filter(r => S.done[r.id]).length;
      const col = el('div', { class: 'subj', style: `--sc:var(${s.color})` },
        el('div', { class: 'subj-head' },
          el('h2', {}, s.name),
          el('span', { class: 'badge ' + (s.exam ? 'on' : 'off') }, s.exam ? '수능 출제' : '심화 · 수능 외'),
          el('p', { class: 'subj-sub' }, s.sub),
          el('div', { class: 'bar' }, el('i', { style: `width:${d / rs.length * 100}%` })),
          el('p', { class: 'bar-t' }, `${d} / ${rs.length} 연구실`)));
      s.units.forEach((u, ui) => {
        const ul = el('ol', { class: 'nodes' });
        u.rooms.forEach(r => {
          const wr = (r.probs || []).filter((_, i) => S.wrong[pid(r, i)]).length;
          ul.append(el('li', {}, el('a', { href: '#r-' + r.id, class: 'node' + (S.done[r.id] ? ' done' : '') },
            el('span', { class: 'dot', 'aria-hidden': 'true' }),
            el('span', { class: 'n-t' }, r.title),
            el('span', { class: 'n-w' }, shortWho(r.who)),
            wr ? el('span', { class: 'n-x', title: '오답' }, `✗${wr}`) : '')));
        });
        col.append(el('div', { class: 'unit' }, el('h3', {}, `${['Ⅰ', 'Ⅱ', 'Ⅲ'][ui]}. ${u.name}`), ul));
      });
      board.append(col);
    });
    v.append(board);

    const chains = [
      ['극한에서 미분, 그리고 적분으로', ['c1-limit', 'c1-deriv', 'c1-derivfn', 'c1-antideriv', 'c1-riemann', 'c1-ftc']],
      ['파스칼 삼각형이 종 모양이 되기까지', ['pr-binom', 'pr-indep', 'pr-binomdist', 'pr-normal', 'pr-sample', 'pr-ci']],
      ['무한히 더하면 넓이가 된다', ['c2-seq', 'c2-series', 'c2-sum', 'c1-riemann', 'c2-volume']],
      ['e라는 수는 어디서 왔을까', ['c2-seq', 'c2-e', 'c2-explog', 'c2-chain', 'c2-subst']],
      ['확률을 조건으로 다시 계산하기', ['pr-prob', 'pr-addition', 'pr-cond', 'pr-monty', 'pr-indep']]
    ];
    const ch = el('section', { class: 'chains' }, el('h2', { class: 'sec-h' }, '개념의 계보'), el('p', { class: 'muted' }, '개념은 따로 떨어져 있지 않아. 화살표 방향으로 따라가면 하나가 다음 것의 재료가 되는 걸 볼 수 있어.'));
    chains.forEach(([name, ids]) => {
      const row = el('div', { class: 'chain' }, el('p', { class: 'chain-n' }, name));
      const line = el('div', { class: 'chain-l' });
      ids.filter(i => BYID[i]).forEach((i, k) => { if (k) line.append(el('span', { class: 'arr', 'aria-hidden': 'true' }, '→')); line.append(el('a', { href: '#r-' + i, class: 'chip' + (S.done[i] ? ' done' : '') }, BYID[i].title)); });
      row.append(line); ch.append(row);
    });
    v.append(ch);
    return v;
  }
  const shortWho = w => { const ws = w.split(' · ')[0].split(' '); const l = ws[ws.length - 1]; return /^\d/.test(l) ? ws.slice(-2).join(' ') : l; };
  const stat = (n, l) => el('div', { class: 'stat' }, el('b', { html: n }), el('span', {}, l));

  /* ---------- 연구실 ---------- */
  function room(r) {
    const idx = ROOMS.indexOf(r), prev = ROOMS[idx - 1], next = ROOMS[idx + 1];
    const v = el('article', { class: 'room', style: `--sc:var(${r.subject.color})` });
    v.append(el('nav', { class: 'crumb' }, el('a', { href: '#' }, '연구실 지도'), ' / ', r.subject.name, ' / ', r.unit.name));
    v.append(el('header', { class: 'room-h' },
      el('h1', {}, r.title),
      el('p', { class: 'who' }, `${r.who} · ${r.year}`),
      S.done[r.id] ? el('span', { class: 'stamp' }, '∎ Q.E.D.') : ''));

    v.append(section('미스터리', '?', el('div', { class: 'prose mystery', html: r.mystery })));

    const lab = el('div', { class: 'lab' });
    if (r.try) lab.append(el('p', { class: 'try', html: '<b>해볼 것</b> ' + r.try }));
    const host = el('div', { class: 'sim' }); lab.append(host);
    v.append(section('실험대', '⚗', lab));

    if (r.guess) {
      const g = r.guess, box = el('div', { class: 'guess' }, el('p', { class: 'prose', html: g.q }));
      const opts = el('div', { class: 'opts' }), res = el('div', { class: 'prose reveal', hidden: '' });
      g.opts.forEach((o, i) => opts.append(el('button', { type: 'button', class: 'opt', html: o, onclick: e => {
        opts.querySelectorAll('.opt').forEach((b, j) => { b.disabled = true; b.classList.toggle('right', j === g.ans); });
        if (i !== g.ans) e.currentTarget.classList.add('nope');
        res.innerHTML = (i === g.ans ? '<b class="ok">맞아. 좋은 직관이야.</b> ' : '<b class="ng">아쉽지만 다시 보자.</b> ') + g.why; res.hidden = false; typeset(res);
      } })));
      box.append(opts, res);
      v.append(section('추측', '!', box));
    }

    const th = el('div', {}, el('div', { class: 'theorem prose', html: r.theorem }));
    if (r.proof && r.proof.length) {
      const pf = el('ol', { class: 'proof prose' }); let shown = 0;
      const more = el('button', { type: 'button', class: 'btn' }, '증명 한 줄 펼치기');
      const all = el('button', { type: 'button', class: 'btn ghost' }, '전부 보기');
      const step = () => { if (shown < r.proof.length) { const li = el('li', { html: r.proof[shown++] }); pf.append(li); typeset(li); } if (shown >= r.proof.length) { more.hidden = true; all.hidden = true; pf.append(el('li', { class: 'qed-mark' }, '∎')); } };
      more.onclick = step; all.onclick = () => { while (shown < r.proof.length) step(); };
      th.append(el('h3', { class: 'sub-h' }, '왜 그럴까: 증명'), pf, el('div', { class: 'row' }, more, all));
    }
    if (r.deeper) th.append(el('details', { class: 'deeper' }, el('summary', {}, '한 단계 더 깊이'), el('div', { class: 'prose', html: r.deeper })));
    v.append(section('정리와 증명', '∴', th));

    if (r.exam) v.append(section('수능은 이렇게 묻는다', '⚔', el('ul', { class: 'exam prose' }, ...r.exam.map(t => el('li', { html: t })))));

    if (r.probs && r.probs.length) {
      const pw = el('div', { class: 'probs' });
      r.probs.forEach((p, i) => pw.append(problem(r, p, i)));
      v.append(section('결투장', '✎', pw));
    }

    const fin = el('div', { class: 'finish' });
    const fb = el('button', { type: 'button', class: 'btn primary big' }, S.done[r.id] ? '이 연구실은 증명 끝 ∎ (다시 보기 중)' : '이해했다. 증명 끝! ∎');
    fb.onclick = () => { if (!S.done[r.id]) { S.done[r.id] = Date.now(); touch(); header(); qed(r); fb.textContent = '이 연구실은 증명 끝 ∎'; } };
    fin.append(fb);
    const nav = el('div', { class: 'pn' });
    nav.append(prev ? el('a', { href: '#r-' + prev.id, class: 'btn ghost' }, '← ' + prev.title) : el('span'));
    nav.append(next ? el('a', { href: '#r-' + next.id, class: 'btn ghost' }, next.title + ' →') : el('a', { href: '#', class: 'btn ghost' }, '지도로'));
    fin.append(nav);
    v.append(fin);

    requestAnimationFrame(() => { try { r.sim(host, Q); } catch (e) { host.append(el('p', { class: 'ng' }, '시뮬레이션 오류: ' + e.message)); console.error(e); } });
    return v;
  }
  const section = (name, glyph, body) => el('section', { class: 'blk' }, el('h2', { class: 'blk-h' }, el('span', { class: 'glyph', 'aria-hidden': 'true' }, glyph), name), body);

  function problem(r, p, i) {
    const id = pid(r, i);
    const box = el('div', { class: 'prob' + (S.solved[id] ? ' solved' : ''), id: 'p-' + id });
    box.append(el('div', { class: 'prob-h' }, el('span', { class: 'lv lv' + p.lv }, p.lv + '점'), el('span', { class: 'pno' }, `문제 ${i + 1}`), S.wrong[id] ? el('span', { class: 'n-x' }, '오답 노트에 있음') : ''));
    box.append(el('div', { class: 'prose q', html: p.q }));
    const fb = el('div', { class: 'fb', 'aria-live': 'polite' });
    let peeked = false;
    const check = ok => {
      if (ok) { fb.innerHTML = '<b class="ok">정답!</b>' + (peeked ? ' 풀이를 봤으니 오답 노트에는 남겨둘게.' : ' 한 방에 격파.'); box.classList.add('solved'); S.solved[id] = Date.now(); if (!peeked) delete S.wrong[id]; }
      else { fb.innerHTML = '<b class="ng">아니야.</b> 힌트를 하나 열어보고 다시 해봐.'; S.wrong[id] = { t: Date.now() }; }
      touch(); header();
    };
    if (p.opts) {
      const os = el('div', { class: 'opts num' });
      p.opts.forEach((o, k) => os.append(el('button', { type: 'button', class: 'opt', html: `<span class="cn">${'①②③④⑤'[k]}</span> ${o}`, onclick: e => { const ok = k === p.ans; e.currentTarget.classList.add(ok ? 'right' : 'nope'); check(ok); } })));
      box.append(os);
    } else {
      const iid = 'in-' + id, inp = el('input', { type: 'text', inputmode: 'decimal', id: iid, autocomplete: 'off', placeholder: '답 입력' });
      const go = () => { const v = parseFloat(inp.value.replace(/\s/g, '')); if (isNaN(v)) { fb.textContent = '숫자로 입력해줘.'; return; } check(Math.abs(v - p.ans) < 1e-6 * Math.max(1, Math.abs(p.ans))); };
      inp.addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
      box.append(el('div', { class: 'row' }, el('label', { for: iid, class: 'sr' }, '답'), inp, el('button', { type: 'button', class: 'btn', onclick: go }, '제출')));
    }
    box.append(fb);
    const hints = el('div', { class: 'hints' }), hb = el('div', { class: 'row' });
    (p.hints || []).forEach((h, k) => {
      const b = el('button', { type: 'button', class: 'btn ghost sm' }, `힌트 ${k + 1}`);
      b.onclick = () => { const d = el('div', { class: 'hint prose', html: `<b>힌트 ${k + 1}</b> ${h}` }); hints.append(d); typeset(d); b.disabled = true; };
      hb.append(b);
    });
    const sb = el('button', { type: 'button', class: 'btn ghost sm' }, '풀이 보기');
    sb.onclick = () => { if (!S.solved[id]) { peeked = true; S.wrong[id] = { t: Date.now() }; save(); header(); } const d = el('div', { class: 'sol prose', html: '<b>풀이</b> ' + p.sol }); hints.append(d); typeset(d); sb.disabled = true; };
    hb.append(sb);
    box.append(hb, hints);
    return box;
  }

  function qed(r) {
    const o = el('div', { class: 'qed-ov', role: 'dialog', 'aria-label': '증명 완료' },
      el('div', { class: 'qed-card' },
        el('p', { class: 'qed-big' }, '∎ Q.E.D.'),
        el('p', { class: 'eyebrow' }, '정리 카드 획득'),
        el('p', { class: 'card-t', html: r.card }),
        el('p', { class: 'muted' }, `${r.who} · ${r.year}`),
        el('p', { class: 'muted' }, `현재 직급: ${rank()}`),
        el('button', { type: 'button', class: 'btn primary' }, '계속 연구하기')));
    o.addEventListener('click', e => { if (e.target === o || e.target.tagName === 'BUTTON') o.remove(); });
    document.body.append(o); typeset(o); o.querySelector('button').focus();
  }

  /* ---------- 카드 · 오답 ---------- */
  function cards() {
    const v = el('div', { class: 'page' }, el('h1', { class: 'page-h' }, '정리 카드 컬렉션'),
      el('p', { class: 'muted' }, `연구실을 증명 끝내면 카드가 생겨. ${ROOMS.filter(r => S.done[r.id]).length} / ${ROOMS.length}장 모음.`));
    const g = el('div', { class: 'cards' });
    ROOMS.forEach(r => g.append(S.done[r.id]
      ? el('a', { href: '#r-' + r.id, class: 'tcard', style: `--sc:var(${r.subject.color})` }, el('span', { class: 'tc-s' }, r.subject.short), el('p', { class: 'tc-t', html: r.card }), el('p', { class: 'tc-w' }, `${r.who} · ${r.year}`))
      : el('a', { href: '#r-' + r.id, class: 'tcard locked' }, el('span', { class: 'tc-s' }, r.subject.short), el('p', { class: 'tc-t' }, '?'), el('p', { class: 'tc-w' }, r.title))));
    v.append(g); return v;
  }
  function wrong() {
    const ids = Object.keys(S.wrong).sort((a, b) => S.wrong[a].t - S.wrong[b].t);
    const v = el('div', { class: 'page' }, el('h1', { class: 'page-h' }, '오답 노트'),
      el('p', { class: 'muted' }, '틀렸거나 풀이를 먼저 본 문제가 여기 쌓여. 다시 풀어서 힌트 없이 맞히면 빠져. 3일 넘게 지난 문제는 "복습할 때"로 표시돼.'));
    if (!ids.length) { v.append(el('p', { class: 'empty' }, '비어 있어. 결투장에서 문제를 풀다 틀리면 여기로 와.')); return v; }
    const list = el('div', { class: 'probs' });
    ids.forEach(id => {
      const m = id.match(/^(.*)-(\d+)$/); const r = BYID[m[1]]; if (!r) return; const i = +m[2]; const p = r.probs[i]; if (!p) return;
      const old = Date.now() - S.wrong[id].t > 3 * 864e5;
      list.append(el('p', { class: 'wr-from' }, el('a', { href: '#r-' + r.id }, `${r.subject.short} · ${r.title}`), old ? el('span', { class: 'chip due' }, '복습할 때') : ''));
      list.append(problem(r, p, i));
    });
    v.append(list); return v;
  }

  /* ---------- 라우터 ---------- */
  function route() {
    Q.cleanup();
    const h = location.hash.slice(1);
    main.innerHTML = '';
    let view;
    if (h.startsWith('r-') && BYID[h.slice(2)]) view = room(BYID[h.slice(2)]);
    else if (h === 'cards') view = cards();
    else if (h === 'wrong') view = wrong();
    else view = dashboard();
    main.append(view);
    document.querySelectorAll('.topnav a').forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + h || (a.getAttribute('href') === '#' && (h === '' || h.startsWith('r-')))));
    header(); typeset(view); window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', route);
  route();
})();
