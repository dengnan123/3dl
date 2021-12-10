import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './index.less';

function Lable(props) {
  const { style = {}, data = {}, lang = 'en-US' } = props;

  const {
    backgroundColor = '#e5e5e5',
    custormizColor,
    borderRadius,
    text = '',
    textAlign = 'center',
    fontSize = 14,
    color = '#333',
    width = 70,
    height = 30,
  } = style;

  const [bgColor, setBgColor] = useState(backgroundColor);
  const [textColor, setTextColor] = useState(color);
  const [textContent, setTextContent] = useState(text);
  const [borderWidth, setBorderWidth] = useState(text);
  const [borderColor, setBorderColor] = useState(text);

  useEffect(() => {
    if (!custormizColor || !Array.isArray(custormizColor) || custormizColor.length === 0) {
      setBgColor(() => backgroundColor);
      setTextColor(() => color);
      setTextContent(() => text);
    }
    if (Array.isArray(custormizColor) && custormizColor.length > 0) {
      custormizColor.forEach(item => {
        if (data.value >= Number(item.down) && data.value < Number(item.up)) {
          setBgColor(() => item.bgcolor);
          setTextColor(() => item.color);
          setBorderWidth(() => item.borderWidth);
          setBorderColor(() => item.borderColor);
          if (lang === 'zh-CN') {
            setTextContent(() => item?.CNText || '');
          } else {
            setTextContent(() => item?.ENText || '');
          }
        }
      });
    }
  }, [backgroundColor, color, text, custormizColor, data, lang]);

  // useEffect(() => {
  //   setBgColor(() => backgroundColor);
  //   setTextColor(() => color);
  //   setTextContent(() => text);
  // }, [backgroundColor, color, text]);

  return (
    <div
      className={styles.container}
      style={{
        backgroundColor: bgColor,
        borderRadius,
        textAlign,
        fontSize: fontSize,
        color: textColor,
        width,
        height,
        lineHeight: borderWidth > 0 ? `${height - 2 * borderWidth}px` : height + 'px',
        border: `${borderWidth}px solid ${borderColor}`,
      }}
    >
      {textContent}
    </div>
  );
}

Lable.propTypes = {
  style: PropTypes.object,
  data: PropTypes.object,
};

export default Lable;
