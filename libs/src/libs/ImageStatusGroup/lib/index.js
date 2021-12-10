// import { useEffect, useState } from 'react';
import defPic from '../../../assets/defPic.gif';
import styles from './index.less';
import { isArray, isString } from 'lodash';

const getSrcByStatus = (statusObj, status) => {
  const value = statusObj[status]; //可能是对象
  if (isString(value)) {
    return value;
  }
  return statusObj[status]?.src || defPic;
};
const renderItem = (style, v) => {
  const { statusObj, itemStyle } = style;
  const src = getSrcByStatus(statusObj, v.status);
  return <img src={src} style={itemStyle} alt=""></img>;
};

const ImageStatusGroup = ({ data, style }) => {
  const { dataSource = [] } = data;
  const { itemListStyle } = style;
  const renderList = arr => {
    return (
      <div className={styles.wrap} style={itemListStyle}>
        {arr.map(v => {
          return renderItem(style, v);
        })}
      </div>
    );
  };
  return (
    <div className={styles.wrap}>
      {dataSource.map(v => {
        if (isArray(v)) {
          return renderList(v);
        }
        return renderItem(style, v);
      })}
    </div>
  );
};

export default ImageStatusGroup;
