import * as THREE from 'three';
import { glowTexture } from './sky';

const loader = new THREE.TextureLoader();
const base = import.meta.env.BASE_URL;
const tex = (f: string, srgb = true) => {
  // offline single-file build embeds textures as data URIs in window.__TEX
  const embedded = (window as unknown as { __TEX?: Record<string, string> }).__TEX?.[f];
  const t = loader.load(embedded ?? base + 'tex/' + f);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
};
let T: Record<string, THREE.Texture> | null = null;
function textures() {
  if (!T) {
    T = {
      day: tex('earth_atmos_2048.jpg'),
      night: tex('earth_lights_2048.png'),
      spec: tex('earth_specular_2048.jpg', false),
      clouds: tex('earth_clouds_1024.png'),
      moon: tex('moon_1024.jpg'),
    };
  }
  return T;
}

const EARTH_VS = /* glsl */ `
  varying vec2 vUv; varying vec3 vN; varying vec3 vW;
  void main(){
    vUv = uv;
    vN = normalize(mat3(modelMatrix)*normal);
    vec4 w = modelMatrix*vec4(position,1.0); vW = w.xyz;
    gl_Position = projectionMatrix*viewMatrix*w;
  }`;
const EARTH_FS = /* glsl */ `
  uniform sampler2D uDay; uniform sampler2D uNight; uniform sampler2D uSpec; uniform sampler2D uClouds;
  uniform vec3 uSun; uniform float uAmbient; uniform float uCloudShift;
  varying vec2 vUv; varying vec3 vN; varying vec3 vW;
  void main(){
    vec3 n = normalize(vN);
    vec3 v = normalize(cameraPosition - vW);
    float ndl = dot(n, uSun);
    float day = smoothstep(-0.12, 0.22, ndl);
    vec3 dc = texture2D(uDay, vUv).rgb;
    vec3 nc = texture2D(uNight, vUv).rgb;
    float sp = texture2D(uSpec, vUv).r;
    float cl = texture2D(uClouds, vUv + vec2(uCloudShift,0.0)).a;
    vec3 lit = dc * (0.08 + 1.15*max(ndl,0.0));
    vec3 h = normalize(uSun + v);
    lit += sp * pow(max(dot(n,h),0.0), 40.0) * vec3(1.0,0.92,0.75) * 0.9 * step(0.0, ndl);
    lit = mix(lit, vec3(1.0)*(0.1+1.05*max(ndl,0.0)), cl*0.85);
    vec3 night = nc * vec3(1.0,0.78,0.45) * 1.6 * (1.0-cl*0.8) + dc*uAmbient;
    vec3 col = mix(night, lit, day);
    // twilight band
    float tw = exp(-pow(ndl/0.12,2.0));
    col += vec3(1.0,0.45,0.15)*tw*0.12;
    // rim atmosphere
    float fr = pow(1.0 - max(dot(n,v),0.0), 3.0);
    col += vec3(0.35,0.6,1.0) * fr * (0.15 + 0.85*smoothstep(-0.3,0.4,ndl));
    gl_FragColor = vec4(col,1.0);
  }`;

export class Earth {
  group = new THREE.Group(); // tilt / orientation set by owner (axis = local +Y)
  spin = new THREE.Group(); // rotates about local Y (Greenwich at +X when 0)
  mesh: THREE.Mesh;
  mat: THREE.ShaderMaterial;
  atmo: THREE.Mesh;
  radius: number;
  constructor(radius: number, segs = 96) {
    this.radius = radius;
    const t = textures();
    this.mat = new THREE.ShaderMaterial({
      vertexShader: EARTH_VS,
      fragmentShader: EARTH_FS,
      uniforms: {
        uDay: { value: t.day }, uNight: { value: t.night }, uSpec: { value: t.spec }, uClouds: { value: t.clouds },
        uSun: { value: new THREE.Vector3(1, 0, 0) }, uAmbient: { value: 0.03 }, uCloudShift: { value: 0 },
      },
    });
    this.mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, segs, segs / 2), this.mat);
    this.spin.add(this.mesh);
    this.group.add(this.spin);
    const am = new THREE.ShaderMaterial({
      uniforms: { uSun: this.mat.uniforms.uSun },
      vertexShader: /* glsl */ `varying vec3 vN; varying vec3 vW;
        void main(){ vN = normalize(mat3(modelMatrix)*normal); vec4 w = modelMatrix*vec4(position,1.0); vW=w.xyz; gl_Position = projectionMatrix*viewMatrix*w; }`,
      fragmentShader: /* glsl */ `uniform vec3 uSun; varying vec3 vN; varying vec3 vW;
        void main(){ vec3 v = normalize(cameraPosition - vW); float f = pow(1.0 - abs(dot(normalize(vN), v)), 2.2);
          float l = smoothstep(-0.4, 0.5, dot(normalize(vN), uSun));
          gl_FragColor = vec4(vec3(0.3,0.58,1.0)*f*(0.15+1.2*l), 1.0); }`,
      side: THREE.BackSide,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.atmo = new THREE.Mesh(new THREE.SphereGeometry(radius * 1.07, 64, 32), am);
    this.group.add(this.atmo);
  }
  /** world-space sun direction */
  setSun(dir: THREE.Vector3) {
    (this.mat.uniforms.uSun.value as THREE.Vector3).copy(dir).normalize();
  }
  setSpin(angle: number) {
    this.spin.rotation.y = angle;
  }
  /** local (spin-frame) surface point for lat/lon (deg) */
  surface(latDeg: number, lonDeg: number, r = this.radius) {
    const la = (latDeg * Math.PI) / 180, lo = (lonDeg * Math.PI) / 180;
    return new THREE.Vector3(Math.cos(la) * Math.cos(lo) * r, Math.sin(la) * r, -Math.cos(la) * Math.sin(lo) * r);
  }
  /** local basis (east, north, up) at lat/lon in spin frame */
  basis(latDeg: number, lonDeg: number) {
    const up = this.surface(latDeg, lonDeg, 1).normalize();
    const east = new THREE.Vector3(0, 1, 0).cross(up).normalize();
    const north = up.clone().cross(east).normalize();
    return { east, north, up };
  }
}

