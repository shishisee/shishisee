export function h<K extends keyof HTMLElementTagNameMap>(tag: K, cls = '', html = ''): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html) e.innerHTML = html;
  return e;
}

export function slider(opts: {
  label: string; min: number; max: number; step: number; value: number;
  fmt: (v: number) => string; onInput: (v: number) => void; wide?: boolean;
}) {
  const wrap = h('label', 'ctl slider' + (opts.wide ? ' wide' : ''));
  const top = h('span', 'ctl-top');
  const name = h('span', 'ctl-name', opts.label);
  const val = h('span', 'ctl-val', opts.fmt(opts.value));
  top.append(name, val);
  const input = h('input');
  input.type = 'range';
  input.min = String(opts.min); input.max = String(opts.max); input.step = String(opts.step);
  input.value = String(opts.value);
  input.addEventListener('input', () => {
    const v = parseFloat(input.value);
    val.textContent = opts.fmt(v);
    opts.onInput(v);
  });
  wrap.append(top, input);
  return {
    el: wrap,
    set(v: number) { input.value = String(v); val.textContent = opts.fmt(v); },
  };
}

export function toggle(label: string, value: boolean, on: (v: boolean) => void) {
  const b = h('button', 'chip' + (value ? ' on' : ''), label);
  b.type = 'button';
  b.setAttribute('aria-pressed', String(value));
  let v = value;
  b.addEventListener('click', () => { v = !v; b.classList.toggle('on', v); b.setAttribute('aria-pressed', String(v)); on(v); });
  return { el: b, set(x: boolean) { v = x; b.classList.toggle('on', v); b.setAttribute('aria-pressed', String(v)); } };
}

export function segmented<T extends string>(items: { id: T; label: string }[], value: T, on: (v: T) => void) {
  const g = h('div', 'seg');
  const btns = new Map<T, HTMLButtonElement>();
  for (const it of items) {
    const b = h('button', it.id === value ? 'on' : '', it.label);
    b.type = 'button';
    b.addEventListener('click', () => { set(it.id); on(it.id); });
    btns.set(it.id, b);
    g.appendChild(b);
  }
  function set(v: T) { for (const [id, b] of btns) b.classList.toggle('on', id === v); }
  return { el: g, set };
}

export function playButton(playing: boolean, on: (p: boolean) => void) {
  const b = h('button', 'play');
  b.type = 'button';
  let p = playing;
  const draw = () => {
    b.innerHTML = p
      ? '<svg viewBox="0 0 24 24" width="22" height="22"><rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor"/><rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor"/></svg>'
      : '<svg viewBox="0 0 24 24" width="22" height="22"><path d="M7 4.5v15l13-7.5z" fill="currentColor"/></svg>';
    b.setAttribute('aria-label', p ? '멈춤' : '재생');
  };
  draw();
  b.addEventListener('click', () => { p = !p; draw(); on(p); });
  return { el: b, set(x: boolean) { p = x; draw(); }, get: () => p };
}

export function group(title: string, ...kids: HTMLElement[]) {
  const g = h('div', 'cgroup');
  if (title) g.appendChild(h('div', 'cgroup-t', title));
  const body = h('div', 'cgroup-b');
  body.append(...kids);
  g.appendChild(body);
  return g;
}

export const fmtHour = (v: number) => {
  const hh = Math.floor(((v % 24) + 24) % 24);
  const mm = Math.floor((v - Math.floor(v)) * 60);
  const ap = hh < 12 ? '오전' : '오후';
  const h12 = hh % 12 === 0 ? 12 : hh % 12;
  return `${ap} ${h12}시${mm ? ' ' + String(mm).padStart(2, '0') + '분' : ''}`;
};

const MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
export function dayOfYearToDate(d: number) {
  let n = Math.floor(d);
  let m = 0;
  while (m < 11 && n >= MONTH_DAYS[m]) { n -= MONTH_DAYS[m]; m++; }
  return { month: m + 1, day: n + 1 };
}
export const fmtDoy = (d: number) => {
  const { month, day } = dayOfYearToDate(d);
  return `${month}월 ${day}일`;
};
