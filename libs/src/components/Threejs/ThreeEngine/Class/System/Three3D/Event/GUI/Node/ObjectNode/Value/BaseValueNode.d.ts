import { BaseNode, BASENODE_DATA } from "../BaseNode";
interface BASEVALUENODE_DATA extends BASENODE_DATA {
  uniform: {
    value: any
  },
  onChange(val: any): void,
  onFinish(val: any): void,
}
class BaseValueNode extends BaseNode {
  UtoP(): void;
  PtoU(): void;
  parameter: Object;
  uniforms: Object;
  guiItem: Object;


  static createData(): BASEVALUENODE_DATA;
}

export { BaseValueNode, BASEVALUENODE_DATA }