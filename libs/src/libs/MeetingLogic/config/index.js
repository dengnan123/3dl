import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import { Form, Switch, Input, InputNumber } from 'antd';
const FormItem = Form.Item;

function MeetingLogicConfig(props) {
  const {
    form: { getFieldDecorator, resetFields },
    style,
    id,
  } = props;

  useEffect(() => {
    return () => {
      resetFields();
    };
  }, [resetFields, id, style]);

  return (
    <div>
      <FormItem label="自动退出时间(毫秒)">
        {getFieldDecorator('duration', {
          initialValue: style?.duration || 60000,
        })(<InputNumber />)}
      </FormItem>
    </div>
  );
}

MeetingLogicConfig.propTypes = {
  updateStyle: PropTypes.func,
  form: PropTypes.object,
};

export default Form.create({
  onFieldsChange: debounce((props, changedFields) => {
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
  }, 100),
})(MeetingLogicConfig);
