import React from 'react';

import defPic from '../../../assets/defPic.gif';

import styles from './index.less';

const ImageSwitcher = props => {
  const { style = {}, height, width, onChange, data = {} } = props;
  const def = getSrc(style, data);

  const { textAlign = 'left' } = style;

  return (
    <div
      onClick={() => {
        onChange && onChange();
      }}
      className={styles.container}
      style={{
        height,
        width,
        textAlign,
      }}
    >
      <img src={def} alt="" />
    </div>
  );
};

export default ImageSwitcher;

const getSrc = (style, data) => {
  if (data.src) {
    return data.src;
  }
  if (style.src) {
    return style.src;
  }
  return defPic;
};
