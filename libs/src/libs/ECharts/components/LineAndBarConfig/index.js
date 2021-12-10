import React, { useState } from 'react';
import { Drawer, Button, Icon } from 'antd';
import styles from './index.less';
import XAxis from '../XAxis';
import YAxis from '../YAxis';
import Legend from '../Legend';
import Gird from '../Gird';
import Tooltip from '../Tooltip';
import BarBasic from '../BarBasic';
import LineBasic from '../LineBasic';
import Title from '../Title';
import DataZoom from '../DataZoom';
import GraphColor from '../GraphColor';
import Toolbox from '../Toolbox';

const LineAndBarConfig = props => {
  const {
    style = {},
    formItemLayout,
    updateMockData,
    mockData: propsMockData,
    updateStyle,
    type,
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
  let basicConfigArr = [];
  const compProps = {
    style,
    formItemLayout,
    updateMockData,
    mockData: propsMockData,
    updateStyle,
  };

  if (type === 'line') {
    basicConfigArr = [
      {
        key: 'series',
        label: 'Line基础设置',
        Comp: LineBasic,
      },
    ];
  } else if (type === 'bar') {
    basicConfigArr = [
      {
        key: 'series',
        label: 'Bar基础设置',
        Comp: BarBasic,
      },
    ];
  } else {
    basicConfigArr = [
      {
        key: 'seriesLine',
        label: 'Line基础设置',
        Comp: LineBasic,
      },
      {
        key: 'series',
        label: 'Bar基础设置',
        Comp: BarBasic,
      },
    ];
  }

  const arr = [
    ...basicConfigArr,
    {
      key: 'title',
      label: '标题设置',
      Comp: Title,
    },
    {
      key: 'xAxis',
      label: 'X轴设置',
      Comp: XAxis,
    },
    {
      key: 'yAxis',
      label: 'Y轴设置',
      Comp: YAxis,
    },
    {
      key: 'dataZoom',
      label: '图表滚动',
      Comp: DataZoom,
    },
    {
      key: 'legend',
      label: '图例设置legend',
      Comp: Legend,
    },
    {
      key: 'axisWriter',
      label: '坐标轴边距设置',
      Comp: Gird,
    },
    {
      key: 'tooltip',
      label: '提示设置Tooltip',
      Comp: Tooltip,
    },
    {
      key: 'graphColor',
      label: '图表配色',
      Comp: GraphColor,
    },
    {
      key: 'toolbox',
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
        destroyOnClose={true}
      >
        {Comp && <Comp {...compProps} />}
      </Drawer>
    </div>
  );
};

export default LineAndBarConfig;
