import React from 'react';
import PropTypes from 'prop-types';
import toiletFree from '../../assets/toiletFree.png';
import toiletBusy from '../../assets/toiletBusy.png';
import placehoderFree from '../../assets/placehoder-Free.svg';
import placehoderBusy from '../../assets/placeholder-Busy.svg';
import male from '../../assets/male.svg';
import female from '../../assets/female.svg';

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

function ToiletColumnItem(props) {
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
  } = style;
  const { maleData, femaleData, floor } = data;

  const renderIcon = data => {
    if (Array.isArray(data)) {
      return data.map(item => (
        <div tyep="img" key={Math.random()} style={{ ...iconStyle, ...iconWrapper }}>
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
    alignItems: 'center',
    ...warpperStyle,
  };

  return (
    <div style={itemStyle}>
      {/* 楼层 */}
      <div style={{ ...floorStyle }}>{floor}</div>

      {/* 男厕 */}
      <div style={{ ...maleStyle }}>
        {showIcon && <img width={iconStyle.width} height={iconStyle.height} src={male} alt="" />}
        {renderIcon(maleData)}
      </div>

      {/* 女厕 */}
      <div style={{ ...femaleStyle }}>
        {showIcon && <img width={iconStyle.width} height={iconStyle.height} src={female} alt="" />}
        {renderIcon(femaleData)}
      </div>
    </div>
  );
}

ToiletColumnItem.propTypes = {
  style: PropTypes.object,
  data: PropTypes.object,
};

export default ToiletColumnItem;
