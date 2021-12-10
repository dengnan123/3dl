import { InitComponentSystem } from "./SystemManager";
import { AnimateManager } from "./AnimateManager";
import { ClickEvent } from "./ClickEvent";
import { ScreenSizeManager } from "./ScreenSizeManager";
import Three3D from "./Three3D";

interface result {
  eventComponent: {
    animate: AnimateManager;
    ClickEvent: ClickEvent;
    screebSize: ScreenSizeManager;
  };
  three3D: Three3D;
}

export function InitComponentSystem(infos: Object): result;
