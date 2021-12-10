import React from 'react';
import { debounce } from 'lodash';
import { Form, InputNumber } from 'antd';

function CustomAlertConfig(props) {

  const {
    formItemLayout,
    form: { getFieldDecorator },
    style,
  } = props;

  const {
    waiting = 5000,
  } = style || {};

  return (
    <div style={{ paddingLeft: 10, paddingRight: 10 }}>
      <Form.Item label="自动关闭的时间" {...formItemLayout}>
        {getFieldDecorator('waiting', {
          initialValue: waiting || 5000,
        })(<InputNumber placeholder="compKey" />)}
      </Form.Item>
    </div>
  )
}

export default Form.create({
  onFieldsChange: debounce((props, changedFields) => {
    const {
      form: { getFieldsValue },
      style,
      updateStyle,
    } = props;
    const fieldsValue = getFieldsValue();

    const finalParams = {
      ...style,
      ...fieldsValue,
    };
    updateStyle(finalParams);
  }, 500),
})(CustomAlertConfig);
