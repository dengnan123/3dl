import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button } from 'antd';

import styles from './index.less';

function CompForm(props) {
  const { form, handleCancel, onSubmit, submitLoading } = props;
  const { getFieldDecorator, validateFields } = form;
  const onFormSave = () => {
    validateFields((errors, values) => {
      if (!errors) {
        onSubmit && onSubmit(values);
      }
    });
  };
  return (
    <React.Fragment>
      <Form className={styles.formMain}>
        <Form.Item label={'名称'}>
          {getFieldDecorator('pluginName', {
            rules: [
              {
                whitespace: true,
                required: true,
                message: '请输入组件显示名称!',
              },
            ],
            initialValue: null,
          })(<Input placeholder={'请输入组件显示名称'} />)}
        </Form.Item>
        <Form.Item label={'Key'}>
          {getFieldDecorator('pluginKey', {
            rules: [
              {
                whitespace: true,
                required: true,
                message: '请输入组件的Key!',
              },
            ],
            initialValue: null,
          })(<Input placeholder={'请输入组件的Key'} />)}
        </Form.Item>
      </Form>
      <div className={styles.formBtns}>
        <Button type="default" onClick={handleCancel}>
          取消
        </Button>
        <Button type="primary" onClick={onFormSave} loading={submitLoading}>
          保存
        </Button>
      </div>
    </React.Fragment>
  );
}

CompForm.propTypes = {
  form: PropTypes.object,
  loading: PropTypes.object,
  submitLoading: PropTypes.bool,
  handleCancel: PropTypes.func,
  onSubmit: PropTypes.func,
};

export default Form.create()(CompForm);
