import { BaseValueNode } from "../BaseValueNode";

class StringType extends BaseValueNode {
  constructor(data = StringType.createData()) {
    super(data);



    this.UtoP();

  }


  #isString;

  UtoP() {
    const v = this.uniforms.val.value;
    if (typeof (v) === 'string') {
      this.parameter.val = v;
    }
    else {
      this.parameter.val = String(v);
    }
  }
  PtoU() {
    this.uniforms.val.value = this.parameter.val;
  }


  drawGUI(folder, style) {
    style = this.style || style || {};
    const scope = this;
    this.guiItem = folder.add(this.parameter, 'val').name(this.name).onChange(onChange).onFinishChange(onFinish);
    stringStyle(this.guiItem, style);

    function onChange() {
      scope.PtoU();
      scope.onValueChange(scope.uniforms.val.value);
    }

    function onFinish() {
      scope.PtoU();
      scope.onValueFinish(scope.uniforms.val.value);
    }

    function stringStyle(item, style) {
      if (JSON.stringify(style) === '{}') return;


      if (style.fontColor) {
        item.__li.style.color = style.fontColor;
        item.__li.style.borderLeftColor = style.fontColor;
        item.__input.style.color = style.fontColor;
      }
      if (style.inputBackColor) {
        item.__input.style.backgroundColor = style.inputBackColor;
      }
      if (style.backColor) {
        item.__li.style.backgroundColor = style.backColor;
      }
    }
  }
  static createData() {
    const oldData = BaseValueNode.createData();
    const data = {
      isString: true,
    }
    return Object.assign(oldData, data);
  }

}

export { StringType }