import React, { Fragment } from 'react';
import { reap } from '../../../../components/SafeReaper';

import { Form, Input } from 'antd';
import InputColor from '../../../../components/InputColor';

const FormItem = Form.Item;

export default ({
  form: { getFieldDecorator, getFieldsValue, getFieldValue, resetFields },
  formItemLayout,
  data,
  mockData,
}) => {
  console.log('data: ', data);
  console.log('mockData: ', mockData);
  const indicatorList = reap(mockData, 'series[0].data[0].value', []);

  return (
    <Fragment>
      {indicatorList.map((item, index) => (
        <Form.Item key={index} label={`数据${index + 1}`} {...formItemLayout}>
          <FormItem label="指示器名称" {...formItemLayout}>
            {getFieldDecorator(`indicator[${index}].name`, {
              initialValue: reap(data, `indicator[${index}].name`, `名称${index}`),
            })(<Input />)}
          </FormItem>
          {/* <FormItem label="指示器最大值" {...formItemLayout}>
            {getFieldDecorator(`indicator[${index}].max`, {
              initialValue: reap(data, `indicator[${index}].max`, 1000),
            })(<InputNumber />)}
          </FormItem>
          <FormItem label="指示器最小值" {...formItemLayout}>
            {getFieldDecorator(`indicator[${index}].min`, {
              initialValue: reap(data, `indicator[${index}].min`, 0),
            })(<InputNumber />)}
          </FormItem> */}
          <FormItem label="标签颜色" {...formItemLayout}>
            {getFieldDecorator(`indicator[${index}].color`, {
              initialValue: reap(data, `indicator[${index}].color`, '#424242'),
            })(<InputColor />)}
          </FormItem>
        </Form.Item>
      ))}
    </Fragment>
  );
};
