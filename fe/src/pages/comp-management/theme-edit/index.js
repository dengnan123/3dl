import React, { useState, useCallback } from 'react';

import classnames from 'classnames';
import { Layout } from 'antd';
import { CompHeader, CompList, ContentComp, ConfigPanel } from './components/index';

import styles from './index.less';

const { Sider, Content } = Layout;

function ThemeEdit(props) {
  const [{ selectedCompInfo, previewCompInfo }, setState] = useState({
    selectedCompInfo: null,
    previewCompInfo: null,
  });
  const updateState = useCallback(payload => setState(state => ({ ...state, ...payload })), []);

  const handleSelect = useCallback(
    (current, mockData) => {
      if (selectedCompInfo?.id === current?.id) {
        return;
      }
      updateState({ selectedCompInfo: { ...current, mockData }, previewCompInfo: null });
    },
    [selectedCompInfo, updateState],
  );

  const attributeUpdate = useCallback(
    payload => {
      updateState({ selectedCompInfo: { ...selectedCompInfo, ...payload } });
    },
    [selectedCompInfo, updateState],
  );

  const updatePreviewCompInfo = useCallback(
    (payload, clear = false) => {
      // 清除
      if (clear) {
        updateState({ previewCompInfo: null });
        return;
      }
      const mockData = payload?.mockData || {};
      const style = payload?.style || {};
      updateState({ previewCompInfo: { ...selectedCompInfo, mockData, style } });
    },
    [selectedCompInfo, previewCompInfo, updateState],
  );

  return (
    <Layout className={styles.layoutContainer}>
      <CompHeader
        selectedCompInfo={selectedCompInfo}
        attributeUpdate={attributeUpdate}
        updatePreviewCompInfo={updatePreviewCompInfo}
      />
      <Layout>
        <Sider className={styles.sider} width={300}>
          <CompList onSelect={handleSelect} />
        </Sider>
        <Content style={{ padding: 15 }}>
          <ContentComp compInfo={previewCompInfo || selectedCompInfo} />
        </Content>
        <Sider className={classnames(styles.sider, styles.configPanel)} width={370}>
          <ConfigPanel selectedCompInfo={selectedCompInfo} attributeUpdate={attributeUpdate} />
        </Sider>
      </Layout>
    </Layout>
  );
}

export default ThemeEdit;
