import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './index.less';
import FlipNumber from './FlipNumber';

import { v4 } from 'uuid';

function NumberScroll(props) {
  const { style = {}, data = {} } = props;

  const [numCount, setNumCount] = useState(121);

  useEffect(() => {
    if (JSON.stringify(data) !== '{}') {
      let num = data?.result;
      setNumCount(num ? num : 121);
    }
  }, [data]);

  //test
  const {
    // Basic layout
    containerWidth = '100%',
    containerHeight = '100%',
    borderWidth = 0,
    borderColor = 'rgba(16,105,108,1)',
    borderRadius = 0,
    flexDirection = 'column',
    // Label
    enableLabel,
    labelText = '今日到岗',
    labelFontSize = 28,
    labelColor = 'rgba(255,255,255,1)',
    labelTextAlign = 'center',
    labelBackgroundColor = 'rgba(13,71,80,1)',
    labelPadding = 0,
    // Number
    numFontSize = 48,
    numColor = 'rgba(249,155,12,1)',
    numAlign = 'center',
    numTextAlign = 'center',
    numBg = 'rgba(13,51,63,1)',
    numPadding = 0,
    // Animation
    playScroll = false,
    animateType = 'flipInX',
    speed = 'default',
    delay = '0',
    autoRolling = false,
    interval = 5000,
  } = style;

  const [currentId, setCurrentId] = useState('');

  useEffect(() => {
    let timer = null;
    timer =
      autoRolling &&
      setInterval(() => {
        const uid = v4();
        setCurrentId(uid);
      }, interval);
    return () => {
      clearInterval(timer);
    };
  }, [autoRolling, interval]);

  return (
    <main
      className={styles.container}
      style={{
        flexDirection,
        width: containerWidth,
        height: containerHeight,
        border: `${borderWidth}px solid ${borderColor}`,
        borderRadius,
      }}
    >
      {enableLabel && (
        <div
          className="header-area"
          style={{
            display: flexDirection === 'row' && 'flex',
            backgroundColor: labelBackgroundColor,
            textAlign: labelTextAlign,
            color: labelColor,
            fontSize: labelFontSize,
            padding: labelPadding,
          }}
        >
          <div
            style={{
              margin: flexDirection === 'row' && 'auto',
            }}
          >
            {labelText}
          </div>
        </div>
      )}

      <div
        className={styles.num_area}
        style={{
          justifyContent: numAlign,
          backgroundColor: numBg,
        }}
      >
        <FlipNumber
          key={currentId}
          number={numCount}
          animationConfig={{
            numTextAlign,
            numColor,
            numFontSize,
            numPadding,
            play: playScroll,
            animateType,
            speed,
            delay,
            interval: interval,
          }}
        />
      </div>
    </main>
  );
}

NumberScroll.propTypes = {
  style: PropTypes.object,
  data: PropTypes.object,
};

export default NumberScroll;
