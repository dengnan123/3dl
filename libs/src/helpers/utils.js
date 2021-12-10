import queryString from 'query-string';
import { message } from 'antd';
import objectPath from 'object-path';
import { isObject } from 'lodash';
import { useDeepCompareEffect } from 'react-use';
import { reap } from '../components/SafeReaper';

export const isProduction = process.env.NODE_ENV === 'production';

export function resolvePublicPath(pathname) {
  const base = window.routerBase || '';
  if (isProduction) {
    return `${base.endsWith('/') ? base.slice(0, base.length - 1) : base}${pathname}`;
  }
  return pathname;
}

export function getParseSearch() {
  return queryString.parse(window.location.search);
}

export function generateNewRouterByParams(data) {
  if (!data) {
    return;
  }
  if (!isObject(data)) {
    return;
  }
  const preData = getParseSearch();
  const state = {
    ...preData,
    ...data,
  };
  console.log('statestatestatestatestate()', state);
  window.history.pushState(state, '');
  console.log('getParseSearch()', getParseSearch());
}

export function generateNewRouterByDelParams(data) {
  if (!data) {
    return;
  }
  if (!isObject(data)) {
    return;
  }
  const preData = getParseSearch();
  let state = {};
  for (const key in preData) {
    if (!data[key]) {
      state[key] = preData[key];
    }
  }
  window.history.pushState(state, '');
}

export const filterObj = (data, optArr) => {
  if (JSON.stringify(data) === '{}') {
    return data;
  }
  if (!optArr || !optArr.length) {
    return data;
  }

  const filterFunc = (obj, optArr, type = 'value') => {
    let newData = {};
    const keys = Object.keys(obj);
    for (const key of keys) {
      const value = obj[key];
      if (isObject(value)) {
        newData[key] = filterObj(value, optArr);
        continue;
      }
      if (!optArr.includes(value)) {
        newData[key] = value;
      }
    }
    return newData;
  };

  return filterFunc(data, optArr);
};

export const hashDeduplication = (arr, key) => {
  let obj = {};
  return arr.filter(v => {
    const _key = v[key];
    if (obj[_key]) {
      return false;
    }
    obj[_key] = 1;
    return true;
  });
};

export const isString = v => {
  return Object.prototype.toString.call(v) === '[object String]';
};

export const isNumber = v => {
  return Object.prototype.toString.call(v) === '[object Number]';
};

export const isArray = v => {
  return Object.prototype.toString.call(v) === '[object Array]';
};

export const dealWithData = data => {
  let newData = {
    ...data,
  };
  const keys = Object.keys(data);
  if (!keys.length) {
    return {};
  }
  console.log('keys', keys);
  for (const key of keys) {
    const arr = key.split('.');
    if (arr.length > 1) {
      objectPath.set(newData, key, newData[key]);
      delete newData[key];
    }
  }
  return newData;
};

export const getFormDefValue = (propsData, form, key, defValue) => {
  const { getFieldValue } = form;
  const formValue = getFieldValue(key);
  if (formValue !== undefined) {
    return formValue;
  }
  return reap(propsData, key, defValue || undefined);
};

export const customName = name => {
  // const list = ['ScreenLibs', 'ScreenConfigs', 'ScreenMockData'];
  const libHash = {
    ScreenLibs: 'lib.js',
    ScreenConfigs: 'config.js',
    ScreenMockData: 'mockData.js',
  };
  const ChartsList = ['Line', 'Pie', 'Bar', 'LineAndBar', 'DashBoard', 'ScatterPlot'];
  const MaterialList = [
    'Arrow',
    'BorderBox',
    'Circle',
    'DividingLine',
    'ImageIcon',
    'Oval',
    'Rectangle',
    'RightTriangle',
    'Triangle',
  ];
  const TableList = ['AutoTabel', 'PropertyTable', 'RankTable', 'RollTable'];
  if (libHash[name]) {
    return `df-screen-component-lib/lib/libs/${libHash[name]}`;
  }
  if (ChartsList.includes(name)) {
    return `df-screen-component-lib/lib/libs/Echarts/${name}/lib`;
  }
  if (MaterialList.includes(name)) {
    return `df-screen-component-lib/lib/libs/Material/${name}/lib`;
  }
  if (TableList.includes(name)) {
    return `df-screen-component-lib/lib/libs/Table/${name}/lib`;
  }
  return `df-screen-component-lib/lib/libs/${name}/lib`;
};

