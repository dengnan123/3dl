import { Vector3 } from "three";
import { TubeInstance } from "../TubeInstance";

class TwoPointLineVertical extends TubeInstance {
  constructor(data = TubeInstance.static_Infos) {
    super(data);


  }
  uniforms = {
    _Size: { value: new Vector3() },

  }
  static createData() {
    const data = {

    };
    const oldData = TubeInstance.static_Infos;
    return Object.assign(oldData, data);
  }
}

export { TwoPointLineVertical }