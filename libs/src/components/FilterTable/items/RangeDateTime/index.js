import React, { useCallback } from 'react';
import { RANGE_PICKER_RANGES, DATE_MINUTE_FORMAT, TIME_MINUTE_FORMAT } from '../../helpers/const';
import { DatePicker } from 'antd';
import { filterRangeDateEmitParamsByProps, PROPTYPES } from '../const';
import moment from 'moment';

const { RangePicker } = DatePicker;

const DATE_TIME_SHOW_TIME = {
  format: TIME_MINUTE_FORMAT,
  defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
};

/**
 * 日期时间范围选择器
 * @param {*} param
 */
function RangeDateTimeFilter({ column, onFilterChange, onFilterSearch }) {
  const { filterProps } = column;
  const onChange = useCallback(
    (dates, dateStrings) => {
      let parsedDateStrings = [];
      const [start, end] = dateStrings;
      if (!start || !end) {
        parsedDateStrings = null;
      } else {
        parsedDateStrings = [start, end];
      }

      const emitParams = filterRangeDateEmitParamsByProps(parsedDateStrings, column);
      console.log('emitParams', emitParams);
      onFilterSearch(emitParams);
    },
    [column, onFilterSearch],
  );
  const { type, ...otherProps } = filterProps || {};
  return (
    <RangePicker
      // getCalendarContainer={trigger => trigger.parentNode}
      style={{ width: 'auto' }}
      onChange={onChange}
      ranges={RANGE_PICKER_RANGES}
      showTime={DATE_TIME_SHOW_TIME}
      format={DATE_MINUTE_FORMAT}
      {...otherProps}
    />
  );
}
RangeDateTimeFilter.propTypes = PROPTYPES;

export default RangeDateTimeFilter;
