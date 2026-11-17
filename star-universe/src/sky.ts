import * as THREE from 'three';
import data from './data/sky.json';
import { DEG, sph, T3, bvToColor } from './astro';

type Con = { id: string; ko: string; en: string; ra: number; dec: number; rank: number; lines: number[][][] };
export const SKY = data as unknown as {
  stars: number[][];
  named: { n: string; ra: number; dec: number }[];
  cons: Con[];
};
export const conById = new Map(SKY.cons.map((c) => [c.id, c]));

/** equatorial three-frame direction for RA/Dec in degrees */
export const eqDir = (raDeg: number, decDeg: number, r = 1) => T3(sph(raDeg * DEG, decDeg * DEG), r);

const STAR_VS = /* glsl */ `
  attribute float size;
  attribute vec3 color;
  attribute float phase;
  uniform float uScale;
  uniform float uTime;
  uniform float uTwinkle;
  varying vec3 vColor;
  varying float vAlpha;
  void main(){
    vec4 mv = modelViewMatrix * vec4(position,1.0);
    gl_Position = projectionMatrix * mv;
    float tw = 1.0 + uTwinkle * 0.35 * sin(uTime*3.0 + phase*40.0) * sin(uTime*1.7 + phase*13.0);
    float s = size * uScale * tw;
    gl_PointSize = max(s, 1.6);
    vAlpha = clamp(s / 1.6, 0.0, 1.0);
    vColor = color;
  }`;
const STAR_FS = /* glsl */ `
  uniform float uAlpha;
  varying vec3 vColor;
  varying float vAlpha;
  void main(){
    vec2 p = gl_PointCoord*2.0-1.0;
    float r2 = dot(p,p);
    if(r2>1.0) discard;
    float core = exp(-r2*9.0);
    float halo = exp(-r2*2.6)*0.35;
    gl_FragColor = vec4(vColor*(core+halo)*1.25, (core+halo)*uAlpha*vAlpha);
  }`;

