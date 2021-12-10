import React, { memo } from 'react';
import isEqual from 'fast-deep-equal';

import { PieChart3D } from '../../AmChartsApp';
import styles from './index.less';

const Am3DPie = props => {
  const { data = {}, style } = props;
  const { series = [] } = data;

  return (
    <div style={{ width: '100%', height: '100%' }} className={styles.amChartContent}>
      <PieChart3D data={series} config={style} />
    </div>
  );
};

function comparator(previosProps, nextProps) {
  if (!isEqual(previosProps.data, nextProps.data)) {
    return false;
  }
  if (!isEqual(previosProps.style, nextProps.style)) {
    return false;
  }
  return true;
}

export default memo(Am3DPie, comparator);
