import React, { PureComponent } from 'react';
import LineAndBarConfig from '../../components/LineAndBarConfig';
import EditECharts from '../../../../components/EditECharts';

import styles from './index.less';
export default class EchartLine extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const props = { ...this.props, type: 'line' };
    return (
      <div className={styles.box}>
        <LineAndBarConfig {...props} />
        <EditECharts {...props} />
      </div>
    );
  }
}
