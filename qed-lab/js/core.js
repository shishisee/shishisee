/* Q.E.D. 연구소 — 시뮬레이션 엔진 (그래프, 컨트롤, 애니메이션) */
const Q = (() => {
  const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  const colors = () => ({
    chalk: css('--chalk'), muted: css('--muted'), grid: css('--grid'), axis: css('--axis'),
    y: css('--yellow'), b: css('--sky'), p: css('--pink'), g: css('--green'), r: css('--red'),
    panel: css('--panel'), board: css('--board'),
    yF: css('--yellow-fill'), bF: css('--sky-fill'), pF: css('--pink-fill'), gF: css('--green-fill')
  });

  let cleanups = [];
  const onCleanup = f => cleanups.push(f);
  const cleanup = () => { cleanups.forEach(f => { try { f(); } catch (e) {} }); cleanups = []; };

  let uid = 0;
  function el(tag, attrs = {}, ...kids) {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (k === 'class') e.className = v;
      else if (k === 'html') e.innerHTML = v;
      else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, v);
    }
    kids.flat().forEach(k => k != null && e.append(k.nodeType ? k : document.createTextNode(k)));
    return e;
  }

  function niceStep(range, target = 8) {
    const raw = range / target, p = 10 ** Math.floor(Math.log10(raw)), n = raw / p;
    return (n < 1.5 ? 1 : n < 3.5 ? 2 : n < 7.5 ? 5 : 10) * p;
  }
  const fmtTick = v => { const r = Math.round(v * 1000) / 1000; return Math.abs(r) < 1e-9 ? '0' : String(r); };

  /* 좌표 평면 캔버스 */
  function plot(parent, o = {}) {
    const wrap = el('div', { class: 'plot' });
    const cv = el('canvas', { role: 'img', 'aria-label': o.label || '시뮬레이션 그래프' });
    wrap.append(cv); parent.append(wrap);
    const ctx = cv.getContext('2d');
    const P = { xmin: o.xmin ?? -5, xmax: o.xmax ?? 5, ymin: o.ymin ?? -5, ymax: o.ymax ?? 5, ctx, cv, w: 0, h: 0, draw: o.draw || null, c: colors() };
    const aspect = o.aspect ?? 0.6;
    P.X = x => (x - P.xmin) / (P.xmax - P.xmin) * P.w;
    P.Y = y => P.h - (y - P.ymin) / (P.ymax - P.ymin) * P.h;
    P.ix = px => P.xmin + px / P.w * (P.xmax - P.xmin);
    P.iy = py => P.ymin + (P.h - py) / P.h * (P.ymax - P.ymin);
    P.redraw = () => { if (!P.w) return; P.c = colors(); ctx.clearRect(0, 0, P.w, P.h); P.draw && P.draw(P); };
    P.view = (a, b, c, d) => { P.xmin = a; P.xmax = b; P.ymin = c; P.ymax = d; P.redraw(); };
    function resize() {
      const w = wrap.clientWidth; if (!w) return;
      const h = Math.round(Math.max(200, Math.min(w * aspect, o.maxH || 480)));
      const dpr = window.devicePixelRatio || 1;
      cv.width = w * dpr; cv.height = h * dpr; cv.style.height = h + 'px';
      P.w = w; P.h = h; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); P.redraw();
    }
    const ro = new ResizeObserver(resize); ro.observe(wrap); onCleanup(() => ro.disconnect());
    const mq = matchMedia('(prefers-color-scheme: dark)'); const mqf = () => P.redraw();
    mq.addEventListener('change', mqf); onCleanup(() => mq.removeEventListener('change', mqf));

    P.grid = (opt = {}) => {
      const c = P.c, sx = opt.sx || niceStep(P.xmax - P.xmin, P.w < 500 ? 6 : 10), sy = opt.sy || niceStep(P.ymax - P.ymin, P.w < 500 ? 5 : 8);
      ctx.lineWidth = 1; ctx.strokeStyle = c.grid; ctx.beginPath();
      for (let x = Math.ceil(P.xmin / sx) * sx; x <= P.xmax; x += sx) { ctx.moveTo(P.X(x), 0); ctx.lineTo(P.X(x), P.h); }
      for (let y = Math.ceil(P.ymin / sy) * sy; y <= P.ymax; y += sy) { ctx.moveTo(0, P.Y(y)); ctx.lineTo(P.w, P.Y(y)); }
      ctx.stroke();
      if (opt.axes === false) return;
      ctx.strokeStyle = c.axis; ctx.lineWidth = 1.4; ctx.beginPath();
      const ax = Math.min(Math.max(P.Y(0), 0), P.h), ay = Math.min(Math.max(P.X(0), 0), P.w);
      ctx.moveTo(0, ax); ctx.lineTo(P.w, ax); ctx.moveTo(ay, 0); ctx.lineTo(ay, P.h); ctx.stroke();
      if (opt.labels === false) return;
      ctx.fillStyle = c.muted; ctx.font = '12px "IBM Plex Mono", monospace';
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      for (let x = Math.ceil(P.xmin / sx) * sx; x <= P.xmax; x += sx) if (Math.abs(x) > sx / 2) ctx.fillText(opt.fx ? opt.fx(x) : fmtTick(x), P.X(x), Math.min(ax + 4, P.h - 16));
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let y = Math.ceil(P.ymin / sy) * sy; y <= P.ymax; y += sy) if (Math.abs(y) > sy / 2) ctx.fillText(fmtTick(y), Math.max(ay - 5, 26), P.Y(y));
      ctx.textAlign = 'right'; ctx.textBaseline = 'top'; if (P.X(0) > 10 && P.Y(0) < P.h - 14) ctx.fillText('O', ay - 4, ax + 3);
    };
    P.fn = (f, color, lw = 2.5, x0 = P.xmin, x1 = P.xmax, dash) => {
      ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.setLineDash(dash || []); ctx.beginPath();
      const n = Math.max(200, Math.round(P.w * 1.5)); let pen = false, py = 0;
      for (let i = 0; i <= n; i++) {
        const x = x0 + (x1 - x0) * i / n, y = f(x), sy = P.Y(y);
        if (!isFinite(y) || Math.abs(sy) > P.h * 20 || (pen && Math.abs(sy - py) > P.h * 2)) { pen = false; continue; }
        pen ? ctx.lineTo(P.X(x), sy) : ctx.moveTo(P.X(x), sy); pen = true; py = sy;
      }
      ctx.stroke(); ctx.setLineDash([]);
    };
    P.curve = (fx, fy, t0, t1, color, lw = 2.5, n = 400) => {
      ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.beginPath();
      for (let i = 0; i <= n; i++) { const t = t0 + (t1 - t0) * i / n; i ? ctx.lineTo(P.X(fx(t)), P.Y(fy(t))) : ctx.moveTo(P.X(fx(t)), P.Y(fy(t))); }
      ctx.stroke();
    };
    P.seg = (x1, y1, x2, y2, color, lw = 2, dash) => {
      ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.setLineDash(dash || []);
      ctx.beginPath(); ctx.moveTo(P.X(x1), P.Y(y1)); ctx.lineTo(P.X(x2), P.Y(y2)); ctx.stroke(); ctx.setLineDash([]);
    };
    P.line = (x0, y0, m, color, lw = 2, dash) => P.seg(P.xmin, y0 + m * (P.xmin - x0), P.xmax, y0 + m * (P.xmax - x0), color, lw, dash);
    P.dot = (x, y, color, r = 5, hollow) => {
      ctx.beginPath(); ctx.arc(P.X(x), P.Y(y), r, 0, Math.PI * 2);
      if (hollow) { ctx.fillStyle = P.c.board; ctx.fill(); ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke(); }
      else { ctx.fillStyle = color; ctx.fill(); }
    };
    P.text = (x, y, s, color, align = 'left', dx = 6, dy = -6, size = 14) => {
      ctx.fillStyle = color || P.c.chalk; ctx.font = `${size}px "Gowun Batang", serif`; ctx.textAlign = align; ctx.textBaseline = 'bottom';
      ctx.fillText(s, P.X(x) + dx, P.Y(y) + dy);
    };
    P.rect = (x0, y0, x1, y1, fill, stroke) => {
      const a = P.X(x0), b = P.Y(y1), w = P.X(x1) - a, h = P.Y(y0) - b;
      if (fill) { ctx.fillStyle = fill; ctx.fillRect(a, b, w, h); }
      if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1.2; ctx.strokeRect(a, b, w, h); }
    };
    P.between = (f, g, x0, x1, fill, n = 240) => {
      ctx.fillStyle = fill; ctx.beginPath();
      for (let i = 0; i <= n; i++) { const x = x0 + (x1 - x0) * i / n; i ? ctx.lineTo(P.X(x), P.Y(f(x))) : ctx.moveTo(P.X(x), P.Y(f(x))); }
      for (let i = n; i >= 0; i--) { const x = x0 + (x1 - x0) * i / n; ctx.lineTo(P.X(x), P.Y(g(x))); }
      ctx.closePath(); ctx.fill();
    };
    P.vline = (x, color, dash = [5, 5], lw = 1.4) => P.seg(x, P.ymin, x, P.ymax, color, lw, dash);
    P.hline = (y, color, dash = [5, 5], lw = 1.4) => P.seg(P.xmin, y, P.xmax, y, color, lw, dash);

    if (o.onDrag) {
      cv.style.touchAction = 'none'; cv.style.cursor = 'grab';
      let down = false;
      const pos = e => { const r = cv.getBoundingClientRect(); return [P.ix(e.clientX - r.left), P.iy(e.clientY - r.top), e.clientX - r.left, e.clientY - r.top]; };
      cv.addEventListener('pointerdown', e => { down = true; cv.setPointerCapture(e.pointerId); o.onDrag(...pos(e), 'down'); });
      cv.addEventListener('pointermove', e => { if (down) o.onDrag(...pos(e), 'move'); });
      cv.addEventListener('pointerup', e => { down = false; o.onDrag(...pos(e), 'up'); });
    }
    if (o.onClick) { cv.style.cursor = 'pointer'; cv.addEventListener('click', e => { const r = cv.getBoundingClientRect(); o.onClick(P.ix(e.clientX - r.left), P.iy(e.clientY - r.top), e.clientX - r.left, e.clientY - r.top); }); }
    requestAnimationFrame(resize);
    return P;
  }

  /* 컨트롤 */
  const ctrls = parent => { const d = el('div', { class: 'ctrls' }); parent.append(d); return d; };
  function slider(parent, o, on) {
    const id = 'sl' + (++uid), out = el('output', { for: id });
    const inp = el('input', { type: 'range', id, min: o.min, max: o.max, step: o.step ?? 0.01, value: o.value });
    const fmt = o.fmt || (v => (+v).toFixed(2));
    const lab = el('label', { class: 'sl', for: id }, el('span', { class: 'sl-name', html: o.label }), inp, out);
    out.textContent = fmt(+inp.value);
    inp.addEventListener('input', () => { out.textContent = fmt(+inp.value); on && on(+inp.value); });
    parent.append(lab);
    return { get: () => +inp.value, set(v) { inp.value = v; out.textContent = fmt(+inp.value); on && on(+inp.value); }, el: inp };
  }
  function button(parent, label, on, cls = '') { const b = el('button', { type: 'button', class: 'btn ' + cls, html: label, onclick: on }); parent.append(b); return b; }
  function select(parent, label, opts, on) {
    const id = 'se' + (++uid);
    const s = el('select', { id }, ...opts.map((t, i) => el('option', { value: i }, t)));
    s.addEventListener('change', () => on(+s.value));
    parent.append(el('label', { class: 'sl', for: id }, el('span', { class: 'sl-name', html: label }), s));
    return s;
  }
  function readout(parent, cls = '') { const d = el('div', { class: 'readout ' + cls }); parent.append(d); return d; }
  function note(parent, html) { const d = el('p', { class: 'simnote', html }); parent.append(d); return d; }

  function anim(step) {
    let id = 0, last = 0, on = false;
    const tick = t => { if (!on) return; const dt = last ? Math.min(0.05, (t - last) / 1000) : 0.016; last = t; if (step(dt) === false) { on = false; return; } id = requestAnimationFrame(tick); };
    const A = { start() { if (on) return; on = true; last = 0; id = requestAnimationFrame(tick); }, stop() { on = false; cancelAnimationFrame(id); }, get running() { return on; } };
    onCleanup(() => A.stop());
    return A;
  }

  /* 수학 유틸 */
  const fact = n => { let r = 1; for (let i = 2; i <= n; i++) r *= i; return r; };
  const comb = (n, k) => { if (k < 0 || k > n) return 0; let r = 1; for (let i = 1; i <= k; i++) r = r * (n - k + i) / i; return Math.round(r); };
  const randn = () => { let u = 0, v = 0; while (!u) u = Math.random(); while (!v) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
  const normPdf = (x, m = 0, s = 1) => Math.exp(-((x - m) ** 2) / (2 * s * s)) / (s * Math.sqrt(2 * Math.PI));
  const erf = x => { const t = 1 / (1 + 0.3275911 * Math.abs(x)); const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x); return x >= 0 ? y : -y; };
  const Phi = z => 0.5 * (1 + erf(z / Math.SQRT2));
  const f2 = (v, d = 2) => { const r = (+v).toFixed(d); return r === '-0.00' ? '0.00' : r; };
  const integrate = (f, a, b, n = 400) => { const h = (b - a) / n; let s = f(a) + f(b); for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2); return s * h / 3; };
  const deriv = (f, x, h = 1e-5) => (f(x + h) - f(x - h)) / (2 * h);

  return { el, plot, ctrls, slider, button, select, readout, note, anim, onCleanup, cleanup, colors, fact, comb, randn, normPdf, Phi, f2, integrate, deriv, niceStep };
})();

/* 단원 등록소 */
const QED = { subjects: [] };
QED.subject = s => QED.subjects.push(s);
const T = String.raw;
