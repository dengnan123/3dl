import React from 'react';
import { Map } from 'react-amap';

const loadingStyle = {
  position: 'relative',
  height: '100%',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};
const Loading = <div style={loadingStyle}>Loading Map...</div>;

function EChartMap(props) {
  return <Map amapkey={'17c727cd3342413a719e8be4cc867fb3'} loading={Loading} />;
}

export default EChartMap;
