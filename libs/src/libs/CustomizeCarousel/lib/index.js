import React, { useState, useEffect } from 'react';
import { Carousel } from 'antd';
import styles from './index.less';

function CustomizeCarousel(props) {
  const { style, data } = props;
  const { config, key } = data;
  const {
    width,
    height,
    autoplay = true,
    dots,
    dotPosition,
    autoplaySpeed,
    project = 'jiahui',
    effect = 'scrollx',
  } = style;

  const [delay, setDelay] = useState(autoplaySpeed);

  console.log('CustomizeCarousel is invoked')
  const contentStyle = {
    height,
    width,
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79',
  };

  useEffect(() => {
    setDelay(data?.duration ? data.duration : autoplaySpeed);
  }, [autoplaySpeed, data?.duration]);

  // console.log('autoplay is', autoplay, typeof autoplay);
  return (
    <div className={styles[project]} style={{ width }}>
      <Carousel
        autoplay={autoplay}
        dots={dots}
        autoplaySpeed={Number(delay) * 1000}
        dotPosition={dotPosition}
        effect={effect}
      >
        {Array.isArray(config) &&
          config.map(item => {
            return (
              <div key={item.title}>
                {key === 'src' ? (
                  <img style={{ width, height, border: 'none' }} src={item[key]} alt="" />
                ) : (
                  <h3 style={contentStyle}>{item[key]}</h3>
                )}
              </div>
            );
          })}
      </Carousel>
    </div>
  );
}

export default CustomizeCarousel;
