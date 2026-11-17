import * as THREE from 'three';

export const DEG = Math.PI / 180;
export const TAU = Math.PI * 2;
export const OBLIQ = 23.44 * DEG;
export const DAY = 86400000;
export const SEOUL = { lat: 37.57, lon: 126.98 };

export const norm = (a: number) => ((a % TAU) + TAU) % TAU;
const d2000 = (ms: number) => ms / DAY + 2440587.5 - 2451545.0;

/** Greenwich mean sidereal time (rad) */
export function gmst(ms: number) {
  return norm((280.46061837 + 360.98564736629 * d2000(ms)) * DEG);
}

/** Sun geocentric ecliptic longitude (rad) */
export function sunLon(ms: number) {
  const d = d2000(ms);
  const g = (357.528 + 0.9856003 * d) * DEG;
  const L = 280.46 + 0.9856474 * d;
  return norm((L + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g)) * DEG);
}

/** Moon geocentric ecliptic longitude / latitude (rad), low precision */
export function moonEcl(ms: number) {
  const d = d2000(ms);
  const L = 218.316 + 13.176396 * d;
  const M = (134.963 + 13.064993 * d) * DEG;
  const F = (93.272 + 13.22935 * d) * DEG;
  const D = (297.85 + 12.190749 * d) * DEG;
  const lon = L + 6.289 * Math.sin(M) + 1.274 * Math.sin(2 * D - M) + 0.658 * Math.sin(2 * D);
  return { lon: norm(lon * DEG), lat: 5.128 * Math.sin(F) * DEG };
}

/** moon elongation east of sun, 0..2π (0 = new moon, π = full) */
export const moonElong = (ms: number) => norm(moonEcl(ms).lon - sunLon(ms));

/** astro vectors: x → vernal equinox, z → north pole */
export type V3 = [number, number, number];
export const sph = (lon: number, lat: number): V3 => [
  Math.cos(lat) * Math.cos(lon),
  Math.cos(lat) * Math.sin(lon),
  Math.sin(lat),
];
export function eclToEq(v: V3): V3 {
  const c = Math.cos(OBLIQ), s = Math.sin(OBLIQ);
  return [v[0], v[1] * c - v[2] * s, v[1] * s + v[2] * c];
}
export function eqToEcl(v: V3): V3 {
  const c = Math.cos(OBLIQ), s = Math.sin(OBLIQ);
  return [v[0], v[1] * c + v[2] * s, -v[1] * s + v[2] * c];
}
export const toRaDec = (v: V3) => ({ ra: norm(Math.atan2(v[1], v[0])), dec: Math.asin(v[2]) });

/** astro → three.js (y up) */
export const T3 = (v: V3, r = 1) => new THREE.Vector3(v[0] * r, v[2] * r, -v[1] * r);
const A3 = (v: THREE.Vector3): V3 => [v.x, -v.z, v.y];

function matFrom(fn: (v: THREE.Vector3) => THREE.Vector3) {
  const ex = fn(new THREE.Vector3(1, 0, 0));
  const ey = fn(new THREE.Vector3(0, 1, 0));
  const ez = fn(new THREE.Vector3(0, 0, 1));
  return new THREE.Matrix4().makeBasis(ex, ey, ez);
}

/** equatorial three-frame → ecliptic three-frame */
export const EQ2ECL = matFrom((v) => T3(eqToEcl(A3(v))));

/** equatorial three-frame → local horizontal three-frame (X=east, Y=zenith, -Z=north) */
export function eqToHorizMatrix(lst: number, latDeg: number, out = new THREE.Matrix4()) {
  const phi = latDeg * DEG;
  const cL = Math.cos(lst), sL = Math.sin(lst), cP = Math.cos(phi), sP = Math.sin(phi);
  const f = (v: THREE.Vector3) => {
    const [x, y, z] = A3(v);
    const a = x * cL + y * sL;
    const b = -x * sL + y * cL;
    return new THREE.Vector3(b, cP * a + sP * z, sP * a - cP * z);
  };
  return out.copy(matFrom(f));
}

