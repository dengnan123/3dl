import React from 'react';
import PropTypes from 'prop-types';

import Date from './Date';
import Input from './Input';
import Number from './Number';
import RangeNumber from './RangeNumber';
import RangeDate from './RangeDate';
import RangeDateTime from './RangeDateTime';
import Select from './Select';
import Cascader from './Cascader';
import MonthDate from './MonthPicker';
import YearPicker from './YearPicker';
import RangeMonth from './RangeMonth';

const COMPONENT_MAP = {
  text: Input,
  date: Date,
  rangeDate: RangeDate,
  rangeDateTime: RangeDateTime,
  rangeMonth: RangeMonth,
  select: Select,
  cascader: Cascader,
  number: Number,
  rangeNumber: RangeNumber,
  monthDate: MonthDate,
  yearDate: YearPicker,
};

const DEFAULT_KEY = 'text';

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
