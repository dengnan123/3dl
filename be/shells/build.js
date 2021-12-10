// #!/usr/bin/env node

const path = require('path');
const fs = require('fs-extra');
const shell = require('shelljs');
const { writeFileSync } = fs;

const writeJson = ({ data, filePath, fileName }) => {
  const filePathNmae = `${filePath}/${fileName}`;
  writeFileSync(filePathNmae, JSON.stringify(data, null, 2), {
    encoding: 'utf8',
  });
};

async function build() {
  try {
    const str = process.argv[2];
    const data = JSON.parse(str);
    const { pageId, compList, queryPageData, queryData, dataSourceList } = data;
    // 先指定路径
    console.log('build  pageIdpageIdpageId', pageId);
    let filePath = path.resolve(__dirname, '../../build');

    fs.ensureDirSync(filePath);
    filePath = `${filePath}/${pageId}`;
    fs.removeSync(filePath);
    fs.ensureDirSync(filePath);

    console.log('开始拉去代码');
    // 从Git拉取代码
    const shellPath = path.resolve(__dirname, `./git.clone.sh ${filePath}`);
    const { code, stdout, stderr } = await shell.exec(shellPath);
    if (code) {
      throw new Error(stderr);
    }
    const pagesPath = `${filePath}/df-visual-big-screen-building-system/src/pages`;

    // 代码分割
    const files = await fs.readdir(
      `${filePath}/df-visual-big-screen-building-system/src/pages`,
    );

    // 把preview 名字改成 index
    await fs.copy(`${pagesPath}/preview`, `${pagesPath}/index`);

    // 删除除了 preview 和 document.ejs 的其他文件和文件夹
    const shouldDelArr = files
      .filter(v => {
        if (v === 'index' || v === 'document.ejs') {
          return false;
        }
        return true;
      })
      .map(v => {
        console.log('要删除的文件', `${pagesPath}/${v}`);
        return fs.remove(`${pagesPath}/${v}`);
      });

    await Promise.all(shouldDelArr);

    console.log('开始打包');
    // 进行前后端同时打包;
    const srcPath = `${filePath}/df-visual-big-screen-building-system/shells/build.sh`;
    const buildRes = await shell.exec(srcPath, {
      cwd: `${filePath}/df-visual-big-screen-building-system`,
    });
    if (buildRes.code) {
      throw new Error('打包失败');
    }

    const newFilePath = `${filePath}/df-visual-big-screen-building-system/df-visual-big-screen-building-system`;
    // 把大屏的静态数据复制到 static 里面
    const staticPath = path.resolve(__dirname, `../../static/${pageId}`);
    console.log('staticPathstaticPath', staticPath);
    fs.copySync(staticPath, `${newFilePath}/static/${pageId}`);

    // 把组件数据变成JSON
    writeJson({
      data: compList,
      filePath: newFilePath,
      fileName: 'pageComp.json',
    });

    // 把页面数据变成JSON
    writeJson({
      data: queryPageData,
      filePath: newFilePath,
      fileName: 'page.json',
    });

    // 把数据源变成JSON
    writeJson({
      data: dataSourceList,
      filePath: newFilePath,
      fileName: 'dataSource.json',
    });

    // 遍历大屏组件 产看是否有地图组件
    let mapId = '';
    for (const v of queryData) {
      const { compName, style } = v;
      if (compName === 'Map') {
        mapId = style.mapId;
        break;
      }
    }

    if (mapId) {
      // 把地图相关信息 复制到文件夹里面
      async function cp(typePath) {
        const mapPath = path.resolve(__dirname, `../../${typePath}`);
        console.log('mapPathmapPath', mapPath);
        const mapFiles = await fs.readdir(mapPath);
        console.log('mapFilesmapFiles', mapFiles);
        const filterList = mapFiles.filter(v => {
          const splitArr = v.split(mapId);
          if (splitArr.length === 2) {
            return true;
          }
          return false;
        });
        fs.ensureDirSync(`${newFilePath}/${typePath}`);
        for (const v of filterList) {
          fs.copySync(`${mapPath}/${v}`, `${newFilePath}/${typePath}/${v}`);
        }
      }
      await Promise.all([cp('static/maps'), cp('static/themes')]);
    }

    // 生成压缩包
    const zipPath = path.resolve(
      __dirname,
      `./zip.sh ${filePath}/df-visual-big-screen-building-system`,
    );
    const zipRes = await shell.exec(zipPath);
    if (zipRes.code) {
      throw new Error('压缩失败');
    }
    process.on('error', err => {
      console.log('errorerrorerror in child:', m);
    });
  } catch (err) {
    console.log('打包报错.......', err);
  }
}

build();
