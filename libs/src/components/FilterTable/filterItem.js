import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  RANGE_PICKER_RANGES,
  TIME_MINUTE_FORMAT,
  DATE_MINUTE_FORMAT,
  DATE_TIME_FORMAT,
} from '@/helpers/const';
import { Input, DatePicker, Select, InputNumber } from 'antd';
import { get } from 'lodash';
import moment from 'moment';
import styles from './index.less';

const { RangePicker } = DatePicker;

const COMPONENT_MAP = {
  text: InputFilter,
  date: DateFilter,
  rangeDate: RangeDateFilter,
  rangeDateTime: RangeDateTimeFilter,
  select: SelectFilter,
  number: NumberFilter,
};
const DEFAULT_KEY = 'text';
const PROPTYPES = {
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
function filterEmitParamsByProps(value, column) {
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
function filterRangeDateEmitParamsByProps(value, column) {
  const { filterKey, onFilterParams } = column;
  // let emitParams = { [filterKey || dataIndex]: value }
  const start = get(value, [0]);
  const end = get(value, [1]);
  let emitParams = {
    [get(filterKey, [0]) || 'startDate']: start ? moment(start).format(DATE_TIME_FORMAT) : '',
    [get(filterKey, [1]) || 'endDate']: end ? moment(end).format(DATE_TIME_FORMAT) : '',
  };
  if (onFilterParams && typeof onFilterParams === 'function') {
    emitParams = onFilterParams(value, column);
  }
  return emitParams;
}

/**
 * 搜索框
 * @param {*} param
 */
function InputFilter({ column, onFilterChange, onFilterSearch }) {
  const { title, filterProps } = column;
  const onChange = useCallback(
    event => {
      const emitParams = filterEmitParamsByProps(event.target.value, column);
      onFilterChange(emitParams);
    },
    [onFilterChange, column],
  );
  const onSearch = useCallback(
    value => {
      onFilterSearch(filterEmitParamsByProps(value, column));
    },
    [column, onFilterSearch],
  );
  const { options, inputProps, ...otherProps } = filterProps || {};
  return (
    <Input.Search
      placeholder={title}
      onChange={onChange}
      onSearch={onSearch}
      allowClear
      {...otherProps}
      {...inputProps}
    />
  );
}
InputFilter.propTypes = PROPTYPES;

/**
 * 搜索框
 * @param {*} param
 */
function NumberFilter({ column, onFilterChange, onFilterSearch }) {
  const { title, filterProps } = column;
  const onChange = useCallback(
    value => {
      const emitParams = filterEmitParamsByProps(value, column);
      onFilterChange(emitParams);
    },
    [onFilterChange, column],
  );
  const onSearch = useCallback(
    event => {
      console.log('NumberFilter event', event);

      onFilterSearch(filterEmitParamsByProps(event.target.value, column));
    },
    [column, onFilterSearch],
  );
  const { options, inputProps, ...otherProps } = filterProps || {};
  return (
    <InputNumber
      placeholder={title}
      onChange={onChange}
      onPressEnter={onSearch}
      allowClear
      max={99999999}
      {...otherProps}
      {...inputProps}
    />
  );
}
NumberFilter.propTypes = PROPTYPES;

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
  const { type, ...otherProps } = filterProps || {};
  return (
    <DatePicker
      placeholder="请选择"
      style={{ minWidth: 120 }}
      onChange={onChange}
      {...otherProps}
    />
  );
}
DateFilter.propTypes = PROPTYPES;

/**
 * 日期范围选择器
 * @param {*} param
 */
function RangeDateFilter({ column, onFilterChange, onFilterSearch }) {
  const { filterProps } = column;
  const onChange = useCallback(
    (dates, dateStrings) => {
      let parsedDateStrings = [];
      const [start, end] = dates;
      if (!start || !end) {
        parsedDateStrings = null;
      } else {
        parsedDateStrings = [start.startOf('days'), end.endOf('days')];
      }
      const emitParams = filterRangeDateEmitParamsByProps(parsedDateStrings, column);
      onFilterSearch(emitParams);
    },
    [column, onFilterSearch],
  );
  const { type, ...otherProps } = filterProps || {};
  return (
    <RangePicker
      onChange={onChange}
      ranges={RANGE_PICKER_RANGES}
      {...otherProps}
      className={styles.range}
    />
  );
}
RangeDateFilter.propTypes = PROPTYPES;

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

/**
 * 下拉框
 * @param {*} param
 */
function SelectFilter({ column, onFilterChange, onFilterSearch }) {
  const { filterProps } = column;
  const onSearch = useCallback(
    value => {
      const emitParams = filterEmitParamsByProps(value, column);
      onFilterSearch(emitParams);
    },
    [column, onFilterSearch],
  );
  const { type, options, ...otherProps } = filterProps || {};
  return (
    <Select style={{ width: '100%' }} placeholder="请选择" onChange={onSearch} {...otherProps}>
      {options &&
        options.length &&
        options.map(({ value, label }) => (
          <Select.Option key={value} value={value}>
            {label}
          </Select.Option>
        ))}
    </Select>
  );
}
SelectFilter.propTypes = PROPTYPES;

/**
 * 表格筛选默认组件 - 文本输入框
 * @param {*} param0
 */
function FilterDefaultComponent(props) {
  const {
    column: { filterProps },
  } = props;
  const FilterComponent =
    COMPONENT_MAP[!filterProps || !filterProps.type ? DEFAULT_KEY : filterProps.type];
  return <FilterComponent {...props} />;
}

FilterDefaultComponent.propTypes = {
  column: PropTypes.object,
  onFilterChange: PropTypes.func,
  onFilterSearch: PropTypes.func,
};

export default FilterDefaultComponent;
