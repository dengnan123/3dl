import API from '../helpers/api';
import { isPrivateDeployment, getStaticUrl } from '@/config';
import { loadScript } from '@/helpers/screen';

export function add(opts) {
  return API.post(`/customFunc`, opts);
}

export function update(opts) {
  return API.patch(`/customFunc`, opts);
}

export function del(opts) {
  return API.patch(`/customFunc/delete`, opts);
}

export function findList(opts) {
  return API.get(`/customFunc`, { params: opts });
}

export function findAllList(opts) {
  if (isPrivateDeployment) {
    const url = getStaticUrl('DP_STATIC_CUSTOMFUNC',opts.pageId);
    return loadScript(url, 'DP_STATIC_CUSTOMFUNC');
  }
  return API.get(`/customFunc/all`, { params: opts });
}
