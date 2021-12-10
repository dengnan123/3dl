import { BaseValueNode, BASEVALUENODE_DATA } from "../BaseValueNode";

interface Function_DATA extends BASEVALUENODE_DATA {
  isFunction: Function,
}
class FunctionType extends BaseValueNode {


  createData(): Function_DATA;
  static createData(): Function_DATA;
}


export { FunctionType, Function_DATA }