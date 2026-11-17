import * as THREE from 'three';
import { DEG, eqToHorizMatrix, eclToEq, sph, T3, sunLon, moonEcl } from './astro';
import { makeStars, makeConstellations, makeMilkyWay, makeTrails, glowTexture, SKY, eqDir } from './sky';
import { makeSkyMoon } from './bodies';
import { Labels } from './labels';

const R = 800;

const SKY_FS = /* glsl */ `
  uniform vec3 uSun; uniform float uBright;
  varying vec3 vDir;
  void main(){
    vec3 d = normalize(vDir);
    float h = max(d.y, 0.0);
    float sunAlt = uSun.y;
    float mu = dot(d, uSun);
    float day = smoothstep(-0.30, 0.25, sunAlt);
    vec3 zen = mix(vec3(0.004,0.008,0.025), vec3(0.10,0.32,0.78), smoothstep(-0.18, 0.3, sunAlt));
    vec3 hor = mix(vec3(0.035,0.05,0.10), vec3(0.62,0.80,1.0), smoothstep(-0.12, 0.35, sunAlt));
    vec3 col = mix(hor, zen, pow(h, 0.45));
    // twilight glow toward the sun near horizon
    float tw = exp(-pow(sunAlt/0.16, 2.0));
    float toward = pow(max(mu,0.0), 3.0);
    col += vec3(1.0,0.42,0.12) * tw * toward * exp(-h*5.0) * 0.95;
    col += vec3(0.55,0.25,0.45) * tw * exp(-h*3.0) * 0.18;
    // sun halo
    col += vec3(1.0,0.85,0.6) * pow(max(mu,0.0), 180.0) * 1.2 * smoothstep(-0.05,0.02,sunAlt);
    col += vec3(1.0,0.8,0.5) * pow(max(mu,0.0), 12.0) * 0.18 * day;
    // below horizon: darker
    if (d.y < 0.0) col *= 0.35;
    gl_FragColor = vec4(col * uBright, 1.0);
  }`;

export type GroundOpts = {
  lines: boolean;
  names: boolean;
  atmosphere: boolean;
  trails: boolean;
  milky: boolean;
  zodiacHighlight: { sun?: string; night?: string };
  showSunMoon: boolean;
  moonScale: number;
  ecliptic: boolean;
};

export class GroundView {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(70, 1, 0.1, 3000);
  inset = new THREE.PerspectiveCamera(4, 1, 0.1, 3000);
  labels: Labels;
  celestial = new THREE.Group();
  stars = makeStars(R, { twinkle: true, scale: 1.4 });
  cons = makeConstellations(R * 0.995);
  milky = makeMilkyWay(R * 1.05);
  trails = makeTrails(R * 0.99);
  ecliptic: THREE.Line;
  skyMat: THREE.ShaderMaterial;
  sun: THREE.Group;
  sunCore: THREE.Mesh;
  moon: THREE.Mesh;
  groundMat: THREE.MeshBasicMaterial;
  ridgeMat: THREE.MeshBasicMaterial;
  yaw = 180 * DEG; // azimuth from north, clockwise (180 = south)
  pitch = 25 * DEG;
  targetYaw = this.yaw;
  targetPitch = this.pitch;
  fov = 70;
  sunH = new THREE.Vector3();
  moonH = new THREE.Vector3();
  lst = 0;
  lat = 37.57;
  trailStart: number | null = null;
  opts: GroundOpts = {
    lines: true, names: true, atmosphere: true, trails: false, milky: true,
    zodiacHighlight: {}, showSunMoon: true, moonScale: 3, ecliptic: false,
  };
  private M = new THREE.Matrix4();
  private conLabels = new Map<string, HTMLElement>();

