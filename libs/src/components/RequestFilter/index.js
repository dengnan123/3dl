import React, { Fragment, useState, useCallback } from 'react';
import { Form, Modal, Button } from 'antd';
import { reap } from '../SafeReaper';

import CodeEdit from '../CodeEditOther';

const RequestFilter = ({
  form: { getFieldDecorator, getFieldsValue, getFieldValue, resetFields, setFieldsValue },
  formItemLayout,
  data,
}) => {
  const [code, setCode] = useState('');
  const [fieldName, setFieldName] = useState('parmasFilterFunc');
  const [visible, setVisible] = useState(false);

  const _openModal = useCallback(
    name => {
      const _code = getFieldValue(name);
      setCode(_code);
      setVisible(true);
      setFieldName(name);
    },
    [getFieldValue, setCode, setVisible],
  );

  const _onCancel = useCallback(() => {
    setVisible(false);
  }, []);

  const _onOk = useCallback(() => {
    console.log('code: ', code);
    console.log('fieldName: ', fieldName);
    setFieldsValue({ [fieldName]: code });
    setVisible(false);
  }, [fieldName, code, setFieldsValue]);

  const editProps = {
    value: code,
    disCode: false,
    onChange: code => setCode(code),
    language: 'javascript',
    height: 600,
    width: '100%',
  };

  getFieldDecorator('parmasFilterFunc', {
    initialValue: reap(data, 'parmasFilterFunc', ''),
  });

  getFieldDecorator('parmasFilterFunc', {
    initialValue: reap(data, 'filterFunc', ''),
  });

  return (
    <Fragment>
      <Form.Item label="请求参数过滤器" {...formItemLayout}>
        <Button onClick={() => _openModal('parmasFilterFunc')} type="primary">
          设置
        </Button>
      </Form.Item>
      <Form.Item label="返回数据过滤器" {...formItemLayout}>
        <Button onClick={() => _openModal('filterFunc')} type="primary">
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

export default RequestFilter;
