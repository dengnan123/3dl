import { BaseValueNode } from "../BaseValueNode";

class DropListType extends BaseValueNode {
  constructor(data = DropListType.createData()) {
    super(data);

    this.#list = data.list;


    this.UtoP();

  }

  #list;
  UtoP() {
    this.parameter.val = this.uniforms.val.value;
  }
  PtoU() {
    this.uniforms.val.value = this.parameter.val;
  }


  drawGUI(folder, style) {
    style = this.style || style || {};
    const scope = this;
    this.guiItem = folder.add(this.parameter, 'val', this.#list).name(this.name).onChange(onChange).onFinishChange(onFinish);
    dropperStyle(this.guiItem, style);

    function onChange() {
      scope.PtoU();
      scope.onValueChange(scope.uniforms.val.value);
    }
    function onFinish() {
      scope.PtoU();
      scope.onValueFinish(scope.uniforms.val.value);
    }

    function dropperStyle(item, style) {
      if (JSON.stringify(style) === '{}') return;

      const selectStyle = item.domElement.querySelector('select').style;


      if (style.fontColor) {
        item.__li.style.color = style.fontColor;
        item.__li.style.borderLeftColor = style.fontColor;
        selectStyle.color = style.fontColor;
      }
      if (style.optionColor) {
        selectStyle.color = style.optionColor;
      }
      if (style.inputBackColor) {
        selectStyle.backgroundColor = style.inputBackColor;
      }
      if (style.backColor) {
        item.__li.style.backgroundColor = style.backColor;
      }
    }

  }

  static createData() {
    const oldData = BaseValueNode.createData();
    const data = {
      isDropList: true,
      list: {},
    }
    return Object.assign(oldData, data);
  }

}

export { DropListType }