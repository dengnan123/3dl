import React, { Fragment } from 'react';
import { Form, InputNumber, Input } from 'antd';
import { reap } from '../../../../components/SafeReaper';
import InputColor from '../../../../components/InputColor';
const FormItem = Form.Item;

export default ({
  form: { getFieldDecorator, getFieldsValue, getFieldValue, resetFields },
  formItemLayout,
  data,
}) => {
  return (
    <Fragment>
      <FormItem label="名称" {...formItemLayout}>
        {getFieldDecorator('name', {
          initialValue: reap(data, 'name', null),
        })(<Input />)}
      </FormItem>
      <FormItem label="单位" {...formItemLayout}>
        {getFieldDecorator('util', {
          initialValue: reap(data, 'util', null),
        })(<Input />)}
      </FormItem>
      <FormItem label="显示位置" {...formItemLayout}>
        {getFieldDecorator('nameLocation', {
          initialValue: reap(data, 'nameLocation', null),
        })(<Input />)}
      </FormItem>
      <FormItem label="字体大小" {...formItemLayout}>
        {getFieldDecorator('nameTextStyle.fontSize', {
          initialValue: reap(data, 'nameTextStyle.fontSize', null),
        })(<InputNumber />)}
      </FormItem>
      <FormItem label="字体颜色" {...formItemLayout}>
        {getFieldDecorator('nameTextStyle.color', {
          initialValue: reap(data, 'nameTextStyle.color', '#1d1818'),
        })(<InputColor />)}
      </FormItem>
      <FormItem label="名称与轴线之间的距离" {...formItemLayout}>
        {getFieldDecorator('nameGap', {
          initialValue: reap(data, 'nameGap', 15),
        })(<InputNumber />)}
      </FormItem>
      <FormItem label="名字旋转角度值" {...formItemLayout}>
        {getFieldDecorator('nameRotate', {
          initialValue: reap(data, 'nameRotate', 0),
        })(<InputNumber />)}
      </FormItem>
    </Fragment>
  );
};
