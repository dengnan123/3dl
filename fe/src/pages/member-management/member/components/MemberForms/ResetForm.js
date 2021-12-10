import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button } from 'antd';

import styles from './index.less';

function ResetForm(props) {
  const { form, item, onClose, onSubmit, submitLoading } = props;
  const { getFieldDecorator, validateFields } = form;
  const onFormSave = () => {
    validateFields((errors, values) => {
      if (!errors) {
        onSubmit && onSubmit({ ...values, id: item.id });
      }
    });
  };

  return (
    <React.Fragment>
      <Form className={styles.formMain}>
        <Form.Item label="Email" className={styles.checkboxItem}>
          <span className={styles.emailValue}>{item.email || '--'}</span>
        </Form.Item>
        <Form.Item label="新密码">
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: '请输入新密码!',
              },
            ],
          })(<Input.Password placeholder="请输入新密码" />)}
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

ResetForm.propTypes = {
  form: PropTypes.object,
  item: PropTypes.object,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  submitLoading: PropTypes.bool,
};

export default Form.create()(ResetForm);
