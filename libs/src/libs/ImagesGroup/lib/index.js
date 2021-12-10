import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';

import styles from './index.less';

const ImagesGroup = props => {
  const {
    onChange,
    data: { dataSource = [] },
    style: {
      title = '',
      titleWidth = 120,
      titleFontSize = 16,
      titleFontWeight = 400,
      titleColor = '#424242',
      titleAlign = 'left',
      imageWidth = 20,
      imageHeight = 25,
      marginRight = 15,
      imagePath = '',
    },
  } = props;

  const onImageClick = (ev, record) => {
    console.log(record, '====imagesGroupimagesGroup11');
    ev.preventDefault();
    ev.stopPropagation();
    onChange && onChange({ imagesGroup: record });
  };

  return (
    <div className={styles.imagesGroup}>
      {!!title && (
        <div
          style={{
            width: titleWidth,
            fontSize: titleFontSize,
            fontWeight: titleFontWeight,
            color: titleColor,
            textAlign: titleAlign,
          }}
        >
          {title}
        </div>
      )}
      <div className={styles.imagesContent}>
        {dataSource.map((item, index) => {
          const { id, imageName, type } = item || {};
          const srcUrl = imagePath ? `${imagePath}/${imageName}` : imageName;
          const isVideo = type && type === 'video';
          const fontSize = Math.min(imageWidth, imageHeight) / 3;
          const isLastItem = index === dataSource.length - 1;
          return (
            <div
              key={id || `${imageName}-${index}`}
              style={{
                width: imageWidth,
                height: imageHeight,
                marginRight: isLastItem ? 0 : marginRight,
                backgroundImage: `url(${srcUrl})`,
              }}
              onMouseUp={event => onImageClick(event, { ...item, currentIndex: index })}
              onTouchEnd={event => onImageClick(event, { ...item, currentIndex: index })}
            >
              {/* <img src={srcUrl} alt={imageName} /> */}
              {isVideo && (
                <div className={styles.videoIcon}>
                  <Icon
                    type="play-circle"
                    style={{ fontSize: parseInt(fontSize), color: 'rgba(255, 255, 255, 0.5)' }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

ImagesGroup.propTypes = {
  data: PropTypes.object,
  style: PropTypes.object,
};

export default ImagesGroup;
