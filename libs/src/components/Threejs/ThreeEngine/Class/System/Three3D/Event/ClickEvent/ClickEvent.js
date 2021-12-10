import { ThreeObject } from "../../../../Object/ThreeObject";

class ClickEvent extends ThreeObject {
  // constructor() {
  //   super();

  // }

  dispose() {
    console.log("清除ClickEvent");
    super.dispose();
  }
}

export { ClickEvent }