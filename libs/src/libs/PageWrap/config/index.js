import React from 'react';
import { debounce } from 'lodash';
import { Form, InputNumber } from 'antd';

const BasicConfig = props => {
  const {
    formItemLayout,
    form: { getFieldDecorator },
    style,
  } = props;

  const { pageId } = style;

  return (
    <div style={{ paddingLeft: 10, paddingRight: 10 }}>
      <Form.Item label="页面ID" {...formItemLayout}>
        {getFieldDecorator('pageId', {
          initialValue: pageId,
        })(<InputNumber />)}
      </Form.Item>
    </div>
  );
};

export default Form.create({
  onFieldsChange: debounce((props, changedFields) => {
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
  }, 200),
})(BasicConfig);
