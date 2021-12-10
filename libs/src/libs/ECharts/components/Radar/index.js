import React from 'react';
import { reap } from '../../../../components/SafeReaper';
import { Form } from 'antd';

import { Collapse } from 'antd';

import RadarBasicConfig from '../RadarBasicConfig';
import AxisLabel from '../AxisLabel';
import RadarLine from '../AxisLine/Radar';
import AxisTick from '../AxisTick';
import SplitArea from '../SplitArea';
import SplitLine from '../SplitLine';
import Indicator from '../Indicator';

const { Panel } = Collapse;

const Radar = props => {
  const { style, form, formItemLayout, mockData } = props;

  const RadarProps = {
    form,
    formItemLayout,
    data: reap(style, 'radar', {}),
    mockData,
  };

  const arr = [
    {
      key: 'RadarBasicConfig',
      label: '基础设置',
      Comp: RadarBasicConfig,
    },
    {
      key: 'Indicator',
      label: '雷达图指示器',
      Comp: Indicator,
    },
    {
      key: 'AxisLine',
      label: '轴线',
      Comp: RadarLine,
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
    <div>
      {arr.map(v => {
        const { label, key, Comp } = v;
        return (
          <Collapse key={key} bordered={false} defaultActiveKey={['AxisGeneral']}>
            <Panel header={label} key={key}>
              <Comp {...RadarProps} />
            </Panel>
          </Collapse>
        );
      })}
    </div>
  );
};

export default Form.create({
  onFieldsChange: (props, changedFields) => {
    const {
      form: { getFieldsValue },
      updateStyle,
      style,
    } = props;

    const styleRadar = reap(style, 'radar', {});
    const newFields = getFieldsValue();

    updateStyle({
      ...style,
      radar: { ...styleRadar, ...newFields },
    });
  },
})(Radar);
