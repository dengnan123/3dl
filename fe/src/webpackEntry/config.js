const isProduction = process.env.NODE_ENV === 'production';

const HTML_SRC_PROD = {
  react: './js/react.production.min.js',
  reactDom: './js/react-dom.production.min.js',
  propTypes: './js/prop-types.min.js',
  moment: './js/moment.min.js',
  antd: './js/antd.min.js',
  echarts: './js/echarts.min.js',
};
const HTML_SRC_DEV = {
  react: 'https://unpkg.com/react@16.8.6/umd/react.development.js',
  reactDom: 'https://unpkg.com/react-dom@16.8.6/umd/react-dom.development.js',
  propTypes: 'https://cdnjs.cloudflare.com/ajax/libs/prop-types/15.7.2/prop-types.min.js',
  moment: 'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js',
  antd: 'https://cdnjs.cloudflare.com/ajax/libs/antd/3.26.15/antd.min.js',
  echarts: 'https://cdnjs.cloudflare.com/ajax/libs/echarts/4.8.0/echarts.min.js',
};

module.exports = isProduction ? HTML_SRC_PROD : HTML_SRC_DEV;
