import { BaseValueNode, BASEVALUENODE_DATA } from "../BaseValueNode";

interface Color_DATA extends BASEVALUENODE_DATA {
  isColor: Boolean,
}
class ColorType extends BaseValueNode {


  createData(): Color_DATA;
  static createData(): Color_DATA;
}


export { ColorType, Color_DATA }