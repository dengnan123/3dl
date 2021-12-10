import { EventSystem } from "../../EventSystem";

interface GUISTATS_INFOS {
  size: {
    x: Number,
    y: Number,
  },
  show: Boolean,
}
class GUIStats {
  constructor(eventComp: EventSystem, infos: GUISTATS_INFOS, domID: String);
  static static_Infos: GUISTATS_INFOS;
}


export { GUISTATS_INFOS, GUIStats }