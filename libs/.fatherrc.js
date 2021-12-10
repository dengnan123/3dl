import commonjs from 'rollup-plugin-commonjs';
import multi from '@rollup/plugin-multi-entry';

const options = {
  entry: 'src/libs/index.js',
  extraBabelPresets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'entry',
        modules: false,
        targets: 'ie >= 8',
      },
    ],
  ],
  extraBabelPlugins: [
    [
      'babel-plugin-import',
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
      },
    ],
    [
      '@babel/plugin-transform-runtime',
      {
        corejs: 2, // 参考官方文档
      },
      '@babel/plugin-transform-runtime'
    ],
  ],
  extraRollupPlugins: [commonjs({})],
  cssModules: true,
  extractCSS: true,
  lessInBabelMode: true,
  runtimeHelpers: true,
  esm: 'babel',
  cjs: 'babel',
  autoprefixer: {
    browsers: ['ie>9', 'Safari >= 6'],
  },
};

export default options;
