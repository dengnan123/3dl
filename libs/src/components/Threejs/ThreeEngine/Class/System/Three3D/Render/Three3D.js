import { ThreeEventObject } from '../../../Object/Three/ThreeEventObject'
import { CameraManager } from './Manager/Camera/CameraManager';
import { LightManager } from './Manager/LightManager/LightManager';
import { RenderManager } from './Manager/Render/RenderManager';
import { SceneManager } from './Manager/Scene/SceneManager';
class Three3D extends ThreeEventObject {
  constructor(eventComp, infos = Three3D.static_Infos, domID = "") {
    super(eventComp);

    infos = Object.assign(Three3D.static_Infos, infos);
    this.object = {
      camera: undefined,
      scene: undefined,
      render: undefined,
      light: undefined,
    }

    this.object.camera = new CameraManager(eventComp, infos.camera, domID);
    this.object.scene = new SceneManager(eventComp, infos.scene);
    this.object.render = new RenderManager(eventComp, this, infos.render, domID);
    this.object.light = new LightManager(eventComp, this, infos.light);
  }

  get cameraManager() { return this.object.camera };
  get sceneManager() { return this.object.scene };
  get renderManager() { return this.object.render };
  get lightManager() { return this.object.light };
  static static_Infos = {
    camera: CameraManager.static_Infos,
    render: RenderManager.static_Infos,
    light: LightManager.static_Infos,
    scene: SceneManager.static_Infos,
  }
}


export { Three3D };