import { OrthographicCamera, PerspectiveCamera } from "three/build/three.module";
import { TE_OrbitControls } from "./Controller/TE_OrbitControls";
import { ThreeEventObject } from "../../../../../Object/Three/ThreeEventObject";

class CameraManager extends ThreeEventObject {
  constructor(eventComp, infos = CameraManager.static_Infos, domID = "") {
    super(eventComp);
    infos = Object.assign(CameraManager.static_Infos, infos);

    this.object = {
      camera: undefined,
      controller: undefined,
    }

    this.#dom = document.getElementById(domID);
    this.#initCamera(infos);
    this.#initController(infos);
  }

  #type = undefined;
  #dom = undefined;

  #initCamera = (infos) => {

    if (this.#type === infos.cameraType) return;
    // let oldCamera = this.object.camera;
    let size = this.event.screenSizeManager.screenSize;
    switch (infos.cameraType) {
      case CameraManager.type.Orthographic:
        this.object.camera = new OrthographicCamera();
        break;
      case CameraManager.type.Perspective:
        this.object.camera = new PerspectiveCamera(infos.fov, size.x / size.y, infos.near, infos.far);
        this.object.camera.position.set(375.67308713411387, 311.22531383198276, 1007.3488775935496);

        break;
      default:
        console.error("输入摄像机类型不正确");
        break;
    }
  }

  #initController = (infos) => {

    if (this.object.controller && this.object.controller.dispose) {
      this.object.controller.dispose()
    }
    switch (infos.controllerType) {
      case CameraManager.controllerType.OrbitController:
        this.object.controller = new TE_OrbitControls(this.object.camera, this.#dom, this.event.animation);
        this.object.controller.enablePan = false;
        this.object.controller.autoRotate = true;
        this.object.controller.autoRotateSpeed = 0.6;

        break;
      default:
        break;
    }
  }

  get camera() { return this.object.camera; }


  static type = {
    Perspective: 0,
    Orthographic: 1,
  }
  static controllerType = {
    OrbitController: 0,
  }
  static static_Infos = {
    cameraType: CameraManager.type.Perspective,
    fov: 15,
    near: 1,
    far: 10000,
    controllerType: CameraManager.controllerType.OrbitController,

  }

}


export { CameraManager }