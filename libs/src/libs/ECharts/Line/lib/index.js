import React, { PureComponent } from 'react';

import LineAndBar from '../../components/LineAndBarChart';
export default class LineEaCharts extends PureComponent {
  render() {
    const props = {
      ...this.props,
      type: 'line',
    };

    return <LineAndBar {...props} />;
  }
}
