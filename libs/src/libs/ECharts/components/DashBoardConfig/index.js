import React, { useState } from 'react';
import { Drawer, Button, Divider, Icon } from 'antd';
import DashBoardBasicConfig from '../DashBoardBasicConfig';
import Tooltip from '../../components/Tooltip';
import Title from '../Title';
import Toolbox from '../../components/Toolbox';

import styles from './index.less';

const DashBoardConfig = props => {
  const {
    isSelectCompInfo = {},
    style = {},
    formItemLayout,
    updateMockData,
    mockData: propsMockData,
    updateStyle,
  } = props;

  const [vis, setVis] = useState(false);
  const [clickInfo, setClickInfo] = useState({});
  const onClose = () => {
    setVis(false);
  };
  const handleClick = v => {
    setClickInfo(v);
    setVis(true);
  };

  const compProps = {
    style: isSelectCompInfo.style ? isSelectCompInfo.style : style,
    formItemLayout,
    updateMockData,
    mockData: propsMockData,
    updateStyle,
  };

  const arr = [
    {
      key: 'DashBoardBasicConfig',
      label: '仪表盘基础设置',
      Comp: DashBoardBasicConfig,
    },
    {
      key: 'tooltip',
      label: '提示设置Tooltip',
      Comp: Tooltip,
    },
    { key: 'title', label: '标题设置', Comp: Title },
    {
      key: 'Toolbox',
      label: '工具栏',
      Comp: Toolbox,
    },
  ];

  const { Comp, label } = clickInfo;

  return (
    <div className={styles.textDiv}>
      {arr.map(v => {
        const { key, label } = v;
        return (
          <div
            key={key}
            className={styles.item}
            onClick={() => {
              handleClick(v);
            }}
          >
            <p className={styles.title}>{label}</p>
            <div className={styles.icon}>
              <Icon type="edit" />
            </div>
          </div>
        );
      })}
      <Drawer
        width={400}
        title={label}
        placement="right"
        closable={false}
        onClose={onClose}
        visible={vis}
      >
        {Comp && <Comp {...compProps} />}
      </Drawer>
    </div>
  );
};

export default DashBoardConfig;
