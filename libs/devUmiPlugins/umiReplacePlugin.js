const replace = require('replace-in-file');
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);

function umiReplacePlugin(api, opts) {
  const { replacor = [] } = opts || {};
  const isProduction = process.env.NODE_ENV === 'production';
  if (isProduction) {
    return;
  }
  api.registerCommand(
    'resume',
    {
      hide: true,
    },
    async args => {
      try {
        const resumeReplacor = replacor.map(n => {
          const from = n.to;
          const to = n.from;
          return { file: n.file, to, from };
        });
        const results = await replaceFileContent(resumeReplacor, true);
        api.log.info('撤销内容', results);
        api.log.success('umi-replace-plugin---撤销替换成功');
      } catch (err) {
        api.log.error('umi-replace-plugin---撤销替换失败\n', err);
      }
    },
  );
  api.registerCommand(
    'commentWeather',
    {
      hide: true,
    },
    async args => {
      try {
        const results = await replaceFileContent(replacor);
        api.log.info('替换内容', results);
        api.log.success('umi-replace-plugin---替换成功');
      } catch (err) {
        api.log.error('umi-replace-plugin---替换失败\n', err);
      }
    },
  );
  api.beforeDevServer(async ({ server }) => {
    try {
      const results = await replaceFileContent(replacor);
      api.log.info('替换内容', results);
      api.log.success('umi-replace-plugin---替换成功');
    } catch (err) {
      api.log.error('umi-replace-plugin---替换失败\n', err);
    }
  });
}

async function replaceFileContent(replacor = [], forceReplace = false) {
  let results = [];
  await Promise.all(
    replacor.map(async n => {
      // 需要替换的文件
      let files = n.file;
      // 替换前的内容
      let from = n.from;
      // 替换后的内容
      let to = n.to;
      // 配置
      let options = {};
      const fileContent = await readFile(n.file, { encoding: 'utf8' });
      if (!forceReplace) {
        to = to.filter((n, index) => {
          if (fileContent.includes(n)) {
            from.splice(index, 1);
            return false;
          }
          return true;
        });
      }
      options = { files, from, to };
      const result = replace.sync(options);
      results.push(...result);
    }),
  );

  return results;
}

module.exports = umiReplacePlugin;
