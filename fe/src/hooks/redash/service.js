import API from '@/helpers/api';

// 获取列表
export function fetchRedushDatasourceList(params) {
  return API.get(`/query/datasource`, { params });
}

// 获取列表
export function fetchRedushDatasourceListById(params) {
  return API.get(`/query/datasource/${params.id}`, {
    params,
  });
}

// 保存查询语句
export function doSaveQuery(params) {
  return API.post(`/query/save`, params);
}

// 执行查询语句
export function doExecuteQuery(params) {
  return API.post(`/page-comp/apiProxy`, {
    condition: { id: params.id },
    methodType: 'linkDatabase',
  });
}

// 获取  schema 列表
export function getSchemaList(params) {
  return API.get(`/query/schema/${params.data_source_id}`);
}

// 查询API
export function doQuery(params) {
  return API.post(`/query/apiProxy`, params);
}

// 新增数据库

export function addDatabase(params) {
  return API.post(`/query/database`, params);
}

// 获取数据库详情

export function getDatabaseInfo(params) {
  return API.get(`/query/database/${params.id}`);
}

// 测试数据库 是否连通

export function testConnection(params) {
  return API.post(`/query/database/test`, params);
}
