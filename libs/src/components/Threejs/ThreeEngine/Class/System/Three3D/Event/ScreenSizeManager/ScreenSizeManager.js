import { Vector2 } from "three";
import { ThreeObject } from "../../../../Object/ThreeObject";

class ScreenSizeManager extends ThreeObject {
  constructor(infos = ScreenSizeManager.static_Infos) {
    super();
    infos = Object.assign(ScreenSizeManager.static_Infos, infos);
    this.#screenSize.set(infos.x, infos.y);

  }
  static static_Infos = {
    x: 1920,
    y: 1080
  }

  #screenSize = new Vector2(1920, 1080);
  #dic = {};


  add(key, value) {
    if (!value.setSize) return false;
    if (this.#dic[key]) return false;
    this.#dic[key] = value;
    return true;
  }
  remove(key) {
    if (this.#dic[key]) {
      delete this.#dic[key];
      return true;
    }
    return false;
  }
  set(x, y) {
    if (this.#screenSize.x === x && this.#screenSize.y === y) return;
    this.#screenSize.set(x, y);
    for (var key in this.#dic) {
      this.#dic[key].setSize(x, y);
    }
  }

  get screenSize() { return { x: this.#screenSize.x, y: this.#screenSize.y }; }

}


export { ScreenSizeManager }