  constructor(pane: HTMLElement) {
    this.labels = new Labels(pane);
    this.camera.position.set(0, 0, 0);
    // sky dome
    this.skyMat = new THREE.ShaderMaterial({
      uniforms: { uSun: { value: new THREE.Vector3(0, 1, 0) }, uBright: { value: 1 } },
      vertexShader: `varying vec3 vDir; void main(){ vDir = position; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
      fragmentShader: SKY_FS,
      side: THREE.BackSide,
      depthWrite: false,
    });
    const dome = new THREE.Mesh(new THREE.SphereGeometry(R * 1.2, 64, 32), this.skyMat);
    dome.renderOrder = -10;
    this.scene.add(dome);

    // celestial objects in equatorial frame
    this.celestial.matrixAutoUpdate = false;
    this.celestial.add(this.milky, this.stars, this.cons.group, this.trails);
    this.trails.visible = false;
    // ecliptic line
    const ep: THREE.Vector3[] = [];
    for (let i = 0; i <= 360; i += 2) ep.push(T3(eclToEq(sph(i * DEG, 0)), R * 0.99));
    this.ecliptic = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(ep),
      new THREE.LineDashedMaterial({ color: 0xffc95a, dashSize: 8, gapSize: 6, transparent: true, opacity: 0.6, depthWrite: false }),
    );
    this.ecliptic.computeLineDistances();
    this.ecliptic.visible = false;
    this.celestial.add(this.ecliptic);
    this.scene.add(this.celestial);

    // sun & moon (horizontal frame positions)
    this.sun = new THREE.Group();
    this.sunCore = new THREE.Mesh(new THREE.SphereGeometry(R * 0.012, 24, 12), new THREE.MeshBasicMaterial({ color: 0xfff6e0 }));
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture('rgba(255,245,215,1)', 'rgba(255,160,60,0)'), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
    glow.scale.setScalar(R * 0.16);
    this.sun.add(this.sunCore, glow);
    this.scene.add(this.sun);
    this.moon = makeSkyMoon(R * 0.0045);
    this.scene.add(this.moon);

    // ground + mountains
    this.groundMat = new THREE.MeshBasicMaterial({ color: 0x0b1010 });
    const ground = new THREE.Mesh(new THREE.CircleGeometry(R * 1.1, 64), this.groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1.2;
    this.scene.add(ground);
    this.ridgeMat = new THREE.MeshBasicMaterial({ color: 0x070b0c, side: THREE.DoubleSide });
    this.scene.add(this.makeRidge());

    this.buildLabels();
    this.bindLook(pane);
  }

  private makeRidge() {
    const N = 360;
    const pos: number[] = [];
    const idx: number[] = [];
    const rr = R * 0.9;
    const noise = (a: number) =>
      0.5 + 0.5 * Math.sin(a * 3 + 1.3) * 0.5 + 0.3 * Math.sin(a * 7.1 + 0.4) + 0.18 * Math.sin(a * 17.3 + 2) + 0.08 * Math.sin(a * 41 + 1);
    for (let i = 0; i <= N; i++) {
      const a = (i / N) * Math.PI * 2;
      const h = Math.max(0, noise(a)) * rr * 0.045 + rr * 0.004;
      const x = Math.sin(a) * rr, z = -Math.cos(a) * rr;
      pos.push(x, -5, z, x, h, z);
      if (i < N) { const b = i * 2; idx.push(b, b + 1, b + 2, b + 1, b + 3, b + 2); }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setIndex(idx);
    const m = new THREE.Mesh(g, this.ridgeMat);
    m.renderOrder = 2;
    return m;
  }

  /** direction from (az from north clockwise, alt) */
  static dir(azDeg: number, altDeg: number, r = 1) {
    const a = azDeg * DEG, h = altDeg * DEG;
    return new THREE.Vector3(Math.sin(a) * Math.cos(h) * r, Math.sin(h) * r, -Math.cos(a) * Math.cos(h) * r);
  }

  private buildLabels() {
    const L = this.labels;
    const card: [string, number][] = [['북', 0], ['북동', 45], ['동', 90], ['남동', 135], ['남', 180], ['남서', 225], ['서', 270], ['북서', 315]];
    for (const [n, az] of card) {
      const p = GroundView.dir(az, 1.5, R * 0.8);
      L.add(n, n.length === 1 ? 'cardinal' : 'cardinal small', () => p);
    }
    const zen = GroundView.dir(0, 90, R * 0.8);
    L.add('천정', 'cardinal small', () => zen);
    const tmp = new THREE.Vector3();
    for (const c of SKY.cons) {
      const base = eqDir(c.ra, c.dec, R);
      const el = L.add(c.ko, 'con', () => {
        tmp.copy(base).applyMatrix4(this.M);
        return tmp.y > R * 0.02 ? tmp : null;
      }, () => this.opts.names && ((c.rank <= 2 && this.starsVisible() > 0.3) || !!this.conHighlighted(c.id)));
      this.conLabels.set(c.id, el);
    }
    for (const s of SKY.named) {
      const base = eqDir(s.ra, s.dec, R);
      const t2 = new THREE.Vector3();
      L.add(s.n, 'star', () => {
        t2.copy(base).applyMatrix4(this.M);
        return t2.y > R * 0.01 ? t2 : null;
      }, () => this.opts.names && this.starsVisible() > 0.35);
    }
    L.add('태양', 'sunlbl', () => (this.sunH.y > -0.02 && this.opts.showSunMoon ? this.sunH.clone().multiplyScalar(R * 0.97) : null));
    L.add('달', 'moonlbl', () => (this.moonH.y > -0.02 && this.opts.showSunMoon ? this.moonH.clone().multiplyScalar(R * 0.97).add(new THREE.Vector3(0, R * 0.03, 0)) : null));
  }

  private conHighlighted(id: string) {
    const z = this.opts.zodiacHighlight;
    if (z.sun === id) return 'sun';
    if (z.night === id) return 'night';
    return null;
  }

  private bindLook(pane: HTMLElement) {
    let down = false, px = 0, py = 0;
    const pts = new Map<number, { x: number; y: number }>();
    let pinch = 0;
    pane.addEventListener('pointerdown', (e) => {
      if ((e.target as HTMLElement).closest('button,input,select,label')) return;
      down = true; px = e.clientX; py = e.clientY;
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      pane.setPointerCapture(e.pointerId);
    });
    pane.addEventListener('pointermove', (e) => {
      if (!down) return;
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pts.size === 2) {
        const [a, b] = [...pts.values()];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (pinch) this.zoom(pinch / d);
        pinch = d;
        return;
      }
      const k = (this.fov / pane.clientHeight) * DEG;
      this.targetYaw -= (e.clientX - px) * k;
      this.targetPitch = THREE.MathUtils.clamp(this.targetPitch + (e.clientY - py) * k, -10 * DEG, 89 * DEG);
      this.yaw = this.targetYaw; this.pitch = this.targetPitch;
      px = e.clientX; py = e.clientY;
    });
    const up = (e: PointerEvent) => { pts.delete(e.pointerId); pinch = 0; if (!pts.size) down = false; };
    pane.addEventListener('pointerup', up);
    pane.addEventListener('pointercancel', up);
    pane.addEventListener('wheel', (e) => { e.preventDefault(); this.zoom(Math.exp(e.deltaY * 0.001)); }, { passive: false });
  }
  zoom(k: number) {
    this.fov = THREE.MathUtils.clamp(this.fov * k, 15, 110);
  }
  look(azDeg: number, altDeg: number, fov?: number) {
    // shortest path
    let t = azDeg * DEG;
    while (t - this.yaw > Math.PI) t -= Math.PI * 2;
    while (t - this.yaw < -Math.PI) t += Math.PI * 2;
    this.targetYaw = t;
    this.targetPitch = altDeg * DEG;
    if (fov) this.fov = fov;
  }
  /** current view direction in horizontal frame */
  viewDir() {
    return GroundView.dir(this.yaw / DEG, this.pitch / DEG);
  }

  starsVisible() {
    if (!this.opts.atmosphere) return 1;
    return 1 - THREE.MathUtils.smoothstep(this.sunH.y, -0.2, 0.05) * 0.985;
  }

  /** set sky from local sidereal time (rad), latitude, and ephemeris time for sun/moon */
  update(lst: number, lat: number, ms: number, dt: number, time: number) {
    if (this.trailStart !== null) {
      let d = lst - this.lst;
      if (d > Math.PI) d -= Math.PI * 2;
      if (d < -Math.PI) d += Math.PI * 2;
      this.trailAcc += d;
    }
    this.lst = lst; this.lat = lat;
    eqToHorizMatrix(lst, lat, this.M);
    this.celestial.matrix.copy(this.M);
    this.celestial.matrixWorldNeedsUpdate = true;

    const sunEq = T3(eclToEq(sph(sunLon(ms), 0)));
    this.sunH.copy(sunEq).applyMatrix4(this.M).normalize();
    const me = moonEcl(ms);
    this.moonH.copy(T3(eclToEq(sph(me.lon, me.lat)))).applyMatrix4(this.M).normalize();

    this.sun.position.copy(this.sunH).multiplyScalar(R * 0.97);
    this.sun.visible = this.opts.showSunMoon;
    this.moon.position.copy(this.moonH).multiplyScalar(R * 0.95);
    this.moon.scale.setScalar(this.opts.moonScale);
    this.moon.visible = this.opts.showSunMoon;
    const mm = this.moon.material as THREE.ShaderMaterial;
    // light direction for moon: from moon toward sun (sun is ~400x farther)
    mm.uniforms.uSun.value.copy(this.sunH).multiplyScalar(400).sub(this.moonH).normalize();

    const atmo = this.opts.atmosphere;
    mm.uniforms.uAlpha.value = this.starsVisible();
    const sunUp = this.sunH.y;
    this.skyMat.uniforms.uSun.value.copy(this.sunH);
    this.skyMat.uniforms.uBright.value = atmo ? 1 : 0.0;
    const sv = this.starsVisible();
    const sm = this.stars.material as THREE.ShaderMaterial;
    sm.uniforms.uAlpha.value = sv;
    sm.uniforms.uTime.value = time;
    (this.milky.material as THREE.ShaderMaterial).uniforms.uAlpha.value = this.opts.milky ? Math.pow(sv, 3) : 0;
    const dayAmt = atmo ? THREE.MathUtils.smoothstep(sunUp, -0.25, 0.2) : 0;
    this.groundMat.color.setRGB(0.004 + 0.1 * dayAmt, 0.006 + 0.13 * dayAmt, 0.006 + 0.08 * dayAmt);
    this.ridgeMat.color.setRGB(0.002 + 0.05 * dayAmt, 0.003 + 0.07 * dayAmt, 0.005 + 0.06 * dayAmt);

    for (const [id, m] of this.cons.mats) {
      const h = this.conHighlighted(id);
      m.color.set(h === 'sun' ? 0xffc040 : h === 'night' ? 0x7fd8ff : 0x6f9cff);
      m.opacity = (this.opts.lines ? (h ? 0.95 : 0.3) : h ? 0.95 : 0) * Math.max(sv, h && !atmo ? 1 : sv);
      const el = this.conLabels.get(id);
      if (el) el.dataset.hl = h || '';
    }
    this.ecliptic.visible = this.opts.ecliptic;
    (this.ecliptic.material as THREE.LineDashedMaterial).opacity = 0.65 * Math.max(sv, 0.3);

    this.trails.visible = this.opts.trails && this.trailStart !== null;
    if (this.trails.visible) {
      (this.trails.material as THREE.ShaderMaterial).uniforms.uDelta.value = Math.max(0, Math.min(this.trailAcc, Math.PI * 2));
      (this.trails.material as THREE.ShaderMaterial).uniforms.uAlpha.value = sv;
    }

    // camera
    const k = 1 - Math.pow(0.002, dt);
    this.yaw += (this.targetYaw - this.yaw) * k;
    this.pitch += (this.targetPitch - this.pitch) * k;
    this.camera.fov += (this.fov - this.camera.fov) * k;
    this.camera.updateProjectionMatrix();
    this.camera.up.set(0, 1, 0);
    this.camera.lookAt(this.viewDir());
    this.inset.up.set(0, 1, 0);
    this.inset.position.set(0, 0, 0);
    this.inset.lookAt(this.moonH.clone().multiplyScalar(R));
  }
  trailAcc = 0;
  startTrails(lst: number) { this.trailStart = lst; this.lst = lst; this.trailAcc = 0; }
  clearTrails() { this.trailStart = null; }
}
