import { BaseValueNode } from "../BaseValueNode";
import { NumberType } from "../ValueType/NumberType";

class VectorType extends BaseValueNode {
  constructor(data = VectorType.createData()) {
    super(data);

    let index = 0;
    const scope = this;
    scope.#number = data.number;
    scope.#needHead = data.needHead;
    scope.#headName = data.headName;
    console.log(data);
    for (var key in data.infos) {
      const sonData = data.infos[key];
      sonData.onChange = onChange;
      sonData.onFinish = onFinish;
      sonData.uniform = { value: data.uniform.value[key] };
      const node = new NumberType(sonData);
      node.index = index;
      this.#guiNodes[key] = node;
      index++;
    }


    function onChange() {
      scope.PtoU();
      scope.onValueChange(scope.uniforms.val.value);
    }
    function onFinish() {
      scope.PtoU();
      scope.onValueFinish(scope.uniforms.val.value);
    }

  }
  #guiNodes = {};
  #guiItems = [];
  #guiHead;
  UtoP() {
    for (var key in this.#guiNodes) {
      let node = this.#guiNodes[key];
      node.uniforms.val.value = this.uniforms.val.value[key];
      node.UtoP();
    }
  }
  PtoU() {
    const x = this.#guiNodes.x && this.#guiNodes.x.uniforms.val.value;
    const y = this.#guiNodes.y && this.#guiNodes.y.uniforms.val.value;
    const z = this.#guiNodes.z && this.#guiNodes.z.uniforms.val.value;
    const w = this.#guiNodes.w && this.#guiNodes.w.uniforms.val.value;
    console.log(x, y, z, w);
    this.uniforms.val.value.set(x, y, z, w);
  }

  #number;
  #needHead;
  #headName;
  drawGUI(folder, style) {
    console.log(this.#guiNodes)
    style = this.style || style || {};

    if (this.#needHead) {
      folder = folder.addFolder(this.#headName);
      folderStyle(folder, style);
      this.#guiHead = folder;
    }

    const nodes = Object.values(this.#guiNodes);
    var res = Object.keys(nodes).sort(function (a, b) {
      var oa = nodes[a].order;
      var ob = nodes[b].order;
      if (oa !== ob) {
        return oa - ob;
      }
      return nodes[a].index - nodes[b].index;
    });
    res.forEach(element => {
      var son = nodes[element];
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



  static createData(number) {
    const oldData = BaseValueNode.createData();
    const data = {
      isVector: true,
      number: number,
      needHead: false,
      headName: "",
      infos: {
      }
    }
    if (number >= 1) {
      const data1 = NumberType.createData();
      data1.key = data1.name = 'x';
      data.infos.x = data1;
    }
    if (number >= 2) {
      const data1 = NumberType.createData();
      data1.key = data1.name = 'y';
      data.infos.y = data1;
    }
    if (number >= 3) {
      const data1 = NumberType.createData();
      data1.key = data1.name = 'z';
      data.infos.z = data1;
    }
    if (number >= 4) {
      const data1 = NumberType.createData();
      data1.key = data1.name = 'w';
      data.infos.w = data1;
    }

    return Object.assign(oldData, data);
  }

}

export { VectorType }