import * as THREE from 'three';
import { GroundView } from './ground';
import { Labels } from './labels';

export type SpaceView = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  labels: Labels;
};

export type Ctx = {
  renderer: THREE.WebGLRenderer;
  paneA: HTMLElement;
  paneB: HTMLElement;
  ground: GroundView;
  controls: HTMLElement;
  card: HTMLElement;
  readout: HTMLElement;
  insetEl: HTMLElement;
  toolsA: HTMLElement;
  toolsB: HTMLElement;
};

export interface Mod {
  toolsA?: HTMLElement;
  toolsB?: HTMLElement;
  id: string;
  name: string;
  short: string;
  titleA: string;
  titleB: string;
  single?: boolean;
  space?: SpaceView;
  /** custom inset render: returns [scene, camera] */
  inset?: () => { scene: THREE.Scene; camera: THREE.PerspectiveCamera; before?: () => void; after?: () => void } | null;
  init(ctx: Ctx): void;
  enter(): void;
  exit(): void;
  frame(dt: number, time: number): void;
}

/** star skybox that follows the camera (stars at infinity) */
export function followCamera(obj: THREE.Object3D, cam: THREE.Camera) {
  obj.position.copy(cam.position);
}
