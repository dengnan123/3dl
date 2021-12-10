import React, { Fragment } from 'react';
import { Form, InputNumber, Switch } from 'antd';
import { reap } from '../../../../components/SafeReaper';
// import InputColor from '../../../../components/InputColor';
const FormItem = Form.Item;

export default ({
  form: { getFieldDecorator, getFieldsValue, getFieldValue, resetFields },
  formItemLayout,
  data,
}) => {
  return (
    <Fragment>
      <FormItem label="是否显示分隔区域" {...formItemLayout}>
        {getFieldDecorator('splitArea.show', {
          initialValue: reap(data, 'splitArea.show', false),
          valuePropName: 'checked',
        })(<Switch />)}
      </FormItem>

      {/* <FormItem label="分隔区域颜色" {...formItemLayout}>
        {getFieldDecorator('splitLine.lineStyle.color', {
          initialValue: reap(data, 'splitLine.lineStyle.color', '#ffff'),
        })(<InputColor  />)}
      </FormItem> */}

      <FormItem label="透明度" {...formItemLayout}>
        {getFieldDecorator('splitArea.areaStyle.opacity', {
          initialValue: reap(data, 'splitArea.areaStyle.opacity', 1),
        })(<InputNumber />)}
      </FormItem>
    </Fragment>
  );
};
