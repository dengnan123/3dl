import { Group } from "three";
import { Three3DTool } from "../../../Tool/Three3DTool";
import { ThreeObject } from "../ThreeObject";
class ThreeGroup extends ThreeObject {
  // constructor() {
  //   super();


  // }
  #group = new Group();
  get group() { return this.#group; }

  dispose() {
    Three3DTool.clearObject3D(this.#group);
    super.dispose();
  }
}


export { ThreeGroup }