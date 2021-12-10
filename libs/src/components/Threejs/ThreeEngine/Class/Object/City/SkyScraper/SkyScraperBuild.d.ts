import { Object3D } from "three";
import { Matrix4 } from "three/build/three.module";
import { ThreeGroup } from "../../Three/ThreeGroup";

class SkyScraperBuild extends ThreeGroup {
  constructor(Object: Object3D);
  constructor();

  load(object: Object3D): void;
  add(matrixWorld: Matrix4, height: Number);
  update(): void;

}