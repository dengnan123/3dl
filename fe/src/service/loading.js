import API from '../helpers/api';

// 获取所有loading列表
export function fetchLoadingList(params) {
  return API.get(`/loading`, { params });
}

export function fetchLoadingDetail(params) {
  return API.get(`/loading/${params?.id}`);
}

// 添加loading
export function addLoading(data) {
  return API.post(`/loading`, data);
}

// 编辑loading
export function editLoading(data) {
  return API.patch('/loading', data);
}

// 删除loading
export function deleteLoading(data) {
  return API.patch('/loading/delete', data);
}
