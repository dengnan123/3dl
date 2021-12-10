import React, { useEffect, useState } from 'react';
import { parseEchartsToConfig } from '../../parse/XAxis';
import { Form, Collapse } from 'antd';
import Label from '../Label';
const { Panel } = Collapse;
const Emphasis = props => {
  const { style, form, formItemLayout } = props;

  const [data, setData] = useState({});

  useEffect(() => {
    const newData = parseEchartsToConfig(style.emphasis);
    console.log('newDatanewData', newData);
    setData(newData);
  }, [style, setData]);

  const emphasisProps = {
    form,
    formItemLayout,
    data,
  };

  const arr = [
    {
      key: 'Label',
      label: '标签设置',
      Comp: Label,
    },
  ];

  return (
    <div>
      {arr.map(v => {
        const { label, key, Comp } = v;
        return (
          <Collapse key={key} bordered={false} defaultActiveKey={['AxisGeneral']}>
            <Panel header={label} key={key}>
              <Comp {...emphasisProps}></Comp>
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

    const newFields = getFieldsValue();

    updateStyle({
      ...style,
      emphasis: newFields,
    });
  },
})(Emphasis);
