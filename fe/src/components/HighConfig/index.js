import { Fragment } from 'react';
import { Form, Switch } from 'antd';
import CodeEdit from '@/components/CodeEditOther';
import { getFormDefValue } from '@/helpers/form';

export default ({ formItemLayout = {}, form, data, openHighConfigKey, filterFuncKey }) => {
  const { getFieldDecorator } = form;
  const editProps = {
    update: () => {},
    code: {},
    disCode: false,
    language: 'javascript',
    height: 800,
    width: '100%',
  };
  const high = getFormDefValue(data, form, openHighConfigKey, 0);
  return (
    <Fragment>
      <Form.Item label="高级" {...formItemLayout}>
        {getFieldDecorator(openHighConfigKey, {
          initialValue: data?.[openHighConfigKey],
          valuePropName: 'checked',
        })(<Switch />)}
      </Form.Item>
      {high ? (
        <Form.Item label="过滤器" {...formItemLayout}>
          {getFieldDecorator(filterFuncKey, {
            initialValue: data?.[filterFuncKey] || '',
          })(<CodeEdit {...editProps}></CodeEdit>)}
        </Form.Item>
      ) : null}
    </Fragment>
  );
};
