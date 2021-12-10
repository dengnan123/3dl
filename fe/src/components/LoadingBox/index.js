import React from 'react';
import PropTypes from 'prop-types';
import { Spin } from 'antd';
import styles from './index.less';

function LoadingBox({ loading }) {
  if (!loading) {
    return null;
  }
  return (
    <div className={styles.spin}>
      <Spin spinning={true} />
    </div>
  );
}

LoadingBox.propTypes = {
  loading: PropTypes.bool,
};

export default LoadingBox;
