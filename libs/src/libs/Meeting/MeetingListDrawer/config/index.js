import React from 'react';
import { Form, InputNumber, Switch, Input } from 'antd';
import styles from './index.less';

const MeetingListDrawerConfig = props => {
  const {
    formItemLayout,
    form: { getFieldDecorator },
    style,
  } = props;

  const { title = '会议列表：', openAutoClose = false, autoCloseTime = 10 } = style || {};

  return (
    <div style={{ paddingLeft: 10, paddingRight: 10 }} className={styles.container}>
      <Form.Item label="标题" {...formItemLayout}>
        {getFieldDecorator('title', {
          initialValue: title,
        })(<Input />)}
      </Form.Item>

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
})(MeetingListDrawerConfig);
