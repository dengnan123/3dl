import API from '../helpers/api';
import { loadScript } from '@/helpers/screen';

import { isPrivateDeployment, getStaticUrl } from '@/config';

export function addApiHost(opts) {
  return API.post(`/apiHost`, opts);
}

export function updateApiHost(opts) {
  return API.patch(`/apiHost`, opts);
}

export function deleteApiHost(opts) {
  return API.patch(`/apiHost/delete`, opts);
}

export function findApiHostList(opts) {
  if (isPrivateDeployment) {
    const url = getStaticUrl('DP_STATIC_APIHOST');
    return loadScript(url, 'DP_STATIC_APIHOST');
  }
  return API.get(`/apiHost`, { params: opts });
}

export function addEnv(opts) {
  return API.post(`/apiHost/env`, opts);
}

export function updateEnv(opts) {
  return API.patch(`/apiHost/env`, opts);
}

export function deleteEnv(opts) {
  return API.patch(`/apiHost/env/delete`, opts);
}

export function findEnvList(opts) {
  if (isPrivateDeployment) {
    const url = getStaticUrl('DP_STATIC_ENV');
    return loadScript(url, 'DP_STATIC_ENV');
  }
  return API.get(`/apiHost/env`, { params: opts });
}

export function updateEnvChecked(opts) {
  return API.patch(`/apiHost/env/check`, opts);
}

/**
 * 获取大屏所有信息的聚合接口
 */
export function getPageAggregateApi(opts) {
  if (isPrivateDeployment) {
    const url = getStaticUrl('DP_AGGREGATE', opts.pageId);
    return loadScript(url, 'DP_AGGREGATE');
  }
  return API.get(`/page/aggregate`, { params: opts });
}

/**
 * 获取大屏的pageWrapList
 */
export function getPageWrapList(params) {
  return API.get(`/page/pageWrap`, { params });
}

/**
 * 获取数据库sql查询语句列表
 * @param {object} params
 */
export function getSqlQueryList(params) {
  return API.get(`/page-comp/queries`, { params });
}
