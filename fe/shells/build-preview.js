const path = require('path');
const fs = require('fs-extra');
const shell = require('shelljs');
const request = require('request');
const compressing = require('compressing');

async function build() {
  const shellPath = path.resolve(__dirname, `./git.clone.sh `);
  const { code, stderr } = await shell.exec(shellPath);

  if (code) {
    throw new Error(stderr);
  }

  const pagesPath = path.resolve(
    __dirname,
    '../release/df-visual-big-screen-building-system/src/pages',
  );

  // 读取pages下面文件的所有名字
  const files = await fs.readdir(pagesPath);
  console.log('filesfilesfiles', files);
  // 删除除了 preview 和 document.ejs 的其他文件和文件夹
  const shouldDelArr = files
    .filter(v => {
      if (v.includes('index.js') || v.includes('document.ejs') || v.includes('preview')) {
        return false;
      }
      return true;
    })
    .map(v => {
      console.log('删除文件', `${pagesPath}/${v}`);
      return fs.remove(`${pagesPath}/${v}`);
    });

  await Promise.all(shouldDelArr);

  const doBuildPath = path.resolve(
    __dirname,
    `./build.sh ./release/df-visual-big-screen-building-system`,
  );

  const { code: buildCode, stderr: buildError } = await shell.exec(doBuildPath);
  if (buildCode) {
    throw new Error(buildError);
  }

  let pageIdList = [];
  if (process.argv.length > 2) {
    pageIdList = process.argv.slice(2).map(v => {
      return parseInt(v);
    });
  }

  if (!pageIdList.length) {
    throw new Error('请传入页面ID');
  }

  console.log('pageIdListpageIdList', pageIdList);

  const url = 'http://3dl.dfocus.top/api/page/download/json';
  const unzipCodeFilePath = path.resolve(
    __dirname,
    '../release/df-visual-big-screen-building-system/df-visual-big-screen-building-system',
  );
  const codeFilePath = path.resolve(
    __dirname,
    '../release/df-visual-big-screen-building-system/df-visual-big-screen-building-system/file.zip',
  );
  if (!fs.existsSync(unzipCodeFilePath)) {
    fs.ensureDirSync(unzipCodeFilePath);
  }

  console.log('页面下载中');
  await fetchPost(url, { pageIdList }, codeFilePath);
  console.log('下载完成开始处理压缩包');
  await compressing.zip.uncompress(codeFilePath, unzipCodeFilePath);
  const newFiles = await fs.readdir(unzipCodeFilePath);
  let fileName;
  for (const v of newFiles) {
    if (v.includes('tmp')) {
      fileName = v;
    }
  }
  if (!fileName) {
    throw new Error('no tmp file');
  }
  const oldPath = `${unzipCodeFilePath}/${fileName}`;
  const newPath = `${unzipCodeFilePath}/pageStatic`;
  if (fs.existsSync(newPath)) {
    fs.removeSync(newPath);
  }
  fs.renameSync(oldPath, newPath);
  fs.removeSync(codeFilePath);
  fs.removeSync(oldPath);

  // 最后压缩文件夹
  const dfFilePath = path.resolve(
    __dirname,
    '../release/df-visual-big-screen-building-system/df-visual-big-screen-building-system',
  );
  const dfZipFilePath = path.resolve(
    __dirname,
    '../release/df-visual-big-screen-building-system/df-visual-big-screen-building-system.zip',
  );
  console.log('生成zip包')
  await compressing.zip.compressDir(dfFilePath, dfZipFilePath);
}

build();

function fetchPost(url, params, codeFilePath) {
  return new Promise((resolve, reject) => {
    const writeStream = fs.createWriteStream(codeFilePath);
    request
      .post(url, { json: true, body: params })
      .on('error', function(err) {
        reject(err);
      })
      .on('response', function(response) {
        console.log(response.file); // 200
      })
      .pipe(writeStream);
    writeStream.on('finish', data => {
      resolve();
    });
  });
}
