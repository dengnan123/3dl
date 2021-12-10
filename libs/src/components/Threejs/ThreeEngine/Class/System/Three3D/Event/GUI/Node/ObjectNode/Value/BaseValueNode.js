import { BaseNode } from "../BaseNode";

class BaseValueNode extends BaseNode {
  constructor(data) {
    super(data);
    this.uniforms.val = data.uniform;
    this.parameter.val = 0;
    this.onValueChange = data.onChange || ((val) => { });
    this.onValueFinish = data.onFinish || ((val) => { });
  }
  onValueChange;
  onValueFinish;
  UtoP() { }

  PtoU() { console.log('ptou') }
  parameter = {
    val: undefined,
  };
  uniforms = {
    val: undefined,
  };


  guiItem;
  static createData() {
    const oldData = BaseNode.createData();
    const data = {
      uniform: undefined,
      onChange: undefined,
      onFinish: undefined
    }
    return Object.assign(oldData, data);
  }
}

export { BaseValueNode }