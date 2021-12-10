import { BaseNode } from "../ObjectNode/BaseNode";
import { DropListType } from "../ObjectNode/Value/OtherType/DropListType";
import { FunctionType } from "../ObjectNode/Value/OtherType/FunctionType";
import { BooleanType } from "../ObjectNode/Value/ValueType/BooleanType";
import { NumberType } from "../ObjectNode/Value/ValueType/NumberType";
import { StringType } from "../ObjectNode/Value/ValueType/StringType";
import { VectorType } from "../ObjectNode/Value/Vector/VectorType";

class FolderNode extends BaseNode {
  constructor(data = FolderNode.createFolder()) {
    super(data);
    if (data.isRoot) {
      this.#isRoot = true;
    }
    else {
      this.isOpen = data.isOpen;
    }
  }

  #isRoot;
  #sons = [];
  isOpen;




  #addToSon = function (item) {
    item.index = this.#sons.length;
    this.#sons.push(item);
  }
  addValue(data) {
    if (data.key === undefined) {
      console.error("Value Key === undefined");
      return;
    }
    if (data.uniform === undefined || data.uniform.value === undefined) {
      console.error("Uniform or value === undefined");
      return;
    }
    if (data.isNumber) {
      const node = new NumberType(data);
      this.#addToSon(node);
      return;
    }
    if (data.isBoolean) {
      const node = new BooleanType(data);
      this.#addToSon(node);
      return;
    }
    if (data.isString) {
      const node = new StringType(data);
      this.#addToSon(node);
      return;
    }
    if (data.isFunction) {
      const node = new FunctionType(data);
      this.#addToSon(node);
      return;
    }
    if (data.isDropList) {
      const node = new DropListType(data);
      this.#addToSon(node);
      return;
    }
    if (data.isVector) {
      const node = new VectorType(data);
      this.#addToSon(node);
      return;
    }
  }
  addFolder() {

  }
  drawGUI(folder, style) {
    style = this.style || style;
    if (!this.#isRoot) {
      folder = folder.addFolder(this.name);
      folderStyle(folder, style);
      if (this.isOpen) {
        folder.open();
      }
      else {
        folder.close();
      }
      if (this.isHide) {
        folder.hide();
      }
    }

    const sons = this.#sons;
    var res = Object.keys(sons).sort(function (a, b) {
      var oa = sons[a].order;
      var ob = sons[b].order;
      if (oa !== ob) {
        return oa - ob;
      }
      return sons[a].index - sons[b].index;
    });
    res.forEach(element => {
      var son = sons[element];
      son.drawGUI(folder, style);
    })

    function folderStyle(item, style) {

      if (!style || JSON.stringify(style) === '{}') return;
      const title = item.domElement.querySelector(`ul > li[class = "title"]`);
      if (style.fontColor) {
        item.__ul.style.color = style.fontColor;
        item.__ul.style.borderLeftColor = style.fontColor;
      }
      if (style.backColor) {
        title.style.backgroundColor = style.backColor;
      }
    }
  }


  //#region 
  static createData() {
    const oldData = BaseNode.createData();
    const data = {
      isFolder: true,
      isOpen: false,
      isRoot: false,
    }
    return Object.assign(oldData, data);
  }
  createData() {
    return FolderNode.createFolder();
  }
  static createNumber() {
    return NumberType.createData();
  }
  createNumber() {
    return NumberType.createData();
  }

  static createBoolean() {
    return BooleanType.createData();
  }
  createBoolean() {
    return BooleanType.createData();
  }

  static createString() {
    return StringType.createData();
  }
  createString() {
    return StringType.createData();
  }

  static createFunction() {
    return FunctionType.createData();
  }
  createFunction() {
    return FunctionType.createData();
  }

  static createDropList() {
    return DropListType.createData();
  }
  createDropList() {
    return DropListType.createData();
  }
  static createVector(number) {
    return VectorType.createData(number);
  }
  createVector(number) {
    return VectorType.createData(number);
  }

  //#endregion
  #states = {
    key: undefined,
    order: undefined,
    index: 0,
    isNotDrawFolder: false,
    style: undefined,
  }
}

export { FolderNode }