import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

import { getNameByLang } from '../../../helpers/lang';

import { Button } from 'antd';

import RenderSvg from '../../../components/RenderSvg';

import styles from './index.less';

const ButtonGroup = props => {
  const {
    style: {
      buttonWidth = 80,
      buttonHeight = 28,
      fontSize = 12,
      textAlign = 'center',
      radius = 2,
      buttonSpacing = 10,
      type,
      hilightType,
      showIcon,
      iconSize,
      iconMarginRight,
      customize,
      fontColor,
      initHighlight = true,
      hilightFontColor,
      bgColor,
      hilightBgColor,
      borderWidth,
      borderColor,
      hilightBorderColor,
      buttonGroup = [],
    },
    onChange,
    data,
    otherCompParams = {},
    lang = 'en-US',
    shouldClearParams,
    isHidden,
  } = props;

  const { activeIndex: propsActiveIndex } = data || {};
  const _fontColor = data?.fontColor || fontColor;
  const _bgColor = data?.bgColor || bgColor;
  const _borderColor = data?.borderColor || borderColor;
  const _hlFontColor = data?.hilightFontColor || hilightFontColor;
  const _hlBgColor = data?.hilightBgColor || hilightBgColor;
  const _hlBorderColor = data?.hilightBorderColor || hilightBorderColor;

  console.log('object');

  const [activeKey, setActiveKey] = useState(propsActiveIndex || (initHighlight ? 0 : -1));

  const _onClick = useCallback(
    (current, activeIndex) => {
      const { compKey, compValue } = current;
      const key = [null, undefined].includes(propsActiveIndex) ? activeIndex : propsActiveIndex;
      setActiveKey(key);

      console.log('ButtonGroup: ', { [compKey]: compValue, ...otherCompParams });
      onChange && onChange({ [compKey]: compValue, ...otherCompParams });
    },
    [onChange, otherCompParams, propsActiveIndex],
  );

  useEffect(() => {
    if ([null, undefined].includes(propsActiveIndex)) {
      return;
    }
    setActiveKey(propsActiveIndex);
  }, [propsActiveIndex]);

  useEffect(() => {
    if (shouldClearParams || isHidden) {
      const activeKey = propsActiveIndex || (initHighlight ? 0 : -1);
      setActiveKey(activeKey);
    }
  }, [shouldClearParams, propsActiveIndex, isHidden, initHighlight]);

  return (
    <div className={styles.buttonGroup}>
      {(buttonGroup || []).map((item, index) => {
        const isActive = activeKey === index;
        const isfirst = index === 0;
        const isLast = index === buttonGroup.length - 1;
        const commonProps = { key: index, onClick: () => _onClick(item, index) };
        const borderLTRadius = !isfirst && buttonSpacing === 0 ? 0 : radius;
        const borderRTRadius = !isLast && buttonSpacing === 0 ? 0 : radius;
        const borderRBRadius = !isLast && buttonSpacing === 0 ? 0 : radius;
        const borderLBRadius = !isfirst && buttonSpacing === 0 ? 0 : radius;
        const borderRadius = `${borderLTRadius}px ${borderRTRadius}px ${borderRBRadius}px ${borderLBRadius}px`;
        return !customize ? (
          <div
            className={styles.item}
            {...commonProps}
            style={{ marginRight: isLast ? 0 : buttonSpacing }}
          >
            <Button
              type={isActive ? hilightType : type}
              style={{
                fontSize,
                width: buttonWidth,
                height: buttonHeight,
                borderRadius,
                textAlign,
              }}
            >
              {getNameByLang(lang, item.label, item.labelEn)}
            </Button>
          </div>
        ) : (
          <div
            className={styles.item}
            {...commonProps}
            style={{
              marginRight: isLast ? 0 : buttonSpacing,
              color: isActive ? _hlFontColor : _fontColor,
            }}
          >
            {showIcon ? (
              <RenderSvg
                style={{
                  fontSize: `${iconSize}px`,
                  height: buttonHeight,
                  width: iconSize,
                  marginRight: iconMarginRight,
                  color: isActive ? _hlFontColor : _fontColor,
                }}
                svgStr={item.svgStr}
              />
            ) : null}
            <div
              className={styles.btn}
              style={{
                fontSize,
                width: buttonWidth,
                height: buttonHeight,
                lineHeight: `${buttonHeight}px`,
                borderRadius,
                textAlign,
                color: isActive ? _hlFontColor : _fontColor,
                backgroundColor: isActive ? _hlBgColor : _bgColor,
                border: `${borderWidth}px solid ${isActive ? _hlBorderColor : _borderColor}`,
              }}
            >
              {getNameByLang(lang, item.label, item.labelEn)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

ButtonGroup.propTypes = {
  onChange: PropTypes.func,
  style: PropTypes.object,
  lang: PropTypes.string,
};

export default ButtonGroup;
