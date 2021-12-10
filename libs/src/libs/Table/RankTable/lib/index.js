import React, { useCallback, useMemo, useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { reap } from '../../../../components/SafeReaper';
import { filterObj } from '../../../../helpers/utils';
import { Icon } from 'antd';
import styles from './index.less';

import { filterDataFunc } from '../../../../helpers/requestFilter';
import { v4 } from 'uuid';
import useDynamicStyle from '../../../../hooks/useDynamicStyle';

function RankTable(props) {
  const { width, height, style, data } = props;

  const { columns, dataSource } = data;
  // 滚动计时器
  const timer = useRef(null);
  const tbody = useRef(null);
  const [translateY, setTranslateY] = useState(0);
  // 悬浮高亮
  const [hoverRowCol, setHoverRowCol] = useState(0);

  const _style = filterObj(style, ('', null, undefined));
  const textAlign = reap(_style, 'textAlign', 'left');
  const showTableHead = reap(_style, 'showTableHead', true);
  const theadHeight = reap(_style, 'theadHeight', 60);
  const theadFontSize = reap(_style, 'theadFontSize', 14);
  const theadFontWeight = reap(_style, 'theadFontWeight', 400);
  const tbodyFontSize = reap(_style, 'tbodyFontSize', 14);
  const theadBgColor = reap(_style, 'theadBgColor', '#ffffff');
  const theadColor = reap(_style, 'theadColor', '#b2b3b2');
  const thbodyColor = reap(_style, 'thbodyColor', '#808080');
  const evenThbodyColor = reap(_style, 'evenThbodyColor', '');
  const odd = reap(_style, 'odd', '#ffffff'); // 单数行背景颜色
  const even = reap(_style, 'even', '#ffffff'); // 双数行背景色
  const thbodyHighlightColor = reap(_style, 'thbodyHighlightColor', '');
  const colHighlightColor = reap(_style, 'colHighlightColor', '');
  const isCustomRowHeight = reap(_style, 'isCustomRowHeight', false);
  const customRowHeight = reap(_style, 'rowHeight', 40);
  const autoScroll = reap(_style, 'autoScroll', false);
  const speed = reap(_style, 'speed', 200);
  const rank1 = reap(_style, 'rank1', '#ff8e36');
  const rank2 = reap(_style, 'rank2', '#ffaf36');
  const rank3 = reap(_style, 'rank3', '#ffd736');
  const rankIconWidth = reap(_style, 'rankIconWidth', 19);
  const rankFontColor = reap(_style, 'rankFontColor', '#ffffff');
  const rankUpColor = reap(_style, 'rankUpColor', '#31c58d');
  const rankDownColor = reap(_style, 'rankDownColor', '#eb4b19');
  const showRankIcon = reap(_style, 'showRankIcon', true);
  const dataSourceLength = dataSource ? dataSource.length : 1;

  const marginBottom = reap(_style, 'marginBottom', 0);
  const customized = reap(_style, 'customizedContent', false);
  const rawHTML = reap(_style, 'rawHTML', null);

  const isShowScrollbar = reap(_style, 'isShowScrollbar', false);
  const scrollbarWidth = reap(_style, 'scrollbarWidth', 3);
  const scrollbarThumb = reap(_style, 'scrollbarThumbBg', 'rgba(85, 85, 85, 0.2)');
  const scrollbarTrack = reap(_style, 'scrollbarTrackBg', '#fff');

  // 动态加载css到head里
  const tableId = v4();

  useDynamicStyle(
    tableId,
    '::-webkit-scrollbar',
    'width',
    data?.scrollbarWidth || scrollbarWidth + 'px !important',
  );
  useDynamicStyle(
    tableId,
    '::-webkit-scrollbar-thumb',
    'background',
    data?.scrollbarThumb || scrollbarThumb + ' !important',
  );
  useDynamicStyle(
    tableId,
    '::-webkit-scrollbar-track',
    'background',
    data?.scrollbarTrack || scrollbarTrack + ' !important',
  );

  const renderHTML = useCallback(
    dataitem => {
      return filterDataFunc(rawHTML, dataitem);
    },
    [rawHTML],
  );

  // 行高、tbody height
  const { rowHeight, tbodyHeight } = useMemo(() => {
    let rowNumber = dataSourceLength; // 分列行数
    let rh = 0;
    let tbodyHeight = 0;
    if (showTableHead) {
      rowNumber += 1;
    }
    rh = rowNumber > 0 ? height / rowNumber : height; // 分列每行高
    if (isCustomRowHeight) {
      rh = customRowHeight || 40;
    }
    tbodyHeight = showTableHead ? height - theadHeight : height;
    console.log(rh, tbodyHeight);
    return { rowHeight: rh, tbodyHeight };
  }, [
    isCustomRowHeight,
    showTableHead,
    dataSourceLength,
    height,
    theadHeight,
    customRowHeight,
    marginBottom,
  ]);

  const rankIconColor = useMemo(() => {
    return {
      1: rank1,
      2: rank2,
      3: rank3,
    };
  }, [rank1, rank2, rank3]);

  // 排名
  const rankRender = useCallback(
    (dataItem, index) => {
      const rank = index + 1;

      return (
        <span
          className={styles.icon}
          style={{
            color: [1, 2, 3].includes(rank) ? rankFontColor : thbodyColor,
            backgroundColor: rankIconColor[rank],
            width: rankIconWidth,
            height: rankIconWidth,
            lineHeight: `${rankIconWidth}px`,
          }}
        >
          {rank}
        </span>
      );
    },
    [rankIconColor, rankIconWidth, rankFontColor, thbodyColor],
  );

  // 排名变化
  const rankChangeRender = useCallback(
    dataItem => {
      const { rankChange = 0 } = dataItem;

      const number = Number(rankChange.toString().replace(/[^\d|^\.|^\-]/g, ''));

      if (number === 0) {
        return '-';
      } else if (number > 0) {
        return (
          <span style={{ color: rankUpColor }}>
            {showRankIcon && <Icon type="arrow-up" style={{ marginRight: 3 }} />}
            {number}
          </span>
        );
      } else {
        return (
          <span style={{ color: rankDownColor }}>
            {showRankIcon && <Icon type="arrow-down" style={{ marginRight: 3 }} />}
            {number.toString().replace('-', '')}
          </span>
        );
      }
    },
    [showRankIcon, rankUpColor, rankDownColor],
  );

  // 向上滚动
  const scrollUp = useCallback(() => {
    let firstElement = tbody.current.firstElementChild;
    tbody.current.removeChild(firstElement);
    tbody.current.appendChild(firstElement);
    firstElement = null;
  }, []);

  // 开始滚动
  const scrollStart = useCallback(() => {
    timer.current && clearInterval(timer.current);
    if (!autoScroll || dataSourceLength * parseInt(rowHeight) - parseInt(tbodyHeight) <= 0) {
      return;
    }
    const delay = 10000 / (speed || 200);
    timer.current = setInterval(() => {
      setTranslateY(t => {
        const translateY = (t - 1) % rowHeight;

        if (parseInt(translateY % rowHeight) === 0) {
          scrollUp();
        }
        return translateY;
      });
    }, delay);
  }, [tbodyHeight, dataSourceLength, rowHeight, autoScroll, speed, scrollUp]);

  // 停止滚动
  const scrollStop = useCallback(() => {
    timer.current && clearInterval(timer.current);
  }, []);

  // 自动滚动
  useEffect(() => {
    scrollStart();
    return scrollStop;
  }, [scrollUp, scrollStart, scrollStop]);

  return (
    <div
      onMouseOver={scrollStop}
      onMouseLeave={() => {
        scrollStart();
        setHoverRowCol();
      }}
    >
      <table id={tableId} style={{ width, height, textAlign }} className={styles.table}>
        {showTableHead && (
          <thead
            style={{
              backgroundColor: theadBgColor,
            }}
            onMouseEnter={() => setHoverRowCol()}
          >
            <tr>
              {(columns || []).map((item, index) => {
                return (
                  <th
                    style={{
                      minWidth: 50,
                      width: item.width,
                      height: theadHeight,
                      lineHeight: `${theadHeight}px`,
                      fontSize: theadFontSize,
                      fontWeight: theadFontWeight,
                      color: theadColor,
                    }}
                    key={index}
                  >
                    {item.title}
                  </th>
                );
              })}
            </tr>
          </thead>
        )}

        <tbody
          ref={tbody}
          style={{
            height: tbodyHeight,
            display: 'block',
            overflowY: isShowScrollbar ? 'scroll' : 'hidden',
          }}
        >
          {(dataSource || []).map((dataitem, sourceindex) => {
            let trColor = thbodyColor;
            if (sourceindex % 2 !== 0 && !!evenThbodyColor) {
              trColor = evenThbodyColor;
            }
            return (
              <tr
                key={sourceindex}
                style={{
                  height: rowHeight - marginBottom,
                  color: trColor,
                  fontSize: tbodyFontSize || 14,
                  backgroundColor: `${sourceindex % 2 === 0 ? odd : even}`,
                  transform: `translateY(${translateY}px)`,
                  marginBottom: `${marginBottom}px`,
                }}
              >
                {(columns || []).map((colItem, colIndex) => {
                  let renderContent = dataitem[colItem.dataIndex];
                  const rowCol = `${sourceindex}${colIndex}`;
                  const hover = rowCol === hoverRowCol;

                  if (colItem.dataIndex === 'rank') {
                    renderContent = rankRender(dataitem, sourceindex);
                  }

                  if (colItem.dataIndex === 'rankChange') {
                    renderContent = rankChangeRender(dataitem);
                  }

                  let tdColor = trColor;
                  if (hover && !!thbodyHighlightColor) {
                    tdColor = thbodyHighlightColor;
                  } else if (!!colItem.color) {
                    tdColor = colItem.color;
                  }

                  return (
                    <td
                      key={colIndex}
                      style={{
                        width: colItem.width,
                        backgroundColor: hover ? colHighlightColor : 'unset',
                        color: tdColor,
                      }}
                      onMouseEnter={() => setHoverRowCol(rowCol)}
                    >
                      {customized ? (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: renderHTML({ dataitem, colItem }),
                          }}
                        />
                      ) : (
                        renderContent
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

RankTable.propTypes = {
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  style: PropTypes.object,
  data: PropTypes.object,
};

export default RankTable;
