import { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import classnames from 'classnames';
import { v4 } from 'uuid';

import styles from './index.less';

const ListCountStatus = props => {
  const {
    data: { dataSource = [] },
    style: {
      itemHeight = 45,
      isAmountFormat = false,
      isCountAnimation = false,
      animationTime = 5,
      labelWidth = 120,
      labelAlign = 'left',
      labelFontWeight = 400,
      labelFontSize = 14,
      evenLabelFontSize = null,
      labelColor = '#424242',
      evenLabelFontColor = null,

      valueWidth = 120,
      valueAlign = 'left',
      valueFontWeight = 400,
      valueFontStyle = 'normal',
      valueFontSize = 14,
      evenValueFontSize = null,
      valueColor = '#424242',
      evenValueFontColor = '',
      iconMarginLeft = 5,
      iconFontSize = 12,
    },
  } = props;

  const [currentId, setCurrentId] = useState('');

  useEffect(() => {
    let timer = null;
    if (!isCountAnimation) {
      timer && clearInterval(timer);
      return;
    }
    timer = setInterval(() => {
      const id = v4();
      setCurrentId(id);
    }, animationTime * 1000);
    return () => {
      clearInterval(timer);
    };
  }, [isCountAnimation, animationTime]);

  const setLocaleValue = useCallback(
    value => {
      if (!value && value !== 0) return '-';
      if (typeof value !== 'number' || !isAmountFormat) {
        return String(value);
      }
      return value.toLocaleString();
    },
    [isAmountFormat],
  );

  const renderItemCount = useCallback(
    val => {
      const yHeight = val * itemHeight;
      const scrollClass = 'numbers-scroll' + val;
      return (
        <span
          className={classnames(styles.numberList, styles[scrollClass])}
          style={{
            animationDuration: val ? val * 0.2 : 1,
            transform: `translateY(-${yHeight}px)`,
          }}
          key={currentId}
        >
          <label>0</label>
          <label>1</label>
          <label>2</label>
          <label>3</label>
          <label>4</label>
          <label>5</label>
          <label>6</label>
          <label>7</label>
          <label>8</label>
          <label>9</label>
        </span>
      );
    },
    [itemHeight, currentId],
  );

  const renderCountContent = useCallback(
    count => {
      const valueText = setLocaleValue(count);
      if (!isCountAnimation) {
        return valueText;
      }
      const countString = valueText.split('');
      return countString.map((item, index) => {
        const value = Number(item);
        const isNanValue = !value && value !== 0;
        return (
          <span
            key={`${index}`}
            style={{
              width: 'auto',
              height: itemHeight,
            }}
          >
            {isNanValue ? item : renderItemCount(value)}
          </span>
        );
      });
    },
    [isCountAnimation, itemHeight, setLocaleValue, renderItemCount],
  );

  return (
    <div className={styles.container}>
      <div className={styles.list}>
        {(dataSource || []).map((n, index) => {
          const { label, value, key, type, percent, color } = n;
          let labelStyles = {
            fontSize: labelFontSize,
            color: labelColor,
          };

          let valueStyles = {
            fontSize: valueFontSize,
            color: valueColor,
          };

          if (index % 2 !== 0) {
            labelStyles.fontSize = !evenLabelFontSize ? labelFontSize : evenLabelFontSize;
            labelStyles.color = !evenLabelFontColor ? labelColor : evenLabelFontColor;
            valueStyles.fontSize = !evenValueFontSize ? valueFontSize : evenValueFontSize;
            valueStyles.color = !evenValueFontColor ? valueColor : evenValueFontColor;
          }

          return (
            <div
              key={key}
              className={styles.item}
              style={{
                height: itemHeight,
              }}
            >
              <div
                className={styles.label}
                style={{
                  width: labelWidth,
                  lineHeight: `${itemHeight}px`,
                  textAlign: labelAlign,
                  fontWeight: labelFontWeight,
                  ...labelStyles,
                }}
              >
                {label}
              </div>
              <div
                className={styles.value}
                style={{
                  width: valueWidth,
                  lineHeight: `${itemHeight}px`,
                  textAlign: valueAlign,
                  fontWeight: valueFontWeight,
                  fontStyle: valueFontStyle,
                  ...valueStyles,
                }}
              >
                {renderCountContent(value)}
              </div>
              {!!type && (
                <div
                  className={styles.icon}
                  style={{
                    marginLeft: iconMarginLeft,
                    lineHeight: `${itemHeight}px`,
                    color,
                    fontSize: iconFontSize,
                  }}
                >
                  <Icon type={type} style={{ marginRight: 5 }} />
                  {percent}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

ListCountStatus.propTypes = {
  data: PropTypes.object,
  style: PropTypes.object,
  lang: PropTypes.string,
};

export default ListCountStatus;
