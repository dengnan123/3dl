import { useState, useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { isEqual } from 'lodash';
import { reap } from '../../../components/SafeReaper';
import { getNameByLang } from '../../../helpers/lang';
import { Select } from 'antd';
import RenderSvg from '../../../components/RenderSvg';
import styles from './index.less';
function useCompare(value, compare, valueType = 'string') {
  let defaultValue;
  switch (valueType) {
    case 'number':
      defaultValue = 0;
      break;
    case 'string':
      defaultValue = '';
      break;
    case 'boolean':
      defaultValue = false;
      break;
    case 'array':
      defaultValue = [];
      break;
    case 'object':
      defaultValue = {};
      break;
    case 'function':
      defaultValue = () => {};
      break;
    default:
      defaultValue = Symbol();
      break;
  }
  const ref = useRef(defaultValue);

  if (!compare(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
}
const CustomizeSelect = props => {
  const [value, setValue] = useState(undefined);

  const { onChange, style, data, lang = 'en-US', shouldClearParams } = props;

  const dataSource = reap(data, 'dataSource', []);

  // 比较有无变化后的值
  const finalShouldClearParams = useCompare(shouldClearParams, isEqual, 'boolean');
  const finalDataSource = useCompare(dataSource, isEqual, 'array');

  const finalStyle = useCompare(style, isEqual, 'object');

  const {
    width = 80,
    minWidth = 80,
    autoWidth = false,
    height = 28,
    showLabel = true,
    label = '选择区域',
    labelEn = 'Select Area',
    labelColor = '#4a4a4a',
    labelFontSize = 16,
    labelMarginRight = 10,
    placeholder = '请选择',
    textAlign = 'left',
    showSearch = false,
    allowClear = true,
    showArrow = true,
    arrowSvg = '',
    fontSize = 12,
    fontColor,
    borderColor = '#D8D8D8',
    borderSize = 1,
    borderRadius = 4,
    nameKey = 'name',
    valueKey = 'id',
    compKey,
    opFontSize = 16,
    optionBg,
    optionColor,
    paddingTB = 5,
    paddingLR = 15,
    opHeight = 200,
  } = finalStyle;
  //

  const _onSelectChange = useCallback(
    v => {
      const current = finalDataSource.find(item => `${item[valueKey]}` === v);
      const obj = { [compKey]: current };

      setValue(v);
      onChange && onChange(obj);
    },
    [finalDataSource, compKey, onChange, valueKey],
  );

  useEffect(() => {
    const defaultItem = finalDataSource.find(item => item.default) || {};

    const _default = defaultItem[valueKey];

    const newDef = _default ? `${_default}` : undefined;

    setValue(newDef);
    onChange && onChange({ [compKey]: defaultItem, isInit: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalDataSource, valueKey, compKey]);

  useEffect(() => {
    if (finalShouldClearParams) {
      // const obj = { [compKey]: '' };
      setValue(undefined);
      // onChange && onChange(obj);
    }
  }, [finalShouldClearParams, setValue]);

  return (
    <div className={styles.container}>
      {showLabel && (
        <div
          className={styles.label}
          style={{ marginRight: labelMarginRight, color: labelColor, fontSize: labelFontSize }}
        >
          {getNameByLang(lang, label, labelEn)}：
        </div>
      )}
      <Select
        getPopupContainer={triggerNode => {
          return triggerNode;
        }}
        dropdownStyle={{
          marginTop: `${height}px`,
        }}
        dropdownMenuStyle={{
          height: `${opHeight}px`,
        }}
        onChange={_onSelectChange}
        value={value}
        placeholder={placeholder}
        allowClear={allowClear}
        showArrow={showArrow}
        showSearch={showSearch}
        optionFilterProp="children"
        filterOption={(input, option) =>
          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        suffixIcon={
          showArrow && arrowSvg ? (
            <div>
              <RenderSvg svgStr={arrowSvg} />
            </div>
          ) : (
            undefined
          )
        }
        style={{
          fontSize: `${fontSize}px`,
          color: fontColor,
          border: `${borderSize}px solid ${borderColor}`,
          borderRadius,
          minWidth,
          width,
          height,
          lineHeight: `${height - borderSize * 2}px`,
        }}
        className={classnames(styles.content, style[`textAlign${textAlign}`], {
          [styles.autoWidth]: autoWidth,
        })}
      >
        {finalDataSource.map((item, index) => {
          return (
            <Select.Option
              key={index}
              value={`${item[valueKey]}`}
              style={{
                fontSize: `${opFontSize}px`,
                lineHeight: `${opFontSize}px`,
                background: optionBg,
                color: optionColor,
                textAlign: 'left',
                padding: `${paddingTB}px ${paddingLR}px`,
              }}
            >
              {getNameByLang(lang, item[nameKey], item[`${nameKey}En`])}
            </Select.Option>
          );
        })}
      </Select>
    </div>
  );
};

CustomizeSelect.propTypes = {
  onChange: PropTypes.func,
  style: PropTypes.object,
  data: PropTypes.object,
  lang: PropTypes.string,
  shouldClearParams: PropTypes.bool,
};

export default CustomizeSelect;
