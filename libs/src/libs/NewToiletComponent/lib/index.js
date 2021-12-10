import React from 'react';
import PropTypes from 'prop-types';
import NewToiletColumnItem from '../../../components/NewToiletColumnItem';
import resetSvg from '../../../assets/refrash.svg';
import styles from './index.less';
import NewToiletRowItem from '../../../components/NewToiletRowItem';

function Toilet(props) {
  const { style, data = [], onChange } = props;

  console.log('Toilet is invoked');
  const {
    width = '100%',
    itemBgColor = '#e0e0e0',
    headerHeight = '80px',
    headerFontSize = '24px',
    headerFontColor = '#ffffff',
    headerAlign = 'center',
    headerBgColor = '',
    floorBg = 'red',
    fontColor = '#ffffff',
    floorBr = 0,
    headerBr = 0,
    floorFontSize = '24px',
    itemHeight = '120px',
    itemWidth = '100%',
    floorWidth = '160px',
    maleWidth = '50%',
    femaleWidth = '50%',
    headerFloorBg = '#ffffff',
    headeMalerBg = '#ffffff',
    headeFemalerBg = '#ffffff',
    iconWidth = 45,
    iconHeight = 45,
    iconWrapWidth = 45,
    iconWrapHeight = 45,
    headerMarginB = '64px',
    itemMarginB = '48px',
    padding = '0',
    resetWidth = 100,
    resetHeight = 100,
    resetIconWidth = 42,
    resetIconHeight = 40,
    resetTop = 1,
    resetRight = 1,
    resetBr = 0,
    resetBoxShadow = '0px 24px 40px 0px rgba(0, 0, 0, 0.23)',
    showIcon = false,
    showHeader = false,
    showReset = false,
    toiletIconStyle,
    boxFlexDirection = 'row',
    itemMarginR = '20px',
    genderMarginR = '20px',
    theme,
    isLocation,
    showBorderBottom,
    toiletOrder = 'male',
    floorHeight,
    floorLineHeight,
  } = style;
  const sameStyle = {
    display: 'flex',
    // justifyContent: 'space-around',
    alignItems: 'center',
    // marginLeft: '8px',
  };

  const toiletColumnStyle = {
    floorStyle: {
      width: floorWidth,
      backgroundColor: floorBg,
      fontSize: floorFontSize,
      lineHeight: floorLineHeight,
      color: fontColor,
      height: floorHeight,
      borderRadius: floorBr,
      textAlign: headerAlign,
    },
    iconStyle: {
      width: `${iconWidth}px`,
      height: `${iconHeight}px`,
    },
    sameStyle: {
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      // marginLeft: '8px',
    },
    iconWrapper: {
      width: `${iconWrapWidth}px`,
      height: `${iconWrapHeight}px`,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: itemMarginR,
    },
    maleStyle: {
      width: maleWidth,
      height: itemHeight,
      // padding: '0px 88px',
      ...sameStyle,
    },
    femaleStyle: {
      width: femaleWidth,
      height: itemHeight,
      // padding: '0px 93px',
      ...sameStyle,
    },
    warpperStyle: {
      width: itemWidth,
      height: itemHeight,
      borderRadius: floorBr,
      backgroundColor: itemBgColor,
      marginBottom: itemMarginB,
    },
  };

  const toiletRowStyle = {
    floorStyle: {
      width: floorWidth,
      backgroundColor: floorBg,
      fontSize: floorFontSize,
      lineHeight: floorLineHeight,
      color: fontColor,
      height: floorHeight,
      borderRadius: floorBr,
      textAlign: headerAlign,
    },
    iconStyle: {
      width: `${iconWidth}px`,
      height: `${iconHeight}px`,
    },
    iconWrapper: {
      width: `${iconWrapWidth}px`,
      height: `${iconWrapHeight}px`,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: itemMarginR,
      marginBottom: 12,
    },
    maleStyle: {
      height: itemHeight,
      ...sameStyle,
    },
    femaleStyle: {
      height: itemHeight,
      ...sameStyle,
    },
    warpperStyle: {
      width: itemWidth,
      borderRadius: floorBr,
      backgroundColor: itemBgColor,
    },
    genderMarginR,
    theme,
  };

  const boxFlexStyle = {
    row: { display: 'flex', flexDirection: 'row', overflow: 'auto', flexWrap: 'wrap' },
    column: { display: 'flex', flexDirection: 'column', overflow: 'auto' },
  };

  const handleRefresh = () => {
    console.log('handleRefresh is revoked');
    onChange &&
      onChange({
        includeEvents: ['fetchApi'],
      });
  };
  return (
    <div style={{ width, position: 'relative', padding }}>
      {/* 头部类型 */}
      {showHeader && (
        <div
          className={styles.headers}
          style={{
            height: headerHeight,
            backgroundColor: headerBgColor,
            borderRadius: headerBr,
            lineHeight: headerHeight,
            color: headerFontColor,
            fontSize: headerFontSize,
            textAlign: headerAlign,
            overflow: 'hidden',
            marginBottom: headerMarginB,
          }}
        >
          <div style={{ backgroundColor: headerFloorBg, flex: `0 0 ${floorWidth}` }}>楼层</div>
          <div style={{ backgroundColor: headeMalerBg, flex: `0 0 ${maleWidth}` }}>男</div>
          <div style={{ backgroundColor: headeFemalerBg, flex: `0 0 ${femaleWidth}` }}>女</div>
        </div>
      )}

      {/* 侧位状态 */}
      <div style={boxFlexStyle[boxFlexDirection]}>
        {boxFlexDirection === 'column' && Array.isArray(data) && (
          <>
            {data.map(item => {
              return (
                <NewToiletColumnItem
                  data={item}
                  key={Math.random()}
                  style={{
                    ...toiletColumnStyle,
                    showIcon,
                    toiletIconStyle,
                    theme,
                    isLocation,
                    showBorderBottom,
                    toiletOrder,
                  }}
                />
              );
            })}
          </>
        )}
        {boxFlexDirection === 'row' && Array.isArray(data) && (
          <>
            {data.map(item => {
              return (
                <NewToiletRowItem
                  data={item}
                  key={Math.random()}
                  style={{
                    ...toiletRowStyle,
                    showIcon,
                    toiletIconStyle,
                    theme,
                    toiletOrder,
                    isLocation,
                  }}
                />
              );
            })}
          </>
        )}
      </div>

      {/* 刷新按钮 */}
      {showReset && (
        <div
          onClick={handleRefresh}
          style={{
            position: 'absolute',
            width: `${resetWidth}px`,
            height: `${resetHeight}px`,
            top: `${resetTop}px`,
            right: `${resetRight}px`,
            boxShadow: resetBoxShadow,
            textAlign: 'center',
            lineHeight: `${resetHeight}px`,
            borderRadius: resetBr,
            zIndex: 99,
          }}
        >
          <img
            width={`${resetIconWidth}px`}
            height={`${resetIconHeight}px`}
            src={resetSvg}
            alt=""
          />
        </div>
      )}
    </div>
  );
}

Toilet.propTypes = {
  style: PropTypes.object,
};

export default Toilet;
