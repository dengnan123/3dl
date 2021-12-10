import { isArray, isObject, cloneDeep } from 'lodash';
import { strToObj, objToStr } from '../utils/type';
import * as moment from 'dayjs';
import { v4 as uuid } from 'uuid';
import * as changeCase from 'change-case';
export const OrLike = (fields, value) => {
  let str;
  for (const field of fields) {
    if (str) {
      str = `${str} OR ${field} LIKE "%${value}%"`;
    } else {
      str = `${field} LIKE "%${value}%"`;
    }
  }
  return str;
};

export const LessAndMore = (field, arr: any[]) => {
  // arr可以是个数字，也可以是个对象
  // 如果是数字就是> 或者 <
  // 如果是对象就是 >= 或者 <=
  let left = '>';
  let right = '<';
  let leftValue: any = arr[0];
  let rightValue: any = arr[1];
  if (isObject(arr[0])) {
    left = '>=';
    leftValue = leftValue.value;
  }
  if (isObject(arr[1])) {
    right = '<=';
    rightValue = rightValue.value;
  }
  return `${field} ${left} ${leftValue} AND ${field} ${right} ${rightValue}`;
};

export const dealWithFindRes = (data: any, textFieldshash) => {
  if (JSON.stringify(textFieldshash) === '{}') {
    return data;
  }

  // 说明这个表存储的json  数据格式要处理下
  if (isArray(data)) {
    return data.map(v => {
      const item = dealWithDataByTextFieldshash(v, textFieldshash);
      return item;
    });
  }
  if (isObject(data)) {
    return dealWithDataByTextFieldshash(data, textFieldshash);
  }
};

export const dealWithDataByTextFieldshash = (data, textFieldshash) => {
  const newInfo = cloneDeep(data);
  const keys = Object.keys(newInfo);
  for (const key of keys) {
    if (textFieldshash[key]) {
      newInfo[key] = strToObj(newInfo[key]);
    }
  }
  return newInfo;
};

export const delwithInputData = (data: any, textFieldshash) => {
  const cond = cloneDeep(data);
  const time = moment().valueOf();
  const newId = uuid();
  if (JSON.stringify(textFieldshash) !== '{}') {
    const keys = Object.keys(cond);
    for (const key of keys) {
      if (textFieldshash[key] && isObject(data[key])) {
        // 处理json 把json变成字符串
        cond[key] = objToStr(cond[key]);
      }
    }
  }
  return {
    ...cond,
    createTime: time,
    updateTime: time,
    uuid: newId,
  };
};

export const dealwithFieldToDb = field => {
  // changeCase

  // const arr = field.split('_');

  return changeCase.camelCase(field);
};

/**
 * Converts string into camelCase.
 *
 * @see http://stackoverflow.com/questions/2970525/converting-any-string-into-camel-case
 */
export function camelCase(str: string, firstCapital: boolean = false): string {
  // tslint:disable-next-line: only-arrow-functions
  return str.replace(/^([A-Z])|[\s-_](\w)/g, function (match, p1, p2, offset) {
    if (firstCapital === true && offset === 0) {
      return p1;
    }
    if (p2) {
      return p2.toUpperCase();
    }
    return p1.toLowerCase();
  });
}

/**
 * Converts string into snake_case.
 *
 * @see https://regex101.com/r/QeSm2I/1
 */
export function snakeCase(str: string) {
  return str
    .replace(/(?:([a-z])([A-Z]))|(?:((?!^)[A-Z])([a-z]))/g, '$1_$3$2$4')
    .toLowerCase();
}
