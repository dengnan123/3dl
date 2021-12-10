import React, { useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import 'animate.css';
import styles from './FlipNumber.less';
import classnames from 'classnames';

import { v4 } from 'uuid';

function FlipNumber(props) {
  const { number, animationConfig } = props;
  const {
    numTextAlign,
    numColor,
    numFontSize,
    numPadding,
    play,
    animateType,
    speed,
    delay,
    interval,
  } = animationConfig;

  const convertNumToArray = num => {
    return num?.toString().split('');
  };

  const numberNodes = useMemo(() => {
    return convertNumToArray(number).map((num, index) => {
      if (isNaN(Number(num))) {
        return (
          <div
            key={`${index}-${num}`}
            style={{
              width: 'fit-content',
              height: numFontSize * 1.5,
              textAlign: numTextAlign,
              color: numColor,
              fontSize: numFontSize,
              padding: numPadding,
            }}
          >
            {num}
          </div>
        );
      } else {
        return (
          <div
            className={
              play
                ? `animate__animated animate__${animateType}  animate__${speed} animate__delay-${delay}s`
                : ''
            }
            key={`${index}-${num}`}
            style={{
              width: 'fit-content',
              height: numFontSize * 1.5,
              textAlign: numTextAlign,
              color: numColor,
              fontSize: numFontSize,
              padding: numPadding,
            }}
          >
            {num}
          </div>
        );
      }
    });
  }, [play, number, animateType, speed, delay, numTextAlign, numColor, numFontSize, numPadding]);

  const gamblingStyle = useMemo(() => {
    return convertNumToArray(number).map((num, index) => {
      const scrollClass = `numbers-scroll${num}-${speed}`;
      if (isNaN(Number(num))) {
        return (
          <div className={styles.num_arr} key={`${num}-${index}`}>
            <div
              key={`${index}-${num}`}
              className={styles.numList}
              style={{
                textAlign: numTextAlign,
                color: numColor,
                fontSize: numFontSize,
                padding: numPadding,
              }}
            >
              <label>{num}</label>
            </div>
          </div>
        );
      } else
        return (
          <div
            className={styles.num_arr}
            style={{ width: 'fit-content', height: numFontSize * 1.5 }}
            key={`${num}-${index}`}
          >
            <div
              key={`${num}-${index}`}
              className={classnames(styles.numList, styles[scrollClass])}
              style={{
                transform: `translateY(-${num * 100}%)`,
                textAlign: numTextAlign,
                color: numColor,
                fontSize: numFontSize,
                padding: numPadding,
              }}
            >
              <label>0</label>
              <label>1</label>
              <label>2</label>
              <label>3</label>
              <label>4</label>
              <label>5</label>
              <label>6</label>
              <label>7</label>
              <label>8</label>
              <label>9</label>
            </div>
          </div>
        );
    });
  }, [play, number, animateType, numTextAlign, numColor, numFontSize, numPadding]);

  return animateType === 'gambling' ? gamblingStyle : numberNodes;
}

FlipNumber.propTypes = {
  number: PropTypes.isRequired,
  animationConfig: PropTypes.object,
};

export default FlipNumber;
