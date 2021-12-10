import React, { PureComponent } from 'react';
import BarEChart from '../../components/LineAndBarChart';
export default class Bar extends PureComponent {
  render() {
    const props = {
      ...this.props,
      type: 'bar',
    };

    return <BarEChart {...props}></BarEChart>;
  }
}
