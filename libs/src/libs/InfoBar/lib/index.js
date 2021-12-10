import React from 'react';
import PropTypes from 'prop-types';
import styles from './index.less';

const InfoBar = props => {
  const {
    data: { dataSource = [] },
    style: {
      titleFontSize,
      titleFontWeight = 400,
      titleColor,
      titleWordSpacing = 0,
      titleLetterSpacing = 0,
      valueFontSize,
      valueFontWeight = 400,
      valueWordSpacing = 0,
      valueLetterSpacing = 0,
      valueColor,
      marginRight,
      marginBottom,
      showDivider,
      deviderWidth,
      deviderColor = 'rgba(216,216,216,1)',
      isEquallyDevided = true,
      itemWidthList = [],
      flexDirection = 'row',
      justifyContent,
      alignItems,
      PaddingTopBottom,
      PaddingLeftRight,
      boxFlexDirection = 'row',
    },
    otherCompParams = {},
    onChange,
  } = props;

  let boxStyles = { flexDirection: boxFlexDirection };
  if (boxFlexDirection !== 'row') {
    boxStyles.alignItems = 'start';
  }

  const onClick = record => {
    console.log(record, '===infoBarZZ Click');
    onChange && onChange({ ...otherCompParams, itemInfo: record });
  };

  return (
    <div
      className={styles.InfoBar}
      style={{
        padding: `${PaddingTopBottom}px ${PaddingLeftRight}px`,
        ...boxStyles,
      }}
    >
      {dataSource?.map((n, index) => {
        const itemStyle = isEquallyDevided
          ? { flexDirection, alignItems, justifyContent, flex: 1 }
          : { flexDirection, alignItems, justifyContent, width: itemWidthList?.[index] };
        const customColor = n.color;
        let labelColor = titleColor;
        let valColor = valueColor;
        if (customColor && customColor.length > 0) {
          if (customColor[0]) {
            labelColor = customColor[0];
          }
          valColor = customColor[1] ? customColor[1] : customColor[0];
        }
        return (
          <React.Fragment key={index}>
            <div
              className={styles.item}
              style={itemStyle}
              onClick={() => onClick({ ...n, currentIndex: index })}
            >
              <div
                className={styles.title}
                style={{
                  fontSize: titleFontSize,
                  fontWeight: titleFontWeight,
                  color: labelColor,
                  wordSpacing: titleWordSpacing,
                  letterSpacing: titleLetterSpacing,
                  marginRight,
                  marginBottom,
                }}
              >
                {n.label}
              </div>
              <div
                className={styles.desc}
                style={{
                  fontSize: valueFontSize,
                  color: valColor,
                  fontWeight: valueFontWeight,
                  wordSpacing: valueWordSpacing,
                  letterSpacing: valueLetterSpacing,
                }}
              >
                {n.value}
              </div>
            </div>
            {showDivider && index < dataSource?.length - 1 && (
              <div
                style={{
                  width: deviderWidth,
                  height: '100%',
                  backgroundColor: deviderColor,
                }}
              ></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

InfoBar.propTypes = {
  data: PropTypes.object,
  style: PropTypes.object,
};

export default InfoBar;
