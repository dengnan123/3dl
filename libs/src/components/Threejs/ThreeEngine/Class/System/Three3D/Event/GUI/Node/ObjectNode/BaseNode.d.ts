
interface BASENODE_DATA {
  key: String;
  name: String;
  order: Number;
  index: Number;
  style: Object;
  isHide: Boolean;
}
class BaseNode {
  constructor(data: BASENODE_DATA)
  key: String;
  name: String;
  order: Number;
  index: Number;
  style: Object;
  isHide: Boolean;
  createData(): BASENODE_DATA;
  static createData(): BASENODE_DATA;
}

export { BaseNode, BASENODE_DATA }