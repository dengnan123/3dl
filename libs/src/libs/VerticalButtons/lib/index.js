import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { getNameByLang } from '../../../helpers/lang';
import RenderSvg from '../../../components/RenderSvg';
import styles from './index.less';

const VerticalButtons = props => {
  const {
    style: {
      divBgColor = 'rgba(0, 0, 0, 0)',
      divRadius = '0px',
      rowType = 'vertical',
      contentVertival = false,
      buttonWidth = 80,
      buttonHeight = 28,
      fontSize = 12,
      textAlign = 'center',
      paddingLeft = 0,
      radius = '0px',
      buttonSpacing = 10,
      fontColor = '#4A4A4A',
      hilightFontColor = '#ffffff',
      initHighlight = true,
      bgColor,
      hilightBgColor = '#4A90E2',
      borderWidth = 0,
      borderColor,
      hilightBorderColor,
      buttonGroup = [{ label: '按钮', labelEn: '按钮', compKey: '', compValue: '' }],
      showIcon,
      iconSize,
      iconHeight,
      iconMarginRight,
      defaultInitHighlightIndex,
      isSetDefaultIndex,
    },
    onChange,
    data,
    otherCompParams = {},
    lang = 'en-US',
    shouldClearParams,
    isHidden,
  } = props;
  const { currentParamsKey } = otherCompParams || {};
  const { list } = data || {};

  let buttonsList = (buttonGroup || []).map(b => {
    return {
      name: getNameByLang(lang, b.label, b.labelEn),
      key: b.compKey,
      value: b.compValue,
    };
  });
  if (list && list.length !== 0) {
    buttonsList = list;
  }

  const { activeIndex: propsActiveIndex } = data || {};
  const _fontColor = data?.fontColor || fontColor;
  const _bgColor = data?.bgColor || bgColor;
  const _borderColor = data?.borderColor || borderColor;
  const _hlFontColor = data?.hilightFontColor || hilightFontColor;
  const _hlBgColor = data?.hilightBgColor || hilightBgColor;
  const _hlBorderColor = data?.hilightBorderColor || hilightBorderColor;

  const [activeKey, setActiveKey] = useState(initHighlight ? 0 : -1);

  const _onClick = useCallback((current, activeIndex) => {
    // const { key, value } = current;
    // const activeKey = [null, undefined].includes(propsActiveIndex)
    //   ? activeIndex
    //   : propsActiveIndex;
    const activeKey = activeIndex;
    setActiveKey(activeKey);
    // console.log('VerticalButtons121: ', { [key]: value, ...otherCompParams });
    // onChange && onChange({ [key]: value, ...otherCompParams, _typeIndex: activeIndex });
  }, []);

  useEffect(() => {
    if (currentParamsKey || currentParamsKey === 0) {
      return setActiveKey(currentParamsKey);
    }
  }, [currentParamsKey]);

  useEffect(() => {
    // if (isSetDefaultIndex === false) {
    //   return;
    // }
    if (propsActiveIndex || propsActiveIndex === 0) {
      return setActiveKey(propsActiveIndex);
    }
    if (defaultInitHighlightIndex || defaultInitHighlightIndex === 0) {
      return setActiveKey(defaultInitHighlightIndex);
    }
  }, [propsActiveIndex, defaultInitHighlightIndex, isSetDefaultIndex]);

  const currentButton = buttonsList[activeKey] || {};

  useEffect(() => {
    const { key, value } = currentButton;
    console.log('VerticalButtons1212: ', { [key]: value, ...otherCompParams });
    onChange && onChange({ [key]: value, ...otherCompParams, _typeIndex: activeKey });
  }, [activeKey, currentButton, onChange, otherCompParams]);

  useEffect(() => {
    if (shouldClearParams || isHidden) {
      const activeKey = propsActiveIndex || (initHighlight ? 0 : -1);
      setActiveKey(activeKey);
    }
  }, [shouldClearParams, propsActiveIndex, isHidden, initHighlight]);

  return (
    <div
      className={styles.buttonGroup}
      style={{ backgroundColor: divBgColor, borderRadius: divRadius }}
    >
      {(buttonsList || []).map((item, index) => {
        const isActive = activeKey === index;
        const isLast = index === buttonsList.length - 1;

        let divStyles = {
          marginBottom: buttonSpacing,
        };

        let spanStyles = {};
        if (textAlign === 'left') {
          divStyles.paddingLeft = paddingLeft;
        }
        if (rowType !== 'vertical') {
          divStyles.float = 'left';
          divStyles.marginBottom = 0;
          divStyles.marginRight = isLast ? 0 : buttonSpacing;
        }
        if (contentVertival) {
          spanStyles = {
            position: 'absolute',
            display: 'block',
            width: fontSize,
            height: 'auto',
            lineHeight: `${fontSize + 6}px`,
            overflow: 'hidden',
            wordBreak: 'break-all',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          };
        }

        return (
          <div
            className={styles.item}
            key={`${item.name}-${index}`}
            style={{
              position: 'relative',
              width: buttonWidth,
              height: buttonHeight,
              textAlign,
              backgroundColor: isActive ? _hlBgColor : _bgColor,
              border: `${borderWidth}px solid ${isActive ? _hlBorderColor : _borderColor}`,
              borderRadius: radius,
              ...divStyles,
            }}
            onClick={() => _onClick(item, index)}
          >
            {showIcon ? (
              <RenderSvg
                style={{
                  fontSize: `${iconSize}px`,
                  height: iconHeight,
                  width: iconSize,
                  marginRight: iconMarginRight,
                  color: isActive ? _hlFontColor : _fontColor,
                }}
                svgStr={item.svgStr}
              />
            ) : null}
            <span
              style={{
                fontSize,
                color: isActive ? _hlFontColor : _fontColor,
                lineHeight: `${buttonHeight}px`,
                ...spanStyles,
              }}
            >
              {item.name}
            </span>
          </div>
        );
      })}
    </div>
  );
};

VerticalButtons.propTypes = {
  onChange: PropTypes.func,
  style: PropTypes.object,
  lang: PropTypes.string,
};

export default VerticalButtons;
