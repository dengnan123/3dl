const request = require('request');
const fs = require('fs-extra');

function fetchPost(url, params, codeFilePath) {
  return new Promise((resolve, reject) => {
    const writeStream = fs.createWriteStream(codeFilePath);
    request
      .post(url, { json: true, body: params })
      .on('error', function(err) {
        console.log('ererer',err)
        reject(err);
      })
      .on('response', function(response) {
        console.log('response'); // 200
      })
      .pipe(writeStream);
    writeStream.on('finish', data => {
      console.log('finishfinish')
      resolve();
    });
  });
}

module.exports = {
  fetchPost,
};
