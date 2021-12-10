import React from 'react';
import PropTypes from 'prop-types';
import toiletFree from '../../assets/toiletFree.png';
import toiletBusy from '../../assets/toiletBusy.png';
import placehoderFree from '../../assets/placehoder-Free.svg';
import placehoderBusy from '../../assets/placeholder-Busy.svg';
import male from '../../assets/male.svg';
import female from '../../assets/female.svg';
import male_dark from '../../assets/male_black.svg';
import female_dark from '../../assets/female_black.svg';
import locationImg from '../../assets/location.svg';
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

const genderIcon = {
  dark: {
    male: male,
    female: female,
  },
  pure: {
    male: male_dark,
    female: female_dark,
  },
};

function NewToiletComponent(props) {
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
    theme = 'dark',
    isLocation = false,
    showBorderBottom = false,
    toiletOrder,
  } = style;
  console.log(floorStyle);
  const { maleData, femaleData, floor } = data;
  let male1 = 'male';
  let male1Data = maleData;
  let male2Data = femaleData;
  let male2 = 'female';
  if (toiletOrder === 'female') {
    male1 = 'female';
    male2 = 'male';
    male1Data = femaleData;
    male2Data = maleData;
  }

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
    <div style={{ padding: '40px' }}>
      {/* 楼层 */}
      {isLocation && (
        <div style={{ display: 'flex' }}>
          <img width={30} height={30} src={locationImg} alt="" />
          <div style={{ ...floorStyle }}>{floor}</div>
        </div>
      )}
      {/* 男厕 */}
      <div style={{ display: 'flex' }}>
        <div style={{ ...maleStyle }}>
          {showIcon && (
            <img
              width={iconStyle.width}
              height={iconStyle.height}
              src={genderIcon[theme][male1]}
              alt=""
              style={{ width: '100px' }}
            />
          )}
          <div className={styles.toiletBox}>{renderIcon(male1Data)}</div>
        </div>

        {/* 女厕 */}
        <div style={{ ...femaleStyle }}>
          {showIcon && (
            <img
              width={iconStyle.width}
              height={iconStyle.height}
              src={genderIcon[theme][male2]}
              alt=""
              style={{ width: '100px' }}
            />
          )}
          <div style={{ display: 'flex' }}>{renderIcon(male2Data)}</div>
        </div>
      </div>
      {showBorderBottom && <hr />}
    </div>
  );
}

NewToiletComponent.propTypes = {
  style: PropTypes.object,
  data: PropTypes.object,
};

export default NewToiletComponent;
