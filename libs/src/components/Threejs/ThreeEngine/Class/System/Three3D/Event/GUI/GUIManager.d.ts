import { ThreeObject } from "../../../../Object/ThreeObject";
import { EventSystem } from "../EventSystem";
interface GUIManage_INFOS {
  domID: String,
  container: any,
  alwaysHideGUI: Boolean,
}
class GUIManager extends ThreeObject {
  constructor(eventComp: EventSystem, infos: GUIManage_INFOS);
  static static_Infos: GUIManage_INFOS

  clearGUI(): void;
  draw(isDrawSystem: Boolean): void;
}
export { GUIManage_INFOS, GUIManager }