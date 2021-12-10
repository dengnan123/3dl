import { BaseValueNode, BASEVALUENODE_DATA } from "../BaseValueNode";

interface Boolean_DATA extends BASEVALUENODE_DATA {
  isBoolean: Boolean,
}
class BooleanType extends BaseValueNode {


  createData(): Boolean_DATA;
  static createData(): Boolean_DATA;
}


export { BooleanType, Boolean_DATA }