import { isObject, isString, filterObj, isArray } from './type';

export const dealWithAddInfo = ({ condition, fields }) => {
  const newCondidtion = {
    ...condition,
  };
  for (const v of fields) {
    const { key } = v;
    if (newCondidtion[key]) {
      if (isArray(newCondidtion[v])) {
        newCondidtion[v] = newCondidtion[v].join(','); // 数组转化为字符串
      } else if (isObject(newCondidtion[v])) {
        newCondidtion[v] = JSON.stringify(newCondidtion[v]);
      } else {
        delete newCondidtion[v];
      }
    }
  }
  return newCondidtion;
};

export const dealWithUpdateInfo = ({ condition, toUpdate, fields }) => {
  const newData = dealWithAddInfo({
    condition,
    fields,
  });
  const updated = Object.assign(toUpdate, newData);
  return updated;
};

export const dealWithFindInfo = ({ data, fields }) => {
  const newData = {
    ...data,
  };
  const getObj = v => {
    try {
      console.log('datadata', data);
      console.log('vvvv', v);
      return JSON.parse(data[v]);
    } catch (err) {
      console.log('eeee', err);
      return {};
    }
  };
  const getArr = v => {
    try {
      return data[v].split(',');
    } catch (err) {
      console.log('getArr eeee', err);
      return [];
    }
  };
  const parseData = () => {
    const obj = {};
    for (const v of fields) {
      const { key, type } = v;
      obj[key] = type === 'array' ? getArr(key) : getObj(key);
    }
    return obj;
  };
  return {
    ...newData,
    ...parseData(),
  };
};
