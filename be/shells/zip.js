// #!/usr/bin/env node

const path = require('path');
const fs = require('fs-extra');
const shell = require('shelljs');

async function build() {
  try {
    const str = process.argv[2];
    const data = JSON.parse(str);
    const { filePath } = data;
    
    

    fs.ensureDirSync(filePath);
    filePath = `${filePath}/${pageId}`;
    fs.removeSync(filePath);
    fs.ensureDirSync(filePath);

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
