import API from '@/helpers/api';

/**
 * 获取日志列表
 * @param {object} params
 * @param {number} params.pageNumber
 * @param {number} params.pageSize
 * @param {string} params.keyword
 * @param {number} params.startTime
 * @param {number} params.endTime
 * @param {string} params.tagId
 */
export function fetchLogList(params) {
  return API.get(`/log`, { params });
}
