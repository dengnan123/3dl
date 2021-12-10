const path = require('path');
const fs = require('fs-extra');
const shell = require('shelljs');
const request = require('request');
const compressing = require('compressing');

function tranfromBranchName(branch) {
  console.log('tranfromBranchName', branch);
  const arr = branch.split('/');
  return arr.join('_');
}

function reductionBranchName(branch) {
  console.log('reductionBranchName', branch);
  const arr = branch.split('_');
  return arr.join('/');
}

function noGitCode(branch) {
  const _name = reductionBranchName(branch);
  return shell.exec(
    `    
          git clone git@agitlab.dfocus.co:customization/df-visual-big-screen-building-system.git \n
            cd df-visual-big-screen-building-system \n
            git checkout ${_name}`,
  );
}

function hasGitCode(branch) {
  const _name = reductionBranchName(branch);
  return shell.exec(
    `  
              cd df-visual-big-screen-building-system \n
              git fetch --all \n
              git reset --hard ${_name}`,
  );
}

function doError(branchPath, stderr) {
  fs.removeSync(branchPath);
  throw new Error(stderr);
}

function doFetchGit({ branchPath, branch, hasCode }) {
  console.log('has code ......', hasCode);
  const res = hasCode ? hasGitCode(branch) : noGitCode(branch);
  const { code, stderr } = res;
  if (code !== 0) {
    doError(branchPath, stderr);
  }
}

async function build() {
  const str = process.argv[2];
  const data = JSON.parse(str); // 获取参数
  const { branch = 'feature/dany/master' } = data;
  const newBranchName = tranfromBranchName(branch);
  const releasePath = path.resolve(__dirname, '../release');
  const branchPath = `${releasePath}/${newBranchName}`;
  shell.cd(branchPath);
  const { stdout } = shell.exec(
    `  
              cd df-visual-big-screen-building-system 
              git diff --name-only HEAD~ HEAD`,
  );
  console.log('rrrrrr123123123', res);
  //   const arr = stdout.
}

build();
