import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BackTop } from 'antd';
import IconFont from '../IconFont';
import { ReactComponent as TopArrow } from '../../assets/topArrow.svg';
import styles from './index.less';

class DfBackTop extends Component {
  render() {
    const { target, visibilityHeight } = this.props;

    return (
      <BackTop target={target} visibilityHeight={visibilityHeight} className={styles.backTop}>
        <IconFont colorful type="svg" renderSvg={TopArrow} style={{ width: 10, height: 10 }} />
        <p>Top</p>
      </BackTop>
    );
  }
}

DfBackTop.propTypes = {
  target: PropTypes.func,
  visibilityHeight: PropTypes.number,
};

export default DfBackTop;
