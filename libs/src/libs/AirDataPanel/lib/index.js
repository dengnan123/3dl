import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { getNameByLang } from '../../../helpers/lang';

import { Progress } from 'antd';

import styles from './index.less';

const AirDataPanel = props => {
  const {
    data: { dataSource = [] },
    style: {
      title = 'Environmental',
      titleEn = 'Environmental',
      titleFontSize = 18,
      titleFontColor = '#424242',
      titleMarginBottom = 10,
      airItemTitleColor = '#424242',
      airItemTitleSize = 14,
      airItemAlginType = 'space-between',
      descMarginLeft = 0,
      airMarginBottom = 0,
      airItemMarginBottom = 20,
      progressUndoneColor,
      progressStrokeWidth = 8,
      showInfo = false,
      airList = [
        { label: 'PM2.5', labelEn: 'PM2.5', progressColor: '#52c41a', airUnit: 'μg/m³', max: 100 },
        { label: 'CO2', labelEn: 'CO2', progressColor: '#52c41a', airUnit: 'ppm', max: 1000 },
        {
          label: 'Temperature',
          labelEn: 'Temperature',
          progressColor: '#02a4ef',
          airUnit: '°C',
          max: 100,
        },
        {
          label: 'Humidity',
          labelEn: 'Humidity',
          progressColor: '#02a4ef',
          airUnit: '%',
          max: 100,
        },
      ],
    },
    lang = 'en-US',
  } = props;

  useEffect(() => {
    const progressList = document.querySelectorAll('.ant-progress-inner');

    if (progressList) {
      for (let i = 0; i < progressList.length; i++) {
        progressList[i].style.backgroundColor = progressUndoneColor;
      }
    }
  }, [progressUndoneColor]);

  return (
    <div className={styles.container}>
      <div
        className={styles.head}
        style={{ fontSize: titleFontSize, color: titleFontColor, marginBottom: titleMarginBottom }}
      >
        {getNameByLang(lang, title, titleEn)}
      </div>
      <div className={styles.list}>
        {(airList || []).map((n, index) => {
          const currentValue = dataSource[index] || {};
          const airData = currentValue.airData;
          const airDesc = currentValue.airDesc;
          const airDescColor = currentValue.airDescColor;
          const label = getNameByLang(lang, n.label, n.labelEn);
          const unit = n.airUnit;
          const max = n.max ? Number(n.max) : 100;
          const percent = parseInt((airData / max) * 100);
          const strokeColor = currentValue.airColor || n.progressColor;

          return (
            <div
              key={index}
              className={styles.item}
              style={{
                fontSize: airItemTitleSize,
                color: airItemTitleColor,
                marginBottom: airItemMarginBottom,
              }}
            >
              <div
                className={styles.airInfo}
                style={{ marginBottom: airMarginBottom, justifyContent: airItemAlginType }}
              >
                <div className={styles.left}>
                  <div className={styles.label}>{label}：</div>
                  <div>
                    {airData}
                    {unit}
                  </div>
                </div>
                <div
                  className={styles.right}
                  style={{
                    color: airDescColor || airItemTitleColor,
                    marginLeft: descMarginLeft,
                  }}
                >
                  {airDesc}
                </div>
              </div>
              <div className={styles.progressContainer}>
                <Progress
                  strokeWidth={progressStrokeWidth}
                  percent={percent}
                  strokeColor={strokeColor}
                  showInfo={showInfo}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

AirDataPanel.propTypes = {
  data: PropTypes.object,
  style: PropTypes.object,
  lang: PropTypes.string,
};

export default AirDataPanel;
