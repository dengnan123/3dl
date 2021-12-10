import React from 'react';
import { Form, InputNumber } from 'antd';
import InputColor from '../../../../components/InputColor';
import styles from './index.less';

const MeetingListConfig = props => {
  const {
    formItemLayout,
    form: { getFieldDecorator },
    style,
  } = props;

  const {
    color = '#757575',
    highlightColor = '#424242',
    fontSize = 28,
    lineHeight = 40,
    spacing = 10,
    arrowSize = 18,
    arrowMarginRight = 10,
  } = style || {};

  return (
    <div style={{ paddingLeft: 10, paddingRight: 10 }} className={styles.container}>
      <Form.Item label="列表字体大小" {...formItemLayout}>
        {getFieldDecorator('fontSize', {
          initialValue: fontSize,
        })(<InputNumber min={12} />)}
      </Form.Item>

      <Form.Item label="列表字体颜色" {...formItemLayout}>
        {getFieldDecorator('color', {
          initialValue: color,
        })(<InputColor />)}
      </Form.Item>

      <Form.Item label="列表高亮字体颜色" {...formItemLayout}>
        {getFieldDecorator('highlightColor', {
          initialValue: highlightColor,
        })(<InputColor />)}
      </Form.Item>

      <Form.Item label="行高" {...formItemLayout}>
        {getFieldDecorator('lineHeight', {
          initialValue: lineHeight,
        })(<InputNumber />)}
      </Form.Item>

      <Form.Item label="字段间距" {...formItemLayout}>
        {getFieldDecorator('spacing', {
          initialValue: spacing,
        })(<InputNumber min={0} />)}
      </Form.Item>

      <Form.Item label="箭头大小" {...formItemLayout}>
        {getFieldDecorator('arrowSize', {
          initialValue: arrowSize,
        })(<InputNumber min={0} />)}
      </Form.Item>

      <Form.Item label="箭头右边距" {...formItemLayout}>
        {getFieldDecorator('arrowMarginRight', {
          initialValue: arrowMarginRight,
        })(<InputNumber min={0} />)}
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
})(MeetingListConfig);
