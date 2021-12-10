import { useCallback, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Spin } from 'antd';
import styles from './index.less';

const CustomList = props => {
  const {
    style: {
      compKey = 'customList',
      bgColor = '#ffffff',
      borderWidth = 1,
      borderColor = 'rgba(217, 217, 217, 1)',
      borderRadius = '4px 4px 4px 4px',
      padding = '0 0 0 0',
      fontSize = 14,
      fontColor = 'rgba(0,0,0,0.65)',
      liHeight = 40,
      liPading = '0 0 0 0',
      showIcon = false,
      iconWidth = 8,
      iconHeight = 8,
      iconBorderRadius = '4px 4px 4px 4px',
      iconColor = '#1991eb',
      iconDistance = 5,
      emptyText = 'No Data',
      emptyTextColor = 'rgba(0,0,0,0.25)',
      emptyTextFontSize = 14,
      emptyTextLineHeight = 40,
    },
    onChange,
    data,
    loading,
  } = props;
  //
  const dataSource = data?.dataSource || [];

  const onChangeRef = useRef(onChange);

  const onLiClick = useCallback(
    n => {
      console.log('click', { [compKey]: { data: n, _type: 'click' } });
      onChangeRef.current && onChangeRef.current({ [compKey]: { data: n, _type: 'click' } });
    },
    [compKey],
  );

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const empty = dataSource?.length === 0;

  return (
    <ul
      className={styles.list}
      style={{ padding, backgroundColor: bgColor, borderWidth, borderRadius, borderColor }}
    >
      <Spin spinning={loading ?? false}>
        {empty && (
          <div className={styles.empty}>
            <p
              className={styles.emptyDesc}
              style={{
                color: emptyTextColor,
                fontSize: emptyTextFontSize,
                lineHeight: `${emptyTextLineHeight}px`,
              }}
            >
              {emptyText}
            </p>
          </div>
        )}
        {dataSource.map((n, i) => {
          return (
            <li
              key={n?.id ?? i}
              style={{
                fontSize,
                color: fontColor,
                lineHeight: `${liHeight}px`,
                padding: liPading,
                ...n?.liStyle,
              }}
              onClick={() => onLiClick(n)}
            >
              {showIcon && (
                <i
                  className={styles.icon}
                  style={{
                    width: iconWidth,
                    height: iconHeight,
                    backgroundColor: iconColor,
                    borderRadius: iconBorderRadius,
                    marginRight: iconDistance,
                    ...n?.iconStyle,
                  }}
                ></i>
              )}
              {n?.label}
            </li>
          );
        })}
      </Spin>
    </ul>
  );
};

CustomList.propTypes = {
  onChange: PropTypes.func,
  style: PropTypes.object,
  lang: PropTypes.string,
  data: PropTypes.object,
  shouldClearParams: PropTypes.any,
  isHidden: PropTypes.bool,
  loading: PropTypes.bool,
};

export default CustomList;
