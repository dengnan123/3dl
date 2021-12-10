import React, { useState } from 'react';
import { Modal, Tabs, Tooltip, Icon, Alert } from 'antd';
import PanelForm from '../components/Form';
import styles from './index.less';

const { TabPane } = Tabs;

let newTabIndex = 1;

const MapConfig = props => {
  const { style, updateStyle } = props;

  const { initialPanelsArray = [{ title: '地图', key: '0' }] } = style || {};

  const [initialPanels, setInitialPanels] = useState(initialPanelsArray);
  const [activeKey, setActiveKey] = useState(initialPanels[0].key);

  const onChange = activeKey => {
    setActiveKey(activeKey);
  };

  const add = () => {
    const activeKey = `${newTabIndex++}`;
    const newPanes = [...initialPanels];
    newPanes.push({ title: `地图`, key: activeKey });
    setInitialPanels(newPanes);
    setActiveKey(activeKey);
    updateStyle({ ...style, initialPanelsArray: newPanes });
  };

  const remove = targetKey => {
    Modal.confirm({
      title: '确认删除？',
      content: '确认删除当前选中的地图吗？删除之后不可恢复！',
      okText: '删除',
      onOk: () => {
        // const { panes, activeKey } = this.state;
        let newActiveKey = activeKey;
        let lastIndex;
        initialPanels.forEach((pane, i) => {
          if (pane.key === targetKey) {
            lastIndex = i - 1;
          }
        });
        const newPanes = initialPanels.filter(pane => pane.key !== targetKey);
        if (newPanes.length && newActiveKey === targetKey) {
          if (lastIndex >= 0) {
            newActiveKey = newPanes[lastIndex].key;
          } else {
            newActiveKey = newPanes[0].key;
          }
        }
        setInitialPanels(newPanes);
        setActiveKey(newActiveKey);
        updateStyle({ ...style, initialPanelsArray: newPanes });
      },
      cancelText: '取消',
      onCancel: () => {
        console.log('cancel');
      },
    });
  };

  const onEdit = (targetKey, action) => {
    // this[action](targetKey);
    const handleAction = {
      add,
      remove,
    };
    handleAction[action](targetKey);
  };

  console.warn(
    "警告⚠： 因为地图主要逻辑做了变更,以前 2020-09-30 生成配置的地图的部分配置方法已经变更，开发人员请打开控制台Console一栏，筛选'this is Old style or new style', 将地图配置项重新填写配置，数据部分可不做更改，2020-10-01之后生成的地图，正常配置即可！多谢理解！",
  );
  return (
    <Tabs
      type="editable-card"
      onChange={onChange}
      activeKey={activeKey}
      onEdit={onEdit}
      className={styles.tabsBox}
    >
      {initialPanels.map((pane, i) => (
        <TabPane
          tab={
            <span style={{ minWidth: 100 }}>
              {i + 1}号{pane.title}
            </span>
          }
          key={pane.key}
          closable={pane.closable}
        >
          <p style={{ color: 'red' }}> {i + 1}号地图配置项:</p>
          <span>警告⚠： 地图主要逻辑做了修改,原有项目请打开控制台查看说明，新项目直接忽略！</span>

          <Alert
            type="success"
            message={
              <Tooltip
                type="success"
                showIcon
                title={
                  <span role="img" aria-labelledby="top">
                    支持多个地图配置，点击在标签页的‘+’, 添加新的配置！
                    <br />
                    查看需要在预览页面链接后添加（或修改）页面参数 activeKey 值为数字（0，1，2...）
                    <br />
                    <span>示例：xxxx.cn/preview?pageId=11294&activeKey=0</span>
                  </span>
                }
              >
                <span role="img" aria-labelledby="rightTip" style={{ lineHeight: '30px' }}>
                  提示： <Icon type="question-circle" />
                </span>
              </Tooltip>
            }
          />

          <PanelForm {...props} activeKey={activeKey} />
        </TabPane>
      ))}
    </Tabs>
  );
};

export default MapConfig;
