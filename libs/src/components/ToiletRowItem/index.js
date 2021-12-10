import React from 'react';
import PropTypes from 'prop-types';
import toiletFree from '../../assets/toiletFree.png';
import toiletBusy from '../../assets/toiletBusy.png';
import placehoderFree from '../../assets/placehoder-Free.svg';
import placehoderBusy from '../../assets/placeholder-Busy.svg';
import male from '../../assets/male.svg';
import female from '../../assets/female.svg';
import styles from './index.less';

const Status = {
  toilet: {
    0: toiletFree,
    1: toiletBusy,
  },
  placeholder: {
    0: placehoderFree,
    1: placehoderBusy,
  },
};

function ToiletRowItem(props) {
  const { style, data } = props;
  const {
    floorStyle,
    maleStyle,
    femaleStyle,
    iconStyle,
    iconWrapper,
    warpperStyle,
    showIcon = false,
    toiletIconStyle = 'toilet',
    flexDirection = 'row',
    genderMarginR,
  } = style;
  const { maleData, femaleData, floor } = data;

  const renderIcon = data => {
    if (Array.isArray(data)) {
      return data.map(item => (
        <div type="img" key={Math.random()} style={{ ...iconStyle, ...iconWrapper }}>
          {Status[toiletIconStyle][item] && (
            <img
              width={iconStyle.width}
              height={iconStyle.height}
              src={Status[toiletIconStyle][item]}
              alt=""
            />
          )}
        </div>
      ));
    }
    return null;
  };

  const itemStyle = {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'start',
    flexDirection: 'column',
    ...warpperStyle,
  };

  return (
    <div style={itemStyle}>
      {/* A楼层 */}
      <div style={{ ...floorStyle }}>{floor}</div>

      {/* B 男厕 */}
      <div style={{ ...maleStyle }}>
        {showIcon && (
          <img
            width={iconStyle.width}
            height={iconStyle.height}
            style={{ marginRight: genderMarginR }}
            src={male}
            alt=""
          />
        )}
        <div className={styles.toiletBox}>{renderIcon(maleData)}</div>
      </div>

      {/* C 女厕 */}
      <div style={{ ...femaleStyle }}>
        {showIcon && (
          <img
            width={iconStyle.width}
            height={iconStyle.height}
            style={{ marginRight: genderMarginR }}
            src={female}
            alt=""
          />
        )}
        <div className={styles.toiletBox}>{renderIcon(femaleData)}</div>
      </div>
    </div>
  );
}

ToiletRowItem.propTypes = {
  style: PropTypes.object,
  data: PropTypes.object,
};

export default ToiletRowItem;
