export default (api, opts) => {
  // 'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js',
  // 'https://cdnjs.cloudflare.com/ajax/libs/antd/3.26.15/antd.min.js',
  // 'https://unpkg.com/react@16/umd/react.production.min.js',
  // 'https://unpkg.com/react-dom@16/umd/react-dom.production.min.js',
  // const { isProduction } = opts;
  const { DP_ENV_KEY, } = process.env;
  const isProduction = DP_ENV_KEY === 'release';
  console.log('addHTMLHeadScript>>>>>>DP_ENV_KEY === release', isProduction);
  const bodySrcArr = [
    './js/moment.min.js',
    './js/antd.min.js',
    './pageStatic/static/fengmap.min.js',
    './pageStatic/static/l7.js',
  ];
  const bodyDevSrcArr = [
    'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/antd/3.26.15/antd.js',
    'https://3dl.dfocus.top/api/static/fengmap.min.js',
    'https://unpkg.com/@antv/l7@2.2.31/dist/l7.js',
  ];

  const headerSrcArr = ['./js/react.production.min.js', './js/react-dom.production.min.js'];
  const headerDevSrcArr = [
    'https://unpkg.com/react@16.13.1/umd/react.development.js',
    'https://unpkg.com/react-dom@16.13.1/umd/react-dom.development.js',
  ];
  const reactSrcArr = isProduction ? headerSrcArr : headerDevSrcArr;
  const bodySrc = isProduction ? bodySrcArr : bodyDevSrcArr;

  for (const v of reactSrcArr) {
    api.addHTMLHeadScript({
      content: '',
      src: v,
    });
  }
  for (const v of bodySrc) {
    api.addHTMLScript({
      content: '',
      src: v,
    });
  }
};
