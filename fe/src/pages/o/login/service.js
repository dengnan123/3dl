import API from '../../../helpers/api';

export function login(data) {
  return API.post('user/login', data);
}

/**
 * 用户注册
 * @param {Object} data
 * @param {string} data.userName
 * @param {string} data.password
 */
export function registerUser(data) {
  return API.post(`/user`, data);
}
