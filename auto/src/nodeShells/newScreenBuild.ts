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
  getGitDiff,
  feChange,
  beChange,
} from '../utils/git';

async function build() {
  const str = process.argv[2];
  const data = JSON.parse(str); // 获取参数
  const { branch, storeFilePath, gitFileName, buildAll = false } = data;
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
      console.log('创建文件夹---', branchPath)
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
    const changeFileArr = getGitDiff(data);
    const shouldBuildFe = buildAll || feChange(changeFileArr, filePath)
    const shouldBuildBe = buildAll || beChange(changeFileArr, filePath)
    console.log('shouldBuildFe....', shouldBuildFe)
    console.log('shouldBuildBe....', shouldBuildBe)
    console.log('filePath>>>>>>>>', filePath)
    shell.cd(filePath);
    if (shouldBuildFe) {
      const initNodeStr = `bash ${filePath}/shells/buildFe.sh`;
      shell.exec(initNodeStr);
    }
    if (shouldBuildBe) {
      const initNodeStr = `bash ${filePath}/shells/buildBe.sh`;
      shell.exec(initNodeStr);
    }
    process.send('ok');
  } catch (err) {
    console.log('eeeeeee', err);
    console.log('删除 branchPath', branchPath);
    fs.removeSync(branchPath);
  }
}

build();
