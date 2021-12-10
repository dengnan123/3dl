import React, { useState } from 'react';
import { Drawer, Button, Divider } from 'antd';
import MapConfig from '../components/MapConfig';

const arr = [
  {
    key: 'MapConfig',
    label: '地图设置',
    Comp: MapConfig,
  },
];

const AmapConfig = props => {
  const {
    isSelectCompInfo,
    style,
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
    style: isSelectCompInfo ? isSelectCompInfo.style : style,
    formItemLayout,
    updateMockData,
    mockData: propsMockData,
    updateStyle,
  };

  const { Comp, label } = clickInfo;

  return (
    <div>
      {arr.map(v => {
        const { key, label } = v;
        return (
          <div key={key}>
            <Button
              type="link"
              onClick={() => {
                handleClick(v);
              }}
            >
              {label}
            </Button>
            <Divider />
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

export default AmapConfig;
