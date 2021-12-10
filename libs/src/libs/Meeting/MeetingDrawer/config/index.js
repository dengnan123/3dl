import React from 'react';
import { Form, Switch, InputNumber } from 'antd';
import { getFormDefValue } from '../../../../helpers/form';
import styles from './index.less';

const MeetingDrawerConfig = props => {
  const {
    formItemLayout,
    form: { getFieldDecorator },
    form,
    style,
  } = props;

  const { autoCloseTime } = style || {};

  const openAutoClose = getFormDefValue(style, form, 'openAutoClose', false);
  return (
    <div style={{ paddingLeft: 10, paddingRight: 10 }} className={styles.container}>
      <Form.Item label="打开自动关闭" {...formItemLayout}>
        {getFieldDecorator('openAutoClose', {
          initialValue: openAutoClose,
          valuePropName: 'checked',
        })(<Switch />)}
      </Form.Item>
      {Boolean(openAutoClose) && (
        <Form.Item label="填写时间(秒)" {...formItemLayout}>
          {getFieldDecorator('autoCloseTime', {
            initialValue: autoCloseTime,
          })(<InputNumber />)}
        </Form.Item>
      )}
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
})(MeetingDrawerConfig);
