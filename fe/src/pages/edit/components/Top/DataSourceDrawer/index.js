import React from 'react';

import APIRouter from '@/components/APIRouter';
import { getAllDataSource } from '@/service';

import styles from './index.less';

function DataSourceDrawer({ tagId, ...rest }) {
  const apiRouterPubProps = {
    tagId,
    getList: getAllDataSource,
  };

  return (
    <div className={styles.apisContent}>
      <APIRouter {...apiRouterPubProps}></APIRouter>
    </div>
  );
}

export default DataSourceDrawer;
