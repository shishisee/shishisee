import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { Ctx, Mod } from '../app';
import { DAY, DEG, EQ2ECL, SEOUL, ZODIAC12, lstFromSolar, norm, sph, sunLon, T3, timeForSunLon, zodiacAt } from '../astro';
import { Earth, makeSun } from '../bodies';
import { Labels } from '../labels';
import { Observer } from '../observer';
import { conById, eqDir, makeConstellations, makeMilkyWay, makeStars } from '../sky';
import { fmtDoy, group, h, playButton, segmented, slider, toggle } from '../ui';
import { todayDoy } from './diurnal';

const Y0 = Date.UTC(2026, 0, 1) - (SEOUL.lon / 15) * 3600000;
const ORBIT = 34;
const SPHERE = 700;
const ZIDS = new Set([...ZODIAC12.map((z) => z.id), 'Oph']);

function beam(color: number, radius: number) {
  const m = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, 1, 12, 1, true),
    new THREE.ShaderMaterial({
      uniforms: { uColor: { value: new THREE.Color(color) }, uTime: { value: 0 } },
      vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
      fragmentShader: `uniform vec3 uColor; uniform float uTime; varying vec2 vUv;
        void main(){ float f = 0.55 + 0.45*sin(vUv.y*120.0 - uTime*6.0); float e = smoothstep(0.0,0.03,vUv.y)*smoothstep(1.0,0.97,vUv.y);
          gl_FragColor = vec4(uColor*(0.6+0.6*f), 1.0)*e*0.9; }`,
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
    }),
  );
  return m;
}
function placeBeam(m: THREE.Mesh, a: THREE.Vector3, b: THREE.Vector3) {
  const d = b.clone().sub(a);
  m.position.copy(a).addScaledVector(d, 0.5);
  m.scale.set(1, d.length(), 1);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize());
}

export class Annual implements Mod {
  id = 'annual';
  name = '연주 운동 · 황도 12궁';
  short = '지구의 공전';
  titleA = '🚀 우주에서 본 모습 — 지구가 태양 둘레를 돈다';
  titleB = '🧍 서울의 밤하늘 — 별자리가 달마다 바뀐다';
  space!: { scene: THREE.Scene; camera: THREE.PerspectiveCamera; labels: Labels };
  ctx!: Ctx;
  controls!: OrbitControls;
  earth!: Earth;
  obs!: Observer;
  sun!: ReturnType<typeof makeSun>;
  hit!: THREE.Mesh;
  sunBeam = beam(0xffb52e, 0.35);
  nightBeam = beam(0x5cc8ff, 0.35);
  zodiacLines!: ReturnType<typeof makeConstellations>;
  doy = todayDoy();
  playing = false;
  speed = 10; // days per second
  view: 'midnight' | 'noon' = 'midnight';
  dateSlider!: ReturnType<typeof slider>;
  playBtn!: ReturnType<typeof playButton>;
  ui!: HTMLElement;
  zLabels = new Map<string, HTMLElement>();
  atmoToggle!: ReturnType<typeof toggle>;
  dragging = false;
  earthPos = new THREE.Vector3();

  init(ctx: Ctx) {
    this.ctx = ctx;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.5, 5000);
    camera.position.set(0, 30, 100);
    this.space = { scene, camera, labels: new Labels(ctx.paneA) };
    this.controls = new OrbitControls(camera, ctx.paneA);
    this.controls.enableDamping = true;
    this.controls.minDistance = 15;
    this.controls.maxDistance = 260;
    this.controls.enablePan = false;

    // fixed celestial sphere around the sun (stars are "very far")
    const cel = new THREE.Group();
    cel.matrixAutoUpdate = false;
    cel.matrix.copy(EQ2ECL);
    cel.add(makeMilkyWay(SPHERE * 1.08), makeStars(SPHERE, { scale: 1.15 }));
    const faint = makeConstellations(SPHERE * 0.995, (id) => !ZIDS.has(id));
    faint.mats.forEach((m) => (m.opacity = 0.1));
    this.zodiacLines = makeConstellations(SPHERE * 0.995, (id) => ZIDS.has(id));
    cel.add(faint.group, this.zodiacLines.group);
    scene.add(cel);

