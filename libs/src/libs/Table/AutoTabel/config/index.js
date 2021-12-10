import React, { Component } from 'react';

import { Tabs } from 'antd';
import BasalTable from '../../components/BasalTableTab';

const { TabPane } = Tabs;

class TableConfigTabs extends Component {
  render() {
    return (
      <Tabs>
        <TabPane tab="基础" key="1">
          <BasalTable {...this.props} />
        </TabPane>
        <TabPane tab="高级" key="3">
          开发中
        </TabPane>
      </Tabs>
    );
  }
}

TableConfigTabs.propTypes = {};

export default TableConfigTabs;
