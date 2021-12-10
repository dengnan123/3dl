import React, { useEffect } from 'react';
import { Form, Input, InputNumber } from 'antd';
import { debounce } from 'lodash';
import InputColor from '../../../components/InputColor';

const TitleBarConfig = props => {
  const {
    formItemLayout,
    form: { getFieldDecorator, resetFields },
    id,
    style,
  } = props;

  const {
    iconWith,
    iconHeight,
    iconMarginLeft,
    iconMarginRight,
    iconBgColor,
    title,
    titleEn,
    fontSize,
    color,
  } = style || {};

  useEffect(() => {
    return () => {
      resetFields();
    };
  }, [resetFields, id, style]);

  return (
    <div style={{ paddingLeft: 10, paddingRight: 10 }}>
      <Form.Item label="图标宽度" {...formItemLayout}>
        {getFieldDecorator('iconWith', {
          initialValue: iconWith,
        })(<InputNumber min={0} />)}
      </Form.Item>

      <Form.Item label="图标高度" {...formItemLayout}>
        {getFieldDecorator('iconHeight', {
          initialValue: iconHeight,
        })(<InputNumber min={0} />)}
      </Form.Item>

      <Form.Item label="图标左边距" {...formItemLayout}>
        {getFieldDecorator('iconMarginLeft', {
          initialValue: iconMarginLeft,
        })(<InputNumber min={0} />)}
      </Form.Item>

      <Form.Item label="图标右边距" {...formItemLayout}>
        {getFieldDecorator('iconMarginRight', {
          initialValue: iconMarginRight,
        })(<InputNumber min={0} />)}
      </Form.Item>

      <Form.Item label="图标背景颜色" {...formItemLayout}>
        {getFieldDecorator('iconBgColor', {
          initialValue: iconBgColor,
        })(<InputColor />)}
      </Form.Item>

      <Form.Item label="标题内容(中)" {...formItemLayout}>
        {getFieldDecorator('title', {
          initialValue: title,
        })(<Input />)}
      </Form.Item>

      <Form.Item label="标题内容(英)" {...formItemLayout}>
        {getFieldDecorator('titleEn', {
          initialValue: titleEn,
        })(<Input />)}
      </Form.Item>

      <Form.Item label="字体大小" {...formItemLayout}>
        {getFieldDecorator('fontSize', {
          initialValue: fontSize,
        })(<InputNumber min={12} />)}
      </Form.Item>

      <Form.Item label="字体颜色" {...formItemLayout}>
        {getFieldDecorator('color', {
          initialValue: color,
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
})(TitleBarConfig);
