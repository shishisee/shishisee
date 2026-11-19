/* 미적분 Ⅱ — 수열의 극한 · 미분법 · 적분법 (2022 개정: 진로 선택, 수능 범위 밖) */
(() => {
const frac = (a, b) => `$\\frac{${a}}{${b}}$`;
QED.subject({
  id: 'c2', name: '미적분 Ⅱ', short: '미적분Ⅱ', color: '--pink', exam: false,
  sub: '무한, e, 삼각함수의 미적분. 이공계 대학 수학의 문 앞까지',
  units: [
  { name: '수열의 극한', rooms: [

  { id: 'c2-seq', title: '수열의 극한', who: '오귀스탱 루이 코시', year: '1821',
    card: T`$-1\lt r\le1$일 때만 $\{r^n\}$이 수렴한다 ($|r|<1$이면 $0$, $r=1$이면 $1$)`,
    mystery: T`<p>$0.9,\ 0.99,\ 0.999,\ \ldots$는 1이 될까? 끝없이 이어지는 수의 행렬이 어딘가에 "도착"한다는 건 무슨 뜻일까?</p><p>수열의 극한은 함수의 극한보다 더 단순해. $n$이 1, 2, 3, …으로 커질 때 항들이 어떤 값 근처의 <b>띠</b> 안으로 들어와서 다시는 나가지 않으면 돼.</p>`,
    try: '수열을 고르고 띠 폭 ε을 줄여 봐. 띠에 갇히기 시작하는 번호 N이 커지지만, 수렴하는 수열이면 언제나 존재해.',
    sim(h, Q) {
      const ss = [{ n: '(2n + 1)/(n + 3) → 2', a: n => (2 * n + 1) / (n + 3), L: 2 }, { n: '(−1)ⁿ / n → 0', a: n => (-1) ** n / n, L: 0 }, { n: 'rⁿ (r 조절)', a: null, L: null }, { n: '(−1)ⁿ: 진동 · 발산', a: n => (-1) ** n, L: null }];
      let k = 0, eps = 0.2, r = 0.8; const out = Q.readout(document.createElement('div'));
      const P = Q.plot(h, { xmin: 0, xmax: 41, ymin: -1.5, ymax: 2.6, draw: P => {
        const S = ss[k], c = P.c, a = S.a || (n => r ** n), L = k === 2 ? (Math.abs(r) < 1 ? 0 : r === 1 ? 1 : null) : S.L;
        const vals = Array.from({ length: 40 }, (_, i) => a(i + 1)), fin = vals.filter(v => isFinite(v) && Math.abs(v) < 50);
        P.ymin = Math.min(-1.2, ...fin) - 0.2; P.ymax = Math.max(1.2, ...fin) + 0.3; P.grid({ sx: 5 });
        let N = null; if (L !== null) { P.rect(0, L - eps, 41, L + eps, c.yF); P.hline(L, c.y, [6, 4]); for (let n = 40; n >= 1; n--) if (Math.abs(vals[n - 1] - L) >= eps) { N = n + 1; break; } if (N === null) N = 1; }
        vals.forEach((v, i) => { if (Math.abs(v) < 50) P.dot(i + 1, v, L !== null && i + 1 >= N ? c.g : c.b, 4); });
        out.innerHTML = L !== null ? `극한값 L = ${L} · 띠 |aₙ − L| < <span class="y">${eps.toFixed(3)}</span><br><span class="g">n ≥ ${N}이면 모든 항이 띠 안에 있다</span> (화면의 40항까지 확인)` : `<span class="r">어떤 값으로도 모이지 않아. 발산.</span>${k === 2 ? ` r = ${r.toFixed(2)}: ${r > 1 ? '양의 무한대로' : '진동하며 발산'}` : ' 1과 −1 사이를 영원히 오가.'}`;
      } });
      const c = Q.ctrls(h);
      Q.select(c, '수열', ss.map(s => s.n), v => { k = v; sr.el.closest('label').hidden = v !== 2; P.redraw(); });
      Q.slider(c, { label: '띠 폭 ε', min: -2.5, max: 0, step: 0.01, value: Math.log10(0.2), fmt: v => (10 ** v).toPrecision(2) }, v => { eps = 10 ** v; P.redraw(); });
      const sr = Q.slider(c, { label: 'r', min: -1.3, max: 1.3, step: 0.01, value: 0.8 }, v => { r = Math.round(v * 100) / 100; P.redraw(); });
      sr.el.closest('label').hidden = true; h.append(out);
    },
    guess: { q: '$\\{r^n\\}$이 수렴하는 $r$의 범위는?', opts: ['$-1\\lt r<1$', '$-1\\lt r\\le1$', '$-1\\le r\\le1$', '$r<1$'], ans: 1, why: T`$r=1$이면 $1,1,1,\ldots$로 1에 수렴하고, $r=-1$이면 $-1,1,-1,\ldots$로 진동해. $|r|<1$이면 계속 줄어들어 0으로 가.` },
    theorem: T`<h4>수렴과 발산</h4><p>$n$이 한없이 커질 때 $a_n$이 일정한 값 $\alpha$에 한없이 가까워지면 $\displaystyle\lim_{n\to\infty}a_n=\alpha$. 그렇지 않으면 발산(양의 무한대, 음의 무한대, 진동)이야.</p><h4>등비수열 $\{r^n\}$</h4><p>$r>1$: 발산($\infty$), $r=1$: 1에 수렴, $|r|<1$: 0에 수렴, $r\le-1$: 진동</p><h4>계산 요령</h4><p>$\frac\infty\infty$ 꼴은 분모의 최고차항으로 나누고, $\infty-\infty$ 꼴은 유리화하고, 지수 꼴은 밑이 가장 큰 항으로 나눠.</p>`,
    proof: [T`$0\lt r<1$이면 $\frac1r=1+h\ (h>0)$로 쓸 수 있어.`, T`이항정리로 $(1+h)^n\ge1+nh$.`, T`그러니까 $0\lt r^n\le\dfrac{1}{1+nh}\to0$.`, T`샌드위치로 $r^n\to0$. $-1\lt r<0$이면 $|r^n|=|r|^n\to0$.`],
    exam: [T`$\displaystyle\lim\frac{3^{n+1}+2^n}{3^n-2^n}$: 분자·분모를 $3^n$으로 나눠.`, T`$\left\{\left(\frac{x-1}{2}\right)^n\right\}$이 수렴하는 $x$: $-1<\frac{x-1}{2}\le1$.`, T`$f(x)=\displaystyle\lim_{n\to\infty}\frac{x^{n+1}+1}{x^n+1}$ 꼴 함수: $|x|<1$, $x=1$, $|x|>1$, $x=-1$로 나눠서 그래프를 그려.`],
    probs: [
      { lv: 2, q: T`$\displaystyle\lim_{n\to\infty}\frac{3n^2+n}{n^2+2}$의 값을 구하시오.`, ans: 3, hints: [T`$n^2$으로 나눠.`], sol: '3' },
      { lv: 3, q: T`$\displaystyle\lim_{n\to\infty}\left(\sqrt{n^2+4n}-n\right)$의 값을 구하시오.`, ans: 2, hints: ['유리화'], sol: T`$\dfrac{4n}{\sqrt{n^2+4n}+n}\to\dfrac42=2$` },
      { lv: 3, q: T`$\displaystyle\lim_{n\to\infty}\frac{3^{n+1}+2^n}{3^n-2^n}$의 값을 구하시오.`, ans: 3, hints: [T`$3^n$으로 나누면 $\dfrac{3+(2/3)^n}{1-(2/3)^n}$`], sol: '3' },
      { lv: 4, q: T`등비수열 $\left\{\left(\dfrac{x-1}{2}\right)^n\right\}$이 수렴하도록 하는 정수 $x$의 개수를 구하시오.`, ans: 4, hints: [T`$-1<\frac{x-1}2\le1$`], sol: T`$-1\lt x\le3$, 정수 $0,1,2,3$으로 4개.` }]
  },

  { id: 'c2-series', title: '급수: 무한히 더하기', who: '엘레아의 제논 · 레온하르트 오일러', year: '기원전 450 · 1734',
    card: T`$\sum a_n$이 수렴하면 $\lim a_n=0$. 역은 거짓 (조화급수 $\sum\frac1n=\infty$)`,
    mystery: T`<p>제논은 말했어. "아킬레스가 거북이가 있던 곳에 가면 거북이는 조금 앞에 가 있다. 거기 가면 또 조금 앞에 가 있다. 그러니 영원히 못 따라잡는다!" 무한히 많은 걸 더하면 무한대가 될까?</p><p>그리고 $1+\frac12+\frac13+\frac14+\cdots$는? 더하는 수가 0으로 가니까 언젠가 멈출 것 같지? 2000년 뒤 오일러는 $1+\frac14+\frac19+\cdots=\frac{\pi^2}{6}$을 알아냈어. 원도 없는데 $\pi$가 나온 거야.</p>`,
    try: '급수를 바꿔 가며 N을 끝까지 키워 봐. 조화급수의 부분합은 언젠가 멈출까?',
    sim(h, Q) {
      const ss = [{ n: '제논: ½ + ¼ + ⅛ + … ', a: k => 0.5 ** k, S: 1, s: '1' }, { n: '조화급수 1 + ½ + ⅓ + …', a: k => 1 / k, S: null }, { n: '바젤 문제 1 + ¼ + 1/9 + …', a: k => 1 / (k * k), S: Math.PI ** 2 / 6, s: 'π²/6 ≈ 1.6449' }, { n: '교대 1 − ½ + ⅓ − …', a: k => (k % 2 ? 1 : -1) / k, S: Math.LN2, s: 'ln 2 ≈ 0.6931' }];
      let k = 0, N = 10; const out = Q.readout(document.createElement('div'));
      const P = Q.plot(h, { draw: P => {
        const S = ss[k], c = P.c; let s = 0; const ps = []; for (let i = 1; i <= N; i++) { s += S.a(i); ps.push(s); }
        P.xmin = 0; P.xmax = N + 1; P.ymin = Math.min(0, ...ps) - 0.1; P.ymax = Math.max(S.S ? S.S * 1.25 : 0, ...ps) * 1.08 + 0.1; P.grid();
        if (S.S) P.hline(S.S, c.y, [6, 4], 1.8);
        const step = Math.max(1, Math.floor(N / 400)); for (let i = 0; i < N; i += step) P.dot(i + 1, ps[i], c.b, N > 200 ? 1.6 : 3.5);
        out.innerHTML = `부분합 S<sub>${N}</sub> = <span class="b">${s.toFixed(6)}</span> · 마지막에 더한 항 a<sub>${N}</sub> = ${S.a(N).toExponential(2)}<br>${S.S ? `<span class="y">수렴: 합 = ${S.s}</span> · 남은 차이 ${Math.abs(S.S - s).toExponential(2)}` : `<span class="r">발산!</span> 더하는 수가 0으로 가는데도 느리게 끝없이 커져. S<sub>N</sub> ≈ ln N + 0.5772 = ${(Math.log(N) + 0.5772).toFixed(4)}`}`;
      } });
      const c = Q.ctrls(h);
      Q.select(c, '급수', ss.map(s => s.n), v => { k = v; P.redraw(); });
      Q.slider(c, { label: '항의 개수 N', min: 0, max: 5, step: 0.01, value: 1, fmt: v => Math.round(10 ** v) }, v => { N = Math.round(10 ** v); P.redraw(); });
      h.append(out); Q.note(h, '조화급수는 100000항을 더해도 겨우 12 정도야. 그래도 언젠가는 어떤 수든 넘어서.');
    },
    guess: { q: '$\\lim a_n=0$이면 $\\sum a_n$은 반드시 수렴할까?', opts: ['그렇다', '아니다. 조화급수가 반례다'], ans: 1, why: T`$\frac13+\frac14>\frac12$, $\frac15+\cdots+\frac18>\frac12$, … 이렇게 묶으면 $\frac12$ 묶음이 끝없이 생겨. 항이 0으로 가는 것만으로는 부족하고 충분히 <b>빨리</b> 0으로 가야 해.` },
    theorem: T`<h4>급수의 수렴</h4><p>부분합 $S_n=a_1+\cdots+a_n$에 대하여 $\lim S_n=S$이면 급수 $\sum a_n$은 $S$로 수렴해.</p><h4>수렴의 필요조건</h4><p>$\sum a_n$이 수렴하면 $\lim a_n=0$. 대우: $\lim a_n\ne0$이면 발산.</p><h4>망원 급수</h4><p>$\displaystyle\sum\frac{1}{k(k+1)}=\sum\left(\frac1k-\frac1{k+1}\right)$: 이웃한 항이 서로 지워져서 첫 항과 끝 항만 남아.</p>`,
    proof: [T`$\sum a_n=S$이면 $S_n\to S$이고 $S_{n-1}\to S$.`, T`$a_n=S_n-S_{n-1}\to S-S=0$.`, T`조화급수: $S_{2^m}\ge1+\frac m2$ (묶음마다 $\frac12$ 이상).`, T`$m\to\infty$이면 $S_{2^m}\to\infty$. 발산.`],
    exam: [T`부분분수로 쪼개는 망원 급수. 남는 항이 몇 개인지 꼭 확인해(간격이 2면 앞뒤로 두 개씩).`, T`"$\sum(a_n-3)$이 수렴할 때 $\lim a_n$" → 수렴하면 일반항은 0으로 가니까 $a_n\to3$.`, T`$S_n$이 주어지면 $a_n=S_n-S_{n-1}$로 일반항을 구해.`],
    probs: [
      { lv: 2, q: T`$\displaystyle\sum_{k=1}^{\infty}\frac{1}{k(k+1)}$의 값을 구하시오.`, ans: 1, hints: [T`$\frac1k-\frac1{k+1}$`], sol: T`$S_n=1-\frac1{n+1}\to1$` },
      { lv: 3, q: T`수열 $\{a_n\}$에 대하여 $\displaystyle\sum_{n=1}^\infty(a_n-3)$이 수렴할 때, $\displaystyle\lim_{n\to\infty}(2a_n+1)$의 값을 구하시오.`, ans: 7, hints: [T`$a_n-3\to0$`], sol: T`$a_n\to3$, $2\cdot3+1=7$` },
      { lv: 4, q: T`$\displaystyle\sum_{n=1}^{\infty}\frac{1}{n(n+2)}$의 값은?`, opts: [frac(1, 2), frac(2, 3), frac(3, 4), '1', frac(3, 2)], ans: 2, hints: [T`$\frac12\left(\frac1n-\frac1{n+2}\right)$`, '앞에서 1과 1/2이 남아.'], sol: T`$\frac12\left(1+\frac12\right)=\frac34$` }]
  },

  { id: 'c2-geoseries', title: '등비급수와 무한히 반복되는 도형', who: '아르키메데스 · 니콜 오렘', year: '기원전 250 · 1350',
    card: T`$|r|<1$이면 $\displaystyle\sum_{n=1}^{\infty}ar^{n-1}=\frac{a}{1-r}$`,
    mystery: T`<p>정사각형 안에 변의 중점을 이은 정사각형을 그리고, 또 그 안에 그리고… 무한히 반복하면서 매번 일부를 칠해. 칠한 부분의 넓이를 모두 더하면 얼마일까?</p><p>수능 미적분에서 몇 년 동안 빠짐없이 나왔던 "무한히 반복되는 도형" 문제야. 핵심은 딱 두 가지, <b>첫째항</b>과 <b>닮음비</b>야.</p>`,
    try: '단계를 하나씩 늘려 봐. 칠한 넓이의 합이 어떤 값에 가까워지는지, 그리고 그 값이 a/(1 − r)과 같은지 확인해.',
    sim(h, Q) {
      let mode = 0, K = 1; const out = Q.readout(document.createElement('div'));
      const P = Q.plot(h, { aspect: 0.6, draw: P => {
        const c = P.c, ctx = P.ctx, r = P.w / P.h; P.ymin = -0.08; P.ymax = 1.08; P.xmin = 0.5 - 0.58 * r; P.xmax = 0.5 + 0.58 * r;
        const poly = (pts, fill, stroke) => { ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(P.X(x), P.Y(y)) : ctx.moveTo(P.X(x), P.Y(y))); ctx.closePath(); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1.3; ctx.stroke(); } };
        let sum = 0, a, rr;
        if (mode === 0) { a = 0.25; rr = 0.5; let sq = [[0, 0], [1, 0], [1, 1], [0, 1]];
          for (let k = 0; k < K; k++) { const m = sq.map((p, i) => [(p[0] + sq[(i + 1) % 4][0]) / 2, (p[1] + sq[(i + 1) % 4][1]) / 2]); poly(sq, null, c.muted);
            poly([sq[0], m[0], m[3]], c.p); poly([sq[2], m[2], m[1]], c.p); sum += a * rr ** k; sq = m; } poly(sq, null, c.muted);
        } else { a = 0.25; rr = 0.75; const tri = (A, B, C, d) => { if (d === 0) { poly([A, B, C], c.bF, c.b); return; } const ab = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2], bc = [(B[0] + C[0]) / 2, (B[1] + C[1]) / 2], ca = [(C[0] + A[0]) / 2, (C[1] + A[1]) / 2]; tri(A, ab, ca, d - 1); tri(ab, B, bc, d - 1); tri(ca, bc, C, d - 1); };
          tri([0, 0], [1, 0], [0.5, 0.866], Math.min(K, 7)); for (let k = 0; k < K; k++) sum += a * rr ** k; }
        const lim = a / (1 - rr);
        out.innerHTML = mode === 0 ? `첫째항 a = (분홍 삼각형 2개) = 1/4 · 다음 정사각형의 넓이 비 r = 1/2<br>${K}단계까지 합 S<sub>${K}</sub> = <span class="p">${sum.toFixed(6)}</span> → a/(1 − r) = <span class="g">${lim}</span>` : `시에르핀스키: 매 단계 남은 삼각형의 1/4씩 제거<br>남은 비율 (3/4)<sup>${K}</sup> = <span class="b">${(0.75 ** K).toFixed(5)}</span> → 0 · 제거한 넓이 비율의 합 = <span class="p">${sum.toFixed(5)}</span> → 0.25/(1 − 0.75) = <span class="g">1</span>`;
      } });
      const c = Q.ctrls(h);
      Q.select(c, '도형', ['중점 정사각형', '시에르핀스키 삼각형'], v => { mode = v; P.redraw(); });
      Q.slider(c, { label: '단계', min: 1, max: 12, step: 1, value: 1, fmt: v => v }, v => { K = v; P.redraw(); });
      h.append(out);
    },
    guess: { q: '첫째항 1, 공비 $\\frac12$인 등비급수의 합은?', opts: ['1', '2', '무한대', '1.5'], ans: 1, why: T`$1+\frac12+\frac14+\cdots$. 1을 채우고, 남은 1의 절반을 채우고, 또 남은 것의 절반을 채우니까 2에 한없이 가까워져. $\frac{1}{1-1/2}=2$.` },
    theorem: T`<h4>등비급수</h4><p>$\displaystyle\sum_{n=1}^\infty ar^{n-1}$ ($a\ne0$)은 $|r|<1$이면 $\dfrac a{1-r}$로 수렴하고, $|r|\ge1$이면 발산해.</p><h4>도형 문제 공식</h4><p>① 첫 번째 그림의 색칠한 넓이 $a$를 구한다. ② 다음 그림과의 <b>길이 닮음비</b> $k$를 구한다. 넓이 비는 $r=k^2$. ③ 답은 $\dfrac{a}{1-k^2}$.</p>`,
    proof: [T`$S_n=a+ar+\cdots+ar^{n-1}$, $rS_n=ar+\cdots+ar^n$.`, T`빼면 $(1-r)S_n=a(1-r^n)$, 곧 $S_n=\dfrac{a(1-r^n)}{1-r}$.`, T`$|r|<1$이면 $r^n\to0$이니까 $S_n\to\dfrac a{1-r}$.`],
    exam: [T`도형 문제에서 넓이 비는 길이 비의 <b>제곱</b>. 가장 많이 틀리는 지점이야.`, T`순환소수 $0.\dot3\dot6=\frac{36}{100}+\frac{36}{100^2}+\cdots=\frac{36}{99}$.`, T`$\sum a_n$, $\sum a_n^2$을 주고 첫째항과 공비를 구하는 문제: 두 식을 나눠서 정리해.`],
    probs: [
      { lv: 2, q: T`$\displaystyle\sum_{n=1}^\infty\left(\frac23\right)^n$의 값을 구하시오.`, ans: 2, hints: [T`첫째항 $\frac23$, 공비 $\frac23$`], sol: T`$\frac{2/3}{1/3}=2$` },
      { lv: 3, q: T`첫째항이 $a$, 공비가 $r\ (0\lt r<1)$인 등비수열 $\{a_n\}$에 대하여 $\sum a_n=4$, $\sum a_n^2=8$일 때, $r$의 값은?`, opts: [frac(1, 4), frac(1, 3), frac(1, 2), frac(2, 3), frac(3, 4)], ans: 1, hints: [T`$\frac{a}{1-r}=4$, $\frac{a^2}{1-r^2}=8$`, T`둘째 식 ÷ 첫째 식: $\frac{a}{1+r}=2$`], sol: T`$4(1-r)=2(1+r)$, $r=\frac13$` },
      { lv: 4, q: '넓이가 1인 정사각형의 각 변의 중점을 이어 정사각형을 만들고, 원래 정사각형의 마주 보는 두 꼭짓점에 생긴 직각삼각형 2개를 색칠한다. 새 정사각형에서 같은 과정을 한없이 반복할 때, 색칠한 부분의 넓이의 합은?', opts: [frac(1, 4), frac(1, 3), frac(1, 2), frac(2, 3), '1'], ans: 2, hints: [T`첫 단계 색칠 넓이 $\frac18\times2=\frac14$`, T`새 정사각형의 넓이는 $\frac12$배`], sol: T`$\dfrac{1/4}{1-1/2}=\dfrac12$` }]
  }]},

  { name: '미분법', rooms: [

  { id: 'c2-e', title: '자연상수 e의 탄생', who: '야코프 베르누이', year: '1683',
    card: T`$e=\displaystyle\lim_{n\to\infty}\left(1+\frac1n\right)^n=\lim_{x\to0}(1+x)^{\frac1x}\approx2.71828$`,
    mystery: T`<p>은행이 연이율 100%를 준대. 1만 원을 맡기면 1년 뒤 2만 원이야. 그런데 6개월마다 50%씩 복리로 붙이면 $1.5^2=2.25$만 원. 매달 붙이면? 매일? 매초?</p><p>베르누이는 이 질문을 따라가다 이상한 수를 만났어. 이자를 아무리 잘게 쪼개 붙여도 돈은 무한히 불어나지 않고 <b>어떤 벽</b>에 막혀.</p>`,
    try: '1년을 나누는 횟수 n을 1에서 100만까지 늘려 봐. (1 + 1/n)ⁿ은 어디서 멈출까?',
    sim(h, Q) {
      let n = 2; const g = x => (1 + 1 / x) ** x; const out = Q.readout(document.createElement('div'));
      const P = Q.plot(h, { xmin: -0.2, xmax: 6.2, ymin: 1.8, ymax: 2.85, draw: P => {
        const c = P.c; P.grid({ fx: v => v < 0.01 ? '1' : '10^' + Math.round(v) }); P.hline(Math.E, c.y, [6, 4], 1.8); P.text(6.2, Math.E, 'e = 2.71828…', c.y, 'right', -4, -6);
        P.fn(L => g(10 ** L), c.b, 2.4, 0, 6); const L = Math.log10(n); P.dot(L, g(n), c.p, 7);
        out.innerHTML = `1년을 <span class="p">${n.toLocaleString()}</span>번 나눠 복리: (1 + 1/${n.toLocaleString()})<sup>${n.toLocaleString()}</sup> = <span class="b">${g(n).toFixed(8)}</span><br>e = <span class="y">${Math.E.toFixed(8)}</span> · 차이 ${(Math.E - g(n)).toExponential(2)}  (가로축은 n의 자릿수)`;
      } });
      const c = Q.ctrls(h);
      Q.slider(c, { label: 'n', min: 0, max: 6, step: 0.01, value: Math.log10(2), fmt: v => Math.round(10 ** v).toLocaleString() }, v => { n = Math.round(10 ** v); P.redraw(); });
      [1, 2, 12, 365, 525600].forEach((v, i) => Q.button(c, ['1년 1번', '반년마다', '매달', '매일', '매분'][i], () => { n = v; P.redraw(); }));
      h.append(out);
    },
    guess: { q: '이자를 무한히 잘게 쪼개 붙이면 1만 원은 1년 뒤?', opts: ['무한히 불어난다', '약 2.718만 원에서 멈춘다', '정확히 3만 원이 된다'], ans: 1, why: T`$(1+\frac1n)^n$은 증가하지만 위로 막혀 있어서 $e\approx2.71828$로 수렴해. 이 수가 자연 곳곳의 성장과 감소를 지배하는 $e$야.` },
    theorem: T`<h4>정의</h4>$$e=\lim_{x\to0}(1+x)^{\frac1x}=\lim_{n\to\infty}\left(1+\frac1n\right)^n$$<p>$e$를 밑으로 하는 로그 $\log_ex=\ln x$를 <b>자연로그</b>라 해.</p><h4>기본 극한</h4>$$\lim_{x\to0}\frac{\ln(1+x)}{x}=1,\qquad\lim_{x\to0}\frac{e^x-1}{x}=1$$`,
    proof: [T`$\dfrac{\ln(1+x)}{x}=\ln(1+x)^{\frac1x}$`, T`$x\to0$이면 $(1+x)^{\frac1x}\to e$이니까 $\ln e=1$.`, T`$e^x-1=t$로 두면 $x=\ln(1+t)$이고 $x\to0$일 때 $t\to0$.`, T`$\dfrac{e^x-1}{x}=\dfrac{t}{\ln(1+t)}\to1$.`],
    exam: [T`$\displaystyle\lim_{x\to0}(1+3x)^{\frac1x}$: 지수를 $\frac{1}{3x}\cdot3$으로 맞추면 $e^3$.`, T`$\displaystyle\lim_{x\to0}\frac{e^{2x}-1}{x}=2$, $\displaystyle\lim_{x\to0}\frac{\ln(1+5x)}{x}=5$: 안쪽을 맞추는 연습.`],
    probs: [
      { lv: 2, q: T`$\displaystyle\lim_{n\to\infty}\left(1+\frac1n\right)^{2n}$의 값은?`, opts: ['$e$', '$e^2$', '$\\sqrt e$', '$2e$', '1'], ans: 1, hints: [T`$\left\{\left(1+\frac1n\right)^n\right\}^2$`], sol: T`$e^2$` },
      { lv: 3, q: T`$\displaystyle\lim_{x\to0}(1+3x)^{\frac1x}$의 값은?`, opts: ['$e$', '$3e$', '$e^3$', '$e^{\\frac13}$', '3'], ans: 2, hints: [T`$\left\{(1+3x)^{\frac1{3x}}\right\}^3$`], sol: T`$e^3$` },
      { lv: 3, q: T`$\displaystyle\lim_{x\to0}\frac{e^{2x}-1}{x}$의 값을 구하시오.`, ans: 2, hints: [T`$\dfrac{e^{2x}-1}{2x}\cdot2$`], sol: '2' }]
  },

  { id: 'c2-explog', title: '지수함수와 로그함수의 미분', who: '레온하르트 오일러', year: '1748',
    card: T`$(e^x)'=e^x$, $(\ln x)'=\dfrac1x$, $(a^x)'=a^x\ln a$`,
    mystery: T`<p>지수함수 $a^x$는 높을수록 가파르게 올라가. 그럼 기울기와 높이의 <b>비율</b>은 어떻게 될까?</p><p>놀랍게도 그 비율은 어디서든 일정해. 그리고 그 비율이 정확히 1이 되는 밑이 딱 하나 있어. 미분해도 자기 자신이 되는 함수. 오일러가 이 수에 $e$라는 이름을 붙였어.</p>`,
    try: 'a를 바꿔서 "기울기 ÷ 높이"가 1이 되는 순간을 찾아. 그때 a는 몇이야? 그다음 로그함수 모드도 봐.',
    sim(h, Q) {
      let a = 2, x = 0.5, mode = 0; const out = Q.readout(document.createElement('div'));
      const P = Q.plot(h, { xmin: -2.5, xmax: 3, ymin: -2, ymax: 6, draw: P => {
        const c = P.c; P.grid();
        if (mode === 0) { const f = t => a ** t, m = f(x) * Math.log(a); P.fn(f, c.b, 2.6); P.fn(Math.exp, c.muted, 1.2, P.xmin, P.xmax, [4, 4]); P.line(x, f(x), m, c.y, 2); P.seg(x, 0, x, f(x), c.p, 1.6, [4, 4]); P.dot(x, f(x), c.y, 6);
          out.innerHTML = `y = ${a.toFixed(3)}<sup>x</sup> · x = ${x.toFixed(2)}<br><span class="p">높이 = ${f(x).toFixed(4)}</span> · <span class="y">기울기 = ${m.toFixed(4)}</span> · 기울기 ÷ 높이 = <b>${Math.log(a).toFixed(4)}</b> = ln a  (x와 상관없이 일정!)${Math.abs(a - Math.E) < 0.02 ? '<br><span class="g">a ≈ e: 기울기 = 높이. 미분해도 자기 자신!</span>' : ''}`; }
        else { const xx = Math.max(0.15, x + 1.5); P.fn(Math.log, c.b, 2.6, 0.01, P.xmax); P.fn(Math.exp, c.muted, 1.2, P.xmin, P.xmax, [4, 4]); P.fn(t => t, c.grid, 1); P.line(xx, Math.log(xx), 1 / xx, c.y, 2); P.dot(xx, Math.log(xx), c.y, 6); P.line(Math.log(xx), xx, xx, c.p, 1.4, [5, 4]); P.dot(Math.log(xx), xx, c.p, 5);
          out.innerHTML = `y = ln x · x = ${xx.toFixed(3)} · <span class="y">기울기 = ${(1 / xx).toFixed(4)} = 1/x</span><br><span class="p">y = x에 대칭인 eˣ 위의 점에서 기울기는 ${xx.toFixed(3)}</span> → 역함수의 기울기는 서로 역수`; }
      } });
      const c = Q.ctrls(h);
      Q.select(c, '함수', ['지수함수 aˣ', '로그함수 ln x'], v => { mode = v; sa.el.closest('label').hidden = v === 1; P.redraw(); });
      const sa = Q.slider(c, { label: '밑 a', min: 1.3, max: 4, step: 0.001, value: 2, fmt: v => v.toFixed(3) }, v => { a = v; P.redraw(); });
      Q.slider(c, { label: '점 x', min: -1.5, max: 1.6, value: 0.5 }, v => { x = v; P.redraw(); });
      Q.button(c, 'a = e로', () => sa.set(Math.E));
      h.append(out);
    },
    guess: { q: '$(e^x)\'$은?', opts: ['$xe^{x-1}$', '$e^x$', '$e^x\\ln x$'], ans: 1, why: T`$(x^n)'=nx^{n-1}$은 지수가 상수일 때의 공식이야. $e^x$는 변수가 지수에 있어서 다르게 행동해: $\dfrac{e^{x+h}-e^x}{h}=e^x\cdot\dfrac{e^h-1}{h}\to e^x$.` },
    theorem: T`<h4>지수함수</h4><p>$(e^x)'=e^x$, $(a^x)'=a^x\ln a$</p><h4>로그함수</h4><p>$(\ln x)'=\dfrac1x$, $(\log_ax)'=\dfrac{1}{x\ln a}$, $(\ln|x|)'=\dfrac1x$</p>`,
    proof: [T`$(e^x)'=\displaystyle\lim_{h\to0}\frac{e^{x+h}-e^x}{h}=e^x\lim_{h\to0}\frac{e^h-1}{h}=e^x$`, T`$(\ln x)'=\displaystyle\lim_{h\to0}\frac{\ln(x+h)-\ln x}{h}=\lim\frac1x\cdot\frac{\ln(1+h/x)}{h/x}=\frac1x$`, T`$a^x=e^{x\ln a}$이니까 합성함수의 미분으로 $(a^x)'=a^x\ln a$.`],
    exam: [T`$f(x)=xe^x$, $x\ln x$의 극값·최솟값: 미분하고 부호를 표로 정리해.`, T`$y=\ln x$ 위의 접선, 원점을 지나는 접선 문제($x=e$에서 접함).`],
    probs: [
      { lv: 2, q: T`$f(x)=(x+1)e^x$일 때, $f'(0)$의 값을 구하시오.`, ans: 2, hints: [T`곱의 미분: $e^x+(x+1)e^x$`], sol: '1 + 1 = 2' },
      { lv: 3, q: T`곡선 $y=\ln x$ 위의 점 $(e,1)$에서의 접선의 $y$절편을 구하시오.`, ans: 0, hints: [T`기울기 $\frac1e$`], sol: T`$y=\frac1e(x-e)+1=\frac xe$, 원점을 지나니까 $y$절편은 $0$.` },
      { lv: 4, q: T`$x>0$에서 함수 $f(x)=x\ln x$의 최솟값은?`, opts: ['$-\\frac1e$', '$-1$', '$-e$', '0', '$\\frac1e$'], ans: 0, hints: [T`$f'(x)=\ln x+1=0$에서 $x=\frac1e$`], sol: T`$f\!\left(\frac1e\right)=\frac1e\cdot(-1)=-\frac1e$` }]
  },

  { id: 'c2-trig', title: '삼각함수의 극한과 미분', who: '레온하르트 오일러', year: '1748',
    card: T`$\displaystyle\lim_{x\to0}\frac{\sin x}{x}=1$ ⇒ $(\sin x)'=\cos x$, $(\cos x)'=-\sin x$`,
    mystery: T`<p>각도가 아주 작으면 $\sin x\approx x$야. 진자의 운동 방정식을 풀 때 물리학자들이 늘 쓰는 근사지. 그런데 이게 왜 성립할까? 그리고 <b>라디안</b>일 때만 성립한다는 건 무슨 뜻일까?</p>`,
    try: '단위원 모드에서 θ를 0 쪽으로 줄이면서 sin θ, θ(호), tan θ의 크기를 비교해 봐. 그래프 모드에서는 sin x의 기울기가 cos x와 같아지는 걸 확인해.',
    sim(h, Q) {
      let mode = 0, th = 0.9, x = 1; const out = Q.readout(document.createElement('div'));
      const P = Q.plot(h, { draw: P => {
        const c = P.c, ctx = P.ctx;
        if (mode === 0) { const r = P.w / P.h, zoom = Math.max(1, 0.9 / th) * 0.8, sp = 1.25 / zoom; P.ymin = -0.15 * sp; P.ymax = sp * 0.95; P.xmin = 0.35 - sp * r / 2 * 1.05; P.xmax = P.xmin + (P.ymax - P.ymin) * r; P.grid({ labels: false });
          ctx.strokeStyle = c.muted; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(P.X(0), P.Y(0), P.X(1) - P.X(0), 0, -Math.PI / 2, true); ctx.stroke();
          const cx = Math.cos(th), sy = Math.sin(th), t = Math.tan(th);
          P.ctx.fillStyle = c.bF; ctx.beginPath(); ctx.moveTo(P.X(0), P.Y(0)); ctx.arc(P.X(0), P.Y(0), P.X(1) - P.X(0), 0, -th, true); ctx.closePath(); ctx.fill();
          P.seg(0, 0, 1, t, c.muted, 1.2); P.seg(cx, 0, cx, sy, c.p, 3); P.seg(1, 0, 1, t, c.g, 3);
          ctx.strokeStyle = c.y; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(P.X(0), P.Y(0), P.X(1) - P.X(0), 0, -th, true); ctx.stroke();
          out.innerHTML = `θ = ${th.toFixed(4)} rad (${(th * 180 / Math.PI).toFixed(2)}°)<br><span class="p">sin θ = ${Math.sin(th).toFixed(6)}</span> < <span class="y">θ (호의 길이) = ${th.toFixed(6)}</span> < <span class="g">tan θ = ${t.toFixed(6)}</span><br>sin θ / θ = <b>${(Math.sin(th) / th).toFixed(6)}</b> → 1`; }
        else { P.xmin = -1; P.xmax = 7.3; P.ymin = -1.6; P.ymax = 1.6; P.grid({ fx: v => (v / Math.PI).toFixed(1) + 'π' }); P.fn(Math.cos, c.g, 1.6, P.xmin, P.xmax, [6, 4]); P.fn(Math.sin, c.b, 2.6); P.line(x, Math.sin(x), Math.cos(x), c.y, 2); P.dot(x, Math.sin(x), c.y, 6); P.dot(x, Math.cos(x), c.g, 5);
          out.innerHTML = `x = ${x.toFixed(3)} · <span class="y">sin x의 접선 기울기 = ${Q.deriv(Math.sin, x).toFixed(5)}</span> · <span class="g">cos x = ${Math.cos(x).toFixed(5)}</span>`; }
      } });
      const c = Q.ctrls(h);
      Q.select(c, '보기', ['단위원: sin θ < θ < tan θ', '그래프: (sin x)′ = cos x'], v => { mode = v; s1.el.closest('label').hidden = v === 1; s2.el.closest('label').hidden = v === 0; P.redraw(); });
      const s1 = Q.slider(c, { label: 'θ', min: -2.5, max: Math.log10(1.4), step: 0.005, value: Math.log10(0.9), fmt: v => (10 ** v).toFixed(4) }, v => { th = 10 ** v; P.redraw(); });
      const s2 = Q.slider(c, { label: 'x', min: -0.8, max: 7, value: 1 }, v => { x = v; P.redraw(); });
      s2.el.closest('label').hidden = true; h.append(out);
    },
    guess: { q: '$\\displaystyle\\lim_{x\\to0}\\frac{\\sin x}{x}=1$은 각을 무엇으로 잴 때 성립할까?', opts: ['도(°)', '라디안', '둘 다'], ans: 1, why: T`라디안은 각을 "호의 길이"로 재는 방법이라서 $\sin x$와 $x$를 같은 단위로 비교할 수 있어. 도로 재면 극한은 $\frac{\pi}{180}$이 돼. 미적분에서 각을 라디안으로 재는 이유야.` },
    theorem: T`<h4>삼각함수의 극한</h4>$$\lim_{x\to0}\frac{\sin x}{x}=1,\qquad\lim_{x\to0}\frac{\tan x}{x}=1,\qquad\lim_{x\to0}\frac{1-\cos x}{x^2}=\frac12$$<h4>덧셈정리</h4><p>$\sin(\alpha\pm\beta)=\sin\alpha\cos\beta\pm\cos\alpha\sin\beta$</p><p>$\cos(\alpha\pm\beta)=\cos\alpha\cos\beta\mp\sin\alpha\sin\beta$</p><h4>미분</h4><p>$(\sin x)'=\cos x$, $(\cos x)'=-\sin x$</p>`,
    proof: [T`$0<\theta<\frac\pi2$에서 넓이 비교: (삼각형) < (부채꼴) < (큰 삼각형), 곧 $\frac12\sin\theta<\frac12\theta<\frac12\tan\theta$.`, T`$\sin\theta$로 나눠 뒤집으면 $\cos\theta<\dfrac{\sin\theta}{\theta}<1$.`, T`$\theta\to0+$이면 $\cos\theta\to1$이니까 샌드위치로 $\dfrac{\sin\theta}\theta\to1$.`, T`$\dfrac{\sin(x+h)-\sin x}{h}=\sin x\cdot\dfrac{\cos h-1}{h}+\cos x\cdot\dfrac{\sin h}{h}\to\cos x$`],
    exam: [T`$\displaystyle\lim_{x\to0}\frac{\sin3x}{x}$: 분모를 $3x$로 맞춰.`, T`도형 속 삼각함수 극한: 반지름 1인 원에서 $\theta\to0$일 때 넓이나 길이의 비. 4점 단골이야.`, T`$1-\cos x$가 보이면 $1+\cos x$를 곱해서 $\sin^2x$로 바꿔.`],
    probs: [
      { lv: 2, q: T`$\displaystyle\lim_{x\to0}\frac{\sin3x}{x}$의 값을 구하시오.`, ans: 3, hints: [T`$\dfrac{\sin3x}{3x}\cdot3$`], sol: '3' },
      { lv: 3, q: T`$\displaystyle\lim_{x\to0}\frac{1-\cos x}{x^2}$의 값을 구하시오.`, ans: 0.5, hints: [T`분자·분모에 $1+\cos x$를 곱해.`], sol: T`$\dfrac{\sin^2x}{x^2(1+\cos x)}\to\dfrac12$` },
      { lv: 3, q: T`$f(x)=x\sin x$일 때, $f'\!\left(\dfrac\pi2\right)$의 값을 구하시오.`, ans: 1, hints: [T`$f'(x)=\sin x+x\cos x$`], sol: T`$1+\frac\pi2\cdot0=1$` }]
  },

  { id: 'c2-chain', title: '몫과 합성함수의 미분', who: '고트프리트 라이프니츠', year: '1676',
    card: T`$\{f(g(x))\}'=f'(g(x))\,g'(x)$ : $\dfrac{dy}{dx}=\dfrac{dy}{du}\cdot\dfrac{du}{dx}$`,
    mystery: T`<p>톱니바퀴 A가 한 바퀴 돌면 B가 3바퀴, B가 한 바퀴 돌면 C가 2바퀴 돌아. A가 한 바퀴 돌면 C는 몇 바퀴? 당연히 $3\times2=6$바퀴지.</p><p>함수를 이어 붙일 때 변화율도 똑같이 <b>곱해져</b>. 라이프니츠의 기호 $\dfrac{dy}{du}\cdot\dfrac{du}{dx}$가 마치 분수처럼 약분되는 것도 그래서야.</p>`,
    try: 'x와 작은 변화 Δx를 정해. 맨 위 구간이 g를 거쳐 늘어나고, 다시 f를 거쳐 늘어나. 두 배율의 곱이 전체 배율과 같은지 확인해.',
    sim(h, Q) {
      const g = x => x * x, dg = x => 2 * x, f = Math.sin, df = Math.cos; let x = 1, dx = 0.3; const out = Q.readout(document.createElement('div'));
      const P = Q.plot(h, { xmin: -0.5, xmax: 4, ymin: -0.5, ymax: 3.5, aspect: 0.5, draw: P => {
        const c = P.c, ctx = P.ctx, u = g(x), u2 = g(x + dx), y = f(u), y2 = f(u2);
        const lines = [[3, 'x', x, x + dx, c.y, 0, 4], [1.6, 'u = g(x) = x²', u, u2, c.b, 0, 4], [0.2, 'y = f(u) = sin u', y, y2, c.p, -1.2, 2.8]];
        lines.forEach(([yy, name, a, b, col, lo, hi]) => { const S = v => (v - lo) / (hi - lo) * 4 - 0.3; P.seg(-0.3, yy, 3.7, yy, c.axis, 1.2); for (let t = Math.ceil(lo); t <= hi; t++) { P.seg(S(t), yy - 0.06, S(t), yy + 0.06, c.muted, 1); P.text(S(t), yy, String(t), c.muted, 'center', 0, 18, 11); } P.seg(S(a), yy, S(b), yy, col, 7); P.text(-0.3, yy + 0.25, name, col, 'left', 0, 0, 14); lines.S = lines.S || []; lines.S.push(S); });
        const [S0, S1, S2] = lines.S; ctx.setLineDash([3, 4]); ctx.strokeStyle = c.muted; ctx.lineWidth = 1;
        [[S0(x), 3, S1(u), 1.6], [S0(x + dx), 3, S1(u2), 1.6], [S1(u), 1.6, S2(y), 0.2], [S1(u2), 1.6, S2(y2), 0.2]].forEach(([a, b, cc, d]) => { ctx.beginPath(); ctx.moveTo(P.X(a), P.Y(b)); ctx.lineTo(P.X(cc), P.Y(d)); ctx.stroke(); }); ctx.setLineDash([]);
        out.innerHTML = `<span class="b">Δu/Δx = ${((u2 - u) / dx).toFixed(4)}</span> (→ g′(x) = 2x = ${dg(x).toFixed(4)})<br><span class="p">Δy/Δu = ${((y2 - y) / (u2 - u)).toFixed(4)}</span> (→ f′(u) = cos u = ${df(u).toFixed(4)})<br>Δy/Δx = ${((y2 - y) / dx).toFixed(4)} = 두 배율의 곱 → <span class="g">f′(g(x))·g′(x) = ${(df(u) * dg(x)).toFixed(4)}</span>`;
      } });
      const c = Q.ctrls(h);
      Q.slider(c, { label: 'x', min: 0.2, max: 1.6, value: 1 }, v => { x = v; P.redraw(); });
      Q.slider(c, { label: 'Δx', min: -2.5, max: Math.log10(0.4), step: 0.01, value: Math.log10(0.3), fmt: v => (10 ** v).toPrecision(2) }, v => { dx = 10 ** v; P.redraw(); });
      h.append(out); Q.note(h, 'Δx를 줄일수록 Δ끼리의 비율이 미분계수에 가까워져.');
    },
    guess: { q: '$y=\\sin(x^2)$의 도함수는?', opts: ['$\\cos(x^2)$', '$\\cos(2x)$', '$2x\\cos(x^2)$', '$2\\cos x$'], ans: 2, why: T`바깥 함수 $\sin$을 미분하면 $\cos(x^2)$이고, 안쪽 $x^2$의 변화율 $2x$를 곱해야 해. 안쪽 톱니가 얼마나 빨리 도는지를 잊으면 안 돼.` },
    theorem: T`<h4>몫의 미분법</h4>$$\left\{\frac{f(x)}{g(x)}\right\}'=\frac{f'(x)g(x)-f(x)g'(x)}{\{g(x)\}^2}$$<p>특히 $\left\{\dfrac1{g}\right\}'=-\dfrac{g'}{g^2}$, $(\tan x)'=\sec^2x$, $(x^n)'=nx^{n-1}$ ($n$은 정수)</p><h4>합성함수의 미분법</h4>$$\{f(g(x))\}'=f'(g(x))g'(x)$$<p>$\{\ln|f(x)|\}'=\dfrac{f'(x)}{f(x)}$, $(x^a)'=ax^{a-1}$ ($a$는 실수, $x>0$)</p>`,
    proof: [T`$u=g(x)$, $\Delta u=g(x+\Delta x)-g(x)$라 하자.`, T`$\Delta u\ne0$이면 $\dfrac{\Delta y}{\Delta x}=\dfrac{\Delta y}{\Delta u}\cdot\dfrac{\Delta u}{\Delta x}$.`, T`$\Delta x\to0$이면 $g$가 연속이니까 $\Delta u\to0$. 그래서 각각 $f'(u)$와 $g'(x)$로 간다.`, T`$\Delta u=0$이 되는 경우는 따로 처리해야 하지만, 결론은 같아(대학 해석학에서 정확히 다뤄).`],
    exam: [T`$g(x)=f(2x-1)$에서 $g'(1)=2f'(1)$: 안쪽 미분 2를 빠뜨리지 마.`, T`$\{f(x)\}^n$의 미분 $n\{f(x)\}^{n-1}f'(x)$.`, T`역함수·합성함수가 섞인 4점: $f(g(x))=x$를 미분하면 $f'(g(x))g'(x)=1$.`],
    probs: [
      { lv: 2, q: T`$y=(2x+1)^5$일 때, $x=0$에서의 미분계수를 구하시오.`, ans: 10, hints: [T`$5(2x+1)^4\cdot2$`], sol: '10' },
      { lv: 2, q: T`$f(x)=e^{x^2}$일 때, $f'(1)$의 값은?`, opts: ['$e$', '$2e$', '$e^2$', '2', '1'], ans: 1, hints: [T`$2xe^{x^2}$`], sol: T`$2e$` },
      { lv: 3, q: T`$f(x)=\dfrac{x}{x^2+1}$일 때, $f'(0)$의 값을 구하시오.`, ans: 1, hints: ['몫의 미분'], sol: T`$\dfrac{(x^2+1)-2x^2}{(x^2+1)^2}$에 $x=0$: $1$` },
      { lv: 3, q: T`미분가능한 함수 $f$에 대하여 $f'(1)=3$이고 $g(x)=f(2x-1)$일 때, $g'(1)$의 값을 구하시오.`, ans: 6, hints: [T`$g'(x)=2f'(2x-1)$`], sol: '2 × 3 = 6' }]
  },

  { id: 'c2-param', title: '매개변수로 나타낸 함수의 미분', who: '크리스티안 하위헌스', year: '1673',
    card: T`$x=f(t),\ y=g(t)$이면 $\dfrac{dy}{dx}=\dfrac{g'(t)}{f'(t)}$`,
    mystery: T`<p>굴러가는 자전거 바퀴 테두리에 붙은 돌멩이는 어떤 길을 그릴까? 이 곡선(사이클로이드)은 $y$를 $x$의 식으로 쓰기가 아주 어려워.</p><p>하지만 시간 $t$를 기준으로 하면 쉬워. "바퀴가 이만큼 굴렀을 때 $x$는 얼마, $y$는 얼마". 하위헌스는 이 곡선으로 가장 정확한 진자시계를 만들었어.</p>`,
    try: '재생해서 바퀴를 굴려 봐. 돌멩이의 속도 화살표가 언제 가장 길고, 언제 0이 될까?',
    sim(h, Q) {
      const cur = [{ n: '사이클로이드 (t − sin t, 1 − cos t)', x: t => t - Math.sin(t), y: t => 1 - Math.cos(t), dx: t => 1 - Math.cos(t), dy: Math.sin, T: 4 * Math.PI, v: [-0.5, 13, -0.5, 3.2] }, { n: '원 (cos t, sin t)', x: Math.cos, y: Math.sin, dx: t => -Math.sin(t), dy: Math.cos, T: 2 * Math.PI, v: [-2.2, 2.2, -1.3, 1.3] }, { n: '타원 (2cos t, sin t)', x: t => 2 * Math.cos(t), y: Math.sin, dx: t => -2 * Math.sin(t), dy: Math.cos, T: 2 * Math.PI, v: [-3, 3, -1.4, 1.4] }];
      let k = 0, t = 1; const out = Q.readout(document.createElement('div'));
      const P = Q.plot(h, { aspect: 0.4, draw: P => {
        const C = cur[k], c = P.c, ctx = P.ctx; [P.xmin, P.xmax, P.ymin, P.ymax] = C.v; const r = P.w / P.h, sy = (P.xmax - P.xmin) / r; const my = (P.ymin + P.ymax) / 2; P.ymin = my - sy / 2; P.ymax = my + sy / 2; P.grid();
        P.curve(C.x, C.y, 0, C.T, c.grid, 1.5); P.curve(C.x, C.y, 0, t, c.b, 2.6);
        if (k === 0) { ctx.strokeStyle = c.muted; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(P.X(t), P.Y(1), P.X(1) - P.X(0), 0, 7); ctx.stroke(); P.seg(t, 1, C.x(t), C.y(t), c.muted, 1.2); }
        const x = C.x(t), y = C.y(t), vx = C.dx(t), vy = C.dy(t); P.seg(x, y, x + vx * 0.8, y + vy * 0.8, c.y, 3); P.dot(x, y, c.p, 7);
        out.innerHTML = `t = ${t.toFixed(3)} · (x, y) = (${x.toFixed(3)}, ${y.toFixed(3)})<br><span class="y">속도 (dx/dt, dy/dt) = (${vx.toFixed(3)}, ${vy.toFixed(3)})</span> · 속력 ${Math.hypot(vx, vy).toFixed(3)}<br>dy/dx = (dy/dt)/(dx/dt) = ${Math.abs(vx) < 1e-6 ? '<span class="r">정의되지 않음 (접선이 수직)</span>' : (vy / vx).toFixed(4)}`;
      } });
      const A = Q.anim(dt => { t += dt * 1.3; if (t >= cur[k].T) t = 0.001; st.set(t); });
      const c = Q.ctrls(h);
      Q.select(c, '곡선', cur.map(c => c.n), v => { k = v; t = 1; st.el.max = cur[v].T; st.set(1); });
      Q.button(c, '재생 ▶ / 멈춤', () => A.running ? A.stop() : A.start(), 'primary');
      const st = Q.slider(c, { label: 't', min: 0.001, max: 4 * Math.PI, value: 1 }, v => { t = v; P.redraw(); });
      h.append(out); Q.note(h, '사이클로이드에서 돌멩이가 땅에 닿는 순간 속도는 0이야. 굴러가는 바퀴의 접지점은 멈춰 있어.');
    },
    guess: { q: T`사이클로이드에서 돌멩이가 땅에 닿는 순간 $(t=2\pi)$의 속도는?`, opts: ['가장 빠르다', '0이다', '바퀴의 속도와 같다'], ans: 1, why: T`$\frac{dx}{dt}=1-\cos t$, $\frac{dy}{dt}=\sin t$인데 $t=2\pi$에서 둘 다 0이야. 반대로 꼭대기에서는 바퀴 속도의 2배로 가장 빨라.` },
    theorem: T`<h4>매개변수로 나타낸 함수의 미분법</h4><p>$x=f(t)$, $y=g(t)$가 미분가능하고 $f'(t)\ne0$이면</p>$$\frac{dy}{dx}=\frac{dy/dt}{dx/dt}=\frac{g'(t)}{f'(t)}$$`,
    proof: [T`$t$가 $\Delta t$만큼 변할 때 $\Delta x$, $\Delta y$가 생겨.`, T`$\dfrac{\Delta y}{\Delta x}=\dfrac{\Delta y/\Delta t}{\Delta x/\Delta t}$`, T`$\Delta t\to0$이면 분자는 $g'(t)$, 분모는 $f'(t)\ne0$.`],
    exam: [T`$t=a$에서의 접선: 점 $(f(a),g(a))$와 기울기 $\frac{g'(a)}{f'(a)}$.`, T`평면 위의 운동(속도 벡터, 속력)은 이 개념의 연장이야. 적분 단원의 "곡선의 길이"로 이어져.`],
    probs: [
      { lv: 2, q: T`$x=t^2$, $y=t^3$일 때, $t=2$에 대응하는 점에서 $\dfrac{dy}{dx}$의 값을 구하시오.`, ans: 3, hints: [T`$\frac{3t^2}{2t}$`], sol: T`$\frac{3t}{2}=3$` },
      { lv: 3, q: T`$x=\cos t$, $y=\sin t$일 때, $t=\dfrac\pi4$에 대응하는 점에서의 접선의 기울기를 구하시오.`, ans: -1, hints: [T`$\frac{\cos t}{-\sin t}$`], sol: '−1' },
      { lv: 3, q: T`사이클로이드 $x=t-\sin t$, $y=1-\cos t$ 위의 $t=\dfrac\pi2$에 대응하는 점에서의 접선의 기울기를 구하시오.`, ans: 1, hints: [T`$\dfrac{\sin t}{1-\cos t}$`], sol: '1/1 = 1' }]
  },

  { id: 'c2-implicit', title: '음함수와 역함수의 미분', who: '아이작 뉴턴', year: '1671',
    card: T`역함수: $(f^{-1})'(b)=\dfrac{1}{f'(a)}$ (단, $f(a)=b$). 음함수: 양변을 $x$로 미분`,
    mystery: T`<p>원 $x^2+y^2=25$는 함수가 아니야. 하나의 $x$에 $y$가 두 개 있으니까. 그래도 원 위의 점마다 접선은 분명히 있어. 접선의 기울기를 어떻게 구할까?</p><p>그리고 역함수의 그래프는 원래 그래프를 $y=x$에 비춘 거울상이야. 거울에 비추면 기울기는 어떻게 될까?</p>`,
    try: '원 모드에서는 점을 끌어서 접선을 움직여 봐. 역함수 모드에서는 거울에 비친 두 접선의 기울기를 곱해 봐.',
    sim(h, Q) {
      let mode = 0, ang = 0.9, a = 1; const out = Q.readout(document.createElement('div'));
      const f = x => x ** 3 + x, df = x => 3 * x * x + 1;
      const P = Q.plot(h, { aspect: 0.6, onDrag: (x, y) => { if (mode === 0) ang = Math.atan2(y, x); else a = Math.max(-1.3, Math.min(1.3, x)); P.redraw(); }, draw: P => {
        const c = P.c, r = P.w / P.h; P.ymin = -3; P.ymax = 3; P.xmin = -3 * r; P.xmax = 3 * r; P.grid();
        if (mode === 0) { const R = 2.5, x = R * Math.cos(ang), y = R * Math.sin(ang); P.curve(t => R * Math.cos(t), t => R * Math.sin(t), 0, 7, c.b, 2.6); const m = -x / y; if (Math.abs(y) > 0.02) P.line(x, y, m, c.y, 2); else P.vline(x, c.y, [], 2); P.seg(0, 0, x, y, c.muted, 1.2, [4, 4]); P.dot(x, y, c.p, 8);
          out.innerHTML = `x² + y² = 6.25 · 점 (${x.toFixed(3)}, ${y.toFixed(3)})<br>양변을 x로 미분: 2x + 2y·(dy/dx) = 0 → <span class="y">dy/dx = −x/y = ${Math.abs(y) > 0.02 ? m.toFixed(4) : '정의 안 됨(수직)'}</span><br>반지름의 기울기 y/x와 곱하면 −1: 접선 ⊥ 반지름`; }
        else { P.fn(t => t, c.grid, 1.2); P.fn(f, c.b, 2.5); P.curve(t => f(t), t => t, -2, 2, c.p, 2.5); const b = f(a);
          P.line(a, b, df(a), c.b, 1.6, [6, 4]); P.line(b, a, 1 / df(a), c.p, 1.6, [6, 4]); P.dot(a, b, c.b, 7); P.dot(b, a, c.p, 7);
          out.innerHTML = `<span class="b">f(x) = x³ + x 위의 점 (${a.toFixed(3)}, ${b.toFixed(3)}): 기울기 f′(a) = ${df(a).toFixed(4)}</span><br><span class="p">역함수 g 위의 점 (${b.toFixed(3)}, ${a.toFixed(3)}): 기울기 g′(b) = ${(1 / df(a)).toFixed(4)}</span><br>곱 = 1. 거울에 비추면 가로와 세로가 바뀌니까 기울기는 역수가 돼.`; }
      } });
      const c = Q.ctrls(h);
      Q.select(c, '보기', ['음함수: 원 위의 접선', '역함수: y = x 거울'], v => { mode = v; P.redraw(); });
      h.append(out); Q.note(h, '그래프 위를 끌어서 점을 움직여.');
    },
    guess: { q: '$f(1)=3$, $f\'(1)=4$이고 $g$가 $f$의 역함수일 때 $g\'(3)$은?', opts: ['4', frac(1, 4), frac(1, 3), '−4'], ans: 1, why: T`$g$ 위의 점 $(3,1)$은 $f$ 위의 점 $(1,3)$의 거울상이야. 기울기는 역수니까 $\frac14$. $g'(3)=\dfrac{1}{f'(g(3))}=\dfrac1{f'(1)}$.` },
    theorem: T`<h4>음함수의 미분법</h4><p>$F(x,y)=0$의 양변을 $x$로 미분해. $y$가 들어간 항은 합성함수로 보고 $\frac{dy}{dx}$를 곱해. 예: $(y^2)'=2y\dfrac{dy}{dx}$.</p><h4>역함수의 미분법</h4><p>$f$의 역함수가 $g$이고 $f'(g(x))\ne0$이면</p>$$g'(x)=\frac{1}{f'(g(x))},\qquad\frac{dx}{dy}=\frac{1}{dy/dx}$$`,
    proof: [T`$f(g(x))=x$의 양변을 $x$로 미분하면`, T`합성함수의 미분법에 의해 $f'(g(x))\cdot g'(x)=1$.`, T`그러니까 $g'(x)=\dfrac{1}{f'(g(x))}$.`],
    exam: [T`"$f$의 역함수 $g$에 대하여 $g'(3)$": 먼저 $f(a)=3$인 $a$를 찾는 게 핵심이야.`, T`곡선 $x^3+y^3=9xy$ 같은 음함수 위의 점에서의 접선의 기울기.`],
    probs: [
      { lv: 2, q: T`원 $x^2+y^2=25$ 위의 점 $(3,4)$에서의 접선의 기울기는?`, opts: ['$-\\frac43$', '$-\\frac34$', '$\\frac34$', '$\\frac43$', '$-1$'], ans: 1, hints: [T`$-\frac xy$`], sol: T`$-\frac34$` },
      { lv: 3, q: T`곡선 $x^3+y^3=9xy$ 위의 점 $(2,4)$에서 $\dfrac{dy}{dx}$의 값을 구하시오.`, ans: 0.8, hints: [T`$3x^2+3y^2y'=9y+9xy'$`], sol: T`$y'=\dfrac{9y-3x^2}{3y^2-9x}=\dfrac{36-12}{48-18}=\dfrac45$` },
      { lv: 4, q: T`$f(x)=x^3+x+1$의 역함수를 $g$라 할 때, $g'(3)$의 값을 구하시오.`, ans: 0.25, hints: [T`$f(1)=3$`, T`$f'(1)=4$`], sol: T`$\frac1{f'(1)}=\frac14$` }]
  },

  { id: 'c2-concave', title: '오목·볼록과 변곡점', who: '마리아 가에타나 아녜시', year: '1748',
    card: T`$f''>0$이면 아래로 볼록, $f''<0$이면 위로 볼록. $f''$의 부호가 바뀌는 점이 변곡점`,
    mystery: T`<p>자동차를 타고 곡선 도로를 달린다고 상상해 봐. 핸들을 왼쪽으로 꺾다가 어느 순간 오른쪽으로 꺾기 시작해. 그 순간이 <b>변곡점</b>이야.</p><p>도함수가 "어느 방향으로 가는가"를 말해 준다면, 이계도함수는 "어느 쪽으로 휘는가"를 말해 줘. 아녜시는 최초의 미적분 교과서를 쓴 여성 수학자야.</p>`,
    try: '자동차(점)를 움직이며 핸들 방향이 바뀌는 곳을 찾아. 아래 f″ 그래프의 부호와 비교해.',
    sim(h, Q) {
      const fs = [{ n: 'x³ − 3x² + 1', f: x => x ** 3 - 3 * x * x + 1, d2: x => 6 * x - 6, v: [-1.5, 3.5, -4, 3] }, { n: 'e^(−x²) (정규분포 모양)', f: x => Math.exp(-x * x), d2: x => (4 * x * x - 2) * Math.exp(-x * x), v: [-2.8, 2.8, -0.3, 1.3] }, { n: 'x·e^(−x)', f: x => x * Math.exp(-x), d2: x => (x - 2) * Math.exp(-x), v: [-0.6, 6, -0.6, 0.6] }];
      let k = 0, x = 0; const top = Q.plot(h, { aspect: 0.42, draw: P => { const F = fs[k], c = P.c; [P.xmin, P.xmax, P.ymin, P.ymax] = F.v; P.grid(); const N = 300; for (let i = 0; i < N; i++) { const a = P.xmin + (P.xmax - P.xmin) * i / N, b = a + (P.xmax - P.xmin) / N; P.seg(a, F.f(a), b, F.f(b), F.d2((a + b) / 2) > 0 ? c.g : c.p, 3); } const m = Q.deriv(F.f, x); P.line(x, F.f(x), m, c.y, 1.4, [5, 4]); P.dot(x, F.f(x), c.y, 7); } });
      const bot = Q.plot(h, { aspect: 0.3, draw: P => { const F = fs[k], c = P.c; P.xmin = F.v[0]; P.xmax = F.v[1]; const ys = Array.from({ length: 50 }, (_, i) => F.d2(P.xmin + (P.xmax - P.xmin) * i / 49)); P.ymin = Math.min(...ys) * 1.1 - 0.05; P.ymax = Math.max(...ys) * 1.1 + 0.05; P.grid(); P.between(t => Math.max(F.d2(t), 0), () => 0, P.xmin, P.xmax, c.gF); P.between(t => Math.min(F.d2(t), 0), () => 0, P.xmin, P.xmax, c.pF); P.fn(F.d2, c.chalk, 2); P.dot(x, F.d2(x), c.y, 5); P.text(P.xmin, P.ymax, "f″(x)", c.chalk, 'left', 8, 22); } });
      const out = Q.readout(h);
      const upd = () => { top.redraw(); bot.redraw(); const v = fs[k].d2(x); out.innerHTML = `x = ${x.toFixed(3)} · f″(x) = ${v.toFixed(4)}<br>${Math.abs(v) < 0.02 ? '<span class="y">핸들이 정중앙! 변곡점 근처</span>' : v > 0 ? '<span class="g">아래로 볼록 (∪): 핸들을 왼쪽으로 · 기울기가 증가 중</span>' : '<span class="p">위로 볼록 (∩): 핸들을 오른쪽으로 · 기울기가 감소 중</span>'}`; };
      const c = Q.ctrls(h);
      Q.select(c, 'f(x)', fs.map(f => f.n), v => { k = v; sx.el.min = fs[v].v[0]; sx.el.max = fs[v].v[1]; sx.set((fs[v].v[0] + fs[v].v[1]) / 2); });
      const sx = Q.slider(c, { label: 'x (자동차 위치)', min: -1.5, max: 3.5, value: 0 }, v => { x = v; upd(); });
      requestAnimationFrame(upd); Q.note(h, '초록 구간은 아래로 볼록, 분홍 구간은 위로 볼록이야.');
    },
    guess: { q: T`$f''(a)=0$이면 $x=a$는 반드시 변곡점일까?`, opts: ['그렇다', T`아니다. $x^4$은 $f''(0)=0$이지만 변곡점이 아니다`], ans: 1, why: T`변곡점의 조건은 $f''$의 <b>부호 변화</b>야. 극값에서 $f'$의 부호 변화를 본 것과 똑같은 구조지.` },
    theorem: T`<h4>오목과 볼록</h4><p>어떤 구간에서 $f''(x)>0$이면 곡선은 그 구간에서 <b>아래로 볼록</b>, $f''(x)<0$이면 <b>위로 볼록</b>이야.</p><h4>변곡점</h4><p>$f''(a)=0$이고 $x=a$의 좌우에서 $f''$의 부호가 바뀌면 점 $(a,f(a))$는 변곡점이야.</p><h4>이계도함수를 이용한 극값 판정</h4><p>$f'(a)=0$이고 $f''(a)<0$이면 극대, $f''(a)>0$이면 극소.</p><h4>그래프 개형 그리기</h4><p>정의역 → $f'$ 부호(증감) → $f''$ 부호(오목·볼록) → 점근선과 $\lim_{x\to\pm\infty}$ → 표로 정리.</p>`,
    proof: [T`$f''>0$이면 $f'$이 증가해. 오른쪽으로 갈수록 접선이 점점 가팔라진다는 뜻이야.`, T`기울기가 계속 커지는 곡선은 위로 휘어 올라가는 모양(∪)이야.`, T`정확히는 곡선이 모든 접선보다 위에 있다는 걸 평균값 정리로 보일 수 있어.`],
    exam: [T`$f(x)=x^4+ax^3+6x^2$이 변곡점을 갖지 않는 조건: $f''\ge0$ 항상 ⇔ 판별식 $\le0$.`, T`$xe^{-x}$, $\frac{\ln x}{x}$ 같은 초월함수의 그래프 개형과 실근의 개수. 미적분Ⅱ 4점의 단골이야.`],
    probs: [
      { lv: 2, q: T`곡선 $y=x^3-3x^2+1$의 변곡점의 $x$좌표를 구하시오.`, ans: 1, hints: [T`$y''=6x-6$`], sol: '1' },
      { lv: 3, q: T`곡선 $y=xe^{-x}$의 변곡점의 $x$좌표를 구하시오.`, ans: 2, hints: [T`$y'=(1-x)e^{-x}$`, T`$y''=(x-2)e^{-x}$`], sol: '2' },
      { lv: 4, q: T`함수 $f(x)=x^4+ax^3+6x^2$의 그래프가 변곡점을 갖지 않도록 하는 정수 $a$의 개수를 구하시오.`, ans: 9, hints: [T`$f''(x)=12x^2+6ax+12$`, T`부호가 바뀌지 않으려면 $D/4=9a^2-144\le0$`], sol: T`$-4\le a\le4$, 정수 9개.` }]
  }]},

  { name: '적분법', rooms: [

  { id: 'c2-subst', title: '치환적분', who: '고트프리트 라이프니츠', year: '1693',
    card: T`$\displaystyle\int_a^b f(g(x))g'(x)\,dx=\int_{g(a)}^{g(b)}f(u)\,du$`,
    mystery: T`<p>$\displaystyle\int_0^{a}2x\cos(x^2)\,dx$는 무섭게 생겼어. 그런데 $u=x^2$으로 눈을 바꿔 보면 그냥 $\int\cos u\,du$야.</p><p>치환은 합성함수 미분의 거꾸로야. 좌표축을 늘이고 줄이면 넓이의 모양은 달라져도 <b>값은 그대로</b>야. 직접 보자.</p>`,
    try: 'a를 움직여 봐. 위(x 세상)의 넓이와 아래(u 세상)의 넓이가 모양은 달라도 항상 같아.',
    sim(h, Q) {
      let a = 1.4; const f1 = x => 2 * x * Math.cos(x * x);
      const top = Q.plot(h, { xmin: -0.1, xmax: 2.6, ymin: -5.5, ymax: 3.5, aspect: 0.38, draw: P => { const c = P.c; P.grid(); P.between(t => Math.max(f1(t), 0), () => 0, 0, a, c.yF); P.between(t => Math.min(f1(t), 0), () => 0, 0, a, c.pF); P.fn(f1, c.b, 2.4); P.vline(a, c.chalk, [3, 4]); P.text(P.xmin, P.ymax, 'x 세상: y = 2x cos(x²)', c.b, 'left', 10, 22); } });
      const bot = Q.plot(h, { xmin: -0.2, xmax: 6.8, ymin: -1.4, ymax: 1.4, aspect: 0.3, draw: P => { const c = P.c; P.grid(); P.between(t => Math.max(Math.cos(t), 0), () => 0, 0, a * a, c.yF); P.between(t => Math.min(Math.cos(t), 0), () => 0, 0, a * a, c.pF); P.fn(Math.cos, c.g, 2.4); P.vline(a * a, c.chalk, [3, 4]); P.text(P.xmin, P.ymax, 'u 세상 (u = x²): y = cos u', c.g, 'left', 10, 22); } });
      const out = Q.readout(h);
      const upd = () => { top.redraw(); bot.redraw(); out.innerHTML = `∫₀^${a.toFixed(2)} 2x cos(x²) dx = <span class="b">${Q.integrate(f1, 0, a, 800).toFixed(6)}</span><br>∫₀^${(a * a).toFixed(2)} cos u du = sin(${(a * a).toFixed(2)}) = <span class="g">${Math.sin(a * a).toFixed(6)}</span>`; };
      Q.slider(Q.ctrls(h), { label: 'a', min: 0.1, max: 2.5, value: 1.4 }, v => { a = v; upd(); });
      requestAnimationFrame(upd); Q.note(h, 'x가 커질수록 u = x²은 더 빨리 커져. 그 늘어나는 비율이 바로 du/dx = 2x이고, 그게 적분 안의 2x가 하는 일이야.');
    },
    guess: { q: '$\\int 2x(x^2+1)^3\\,dx$에서 무엇을 $u$로 둘까?', opts: ['$u=2x$', '$u=x^2+1$', '$u=(x^2+1)^3$'], ans: 1, why: T`$u=x^2+1$이면 $du=2x\,dx$가 식에 이미 들어 있어. "안쪽 함수의 미분이 밖에 곱해져 있다"가 치환의 신호야.` },
    theorem: T`<h4>치환적분법</h4><p>$x=g(t)$로 놓으면 $\displaystyle\int f(x)\,dx=\int f(g(t))g'(t)\,dt$.</p><p>정적분에서는 적분 구간도 함께 바꿔: $\displaystyle\int_a^bf(g(x))g'(x)\,dx=\int_{g(a)}^{g(b)}f(u)\,du$</p><h4>자주 쓰는 꼴</h4><p>$\displaystyle\int\frac{f'(x)}{f(x)}\,dx=\ln|f(x)|+C$</p><p>$\int e^x\,dx=e^x+C$, $\int\frac1x\,dx=\ln|x|+C$, $\int\sin x\,dx=-\cos x+C$, $\int\cos x\,dx=\sin x+C$</p>`,
    proof: [T`$F'=f$라 하자. 합성함수의 미분법으로 $\{F(g(x))\}'=f(g(x))g'(x)$.`, T`그러니까 $\displaystyle\int_a^bf(g(x))g'(x)\,dx=F(g(b))-F(g(a))$.`, T`이건 바로 $\displaystyle\int_{g(a)}^{g(b)}f(u)\,du$야.`],
    exam: [T`$\int\frac{\ln x}{x}\,dx$: $u=\ln x$. $\int\frac{x}{x^2+1}\,dx$: $\frac{f'}{f}$ 꼴.`, T`적분 구간을 바꾸는 걸 잊지 마. 구간을 안 바꿀 거면 마지막에 $u$를 $x$로 되돌려야 해.`, T`$\int_0^af(a-x)\,dx=\int_0^af(x)\,dx$ 같은 대칭 치환 아이디어.`],
    probs: [
      { lv: 2, q: T`$\displaystyle\int_0^1 2x(x^2+1)^3\,dx$의 값을 구하시오.`, ans: 3.75, hints: [T`$u=x^2+1$, 구간 $1\to2$`], sol: T`$\left[\frac{u^4}4\right]_1^2=\frac{16-1}4=\frac{15}4$` },
      { lv: 3, q: T`$\displaystyle\int_1^e\frac{\ln x}{x}\,dx$의 값을 구하시오.`, ans: 0.5, hints: [T`$u=\ln x$, 구간 $0\to1$`], sol: T`$\int_0^1u\,du=\frac12$` },
      { lv: 3, q: T`$\displaystyle\int_0^1\frac{x}{x^2+1}\,dx$의 값은?`, opts: ['$\\ln2$', '$\\frac12\\ln2$', '$2\\ln2$', '$\\frac12$', '1'], ans: 1, hints: [T`$\frac12\cdot\frac{2x}{x^2+1}$`], sol: T`$\frac12[\ln(x^2+1)]_0^1=\frac12\ln2$` }]
  },

  { id: 'c2-parts', title: '부분적분', who: '브룩 테일러', year: '1715',
    card: T`$\displaystyle\int f(x)g'(x)\,dx=f(x)g(x)-\int f'(x)g(x)\,dx$`,
    mystery: T`<p>$\int\ln x\,dx$는 어떻게 구할까? $\ln x$를 미분하면 $\frac1x$인데, 거꾸로 무엇을 미분해야 $\ln x$가 나오는지는 바로 떠오르지 않아.</p><p>부분적분은 곱의 미분법을 거꾸로 쓴 거야. 그리고 그림으로 보면 아주 단순해. <b>직사각형 하나 = 두 넓이의 합</b>.</p>`,
    try: 'b를 움직여 봐. 노란 넓이(∫ ln x dx)와 파란 넓이(∫ eʸ dy)를 더하면 항상 큰 직사각형 넓이 b·ln b가 돼.',
    sim(h, Q) {
      let b = 4; const out = Q.readout(document.createElement('div'));
      const P = Q.plot(h, { xmin: -0.4, xmax: 7.6, ymin: -0.4, ymax: 2.3, aspect: 0.45, draw: P => {
        const c = P.c, L = Math.log(b); P.grid(); P.rect(0, 0, b, L, null, c.chalk);
        P.between(Math.log, () => 0, 1, b, c.yF); P.ctx.fillStyle = c.bF; P.ctx.beginPath(); P.ctx.moveTo(P.X(0), P.Y(0)); P.ctx.lineTo(P.X(1), P.Y(0)); for (let i = 0; i <= 200; i++) { const x = 1 + (b - 1) * i / 200; P.ctx.lineTo(P.X(x), P.Y(Math.log(x))); } P.ctx.lineTo(P.X(0), P.Y(L)); P.ctx.closePath(); P.ctx.fill();
        P.fn(Math.log, c.p, 2.6, 0.2, P.xmax); P.dot(b, L, c.p, 6);
        const A = b * L - b + 1, B = b - 1;
        out.innerHTML = `<span class="y">∫₁ᵇ ln x dx = ${A.toFixed(4)}</span> (곡선 아래)<br><span class="b">∫₀^(ln b) eʸ dy = b − 1 = ${B.toFixed(4)}</span> (곡선 왼쪽)<br>합 = ${(A + B).toFixed(4)} = 직사각형 b · ln b = <span class="g">${(b * L).toFixed(4)}</span><br>그러니까 ∫₁ᵇ ln x dx = b ln b − (b − 1) = [x ln x − x]₁ᵇ`;
      } });
      Q.slider(Q.ctrls(h), { label: 'b', min: 1.2, max: 7.4, value: 4 }, v => { b = v; P.redraw(); });
      h.append(out); Q.note(h, '일반적으로 ∫u dv + ∫v du = [uv]. 곱의 미분 (uv)′ = u′v + uv′을 적분한 거야.');
    },
    guess: { q: '$\\int x e^x\\,dx$에서 미분할 쪽(f)과 적분할 쪽(g′)은?', opts: ['$f=x$, $g\'=e^x$', '$f=e^x$, $g\'=x$', '아무거나 상관없다'], ans: 0, why: T`$x$를 미분하면 1로 단순해지고, $e^x$는 적분해도 그대로야. 반대로 하면 $x^2$이 생겨서 더 복잡해져. 로그 → 다항 → 삼각 → 지수 순서로 "미분할 쪽"을 고르는 규칙(로다삼지)이 있어.` },
    theorem: T`<h4>부분적분법</h4>$$\int f(x)g'(x)\,dx=f(x)g(x)-\int f'(x)g(x)\,dx$$$$\int_a^bf(x)g'(x)\,dx=\Big[f(x)g(x)\Big]_a^b-\int_a^bf'(x)g(x)\,dx$$<p><b>고르는 요령</b> 미분하면 단순해지는 쪽을 $f$로(로그 > 다항 > 삼각 > 지수).</p>`,
    proof: [T`곱의 미분법: $\{f(x)g(x)\}'=f'(x)g(x)+f(x)g'(x)$.`, T`양변을 적분하면 $f(x)g(x)=\int f'g\,dx+\int fg'\,dx$.`, T`옮기면 $\int fg'\,dx=fg-\int f'g\,dx$.`],
    exam: [T`$\int x\sin x\,dx$, $\int xe^x\,dx$, $\int\ln x\,dx$, $\int x\ln x\,dx$: 기본 4종 세트.`, T`$\int e^x\sin x\,dx$: 부분적분을 두 번 하면 원래 적분이 다시 나와서 방정식으로 풀려.`, T`$\int_a^b xf'(x)\,dx$ 꼴: $f$의 정적분 정보와 연결하는 4점 문제.`],
    probs: [
      { lv: 2, q: T`$\displaystyle\int_0^\pi x\sin x\,dx$의 값은?`, opts: ['$1$', '$2$', '$\\pi$', '$2\\pi$', '$\\pi-1$'], ans: 2, hints: [T`$f=x$, $g'=\sin x$`], sol: T`$[-x\cos x]_0^\pi+\int_0^\pi\cos x\,dx=\pi+0=\pi$` },
      { lv: 3, q: T`$\displaystyle\int_1^e\ln x\,dx$의 값을 구하시오.`, ans: 1, hints: [T`$[x\ln x-x]_1^e$`], sol: T`$(e-e)-(0-1)=1$` },
      { lv: 4, q: T`$\displaystyle\int_1^ex\ln x\,dx$의 값은?`, opts: ['$\\frac{e^2}4$', '$\\frac{e^2+1}4$', '$\\frac{e^2-1}4$', '$\\frac{e^2+1}2$', '$\\frac{e^2}{2}$'], ans: 1, hints: [T`$f=\ln x$, $g'=x$`, T`$\left[\frac{x^2}2\ln x\right]_1^e-\int_1^e\frac x2\,dx$`], sol: T`$\frac{e^2}2-\frac{e^2-1}{4}=\frac{e^2+1}4$` }]
  },

  { id: 'c2-sum', title: '정적분과 급수 (구분구적법)', who: '베른하르트 리만', year: '1854',
    card: T`$\displaystyle\lim_{n\to\infty}\sum_{k=1}^{n}f\!\left(a+\frac{(b-a)k}{n}\right)\frac{b-a}{n}=\int_a^bf(x)\,dx$`,
    mystery: T`<p>$\displaystyle\lim_{n\to\infty}\left(\frac1{n+1}+\frac1{n+2}+\cdots+\frac1{2n}\right)$은 얼마일까? 항은 점점 작아지는데 개수는 점점 많아져.</p><p>이 합을 직사각형 넓이의 합으로 읽을 수 있으면 답은 정적분 하나로 끝나. 수열의 극한과 적분이 만나는 곳이야.</p>`,
    try: '합을 하나 고르고 n을 키워 봐. 직사각형 각각이 시그마의 항 하나라는 걸 확인해.',
    sim(h, Q) {
      const ss = [{ n: 'Σ (1/n)(k/n)² → ∫₀¹ x² dx', f: x => x * x, a: 0, b: 1, ex: 1 / 3, s: '1/3' }, { n: 'Σ 1/(n + k) → ∫₀¹ 1/(1+x) dx', f: x => 1 / (1 + x), a: 0, b: 1, ex: Math.LN2, s: 'ln 2' }, { n: 'Σ (1/n)√(k/n) → ∫₀¹ √x dx', f: Math.sqrt, a: 0, b: 1, ex: 2 / 3, s: '2/3' }];
      let k = 0, n = 6; const out = Q.readout(document.createElement('div'));
      const P = Q.plot(h, { xmin: -0.08, xmax: 1.15, ymin: -0.08, ymax: 1.15, aspect: 0.55, draw: P => {
        const S = ss[k], c = P.c; P.grid({ sx: 0.25, sy: 0.25 }); let s = 0;
        for (let i = 1; i <= n; i++) { const x = (i - 1) / n, y = S.f(i / n); s += y / n; P.rect(x, 0, x + 1 / n, y, c.yF, n <= 50 ? c.y : null); }
        P.fn(S.f, c.b, 2.6, 0, 1);
        out.innerHTML = `${S.n}<br>n = ${n} · 합 = <span class="y">${s.toFixed(6)}</span> → 정적분 <span class="g">${S.s} = ${S.ex.toFixed(6)}</span><br>k/n → x, 1/n → dx, Σ → ∫ (k = 1~n이면 x는 0~1)`;
      } });
      const c = Q.ctrls(h);
      Q.select(c, '급수', ss.map(s => s.n), v => { k = v; P.redraw(); });
      Q.slider(c, { label: 'n', min: 1, max: 300, step: 1, value: 6, fmt: v => v }, v => { n = v; P.redraw(); });
      h.append(out);
    },
    guess: { q: '$\\displaystyle\\lim_{n\\to\\infty}\\sum_{k=1}^n\\frac1{n+k}$은?', opts: ['0', '$\\ln 2$', '$\\infty$', '1'], ans: 1, why: T`$\dfrac{1}{n+k}=\dfrac1n\cdot\dfrac{1}{1+k/n}$. 폭 $\frac1n$, 높이 $\frac1{1+x}$인 직사각형의 합이니까 $\int_0^1\frac{dx}{1+x}=\ln2$.` },
    theorem: T`<h4>정적분과 급수</h4>$$\int_a^bf(x)\,dx=\lim_{n\to\infty}\sum_{k=1}^nf(x_k)\Delta x\qquad\left(\Delta x=\frac{b-a}{n},\ x_k=a+k\Delta x\right)$$<h4>자주 쓰는 변환</h4><p>$\displaystyle\lim_{n\to\infty}\frac1n\sum_{k=1}^nf\!\left(\frac kn\right)=\int_0^1f(x)\,dx$</p><p>$\displaystyle\lim_{n\to\infty}\frac pn\sum_{k=1}^nf\!\left(a+\frac{pk}n\right)=\int_a^{a+p}f(x)\,dx$</p>`,
    proof: [T`$[a,b]$를 $n$등분하면 $k$번째 직사각형의 폭은 $\Delta x$, 높이는 $f(x_k)$.`, T`직사각형 넓이의 합 $\sum f(x_k)\Delta x$는 곡선 아래 넓이의 근삿값이야.`, T`$f$가 연속이면 $n\to\infty$일 때 이 합은 정적분 $F(b)-F(a)$로 수렴해.`],
    exam: [T`$\frac{3}{n}\sum f\!\left(1+\frac{2k}{n}\right)$: $\frac{2}{n}$이 $dx$니까 $\frac32\int_1^3f(x)\,dx$. 계수를 맞추는 게 핵심이야.`, T`$x=\frac kn$으로 둘지 $x=1+\frac kn$으로 둘지에 따라 구간과 함수가 같이 바뀌어. 어느 쪽으로 해도 답은 같아.`],
    probs: [
      { lv: 2, q: T`$\displaystyle\lim_{n\to\infty}\sum_{k=1}^n\frac1n\left(\frac kn\right)^2$의 값은?`, opts: [frac(1, 4), frac(1, 3), frac(1, 2), frac(2, 3), '1'], ans: 1, hints: [T`$\int_0^1x^2\,dx$`], sol: T`$\frac13$` },
      { lv: 3, q: T`$\displaystyle\lim_{n\to\infty}\sum_{k=1}^n\frac3n\left(1+\frac{2k}n\right)^2$의 값을 구하시오.`, ans: 13, hints: [T`$\frac3n=\frac32\cdot\frac2n$`, T`$\frac32\int_1^3x^2\,dx$`], sol: T`$\frac32\cdot\frac{27-1}3=13$` },
      { lv: 3, q: T`$\displaystyle\lim_{n\to\infty}\left(\frac1{n+1}+\frac1{n+2}+\cdots+\frac1{2n}\right)$의 값은?`, opts: ['0', '$\\frac12$', '$\\ln2$', '1', '$\\ln3$'], ans: 2, hints: [T`$\frac1n\cdot\frac{1}{1+k/n}$`], sol: T`$\int_0^1\frac{dx}{1+x}=\ln2$` }]
  },

  { id: 'c2-volume', title: '입체의 부피', who: '보나벤투라 카발리에리', year: '1635',
    card: T`단면의 넓이가 $S(x)$인 입체의 부피 $V=\displaystyle\int_a^bS(x)\,dx$`,
    mystery: T`<p>동전 더미를 옆으로 비스듬히 밀어도 부피는 그대로야. 동전 하나하나의 넓이가 같으니까. 카발리에리는 이 생각을 원리로 만들었어. 같은 높이의 단면 넓이가 같으면 부피도 같다.</p><p>그럼 단면이 계속 변하는 입체는? 아주 얇게 썰어서 조각의 부피를 더하면 돼. 넓이를 구할 때 직사각형을 쌓았던 것처럼.</p>`,
    try: '단면 모양을 고르고 조각 수 n을 키워 봐. 얇은 원판(또는 정사각형 판)의 부피 합이 정확한 부피에 가까워져.',
    sim(h, Q) {
      let n = 8, mode = 0; const f = Math.sqrt, a = 0, b = 4; const out = Q.readout(document.createElement('div'));
      const P = Q.plot(h, { xmin: -0.8, xmax: 5.2, ymin: -2.6, ymax: 2.6, aspect: 0.55, draw: P => {
        const c = P.c, ctx = P.ctx, k = 0.32, dx = (b - a) / n; let V = 0; P.grid({ labels: false });
        const ell = (x, r, fill, stroke) => { ctx.beginPath(); ctx.ellipse(P.X(x), P.Y(0), Math.abs(P.X(k * r) - P.X(0)), Math.abs(P.Y(r) - P.Y(0)), 0, 0, 7); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1.2; ctx.stroke(); } };
        const sq = (x, s, fill, stroke) => { const d = s * k * 0.7; ctx.beginPath(); ctx.moveTo(P.X(x), P.Y(0)); ctx.lineTo(P.X(x), P.Y(s)); ctx.lineTo(P.X(x + d), P.Y(s + d * 0.6)); ctx.lineTo(P.X(x + d), P.Y(d * 0.6)); ctx.closePath(); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1.2; ctx.stroke(); } };
        for (let i = 0; i < n; i++) { const x = a + i * dx, r = f(x + dx);
          if (mode === 0) { V += Math.PI * r * r * dx; P.rect(x, -r, x + dx, r, c.yF); ell(x + dx, r, c.bF, c.b); }
          else { V += r * r * dx; sq(x + dx, r, c.gF, c.g); P.rect(x, 0, x + dx, r, c.yF); } }
        if (mode === 0) { P.fn(f, c.p, 2.4, 0, b); P.fn(x => -f(x), c.p, 2.4, 0, b); } else P.fn(f, c.p, 2.4, 0, b);
        P.hline(0, c.axis, [], 1.2);
        const ex = mode === 0 ? 8 * Math.PI : 8;
        out.innerHTML = mode === 0 ? `y = √x (0 ≤ x ≤ 4)를 x축 둘레로 회전 · 단면은 반지름 √x인 원 → S(x) = πx<br>원판 ${n}개 부피 합 = <span class="y">${V.toFixed(4)}</span> → V = ∫₀⁴ πx dx = <span class="g">8π ≈ ${ex.toFixed(4)}</span>` : `밑면은 y = √x 아래 영역 · x축에 수직인 단면은 한 변 √x인 정사각형 → S(x) = x<br>판 ${n}개 부피 합 = <span class="y">${V.toFixed(4)}</span> → V = ∫₀⁴ x dx = <span class="g">8</span>`;
      } });
      const c = Q.ctrls(h);
      Q.select(c, '단면', ['회전체 (원판)', '정사각형 단면'], v => { mode = v; P.redraw(); });
      Q.slider(c, { label: '조각 수 n', min: 2, max: 80, step: 1, value: 8, fmt: v => v }, v => { n = v; P.redraw(); });
      h.append(out);
    },
    guess: { q: '$y=\\sqrt x$ $(0\\le x\\le4)$를 $x$축 둘레로 회전시킨 입체의 부피는?', opts: ['$4\\pi$', '$8\\pi$', '$16\\pi$', '$\\frac{16}3\\pi$'], ans: 1, why: T`단면은 반지름이 $\sqrt x$인 원이니까 넓이는 $\pi x$. $\int_0^4\pi x\,dx=8\pi$. 넓이 함수를 쌓으면 부피가 돼.` },
    theorem: T`<h4>입체도형의 부피</h4><p>$x$축에 수직인 평면으로 자른 단면의 넓이가 $S(x)$이면</p>$$V=\int_a^bS(x)\,dx$$<p>(회전체는 $S(x)=\pi\{f(x)\}^2$인 경우야. 2022 미적분Ⅱ는 일반적인 단면 넓이로 다뤄.)</p>`,
    proof: [T`$[a,b]$를 $n$등분하면 $k$번째 조각은 두께 $\Delta x$, 단면 넓이 약 $S(x_k)$인 얇은 판이야.`, T`판의 부피 $\approx S(x_k)\Delta x$. 전체 부피 $\approx\sum S(x_k)\Delta x$.`, T`$n\to\infty$이면 구분구적법에 의해 $\int_a^bS(x)\,dx$.`],
    exam: [T`"밑면이 어떤 영역이고 $x$축에 수직인 단면이 정사각형(정삼각형, 반원)인 입체": 단면 한 변의 길이를 $x$로 나타내는 게 핵심이야.`, T`정삼각형 단면이면 $S=\frac{\sqrt3}{4}s^2$, 반원이면 $S=\frac\pi8s^2$ (지름 $s$).`],
    probs: [
      { lv: 2, q: T`곡선 $y=\sqrt x$ $(0\le x\le4)$와 $x$축 사이의 영역을 $x$축 둘레로 회전시켜 만든 입체의 부피는?`, opts: ['$4\\pi$', '$8\\pi$', '$12\\pi$', '$16\\pi$', '$\\frac{32}{3}\\pi$'], ans: 1, hints: [T`$S(x)=\pi x$`], sol: T`$8\pi$` },
      { lv: 3, q: T`곡선 $y=\sqrt x$와 $x$축 및 직선 $x=4$로 둘러싸인 영역을 밑면으로 하고, $x$축에 수직인 평면으로 자른 단면이 모두 정사각형인 입체의 부피를 구하시오.`, ans: 8, hints: [T`한 변 $\sqrt x$, $S(x)=x$`], sol: T`$\int_0^4x\,dx=8$` },
      { lv: 3, q: T`높이가 $4$, 밑면의 반지름이 $3$인 원뿔을 꼭짓점에서 거리 $x$인 곳에서 밑면과 평행하게 자른 단면의 넓이는 $S(x)=\pi\left(\frac{3x}{4}\right)^2$이다. 이 원뿔의 부피는?`, opts: ['$9\\pi$', '$12\\pi$', '$16\\pi$', '$24\\pi$', '$36\\pi$'], ans: 1, hints: [T`$\int_0^4\frac{9\pi}{16}x^2\,dx$`], sol: T`$\frac{9\pi}{16}\cdot\frac{64}3=12\pi$` }]
  },

  { id: 'c2-arc', title: '속도와 거리, 곡선의 길이', who: '크리스토퍼 렌', year: '1658',
    card: T`평면 위의 운동: 움직인 거리 $=\displaystyle\int_a^b\sqrt{\left(\frac{dx}{dt}\right)^2+\left(\frac{dy}{dt}\right)^2}\,dt$`,
    mystery: T`<p>굽은 선의 길이는 자로 잴 수가 없어. 실을 대고 펴 보는 수밖에 없지. 그런데 건축가이자 수학자인 렌은 사이클로이드 한 아치의 길이가 정확히 <b>8</b>(바퀴 반지름의 8배)이라는 걸 증명했어. $\pi$도 없는 깔끔한 정수야.</p><p>방법은? 곡선을 짧은 직선(현)들로 쪼개서 길이를 더하는 거야.</p>`,
    try: '곡선을 고르고 현의 개수 n을 키워 봐. 꺾은선의 길이가 정확한 곡선의 길이에 가까워져.',
    sim(h, Q) {
      const cs = [{ n: '사이클로이드 한 아치 (반지름 1)', x: t => t - Math.sin(t), y: t => 1 - Math.cos(t), T: 2 * Math.PI, L: 8, s: '8', v: [-0.5, 6.8, -0.4, 2.6] }, { n: '반원 (반지름 2)', x: t => 2 * Math.cos(t), y: t => 2 * Math.sin(t), T: Math.PI, L: 2 * Math.PI, s: '2π', v: [-2.6, 2.6, -0.4, 2.4] }, { n: 'x = t², y = (2/3)t³ (0 ≤ t ≤ √3)', x: t => t * t, y: t => 2 / 3 * t ** 3, T: Math.sqrt(3), L: 14 / 3, s: '14/3', v: [-0.3, 3.5, -0.3, 3.8] }];
      let k = 0, n = 4; const out = Q.readout(document.createElement('div'));
      const P = Q.plot(h, { aspect: 0.5, draw: P => {
        const C = cs[k], c = P.c; [P.xmin, P.xmax, P.ymin, P.ymax] = C.v; const r = P.w / P.h, w = (P.ymax - P.ymin) * r, mx = (P.xmin + P.xmax) / 2; if (w > P.xmax - P.xmin) { P.xmin = mx - w / 2; P.xmax = mx + w / 2; } P.grid();
        P.curve(C.x, C.y, 0, C.T, c.b, 2.4); let L = 0, px = C.x(0), py = C.y(0); P.dot(px, py, c.y, 4);
        for (let i = 1; i <= n; i++) { const t = C.T * i / n, x = C.x(t), y = C.y(t); L += Math.hypot(x - px, y - py); P.seg(px, py, x, y, c.y, 2.2); if (n <= 60) P.dot(x, y, c.y, 3.5); px = x; py = y; }
        out.innerHTML = `${C.n}<br>현 ${n}개의 길이 합 = <span class="y">${L.toFixed(5)}</span> → 곡선의 길이 ∫ √(x′² + y′²) dt = <span class="g">${C.s} ≈ ${C.L.toFixed(5)}</span>`;
      } });
      const c = Q.ctrls(h);
      Q.select(c, '곡선', cs.map(c => c.n), v => { k = v; P.redraw(); });
      Q.slider(c, { label: '현의 개수 n', min: 1, max: 200, step: 1, value: 4, fmt: v => v }, v => { n = v; P.redraw(); });
      h.append(out); Q.note(h, '짧은 현의 길이는 √(Δx² + Δy²) = √((Δx/Δt)² + (Δy/Δt)²)·Δt. 이걸 더한 극한이 적분이야.');
    },
    guess: { q: '꺾은선의 길이는 곡선의 길이보다?', opts: ['항상 길다', '항상 짧거나 같다', '경우에 따라 다르다'], ans: 1, why: '두 점 사이의 최단 경로는 직선이라서, 각 현은 그 구간의 곡선보다 짧거나 같아. 현을 잘게 나눌수록 아래에서부터 곡선의 길이로 올라가.' },
    theorem: T`<h4>평면 위를 움직이는 점</h4><p>위치가 $(x(t),y(t))$일 때 속도는 $\left(\frac{dx}{dt},\frac{dy}{dt}\right)$, 속력은 $\sqrt{\left(\frac{dx}{dt}\right)^2+\left(\frac{dy}{dt}\right)^2}$.</p><p>$t=a$부터 $t=b$까지 움직인 거리 $=\displaystyle\int_a^b\sqrt{\left(\frac{dx}{dt}\right)^2+\left(\frac{dy}{dt}\right)^2}\,dt$</p><h4>곡선 $y=f(x)$의 길이</h4>$$l=\int_a^b\sqrt{1+\{f'(x)\}^2}\,dx$$`,
    proof: [T`<b>사이클로이드 한 아치</b> $x'=1-\cos t$, $y'=\sin t$.`, T`$x'^2+y'^2=2-2\cos t=4\sin^2\frac t2$.`, T`$0\le t\le2\pi$에서 $\sin\frac t2\ge0$이니까 속력 $=2\sin\frac t2$.`, T`$\int_0^{2\pi}2\sin\frac t2\,dt=\left[-4\cos\frac t2\right]_0^{2\pi}=4+4=8$.`],
    exam: [T`근호 안이 완전제곱식이 되도록 설계된 곡선이 나와. $1+f'^2=(\cdots)^2$ 꼴을 기대해.`, T`위치 벡터 문제: 속력 계산 → 정적분.`],
    probs: [
      { lv: 2, q: T`좌표평면 위를 움직이는 점의 시각 $t$에서의 위치가 $(3t,4t)$일 때, $t=0$부터 $t=2$까지 점이 움직인 거리를 구하시오.`, ans: 10, hints: ['속력 = √(9 + 16)'], sol: '5 × 2 = 10' },
      { lv: 3, q: T`점의 위치가 $x=t^2$, $y=\frac23t^3$일 때, $t=0$부터 $t=\sqrt3$까지 점이 움직인 거리는?`, opts: [frac(7, 3), '3', frac(14, 3), '6', frac(16, 3)], ans: 2, hints: [T`속력 $=\sqrt{4t^2+4t^4}=2t\sqrt{1+t^2}$`, T`$u=1+t^2$로 치환`], sol: T`$\left[\frac23(1+t^2)^{\frac32}\right]_0^{\sqrt3}=\frac23(8-1)=\frac{14}3$` },
      { lv: 4, q: T`사이클로이드 $x=t-\sin t$, $y=1-\cos t$ $(0\le t\le2\pi)$의 길이를 구하시오.`, ans: 8, hints: [T`$x'^2+y'^2=2-2\cos t$`, T`$=4\sin^2\frac t2$`], sol: T`$\int_0^{2\pi}2\sin\frac t2\,dt=8$` }]
  }]}]
});
})();
