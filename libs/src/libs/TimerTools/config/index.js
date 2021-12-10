import React, { useEffect } from 'react';
import { Form, InputNumber } from 'antd';
import { debounce } from 'lodash';

const FormItem = Form.Item;

function TimerToolsConfig(props) {
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

  const { seconds = 0, maxValue = 3, startIndex = 0 } = style;

  return (
    <div>
      <FormItem label="触发间隔时间(秒)">
        {getFieldDecorator('seconds', {
          initialValue: seconds,
        })(<InputNumber />)}
      </FormItem>
      <FormItem label="开始值">
        {getFieldDecorator('startIndex', {
          initialValue: startIndex,
        })(<InputNumber min={0} step={1} />)}
      </FormItem>
      <FormItem label="最大值">
        {getFieldDecorator('maxValue', {
          initialValue: maxValue,
        })(<InputNumber min={0} step={1} />)}
      </FormItem>
    </div>
  );
}

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
})(TimerToolsConfig);
