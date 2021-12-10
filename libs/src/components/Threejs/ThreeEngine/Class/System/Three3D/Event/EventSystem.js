import { ThreeObject } from "../../../Object/ThreeObject";
import { Animation } from "./Animate/Animation";
import { ClickEvent } from "./ClickEvent/ClickEvent";
import { GUIManager } from "./GUI/GUIManager";
import { GUIStats } from "./GUI/Stats/GUIStats";
import { ScreenSizeManager } from "./ScreenSizeManager/ScreenSizeManager";

class EventSystem extends ThreeObject {
  constructor(infos = EventSystem.static_Infos, domID = "") {
    super();
    // this.object.gui = new GUIManager(this, gui);
    this.object = {
      animation: new Animation(),
      clickEvent: new ClickEvent(),
      screenSize: new ScreenSizeManager(infos.screenSize),
      gui: new GUIManager(infos.gui, domID),
      stats: undefined,
    }
    this.object.stats = new GUIStats(this, infos.stats, domID);
  }
  static static_Infos = {
    gui: GUIManager.static_Infos,
    screenSize: ScreenSizeManager.static_Infos,
    stats: GUIStats.static_Infos,
  }

  get gui() { return this.object.gui; }
  get animation() { return this.object.animation; }
  get clickEvent() { return this.object.clickEvent; }
  get screenSizeManager() { return this.object.screenSize; }
  get stats() { return this.object.stats };

}

export { EventSystem }