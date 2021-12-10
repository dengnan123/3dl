import React, { Fragment } from 'react';
import { Form, Switch, Select } from 'antd';
// import { reap } from '../../../../components/SafeReaper';
import { reap } from '../../../../components/SafeReaper';

const FormItem = Form.Item;
const { Option } = Select;
export default ({
  form: { getFieldDecorator, getFieldsValue, getFieldValue, resetFields },
  formItemLayout,
  data,
  type,
}) => {
  
  return (
    <Fragment>
      <FormItem label="是否显示坐标轴" {...formItemLayout}>
        {getFieldDecorator('show', {
          initialValue: reap(data, 'show', true),
          valuePropName: 'checked',
        })(<Switch />)}
      </FormItem>

      <FormItem label="坐标轴类型" {...formItemLayout}>
        {getFieldDecorator('type', {
          initialValue: reap(data, 'type', type === 'X' ? 'category' : 'value'),
        })(
          <Select style={{ width: 120 }}>
            <Option value="value">数值轴</Option>
            <Option value="category">类目轴</Option>
            <Option value="time">时间轴</Option>
            <Option value="log">对数轴</Option>
          </Select>,
        )}
      </FormItem>

      <FormItem label="反向坐标轴" {...formItemLayout}>
        {getFieldDecorator('inverse', {
          initialValue: reap(data, 'inverse', false),
          valuePropName: 'checked',
        })(<Switch />)}
      </FormItem>

      <FormItem label="坐标轴两边留白" {...formItemLayout}>
        {getFieldDecorator('boundaryGap', {
          initialValue: reap(data, 'boundaryGap', true),
          valuePropName: 'checked',
        })(<Switch />)}
      </FormItem>
    </Fragment>
  );
};
