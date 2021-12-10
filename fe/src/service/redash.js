import API from '../helpers/api';

// 获取列表
export function fetchRedushDatasourceList(params) {
  return API.get(`/query/datasource`, { params });
}

// 获取列表
export function fetchRedushDatasourceListById(params) {
  return API.get(`/query/datasource/${params.id}`);
}

/**
 * 测试数据库是否可以连接
 */
export function testConnection(params) {
  return API.post('/query/database/test', params);
}
