// 针对不同浏览器的解决方案, 匹配元素
const matchesSelector = (element, selector) => {
  if (element.matches) {
    return element.matches(selector);
  } else if (element.matchesSelector) {
    return element.matchesSelector(selector);
  } else if (element.webkitMatchesSelector) {
    return element.webkitMatchesSelector(selector);
  } else if (element.msMatchesSelector) {
    return element.msMatchesSelector(selector);
  } else if (element.mozMatchesSelector) {
    return element.mozMatchesSelector(selector);
  } else if (element.oMatchesSelector) {
    return element.oMatchesSelector(selector);
  }
};

/**
 * 颜色选取组件点击空白区域判断
 * @param {object} event 事件对象
 * @param {string} currentSelector 例如 '.citySelectWrap *'
 * @param {Function} getVisible
 * @param {Function} callback
 */
export const onBlurHandler = (event, currentSelector, getVisible, callback) => {
  if (!event) {
    throw new Error('No Event');
  }

  const visible = getVisible ? getVisible() : false;

  // 如果当前颜色选取组件未显示，则不做任何处理
  if (!visible) {
    return;
  }

  //匹配当前组件内的所有元素
  if (matchesSelector(event.target, currentSelector)) {
    return;
  }

  callback && callback();
};

/**
 * 获取颜色选择器位置
 * @param {object} element
 * @param {number} sketchPickerHeight 组件实际高度
 */
export const getSketchPickerPosition = (element, sketchPickerHeight = 305) => {
  if (!element) {
    throw new Error('No Element');
  }
  // 可视区域高度
  const clientHeight = document.body.clientHeight;
  // 点击元素相对可视区域的位置
  const { left, top, bottom } = element.getBoundingClientRect();

  let curTop = window.scrollY + bottom;

  if (clientHeight - bottom < sketchPickerHeight) {
    curTop = window.scrollY + top - sketchPickerHeight;
  }
  return { left, top: curTop };
};

export function color2Rgba(colorStr) {
  if (!colorStr) {
    return 'rgba(0,0,0,0)';
  }
  if (colorStr.startsWith('rgba')) {
    return colorStr;
  }
  // 把颜色值变成小写
  let color = colorStr.toLowerCase();

  if (color.length === 4) {
    // 如果只有三位的值，需变成六位，如：#fff => #ffffff
    let colorNew = '#';
    for (var i = 1; i < 4; i += 1) {
      colorNew += color.slice(i, i + 1).concat(color.slice(i, i + 1));
    }
    color = colorNew;
  }
  // 处理六位的颜色值，转为RGB
  let colorChange = [];
  for (let i = 1; i < 7; i += 2) {
    colorChange.push(parseInt('0x' + color.slice(i, i + 2)));
  }
  return 'rgba(' + colorChange.join(',') + ',1)';
}
