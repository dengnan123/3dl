import React, { useEffect } from 'react';
import { Form, Input, InputNumber, Switch } from 'antd';
import { debounce } from 'lodash';

import InputColor from '../../../components/InputColor';

const InputConfig = props => {
  const {
    formItemLayout,
    form: { getFieldDecorator, resetFields },
    id,
    style,
  } = props;

  const {
    placeholder = '请输入关键字搜索',
    height = 36,
    borderWidth = 1,
    borderColor = '#d9d9d9',
    borderRadius = 0,
    paddingLeft = 11,
    paddingRight = 11,
    bgColor = '#ffffff',
    fontSize = 14,
    fontWeight = 400,
    fontColor = '#d9d9d9',
    isShowIcon = true,
    iconSize = 14,
    iconColor = '#d9d9d9',
    iconRight = 10,
  } = style || {};

  useEffect(() => {
    return () => {
      resetFields();
    };
  }, [resetFields, id, style]);

  return (
    <div style={{ paddingLeft: 10, paddingRight: 10 }}>
      <Form.Item label="Placeholder" {...formItemLayout}>
        {getFieldDecorator('placeholder', {
          initialValue: placeholder,
        })(<Input />)}
      </Form.Item>

      <Form.Item label="Input高度" {...formItemLayout}>
        {getFieldDecorator('height', {
          initialValue: height,
        })(<InputNumber min={0} />)}
      </Form.Item>

      <Form.Item label="Input边框线粗细" {...formItemLayout}>
        {getFieldDecorator('borderWidth', {
          initialValue: borderWidth,
        })(<InputNumber min={0} />)}
      </Form.Item>

      <Form.Item label="Input边框线颜色" {...formItemLayout}>
        {getFieldDecorator('borderColor', {
          initialValue: borderColor,
        })(<InputColor />)}
      </Form.Item>

      <Form.Item label="Input圆角" {...formItemLayout}>
        {getFieldDecorator('borderRadius', {
          initialValue: borderRadius,
        })(<InputNumber min={0} />)}
      </Form.Item>

      <Form.Item label="Input左边距" {...formItemLayout}>
        {getFieldDecorator('paddingLeft', {
          initialValue: paddingLeft,
        })(<InputNumber min={0} />)}
      </Form.Item>

      <Form.Item label="Input右边距" {...formItemLayout}>
        {getFieldDecorator('paddingRight', {
          initialValue: paddingRight,
        })(<InputNumber min={0} />)}
      </Form.Item>

      <Form.Item label="背景颜色" {...formItemLayout}>
        {getFieldDecorator('bgColor', {
          initialValue: bgColor,
        })(<InputColor />)}
      </Form.Item>

      <Form.Item label="字体大小" {...formItemLayout}>
        {getFieldDecorator('fontSize', {
          initialValue: fontSize,
        })(<InputNumber min={12} />)}
      </Form.Item>

      <Form.Item label="字体粗细" {...formItemLayout}>
        {getFieldDecorator('fontWeight', {
          initialValue: fontWeight,
        })(<InputNumber min={300} step={100} />)}
      </Form.Item>

      <Form.Item label="字体颜色" {...formItemLayout}>
        {getFieldDecorator('fontColor', {
          initialValue: fontColor,
        })(<InputColor />)}
      </Form.Item>
      <Form.Item label="是否显示搜索ICON">
        {getFieldDecorator('isShowIcon', {
          valuePropName: 'checked',
          initialValue: isShowIcon,
        })(<Switch />)}
      </Form.Item>

      <Form.Item label="ICON大小" {...formItemLayout}>
        {getFieldDecorator('iconSize', {
          initialValue: iconSize,
        })(<InputNumber min={12} />)}
      </Form.Item>

      <Form.Item label="ICON颜色" {...formItemLayout}>
        {getFieldDecorator('iconColor', {
          initialValue: iconColor,
        })(<InputColor />)}
      </Form.Item>

      <Form.Item label="ICON右边距" {...formItemLayout}>
        {getFieldDecorator('iconRight', {
          initialValue: iconRight,
        })(<InputNumber min={0} />)}
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
    const newFields = getFieldsValue();
    // 处理数据
    updateStyle({
      ...style,
      ...newFields,
    });
  }, 500),
})(InputConfig);
