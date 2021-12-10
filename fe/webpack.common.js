const path = require('path');
// const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const theme = path.resolve(__dirname, './src/themes');
const svgSpriteDirs = [
  path.resolve(__dirname, 'src/svg/'),
  require.resolve('antd').replace(/index\.js$/, ''),
];


const aliasPath = path.resolve(__dirname, 'src');
console.log('aliasPath---', aliasPath);
module.exports = {
  entry: {
    app: path.resolve(__dirname, './src/webpackEntry/index.js'),
  },
  output: {
    path: path.resolve(__dirname, `./dist`),
    filename: 'bundle.js',
    publicPath: `/`,
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
    umi: 'window',
    'umi/router': 'window',
    'umi-plugin-locale': 'window',
    'ace-builds/src-noconflict/theme-github':'window',
    'ace-builds/src-noconflict/mode-javascript':'window',
    'ace-builds/webpack-resolver':'window',
  },
  devServer: {
    contentBase: path.resolve(__dirname, './dist'),
    host: 'localhost', // 主机地址
    port: 8000, // 端口号
    open: true,
    inline: true,
    hot: true,
    historyApiFallback: true,
    overlay: {
      errors: true,
    },
  },
  resolve: {
    alias: {
      '@': aliasPath,
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  stats: {
    children: false,
    warningsFilter: warn => warn.indexOf('Conflicting order between:') > -1,
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            // cacheDirectory: true,
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          'css-hot-loader',
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          'css-hot-loader',
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: true,
              localIdentName: '[name]_[local]-[hash:base64:5]',
            },
          },
          {
            loader: 'less-loader',
            options: {
              javascriptEnabled: true,
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.less$/,
        include: /node_modules/,
        exclude: /src/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: 'less-loader',
            options: {
              javascriptEnabled: true,
              modifyVars: theme,
            },
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|gif|ttf)$/,
        use: [
          {
            loader: 'url-loader',
          },
        ],
        exclude: svgSpriteDirs,
      },
      {
        test: /\.(svg)$/i,
        loader: 'svg-sprite-loader',
        include: svgSpriteDirs,
      },
    ],
  },
  node: {
    fs: 'empty',
    module: 'empty',
  },
  devtool: false,
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.(css|less)/,
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
  plugins: [
    new SpriteLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/webpackEntry/entry.ejs'), // 模板
      hash: true, // 防止缓存
      polyfill: 'https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/7.12.1/polyfill.min.js',
      react: 'https://unpkg.com/react@16.8.6/umd/react.development.js',
      reactDom: 'https://unpkg.com/react-dom@16.8.6/umd/react-dom.development.js',
      propTypes: 'https://cdnjs.cloudflare.com/ajax/libs/prop-types/15.7.2/prop-types.min.js',
      moment: 'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js',
      antd: 'https://cdnjs.cloudflare.com/ajax/libs/antd/3.26.15/antd.min.js',
      echarts: 'https://cdnjs.cloudflare.com/ajax/libs/echarts/4.8.0/echarts.min.js',
      fengmap: 'https://3dl.dfocus.top/api/static/fengmap.min.js',
      l7: 'https://unpkg.com/@antv/l7@2.2.31/dist/l7.js',
      kinect: '',
    }),
    new CleanWebpackPlugin(),
  ],
};
