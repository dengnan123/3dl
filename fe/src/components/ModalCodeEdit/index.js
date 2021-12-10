import React, { useState, Fragment } from 'react';
import FilterFuncEditer from '@/components/FilterFuncEditer';
import { Form, Modal, Button, Input } from 'antd';
const FormItem = Form.Item;
export default props => {
  const {
    form: { setFieldsValue, getFieldDecorator, getFieldValue },
    formItemLayout,
    field,
    data,
    formLabel = '页面脚本',
    btnText = '设置页面脚本',
    btnSize,
    disabled = false,
    language = 'javascript',
  } = props;
  const es5CodeKey = `${field}Es5Code`;
  const codeFuncNames = `${field}HasNames`;
  const [vis, setVis] = useState(false);
  const handleCancel = () => {
    setVis(false);
  };
  const value = getFieldValue(field) || data?.[field];
  const filterFuncEditerProps = {
    ...props,
    update: data => {
      setFieldsValue(data);
      setVis(false);
    },
    value,
    language: 'javascript',
    field,
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
          initialValue: data?.[field],
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
          initialValue: data?.[es5CodeKey],
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
          initialValue: data?.[codeFuncNames],
        })(<Input />)}
      </FormItem>

      <FormItem label={formLabel} {...formItemLayout}>
        <Button
          type="primary"
          disabled={disabled}
          onClick={() => {
            setVis(true);
          }}
          size={btnSize}
        >
          {btnText}
        </Button>
        {value && <span style={{ color: '#61e81e', marginLeft: 10 }}>已设置</span>}
      </FormItem>

      <Modal
        visible={vis}
        footer={null}
        onCancel={handleCancel}
        width={850}
        destroyOnClose={true}
        maskClosable={false}
        // mask={false}
      >
        <FilterFuncEditer {...filterFuncEditerProps}></FilterFuncEditer>
      </Modal>
    </Fragment>
  );
};
