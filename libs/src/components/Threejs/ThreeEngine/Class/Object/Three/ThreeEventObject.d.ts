import { ThreeObject } from "../ThreeObject";
import { EventSystem } from "../../System/Three3D/Event/EventSystem";
export class ThreeEventObject extends ThreeObject {
  constructor(eventComp: EventSystem);
  readonly event: EventSystem;
}