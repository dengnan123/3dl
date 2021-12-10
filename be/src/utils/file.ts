// const fs = require('fs-extra');
import * as fs from 'fs-extra';
import * as path from 'path';
const { writeFile, ensureDirSync } = fs;

const writeJson = ({ data, filePath, fileName }) => {
  const filePathNmae = `${filePath}/${fileName}`;
  return writeFile(filePathNmae, JSON.stringify(data, null, 2), {
    encoding: 'utf8',
  });
};

export const makeFilePath = filePath => {
  fs.ensureDirSync(filePath);
};

export const deleteFilePath = filePath => {
  if (fs.existsSync(filePath)) {
    fs.removeSync(filePath);
  }
};

export const basePath = path.resolve(__dirname, '../../../static');

export const pageStaticPath = `${basePath}/page`

export const pluginPath = `${basePath}/plugin`;
