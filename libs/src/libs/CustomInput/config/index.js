import React, { useEffect } from 'react';
import { debounce } from 'lodash';
import { Form, InputNumber, Input, Switch } from 'antd';

import InputTRBLValues from '../../../components/InputTRBLValues';
import InputColor from '../../../components/InputColor';

const CustomInputConfig = props => {
  const {
    formItemLayout,
    form: { getFieldDecorator, resetFields },
    id,
    style,
  } = props;

  const {
    compKey = 'customInput',
    fontSize = 14,
    fontColor = 'rgba(0,0,0,0.65)',
    placeholder = '请输入',
    placeholderFontSize = 14,
    placeholderColor = '#bfbfbf',
    bgColor = '#ffffff',
    borderWidth = 1,
    borderColor = 'rgba(217, 217, 217, 1)',
    borderRadius = '4px 4px 4px 4px',
    padding = '0 0 0 0',
    openDebounce = false,
    debounceWaiting = 800,
  } = style || {};

  useEffect(() => {
    resetFields();
    return resetFields;
  }, [id, resetFields]);

  return (
    <div style={{ paddingLeft: 10, paddingRight: 10 }}>
      <Form.Item label="组件key" {...formItemLayout}>
        {getFieldDecorator('compKey', {
          initialValue: compKey,
        })(<Input placeholder="compKey" />)}
      </Form.Item>

      <Form.Item label="字体大小" {...formItemLayout}>
        {getFieldDecorator('fontSize', {
          initialValue: fontSize,
        })(<InputNumber min={12} />)}
      </Form.Item>

      <Form.Item label="字体颜色" {...formItemLayout}>
        {getFieldDecorator('fontColor', {
          initialValue: fontColor,
        })(<InputColor />)}
      </Form.Item>

      <Form.Item label="提示字体" {...formItemLayout}>
        {getFieldDecorator('placeholder', {
          initialValue: placeholder,
        })(<Input />)}
      </Form.Item>

      <Form.Item label="提示字体大小" {...formItemLayout}>
        {getFieldDecorator('placeholderFontSize', {
          initialValue: placeholderFontSize,
        })(<InputNumber min={12} />)}
      </Form.Item>

      <Form.Item label="提示字体颜色" {...formItemLayout}>
        {getFieldDecorator('placeholderColor', {
          initialValue: placeholderColor,
        })(<InputColor />)}
      </Form.Item>

      <Form.Item label="背景色" {...formItemLayout}>
        {getFieldDecorator('bgColor', {
          initialValue: bgColor,
        })(<InputColor />)}
      </Form.Item>

      <Form.Item label="边框宽度" {...formItemLayout}>
        {getFieldDecorator('borderWidth', {
          initialValue: borderWidth,
        })(<InputNumber min={0} />)}
      </Form.Item>

      <Form.Item label="边框颜色" {...formItemLayout}>
        {getFieldDecorator('borderColor', {
          initialValue: borderColor,
        })(<InputColor />)}
      </Form.Item>

      <Form.Item label="圆角(上,右,下,左)" {...formItemLayout}>
        {getFieldDecorator('borderRadius', {
          initialValue: borderRadius,
        })(<InputTRBLValues />)}
      </Form.Item>

      <Form.Item label="内边距(上,右,下,左)" {...formItemLayout}>
        {getFieldDecorator('padding', {
          initialValue: padding,
        })(<InputTRBLValues />)}
      </Form.Item>

      <Form.Item label="开启防抖" {...formItemLayout}>
        {getFieldDecorator('openDebounce', {
          initialValue: openDebounce,
          valuePropName: 'checked',
        })(<Switch />)}
      </Form.Item>

      <Form.Item label="防抖时间(毫秒)" {...formItemLayout}>
        {getFieldDecorator('debounceWaiting', {
          initialValue: debounceWaiting,
        })(<InputNumber min={0} step={100} />)}
      </Form.Item>
    </div>
  );
};

export default Form.create({
  onFieldsChange: debounce((props, changedFields) => {
    const {
      form: { getFieldsValue },
      style,
      updateStyle,
    } = props;
    const fieldsValue = getFieldsValue();

    const finalParams = {
      ...style,
      ...fieldsValue,
    };

    console.log('finalParams', finalParams);
    updateStyle(finalParams);
  }, 500),
})(CustomInputConfig);
