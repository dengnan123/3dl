import React from 'react';
import styles from './index.less';

function Index(props) {
  const { style, data = [], height, width } = props;
  const {
    MarginBottom = 20,
    FontSize = 20,
    FontColor = 'black',
    titleFontSize = 20,
    titleFontColor = 'black',
    startColor = 'rgb(180, 42, 42)',
    endColor = 'rgb(259, 156, 106)',
    blockWidth = 90,
    blockHeight = 26,
  } = style;
  const { dataSource, title } = data;
  const startList = startColor.match(/-?([1-9]\d*(\.\d*)*|0\.[1-9]\d*)/g);
  const endList = endColor.match(/-?([1-9]\d*(\.\d*)*|0\.[1-9]\d*)/g);
  const computeColor = (startList, endList, len, index) => {
    const R =
      ((parseInt(endList[0]) - parseInt(startList[0])) / len) * index + parseInt(startList[0]);
    const G =
      ((parseInt(endList[1]) - parseInt(startList[1])) / len) * index + parseInt(startList[1]);
    const B =
      ((parseInt(endList[2]) - parseInt(startList[2])) / len) * index + parseInt(startList[2]);
    return `rgb(${R}, ${G}, ${B})`;
  };

  return (
    <div>
      <div className={styles.item} style={{ marginBottom: MarginBottom }}>
        <div
          style={{
            backgroundColor: 'transparent',
            height: blockHeight,
            width: blockWidth,
          }}
        ></div>
        <div className={styles.titleItems}>
          {title.map(item => (
            <span
              key={item}
              style={{ ...item.ItemExtra, fontSize: titleFontSize, color: titleFontColor }}
              className={styles.titleItem}
            >
              {item.title}
            </span>
          ))}
        </div>
      </div>
      {dataSource.map((item, index) => (
        <div
          key={item.id}
          className={styles.item}
          style={{ marginBottom: MarginBottom, fontSize: FontSize, color: FontColor }}
        >
          <div
            style={{
              backgroundColor: computeColor(startList, endList, dataSource.length, index),
              height: blockHeight,
              width: blockWidth,
            }}
          ></div>
          {title.map(it => (
            <div className={styles.titleItems} style={{ ...it.ItemExtra }}>
              <span className={styles.titleItem}>{item[it.dataIndex]}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
export default Index;
