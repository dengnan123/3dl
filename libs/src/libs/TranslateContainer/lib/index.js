import { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { omit } from 'lodash';
import { getNameByLang } from '../../../helpers/lang';
import ArrowIcon from '../../../assets/arrow2.svg';

import styles from './index.less';

export const getBasicStyle = style => {
  const newSty = omit(style, 'left', 'top', 'height', 'width');
  return newSty;
};

const TranslateContainer = props => {
  const {
    child = [],
    style: {
      translateX = 0,
      duration = 0.3,
      transitionTimingFunction = 'linear',
      delay = 0,
      btnLabel = '显示',
      btnLabelEn = 'Show',
      btnInvertLabel = '隐藏',
      btnInvertLabelEn = 'Hide',
      btnFontSize = 18,
      btnFontColor = '#ffffff',
      btnWidth = 180,
      btnHeight = 60,
      btnBgColor = '#0E97CF',
      btnBorderRadius = 0,
      btnMarginLeft,
      btnMarginTop = 80,
      iconPosition = 'top',
      iconWidth = 22,
      iconHeight = 11,
      iconMarginTop = 0,
      iconMarginRight = 0,
      iconMarginBottom = 0,
      iconMarginLeft = 0,
      customizeIcon = false,
      iconUrl = '',
    },
    lang = 'en-US',
    onChange,
  } = props;

  const [isTranslate, setIsTranslate] = useState(false);
  const [rotateDeg, setRotateDeg] = useState(180);

  const onBtnClick = useCallback(() => {
    setIsTranslate(!isTranslate);
    // console.log({ isTranslate: !isTranslate });
    onChange && onChange({ isTranslate: !isTranslate });
  }, [isTranslate, onChange, setIsTranslate]);

  useEffect(() => {
    // 根据偏移量的正负值来判断箭头初始朝向
    const x = translateX || 1;
    const isPlus = x / Math.abs(x) === 1;
    const initRotateDeg = isPlus ? 180 : 0;
    const deg = isPlus ? 0 : 180;
    const _rotateDeg = isTranslate ? deg : initRotateDeg;
    setRotateDeg(_rotateDeg);
  }, [translateX, setRotateDeg, isTranslate]);

  const renderBtnContent = () => {
    const arrow = (
      <img
        style={{
          width: iconWidth,
          height: iconHeight,
          marginTop: iconMarginTop,
          marginRight: iconMarginRight,
          marginBottom: iconMarginBottom,
          marginLeft: iconMarginLeft,
          transform: `rotateY(${rotateDeg}deg)`,
        }}
        src={customizeIcon ? iconUrl : ArrowIcon}
        alt="arrow"
      />
    );

    const btnContent = (
      <span>
        {!isTranslate
          ? getNameByLang(lang, btnLabel, btnLabelEn)
          : getNameByLang(lang, btnInvertLabel, btnInvertLabelEn)}
      </span>
    );
    if (['left', 'top'].includes(iconPosition)) {
      return (
        <>
          {arrow}
          {btnContent}
        </>
      );
    } else {
      return (
        <>
          {btnContent}
          {arrow}
        </>
      );
    }
  };

  return (
    <div className={styles.container}>
      <div
        className={styles.content}
        style={{
          transform: `translateX(${isTranslate ? translateX : 0}px)`,
          transitionDuration: `${duration}s`,
          transitionTimingFunction,
          transitionDelay: `${delay}s`,
        }}
      >
        {child.map(v => {
          const { width, height, style, data, renderChildComp } = v;
          const itemProps = {
            width,
            height,
            style,
            position: 'relative',
            margin: 'auto',
            data,
            // ...getBasicStyle(basicStyle),
          };
          return <div style={itemProps}>{renderChildComp}</div>;
        })}
      </div>
      <div
        className={styles.btn}
        style={{
          fontSize: btnFontSize,
          color: btnFontColor,
          width: btnWidth,
          height: btnHeight,
          backgroundColor: btnBgColor,
          borderRadius: btnBorderRadius,
          marginLeft: btnMarginLeft,
          marginTop: btnMarginTop,
          flexDirection: ['left', 'right'].includes(iconPosition) ? 'row' : 'column',
        }}
        onClick={onBtnClick}
      >
        {renderBtnContent()}
      </div>
    </div>
  );
};

TranslateContainer.propTypes = {
  data: PropTypes.object,
  style: PropTypes.object,
  child: PropTypes.array,
  lang: PropTypes.string,
  onChange: PropTypes.func,
};

export default TranslateContainer;
