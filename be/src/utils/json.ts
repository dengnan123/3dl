import * as path from 'path';
import * as fs from 'fs-extra';
import { isObject } from 'lodash';
const { writeFileSync, readFileSync } = fs;
// json 存储路径要是固定
// const filePath = path.resolve(__dirname, '../../../static');

export const writeJson = ({ data, filePath, fileName }) => {
  const filePathNmae = `${filePath}/${fileName}`;
  writeFileSync(filePathNmae, JSON.stringify(data, null, 2), {
    encoding: 'utf8',
  });
};

export const readTempAndWriteData = ({ data, filePath, fileName }) => {
  const getKey = () => {
    if (fileName.includes('dataSource')) {
      return 'DP_STATIC_DATASOURCE';
    }
    if (fileName.includes('pageComp')) {
      return 'DP_STATIC_PAGECOMP';
    }
    if (fileName.includes('page')) {
      return 'DP_STATIC_PAGE';
    }
    if (fileName.includes('apiHost')) {
      return 'DP_STATIC_APIHOST';
    }
    return 'DP_STATIC_ENV';
  };
  const DP_GLOBAL_KEY = getKey();
  const tempPath = path.resolve(__dirname, '../../shells/temp.txt');
  const initData = readFileSync(tempPath, 'utf-8');
  const newstr = initData.replace('DP_GLOBAL_KEY', DP_GLOBAL_KEY);
  const newstr2233 = newstr.replace(
    'DP_GLOBAL_DATA',
    `${JSON.stringify(data, null, 2)}`
  );
  const filePathNmae = `${filePath}/${fileName}`;
  writeFileSync(filePathNmae, newstr2233, {
    encoding: 'utf8',
  });
};

export const readJson = (fileName) => {
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

export const objectString = (obj) => {
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

export const mkdir = (filePath) => {};
