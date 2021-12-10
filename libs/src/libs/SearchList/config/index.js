import React, { useEffect } from 'react';
import { Form, Input, InputNumber, Select } from 'antd';
import { debounce } from 'lodash';
import { HTTP_METHOD_LIST } from '../../../helpers/api';
import InputColor from '../../../components/InputColor';

const listTextAlighList = ['left', 'center', 'right'];

const SearchListConfig = props => {
  const {
    formItemLayout,
    form: { getFieldDecorator, resetFields },
    id,
    style,
  } = props;

  const {
    fetchUrl,
    httpMethod,
    inputHeight,
    inputFontColor,
    inputPlaceholder,
    inputPlaceholderEn,
    inputMarginBottom,
    listFontColor,
    listTextAligh,
  } = style || {};

  useEffect(
    () => {
      return () => {
        resetFields();
      };
    },
    [resetFields, id, style],
  );

  return (
    <div style={{ paddingLeft: 10, paddingRight: 10 }}>
      <Form.Item label="搜索请求url" {...formItemLayout}>
        {getFieldDecorator('fetchUrl', {
          initialValue: fetchUrl,
        })(<Input />)}
      </Form.Item>

      <Form.Item label="搜索请求方式" {...formItemLayout}>
        {getFieldDecorator('httpMethod', {
          initialValue: httpMethod,
        })(
          <Select>
            {HTTP_METHOD_LIST.map(m => (
              <Select.Option key={m}>{m}</Select.Option>
            ))}
          </Select>,
        )}
      </Form.Item>

      <Form.Item label="搜索框高度" {...formItemLayout}>
        {getFieldDecorator('inputHeight', {
          initialValue: inputHeight,
        })(<InputNumber min={0} />)}
      </Form.Item>

      <Form.Item label="搜索框字体颜色" {...formItemLayout}>
        {getFieldDecorator('inputFontColor', {
          initialValue: inputFontColor,
        })(<InputColor />)}
      </Form.Item>

      <Form.Item label="搜索框提示文字(中)" {...formItemLayout}>
        {getFieldDecorator('inputPlaceholder', {
          initialValue: inputPlaceholder,
        })(<Input />)}
      </Form.Item>

      <Form.Item label="搜索框提示文字(英)" {...formItemLayout}>
        {getFieldDecorator('inputPlaceholderEn', {
          initialValue: inputPlaceholderEn,
        })(<Input />)}
      </Form.Item>

      <Form.Item label="搜索框下边距" {...formItemLayout}>
        {getFieldDecorator('inputMarginBottom', {
          initialValue: inputMarginBottom,
        })(<InputNumber min={0} />)}
      </Form.Item>

      <Form.Item label="列表字体颜色" {...formItemLayout}>
        {getFieldDecorator('listFontColor', {
          initialValue: listFontColor,
        })(<InputColor />)}
      </Form.Item>

      <Form.Item label="列表文字对齐方式" {...formItemLayout}>
        {getFieldDecorator('listTextAligh', {
          initialValue: listTextAligh,
        })(
          <Select>
            {listTextAlighList.map(m => (
              <Select.Option key={m}>{m}</Select.Option>
            ))}
          </Select>,
        )}
      </Form.Item>
    </div>
  );
};

export default Form.create({
  onFieldsChange: debounce((props, changedFields) => {
    const {
      form: { getFieldsValue },
      style,
      updateStyle,
    } = props;
    const newFields = getFieldsValue();
    // 处理数据

    updateStyle({
      ...style,
      ...newFields,
    });
  }, 500),
})(SearchListConfig);
