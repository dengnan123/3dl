import React from 'react';
import { Form } from 'antd';

import { Collapse } from 'antd';

import ToolboxBasicConfig from './ToolboxBasicConfig';
import FeatureConfig from './FeatureConfig';
import IconStyleConfig from './IconStyleConfig';

const { Panel } = Collapse;

const Toolbox = props => {
  const { style, form, formItemLayout } = props;

  const ToolboxProps = {
    form,
    formItemLayout,
    data: style?.toolbox,
  };

  const arr = [
    {
      key: 'ToolboxBasicConfig',
      label: '基础设置',
      Comp: ToolboxBasicConfig,
    },
    {
      key: 'FeatureConfig',
      label: '工具栏功能按钮',
      Comp: FeatureConfig,
    },
    {
      key: 'IconStyleConfig',
      label: '图标配色',
      Comp: IconStyleConfig,
    },
    // {
    //   key: 'AxisTick',
    //   label: '轴刻度',
    //   Comp: AxisTick,
    // },
    // {
    //   key: 'AxisLabel',
    //   label: '轴刻度标签',
    //   Comp: AxisLabel,
    // },
    // {
    //   key: 'SplitLine',
    //   label: '分割线',
    //   Comp: SplitLine,
    // },
    // {
    //   key: 'SplitArea',
    //   label: '分隔区域',
    //   Comp: SplitArea,
    // },
  ];

  return (
    <div>
      {arr.map(v => {
        const { label, key, Comp } = v;
        return (
          <Collapse key={key} bordered={false} defaultActiveKey={['AxisGeneral']}>
            <Panel header={label} key={key}>
              <Comp {...ToolboxProps} />
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

    const styleToolbox = style?.toolbox || {};
    const newFields = getFieldsValue();
    const basicFields = newFields?.basic;
    const featureFields = newFields?.feature;
    const iconStyle = newFields?.iconStyle;

    const finalFields = {
      ...style,
      toolbox: {
        ...styleToolbox,
        ...basicFields,
      },
    };

    if (featureFields) {
      finalFields.toolbox.feature = featureFields;
    }
    if (iconStyle) {
      finalFields.toolbox.iconStyle = iconStyle;
    }

    updateStyle(finalFields);
  },
})(Toolbox);
