import { ThreeEventObject } from "../../../Object/Three/ThreeEventObject";
import { EventSystem } from "../Event/EventSystem";
import { CameraManager, CAMERAMANAGER_INFOS } from "./Manager/Camera/CameraManager";
import { LightManager, LIGHTMANAGER_INFOS } from "./Manager/LightManager/LightManager";
import { RenderManager, RENDERMANAGER_INFOS } from "./Manager/Render/RenderManager";
import { SceneManager, SCENEMANAGER_INFOS } from "./Manager/Scene/SceneManager";

interface THREE3D_INFOS {
  camera: CAMERAMANAGER_INFOS,
  renderer: RENDERMANAGER_INFOS,
  light: LIGHTMANAGER_INFOS,
  scene: SCENEMANAGER_INFOS,
}
export class Three3D extends ThreeEventObject {
  constructor(eventComp: EventSystem, infos: THREE3D_INFOS);
  static static_Infos: THREE3D_INFOS;

  cameraManager: CameraManager;
  sceneManager: SceneManager;
  renderManager: RenderManager;
  lightManager: LightManager;

}