import { ThreeObject } from "../../../../Object/ThreeObject";

interface SCREENSIZE_INFOS {
  x: Number,
  y: Number,
}

export class ScreenSizeManager extends ThreeObject {
  constructor(infos: SCREENSIZE_INFOS);
  static static_Infos: SCREENSIZE_INFOS;
  add(key: string, value: Object): Boolean;
  remove(key: string): Boolean;
  set(x: Number, y: Number): void;
  screenSize: {
    x: Number,
    y: Number
  }
}