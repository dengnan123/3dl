import React, { useCallback } from 'react';
import { DatePicker } from 'antd';
import { filterEmitParamsByProps, PROPTYPES } from '../const';

/**
 * 日期选择器
 * @param {*} param
 */
function DateFilter({ column, onFilterChange, onFilterSearch }) {
  const { filterProps } = column;
  const onChange = useCallback(
    (date, dateString) => {
      const emitParams = filterEmitParamsByProps(dateString, column);
      onFilterSearch(emitParams);
    },
    [column, onFilterSearch],
  );
  const { type, inputStyle, ...otherProps } = filterProps || {};
  return (
    <DatePicker
      // getCalendarContainer={trigger => trigger.parentNode}
      placeholder="请选择"
      style={{ minWidth: 120, inputStyle }}
      onChange={onChange}
      {...otherProps}
    />
  );
}
DateFilter.propTypes = PROPTYPES;

export default DateFilter;
