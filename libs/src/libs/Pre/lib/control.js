import styles from './index.less';
import React, { Fragment } from 'react';
import { Icon } from 'antd';

const Control = props => {
  const { style, prePage, nextPage, preDis, nextDis } = props;
  const { leftControl, rightControl, leftControlData = {}, rightControlData = {} } = style || {};

  const leftSty = {
    ...leftControlData,
    background: `url(${leftControlData.src}) 0px 0px / 100% 100%`,
  };
  if (preDis) {
    leftSty.background = 'unset';
  }

  const rightSty = {
    ...rightControlData,
    background: `url(${
      nextDis ? rightControlData.disSrc : rightControlData.src
    }) 0px 0px / 100% 100%`,
  };
  if (nextDis) {
    rightSty.background = 'unset';
  }

  if (leftControl && rightControl) {
    return (
      <Fragment>
        <div style={leftSty} onClick={prePage} className={styles.svgStyle} />
        <div style={rightSty} onClick={nextPage} className={styles.svgStyle} />
      </Fragment>
    );
  }

  return (
    <div
      className={styles.btnDiv}
      style={{ padding: style.padding + 'px', margin: style.margin + 'px' }}
    >
      <Icon
        type="left"
        onClick={prePage}
        style={{
          backgroundColor: preDis ? style.disBgColor : style.bgColor,
          height: style.height,
          width: style.width,
          fontSize: style.fontSize,
        }}
        className={preDis ? styles.dis : styles.icon}
      />
      <Icon
        type="right"
        onClick={nextPage}
        style={{
          backgroundColor: nextDis ? style.disBgColor : style.bgColor,
          height: style.height,
          width: style.width,
          fontSize: style.fontSize,
        }}
        className={nextDis ? styles.dis : styles.icon}
      />
    </div>
  );
};

export default Control;
