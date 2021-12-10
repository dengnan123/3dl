import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Input } from 'antd';

function ParamModal(props) {
  const { onOk, onCancel, form, visible, title, initialValue } = props;
  const { getFieldDecorator, validateFields, resetFields } = form;

  const hanldeOk = useCallback(() => {
    validateFields((errors, values) => {
      if (errors) {
        return;
      }
      onOk && onOk(values);
    });
  }, [onOk, validateFields]);

  return (
    <Modal
      with={500}
      title={title}
      visible={visible}
      maskClosable={false}
      onOk={hanldeOk}
      onCancel={onCancel}
      afterClose={resetFields}
    >
      <Form.Item label="变量名">
        {getFieldDecorator('key', {
          initialValue: initialValue?.key,
          rules: [
            { required: true, message: '请输入变量名', whitespace: true },
            { pattern: /^[a-zA-Z\$_][a-zA-Z\d_]*$/, message: '变量名不合法' },
          ],
        })(<Input placeholder="变量名" />)}
      </Form.Item>
      <Form.Item label="默认值">
        {getFieldDecorator('initValue', {
          initialValue: initialValue?.initValue,
          rules: [{ required: true, message: '请输入默认值' }],
        })(<Input placeholder="默认值" />)}
      </Form.Item>
      <Form.Item label="描述">
        {getFieldDecorator('description', { initialValue: initialValue?.description })(
          <Input.TextArea placeholder="描述" />,
        )}
      </Form.Item>
    </Modal>
  );
}

ParamModal.propTypes = {
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
  form: PropTypes.object,
  visible: PropTypes.bool,
  title: PropTypes.string,
  initialValue: PropTypes.object,
};

export default Form.create()(ParamModal);
