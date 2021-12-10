import React, { Fragment } from 'react';
import { Form, Input } from 'antd';

import { transformCode, getCodeFuncNames } from '@/helpers/screen';
import AceEditor from '@/components/AceEditor';

const FormItem = Form.Item;

export default props => {
  const {
    form: { setFieldsValue, getFieldDecorator, getFieldValue },
    formItemLayout,
    field,
    data,
    titleFiledArr,
  } = props;
  const es5CodeKey = `${field}Es5Code`;
  const codeFuncNames = `${field}HasNames`;

  let value = '';
  if (field) {
    value = getFieldValue(field) || data[field];
  }

  const editProps = {
    titleFiledArr: titleFiledArr,
    value: value,
    language: 'javascript',
    showFooter: false,
    onChange: v => {
      if (!v) {
        setFieldsValue({
          [field]: null,
          [es5CodeKey]: null,
        });
        return;
      }
      const newV = v.replace(/\s*/g, '');
      if (!newV) {
        setFieldsValue({
          [field]: null,
          [es5CodeKey]: null,
        });
        return;
      }
      const updateData = {
        [field]: v,
      };
      const code = transformCode(v);
      updateData[es5CodeKey] = code;
      updateData[codeFuncNames] = getCodeFuncNames();
      setFieldsValue(updateData);
    },
  };

  return (
    <Fragment>
      <FormItem
        label=""
        {...formItemLayout}
        style={{
          display: 'none',
        }}
      >
        {getFieldDecorator(field, {
          initialValue: data[field],
        })(<Input />)}
      </FormItem>
      <FormItem
        label=""
        {...formItemLayout}
        style={{
          display: 'none',
        }}
      >
        {getFieldDecorator(es5CodeKey, {
          initialValue: data[es5CodeKey],
        })(<Input />)}
      </FormItem>
      <FormItem
        label=""
        {...formItemLayout}
        style={{
          display: 'none',
        }}
      >
        {getFieldDecorator(codeFuncNames, {
          initialValue: data[codeFuncNames],
        })(<Input />)}
      </FormItem>
      <AceEditor {...editProps}></AceEditor>
    </Fragment>
  );
};
