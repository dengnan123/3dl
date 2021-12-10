import React, { useCallback } from 'react';

import PropTypes from 'prop-types';
function BatteryProgressBar(props) {
  const { data = {}, style = {} } = props;
  const {
    nums = 5,
    cellRadius = 6,
    cellGab = 4,
    strokeColor = '#31C58D',
    trailColor = '#9B9B9B',
    strokeWidth = '18px',
    showInfo = false,
    textColor = '#31C58D',
    textSize = '16',
  } = style;

  const { value = 72 } = data;

  const containerStyle = {
    display: 'flex',
    height: strokeWidth,
    justifyContent: 'center',
    alignItems: 'center',
    color: textColor,
    fontSize: `${textSize}px`,
  };

  const batteryProgressStyle = {
    height: strokeWidth,
    width: '100%',
    display: 'flex',
    overflow: 'hidden',
  };

  const renderProgress = useCallback(() => {
    const progressItemStyle = {
      width: `${100 / nums}%`,
      borderRadius: `${cellRadius}px`,
      height: '100%',
      backgroundColor: trailColor,
      marginRight: `${cellGab}px`,
    };

    const eachGridLength = 100 / nums;
    const itemCount = Math.ceil(value / eachGridLength);
    const lastProgressItemLength = (value % eachGridLength) / eachGridLength;

    let ele = [];
    const calWidth = i => {
      if (i === itemCount - 1) {
        return `${lastProgressItemLength * 100}%`;
      }
      return `100%`;
    };
    for (let i = 0; i < nums; i++) {
      ele.push(
        <div style={progressItemStyle} key={i}>
          {i <= itemCount - 1 && (
            <div
              style={{
                backgroundColor: strokeColor,
                borderRadius: `${cellRadius}px`,
                width: calWidth(i),
                height: '100%',
              }}
            />
          )}
        </div>,
      );
    }
    return ele;
  }, [nums, value, cellGab, cellRadius, strokeColor, trailColor]);

  return (
    <div style={containerStyle}>
      <div style={batteryProgressStyle}>{renderProgress()}</div>
      {showInfo && <div style={{ marginLeft: '10px' }}>{value}%</div>}
    </div>
  );
}

BatteryProgressBar.propTypes = {
  style: PropTypes.object,
  data: PropTypes.object,
};

export default BatteryProgressBar;
