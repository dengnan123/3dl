const isElement = function(obj) {
  if (obj && obj.nodeType === 1) {
    if (window.Node && obj instanceof Node) {
      return true;
    }
  }
  return false;
};

export const callBackStyle = (defaultStyle, node = null, cbStyle = {}) => {
  if (!defaultStyle instanceof Object) {
    throw Error('Type Error:style params must be the type of object');
  }
  if (cbStyle && !cbStyle instanceof Object) {
    throw Error('Type Error:cbStyle params must be the type of object');
  }

  if (node && isElement(node) && Object.keys(cbStyle).length !== 0) {
    for (const [key, value] of Object.entries(cbStyle)) {
      if (!Object.keys(node.style).includes(key)) {
        console.warn(`${key} is not a valid key, your css may not take effect`);
      }
      // console.log(node, key, value);
      // node.style[key] = value;
      node.style.setProperty(key, value);
    }
    return;
  } else {
    for (const [key, value] of Object.entries(defaultStyle)) {
      if (!Object.keys(node.style).includes(key)) {
        console.warn(`${key} is not a valid key, your css may not take effect`);
      }
      // console.log(node, key, value);
      // node.style[key] = value;
      node.style.setProperty(key, value);
    }
    return;
  }
  return;
};
