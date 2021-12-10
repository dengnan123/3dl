import React, { Fragment, useState, useCallback } from 'react';
import { Form, Modal, Button } from 'antd';

import CodeEdit from '../CodeEditOther';

const FilterFormItem = ({
  form: { getFieldDecorator, getFieldsValue, getFieldValue, resetFields, setFieldsValue },
  formItemLayout,
  formFieldName = 'parmasFilterFunc',
  fieldLabel = '过滤器',
  initialValue,
  disabled = false,
  language = 'javascript',
}) => {
  const [code, setCode] = useState('');
  const [visible, setVisible] = useState(false);

  const _openModal = useCallback(() => {
    const _code = getFieldValue(formFieldName);
    setCode(_code);
    setVisible(true);
  }, [getFieldValue, setCode, setVisible, formFieldName]);

  const _onCancel = useCallback(() => {
    setVisible(false);
  }, []);

  const _onOk = useCallback(() => {
    setFieldsValue({ [formFieldName]: code });
    setVisible(false);
  }, [formFieldName, code, setFieldsValue]);

  const editProps = {
    value: code,
    disCode: false,
    onChange: code => setCode(code),
    language: language,
    height: 600,
    width: '100%',
  };

  getFieldDecorator(formFieldName, {
    initialValue,
  });

  return (
    <Fragment>
      <Form.Item label={fieldLabel} {...formItemLayout}>
        <Button onClick={_openModal} type="primary" disabled={disabled}>
          设置
        </Button>
      </Form.Item>

      <Modal
        width={960}
        visible={visible}
        onCancel={_onCancel}
        onOk={_onOk}
        afterClose={() => setCode('')}
      >
        <CodeEdit {...editProps} />
      </Modal>
    </Fragment>
  );
};

export default FilterFormItem;
