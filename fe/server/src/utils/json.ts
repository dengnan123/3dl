import * as path from 'path';
import * as fs from 'fs-extra';
import { isObject } from 'lodash';
const { writeFileSync, readFileSync } = fs;
// json 存储路径是固定的
export const readJson = (fileName, initData = {}) => {
  const filePath = path.resolve(__dirname, '../../dist/pageStatic/');
  // const filePath = '/Users/dany/Downloads/df-visual-big-screen-building-system\ 4/dist/pageStatic'
  const filePathNmae = `${filePath}/${fileName}`;
  console.log('filePathNmaefilePathNmae', filePathNmae);
  try {
    const data = JSON.parse(readFileSync(filePathNmae, 'utf-8'));
    return data;
  } catch (error) {
    console.log('读取失败');
    return initData;
  }
};

export const readReplaceJson = () => {
  const jsonPath = `../../replace.json`;
  const filePath = path.resolve(__dirname, jsonPath);
  if (!fs.existsSync(filePath)) {
    return {};
  }
  try {
    const data = JSON.parse(readFileSync(filePath, 'utf-8'));
    return data;
  } catch (error) {
    console.log('error.....', error);
    console.log('repalce.json path 读取失败', filePath);
    return {};
  }
};

export const resolveFromRoot = (...relativePath) => {
  return path.resolve(__dirname, '..', ...relativePath);
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

export const getCmdPath = () =>{
  return process.cwd()
}