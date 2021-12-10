import React from 'react';
import PropTypes from 'prop-types';
import { Form, InputNumber, Switch, Select, Input } from 'antd';
import InputColor from '../../../components/InputColor';

const FormItem = Form.Item;
function ClockConfig(props) {
  const {
    form: { getFieldDecorator },
    style,
  } = props;

  const {
    inputWidth = 200,
    inputHeight = 30,
    TimePickerWidth = 120,
    TimePickerHeight = 30,
    Margin = 10,
  } = style || {};

  return (
    <div>
      <FormItem label="input框宽度">
        {getFieldDecorator('inputWidth', {
          initialValue: inputWidth,
        })(<InputNumber />)}
      </FormItem>

      <FormItem label="input框高度">
        {getFieldDecorator('inputHeight', {
          initialValue: inputHeight,
        })(<InputNumber />)}
      </FormItem>

      <FormItem label="TimePicker框宽度">
        {getFieldDecorator('TimePickerWidth', {
          initialValue: TimePickerWidth,
        })(<InputNumber />)}
      </FormItem>
      <FormItem label="左右间距">
        {getFieldDecorator('Margin', {
          initialValue: Margin,
        })(<InputNumber />)}
      </FormItem>
    </div>
  );
}

ClockConfig.propTypes = {
  updateStyle: PropTypes.func,
  form: PropTypes.object,
};

export default Form.create({
  onFieldsChange: props => {
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
  },
})(ClockConfig);
