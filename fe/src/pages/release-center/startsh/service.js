import API from '@/helpers/api';

// 获取打包脚本列表
export function fetchStartShList() {
  const res = API.get(`/startTemp`);
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(res);
    }, 300);
  });
}

// 新增打包脚本
export function addStartSh(data) {
  return API.post(`/startTemp`, data);
}

// 修改打包脚本
export function updateStartSh(data) {
  return API.patch(`/startTemp`, data);
}

// 删除打包脚本
export function deleteStartSh(data) {
  return API.patch(`/startTemp`, data);
}
