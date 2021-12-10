import React, { useCallback } from 'react';
import { DatePicker } from 'antd';
import { filterRangeDateEmitParamsByProps, PROPTYPES } from '../const';
import { RANGE_PICKER_RANGES } from '../../helpers/const';
import styles from '../../index.less';

const { RangePicker } = DatePicker;

/**
 * 日期范围选择器
 * @param {*} param
 */
function RangeDateFilter({ column, onFilterChange, onFilterSearch }) {
  const { filterProps } = column;
  const { type, format, ...otherProps } = filterProps || {};

  const onChange = useCallback(
    (dates, dateStrings) => {
      let parsedDateStrings = [];
      const [start, end] = dates;
      if (!start || !end) {
        parsedDateStrings = null;
      } else {
        parsedDateStrings = [start.startOf('days'), end.endOf('days')];
      }
      const emitParams = filterRangeDateEmitParamsByProps(parsedDateStrings, column, format);
      onFilterSearch(emitParams);
    },
    [column, format, onFilterSearch],
  );

  return (
    <RangePicker
      // getCalendarContainer={trigger => trigger.parentNode}
      onChange={onChange}
      ranges={RANGE_PICKER_RANGES}
      {...otherProps}
      className={styles.range}
    />
  );
}
RangeDateFilter.propTypes = PROPTYPES;

export default RangeDateFilter;
