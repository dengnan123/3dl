import { ThreeObject } from "../Object/ThreeObject"
import { EventSystem, EVENTSYSTEM_INFOS } from "./Three3D/Event/EventSystem"
import { Three3D, THREE3D_INFOS } from "./Three3D/Render/Three3D"

interface THREESYSTEM_INFOS {
  eventSystem: EVENTSYSTEM_INFOS,
  three3D: THREE3D_INFOS,
  domID: String,
}

class ThreeSystem extends ThreeObject {
  constructor(infos: THREESYSTEM_INFOS);
  eventSystem: EventSystem;
  three3D: Three3D;
  static static_Infos: THREESYSTEM_INFOS;
}

export { ThreeSystem }