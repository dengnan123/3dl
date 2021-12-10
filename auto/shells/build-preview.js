const path = require('path');
const fs = require('fs-extra');
const shell = require('shelljs');
const request = require('request');
const compressing = require('compressing');
// const { process } = require('child_process');

async function build() {
  const shellPath = path.resolve(__dirname, `./git.clone.sh `);
  const { code, stderr } = await shell.exec(shellPath);
  if (code) {
    // 删除release 文件夹
    fs.removeSync(path.resolve(__dirname, '../release'));
    throw new Error(stderr);
  }
  const pagesPath = path.resolve(
    __dirname,
    '../release/df-visual-big-screen-building-system/src/pages',
  );
  // 读取pages下面文件的所有名字
  const files = await fs.readdir(pagesPath);
  // 删除除了 preview 和 document.ejs 的其他文件和文件夹
  const shouldDelArr = files
    .filter(v => {
      if (
        v.includes('index.js') ||
        v.includes('document.ejs') ||
        v.includes('preview')
      ) {
        return false;
      }
      return true;
    })
    .map(v => {
      console.log('删除文件', `${pagesPath}/${v}`);
      return fs.remove(`${pagesPath}/${v}`);
    });

  await Promise.all(shouldDelArr);

  const filePath = path.resolve(
    __dirname,
    '../release/df-visual-big-screen-building-system',
  );
  const doBuildPath = path.resolve(__dirname, `./build-fe.sh ${filePath}`);

  const { code: buildCode, stderr: buildError } = await shell.exec(
    doBuildPath,
    {
      cwd: filePath,
    },
  );
  if (buildCode) {
    throw new Error(buildError);
  }
  process.send('ok');
}

build();