/**
 * 去除svg中path的fill属性
 * @param {string} svgStr svg字符串
 */
export function parseSvgStr(svgStr) {
  return (svgStr || '')
    .toString()
    .replace(/fill=\".*?(\")/g, '')
    .replace('<svg', '<svg fill="currentColor"');
}

export const getComp = comp => {
  // const hasChildHash = {
  //   ECharts: 1,
  //   Material: 1,
  //   Table: 1,
  //   Target: 1,
  // };
  // const echartsChild = [''];
  // const materialChild = [''];
  // const tableChild = [''];
  // const targetChild = [''];
};

// 数据过滤器
export const filterDataFunc = ({ filterFunc, data }) => {
  try {
    // eslint-disable-next-line no-new-func
    const filter = new Function('data', `${filterFunc}`);
    return filter(data);
  } catch (err) {
    console.log('过滤器代码有误', err.message);
    console.log('filterFunc...', filterFunc);
    return data;
  }
};

/**
 * 去除所有空格
 */
export function removeSpace(str) {
  if (str) {
    return str.toString().replace(/\s+/g, '');
  }
  return str;
}

/**
 * 获取链接
 * @param {*} name
 * @param {*} type
 */
export function getUrlParam(name, type) {
  if (!type || type === 'url') {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
      return decodeURI(r[2]);
    }
    return null;
  }
  if (type === 'hash') {
    let hashObj = {};
    var hashArr = window.location.hash?.split('#')[1]?.split('&') || [];
    hashArr.forEach(item => {
      let itemArray = item.split('=');
      hashObj[itemArray[0]] = itemArray[1];
    });
    return hashObj[name] || 0;
  }
}
/**
 * 截取百分比数字或者px
 * @param {String | Number} value
 */
export function getPercentOrPx(value) {
  if (!value) {
    return;
  }
  let number = parseFloat(value);
  if (number.toString() === 'NaN') {
    number = 0;
  }
  let percentOrPx = '';
  if (value.includes('%')) {
    percentOrPx = '%';
  }
  return `${number}${percentOrPx}`;
}
/**
 * antd InputNumber getValueFromEvent
 * @param {number | string} v
 */
export function getValueFromEventForInputNumber(v) {
  let value = parseInt(v);
  if (isNaN(value)) {
    value = 12;
  }
  return value;
}

export function isEmptyObj(obj) {
  return JSON.stringify(obj) === '{}';
}

/**
 * 复制内容到粘贴板
 * content : 需要复制的内容
 * msg : 复制完后的提示，不传则默认提示"复制成功"
 */
export function copyToClip(content, msg) {
  const aux = document.createElement('input');
  aux.setAttribute('value', content);
  document.body.appendChild(aux);
  aux.select();
  document.execCommand('copy');
  document.body.removeChild(aux);
  if (msg == null) {
    message.success('复制成功');
  } else {
    message.success(msg);
  }
}

export function isNullOrUndefined(opts) {
  return opts === null || opts === undefined;
}

/**
 * 查找dom并且设置style属性
 */
export function useDomStyle(domSelect, style = {}, otherDeps, shouldSetStyle = true) {
  useDeepCompareEffect(() => {
    if (!shouldSetStyle) {
      return;
    }
    let domRef = document.querySelectorAll(domSelect);
    if (domRef) {
      for (let i = 0; i < domRef.length; i++) {
        // eslint-disable-next-line no-loop-func
        Object.keys(style).forEach(k => {
          if (domRef[i].style) {
            domRef[i].style[k] = style[k];
          }
        });
      }
    }
    domRef = null;
  }, [domSelect, style, shouldSetStyle, otherDeps]);
}
