import { ThreeObject } from "../Object/ThreeObject";
import { EventSystem } from "./Three3D/Event/EventSystem";
import { Three3D } from "./Three3D/Render/Three3D";

export class ThreeSystem extends ThreeObject {
  constructor(infos = ThreeSystem.static_Infos) {
    super();
    infos = Object.assign(Three3D.static_Infos, infos);
    this.object = {
      'eventSystem': new EventSystem(infos.eventSystem, infos.domID),
      'three3D': undefined,
    }
    this.object.three3D = new Three3D(this.object.eventSystem, {
    }, infos.domID);


    this.object.eventSystem.gui.draw(true);

  }

  static static_Infos = {
    'eventSystem': EventSystem.static_Infos,
    'three3D': Three3D.static_Infos,
    'domID': "ThreeEngine",
  }


  get eventSystem() {
    return this.object.eventSystem;
  }
  get three3D() { return this.object.three3D; }

}