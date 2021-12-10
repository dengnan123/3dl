import { isProduction } from '../helpers/env';
import querystring from 'query-string';

/**
 * 所有的 *_PLACEHOLDER__，在npm run serve启动时，都需要指定运行时需要的值
 * 这个在“Use docker for release”时非常好用，可以针对不同的运行环境使用同一个镜像，指定不同的环境变量
 */
export const STORAGE_TOKEN_KEY = '3dl-platform-token';
export const STORAGE_EXPIRE_DAYS = 49;
export const STORAGE_DOMAIN = window.location.hostname;
export const injectedModule = 'dfocus';

// http://localhost:3000
// https://3dl.dfocus.top/api
// http://40.72.105.107:3003
// http://localhost:3030/static 本地组件库
// http://3dl.dfocus.top/api/static/dist 测试组件库
export const API_HOST = !isProduction ? 'https://3dl.dfocus.top/api' : 'API_HOST_PROD';
export const API_BUILD_HOST = !isProduction
  ? 'https://3dl.dfocus.top/build'
  : 'API_BUILD_HOST_PROD';

export const FENGMAP_API_HOST = 'https://3dl.dfocus.top/fengmap/apis';

/** socket url */
export const API_SOCKET_PORD_HOST = !isProduction ? 'https://3dl.dfocus.top' : 'API_SOCKET_HOST';

export const isPrivateDeployment = process.env.DP_ENV_KEY === 'release';

export const eleStr = !isProduction ? '' : 'ELE_LOCAL_DEP';

export const isElectronLocalDeploy = eleStr.includes('true');

console.log('isPrivateDeployment>>>>>', isPrivateDeployment);
console.log('isElectronLocalDeploy>>>>>', isElectronLocalDeploy);

export const pageStaticBasePath = 'UMI_PUBLIC_PATH/pageStatic';

export const UMD_API_HOST = getUMD_API_HOST();

export const getPreviewApiToken = () => {
  // 默认从连接上获取 token ，如果链接上没有 就是系统默认的token 字符串，便于 启动的时候统一替换
  const { token } = querystring.parse(decodeURI(window.location.search));
  return token;
};

function getUMD_API_HOST() {
  if (!isPrivateDeployment) {
    return 'https://3dl.dfocus.top/api/static/dist';
  }
  return `${pageStaticBasePath}/static/dist`;
}

export const mapServerURL = !isPrivateDeployment
  ? `${API_HOST}/static/maps`
  : `${pageStaticBasePath}/static/maps`;

export const mapThemeURL = !isPrivateDeployment
  ? `${API_HOST}/static/themes`
  : `${pageStaticBasePath}/static/themes`;

export const staticPath = isPrivateDeployment
  ? `${pageStaticBasePath}/static/page`
  : `${API_HOST}/static/page`;

export const getStaticUrl = (key, pageId) => {
  const getUrlByPageId = () => {
    if (!pageId) {
      return {
        DP_STATIC_PAGECOMP: `${pageStaticBasePath}/def-pageComp.js`,
        DP_STATIC_PAGE: `${pageStaticBasePath}/def-page.js`,
        DP_STATIC_DATASOURCE: `${pageStaticBasePath}/def-dataSource.js`,
        DP_STATIC_CUSTOMFUNC: `${pageStaticBasePath}/def-customFunc.js`,
        DP_AGGREGATE: `${pageStaticBasePath}/def-page.js`,
      };
    }
    return {
      DP_STATIC_PAGECOMP: `${pageStaticBasePath}/${pageId}-pageComp.js`,
      DP_STATIC_PAGE: `${pageStaticBasePath}/${pageId}-page.js`,
      DP_STATIC_DATASOURCE: `${pageStaticBasePath}/${pageId}-dataSource.js`,
      DP_STATIC_CUSTOMFUNC: `${pageStaticBasePath}/${pageId}-customFunc.js`,
      DP_AGGREGATE: `${pageStaticBasePath}/${pageId}-page.js`,
    };
  };
  const obj = {
    DP_STATIC_APIHOST: `${pageStaticBasePath}/apiHost.js`,
    DP_STATIC_ENV: `${pageStaticBasePath}/env.js`,
    ...getUrlByPageId(),
  };
  return obj[key];
};

export const DP_BUILD_TIME_KEY = 'DP_BUILD_TIME';
window.isPrivateDeployment = isPrivateDeployment;
