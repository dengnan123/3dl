import React from 'react';
import { Form } from 'antd';

import styles from './index.less';

const CustomizeFormConfig = props => {
  const {
    formItemLayout,
    form: { getFieldDecorator },
    style,
  } = props;

  const { link = 'https://3dl.dfocus.top' } = style;

  return (
    <div style={{ paddingLeft: 10, paddingRight: 10 }} className={styles.container}>
      <Form.Item label="配置链接" {...formItemLayout}>
        {getFieldDecorator('link', {
          initialValue: link,
        })(<span>{link}</span>)}
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
