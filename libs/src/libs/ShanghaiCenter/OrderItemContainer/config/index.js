import React, { useEffect } from 'react';
import { Form, InputNumber, Switch } from 'antd';
import { debounce } from 'lodash';
import InputColor from '../../../../components/InputColor';

const OrderItemConatinerConfig = props => {
  const {
    form: { resetFields, getFieldDecorator },
    id,
    style,
  } = props;

  useEffect(() => {
    return () => {
      resetFields();
    };
  }, [resetFields, id, style]);

  return (
    <div style={{ paddingLeft: 10, paddingRight: 10 }}>
      <Form.Item label="每条宽度">
        {getFieldDecorator('itemWidth', {
          initialValue: style?.itemWidth || 1000,
        })(<InputNumber />)}
      </Form.Item>

      <Form.Item label="每条高度">
        {getFieldDecorator('itemHeight', {
          initialValue: style?.itemHeight || 90,
        })(<InputNumber />)}
      </Form.Item>

      <Form.Item label="时间字体大小">
        {getFieldDecorator('timeFontSize', {
          initialValue: style?.timeFontSize || 30,
        })(<InputNumber />)}
      </Form.Item>
      <Form.Item label="楼层字体大小">
        {getFieldDecorator('floorFontSize', {
          initialValue: style?.floorFontSize || 28,
        })(<InputNumber />)}
      </Form.Item>

      <Form.Item label="修理员字体大小">
        {getFieldDecorator('staffFontSize', {
          initialValue: style?.staffFontSize || 24,
        })(<InputNumber />)}
      </Form.Item>

      <Form.Item label="内容字体大小">
        {getFieldDecorator('contentFontSize', {
          initialValue: style?.contentFontSize || 28,
        })(<InputNumber />)}
      </Form.Item>

      <Form.Item label="边框呼吸持续时间">
        {getFieldDecorator('blinkDuration', {
          initialValue: style?.blinkDuration || 5000,
        })(<InputNumber />)}
      </Form.Item>

      <Form.Item label="边框呼吸频率">
        {getFieldDecorator('blinkFrequency', {
          initialValue: style?.blinkFrequency || 1200,
        })(<InputNumber />)}
      </Form.Item>

      <Form.Item label="状态">
        {getFieldDecorator('orderStatus', {
          initialValue: style?.orderStatus || 1,
        })(<InputNumber min={1} max={2} />)}
      </Form.Item>

      <Form.Item label="边框颜色">
        {getFieldDecorator('borderColor', {
          initialValue: style?.borderColor || 'rgba(61, 210, 163, 1)',
        })(<InputColor />)}
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
})(OrderItemConatinerConfig);
