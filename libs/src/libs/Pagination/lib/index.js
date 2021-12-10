import React, { useState } from 'react';
import defaultConig from '../style.js';
import PropTypes from 'prop-types';
import styles from './index.less';
import classnames from 'classnames';
import { Button } from 'antd';
const Pagination = props => {
  const {
    style: {
      pagination = defaultConig['pagination'],
      onePageShowPagination = defaultConig['onePageShowPagination'],
      defaultCurrentPage = defaultConig['defaultCurrentPage'],
      currentPageSvg = defaultConig['currentPageSvg'],
      defaultSvg = defaultConig['defaultSvg'],
      pageSize = defaultConig['pageSize'],
      PaginationContainerStyle = defaultConig['PaginationContainerStyle'],
      svgContainer = defaultConig['svgContainer'],
      useAnimation = defaultConig['useAnimation'],
      hlightStyle = defaultConig['hlightStyle'],
      defaultStyle = defaultConig['defaultStyle'],
      LastButtonStyle,
      NextButtonStyle,
      lastPageText = '<<  上一页',
      nextPageText = '下一页  >>',
    } = defaultConig,
    onChange,
    data,
  } = props;
  const [currentPage, setCurrentPage] = useState(defaultCurrentPage);
  const handleChange = page => {
    setCurrentPage(page);
    onChange &&
      onChange({
        currentPage: page,
      });
  };
  // useEffect(() => {
  //   onChange &&
  //     onChange({
  //       includeEvents: ['hiddenComps', 'showComps', 'passParams'],
  //       currentPage: currentPage,
  //       data: data,
  //     });
  // }, [currentPage, data]);
  const parseStyle = styleString => {
    let style = {};
    if (!styleString) return style;
    styleString.split(';').forEach(item => {
      const [key, value] = item.split(':');
      style[key] = value;
    });
    return style;
  };
  if (!data && data !== 0) {
    return '数据长度错误';
  }
  const pageNumber = Math.ceil(data / pageSize);
  if (pageNumber === 0) return null;
  const finalPagination = pagination && pageNumber === 1 ? onePageShowPagination : pagination;
  return finalPagination ? (
    <div style={parseStyle(PaginationContainerStyle)}>
      <Button
        type="primary"
        style={{
          ...parseStyle(LastButtonStyle),
          width: '121px',
          height: '48px',
          fontFamily: 'PingFangSC',
          fontSize: '20px',
          borderRadius: 0,
          visibility: currentPage === 1 ? 'hidden' : '',
        }}
        onClick={() => handleChange(currentPage === 1 ? 1 : currentPage - 1)}
      >
        {lastPageText}
      </Button>
      <div style={parseStyle(svgContainer)}>
        {Array(pageNumber)
          .fill(1)
          .map((item, index) => {
            const isHlight = index + 1 === currentPage;
            return (
              <span
                key={index}
                dangerouslySetInnerHTML={{
                  __html: isHlight ? currentPageSvg : defaultSvg,
                }}
                onClick={() => handleChange(index + 1)}
                className={classnames(
                  useAnimation ? styles.animation : null,
                  !currentPageSvg && !defaultSvg
                    ? isHlight
                      ? styles.hlight
                      : styles.default
                    : null,
                )}
                style={{
                  width: isHlight ? '91px' : '31px',
                  ...parseStyle(isHlight ? hlightStyle : defaultStyle),
                }}
              ></span>
            );
          })}
      </div>
      <Button
        type="primary"
        style={{
          ...parseStyle(NextButtonStyle),
          width: '121px',
          height: '48px',
          fontFamily: 'PingFangSC',
          fontSize: '20px',
          borderRadius: 0,
          visibility: currentPage === pageNumber ? 'hidden' : '',
        }}
        onClick={() => handleChange(currentPage === pageNumber ? pageNumber : currentPage + 1)}
      >
        {nextPageText}
      </Button>
    </div>
  ) : null;
};

Pagination.prototype = {
  style: PropTypes.object,
};
export default Pagination;
