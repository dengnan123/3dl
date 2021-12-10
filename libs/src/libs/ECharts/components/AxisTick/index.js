import React, { Fragment } from 'react';
import { Form, InputNumber, Input, Switch, Select } from 'antd';
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
      <FormItem label="显示轴刻度" {...formItemLayout}>
        {getFieldDecorator('axisTick.show', {
          initialValue: reap(data, 'axisTick.show', true),
          valuePropName: 'checked',
        })(<Switch />)}
      </FormItem>

      <FormItem label="坐标轴刻度显示间隔" {...formItemLayout}>
        {getFieldDecorator('axisTick.interval', {
          initialValue: reap(data, 'axisTick.interval', 'auto'),
        })(<Input />)}
      </FormItem>

      <FormItem label="坐标轴刻度是否朝内" {...formItemLayout}>
        {getFieldDecorator('axisTick.inside', {
          initialValue: reap(data, 'axisTick.inside', false),
          valuePropName: 'checked',
        })(<Switch />)}
      </FormItem>

      <FormItem label="坐标轴刻度的长度" {...formItemLayout}>
        {getFieldDecorator('axisTick.length', {
          initialValue: reap(data, 'axisTick.length', 5),
        })(<InputNumber />)}
      </FormItem>

      <FormItem label="刻度线的颜色" {...formItemLayout}>
        {getFieldDecorator('axisTick.lineStyle.color', {
          initialValue: reap(data, 'axisTick.lineStyle.color', '#ffff'),
        })(<InputColor />)}
      </FormItem>

      <FormItem label="刻度线宽" {...formItemLayout}>
        {getFieldDecorator('axisTick.lineStyle.width', {
          initialValue: reap(data, 'axisTick.lineStyle.width', 1),
        })(<InputNumber />)}
      </FormItem>

      <FormItem label="刻度线的类型" {...formItemLayout}>
        {getFieldDecorator('axisTick.lineStyle.type', {
          initialValue: reap(data, 'axisTick.lineStyle.type', 'solid'),
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
