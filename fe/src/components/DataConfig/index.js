import React, { useState } from 'react';
import { Tabs } from 'antd';

import APIRouter from '@/components/APIRouter';
import APIHost from '@/components/APIHost';
import EnvConfig from '@/components/EnvConfig';
import { getAllDataSource } from '@/service';
// import { getParseSearch } from '@/helpers/utils';

import styles from './index.less';

const { TabPane } = Tabs;

const DataConfig = ({
  hiddenEnv,
  hiddenApiHost,
  tagId,
  hiddenApiRouter,
  hiddenApiRouterPub,
  defaultActiveKey,
}) => {
  const [activeKey, setActiveKey] = useState('EnvConfig');
  // const apiRouterProps = {
  //   tagId,
  //   getList: getAllDataSourceByPageId,
  // };

  const apiRouterPubProps = {
    tagId,
    getList: getAllDataSource,
  };

  return (
    <Tabs
      className={styles.tabsContent}
      onChange={key => setActiveKey(key)}
      activeKey={activeKey}
      type="line"
    >
      {!hiddenEnv && (
        <TabPane tab={'环境设置'} key={'EnvConfig'}>
          <EnvConfig tagId={tagId}></EnvConfig>
        </TabPane>
      )}
      {!hiddenEnv && (
        <TabPane tab={'数据源'} key={'APIHost'}>
          <APIHost tagId={tagId}></APIHost>
        </TabPane>
      )}
      {!hiddenApiRouterPub && (
        <TabPane tab={'API'} key="APIRouterPub">
          {activeKey === 'APIRouterPub' && <APIRouter {...apiRouterPubProps}></APIRouter>}
        </TabPane>
      )}
    </Tabs>
  );
};

export default DataConfig;
