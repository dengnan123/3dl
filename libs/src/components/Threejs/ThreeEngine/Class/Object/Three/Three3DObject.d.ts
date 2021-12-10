import { EventSystem } from "../../System/Three3D/Event/EventSystem";
import { Three3D } from "../../System/Three3D/Render/Three3D";
import { ThreeEventObject } from "./ThreeEventObject";

export class Three3DObject extends ThreeEventObject {
  constructor(eventComp: EventSystem, three3D: Three3D)
  three3D: Three3D;
}