import React, { useCallback, useState } from 'react';
import { InputNumber } from '../../components/index';
import { filterEmitParamsByProps, PROPTYPES } from '../const';

/**
 * 数字输入
 * @param {*} param
 */
function NumberFilter({ column, onFilterChange, onFilterSearch }) {
  const { title, filterProps } = column;
  const [value, setValue] = useState('');
  const onChange = useCallback(
    value => {
      console.log('NumberFilter', value);

      const emitParams = filterEmitParamsByProps(value, column);
      onFilterChange(emitParams);
      setValue(value);
    },
    [onFilterChange, column],
  );
  const onSearch = useCallback(
    value => {
      onFilterSearch(filterEmitParamsByProps(value, column));
      setValue(value);
    },
    [column, onFilterSearch],
  );
  const { options, inputProps, type, inputStyle, ...otherProps } = filterProps || {};

  return (
    <InputNumber
      style={inputStyle}
      placeholder={title}
      onChange={onChange}
      onSearch={onSearch}
      allowClear
      value={value}
      max={99999999}
      {...otherProps}
      {...inputProps}
    />
  );
}
NumberFilter.propTypes = PROPTYPES;

export default NumberFilter;
