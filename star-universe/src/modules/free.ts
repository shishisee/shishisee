import * as THREE from 'three';
import type { Ctx, Mod } from '../app';
import { DEG, SEOUL, gmst, norm } from '../astro';
import { group, h, playButton, segmented, toggle } from '../ui';

export class Free implements Mod {
  id = 'free';
  name = '자유 관측';
  short = '지금 밤하늘';
  titleA = '';
  titleB = '🔭 서울의 실제 밤하늘 — 마음껏 둘러보기';
  single = true;
  ctx!: Ctx;
  t = Date.now();
  playing = true;
  speed = 1; // x real time
  ui!: HTMLElement;
  dt!: HTMLInputElement;
  toolsB!: HTMLElement;

  init(ctx: Ctx) {
    this.ctx = ctx;
    const ui = h('div', 'ctl-row');
    const play = playButton(true, (p) => (this.playing = p));
    const sp = segmented(
      [{ id: '1', label: '실제 속도' }, { id: '600', label: '10분/초' }, { id: '3600', label: '1시간/초' }],
      '1', (v) => (this.speed = parseFloat(v)),
    );
    this.dt = h('input', 'dt');
    this.dt.type = 'datetime-local';
    this.dt.addEventListener('change', () => {
      const v = this.dt.value; // KST
      if (v) this.t = Date.parse(v + ':00+09:00');
    });
    const now = h('button', 'chip', '지금');
    now.type = 'button';
    now.addEventListener('click', () => { this.t = Date.now(); this.speed = 1; sp.set('1'); });
    ui.append(group('', play.el), group('시간', this.dt, now, sp.el));
    const look = segmented(
      [{ id: '90', label: '동' }, { id: '180', label: '남' }, { id: '270', label: '서' }, { id: '0', label: '북' }, { id: 'z', label: '천정' }],
      '180', (v) => (v === 'z' ? ctx.ground.look(ctx.ground.yaw / DEG, 88, 100) : ctx.ground.look(parseFloat(v), v === '0' ? 38 : 30, 75)),
    );
    const g = ctx.ground;
    this.toolsB = h('div', 'tools-in');
    this.toolsB.append(look.el);
    ui.append(group('보기',
      toggle('별자리 선', true, (on) => (g.opts.lines = on)).el,
      toggle('이름', true, (on) => (g.opts.names = on)).el,
      toggle('황도', false, (on) => (g.opts.ecliptic = on)).el,
      toggle('대기 없애기', false, (on) => (g.opts.atmosphere = !on)).el,
    ));
    this.ui = ui;
  }
  card() {
    return `
      <h3>지금 서울의 하늘</h3>
      <p>화면을 <b>끌어서</b> 둘러보고, <b>휠·두 손가락</b>으로 확대해 보세요.</p>
      <ul class="facts">
        <li>겨울 밤: 오리온자리, 큰개자리(시리우스), 황소자리</li>
        <li>여름 밤: 백조자리, 거문고자리(직녀성), 독수리자리(견우성)</li>
        <li>일 년 내내: 북쪽 하늘의 북극성, 큰곰자리, 카시오페이아자리</li>
      </ul>
      <p class="tiny">별 자료: Yale 밝은 별 목록 (d3-celestial, BSD 라이선스)</p>`;
  }
  enter() {
    const g = this.ctx.ground;
    Object.assign(g.opts, { lines: true, names: true, atmosphere: true, trails: false, milky: true, zodiacHighlight: {}, showSunMoon: true, moonScale: 3, ecliptic: false });
    g.clearTrails();
    g.look(180, 30, 75);
    this.ctx.controls.replaceChildren(this.ui);
    this.ctx.card.innerHTML = this.card();
  }
  exit() {}
  last = '';
  frame(dt: number, time: number) {
    if (this.playing) this.t += dt * 1000 * this.speed;
    const lst = norm(gmst(this.t) + SEOUL.lon * DEG);
    this.ctx.ground.update(lst, SEOUL.lat, this.t, dt, time);
    const d = new Date(this.t + 9 * 3600000);
    const iso = d.toISOString().slice(0, 16);
    if (iso !== this.last && document.activeElement !== this.dt) { this.dt.value = iso; this.last = iso; }
    const sunAlt = Math.asin(THREE.MathUtils.clamp(this.ctx.ground.sunH.y, -1, 1)) / DEG;
    const hh = d.getUTCHours(), mm = d.getUTCMinutes();
    this.ctx.readout.innerHTML = `
      <div class="big">${d.getUTCMonth() + 1}월 ${d.getUTCDate()}일 ${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}</div>
      <div class="sub">한국 시각 · 서울 (북위 37.6°)</div>
      <div class="sub">${sunAlt > 0 ? '☀️ 낮 — 대기를 없애면 별이 보여요' : sunAlt > -12 ? '🌆 박명 — 하늘이 어두워지는 중' : '🌌 밤'}</div>`;
  }
}