/** local solar-time model: LST = sun RA + hour angle of sun */
export function lstFromSolar(ms: number, hour: number) {
  const sun = toRaDec(eclToEq(sph(sunLon(ms), 0)));
  return norm(sun.ra + (hour - 12) * 15 * DEG);
}
export function solarHour(ms: number, lonDeg = SEOUL.lon) {
  const h = (ms / 3600000 + lonDeg / 15) % 24;
  return (h + 24) % 24;
}
/** ms at which the local solar day (at lon) containing ms starts */
export function solarDayStart(ms: number, lonDeg = SEOUL.lon) {
  return ms - solarHour(ms, lonDeg) * 3600000;
}

/** zodiac along ecliptic (J2000 longitudes of IAU boundaries) */
export const ZODIAC = [
  { id: 'Psc', ko: '물고기자리', from: 351.6, sign: '♓' },
  { id: 'Ari', ko: '양자리', from: 29.1, sign: '♈' },
  { id: 'Tau', ko: '황소자리', from: 53.5, sign: '♉' },
  { id: 'Gem', ko: '쌍둥이자리', from: 90.4, sign: '♊' },
  { id: 'Cnc', ko: '게자리', from: 118.3, sign: '♋' },
  { id: 'Leo', ko: '사자자리', from: 138.2, sign: '♌' },
  { id: 'Vir', ko: '처녀자리', from: 174.2, sign: '♍' },
  { id: 'Lib', ko: '천칭자리', from: 218.0, sign: '♎' },
  { id: 'Sco', ko: '전갈자리', from: 241.0, sign: '♏' },
  { id: 'Oph', ko: '뱀주인자리', from: 247.7, sign: '⛎' },
  { id: 'Sgr', ko: '궁수자리', from: 266.3, sign: '♐' },
  { id: 'Cap', ko: '염소자리', from: 299.7, sign: '♑' },
  { id: 'Aqr', ko: '물병자리', from: 327.9, sign: '♒' },
];
export const ZODIAC12 = ZODIAC.filter((z) => z.id !== 'Oph');

export function zodiacAt(lonRad: number) {
  const d = ((lonRad / DEG) % 360 + 360) % 360;
  let best = ZODIAC[0];
  for (const z of ZODIAC) {
    const start = z.from;
    if (z.id === 'Psc') { if (d >= 351.6 || d < 29.1) best = z; continue; }
    if (d >= start) best = z;
  }
  if (d >= 351.6 || d < 29.1) return ZODIAC[0];
  return best;
}

/** time (ms) near `ms` when the sun has ecliptic longitude lon */
export function timeForSunLon(lon: number, nearMs: number) {
  let t = nearMs;
  for (let i = 0; i < 6; i++) {
    let diff = norm(lon - sunLon(t));
    if (diff > Math.PI) diff -= TAU;
    t += (diff / TAU) * 365.2422 * DAY;
  }
  return t;
}
/** time near `ms` with moon elongation `el` */
export function timeForElong(el: number, nearMs: number) {
  let t = nearMs;
  for (let i = 0; i < 8; i++) {
    let diff = norm(el - moonElong(t));
    if (diff > Math.PI) diff -= TAU;
    t += (diff / TAU) * 29.530589 * DAY;
  }
  return t;
}

export function phaseName(el: number) {
  const d = el / DEG;
  if (d < 12 || d >= 348) return '삭 (보이지 않음)';
  if (d < 80) return '초승달';
  if (d < 100) return '상현달';
  if (d < 168) return '상현과 보름 사이';
  if (d < 192) return '보름달 (망)';
  if (d < 260) return '보름과 하현 사이';
  if (d < 280) return '하현달';
  return '그믐달';
}

export function bvToColor(bv: number) {
  const t = Math.max(-0.4, Math.min(2.0, bv));
  // rough blackbody-ish ramp
  const stops: [number, number[]][] = [
    [-0.4, [0.62, 0.71, 1.0]],
    [0.0, [0.8, 0.86, 1.0]],
    [0.4, [1.0, 0.98, 0.95]],
    [0.8, [1.0, 0.9, 0.72]],
    [1.2, [1.0, 0.78, 0.52]],
    [2.0, [1.0, 0.62, 0.38]],
  ];
  for (let i = 0; i < stops.length - 1; i++) {
    const [a, ca] = stops[i], [b, cb] = stops[i + 1];
    if (t <= b) {
      const k = (t - a) / (b - a);
      return ca.map((c, j) => c + (cb[j] - c) * k);
    }
  }
  return stops[stops.length - 1][1];
}
