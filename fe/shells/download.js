const path = require('path');
const shell = require('shelljs');
const fs = require('fs-extra');
const compressing = require('compressing');
// const url = 'http://3dl.dfocus.top/build/build';
const url = 'http://192.168.10.93:3005/build';

const { fetchPost } = require('./util');

const data = {
  branch: 'feature/dany/master',
  envId: 48,
  json: {},
  pageIdList: [],
  replaceJson: {},
  tagId: 11,
};

async function download(params) {
  shell.rm('-rf', ['release']);
  shell.mkdir('-p', 'release');
  console.log('页面下载中');
  const baseFilePath = path.resolve(__dirname, '../release');
  const codeFilePath = `${baseFilePath}/df-visual-big-screen-building-system.zip`;
  await fetchPost(url, data, codeFilePath);
  console.log('下载完成开始处理压缩包');
  const unzipCodeFilePath = baseFilePath;
  if (!fs.existsSync(unzipCodeFilePath)) {
    fs.ensureDirSync(unzipCodeFilePath);
  }
  await compressing.zip.uncompress(codeFilePath, unzipCodeFilePath);
  console.log('解压完成');
}

download();
