import React, { useCallback } from 'react';
import { Select } from 'antd';
import { filterEmitParamsByProps, PROPTYPES } from '../const';

/**
 * 下拉框
 * @param {*} param
 */
function SelectFilter({ column, onFilterChange, onFilterSearch }) {
  const { filterProps, title } = column;
  const onSearch = useCallback(
    value => {
      const emitParams = filterEmitParamsByProps(value, column);
      onFilterSearch(emitParams);
    },
    [column, onFilterSearch],
  );
  const { type, options, inputStyle, ...otherProps } = filterProps || {};
  return (
    <Select
      style={{ width: '100%', ...inputStyle }}
      // getPopupContainer={trigerNode => trigerNode.parentNode}
      placeholder={title}
      onChange={onSearch}
      {...otherProps}
    >
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

export default SelectFilter;
