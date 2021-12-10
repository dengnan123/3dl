import * as fs from 'fs-extra';
import * as shell from 'shelljs';
import {
  tranfromBranchName,
  getRecentGitDiff,
  doFetchGit,
} from '../utils/git';
import { cpFilesToOtherPath } from '../utils/file';


async function build() {
  const str = process.argv[2];
  const data = JSON.parse(str); // 获取参数
  const { branch, storeFilePath, cpFilesToPath, gitFileName } = data;
  const newBranchName = tranfromBranchName(branch);
  const branchPath = `${storeFilePath}/${newBranchName}`;
  if (fs.existsSync(branchPath)) {
    // 拉去最新代码
    shell.cd(branchPath);
    try {
      doFetchGit({
        ...data,
        branchPath,
        hasCode: true,
      });
    } catch (err) {
      console.log('拉去代码失败。。。。', err);
      fs.removeSync(branchPath);
    }
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
  const changeFileArr = getRecentGitDiff(data);
  console.log('changeFileArr', changeFileArr);
  if (!changeFileArr.length) {
    return
  }
  shell.cd(`${branchPath}/${gitFileName}`);
  const initNodeStr =
    'yarn install --production=false && node ./shells/build.js';
  const nodeStr = changeFileArr.reduce((pre, next) => {
    return `${pre} ${next}`;
  }, initNodeStr);
  shell.exec(nodeStr);
  // 打包完成 复制文件到指定的路径
  const newDistPath = `${branchPath}/${gitFileName}/dist`;
  // 处理js 中的一些 require
  shell.exec(`node ./shells/test.js ${newDistPath}`);
  console.log('newDistPath>>>', newDistPath);
  console.log('cpFilesToPathcpFilesToPath>>>', cpFilesToPath);
  cpFilesToOtherPath(newDistPath, cpFilesToPath);
  // cp 之后删掉 oldPath
  // shell.exec(`rm -rf ${newDistPath}`);
  // console.log('删除完毕-----', newDistPath);
}

build();