export function makeMoon(radius: number, segs = 64) {
  const t = textures();
  const m = new THREE.MeshStandardMaterial({ map: t.moon, roughness: 1, metalness: 0, bumpMap: t.moon, bumpScale: 0.02 });
  return new THREE.Mesh(new THREE.SphereGeometry(radius, segs, segs / 2), m);
}

/** shader-lit moon (light direction uniform in world space) for the ground sky */
export function makeSkyMoon(radius: number) {
  const t = textures();
  const m = new THREE.ShaderMaterial({
    uniforms: { uMap: { value: t.moon }, uSun: { value: new THREE.Vector3(1, 0, 0) }, uEarthshine: { value: 0.035 }, uAlpha: { value: 1 } },
    vertexShader: /* glsl */ `varying vec2 vUv; varying vec3 vN;
      void main(){ vUv=uv; vN = normalize(mat3(modelMatrix)*normal); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
    fragmentShader: /* glsl */ `uniform sampler2D uMap; uniform vec3 uSun; uniform float uEarthshine; uniform float uAlpha; varying vec2 vUv; varying vec3 vN;
      void main(){ vec3 c = texture2D(uMap, vUv).rgb; float l = smoothstep(-0.03, 0.12, dot(normalize(vN), uSun));
        vec3 col = c*(uEarthshine + 1.35*l)*vec3(1.0,0.98,0.94);
        gl_FragColor = vec4(col, max(l, uAlpha)); }`,
    transparent: true,
  });
  return new THREE.Mesh(new THREE.SphereGeometry(radius, 48, 24), m);
}

export function makeSun(radius: number, glowScale = 9) {
  const g = new THREE.Group();
  const core = new THREE.Mesh(
    new THREE.SphereGeometry(radius, 48, 24),
    new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 } },
      vertexShader: /* glsl */ `varying vec3 vN; varying vec3 vP; varying vec3 vW;
        void main(){ vN = normalize(mat3(modelMatrix)*normal); vP = position; vec4 w = modelMatrix*vec4(position,1.0); vW = w.xyz; gl_Position = projectionMatrix*viewMatrix*w; }`,
      fragmentShader: /* glsl */ `uniform float uTime; varying vec3 vN; varying vec3 vP; varying vec3 vW;
        float h(vec3 p){ return fract(sin(dot(p, vec3(12.9898,78.233,37.719)))*43758.5453); }
        float n3(vec3 x){ vec3 i=floor(x); vec3 f=fract(x); f=f*f*(3.0-2.0*f);
          return mix(mix(mix(h(i),h(i+vec3(1,0,0)),f.x),mix(h(i+vec3(0,1,0)),h(i+vec3(1,1,0)),f.x),f.y),
                     mix(mix(h(i+vec3(0,0,1)),h(i+vec3(1,0,1)),f.x),mix(h(i+vec3(0,1,1)),h(i+vec3(1,1,1)),f.x),f.y),f.z); }
        void main(){
          vec3 v = normalize(cameraPosition - vW);
          float mu = max(dot(normalize(vN), v), 0.0);
          vec3 p = normalize(vP)*5.0;
          float g = n3(p + uTime*0.15)*0.6 + n3(p*2.3 - uTime*0.2)*0.4;
          vec3 col = mix(vec3(1.0,0.55,0.12), vec3(1.0,0.95,0.75), pow(mu,0.6));
          col *= 0.85 + 0.35*g;
          gl_FragColor = vec4(col*1.25, 1.0);
        }`,
    }),
  );
  g.add(core);
  const sp = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: glowTexture('rgba(255,236,190,0.95)', 'rgba(255,140,40,0)'), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }),
  );
  sp.scale.setScalar(radius * glowScale);
  g.add(sp);
  const sp2 = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: glowTexture('rgba(255,200,120,0.5)', 'rgba(255,120,40,0)'), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }),
  );
  sp2.scale.setScalar(radius * glowScale * 2.6);
  g.add(sp2);
  return { group: g, core, update: (t: number) => ((core.material as THREE.ShaderMaterial).uniforms.uTime.value = t) };
}
