// import { useCallback } from 'react';
import PropTypes from 'prop-types';
// import classnames from 'classnames';
import styles from './index.less';

function ItemCard(props) {
  const {
    style: {
      cardBgColor = '#E9E9E9',
      showTitle = false,
      title = '我是标题',
      // titleEn = 'I am title',
      headHeight = 45,
      headBgcolor = '#F0F1F5',
      headPadding = 30,
      headFontSize = 16,
      headFontWeight = 600,
      headFontColor = '#454458',
      titleTextAlign = 'left',
      cardBorderColor = '#F0F1F5',
      borderRadius = 0,
      showBoxShadow = false,
      hShadow = 1,
      vShadow = 1,
      blur = 10,
      spread = 0,
      shadowColor = '#d9dcdf',
      showBar = false,
      barWidth = 8,
      barHeight = 8,
      barTop = 0,
      barLeft = 0,
      barBorderRadius = '0px',
      barColor = '#71daa5',
    },
  } = props;

  return (
    <div className={styles.container}>
      {showBar && (
        <div
          style={{
            position: 'absolute',
            top: barTop,
            left: barLeft,
            width: barWidth,
            height: barHeight,
            borderRadius: barBorderRadius,
            backgroundColor: barColor,
          }}
        />
      )}
      <div
        className={styles.content}
        style={{
          boxShadow: showBoxShadow
            ? `${hShadow}px ${vShadow}px ${blur}px ${spread}px ${shadowColor}`
            : null,
          borderRadius: borderRadius,
          borderColor: cardBorderColor,
          backgroundColor: cardBgColor,
        }}
      >
        {showTitle && (
          <h1
            style={{
              height: headHeight,
              lineHeight: `${headHeight}px`,
              fontSize: `${headFontSize}px`,
              fontWeight: headFontWeight,
              color: headFontColor,
              textAlign: titleTextAlign,
              padding: `0 ${headPadding}px`,
              backgroundColor: headBgcolor,
            }}
          >
            {title}
          </h1>
        )}
      </div>
    </div>
  );
}

ItemCard.propTypes = {
  style: PropTypes.object,
  lang: PropTypes.string,
};

export default ItemCard;
