import React, { Component } from 'react';

import { debounce } from 'lodash';

import { Form, Input, Switch } from 'antd';
import InputColor from '../../../../components/InputColor';

class FilterTableConfig extends Component {
  render() {
    const { style, formItemLayout, form } = this.props;

    const { getFieldDecorator } = form;

    return (
      <div>
        <Form.Item label="组件key" {...formItemLayout}>
          {getFieldDecorator('compKey', {
            initialValue: style?.compKey ?? 'filterTable',
          })(<Input />)}
        </Form.Item>

        <Form.Item label="是否展示外边框和列边框" {...formItemLayout}>
          {getFieldDecorator('bordered', {
            initialValue: style?.bordered ?? false,
            valuePropName: 'checked',
          })(<Switch />)}
        </Form.Item>

        <Form.Item label="Header背景色" {...formItemLayout}>
          {getFieldDecorator('headerBgColor', {
            initialValue: style?.headerBgColor,
          })(<InputColor />)}
        </Form.Item>

        <Form.Item label="Header字体颜色" {...formItemLayout}>
          {getFieldDecorator('headerFontColor', {
            initialValue: style?.headerFontColor,
          })(<InputColor />)}
        </Form.Item>
      </div>
    );
  }
}

FilterTableConfig.propTypes = {};

export default Form.create({
  onFieldsChange: debounce((props, changeFields) => {
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
  }),
})(FilterTableConfig);
