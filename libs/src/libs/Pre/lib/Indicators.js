import React from 'react';
import PropTypes from 'prop-types';

import styles from './index.less';

function Indicators(props) {
  const { onIndicatorClick, style, total, activeIndex } = props;
  const indicatorData = style?.indicatorData || {};
  const show = indicatorData?.show ?? false;
  const bottom = indicatorData?.bottom ?? 30;
  const width = indicatorData?.width ?? 8;
  const height = indicatorData?.height ?? 8;
  const distance = indicatorData?.distance ?? 8;
  const borderRadius = indicatorData?.borderRadius ?? 4;
  const bgColor = indicatorData?.bgColor ?? 'rgba(255,255,255,0.3)';
  const highlightBgColor = indicatorData?.highlightBgColor ?? 'rgba(255,255,255,1)';

  if (!show) return null;

  return (
    <ul className={styles.indicators} style={{ bottom }}>
      {Array(total || 0)
        .fill(0)
        .map((n, index) => {
          const isSelected = activeIndex === index;
          const backgroundColor = isSelected ? highlightBgColor : bgColor;
          return (
            <li
              key={index}
              style={{
                width,
                height,
                backgroundColor,
                borderRadius,
                margin: `0 ${distance / 2}px`,
              }}
              onClick={() => onIndicatorClick(isSelected, index)}
            ></li>
          );
        }, [])}
    </ul>
  );
}

Indicators.propTypes = {
  onIndicatorClick: PropTypes.func,
  style: PropTypes.object,
  total: PropTypes.number,
  activeIndex: PropTypes.number,
};

export default Indicators;
