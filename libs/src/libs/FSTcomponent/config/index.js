// import {useState} from 'react'
import PropTypes from 'prop-types';
import React from 'react';
import { Form, InputNumber } from 'antd';
import { debounce } from 'lodash';
function FSTconfig(props) {
  const {
    formItemLayout,
    form: { getFieldDecorator },
    style,
  } = props;
  const { idIndex = 1 } = style;
  return (
    <div>
      <Form.Item label="id起始值" {...formItemLayout}>
        {getFieldDecorator('idIndex', {
          initialValue: idIndex,
        })(<InputNumber />)}
      </Form.Item>
    </div>
  );
}

FSTconfig.propTypes = {
  updateStyle: PropTypes.func,
  form: PropTypes.object,
};

export default Form.create({
  onFieldsChange: debounce((props, changedFields) => {
    const { form, style, updateStyle } = props;

    const newFields = form.getFieldsValue();
    updateStyle({ ...style, ...newFields });
  }),
})(FSTconfig);
