import { BaseValueNode, BASEVALUENODE_DATA } from "../BaseValueNode";

interface NUMBER_DATA extends BASEVALUENODE_DATA {
  isNumber: Boolean,
  isSlider: Boolean,
  isBoolean: Boolean,
  max: Number,
  min: Number,
  delta: Number,
}
class NumberType extends BaseValueNode {


  createData(): NUMBER_DATA;
  static createData(): NUMBER_DATA;
}


export { NumberType, NUMBER_DATA }