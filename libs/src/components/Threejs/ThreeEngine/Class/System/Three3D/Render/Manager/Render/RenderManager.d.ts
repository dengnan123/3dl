import { Color } from "three";
import { Three3DObject } from "../../../../../Object/Three/Three3DObject";
import { EventSystem } from "../../../Event/EventSystem";
import { Three3D } from "../../Three3D";

interface RENDERMANAGER_INFOS {
  render: {
    antialias: Boolean,
    alpha: Boolean,
  },
  renderFunc: {
    clearColor: {
      color: Color,
      alpha: Boolean,
    }
  },
  effects: {
    renderPass: {
      isNeed: Boolean,
    },

    SMAA: {
      isNeed: Boolean,
    }
  }

}
class RenderManager extends Three3DObject {
  constructor(eventComp: EventSystem, three3D: Three3D, infos: RENDERMANAGER_INFOS, domID: String);
  static static_Infos: RENDERMANAGER_INFOS;

}

export { RenderManager, RENDERMANAGER_INFOS }