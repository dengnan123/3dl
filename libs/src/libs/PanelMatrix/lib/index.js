import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './index.less';
import defaultConig from '../styles';
import Pagination from '../../Pagination/lib';

const PanelMatrix = props => {
  const {
    data,
    style: {
      // width = defaultConig['width'],
      showBorder = defaultConig['showBorder'],
      BorderColor = defaultConig['BorderColor'],
      boxPadding = defaultConig['boxPadding'],
      showBackground = defaultConig['showBackground'],
      background = defaultConig['background'],
      BorderRaduis = defaultConig['BorderRaduis'],

      pagination = defaultConig['pagination'],
      // onePageShowPagination = defaultConig['onePageShowPagination'],
      defaultCurrentPage = defaultConig['defaultCurrentPage'],
      pageSize = defaultConig['pageSize'],

      cellRowStyle = defaultConig['cellRowStyle'],
      cellColumnStyle = defaultConig['cellColumnStyle'],
      cellMatrixStyle = defaultConig['cellMatrixStyle'],
    },
  } = props;

  const [currentPage, setCurrentPage] = useState(defaultCurrentPage);
  const parseStyle = styleString => {
    let style = {};
    if (!styleString) return style;
    styleString.split(';').forEach(item => {
      const [key, value] = item.split(':');
      style[key] = value;
    });
    return style;
  };
  // useEffect(() => {
  //   onChange &&
  //     onChange({
  //       includeEvents: ['hiddenComps', 'showComps', 'passParams'],
  //       currentPage: currentPage,
  //       data: data,
  //     });
  // }, [currentPage, data]);
  const content = useMemo(() => {
    let key = 0;
    const loopRender = (matrixData, shouldShowDataSize, currentPage) => {
      let resultTemp = [];
      for (
        let index = (currentPage - 1) * shouldShowDataSize;
        index <
        (shouldShowDataSize * currentPage >= matrixData.length
          ? matrixData.length
          : shouldShowDataSize * currentPage);
        index++
      ) {
        if (Array.isArray(matrixData[index].children)) {
          resultTemp.push(
            <div
              key={index}
              className={styles.row}
              style={parseStyle(cellRowStyle[pagination ? index % pageSize : index])}
            >
              {loopRender(matrixData[index].children, matrixData[index].children.length, 1)}
            </div>,
          );
        } else {
          let keyTemp = key;
          const rowIndex = keyTemp / matrixData.length;
          const columnIndex = keyTemp % matrixData.length;
          resultTemp.push(
            <div
              key={keyTemp}
              className={styles.cell}
              style={{
                ...parseStyle(cellColumnStyle[columnIndex]),
                ...parseStyle(
                  cellMatrixStyle[Math.floor(rowIndex)] &&
                    cellMatrixStyle[Math.floor(rowIndex)][columnIndex]
                    ? cellMatrixStyle[Math.floor(rowIndex)][columnIndex]
                    : null,
                ),
              }}
              dangerouslySetInnerHTML={{
                __html: (function render() {
                  if (matrixData[index].render && typeof matrixData[index].render === 'function') {
                    if (matrixData[index].useJSX) {
                      return matrixData[index].render(matrixData[index]);
                    }
                    return matrixData[index].render(matrixData[index]);
                  } else {
                    matrixData[index].render &&
                      // eslint-disable-next-line no-new-func
                      (matrixData[index].customerRender = new Function(
                        'record',
                        matrixData[index].render,
                      ));
                    if (
                      matrixData[index].customerRender &&
                      typeof matrixData[index].customerRender === 'function'
                    ) {
                      if (matrixData[index].useJSX) {
                        return matrixData[index].customerRender(matrixData[index]);
                      }
                      return matrixData[index].customerRender(matrixData[index]);
                    }
                    return matrixData[index];
                  }
                })(),
              }}
            ></div>,
          );
          key++;
        }
      }
      return resultTemp;
    };
    const shouldShowDataSize =
      Number.isInteger(+pageSize) && +pageSize <= data.length ? +pageSize : data.length;
    const result = loopRender(data, shouldShowDataSize, currentPage);
    return result;
  }, [data, cellColumnStyle, cellMatrixStyle, cellRowStyle, currentPage, pageSize, pagination]);

  const handleChange = page => {
    setCurrentPage(page.currentPage);
  };

  return (
    <div
      style={{
        // width: `${width}px`,
        border: showBorder ? `1px solid ${BorderColor}` : 'none',
        padding: boxPadding,
        background: showBackground ? background : 'none',
        borderRadius: BorderRaduis,
      }}
      className={styles.container}
    >
      {data && data.length ? content : null}
      <Pagination
        {...props}
        style={{ ...props.style }}
        data={data.length}
        onChange={handleChange}
      ></Pagination>
    </div>
  );
};

PanelMatrix.prototype = {
  data: PropTypes.object,
  style: PropTypes.object,
};

export default PanelMatrix;
