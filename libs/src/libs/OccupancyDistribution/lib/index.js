import PropTypes from 'prop-types';

import styles from './index.less';

const OccupancyDistribution = props => {
  const {
    data: { dataSource = [0, 0, 0.2, 0.2, 0.6] },
    // lang = 'en-US',
    style: {
      iconWidth = 8,
      iconHeight = 8,
      iconMarginRight = 5,
      legendMarginBottom = 10,
      legendSpacing = 10,
      legendFontSize = 12,
      legendColor = '#424242',
      legendList = [
        { label: '0-15%', iconBgColor: '#0089e9' },
        { label: '15-35%', iconBgColor: '#0089e980' },
        { label: '35-50%', iconBgColor: '#0089e960' },
        { label: '50-75%', iconBgColor: '#0089e940' },
        { label: '75-100%', iconBgColor: '#0089e920' },
      ],
      percentBarHeight = 40,
      percentColor = '#424242',
      percentFontSize = 12,
      notDataContainer = 'Not Data',
      notDataColor = '#0089e9',
      notDataFontSize = 20,
      Threshold = 5,
      isHiddenLed,
    },
  } = props;

  const defaultList = [
    { label: '0-15%', iconBgColor: '#0089e9' },
    { label: '15-35%', iconBgColor: '#0089e980' },
    { label: '35-50%', iconBgColor: '#0089e960' },
    { label: '50-75%', iconBgColor: '#0089e940' },
    { label: '75-100%', iconBgColor: '#0089e920' },
  ];

  return (
    <div className={styles.occupancyDistribution}>
      <div className={styles.legend} style={{ marginBottom: legendMarginBottom }}>
        {!isHiddenLed &&
          (legendList || []).map((item, index) => (
            <div className={styles.item} key={index} style={{ marginLeft: legendSpacing }}>
              <div
                style={{
                  width: iconWidth,
                  height: iconHeight,
                  backgroundColor: item.iconBgColor,
                  marginRight: iconMarginRight,
                }}
              />
              <div style={{ fontSize: `${legendFontSize}px`, color: legendColor }}>
                {item.label}
              </div>
            </div>
          ))}
      </div>
      {!dataSource || dataSource.length === 0 ? (
        <div
          style={{
            color: notDataColor,
            fontSize: notDataFontSize,
            textAlign: 'center',
            width: '100%',
          }}
        >
          {notDataContainer}
        </div>
      ) : (
        <div className={styles.percent} style={{ height: percentBarHeight }}>
          {(legendList || []).map((n, index) => {
            const percent = Number(dataSource[index]) * 100 || 0;
            const backgroundColor =
              legendList[index] && legendList[index].iconBgColor
                ? legendList[index].iconBgColor
                : defaultList[index].iconBgColor;
            const number = percent.toFixed(0);
            return (
              <div
                hidden={percent === 0}
                key={index}
                className={styles.item}
                style={{
                  width: `${(percent * 100).toFixed(0)}%`,
                  color: percentColor,
                  fontSize: `${percentFontSize}px`,
                  backgroundColor,
                }}
              >
                {number > Threshold ? `${number}%` : ''}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

OccupancyDistribution.propTypes = {
  data: PropTypes.object,
  style: PropTypes.object,
};

export default OccupancyDistribution;
