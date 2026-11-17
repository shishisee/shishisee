import * as THREE from 'three';

type Item = {
  el: HTMLElement;
  pos: () => THREE.Vector3 | null;
  visible: () => boolean;
};

/** HTML labels projected from 3D positions into a pane */
export class Labels {
  root: HTMLDivElement;
  items: Item[] = [];
  private v = new THREE.Vector3();
  constructor(parent: HTMLElement) {
    this.root = document.createElement('div');
    this.root.className = 'labels';
    parent.appendChild(this.root);
  }
  add(html: string, cls: string, pos: () => THREE.Vector3 | null, visible: () => boolean = () => true) {
    const el = document.createElement('div');
    el.className = 'lbl ' + cls;
    el.innerHTML = html;
    this.root.appendChild(el);
    const it = { el, pos, visible };
    this.items.push(it);
    return el;
  }
  show(on: boolean) {
    this.root.style.display = on ? '' : 'none';
  }
  update(camera: THREE.Camera, w: number, h: number) {
    for (const it of this.items) {
      const p = it.visible() ? it.pos() : null;
      if (!p) { it.el.style.display = 'none'; continue; }
      this.v.copy(p).project(camera);
      if (this.v.z > 1 || this.v.z < -1 || Math.abs(this.v.x) > 1.2 || Math.abs(this.v.y) > 1.2) {
        it.el.style.display = 'none';
        continue;
      }
      it.el.style.display = '';
      const x = (this.v.x * 0.5 + 0.5) * w;
      const y = (-this.v.y * 0.5 + 0.5) * h;
      it.el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
    }
  }
}
