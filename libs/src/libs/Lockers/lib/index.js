import React from 'react';
import lockerImg from '../image/Group.svg';
import ubox from '../image/ubox.png';
import nbox from '../image/nbox.png';
import styles from '../index.less';

const LockersLib = ({ data, style }) => {
  const {
    color = '#0066CC',
    fontSize = 20,
    width = 20,
    paddingLeft = 15,
    borderRadius = 5,
    background = '#ECECEC',
    padding = 15,
    boxWidth = 50,
    insideMargin = 10,
    height = 20,
    lockerTab = 25,
    titlePadding = 25,
    lockerMarginLeft = 25,
    showTitle = false,
    lockerRow = 4,
    followingSystem = true,
    Chinese,
    English,
  } = style;

  const lockerName = {
    'zh-CN': '储物柜',
    'en-US': 'Lockers',
  };

  const getTitleName = () => {
    if (followingSystem) {
      let langurage = window.localStorage.getItem('umi_locale');
      return lockerName[langurage];
    } else if (Chinese) {
      return lockerName['zh-CN'];
    } else if (English) {
      return lockerName['en-US'];
    }
  };

  const { equList } = data;
  const newEquList = (equList || []).sort((a, b) => {
    return a.equName.localeCompare(b.equName);
  });

  return (
    <div className={styles.lockerFill}>
      {newEquList.map((item, i) => {
        const col = item?.column ? +item.column : Math.floor(item.boxInfo.length / lockerRow);
        let calculationWidth = boxWidth * col + padding * 2 + (col - 1) * insideMargin;

        return (
          <div key={item.equName} style={{ marginLeft: lockerMarginLeft }}>
            <div style={{ padding: `${titlePadding}px 0px ` }} className={styles.lockerTitle}>
              <img src={lockerImg} alt="" style={{ width }} className={styles.lockerImg} />
              {showTitle ? (
                <span style={{ color, fontSize, paddingLeft }}>{item.equName}</span>
              ) : (
                <span style={{ color, fontSize, paddingLeft }}>
                  {getTitleName()} {number[i]}
                </span>
              )}
            </div>

            <div
              style={{
                width: calculationWidth || 580,
                background,
                padding: `${padding}px ${padding}px 0px ${padding}px`,
                borderRadius,
                marginLeft: lockerTab,
              }}
            >
              <Box allBox={item} style={style} />

              <div
                style={{
                  width: calculationWidth,
                  background: '#CACACA',
                  marginLeft: -padding,
                  borderRadius: 5,
                  height,
                }}
              ></div>
            </div>
          </div>
        );
      })}

      {Array.isArray(newEquList) && newEquList.length === 0 && (
        <div
          style={{
            width: '100%',
            color: '#0066cc',
            fontSize,
            textAlign: 'center',
            lineHeight: `${fontSize}px`,
          }}
        >
          暂无数据
        </div>
      )}
    </div>
  );
};

export default LockersLib;

// 储物柜格子
const Box = ({ allBox, style }) => {
  const { boxInfo } = allBox;
  const { boxWidth = 50, insideMargin = 10, lockerRow = 4 } = style;
  const col = allBox?.column ? +allBox.column : Math.floor(allBox.boxInfo.length / lockerRow);

  return (
    <>
      {(boxInfo || []).map((item, index) => {
        return !!Number(item.doorStatus) ? (
          <img
            key={Math.random()}
            style={{
              width: boxWidth,
              marginBottom: insideMargin,
              marginRight: (index + 1) % col === 0 ? 0 : insideMargin,
            }}
            src={nbox}
            alt={`idle${index}`}
          />
        ) : (
          <img
            key={Math.random()}
            style={{
              width: boxWidth,
              marginBottom: insideMargin,
              marginRight: (index + 1) % col === 0 ? 0 : insideMargin,
            }}
            src={ubox}
            alt={`use${index}`}
          />
        );
      })}
    </>
  );
};

const number = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
];
