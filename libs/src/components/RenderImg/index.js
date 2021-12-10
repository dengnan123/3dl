import React from 'react';

const getSrc = (style, data, defPic) => {
  if (data.src) {
    return data.src;
  }
  if (style.src) {
    return style.src;
  }
  return defPic;
};

const Image = props => {
  const { style = {}, height, width, onChange, data = {}, defPic } = props;
  const def = getSrc(style, data, defPic);

  let _style = {
    background: `url(${def}) 0px 0px / 100% 100%`,
    height,
    width,
  };

  return (
    <div
      alt=""
      onClick={() => {
        onChange && onChange();
      }}
      style={{
        ..._style,
        backgroundColor: 'unset',
      }}
    ></div>
  );
};

export default Image;
