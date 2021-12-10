// ref: https://umijs.org/config/
const CompressionPlugin = require('compression-webpack-plugin');
const { DP_ENV_KEY } = process.env;
export default {
  define: {
    'process.env.NODE_ENV': 'production',
    'process.env.UMI_ENV': 'production', // * 本地开发环境：dev，qa环境：qa，生产环境prod
    'process.env.DP_ENV_KEY': DP_ENV_KEY,
  },
  context: {
    isPrivateDeployment: process.env.DP_ENV_KEY === 'release',
  },
  chainWebpack(config, { webpack }) {
    config.plugin('compression-webpack').use(CompressionPlugin, [
      {
        deleteOriginalAssets: false, // 是否删除压缩前的文件，看情况配置
        algorithm: 'gzip', // 压缩算法，默认就是gzip
        test: /\.js(\?.*)?$/i, // 根据情况配置，此处仅压缩.js
      },
    ]);
  },
};
