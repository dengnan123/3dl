import * as path from 'path';
import * as fs from 'fs-extra';
import { isObject } from 'lodash';
const { writeFileSync, readFileSync } = fs;
// json 存储路径要是固定
// const filePath = path.resolve(__dirname, '../../../static');

export const writeJson = ({ data, filePath, fileName, encoding = 'utf-8' }) => {
  const filePathNmae = `${filePath}/${fileName}`;
  writeFileSync(filePathNmae, JSON.stringify(data, null, 2), {
    encoding,
  });
};

export const writeShell = ({ str, filePath, fileName }) => {
  const filePathNmae = `${filePath}/${fileName}`;
  writeFileSync(filePathNmae, str);
};

export const readJson = fileName => {
  const filePath = path.resolve(__dirname, '../../../static');
  const filePathNmae = `${filePath}/${fileName}`;
  try {
    const data = JSON.parse(readFileSync(filePathNmae, 'utf-8'));
    return data;
  } catch (error) {
    console.log('读取失败');
    return {};
  }
};

export const objectString = obj => {
  if (!obj) {
    return '';
  }
  if (JSON.stringify(obj) === '{}') {
    return '';
  }
  return Object.keys(obj).reduce((pre, next) => {
    if (pre) {
      let nextValue = obj[next];
      if (isObject(nextValue)) {
        nextValue = encodeURIComponent(JSON.stringify(nextValue));
      }
      return `${pre}&${next}=${nextValue}`;
    }
    return `${next}=${obj[next]}`;
  }, '');
};

export const mkdir = filePath => {};
