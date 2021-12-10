import PropTypes from 'prop-types';

import { get } from 'lodash';
import moment from 'moment';
import { DATE_TIME_FORMAT } from '../helpers/const';
export const PROPTYPES = {
  column: PropTypes.object,
  onFilterChange: PropTypes.func,
  onFilterSearch: PropTypes.func,
};

/**
 * 过滤emit的参数
 * @param {*} value
 * @param {*} column
 * @returns
 */
export function filterEmitParamsByProps(value, column) {
  const { filterKey, onFilterParams, dataIndex } = column;
  let emitParams = { [filterKey || dataIndex]: value };
  if (onFilterParams && typeof onFilterParams === 'function') {
    emitParams = onFilterParams(value, column);
  }
  return emitParams;
}

/**
 * 过滤emit的参数
 * @param {*} value
 * @param {*} column
 * @returns
 */
export function filterRangeDateEmitParamsByProps(value, column, format = DATE_TIME_FORMAT) {
  const { filterKey, onFilterParams } = column;
  // let emitParams = { [filterKey || dataIndex]: value }
  const start = get(value, [0]);
  const end = get(value, [1]);
  let emitParams = {
    [get(filterKey, [0]) || 'startDate']: start ? moment(start).format(format) : '',
    [get(filterKey, [1]) || 'endDate']: end ? moment(end).format(format) : '',
  };
  if (onFilterParams && typeof onFilterParams === 'function') {
    emitParams = onFilterParams(value, column);
  }
  return emitParams;
}

/**
 * 过滤emit的参数
 * @param {*} value
 * @param {*} column
 * @returns
 */
export function filterRangeNumberEmitParamsByProps(value, column, format = DATE_TIME_FORMAT) {
  const { filterKey, onFilterParams } = column;
  // let emitParams = { [filterKey || dataIndex]: value }
  const start = get(value, [0]);
  const end = get(value, [1]);
  let emitParams = {
    [get(filterKey, [0]) || 'startPrice']: start,
    [get(filterKey, [1]) || 'endPrice']: end,
  };
  if (onFilterParams && typeof onFilterParams === 'function') {
    emitParams = onFilterParams(value, column);
  }
  return emitParams;
}
