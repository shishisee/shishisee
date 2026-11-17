import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { Ctx, Mod } from '../app';
import { DAY, DEG, SEOUL, eclToEq, lstFromSolar, sph, sunLon, T3 } from '../astro';
import { Earth, makeSun } from '../bodies';
import { Labels } from '../labels';
import { Observer } from '../observer';
import { makeConstellations, makeMilkyWay, makeStars } from '../sky';
import { fmtDoy, fmtHour, group, h, playButton, segmented, slider, toggle } from '../ui';

const Y0 = Date.UTC(2026, 0, 1) - (SEOUL.lon / 15) * 3600000;

export function todayDoy() {
  const now = Date.now();
  return Math.max(0, Math.min(364, Math.floor((now - Y0) / DAY) % 365));
}

export class Diurnal implements Mod {
  id = 'diurnal';
  name = '일주 운동';
  short = '지구의 자전';
  titleA = '🚀 우주에서 본 모습 — 지구가 돈다';
  titleB = '🧍 서울에서 올려다본 하늘 — 하늘이 돈다';
  space!: { scene: THREE.Scene; camera: THREE.PerspectiveCamera; labels: Labels };
  ctx!: Ctx;
  controls!: OrbitControls;
  earth!: Earth;
  obs!: Observer;
  sun!: ReturnType<typeof makeSun>;
  sky = new THREE.Group();
  conLines!: ReturnType<typeof makeConstellations>;
  doy = todayDoy();
  hour = 18;
  lat = SEOUL.lat;
  speed = 1; // hours per second
  playing = true;
  coRotate = false;
  prevSpin = 0;
  hourSlider!: ReturnType<typeof slider>;
  playBtn!: ReturnType<typeof playButton>;
  ui!: HTMLElement;
  cardHtml = '';
  rotArrow!: THREE.Group;

  init(ctx: Ctx) {
    this.ctx = ctx;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 5000);
    camera.position.set(17, 9, 19);
    this.space = { scene, camera, labels: new Labels(ctx.paneA) };
    this.controls = new OrbitControls(camera, ctx.paneA);
    this.controls.enableDamping = true;
    this.controls.minDistance = 8;
    this.controls.maxDistance = 70;
    this.controls.enablePan = false;

    // stars at infinity
    this.sky.add(makeMilkyWay(1900), makeStars(1800, { scale: 0.9 }));
    this.conLines = makeConstellations(1790);
    this.conLines.group.visible = false;
    this.sky.add(this.conLines.group);
    scene.add(this.sky);

    this.earth = new Earth(5);
    scene.add(this.earth.group);
    this.obs = new Observer(this.earth, this.lat, SEOUL.lon, 1);
    this.sun = makeSun(3.2, 8);
    scene.add(this.sun.group);

