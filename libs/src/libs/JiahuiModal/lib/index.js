import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import styles from './index.less';
// import { Modal } from 'antd';

// const status = {
//   red: {
//     backgroundColor: 'rgba(186, 49, 34, 0.6)',
//     border: 'solid 3px #ba3122',
//   },
//   green: {
//     backgroundColor: 'rgba(186, 49, 34, 0.6)',
//     border: 'solid 3px #5aba88',
//   },
// };
function JiahuiModal(props) {
  const { style, otherCompParams = {}, isHidden, onChange } = props;
  const { state, result = {} } = otherCompParams;

  const autoCloseTimer = useRef();
  const {
    BgColor = '',
    innerHeight = '',
    innerWidth = '764px',
    top = '593px',
    left = '605px',
    warpperHeight = '1896px',
    warpperWidth = '2096px',
    delay = 3,
    autoClose = true,
    bookingKey = '使用人',
    depKey = '部门',
    innerBgColor = '#ffffff',
    KeyFont = '36px',
    valueFont = '36px',
    borderRadius = '16px',
    padding = '24px 40px 50px',
    boxShadow = '2px 2px 32px 4px rgba(96, 96, 96, 0.4)',
    ItemBgColor = 'rgba(77,189,222,0.1)',
    ItemPadding = '15px 32px',
    KeyColor = '#606060',
    ValueColor = '#333333',
    KeyWidth = '0 0 316px',
    itemRadius = '12px',

    tagHeight = '64px',
    tagWidth = '144px',
    tagTop = '24px',
    tagRight = '40px',
    tagBRadius = '18px',
    tagTColor = '#ffffff',
    tagBGColor = 'rgba(186, 49, 34, 0.6)',
    tagFont = '32px',
    tagBorder = 'solid 3px #ba3122',
    tagLineHeight = '58px',
    marginBottom = '40px',

    deskLineHeight = '70px',
    deskMargin = '72px 0 45px',
    deskFont = '48px',
    deskTColor = '#333333',
    bgImgUrl = '',
  } = style;

  const tagStyle = {
    width: tagWidth,
    height: tagHeight,
    lineHeight: tagLineHeight,
    top: tagTop,
    right: tagRight,
    borderRadius: tagBRadius,
    color: tagTColor,
    backgroundColor: tagBGColor,
    fontSize: tagFont,
    border: tagBorder,
  };

  const deskStyle = {
    lineHeight: deskLineHeight,
    margin: deskMargin,
    fontSize: deskFont,
    color: deskTColor,
  };

  const warpper = {
    width: warpperWidth,
    height: warpperHeight,
    backgroundColor: BgColor,
    zIndex: 9999,
  };
  const inner = {
    width: innerWidth,
    height: innerHeight,
    top,
    left,
    backgroundColor: innerBgColor,
    boxShadow,
    padding,
    borderRadius,
  };

  if (bgImgUrl && String(bgImgUrl).trim()) {
    inner.backgroundImage = `url('${bgImgUrl}')`;
    inner.backgroundPosition = '0px 0px';
    inner.backgroundSize = '100% 100%';
    inner.backgroundRepeat = 'no-repeat';
  }

  const hideModal = event => {
    event && event.stopPropagation();
    onChange && onChange({ includeEvents: ['hiddenComps'] });
  };

  console.log('inner is', inner, '--otherCompParams--', otherCompParams);

  useEffect(() => {
    if (autoClose && Number(isHidden) === 0) {
      if (autoCloseTimer.current) {
        clearTimeout(autoCloseTimer.current);
      }
      autoCloseTimer.current = setTimeout(() => {
        onChange && onChange({ includeEvents: ['hiddenComps'] });
      }, Number(delay || 2) * 1000);
    }
    // eslint-disable-next-line
  }, [isHidden]);

  if (isHidden) return null;

  return (
    <div style={{ ...warpper }} className={styles.Mask} onClick={e => hideModal(e)}>
      <div style={{ ...inner }} className={styles.info}>
        <div style={{ ...tagStyle }} className={styles.tag}>
          {state === 'red' ? '忙碌' : '空闲'}
        </div>
        <div className={styles.deskName} style={{ ...deskStyle }}>
          {result?.deskName}
        </div>
        <div
          style={{
            marginBottom,
            backgroundColor: ItemBgColor,
            padding: ItemPadding,
            borderRadius: itemRadius,
          }}
          className={styles.item}
        >
          <p style={{ fontSize: KeyFont, color: KeyColor, flex: KeyWidth }} className={styles.key}>
            {bookingKey}
          </p>
          <p style={{ fontSize: valueFont, color: ValueColor }} className={styles.value}>
            {result?.name}
          </p>
        </div>
        <div
          className={styles.item}
          style={{
            backgroundColor: ItemBgColor,
            padding: ItemPadding,
            borderRadius: itemRadius,
          }}
        >
          <p style={{ fontSize: KeyFont, color: KeyColor, flex: KeyWidth }} className={styles.key}>
            {depKey}
          </p>
          <p style={{ fontSize: valueFont, color: ValueColor }} className={styles.value}>
            {result?.dep}
          </p>
        </div>
      </div>
    </div>
  );
}

JiahuiModal.propTypes = {
  style: PropTypes.object,
  data: PropTypes.object,
};

export default JiahuiModal;
