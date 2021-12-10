import { useMemo, useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';
import { useDeepCompareEffect } from 'react-use';
import { Table } from 'antd';

import { useStyle } from '../option';
import { getFixedConfig } from './utils';

import styles from './index.less';

function getColumns(data) {
  let columns = data?.columns ?? [];

  if (!(columns instanceof Array)) {
    columns = [];
  }
  return columns;
}

function getDataSource(data) {
  let dataSource = data?.dataSource ?? [];

  if (!(dataSource instanceof Array)) {
    dataSource = [];
  }
  return dataSource;
}

/**
 * 设置table样式
 * @param {string} domSelect  dom选择器
 * @param {string} styleAttr document.style.styleAttr 样式属性名
 * @param {string} style 样式
 */
function useTableStyle(domSelect, styleAttr, style, otherDeps) {
  useDeepCompareEffect(() => {
    let domRef = document.querySelectorAll(domSelect);
    if (domRef) {
      for (let i = 0; i < domRef.length; i++) {
        if (domRef[i].style) {
          domRef[i].style[styleAttr] = style;
        }
      }
    }
    domRef = null;
  }, [domSelect, styleAttr, style, otherDeps]);
}
function AntdTable(props) {
  const [TABLE_ID] = useState(`table${uuid()}`);
  const [currentClick, setCurrentClick] = useState({});
  const { style, data, onChange } = props;
  const columns = getColumns(data);
  const dataSource = getDataSource(data);
  const total = data?.total;

  const finalStlye = useStyle(style);

  const {
    oddBgColor,
    evenBgColor,
    rowPadding,
    isHighlight,
    highlightKey,
    highlightColor,
    showCellHighlight,
    cellHighlightBgcolor,
    cellHighlightFontcolor,
  } = finalStlye.row;

  useEffect(() => {
    setCurrentClick({});
  }, [dataSource]);

  const onTdClick = useCallback(
    (key, value, record) => {
      console.log('table cell Clicked: ', { month: key, key, value, record });
      setCurrentClick({ ...record, clickKey: key });
      onChange &&
        onChange({
          month: key,
          key,
          value: value,
          rowData: record,
        });
    },
    [onChange],
  );

  const tableProps = useMemo(() => {
    const { autoWrap, header, column, pagination, ...restStyle } = finalStlye;
    const { showHeader } = header;
    const {
      align,
      isFixed,
      scrollX,
      leftFixed,
      rightFixed,
      fixedWidth,
      fontSize,
      color,
      clickColor,
      emptyText,
      emptyList,
      ...restColumn
    } = column;

    const whiteSpace = autoWrap ? 'normal' : 'nowrap';

    let scroll = {};
    if (isFixed && scrollX) {
      scroll['x'] = scrollX;
    }
    if (header.isFixed && header.scrollY) {
      scroll['y'] = header.scrollY;
    }

    let finalPagination = false;
    if (pagination.show) {
      finalPagination = pagination;
      if (total) {
        finalPagination = {
          ...finalPagination,
          total,
          onChange(pageNumber) {
            setCurrentClick({});
            onChange({
              pageNumber,
            });
          },
          onShowSizeChange(current, pageSize) {
            setCurrentClick({});
            onChange({
              pageNumber: current,
              pageSize,
            });
          },
        };
      }
    }

    /**
     * 函数返回 antd table 的column列表项
     * @typedef columnItem
     * @property {string} title
     * @property {string} dataIndex
     * @property {columnItem[]} children
     * @property {function} onHeaderCell
     * @property {function} onCell
     */
    /**
     * 递归
     * @returns {columnItem}
     */
    const renderColumnAndChilren = currentColumn => {
      const renderColumn = (text, record, index) => {
        let isEmpty;
        let finalText;
        isEmpty = emptyList.includes(`${text}`);
        finalText = !isEmpty ? text : emptyText;

        return finalText;
      };
      return {
        ...restColumn,
        render: renderColumn,
        ...currentColumn,
        children: currentColumn?.children?.map(m => renderColumnAndChilren(m)),
        onHeaderCell: column => {
          return {
            style: {
              color: header.color,
              fontSize: header.fontSize,
              borderColor: finalStlye.borderColor,
              backgroundColor: finalStlye.header.bgColor,
              whiteSpace,
              textAlign: align,
              ...currentColumn?._style,
            },
          };
        },
        onCell: (record, rowIndex) => {
          const dataIndex = currentColumn?.dataIndex;
          const text = record?.[dataIndex];
          const cellStyle = record?.[`_${dataIndex}Style`];
          let onClick = null;
          let style = {
            color: currentColumn.color || color,
            fontSize,
            borderColor: finalStlye.borderColor,
            whiteSpace,
            textAlign: align,
            padding: rowPadding || `16px 16px`,
          };

          if (currentColumn.canClick) {
            const intKey = dataIndex;
            onClick = () => onTdClick(intKey, text, { ...record, clickIndex: rowIndex });
            style.color = currentColumn.clickColor || clickColor || '#1991eb';
            style.cursor = 'pointer';
          }

          if (record.hasClick) {
            const intKey = Number(dataIndex);
            if (intKey && (intKey < 13 || currentColumn.colClick)) {
              onClick = () => onTdClick(intKey, text, { ...record, clickIndex: rowIndex });
              style.color = currentColumn.clickColor || clickColor || '#1991eb';
              style.cursor = 'pointer';
            }
          }

          if (cellStyle) {
            style = { ...style, ...cellStyle };
          }

          if (
            showCellHighlight &&
            currentClick?.clickIndex === rowIndex &&
            currentClick?.clickKey + '' === dataIndex
          ) {
            style = {
              ...style,
              backgroundColor: cellHighlightBgcolor || 'rgb(71, 156, 247)',
              color: cellHighlightFontcolor || '#fff',
            };
          }

          return {
            style,
            onClick: e => {
              if (!onClick) return;
              e.preventDefault();
              e.stopPropagation();
              onClick();
            },
          };
        },
      };
    };

    const finalColumns = columns.map((n, colIndex) => {
      const { itemConfig, itemChildren } = getFixedConfig(
        {
          isFixed,
          left: leftFixed,
          right: rightFixed,
          width: fixedWidth,
          len: columns.length,
          childrenArr: n.children,
        },
        colIndex,
      );

      n.children = itemChildren || n.children;

      const restColomnProps = renderColumnAndChilren(n);

      return {
        ...itemConfig,
        ...restColomnProps,
      };
    });

    return { ...restStyle, scroll, showHeader, columns: finalColumns, pagination: finalPagination };
  }, [
    finalStlye,
    columns,
    onTdClick,
    total,
    onChange,
    currentClick,
    showCellHighlight,
    cellHighlightBgcolor,
    cellHighlightFontcolor,
    rowPadding,
  ]);

  useTableStyle(`#${TABLE_ID} table`, 'borderColor', finalStlye.borderColor, [
    finalStlye,
    dataSource,
  ]);
  useTableStyle(`#${TABLE_ID}`, 'borderColor', finalStlye.borderColor, [finalStlye, dataSource]);

  return (
    <div className={styles.container}>
      <Table
        className={styles.table}
        dataSource={dataSource}
        {...tableProps}
        id={TABLE_ID}
        rowKey={(record, index) => index}
        loading={props?.loading ?? false}
        onRow={(record, index) => {
          let onRowObj = {};
          if (tableProps?.onRow && typeof tableProps?.onRow === 'function') {
            onRowObj = tableProps?.onRow(record, index) || {};
          }
          // 单行高亮数据
          if (isHighlight && highlightColor && highlightKey && record[highlightKey]) {
            return {
              style: { backgroundColor: highlightColor },
              ...onRowObj,
            };
          }
          const oddTr = index % 2 === 0;
          if (oddTr && oddBgColor) {
            return {
              style: { backgroundColor: oddBgColor },
              ...onRowObj,
            };
          }
          if (!oddTr && evenBgColor) {
            return {
              style: { backgroundColor: evenBgColor },
              ...onRowObj,
            };
          }
          return onRowObj;
        }}
      />
    </div>
  );
}

AntdTable.propTypes = {
  data: PropTypes.object,
};

export default AntdTable;
