/**
 * 这个是针对罗氏的组件，获取链接的参数显示用
 */

import React from 'react';
import { getUrlParam } from '../../../helpers/utils';

const TextStatusLib = props => {
  const { style = {} } = props;
  const {
    borderRadius = 10,
    fontSize,
    color,
    background = '#0066cc',
    paddingLeft,
    paddingRight,
    paddingTop,
    paddingBottom,
    FloorNumber,
    count,
    costumer = false,
  } = style;
  let focusGroup = Number(getUrlParam('defaultFocusGroup', 'url')) || 1;
  const floorObj = { 1: 2, 2: 4 }; // 索引对应楼层

  return (
    <div
      style={{
        borderRadius,
        fontSize,
        color,
        background: costumer || focusGroup === count ? background : '#979797',
        paddingLeft,
        paddingRight,
        paddingTop,
        paddingBottom,
        textAlign: 'center',
      }}
    >
      {costumer ? <span>B21 - {floorObj[focusGroup]}F</span> : <span>B21 - {FloorNumber}F</span>}
    </div>
  );
};

export default TextStatusLib;
