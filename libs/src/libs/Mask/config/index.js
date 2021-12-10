import React from 'react';
import { Form, InputNumber } from 'antd';
import InputColor from '../../../components/InputColor';

const BasicConfig = props => {
  const {
    formItemLayout,
    form: { getFieldDecorator },
    style,
  } = props;

  const { backgroundColor, opacity } = style;

  return (
    <div style={{ paddingLeft: 10, paddingRight: 10 }}>
      <Form.Item label="透明度" {...formItemLayout}>
        {getFieldDecorator('opacity', {
          initialValue: opacity,
        })(<InputNumber />)}
      </Form.Item>

      <Form.Item label="背景色" {...formItemLayout}>
        {getFieldDecorator('backgroundColor', {
          initialValue: backgroundColor,
        })(<InputColor placeholder="请选择背景色颜色" />)}
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
