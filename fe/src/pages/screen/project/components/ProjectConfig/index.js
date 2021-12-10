import React from 'react';
import { Modal, Tabs } from 'antd';

import { PageSwitchConfig, LoadingConfig, GitConfig, ServerConfig } from '../index';
import styles from './index.less';

const { TabPane } = Tabs;
const ProjectConfig = ({ visible, ...other }) => {
  return (
    <Modal
      title="项目配置"
      visible={visible}
      width={860}
      footer={null}
      onCancel={other.onCancel}
      className={styles.modal}
    >
      {visible && (
        <Tabs defaultActiveKey="1" tabPosition="left">
          <TabPane tab="页面" key="1">
            <PageSwitchConfig {...other}></PageSwitchConfig>
          </TabPane>
          <TabPane tab="数据" key="2">
            Content of Tab Pane 2
          </TabPane>
          <TabPane tab="Loading" key="3">
            <LoadingConfig {...other} />
          </TabPane>

          <TabPane tab="Git仓库" key="4">
            <GitConfig {...other} />
          </TabPane>

          <TabPane tab="服务器" key="5">
            <ServerConfig {...other} />
          </TabPane>
        </Tabs>
      )}
    </Modal>
  );
};

export default ProjectConfig;
