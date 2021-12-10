import { useState, useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
// import isEqual from 'fast-deep-equal';
import classnames from 'classnames';
import { isEqual } from 'lodash';
import { reap } from '../../../components/SafeReaper';
// import { getNameByLang } from '../../../helpers/lang';

// import { ReactComponent as SelectArrowIcon } from '../../../assets/fam_select_arrow.svg';
import selectArrowIcon from '../../../assets/fam_select_arrow.svg';
import selectArrowBlueIcon from '../../../assets/fam_select_arrow_down_blue.svg';
// import RenderSvg from '../../../components/RenderSvg';

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

const FamSelect = props => {
  const [value, setValue] = useState(undefined);
  const [show, setShow] = useState(false);

  const { onChange, style, data, shouldClearParams } = props;

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
    placeholder = '请选择',
    textAlign = 'left',
    showSearch = false,
    allowClear = true,
    showArrow = true,
    // arrowSvg = '',
    fontSize = 12,
    fontColor,
    // borderColor = '#D8D8D8',
    borderSize = 1,
    // borderRadius = 4,
    // nameKey = 'name',
    valueKey = 'id',
    compKey,
    opFontSize,
    optionBg,
    optionColor,
    paddingTB = 5,
    paddingLR = 15,
    parentId = null,
    menuMarginTop = 0,
  } = finalStyle;

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
      setValue(undefined);
    }
  }, [finalShouldClearParams, setValue, compKey]);

  const _handleToggle = useCallback(
    ({ target: { tagName } }) => {
      if (tagName === 'svg' || tagName === 'LI') {
        return;
      }
      setShow(!show);
    },
    [show],
  );

  return (
    <div className={styles.container}>
      <Select
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
        // suffixIcon={
        //   showArrow && arrowSvg ? (
        //     <div style={{ width: 12 }}>
        //       <RenderSvg svgStr={arrowSvg} />
        //     </div>
        //   ) : (
        //     // <img src={selectArrowIcon} alt="" />

        //   )
        // }
        onDropdownVisibleChange={op => setShow(op)}
        suffixIcon={
          <img
            src={show ? selectArrowBlueIcon : selectArrowIcon}
            alt=""
            className={classnames(styles.colorfulIcon, styles.icon, { [styles.rotate]: !!show })}
            aria-hidden="true"
            style={{ width: 7, height: 4, color: '#999' }}
          />
        }
        style={{
          fontSize: `${fontSize}px`,
          color: fontColor,
          width,
          height,
          minWidth,
          lineHeight: `${height - borderSize * 2}px`,
        }}
        className={classnames(styles.content, style[`textAlign${textAlign}`], {
          [styles.autoWidth]: autoWidth,
        })}
        dropdownClassName={parentId && styles.dropdown}
        dropdownMenuStyle={
          parentId && {
            color: 'red',
            marginTop: menuMarginTop,
          }
        }
        getPopupContainer={triggerElement => {
          if (!parentId) {
            return triggerElement;
          }
          const containerElement = document.getElementById(parentId) || triggerElement;
          return containerElement;
        }}
        onClick={_handleToggle}
      >
        {finalDataSource?.map(item => {
          return (
            <Select.Option
              key={item.id}
              value={`${item[valueKey]}`}
              style={{
                fontSize: opFontSize,
                lineHeight: `${opFontSize}px`,
                background: optionBg,
                color: optionColor,
                textAlign: 'center',
                padding: `${paddingTB}px ${paddingLR}px`,
              }}
            >
              {item.name}
            </Select.Option>
          );
        })}
      </Select>
    </div>
  );
};

FamSelect.propTypes = {
  onChange: PropTypes.func,
  style: PropTypes.object,
  data: PropTypes.object,
  lang: PropTypes.string,
  shouldClearParams: PropTypes.bool,
};

export default FamSelect;
