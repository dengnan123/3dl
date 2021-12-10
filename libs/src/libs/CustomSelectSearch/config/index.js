import React, { useEffect } from 'react';
import { Form, InputNumber, Input } from 'antd';


const CustomSelectSearchConfig = props => {
  const {
    formItemLayout,
    form: { getFieldDecorator, resetFields },
    id,
    style,
  } = props;

  const { width = 380, height = 50, fontSize = 18, placeholder="请输入关键字" } = style || {};

  useEffect(() => {
    return () => {
      resetFields();
    };
  }, [resetFields, id, style]);

  return (
    <div style={{ paddingLeft: 10, paddingRight: 10 }} >
      <Form.Item label="宽度" {...formItemLayout}>
        {getFieldDecorator('width', {
          initialValue: width,
        })(<InputNumber min={0} />)}
      </Form.Item>
      <Form.Item label="高度" {...formItemLayout}>
        {getFieldDecorator('height', {
          initialValue: height,
        })(<InputNumber min={0} />)}
      </Form.Item>
      <Form.Item label="字体大小" {...formItemLayout}>
        {getFieldDecorator('fontSize', {
          initialValue: fontSize,
        })(<InputNumber min={0} />)}
      </Form.Item>
      <Form.Item label="placeholder" {...formItemLayout}>
        {getFieldDecorator('placeholder', {
          initialValue: placeholder,
        })(<Input />)}
      </Form.Item>
    </div>
  );
};

export default Form.create({
  onFieldsChange: (props, changedFields) => {
    const {
      form: { getFieldsValue },
      style,
      updateStyle,
    } = props;
    const newFields = getFieldsValue();

    updateStyle({
      ...style,
      ...newFields,
    });
  },
})(CustomSelectSearchConfig);
