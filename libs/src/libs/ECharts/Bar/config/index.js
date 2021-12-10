import React, { PureComponent, Fragment } from 'react';
import EditECharts from '../../../../components/EditECharts';
import LineAndBarConfig from '../../components/LineAndBarConfig';

import styles from './index.less';
export default class Bar extends PureComponent {
  render() {
    const props = {
      ...this.props,
      type: 'bar',
    };
    return (
      <div className={styles.box}>
        <LineAndBarConfig {...props} />
        <EditECharts {...props} />
      </div>
    );
  }
}
