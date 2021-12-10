import { ThreeObject } from "../../../Object/ThreeObject";
import { Animation } from "./Animate/Animation";
import { ClickEvent } from "./ClickEvent/ClickEvent";
import { GUIManager } from "./GUI/GUIManager";
import { GUIManage_INFOS } from "./GUI/GUIManager";
import { GUIStats, GUISTATS_INFOS } from "./GUI/Stats/GUIStats";
import { ScreenSizeManager, SCREENSIZE_INFOS } from "./ScreenSizeManager/ScreenSizeManager";

interface EVENTSYSTEM_INFOS {
  gui: GUIManage_INFOS,
  screenSize: SCREENSIZE_INFOS,
  stats: GUISTATS_INFOS,
}
class EventSystem extends ThreeObject {
  constructor(infos: EVENTSYSTEM_INFOS, domID: String);
  /**aaaa */
  animation: Animation;
  clickEvent: ClickEvent;
  stats: GUIStats;
  screenSizeManager: ScreenSizeManager;
  gui: GUIManager;
  static static_Infos: EVENTSYSTEM_INFOS;
}
export { EventSystem, EVENTSYSTEM_INFOS }