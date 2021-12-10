const merge = require('webpack-merge');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
// const CompressionPlugin = require('compression-webpack-plugin');
const common = require('./webpack.common');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// const { version } = require('./package.json');
const CopyPlugin = require('copy-webpack-plugin');
const { DP_ENV_KEY } = process.env;
console.log('DP_ENV_KEYDP_ENV_KEY', DP_ENV_KEY);

let fengmap = 'UMI_PUBLIC_PATH/js/fengmap.min.js';
let l7 = 'UMI_PUBLIC_PATH/js/l7.js';
if (DP_ENV_KEY === 'release') {
  fengmap = 'UMI_PUBLIC_PATH/pageStatic/static/fengmap.min.js';
  l7 = 'UMI_PUBLIC_PATH/pageStatic/static/l7.js';
}
let plugins = [
  new HtmlWebpackPlugin({
    template: path.resolve(__dirname, './src/webpackEntry/entry.ejs'), // 模板
    hash: true, // 防止缓存
    // polyfill: 'UMI_PUBLIC_PATH/js/polyfill.min.js',
    // react: 'UMI_PUBLIC_PATH/js/react.production.min.js',
    // reactDom: 'UMI_PUBLIC_PATH/js/react-dom.production.min.js',
    // propTypes: 'UMI_PUBLIC_PATH/js/prop-types.min.js',
    moment: 'UMI_PUBLIC_PATH/js/moment.min.js',
    base:'UMI_PUBLIC_PATH/js/base.js', // base.js 包含 polyfill.min.js  react.production.min.js react-dom.production.min.js prop-types.min.js
    antd: 'UMI_PUBLIC_PATH/js/antd.min.js',
    echarts: 'UMI_PUBLIC_PATH/js/echarts.min.js',
    kinect: 'UMI_PUBLIC_PATH/js/kinectron-client.js',
    fengmap,
    l7,
    isPrivateDeployment: process.env.DP_ENV_KEY === 'release',
  }),
  // new CompressionPlugin({
  //   deleteOriginalAssets: false, // 是否删除压缩前的文件，看情况配置
  //   algorithm: 'gzip', // 压缩算法，默认就是gzip
  // }),
  new CopyPlugin({
    patterns: [{ from: 'public', to: path.resolve(__dirname, `./dist`) }],
  }),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('production'),
    'process.env.DP_ENV_KEY': JSON.stringify(DP_ENV_KEY),
  }),
];

const { ANALYZE } = process.env;

if (ANALYZE) {
  plugins.push(new BundleAnalyzerPlugin());
}
module.exports = merge(common, {
  mode: 'production',
  output: {
    path: path.resolve(__dirname, `./dist`),
    filename: 'bundle.js',
    publicPath: 'UMI_PUBLIC_PATH',
  },
  externals: {
    moment: 'moment',
    antd: 'antd',
    echarts: 'echarts',
  },
  plugins,
});
