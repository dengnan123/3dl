/* eslint-disable no-unused-vars */
import React, { useCallback, useState } from 'react';
import { InputNumber } from '../../components/index';
import { filterRangeNumberEmitParamsByProps, PROPTYPES } from '../const';

/**
 * 数字输入
 * @param {*} param
 */
function RangeNumberFilter({ column, onFilterChange, onFilterSearch }) {
  const { filterProps } = column;
  const [value, setValue] = useState('');
  const [startValue, setStartValue] = useState('');
  const [endValue, setEndValue] = useState('');
  const onChangeStart = useCallback(
    value => {
      const emitParams = filterRangeNumberEmitParamsByProps([value, endValue], column);
      setStartValue(value);
      onFilterChange(emitParams);
    },
    [onFilterChange, column, endValue],
  );
  const onChangeEnd = useCallback(
    value => {
      const emitParams = filterRangeNumberEmitParamsByProps([startValue, value], column);
      setEndValue(value);
      onFilterChange(emitParams);
    },
    [onFilterChange, column, startValue],
  );
  const onSearchStart = useCallback(
    value => {
      onFilterSearch(filterRangeNumberEmitParamsByProps([value, endValue], column));
      setValue([value, endValue]);
    },
    [column, onFilterSearch, endValue],
  );
  const onSearchEnd = useCallback(
    value => {
      onFilterSearch(filterRangeNumberEmitParamsByProps([startValue, value], column));
      setValue([startValue, value]);
    },
    [column, onFilterSearch, startValue],
  );
  const { options, inputProps, type, ...otherProps } = filterProps || {};

  return (
    <div style={{ display: 'flex' }}>
      <InputNumber
        placeholder="请输入"
        onChange={onChangeStart}
        onSearch={onSearchStart}
        allowClear
        value={startValue}
        max={99999999}
        {...otherProps}
        {...inputProps}
      />
      ~
      <InputNumber
        placeholder="请输入"
        onChange={onChangeEnd}
        onSearch={onSearchEnd}
        allowClear
        value={endValue}
        max={99999999}
        {...otherProps}
        {...inputProps}
      />
    </div>
  );
}
RangeNumberFilter.propTypes = PROPTYPES;

export default RangeNumberFilter;
