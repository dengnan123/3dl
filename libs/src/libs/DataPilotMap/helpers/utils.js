import API from '../../../helpers/api';
import { MapLevel } from './enums';

/**
 * 获取API，打包之后大屏系统会在window上挂载DP_PROXY_API，本地开发用API
 */
export function getMapApiAndUrl() {
  const MAP_API = window.DP_PROXY_API || API;
  const MAP_API_PREFIX = window.DP_PROXY_API ? '' : '/3dl/api';
  const MAP_API_URL = `${MAP_API_PREFIX}/page-comp/apiProxy`;
  return { MAP_API, MAP_API_URL };
}

/**
 * 通过adcode获取地图数据, 目前已经将数据全部下载到本地
 * @param {string} adcode
 * @see http://datav.aliyun.com/tools/atlas/#&lat=31.80289258670676&lng=104.2822265625&zoom=4
 */
export function getMapData(adcode) {
  const { MAP_API, MAP_API_URL } = getMapApiAndUrl();
  return new Promise(async resolve => {
    try {
      let res = await MAP_API.post(MAP_API_URL, {
        condition: {},
        cusHeaders: {},
        dataApiUrl: `https://geo.datav.aliyun.com/areas_v2/bound/${adcode}_full.json`,
        methodType: 'GET',
      });

      if (!res || res?.errorCode) {
        res = await MAP_API.post(MAP_API_URL, {
          condition: {},
          cusHeaders: {},
          dataApiUrl: `https://geo.datav.aliyun.com/areas_v2/bound/${adcode}.json`,
          methodType: 'GET',
        });
      }

      if (res?.errorCode) {
        resolve();
        return;
      }
      resolve(res);
    } catch (err) {
      resolve();
    }
  });
}

/**
 * 获取所有地图数据 { adcode: { name, level } }
 */
export function getAllMapInfo() {
  const { MAP_API, MAP_API_URL } = getMapApiAndUrl();

  return new Promise(async resolve => {
    try {
      const res = await MAP_API.post(MAP_API_URL, {
        condition: {},
        cusHeaders: {},
        dataApiUrl: `https://geo.datav.aliyun.com/areas_v2/bound/infos.json`,
        methodType: 'GET',
      });

      if (!res || res?.errorCode) {
        resolve();
        return;
      }
      resolve(res);
    } catch (err) {
      resolve();
    }
  });
}

/**
 * 检查mapLevel是否存在枚举中
 */
export function isValidMapLevel(mapLevel) {
  return Object.values(MapLevel).includes(mapLevel);
}
