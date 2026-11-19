/* 확률과 통계 — 경우의 수 · 확률 · 통계 */
(() => {
const square = P => { const r = P.w / P.h; P.ymin = -1.25; P.ymax = 1.25; P.xmin = -1.25 * r; P.xmax = 1.25 * r; };
const bars = (P, xs, ys, color, w = 0.8, stroke) => xs.forEach((x, i) => P.rect(x - w / 2, 0, x + w / 2, ys[i], color, stroke));
const frac = (a, b) => `$\\frac{${a}}{${b}}$`;

QED.subject({
  id: 'pr', name: '확률과 통계', short: '확통', color: '--sky', exam: true,
  sub: '세는 법에서 출발해 불확실함을 숫자로 다루는 법까지',
  units: [
  { name: '경우의 수', rooms: [

  { id: 'pr-circ', title: '원순열', who: '바스카라 2세', year: '1150년경',
    card: T`서로 다른 $n$개를 원형으로 배열하는 경우의 수는 $\dfrac{n!}{n}=(n-1)!$`,
    mystery: T`<p>5명을 일렬로 세우는 방법은 $5!=120$가지야. 그런데 원탁에 앉히면 120가지가 아니야. 모두 한 칸씩 옆으로 옮겨 앉아도 <b>같은 배치</b>거든. 누구 옆에 누가 있는지가 그대로니까.</p><p>그럼 120가지 중에 몇 개씩이 사실은 같은 배치일까?</p>`,
    try: '"한 칸 회전"을 n번 눌러 봐. 오른쪽에 일렬 배치가 하나씩 쌓이는데, 원탁 위에서는 모두 같은 배치야.',
    sim(h, Q) {
      const cols = ['--yellow', '--sky', '--pink', '--green', '--red', '--muted', '--chalk'];
      let n = 5, rot = 0, ang = 0, order = [...Array(7).keys()], seen = []; const L = 'ABCDEFG';
      const P = Q.plot(h, { aspect: 0.55, draw: P => {
        square(P); const c = P.c, ctx = P.ctx, R = 0.78, cx = -0.25 * P.w / P.h - 0.35;
        ctx.strokeStyle = c.muted; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(P.X(cx), P.Y(0), (P.X(R * 0.62) - P.X(0)), 0, 7); ctx.stroke();
        for (let i = 0; i < n; i++) { const a = Math.PI / 2 - (i + ang) * 2 * Math.PI / n, x = cx + R * Math.cos(a), y = R * Math.sin(a), p = order[(i - rot % n + n * 10) % n];
          ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue(cols[p]); ctx.beginPath(); ctx.arc(P.X(x), P.Y(y), 17, 0, 7); ctx.fill();
          ctx.fillStyle = c.board; ctx.font = 'bold 16px "IBM Plex Mono"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(L[p], P.X(x), P.Y(y)); }
        ctx.fillStyle = c.muted; ctx.font = '13px "Gowun Batang"'; ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        const x0 = P.X(cx + 1.05); ctx.fillText('일렬로 읽으면 (12시 방향부터 시계방향):', x0, 12);
        seen.forEach((s, i) => { ctx.fillStyle = i === seen.length - 1 ? c.y : c.chalk; ctx.font = '16px "IBM Plex Mono"'; ctx.fillText(s, x0, 36 + i * 22); });
        if (seen.length >= n) { ctx.fillStyle = c.g; ctx.font = '14px "Gowun Batang"'; ctx.fillText(`→ 서로 다른 일렬 배치 ${n}개 = 원탁 배치 1개`, x0, 40 + n * 22); }
      } });
      const read = () => { const s = []; for (let i = 0; i < n; i++) s.push(L[order[(i - rot % n + n * 10) % n]]); return s.join(' '); };
      const A = Q.anim(dt => { ang += dt * 2.2; if (ang >= 1) { ang = 0; rot++; const s = read(); if (!seen.includes(s)) seen.push(s); P.redraw(); return false; } P.redraw(); });
      const out = Q.readout(h); const upd = () => { out.innerHTML = `n = ${n} · 일렬 배치 n! = ${Q.fact(n)} · 회전해서 같아지는 묶음 크기 n = ${n}<br><span class="y">원순열 = n!/n = (n − 1)! = ${Q.fact(n - 1)}</span>`; };
      const c = Q.ctrls(h);
      Q.slider(c, { label: 'n명', min: 3, max: 7, step: 1, value: 5, fmt: v => v }, v => { n = v; rot = 0; seen = [read()]; upd(); P.redraw(); });
      Q.button(c, '한 칸 회전 ↻', () => { if (!A.running) A.start(); }, 'primary');
      Q.button(c, '자리 섞기', () => { order = order.slice(0, n).sort(() => Math.random() - 0.5).concat(order.slice(n)); rot = 0; seen = [read()]; P.redraw(); });
      seen = [read()]; upd();
    },
    guess: { q: '5명이 원탁에 앉는 서로 다른 방법의 수는?', opts: ['120', '24', '60', '5'], ans: 1, why: T`일렬 배치 120가지는 회전으로 같아지는 것끼리 5개씩 묶여. $120\div5=24=4!$. 한 사람을 고정하고 나머지 4명을 일렬로 세우는 것과 같아.` },
    theorem: T`<h4>원순열</h4><p>서로 다른 $n$개를 원형으로 배열하는 경우의 수:</p>$$\frac{n!}{n}=(n-1)!$$<h4>다각형 탁자</h4><p>정$k$각형 탁자의 각 변에 $m$명씩 앉으면 $\dfrac{(km)!}{k}$. 회전해서 겹치는 위치가 $k$개뿐이기 때문이야. 단, 변 위의 자리는 서로 구별돼.</p><h4>이웃 조건</h4><p>"A와 B가 이웃": 둘을 한 덩어리로 묶어 원순열을 구하고, 덩어리 안의 순서 $2!$를 곱해.</p>`,
    proof: [T`원탁 배치 하나를 정하고, 12시 자리부터 시계방향으로 읽으면 일렬 배치가 하나 나와.`, T`읽기 시작하는 자리를 $n$가지로 바꾸면 서로 다른 일렬 배치가 $n$개 나와.`, T`반대로 모든 일렬 배치는 정확히 하나의 원탁 배치에서 나와.`, T`그러니까 $n!=(\text{원순열의 수})\times n$.`],
    exam: [T`이웃(묶기)과 이웃하지 않음(여사건이나 사이에 끼우기) 조건이 섞인 원탁 문제.`, T`정사각형·직사각형 탁자: 회전 대칭이 몇 개인지가 핵심이야. 직사각형이면 2로 나눠.`, T`원 안에 색칠하기(돌려서 같은 것은 하나로) 문제도 같은 원리야.`],
    probs: [
      { lv: 2, q: '6명이 원탁에 둘러앉는 경우의 수를 구하시오.', ans: 120, hints: [T`$(6-1)!$`], sol: T`$5!=120$` },
      { lv: 3, q: '부모 2명과 자녀 4명이 원탁에 앉을 때, 부모가 서로 이웃하여 앉는 경우의 수를 구하시오.', ans: 48, hints: ['부모를 한 덩어리로 묶으면 5개가 원탁에 앉아.'], sol: T`$4!\times2!=48$` },
      { lv: 4, q: '정사각형 모양 탁자의 각 변에 2명씩 8명이 앉는 경우의 수를 구하시오. (회전하여 일치하는 것은 같은 것으로 본다.)', ans: 10080, hints: ['일렬로 늘어놓으면 8!', '정사각형은 90° 회전마다 겹쳐. 같은 배치가 4개씩이야.'], sol: T`$\dfrac{8!}{4}=10080$` }]
  },

  { id: 'pr-grid', title: '중복순열과 같은 것이 있는 순열', who: '야코프 베르누이', year: '1713',
    card: T`같은 것이 $p,q,r$개씩 있는 $n$개의 순열: $\dfrac{n!}{p!\,q!\,r!}$`,
    mystery: T`<p>격자 모양 도시에서 집(왼쪽 아래)부터 학교(오른쪽 위)까지 가장 짧게 가는 길은 몇 가지일까? 길을 다 그려 보면 끝이 없어 보여.</p><p>그런데 모든 최단 경로는 <b>→와 ↑를 늘어놓은 문자열</b>이야. 길을 세는 문제가 글자를 배열하는 문제로 바뀌는 거지.</p>`,
    try: '→, ↑ 버튼으로 직접 길을 만들어 봐. "모든 경로"를 켜면 가능한 길이 전부 겹쳐 그려져.',
    sim(h, Q) {
      let m = 4, n = 3, path = '', all = false; const out = Q.readout(document.createElement('div'));
      const P = Q.plot(h, { aspect: 0.55, draw: P => {
        const c = P.c, pad = 0.7, r = P.w / P.h, H = n + 2 * pad, W = Math.max(m + 2 * pad, H * r); P.xmin = -pad - (W - m - 2 * pad) / 2; P.xmax = P.xmin + W; P.ymin = -pad; P.ymax = n + pad;
        for (let i = 0; i <= m; i++) P.seg(i, 0, i, n, c.grid, 2); for (let j = 0; j <= n; j++) P.seg(0, j, m, j, c.grid, 2);
        const draw = (s, col, lw) => { let x = 0, y = 0; for (const ch of s) { const nx = x + (ch === 'R'), ny = y + (ch === 'U'); P.seg(x, y, nx, ny, col, lw); x = nx; y = ny; } return [x, y]; };
        if (all && Q.comb(m + n, n) <= 1500) { const rec = (s, a, b) => { if (a === m && b === n) { draw(s, c.bF, 3); return; } if (a < m) rec(s + 'R', a + 1, b); if (b < n) rec(s + 'U', a, b + 1); }; rec('', 0, 0); }
        const [x, y] = draw(path, c.y, 4.5); P.dot(0, 0, c.g, 8); P.dot(m, n, c.p, 8); P.dot(x, y, c.y, 6);
        P.text(0, 0, '집', c.g, 'left', 10, 22); P.text(m, n, '학교', c.p, 'left', 10, -6);
        out.innerHTML = `지금 경로: <span class="y">${path.replace(/R/g, '→').replace(/U/g, '↑') || '(아직 없음)'}</span><br>→ ${m}개와 ↑ ${n}개를 일렬로 배열하는 경우의 수 = (${m + n})! / (${m}! ${n}!) = <span class="g">${Q.comb(m + n, n)}</span>`;
      } });
      const c = Q.ctrls(h); const cnt = ch => path.split(ch).length - 1;
      Q.button(c, '→', () => { if (cnt('R') < m) { path += 'R'; P.redraw(); } }, 'primary');
      Q.button(c, '↑', () => { if (cnt('U') < n) { path += 'U'; P.redraw(); } }, 'primary');
      Q.button(c, '지우기', () => { path = ''; P.redraw(); });
      Q.button(c, '무작위 경로', () => { const a = [...'R'.repeat(m) + 'U'.repeat(n)]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } path = a.join(''); P.redraw(); });
      const ab = Q.button(c, '모든 경로', () => { all = !all; ab.classList.toggle('on', all); P.redraw(); });
      Q.slider(c, { label: '가로', min: 1, max: 7, step: 1, value: 4, fmt: v => v }, v => { m = v; path = ''; P.redraw(); });
      Q.slider(c, { label: '세로', min: 1, max: 6, step: 1, value: 3, fmt: v => v }, v => { n = v; path = ''; P.redraw(); });
      h.append(out);
    },
    guess: { q: '가로 4칸, 세로 3칸 격자의 최단 경로 수는?', opts: ['12', '35', '7', '24'], ans: 1, why: T`→→→→↑↑↑를 배열하는 수야. 7자리 중 ↑가 들어갈 3자리만 고르면 되니까 $\frac{7!}{4!3!}=35$.` },
    theorem: T`<h4>중복순열</h4><p>서로 다른 $n$개에서 중복을 허용해 $r$개를 뽑아 일렬로 배열: $\PI{n}{r}=n^r$</p><h4>같은 것이 있는 순열</h4><p>$n$개 중 같은 것이 각각 $p,q,\ldots,r$개씩 있을 때 일렬로 배열하는 경우의 수:</p>$$\frac{n!}{p!\,q!\cdots r!}\quad(p+q+\cdots+r=n)$$`,
    proof: [T`banana의 글자를 일단 모두 다르게 $b,a_1,n_1,a_2,n_2,a_3$으로 보면 $6!$가지.`, T`$a_1,a_2,a_3$끼리 자리를 바꾼 $3!$가지는 실제로는 같은 단어야.`, T`$n_1,n_2$끼리 바꾼 $2!$가지도 같아.`, T`그래서 $\dfrac{6!}{3!\,2!}=60$.`],
    exam: [T`최단 경로에서 "P를 반드시 지나는" → (A→P)×(P→B). "P를 지나지 않는" → 전체 − 지나는 경우.`, T`특정 문자의 순서가 정해진 배열(예: a가 b보다 앞): 그 문자들을 같은 것으로 보고 같은 것이 있는 순열로 세.`, T`중복순열: 함수의 개수, 우편함에 편지 넣기, 숫자 만들기.`],
    probs: [
      { lv: 2, q: '숫자 1, 2, 3 중에서 중복을 허락하여 만들 수 있는 네 자리 자연수의 개수를 구하시오.', ans: 81, hints: [T`각 자리마다 3가지`], sol: T`$3^4=81$` },
      { lv: 2, q: '단어 banana의 문자 6개를 모두 일렬로 나열하는 경우의 수를 구하시오.', ans: 60, hints: ['a 3개, n 2개가 같아.'], sol: T`$\frac{6!}{3!2!}=60$` },
      { lv: 3, q: '가로 방향 길 4칸, 세로 방향 길 3칸인 바둑판 모양 도로에서 왼쪽 아래 끝에서 오른쪽 위 끝까지 최단 거리로 가는 경우의 수를 구하시오.', ans: 35, hints: ['→ 4개, ↑ 3개'], sol: T`$\frac{7!}{4!3!}=35$` },
      { lv: 4, q: T`좌표평면에서 원점 $\mathrm O$를 출발해 $x$축 또는 $y$축 방향으로 한 번에 1씩 움직여 점 $(4,3)$까지 최단 거리로 갈 때, 점 $(2,1)$을 반드시 지나는 경우의 수를 구하시오.`, ans: 18, hints: [T`$\mathrm O\to(2,1)$, $(2,1)\to(4,3)$을 따로 세서 곱해.`], sol: T`$\frac{3!}{2!1!}\times\frac{4!}{2!2!}=3\times6=18$` }]
  },

  { id: 'pr-stars', title: '중복조합: 별과 막대', who: '윌리엄 펠러', year: '1950',
    card: T`$\H{n}{r}=\C{n+r-1}{r}$ : 별 $r$개와 막대 $n-1$개의 배열`,
    mystery: T`<p>똑같은 사탕 7개를 3명에게 나눠 주는 방법은 몇 가지일까? 사탕은 구별이 안 되고, 하나도 못 받는 사람이 있어도 돼.</p><p>펠러는 대학 교과서에서 이 문제를 아주 단순한 그림으로 바꿨어. <b>별 7개와 칸막이 2개</b>를 늘어놓기만 하면 돼.</p>`,
    try: '"다른 분배"를 계속 눌러 봐. 모든 분배가 ★과 | 를 늘어놓은 문자열 하나와 정확히 대응해.',
    sim(h, Q) {
      let n = 7, r = 3, min1 = false, parts = [3, 2, 2]; const cols = ['--yellow', '--sky', '--pink', '--green', '--red'];
      const out = Q.readout(document.createElement('div'));
      const P = Q.plot(h, { aspect: 0.32, draw: P => {
        const c = P.c, ctx = P.ctx, tot = n + r - 1, sp = Math.min(46, (P.w - 40) / tot), x0 = (P.w - sp * (tot - 1)) / 2, yS = P.h * 0.42;
        let i = 0; parts.forEach((p, g) => { const col = getComputedStyle(document.documentElement).getPropertyValue(cols[g]);
          for (let k = 0; k < p; k++) { ctx.fillStyle = col; ctx.font = `${Math.round(sp * 0.8)}px serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('★', x0 + i * sp, yS); i++; }
          if (g < r - 1) { ctx.strokeStyle = c.chalk; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x0 + i * sp, yS - sp * 0.55); ctx.lineTo(x0 + i * sp, yS + sp * 0.55); ctx.stroke(); i++; } });
        ctx.font = '15px "Gowun Batang"'; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        parts.forEach((p, g) => { ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue(cols[g]); ctx.fillText(`${String.fromCharCode(65 + g)}: ${p}개`, P.w * (g + 0.5) / r, P.h * 0.75); });
      } });
      const rnd = () => { const base = min1 ? 1 : 0, rest = n - base * r; const slots = [...Array(rest + r - 1).keys()].sort(() => Math.random() - 0.5).slice(0, r - 1).sort((a, b) => a - b); const p = []; let prev = -1; slots.forEach(s => { p.push(s - prev - 1); prev = s; }); p.push(rest + r - 2 - prev); parts = p.map(v => v + base); };
      const upd = () => { P.redraw(); const N = min1 ? Q.comb(n - 1, r - 1) : Q.comb(n + r - 1, n); out.innerHTML = min1 ? `각자 최소 1개: 먼저 1개씩 나눠 주고 남은 ${n - r}개를 ${r}명에게 → ${r}H${n - r} = ${n - 1}C${n - r} = <span class="g">${N}</span>` : `★ ${n}개 + | ${r - 1}개 = 기호 ${n + r - 1}개 중 ★ 자리 ${n}개 고르기 → ${r}H${n} = ${n + r - 1}C${n} = <span class="g">${N}</span>`; };
      const c = Q.ctrls(h);
      Q.button(c, '다른 분배', () => { rnd(); upd(); }, 'primary');
      Q.slider(c, { label: '사탕', min: 3, max: 10, step: 1, value: 7, fmt: v => v + '개' }, v => { n = v; if (min1 && n < r) n = r; rnd(); upd(); });
      Q.slider(c, { label: '사람', min: 2, max: 5, step: 1, value: 3, fmt: v => v + '명' }, v => { r = v; if (min1 && n < r) n = r; rnd(); upd(); });
      const mb = Q.button(c, '각자 최소 1개', () => { min1 = !min1; mb.classList.toggle('on', min1); if (n < r) n = r; rnd(); upd(); });
      h.append(out); requestAnimationFrame(upd);
    },
    guess: { q: '똑같은 사탕 7개를 3명에게 나누는 방법의 수는? (못 받는 사람이 있어도 된다)', opts: ['$3^7$', '$\\C{9}{2}=36$', '$\\C{7}{3}=35$', '$\\C{9}{7}=36$, 곧 ②와 같다'], ans: 3, why: T`★ 7개와 | 2개, 기호 9개 중 ★의 자리 7개를 고르면 $\C97=\C92=36$. ②와 ④는 같은 값이고, ④가 중복조합 $\H37$의 정의대로 쓴 거야.` },
    theorem: T`<h4>중복조합</h4><p>서로 다른 $n$개에서 중복을 허용해 $r$개를 택하는 조합의 수:</p>$$\H{n}{r}=\C{n+r-1}{r}$$<h4>방정식의 해</h4><p>$x_1+x_2+\cdots+x_n=r$의 음이 아닌 정수해의 개수 $=\H nr$</p><p>양의 정수해의 개수 $=\H{n}{r-n}=\C{r-1}{n-1}$ (먼저 1씩 나눠 주기)</p>`,
    proof: [T`$n$종류에서 $r$개 고르기 ⇔ $r$개의 ★을 $n$칸에 나누기. 칸막이는 $n-1$개면 충분해.`, T`★ $r$개와 | $(n-1)$개를 일렬로 배열하는 방법마다 분배가 하나씩 대응해.`, T`그 수는 같은 것이 있는 순열 $\dfrac{(n+r-1)!}{r!(n-1)!}=\C{n+r-1}{r}$.`],
    exam: [T`"$x+y+z=10$, $x\ge1$, $y\ge0$, $z\ge2$": 하한만큼 미리 빼서 음이 아닌 정수해로 바꿔.`, T`$(a+b+c)^n$ 전개식의 서로 다른 항의 개수 $=\H3n$.`, T`대소 조건 $1\le a\le b\le c\le6$: 순서가 정해진 중복 선택이니까 $\H63$.`],
    probs: [
      { lv: 2, q: '같은 사과 5개를 3명에게 나누어 주는 경우의 수를 구하시오. (사과를 받지 못하는 사람이 있어도 된다.)', ans: 21, hints: [T`$\H35$`], sol: T`$\C75=21$` },
      { lv: 3, q: T`방정식 $x+y+z=10$을 만족시키는 양의 정수 $x,y,z$의 순서쌍의 개수를 구하시오.`, ans: 36, hints: [T`$x=x'+1$ 등으로 바꾸면 $x'+y'+z'=7$`], sol: T`$\H37=\C97=36$` },
      { lv: 3, q: T`$(a+b+c)^6$의 전개식에서 서로 다른 항의 개수를 구하시오.`, ans: 28, hints: [T`$a^pb^qc^r$, $p+q+r=6$`], sol: T`$\H36=\C86=28$` }]
  },

  { id: 'pr-binom', title: '이항정리와 파스칼의 삼각형', who: '블레즈 파스칼', year: '1654',
    card: T`$(a+b)^n=\displaystyle\sum_{r=0}^{n}\C nr a^{n-r}b^r$, $\C{n-1}{r-1}+\C{n-1}{r}=\C nr$`,
    mystery: T`<p>$(a+b)^2=a^2+2ab+b^2$, $(a+b)^3=a^3+3a^2b+3ab^2+b^3$… 계수 1, 2, 1과 1, 3, 3, 1에는 패턴이 있어. $(a+b)^{10}$의 계수도 전개하지 않고 알 수 있을까?</p><p>파스칼은 숫자를 삼각형으로 쌓았어(중국의 양휘는 그보다 400년 먼저 했어). 그런데 이 삼각형의 홀수만 칠하면 <b>프랙탈</b>이 나와.</p>`,
    try: '칸을 눌러서 그 수가 어떤 전개의 어떤 항인지 확인해. "홀수만 칠하기"를 켜고 줄 수를 최대로 늘려 봐.',
    sim(h, Q) {
      let N = 8, sel = [6, 2], odd = false; const out = Q.readout(document.createElement('div'));
      const geo = P => { const s = Math.min(P.w / (N + 2), (P.h - 10) / (N + 1)); return { s, x0: P.w / 2, y0: s * 0.7 }; };
      const P = Q.plot(h, { aspect: 0.62, maxH: 560, onClick: (x, y, px, py) => { const g = geo(P), r = Math.round((py - g.y0) / g.s), k = Math.round((px - g.x0) / g.s + r / 2); if (r >= 0 && r <= N && k >= 0 && k <= r) { sel = [r, k]; upd(); } }, draw: P => {
        const c = P.c, ctx = P.ctx, g = geo(P), fs = g.s > 34 ? 13 : g.s > 22 ? 10 : 0;
        for (let r = 0; r <= N; r++) for (let k = 0; k <= r; k++) {
          const v = Q.comb(r, k), x = g.x0 + (k - r / 2) * g.s, y = g.y0 + r * g.s, on = sel[0] === r && sel[1] === k, par = (sel[0] === r + 1 && (k === sel[1] || k === sel[1] - 1));
          ctx.fillStyle = on ? c.y : par ? c.p : odd ? (v % 2 ? c.b : c.board) : c.bF; ctx.beginPath(); ctx.arc(x, y, g.s * 0.46, 0, 7); ctx.fill();
          if (fs) { ctx.fillStyle = on || par || (odd && v % 2) ? c.board : c.chalk; ctx.font = `${fs}px "IBM Plex Mono"`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(v > 99999 ? '…' : v, x, y); }
        }
      } });
      const upd = () => { P.redraw(); const [n, r] = sel; out.innerHTML = `선택: ${n}번째 줄 ${r}번째 = <span class="y">${n}C${r} = ${Q.comb(n, r)}</span>${n ? ` = <span class="p">${n - 1}C${r - 1} + ${n - 1}C${r}</span> (바로 위 두 수의 합)` : ''}<br>(a + b)<sup>${n}</sup>의 전개에서 a<sup>${n - r}</sup>b<sup>${r}</sup>의 계수: n개의 괄호 중 b를 고를 ${r}개를 택하는 방법의 수<br>${n}번째 줄의 합 = 2<sup>${n}</sup> = ${2 ** n}`; };
      const c = Q.ctrls(h);
      Q.slider(c, { label: '줄 수', min: 4, max: 31, step: 1, value: 8, fmt: v => v }, v => { N = v; if (sel[0] > N) sel = [N, 0]; upd(); });
      const ob = Q.button(c, '홀수만 칠하기', () => { odd = !odd; ob.classList.toggle('on', odd); P.redraw(); });
      h.append(out); requestAnimationFrame(upd); Q.note(h, '홀수만 칠하면 시에르핀스키 삼각형이 나타나. 32줄 근처까지 키워 봐.');
    },
    guess: { q: T`$(a+b)^5$의 전개식에서 $a^3b^2$의 계수는?`, opts: ['5', '10', '20', '15'], ans: 1, why: T`괄호 5개 중 $b$를 뽑을 2개를 고르는 방법이 $\C52=10$이야. 계수는 곧 조합의 수야.` },
    theorem: T`<h4>이항정리</h4>$$(a+b)^n=\C n0a^n+\C n1a^{n-1}b+\cdots+\C nr a^{n-r}b^r+\cdots+\C nn b^n$$<p>일반항은 $\C nr a^{n-r}b^r$.</p><h4>파스칼의 삼각형</h4><p>$\C{n-1}{r-1}+\C{n-1}{r}=\C nr$, $\C nr=\C n{n-r}$</p><h4>이항계수의 성질</h4>$$\C n0+\C n1+\cdots+\C nn=2^n$$$$\C n0+\C n2+\C n4+\cdots=2^{n-1}$$$$\C n1+\C n3+\C n5+\cdots=2^{n-1}$$`,
    proof: [T`$(a+b)^n=(a+b)(a+b)\cdots(a+b)$를 전개하면 각 괄호에서 $a$나 $b$ 하나를 골라 곱한 것들의 합이야.`, T`$a^{n-r}b^r$이 나오려면 $n$개의 괄호 중 $r$개에서 $b$를 골라야 해. 방법의 수는 $\C nr$.`, T`파스칼 법칙: $n$명 중 $r$명을 뽑을 때 특정한 사람 X를 기준으로 나눠 보자.`, T`X가 뽑히면 나머지 $n-1$명에서 $r-1$명: $\C{n-1}{r-1}$. X가 안 뽑히면 $\C{n-1}{r}$. 둘을 더하면 $\C nr$.`],
    exam: [T`$\left(x^2-\frac2x\right)^6$의 상수항: 일반항의 $x$ 지수를 0으로 놓고 $r$을 구해.`, T`$\C{10}{1}+\C{10}{3}+\cdots$: 이항계수 합 공식, 곧 $(1+1)^n$과 $(1-1)^n$을 이용해.`, T`$(1+x)^n$에 특정한 값을 대입하는 아이디어는 확률(이항분포)로 이어져.`],
    probs: [
      { lv: 2, q: T`$(x+2)^5$의 전개식에서 $x^3$의 계수를 구하시오.`, ans: 40, hints: [T`일반항 $\C5r x^{5-r}2^r$, $r=2$`], sol: T`$\C52\cdot4=40$` },
      { lv: 3, q: T`$\C91+\C93+\C95+\C97+\C99$의 값을 구하시오.`, ans: 256, hints: [T`홀수 번째 합 $=2^{n-1}$`], sol: T`$2^8=256$` },
      { lv: 3, q: T`$\left(x+\dfrac1x\right)^6$의 전개식에서 상수항을 구하시오.`, ans: 20, hints: [T`$x^{6-r}\cdot x^{-r}=x^{6-2r}$`], sol: T`$r=3$, $\C63=20$` },
      { lv: 4, q: T`$\left(x^2-\dfrac2x\right)^6$의 전개식에서 상수항을 구하시오.`, ans: 240, hints: [T`일반항 $\C6r(x^2)^{6-r}\left(-\frac2x\right)^r$`, T`$x$의 지수 $12-3r=0$`], sol: T`$r=4$: $\C64(-2)^4=15\cdot16=240$` }]
  }]},

  { name: '확률', rooms: [

  { id: 'pr-prob', title: '확률의 뜻과 큰수의 법칙', who: '파스칼 · 페르마', year: '1654',
    card: T`시행을 한없이 반복하면 상대도수는 수학적 확률에 가까워진다`,
    mystery: T`<p>1654년, 도박사 드 메레가 파스칼에게 물었어. "먼저 3번 이기면 판돈을 가져가는 게임을 하다가 내가 2승 1패인 상황에서 중단됐어. 판돈을 어떻게 나눠야 공정해?"</p><p>파스칼과 페르마가 주고받은 편지에서 <b>확률론</b>이 태어났어. 그런데 "주사위 눈 6의 확률이 1/6"이라는 말은 대체 무슨 뜻일까? 6번 던지면 꼭 한 번 나온다는 걸까?</p>`,
    try: '1번, 10번 던지면 들쭉날쭉해. 1000번씩 던지면 상대도수가 어디로 모이는지 봐.',
    sim(h, Q) {
      let cnt = [0, 0, 0, 0, 0, 0], hist = [], tot = 0;
      const bar = Q.plot(h, { xmin: 0.3, xmax: 6.7, ymin: 0, ymax: 0.4, aspect: 0.32, draw: P => { const c = P.c; P.grid({ sy: 0.1 }); P.hline(1 / 6, c.g, [6, 4], 1.6); bars(P, [1, 2, 3, 4, 5, 6], cnt.map(v => tot ? v / tot : 0), c.bF, 0.7, c.b); P.text(6.7, 1 / 6, '1/6', c.g, 'right', -4, -4); } });
      const line = Q.plot(h, { xmin: 0, xmax: 1, ymin: 0, ymax: 0.5, aspect: 0.3, draw: P => { const c = P.c; P.xmin = 0; P.xmax = Math.max(10, hist.length); P.grid({ sy: 0.1 }); P.hline(1 / 6, c.g, [6, 4], 1.6); const ctx = P.ctx; ctx.strokeStyle = c.y; ctx.lineWidth = 2; ctx.beginPath(); const step = Math.max(1, Math.floor(hist.length / 800)); for (let i = 0; i < hist.length; i += step) { const x = P.X(i + 1), y = P.Y(hist[i]); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); P.text(P.xmin, P.ymax, '6이 나온 상대도수의 변화', c.y, 'left', 8, 22); } });
      const out = Q.readout(h);
      const roll = k => { for (let i = 0; i < k; i++) { const d = Math.floor(Math.random() * 6); cnt[d]++; tot++; hist.push(cnt[5] / tot); } bar.redraw(); line.redraw(); out.innerHTML = `던진 횟수 ${tot} · 6이 나온 횟수 ${cnt[5]} · <span class="y">상대도수 ${tot ? (cnt[5] / tot).toFixed(4) : '-'}</span> · 수학적 확률 <span class="g">${(1 / 6).toFixed(4)}</span>`; };
      const c = Q.ctrls(h);
      Q.button(c, '1번 던지기 🎲', () => roll(1), 'primary'); Q.button(c, '10번', () => roll(10)); Q.button(c, '1000번', () => roll(1000)); Q.button(c, '10000번', () => roll(10000));
      Q.button(c, '처음으로', () => { cnt = [0, 0, 0, 0, 0, 0]; hist = []; tot = 0; roll(0); });
      requestAnimationFrame(() => roll(0));
    },
    guess: { q: '주사위를 6번 던지면 6의 눈은?', opts: ['반드시 한 번 나온다', '한 번도 안 나올 수 있다. 확률 1/6은 "아주 많이 던졌을 때의 비율"이다'], ans: 1, why: T`6번 중 한 번도 안 나올 확률은 $(5/6)^6\approx33\%$나 돼. 확률은 한 번의 결과를 약속하지 않아. 반복이 쌓일 때 드러나는 경향이야.` },
    theorem: T`<h4>수학적 확률</h4><p>표본공간 $S$의 각 근원사건이 일어날 가능성이 같을 때, 사건 $A$의 확률은</p>$$P(A)=\frac{n(A)}{n(S)}$$<h4>통계적 확률</h4><p>같은 시행을 $n$번 반복할 때 $A$가 $r_n$번 일어나면, $n$이 커질수록 상대도수 $\dfrac{r_n}{n}$은 일정한 값 $p$에 가까워져. 이 $p$를 통계적 확률이라 해(큰수의 법칙).</p><h4>기본 성질</h4><p>$0\le P(A)\le1$, $P(S)=1$, $P(\varnothing)=0$</p>`,
    proof: [T`<b>점수 문제</b> A가 2승 1패. 공정한 게임을 계속한다고 상상하자.`, T`다음 판에 A가 이기면(확률 $\frac12$) A가 3승으로 우승.`, T`B가 이기면 2승 2패. 그다음 판을 이기는 쪽이 우승이니까 A가 우승할 확률은 다시 $\frac12$.`, T`A의 우승 확률 $=\frac12+\frac12\cdot\frac12=\frac34$. 판돈은 A가 $\frac34$, B가 $\frac14$를 가지는 게 공정해.`],
    exam: [T`"동시에 꺼낸다"는 조합으로, "차례로 꺼낸다"는 순열로 세. 분모와 분자를 같은 방식으로 세는 게 핵심이야.`, T`최솟값·최댓값 조건: "최솟값이 3"이면 3을 반드시 뽑고 나머지는 4 이상에서 골라.`],
    probs: [
      { lv: 2, q: '두 개의 주사위를 동시에 던질 때, 나오는 눈의 수의 합이 7일 확률은?', opts: [frac(1, 12), frac(1, 9), frac(1, 6), frac(7, 36), frac(1, 4)], ans: 2, hints: ['(1,6), (2,5), …를 세어 봐.'], sol: T`6가지 $/36=\frac16$` },
      { lv: 3, q: '1부터 10까지의 자연수가 하나씩 적힌 카드 10장 중에서 3장을 동시에 꺼낼 때, 꺼낸 카드에 적힌 수의 최솟값이 3일 확률은?', opts: [frac(1, 8), frac(7, 40), frac(1, 5), frac(9, 40), frac(1, 4)], ans: 1, hints: ['3을 반드시 뽑고, 나머지 2장은 4~10에서.'], sol: T`$\dfrac{\C72}{\C{10}3}=\dfrac{21}{120}=\dfrac7{40}$` },
      { lv: 4, q: '실력이 같은 A, B가 먼저 3번 이기는 사람이 우승하는 게임을 한다. A가 2번, B가 1번 이긴 상태에서 게임을 계속할 때, A가 우승할 확률은? (비기는 경우는 없다.)', opts: [frac(1, 2), frac(2, 3), frac(3, 4), frac(5, 6), frac(7, 8)], ans: 2, hints: ['B가 우승하려면 다음 두 판을 모두 이겨야 해.'], sol: T`$1-\frac12\cdot\frac12=\frac34$` }]
  },

  { id: 'pr-addition', title: '확률의 덧셈정리와 여사건', who: '안드레이 콜모고로프', year: '1933',
    card: T`$P(A\cup B)=P(A)+P(B)-P(A\cap B)$, $P(A^C)=1-P(A)$`,
    mystery: T`<p>1933년 콜모고로프는 확률을 단 세 줄의 공리 위에 다시 세웠어. 확률은 <b>넓이</b>처럼 행동한다는 거야. 겹치지 않으면 그냥 더하면 되고, 겹치면 겹친 부분을 한 번 빼야 해.</p><p>다트를 마구 던져서 이걸 확인해 보자.</p>`,
    try: '원 B를 끌어서 A와의 겹침을 바꿔 봐. 다트를 많이 던지면 덧셈정리의 양변이 같은 값으로 모여.',
    sim(h, Q) {
      let bx = 0.35, by = 0.05, pts = []; const ra = 0.55, rb = 0.45, ax = -0.3, ay = 0;
      const inA = (x, y) => (x - ax) ** 2 + (y - ay) ** 2 < ra * ra, inB = (x, y) => (x - bx) ** 2 + (y - by) ** 2 < rb * rb;
      const out = Q.readout(document.createElement('div'));
      const P = Q.plot(h, { aspect: 0.55, onDrag: (x, y) => { bx = Math.max(-1, Math.min(1, x)); by = Math.max(-0.6, Math.min(0.6, y)); pts = []; P.redraw(); }, draw: P => {
        square(P); const c = P.c, ctx = P.ctx; P.rect(-1.1, -1.1, 1.1, 1.1, null, c.muted);
        pts.forEach(([x, y]) => { const a = inA(x, y), b = inB(x, y); ctx.fillStyle = a && b ? c.g : a ? c.y : b ? c.b : c.muted; ctx.fillRect(P.X(x) - 1, P.Y(y) - 1, 2.2, 2.2); });
        [[ax, ay, ra, c.y, 'A'], [bx, by, rb, c.b, 'B']].forEach(([x, y, r, col, L]) => { ctx.strokeStyle = col; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(P.X(x), P.Y(y), P.X(r) - P.X(0), 0, 7); ctx.stroke(); P.text(x - r * 0.7, y + r * 0.8, L, col, 'center', 0, 0, 20); });
        const n = pts.length || 1, A = pts.filter(p => inA(...p)).length / n, B = pts.filter(p => inB(...p)).length / n, AB = pts.filter(p => inA(...p) && inB(...p)).length / n, U = pts.filter(p => inA(...p) || inB(...p)).length / n;
        out.innerHTML = pts.length ? `다트 ${pts.length}개 (정사각형 안이 표본공간)<br><span class="y">P(A) ≈ ${A.toFixed(3)}</span> · <span class="b">P(B) ≈ ${B.toFixed(3)}</span> · <span class="g">P(A∩B) ≈ ${AB.toFixed(3)}</span><br>P(A∪B) ≈ ${U.toFixed(3)}   vs   P(A) + P(B) − P(A∩B) = ${(A + B - AB).toFixed(3)}<br>P(A<sup>C</sup>) ≈ ${(1 - A).toFixed(3)} = 1 − P(A)` : '다트를 던져 봐.';
      } });
      const c = Q.ctrls(h);
      const throwN = k => { for (let i = 0; i < k; i++) pts.push([Math.random() * 2.2 - 1.1, Math.random() * 2.2 - 1.1]); if (pts.length > 30000) pts = pts.slice(-30000); P.redraw(); };
      Q.button(c, '다트 100개', () => throwN(100), 'primary'); Q.button(c, '다트 3000개', () => throwN(3000)); Q.button(c, '지우기', () => { pts = []; P.redraw(); });
      h.append(out); Q.note(h, 'B를 A에서 완전히 떼어 놓으면 배반사건이야(P(A∩B) = 0).');
    },
    guess: { q: T`$P(A)=0.5$, $P(B)=0.4$, $P(A\cup B)=0.7$이면 $P(A\cap B)$는?`, opts: ['0.9', '0.2', '0.1', '알 수 없다'], ans: 1, why: T`$0.7=0.5+0.4-P(A\cap B)$. 두 번 센 겹친 부분이 $0.2$야.` },
    theorem: T`<h4>확률의 덧셈정리</h4>$$P(A\cup B)=P(A)+P(B)-P(A\cap B)$$<p>$A,B$가 서로 <b>배반사건</b>($A\cap B=\varnothing$)이면 $P(A\cup B)=P(A)+P(B)$.</p><h4>여사건의 확률</h4>$$P(A^C)=1-P(A)$$<p>"적어도 하나", "~이 아닌" 같은 말이 보이면 여사건을 먼저 떠올려.</p>`,
    proof: [T`$A\cup B$를 겹치지 않는 세 조각 $A\cap B^C$, $A\cap B$, $A^C\cap B$로 나누자.`, T`$P(A)=P(A\cap B^C)+P(A\cap B)$, $P(B)=P(A^C\cap B)+P(A\cap B)$`, T`두 식을 더하면 $P(A\cap B)$가 두 번 들어가.`, T`그러니까 $P(A\cup B)=P(A)+P(B)-P(A\cap B)$.`],
    exam: [T`"적어도 한 명은 여학생": 1 − (모두 남학생).`, T`세 사건의 덧셈정리는 벤다이어그램 영역을 직접 채우는 게 더 빨라.`],
    probs: [
      { lv: 2, q: T`두 사건 $A,B$에 대하여 $P(A)=0.5$, $P(B)=0.4$, $P(A\cup B)=0.7$일 때, $P(A\cap B)$의 값을 구하시오.`, ans: 0.2, hints: ['덧셈정리'], sol: T`$0.5+0.4-0.7=0.2$` },
      { lv: 3, q: '남학생 4명, 여학생 3명 중에서 3명을 뽑을 때, 여학생이 적어도 1명 포함될 확률은?', opts: [frac(4, 35), frac(27, 35), frac(29, 35), frac(31, 35), frac(33, 35)], ans: 3, hints: ['여사건: 모두 남학생'], sol: T`$1-\dfrac{\C43}{\C73}=1-\dfrac4{35}=\dfrac{31}{35}$` },
      { lv: 3, q: T`서로 배반인 두 사건 $A,B$에 대하여 $P(A)=\frac13$, $P(B)=\frac12$일 때, $P(A^C\cap B^C)$는?`, opts: [frac(1, 6), frac(1, 3), frac(1, 2), frac(2, 3), frac(5, 6)], ans: 0, hints: [T`$A^C\cap B^C=(A\cup B)^C$ (드모르간)`], sol: T`$1-\left(\frac13+\frac12\right)=\frac16$` }]
  },

  { id: 'pr-cond', title: '조건부확률과 베이즈', who: '토머스 베이즈', year: '1763',
    card: T`$P(B|A)=\dfrac{P(A\cap B)}{P(A)}$ : 조건이 주어지면 표본공간이 $A$로 줄어든다`,
    mystery: T`<p>어떤 병에 걸린 사람은 1%야. 검사의 정확도는 90%이고, 건강한 사람도 5%는 잘못 양성이 나와. 너는 <b>양성</b>을 받았어. 실제로 병에 걸렸을 확률은?</p><p>90%? 의사들한테 물어봐도 대부분 틀려. 정답은 놀랄 만큼 낮아. 1000명을 직접 세어 보자.</p>`,
    try: '유병률, 민감도, 위양성률을 바꿔 가며 "양성 중 진짜 환자" 비율을 봐. 유병률을 낮추면 어떻게 될까?',
    sim(h, Q) {
      let prev = 0.01, sens = 0.9, fp = 0.05; const out = Q.readout(document.createElement('div'));
      const P = Q.plot(h, { aspect: 0.5, draw: P => {
        const c = P.c, ctx = P.ctx, cols = 50, rows = 20, N = 1000, s = Math.min(P.w / cols, P.h / rows), x0 = (P.w - s * cols) / 2;
        const sick = Math.round(N * prev), tp = Math.round(sick * sens), fn = sick - tp, fpN = Math.round((N - sick) * fp);
        for (let i = 0; i < N; i++) { const col = i % cols, row = Math.floor(i / cols); let f;
          if (i < tp) f = c.r; else if (i < sick) f = c.pF; else if (i < sick + fpN) f = c.y; else f = c.grid;
          ctx.fillStyle = f; ctx.beginPath(); ctx.arc(x0 + (col + 0.5) * s, (row + 0.5) * s, s * 0.38, 0, 7); ctx.fill(); }
        const pos = tp + fpN;
        out.innerHTML = `1000명 중 환자 ${sick}명 → <span class="r">양성 ${tp}명</span>, <span class="p">음성 ${fn}명</span> / 건강한 ${N - sick}명 → <span class="y">잘못된 양성 ${fpN}명</span><br>양성인 사람 = ${tp} + ${fpN} = ${pos}명<br><b>P(환자 | 양성) = ${tp} / ${pos} = <span class="g">${pos ? (tp / pos * 100).toFixed(1) : '-'}%</span></b>  (정확한 값 ${(prev * sens / (prev * sens + (1 - prev) * fp) * 100).toFixed(2)}%)`;
      } });
      const c = Q.ctrls(h);
      Q.slider(c, { label: '유병률', min: 0.001, max: 0.2, step: 0.001, value: 0.01, fmt: v => (v * 100).toFixed(1) + '%' }, v => { prev = v; P.redraw(); });
      Q.slider(c, { label: '민감도 P(양성|환자)', min: 0.5, max: 1, step: 0.01, value: 0.9, fmt: v => (v * 100).toFixed(0) + '%' }, v => { sens = v; P.redraw(); });
      Q.slider(c, { label: '위양성 P(양성|건강)', min: 0, max: 0.3, step: 0.005, value: 0.05, fmt: v => (v * 100).toFixed(1) + '%' }, v => { fp = v; P.redraw(); });
      h.append(out); Q.note(h, '"양성이다"라는 조건이 주어지면 1000명 전체가 아니라 빨강+노랑 점들만 새 표본공간이 돼.');
    },
    guess: { q: '유병률 1%, 민감도 90%, 위양성률 5%일 때 양성이면 실제 환자일 확률은 대략?', opts: ['90%', '50%', '약 15%', '1%'], ans: 2, why: T`환자 10명 중 양성 9명. 건강한 990명 중 잘못된 양성 약 50명. 양성 59명 중 진짜는 9명이니까 약 15%. 병이 드물면 잘못된 양성이 진짜 양성보다 훨씬 많아져.` },
    theorem: T`<h4>조건부확률</h4><p>사건 $A$가 일어났을 때 사건 $B$가 일어날 확률:</p>$$P(B|A)=\frac{P(A\cap B)}{P(A)}\quad(P(A)>0)$$<h4>확률의 곱셈정리</h4><p>$P(A\cap B)=P(A)P(B|A)$<br>$\phantom{P(A\cap B)}=P(B)P(A|B)$</p><h4>베이즈 정리 (전확률 공식과 함께)</h4>$$P(A|B)=\frac{P(A)P(B|A)}{P(A)P(B|A)+P(A^C)P(B|A^C)}$$`,
    proof: [T`$A$가 일어났다는 걸 알면, 가능한 세계는 $A$ 안으로 줄어들어.`, T`그 안에서 $B$도 일어나는 부분은 $A\cap B$.`, T`그래서 새 확률은 비율 $\dfrac{P(A\cap B)}{P(A)}$.`, T`베이즈: 분자는 곱셈정리로 $P(A)P(B|A)$, 분모 $P(B)$는 $A$인 경우와 $A^C$인 경우로 나눠 더해.`],
    exam: [T`표로 정리되는 문제(남/여 × 찬성/반대): 조건에 해당하는 행이나 열만 보면 돼.`, T`"꺼낸 공이 흰 공이었을 때, 그 공이 주머니 A에서 나왔을 확률": 베이즈 구조. 나무 그림을 그려.`, T`$P(B|A)$와 $P(A|B)$를 헷갈리게 만드는 함정을 조심해.`],
    probs: [
      { lv: 2, q: T`두 사건 $A,B$에 대하여 $P(A)=0.4$, $P(A\cap B)=0.1$일 때, $P(B|A)$의 값을 구하시오.`, ans: 0.25, hints: ['정의대로'], sol: T`$0.1/0.4=0.25$` },
      { lv: 3, q: '전체의 1%가 걸린 병이 있다. 검사는 환자의 90%를 양성으로, 건강한 사람의 5%를 양성으로 판정한다. 한 사람이 양성 판정을 받았을 때, 이 사람이 환자일 확률은?', opts: [frac(2, 13), frac(1, 10), frac(9, 10), frac(1, 2), frac(1, 13)], ans: 0, hints: [T`$P(\text{양성})=0.01\cdot0.9+0.99\cdot0.05$`], sol: T`$\dfrac{0.009}{0.009+0.0495}=\dfrac{0.009}{0.0585}=\dfrac2{13}$` },
      { lv: 4, q: '주머니 A에는 흰 공 2개, 검은 공 3개가, 주머니 B에는 흰 공 4개, 검은 공 1개가 들어 있다. 주사위를 던져 3의 배수가 나오면 A에서, 그렇지 않으면 B에서 공 1개를 꺼낸다. 꺼낸 공이 흰 공일 때, 그 공이 주머니 A에서 나왔을 확률은?', opts: [frac(1, 6), frac(1, 5), frac(1, 4), frac(1, 3), frac(2, 5)], ans: 1, hints: [T`$P(A\cap\text{흰})=\frac13\cdot\frac25$`, T`$P(B\cap\text{흰})=\frac23\cdot\frac45$`], sol: T`$\dfrac{2/15}{2/15+8/15}=\dfrac15$` }]
  },

  { id: 'pr-monty', title: '몬티 홀의 문', who: '마릴린 보스 사반트', year: '1990',
    card: T`처음 고른 문이 정답일 확률 $\frac13$은 사회자가 문을 열어도 바뀌지 않는다. 바꾸면 $\frac23$`,
    mystery: T`<p>문 3개 중 하나 뒤에 자동차가 있어. 네가 1번 문을 고르자, 답을 아는 사회자가 염소가 있는 3번 문을 열고 묻지. "2번으로 바꿀래?"</p><p>1990년 칼럼니스트 보스 사반트가 "바꾸는 게 2배 유리하다"고 쓰자 수학 박사 수백 명을 포함해 약 1만 통의 항의 편지가 쏟아졌어. "남은 문은 둘이니 반반이다!" 누가 맞았을까?</p>`,
    try: '직접 몇 판 해 보고, "1000판 자동"으로 두 전략을 비교해. 문을 10개로 늘리면 직관이 확 바뀌어.',
    sim(h, Q) {
      let N = 3, car, pick = -1, opened = [], stage = 0, st = { stay: [0, 0], sw: [0, 0] };
      const doors = Q.el('div', { class: 'row', style: 'justify-content:center' }); const msg = Q.el('p', { class: 'prose', style: 'text-align:center; min-height:3.4em' });
      h.append(doors, msg);
      const reset = () => { car = Math.floor(Math.random() * N); pick = -1; opened = []; stage = 0; msg.innerHTML = '문을 하나 골라.'; render(); };
      const render = () => { doors.innerHTML = ''; for (let i = 0; i < N; i++) { const o = opened.includes(i) || stage === 2; const b = Q.el('button', { type: 'button', class: 'opt', style: `min-width:${N > 3 ? 54 : 90}px; text-align:center; font-size:${N > 3 ? 1.1 : 1.5}rem; ${i === pick ? 'border-color:var(--yellow);' : ''}`, html: o ? (i === car ? '🚗' : '🐐') : `🚪<br><small>${i + 1}</small>` }); b.disabled = o && stage !== 1; b.onclick = () => click(i); doors.append(b); } };
      const click = i => {
        if (stage === 0) { pick = i; const goats = [...Array(N).keys()].filter(j => j !== pick && j !== car); const keep = pick === car ? goats[Math.floor(Math.random() * goats.length)] : car; opened = [...Array(N).keys()].filter(j => j !== pick && j !== keep); stage = 1; msg.innerHTML = `사회자가 염소 문 ${opened.length}개를 열었어. 처음 고른 <b>${pick + 1}번</b>을 지킬래, 남은 <b>${keep + 1}번</b>으로 바꿀래? 둘 중 하나를 눌러.`; render(); }
        else if (stage === 1 && !opened.includes(i)) { const sw = i !== pick, win = i === car; st[sw ? 'sw' : 'stay'][0] += win; st[sw ? 'sw' : 'stay'][1]++; pick = i; stage = 2; msg.innerHTML = `${sw ? '바꿨어' : '지켰어'} → ${win ? '<b class="ok">자동차!</b>' : '<b class="ng">염소…</b>'} <button class="btn sm" type="button" id="mh-again">다시</button>`; render(); P.redraw(); document.getElementById('mh-again').onclick = reset; }
      };
      const P = Q.plot(h, { xmin: 0, xmax: 1, ymin: -0.5, ymax: 1.5, aspect: 0.22, draw: P => { const c = P.c, ctx = P.ctx; P.xmin = 0; P.xmax = 1; [['지키기', st.stay, c.p, 1], ['바꾸기', st.sw, c.g, 0]].forEach(([n, [w, t], col, y]) => { P.rect(0, y - 0.3, 1, y + 0.3, c.grid); P.rect(0, y - 0.3, t ? w / t : 0, y + 0.3, col); ctx.fillStyle = c.chalk; ctx.font = '14px "Gowun Batang"'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(`${n}: ${w}/${t} = ${t ? (w / t * 100).toFixed(1) : '-'}%`, 8, P.Y(y)); }); } });
      const c = Q.ctrls(h);
      Q.button(c, '1000판 자동', () => { for (let k = 0; k < 1000; k++) { const cr = Math.floor(Math.random() * N), pk = Math.floor(Math.random() * N); st.stay[0] += pk === cr; st.stay[1]++; st.sw[0] += pk !== cr; st.sw[1]++; } P.redraw(); }, 'primary');
      Q.select(c, '문 개수', ['3개', '10개'], v => { N = v ? 10 : 3; st = { stay: [0, 0], sw: [0, 0] }; P.redraw(); reset(); });
      Q.button(c, '기록 지우기', () => { st = { stay: [0, 0], sw: [0, 0] }; P.redraw(); });
      reset();
    },
    guess: { q: '문 3개. 바꾸면 자동차를 탈 확률은?', opts: [frac(1, 2), frac(1, 3), frac(2, 3)], ans: 2, why: T`처음 고른 문이 정답일 확률은 $\frac13$이고, 사회자는 답을 알고 문을 여니까 이 확률은 변하지 않아. 나머지 $\frac23$는 사회자가 열지 않은 한 문에 몰려. 문이 10개면 바꿨을 때 $\frac{9}{10}$야.` },
    theorem: T`<h4>조건부확률로 계산</h4><p>내가 1번을 고르고, 사회자가 3번을 연 사건을 $H$라 하자. $C_i$는 자동차가 $i$번에 있는 사건이야.</p><p>$P(H|C_1)=\frac12$, $P(H|C_2)=1$, $P(H|C_3)=0$</p>$$P(C_2|H)=\frac{\frac13\cdot1}{\frac13\cdot\frac12+\frac13\cdot1+0}=\frac23$$<p>핵심은 사회자가 <b>답을 알고</b> 염소 문만 연다는 정보야. 사회자가 무작위로 문을 열었는데 우연히 염소였다면 답은 정말 $\frac12$가 돼.</p>`,
    proof: [T`"지키기" 전략은 처음 선택이 맞을 때만 이겨: $\frac13$.`, T`"바꾸기" 전략은 처음 선택이 틀렸을 때 이겨. 그때 사회자는 남은 염소 문을 열 수밖에 없고, 남은 문이 자동차야.`, T`처음 선택이 틀릴 확률은 $\frac23$이니까 바꾸면 $\frac23$.`],
    exam: [T`수능에 몬티 홀이 그대로 나오지는 않아. 하지만 "정보가 주어질 때 확률이 어떻게 갱신되는가"는 조건부확률 4점 문제의 핵심이야.`, T`비슷한 구조: 세 장의 카드 문제, 두 아이 문제(적어도 한 명이 딸일 때 둘 다 딸일 확률).`],
    probs: [
      { lv: 2, q: '몬티 홀 문제(문 3개)에서 바꾸는 전략으로 자동차를 얻을 확률은?', opts: [frac(1, 3), frac(1, 2), frac(2, 3), frac(3, 4), '1'], ans: 2, hints: ['처음 선택이 틀릴 확률'], sol: T`$\frac23$` },
      { lv: 3, q: '세 장의 카드가 있다. 한 장은 양면이 빨강, 한 장은 양면이 파랑, 한 장은 한 면이 빨강이고 다른 면이 파랑이다. 무작위로 한 장을 뽑아 무작위로 한 면이 위로 오게 놓았더니 빨강이었다. 아래 면도 빨강일 확률은?', opts: [frac(1, 4), frac(1, 3), frac(1, 2), frac(2, 3), frac(3, 4)], ans: 3, hints: ['카드가 아니라 "면"을 세어 봐. 빨강 면은 모두 3개야.'], sol: T`빨강 면 3개 중 2개가 양면 빨강 카드의 면이야. $\frac23$.` },
      { lv: 4, q: '문 10개 중 하나 뒤에 자동차가 있다. 하나를 고르면 답을 아는 사회자가 나머지 9개 중 염소 문 8개를 연다. 남은 문으로 바꿀 때 자동차를 얻을 확률은?', opts: [frac(1, 10), frac(1, 2), frac(8, 10), frac(9, 10), '1'], ans: 3, hints: ['처음 고른 문이 맞을 확률은 1/10'], sol: T`$1-\frac1{10}=\frac9{10}$` }]
  },

  { id: 'pr-indep', title: '독립과 독립시행', who: '아브라암 드무아브르', year: '1718',
    card: T`$A,B$가 독립 $\iff P(A\cap B)=P(A)P(B)$. 독립시행: $\C nr p^r(1-p)^{n-r}$`,
    mystery: T`<p>"배반"과 "독립"은 이름이 비슷해 보이지만 거의 반대 개념이야. 배반은 "같이 일어날 수 없다", 독립은 "서로의 확률에 영향을 주지 않는다"는 뜻이야.</p><p>그럼 서로 배반인 두 사건은 독립일까? 정사각형 하나로 확인해 보자.</p>`,
    try: '세 가지 상황을 바꿔 가며 P(A∩B)와 P(A)P(B)를 비교해. 언제 둘이 같아질까?',
    sim(h, Q) {
      let mode = 0, a = 0.5, b = 0.4; const out = Q.readout(document.createElement('div'));
      const P = Q.plot(h, { aspect: 0.55, draw: P => {
        const c = P.c, r = P.w / P.h; P.ymin = -0.1; P.ymax = 1.1; P.xmin = 0.5 - 0.6 * r; P.xmax = 0.5 + 0.6 * r;
        P.rect(0, 0, 1, 1, c.grid, c.muted); let AB;
        if (mode === 0) { P.rect(0, 0, a, 1, c.yF); P.rect(0, 1 - b, 1, 1, c.bF); AB = a * b; P.rect(0, 1 - b, a, 1, c.gF, c.g); }
        else if (mode === 1) { const bb = Math.min(b, 1 - a); P.rect(0, 0, a, 1, c.yF); P.rect(1 - bb, 0, 1, 1, c.bF); AB = 0; }
        else { const ab = Math.min(a, b) * 0.85; P.rect(0, 0, a, 1, c.yF); P.rect(0, 1 - ab / a, a, 1, c.gF, c.g); P.rect(a, 1 - (b - ab) / (1 - a), 1, 1, c.bF); AB = ab; }
        P.text(0.02, 0.02, 'A', c.y, 'left', 4, -4, 18); P.text(0.98, 0.98, 'B', c.b, 'right', -4, 18, 18);
        const bv = mode === 1 ? Math.min(b, 1 - a) : b, ind = Math.abs(AB - a * bv) < 1e-9;
        out.innerHTML = `${['독립: A는 세로 띠, B는 가로 띠', '배반: A와 B가 겹치지 않음', '종속: B가 A 안에 몰려 있음'][mode]}<br>P(A) = ${a.toFixed(2)}, P(B) = ${bv.toFixed(2)}, <span class="g">P(A∩B) = ${AB.toFixed(3)}</span>, P(A)P(B) = ${(a * bv).toFixed(3)} → ${ind ? '<span class="g">같다 ⇒ 독립</span>' : '<span class="r">다르다 ⇒ 종속</span>'}<br>P(B|A) = ${(AB / a).toFixed(3)} vs P(B) = ${bv.toFixed(3)}${ind ? ' (A가 일어나도 B의 확률이 그대로)' : ''}`;
      } });
      const c = Q.ctrls(h);
      Q.select(c, '상황', ['독립', '배반', '종속'], v => { mode = v; P.redraw(); });
      Q.slider(c, { label: 'P(A)', min: 0.1, max: 0.9, value: 0.5 }, v => { a = v; P.redraw(); });
      Q.slider(c, { label: 'P(B)', min: 0.1, max: 0.9, value: 0.4 }, v => { b = v; P.redraw(); });
      h.append(out);
    },
    guess: { q: '$P(A)>0,\\ P(B)>0$인 두 사건이 서로 배반이면 독립일까?', opts: ['항상 독립이다', '절대 독립이 아니다', '경우에 따라 다르다'], ans: 1, why: T`배반이면 $P(A\cap B)=0$인데 $P(A)P(B)>0$이니까 같을 수 없어. A가 일어나면 B는 확실히 안 일어나니까, 오히려 서로에게 아주 강하게 영향을 주는 관계야.` },
    theorem: T`<h4>독립</h4><p>$P(B|A)=P(B)$일 때 $A$와 $B$는 서로 <b>독립</b>이야. 다음과 같이 써도 돼.</p>$$P(A\cap B)=P(A)P(B)$$<p>$A,B$가 독립이면 $A$와 $B^C$, $A^C$와 $B$, $A^C$와 $B^C$도 독립이야.</p><h4>독립시행의 확률</h4><p>한 번에 사건 $A$가 일어날 확률이 $p$인 시행을 $n$번 독립적으로 반복할 때, $A$가 정확히 $r$번 일어날 확률:</p>$$\C nr p^r(1-p)^{n-r}$$`,
    proof: [T`주사위를 5번 던져 6이 정확히 2번 나오는 경우를 보자.`, T`특정한 순서, 예를 들어 "6, 6, 아님, 아님, 아님"의 확률은 독립이니까 $\left(\frac16\right)^2\left(\frac56\right)^3$.`, T`6이 나오는 2번의 자리를 고르는 방법이 $\C52$가지이고, 각각의 확률은 모두 같아.`, T`그러니까 $\C52\left(\frac16\right)^2\left(\frac56\right)^3$.`],
    exam: [T`"독립이면 $P(A\cap B)=P(A)P(B)$"를 이용해 덧셈정리와 연립하는 문제.`, T`독립시행 + 여사건: "적어도 한 번" $=1-(1-p)^n$.`, T`점수·위치 이동 문제: 앞면 $r$번이면 위치가 어떻게 되는지 식을 세운 뒤 독립시행 확률을 써.`],
    probs: [
      { lv: 2, q: T`두 사건 $A,B$가 서로 독립이고 $P(A)=0.3$, $P(B)=0.5$일 때, $P(A\cup B)$의 값을 구하시오.`, ans: 0.65, hints: [T`$P(A\cap B)=0.15$`], sol: T`$0.3+0.5-0.15=0.65$` },
      { lv: 3, q: '주사위 한 개를 5번 던질 때, 6의 눈이 정확히 2번 나올 확률은?', opts: [frac(125, 3888), frac(625, 3888), frac(25, 216), frac(1, 36), frac(5, 36)], ans: 1, hints: [T`$\C52\left(\frac16\right)^2\left(\frac56\right)^3$`], sol: T`$10\cdot\frac1{36}\cdot\frac{125}{216}=\frac{1250}{7776}=\frac{625}{3888}$` },
      { lv: 3, q: '동전 한 개를 4번 던질 때, 앞면이 3번 이상 나올 확률은?', opts: [frac(1, 16), frac(1, 4), frac(5, 16), frac(3, 8), frac(1, 2)], ans: 2, hints: ['3번 또는 4번'], sol: T`$\dfrac{\C43+\C44}{16}=\dfrac5{16}$` }]
  }]},

  { name: '통계', rooms: [

  { id: 'pr-dist', title: '확률분포와 기댓값', who: '크리스티안 하위헌스', year: '1657',
    card: T`$E(X)=\sum x_ip_i$ (무게중심), $V(X)=E(X^2)-\{E(X)\}^2$, $E(aX+b)=aE(X)+b$, $V(aX+b)=a^2V(X)$`,
    mystery: T`<p>하위헌스는 최초의 확률 교과서에서 "이 게임의 가치는 얼마인가?"를 물었어. 그 답이 <b>기댓값</b>이야.</p><p>막대그래프를 시소라고 생각해 봐. 각 막대의 높이(확률)가 무게야. 어디에 받침점을 놓아야 시소가 수평이 될까?</p>`,
    try: '확률 무게를 바꿔 봐. 노란 받침점(기댓값)이 따라 움직여. 무게를 양 끝으로 몰면 분산이 어떻게 될까?',
    sim(h, Q) {
      let w = [1, 2, 4, 2, 1]; const xs = [1, 2, 3, 4, 5];
      const P = Q.plot(h, { xmin: 0.2, xmax: 5.8, ymin: -0.12, ymax: 0.62, aspect: 0.45, draw: P => {
        const c = P.c, s = w.reduce((a, b) => a + b, 0), p = w.map(v => s ? v / s : 0), E = xs.reduce((a, x, i) => a + x * p[i], 0), V = xs.reduce((a, x, i) => a + (x - E) ** 2 * p[i], 0), sd = Math.sqrt(V);
        P.grid({ sy: 0.1 }); P.rect(E - sd, 0, E + sd, 0.6, c.pF); bars(P, xs, p, c.bF, 0.6, c.b);
        const ctx = P.ctx; ctx.fillStyle = c.y; ctx.beginPath(); ctx.moveTo(P.X(E), P.Y(0)); ctx.lineTo(P.X(E) - 12, P.Y(0) + 22); ctx.lineTo(P.X(E) + 12, P.Y(0) + 22); ctx.closePath(); ctx.fill();
        P.seg(0.4, 0, 5.6, 0, c.chalk, 3); p.forEach((v, i) => P.text(xs[i], v, v.toFixed(2), c.b, 'center', 0, -4, 12));
        out.innerHTML = `<span class="y">E(X) = Σ x·p = ${E.toFixed(3)}</span> (받침점)<br><span class="p">V(X) = Σ (x − m)²·p = ${V.toFixed(3)}</span>, σ(X) = ${sd.toFixed(3)} (분홍 띠: m ± σ)<br>E(X²) − {E(X)}² = ${(xs.reduce((a, x, i) => a + x * x * p[i], 0) - E * E).toFixed(3)} ← 같은 값`;
      } });
      const out = Q.readout(document.createElement('div'));
      const c = Q.ctrls(h);
      xs.forEach((x, i) => Q.slider(c, { label: `X=${x} 무게`, min: 0, max: 6, step: 0.1, value: w[i], fmt: v => v.toFixed(1) }, v => { w[i] = v; P.redraw(); }));
      h.append(out);
    },
    guess: { q: '확률을 양 끝(1과 5)에 몰고 가운데를 0으로 하면?', opts: ['기댓값과 분산이 모두 커진다', '기댓값은 3 그대로, 분산은 커진다', '분산이 0이 된다'], ans: 1, why: '대칭이면 받침점은 가운데 그대로야. 하지만 무게가 중심에서 멀리 있을수록 흩어진 정도(분산)는 커져.' },
    theorem: T`<h4>이산확률변수</h4><p>$P(X=x_i)=p_i$, $\sum p_i=1$</p><h4>기댓값·분산·표준편차</h4><p>$E(X)=\sum x_ip_i=m$</p><p>$V(X)=\sum(x_i-m)^2p_i$<br>$\phantom{V(X)}=E(X^2)-\{E(X)\}^2$</p><p>$\sigma(X)=\sqrt{V(X)}$</p><h4>일차식의 변환</h4><p>$E(aX+b)=aE(X)+b$, $V(aX+b)=a^2V(X)$, $\sigma(aX+b)=|a|\sigma(X)$</p><p>$b$는 분포를 옆으로 옮길 뿐이라 퍼진 정도에는 영향이 없어.</p>`,
    proof: [T`$V(X)=\sum(x_i-m)^2p_i=\sum x_i^2p_i-2m\sum x_ip_i+m^2\sum p_i$`, T`$=E(X^2)-2m\cdot m+m^2\cdot1=E(X^2)-m^2$`, T`$V(aX+b)$: $aX+b$의 평균은 $am+b$이니까 편차는 $a(x_i-m)$. 제곱하면 $a^2$가 나와.`],
    exam: [T`확률분포표의 빈칸을 $\sum p=1$로 채운 뒤 $E$, $V$ 계산.`, T`$E(X)$, $V(X)$를 주고 $E(3X-1)$, $V(3X-1)$을 묻는 2·3점 문제.`, T`$Y=aX+b$의 표준편차에서 $a<0$이면 절댓값!`],
    probs: [
      { lv: 2, q: T`확률변수 $X$가 $1,2,3$의 값을 각각 확률 $\frac12,\frac13,\frac16$로 가질 때, $E(X)$는?`, opts: [frac(3, 2), frac(5, 3), '2', frac(7, 3), frac(11, 6)], ans: 1, hints: [T`$1\cdot\frac12+2\cdot\frac13+3\cdot\frac16$`], sol: T`$\frac12+\frac23+\frac12=\frac53$` },
      { lv: 3, q: T`$E(X)=3$, $V(X)=4$일 때, $E(2X+1)+V(2X+1)$의 값을 구하시오.`, ans: 23, hints: [T`$E=2\cdot3+1$, $V=4\cdot4$`], sol: T`$7+16=23$` },
      { lv: 3, q: T`$E(X)=2$, $E(X^2)=5$일 때, $\sigma(-3X+4)$의 값을 구하시오.`, ans: 3, hints: [T`$V(X)=5-4=1$`], sol: T`$\sigma(X)=1$, $|-3|\cdot1=3$` }]
  },

  { id: 'pr-binomdist', title: '이항분포와 갈톤 보드', who: '프랜시스 골턴', year: '1889',
    card: T`$X\sim B(n,p)$이면 $E(X)=np$, $V(X)=np(1-p)$. $n$이 크면 정규분포에 가까워진다`,
    mystery: T`<p>골턴은 못을 삼각형으로 박은 판을 만들었어. 위에서 구슬을 떨어뜨리면 못에 부딪힐 때마다 왼쪽이나 오른쪽으로 반반의 확률로 튕겨.</p><p>구슬 하나하나는 완전히 무작위인데, 수천 개가 쌓이면 늘 <b>같은 모양</b>이 나타나. 무작위 속의 질서야.</p>`,
    try: '구슬 300개를 떨어뜨려 봐. 줄 수를 늘리고 p를 바꿔 보고, 이론 곡선과 비교해.',
    sim(h, Q) {
      let n = 10, p = 0.5, cnt = [], balls = [], total = 0; const reset = () => { cnt = Array(n + 1).fill(0); balls = []; total = 0; };
      reset();
      const P = Q.plot(h, { aspect: 0.75, maxH: 560, draw: P => {
        const c = P.c, Hh = n * 0.9, top = n + 1 + Hh; P.xmin = -(n / 2 + 1); P.xmax = n / 2 + 1; P.ymin = 0; P.ymax = top; const ctx = P.ctx;
        for (let r = 0; r < n; r++) for (let j = 0; j <= r; j++) P.dot(j - r / 2, top - r - 0.6, c.muted, 2.5);
        const mx = Math.max(1, ...cnt), sc = Hh * 0.95 / mx;
        cnt.forEach((v, k) => P.rect(k - n / 2 - 0.4, 0, k - n / 2 + 0.4, v * sc, c.bF, c.b));
        if (total > 20) { const pmf = k => Q.comb(n, k) * p ** k * (1 - p) ** (n - k) * total * sc; ctx.strokeStyle = c.y; ctx.lineWidth = 2; ctx.beginPath(); for (let k = 0; k <= n; k++) { const x = P.X(k - n / 2), y = P.Y(pmf(k)); k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); ctx.fillStyle = c.y; ctx.fillRect(x - 2, y - 2, 4, 4); } ctx.stroke();
          const m = n * p, s = Math.sqrt(n * p * (1 - p)); P.fn(x => Q.normPdf(x + n / 2, m, s) * total * sc, c.p, 1.6, P.xmin, P.xmax, [5, 4]); }
        balls.forEach(b => { if (b.t < 0) return; const r = Math.floor(b.t), f = b.t - r, R = b.path.slice(0, r).reduce((a, v) => a + v, 0); const x0 = R - r / 2, x1 = x0 + (b.path[r] ? 0.5 : -0.5); const x = x0 + (x1 - x0) * f, y = top - r - 0.6 - f + Math.sin(f * Math.PI) * 0.35; P.dot(x, y, c.g, 4); });
        out.innerHTML = `B(${n}, ${p.toFixed(2)}) · 구슬 ${total}개<br><span class="y">E(X) = np = ${(n * p).toFixed(2)}</span>, V(X) = np(1 − p) = ${(n * p * (1 - p)).toFixed(2)} · 실제 평균 = ${total ? (cnt.reduce((a, v, k) => a + v * k, 0) / total).toFixed(2) : '-'}<br><span class="y">노란 꺾은선: 이항분포</span> · <span class="p">분홍 점선: 정규분포 N(np, npq)</span>`;
      } });
      const out = Q.readout(document.createElement('div'));
      const A = Q.anim(dt => { balls.forEach(b => b.t += dt * 9); balls = balls.filter(b => { if (b.t >= n) { cnt[b.path.reduce((a, v) => a + v, 0)]++; total++; return false; } return true; }); P.redraw(); if (!balls.length) return false; });
      const drop = k => { for (let i = 0; i < k; i++) balls.push({ t: -i * 0.18, path: Array.from({ length: n }, () => Math.random() < p ? 1 : 0) }); A.start(); };
      const instant = k => { for (let i = 0; i < k; i++) { let s = 0; for (let j = 0; j < n; j++) s += Math.random() < p; cnt[s]++; total++; } P.redraw(); };
      instant(500);
      const c = Q.ctrls(h);
      Q.button(c, '구슬 1개', () => drop(1), 'primary'); Q.button(c, '구슬 300개', () => drop(300));
      Q.button(c, '즉시 10000개', () => instant(10000));
      Q.button(c, '비우기', () => { reset(); P.redraw(); });
      Q.slider(c, { label: '줄 수 n', min: 3, max: 16, step: 1, value: 10, fmt: v => v }, v => { n = v; reset(); P.redraw(); });
      Q.slider(c, { label: '오른쪽 확률 p', min: 0.1, max: 0.9, step: 0.05, value: 0.5 }, v => { p = v; reset(); P.redraw(); });
      h.append(out);
    },
    guess: { q: '구슬이 $n$번 부딪힐 때 맨 오른쪽 칸에 들어갈 확률은? ($p=\\frac12$)', opts: ['$\\frac1n$', '$\\left(\\frac12\\right)^n$', '$\\frac12$'], ans: 1, why: T`$n$번 모두 오른쪽으로 가야 하니까 $\left(\frac12\right)^n$. 가운데 칸으로 가는 길은 $\C n{n/2}$가지로 아주 많아서 가운데가 높이 쌓여. 파스칼의 삼각형이 다시 나타난 거야.` },
    theorem: T`<h4>이항분포</h4><p>독립시행을 $n$번 할 때 사건이 일어나는 횟수 $X$의 확률분포:</p>$$P(X=r)=\C nr p^rq^{n-r}\quad(q=1-p)$$<p>$X\sim B(n,p)$로 써.</p><h4>평균과 분산</h4><p>$E(X)=np$, $V(X)=npq$, $\sigma(X)=\sqrt{npq}$</p><h4>근사</h4><p>$n$이 충분히 크면 $B(n,p)$는 정규분포 $N(np,npq)$에 가까워져.</p>`,
    proof: [T`$X=X_1+X_2+\cdots+X_n$으로 쪼개자. $X_i$는 $i$번째 시행에서 성공하면 1, 아니면 0이야.`, T`$E(X_i)=1\cdot p+0\cdot q=p$, $E(X_i^2)=p$이니까 $V(X_i)=p-p^2=pq$.`, T`기댓값은 항상 더할 수 있으니까 $E(X)=np$.`, T`$X_i$들이 독립이면 분산도 더해져서 $V(X)=npq$.`],
    exam: [T`$E(X)$, $V(X)$를 주고 $n,p$를 역으로 구하는 문제: $\frac VE=q$.`, T`$E(X^2)=V(X)+\{E(X)\}^2$를 이용하는 문제.`, T`$B(n,p)$를 정규분포로 근사해서 확률을 구하는 문제(표준정규분포표).`],
    probs: [
      { lv: 2, q: T`확률변수 $X$가 이항분포 $B\!\left(100,\frac15\right)$을 따를 때, $E(X)+V(X)$의 값을 구하시오.`, ans: 36, hints: [T`$np=20$, $npq=16$`], sol: T`$20+16=36$` },
      { lv: 3, q: T`이항분포 $B(n,p)$를 따르는 $X$의 평균이 $6$, 분산이 $4.2$일 때, $n$의 값을 구하시오.`, ans: 20, hints: [T`$q=\frac{4.2}{6}=0.7$`], sol: T`$p=0.3$, $n=6/0.3=20$` },
      { lv: 4, q: T`동전을 $n$번 던져 앞면이 나온 횟수를 $X$라 하자. $V(X)=5$일 때, $E(X^2)$의 값을 구하시오.`, ans: 105, hints: [T`$\frac n4=5$`, T`$E(X^2)=V(X)+\{E(X)\}^2$`], sol: T`$n=20$, $E(X)=10$, $E(X^2)=5+100=105$` }]
  },

  { id: 'pr-normal', title: '정규분포와 표준화', who: '카를 프리드리히 가우스', year: '1809',
    card: T`$X\sim N(m,\sigma^2)$이면 $Z=\dfrac{X-m}{\sigma}\sim N(0,1)$`,
    mystery: T`<p>가우스는 소행성 관측값의 오차가 종 모양으로 퍼진다는 걸 발견했어. 키, 시험 점수, 측정 오차처럼 수많은 작은 요인이 더해진 값은 모두 이 모양을 따라.</p><p>그런데 평균도 표준편차도 제각각인 수많은 종 모양에 대해 표를 전부 만들 수는 없잖아. 가우스의 해법은 모두를 <b>하나의 표준 종</b>으로 옮기는 거였어.</p>`,
    try: 'm과 σ를 바꾸면서 위의 칠한 넓이와 아래 Z로 옮긴 넓이가 항상 같다는 걸 확인해.',
    sim(h, Q) {
      let m = 60, s = 10, a = 60, b = 80;
      const top = Q.plot(h, { xmin: 10, xmax: 110, ymin: -0.004, ymax: 0.085, aspect: 0.36, draw: P => { const c = P.c; P.grid({ sy: 0.02 }); P.between(x => Q.normPdf(x, m, s), () => 0, Math.max(a, P.xmin), Math.min(b, P.xmax), c.yF); P.fn(x => Q.normPdf(x, m, s), c.b, 2.5); P.vline(m, c.muted); P.text(P.xmin, P.ymax, `X ~ N(${m}, ${s}²)`, c.b, 'left', 8, 22); } });
      const bot = Q.plot(h, { xmin: -4, xmax: 4, ymin: -0.02, ymax: 0.45, aspect: 0.32, draw: P => { const c = P.c; P.grid({ sy: 0.1 }); const za = (a - m) / s, zb = (b - m) / s; P.between(x => Q.normPdf(x), () => 0, Math.max(za, -4), Math.min(zb, 4), c.yF); P.fn(x => Q.normPdf(x), c.p, 2.5); P.text(P.xmin, P.ymax, 'Z ~ N(0, 1)', c.p, 'left', 8, 22); } });
      const out = Q.readout(h);
      const upd = () => { top.redraw(); bot.redraw(); const za = (a - m) / s, zb = (b - m) / s; out.innerHTML = `P(${a} ≤ X ≤ ${b}) = P(${za.toFixed(2)} ≤ Z ≤ ${zb.toFixed(2)}) = <span class="y">${(Q.Phi(zb) - Q.Phi(za)).toFixed(4)}</span><br>표준정규분포표: P(0 ≤ Z ≤ 1) = 0.3413 · P(0 ≤ Z ≤ 2) = 0.4772 · P(0 ≤ Z ≤ 3) = 0.4987`; };
      const c = Q.ctrls(h);
      Q.slider(c, { label: '평균 m', min: 30, max: 90, step: 1, value: 60, fmt: v => v }, v => { m = v; upd(); });
      Q.slider(c, { label: '표준편차 σ', min: 4, max: 20, step: 1, value: 10, fmt: v => v }, v => { s = v; upd(); });
      Q.slider(c, { label: '구간 시작 a', min: 10, max: 110, step: 1, value: 60, fmt: v => v }, v => { a = Math.min(v, b); upd(); });
      Q.slider(c, { label: '구간 끝 b', min: 10, max: 110, step: 1, value: 80, fmt: v => v }, v => { b = Math.max(v, a); upd(); });
      requestAnimationFrame(upd);
    },
    guess: { q: '평균은 그대로 두고 σ를 2배로 키우면 정규분포 곡선은?', opts: ['더 뾰족하고 높아진다', '더 납작하고 넓게 퍼진다', '오른쪽으로 이동한다'], ans: 1, why: '전체 넓이는 항상 1이니까 옆으로 퍼지면 높이는 낮아져야 해. 최댓값은 1/(σ√2π)이라서 σ가 2배면 높이는 절반이야.' },
    theorem: T`<h4>정규분포 $N(m,\sigma^2)$의 성질</h4><p>곡선은 $x=m$에 대해 대칭이고, $x=m$에서 최대야. 곡선과 $x$축 사이의 넓이는 1.</p><p>$m$이 바뀌면 평행이동, $\sigma$가 커지면 낮고 넓게 퍼져.</p><h4>표준화</h4>$$Z=\frac{X-m}{\sigma}\sim N(0,1)$$$$P(a\le X\le b)=P\!\left(\frac{a-m}{\sigma}\le Z\le\frac{b-m}{\sigma}\right)$$<p>$m\pm\sigma$ 안에 약 68%, $m\pm2\sigma$ 안에 약 95%, $m\pm3\sigma$ 안에 약 99.7%가 들어가.</p>`,
    proof: [T`$E(Z)=E\!\left(\frac{X-m}{\sigma}\right)=\frac{E(X)-m}{\sigma}=0$`, T`$V(Z)=\frac{1}{\sigma^2}V(X)=1$`, T`정규분포를 일차식으로 변환해도 정규분포라서 $Z\sim N(0,1)$.`],
    exam: [T`$P(X\ge a)$: $0.5-P(0\le Z\le z)$ 꼴로 바꾸는 계산이 기본이야.`, T`"두 정규분포의 확률이 같다" ⇔ 표준화한 $z$값이 같거나 부호만 반대.`, T`$f(x)$가 정규분포 곡선일 때 대칭축을 이용하는 문제: $P(X\le m-k)=P(X\ge m+k)$.`],
    probs: [
      { lv: 2, q: T`$X\sim N(50,4^2)$일 때, $P(X\ge58)$의 값은? (단, $P(0\le Z\le2)=0.4772$)`, opts: ['0.0228', '0.0668', '0.1587', '0.3085', '0.4772'], ans: 0, hints: [T`$Z=\frac{58-50}{4}=2$`], sol: T`$0.5-0.4772=0.0228$` },
      { lv: 3, q: T`$X\sim N(m,5^2)$이고 $P(X\le60)=0.8413$일 때, $m$의 값을 구하시오. (단, $P(0\le Z\le1)=0.3413$)`, ans: 55, hints: [T`$0.8413=0.5+0.3413$이니까 $z=1$`], sol: T`$\frac{60-m}5=1$, $m=55$` },
      { lv: 4, q: T`$X\sim N(10,2^2)$, $Y\sim N(16,\sigma^2)$이고 $P(X\ge12)=P(Y\le10)$일 때, 양수 $\sigma$의 값을 구하시오.`, ans: 6, hints: [T`$P(X\ge12)=P(Z\ge1)$`, T`$P(Y\le10)=P\!\left(Z\le-\frac6\sigma\right)=P\!\left(Z\ge\frac6\sigma\right)$`], sol: T`$\frac6\sigma=1$, $\sigma=6$` }]
  },

  { id: 'pr-sample', title: '표본평균의 분포', who: '피에르시몽 라플라스', year: '1810',
    card: T`$E(\overline X)=m$, $V(\overline X)=\dfrac{\sigma^2}{n}$, $\sigma(\overline X)=\dfrac{\sigma}{\sqrt n}$`,
    mystery: T`<p>모집단이 종 모양이 아니어도 될까? 주사위 눈처럼 평평하거나, 한쪽으로 치우쳐 있거나, 봉우리가 두 개여도?</p><p>라플라스는 놀라운 걸 증명했어. 어떤 분포든 표본을 여러 개 뽑아 <b>평균</b>을 내면, 그 평균들은 정규분포를 따르게 돼. 이것이 중심극한정리야.</p>`,
    try: '모집단을 바꿔 가며 표본 1000개씩 뽑아 봐. n을 1에서 30으로 키우면 히스토그램 모양이 어떻게 변해?',
    sim(h, Q) {
      const pops = [{ n: '주사위 (균등)', v: [1, 2, 3, 4, 5, 6], p: [1, 1, 1, 1, 1, 1] }, { n: '한쪽으로 치우침', v: [1, 2, 3, 4, 5, 6], p: [10, 6, 3, 2, 1, 1] }, { n: '봉우리 두 개', v: [1, 2, 3, 4, 5, 6], p: [6, 2, 0.3, 0.3, 2, 6] }];
      let k = 0, n = 4, means = [];
      const st = () => { const F = pops[k], s = F.p.reduce((a, b) => a + b, 0), p = F.p.map(x => x / s), m = F.v.reduce((a, x, i) => a + x * p[i], 0), v = F.v.reduce((a, x, i) => a + (x - m) ** 2 * p[i], 0); return { p, m, sd: Math.sqrt(v) }; };
      const draw1 = () => { const { p } = st(), u = Math.random(); let acc = 0; for (let i = 0; i < 6; i++) { acc += p[i]; if (u < acc) return i + 1; } return 6; };
      const pop = Q.plot(h, { xmin: 0.3, xmax: 6.7, ymin: 0, ymax: 0.5, aspect: 0.2, draw: P => { const c = P.c; P.grid({ sy: 0.25 }); bars(P, [1, 2, 3, 4, 5, 6], st().p, c.gF, 0.7, c.g); P.text(P.xmin, P.ymax, '모집단', c.g, 'left', 8, 20); } });
      const hist = Q.plot(h, { xmin: 0.5, xmax: 6.5, ymin: 0, ymax: 1, aspect: 0.42, draw: P => {
        const c = P.c, { m, sd } = st(), bw = 1 / Math.max(2, Math.min(12, n * 1.5)), bins = {};
        means.forEach(x => { const b = Math.floor((x - 0.5) / bw); bins[b] = (bins[b] || 0) + 1; });
        const dens = Object.entries(bins).map(([b, v]) => [0.5 + (+b + 0.5) * bw, v / means.length / bw]), se = sd / Math.sqrt(n);
        P.ymax = Math.max(Q.normPdf(m, m, se) * 1.15, ...dens.map(d => d[1] * 1.1), 0.3); P.grid({ sy: P.ymax > 1 ? 0.5 : 0.2 });
        dens.forEach(([x, d]) => P.rect(x - bw / 2, 0, x + bw / 2, d, c.bF, c.b));
        if (means.length) P.fn(x => Q.normPdf(x, m, se), c.p, 2.2); P.vline(m, c.y);
        const mm = means.reduce((a, b) => a + b, 0) / (means.length || 1), ss = Math.sqrt(means.reduce((a, b) => a + (b - mm) ** 2, 0) / (means.length || 1));
        out.innerHTML = `모집단: m = ${m.toFixed(3)}, σ = ${sd.toFixed(3)} · 표본 크기 n = ${n} · 뽑은 표본 ${means.length}개<br>표본평균들의 평균 = <span class="y">${means.length ? mm.toFixed(3) : '-'}</span> (이론값 m = ${m.toFixed(3)})<br>표본평균들의 표준편차 = <span class="b">${means.length ? ss.toFixed(3) : '-'}</span> (이론값 σ/√n = ${se.toFixed(3)}) · <span class="p">분홍: N(m, σ²/n)</span>`;
      } });
      const out = Q.readout(h);
      const sample = t => { for (let j = 0; j < t; j++) { let s = 0; for (let i = 0; i < n; i++) s += draw1(); means.push(s / n); } hist.redraw(); };
      const c = Q.ctrls(h);
      Q.select(c, '모집단', pops.map(p => p.n), v => { k = v; means = []; pop.redraw(); hist.redraw(); });
      Q.slider(c, { label: '표본 크기 n', min: 1, max: 40, step: 1, value: 4, fmt: v => v }, v => { n = v; means = []; hist.redraw(); });
      Q.button(c, '표본 1개 뽑기', () => sample(1), 'primary'); Q.button(c, '1000개', () => sample(1000)); Q.button(c, '지우기', () => { means = []; hist.redraw(); });
      requestAnimationFrame(() => sample(0));
    },
    guess: { q: '표본 크기 $n$을 4배로 늘리면 표본평균의 표준편차는?', opts: ['4배', '절반', '1/4', '그대로'], ans: 1, why: T`$\sigma(\overline X)=\frac{\sigma}{\sqrt n}$이라서 $\sqrt4=2$배로 나눠져. 정밀도를 2배로 높이려면 표본이 4배 필요해.` },
    theorem: T`<h4>표본평균의 분포</h4><p>평균 $m$, 표준편차 $\sigma$인 모집단에서 크기 $n$인 표본을 임의추출할 때:</p>$$E(\overline X)=m,\quad V(\overline X)=\frac{\sigma^2}{n},\quad\sigma(\overline X)=\frac{\sigma}{\sqrt n}$$<p>모집단이 정규분포 $N(m,\sigma^2)$이면 $\overline X\sim N\!\left(m,\frac{\sigma^2}{n}\right)$.</p><p>모집단이 정규분포가 아니어도 $n$이 충분히 크면 $\overline X$는 근사적으로 $N\!\left(m,\frac{\sigma^2}n\right)$을 따라(중심극한정리).</p>`,
    proof: [T`$\overline X=\frac1n(X_1+\cdots+X_n)$이고 각 $X_i$는 평균 $m$, 분산 $\sigma^2$.`, T`$E(\overline X)=\frac1n\cdot nm=m$`, T`$X_i$가 독립이면 분산이 더해져서 $V(X_1+\cdots+X_n)=n\sigma^2$.`, T`$V(\overline X)=\frac1{n^2}\cdot n\sigma^2=\frac{\sigma^2}{n}$`],
    exam: [T`모집단의 확률분포표를 주고 $E(\overline X)$, $V(\overline X)$를 묻는 문제.`, T`$\overline X$를 표준화: $Z=\dfrac{\overline X-m}{\sigma/\sqrt n}$. 분모를 $\sigma$로 쓰는 실수가 가장 흔해.`],
    probs: [
      { lv: 2, q: T`모집단 $N(m,12^2)$에서 크기 $36$인 표본을 임의추출할 때, 표본평균 $\overline X$의 표준편차를 구하시오.`, ans: 2, hints: [T`$\frac{12}{\sqrt{36}}$`], sol: '2' },
      { lv: 3, q: T`모평균 $20$, 모표준편차 $4$인 정규분포를 따르는 모집단에서 크기 $16$인 표본을 임의추출할 때, $P(\overline X\ge22)$의 값은? (단, $P(0\le Z\le2)=0.4772$)`, opts: ['0.0228', '0.1587', '0.3085', '0.4772', '0.9772'], ans: 0, hints: [T`$\overline X\sim N(20,1^2)$`], sol: T`$Z=2$, $0.5-0.4772=0.0228$` },
      { lv: 4, q: T`모집단의 확률변수 $X$가 $0,2,4$의 값을 각각 확률 $\frac13$로 가진다. 이 모집단에서 크기 $4$인 표본을 임의추출할 때, $V(\overline X)$는?`, opts: [frac(1, 3), frac(2, 3), '1', frac(4, 3), frac(8, 3)], ans: 1, hints: [T`$E(X)=2$, $V(X)=\frac{4+0+4}{3}$`], sol: T`$V(X)=\frac83$, $V(\overline X)=\frac{8/3}{4}=\frac23$` }]
  },

  { id: 'pr-ci', title: '모평균의 추정', who: '윌리엄 실리 고셋 · 예르지 네이만', year: '1908 · 1937',
    card: T`신뢰도 95%의 신뢰구간: $\overline x-1.96\dfrac{\sigma}{\sqrt n}\le m\le\overline x+1.96\dfrac{\sigma}{\sqrt n}$`,
    mystery: T`<p>고셋은 기네스 맥주 공장의 화학자였어. 보리 품질을 확인하려고 맥주를 전부 검사할 수는 없으니까 일부만 표본으로 뽑아 전체를 추정해야 했지. 회사가 비밀을 지키라고 해서 "Student"라는 가명으로 논문을 냈어.</p><p>"95% 신뢰구간"이라는 말을 많이 듣지? 그런데 정확히 <b>무엇이</b> 95%라는 걸까?</p>`,
    try: '"구간 100개 만들기"를 여러 번 눌러 봐. 진짜 평균(노란 세로선)을 놓친 빨간 구간이 몇 개인지 세어 봐.',
    sim(h, Q) {
      const m = 50, s = 10; let n = 25, z = 1.96, ivs = [];
      const P = Q.plot(h, { xmin: 38, xmax: 62, ymin: 0, ymax: 101, aspect: 0.75, maxH: 560, draw: P => {
        const c = P.c; P.grid({ sy: 20, labels: true }); P.vline(m, c.y, [], 2.5);
        ivs.forEach(([lo, hi, x], i) => { const ok = lo <= m && m <= hi; P.seg(lo, i + 1, hi, i + 1, ok ? c.g : c.r, ok ? 1.6 : 2.6); P.dot(x, i + 1, ok ? c.g : c.r, 2); });
        const miss = ivs.filter(([lo, hi]) => lo > m || hi < m).length;
        out.innerHTML = `모집단 N(50, 10²) · 표본 크기 n = ${n} · 신뢰도 ${z === 1.96 ? '95' : '99'}%<br>구간 길이 = 2 × ${z} × σ/√n = <span class="b">${(2 * z * s / Math.sqrt(n)).toFixed(3)}</span><br>${ivs.length ? `100개 중 <span class="g">m을 포함: ${100 - miss}개</span>, <span class="r">놓침: ${miss}개</span>` : ''}`;
      } });
      const out = Q.readout(document.createElement('div'));
      const make = () => { ivs = []; const e = z * s / Math.sqrt(n); for (let i = 0; i < 100; i++) { let t = 0; for (let j = 0; j < n; j++) t += m + s * Q.randn(); const x = t / n; ivs.push([x - e, x + e, x]); } P.redraw(); };
      const c = Q.ctrls(h);
      Q.button(c, '구간 100개 만들기', make, 'primary');
      Q.slider(c, { label: '표본 크기 n', min: 4, max: 100, step: 1, value: 25, fmt: v => v }, v => { n = v; make(); });
      Q.select(c, '신뢰도', ['95% (z = 1.96)', '99% (z = 2.58)'], v => { z = v ? 2.58 : 1.96; make(); });
      h.append(out); requestAnimationFrame(make);
      Q.note(h, '진짜 평균 m은 고정된 값이고, 표본마다 움직이는 건 구간이야. 95%는 "이런 방법으로 만든 구간 100개 중 약 95개가 m을 품는다"는 뜻이야.');
    },
    guess: { q: '"모평균의 95% 신뢰구간이 [48, 52]이다"의 올바른 해석은?', opts: ['m이 [48, 52]에 있을 확률이 95%이다', '같은 방법으로 구간을 많이 만들면 그중 약 95%가 m을 포함한다', '표본의 95%가 [48, 52] 안에 있다'], ans: 1, why: '이미 만들어진 구간 [48, 52]는 m을 포함하거나 포함하지 않거나 둘 중 하나야. 95%는 구간을 만드는 "방법"의 성공률이야. 위 실험의 빨간 구간들이 그 5%야.' },
    theorem: T`<h4>모평균의 신뢰구간</h4><p>정규분포 $N(m,\sigma^2)$을 따르는 모집단에서 크기 $n$인 표본의 표본평균이 $\overline x$일 때:</p><p>신뢰도 95%: $\overline x-1.96\dfrac{\sigma}{\sqrt n}\le m\le\overline x+1.96\dfrac{\sigma}{\sqrt n}$</p><p>신뢰도 99%: $\overline x-2.58\dfrac{\sigma}{\sqrt n}\le m\le\overline x+2.58\dfrac{\sigma}{\sqrt n}$</p><h4>신뢰구간의 길이</h4><p>$2k\dfrac{\sigma}{\sqrt n}$ ($k=1.96$ 또는 $2.58$). 신뢰도를 높이면 길어지고, $n$을 늘리면 짧아져.</p>`,
    proof: [T`$\overline X\sim N\!\left(m,\frac{\sigma^2}n\right)$이니까 $P\!\left(-1.96\le\dfrac{\overline X-m}{\sigma/\sqrt n}\le1.96\right)=0.95$.`, T`괄호 안의 부등식을 $m$에 대해 정리하면 $\overline X-1.96\frac{\sigma}{\sqrt n}\le m\le\overline X+1.96\frac{\sigma}{\sqrt n}$.`, T`$\overline X$는 표본마다 바뀌는 확률변수야. 그러니까 "구간이 $m$을 포함할 확률"이 0.95인 거야.`],
    exam: [T`신뢰구간의 양 끝을 주고 $\overline x$와 $\sigma$, $n$을 역으로 구하는 문제: 중점 $=\overline x$, 반길이 $=k\frac{\sigma}{\sqrt n}$.`, T`"길이가 $L$ 이하가 되도록 하는 $n$의 최솟값": 부등식을 풀고 올림해.`, T`두 신뢰구간의 길이 비교: $\frac{k}{\sqrt n}$의 비.`],
    probs: [
      { lv: 2, q: T`모표준편차가 $8$인 정규분포를 따르는 모집단에서 크기 $64$인 표본을 임의추출하여 얻은 표본평균이 $100$이다. 모평균 $m$에 대한 신뢰도 95%의 신뢰구간의 길이를 구하시오.`, ans: 3.92, hints: [T`$\frac{\sigma}{\sqrt n}=1$`], sol: T`$2\times1.96\times1=3.92$` },
      { lv: 3, q: '같은 모집단, 같은 신뢰도에서 신뢰구간의 길이를 절반으로 줄이려면 표본의 크기를 몇 배로 해야 하는가?', ans: 4, hints: [T`길이 $\propto\frac1{\sqrt n}$`], sol: '√n이 2배여야 하니까 n은 4배.' },
      { lv: 4, q: T`모표준편차가 $10$인 정규분포를 따르는 모집단에서 모평균에 대한 신뢰도 95%의 신뢰구간의 길이가 $2$ 이하가 되도록 하는 표본 크기 $n$의 최솟값을 구하시오.`, ans: 385, hints: [T`$2\times1.96\times\frac{10}{\sqrt n}\le2$`, T`$\sqrt n\ge19.6$`], sol: T`$n\ge384.16$이니까 최솟값은 $385$.` }]
  }]}]
});
})();
