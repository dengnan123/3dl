import React, { Fragment } from 'react';
import { Collapse } from 'antd';
import AxisLabel from '../AxisLabel';
import AxisLine from '../AxisLine';
import AxisName from '../AxisName';
import AxisTick from '../AxisTick';
import SplitArea from '../SplitArea';
import SplitLine from '../SplitLine';
import AxisGeneral from '../AxisGeneral';
const { Panel } = Collapse;
export default props => {
  const arr = [
    {
      key: 'AxisGeneral',
      label: '基本配置',
      Comp: AxisGeneral,
    },
    {
      key: 'AxisLine',
      label: '轴线',
      Comp: AxisLine,
    },
    {
      key: 'AxisName',
      label: '轴名称',
      Comp: AxisName,
    },
    {
      key: 'AxisTick',
      label: '轴刻度',
      Comp: AxisTick,
    },
    {
      key: 'AxisLabel',
      label: '轴刻度标签',
      Comp: AxisLabel,
    },
    {
      key: 'SplitLine',
      label: '分割线',
      Comp: SplitLine,
    },
    {
      key: 'SplitArea',
      label: '分隔区域',
      Comp: SplitArea,
    },
  ];
  return (
    <Fragment>
      {arr.map(v => {
        const { label, key, Comp } = v;
        return (
          <Collapse key={key} bordered={false} defaultActiveKey={['AxisGeneral']}>
            <Panel header={label} key={key}>
              <Comp {...props}></Comp>
            </Panel>
          </Collapse>
        );
      })}
    </Fragment>
  );
};
