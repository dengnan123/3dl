import React, { useEffect } from 'react';
import { debounce } from 'lodash';
import { Form, InputNumber, Input, Switch, Icon } from 'antd';

import InputTRBLValues from '../../../components/InputTRBLValues';
import InputColor from '../../../components/InputColor';

const CustomListConfig = props => {
  const {
    formItemLayout,
    form: { getFieldDecorator, resetFields },
    id,
    style,
  } = props;

  const {
    compKey = 'customList',
    bgColor = '#ffffff',
    borderWidth = 1,
    borderColor = 'rgba(217, 217, 217, 1)',
    borderRadius = '4px 4px 4px 4px',
    padding = '0 0 0 0',
    fontSize = 14,
    fontColor = 'rgba(0,0,0,0.65)',
    liHeight = 40,
    liPading = '0 0 0 0',
    showIcon = false,
    iconWidth = 8,
    iconHeight = 8,
    iconBorderRadius = '4px 4px 4px 4px',
    iconColor = '#1991eb',
    iconDistance = 5,
    emptyText = 'No Data',
    emptyTextColor = 'rgba(0,0,0,0.25)',
    emptyTextFontSize = 14,
    emptyTextLineHeight = 40,
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

      <Form.Item label="行高" {...formItemLayout}>
        {getFieldDecorator('liHeight', {
          initialValue: liHeight,
        })(<InputNumber min={0} />)}
      </Form.Item>

      <Form.Item label="行内边距(上,右,下,左)" {...formItemLayout}>
        {getFieldDecorator('liPading', {
          initialValue: liPading,
        })(<InputTRBLValues />)}
      </Form.Item>

      <Form.Item label="展示图标" {...formItemLayout}>
        {getFieldDecorator('showIcon', {
          initialValue: showIcon,
          valuePropName: 'checked',
        })(<Switch />)}
      </Form.Item>

      <Form.Item label="图标宽度" {...formItemLayout}>
        {getFieldDecorator('iconWidth', {
          initialValue: iconWidth,
        })(<InputNumber min={0} />)}
      </Form.Item>

      <Form.Item label="图标高度" {...formItemLayout}>
        {getFieldDecorator('iconHeight', {
          initialValue: iconHeight,
        })(<InputNumber min={0} />)}
      </Form.Item>

      <Form.Item label="图标圆角(上,右,下,左)" {...formItemLayout}>
        {getFieldDecorator('iconBorderRadius', {
          initialValue: iconBorderRadius,
        })(<InputTRBLValues />)}
      </Form.Item>

      <Form.Item label="图标颜色" {...formItemLayout}>
        {getFieldDecorator('iconColor', {
          initialValue: iconColor,
        })(<InputColor />)}
      </Form.Item>

      <Form.Item label="图标与文字距离" {...formItemLayout}>
        {getFieldDecorator('iconDistance', {
          initialValue: iconDistance,
        })(<InputNumber min={0} />)}
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

      <Form.Item label="数据为空提示" {...formItemLayout}>
        {getFieldDecorator('emptyText', {
          initialValue: emptyText,
        })(<Input placeholder="请输入" />)}
      </Form.Item>

      <Form.Item label="空字符字体大小" {...formItemLayout}>
        {getFieldDecorator('emptyTextFontSize', {
          initialValue: emptyTextFontSize,
        })(<InputNumber min={12} placeholder="请输入" />)}
      </Form.Item>

      <Form.Item label="空字符颜色" {...formItemLayout}>
        {getFieldDecorator('emptyTextColor', {
          initialValue: emptyTextColor,
        })(<InputColor />)}
      </Form.Item>

      <Form.Item label="空字符行高" {...formItemLayout}>
        {getFieldDecorator('emptyTextLineHeight', {
          initialValue: emptyTextLineHeight,
        })(<InputNumber min={0} />)}
      </Form.Item>

      <Form.Item>
        <p style={{ lineHeight: '24px' }}>
          <Icon type="question-circle" style={{ marginRight: 5, color: '#1991eb' }} />
          如果需要自定义设置每一行的样式，可在数据里的每一项中设置liStyle和iconStyle
        </p>
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

    updateStyle(finalParams);
  }, 500),
})(CustomListConfig);
