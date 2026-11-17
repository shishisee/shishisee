import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { Ctx, Mod } from '../app';
import { DAY, DEG, EQ2ECL, SEOUL, lstFromSolar, moonEcl, moonElong, phaseName, solarDayStart, solarHour, sph, sunLon, T3, timeForElong } from '../astro';
import { Earth, makeMoon, makeSun } from '../bodies';
import { Labels } from '../labels';
import { Observer } from '../observer';
import { makeMilkyWay, makeStars } from '../sky';
import { fmtHour, group, h, playButton, segmented, slider, toggle } from '../ui';

const MOON_R = 22;
const PHASES = [
  { el: 0, name: '삭' }, { el: 45, name: '초승달' }, { el: 90, name: '상현달' }, { el: 135, name: '' },
  { el: 180, name: '망 (보름달)' }, { el: 225, name: '' }, { el: 270, name: '하현달' }, { el: 315, name: '그믐달' },
];

export class MoonMod implements Mod {
  id = 'moon';
  name = '달의 위상';
  short = '달의 모양 변화';
  titleA = '🚀 우주에서 본 모습 — 달은 항상 절반만 빛난다';
  titleB = '🧍 서울에서 본 하늘과 달';
  space!: { scene: THREE.Scene; camera: THREE.PerspectiveCamera; labels: Labels };
  ctx!: Ctx;
  controls!: OrbitControls;
  earth!: Earth;
  obs!: Observer;
  moon!: THREE.Mesh;
  sun!: ReturnType<typeof makeSun>;
  light = new THREE.DirectionalLight(0xffffff, 3.2);
  ghosts: THREE.Mesh[] = [];
  ghostGroup = new THREE.Group();
  visRing!: THREE.Mesh;
  rays = new THREE.Group();
  sky = new THREE.Group();
  newMoon = 0;
  t = 0;
  playing = true;
  mode: 'clock' | 'daily' = 'clock';
  speed = 1;
  dailyAcc = 0;
  follow = true;
  ageSlider!: ReturnType<typeof slider>;
  hourSlider!: ReturnType<typeof slider>;
  playBtn!: ReturnType<typeof playButton>;
  ui!: HTMLElement;
  insetCam = new THREE.PerspectiveCamera(8, 1, 0.1, 5000);
  orbit!: THREE.Line;

  init(ctx: Ctx) {
    this.ctx = ctx;
    const now = Date.now();
    this.newMoon = timeForElong(0, now - (moonElong(now) / (Math.PI * 2)) * 29.53 * DAY);
    // start: evening of lunar day ~5 (crescent in the west)
    this.t = solarDayStart(this.newMoon + 4.5 * DAY) + 19 * 3600000;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 6000);
    camera.position.set(0, 64, 46);
    this.space = { scene, camera, labels: new Labels(ctx.paneA) };
    this.controls = new OrbitControls(camera, ctx.paneA);
    this.controls.enableDamping = true;
    this.controls.minDistance = 8;
    this.controls.maxDistance = 140;
    this.controls.enablePan = false;

    this.sky.add(makeMilkyWay(2400), makeStars(2300, { scale: 0.9 }));
    this.sky.matrixAutoUpdate = false;
    scene.add(this.sky);
    scene.add(new THREE.AmbientLight(0xffffff, 0.04));
    scene.add(this.light, this.light.target);

    this.earth = new Earth(3.2, 64);
    this.earth.group.quaternion.setFromRotationMatrix(EQ2ECL);
    scene.add(this.earth.group);
    this.obs = new Observer(this.earth, SEOUL.lat, SEOUL.lon, 1.6);

