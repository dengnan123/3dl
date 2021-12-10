import Stats from "three/examples/jsm/libs/stats.module";
import { ThreeEventObject } from "../../../../../Object/Three/ThreeEventObject";

class GUIStats extends ThreeEventObject {
  constructor(eventComp, infos = GUIStats.static_Infos, domID = "") {
    super(eventComp);
    const assInfos = Object.assign(GUIStats.static_Infos, infos);
    this.#domID = domID + "_Stats";
    this.#container = document.getElementById(domID);
    this.hide();
    this.#stats = new Stats();
    this.#stats.dom.id = this.#domID;
    this.#stats.dom.style.position = "absolute";
    this.#stats.dom.style.top = "";
    this.#stats.dom.style.left = "";
    this.setSize(assInfos.size);
    this.object.stats = this.#stats;
    if (infos.show) {
      this.show();
    }
    else {
      this.hide();
    }
    const animateFunc = this.event.animation.createQueueAnimation();
    animateFunc.animate = (dt, t) => {
      if (this.#isAlreadyShow) {
        this.#stats.update();
      }
    }
    animateFunc.order = 99999;
    this.event.animation.addQueueAnimation(this.#domID, animateFunc);

  }
  static static_Infos = {
    size: { x: 80 * 2, y: 48 * 2 },
    show: true,
  }
  #stats;
  #size;
  #domID;
  #isAlreadyShow = false;
  #container;
  show() {
    if (this.#isAlreadyShow) return;
    this.#isAlreadyShow = true;
    this.#container.appendChild(this.#stats.dom);
  }
  hide() {
    const std = document.getElementById(this.#domID);
    if (std) {
      std.remove();
    }
    this.#isAlreadyShow = false;
  }
  setSize(size) {
    if (size) {
      this.#size = size;
    }
    const canvass = this.#stats.dom.querySelectorAll('canvas');
    canvass.forEach(element => {
      element.style.width = `${this.#size.x}px`;
      element.style.height = `${this.#size.y}px`;
    });

  }
}

export { GUIStats }