    // ecliptic belt on the sphere
    const belt = new THREE.Mesh(
      new THREE.CylinderGeometry(SPHERE * 0.99, SPHERE * 0.99, SPHERE * 0.24, 128, 1, true),
      new THREE.MeshBasicMaterial({ color: 0xffc95a, transparent: true, opacity: 0.035, side: THREE.BackSide, depthWrite: false, blending: THREE.AdditiveBlending }),
    );
    scene.add(belt);
    const ecl = new THREE.Mesh(
      new THREE.TorusGeometry(SPHERE * 0.985, 0.6, 6, 256),
      new THREE.MeshBasicMaterial({ color: 0xffc95a, transparent: true, opacity: 0.35, depthWrite: false }),
    );
    ecl.rotation.x = Math.PI / 2;
    scene.add(ecl);

    // sun
    this.sun = makeSun(3.2, 9);
    scene.add(this.sun.group);
    scene.add(new THREE.PointLight(0xffffff, 3, 0, 0));

    // orbit ring
    const op: THREE.Vector3[] = [];
    for (let i = 0; i <= 256; i++) { const a = (i / 256) * Math.PI * 2; op.push(new THREE.Vector3(Math.cos(a) * ORBIT, 0, Math.sin(a) * ORBIT)); }
    scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(op), new THREE.LineBasicMaterial({ color: 0x8fb6ff, transparent: true, opacity: 0.45 })));

    // month ticks
    const L = this.space.labels;
    for (let m = 0; m < 12; m++) {
      const t = Date.UTC(2026, m, 15) - (SEOUL.lon / 15) * 3600000;
      const p = this.earthAt(t);
      const dot = new THREE.Mesh(new THREE.SphereGeometry(0.35, 12, 8), new THREE.MeshBasicMaterial({ color: 0x8fb6ff }));
      dot.position.copy(p);
      scene.add(dot);
      const lp = p.clone().multiplyScalar(1.13);
      L.add(`${m + 1}월`, 'tag month', () => lp);
    }

    // earth
    this.earth = new Earth(1.8, 64);
    this.earth.group.quaternion.setFromRotationMatrix(EQ2ECL);
    scene.add(this.earth.group);
    this.obs = new Observer(this.earth, SEOUL.lat, SEOUL.lon, 1.6);
    this.hit = new THREE.Mesh(new THREE.SphereGeometry(4.5, 16, 8), new THREE.MeshBasicMaterial({ visible: false }));
    scene.add(this.hit);
    const halo = new THREE.Mesh(
      new THREE.RingGeometry(2.6, 2.9, 48),
      new THREE.MeshBasicMaterial({ color: 0x9fe8ff, transparent: true, opacity: 0.6, side: THREE.DoubleSide, depthWrite: false }),
    );
    halo.rotation.x = -Math.PI / 2;
    this.hit.add(halo);

    scene.add(this.sunBeam, this.nightBeam);

    // zodiac labels on the sphere
    for (const z of ZODIAC12) {
      const c = conById.get(z.id)!;
      const p = eqDir(c.ra, c.dec, SPHERE * 0.97).applyMatrix4(EQ2ECL);
      const el = L.add(`<span class="sym">${z.sign}</span>${z.ko}`, 'zod', () => p);
      this.zLabels.set(z.id, el);
    }
    L.add('태양', 'tag sun', () => new THREE.Vector3(0, 6, 0));
    L.add('지구 <small>(끌어서 옮기기)</small>', 'tag green', () => this.earthPos.clone().add(new THREE.Vector3(0, 4.2, 0)));

    this.bindDrag(ctx.paneA);
    this.buildUI();
  }

  earthAt(ms: number) {
    // heliocentric earth = opposite of geocentric sun (ecliptic three frame)
    return T3(sph(sunLon(ms) + Math.PI, 0), ORBIT);
  }
  hourFixed() { return this.view === 'midnight' ? 0 : 12; }
  ms() { return Y0 + this.doy * DAY + this.hourFixed() * 3600000; }

  bindDrag(pane: HTMLElement) {
    const ray = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const set = (e: PointerEvent) => {
      const r = pane.getBoundingClientRect();
      ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ndc, this.space.camera);
    };
    pane.addEventListener('pointerdown', (e) => {
      if (!this.active) return;
      set(e);
      if (ray.intersectObject(this.hit).length) {
        this.dragging = true;
        this.controls.enabled = false;
        pane.setPointerCapture(e.pointerId);
        e.stopPropagation();
      }
    }, true);
    pane.addEventListener('pointermove', (e) => {
      if (!this.dragging) return;
      set(e);
      const p = new THREE.Vector3();
      if (!ray.ray.intersectPlane(plane, p)) return;
      // earth heliocentric lon (three: x=cos, z=-sin)
      const lon = Math.atan2(-p.z, p.x);
      const sunL = norm(lon + Math.PI);
      const t = timeForSunLon(sunL, this.ms());
      let d = (t - Y0 - this.hourFixed() * 3600000) / DAY;
      d = ((Math.round(d) % 365) + 365) % 365;
      this.doy = d;
      this.dateSlider.set(d);
    });
    const up = () => { if (this.dragging) { this.dragging = false; this.controls.enabled = true; } };
    pane.addEventListener('pointerup', up);
    pane.addEventListener('pointercancel', up);
  }
  active = false;
  toolsB!: HTMLElement;

  buildUI() {
    const ui = h('div', 'ctl-row');
    this.playBtn = playButton(this.playing, (p) => (this.playing = p));
    this.dateSlider = slider({ label: '날짜', min: 0, max: 364, step: 1, value: this.doy, fmt: fmtDoy, wide: true, onInput: (v) => (this.doy = v) });
    const sp = segmented(
      [{ id: '3', label: '느리게' }, { id: '10', label: '10일/초' }, { id: '30', label: '빠르게' }],
      '10', (v) => (this.speed = parseFloat(v)),
    );
    ui.append(group('', this.playBtn.el), group('1년 동안', this.dateSlider.el, sp.el));
    const months = segmented(
      Array.from({ length: 12 }, (_, i) => ({ id: String(i), label: `${i + 1}월` })),
      '', (v) => {
        const t = Date.UTC(2026, parseInt(v), 15);
        this.doy = Math.round((t - Date.UTC(2026, 0, 1)) / DAY);
        this.dateSlider.set(this.doy);
      },
    );
    months.el.classList.add('months');
    ui.append(group('달 고르기', months.el));
    const view = segmented(
      [{ id: 'midnight', label: '🌙 한밤중(0시) 남쪽 하늘' }, { id: 'noon', label: '☀️ 한낮(12시) 태양 쪽 하늘' }],
      this.view, (v) => this.setView(v as 'midnight' | 'noon'),
    );
    this.atmoToggle = toggle('대기 없애고 별 보기', false, (on) => (this.ctx.ground.opts.atmosphere = !on));
    this.toolsB = h('div', 'tools-in');
    this.toolsB.append(view.el, this.atmoToggle.el);
    this.ui = ui;
  }
  setView(v: 'midnight' | 'noon') {
    this.view = v;
    const g = this.ctx.ground;
    if (v === 'noon') {
      g.opts.atmosphere = false; this.atmoToggle.set(true);
      g.look(180, 32, 95);
    } else {
      g.opts.atmosphere = true; this.atmoToggle.set(false);
      g.look(180, 40, 95);
    }
  }

  card() {
    const rows = ZODIAC12.map((z) => `<span>${z.sign} ${z.ko}</span>`).join('');
    return `
      <h3>연주 운동과 황도 12궁</h3>
      <p>지구는 1년에 한 바퀴 태양 둘레를 돌아요(<b>공전</b>). 그런데 지구에서 보면 거꾸로 <b>태양이 별자리 사이를 서 → 동으로</b> 조금씩 옮겨 가는 것처럼 보여요. 이것이 태양의 <b>연주 운동</b>이에요.</p>
      <ul class="facts">
        <li>태양은 하루에 약 <b>1°</b>, 한 달에 약 <b>30°</b>씩 이동</li>
        <li>태양이 지나가는 길 = <b>황도</b> (노란 띠)</li>
        <li>황도 위의 12개 별자리 = <b>황도 12궁</b></li>
        <li>같은 시각에 보이는 별자리는 매달 <b>서쪽으로</b> 약 30°씩 밀려나요</li>
      </ul>
      <p class="note">별은 엄청나게 멀어서, 지구가 움직여도 배경처럼 제자리에 있어요. 그래서 “태양이 지금 ○○자리에 있다”고 말할 수 있어요.</p>
      <div class="zgrid">${rows}</div>
      <details><summary>🔍 해 보기</summary>
        <ol>
          <li>우주 화면에서 <b>지구를 끌어서</b> 옮겨 보세요. 노란 선(지구→태양)이 가리키는 별자리가 ‘태양이 있는 별자리’예요.</li>
          <li>그때 파란 선이 가리키는 별자리는 한밤중에 남쪽 하늘에 보여요. 태양이 있는 별자리는 왜 밤에 볼 수 없을까요?</li>
          <li>‘한낮 하늘’로 바꾸고 대기를 없애 보세요. 태양 뒤에 어떤 별자리가 있나요?</li>
        </ol>
      </details>
      <p class="tiny">※ 실제 하늘에서는 11월 말~12월 중순에 태양이 <b>뱀주인자리</b>도 지나가요. 교과서의 황도 12궁에는 넣지 않아요.</p>`;
  }

  enter() {
    this.active = true;
    const g = this.ctx.ground;
    Object.assign(g.opts, { lines: true, names: true, atmosphere: true, trails: false, milky: true, zodiacHighlight: {}, showSunMoon: true, moonScale: 3, ecliptic: true });
    g.clearTrails();
    this.setView(this.view);
    this.ctx.controls.replaceChildren(this.ui);
    this.ctx.card.innerHTML = this.card();
    this.controls.enabled = true;
    this.space.labels.show(true);
  }
  exit() {
    this.active = false;
    this.controls.enabled = false;
    this.space.labels.show(false);
    this.ctx.ground.opts.zodiacHighlight = {};
    this.ctx.ground.opts.ecliptic = false;
  }

  frame(dt: number, time: number) {
    if (this.playing && !this.dragging) {
      this.doy = (this.doy + dt * this.speed) % 365;
      this.dateSlider.set(Math.floor(this.doy));
    }
    const ms = this.ms();
    const hour = this.hourFixed();
    const lst = lstFromSolar(ms, hour);
    const sl = sunLon(ms);
    const E = this.earthAt(ms);
    this.earthPos.copy(E);
    this.earth.group.position.copy(E);
    this.hit.position.copy(E);
    this.earth.setSpin(lst - SEOUL.lon * DEG);
    this.earth.setSun(E.clone().negate().normalize());
    this.sun.update(time);

    const eh = E.clone().normalize();
    placeBeam(this.sunBeam, E, eh.clone().multiplyScalar(-SPHERE * 0.97));
    placeBeam(this.nightBeam, E, eh.clone().multiplyScalar(SPHERE * 0.97));
    (this.sunBeam.material as THREE.ShaderMaterial).uniforms.uTime.value = time;
    (this.nightBeam.material as THREE.ShaderMaterial).uniforms.uTime.value = time;

    const zs = zodiacAt(sl);
    const zn = zodiacAt(sl + Math.PI);
    for (const [id, m] of this.zodiacLines.mats) {
      m.color.set(id === zs.id ? 0xffc040 : id === zn.id ? 0x7fd8ff : 0x9fb8ff);
      m.opacity = id === zs.id || id === zn.id ? 1 : 0.4;
    }
    for (const [id, el] of this.zLabels) el.dataset.hl = id === zs.id ? 'sun' : id === zn.id ? 'night' : '';

    this.controls.update();
    const g = this.ctx.ground;
    g.opts.zodiacHighlight = { sun: zs.id, night: zn.id };
    g.update(lst, SEOUL.lat, ms, dt, time);
    this.obs.setView(g.viewDir());

    const zsName = zs.id === 'Oph' ? '뱀주인자리 <small>(전갈↔궁수 사이)</small>' : zs.ko;
    const znName = zn.id === 'Oph' ? '뱀주인자리' : zn.ko;
    this.ctx.readout.innerHTML = `
      <div class="big">${fmtDoy(this.doy)}</div>
      <div class="sub"><span class="dot sun"></span>태양이 지나는 별자리: <b>${zs.sign} ${zsName}</b></div>
      <div class="sub"><span class="dot night"></span>한밤중 남쪽 하늘: <b>${zn.sign} ${znName}</b></div>
      <div class="sub dim">태양은 하루에 약 1°씩 별자리 사이를 서 → 동으로 이동</div>`;
  }
}
