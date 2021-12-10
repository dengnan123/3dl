import React, { Fragment } from 'react';
import CompLib from '@/components/CompLib';
import { Button } from 'antd';
import styles from './index.less';

export default props => {
  const { confirmChangeChart, confirmLoading } = props;
  console.log('confirmLoadingconfirmLoadingconfirmLoadingconfirmLoading', confirmLoading);
  return (
    <Fragment>
      <CompLib {...props}></CompLib>
      <div className={styles.btnDiv}>
        <Button type="primary" onClick={confirmChangeChart} loading={confirmLoading}>
          确认更换
        </Button>
      </div>
    </Fragment>
  );
};
