import React, { useEffect } from 'react';
import { Form, Input } from 'antd';

import styles from './index.less';

const CustomizeSvgConfig = props => {
  const {
    formItemLayout,
    form: { getFieldDecorator, resetFields },
    id,
    style,
  } = props;

  const { svgStr = '' } = style || {};

  useEffect(
    () => {
      return () => {
        resetFields();
      };
    },
    [resetFields, id, style],
  );

  return (
    <div style={{ paddingLeft: 10, paddingRight: 10 }} className={styles.container}>
      <Form.Item label="下拉小箭头svg" {...formItemLayout}>
        {getFieldDecorator('svgStr', {
          initialValue: svgStr,
        })(<Input.TextArea />)}
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
})(CustomizeSvgConfig);
