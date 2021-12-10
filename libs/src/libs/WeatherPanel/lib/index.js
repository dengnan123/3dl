import React from 'react';
import PropTypes from 'prop-types';
import moment from 'dayjs';
import classnames from 'classnames';
import styles from './index.less';
import WindIcon from '../assets/weather/Shape.svg';
import WindIconGray from '../assets/weather/ShapeGray.svg';
import HumBlue from '../assets/weather/hum-blue.svg';
import HumGray from '../assets/weather/hum-gray.svg';
import '../assets/fonts/iconfont.less'; // 本地测试要注释掉，要是线上的话千万别注释

import { weatherStyleEmnu } from '../styles';
import { WeatherBlueIcon, WeatherGrayIcon, WeatherIconFont } from '../helper';

function WeatherLib(props) {
  const {
    data: { daily_forecast = [] },
    lang,
    style: {
      useIconfont = false,
      IconfontColor = 'red',
      IconfontSize = 30,
      width,
      prominentOne = weatherStyleEmnu['prominentOne'],
      showDays = weatherStyleEmnu['showDays'],
      showWeek = weatherStyleEmnu['showWeek'],
      showData = weatherStyleEmnu['showData'],

      weekFontSize = weatherStyleEmnu['weekFontSize'],
      weekColor = weatherStyleEmnu['weekColor'],
      timeFontSize = weatherStyleEmnu['weekFontSize'],
      timeColor = weatherStyleEmnu['weekColor'],
      MomentForment = weatherStyleEmnu['MomentForment'],

      imgWidth = weatherStyleEmnu['imgWidth'],
      // imgHeight = weatherStyleEmnu['imgHeight'],
      // imgBigWidth = weatherStyleEmnu['imgBigWidth'],
      imgSmallWidth = weatherStyleEmnu['imgSmallWidth'],

      showWeatherText = weatherStyleEmnu['showWeatherText'],
      weatherTextSize = weatherStyleEmnu['weatherTextSize'],
      weatherTextColor = weatherStyleEmnu['weatherTextColor'],

      showPop = weatherStyleEmnu['showPop'],
      showPopSize = weatherStyleEmnu['showPopSize'],
      showPopColor = weatherStyleEmnu['showPopColor'],

      showHum = weatherStyleEmnu['showHum'],
      humFontSize = weatherStyleEmnu['humFontSize'],
      humImgWidth = weatherStyleEmnu['humImgWidth'],
      humColor = weatherStyleEmnu['humColor'],

      showWind = weatherStyleEmnu['showWind'],
      windFontSize = weatherStyleEmnu['windFontSize'],
      windColor = weatherStyleEmnu['windColor'],
      windImgWidth = weatherStyleEmnu['windImgWidth'],

      showTemp = weatherStyleEmnu['showTemp'],
      temmpFontSize = weatherStyleEmnu['temmpFontSize'],
      tempColor = weatherStyleEmnu['tempColor'],

      showBorder = weatherStyleEmnu['showBorder'],
      BorderColor = weatherStyleEmnu['BorderColor'],
      BorderRaduis = weatherStyleEmnu['BorderRaduis'],
      boxPadding = weatherStyleEmnu['boxPadding'],

      showBackground = weatherStyleEmnu['showBackground'],
      background = weatherStyleEmnu['background'],
      oneLineToShow = false,
      justifyContent = 'center',
      warperJustify = 'center',
    },
  } = props;

  const dataSource = showDays && (daily_forecast || []).slice(0, showDays);
  if (dataSource.length === 0) {
    for (let index = 0; index < showDays; index++) {
      let obj = {
        date: moment()
          .add('days', index)
          .format('YYYY-MM-DD'),
        cond_code_d: '999',
      };
      dataSource.push(obj);
    }
  }

  const largeStyle = (prominentOne, index) => {
    if (prominentOne && index === 0) {
      return {
        width: imgWidth + 'px',
        height: imgWidth + 'px',
      };
    }
    if (prominentOne && index !== 0) {
      return {
        width: imgSmallWidth + 'px',
        height: imgSmallWidth + 'px',
      };
    }
    if (!prominentOne) {
      return {
        width: imgWidth + 'px',
        height: imgWidth + 'px',
      };
    }
  };

  // React.useEffect(() => {
  //   createLink('/fonts/iconfont.css');
  // }, []);

  return (
    <div className={styles.rowStyle} style={{ justifyContent: warperJustify }}>
      {dataSource.map((item, index) => {
        return (
          <div
            key={index}
            style={{
              width: `${width / showDays}%`,
              border: showBorder ? `1px solid ${BorderColor}` : 'none',
              padding: boxPadding,
              background: showBackground ? background : 'undefined',
              borderRadius: BorderRaduis,
            }}
            className={styles.colWeaper}
          >
            {prominentOne && index === 0 ? null : (
              <>
                {showWeek && (
                  <div
                    className={classnames(
                      styles.week,
                      index === 0 || !prominentOne ? styles.blue : styles.gray,
                    )}
                    style={{ fontSize: weekFontSize, color: weekColor }}
                  >
                    {moment(item.date)
                      .locale(lang || 'en-us')
                      .format('dddd')}
                  </div>
                )}

                {showData && (
                  <div
                    className={classnames(
                      styles.day,
                      index === 0 || !prominentOne ? styles.blue : styles.gray,
                    )}
                    style={{ fontSize: timeFontSize, color: timeColor }}
                  >
                    {moment(item.date)
                      .locale(lang || 'en-us')
                      .format(MomentForment || 'MMM Do')}
                  </div>
                )}
              </>
            )}

            {index === 0 || !prominentOne ? (
              <div className={styles.weatherIconBox} style={{ justifyContent }}>
                {!useIconfont ? (
                  WeatherBlueIcon(item.cond_code_d, index, prominentOne, largeStyle)
                ) : (
                  <span
                    className={`iconfont icon-${WeatherIconFont(item.cond_code_d)}`}
                    style={{ color: IconfontColor, fontSize: IconfontSize }}
                  ></span>
                )}
              </div>
            ) : (
              <div className={styles.weatherIconBox} style={{ justifyContent }}>
                {!useIconfont ? (
                  WeatherGrayIcon(item.cond_code_d, index, prominentOne, largeStyle)
                ) : (
                  <span
                    className={`iconfont icon-${WeatherIconFont(item.cond_code_d)}`}
                    style={{ color: 'red', fontSize: '30px' }}
                  ></span>
                )}
              </div>
            )}

            {showWeatherText && !oneLineToShow && (
              <div
                className={classnames(
                  styles.weather,
                  index === 0 || !prominentOne ? styles.blue : styles.gray,
                )}
                style={{ fontSize: weatherTextSize, color: weatherTextColor }}
              >
                {item.cond_txt_d || '--'}
              </div>
            )}

            {showPop && (
              <div
                className={classnames(
                  styles.pop,
                  index === 0 || !prominentOne ? styles.blue : styles.gray,
                )}
                style={{ fontSize: showPopSize, color: showPopColor }}
              >
                {item.pop || '--'}%
              </div>
            )}

            {oneLineToShow && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'start' }}>
                <div
                  style={{
                    fontSize: weatherTextSize,
                    color: weatherTextColor,
                    marginRight: '20px',
                  }}
                >
                  {item.cond_txt_d || '--'}
                </div>
                <div style={{ fontSize: temmpFontSize, color: tempColor }}>
                  {item.tmp_max || 0}°C ~ {item.tmp_min || 0}°C
                </div>
              </div>
            )}
            {showHum && (
              <div
                className={classnames(
                  styles.hum,
                  index === 0 || !prominentOne ? styles.blue : styles.gray,
                )}
                style={{ fontSize: humFontSize, color: humColor }}
              >
                <img
                  className={styles.windIcon}
                  src={index === 0 || !prominentOne ? HumBlue : HumGray}
                  alt=""
                  style={{ width: humImgWidth, height: humImgWidth }}
                />
                {item.hum || '--'}%
              </div>
            )}

            {showTemp && !oneLineToShow && (
              <div
                className={classnames(
                  styles.temperature,
                  index === 0 || !prominentOne ? styles.blue : styles.gray,
                )}
                style={{ fontSize: temmpFontSize, color: tempColor }}
              >
                {item.tmp_max || 0}°C ~ {item.tmp_min || 0}°C
              </div>
            )}

            {showWind && (
              <div
                className={classnames(
                  styles.windDirection,
                  index === 0 || !prominentOne ? styles.blue : styles.gray,
                )}
                style={{ fontSize: windFontSize, color: windColor }}
              >
                <img
                  className={styles.windIcon}
                  src={index === 0 || !prominentOne ? WindIcon : WindIconGray}
                  alt=""
                  style={{ width: windImgWidth, height: windImgWidth }}
                />
                {item.wind_dir || ''}&nbsp;{item.wind_spd || 0}km/h
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

WeatherLib.propTypes = {
  data: PropTypes.object,
  lang: PropTypes.string,
  style: PropTypes.object,
  showDays: PropTypes.number,
};

export default WeatherLib;

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
