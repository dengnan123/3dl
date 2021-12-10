import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';

const LinBar = [
  { name: 'Bar', value: 'bar' },
  { name: 'Line', value: 'line' },
];

function SelectFormItem(props) {
  const { formValue, onItemChange, compName } = props;
  const lowerCaseName = compName.toLowerCase();

  const isLineOrBar = lowerCaseName.includes('bar') || lowerCaseName.includes('line');
  const isRadar = lowerCaseName.includes('radar');

  const selecteOptions = () => {
    if (isLineOrBar) {
      return LinBar.map(t => {
        return (
          <Select.Option value={t.value} key={t.value}>
            {t.name}
          </Select.Option>
        );
      });
    }
    if (isRadar) {
      return (
        <Select.Option value="radar" disabled={true}>
          Radar
        </Select.Option>
      );
    }
    return (
      <Select.Option value="pie" disabled={true}>
        Pie
      </Select.Option>
    );
  };

  return (
    <Select value={formValue} onChange={val => onItemChange && onItemChange(val)}>
      {selecteOptions()}
    </Select>
  );
}

SelectFormItem.propTypes = {
  formValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  compName: PropTypes.string,
  onItemChange: PropTypes.func,
};

export default SelectFormItem;
