import React, { useEffect } from 'react';
import { Form, Input, Select } from 'antd';
import { debounce } from 'lodash';

const ImageSwitcherConfig = props => {
  const {
    formItemLayout,
    form: { getFieldDecorator, resetFields },
    style,
    id,
  } = props;

  const { src, textAlign = 'left' } = style || {};

  useEffect(() => {
    return () => {
      resetFields();
    };
  }, [resetFields, id, style]);

  return (
    <div style={{ paddingLeft: 10, paddingRight: 10 }}>
      <Form.Item label="图片地址" {...formItemLayout}>
        {getFieldDecorator('src', {
          initialValue: src,
        })(<Input />)}
      </Form.Item>
      <Form.Item label="对齐方式" {...formItemLayout}>
        {getFieldDecorator('textAlign', {
          initialValue: textAlign,
        })(
          <Select placeholder="对齐">
            <Select.Option value="left">左对齐</Select.Option>
            <Select.Option value="right">右对齐</Select.Option>
          </Select>,
        )}
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
})(ImageSwitcherConfig);
