import React, { useCallback } from 'react';
import { Input } from 'antd';
import { filterEmitParamsByProps, PROPTYPES } from '../const';

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
  const { options, inputProps, inputStyle, ...otherProps } = filterProps || {};
  return (
    <Input.Search
      placeholder={title}
      onChange={onChange}
      onSearch={onSearch}
      allowClear
      maxLength={30}
      {...otherProps}
      style={inputStyle}
    />
  );
}
InputFilter.propTypes = PROPTYPES;

export default InputFilter;
