import { BaseValueNode } from "../BaseValueNode";

class NumberType extends BaseValueNode {
  constructor(data = NumberType.createData()) {
    super(data);



    this.#isBoolean = data.isBoolean;
    this.#slider = !data.isBoolean && data.isSlider;
    this.#delta = data.delta;
    this.#max = data.max;
    this.#min = data.min;
    this.UtoP();

  }


  #isBoolean;
  #slider;
  #max;
  #min;
  #delta;

  UtoP() {
    console.log(this.#isBoolean)
    if (this.#isBoolean) {
      this.parameter.val = this.uniforms.val.value !== 0;
    }
    else {
      this.parameter.val = this.uniforms.val.value;
    }
  }
  PtoU() {
    if (this.#isBoolean) {
      this.uniforms.val.value = Number(this.parameter.val);
    }
    else {
      this.uniforms.val.value = this.parameter.val;
    }
  }


  drawGUI(folder, style) {
    style = this.style || style || {};
    const scope = this;
    if (this.#slider) {
      this.guiItem = folder.add(this.parameter, 'val').name(this.name).min(this.#min).max(this.#max).step(this.#delta).onChange(onChange).onFinishChange(onFinish);
      sliderStyle(this.guiItem, style);
    }
    else {
      this.guiItem = folder.add(this.parameter, 'val').name(this.name).onChange(onChange).onFinishChange(onFinish);
      if (this.#isBoolean) {
        booleanStyle(this.guiItem, style);
      }
      else {
        numberStyle(this.guiItem, style);
      }
    }

    function onChange() {
      scope.PtoU();
      scope.onValueChange(scope.uniforms.val.value);
    }
    function onFinish() {
      scope.PtoU();
      scope.onValueFinish(scope.uniforms.val.value);
    }

    function numberStyle(item, style) {

      if (JSON.stringify(style) === '{}') return;
      // if(style.padding){
      //     // console.log(item.__li.style);
      //     item.__li.style.marginLeft = `${style.padding}px`;
      // }
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

    function sliderStyle(item, style) {
      if (JSON.stringify(style) === '{}') return;

      const inputStyle = item.domElement.querySelector('div > input[type="text"]').style;

      if (style.fontColor) {
        item.__li.style.color = style.fontColor;
        item.__li.style.textShadow = "none";
        item.__li.style.borderLeftColor = style.fontColor;
        item.__foreground.style.backgroundColor = style.fontColor;
        inputStyle.color = style.fontColor;
      }
      if (style.inputBackColor) {
        item.__background.style.backgroundColor = style.inputBackColor;
        inputStyle.backgroundColor = style.inputBackColor;
      }
      if (style.backColor) {
        item.__li.style.backgroundColor = style.backColor;
      }
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
      isNumber: true,
      isBoolean: false,
      isSlider: true,
      max: 1,
      min: 0,
      delta: 0.001,
    }
    return Object.assign(oldData, data);
  }

}

export { NumberType }