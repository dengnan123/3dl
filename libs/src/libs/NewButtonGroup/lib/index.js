import { useState, useCallback, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDeepCompareEffect } from 'react-use';
import { Button } from 'antd';
import RenderSvg from '../../../components/RenderSvg';
import styles from './index.less';

const NewButtonGroup = props => {
  const {
    style: {
      compKey = 'buttonGroup',
      initOnChange = true,
      justifyContent = 'flex-start',
      buttonWidth,
      buttonHeight,
      padding = '0 0 0 0',
      fontSize = 14,
      textAlign = 'center',
      radius = 4,
      buttonSpacing = 5,
      type = 'default',
      hilightType = 'primary',
      showIcon = false,
      iconSize,
      iconMarginRight,
      customize = false,
      fontColor = 'rgba(0, 0, 0, 0.65)',
      disabledFontColor = 'rgba(0, 0, 0, 0.25)',
      hilightFontColor = '',
      bgColor,
      disabledBgColor = '#f5f5f5',
      hilightBgColor = '#1890ff',
      borderWidth,
      borderColor,
      disabledBorderColor,
      hilightBorderColor,
      buttonGroup = [
        { label: 'A', value: 'a' },
        { label: 'B', value: 'b' },
      ],
    },
    onChange,
    data,
    shouldClearParams,
    isHidden,
  } = props;

  const { activeKey: propsActiveKey, buttonGroup: propsButtonGroup } = data || {};
  const _fontColor = data?.fontColor || fontColor;
  const _bgColor = data?.bgColor || bgColor;
  const _borderColor = data?.borderColor || borderColor;
  const _disabledFontColor = data?.disabledFontColor || disabledFontColor;
  const _disabledBgColor = data?.disabledBgColor || disabledBgColor;
  const _disabledBorderColor = data?.disabledBorderColor || disabledBorderColor;
  const _hlFontColor = data?.hilightFontColor || hilightFontColor;
  const _hlBgColor = data?.hilightBgColor || hilightBgColor;
  const _hlBorderColor = data?.hilightBorderColor || hilightBorderColor;

  const finalGroup = propsButtonGroup || buttonGroup || [];

  const [activeKey, setActiveKey] = useState(propsActiveKey);

  const onChangeRef = useRef(onChange);

  const _onClick = useCallback(
    current => {
      const value = current?.value;
      setActiveKey(value);

      console.log('click: ', { [compKey]: { ...current, _type: 'click' } });
      onChange && onChange({ [compKey]: { ...current, _type: 'click' } });
    },
    [onChange, compKey],
  );

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useDeepCompareEffect(() => {
    const btns = finalGroup?.filter(n => !n?.disabled) || [];
    const initKey = btns?.[0]?.value;
    const activeKey = propsActiveKey || initKey;
    const initData = btns?.find(n => n?.value === activeKey);
    if (!initData) return;
    setActiveKey(activeKey);
    console.log({ [compKey]: { ...initData, _type: 'init' } });
    initOnChange &&
      onChangeRef.current &&
      onChangeRef.current({ [compKey]: { ...initData, _type: 'init' } });
  }, [propsActiveKey, finalGroup, compKey, initOnChange]);

  useDeepCompareEffect(() => {
    if (!shouldClearParams && !isHidden) return;

    const btns = finalGroup?.filter(n => !n?.disabled) || [];
    const initKey = btns?.[0]?.value;
    const activeKey = propsActiveKey || initKey;
    const initData = btns?.find(n => n?.value === activeKey);

    if (!initData) return;
    setActiveKey(activeKey);
    console.log({ [compKey]: { ...initData, _type: 'reset' } });
    onChangeRef.current && onChangeRef.current({ [compKey]: { ...initData, _type: 'reset' } });
  }, [shouldClearParams, propsActiveKey, isHidden, finalGroup, compKey]);

  return (
    <div className={styles.buttonGroup} style={{ justifyContent }}>
      {finalGroup?.map((item, index) => {
        const isActive = activeKey === item?.value;
        const disabled = item?.disabled ?? false;
        // const isfirst = index === 0;
        const isLast = index === finalGroup?.length - 1;
        const cursor = disabled ? 'not-allowed' : 'pointer';
        const commonProps = { key: index, onClick: disabled ? null : () => _onClick(item), cursor };
        // const borderLTRadius = !isfirst && buttonSpacing === 0 ? 0 : radius;
        // const borderRTRadius = !isLast && buttonSpacing === 0 ? 0 : radius;
        // const borderRBRadius = !isLast && buttonSpacing === 0 ? 0 : radius;
        // const borderLBRadius = !isfirst && buttonSpacing === 0 ? 0 : radius;
        // const borderRadius = `${borderLTRadius}px ${borderRTRadius}px ${borderRBRadius}px ${borderLBRadius}px`;
        const borderRadius = radius;

        let color = _fontColor;
        let bgColor = _bgColor;
        let borderColor = _borderColor;

        if (isActive) {
          color = _hlFontColor;
          bgColor = _hlBgColor;
          borderColor = _hlBorderColor;
        }

        if (disabled) {
          color = _disabledFontColor;
          bgColor = _disabledBgColor;
          borderColor = _disabledBorderColor;
        }
        return !customize ? (
          <div
            className={styles.item}
            {...commonProps}
            style={{ marginRight: isLast ? 0 : buttonSpacing }}
          >
            <Button
              type={isActive ? hilightType : type}
              disabled={disabled}
              style={{
                fontSize,
                width: buttonWidth,
                height: buttonHeight,
                padding,
                borderRadius,
                textAlign,
              }}
            >
              {item?.label}
            </Button>
          </div>
        ) : (
          <div
            className={styles.item}
            {...commonProps}
            style={{
              marginRight: isLast ? 0 : buttonSpacing,
              color,
            }}
          >
            {showIcon ? (
              <RenderSvg
                style={{
                  fontSize: `${iconSize}px`,
                  height: buttonHeight,
                  width: iconSize,
                  marginRight: iconMarginRight,
                  color,
                }}
                svgStr={item?.svgStr}
              />
            ) : null}
            <div
              className={styles.btn}
              style={{
                fontSize,
                width: buttonWidth,
                height: buttonHeight,
                padding,
                lineHeight: `${buttonHeight}px`,
                borderRadius,
                textAlign,
                color,
                backgroundColor: bgColor,
                border: `${borderWidth}px solid ${borderColor}`,
                cursor,
              }}
            >
              {item?.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};

NewButtonGroup.propTypes = {
  onChange: PropTypes.func,
  style: PropTypes.object,
  lang: PropTypes.string,
  data: PropTypes.object,
  shouldClearParams: PropTypes.object,
  isHidden: PropTypes.bool,
};

export default NewButtonGroup;
