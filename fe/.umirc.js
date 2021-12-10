// ref: https://umijs.org/config/
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const path = require('path');
const {
  UMI_ROUTER_BASE,
  UMI_PUBLIC_PATH,
  FENGMAP_PROD,
  LOADING_SRC,
  isProduction,
} = require('./src/config/env');

export default {
  treeShaking: true,
  base: UMI_ROUTER_BASE,
  publicPath: `${UMI_PUBLIC_PATH}/`,
  theme: './src/themes/index.js',
  targets: {
    ie: 10,
  },
  plugins: [
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: true,
        dynamicImport: {
          webpackChunkName: true,
          level: 2,
        },
        library: 'react',
        title: '3DL',
        routes: {
          exclude: [/components\//],
        },
      },
    ],
    [
      './plugins/addScript',
      {
        isProduction,
      },
    ],
  ],
  externals: {
    fengmap: 'window.fengmap',
  },
  chainWebpack: config => {
    config.plugin('monaco-editor-webpack-plugin').use(
      // 更多配置 https://github.com/Microsoft/monaco-editor-webpack-plugin#options
      new MonacoWebpackPlugin(),
    );
    config
      .plugin('d1-ignore')
      .use(
        // eslint-disable-next-line
        require('webpack/lib/IgnorePlugin'),
        [
          /^((fs)|(path)|(os)|(crypto)|(source-map-support))$/,
          /vs(\/|\\)language(\/|\\)typescript(\/|\\)lib/,
        ],
      )
      .end()
      .plugin('d1-replace')
      .use(
        // eslint-disable-next-line
        require('webpack/lib/ContextReplacementPlugin'),
        [/monaco-editor(\\|\/)esm(\\|\/)vs(\\|\/)editor(\\|\/)common(\\|\/)services/, __dirname],
      );
    return config;
  },
};
