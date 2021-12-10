import { useState, useCallback, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './index.less';

const CustomInput = props => {
  const {
    style: {
      compKey = 'customInput',
      fontSize = 14,
      fontColor = 'rgba(0,0,0,0.65)',
      placeholder = '请输入',
      placeholderFontSize = 14,
      placeholderColor = '#bfbfbf',
      bgColor = '#ffffff',
      borderWidth = 1,
      borderColor = 'rgba(217, 217, 217, 1)',
      borderRadius = '4px 4px 4px 4px',
      padding = '0 0 0 0',
      openDebounce = false,
      debounceWaiting = 800,
    },
    onChange,
    shouldClearParams,
  } = props;

  const onChangeRef = useRef(onChange);

  const inputTimer = useRef(null);

  const [{ value }, setState] = useState({ value: '' });
  const updateState = useCallback(payload => setState(state => ({ ...state, ...payload })), []);

  const handleInputChange = useCallback(
    e => {
      const value = e.target.value;
      updateState({ value });

      inputTimer.current && clearTimeout(inputTimer.current);
      if (!openDebounce) {
        onChangeRef.current && onChangeRef.current({ [compKey]: { _type: 'input', value } });
        return;
      }

      inputTimer.current = setTimeout(() => {
        onChangeRef.current && onChangeRef.current({ [compKey]: { _type: 'input', value } });
        clearTimeout(inputTimer.current);
      }, debounceWaiting);
    },
    [compKey, openDebounce, debounceWaiting, updateState],
  );

  const handleInputFocus = useCallback(() => {
    onChangeRef.current && onChangeRef.current({ [compKey]: { _type: 'focus', value } });
  }, [compKey, value]);

  const handleInputBlur = useCallback(() => {
    onChangeRef.current && onChangeRef.current({ [compKey]: { _type: 'blur', value } });
  }, [compKey, value]);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (!shouldClearParams) return;
    updateState({ value: '' });
    onChangeRef.current && onChangeRef.current({ [compKey]: { _type: 'reset' } });
  }, [shouldClearParams, compKey, updateState]);

  return (
    <div
      className={styles.inputBox}
      style={{ padding, backgroundColor: bgColor, borderWidth, borderRadius, borderColor }}
    >
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        style={{ color: fontColor, fontSize, padding, borderWidth, borderColor: 'transparent' }}
      />
      {isEmpty(value) && (
        <span
          className={styles.placeholder}
          style={{ fontSize: placeholderFontSize, color: placeholderColor }}
        >
          {placeholder}
        </span>
      )}
    </div>
  );
};

CustomInput.propTypes = {
  onChange: PropTypes.func,
  style: PropTypes.object,
  lang: PropTypes.string,
  data: PropTypes.object,
  shouldClearParams: PropTypes.object,
  isHidden: PropTypes.bool,
};

export default CustomInput;

function isEmpty(v) {
  return [undefined, null, ''].includes(v);
}
