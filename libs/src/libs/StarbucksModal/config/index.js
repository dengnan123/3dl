import React from 'react';
import { Form, InputNumber, Switch } from 'antd';
// import InputColor from '../../../components/InputColor';

import styles from './index.less';
// const { Option } = Select;
// const { Panel } = Collapse;

const CustomizeFormConfig = props => {
  const {
    formItemLayout,
    form: { getFieldDecorator },
    style,
  } = props;
  const { visible = false, top = 10, contentRadius = 6, isZh = true } = style;

  return (
    <div style={{ paddingLeft: 10, paddingRight: 10 }} className={styles.container}>
      <Form.Item label="是否显示Modal">
        {getFieldDecorator('visible', {
          valuePropName: 'checked',
          initialValue: visible,
        })(<Switch />)}
      </Form.Item>
      <Form.Item label="top" {...formItemLayout}>
        {getFieldDecorator('top', {
          initialValue: top,
        })(<InputNumber min={0} />)}
      </Form.Item>
      <Form.Item label="是否为中文环境">
        {getFieldDecorator('isZh', {
          valuePropName: 'checked',
          initialValue: isZh || true,
        })(<Switch />)}
      </Form.Item>
      <Form.Item label="圆角" {...formItemLayout}>
        {getFieldDecorator('contentRadius', {
          initialValue: contentRadius,
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
})(CustomizeFormConfig);
