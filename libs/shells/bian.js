const rollup = require('rollup');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const babel = require('rollup-plugin-babel');
const replace = require('@rollup/plugin-replace');
const postcss = require('rollup-plugin-postcss');
const image = require('@rollup/plugin-image');
const json = require('rollup-plugin-json');
const nodeGlobals = require('rollup-plugin-node-globals');
const path = require('path');
const fs = require('fs-extra');

const alias = require('@rollup/plugin-alias');
const globals = {
  react: 'React',
  'react-dom': 'ReactDOM',
  'prop-types': 'PropTypes',
  'monaco-editor': 'monacoEditor',
  echarts: 'echarts',
  fengmap: 'fengmap',
  antd: 'antd',
  '@antv/l7': 'l7',
};
const external = Object.keys(globals);
const plugins = [
  commonjs({
    include: /node_modules/,
    transformMixedEsModules: true,
  }),
  resolve({
    mainFields: ['module', 'main', 'browser'],
    browser: true,
    customResolveOptions: {
      moduleDirectory: 'node_modules', // 仅处理node_modules内的库
    },
  }),
  json(),
  image(),
  postcss({
    modules: true, // 增加 css-module 功能
    extensions: ['.less', '.css'],
    use: [
      [
        'less',
        {
          javascriptEnabled: true,
        },
      ],
    ],
  }),
  // babel({
  //   runtimeHelpers: true,
  //   plugins: [
  //     '@babel/plugin-proposal-object-rest-spread',
  //     '@babel/plugin-transform-runtime',
  //     '@babel/plugin-proposal-class-properties',
  //     '@babel/plugin-external-helpers',
  //     '@babel/plugin-proposal-export-default-from',
  //   ],
  //   presets: ['@babel/preset-env'],
  // }),
  replace({
    'process.env.NODE_ENV': JSON.stringify('production'),
  }),
  nodeGlobals(),
  alias({
    entries: [],
  }),
];

async function build() {
  const inputOptions = {
    input: 'test/index.js', // 唯一必填参数
    external,
    plugins,
  };
  const bundle = await rollup.rollup(inputOptions);
  const outputOptions = {
    globals,
    format: 'umd',
    name: 'test',
    file: 'test.js',
  };
  await bundle.generate(outputOptions);
  await bundle.write(outputOptions);
}

build();
