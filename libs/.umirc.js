// ref: https://umijs.org/config/
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const Config = require('webpack-chain');
const path = require('path');
const config = new Config();

export default {
  treeShaking: true,
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: false,
        dynamicImport: false,
        title: '大屏组件库',
        dll: false,

        routes: {
          exclude: [/components\//],
        },
      },
    ],
    [
      './devUmiPlugins/umiReplacePlugin',
      {
        replacor: [
          {
            file: path.resolve(__dirname, 'src/libs/HouseWeatherPanel/lib/index.js'),
            from: [`import '../../WeatherPanel/assets/fonts/iconfont.less'`],
            to: [`// import '../../WeatherPanel/assets/fonts/iconfont.less'`]
          },
          {
            file: path.resolve(__dirname, 'src/libs/WeatherPanel/lib/index.js'),
            from: [`import '../assets/fonts/iconfont.less'`],
            to: [`// import '../assets/fonts/iconfont.less'`]
          }
        ]
      }
    ]
  ],
  chainWebpack(config, { webpack }) {
    // config.plugin('monaco-editor').use(
    //   new MonacoWebpackPlugin({
    //     languages: ['json', 'javascript', 'typescript'],
    //   }),
    // );
  },
  targets: {
    ie: 11,
  },
  proxy: {
    '/3dl': {
      target: 'https://3dl.dfocus.top/',
      changeOrigin: true,
      pathRewrite: { '^/3dl': '' },
    },
  },
};
