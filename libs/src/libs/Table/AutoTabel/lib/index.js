import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './index.less';
import { reap } from '../../../../components/SafeReaper';

import { filterObj } from '../../../../helpers/utils';

/**
 * width，height @public 宽，高 {number}
 */

class AutoTable extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { width, height, style, data } = this.props;

    const { columns, dataSource } = data;

    const rowNumber = dataSource ? dataSource.length + 1 : 0; // 分列行数
    const rowHeight = height / rowNumber; // 分列每行高
    const _style = filterObj(style, ('', null, undefined));
    const theadFontSize = reap(_style, 'theadFontSize', 15);
    const tbodyFontSize = reap(_style, 'tbodyFontSize', 13);
    const theadColor = reap(_style, 'theadColor', '#9598a5');
    const thbodyColor = reap(_style, 'thbodyColor', '#FFF');
    const theadBgColor = reap(_style, 'theadBgColor', '#0e1c32fa');
    const odd = reap(_style, 'odd', '#b9c3d9c2'); // 单数行背景颜色
    const even = reap(_style, 'even', '#0e1c32fa'); // 双数行背景色

    return (
      <div>
        <table style={{ width, height }} className={styles.table}>
          <thead
            style={{
              fontSize: theadFontSize,
              color: theadColor,
              backgroundColor: theadBgColor,
            }}
          >
            <tr>
              {(columns || []).map((item, index) => {
                return (
                  <th style={{ minWidth: 50 }} key={index}>
                    {item.title}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody ref={this.tableBody}>
            {(dataSource || []).map((dataitem, sourceindex) => {
              return (
                <tr
                  key={sourceindex}
                  style={{
                    height: rowHeight,
                    color: thbodyColor,
                    fontSize: tbodyFontSize || 13,
                    backgroundColor: `${sourceindex % 2 === 0 ? odd : even}`,
                  }}
                >
                  {(columns || []).map((colItem, colIndex) => {
                    return <td key={colIndex}>{dataitem[colItem.dataIndex]}</td>;
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

AutoTable.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  style: PropTypes.object,
  data: PropTypes.object,
};

export default AutoTable;
