import * as fs from 'fs-extra';
import * as shell from 'shelljs';
import * as request from 'request';
import * as compressing from 'compressing';
import * as path from 'path';
import {
  tranfromBranchName,
  noGitCode,
  hasGitCode,
  doError,
  doFetchGit,
} from '../utils/git';

async function build() {
  const str = process.argv[2];
  const data = JSON.parse(str); // 获取参数
  const { branch, storeFilePath, gitFileName } = data;
  console.log('branchbranch', branch);
  const newBranchName = tranfromBranchName(branch);
  const branchPath = `${storeFilePath}/${newBranchName}`;
  try {
    if (fs.existsSync(branchPath)) {
      // 拉去最新代码
      shell.cd(branchPath);
      doFetchGit({
        ...data,
        branchPath,
        hasCode: true,
      });
    } else {
      // 创建文件件，拉去代码
      shell.mkdir('-p', `${branchPath}`);
      shell.cd(branchPath);
      doFetchGit({
        ...data,
        branchPath,
        hasCode: false,
      });
    }
    const filePath = `${branchPath}/${gitFileName}`;
    console.log('filePathfilePath', filePath);
    const pagesPath = `${filePath}/src/pages`;
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

    try {
      process.chdir(filePath);
    } catch (err) {
      console.log('chdir: ' + err);
    }

    shell.rm('-rf', [`./${gitFileName}`, `./${gitFileName}.zip`, './dist']);
    shell.mkdir('-p', `${gitFileName}`);
    shell.exec('yarn install --production=false');
    const { code, stderr } = shell.exec('NODE_ENV=production  yarn build:preview');
    if (code !== 0) {
      throw new Error(stderr);
    }
    shell.cp('-R', './dist', `./${gitFileName}`);
    shell.cp('-R', './src/assets', `./${gitFileName}/dist`);
    shell.cp('-R', './replace.json', `./${gitFileName}/replace.json`);
    try {
      process.chdir(`${filePath}/server`);
    } catch (err) {
      console.log('chdir: ' + err);
    }
    const { code: serverCode, stderr: serverStderr } = shell.exec(
      'yarn install --production=false && NODE_ENV=production npm run build ',
    );
    if (serverCode !== 0) {
      throw new Error(serverStderr);
    }
    shell.cd('..');
    shell.exec(
      `mv ./server/dist ./${gitFileName}/server && mv ./server/node_modules ./${gitFileName}  &&  cp -r ./server/package.json ./${gitFileName}`,
    );
    process.send('ok');
  } catch (err) {
    console.log('eeeeeee', err);
    console.log('删除 branchPath', branchPath);
    fs.removeSync(branchPath);
  }
}

build();
