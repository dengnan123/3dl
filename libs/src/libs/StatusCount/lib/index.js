import { useCallback } from 'react';
import PropTypes from 'prop-types';
import { getNameByLang } from '../../../helpers/lang';

import styles from './index.less';

const StatusCount = props => {
  const {
    data: { dataSource = [] },
    style: {
      title,
      titleEn,
      isShowTotal = true,
      titleFontSize = 18,
      titleFontWeight = 400,
      titleFontColor = '#424242',
      titleMarginBottom = 10,
      iconWidth = 8,
      iconHeight = 8,
      iconRadius = 4,
      iconMarginRight = 5,
      statusItemHeight = 45,
      statusItemPaddingLeft = 15,
      statusItemFontColor = '#424242',
      oddStatusItemBgColor,
      statusItemBgColor,
      statusList = [
        { label: 'Available', labelEn: 'Available', iconBgColor: '#80BA01' },
        { label: 'Occupied', labelEn: 'Occupied', iconBgColor: '#F25022' },
        { label: 'Waiting', labelEn: 'Waiting', iconBgColor: '#FFB902' },
        { label: 'Invalid Occupied', labelEn: 'Invalid Occupied', iconBgColor: '#0240EF' },
      ],
    },
    lang = 'en-US',
  } = props;

  const getTotal = useCallback(() => {
    let total = 0;
    statusList.map((n, index) => {
      const value = dataSource[index] || 0;
      total += value;
      return n;
    });
    return total;
  }, [dataSource, statusList]);

  return (
    <div className={styles.container}>
      <div
        className={styles.head}
        style={{
          fontSize: titleFontSize,
          fontWeight: titleFontWeight,
          color: titleFontColor,
          marginBottom: titleMarginBottom,
        }}
      >
        <div className={styles.title}>{getNameByLang(lang, title, titleEn)}</div>
        {isShowTotal && <div>{getTotal()}</div>}
      </div>
      <div className={styles.list}>
        {(statusList || []).map((n, index) => {
          const label = getNameByLang(lang, n.label, n.labelEn);
          const count = dataSource[index] || 0;
          const iconBgColor = n.iconBgColor;

          let itemBgColor = '';
          if (index % 2 !== 0 && !!statusItemBgColor) {
            itemBgColor = statusItemBgColor;
          } else if (index % 2 === 0) {
            itemBgColor = !!oddStatusItemBgColor
              ? oddStatusItemBgColor
              : 'rgba(118, 192, 253, 0.16)';
          }
          return (
            <div
              key={index}
              className={styles.item}
              style={{
                height: statusItemHeight,
                color: statusItemFontColor,
                paddingLeft: statusItemPaddingLeft,
                backgroundColor: itemBgColor,
              }}
            >
              <div className={styles.left}>
                <div
                  className={styles.icon}
                  style={{
                    width: iconWidth,
                    height: iconHeight,
                    borderRadius: iconRadius,
                    marginRight: iconMarginRight,
                    backgroundColor: iconBgColor,
                  }}
                />
                <div>{label}</div>
              </div>
              <div className={styles.right}>{count}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

StatusCount.propTypes = {
  data: PropTypes.object,
  style: PropTypes.object,
  lang: PropTypes.string,
};

export default StatusCount;
