import React, { useState, useCallback, useEffect, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { InputNumber } from 'antd';
import styles from './index.less';

const InputTRBLValues = forwardRef((props, ref) => {
  const { onChange, value } = props;
  const [{ top, right, bottom, left }, setState] = useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  });

  const updateState = useCallback(payload => setState(state => ({ ...state, ...payload })), []);

  const handleChange = useCallback(
    (v, key) => {
      const obj = { top, right, bottom, left };
      let _value = v;
      let finalValue = undefined;
      if (!v || isNaN(v)) {
        _value = 0;
      }
      obj[key] = _value;
      finalValue = `${obj?.top || 0}px ${obj?.right || 0}px ${obj?.bottom || 0}px ${obj?.left ||
        0}px`;
      onChange && onChange(finalValue);
    },
    [onChange, top, right, bottom, left],
  );

  // value变化更新state
  useEffect(() => {
    if (!isValidData(value)) {
      return;
    }
    const finalValue = getValue(value);
    updateState(finalValue);
  }, [updateState, value]);

  return (
    <section className={styles.inputValues} ref={ref}>
      <InputNumber
        min={0}
        step={1}
        type="integer"
        placeholder="上"
        value={top}
        onChange={v => handleChange(v, 'top')}
      />
      <InputNumber
        min={0}
        step={1}
        type="integer"
        placeholder="右"
        value={right}
        onChange={v => handleChange(v, 'right')}
      />
      <InputNumber
        min={0}
        step={1}
        type="integer"
        placeholder="下"
        value={bottom}
        onChange={v => handleChange(v, 'bottom')}
      />
      <InputNumber
        min={0}
        step={1}
        type="integer"
        placeholder="左"
        value={left}
        onChange={v => handleChange(v, 'left')}
      />
    </section>
  );
});

InputTRBLValues.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.string,
};

export default InputTRBLValues;

function getValue(str = '') {
  const values = str?.split(' ');
  const top = values?.[0]?.replace(/\D/g, '') ?? 0;
  const right = values?.[1]?.replace(/\D/g, '') ?? 0;
  const bottom = values?.[2]?.replace(/\D/g, '') ?? 0;
  const left = values?.[3]?.replace(/\D/g, '') ?? 0;

  return {
    top,
    right,
    bottom,
    left,
  };
}

function isValidData(str) {
  const _s = str || '';
  let isValid = true;
  if (!(typeof _s === 'string')) {
    isValid = false;
  }

  return isValid;
}
