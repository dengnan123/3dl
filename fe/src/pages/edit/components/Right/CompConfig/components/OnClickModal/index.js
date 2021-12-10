import React from 'react';
import { Form } from 'antd';
// import CodeEdit from '@/components/CodeEditOther';
import { reap } from '@/components/SafeReaper';
import ModalWrapFooter from '@/components/ModalWrapFooter';
import AceEditor from '@/components/AceEditor';
const { Item } = Form;

const formItemLayout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 22 },
};

export default ({
  form: { getFieldDecorator },
  dataSourceList,
  data,
  initUseCompList,
  onCancel,
  onOk,
  fieldKey,
}) => {
  const editProps = {
    language: 'javascript',
    showFooter: false,
  };
  const wrapProps = {
    onCancel,
    onOk,
  };
  // onClick回调
  return (
    <ModalWrapFooter {...wrapProps}>
      <Item {...formItemLayout} label="">
        {getFieldDecorator(fieldKey, {
          initialValue: reap(data, fieldKey, ''),
        })(<AceEditor {...editProps}></AceEditor>)}
      </Item>
    </ModalWrapFooter>
  );
};
