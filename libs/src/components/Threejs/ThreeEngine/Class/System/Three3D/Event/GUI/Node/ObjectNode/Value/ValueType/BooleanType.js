import { BaseValueNode } from "../BaseValueNode";

class BooleanType extends BaseValueNode {
  constructor(data = BooleanType.createData()) {
    super(data);
    this.UtoP();

  }


  #isBoolean;

  UtoP() {
    const v = this.uniforms.val.value;
    if (typeof (v) === 'boolean') {
      this.parameter.val = v;
    }
    else {
      this.parameter.val = Boolean(v);
    }
  }
  PtoU() {
    this.uniforms.val.value = this.parameter.val;
  }


  drawGUI(folder, style) {
    style = this.style || style || {};
    const scope = this;
    this.guiItem = folder.add(this.parameter, 'val').name(this.name).onChange(onChange).onFinishChange(onFinish);
    booleanStyle(this.guiItem, style);

    function onChange() {
      scope.PtoU();
      scope.onValueChange(scope.uniforms.val.value);
    }

    function onFinish() {
      scope.PtoU();
      scope.onValueFinish(scope.uniforms.val.value);
    }

    function booleanStyle(item, style) {
      if (JSON.stringify(style) === '{}') return;


      const toggler = item.domElement.querySelector(`input[type = "checkbox"]`).style;
      toggler.color = `#FF0000`;
      toggler.backgroundColor = '#00FF00';

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
      isBoolean: true,
    }
    return Object.assign(oldData, data);
  }

}

export { BooleanType }