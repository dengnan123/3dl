import React, { useState } from 'react';
import { Drawer, Button, Divider } from 'antd';
import MapConfig from '../components/MapConfig';

const ConfigMenu = [
  {
    key: 'MapConfig',
    label: '地图设置',
    Com: MapConfig,
  },
  // {
  //   key: 'MapConfig2',
  //   label: '地图设置',
  //   Com: MapConfig2
  // },
];

const EChartMapConfig = props => {
  const { style } = props;

  const [visible, setVisible] = useState(false);
  const [activeK, setActiveK] = useState({});

  const handleChangeDrawer = item => {
    setActiveK(item);
    setVisible(true);
  };

  const changeCloseDrawer = () => {
    setVisible(false);
  };

  const { Com } = activeK;
  return (
    <div>
      {ConfigMenu.map(item => {
        return (
          <div key={Math.random() * 8}>
            <Button
              type="link"
              onClick={() => {
                handleChangeDrawer(item);
              }}
            >
              {item.label}
            </Button>
            <Divider />
          </div>
        );
      })}

      <Drawer
        width={400}
        visible={visible}
        title={activeK.label}
        placement="right"
        onClose={changeCloseDrawer}
      >
        {Com && <Com />}
      </Drawer>
    </div>
  );
};

export default EChartMapConfig;
