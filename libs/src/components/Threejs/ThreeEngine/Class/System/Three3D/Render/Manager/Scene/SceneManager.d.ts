import { Color, Group, Scene } from "three";
import { ThreeEventObject } from "../../../../../Object/Three/ThreeEventObject";
import { EventSystem } from "../../../Event/EventSystem";


interface SCENEMANAGER_INFOS {
  grid: {
    isShowGrid: Boolean,
    size: Number,
    segment: Number,
    color1: Color,
    color2: Color,
  },
  fog: {
    isShow: Boolean,
    color: Color,
    far: Number,
    near: Number,
  },
  mirror: {
    isShow: Boolean,
    width: Number,
    color: Color,
    bias: Number,
  }
}

interface FOG_UNIFORMS {
  readonly color: Color,
  readonly far: Number,
  readonly near: Number,
}
class SceneManager extends ThreeEventObject {

  constructor(eventComp: EventSystem, infos: SCENEMANAGER_INFOS)

  readonly scene: Scene;

  readonly lightGroup: Group;
  readonly outlineGroup: Group;
  readonly noOutlineGroup: Group;

  /**静态组 每帧不更新Matrix */
  readonly staticGroup: Group;
  /**动态组 每帧更新Matrix*/
  readonly dynamicGroup: Group;

  /**静态组 每帧不更新Matrix 可Outline */
  readonly staticOutlineGroup: Group;
  /**动态组 每帧更新Matrix 可Outline*/
  readonly dynamicOutlineGroup: Group;


  static static_Infos: SCENEMANAGER_INFOS;

}


export { SceneManager, SCENEMANAGER_INFOS }