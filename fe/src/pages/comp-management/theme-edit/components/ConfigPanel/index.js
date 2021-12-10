import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';

import { useDebounce } from 'react-use';
import { API_HOST } from '@/config';
import { Tabs } from 'antd';

import CompDataConfig from './components/CompDataConfig';
import CompStyleConfig from './components/CompStyleConfig';
import { getMockData } from '@/helpers/utils';

const { TabPane } = Tabs;

const formItemLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const ConfigPanel = props => {
  const { selectedCompInfo, attributeUpdate } = props;

  const { id, style = {}, compName, mockData } = selectedCompInfo || {};

  const updateStyle = useCallback(
    field => {
      attributeUpdate({ id, style: field });
    },
    [id, attributeUpdate],
  );

  const updateMockData = useCallback(
    field => {
      attributeUpdate({ id, ...field });
    },
    [id, attributeUpdate],
  );

  const staticData = {};

  const compProps = {
    updateStyle,
    formItemLayout,
    style,
    id,
    selectedCompInfo,
    updateMockData,
    mockData: getMockData(mockData, staticData) || {},
    compName,
    API_HOST,
    attributeUpdate,
  };

  const dataConfigProps = {
    formItemLayout,
    style,
    compName,
    mockData,
    staticData,
    selectedCompInfo,
    attributeUpdate,
    updateMockData,
  };

  return (
    <div
      style={{
        height: '100%',
      }}
    >
      <Tabs tabPosition="right" defaultActiveKey="1">
        <TabPane tab="属性" key="1">
          <CompStyleConfig {...compProps}></CompStyleConfig>
        </TabPane>
        <TabPane tab="数据" key="2">
          <CompDataConfig {...dataConfigProps}></CompDataConfig>
        </TabPane>
      </Tabs>
    </div>
  );
};

ConfigPanel.propTypes = {
  attributeUpdate: PropTypes.func,
  selectedCompInfo: PropTypes.object,
};

export default ConfigPanel;
