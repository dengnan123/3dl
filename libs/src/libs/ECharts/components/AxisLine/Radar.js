import React, { Fragment } from 'react';
import { Form, InputNumber, Switch, Select } from 'antd';
import { reap } from '../../../../components/SafeReaper';
import InputColor from '../../../../components/InputColor';
const FormItem = Form.Item;
const { Option } = Select;
export default ({
  form: { getFieldDecorator, getFieldsValue, getFieldValue, resetFields },
  formItemLayout,
  data,
}) => {
  return (
    <Fragment>
      <FormItem label="显示轴线" {...formItemLayout}>
        {getFieldDecorator('splitLine.show', {
          initialValue: reap(data, 'splitLine.show', true),
          valuePropName: 'checked',
        })(<Switch />)}
      </FormItem>

      <FormItem label="颜色" {...formItemLayout}>
        {getFieldDecorator('splitLine.lineStyle.color', {
          initialValue: reap(data, 'splitLine.lineStyle.color', 'rgba(215,215,215,1)'),
        })(<InputColor />)}
      </FormItem>

      <FormItem label="线宽" {...formItemLayout}>
        {getFieldDecorator('splitLine.lineStyle.width', {
          initialValue: reap(data, 'splitLine.lineStyle.width', 1),
        })(<InputNumber />)}
      </FormItem>

      <FormItem label="轴线类型" {...formItemLayout}>
        {getFieldDecorator('splitLine.lineStyle.type', {
          initialValue: reap(data, 'splitLine.lineStyle.type', 'solid'),
        })(
          <Select style={{ width: 120 }}>
            <Option value="solid">solid</Option>
            <Option value="dashed">dashed</Option>
            <Option value="dotted">dotted</Option>
          </Select>,
        )}
      </FormItem>
    </Fragment>
  );
};
