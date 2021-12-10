import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { Carousel } from 'antd';
import styles from './index.less';
import { reap } from '../../../../components/SafeReaper';
import { filterObj } from '../../../../helpers/utils';

class RollTable extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.container = React.createRef();
    this.header = React.createRef();
  }

  render() {
    const { style, data } = this.props;
    const { columns = [], dataSource = [] } = data;
    // const columns = reap(data, 'columns', []);
    // const dataSource = reap(data, 'dataSource', [[]]);

    const containerHeight = this.container.current ? this.container.current.offsetHeight : 400;
    // const bodyHeight = containerHeight - 40;
    const width = this.container.current ? this.container.current.offsetWidth : 700;
    const headerHeight = this.header.current ? this.header.current.offsetHeight : 400;
    const bodyHeight = containerHeight - headerHeight;

    const _style = filterObj(style, ('', null, undefined));
    const theadFontSize = reap(_style, 'theadFontSize', 15); // 表头字体
    const theadColor = reap(_style, 'theadColor', '#ffffff'); // 表头颜色
    const theadBgColor = reap(_style, 'theadBgColor', '#0e1c32fa'); // 头部背景
    const tbodyFontSize = reap(_style, 'tbodyFontSize', 13); // 内容字体
    const thbodyColor = reap(_style, 'thbodyColor', '#ffffff'); // 内容颜色
    const odd = reap(_style, 'odd', '#0e1c32fa'); // 单数行背景颜色
    const event = reap(_style, 'enent', '#253e75e0'); // 双数行背景色

    const borderWidth = reap(_style, 'borderWidth', 0);
    const borderRadius = reap(_style, 'borderRadius', 0);
    const borderColor = reap(_style, 'borderColor', '');
    const borderStyle = reap(_style, 'borderStyle', 'solid');

    return (
      <div
        className={styles.box}
        ref={this.container}
        style={{ borderWidth, borderRadius, borderColor, borderStyle }}
      >
        <div ref={this.header} className={styles.tableHeader} style={{ background: '#0e1c32fa' }}>
          {(columns || []).map((item, i) => {
            return (
              <div
                className={styles.tableHeaderColumn}
                key={i}
                style={{
                  width,
                  fontSize: theadFontSize,
                  color: theadColor || '#fff',
                  backgroundColor: theadBgColor || '#0e1c32fa',
                  //  '#b7a6a6'
                }}
              >
                {item.title}
              </div>
            );
          })}
        </div>
        <div className={styles.tablePlayBody} style={{ height: bodyHeight }}>
          <Carousel
            autoplay
            dots={false}
            autoplaySpeed={5000}
            dotPosition="bottom"
            style={{ maxHeight: bodyHeight, overflowX: 'hidden' }}
          >
            {dataSource &&
              (dataSource || []).map((dataSourceItem, k) => {
                return (
                  <div key={k} className={styles.tablePlate} style={{ height: bodyHeight }}>
                    {(dataSourceItem || []).map((chilrenItem, n) => {
                      return (
                        <div
                          key={n}
                          className={styles.tableRow}
                          style={{
                            color: thbodyColor,
                            fontSize: tbodyFontSize,
                            backgroundColor: n % 2 === 0 ? odd : event,
                          }}
                        >
                          {(columns || []).map(colItem => {
                            return (
                              <span style={{ width }} className={styles.tableBodyCol}>
                                {chilrenItem[colItem.dataIndex]}
                              </span>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
          </Carousel>
        </div>
      </div>
    );
  }
}

RollTable.propTypes = {};

export default RollTable;
