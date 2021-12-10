import { Fragment } from 'react';
import { Form, InputNumber, Input } from 'antd';

export default ({ form: { getFieldDecorator }, data, field, formItemLayout }) => {
  const { width, height, left, top, src, disSrc } = data;
  return (
    <Fragment>
      <Form.Item label="图片url" {...formItemLayout}>
        {getFieldDecorator(`${field}.src`, {
          initialValue: src,
        })(<Input.TextArea />)}
      </Form.Item>
      <Form.Item label="禁用状态图片url" {...formItemLayout}>
        {getFieldDecorator(`${field}.disSrc`, {
          initialValue: disSrc,
        })(<Input.TextArea />)}
      </Form.Item>
      <Form.Item label="宽度" {...formItemLayout}>
        {getFieldDecorator(`${field}.width`, {
          initialValue: width,
        })(<InputNumber />)}
      </Form.Item>
      <Form.Item label="高度" {...formItemLayout}>
        {getFieldDecorator(`${field}.height`, {
          initialValue: height,
        })(<InputNumber />)}
      </Form.Item>
      <Form.Item label="left" {...formItemLayout}>
        {getFieldDecorator(`${field}.left`, {
          initialValue: left,
        })(<InputNumber />)}
      </Form.Item>
      <Form.Item label="top" {...formItemLayout}>
        {getFieldDecorator(`${field}.top`, {
          initialValue: top,
        })(<InputNumber />)}
      </Form.Item>
    </Fragment>
  );
};
