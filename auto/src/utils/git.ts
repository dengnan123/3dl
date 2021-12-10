import * as shell from 'shelljs';
import * as fs from 'fs-extra';

export function tranfromBranchName(branch) {
  console.log('22222', branch);
  const arr = branch.split('/');
  return arr.join('_');
}

export function reductionBranchName(branch) {
  const arr = branch.split('_');
  return arr.join('/');
}

export function noGitCode({ branch, gitFileName, gitUrl }) {
  const name = reductionBranchName(branch);
  return shell.exec(
    ` git clone ${gitUrl} && cd ${gitFileName} && git checkout ${name}`,
  );
}

export function hasGitCode({ branch, gitFileName }) {
  const name = reductionBranchName(branch);
  console.log('当前分支>>>>>>>>>>>>>>>', name);
  return shell.exec(
    ` cd ${gitFileName} &&  git fetch --all  \n
    git reset --hard ${name}  \n
    git pull `,
  );
}

export function getRecentGitDiff({ gitFileName }) {
  const { stdout, code, stderr } = shell.exec(
    ` cd ${gitFileName} && git diff --name-only HEAD~ HEAD`,
  );
  if (code !== 0 || stderr) {
    throw new Error('gitDiff error');
  }
  const arr = stdout.split('\n');
  const changeFileNameArr = arr
    .map(v => {
      return getGitChangeFileName(v);
    })
    .filter(v => v);
  return Array.from(new Set(changeFileNameArr));
}

export function getGitDiff({ gitFileName }) {
  const { stdout, code, stderr } = shell.exec(
    ` cd ${gitFileName} && git diff --name-only HEAD~ HEAD`,
  );
  if (code !== 0 || stderr) {
    throw new Error('gitDiff error');
  }
  const arr = stdout.split('\n');
  return Array.from(new Set(arr));
}

export function getGitFileNameByUrl(gitUrl) {
  const matchReg = /\/(.*).git/;
  const res = gitUrl.match(matchReg);
  const newArr = res[1].split('/')
  const name = newArr[newArr.length - 1]
  console.log('getGitFileNameByUrl... name...', name)
  if (!name) {
    throw new Error('git git file name error');
  }
  return name
}

export function getGitChangeFileName(name, str = 'src/libs/') {
  // src/libs/CustomizeLegend/lib/index.js 只要 CustomizeLegend
  if (!name) {
    return;
  }
  if (!name.includes(str)) {
    return;
  }
  const arr = name.split(str);
  if (arr.length !== 2) {
    return;
  }
  const str1 = arr[1];
  // 此时 str1 可能包含 /lib /config /data.js 其中之一
  const libStr = '/lib';
  const configStr = '/config';
  const dataStr = '/data.js';
  if (str1.includes(libStr)) {
    const arr2 = str1.split(libStr);
    return arr2[0];
  }
  if (str1.includes(configStr)) {
    const arr2 = str1.split(configStr);
    return arr2[0];
  }
  if (str1.includes(dataStr)) {
    const arr2 = str1.split(dataStr);
    return arr2[0];
  }
}

export const checkGitPathAndGetData = gitUrl => {
  const screenGitUrl =
    'ssh://git@180.167.234.224:10108/3dl-fe/df-visual-big-screen-building-system.git';
  const libGitUrl = 'ssh://git@180.167.234.224:10108/customization/df-screen-libs.git';
  const data = {
    [screenGitUrl]: {
      nodeShellName: 'newScreenBuild',
    },
    [libGitUrl]: {
      nodeShellName: 'libBuild',
    },
  };
  if (data[gitUrl]) {
    // 这是专属在微软云上访问内网的gitlab的
    return data[gitUrl];
  }
  // 找不到就是通用打包
  return {
    nodeShellName: 'universalBuild',
  }
};

export function doFetchGit(props) {
  const { hasCode, branchPath } = props;
  const res = hasCode ? hasGitCode(props) : noGitCode(props);
  const { code, stderr } = res;
  if (code !== 0) {
    doError(branchPath, stderr);
  }
}

export function doError(branchPath, stderr) {
  fs.removeSync(branchPath);
  throw new Error(stderr);
}

const hasFile = (fileNames, type) => {
  for (const fileName of fileNames) {
    if (fileName.includes(type)) {
      return true
    }
  }
}

export const feChange = (fileNames, filePath) => {
  const feDistPath = `${filePath}/dist`
  if (!fs.existsSync(feDistPath)) {
    return true
  }
  return hasFile(fileNames, 'src') && !hasFile(fileNames, 'server')
}

export const beChange = (fileNames, filePath) => {
  const beDistPath = `${filePath}/serverDist`
  if (!fs.existsSync(beDistPath)) {
    return true
  }
  return hasFile(fileNames, 'server')
}


export const getRecentGitChangeFile = ({ gitFileName }) => {
  const { stdout, code, stderr } = shell.exec(
    ` cd ${gitFileName} && git diff --name-only HEAD~ HEAD`,
  );
  if (code !== 0 || stderr) {
    throw new Error('gitDiff error');
  }
  const arr = stdout.split('\n');
  console.log('gitchangeFile--------', arr)
  return arr
}

export const getSrcPageChangeFile = (arr) => {
  // src/pages/Test/index.js
  // src/pages/index.js
  const str = 'src/pages/'
  const srcPageFiles = arr.filter(v => v.includes(str))
  let pluginFileNames = []
  for (const v of srcPageFiles) {
    const arr = v.split(str);
    const str2 = arr[1]
    const arr2 = str2.split('/');
    if (arr2.length === 2) {
      pluginFileNames.push(arr2[0])
    }
  }
  console.log('pluginFileNamespluginFileNames', pluginFileNames)
  return pluginFileNames
}

export const tranformGitUrl = (gitUrl) => {
  const oldStr = 'git@agitlab.dfocus.co:'
  const newStr = 'ssh://git@180.167.234.224:10108/'
  return gitUrl.replace(oldStr, newStr)
}

export const getCurrentBranch = (currentGitPath) => {
  const { stdout, code, } = shell.exec(
    `cd ${currentGitPath} && git symbolic-ref --short HEAD`,
  );
  return stdout.trim()
}