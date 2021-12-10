// const shell = require('shelljs');
import * as shell from 'shelljs';
import * as path from 'path';
import * as replace from 'replace-in-file';

export const zipFile = async ({ filePath, zipName }) => {
  console.log('filePathfilePath', filePath);
  console.log('zipName', zipName);
  const zipStr = `cd ${filePath} && zip -r ${zipName}.zip `;
  const zipPath = path.resolve(__dirname, '../../shells/zip.sh');
  const { code, stdout, stderr } = await shell.exec(
    `${zipPath} ${filePath} ${zipName}`,
  );
  if (code) {
    throw new Error(stderr);
  }
};

/**
 * 获取启动脚本模板
 * @param {object} json
 */
export const getStartTemp = (json = {}) => {
  const UMI_PUBLIC_ = 'UMI_PUBLIC_';
  const startShJson = { [`${UMI_PUBLIC_}PATH`]: '.', ...json };
  const str1 = `#!/bin/bash

echo "============== start pc ================"

pid=\`ps aux | grep -i 'screen-fe' | grep -v grep | awk {'print $2'}\`

if [ ! -n "$pid" ] ;then
  echo "No process found, go ahead as you need"
else
  kill -9 $pid
  echo "Process "$pid" were killed"
fi`;

  const str2 = `DM_DIST_NAME=df-visual-big-screen-building-system
DM_DIST_ZIP_NAME=df-visual-big-screen-building-system.zip

rm -r -f $DM_PATH/$DM_DIST_NAME __MACOSX
unzip -d $DM_PATH/ $DM_PATH/$DM_DIST_ZIP_NAME
chmod 777  -R $DM_PATH/$DM_DIST_NAME/dist

cd $DM_PATH/$DM_DIST_NAME
`;

  const str3 = `npm run start:prod &
echo "============= end pc =================="`;

  let str = str1;
  /**
   * 防止打包做字符串替换
   */
  const DM_ = 'DM_';
  const _PATH = startShJson[`${DM_}PATH`];
  str += `\n\n${DM_}PATH=${_PATH}`;
  str += `\n${str2}`;
  Object.keys(startShJson).forEach(key => {
    if (key === `${DM_}PATH`) {
      return;
    }
    str += `\nexport ${key}=${startShJson[key]}`;
  });
  str += `\n${str3}`;

  return str;
};

function resolveFromRoot(...relativePath) {
  const repPath = path.resolve(__dirname, '..', ...relativePath);
  return repPath;
}

/**
 * 字符串变量替换
 */
export const replaceWithEnv = ({ from, to, baseCodeFilePath }) => {
  const options: any = {
    files: [
      `${baseCodeFilePath}/*.js`,
      `${baseCodeFilePath}/*.html`,
      `${baseCodeFilePath}/pageStatic/*.js`,
    ],
  };
  const newFrom = from.map(key => new RegExp(key, 'g'));
  options.from = newFrom;
  options.to = to;
  console.log(options);
  replace.sync(options);
};


/**
 * 字符串变量替换
 */
export const newReplaceWithEnv = ({ from, to, distFilePath}) => {
  const options: any = {
    files: [
      `${distFilePath}/*.js`,
      `${distFilePath}/*.html`,
      `${distFilePath}/pageStatic/*.js`,
    ],
  };
  const newFrom = from.map(key => new RegExp(key, 'g'));
  options.from = newFrom;
  options.to = to;
  console.log(options);
  replace.sync(options);
};


/**
 * 根据replaceJson 获取from  to
 */
export const getFromAndTo = (replaceJson = {}) => {
  const from = Object.keys(replaceJson);
  const to = from.map(v => {
    return replaceJson[v];
  });
  return {
    from,
    to,
  };
};
