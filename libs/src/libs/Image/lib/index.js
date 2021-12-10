import React from 'react';
// import RenderImg from '../../../components/RenderImg';
import defPic from '../../../assets/defPic.gif';

const Image = props => {
  const { style = {}, height, width, onChange, data = {} } = props;
  const def = getSrc(style, data);

  const { customizeStyles = {} } = style;

  // console.log(style.customizeStyles, 'ImageComp--11144Style', style);
  return (
    <div
      alt=""
      onClick={() => {
        onChange && onChange({ style, data });
      }}
      style={{
        height,
        width,
        backgroundImage: `url(${def})`,
        backgroundSize: '100% 100%',
        backgroundPosition: '0px 0px',
        ...customizeStyles,
        // backgroundColor: 'unset',
      }}
    ></div>
  );

  // return <RenderImg {...imgProps}></RenderImg>;
};

export default Image;

const getSrc = (style, data) => {
  if (data.src) {
    return data.src;
  }
  if (style.src) {
    return style.src;
  }
  return defPic;
};
