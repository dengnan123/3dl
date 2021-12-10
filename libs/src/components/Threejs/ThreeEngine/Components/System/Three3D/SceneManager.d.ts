import { SceneManager } from "./SceneManager";
import { Scene, Group } from "three";

export class SceneManager extends Object {
  constructor();

  scene: Scene;
  group: { city: Group };
}
