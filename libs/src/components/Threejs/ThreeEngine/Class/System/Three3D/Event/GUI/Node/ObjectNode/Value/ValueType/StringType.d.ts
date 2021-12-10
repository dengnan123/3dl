import { BaseValueNode, BASEVALUENODE_DATA } from "../BaseValueNode";

interface String_DATA extends BASEVALUENODE_DATA {
  isString: String,
}
class StringType extends BaseValueNode {


  createData(): String_DATA;
  static createData(): String_DATA;
}


export { StringType, String_DATA }