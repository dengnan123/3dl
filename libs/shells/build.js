const rollup = require('rollup');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const babel = require('rollup-plugin-babel');
const replace = require('@rollup/plugin-replace');
const postcss = require('rollup-plugin-postcss');
const image = require('@rollup/plugin-image');
const json = require('rollup-plugin-json');
const nodeGlobals = require('rollup-plugin-node-globals');
const builtins = require('rollup-plugin-node-builtins');
const path = require('path');
const fs = require('fs-extra');
const { terser } = require('rollup-plugin-terser');
const buildUmd = require('./rollup_build_umd');
// import alias from '@rollup/plugin-alias';
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
    // esmExternals: true,
    // requireReturnsDefault: 'auto',
    transformMixedEsModules:true
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
  babel({
    // exclude: /node_modules/,
    // include:path.resolve(__dirname, 'node_modules/quert'),
    runtimeHelpers: true,
    plugins: [
      '@babel/plugin-proposal-object-rest-spread',
      '@babel/plugin-transform-runtime',
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-external-helpers',
      'lodash',
      '@babel/plugin-proposal-export-default-from'
    ],
    presets: ['@babel/preset-env'],
  }),
  replace({
    'process.env.NODE_ENV': JSON.stringify('production'),
  }),
  nodeGlobals(),
  builtins(),
  alias({
    entries: [],
  }),
  // terser(),
];
const changeFiles = getFiles();
console.log('changeFileschangeFiles',changeFiles)
let inputAndOutputList = changeFiles.reduce((pre, next) => {
  const inputPathName = next;
  const { basePath, key } = getInputPathAndKey(inputPathName);
  const configInputPath = `${basePath}/config/index.js`;
  const libInputPath = `${basePath}/lib/index.js`;
  const dataInputPath = `${basePath}/data.js`;
  const hash = {
    configInputPath: {
      input: configInputPath,
      output: {
        name: `${key}Config`,
        file: `dist/${key}/config.js`,
      },
      modalKey: key,
    },
    libInputPath: {
      input: libInputPath,
      output: {
        name: `${key}Lib`,
        file: `dist/${key}/lib.js`,
      },
      modalKey: key,
    },
    dataInputPath: {
      input: dataInputPath,
      output: {
        name: `${key}Data`,
        file: `dist/${key}/data.js`,
      },
      modalKey: key,
    },
  };
  const arr = [];
  if (fs.existsSync(configInputPath)) {
    arr.push(hash.configInputPath);
  }
  if (fs.existsSync(libInputPath)) {
    arr.push(hash.libInputPath);
  }
  if (fs.existsSync(dataInputPath)) {
    arr.push(hash.dataInputPath);
  }
  return [...pre, ...arr];
}, []);

// inputAndOutputList = buildUmd().filter(v => {
//   if (v.input.includes('config')) {
//     return false;
//   }
//   if (v.input.includes('data')) {
//     return false;
//   }
//   return true;
// });
// inputAndOutputList = inputAndOutputList.filter(v => {
//   const has = hasModalKey({
//     modalKey: v.modalKey,
//   });
//   if (has) {
//     return false;
//   }
//   return true;
// });


console.log('inputAndOutputList........', inputAndOutputList);

async function build() {
  // create a bundle
  for (const opts of inputAndOutputList) {  
    const inputOptions = {
      input: opts.input, // 唯一必填参数
      external,
      plugins,
    };
    const bundle = await rollup.rollup(inputOptions);
    const {
      output: { name, file },
      modalKey,
    } = opts;

    const outputOptions = {
      globals,
      format: 'umd',
      name,
      file,
    };
    if (modalKey === 'AMap' || modalKey === 'DataPilotMap') {
      outputOptions.intro = 'var l7 = window.L7';
    }
    await bundle.generate(outputOptions);
    await bundle.write(outputOptions);
  }
}

build();

// 打完完成后 需要处理一些依赖

function getFiles(params) {
  const options = process.argv;
  console.log('optionsoptions', options);
  let arr = [];
  if (options.length > 2) {
    arr = options.slice(2);
  }
  return arr;
}

function getInputPathAndKey(inputPathName) {
  const baseFilePath = path.resolve(__dirname, '../src/libs');
  const strArr = inputPathName.split('/');
  if (strArr.length === 1) {
    return {
      basePath: `${baseFilePath}/${inputPathName}`,
      key: inputPathName,
    };
  }
  const key = strArr[1];
  const parent = strArr[0];
  return {
    basePath: `${baseFilePath}/${parent}/${key}`,
    key,
  };
}

function hasModalKey({ filePath, modalKey }) {
  const newFilePath = filePath || path.resolve(__dirname, '../umd-dist');
  const files = fs.readdirSync(newFilePath);
  if (files.includes(modalKey)) {
    return true;
  }
  return false;
}
