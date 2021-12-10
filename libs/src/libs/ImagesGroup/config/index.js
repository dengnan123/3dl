import React, { useEffect } from 'react';
import { Form, Input, InputNumber, Select } from 'antd';
import { debounce } from 'lodash';

import InputColor from '../../../components/InputColor';

const ImagesConfig = props => {
  const {
    formItemLayout,
    form: { getFieldDecorator, resetFields },
    id,
    style,
  } = props;

  const {
    title = '',
    titleWidth = 120,
    titleFontSize = 16,
    titleFontWeight = 400,
    titleColor = '#424242',
    titleAlign = 'left',
    imageWidth = 20,
    imageHeight = 25,
    marginRight = 15,
    imagePath = '',
  } = style || {};

  useEffect(() => {
    return () => {
      resetFields();
    };
  }, [resetFields, id, style]);

  return (
    <div style={{ paddingLeft: 10, paddingRight: 10 }}>
      <Form.Item label="标题内容" {...formItemLayout}>
        {getFieldDecorator('title', {
          initialValue: title,
        })(<Input />)}
      </Form.Item>

      <Form.Item label="标题内容宽度" {...formItemLayout}>
        {getFieldDecorator('titleWidth', {
          initialValue: titleWidth,
        })(<InputNumber min={0} />)}
      </Form.Item>

      <Form.Item label="标题字体大小" {...formItemLayout}>
        {getFieldDecorator('titleFontSize', {
          initialValue: titleFontSize,
        })(<InputNumber min={12} />)}
      </Form.Item>

      <Form.Item label="标题字体粗细" {...formItemLayout}>
        {getFieldDecorator('titleFontWeight', {
          initialValue: titleFontWeight,
        })(<InputNumber min={300} step={100} />)}
      </Form.Item>

      <Form.Item label="标题字体颜色" {...formItemLayout}>
        {getFieldDecorator('titleColor', {
          initialValue: titleColor,
        })(<InputColor />)}
      </Form.Item>

      <Form.Item label="标题对齐方式" {...formItemLayout}>
        {getFieldDecorator('titleAlign', {
          initialValue: titleAlign,
        })(
          <Select style={{ width: 120 }}>
            <Select.Option value="left">left</Select.Option>
            <Select.Option value="center">center</Select.Option>
            <Select.Option value="right">right</Select.Option>
          </Select>,
        )}
      </Form.Item>

      <Form.Item label="图片存储路径" {...formItemLayout}>
        {getFieldDecorator('imagePath', {
          initialValue: imagePath,
        })(<Input />)}
      </Form.Item>

      <Form.Item label="单个图片宽度" {...formItemLayout}>
        {getFieldDecorator('imageWidth', {
          initialValue: imageWidth,
        })(<InputNumber min={0} />)}
      </Form.Item>

      <Form.Item label="单个图片高度" {...formItemLayout}>
        {getFieldDecorator('imageHeight', {
          initialValue: imageHeight,
        })(<InputNumber min={0} />)}
      </Form.Item>

      <Form.Item label="图片右间距" {...formItemLayout}>
        {getFieldDecorator('marginRight', {
          initialValue: marginRight,
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
})(ImagesConfig);
