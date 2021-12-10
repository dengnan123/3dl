import React from 'react';
import { Form, Input, InputNumber } from 'antd';
import InputColor from '../../../components/InputColor';

const BasicConfig = props => {
  const {
    formItemLayout,
    form: { getFieldDecorator },
    style,
  } = props;

  const { content, src, dark = '#393635', logoSize = 0.15, margin = 4 } = style;

  return (
    <div style={{ paddingLeft: 10, paddingRight: 10 }}>
      <Form.Item label="logo" {...formItemLayout}>
        {getFieldDecorator('src', {
          initialValue: src,
        })(<Input />)}
      </Form.Item>

      <Form.Item label="logo尺寸(比例，0-1)" {...formItemLayout}>
        {getFieldDecorator('logoSize', {
          initialValue: logoSize,
        })(<InputNumber min={0} max={1} step={0.1} />)}
      </Form.Item>

      <Form.Item label="二维码内容" {...formItemLayout}>
        {getFieldDecorator('content', {
          initialValue: content,
        })(<Input placeholder="请填写二维码内容" />)}
      </Form.Item>

      <Form.Item label="二维码前景色" {...formItemLayout}>
        {getFieldDecorator('dark', {
          initialValue: dark,
        })(<InputColor />)}
      </Form.Item>

      <Form.Item label="二维码外边框大小" {...formItemLayout}>
        {getFieldDecorator('margin', {
          initialValue: margin,
        })(<InputNumber min={0} />)}
      </Form.Item>
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
      ...newFields,
    });
    // 处理数据
  },
})(BasicConfig);
