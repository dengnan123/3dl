// const fs = require('fs-extra');
import * as shell from 'shelljs';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as chmodr from 'chmodr'
// import a  from '@/'
const { writeFile, ensureDirSync } = fs;
const { writeFileSync, readFileSync } = fs;

const writeJson = ({ data, filePath, fileName }) => {
  const filePathNmae = `${filePath}/${fileName}`;
  return writeFile(filePathNmae, JSON.stringify(data, null, 2), {
    encoding: 'utf8',
  });
};

export const makeFilePath = filePath => {
  fs.ensureDirSync(filePath);
};

export const deleteFilePath = filePath => {
  if (fs.existsSync(filePath)) {
    fs.removeSync(filePath);
  }
};

export const basePath = path.resolve(__dirname, '../../../static');

export const cpFilesToOtherPath = (newDistPath, oldPath) => {
  const files = fs.readdirSync(newDistPath);
  const tmpPath = `${oldPath}/tmp`
  // chmodr.sync(oldPath, 0o777)
  for (const file of files) {
    const oldFilePath = `${oldPath}/${file}`;
    const newFilePath = `${newDistPath}/${file}`;
    const bakFilePath = `${tmpPath}/${file}`
    // 先把老组件移动到临时文件件里面
    const hasOldFile = fs.existsSync(oldFilePath)
    if (hasOldFile) {
      fs.moveSync(oldFilePath, bakFilePath);
    }
    try {
      fs.moveSync(newFilePath, oldFilePath);
      // cp 成功后，再把老组件删掉
      console.log(`move组件success`)
      if (hasOldFile) {
        console.log(`删除备份组件`)
        fs.removeSync(bakFilePath)
      }
    } catch (err) {
      console.log(`${file}--move失败`, err)
      console.log(`hasOldFile`, hasOldFile)
      // 如果cp 失败，就把备份组件恢复到原来的位置
      if (hasOldFile) {
        fs.moveSync(bakFilePath, oldFilePath);
        console.log('组件恢复成功', file)
      }
    }
  }
};

export const getTsOrJsPath = filePath => {
  // 默认进来都是 .ts结尾的
  if (fs.existsSync(filePath)) {
    return filePath;
  }
  const arr = filePath.split('.ts');
  return `${arr[0]}.js`;
};


export const readTempAndWriteData = ({ data, filePath, fileName }) => {
  const getKey = () => {
    if (fileName.includes('dataSource')) {
      return 'DP_STATIC_DATASOURCE';
    }
    if (fileName.includes('pageComp')) {
      return 'DP_STATIC_PAGECOMP';
    }
    if (fileName.includes('page')) {
      return 'DP_STATIC_PAGE';
    }
    if (fileName.includes('apiHost')) {
      return 'DP_STATIC_APIHOST';
    }
    return 'DP_STATIC_ENV';
  };
  const DP_GLOBAL_KEY = getKey();
  const tempPath = path.resolve(__dirname, '../../shells/temp.txt');
  const initData = readFileSync(tempPath, 'utf-8');
  const newstr = initData.replace('DP_GLOBAL_KEY', DP_GLOBAL_KEY);
  const newstr2233 = newstr.replace(
    'DP_GLOBAL_DATA',
    `${JSON.stringify(data, null, 2)}`
  );
  const filePathNmae = `${filePath}/${fileName}`;
  console.log('readTempAndWriteData....', filePathNmae)
  writeFileSync(filePathNmae, newstr2233, {
    encoding: 'utf8',
  });
};

export const writeDataToTempJs = ({ data, tmpDistFilePath, fileName }) => {
  const DP_GLOBAL_KEY = 'DP_AGGREGATE';
  const tempPath = path.resolve(__dirname, '../../shells/temp.txt');
  const initData = readFileSync(tempPath, 'utf-8');
  const newstr = initData.replace('DP_GLOBAL_KEY', DP_GLOBAL_KEY);
  const newstr2 = newstr.replace(
    'DP_GLOBAL_DATA',
    `${JSON.stringify(data, null, 2)}`
  );
  const filePathNmae = `${tmpDistFilePath}/pageStatic/${fileName}`;
  writeFileSync(filePathNmae, newstr2, {
    encoding: 'utf8',
  });
} 

/**
 * 获取地图ID 通过style
 */
export const getMapIdByCompList = (mapArr = []) => {
  const getMapIdArr = (style) => {
    return Object.keys(style).map(key => {
      const mapConfig = style[key]
      if (mapConfig?.mapId) {
        return mapConfig.mapId
      }
      return null
    }).filter(v => v)
  }
  let mapIdArr = []
  for (const v of mapArr) {
    const idArr = getMapIdArr(v.style)
    mapIdArr = [...mapIdArr, ...idArr]
  }
  return mapIdArr
}

/**
 * 把数据写入json文件
 */
export const writeDataToJson = ({ data, tmpDistFilePath, fileName }) => {
  const filePathNmae = `${tmpDistFilePath}/pageStatic/${fileName}`;
  writeFileSync(filePathNmae, JSON.stringify(data, null, 2), {
    encoding: 'utf8',
  });
}

/**
 * 根据key获取组件列表里面的所有key值
 */
export const getCompNameArrHashByKey = (complist, keys) => {
  let objHash = keys.reduce((pre, next) => {
    return {
      ...pre,
      [next]: []
    }
  }, {})
  const getChild = (complist) => {
    for (const v of complist) {
      const { compName, style, child = [] } = v
      if (keys.includes(compName)) {
        objHash[compName] = [
          ...objHash[compName],
          v
        ]
      }
      if (child?.length) {
        getChild(child)
      }
    }
  }
  getChild(complist)
  return objHash
}

