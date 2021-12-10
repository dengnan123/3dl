import React, { Fragment } from 'react';
import { Form, InputNumber, Input, Switch } from 'antd';
import { reap } from '../../../../components/SafeReaper';
import InputColor from '../../../../components/InputColor';
const FormItem = Form.Item;

export default ({
  form: { getFieldDecorator, getFieldsValue, getFieldValue, resetFields },
  formItemLayout,
  data,
}) => {
  console.log('datdat  label  12324234234', data);
  return (
    <Fragment>
      <FormItem label="是否显示刻度标签" {...formItemLayout}>
        {getFieldDecorator('axisLabel.show', {
          initialValue: reap(data, 'axisLabel.show', true),
          valuePropName: 'checked',
        })(<Switch />)}
      </FormItem>

      <FormItem label="刻度标签是否朝内" {...formItemLayout}>
        {getFieldDecorator('axisLabel.inside', {
          initialValue: reap(data, 'axisLabel.inside', false),
          valuePropName: 'checked',
        })(<Switch />)}
      </FormItem>

      <FormItem label="倾斜度(-90至90)" {...formItemLayout}>
        {getFieldDecorator('axisLabel.rotate', {
          initialValue: reap(data, 'axisLabel.rotate', 0),
        })(<InputNumber />)}
      </FormItem>

      <FormItem label="刻度标签与轴线之间的距离" {...formItemLayout}>
        {getFieldDecorator('axisLabel.margin', {
          initialValue: reap(data, 'axisLabel.margin', 8),
        })(<InputNumber />)}
      </FormItem>

      <FormItem label="轴标签展示设置" {...formItemLayout}>
        {getFieldDecorator('axisLabel.interval', {
          initialValue: reap(data, 'axisLabel.interval', 'auto'),
        })(<Input />)}
      </FormItem>
      <FormItem label="formatter格式化" {...formItemLayout}>
        {getFieldDecorator('axisLabel.formatter', {
          initialValue: reap(data, 'axisLabel.formatter', null),
        })(<Input />)}
      </FormItem>

      <FormItem label="字体大小" {...formItemLayout}>
        {getFieldDecorator('axisLabel.fontSize', {
          initialValue: reap(data, 'axisLabel.fontSize', 16),
        })(<InputNumber />)}
      </FormItem>

      <FormItem label="字体的粗细" {...formItemLayout}>
        {getFieldDecorator('axisLabel.fontWeight', {
          initialValue: reap(data, 'axisLabel.fontWeight', 'normal'),
        })(<Input />)}
      </FormItem>

      <FormItem label="字体颜色" {...formItemLayout}>
        {getFieldDecorator('axisLabel.color', {
          initialValue: reap(data, 'axisLabel.color', '#1d1818'),
        })(<InputColor />)}
      </FormItem>
    </Fragment>
  );
};
