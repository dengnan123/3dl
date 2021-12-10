class BaseNode {
  constructor(data = BaseNode.createData()) {
    this.key = data.key;
    this.name = data.name || data.key;
    this.index = data.index;
    this.order = data.order;
    this.style = data.style;
    this.isHide = data.isHide;
  }
  key;
  name;
  index;
  order;
  style;
  isHide;
  static createData() {
    return {
      key: undefined,
      name: undefined,
      index: 0,
      order: 0,
      style: undefined,
      isHide: false,
    }
  }
  createData() {
    return BaseNode.createData();
  }

  drawGUI() { };

}

export { BaseNode }