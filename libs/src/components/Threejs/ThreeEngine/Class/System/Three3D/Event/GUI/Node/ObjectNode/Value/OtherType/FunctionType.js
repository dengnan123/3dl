import { BaseValueNode } from "../BaseValueNode";

class FunctionType extends BaseValueNode {
  constructor(data = FunctionType.createData()) {
    super(data);
  }


  #isFunction;

  UtoP() {
  }
  PtoU() {
  }


  drawGUI(folder, style) {
    style = this.style || style || {};
    console.log(this.uniforms);
    this.guiItem = folder.add(this.uniforms, 'val').name(this.name);
    FuncStyle(this.guiItem, style);


    function FuncStyle(item, style) {
      if (JSON.stringify(style) === '{}') return;

      if (style.fontColor) {
        item.__li.style.color = style.fontColor;
        item.__li.style.borderLeftColor = style.fontColor;
      }
      if (style.backColor) {
        item.__li.style.backgroundColor = style.backColor;
      }
    }
  }
  static createData() {
    const oldData = BaseValueNode.createData();
    const data = {
      isFunction: true,
    }
    return Object.assign(oldData, data);
  }

}

export { FunctionType }