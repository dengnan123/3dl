import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './index.less';
import HumBlue from '../assets/hum-white.svg';
import TempWhite from '../assets/temp-white.svg';
import PMWhite from '../assets/PM-white.svg';
import '../../WeatherPanel/assets/fonts/iconfont.less'; // 本地测试要注释掉，要是线上的话千万别注释

import { weatherStyleEmnu } from '../styles';

function HouseWeatherPanel(props) {
  const {
    data,
    style: {
      width,
      showBorder = weatherStyleEmnu['showBorder'],
      BorderColor = weatherStyleEmnu['BorderColor'],
      BorderRaduis = weatherStyleEmnu['BorderRaduis'],
      boxPadding = weatherStyleEmnu['boxPadding'],
      showBackground = weatherStyleEmnu['showBackground'],
      background = weatherStyleEmnu['background'],
      containerStyle = weatherStyleEmnu['containerStyle'],
      showTemp = weatherStyleEmnu['showTemp'],
      weatherContainerStyle = weatherStyleEmnu['weatherContainerStyle'],
      tempImgWidth = weatherStyleEmnu['tempImgWidth'],
      tempImgHeight = weatherStyleEmnu['tempImgHeight'],
      tempNumberStyle = weatherStyleEmnu['temmpNumberStyle'],
      tempTextStyle = weatherStyleEmnu['tempTextStyle'],
      tempUnitStyle = weatherStyleEmnu['tempUnitStyle'],
      tempRightStyle = weatherStyleEmnu['tempRightStyle'],

      showHum = weatherStyleEmnu['showHum'],
      humContainerStyle = weatherStyleEmnu['humContainerStyle'],
      humImgWidth = weatherStyleEmnu['humImgWidth'],
      humImgHeight = weatherStyleEmnu['humImgHeight'],
      humNumStyle = weatherStyleEmnu['humNumStyle'],
      humTextStyle = weatherStyleEmnu['humTextStyle'],
      humUnitStyle = weatherStyleEmnu['humUnitStyle'],
      humRightStyle = weatherStyleEmnu['humRightStyle'],

      showPM = weatherStyleEmnu['showPM'],
      PMContainerStyle = weatherStyleEmnu['PMContainerStyle'],
      PMImgWidth = weatherStyleEmnu['PMImgWidth'],
      PMImgHeight = weatherStyleEmnu['PMImgHeight'],
      PMNumStyle = weatherStyleEmnu['PMNumStyle'],
      PMTextStyle = weatherStyleEmnu['PMTextStyle'],
      PMUnitStyle = weatherStyleEmnu['PMUnitStyle'],
      PMRightStyle = weatherStyleEmnu['PMRightStyle'],
    },
  } = props;

  console.log('打包');

  const parseStyle = styleString => {
    let style = {};
    if (!styleString) return style;
    styleString.split(';').forEach(item => {
      const [key, value] = item.split(':');
      style[key] = value;
    });
    return style;
  };
  console.log('HouseWeather mounted');
  return (
    <div
      style={{
        width: width + 'px',
        border: showBorder ? `1px solid ${BorderColor}` : 'none',
        padding: boxPadding,
        background: showBackground ? background : '#ffffff',
        borderRadius: BorderRaduis,
        ...parseStyle(containerStyle),
      }}
      className={styles.container}
    >
      {showTemp && (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            ...parseStyle(weatherContainerStyle),
          }}
        >
          <div style={{ justifyContent: 'start' }} className={classnames(styles.item)}>
            <img src={TempWhite} alt="" style={{ width: tempImgWidth, height: tempImgHeight }} />
          </div>

          <div className={classnames(styles.item)} style={parseStyle(tempRightStyle)}>
            <div style={parseStyle(tempNumberStyle)}>
              {data.tmp || 0}
              <span style={parseStyle(tempUnitStyle)}>°</span>
            </div>
            <div style={parseStyle(tempTextStyle)}>温度</div>
          </div>
        </span>
      )}
      {showHum && (
        <span
          style={{ display: 'inline-flex', alignItems: 'center', ...parseStyle(humContainerStyle) }}
        >
          <div className={classnames(styles.item)}>
            <img src={HumBlue} alt="" style={{ width: humImgWidth, height: humImgHeight }} />
          </div>

          <div className={classnames(styles.item)} style={parseStyle(humRightStyle)}>
            <div style={parseStyle(humNumStyle)}>
              {data.hum || '--'}
              <span style={parseStyle(humUnitStyle)}>%</span>
            </div>
            <div style={parseStyle(humTextStyle)}>湿度</div>
          </div>
        </span>
      )}
      {showPM && (
        <span
          style={{ display: 'inline-flex', alignItems: 'center', ...parseStyle(PMContainerStyle) }}
        >
          <div className={classnames(styles.item)}>
            <img src={PMWhite} alt="" style={{ width: PMImgWidth, height: PMImgHeight }} />
          </div>

          <div className={classnames(styles.item)} style={parseStyle(PMRightStyle)}>
            <div style={parseStyle(PMNumStyle)}>
              {data.pm || '--'}
              <span style={parseStyle(PMUnitStyle)}>μg/m³</span>
            </div>
            <div style={parseStyle(PMTextStyle)}>PM2.5</div>
          </div>
        </span>
      )}
    </div>
  );
}

HouseWeatherPanel.propTypes = {
  data: PropTypes.object,
  lang: PropTypes.string,
  style: PropTypes.object,
  showDays: PropTypes.number,
};

export default HouseWeatherPanel;

// function createLink(url, cb) {
//   return new Promise((resolve, reject) => {
//     const head = document.getElementsByTagName('head')[0];
//     const linkTag = document.createElement('link');

//     linkTag.id = 'dynamic-style';
//     linkTag.href = url;
//     linkTag.setAttribute('rel', 'stylesheet');
//     linkTag.setAttribute('type', 'text/css');

//     head.appendChild(linkTag);
//   });
// }
