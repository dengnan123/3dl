import React, { useEffect } from 'react';
import { debounce } from 'lodash';
import { Form, InputNumber, Switch } from 'antd';
import InputColor from '../../../components/InputColor';

const TextStatusConfig = props => {
  const {
    style = {},
    form: { getFieldDecorator, resetFields },
    formItemLayout,
    id,
  } = props;

  const {
    fontSize = 12,
    color,
    background,
    borderRadius,
    paddingLeft,
    paddingRight,
    paddingTop,
    paddingBottom,
    FloorNumber,
    count,
    costumer = false,
  } = style;

  useEffect(() => {
    resetFields();
  }, [resetFields, style, id]);

  return (
    <div style={{ paddingLeft: 10, paddingRight: 10 }}>
      <Form.Item {...formItemLayout} label="字体大小">
        {getFieldDecorator('fontSize', {
          initialValue: fontSize,
        })(<InputNumber />)}
      </Form.Item>

      <Form.Item {...formItemLayout} label={<span style={{ background, color }}>字体颜色</span>}>
        {getFieldDecorator('color', {
          initialValue: color,
        })(<InputColor />)}
      </Form.Item>

      <Form.Item {...formItemLayout} label="圆角">
        {getFieldDecorator('borderRadius', {
          initialValue: borderRadius,
        })(<InputNumber />)}
      </Form.Item>

      <Form.Item {...formItemLayout} label="左边距">
        {getFieldDecorator('paddingLeft', {
          initialValue: paddingLeft,
        })(<InputNumber />)}
      </Form.Item>

      <Form.Item {...formItemLayout} label="上边距">
        {getFieldDecorator('paddingTop', {
          initialValue: paddingTop,
        })(<InputNumber />)}
      </Form.Item>

      <Form.Item {...formItemLayout} label="下边距">
        {getFieldDecorator('paddingBottom', {
          initialValue: paddingBottom,
        })(<InputNumber />)}
      </Form.Item>

      <Form.Item {...formItemLayout} label="左边距">
        {getFieldDecorator('paddingRight', {
          initialValue: paddingRight,
        })(<InputNumber />)}
      </Form.Item>

      <Form.Item {...formItemLayout} label={<span style={{ background, color }}>背景颜色</span>}>
        {getFieldDecorator('background', {
          initialValue: background,
        })(<InputColor />)}
      </Form.Item>

      <Form.Item {...formItemLayout} label="用来显示的楼层">
        {getFieldDecorator('FloorNumber', {
          initialValue: FloorNumber,
        })(<InputNumber />)}
      </Form.Item>

      <Form.Item {...formItemLayout} label="用来匹配的楼层">
        {getFieldDecorator('count', {
          initialValue: count,
        })(<InputNumber />)}
      </Form.Item>

      <Form.Item {...formItemLayout} label="根据自定义匹配">
        {getFieldDecorator('costumer', {
          valuePropName: 'checked',
          initialValue: costumer,
        })(<Switch />)}
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
})(TextStatusConfig);
