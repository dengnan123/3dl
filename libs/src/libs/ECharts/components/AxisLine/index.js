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
        {getFieldDecorator('axisLine.show', {
          initialValue: reap(data, 'axisLine.show', true),
          valuePropName: 'checked',
        })(<Switch />)}
      </FormItem>

      <FormItem label="颜色" {...formItemLayout}>
        {getFieldDecorator('axisLine.lineStyle.color', {
          initialValue: reap(data, 'axisLine.lineStyle.color', '#1d1818'),
        })(<InputColor />)}
      </FormItem>

      <FormItem label="透明度" {...formItemLayout}>
        {getFieldDecorator('axisLine.lineStyle.opacity', {
          initialValue: reap(data, 'axisLine.lineStyle.opacity', 1),
        })(<InputNumber />)}
      </FormItem>
      <FormItem label="线宽" {...formItemLayout}>
        {getFieldDecorator('axisLine.lineStyle.width', {
          initialValue: reap(data, 'axisLine.lineStyle.width', 1),
        })(<InputNumber />)}
      </FormItem>
      <FormItem label="轴线类型" {...formItemLayout}>
        {getFieldDecorator('axisLine.lineStyle.type', {
          initialValue: reap(data, 'axisLine.lineStyle.type', 'solid'),
        })(
          <Select style={{ width: 120 }}>
            <Option value="solid">solid</Option>
            <Option value="dashed">dashed</Option>
            <Option value="dotted">dotted</Option>
          </Select>,
        )}
      </FormItem>
      <FormItem label="透明度" {...formItemLayout}>
        {getFieldDecorator('axisLine.lineStyle.opacity', {
          initialValue: reap(data, 'axisLine.lineStyle.opacity', 1),
        })(<InputNumber />)}
      </FormItem>
    </Fragment>
  );
};