    this.moon = makeMoon(1.1);
    scene.add(this.moon);
    this.visRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.16, 0.035, 8, 64),
      new THREE.MeshBasicMaterial({ color: 0x5cffb0 }),
    );
    scene.add(this.visRing);

    this.sun = makeSun(14, 7);
    scene.add(this.sun.group);

    // orbit
    const op: THREE.Vector3[] = [];
    for (let i = 0; i <= 200; i++) { const a = (i / 200) * Math.PI * 2; op.push(new THREE.Vector3(Math.cos(a) * MOON_R, 0, Math.sin(a) * MOON_R)); }
    this.orbit = new THREE.Line(new THREE.BufferGeometry().setFromPoints(op), new THREE.LineDashedMaterial({ color: 0x9fb8ff, transparent: true, opacity: 0.5, dashSize: 0.8, gapSize: 0.5 }));
    this.orbit.computeLineDistances();
    scene.add(this.orbit);

    // ghost moons at the 8 classic positions
    const gm = new THREE.MeshStandardMaterial({ color: 0xc9d0e0, roughness: 1, transparent: true, opacity: 0.7 });
    const L = this.space.labels;
    PHASES.forEach((p, i) => {
      const m = new THREE.Mesh(new THREE.SphereGeometry(0.75, 32, 16), gm);
      m.userData.el = p.el;
      this.ghosts.push(m);
      this.ghostGroup.add(m);
      if (p.name) {
        const el = L.add(p.name, 'tag phase', () => m.getWorldPosition(new THREE.Vector3()).multiplyScalar(1.17));
        el.dataset.i = String(i);
      }
    });
    scene.add(this.ghostGroup);

    // sunlight rays
    const rayMat = new THREE.MeshBasicMaterial({ color: 0xffd27a, transparent: true, opacity: 0.22, depthWrite: false, blending: THREE.AdditiveBlending });
    for (let i = -2; i <= 2; i++) {
      const r = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 26, 6), rayMat);
      r.rotation.z = Math.PI / 2;
      r.position.set(0, 0, i * 9);
      const head = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.9, 10), rayMat);
      head.rotation.z = Math.PI / 2;
      head.position.set(-13.4, 0, i * 9);
      // rays travel from +X (sun) toward -X
      r.position.x = 0;
      this.rays.add(r, head);
    }
    scene.add(this.rays);

    L.add('햇빛', 'tag sun', () => this.sunDir().multiplyScalar(MOON_R + 13));
    L.add('지구', 'tag green', () => new THREE.Vector3(0, 4.6, 0));
    L.add('달', 'tag moonlbl', () => this.moon.position.clone().add(new THREE.Vector3(0, 2.2, 0)));

    this.bindClick(ctx.paneA);
    this.buildUI();
  }

  sunDir() { return T3(sph(sunLon(this.t), 0)).normalize(); }

  bindClick(pane: HTMLElement) {
    const ray = new THREE.Raycaster();
    let sx = 0, sy = 0;
    pane.addEventListener('pointerdown', (e) => { sx = e.clientX; sy = e.clientY; });
    pane.addEventListener('pointerup', (e) => {
      if (!this.active || Math.hypot(e.clientX - sx, e.clientY - sy) > 5) return;
      const r = pane.getBoundingClientRect();
      ray.setFromCamera(new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1), this.space.camera);
      const hit = ray.intersectObjects(this.ghosts)[0];
      if (hit) this.jumpTo(hit.object.userData.el);
    });
  }
  jumpTo(elDeg: number) {
    const hour = solarHour(this.t);
    let t = timeForElong(elDeg * DEG, this.t);
    // keep the same clock time on that day
    t = solarDayStart(t) + hour * 3600000;
    this.t = t;
    this.syncSliders();
  }
  active = false;

  age() {
    return (((this.t - this.newMoon) / DAY) % 29.530589 + 29.530589) % 29.530589;
  }
  syncSliders() {
    this.hourSlider.set(solarHour(this.t));
    this.ageSlider.set(moonElong(this.t) / DEG / 12.19);
  }

  buildUI() {
    const ui = h('div', 'ctl-row');
    this.playBtn = playButton(this.playing, (p) => (this.playing = p));
    const mode = segmented(
      [{ id: 'clock', label: '⏱ 시간 흐름 (1시간/초)' }, { id: 'daily', label: '📅 매일 같은 시각' }],
      this.mode, (v) => { this.mode = v as 'clock' | 'daily'; this.dailyAcc = 0; },
    );
    ui.append(group('', this.playBtn.el), group('재생 방법', mode.el));
    this.ageSlider = slider({
      label: '음력 날짜 (달의 나이)', min: 0, max: 29.5, step: 0.1, value: 0, wide: true,
      fmt: (v) => `약 ${Math.max(1, Math.round(v + 1))}일`,
      onInput: (v) => {
        const hour = solarHour(this.t);
        const t = timeForElong(v * 12.19 * DEG, this.t);
        this.t = solarDayStart(t) + hour * 3600000;
      },
    });
    this.hourSlider = slider({
      label: '시각', min: 0, max: 24, step: 0.05, value: solarHour(this.t), fmt: fmtHour, wide: true,
      onInput: (v) => (this.t = solarDayStart(this.t) + v * 3600000),
    });
    ui.append(group('언제?', this.ageSlider.el, this.hourSlider.el));
    const jump = segmented(
      PHASES.filter((p) => p.name).map((p) => ({ id: String(p.el), label: p.name.replace(' (보름달)', '') })),
      '', (v) => this.jumpTo(parseFloat(v)),
    );
    ui.append(group('위상으로 이동', jump.el));
    const follow = toggle('🎯 달 따라보기', true, (on) => (this.follow = on));
    const ring = toggle('지구에서 보이는 쪽 표시', true, (on) => { this.ringOn = on; this.visRing.visible = on; });
    this.toolsB = h('div', 'tools-in');
    this.toolsB.append(follow.el);
    this.toolsA = h('div', 'tools-in');
    this.toolsA.append(ring.el);
    this.ui = ui;
    this.syncSliders();
  }

  card() {
    return `
      <h3>달의 위상은 왜 바뀔까?</h3>
      <p>달은 스스로 빛을 내지 못하고 <b>햇빛을 반사</b>해서 빛나요. 그래서 달은 언제나 <b>태양을 향한 절반</b>만 밝아요.</p>
      <p>달이 지구 둘레를 <b>공전</b>하면, 밝은 절반 가운데 <b>지구에서 보이는 부분</b>(초록 고리 안쪽)이 달라져서 모양이 바뀌어 보여요.</p>
      <table class="ptable">
        <tr><th>모양</th><th>음력</th><th>잘 보이는 때 · 곳</th></tr>
        <tr><td>초승달</td><td>2~3일</td><td>해 진 직후 서쪽 하늘</td></tr>
        <tr><td>상현달</td><td>7~8일</td><td>저녁 남쪽 하늘 (오른쪽이 밝음)</td></tr>
        <tr><td>보름달</td><td>15일</td><td>저녁 동쪽 → 밤새 → 새벽 서쪽</td></tr>
        <tr><td>하현달</td><td>22~23일</td><td>새벽 남쪽 하늘 (왼쪽이 밝음)</td></tr>
        <tr><td>그믐달</td><td>27~28일</td><td>새벽 동쪽 하늘</td></tr>
      </table>
      <details><summary>🔍 해 보기</summary>
        <ol>
          <li>‘매일 같은 시각’으로 재생해 보세요. 저녁 7시에 보이는 달의 위치가 날마다 어느 쪽으로 옮겨 가나요?</li>
          <li>우주 화면에서 흐린 달을 눌러 보세요. 그 위치에서 지구에서 보면 어떤 모양일까요?</li>
          <li>보름달이 뜰 때 태양-지구-달은 어떻게 늘어서 있나요?</li>
        </ol>
      </details>`;
  }

  enter() {
    this.active = true;
    const g = this.ctx.ground;
    Object.assign(g.opts, { lines: false, names: true, atmosphere: true, trails: false, milky: true, zodiacHighlight: {}, showSunMoon: true, moonScale: 4, ecliptic: false });
    g.clearTrails();
    g.fov = 90;
    this.ctx.controls.replaceChildren(this.ui);
    this.ctx.card.innerHTML = this.card();
    this.controls.enabled = true;
    this.space.labels.show(true);
    this.ctx.insetEl.style.display = '';
  }
  exit() {
    this.active = false;
    this.controls.enabled = false;
    this.space.labels.show(false);
    this.ctx.insetEl.style.display = 'none';
  }

  inset = () => {
    const sc = this.space.scene;
    const cam = this.insetCam;
    const mp = this.moon.position;
    cam.position.set(0, 0, 0);
    // "up" = observer zenith so the moon is tilted like in the real sky
    const up = this.obs.group.children[0].localToWorld(new THREE.Vector3(0, 1, 0)).sub(this.obs.worldPos()).normalize();
    cam.up.copy(up);
    cam.lookAt(mp);
    cam.fov = 9;
    cam.updateProjectionMatrix();
    return {
      scene: sc,
      camera: cam,
      before: () => { this.earth.group.visible = false; this.visRing.visible = false; this.ghostGroup.visible = false; this.rays.visible = false; this.orbit.visible = false; this.sun.group.visible = false; this.sky.matrix.makeTranslation(0, 0, 0); this.sky.matrixWorldNeedsUpdate = true; },
      after: () => { this.earth.group.visible = true; this.visRing.visible = this.ringOn; this.ghostGroup.visible = true; this.rays.visible = true; this.orbit.visible = true; this.sun.group.visible = true; },
    };
  };
  ringOn = true;
  toolsA!: HTMLElement;
  toolsB!: HTMLElement;

  frame(dt: number, time: number) {
    if (this.playing) {
      if (this.mode === 'clock') {
        this.t += dt * this.speed * 3600000;
      } else {
        this.dailyAcc += dt;
        if (this.dailyAcc > 0.7) { this.dailyAcc = 0; this.t += DAY; }
      }
      this.syncSliders();
    }
    const t = this.t;
    const hour = solarHour(t);
    const lst = lstFromSolar(t, hour);
    const sd = this.sunDir();
    const me = moonEcl(t);
    const mdir = T3(sph(me.lon, me.lat)).normalize();
    this.moon.position.copy(mdir).multiplyScalar(MOON_R);
    this.moon.rotation.y = Math.atan2(mdir.z, -mdir.x); // near side (+X) faces earth (tidal lock)
    this.visRing.position.copy(this.moon.position);
    this.visRing.lookAt(0, 0, 0);
    this.light.position.copy(sd).multiplyScalar(200);
    this.light.target.position.set(0, 0, 0);
    this.sun.group.position.copy(sd).multiplyScalar(420);
    this.sun.update(time);
    this.earth.setSun(sd);
    this.earth.setSpin(lst - SEOUL.lon * DEG);
    this.earth.mat.uniforms.uCloudShift.value = time * 0.0008;
    const sunAng = Math.atan2(-sd.z, sd.x);
    this.ghosts.forEach((m) => {
      const a = sunAng + m.userData.el * DEG;
      m.position.set(Math.cos(a) * MOON_R, 0, -Math.sin(a) * MOON_R);
    });
    this.rays.rotation.y = sunAng;
    this.rays.position.copy(sd).multiplyScalar(MOON_R + 4);

    this.controls.update();
    this.sky.matrix.makeTranslation(this.space.camera.position.x, this.space.camera.position.y, this.space.camera.position.z).multiply(EQ2ECL);
    this.sky.matrixWorldNeedsUpdate = true;

    const g = this.ctx.ground;
    if (this.follow) {
      const m = g.moonH;
      const az = Math.atan2(m.x, -m.z) / DEG;
      const alt = Math.asin(THREE.MathUtils.clamp(m.y, -1, 1)) / DEG;
      g.look(az, Math.max(12, Math.min(alt + 6, 70)));
    }
    g.update(lst, SEOUL.lat, t, dt, time);
    this.obs.setView(g.viewDir());

    const el = moonElong(t);
    const alt = Math.asin(THREE.MathUtils.clamp(g.moonH.y, -1, 1)) / DEG;
    const az = (Math.atan2(g.moonH.x, -g.moonH.z) / DEG + 360) % 360;
    const dirs = ['북', '북동', '동', '남동', '남', '남서', '서', '북서'];
    const dname = dirs[Math.round(az / 45) % 8];
    const d = new Date(t + 9 * 3600000);
    this.ctx.readout.innerHTML = `
      <div class="big">${phaseName(el)}</div>
      <div class="sub">음력 약 <b>${Math.max(1, Math.round(el / DEG / 12.19 + 1))}일</b> · ${d.getUTCMonth() + 1}월 ${d.getUTCDate()}일 ${fmtHour(hour)}</div>
      <div class="sub">${alt > 0 ? `달은 <b>${dname}쪽</b> 하늘, 고도 ${alt.toFixed(0)}°` : '달이 지평선 아래에 있어요'}</div>`;
    this.ctx.insetEl.querySelector('.inset-cap')!.textContent = alt > 0 ? '지구에서 본 달 (확대)' : '지구에서 본 달 (지금은 지평선 아래)';
  }
}
