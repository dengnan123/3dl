import API from '@/helpers/api';

// 获取配置列表
export function fetchRepaceJsonConfigList() {
  const res = API.get(`/replace?pageSize=999`);
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(res);
    }, 300);
  });
}

// 新增配置
export function addReplaceConfig(data) {
  return API.post(`/replace`, data);
}

// 修改配置
export function updateReplaceConfig(data) {
  return API.patch(`/replace`, data);
}

// 删除配置
export function deleteReplaceConfig(data) {
  return API.patch(`/replace`, data);
}
