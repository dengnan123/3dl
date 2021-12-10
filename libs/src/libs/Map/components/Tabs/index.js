import React from 'react';
import 'antd/dist/antd.css';
import { Tabs, Modal } from 'antd';
import PanelForm from '../Form';

const { TabPane } = Tabs;

// const initialPanes = [{ title: '地图', content: 'Content of Tab 1', key: '0' }];

class MapTabs extends React.Component {
  initialPanes = [{ title: '地图', content: 'Content of Tab 1', key: '0' }];
  newTabIndex = 1;

  constructor(props) {
    super(props);
    this.state = {
      activeKey: this.initialPanes[0].key,
      panes: [{ title: '地图', content: props.contentDom, key: '0' }],
    };
  }

  onChange = activeKey => {
    // const { updateStyle, style } = this.props;
    this.setState({ activeKey });
    // updateStyle({ ...style, activeKey });
  };

  onEdit = (targetKey, action) => {
    this[action](targetKey);
  };

  add = () => {
    const { panes } = this.state;
    const activeKey = `地图 ${this.newTabIndex++}`;
    const newPanes = [...panes];
    newPanes.push({
      title: `地图`,
      content: this.props.contentDom,
      key: activeKey,
    });
    this.setState({
      panes: newPanes,
      activeKey,
    });
  };

  remove = targetKey => {
    Modal.confirm({
      title: '确认删除？',
      content: '确认删除当前选中的地图吗？删除之后不可恢复！',
      okText: '删除',
      onOk: () => {
        const { panes, activeKey } = this.state;
        let newActiveKey = activeKey;
        let lastIndex;
        panes.forEach((pane, i) => {
          if (pane.key === targetKey) {
            lastIndex = i - 1;
          }
        });
        const newPanes = panes.filter(pane => pane.key !== targetKey);
        if (newPanes.length && newActiveKey === targetKey) {
          if (lastIndex >= 0) {
            newActiveKey = newPanes[lastIndex].key;
          } else {
            newActiveKey = newPanes[0].key;
          }
        }
        this.setState({
          panes: newPanes,
          activeKey: newActiveKey,
        });
      },
      cancelText: '取消',
      onCancel: () => {
        console.log('cancel');
      },
    });
  };

  render() {
    const { panes, activeKey } = this.state;
    return (
      <Tabs
        type="editable-card"
        onChange={this.onChange}
        activeKey={activeKey}
        onEdit={this.onEdit}
      >
        {panes.map((pane, i) => (
          <TabPane tab={`${pane.title}${i + 1}`} key={pane.key} closable={pane.closable}>
            <p>
              <span style={{ color: 'red' }}>地图{i + 1}</span> 配置项
            </p>
            {pane.content}
            <PanelForm />
          </TabPane>
        ))}
      </Tabs>
    );
  }
}

export default MapTabs;
