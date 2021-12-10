import API from '../helpers/api';

export function logout(opts) {
  return API.post(`/user/logout`, opts);
}

// 获取当前用户信息
export function fetchCurrentUser(params) {
  return API.get(`/auth/data`);
}
