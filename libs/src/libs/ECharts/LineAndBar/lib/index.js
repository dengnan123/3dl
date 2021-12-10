import React, { PureComponent } from 'react';

import LineAndBarChart from '../../components/LineAndBarChart';
export default class Bar extends PureComponent {
  render() {
    const props = {
      ...this.props,
      type: 'line',
    };

    return <LineAndBarChart {...props}></LineAndBarChart>;
  }
}
