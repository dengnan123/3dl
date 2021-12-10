import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styles from './index.less';

function AutoScrollText(props) {
  const { style = {}, data = {}, width: containerWidth } = props;
  const [translateX, setTranslateX] = useState(containerWidth);
  const {
    value: styleValue = '这是一条会滚动的字符串 这是一条会滚动的字符串 这是一条会滚动的字符串！！！',
    speed = 500,
    fontSize = 14,
    color = 'rgba(66, 66, 66, 1)',
    fontWeight = 400,
    wordSpacing,
    letterSpacing,
  } = style;

  const textRef = useRef(null);

  const { value: dataValue } = data || {};

  const finalValue = dataValue || styleValue;

  useEffect(() => {
    let clock;
    if (!textRef.current) {
      return () => clearInterval(clock);
    }
    const contentWidth = textRef.current.offsetWidth;

    console.log(contentWidth, '目标滚动文字实际长度', textRef.current.getBoundingClientRect());
    const perTranslateX = 0.001 * speed;

    setTranslateX(containerWidth);

    clock = setInterval(() => {
      setTranslateX(x => {
        if (x < -contentWidth) {
          return (x = containerWidth);
        }
        return x - perTranslateX;
      });
    }, 10);

    return () => clearInterval(clock);
  }, [finalValue, speed, fontSize, fontWeight, wordSpacing, letterSpacing, containerWidth]);

  return (
    <div className={styles.container}>
      <span
        className={styles.scroll}
        ref={textRef}
        style={{
          transform: `translateX(${translateX}px)`,
          color,
          fontSize,
          fontWeight,
          wordSpacing,
          letterSpacing,
        }}
      >
        {finalValue}
      </span>
    </div>
  );
}

AutoScrollText.propTypes = {
  style: PropTypes.object,
  data: PropTypes.object,
};

export default AutoScrollText;
