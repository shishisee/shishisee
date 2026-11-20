/* 미적분 Ⅰ — 함수의 극한과 연속 · 미분 · 적분 */
QED.subject({
  id: 'c1', name: '미적분 Ⅰ', short: '미적분Ⅰ', color: '--yellow', exam: true,
  sub: '극한에서 출발해 미분과 적분까지. 변화를 수학으로 붙잡는 법',
  units: [
  { name: '함수의 극한과 연속', rooms: [

  { id: 'c1-limit', title: '함수의 극한', who: '오귀스탱 루이 코시', year: '1821',
    card: T`$x$가 $a$에 한없이 가까워질 때 $f(x)$가 $L$에 한없이 가까워지면 $\displaystyle\lim_{x\to a}f(x)=L$`,
    mystery: T`<p>$f(x)=\dfrac{x^2-1}{x-1}$에 $x=1$을 넣으면 $\dfrac00$이 돼.</p><p>계산이 안 되니까 <b>$f(1)$은 없어.</b></p><p>그런데 1에 아주 가까운 수를 넣으면 값이 <b>한 곳으로 몰려가.</b></p><p>도착할 수 없는 곳의 값을 알아내는 방법, 그게 오늘 배울 <b>극한</b>이야.</p>`,
    try: '카드를 한 장씩 넘기면서 <b>한 걸음 더</b> 버튼만 눌러 봐. 두 친구가 x = a를 향해 걸어가고, 머리 위 말풍선에 지금 위치의 값이 떠.',
    sim(h, Q) {
      const fx = x => (x * x - 1) / (x - 1), sx = x => Math.sign(x);
      Q.cards(h, [
        { tab: '온도', title: '몸풀기: 섭씨와 화씨', text: T`<p>섭씨 $x$℃를 화씨로 바꾸면 $f(x)=1.8x+32$ ℉야.</p><p>섭씨가 <b>0℃에 가까워지면</b> 화씨는 몇 ℉에 가까워질까?</p>`,
          build: b => Q.walker(b, { f: x => 1.8 * x + 32, a: 0, left: [-5, -1, -0.1, -0.01, -0.001], right: [5, 1, 0.1, 0.01, 0.001], view: () => [-6.5, 6.5, 18, 46], axisLabels: ['섭씨 ℃', '화씨 ℉'], sayL: '32℉ 근처!', sayR: '나도 32℉!',
            conclusion: T`<p>양쪽에서 다가가도 <b>32℉</b>로 모여.</p><p>이렇게 쓰고 "리미트"라고 읽어: $\displaystyle\lim_{x\to0}(1.8x+32)=32$</p>` }) },
        { tab: '구멍', title: '구멍 난 그래프', text: T`<p>$\dfrac{x^2-1}{x-1}$은 $x\ne1$이면 약분해서 $x+1$과 똑같아.</p><p>그래서 그래프는 직선인데, <b>$x=1$ 자리에만 구멍(○)</b>이 뚫려 있어.</p><p>두 친구가 구멍을 향해 걸어가면 높이는 어떻게 될까?</p>`,
          build: b => Q.walker(b, { f: fx, a: 1, left: [0, 0.9, 0.99, 0.999, 0.9999], right: [2, 1.1, 1.01, 1.001, 1.0001], view: () => [-0.6, 2.6, -0.4, 3.6], sayL: '2에 가까워!', sayR: '나도 2!', altLabel: '구멍 메운 x+1과 비교',
            draw: (P, c, alt) => { P.fn(x => x + 1, c.b, 3); if (alt) { P.dot(1, 2, c.g, 7); P.text(1, 2, 'x+1이면 f(1) = 2', c.g, 'center', 0, 30, 13); } else { P.dot(1, 2, c.board, 7); P.dot(1, 2, c.r, 7, true); P.text(1, 2, '구멍: f(1) 없음', c.r, 'center', 0, 30, 13); } },
            conclusion: T`<p>양쪽 친구 모두 높이 <b>2</b>로 모여: $\displaystyle\lim_{x\to1}\frac{x^2-1}{x-1}=2$</p><p>$f(1)$은 없는데도 극한값은 있어.</p><p>극한은 <span class="nw">"그 점에 도착"</span>이 아니라 <b class="nw">"그 점 근처로 다가가기"</b>에 관한 이야기야.</p>` }) },
        { tab: '끝없이 멀리', title: '끝없이 멀리 가면 (x → ∞)', text: T`<p>이번엔 오른쪽 친구가 $y=\dfrac1x$ 위를 <b>끝없이 오른쪽으로</b> 걸어가.</p><p>$x$가 10, 100, 1000…으로 커지면 높이는?</p>`,
          build: b => Q.walker(b, { f: x => 1 / x, right: [1, 10, 100, 1000, 10000, 100000], view: s => [-s.rx * 0.08, s.rx * 1.3, -0.25, 1.25], sayR: '바닥(0)에 붙을 것 같아…', grid: { labels: true },
            draw: (P, c) => P.fn(x => 1 / x, c.b, 3, 1e-9, P.xmax),
            conclusion: T`<p>높이는 <b>0</b>에 한없이 가까워져: $\displaystyle\lim_{x\to\infty}\frac1x=0$</p><p>$\infty$(무한대)는 수가 아니야. <b>한없이 커지는 상태</b>를 나타내는 기호야.</p>` }) },
        { tab: '하늘로', title: '하늘로 날아가면 (발산)', text: T`<p>$y=\dfrac1{x^2}$에서 두 친구가 $x=0$을 향해 걸어가.</p><p>0에 가까워질수록 높이는 어떻게 될까?</p>`,
          build: b => Q.walker(b, { f: x => 1 / (x * x), a: 0, left: [-1, -0.5, -0.2, -0.1, -0.03], right: [1, 0.5, 0.2, 0.1, 0.03], view: s => { const y = 1 / (s.rx * s.rx); return [-1.4, 1.4, -0.08 * y * 1.4, y * 1.45]; }, sayL: '끝이 없어~!', sayR: '계속 올라가!',
            draw: (P, c) => { P.fn(x => 1 / (x * x), c.b, 3, P.xmin, -1e-9); P.fn(x => 1 / (x * x), c.b, 3, 1e-9, P.xmax); },
            conclusion: T`<p>한 곳으로 모이지 않고 <b>한없이 커져.</b> 이걸 <b>발산</b>이라고 해.</p><p>$\displaystyle\lim_{x\to0}\frac1{x^2}=\infty$라고 쓰지만, 극한값이 있다는 뜻이 아니야. 극한값은 <b>없어.</b></p>` }) },
        { tab: '계단', title: '왼쪽과 오른쪽이 다르면', text: T`<p>스위치를 켜면 0에서 1로 확 바뀌는 <b>계단 함수</b>야.</p><p>$x<0$이면 $f(x)=0$이고, $x\ge0$이면 $f(x)=1$이야.</p><p>양쪽에서 0으로 다가가면?</p>`,
          build: b => Q.walker(b, { f: x => x >= 0 ? 1 : 0, a: 0, left: [-1, -0.1, -0.01, -0.001], right: [1, 0.1, 0.01, 0.001], view: () => [-1.4, 1.4, -0.5, 1.9], sayL: '나는 0이야!', sayR: '아니, 1이야!',
            draw: (P, c) => { P.seg(P.xmin, 0, 0, 0, c.b, 3); P.seg(0, 1, P.xmax, 1, c.b, 3); P.dot(0, 0, c.b, 6, true); P.dot(0, 1, c.b, 6); },
            conclusion: T`<p>왼쪽에서 다가간 값 <b>좌극한</b>은 $\displaystyle\lim_{x\to0-}f(x)=0$이야.</p><p>오른쪽에서 다가간 값 <b>우극한</b>은 $\displaystyle\lim_{x\to0+}f(x)=1$이야.</p><p>둘이 <b>다르니까</b> $\displaystyle\lim_{x\to0}f(x)$는 존재하지 않아.</p>` }) }
      ]);
    },
    guess: { q: T`$x\to1$일 때 $\dfrac{x^2-1}{x-1}$은 어떻게 될까?`, opts: ['$x=1$에서 정의가 안 되니까 극한도 없다', '2에 한없이 가까워진다', '0에 가까워진다', '1에 가까워진다'], ans: 1,
      why: T`약분하면 $x+1$이니까 2로 다가가. 극한은 $x=1$ <b>근처</b>만 보니까 $f(1)$이 없어도 괜찮아.` },
    theorem: T`<h4>수렴과 극한값</h4><p>$x$가 $a$가 아니면서 $a$에 한없이 가까워질 때 $f(x)$가 일정한 수 $L$에 한없이 가까워지면, $f(x)$는 $L$에 <b>수렴</b>한다고 해.</p>$$\lim_{x\to a}f(x)=L$$<p>$x\to\infty$, $x\to-\infty$일 때도 같은 방식으로 써.</p><h4>발산</h4><p>수렴하지 않으면 <b>발산</b>해. 한없이 커지면 $\lim f(x)=\infty$라고 써.</p><h4>좌극한과 우극한</h4><p>$x\to a-$는 왼쪽에서, $x\to a+$는 오른쪽에서 다가가는 거야.</p>$$\lim_{x\to a}f(x)=L \iff \lim_{x\to a-}f(x)=\lim_{x\to a+}f(x)=L$$`,
    proof: [T`$x\to1$이면 $x\ne1$이니까 $x-1\ne0$이야. 그래서 약분할 수 있어.`, T`$\dfrac{x^2-1}{x-1}=\dfrac{(x-1)(x+1)}{x-1}=x+1\quad(x\ne1)$`, T`$x+1$은 $x\to1$일 때 $2$에 한없이 가까워진다.`, T`따라서 $\displaystyle\lim_{x\to1}\frac{x^2-1}{x-1}=2$. $f(1)$이 없다는 사실과는 상관없어.`],
    deeper: T`<p>극한값과 함숫값은 다른 개념이야.</p><p>함숫값이 없어도 극한값은 있을 수 있어(구멍).</p><p>함숫값이 있어도 극한값은 없을 수 있어(계단).</p><p>둘이 같을 때를 <b>연속</b>이라고 불러. 다음다음 연구실 주제야.</p>`,
    exam: [T`그래프를 주고 $\displaystyle\lim_{x\to a-}f(x)+\lim_{x\to b+}f(x)$를 묻는 2점 문제. 열린 점(○)과 닫힌 점(●)을 헷갈리지 마.`, T`구간별 함수에서 "극한값이 존재하도록 하는 $a$": 좌극한 = 우극한으로 방정식을 세워.`, T`$|x-a|$가 들어간 식은 $x\to a+$와 $x\to a-$로 나눠서 부호를 정해.`],
    probs: [
      { lv: 2, q: T`$\displaystyle\lim_{x\to2}\frac{x^2-4}{x-2}$의 값을 구하시오.`, ans: 4, hints: ['분자를 인수분해해 봐.', T`$x^2-4=(x-2)(x+2)$`], sol: T`$\dfrac{(x-2)(x+2)}{x-2}=x+2\to4$` },
      { lv: 2, q: T`$\displaystyle\lim_{x\to\infty}\left(\frac1x+1\right)$의 값을 구하시오.`, ans: 1, hints: [T`$\frac1x\to0$`], sol: T`$0+1=1$` },
      { lv: 3, q: T`함수 $f(x)=\begin{cases}x+a&(x<1)\\x^2+3&(x\ge1)\end{cases}$에 대하여 $\displaystyle\lim_{x\to1}f(x)$의 값이 존재하도록 하는 상수 $a$의 값을 구하시오.`, ans: 3, hints: ['좌극한과 우극한을 각각 구해.', T`좌극한 $=1+a$, 우극한 $=4$`], sol: T`$1+a=4$이므로 $a=3$.` },
      { lv: 3, q: T`$\displaystyle\lim_{x\to1+}\frac{x^2-x}{|x-1|}+\lim_{x\to1-}\frac{x^2-x}{|x-1|}$의 값을 구하시오.`, ans: 0, hints: [T`분자는 $x(x-1)$이야.`, T`$x>1$이면 $|x-1|=x-1$, $x<1$이면 $|x-1|=-(x-1)$`], sol: T`우극한은 $x\to1$, 좌극한은 $-x\to-1$. 합은 $0$.` }]
  },

  { id: 'c1-limitcalc', title: '극한의 계산과 샌드위치', who: '크니도스의 에우독소스', year: '기원전 4세기',
    card: T`$g(x)\le f(x)\le h(x)$이고 $\lim g=\lim h=L$이면 $\lim f=L$`,
    mystery: T`<p>$x$가 엄청 커질 때 $\dfrac{3x^2+5x}{x^2+1}$은 어떻게 될까? 분자도 무한대, 분모도 무한대야. 무한대끼리 나누면 몇이 될까?</p><p>또 $x^2\sin\dfrac1x$는 0 근처에서 미친 듯이 진동해. 그런데도 극한이 있을까? 고대 그리스의 에우독소스는 직접 계산하기 어려운 값을 양쪽에서 <b>포위</b>해서 잡아냈어.</p>`,
    try: '"최고차항의 싸움"에서 분자 차수를 1, 2, 3으로 바꿔가며 x를 크게 키워 봐. 그다음 "샌드위치"에서 확대해 봐.',
    sim(h, Q) {
      let mode = 0, m = 2, X = 10, z = 1; const out = Q.readout(document.createElement('div'));
      const f = x => (3 * x ** m + 5 * x) / (x * x + 1), g = x => x === 0 ? 0 : x * x * Math.sin(1 / x);
      const P = Q.plot(h, { draw: P => {
        const c = P.c;
        if (mode === 0) {
          const ys = [0, 1, 2, 3].map(i => f(X * i / 3)); const top = m === 2 ? 6 : Math.max(6, ...ys) * 1.1;
          P.xmin = -X * 0.04; P.xmax = X; P.ymin = -top * 0.08; P.ymax = top; P.grid();
          if (m === 2) P.hline(3, c.y, [6, 5], 1.6); P.fn(f, c.b, 2.5, 0, X); P.dot(X * 0.98, f(X * 0.98), c.y, 6);
          const lim = m < 2 ? '0' : m === 2 ? '3' : '∞';
          out.innerHTML = `f(x) = (3x<sup>${m}</sup> + 5x) / (x² + 1)<br>x = ${X.toFixed(0)} 일 때 f(x) = <span class="y">${f(X).toFixed(5)}</span><br>분자 ${m}차 vs 분모 2차 → ${m < 2 ? '분모가 이김 → 0으로' : m === 2 ? '무승부 → 최고차항 계수의 비 3/1 = 3' : '분자가 이김 → 발산'} : lim = <span class="g">${lim}</span>`;
        } else {
          const w = 1 / z; P.xmin = -w; P.xmax = w; P.ymin = -w * w * 1.3; P.ymax = w * w * 1.3; P.grid({ labels: false });
          P.fn(x => x * x, c.p, 1.8, P.xmin, P.xmax, [6, 4]); P.fn(x => -x * x, c.p, 1.8, P.xmin, P.xmax, [6, 4]); P.fn(g, c.b, 2);
          out.innerHTML = `<span class="p">−x² ≤ </span><span class="b">x² sin(1/x)</span><span class="p"> ≤ x²</span>  (sin은 −1과 1 사이니까)<br>확대 ${z.toFixed(0)}배: 화면 폭 ±${w.toPrecision(2)}<br>위아래 빵(±x²)이 0으로 조여 오니까 가운데 속도 0으로 → lim<sub>x→0</sub> x² sin(1/x) = <span class="g">0</span>`;
        }
      } });
      const c = Q.ctrls(h);
      Q.select(c, '실험', ['∞/∞ · 최고차항의 싸움', '샌드위치 · 진동을 가두기'], v => { mode = v; s1.el.closest('label').hidden = s2.el.closest('label').hidden = v === 1; s3.el.closest('label').hidden = v === 0; P.redraw(); });
      const s1 = Q.slider(c, { label: '분자 차수', min: 1, max: 3, step: 1, value: 2, fmt: v => v + '차' }, v => { m = v; P.redraw(); });
      const s2 = Q.slider(c, { label: 'x 최대', min: 1, max: 4, step: 0.01, value: 1, fmt: v => Math.round(10 ** v) }, v => { X = 10 ** v; P.redraw(); });
      const s3 = Q.slider(c, { label: '확대', min: 0, max: 2.5, step: 0.01, value: 0, fmt: v => Math.round(10 ** v) + '배' }, v => { z = 10 ** v; P.redraw(); });
      s3.el.closest('label').hidden = true; h.append(out);
    },
    guess: { q: T`$\displaystyle\lim_{x\to\infty}\frac{2x^2+5x}{x^2-3}$은?`, opts: ['0', '2', '∞', '5'], ans: 1, why: T`분자와 분모를 $x^2$으로 나누면 $\dfrac{2+5/x}{1-3/x^2}\to\dfrac21=2$. 차수가 같으면 <b>최고차항 계수의 비</b>가 극한값이야.` },
    theorem: T`<h4>극한의 성질</h4><p>$\lim f=\alpha,\ \lim g=\beta$(실수)이면 $\lim(f\pm g)=\alpha\pm\beta$, $\lim fg=\alpha\beta$, $\lim\dfrac fg=\dfrac\alpha\beta\ (\beta\ne0)$.</p><h4>대소 관계 (샌드위치)</h4><p>$a$ 근처에서 $g(x)\le f(x)\le h(x)$이고 $\lim g=\lim h=L$이면 $\lim f=L$.</p><h4>자주 쓰는 꼴</h4><p>$\frac00$ 꼴은 인수분해·유리화로 약분하고, $\frac\infty\infty$ 꼴은 분모의 최고차항으로 나누고, $\infty-\infty$ 꼴은 유리화해서 $\frac\infty\infty$ 꼴로 바꿔.</p>`,
    proof: [T`$\lim_{x\to\infty}(\sqrt{x^2+6x}-x)$는 $\infty-\infty$ 꼴이야.`, T`분자·분모에 $\sqrt{x^2+6x}+x$를 곱하면 $\dfrac{6x}{\sqrt{x^2+6x}+x}$.`, T`분자·분모를 $x$로 나누면 $\dfrac{6}{\sqrt{1+6/x}+1}$.`, T`$x\to\infty$이면 $\dfrac{6}{1+1}=3$.`],
    exam: [T`$\displaystyle\lim_{x\to a}\frac{g(x)}{x-a}$가 수렴한다는 조건이 있으면 <b>(분모→0) ⇒ (분자→0)</b>. 미정계수 문제의 출발점이야.`, T`다항함수 결정: $\lim_{x\to\infty}\frac{f(x)}{x^2}=1$은 최고차항, $\lim_{x\to0}\frac{f(x)}{x}=3$은 $f(0)=0$과 일차항 정보.`, T`샌드위치: 부등식이 주어지면 양쪽 극한이 같은지 확인해.`],
    probs: [
      { lv: 2, q: T`$\displaystyle\lim_{x\to\infty}\frac{4x^2-x}{2x^2+3}$의 값을 구하시오.`, ans: 2, hints: [T`분모의 최고차항 $x^2$으로 나눠.`], sol: T`$\dfrac{4-1/x}{2+3/x^2}\to2$` },
      { lv: 3, q: T`$\displaystyle\lim_{x\to\infty}\left(\sqrt{x^2+6x}-x\right)$의 값을 구하시오.`, ans: 3, hints: ['유리화!', T`$\dfrac{6x}{\sqrt{x^2+6x}+x}$`], sol: T`위의 증명 그대로 $3$.` },
      { lv: 4, q: T`$\displaystyle\lim_{x\to1}\frac{x^2+ax+b}{x-1}=5$일 때, 상수 $a,b$에 대하여 $a-b$의 값을 구하시오.`, ans: 7, hints: [T`분모 $\to0$인데 수렴하니까 분자도 $\to0$: $1+a+b=0$.`, T`분자 $=(x-1)(x-r)$로 두면 극한은 $1-r$.`], sol: T`$1-r=5$이므로 $r=-4$. 분자 $=(x-1)(x+4)=x^2+3x-4$이니까 $a=3,\ b=-4$, $a-b=7$.` },
      { lv: 3, q: T`함수 $f(x)$가 모든 양수 $x$에 대하여 $2-\dfrac1x\lt f(x)<2+\dfrac3x$를 만족시킬 때, $\displaystyle\lim_{x\to\infty}\frac{xf(x)}{x+3}$의 값을 구하시오.`, ans: 2, hints: [T`샌드위치로 $\lim f(x)$부터 구해.`, T`$\frac{x}{x+3}\to1$`], sol: T`$\lim f(x)=2$이고 $\frac{x}{x+3}\to1$이니까 $2\cdot1=2$.` }]
  },

  { id: 'c1-epsilon', title: 'ε-δ 결투', who: '카를 바이어슈트라스', year: '1861',
    card: T`모든 $\varepsilon>0$에 대해 어떤 $\delta>0$가 있어서 $0<|x-a|<\delta\Rightarrow|f(x)-L|<\varepsilon$`,
    mystery: T`<p>"한없이 가까워진다"는 말은 너무 애매해. 얼마나 가까워야 "한없이"일까? 19세기 수학자들은 이 애매함 때문에 틀린 정리를 증명하기도 했어.</p><p>바이어슈트라스는 극한을 <b>게임</b>으로 바꿨어. 상대가 "오차 ε 안에 들어와 봐"라고 도전하면 나는 "x를 a에서 δ 이내로만 잡으면 돼"라고 답해야 해. 상대가 어떤 ε을 내밀어도 이길 수 있으면 극한값이 맞는 거야.</p>`,
    try: 'δ 슬라이더로 파란 띠의 폭을 정하고 "δ 제출"을 눌러. 그래프 조각이 노란 띠 안에 완전히 들어가면 이겨. 그다음 "가짜 극한 1.2"로 바꿔서 도전해 봐.',
    sim(h, Q) {
      const f = x => x * x, a = 1, eps = [1, 0.5, 0.2, 0.1, 0.05, 0.01]; let L = 1, r = 0, d = 0.3, res = '', wins = 0;
      const ok = () => { for (let i = 1; i <= 400; i++) { const x = a - d + 2 * d * i / 401; if (Math.abs(x - a) < 1e-12) continue; if (Math.abs(f(x) - L) >= eps[r]) return false; } return true; };
      const out = Q.readout(document.createElement('div'));
      const P = Q.plot(h, { draw: P => {
        const e = eps[r], c = P.c, wx = Math.max(e * 1.3, 0.02), good = ok();
        P.xmin = a - wx; P.xmax = a + wx; P.ymin = L - e * 2.4; P.ymax = L + e * 2.4; P.grid();
        P.rect(P.xmin, L - e, P.xmax, L + e, c.yF); P.rect(a - d, P.ymin, a + d, P.ymax, c.bF);
        P.hline(L, c.y, [6, 4]); P.vline(a, c.b, [6, 4]);
        P.fn(f, c.muted, 1.5); P.fn(f, good ? c.g : c.r, 3.5, a - d, a + d); P.dot(a, f(a), c.chalk, 4, true);
        out.innerHTML = `라운드 ${r + 1}/${eps.length} · 상대의 도전: <span class="y">ε = ${e}</span> · 주장하는 극한값 L = ${L}<br>나의 δ = <span class="b">${d.toPrecision(3)}</span> → 지금은 ${good ? '<span class="g">띠 안에 들어와 있음</span>' : '<span class="r">띠를 벗어난 부분이 있음</span>'}<br>${res}`;
      } });
      const c = Q.ctrls(h);
      const sd = Q.slider(c, { label: 'δ', min: -3.5, max: 0, step: 0.005, value: Math.log10(0.3), fmt: v => (10 ** v).toPrecision(3) }, v => { d = 10 ** v; P.redraw(); });
      Q.button(c, 'δ 제출', () => {
        if (ok()) { wins++; res = r < eps.length - 1 ? `<span class="g">방어 성공!</span> 상대가 ε을 더 줄인다…` : `<span class="g">모든 ε을 막아냈어.</span> 어떤 ε이 와도 δ를 찾을 수 있다는 것, 이게 극한값의 정확한 의미야.`; if (r < eps.length - 1) r++; }
        else res = `<span class="r">실패.</span> δ를 더 줄여 봐.${L !== 1 && eps[r] <= 0.2 ? ' …그런데 아무리 줄여도 안 되지? 극한값이 1.2가 아니니까.' : ''}`;
        P.redraw();
      }, 'primary');
      Q.select(c, '주장', ['진짜 극한 L = 1', '가짜 극한 L = 1.2'], v => { L = v ? 1.2 : 1; r = 0; res = ''; P.redraw(); });
      Q.button(c, '처음부터', () => { r = 0; res = ''; sd.set(Math.log10(0.3)); });
      h.append(out); Q.note(h, 'f(x) = x², a = 1. 노란 띠는 |f(x) − L| < ε, 파란 띠는 |x − 1| < δ야.');
    },
    guess: { q: '상대가 ε을 점점 작게 주면, 내가 고르는 δ는?', opts: ['더 커져야 한다', '더 작아져야 한다', 'ε과 상관없다'], ans: 1, why: T`오차 허용 범위가 좁아질수록 $x$도 $a$에 더 바짝 붙여야 해. $f(x)=x^2$, $a=1$에서는 $\delta\approx\varepsilon/2$ 정도. 기울기가 2라서 그래.` },
    theorem: T`<h4>정의 · ε-δ 극한 (교과서 밖, 대학 해석학의 첫 장)</h4><p>$\displaystyle\lim_{x\to a}f(x)=L$이란 다음과 같아.</p><p>임의의 $\varepsilon>0$에 대하여 어떤 $\delta>0$가 존재해서 $0<|x-a|<\delta$이면 $|f(x)-L|<\varepsilon$.</p><p>교과서의 "한없이 가까워진다"를 정확하게 쓴 말이야. 수능에는 직접 나오지 않지만 극한 문제를 볼 때 생각의 기준이 돼.</p>`,
    proof: [T`목표는 $\lim_{x\to2}(3x+1)=7$을 ε-δ로 증명하는 거야.`, T`$|f(x)-7|=|3x-6|=3|x-2|$.`, T`$3|x-2|<\varepsilon$이 되려면 $|x-2|<\varepsilon/3$이면 충분해.`, T`그러니까 $\delta=\varepsilon/3$으로 잡으면 어떤 $\varepsilon$이 와도 이겨.`],
    exam: [T`수능에 ε-δ가 직접 나오지는 않아. 대신 "그래프가 $y=L$ 근처에 머무는가"를 판단하는 감각이 극한 그래프 문제의 바탕이 돼.`],
    probs: [
      { lv: 3, q: T`$f(x)=3x+1$, $a=2$, $L=7$일 때, $\varepsilon=0.06$에 대하여 $0<|x-2|<\delta \Rightarrow |f(x)-7|<0.06$을 만족시키는 $\delta$의 최댓값을 구하시오.`, ans: 0.02, hints: [T`$|f(x)-7|=3|x-2|$`], sol: T`$3\delta\le0.06$이니까 $\delta=0.02$.` },
      { lv: 4, q: T`$f(x)=x^2$, $a=1$, $L=1$일 때, $\varepsilon=0.21$에 대하여 조건을 만족시키는 $\delta$의 최댓값을 구하시오.`, ans: 0.1, hints: [T`$|x^2-1|<0.21 \iff 0.79\lt x^2<1.21$`, T`오른쪽 여유는 $\sqrt{1.21}-1$, 왼쪽 여유는 $1-\sqrt{0.79}$. 둘 중 작은 쪽이 답이야.`], sol: T`$\sqrt{1.21}-1=0.1$, $1-\sqrt{0.79}\approx0.111$. 더 작은 값은 $0.1$.` }]
  },

  { id: 'c1-cont', title: '함수의 연속', who: '베른하르트 볼차노', year: '1817',
    card: T`$\displaystyle\lim_{x\to a}f(x)=f(a)$이면 $f$는 $x=a$에서 연속`,
    mystery: T`<p>연필을 종이에서 떼지 않고 그릴 수 있는 그래프를 "연속"이라고 부르는 건 직관이야. 그런데 이걸 컴퓨터가 판단하게 하려면 어떻게 말해야 할까?</p><p>볼차노는 "끊기지 않는다"를 <b>극한</b>으로 번역했어. 그 번역은 체크리스트 세 줄이면 충분해.</p>`,
    try: '슬라이더를 움직여서 두 조각이 이어지는 순간을 찾아. 읽음판의 체크리스트 세 줄이 모두 ✓가 될 때가 연속이야.',
    sim(h, Q) {
      let sc = 0, a = 2, k = 1; const out = Q.readout(document.createElement('div'));
      const P = Q.plot(h, { xmin: -1, xmax: 4, ymin: -1, ymax: 7, draw: P => {
        const c = P.c; P.grid();
        let left, right, val, x0;
        if (sc === 0) { x0 = 1; const fl = x => a * x + 1, fr = x => x * x - 2 * x + 3; left = fl(1); right = fr(1); val = fr(1);
          P.fn(fl, c.b, 2.5, P.xmin, 1); P.fn(fr, c.b, 2.5, 1, P.xmax); P.dot(1, left, c.b, 5, true); P.dot(1, val, c.y, 6); }
        else { x0 = 2; const g = x => x + 2; left = right = 4; val = k; P.fn(g, c.b, 2.5); P.dot(2, 4, c.b, 6, true); P.dot(2, k, c.y, 6); }
        const lim = Math.abs(left - right) < 1e-9, eq = lim && Math.abs(left - val) < 1e-9;
        P.vline(x0, c.muted);
        out.innerHTML = `① f(${x0}) 정의됨: <span class="g">✓</span> (f(${x0}) = ${val.toFixed(2)})<br>② 극한 존재: 좌극한 ${left.toFixed(2)}, 우극한 ${right.toFixed(2)} → ${lim ? '<span class="g">✓</span>' : '<span class="r">✗</span>'}<br>③ 극한값 = 함숫값: ${eq ? '<span class="g">✓</span>' : '<span class="r">✗</span>'}<br>${eq ? '<span class="g">x = ' + x0 + '에서 연속!</span>' : '<span class="r">불연속</span>'}`;
      } });
      const c = Q.ctrls(h);
      Q.select(c, '상황', ['조각 함수: ax+1 | x²−2x+3', '구멍 메우기: (x²−4)/(x−2), f(2)=k'], v => { sc = v; s1.el.closest('label').hidden = v === 1; s2.el.closest('label').hidden = v === 0; P.redraw(); });
      const s1 = Q.slider(c, { label: 'a', min: -2, max: 4, step: 0.1, value: 2, fmt: v => v.toFixed(1) }, v => { a = Math.round(v * 10) / 10; P.redraw(); });
      const s2 = Q.slider(c, { label: 'k = f(2)', min: 0, max: 6, step: 0.1, value: 1, fmt: v => v.toFixed(1) }, v => { k = Math.round(v * 10) / 10; P.redraw(); });
      s2.el.closest('label').hidden = true; h.append(out);
    },
    guess: { q: T`$x=a$에서 연속이 되기 위한 세 조건: ① $f(a)$가 정의된다, ② $\lim_{x\to a}f(x)$가 존재한다, ③ ____`, opts: [T`$\lim_{x\to a}f(x)=f(a)$`, T`$f'(a)$가 존재한다`, T`$f(a)>0$`], ans: 0, why: '극한값(가려는 곳)과 함숫값(실제 있는 곳)이 같아야 끊김이 없어. 미분가능성은 연속보다 더 강한 조건이야.' },
    theorem: T`<h4>정의 · 연속</h4><p>함수 $f$가 다음 세 조건을 만족시키면 $x=a$에서 <b>연속</b>이라고 해.</p><p>(i) $f(a)$가 정의되어 있다. (ii) $\lim_{x\to a}f(x)$가 존재한다. (iii) $\lim_{x\to a}f(x)=f(a)$</p><p>어떤 구간의 모든 점에서 연속이면 그 구간에서 <b>연속함수</b>야.</p><h4>연속함수의 성질</h4><p>$f,g$가 $x=a$에서 연속이면 $f\pm g$, $cf$, $fg$, $\dfrac fg\ (g(a)\ne0)$도 연속이야. 그래서 다항함수는 실수 전체에서, 유리함수는 정의역에서 연속이야.</p>`,
    proof: [T`$f,g$가 $a$에서 연속이면 $\lim f=f(a)$, $\lim g=g(a)$.`, T`극한의 성질에 의해 $\lim(fg)=\lim f\cdot\lim g=f(a)g(a)=(fg)(a)$.`, T`그래서 $fg$도 연속. 연속의 성질은 극한의 성질에서 바로 나와.`],
    exam: [T`$f(x)g(x)$가 연속이 되는 조건: $f$가 불연속인 점에서 $g(a)=0$이면 곱이 연속이 될 수 있어. 4점 단골이야.`, T`$\dfrac{\cdots}{x-a}$ 꼴 함수가 연속이려면 분자를 $(x-a)$로 인수분해한 뒤 함숫값을 맞춰.`],
    probs: [
      { lv: 3, q: T`함수 $f(x)=\begin{cases}\dfrac{x^2+ax-3}{x-1}&(x\ne1)\\[2pt] b&(x=1)\end{cases}$가 실수 전체에서 연속일 때, $a+b$의 값을 구하시오.`, ans: 6, hints: [T`분모 $\to0$이니까 분자도 $\to0$: $1+a-3=0$.`, T`$a=2$이면 분자 $=(x-1)(x+3)$`], sol: T`$a=2$, $b=\lim(x+3)=4$, $a+b=6$.` },
      { lv: 4, q: T`$f(x)=\begin{cases}x+2&(x<1)\\x^2+5&(x\ge1)\end{cases}$, $g(x)=x-b$일 때, $f(x)g(x)$가 $x=1$에서 연속이 되도록 하는 상수 $b$의 값을 구하시오.`, ans: 1, hints: [T`$f$는 $x=1$에서 끊겨 있어(좌 3, 우 6).`, T`좌극한 $3(1-b)$, 우극한과 함숫값 $6(1-b)$`], sol: T`$3(1-b)=6(1-b)$이니까 $b=1$. $g(1)=0$이 끊김을 메워 줘.` }]
  },

  { id: 'c1-ivt', title: '사잇값 정리와 최대·최소 정리', who: '볼차노 · 바이어슈트라스', year: '1817 · 1860',
    card: T`$f$가 $[a,b]$에서 연속이고 $f(a)f(b)<0$이면 $f(c)=0$인 $c\in(a,b)$가 있다`,
    mystery: T`<p>아침 7시에 산 아래서 출발해서 저녁에 정상에 도착했어. 다음 날 아침 7시에 정상에서 출발해서 같은 길로 내려왔어. 이틀 동안 <b>같은 시각에 같은 장소</b>에 있었던 지점이 반드시 있을까?</p><p>답은 "있다"야. 이유는 연속이라는 성질 하나뿐이고, 증명은 놀랄 만큼 간단해.</p>`,
    try: '"반으로 자르기"를 계속 눌러서 x³ − x − 1 = 0의 근을 포위해. 아래 k 슬라이더로는 y = k가 그래프와 꼭 만나는지 확인해.',
    sim(h, Q) {
      const f = x => x ** 3 - x - 1; let A = 1, B = 2, steps = [], k = 2; const out = Q.readout(document.createElement('div'));
      const P = Q.plot(h, { xmin: -0.3, xmax: 2.3, ymin: -2.5, ymax: 6, draw: P => {
        const c = P.c; P.grid(); P.rect(A, P.ymin, B, P.ymax, c.yF);
        P.fn(f, c.b, 2.5); P.seg(0, k, 2, k, c.p, 1.6, [6, 4]);
        for (let i = 0, n = 2000; i < n; i++) { const x0 = 2 * i / n, x1 = 2 * (i + 1) / n; if ((f(x0) - k) * (f(x1) - k) <= 0) P.dot((x0 + x1) / 2, k, c.p, 5); }
        P.dot(A, f(A), f(A) < 0 ? c.r : c.g, 6); P.dot(B, f(B), f(B) < 0 ? c.r : c.g, 6);
        out.innerHTML = `포위 구간 [${A.toFixed(6)}, ${B.toFixed(6)}] · 폭 ${(B - A).toExponential(2)}<br>f(왼쪽) = <span class="${f(A) < 0 ? 'r' : 'g'}">${f(A).toFixed(4)}</span>, f(오른쪽) = <span class="${f(B) < 0 ? 'r' : 'g'}">${f(B).toFixed(4)}</span>  → 부호가 다르니 사이에 근이 있다<br>${steps.slice(-3).join('<br>')}<br><span class="p">y = ${k.toFixed(2)}: f(0) = −1과 f(2) = 5 사이의 값이니 [0, 2]에서 반드시 만난다</span>`;
      } });
      const c = Q.ctrls(h);
      Q.button(c, '반으로 자르기 ✂', () => { const m = (A + B) / 2; steps.push(`${steps.length + 1}단계: 중점 ${m.toFixed(6)}, f = ${f(m).toFixed(5)} → ${f(A) * f(m) < 0 ? '왼쪽 절반' : '오른쪽 절반'} 선택`); if (f(A) * f(m) < 0) B = m; else A = m; P.redraw(); }, 'primary');
      Q.button(c, '처음으로', () => { A = 1; B = 2; steps = []; P.redraw(); });
      Q.slider(c, { label: 'k', min: -1, max: 5, step: 0.01, value: 2 }, v => { k = v; P.redraw(); });
      h.append(out); Q.note(h, '이분법은 컴퓨터가 방정식을 푸는 실제 방법 중 하나야. 10번 자르면 폭이 1/1024로 줄어.');
    },
    guess: { q: T`$f$가 $[1,2]$에서 연속이고 $f(1)<0$, $f(2)>0$이면?`, opts: ['(1, 2)에 근이 적어도 하나 있다', '(1, 2)에 근이 정확히 하나 있다', '근이 없을 수도 있다'], ans: 0, why: '연속이면 음수에서 양수로 가는 동안 0을 건너뛸 수 없어. 다만 오르락내리락하면 근이 여러 개일 수도 있어서 "적어도 하나"라고 해.' },
    theorem: T`<h4>최대·최소 정리</h4><p>$f$가 닫힌구간 $[a,b]$에서 연속이면 $f$는 그 구간에서 반드시 최댓값과 최솟값을 가져.</p><h4>사잇값 정리</h4><p>$f$가 $[a,b]$에서 연속이고 $f(a)\ne f(b)$이면, $f(a)$와 $f(b)$ 사이의 임의의 값 $k$에 대하여 $f(c)=k$인 $c$가 $(a,b)$에 적어도 하나 존재해.</p><p><b>따름정리</b> $f(a)f(b)<0$이면 방정식 $f(x)=0$은 $(a,b)$에서 실근을 적어도 하나 가져.</p>`,
    proof: [T`등산 문제: 첫날 위치를 $u(t)$, 둘째 날 위치를 $d(t)$라 하자(산 아래 0, 정상 1).`, T`$g(t)=u(t)-d(t)$로 두면 $g$는 연속이야.`, T`7시에 $g=0-1=-1<0$, 저녁에는 $g=1-0=1>0$.`, T`사잇값 정리에 의해 $g(c)=0$인 시각 $c$가 있어. 그 시각에 두 날의 위치가 같아.`],
    deeper: T`<p>왜 "닫힌구간"이 꼭 필요할까? $f(x)=\frac1x$은 $(0,1]$에서 연속이지만 최댓값이 없어. 끝점이 빠지면 값이 도망갈 수 있거든. 이 정리들의 깊은 이유는 실수에 "빈틈이 없다"는 <b>완비성</b>이야. 이분법으로 줄어드는 구간들이 반드시 한 점으로 모이는 것도 같은 이유야.</p>`,
    exam: [T`"방정식 $f(x)=0$이 열린구간 $(a,b)$에서 적어도 $n$개의 실근을 가진다": 주어진 함숫값 표에서 부호가 바뀌는 횟수를 세.`, T`최대·최소 정리는 "닫힌구간 + 연속"일 때만 써. 열린구간이면 최댓값이 없을 수 있어.`],
    probs: [
      { lv: 2, q: T`방정식 $x^3+x-3=0$이 반드시 실근을 갖는 구간은?`, opts: ['$(-1,0)$', '$(0,1)$', '$(1,2)$', '$(2,3)$', '$(3,4)$'], ans: 2, hints: ['끝점에서 부호를 비교해.'], sol: T`$f(1)=-1<0$, $f(2)=7>0$이니까 $(1,2)$.` },
      { lv: 3, q: T`연속함수 $f$에 대하여 $f(0)=1$, $f(1)=-2$, $f(2)=3$, $f(3)=-1$, $f(4)=2$일 때, 방정식 $f(x)=0$은 열린구간 $(0,4)$에서 적어도 몇 개의 실근을 갖는가?`, ans: 4, hints: ['이웃한 두 값의 부호가 바뀌는 곳마다 근이 하나 이상 있어.'], sol: T`$+\to-\to+\to-\to+$로 부호가 4번 바뀌니까 적어도 4개.` }]
  }]},

  { name: '미분', rooms: [

  { id: 'c1-deriv', title: '미분계수', who: '아이작 뉴턴', year: '1666',
    card: T`$\displaystyle f'(a)=\lim_{h\to0}\frac{f(a+h)-f(a)}{h}$ : 접선의 기울기, 순간변화율`,
    mystery: T`<p>자동차 속도계는 "지금 이 순간" 속도를 보여줘. 그런데 속도는 거리 ÷ 시간이잖아. <b>한 순간</b>에는 시간이 0이니까 거리도 0이야. $\dfrac00$을 어떻게 계산하지?</p><p>흑사병으로 대학이 문을 닫자 고향에 내려간 23살 뉴턴은 1666년에 이 문제를 풀었어. 아주 짧은 시간 $h$ 동안의 평균 속도를 구하고, $h$를 0으로 보내는 거야.</p>`,
    try: 'h를 0 쪽으로 줄이거나 "h → 0" 버튼을 눌러 봐. 노란 할선이 파란 점선 접선과 겹쳐지는 걸 지켜봐.',
    sim(h, Q) {
      const f = x => 0.25 * x ** 3 - x + 1, df = x => 0.75 * x * x - 1; let a = 1, hh = 1.5; const out = Q.readout(document.createElement('div'));
      const P = Q.plot(h, { xmin: -3.5, xmax: 3.5, ymin: -2.5, ymax: 4.5, draw: P => {
        const c = P.c, H = Math.abs(hh) < 1e-4 ? 1e-4 : hh, m = (f(a + H) - f(a)) / H; P.grid();
        P.fn(f, c.b, 2.5); P.line(a, f(a), df(a), c.b, 1.6, [7, 5]); P.line(a, f(a), m, c.y, 2.2);
        P.seg(a, f(a), a + H, f(a), c.p, 1.5); P.seg(a + H, f(a), a + H, f(a + H), c.p, 1.5);
        P.text(a + H / 2, f(a), 'h', c.p, 'center', 0, 18); P.text(a + H, (f(a) + f(a + H)) / 2, 'Δy', c.p, 'left', 6, 8);
        P.dot(a, f(a), c.chalk, 6); P.dot(a + H, f(a + H), c.y, 6);
        out.innerHTML = `<span class="y">평균변화율 (할선의 기울기) = (f(a+h) − f(a)) / h = ${m.toFixed(6)}</span><br><span class="b">미분계수 (접선의 기울기) f'(a) = ${df(a).toFixed(6)}</span><br>차이 = ${Math.abs(m - df(a)).toExponential(2)}   ← h가 작아질수록 0으로`;
      } });
      const c = Q.ctrls(h); const A = Q.anim(dt => { hh *= Math.pow(0.25, dt); sh.set(hh); return Math.abs(hh) > 0.0005; });
      Q.slider(c, { label: 'a', min: -2.5, max: 2.5, value: 1 }, v => { a = v; P.redraw(); });
      const sh = Q.slider(c, { label: 'h', min: -2, max: 2, step: 0.0005, value: 1.5, fmt: v => v.toFixed(4) }, v => { hh = v; P.redraw(); });
      Q.button(c, 'h → 0', () => { if (Math.abs(hh) < 0.001) sh.set(1.5); A.start(); }, 'primary');
      h.append(out);
    },
    guess: { q: '$h\\to0$이면 할선은 어떻게 될까?', opts: ['두 점이 겹쳐서 직선이 사라진다', '그 점에서의 접선이 된다', '수직선이 된다'], ans: 1, why: '두 점이 하나로 겹치는 순간 직선은 정의되지 않아. 그런데 겹치기 직전까지의 직선들은 하나의 직선(접선)으로 모여. 미분은 "도착하지 않고 가까워지는" 극한을 쓰는 첫 번째 대작이야.' },
    theorem: T`<h4>정의</h4><p>$x$가 $a$에서 $a+h$까지 변할 때의 <b>평균변화율</b>은 $\dfrac{f(a+h)-f(a)}{h}$야.</p><p>$h\to0$일 때 이 값의 극한이 존재하면 $f$는 $x=a$에서 <b>미분가능</b>하다고 하고, 그 극한값을 <b>미분계수</b>라고 해.</p>$$f'(a)=\lim_{h\to0}\frac{f(a+h)-f(a)}{h}=\lim_{x\to a}\frac{f(x)-f(a)}{x-a}$$<p><b>기하적 의미</b> $f'(a)$는 곡선 $y=f(x)$ 위의 점 $(a,f(a))$에서 그은 접선의 기울기야.</p>`,
    proof: [T`$f(x)=x^2$의 $x=3$에서의 미분계수를 정의대로 구해 보자.`, T`$\dfrac{(3+h)^2-9}{h}=\dfrac{6h+h^2}{h}=6+h$`, T`$h\to0$이면 $6$. 그래서 $f'(3)=6$.`, T`$h$로 나눌 수 있는 이유는 극한에서 $h\ne0$이기 때문이야.`],
    exam: [T`$\displaystyle\lim_{h\to0}\frac{f(a+3h)-f(a)}{h}=3f'(a)$ : 분모를 $3h$로 맞추면 3이 밖으로 나와.`, T`$\displaystyle\lim_{h\to0}\frac{f(a+h)-f(a-h)}{h}=2f'(a)$ : 가운데 $f(a)$를 빼고 더해서 둘로 쪼개.`, T`$\displaystyle\lim_{x\to a}\frac{f(x)-k}{x-a}=m$이면 $f(a)=k,\ f'(a)=m$. 이 한 줄에서 정보 두 개가 나와.`],
    probs: [
      { lv: 2, q: T`$f(x)=x^2+3x$일 때, $f'(1)$의 값을 미분계수의 정의를 이용하여 구하시오.`, ans: 5, hints: [T`$\dfrac{f(1+h)-f(1)}{h}$를 정리해.`], sol: T`$\dfrac{(1+h)^2+3(1+h)-4}{h}=5+h\to5$` },
      { lv: 3, q: T`$f(x)=x^3$일 때, $\displaystyle\lim_{h\to0}\frac{f(2+3h)-f(2)}{h}$의 값을 구하시오.`, ans: 36, hints: [T`$=3\cdot\displaystyle\lim\frac{f(2+3h)-f(2)}{3h}$`, T`$f'(2)=12$`], sol: T`$3f'(2)=3\cdot12=36$` },
      { lv: 3, q: T`미분가능한 함수 $f$가 $\displaystyle\lim_{x\to1}\frac{f(x)-3}{x-1}=4$를 만족시킬 때, $f(1)+f'(1)$의 값을 구하시오.`, ans: 7, hints: [T`분모 $\to0$이면 분자 $\to0$: $f(1)=3$`, T`남은 극한이 바로 $f'(1)$`], sol: T`$f(1)=3$, $f'(1)=4$, 합 $7$.` }]
  },

  { id: 'c1-diffable', title: '미분가능성과 연속', who: '카를 바이어슈트라스', year: '1872',
    card: T`미분가능하면 연속이다. 그러나 역은 성립하지 않는다 (예: $|x|$)`,
    mystery: T`<p>매끈한 곡선을 계속 확대하면 결국 <b>직선</b>처럼 보여. 지구가 둥근데도 운동장이 평평해 보이는 것처럼.</p><p>그럼 모든 연속 곡선을 확대하면 언젠가 직선이 될까? 1872년 바이어슈트라스는 "모든 점에서 끊기지 않지만 어디서도 미분할 수 없는 괴물 함수"를 발표했어. 수학자들이 경악했지.</p>`,
    try: '함수를 바꿔 가며 확대 배율을 끝까지 올려 봐. 무엇은 직선이 되고, 무엇은 끝까지 꺾여 있을까?',
    sim(h, Q) {
      const W = x => { let s = 0; for (let n = 0; n < 15; n++) s += 0.5 ** n * Math.cos(3 ** n * Math.PI * x); return s; };
      const fs = [{ n: '매끈한 곡선 x³ − x (x = 0.5에서)', f: x => x ** 3 - x, c: 0.5 }, { n: '꺾인 점 |x| (x = 0에서)', f: x => Math.abs(x), c: 0 }, { n: '수직 접선 ∛x (x = 0에서)', f: Math.cbrt, c: 0 }, { n: '바이어슈트라스의 괴물', f: W, c: 0.2 }];
      let k = 0, z = 1; const out = Q.readout(document.createElement('div'));
      const P = Q.plot(h, { draw: P => {
        const F = fs[k], cx = F.c, cy = F.f(cx), w = 2 / z, c = P.c;
        P.xmin = cx - w; P.xmax = cx + w; P.ymin = cy - w * 0.62; P.ymax = cy + w * 0.62; if (k === 3) { P.ymin = cy - 2.2 * w ** 0.63; P.ymax = cy + 2.2 * w ** 0.63; }
        P.grid({ labels: false }); P.fn(F.f, c.b, 2.4); P.dot(cx, cy, c.y, 5);
        const hs = 0.5 / z, L = (cy - F.f(cx - hs)) / hs, R = (F.f(cx + hs) - cy) / hs;
        out.innerHTML = `확대 ${z.toFixed(0)}배 · 측정 폭 h = ${hs.toPrecision(2)}<br><span class="p">왼쪽 기울기 (f(c) − f(c−h))/h = ${L.toFixed(4)}</span><br><span class="y">오른쪽 기울기 (f(c+h) − f(c))/h = ${R.toFixed(4)}</span><br>${[`둘이 같은 값으로 모여: 미분가능. 확대하면 직선이 돼(국소 선형성).`, `왼쪽 −1, 오른쪽 +1. 아무리 확대해도 꺾여 있어. 연속이지만 미분불가능.`, `기울기가 무한대로 폭주해. 접선이 수직이라 미분계수가 없어.`, `확대해도 들쭉날쭉한 모양이 계속 나타나. 모든 점에서 연속인데 어디서도 미분불가능.`][k]}`;
      } });
      const c = Q.ctrls(h);
      Q.select(c, '함수', fs.map(f => f.n), v => { k = v; P.redraw(); });
      Q.slider(c, { label: '확대', min: 0, max: 3, step: 0.01, value: 0, fmt: v => Math.round(10 ** v) + '배' }, v => { z = 10 ** v; P.redraw(); });
      h.append(out);
    },
    guess: { q: '$x=a$에서 연속인 함수는 반드시 $x=a$에서 미분가능할까?', opts: ['그렇다', '아니다. 꺾인 점에서는 미분불가능하다'], ans: 1, why: T`$|x|$는 $x=0$에서 연속이지만 좌미분계수 $-1$, 우미분계수 $1$이 달라서 미분불가능해. 반대로 미분가능하면 반드시 연속이야.` },
    theorem: T`<h4>정리</h4><p>$f$가 $x=a$에서 미분가능하면 $f$는 $x=a$에서 연속이야.</p><p><b>역은 거짓</b> 연속이어도 꺾인 점이나 수직 접선이 있으면 미분불가능해.</p><h4>미분가능 판정 (구간별 함수)</h4><p>이음매 $x=a$에서 미분가능하려면 ① 연속이어야 하고(함숫값이 이어짐) ② 좌미분계수와 우미분계수가 같아야 해(기울기가 이어짐).</p>`,
    proof: [T`$x\ne a$일 때 $f(x)-f(a)=\dfrac{f(x)-f(a)}{x-a}\cdot(x-a)$로 쓸 수 있어.`, T`$x\to a$이면 첫째 인수 $\to f'(a)$, 둘째 인수 $\to0$.`, T`그러니까 $f(x)-f(a)\to f'(a)\cdot0=0$, 곧 $\lim_{x\to a}f(x)=f(a)$.`],
    exam: [T`구간별 함수 미분가능 조건 = <b>연속 조건 + 미분계수 조건</b>. 미지수 두 개에 식 두 개가 나와.`, T`$|f(x)|$, $x|x|$ 같은 함수의 미분가능성: $x|x|$는 $x=0$에서 미분가능해(양쪽 기울기 0).`],
    probs: [
      { lv: 2, q: T`$x=0$에서 연속이지만 미분가능하지 않은 함수는?`, opts: ['$x|x|$', '$|x|$', '$x^3$', '$x^2+x$', '$x|x|+1$'], ans: 1, hints: [T`$x|x|$를 $x\ge0$, $x<0$으로 나눠서 미분해 봐.`], sol: T`$x|x|$의 미분은 $2|x|$라서 0에서 미분가능해. $|x|$만 꺾여 있어.` },
      { lv: 4, q: T`함수 $f(x)=\begin{cases}x^3+ax&(x<1)\\bx^2+2&(x\ge1)\end{cases}$가 $x=1$에서 미분가능할 때, $a+b$의 값을 구하시오.`, ans: 9, hints: [T`연속: $1+a=b+2$`, T`미분계수: $3+a=2b$`], sol: T`$a=b+1$을 대입하면 $4+b=2b$, $b=4$, $a=5$. $a+b=9$.` }]
  },

  { id: 'c1-derivfn', title: '도함수', who: '고트프리트 라이프니츠', year: '1684',
    card: T`$(x^n)'=nx^{n-1}$, $\{f(x)g(x)\}'=f'(x)g(x)+f(x)g'(x)$`,
    mystery: T`<p>미분계수는 한 점에서의 기울기야. 그럼 모든 점의 기울기를 모으면 뭐가 될까? 새로운 <b>함수</b>가 하나 생겨.</p><p>라이프니츠는 이 함수에 $\dfrac{dy}{dx}$라는 기호를 붙였어. 오늘날까지 쓰이는 이 기호 덕분에 미분은 기계적으로 계산할 수 있는 도구가 됐어.</p>`,
    try: '"기울기 펜 굴리기"를 누르면 위 그래프의 접선 기울기가 아래 그래프에 점으로 찍혀. 다 찍히면 "진짜 도함수"와 비교해 봐.',
    sim(h, Q) {
      const fs = [{ n: 'x³/3 − x', f: x => x ** 3 / 3 - x, d: x => x * x - 1 }, { n: 'x²/2', f: x => x * x / 2, d: x => x }, { n: 'x⁴/4 − x²', f: x => x ** 4 / 4 - x * x, d: x => x ** 3 - 2 * x }];
      let k = 0, x = -2.5, trail = [], show = false;
      const top = Q.plot(h, { xmin: -3, xmax: 3, ymin: -3, ymax: 3, aspect: 0.42, draw: P => { const F = fs[k], c = P.c; P.grid(); P.fn(F.f, c.b, 2.5); P.line(x, F.f(x), F.d(x), c.y, 2); P.dot(x, F.f(x), c.y, 6); P.text(P.xmin, P.ymax, 'y = f(x)', c.b, 'left', 8, 22); } });
      const bot = Q.plot(h, { xmin: -3, xmax: 3, ymin: -3, ymax: 3, aspect: 0.42, draw: P => { const F = fs[k], c = P.c; P.grid(); if (show) P.fn(F.d, c.g, 2, P.xmin, P.xmax, [6, 4]); trail.forEach(([a, b]) => P.dot(a, b, c.p, 2.6)); P.dot(x, F.d(x), c.y, 6); P.text(P.xmin, P.ymax, "y = f'(x)  (기울기를 찍은 그래프)", c.p, 'left', 8, 22); } });
      const out = Q.readout(h);
      const upd = () => { trail.push([x, fs[k].d(x)]); top.redraw(); bot.redraw(); out.innerHTML = `x = ${x.toFixed(2)}에서 접선 기울기 = <span class="y">${fs[k].d(x).toFixed(3)}</span>${show ? `<br><span class="g">f(x) = ${fs[k].n} 이면 f'(x) = ${['x² − 1', 'x', 'x³ − 2x'][k]}</span>` : ''}`; };
      const A = Q.anim(dt => { x += dt * 1.6; if (x > 3) { x = 3; upd(); return false; } sx.set(x); });
      const c = Q.ctrls(h);
      Q.select(c, 'f(x)', fs.map(f => f.n), v => { k = v; trail = []; upd(); });
      const sx = Q.slider(c, { label: 'x', min: -3, max: 3, value: -2.5 }, v => { x = v; upd(); });
      Q.button(c, '기울기 펜 굴리기 ▶', () => { trail = []; x = -3; A.start(); }, 'primary');
      const sb = Q.button(c, '진짜 도함수 겹치기', () => { show = !show; sb.classList.toggle('on', show); upd(); });
      requestAnimationFrame(upd);
    },
    guess: { q: T`$f(x)=\dfrac{x^3}{3}-x$의 도함수 그래프는 어떤 모양일까?`, opts: ['직선', '포물선', '삼차곡선'], ans: 1, why: T`기울기가 음수에서 0을 지나 다시 양수로 가니까 아래로 볼록한 포물선 모양이야. $f'(x)=x^2-1$. 차수가 하나 줄어.` },
    theorem: T`<h4>정의</h4>$$f'(x)=\lim_{h\to0}\frac{f(x+h)-f(x)}{h}$$<p>$f'(x)$, $y'$, $\dfrac{dy}{dx}$, $\dfrac{d}{dx}f(x)$는 모두 같은 뜻이야.</p><h4>미분법</h4><p>$(c)'=0$, $(x^n)'=nx^{n-1}$ ($n$은 자연수)</p><p>$\{cf\}'=cf'$, $\{f\pm g\}'=f'\pm g'$</p><p><b>곱의 미분법</b> $\{fg\}'=f'g+fg'$</p>`,
    proof: [T`$(x+h)^n=x^n+nx^{n-1}h+(h^2\text{ 이상의 항})$ (이항정리)`, T`$\dfrac{(x+h)^n-x^n}{h}=nx^{n-1}+(h\text{를 포함한 항})$`, T`$h\to0$이면 $nx^{n-1}$.`, T`곱의 미분: $f(x+h)g(x+h)-f(x)g(x)$에 $f(x)g(x+h)$를 빼고 더하면 $\{f(x+h)-f(x)\}g(x+h)+f(x)\{g(x+h)-g(x)\}$.`, T`$h$로 나누고 $h\to0$이면 $f'g+fg'$.`],
    exam: [T`$\displaystyle\lim_{x\to\infty}\frac{f(x)-x^3}{x^2}=2$처럼 극한 조건으로 다항함수를 결정한 다음 미분계수를 구하는 문제.`, T`$g(x)=(x^2+1)f(x)$의 $g'(1)$: 곱의 미분법으로 $f(1), f'(1)$이 같이 필요해.`],
    probs: [
      { lv: 2, q: T`$f(x)=2x^3-5x^2+3$일 때, $f'(2)$의 값을 구하시오.`, ans: 4, hints: [T`$f'(x)=6x^2-10x$`], sol: T`$24-20=4$` },
      { lv: 3, q: T`다항함수 $f$에 대하여 $\displaystyle\lim_{x\to1}\frac{f(x)-3}{x-1}=4$이고 $g(x)=x^2f(x)$일 때, $g'(1)$의 값을 구하시오.`, ans: 10, hints: [T`$f(1)=3,\ f'(1)=4$`, T`$g'(x)=2xf(x)+x^2f'(x)$`], sol: T`$2\cdot3+4=10$` },
      { lv: 4, q: T`다항함수 $f$가 $\displaystyle\lim_{x\to\infty}\frac{f(x)-x^3}{x^2}=2$, $\displaystyle\lim_{x\to0}\frac{f(x)}{x}=-3$을 만족시킬 때, $f'(2)$의 값을 구하시오.`, ans: 17, hints: [T`첫 조건: $f(x)=x^3+2x^2+(\cdots)$`, T`둘째 조건: $f(0)=0$, 일차항 계수 $-3$`], sol: T`$f(x)=x^3+2x^2-3x$, $f'(x)=3x^2+4x-3$, $f'(2)=17$.` }]
  },

  { id: 'c1-mvt', title: '접선과 평균값 정리', who: '조제프루이 라그랑주', year: '1797',
    card: T`$f$가 $[a,b]$에서 연속, $(a,b)$에서 미분가능하면 $f'(c)=\dfrac{f(b)-f(a)}{b-a}$인 $c$가 있다`,
    mystery: T`<p>고속도로 두 톨게이트를 1시간에 120 km 이동했어. 제한속도는 100 km/h야. 구간 단속 카메라는 "당신은 <b>어느 순간</b> 정확히 120 km/h였다"고 주장해. 계기판을 본 적도 없는데 어떻게 확신할까?</p>`,
    try: '구간 [a, b]를 바꿔 봐. 노란 할선과 평행한 접선(분홍)이 언제나 구간 안 어딘가에 나타나. "롤 모드"는 f(a) = f(b)가 되게 맞춰 줘.',
    sim(h, Q) {
      const f = x => 0.15 * x ** 3 - 0.9 * x + 1, df = x => 0.45 * x * x - 0.9; let a = -2.5, b = 2; const out = Q.readout(document.createElement('div'));
      const P = Q.plot(h, { xmin: -3.3, xmax: 3.3, ymin: -1.5, ymax: 3.5, draw: P => {
        const c = P.c, m = (f(b) - f(a)) / (b - a); P.grid(); P.rect(a, P.ymin, b, P.ymax, c.yF);
        P.fn(f, c.b, 2.5); P.seg(a, f(a), b, f(b), c.y, 2.4); P.dot(a, f(a), c.y, 6); P.dot(b, f(b), c.y, 6);
        const t = (m + 0.9) / 0.45, cs = t >= 0 ? [Math.sqrt(t), -Math.sqrt(t)].filter(x => x > a && x < b) : [];
        cs.forEach(x => { P.line(x, f(x), m, c.p, 1.8, [7, 5]); P.dot(x, f(x), c.p, 6); });
        out.innerHTML = `<span class="y">평균변화율 = (f(b) − f(a)) / (b − a) = ${m.toFixed(4)}</span><br><span class="p">f'(c) = ${m.toFixed(4)}인 c: ${cs.map(x => x.toFixed(4)).join(', ') || '없음'}</span>${Math.abs(f(a) - f(b)) < 1e-3 ? '<br><span class="g">f(a) = f(b): 롤의 정리. 수평 접선이 반드시 있어.</span>' : ''}`;
      } });
      const c = Q.ctrls(h);
      const sa = Q.slider(c, { label: 'a', min: -3, max: 0, value: -2.5 }, v => { a = v; P.redraw(); });
      const sb = Q.slider(c, { label: 'b', min: 0.3, max: 3, value: 2 }, v => { b = v; P.redraw(); });
      Q.button(c, '롤 모드: f(b) = f(a)로', () => { let best = b, bd = 1e9; for (let x = 0.3; x <= 3; x += 0.0005) { const d = Math.abs(f(x) - f(a)); if (d < bd && x - a > 0.5) { bd = d; best = x; } } sb.set(best); });
      h.append(out);
    },
    guess: { q: '닫힌구간에서 연속이고 열린구간에서 미분가능하면, 할선과 평행한 접선은?', opts: ['구간 안에 반드시 하나 이상 존재한다', '없을 수도 있다', '정확히 하나 존재한다'], ans: 0, why: '평균 속도가 120이면 순간 속도는 어느 순간 120을 지나야 해. 계속 120보다 느렸다면 평균도 120보다 작았을 테니까. 개수는 하나일 수도, 여럿일 수도 있어.' },
    theorem: T`<h4>접선의 방정식</h4><p>곡선 $y=f(x)$ 위의 점 $(a,f(a))$에서의 접선: $y-f(a)=f'(a)(x-a)$</p><h4>롤의 정리</h4><p>$f$가 $[a,b]$에서 연속, $(a,b)$에서 미분가능, $f(a)=f(b)$이면 $f'(c)=0$인 $c\in(a,b)$가 존재해.</p><h4>평균값 정리</h4><p>$f$가 $[a,b]$에서 연속, $(a,b)$에서 미분가능하면</p>$$\frac{f(b)-f(a)}{b-a}=f'(c)$$<p>인 $c$가 $(a,b)$에 적어도 하나 존재해.</p>`,
    proof: [T`<b>롤</b> 최대·최소 정리에 의해 $f$는 $[a,b]$에서 최댓값과 최솟값을 가져.`, T`둘 다 끝점에서만 나오면 $f(a)=f(b)$이니까 $f$는 상수이고, $f'=0$이야.`, T`아니면 최대나 최소가 내부의 점 $c$에서 생겨. 그 점에서 접선은 수평이니까 $f'(c)=0$.`, T`<b>평균값</b> $g(x)=f(x)-\left\{\dfrac{f(b)-f(a)}{b-a}(x-a)+f(a)\right\}$로 두면 $g(a)=g(b)=0$.`, T`롤의 정리로 $g'(c)=0$. 곧 $f'(c)=\dfrac{f(b)-f(a)}{b-a}$.`],
    exam: [T`곡선 <b>밖의 점</b>에서 그은 접선: 접점을 $(t,f(t))$로 두고 접선이 그 점을 지난다는 조건으로 $t$를 구해.`, T`평균값 정리의 $c$: $f'(c)=$ 평균변화율인 $c$를 계산. 이차함수면 $c$는 항상 구간의 중점이야.`],
    probs: [
      { lv: 2, q: T`곡선 $y=x^3-3x+2$ 위의 $x=2$인 점에서의 접선이 $y=mx+n$일 때, $m+n$의 값을 구하시오.`, ans: -5, hints: [T`$f(2)=4$, $f'(2)=9$`], sol: T`$y=9(x-2)+4=9x-14$, $m+n=-5$.` },
      { lv: 3, q: T`점 $(0,-3)$에서 곡선 $y=x^2+1$에 그은 접선 중 기울기가 양수인 접선의 기울기를 구하시오.`, ans: 4, hints: [T`접점 $(t,t^2+1)$, 접선 $y=2t(x-t)+t^2+1$`, T`$(0,-3)$ 대입: $-3=-t^2+1$`], sol: T`$t^2=4$에서 $t=2$, 기울기 $4$.` },
      { lv: 2, q: T`$f(x)=x^2$에 대하여 닫힌구간 $[1,3]$에서 평균값 정리를 만족시키는 $c$의 값을 구하시오.`, ans: 2, hints: [T`평균변화율 $=\frac{9-1}{2}=4$`], sol: T`$2c=4$, $c=2$.` }]
  },

  { id: 'c1-incdec', title: '증가·감소와 극값', who: '피에르 드 페르마', year: '1638',
    card: T`$f'$의 부호가 $+\to-$로 바뀌는 점에서 극대, $-\to+$로 바뀌는 점에서 극소`,
    mystery: T`<p>산을 오르다 정상에 서면 그 순간 발밑은 <b>평평해</b>. 페르마는 미적분이 생기기도 전에 "최댓값이 되는 곳에서는 변화가 0이 된다"는 사실을 이용해 최적화 문제를 풀었어.</p><p>그런데 평평하다고 언제나 정상일까?</p>`,
    try: 'b, c를 움직여서 삼차함수의 혹(극대·극소)이 생겼다 사라지는 순간을 찾아. 그때 아래 f′ 그래프는 어떤 모양이야?',
    sim(h, Q) {
      let b = 0, c0 = -3;
      const f = x => x ** 3 + b * x * x + c0 * x, d = x => 3 * x * x + 2 * b * x + c0;
      const crit = () => { const D = b * b - 3 * c0; if (D <= 0) return []; const s = Math.sqrt(D); return [(-b - s) / 3, (-b + s) / 3]; };
      const top = Q.plot(h, { xmin: -3.5, xmax: 3.5, ymin: -8, ymax: 8, aspect: 0.45, draw: P => { const c = P.c; P.grid(); P.fn(f, c.b, 2.6); crit().forEach((x, i) => { P.dot(x, f(x), i ? c.g : c.r, 6); P.text(x, f(x), i ? '극소' : '극대', i ? c.g : c.r, 'center', 0, i ? 26 : -8); }); } });
      const bot = Q.plot(h, { xmin: -3.5, xmax: 3.5, ymin: -8, ymax: 12, aspect: 0.35, draw: P => { const c = P.c; P.grid(); P.between(x => Math.max(d(x), 0), () => 0, P.xmin, P.xmax, c.gF); P.between(x => Math.min(d(x), 0), () => 0, P.xmin, P.xmax, c.pF); P.fn(d, c.y, 2.2); P.text(P.xmin, P.ymax, "f'(x)  초록: 증가 구간, 분홍: 감소 구간", c.y, 'left', 8, 22); } });
      const out = Q.readout(h);
      const upd = () => { top.redraw(); bot.redraw(); const D = b * b - 3 * c0, cr = crit(); out.innerHTML = `f(x) = x³ ${b >= 0 ? '+' : '−'} ${Math.abs(b).toFixed(1)}x² ${c0 >= 0 ? '+' : '−'} ${Math.abs(c0).toFixed(1)}x<br>f'(x) = 3x² ${b >= 0 ? '+' : '−'} ${Math.abs(2 * b).toFixed(1)}x ${c0 >= 0 ? '+' : '−'} ${Math.abs(c0).toFixed(1)}  ·  D/4 = b² − 3c = <span class="${D > 0 ? 'g' : 'r'}">${D.toFixed(2)}</span><br>${D > 0 ? `<span class="r">극대 x = ${cr[0].toFixed(3)}</span>, <span class="g">극소 x = ${cr[1].toFixed(3)}</span>` : D === 0 ? 'f′ = 0인 점이 있지만 부호가 안 바뀌어서 극값 없음' : 'f′ > 0 항상. 실수 전체에서 증가, 극값 없음'}`; };
      const c = Q.ctrls(h);
      Q.slider(c, { label: 'b', min: -3, max: 3, step: 0.1, value: 0, fmt: v => v.toFixed(1) }, v => { b = Math.round(v * 10) / 10; upd(); });
      Q.slider(c, { label: 'c', min: -6, max: 6, step: 0.1, value: -3, fmt: v => v.toFixed(1) }, v => { c0 = Math.round(v * 10) / 10; upd(); });
      requestAnimationFrame(upd);
    },
    guess: { q: T`$f'(a)=0$이면 $f$는 $x=a$에서 반드시 극값을 가질까?`, opts: ['그렇다', T`아니다. $x^3$은 $x=0$에서 $f'=0$이지만 극값이 없다`], ans: 1, why: T`극값의 진짜 조건은 $f'$의 <b>부호 변화</b>야. $f'(a)=0$은 극값이 될 수 있는 후보일 뿐이야. 위 실험에서 $D/4=0$일 때를 확인해 봐.` },
    theorem: T`<h4>증가·감소</h4><p>어떤 구간에서 $f'(x)>0$이면 $f$는 그 구간에서 증가, $f'(x)<0$이면 감소해.</p><h4>극값 판정</h4><p>$f'(a)=0$이고 $x=a$의 좌우에서 $f'$의 부호가 $+\to-$이면 극대, $-\to+$이면 극소야.</p><h4>삼차함수</h4><p>$f(x)=ax^3+bx^2+cx+d$가 극값을 가질 조건: $f'(x)=0$의 판별식 $D>0$.</p><h4>최대·최소</h4><p>닫힌구간에서는 극값과 끝점의 함숫값을 모두 비교해.</p>`,
    proof: [T`$f'>0$인 구간의 두 점 $x_1\lt x_2$를 잡자.`, T`평균값 정리에 의해 $\dfrac{f(x_2)-f(x_1)}{x_2-x_1}=f'(c)>0$인 $c$가 있어.`, T`$x_2-x_1>0$이니까 $f(x_2)>f(x_1)$. 곧 증가야.`],
    exam: [T`"실수 전체에서 증가" ⇔ $f'(x)\ge0$ 항상 ⇔ 이차식 $f'$의 $D\le0$. 등호가 들어가는 이유는 한 점에서만 $f'=0$이어도 증가하기 때문이야.`, T`극댓값·극솟값의 합이나 차 계산. 표를 그려서 부호 변화를 확인해.`, T`닫힌구간 최대·최소: 극값 후보와 양 끝값을 모두 비교.`],
    probs: [
      { lv: 2, q: T`함수 $f(x)=x^3-3x^2-9x+5$의 극댓값과 극솟값의 합을 구하시오.`, ans: -12, hints: [T`$f'(x)=3(x+1)(x-3)$`], sol: T`극댓값 $f(-1)=10$, 극솟값 $f(3)=-22$. 합 $-12$.` },
      { lv: 3, q: T`함수 $f(x)=x^3+ax^2+3x$가 실수 전체에서 증가하도록 하는 정수 $a$의 개수를 구하시오.`, ans: 7, hints: [T`$f'(x)=3x^2+2ax+3\ge0$ 항상`, T`$D/4=a^2-9\le0$`], sol: T`$-3\le a\le3$, 정수 7개.` },
      { lv: 3, q: T`닫힌구간 $[-1,4]$에서 함수 $f(x)=x^3-6x^2+9x$의 최댓값을 $M$, 최솟값을 $m$이라 할 때, $M-m$의 값을 구하시오.`, ans: 20, hints: [T`극값 후보: $x=1,3$. 끝점: $x=-1,4$`], sol: T`$f(-1)=-16$, $f(1)=4$, $f(3)=0$, $f(4)=4$. $M=4$, $m=-16$, $M-m=20$.` }]
  },

  { id: 'c1-roots', title: '방정식과 부등식', who: '르네 데카르트', year: '1637',
    card: T`방정식 $f(x)=k$의 실근의 개수 = $y=f(x)$와 $y=k$의 교점의 개수`,
    mystery: T`<p>$x^3-3x=k$를 직접 풀 수 있어? 삼차방정식 근의 공식은 끔찍하게 복잡해. 그런데 근의 <b>개수</b>만 알고 싶다면?</p><p>데카르트가 방정식과 그래프를 연결한 뒤로는 그림 한 장이면 충분해. 수평선 하나만 오르내리면 돼.</p>`,
    try: 'k를 움직여 수평선을 올렸다 내렸다 해 봐. 교점이 1개, 2개, 3개로 바뀌는 경계가 어디인지 찾아.',
    sim(h, Q) {
      const fs = [{ n: 'x³ − 3x', f: x => x ** 3 - 3 * x, v: [-3, 3, -6, 6], k: [-5, 5] }, { n: 'x⁴ − 2x²', f: x => x ** 4 - 2 * x * x, v: [-2.3, 2.3, -2, 4], k: [-2, 3] }, { n: '2x³ − 3x² − 12x', f: x => 2 * x ** 3 - 3 * x * x - 12 * x, v: [-3.5, 4.5, -30, 15], k: [-28, 12] }];
      let i = 0, k = 1; const out = Q.readout(document.createElement('div'));
      const count = () => { const F = fs[i]; let n = 0, xs = [], N = 6000, [a, b] = [F.v[0], F.v[1]]; let pg = F.f(a) - k; for (let j = 1; j <= N; j++) { const x = a + (b - a) * j / N, g = F.f(x) - k; if (Math.abs(g) < 1e-9 || pg * g < 0) { if (!xs.length || x - xs[xs.length - 1] > (b - a) / 200) { xs.push(x); n++; } } pg = g; } return xs; };
      const P = Q.plot(h, { draw: P => { const F = fs[i], c = P.c; [P.xmin, P.xmax, P.ymin, P.ymax] = F.v; P.grid(); P.fn(F.f, c.b, 2.6); P.hline(k, c.y, [], 2); const xs = count(); xs.forEach(x => P.dot(x, k, c.p, 6)); out.innerHTML = `${F.n} = <span class="y">${k.toFixed(1)}</span> → 실근 <span class="p">${xs.length}개</span>${xs.length ? ': x ≈ ' + xs.map(x => x.toFixed(3)).join(', ') : ''}`; } });
      const c = Q.ctrls(h);
      Q.select(c, 'f(x)', fs.map(f => f.n), v => { i = v; sk.el.min = fs[v].k[0]; sk.el.max = fs[v].k[1]; sk.set(1); });
      const sk = Q.slider(c, { label: 'k', min: -5, max: 5, step: 0.1, value: 1, fmt: v => v.toFixed(1) }, v => { k = Math.round(v * 10) / 10; P.redraw(); });
      h.append(out); Q.note(h, '교점이 2개가 되는 순간 수평선은 극댓값이나 극솟값에 딱 닿아 있어(접함 = 중근).');
    },
    guess: { q: T`$x^3-3x=k$가 서로 다른 세 실근을 가지는 $k$의 범위는?`, opts: ['$-2\\lt k<2$', '$k>2$', '$k=2$', '$-3\\lt k<3$'], ans: 0, why: T`$f(x)=x^3-3x$의 극댓값은 $f(-1)=2$, 극솟값은 $f(1)=-2$. 수평선이 그 사이에 있을 때 세 번 만나.` },
    theorem: T`<h4>실근의 개수</h4><p>방정식 $f(x)=k$의 서로 다른 실근의 개수는 $y=f(x)$와 $y=k$의 교점의 개수야. $f(x)=g(x)$는 $h(x)=f(x)-g(x)=0$으로 바꿔서 생각해.</p><h4>삼차방정식 $f(x)=0$의 근 판별 (극값이 있을 때)</h4><p>(극댓값)×(극솟값) $<0$: 세 실근, $=0$: 서로 다른 두 실근(중근 포함), $>0$: 한 실근.</p><h4>부등식 증명</h4><p>"모든 $x$에서 $f(x)\ge g(x)$"는 $h=f-g$의 <b>최솟값</b> $\ge0$을 보이면 돼.</p>`,
    proof: [T`$x\ge0$에서 $x^3-3x+2\ge0$을 보이자. $h(x)=x^3-3x+2$로 두자.`, T`$h'(x)=3(x-1)(x+1)$. $x\ge0$에서는 $x=1$에서 극소이자 최소야.`, T`$h(1)=0\ge0$. 그러니까 $x\ge0$에서 항상 $h(x)\ge0$.`],
    exam: [T`"서로 다른 실근의 개수가 2" → 수평선이 극값에 접할 때. 극댓값과 극솟값을 둘 다 계산해 두면 어떤 개수 조건에도 대응할 수 있어.`, T`정수 $k$의 개수 세기: 열린구간인지 닫힌구간인지(경계 포함 여부)를 조심해.`, T`$x>0$에서 부등식이 항상 성립: 구간 안의 최솟값을 구해.`],
    probs: [
      { lv: 3, q: T`방정식 $x^3-3x^2-9x-k=0$이 서로 다른 세 실근을 갖도록 하는 정수 $k$의 개수를 구하시오.`, ans: 31, hints: [T`$f(x)=x^3-3x^2-9x$와 $y=k$`, T`극댓값 $f(-1)=5$, 극솟값 $f(3)=-27$`], sol: T`$-27\lt k<5$, 정수는 $-26$부터 $4$까지 31개.` },
      { lv: 3, q: T`$x\ge0$인 모든 실수 $x$에 대하여 $x^3-3x+a\ge0$이 성립하도록 하는 실수 $a$의 최솟값을 구하시오.`, ans: 2, hints: [T`$x\ge0$에서 $x^3-3x$의 최솟값은 $x=1$에서.`], sol: T`최솟값 $1-3+a\ge0$, $a\ge2$.` },
      { lv: 4, q: T`방정식 $2x^3-3x^2-12x=k$의 서로 다른 실근의 개수가 2가 되도록 하는 모든 실수 $k$의 값의 합을 구하시오.`, ans: -13, hints: [T`$f'(x)=6(x-2)(x+1)$`, T`수평선이 극댓값 또는 극솟값에 닿을 때`], sol: T`극댓값 $f(-1)=7$, 극솟값 $f(2)=-20$. 합 $-13$.` }]
  },

  { id: 'c1-motion', title: '속도와 가속도', who: '갈릴레오 갈릴레이', year: '1638',
    card: T`위치 $x(t)$ → 속도 $v=\dfrac{dx}{dt}$ → 가속도 $a=\dfrac{dv}{dt}$`,
    mystery: T`<p>갈릴레이는 경사면에 공을 굴리면서 깨달았어. 움직임을 이해하려면 위치만으로는 부족하고 <b>위치가 변하는 속도</b>, 그리고 <b>그 속도가 변하는 속도</b>까지 봐야 한다는 걸.</p><p>미분은 이 "변화의 변화"를 계산하는 기계야.</p>`,
    try: '재생을 누르고 점이 언제 방향을 바꾸는지 봐. 그 순간 v는 얼마야?',
    sim(h, Q) {
      const X = t => t ** 3 - 6 * t * t + 9 * t, V = t => 3 * t * t - 12 * t + 9, Acc = t => 6 * t - 12; let t = 0;
      const line = Q.plot(h, { xmin: -1, xmax: 22, ymin: -1, ymax: 1, aspect: 0.12, draw: P => { const c = P.c; P.grid({ axes: false, sy: 10 }); P.hline(0, c.axis, []); for (let i = 0; i <= 20; i += 2) P.text(i, 0, String(i), c.muted, 'center', 0, 20, 11); for (let s = 0; s < t; s += 0.04) P.dot(X(s), 0.35, c.pF, 2); P.dot(X(t), 0, V(t) >= 0 ? c.g : c.p, 9); } });
      const gr = Q.plot(h, { xmin: -0.2, xmax: 4.6, ymin: -2, ymax: 22, aspect: 0.45, draw: P => { const c = P.c; P.grid(); P.fn(X, c.b, 2.5, 0, 4.5); P.fn(V, c.y, 1.8, 0, 4.5, [6, 4]); P.line(t, X(t), V(t), c.chalk, 1, [2, 4]); P.dot(t, X(t), c.b, 6); P.dot(t, V(t), c.y, 5); P.text(4.5, X(4.5), 'x(t)', c.b, 'right', -6, 0); P.text(4.5, V(4.5), 'v(t)', c.y, 'right', -6, 0); } });
      const out = Q.readout(h);
      const upd = () => { line.redraw(); gr.redraw(); const v = V(t); out.innerHTML = `t = ${t.toFixed(2)} · <span class="b">x = ${X(t).toFixed(3)}</span> · <span class="y">v = ${v.toFixed(3)}</span> · a = ${Acc(t).toFixed(2)}<br>${Math.abs(v) < 0.05 ? '<span class="r">v ≈ 0. 지금 방향이 바뀌어!</span>' : v > 0 ? '<span class="g">→ 양의 방향으로</span>' : '<span class="p">← 음의 방향으로</span>'} · 속력 |v| = ${Math.abs(v).toFixed(3)} · ${v * Acc(t) > 0 ? '빨라지는 중' : '느려지는 중'}`; };
      const A = Q.anim(dt => { t += dt * 0.7; if (t >= 4.5) { t = 4.5; st.set(t); return false; } st.set(t); });
      const c = Q.ctrls(h);
      Q.button(c, '재생 ▶', () => { if (t >= 4.5) t = 0; A.running ? A.stop() : A.start(); }, 'primary');
      const st = Q.slider(c, { label: 't', min: 0, max: 4.5, value: 0 }, v => { t = v; upd(); });
      requestAnimationFrame(upd); Q.note(h, 'x(t) = t³ − 6t² + 9t. 속도와 가속도의 부호가 같으면 빨라지고, 다르면 느려져.');
    },
    guess: { q: '$v=0$인 순간 점은?', opts: ['운동 방향이 바뀔 수 있다', '계속 멈춰 있다', '가속도도 반드시 0이다'], ans: 0, why: T`공을 위로 던지면 꼭대기에서 $v=0$이지만 가속도는 여전히 아래 방향(중력)이야. $v$의 부호가 바뀌면 방향이 바뀌어.` },
    theorem: T`<h4>수직선 위의 운동</h4><p>시각 $t$에서의 위치가 $x=f(t)$이면</p><p>속도 $v=\dfrac{dx}{dt}=f'(t)$, 가속도 $a=\dfrac{dv}{dt}$, 속력은 $|v|$.</p><p><b>운동 방향이 바뀐다</b> ⇔ $v$의 부호가 바뀐다.</p>`,
    proof: [T`$t$에서 $t+h$까지 평균 속도는 $\dfrac{f(t+h)-f(t)}{h}$.`, T`$h\to0$이면 그 시각의 순간 속도, 곧 $f'(t)$야.`, T`속도도 시간의 함수이니까 다시 미분하면 속도의 순간변화율, 곧 가속도가 나와.`],
    exam: [T`"운동 방향을 바꾸는 시각": $v(t)=0$이면서 부호가 바뀌는 $t$.`, T`두 점 P, Q의 위치가 주어지고 "두 점이 만나는 시각"이나 "속도가 같아지는 시각"을 묻는 문제.`],
    probs: [
      { lv: 2, q: T`수직선 위를 움직이는 점 P의 시각 $t$에서의 위치가 $x(t)=t^3-6t^2+9t$일 때, 점 P가 운동 방향을 바꾸는 모든 시각의 합을 구하시오.`, ans: 4, hints: [T`$v(t)=3(t-1)(t-3)$`], sol: T`$t=1,3$에서 부호가 바뀌니까 합 $4$.` },
      { lv: 3, q: T`위 점 P의 가속도가 0일 때 점 P의 속도를 구하시오.`, ans: -3, hints: [T`$a(t)=6t-12$`], sol: T`$t=2$, $v(2)=12-24+9=-3$.` },
      { lv: 2, q: T`지면에서 위로 던진 공의 $t$초 후 높이가 $h(t)=20t-5t^2$ (m)일 때, 공이 도달하는 최고 높이를 구하시오.`, ans: 20, hints: [T`최고점에서 $h'(t)=0$`], sol: T`$20-10t=0$에서 $t=2$, $h(2)=20$.` }]
  }]},

  { name: '적분', rooms: [

  { id: 'c1-antideriv', title: '부정적분', who: '고트프리트 라이프니츠', year: '1675',
    card: T`$\displaystyle\int x^n\,dx=\frac{1}{n+1}x^{n+1}+C$ : 미분의 역연산, $C$는 평행이동`,
    mystery: T`<p>미분이 위치에서 속도를 구하는 거라면, 거꾸로 속도만 알 때 위치를 알 수 있을까?</p><p>이 화면의 짧은 선분들은 각 점에서의 <b>기울기</b>만 알려줘. 이 기울기들을 따라가는 곡선을 그릴 수 있을까? 그런 곡선은 몇 개나 있을까?</p>`,
    try: '그래프 위 아무 곳이나 끌어서 출발점을 정해 봐. 그 점을 지나며 화살표를 따라가는 곡선이 그려져. 출발점을 바꾸면 곡선은 어떻게 변해?',
    sim(h, Q) {
      const fs = [{ n: "F′(x) = 2x", d: x => 2 * x, F: x => x * x, s: 'x²' }, { n: "F′(x) = x² − 1", d: x => x * x - 1, F: x => x ** 3 / 3 - x, s: 'x³/3 − x' }, { n: "F′(x) = −x", d: x => -x, F: x => -x * x / 2, s: '−x²/2' }];
      let k = 0, x0 = 0, y0 = 0; const out = Q.readout(document.createElement('div'));
      const P = Q.plot(h, { xmin: -3, xmax: 3, ymin: -3, ymax: 4, onDrag: (x, y) => { x0 = x; y0 = y; P.redraw(); }, draw: P => {
        const F = fs[k], c = P.c; P.grid();
        for (let x = -2.8; x <= 2.81; x += 0.4) for (let y = -2.8; y <= 3.81; y += 0.4) { const m = F.d(x), L = 0.15 / Math.sqrt(1 + m * m); P.seg(x - L, y - m * L, x + L, y + m * L, c.muted, 1.3); }
        const C = y0 - F.F(x0);
        for (let j = -3; j <= 3; j++) if (j) P.fn(x => F.F(x) + C + j, c.grid, 1.5);
        P.fn(x => F.F(x) + C, c.y, 2.8); P.dot(x0, y0, c.p, 7);
        out.innerHTML = `${F.n} → F(x) = ${F.s} + C<br>지금 고른 곡선: <span class="y">C = ${C.toFixed(3)}</span>  (출발점 (${x0.toFixed(2)}, ${y0.toFixed(2)})를 지나도록 결정됨)`;
      } });
      const c = Q.ctrls(h);
      Q.select(c, '기울기 규칙', fs.map(f => f.n), v => { k = v; P.redraw(); });
      h.append(out); Q.note(h, '흐린 곡선들은 같은 기울기 규칙을 따르는 다른 곡선들이야. 모두 위아래로 평행이동한 관계지.');
    },
    guess: { q: T`$F'(x)=2x$를 만족시키는 함수 $F$는 몇 개일까?`, opts: ['하나 ($x^2$)', '무수히 많다'], ans: 1, why: T`$x^2$, $x^2+1$, $x^2-7$은 모두 미분하면 $2x$야. 상수는 미분하면 사라지니까 거꾸로 갈 때는 $+C$를 붙여서 "모든 가능성"을 한꺼번에 나타내.` },
    theorem: T`<h4>정의</h4><p>$F'(x)=f(x)$일 때 $F$를 $f$의 <b>부정적분</b>(원시함수)이라 하고</p>$$\int f(x)\,dx=F(x)+C\quad(C\text{는 적분상수})$$<h4>공식</h4><p>$\displaystyle\int x^n\,dx=\frac{1}{n+1}x^{n+1}+C$ ($n$은 0 이상의 정수)</p><p>$\int kf\,dx=k\int f\,dx$, $\int(f\pm g)\,dx=\int f\,dx\pm\int g\,dx$</p><h4>주의</h4><p>$\dfrac{d}{dx}\int f(x)\,dx=f(x)$이지만 $\int\left\{\dfrac{d}{dx}f(x)\right\}dx=f(x)+C$야.</p>`,
    proof: [T`$F'=G'=f$라고 하자. $H=F-G$로 두면 $H'=0$.`, T`평균값 정리: 임의의 $a<b$에 대하여 $H(b)-H(a)=H'(c)(b-a)=0$.`, T`그러니까 $H$는 상수. 원시함수끼리는 상수만큼만 차이 나.`],
    exam: [T`$f'(x)$와 $f(0)$ 같은 조건 하나를 주고 $f(2)$를 구하는 문제: 적분한 뒤 조건으로 $C$를 결정.`, T`$\int f\,dx=xf(x)-\cdots$ 꼴: <b>양변을 미분</b>해서 $f'$에 대한 식으로 바꿔.`],
    probs: [
      { lv: 2, q: T`$f'(x)=3x^2-4x+1$이고 $f(0)=2$일 때, $f(2)$의 값을 구하시오.`, ans: 4, hints: [T`$f(x)=x^3-2x^2+x+C$`], sol: T`$C=2$, $f(2)=8-8+2+2=4$.` },
      { lv: 3, q: T`$F(x)=\displaystyle\int\left\{\frac{d}{dx}(x^3-2x)\right\}dx$이고 $F(0)=5$일 때, $F(2)$의 값을 구하시오.`, ans: 9, hints: [T`$F(x)=x^3-2x+C$`], sol: T`$C=5$, $F(2)=8-4+5=9$.` },
      { lv: 4, q: T`다항함수 $f$가 $\displaystyle\int f(x)\,dx=xf(x)-2x^3+x^2+C$, $f(1)=4$를 만족시킬 때, $f(2)$의 값을 구하시오.`, ans: 11, hints: ['양변을 미분해.', T`$f=f+xf'-6x^2+2x$, 곧 $f'(x)=6x-2$`], sol: T`$f(x)=3x^2-2x+c$, $f(1)=1+c=4$이니까 $c=3$. $f(2)=12-4+3=11$.` }]
  },

  { id: 'c1-riemann', title: '정적분: 넓이를 쌓는 법', who: '베른하르트 리만', year: '1854',
    card: T`$\displaystyle\int_a^b f(x)\,dx=F(b)-F(a)$ : 넓이를 아주 가는 직사각형들의 합으로`,
    mystery: T`<p>직사각형이나 삼각형의 넓이는 쉽게 구하지만, 곡선으로 둘러싸인 넓이는 어떻게 잴까?</p><p>리만의 생각은 단순해. 아주 가는 직사각형으로 잘라서 더하는 거야. 직사각형을 무한히 가늘게 만들면 오차는 어디로 갈까?</p>`,
    try: 'n을 키워서 직사각형을 가늘게 만들어 봐. 왼쪽합·오른쪽합·중점합을 바꿔 보고, 음수 영역이 있는 함수도 시도해.',
    sim(h, Q) {
      const fs = [{ n: 'x² on [0, 2]', f: x => x * x, F: x => x ** 3 / 3, a: 0, b: 2, v: [-0.3, 2.4, -0.6, 4.5] }, { n: 'x³ − 3x + 3 on [−1, 2]', f: x => x ** 3 - 3 * x + 3, F: x => x ** 4 / 4 - 1.5 * x * x + 3 * x, a: -1, b: 2, v: [-1.5, 2.4, -0.6, 6] }, { n: 'x² − 2 on [0, 3] (음수 구간 포함)', f: x => x * x - 2, F: x => x ** 3 / 3 - 2 * x, a: 0, b: 3, v: [-0.3, 3.3, -2.8, 7.5] }];
      let k = 0, n = 4, m = 0; const out = Q.readout(document.createElement('div'));
      const P = Q.plot(h, { draw: P => {
        const F = fs[k], c = P.c; [P.xmin, P.xmax, P.ymin, P.ymax] = F.v; P.grid();
        const dx = (F.b - F.a) / n; let s = 0;
        for (let i = 0; i < n; i++) { const x = F.a + i * dx, t = m === 0 ? x : m === 1 ? x + dx : x + dx / 2, y = F.f(t); s += y * dx; P.rect(x, Math.min(0, y), x + dx, Math.max(0, y), y >= 0 ? c.yF : c.pF, n <= 60 ? (y >= 0 ? c.y : c.p) : null); }
        P.fn(F.f, c.b, 2.6); const ex = F.F(F.b) - F.F(F.a);
        out.innerHTML = `n = ${n} · 직사각형 폭 Δx = ${dx.toFixed(4)}<br><span class="y">${['왼쪽', '오른쪽', '중점'][m]}합 Σ f(x<sub>k</sub>)Δx = ${s.toFixed(6)}</span><br><span class="g">정적분 F(b) − F(a) = ${ex.toFixed(6)}</span> · 오차 ${Math.abs(s - ex).toExponential(2)}${k === 2 ? '<br><span class="p">x축 아래 넓이는 음수로 더해져. 정적분은 "부호가 있는 넓이"야.</span>' : ''}`;
      } });
      const c = Q.ctrls(h);
      Q.select(c, '함수', fs.map(f => f.n), v => { k = v; P.redraw(); });
      Q.select(c, '높이 기준', ['왼쪽 끝', '오른쪽 끝', '중점'], v => { m = v; P.redraw(); });
      Q.slider(c, { label: 'n', min: 1, max: 200, step: 1, value: 4, fmt: v => v }, v => { n = v; P.redraw(); });
      h.append(out);
    },
    guess: { q: 'n을 한없이 키우면 왼쪽합과 오른쪽합은?', opts: ['같은 값으로 모인다', '계속 차이가 난다', '둘 다 무한대가 된다'], ans: 0, why: '둘의 차이는 맨 끝 직사각형 하나 정도인데, 그 폭이 0으로 가니까 차이도 0으로 가. 그 공통의 극한이 정적분이야(구분구적법은 미적분Ⅱ에서 정확하게 다뤄).' },
    theorem: T`<h4>정의</h4><p>$f$가 $[a,b]$에서 연속이고 $F$가 $f$의 한 부정적분일 때</p>$$\int_a^b f(x)\,dx=\Big[F(x)\Big]_a^b=F(b)-F(a)$$<p>$f(x)\ge0$이면 이 값은 곡선과 $x$축 사이의 넓이야. $f<0$인 부분은 음수로 계산돼.</p><h4>성질</h4><p>$\int_a^a f=0$, $\int_b^a f=-\int_a^b f$, $\int_a^c f+\int_c^b f=\int_a^b f$</p><p><b>대칭</b> $\int_{-a}^a(\text{홀수차항})\,dx=0$, $\int_{-a}^a(\text{짝수차항})\,dx=2\int_0^a(\cdots)\,dx$</p>`,
    proof: [T`$F$ 대신 $F+C$를 써도 $(F(b)+C)-(F(a)+C)=F(b)-F(a)$.`, T`그래서 정적분 값은 어떤 원시함수를 골라도 똑같아.`, T`왜 이 값이 "넓이"인지는 다음 연구실(미적분의 기본정리)에서 증명해.`],
    exam: [T`구간 $[-a,a]$의 정적분: 홀수차항을 먼저 지우면 계산이 반으로 줄어.`, T`절댓값 적분 $\int|f(x)|\,dx$: $f$의 부호가 바뀌는 점에서 구간을 나눠.`, T`구간별로 정의된 함수의 정적분: 구간을 쪼개서 더해.`],
    probs: [
      { lv: 2, q: T`$\displaystyle\int_0^2(3x^2-2x)\,dx$의 값을 구하시오.`, ans: 4, hints: [T`$\left[x^3-x^2\right]_0^2$`], sol: T`$8-4=4$` },
      { lv: 3, q: T`$\displaystyle\int_{-1}^{1}(x^3+6x^2+5x+1)\,dx$의 값을 구하시오.`, ans: 6, hints: [T`홀수차항 $x^3$, $5x$는 대칭 구간에서 0.`], sol: T`$2\int_0^1(6x^2+1)\,dx=2(2+1)=6$` },
      { lv: 3, q: T`$\displaystyle\int_0^3|x-1|\,dx$의 값을 구하시오.`, ans: 2.5, hints: [T`$x=1$에서 나눠. 삼각형 두 개야.`], sol: T`$\frac12\cdot1\cdot1+\frac12\cdot2\cdot2=\frac12+2=2.5$` }]
  },

  { id: 'c1-ftc', title: '미적분의 기본정리', who: '뉴턴 · 라이프니츠 · 아이작 배로', year: '1670년대',
    card: T`$\displaystyle\frac{d}{dx}\int_a^x f(t)\,dt=f(x)$ : 넓이의 변화율은 높이`,
    mystery: T`<p>미분은 접선(기울기) 문제에서, 적분은 넓이 문제에서 출발했어. 2000년 동안 전혀 다른 문제라고 여겨졌지.</p><p>그런데 넓이를 <b>함수</b>로 만들면 놀라운 일이 생겨. 왼쪽 끝을 고정하고 오른쪽 끝 $x$를 움직이면 넓이 $S(x)$가 변해. 이 넓이 함수를 미분하면 뭐가 나올까?</p>`,
    try: 'x를 움직여 봐. 위에서 쌓이는 넓이가 아래 S(x)의 높이가 되고, S(x)의 접선 기울기는 위 그래프의 높이 f(x)와 같아.',
    sim(h, Q) {
      const fs = [{ n: 'f(t) = t − 1', f: t => t - 1 }, { n: 'f(t) = t² − 2t', f: t => t * t - 2 * t }, { n: 'f(t) = 2 − t²/2', f: t => 2 - t * t / 2 }];
      let k = 0, x = 2.5; const S = (k, x) => Q.integrate(fs[k].f, 0, x, 300);
      const top = Q.plot(h, { xmin: -0.3, xmax: 4.2, ymin: -3, ymax: 4, aspect: 0.4, draw: P => { const c = P.c, f = fs[k].f; P.grid(); P.between(t => Math.max(f(t), 0), () => 0, 0, x, c.yF); P.between(t => Math.min(f(t), 0), () => 0, 0, x, c.pF); P.fn(f, c.b, 2.6); P.vline(x, c.chalk, [3, 4]); P.dot(x, f(x), c.b, 6); P.text(P.xmin, P.ymax, 'y = f(t), 칠한 넓이 = S(x)', c.b, 'left', 8, 22); } });
      const bot = Q.plot(h, { xmin: -0.3, xmax: 4.2, ymin: -3, ymax: 4, aspect: 0.4, draw: P => { const c = P.c; P.grid(); P.fn(t => S(k, t), c.y, 2.6, 0, 4.2); const s = S(k, x); P.line(x, s, fs[k].f(x), c.g, 1.8, [7, 5]); P.dot(x, s, c.y, 6); P.text(P.xmin, P.ymax, 'y = S(x) = ∫₀ˣ f(t) dt', c.y, 'left', 8, 22); } });
      const out = Q.readout(h);
      const upd = () => { top.redraw(); bot.redraw(); out.innerHTML = `x = ${x.toFixed(2)} · <span class="y">S(x) = ${S(k, x).toFixed(4)}</span><br><span class="g">S의 접선 기울기 S′(x) ≈ ${Q.deriv(t => S(k, t), x, 1e-3).toFixed(4)}</span>  vs  <span class="b">f(x) = ${fs[k].f(x).toFixed(4)}</span>  → 같다!`; };
      const c = Q.ctrls(h);
      Q.select(c, '함수', fs.map(f => f.n), v => { k = v; upd(); });
      Q.slider(c, { label: 'x', min: 0, max: 4, value: 2.5 }, v => { x = v; upd(); });
      requestAnimationFrame(upd);
    },
    guess: { q: T`$S(x)=\displaystyle\int_0^x f(t)\,dt$일 때 $S'(x)$는?`, opts: ['$f(x)$', '$F(x)$', "$f'(x)$", '0'], ans: 0, why: T`$x$를 $h$만큼 늘리면 넓이는 폭 $h$, 높이 약 $f(x)$인 가는 띠만큼 늘어. 늘어난 넓이 ÷ $h$ ≈ $f(x)$. 미분과 적분은 서로 거꾸로 가는 연산이야.` },
    theorem: T`<h4>미적분의 기본정리</h4><p>$f$가 연속이면</p>$$\frac{d}{dx}\int_a^x f(t)\,dt=f(x)$$<p>그리고 이로부터 $F'=f$이면 $\displaystyle\int_a^b f(x)\,dx=F(b)-F(a)$.</p><h4>자주 쓰는 변형</h4><p>$\displaystyle\lim_{h\to0}\frac1h\int_a^{a+h}f(t)\,dt=f(a)$</p><p>$\displaystyle\int_a^x f(t)\,dt=g(x)$이면 ① $x=a$ 대입: $g(a)=0$, ② 양변 미분: $f(x)=g'(x)$</p>`,
    proof: [T`$S(x+h)-S(x)=\displaystyle\int_x^{x+h}f(t)\,dt$ (가는 띠의 넓이)`, T`구간 $[x,x+h]$에서 $f$의 최솟값을 $m_h$, 최댓값을 $M_h$라 하면 $m_h\cdot h\le S(x+h)-S(x)\le M_h\cdot h$.`, T`$h$로 나누면 $m_h\le\dfrac{S(x+h)-S(x)}{h}\le M_h$.`, T`$f$가 연속이니까 $h\to0$이면 $m_h, M_h\to f(x)$. 샌드위치로 $S'(x)=f(x)$.`],
    exam: [T`$\int_1^x f(t)\,dt=x^3+ax^2-2$ 꼴: <b>대입 한 번, 미분 한 번</b>. 수능 적분 단원 최다 출제 유형이야.`, T`$f(x)=\int_a^x(\cdots)\,dt$의 극값: $f'(x)$가 적분 안의 식이니까 그 부호를 봐.`, T`$\int_a^x(x-t)f(t)\,dt$: $x$를 적분 밖으로 꺼낸 뒤 미분해.`],
    probs: [
      { lv: 3, q: T`함수 $f(x)=\displaystyle\int_1^x(t^2-4t+3)\,dt$의 극댓값과 극솟값의 차는?`, opts: ['$\\frac23$', '$1$', '$\\frac43$', '$\\frac53$', '$2$'], ans: 2, hints: [T`$f'(x)=(x-1)(x-3)$`, T`극대 $f(1)=0$, 극소 $f(3)$`], sol: T`$f(3)=\left[\frac{t^3}3-2t^2+3t\right]_1^3=0-\frac43$. 차는 $\frac43$.` },
      { lv: 4, q: T`다항함수 $f$가 모든 실수 $x$에 대하여 $\displaystyle\int_1^x f(t)\,dt=x^3+ax^2-2$를 만족시킬 때, $f(2)$의 값을 구하시오. (단, $a$는 상수)`, ans: 16, hints: [T`$x=1$ 대입: $0=1+a-2$`, T`미분: $f(x)=3x^2+2ax$`], sol: T`$a=1$, $f(x)=3x^2+2x$, $f(2)=16$.` },
      { lv: 3, q: T`$\displaystyle\lim_{h\to0}\frac1h\int_2^{2+h}(t^3+1)\,dt$의 값을 구하시오.`, ans: 9, hints: ['가는 띠의 넓이 ÷ 폭 = 높이'], sol: T`$f(2)=8+1=9$` }]
  },

  { id: 'c1-area', title: '곡선 사이의 넓이', who: '시라쿠사의 아르키메데스', year: '기원전 250년경',
    card: T`포물선 $y=ax^2+\cdots$와 직선으로 둘러싸인 넓이 $=\dfrac{|a|(\beta-\alpha)^3}{6}$`,
    mystery: T`<p>아르키메데스는 적분이 생기기 1900년 전에 포물선 조각의 넓이를 정확히 구했어. 답은 "그 안에 넣은 삼각형 넓이의 정확히 $\frac43$배"였어.</p><p>왜 하필 $\frac43$일까? 그리고 직선의 기울기를 2배로 하면 넓이는 몇 배가 될까?</p>`,
    try: 'k를 2배로 키우면서 넓이가 몇 배가 되는지 확인해 봐. "아르키메데스의 삼각형"을 켜고 비율도 봐.',
    sim(h, Q) {
      let k = 2, tri = false; const out = Q.readout(document.createElement('div'));
      const P = Q.plot(h, { xmin: -1, xmax: 5, ymin: -1, ymax: 17, draw: P => {
        const c = P.c, f = x => x * x, g = x => k * x; P.grid(); P.between(g, f, 0, k, c.yF); P.fn(f, c.b, 2.6); P.fn(g, c.p, 2.2);
        P.dot(0, 0, c.chalk, 4); P.dot(k, k * k, c.chalk, 4);
        if (tri) { const cx = k / 2; P.ctx.fillStyle = c.gF; P.ctx.beginPath(); P.ctx.moveTo(P.X(0), P.Y(0)); P.ctx.lineTo(P.X(k), P.Y(k * k)); P.ctx.lineTo(P.X(cx), P.Y(cx * cx)); P.ctx.closePath(); P.ctx.fill(); P.ctx.strokeStyle = c.g; P.ctx.lineWidth = 2; P.ctx.stroke(); P.line(cx, cx * cx, k, c.g, 1.3, [5, 5]); }
        const A = Q.integrate(x => g(x) - f(x), 0, k), Tr = k ** 3 / 8;
        out.innerHTML = `y = x² 와 y = ${k.toFixed(2)}x · 교점 x = 0, ${k.toFixed(2)}<br><span class="y">넓이 = ∫₀ᵏ (kx − x²) dx = ${A.toFixed(4)}</span>  ·  k³/6 = ${(k ** 3 / 6).toFixed(4)}${tri ? `<br><span class="g">삼각형 넓이 = ${Tr.toFixed(4)}</span> · 비율 = ${(A / Tr).toFixed(4)}  (= 4/3)` : ''}`;
      } });
      const c = Q.ctrls(h);
      Q.slider(c, { label: 'k (직선 기울기)', min: 0.5, max: 4, value: 2 }, v => { k = v; P.redraw(); });
      const tb = Q.button(c, '아르키메데스의 삼각형', () => { tri = !tri; tb.classList.toggle('on', tri); P.redraw(); });
      h.append(out); Q.note(h, '초록 삼각형의 세 번째 꼭짓점은 직선과 평행한 접선의 접점이야(x = k/2).');
    },
    guess: { q: T`$y=x^2$와 $y=kx$ 사이의 넓이. $k$를 2배로 하면 넓이는?`, opts: ['2배', '4배', '8배'], ans: 2, why: T`넓이 $=\dfrac{k^3}{6}$. 가로(교점 사이 거리)가 2배, 세로(높이)가 4배라서 $2\times4=8$배가 돼.` },
    theorem: T`<h4>두 곡선 사이의 넓이</h4><p>$[a,b]$에서 두 곡선 $y=f(x)$, $y=g(x)$ 사이의 넓이:</p>$$S=\int_a^b|f(x)-g(x)|\,dx$$<p>(위 곡선) − (아래 곡선)을 적분해. 위아래가 바뀌는 점에서는 구간을 나눠.</p><h4>포물선과 직선 공식</h4><p>$y=ax^2+bx+c$와 직선이 $x=\alpha,\beta$에서 만나면 둘러싸인 넓이는 $\dfrac{|a|(\beta-\alpha)^3}{6}$.</p>`,
    proof: [T`포물선 − 직선 $=a(x-\alpha)(x-\beta)$로 쓸 수 있어.`, T`$\displaystyle\int_\alpha^\beta(x-\alpha)(x-\beta)\,dx$에서 $x-\alpha=t$로 두고 $d=\beta-\alpha$라 하면 $\displaystyle\int_0^{d}t(t-d)\,dt$.`, T`$=\left[\dfrac{t^3}{3}-\dfrac{dt^2}{2}\right]_0^d=\dfrac{d^3}{3}-\dfrac{d^3}{2}=-\dfrac{d^3}{6}$`, T`절댓값을 씌우면 $\dfrac{|a|(\beta-\alpha)^3}{6}$.`],
    exam: [T`교점부터 구해. 넓이 문제의 90%는 교점 찾기에서 끝나.`, T`넓이가 주어지고 미지수를 묻는 문제는 $\frac{|a|d^3}{6}$ 공식으로 빠르게 풀어.`, T`"두 부분의 넓이가 같다" ⇔ 전체 정적분 $=0$. 넓이를 따로 구하지 않아도 돼.`],
    probs: [
      { lv: 2, q: T`곡선 $y=x^2-2x$와 $x$축으로 둘러싸인 부분의 넓이는?`, opts: ['$1$', '$\\frac43$', '$\\frac53$', '$2$', '$\\frac83$'], ans: 1, hints: [T`교점 $x=0,2$`], sol: T`$\frac{1\cdot2^3}{6}=\frac43$` },
      { lv: 3, q: T`곡선 $y=x^2$과 직선 $y=x+2$로 둘러싸인 부분의 넓이를 구하시오.`, ans: 4.5, hints: [T`$x^2-x-2=0$에서 $x=-1,2$`], sol: T`$\frac{3^3}{6}=4.5$` },
      { lv: 3, q: T`곡선 $y=x^2$과 직선 $y=kx\ (k>0)$로 둘러싸인 부분의 넓이가 $36$일 때, $k$의 값을 구하시오.`, ans: 6, hints: [T`넓이 $=\frac{k^3}{6}$`], sol: T`$k^3=216$, $k=6$.` }]
  },

  { id: 'c1-distance', title: '속도와 거리', who: '니콜 오렘', year: '1350년경',
    card: T`위치의 변화량 $=\displaystyle\int_a^b v(t)\,dt$, 움직인 거리 $=\displaystyle\int_a^b|v(t)|\,dt$`,
    mystery: T`<p>14세기 파리의 오렘은 속도를 세로, 시간을 가로로 그린 그림을 처음 생각했어. 그리고 <b>그래프 아래 넓이가 이동한 거리</b>라는 걸 알아냈지. 미적분보다 300년이나 앞선 발견이야.</p><p>그런데 뒤로 가면 어떻게 될까? 앞으로 3 m 갔다가 뒤로 3 m 오면 위치 변화는 0이지만 걸은 거리는 6 m야.</p>`,
    try: '재생을 눌러 v가 음수가 되는 구간에서 점이 뒤로 가는 걸 봐. 위치 변화량과 움직인 거리가 어떻게 달라지는지 비교해.',
    sim(h, Q) {
      const V = t => t * t - 4 * t + 3, X = t => t ** 3 / 3 - 2 * t * t + 3 * t; let T0 = 0;
      const line = Q.plot(h, { xmin: -1, xmax: 7.5, ymin: -1, ymax: 1, aspect: 0.12, draw: P => { const c = P.c; P.grid({ axes: false, sy: 10 }); P.hline(0, c.axis, []); for (let i = 0; i <= 7; i++) P.text(i, 0, String(i), c.muted, 'center', 0, 20, 11); P.dot(0, 0, c.muted, 3); P.dot(X(T0), 0, V(T0) >= 0 ? c.g : c.p, 9); } });
      const gr = Q.plot(h, { xmin: -0.2, xmax: 5.2, ymin: -1.5, ymax: 8.5, aspect: 0.45, draw: P => { const c = P.c; P.grid(); P.between(t => Math.max(V(t), 0), () => 0, 0, T0, c.gF); P.between(t => Math.min(V(t), 0), () => 0, 0, T0, c.pF); P.fn(V, c.y, 2.6, 0, 5); P.vline(T0, c.chalk, [3, 4]); P.dot(T0, V(T0), c.y, 6); P.text(5, V(5), 'v(t)', c.y, 'right', -6, 0); } });
      const out = Q.readout(h);
      const upd = () => { line.redraw(); gr.redraw(); const disp = X(T0), dist = Q.integrate(t => Math.abs(V(t)), 0, T0, 600); out.innerHTML = `t = ${T0.toFixed(2)} · v = ${V(T0).toFixed(3)}<br><span class="b">위치 변화량 ∫v dt = ${disp.toFixed(4)}</span>  (초록 넓이 − 분홍 넓이)<br><span class="y">움직인 거리 ∫|v| dt = ${dist.toFixed(4)}</span>  (초록 넓이 + 분홍 넓이)`; };
      const A = Q.anim(dt => { T0 += dt * 0.8; if (T0 >= 5) { T0 = 5; st.set(T0); return false; } st.set(T0); });
      const c = Q.ctrls(h);
      Q.button(c, '재생 ▶', () => { if (T0 >= 5) T0 = 0; A.running ? A.stop() : A.start(); }, 'primary');
      const st = Q.slider(c, { label: 't', min: 0, max: 5, value: 0 }, v => { T0 = v; upd(); });
      requestAnimationFrame(upd); Q.note(h, 'v(t) = t² − 4t + 3, 출발점은 원점.');
    },
    guess: { q: '$v(t)<0$인 구간의 넓이는 위치를 어떻게 바꿀까?', opts: ['증가시킨다', '감소시킨다', '영향이 없다'], ans: 1, why: '속도가 음수면 뒤로 가니까 위치는 줄어. 정적분은 이 부분을 자동으로 빼 주고, 거리를 구할 때는 절댓값을 씌워서 더해.' },
    theorem: T`<h4>수직선 위의 운동</h4><p>속도가 $v(t)$이고 $t=a$에서의 위치가 $x(a)$이면</p><p>$t=b$에서의 위치: $x(b)=x(a)+\displaystyle\int_a^b v(t)\,dt$</p><p>$a$부터 $b$까지 위치의 변화량: $\displaystyle\int_a^b v(t)\,dt$</p><p>$a$부터 $b$까지 움직인 거리: $\displaystyle\int_a^b|v(t)|\,dt$</p>`,
    proof: [T`$x'(t)=v(t)$이니까 $x$는 $v$의 원시함수야.`, T`미적분의 기본정리에 의해 $\int_a^b v\,dt=x(b)-x(a)$.`, T`거리는 방향과 상관없이 쌓여야 하니까 속력 $|v|$를 적분해.`],
    exam: [T`"출발 후 다시 원점으로 돌아오는 시각": $\int_0^t v\,ds=0$을 풀어.`, T`그래프로 주어진 $v(t)$: 넓이를 삼각형·사다리꼴로 직접 계산하는 경우가 많아.`, T`위치 변화량과 움직인 거리를 헷갈리게 하는 선지가 단골이야.`],
    probs: [
      { lv: 3, q: T`수직선 위를 움직이는 점의 속도가 $v(t)=t^2-4t+3$일 때, $t=0$부터 $t=3$까지 점이 움직인 거리는?`, opts: ['$0$', '$\\frac43$', '$2$', '$\\frac83$', '$4$'], ans: 3, hints: [T`$t=1$에서 부호가 바뀌어.`, T`$\int_0^1 v=\frac43$, $\int_1^3 v=-\frac43$`], sol: T`$\frac43+\frac43=\frac83$. 위치 변화량은 0이야.` },
      { lv: 2, q: T`$v(t)=2t-4$이고 $x(0)=1$일 때, $x(3)$의 값을 구하시오.`, ans: -2, hints: [T`$x(3)=1+\int_0^3(2t-4)\,dt$`], sol: T`$1+(9-12)=-2$` },
      { lv: 3, q: T`원점에서 출발하여 수직선 위를 움직이는 점의 속도가 $v(t)=3t^2-6t$일 때, 출발한 후 점이 다시 원점을 지나는 시각을 구하시오.`, ans: 3, hints: [T`$x(t)=t^3-3t^2$`], sol: T`$t^2(t-3)=0$, $t>0$이니까 $t=3$.` }]
  }]}]
});
