import { BaseValueNode } from "../BaseValueNode";

class ColorType extends BaseValueNode {
  constructor(data = ColorType.createData()) {
    super(data);




    this.UtoP();

  }

  UtoP() {
    this.parameter.val = this.uniforms.val.value;
  }
  PtoU() {
    this.uniforms.val.value = this.parameter.val;
  }


  drawGUI(folder, style) {
    style = this.style || style || {};
    // const scope = this;

    // function onChange() {
    //   scope.PtoU();
    //   scope.onValueChange(scope.uniforms.val.value);
    // }
    // function onFinish() {
    //   scope.PtoU();
    //   scope.onValueFinish(scope.uniforms.val.value);
    // }


  }

  static createData() {
    const oldData = BaseValueNode.createData();
    const data = {
      isColor: true,
    }
    return Object.assign(oldData, data);
  }

}

export { ColorType }