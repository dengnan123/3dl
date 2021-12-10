import { BaseNode, BASENODE_DATA } from "../ObjectNode/BaseNode";
import { NUMBER_DATA } from "../ObjectNode/Value/ValueType/NumberType";
import { Boolean_DATA } from "../ObjectNode/Value/ValueType/BooleanType";
import { String_DATA } from "../ObjectNode/Value/ValueType/StringType";
import { Function_DATA } from "../ObjectNode/Value/OtherType/FunctionType";
import { DropList_DATA } from "../ObjectNode/Value/OtherType/DropListType";
import { Vector_DATA } from "../ObjectNode/Value/Vector/VectorType";
interface FOLDER_DATA extends BASENODE_DATA {
  isOpen: Boolean,
  isRoot: Boolean,
  isFolder: Boolean,
}
class FolderNode extends BaseNode {
  constructor(data: FOLDER_DATA)
  addValue(): void;
  addFolder(data: FOLDER_DATA): FolderNode;
  drawGUI(folder: any);
  createData(): FOLDER_DATA;
  static createData(): FOLDER_DATA;
  createNumber(): NUMBER_DATA;
  static createNumber(): NUMBER_DATA;
  createBoolean(): Boolean_DATA;
  static createBoolean(): Boolean_DATA;
  createString(): String_DATA;
  static createString(): String_DATA;
  createFunction(): Function_DATA;
  static createFunction(): Function_DATA;
  createDropList(): DropList_DATA;
  static createDropList(): DropList_DATA;
  createVector(number: Number): Vector_DATA;
  static createVector(number: Number): Vector_DATA;
}

export { FolderNode, FOLDER_DATA }