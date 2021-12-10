import * as request from 'request';
import * as fs from 'fs';

export function fetchStream(url, params, codeFilePath) {
  return new Promise((resolve, reject) => {
    const writeStream = fs.createWriteStream(codeFilePath);
    request
      .post(url, { json: true, body: params })
      .on('error', function(err) {
        reject(err);
      })
      .pipe(writeStream);
    writeStream.on('finish', data => {
      resolve();
    });
  });
}
