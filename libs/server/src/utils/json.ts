import * as path from 'path';
import * as fs from 'fs-extra';
const { writeFileSync, readFileSync } = fs;
// json 存储路径是固定的
export const readJson = fileName => {
  const filePath = path.resolve(__dirname, '../../');
  const filePathNmae = `${filePath}/${fileName}`;
  console.log('filePathNmaefilePathNmae', filePathNmae);
  try {
    const data = JSON.parse(readFileSync(filePathNmae, 'utf-8'));
    return data;
  } catch (error) {
    console.log('读取失败');
    return {};
  }
};

export const resolveFromRoot = (...relativePath) => {
  return path.resolve(__dirname, '..', ...relativePath);
};
