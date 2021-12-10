import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button } from 'antd';

import styles from './index.less';

function AddForm(props) {
  const { form, item, onClose, onSubmit, submitLoading } = props;
  const { getFieldDecorator, validateFields } = form;
  const { id, name } = item || {};

  const onFormSave = () => {
    validateFields((errors, values) => {
      if (!errors) {
        onSubmit && onSubmit({ ...values });
      }
    });
  };

  return (
    <React.Fragment>
      <Form className={styles.formMain}>
        {id && (
          <Form.Item label="ID">
            {getFieldDecorator('id')(<span style={{ lineHeight: '32px' }}>{id}</span>)}
          </Form.Item>
        )}
        <Form.Item label="标签名">
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: '请输入标签名!',
              },
            ],
            initialValue: name || null,
          })(<Input placeholder="请输入标签名" />)}
        </Form.Item>
      </Form>
      <div className={styles.formBtns}>
        <Button type="default" onClick={onClose}>
          取消
        </Button>
        <Button type="primary" onClick={onFormSave} loading={submitLoading}>
          保存
        </Button>
      </div>
    </React.Fragment>
  );
}

AddForm.propTypes = {
  form: PropTypes.object,
  item: PropTypes.object,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  submitLoading: PropTypes.bool,
};

export default Form.create()(AddForm);
