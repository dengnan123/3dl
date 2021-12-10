import { ThreeObject } from "../ThreeObject"
class ThreeEventObject extends ThreeObject {
  constructor(eventComp) {
    super();
    this.#eventComp = eventComp;
  }
  #eventComp;
  get event() { return this.#eventComp };
}
export { ThreeEventObject }