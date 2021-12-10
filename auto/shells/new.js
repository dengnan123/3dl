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
  try {
    if (fs.existsSync(branchPath)) {
      // 拉去最新代码
      shell.cd(branchPath);
      doFetchGit({
        branchPath,
        branch: newBranchName,
        hasCode: true,
      });
    } else {
      // 创建文件件，拉去代码
      shell.mkdir('-p', `${branchPath}`);
      shell.cd(branchPath);
      doFetchGit({
        branchPath,
        branch: newBranchName,
      });
    }

    const filePath = path.resolve(
      __dirname,
      `../release/${newBranchName}/df-visual-big-screen-building-system`,
    );

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
    const fielName = 'df-visual-big-screen-building-system';
    shell.rm('-rf', [`./${fielName}`, `./${fielName}.zip`, './dist']);
    shell.mkdir('-p', `${fielName}`);
    shell.exec('yarn');
    const { code, stderr } = shell.exec('NODE_ENV=production npm run build');
    if (code !== 0) {
      throw new Error(stderr);
    }
    shell.cp('-R', './dist', `./${fielName}`);
    shell.cp('-R', './src/assets', `./${fielName}/dist`);
    shell.cp('-R', './replace.json', `./${fielName}/replace.json`);
    try {
      process.chdir(`${filePath}/server`);
    } catch (err) {
      console.log('chdir: ' + err);
    }
    const { code: serverCode, stderr: serverStderr } = shell.exec(
      'yarn && NODE_ENV=production npm run build ',
    );
    if (serverCode !== 0) {
      throw new Error(serverStderr);
    }
    shell.cd('..');
    shell.exec(
      `mv ./server/dist ./${fielName}/server && mv ./server/node_modules ./${fielName}  &&  cp -r ./server/package.json ./${fielName}`,
    );
    process.send('ok');
  } catch (err) {
    console.log('eeeeeee', err);
    console.log('删除 branchPath', branchPath);
    fs.removeSync(branchPath);
  }
}

build();
