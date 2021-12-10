import React from 'react';
import styles from '../index.less';

function MapStatusLib(props) {
  const { style, data } = props;
  const {
    HorizontalAndVertical = 'column',
    fontSize,
    titleMarginRight,
    statusColor,
    lineHeight,
  } = style;

  const layoutstyle = {
    display: 'flex',
    flexDirection: HorizontalAndVertical,
    justifyContent: 'space-between',
  };

  return (
    <div style={{ ...layoutstyle }}>
      {Array.isArray(data) &&
        data.map((item, index) => {
          const { key, value } = item;
          return (
            <div
              key={index}
              className={styles.statusLi}
              style={{
                color: statusColor,
                fontSize: `${fontSize}px`,
                lineHeight: `${lineHeight}px`,
                ...item.item,
              }}
            >
              <div style={{ marginRight: `${titleMarginRight}px`, ...item.title }}>
                {index !== 0 && (
                  <i
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      display: 'inline-block',
                      marginRight: 10,
                      ...item.circle,
                    }}
                  ></i>
                )}
                <span>{key}</span>
              </div>
              <span style={{ ...item.valueNumber }}>{value}</span>
            </div>
          );
        })}
    </div>
  );
}

export default MapStatusLib;
