import { OrthographicCamera, PerspectiveCamera } from "three/build/three.module";
import { ThreeEventObject } from "../../../../../Object/Three/ThreeEventObject";
import { EventSystem } from "../../../Event/EventSystem";


interface CAMERAMANAGER_INFOS {
  type: Number,
  fov: Number,

}

export class CameraManager extends ThreeEventObject {
  constructor(eventComp: EventSystem, infos: CAMERAMANAGER_INFOS, domID: String);
  static static_Infos: CAMERAMANAGER_INFOS;
  static type: {
    Perspective: Number,
    Orthographic: Number,
  }
  camera: PerspectiveCamera | OrthographicCamera;

}