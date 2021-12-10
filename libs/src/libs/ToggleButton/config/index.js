import React, { useEffect } from 'react';
import { Form, Select, Switch, InputNumber, Input } from 'antd';
import { debounce } from 'lodash';
import InputColor from '../../../components/InputColor';

const ToggleButtonConfig = props => {
  const {
    formItemLayout,
    form: { getFieldDecorator, resetFields },
    id,
    style,
  } = props;

  const {
    content = '不平移',
    contentEn = 'not translate',
    invertContent = '平移',
    invertContentEn = 'translate',
    fontSize,
    fontColor,
    borderRadius,
    type,
    bgColor,
    showCustomColor,
  } = style || {};

  useEffect(
    () => {
      return () => {
        resetFields();
      };
    },
    [resetFields, id, style],
  );

  return (
    <div style={{ paddingLeft: 10, paddingRight: 10 }}>
      <Form.Item label="内容(中)" {...formItemLayout}>
        {getFieldDecorator('content', {
          initialValue: content,
        })(<Input />)}
      </Form.Item>

      <Form.Item label="内容(英)" {...formItemLayout}>
        {getFieldDecorator('contentEn', {
          initialValue: contentEn,
        })(<Input />)}
      </Form.Item>

      <Form.Item label="取反内容(中)" {...formItemLayout}>
        {getFieldDecorator('invertContent', {
          initialValue: invertContent,
        })(<Input />)}
      </Form.Item>

      <Form.Item label="取反内容(英)" {...formItemLayout}>
        {getFieldDecorator('invertContentEn', {
          initialValue: invertContentEn,
        })(<Input />)}
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

      <Form.Item label="圆角" {...formItemLayout}>
        {getFieldDecorator('borderRadius', {
          initialValue: borderRadius,
        })(<InputNumber min={0} />)}
      </Form.Item>

      <Form.Item label="类型" {...formItemLayout}>
        {getFieldDecorator('type', {
          initialValue: type,
        })(
          <Select style={{ width: 120 }}>
            <Select.Option value="default">Default</Select.Option>
            <Select.Option value="primary">Primary</Select.Option>
            <Select.Option value="dashed">Dashed</Select.Option>
            <Select.Option value="danger">Danger</Select.Option>
            <Select.Option value="link">Link</Select.Option>
          </Select>,
        )}
      </Form.Item>

      <Form.Item label="自定义" {...formItemLayout}>
        {getFieldDecorator('showCustomColor', {
          initialValue: showCustomColor,
          valuePropName: 'checked',
        })(<Switch />)}
      </Form.Item>

      {showCustomColor && (
        <Form.Item label="背景颜色" {...formItemLayout}>
          {getFieldDecorator('bgColor', {
            initialValue: bgColor,
          })(<InputColor />)}
        </Form.Item>
      )}
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

    updateStyle({
      ...style,
      ...newFields,
    });
  }, 500),
})(ToggleButtonConfig);
