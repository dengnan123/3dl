import { BaseValueNode, BASEVALUENODE_DATA } from "../BaseValueNode";
import { NUMBER_DATA } from "../ValueType/NumberType";
interface Vector_DATA extends BASEVALUENODE_DATA {
  isVector: Boolean,
  number: Number,
  needHead: Boolean,
  headName: String,
  infos: {
    x: NUMBER_DATA,
    y: NUMBER_DATA,
    z: NUMBER_DATA,
    w: NUMBER_DATA
  }
}
class VectorType extends BaseValueNode {


  static createData(number): Vector_DATA;
}


export { VectorType, Vector_DATA }