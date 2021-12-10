import { Vector2 } from "three";
import { ThreeObject } from "../../../../Object/ThreeObject";
class BaseAnimation {
  animate(deltatime: Number, time: Number): boolean
}
class StackAnimation extends BaseAnimation {

  animate(deltatime, time): Boolean;
}
class QueueAnimation extends BaseAnimation {
  order: Number;
  animate(deltatime, time): Boolean;
}
class ValueAnimation {
  value: Number;
  speed: Number;
  animate(deltatime, time): Boolean;
}

class Animation extends ThreeObject {
  renderAnimation: BaseAnimation;

  timeSpeed: Number;
  needsUpdate: Boolean;

  pause: Boolean;
  forceRender: Boolean;

  addStackAnimation(key: string, value: StackAnimation): Boolean;
  addQueueAnimation(key: string, value: QueueAnimation): Boolean;
  addValueAnimation(key: string, value: ValueAnimation): Boolean;

  createBaseAnimation(): BaseAnimation;
  createStackAnimation(): StackAnimation;
  createQueueAnimation(): QueueAnimation;
  createValueAnimation(): ValueAnimation;

  removeStackAnimation(key: string): Boolean;
  removeQueueAnimation(key: string): Boolean;
  removeValueAnimation(key: string): Boolean;
}


export { Animation }