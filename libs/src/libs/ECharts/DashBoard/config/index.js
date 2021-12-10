import React, { PureComponent, Fragment } from 'react';
import DashBoardConfig from '../../components/DashBoardConfig';
import EditECharts from '../../../../components/EditECharts';

import styles from './index.less';

export default class DashBoard extends PureComponent {
  render() {
    const props = {
      ...this.props,
    };
    return (
      <div className={styles.box}>
        <DashBoardConfig {...props} />
        <EditECharts {...props} />
      </div>
    );
  }
}
