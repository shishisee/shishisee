import * as THREE from 'three';
import './style.css';
import type { Ctx, Mod } from './app';
import { GroundView } from './ground';
import { Diurnal } from './modules/diurnal';
import { Annual } from './modules/annual';
import { MoonMod } from './modules/moon';
import { Free } from './modules/free';

const $ = <T extends HTMLElement>(s: string) => document.querySelector(s) as T;

const canvas = $<HTMLCanvasElement>('#gl');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.setClearColor(0x000000, 1);
renderer.autoClear = false;

const paneA = $('#paneA');
const paneB = $('#paneB');
const ctx: Ctx = {
  renderer,
  paneA,
  paneB,
  ground: new GroundView(paneB),
  controls: $('#controls'),
  card: $('#cardBody'),
  readout: $('#readout'),
  insetEl: $('#inset'),
  toolsA: $('#toolsA'),
  toolsB: $('#toolsB'),
};
ctx.insetEl.style.display = 'none';

const mods: Mod[] = [new Diurnal(), new Annual(), new MoonMod(), new Free()];
mods.forEach((m) => m.init(ctx));
for (const m of mods) m.space?.labels.show(false);

let cur: Mod | null = null;
const tabs = $('#tabs');
mods.forEach((m, i) => {
  const b = document.createElement('button');
  b.className = 'tab';
  b.type = 'button';
  b.dataset.id = m.id;
  b.innerHTML = `<span class="tab-n">${i + 1}</span><span class="tab-t">${m.name}<small>${m.short}</small></span>`;
  b.addEventListener('click', () => select(m.id));
  tabs.appendChild(b);
});

function select(id: string) {
  const m = mods.find((x) => x.id === id)!;
  if (cur === m) return;
  cur?.exit();
  cur = m;
  document.body.dataset.mod = m.id;
  document.body.classList.toggle('single', !!m.single);
  tabs.querySelectorAll<HTMLElement>('.tab').forEach((t) => t.classList.toggle('on', t.dataset.id === id));
  $('#titleA').textContent = m.titleA;
  $('#titleB').textContent = m.titleB;
  ctx.toolsA.replaceChildren(...(m.toolsA ? [m.toolsA] : []));
  ctx.toolsB.replaceChildren(...(m.toolsB ? [m.toolsB] : []));
  m.enter();
  history.replaceState(null, '', '#' + id);
  resize();
}

// concept card toggle
$('#cardBtn').addEventListener('click', () => document.body.classList.toggle('card-open'));
$('#cardClose').addEventListener('click', () => document.body.classList.remove('card-open'));
if (window.innerWidth >= 1280) document.body.classList.add('card-open');

// intro
const intro = $('#intro');
intro.querySelectorAll<HTMLButtonElement>('[data-go]').forEach((b) =>
  b.addEventListener('click', () => { select(b.dataset.go!); intro.classList.add('gone'); document.body.classList.add('started'); }),
);

function resize() {
  const wrap = canvas.parentElement!;
  const w = wrap.clientWidth, h = wrap.clientHeight;
  renderer.setSize(w, h, false);
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
}
window.addEventListener('resize', resize);
new ResizeObserver(resize).observe(canvas.parentElement!);
resize();

function rectOf(el: HTMLElement) {
  const c = canvas.getBoundingClientRect();
  const r = el.getBoundingClientRect();
  return { x: r.left - c.left, y: r.top - c.top, w: r.width, h: r.height, ch: c.height };
}
function draw(scene: THREE.Scene, cam: THREE.PerspectiveCamera, el: HTMLElement, clear = true) {
  const r = rectOf(el);
  if (r.w < 2 || r.h < 2) return null;
  cam.aspect = r.w / r.h;
  cam.updateProjectionMatrix();
  const y = r.ch - r.y - r.h;
  renderer.setViewport(r.x, y, r.w, r.h);
  renderer.setScissor(r.x, y, r.w, r.h);
  renderer.setScissorTest(true);
  if (clear) renderer.clear();
  renderer.render(scene, cam);
  return r;
}

const clock = new THREE.Clock();
let time = 0;
function loop() {
  requestAnimationFrame(loop);
  const dt = Math.min(clock.getDelta(), 0.1);
  time += dt;
  if (!cur) {
    // idle preview behind intro: slowly turning diurnal space view
    const d = mods[0];
    d.frame(dt * 0.3, time);
    renderer.setScissorTest(false);
    renderer.clear();
    const full = canvas.parentElement!;
    const cam = d.space!.camera;
    const w = full.clientWidth, hh = full.clientHeight;
    if (w > 860) cam.setViewOffset(w, hh, -w * 0.2, 0, w, hh);
    draw(d.space!.scene, cam, full);
    cam.clearViewOffset();
    return;
  }
  cur.frame(dt, time);
  renderer.setScissorTest(false);
  renderer.clear();
  if (cur.space && !cur.single) {
    const r = draw(cur.space.scene, cur.space.camera, paneA);
    if (r) cur.space.labels.update(cur.space.camera, r.w, r.h);
  }
  const g = ctx.ground;
  const rb = draw(g.scene, g.camera, paneB);
  if (rb) g.labels.update(g.camera, rb.w, rb.h);
  if (cur.inset && ctx.insetEl.style.display !== 'none') {
    const ins = cur.inset();
    if (ins) {
      ins.before?.();
      draw(ins.scene, ins.camera, ctx.insetEl.querySelector('.inset-view') as HTMLElement);
      ins.after?.();
    }
  }
}
loop();
(window as unknown as { __app: unknown }).__app = { ctx, mods, select };

const start = location.hash.slice(1);
if (mods.some((m) => m.id === start)) { select(start); intro.classList.add('gone'); document.body.classList.add('started'); }
