import React from 'react';
import PropTypes from 'prop-types';

import styles from './index.less';

function Demo(props) {
  const styleConfig = props.value || {};

  // 基础配置
  const basic = { backgroundColor: 'rgba(255,255,255,1)', ...styleConfig?.basic };

  // loading容器配置
  const container = { width: 120, height: 180, ...styleConfig?.container };

  // loading图形配置
  const loadingGraph = {
    width: 120,
    height: 120,
    borderRadius: 120,
    borderWidth: 2,
    borderTopColor: 'rgba(241, 143, 91, 0)',
    borderRightColor: 'rgba(241, 143, 91, 1)',
    borderBottomColor: 'rgba(241, 143, 91, 0)',
    borderLeftColor: 'rgba(241, 143, 91, 1)',
    animationDirection: 'initial',
    ...styleConfig?.loadingGraph,
  };

  // loading文字配置
  const loadingText = {
    show: true,
    text: 'LOADING...',
    color: 'rgba(241, 143, 91, 1)',
    fontSize: 14,
    fontWeight: 700,
    ...styleConfig?.loadingText,
  };
  const { show, text, ...restLoadingText } = loadingText;
  const loadingTextStyle = {
    ...restLoadingText,
    lineHeight: `${loadingGraph.height}px`,
    display: show ? 'block' : 'none',
  };

  // 底部文字配置
  const desc = {
    show: true,
    text: 'DFOCUS 3DL',
    color: 'rgba(241, 143, 91, 1)',
    fontSize: 14,
    fontWeight: 700,
    ...styleConfig?.desc,
  };
  const { show: descShow, text: descText, ...restDescStyle } = desc;
  const descStyle = { ...restDescStyle, display: descShow ? 'block' : 'none' };

  return (
    <div className={styles['loading']} style={basic}>
      <div style={container}>
        <div className={styles['circle-loading']} style={loadingGraph}></div>
        <div className={styles['text-loading']} style={loadingTextStyle}>
          {text}
        </div>
        <p className={styles['text-tip-loading']} style={descStyle}>
          {descText}
        </p>
      </div>
    </div>
  );
}

Demo.propTypes = {
  value: PropTypes.object,
};

export default Demo;