    // rotation axis
    const axisMat = new THREE.LineDashedMaterial({ color: 0xbfd8ff, dashSize: 0.5, gapSize: 0.35, transparent: true, opacity: 0.8 });
    const axis = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, -9, 0), new THREE.Vector3(0, 12, 0)]), axisMat);
    axis.computeLineDistances();
    scene.add(axis);
    // spin direction arrow (counter-clockwise seen from north)
    this.rotArrow = new THREE.Group();
    const curve = new THREE.EllipseCurve(0, 0, 6.6, 6.6, -0.2, Math.PI * 1.1, false, 0);
    const pts = curve.getPoints(60).map((p) => new THREE.Vector3(p.x, 0, -p.y));
    const tube = new THREE.Mesh(
      new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 80, 0.07, 8),
      new THREE.MeshBasicMaterial({ color: 0x8fd3ff, transparent: true, opacity: 0.85 }),
    );
    const cone = new THREE.Mesh(new THREE.ConeGeometry(0.25, 0.7, 12), new THREE.MeshBasicMaterial({ color: 0x8fd3ff }));
    const end = pts[pts.length - 1], prev = pts[pts.length - 3];
    cone.position.copy(end);
    cone.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), end.clone().sub(prev).normalize());
    this.rotArrow.add(tube, cone);
    this.rotArrow.position.y = 2.2;
    scene.add(this.rotArrow);

    const L = this.space.labels;
    L.add('천구 북극 · 북극성 방향 ↑', 'tag', () => new THREE.Vector3(0, 12.3, 0));
    L.add('자전 방향 (서 → 동)', 'tag blue', () => new THREE.Vector3(-6.4, 2.2, -1.6));
    L.add('관측자 (서울)', 'tag green', () => this.obs.worldPos().add(new THREE.Vector3(0, 0.9, 0)));
    L.add('태양 ☀', 'tag sun', () => this.sun.group.position.clone().setLength(40));
    L.add('낮', 'tag dim', () => this.sunDir().multiplyScalar(6.4));
    L.add('밤', 'tag dim', () => this.sunDir().multiplyScalar(-6.4));

    this.buildUI();
  }

  sunDir() {
    return T3(eclToEq(sph(sunLon(this.ms()), 0))).normalize();
  }
  ms() {
    return Y0 + this.doy * DAY + this.hour * 3600000;
  }

  buildUI() {
    const ui = h('div', 'ctl-row');
    this.playBtn = playButton(this.playing, (p) => (this.playing = p));
    this.hourSlider = slider({
      label: '시각', min: 0, max: 24, step: 0.05, value: this.hour, fmt: fmtHour, wide: true,
      onInput: (v) => (this.hour = v),
    });
    const sp = segmented(
      [{ id: '0.5', label: '느리게' }, { id: '1', label: '1시간/초' }, { id: '3', label: '빠르게' }],
      '1', (v) => (this.speed = parseFloat(v)),
    );
    ui.append(group('', this.playBtn.el), group('시간', this.hourSlider.el, sp.el));

    const dateS = slider({ label: '날짜', min: 0, max: 364, step: 1, value: this.doy, fmt: fmtDoy, onInput: (v) => (this.doy = v) });
    const presets = segmented(
      [{ id: 'today', label: '오늘' }, { id: '79', label: '춘분' }, { id: '171', label: '하지' }, { id: '265', label: '추분' }, { id: '355', label: '동지' }],
      'today',
      (v) => { this.doy = v === 'today' ? todayDoy() : parseInt(v); dateS.set(this.doy); },
    );
    ui.append(group('날짜', dateS.el, presets.el));

    const latS = slider({
      label: '위도', min: -90, max: 90, step: 0.5, value: this.lat,
      fmt: (v) => (v >= 0 ? `북위 ${v.toFixed(1)}°` : `남위 ${(-v).toFixed(1)}°`),
      onInput: (v) => this.setLat(v),
    });
    const latP = segmented(
      [{ id: '37.57', label: '서울' }, { id: '0', label: '적도' }, { id: '90', label: '북극' }, { id: '-33.9', label: '시드니' }],
      '37.57', (v) => { this.setLat(parseFloat(v)); latS.set(this.lat); },
    );
    ui.append(group('관측 장소', latS.el, latP.el));

    const look = segmented(
      [{ id: 'E', label: '동쪽 하늘' }, { id: 'S', label: '남쪽 하늘' }, { id: 'W', label: '서쪽 하늘' }, { id: 'N', label: '북쪽 하늘' }],
      'S', (v) => this.lookAt(v),
    );
    const trails = toggle('🌀 별 궤적 찍기', false, (on) => {
      this.ctx.ground.opts.trails = on;
      if (on) this.ctx.ground.startTrails(lstFromSolar(this.ms(), this.hour));
      else this.ctx.ground.clearTrails();
    });
    this.trailsToggle = trails;
    const co = toggle('🔄 지구와 함께 돌기', false, (on) => (this.coRotate = on));
    const lines = toggle('별자리 선', true, (on) => { this.ctx.ground.opts.lines = on; this.conLines.group.visible = on && this.showSpaceLines; });
    this.toolsB = h('div', 'tools-in');
    this.toolsB.append(look.el, trails.el, lines.el);
    this.toolsA = h('div', 'tools-in');
    this.toolsA.append(co.el);
    this.ui = ui;
  }
  trailsToggle!: ReturnType<typeof toggle>;
  toolsA!: HTMLElement;
  toolsB!: HTMLElement;
  showSpaceLines = false;

  setLat(v: number) {
    this.lat = v;
    this.obs.group.removeFromParent();
    this.obs = new Observer(this.earth, v, SEOUL.lon, 1);
    if (this.ctx.ground.opts.trails) this.ctx.ground.startTrails(lstFromSolar(this.ms(), this.hour));
    this.lookAt(this.lastLook);
  }
  lastLook = 'S';
  lookAt(v: string) {
    this.lastLook = v;
    const g = this.ctx.ground;
    const north = this.lat >= 0;
    if (v === 'N') g.look(0, Math.max(10, Math.abs(this.lat)) * (north ? 1 : 0.4), 75);
    if (v === 'S') g.look(180, north ? 30 : Math.max(10, Math.abs(this.lat)), 75);
    if (v === 'E') g.look(90, 28, 80);
    if (v === 'W') g.look(270, 28, 80);
    if (this.ctx.ground.opts.trails) this.ctx.ground.startTrails(lstFromSolar(this.ms(), this.hour));
  }

  card() {
    return `
      <h3>일주 운동이란?</h3>
      <p>하루 동안 태양과 별이 <b>동쪽에서 떠서 서쪽으로 지는</b> 것처럼 보이는 운동이에요.</p>
      <p>실제로 움직이는 것은 하늘이 아니라 <b>지구</b>예요. 지구가 <b>서 → 동</b>으로 자전하니까, 지구 위의 우리 눈에는 하늘이 반대로 <b>동 → 서</b>로 도는 것처럼 보여요.</p>
      <ul class="facts">
        <li>회전 속도: <b>1시간에 15°</b> (24시간에 360°)</li>
        <li>북쪽 하늘: <b>북극성을 중심으로 시계 반대 방향</b></li>
        <li>북극성 높이(고도) ≈ 관측 장소의 <b>위도</b></li>
      </ul>
      <details><summary>🔍 해 보기</summary>
        <ol>
          <li>‘북쪽 하늘’과 ‘별 궤적 찍기’를 켜고 재생해 보세요. 동그라미 모양 궤적의 중심에 무엇이 있나요?</li>
          <li>‘지구와 함께 돌기’를 켜면, 우주 화면에서도 별이 도는 것처럼 보여요. 왜 그럴까요?</li>
          <li>위도를 ‘북극’, ‘적도’로 바꾸면 별이 도는 모습이 어떻게 달라지나요?</li>
        </ol>
      </details>`;
  }

  enter() {
    const g = this.ctx.ground;
    Object.assign(g.opts, { lines: true, names: true, atmosphere: true, trails: false, milky: true, zodiacHighlight: {}, showSunMoon: true, moonScale: 3, ecliptic: false });
    this.trailsToggle.set(false);
    g.clearTrails();
    this.lookAt('S');
    this.ctx.controls.replaceChildren(this.ui);
    this.ctx.card.innerHTML = this.card();
    this.controls.enabled = true;
    this.space.labels.show(true);
  }
  exit() {
    this.controls.enabled = false;
    this.space.labels.show(false);
  }

  frame(dt: number, time: number) {
    if (this.playing) {
      this.hour += dt * this.speed;
      if (this.hour >= 24) { this.hour -= 24; this.doy = (this.doy + 1) % 365; }
      this.hourSlider.set(this.hour);
    }
    const ms = this.ms();
    const lst = lstFromSolar(ms, this.hour);
    const spin = lst - SEOUL.lon * DEG;
    this.earth.setSpin(spin);
    const sd = this.sunDir();
    this.earth.setSun(sd);
    this.earth.mat.uniforms.uCloudShift.value = time * 0.0008;
    this.sun.group.position.copy(sd).multiplyScalar(120);
    this.sun.update(time);

    if (this.coRotate) {
      let d = spin - this.prevSpin;
      if (d > Math.PI) d -= Math.PI * 2;
      if (d < -Math.PI) d += Math.PI * 2;
      this.space.camera.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), d);
    }
    this.prevSpin = spin;
    this.controls.update();
    this.sky.position.copy(this.space.camera.position);

    const g = this.ctx.ground;
    g.update(lst, this.lat, ms, dt, time);
    this.obs.setView(g.viewDir());

    const sunAlt = Math.asin(THREE.MathUtils.clamp(g.sunH.y, -1, 1)) / DEG;
    this.ctx.readout.innerHTML = `
      <div class="big">${fmtHour(this.hour)}</div>
      <div class="sub">${fmtDoy(this.doy)} · 태양 고도 ${sunAlt.toFixed(0)}°</div>
      <div class="sub">지구는 지금까지 <b>${((this.hour / 24) * 360).toFixed(0)}°</b> 자전 (자정 기준)</div>`;
  }
}
