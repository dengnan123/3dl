import React, { Fragment } from 'react';
import { Form } from 'antd';
import { reap } from '../SafeReaper';
const FormItem = Form.Item;

export default ({ form: { getFieldDecorator }, formItemLayout, formConfigJson, data }) => {
  const arr = Object.keys(formConfigJson);
  return (
    <Fragment>
      {arr.map(v => {
        const { label, field, Comp, isSwitch } = v;
        let opt = {
          initialValue: reap(data, field, true),
        };
        if (isSwitch) {
          opt.valuePropName = 'checked';
        }
        return (
          <FormItem label={label} {...formItemLayout} key={field}>
            {getFieldDecorator(field, opt)(<Comp />)}
          </FormItem>
        );
      })}
    </Fragment>
  );
};
