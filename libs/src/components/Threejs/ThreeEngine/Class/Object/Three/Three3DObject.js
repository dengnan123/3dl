import { ThreeEventObject } from "./ThreeEventObject";

class Three3DObject extends ThreeEventObject {
  constructor(eventComp, three3D) {
    super(eventComp);
    this.#three3D = three3D;
  }
  #three3D;

  get three3D() { return this.#three3D; }

}

export { Three3DObject }