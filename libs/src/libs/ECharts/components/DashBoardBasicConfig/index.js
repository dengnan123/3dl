import React, { Fragment } from 'react';
import { debounce } from 'lodash';
import { reap } from '../../../../components/SafeReaper';

import { Form, InputNumber, Input, Switch } from 'antd';
import InputColor from '../../../../components/InputColor';

const FormItem = Form.Item;

const DashBoardBasicConfig = ({
  form: { getFieldDecorator, getFieldsValue, getFieldValue, resetFields },
  formItemLayout,
  style,
}) => {
  return (
    <Fragment>
      <FormItem label="名称" {...formItemLayout}>
        {getFieldDecorator('series[0].name', {
          initialValue: reap(style, 'series[0].name', '速度'),
        })(<Input />)}
      </FormItem>
      <FormItem label="显示数值" {...formItemLayout}>
        {getFieldDecorator('series[0].detail.show', {
          initialValue: reap(style, 'series[0].detail.show', false),
          valuePropName: 'checked',
        })(<Switch />)}
      </FormItem>
      <FormItem label="最小值" {...formItemLayout}>
        {getFieldDecorator('series[0].min', {
          initialValue: reap(style, 'series[0].min', 0),
        })(<InputNumber />)}
      </FormItem>
      <FormItem label="最大值" {...formItemLayout}>
        {getFieldDecorator('series[0].max', {
          initialValue: reap(style, 'series[0].max', 100),
        })(<InputNumber />)}
      </FormItem>
      <FormItem label="半径大小百分比" {...formItemLayout}>
        {getFieldDecorator('series[0].radius', {
          initialValue: reap(style, 'series[0].radius', '100%'),
        })(<Input />)}
      </FormItem>

      <FormItem label="仪表盘厚度" {...formItemLayout}>
        {getFieldDecorator('series[0].axisLine.lineStyle.width', {
          initialValue: reap(style, 'series[0].axisLine.lineStyle.width', 20),
        })(<InputNumber min={0} />)}
      </FormItem>

      <FormItem label="指针颜色" {...formItemLayout}>
        {getFieldDecorator('series[0].data[0].itemStyle.color', {
          initialValue: reap(style, 'series[0].data[0].itemStyle.color', '#FFBB51'),
        })(<InputColor />)}
      </FormItem>

      <FormItem label="已完成颜色" {...formItemLayout}>
        {getFieldDecorator('series[0].axisLine.lineStyle.color[0][1]', {
          initialValue: reap(style, 'series[0].axisLine.lineStyle.color[0][1]', '#333FFF'),
        })(<InputColor />)}
      </FormItem>

      <FormItem label="未完成颜色" {...formItemLayout}>
        {getFieldDecorator('series[0].axisLine.lineStyle.color[1][1]', {
          initialValue: reap(style, 'series[0].axisLine.lineStyle.color[1][1]', '#d8d8d8'),
        })(<InputColor />)}
      </FormItem>
    </Fragment>
  );
};

export default Form.create({
  onFieldsChange: debounce((props, changedFields) => {
    const {
      form: { getFieldsValue },
      updateStyle,
      style,
    } = props;
    const newFields = getFieldsValue();

    updateStyle({
      ...style,
      ...newFields,
    });
  }, 500),
})(DashBoardBasicConfig);
