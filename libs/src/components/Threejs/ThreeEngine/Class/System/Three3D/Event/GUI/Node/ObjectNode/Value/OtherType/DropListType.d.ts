import { BaseValueNode, BASEVALUENODE_DATA } from "../BaseValueNode";

interface DropList_DATA extends BASEVALUENODE_DATA {
  isDropList: Boolean,
  list: Object,
}
class DropListType extends BaseValueNode {


  createData(): DropList_DATA;
  static createData(): DropList_DATA;
}


export { DropListType, DropList_DATA }