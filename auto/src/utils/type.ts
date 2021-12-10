export const isString = v => {
  return Object.prototype.toString.call(v) === '[object String]';
};

export const isNumber = v => {
  return Object.prototype.toString.call(v) === '[object Number]';
};

export const isArray = v => {
  return Object.prototype.toString.call(v) === '[object Array]';
};

export const isObject = v => {
  return Object.prototype.toString.call(v) === '[object Object]';
};

export const filterObj = (data, optArr) => {
  if (JSON.stringify(data) === '{}') {
    return data;
  }
  if (!optArr || !optArr.length) {
    return data;
  }
  const newData = {};
  const keys = Object.keys(data);
  for (const key of keys) {
    const value = data[key];
    if (optArr.includes(value)) {
      continue;
    }
    newData[key] = value;
  }
  return newData;
};

export const strToObj = str => {
  if (!str) {
    return {};
  }
  let data = {};
  try {
    data = JSON.parse(str);
  } catch (err) {
    console.log('JSON.parse error', err.message);
  }
  return data;
};

export const objToStr = obj => {
  if (!obj) {
    return '{}';
  }
  return JSON.stringify(obj);
};

export const arrToStr = arr => {
  if (isArray(arr)) {
    return arr.join(','); // 数组转化为字符串
  }
  return '';
};

export const strToArr = str => {
  if (!str) {
    return [];
  }
  return str.split(',');
};
