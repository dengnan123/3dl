import React, { PureComponent, Fragment } from 'react';
import LineAndBarConfig from '../../components/LineAndBarConfig';
import EditECharts from '../../../../components/EditECharts';

import styles from './index.less';

export default class Bar extends PureComponent {
  render() {
    const props = {
      ...this.props,
      type: 'lineAndBar',
    };
    return (
      <div className={styles.box}>
        <LineAndBarConfig {...props} />
        <EditECharts {...props} />
      </div>
    );
  }
}
