import * as THREE from 'three';
import { Earth } from './bodies';

/** observer pin on Earth: horizon disc + person + view arrow (child of earth.spin) */
export class Observer {
  group = new THREE.Group();
  arrow: THREE.ArrowHelper;
  basis: { east: THREE.Vector3; north: THREE.Vector3; up: THREE.Vector3 };
  constructor(private earth: Earth, public lat: number, public lon: number, scale = 1) {
    this.basis = earth.basis(lat, lon);
    const r = earth.radius;
    const disc = new THREE.Mesh(
      new THREE.CircleGeometry(r * 0.32 * scale, 48),
      new THREE.MeshBasicMaterial({ color: 0x5cffb0, transparent: true, opacity: 0.28, side: THREE.DoubleSide, depthWrite: false }),
    );
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(r * 0.31 * scale, r * 0.335 * scale, 64),
      new THREE.MeshBasicMaterial({ color: 0x5cffb0, transparent: true, opacity: 0.9, side: THREE.DoubleSide, depthWrite: false }),
    );
    const pin = new THREE.Mesh(
      new THREE.CylinderGeometry(r * 0.012 * scale, r * 0.012 * scale, r * 0.14 * scale, 8),
      new THREE.MeshBasicMaterial({ color: 0xffffff }),
    );
    pin.position.y = r * 0.07 * scale;
    const head = new THREE.Mesh(new THREE.SphereGeometry(r * 0.03 * scale, 12, 8), new THREE.MeshBasicMaterial({ color: 0xffe08a }));
    head.position.y = r * 0.15 * scale;
    const inner = new THREE.Group();
    disc.rotation.x = -Math.PI / 2;
    ring.rotation.x = -Math.PI / 2;
    inner.add(disc, ring, pin, head);
    // N marker on disc
    const nTick = new THREE.Mesh(
      new THREE.ConeGeometry(r * 0.03 * scale, r * 0.08 * scale, 8),
      new THREE.MeshBasicMaterial({ color: 0xff6b6b }),
    );
    nTick.rotation.x = -Math.PI / 2;
    nTick.position.set(0, 0.002, -r * 0.37 * scale);
    inner.add(nTick);
    this.arrow = new THREE.ArrowHelper(new THREE.Vector3(0, 0, -1), new THREE.Vector3(0, r * 0.15 * scale, 0), r * 0.75 * scale, 0xffe08a, r * 0.12 * scale, r * 0.07 * scale);
    inner.add(this.arrow);
    // orient: local X=east, Y=up, Z=-north (same as ground frame)
    const m = new THREE.Matrix4().makeBasis(this.basis.east, this.basis.up, this.basis.north.clone().negate());
    inner.quaternion.setFromRotationMatrix(m);
    inner.position.copy(earth.surface(lat, lon, r * 1.004));
    this.group.add(inner);
    earth.spin.add(this.group);
  }
  /** direction in ground frame (X=E, Y=U, Z=-N) */
  setView(dir: THREE.Vector3) {
    this.arrow.setDirection(dir.clone().normalize());
  }
  worldPos(out = new THREE.Vector3()) {
    return this.group.children[0].getWorldPosition(out);
  }
}