export function makeStars(radius: number, opts: { scale?: number; twinkle?: boolean; magLimit?: number } = {}) {
  const lim = opts.magLimit ?? 6.2;
  const list = SKY.stars.filter((s) => s[2] <= lim);
  const pos = new Float32Array(list.length * 3);
  const col = new Float32Array(list.length * 3);
  const size = new Float32Array(list.length);
  const phase = new Float32Array(list.length);
  list.forEach((s, i) => {
    const v = eqDir(s[0], s[1], radius);
    pos.set([v.x, v.y, v.z], i * 3);
    col.set(bvToColor(s[3]), i * 3);
    size[i] = Math.max(0.35, Math.pow(1.38, 4.6 - s[2]) * 2.2);
    phase[i] = Math.random();
  });
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  g.setAttribute('size', new THREE.BufferAttribute(size, 1));
  g.setAttribute('phase', new THREE.BufferAttribute(phase, 1));
  const m = new THREE.ShaderMaterial({
    vertexShader: STAR_VS,
    fragmentShader: STAR_FS,
    uniforms: {
      uScale: { value: (opts.scale ?? 1) * Math.min(window.devicePixelRatio, 2) },
      uTime: { value: 0 },
      uTwinkle: { value: opts.twinkle ? 1 : 0 },
      uAlpha: { value: 1 },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const pts = new THREE.Points(g, m);
  pts.frustumCulled = false;
  pts.renderOrder = -5;
  return pts;
}

/** constellation stick figures; returns group with per-constellation materials */
export function makeConstellations(radius: number, filter?: (id: string) => boolean) {
  const group = new THREE.Group();
  const mats = new Map<string, THREE.LineBasicMaterial>();
  for (const c of SKY.cons) {
    if (filter && !filter(c.id)) continue;
    const pts: number[] = [];
    for (const seg of c.lines) {
      for (let i = 0; i < seg.length - 1; i++) {
        const a = eqDir(seg[i][0], seg[i][1], radius);
        const b = eqDir(seg[i + 1][0], seg[i + 1][1], radius);
        pts.push(a.x, a.y, a.z, b.x, b.y, b.z);
      }
    }
    if (!pts.length) continue;
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    const m = mats.get(c.id) ?? new THREE.LineBasicMaterial({
      color: 0x6f9cff,
      transparent: true,
      opacity: 0.32,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const l = new THREE.LineSegments(g, m);
    l.frustumCulled = false;
    l.renderOrder = -4;
    group.add(l);
    mats.set(c.id, m);
  }
  return { group, mats };
}

const MW_VS = /* glsl */ `
  varying vec3 vDir;
  void main(){ vDir = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }`;
const MW_FS = /* glsl */ `
  uniform float uAlpha;
  uniform vec3 uGNP; uniform vec3 uGC;
  varying vec3 vDir;
  float hash(vec3 p){ p = fract(p*0.3183099+.1); p*=17.0; return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }
  float noise(vec3 x){ vec3 i=floor(x); vec3 f=fract(x); f=f*f*(3.0-2.0*f);
    return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),
               mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z); }
  float fbm(vec3 p){ float a=0.5, s=0.0; for(int i=0;i<5;i++){ s+=a*noise(p); p*=2.03; a*=0.5; } return s; }
  void main(){
    vec3 d = normalize(vDir);
    float b = asin(clamp(dot(d,uGNP),-1.0,1.0));
    float c = dot(d,uGC);
    float width = 0.16 + 0.10*smoothstep(0.0,1.0,c);
    float band = exp(-pow(b/width,2.0));
    float n = fbm(d*6.0);
    float dust = smoothstep(0.35,0.75,fbm(d*11.0+3.0));
    float core = 0.55 + 0.9*smoothstep(-0.2,1.0,c);
    float v = band * (0.35+0.9*n) * core * (1.0-0.65*dust*exp(-pow(b/0.05,2.0)));
    vec3 col = mix(vec3(0.45,0.55,0.85), vec3(1.0,0.86,0.7), smoothstep(0.2,1.0,c)*0.8);
    gl_FragColor = vec4(col*v*0.30, 1.0) * uAlpha;
  }`;

export function makeMilkyWay(radius: number) {
  const g = new THREE.SphereGeometry(radius, 64, 32);
  const m = new THREE.ShaderMaterial({
    vertexShader: MW_VS,
    fragmentShader: MW_FS,
    uniforms: {
      uAlpha: { value: 1 },
      uGNP: { value: eqDir(192.859, 27.128) },
      uGC: { value: eqDir(266.405, -28.936) },
    },
    side: THREE.BackSide,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const mesh = new THREE.Mesh(g, m);
  mesh.renderOrder = -6;
  mesh.frustumCulled = false;
  return mesh;
}

/** star trails (long exposure): arcs from RA to RA+delta around the pole */
export function makeTrails(radius: number, magLimit = 3.6) {
  const list = SKY.stars.filter((s) => s[2] <= magLimit);
  const SEG = 96;
  const ra: number[] = [], dec: number[] = [], sp: number[] = [], col: number[] = [], pos: number[] = [];
  const idx: number[] = [];
  let base = 0;
  for (const s of list) {
    const c = bvToColor(s[3]);
    const bright = Math.min(1, Math.pow(1.5, 2.5 - s[2]));
    for (let i = 0; i <= SEG; i++) {
      ra.push(s[0] * DEG); dec.push(s[1] * DEG); sp.push(i / SEG);
      col.push(c[0] * bright, c[1] * bright, c[2] * bright);
      pos.push(0, 0, 0);
      if (i < SEG) idx.push(base + i, base + i + 1);
    }
    base += SEG + 1;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('ra', new THREE.Float32BufferAttribute(ra, 1));
  g.setAttribute('dec', new THREE.Float32BufferAttribute(dec, 1));
  g.setAttribute('s', new THREE.Float32BufferAttribute(sp, 1));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.setIndex(idx);
  const m = new THREE.ShaderMaterial({
    uniforms: { uDelta: { value: 0 }, uR: { value: radius }, uAlpha: { value: 1 } },
    vertexShader: /* glsl */ `
      attribute float ra; attribute float dec; attribute float s; attribute vec3 color;
      uniform float uDelta; uniform float uR;
      varying vec3 vC; varying float vS;
      void main(){
        float a = ra + s*uDelta;
        vec3 p = vec3(cos(dec)*cos(a), sin(dec), -cos(dec)*sin(a))*uR;
        vC = color; vS = s;
        gl_Position = projectionMatrix*modelViewMatrix*vec4(p,1.0);
      }`,
    fragmentShader: /* glsl */ `
      uniform float uAlpha; varying vec3 vC; varying float vS;
      void main(){ gl_FragColor = vec4(vC*(0.25+0.75*(1.0-vS)), 1.0)*uAlpha; }`,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const l = new THREE.LineSegments(g, m);
  l.frustumCulled = false;
  l.renderOrder = -4;
  return l;
}

/** soft radial glow sprite texture */
export function glowTexture(inner = 'rgba(255,240,200,1)', outer = 'rgba(255,170,60,0)') {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const x = c.getContext('2d')!;
  const g = x.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, inner);
  g.addColorStop(0.12, inner);
  g.addColorStop(0.3, inner.replace(/[\d.]+\)$/, '0.35)'));
  g.addColorStop(1, outer);
  x.fillStyle = g;
  x.fillRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
