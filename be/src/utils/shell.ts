// const shell = require('shelljs');
import * as shell from 'shelljs';
import * as path from 'path';

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
