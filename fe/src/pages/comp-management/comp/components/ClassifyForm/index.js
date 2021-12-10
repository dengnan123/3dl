import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button } from 'antd';

import styles from './index.less';

function ClassifyForm(props) {
  const { form, item, handleCancel, onSubmit, submitLoading } = props;
  const { getFieldDecorator, validateFields } = form;
  const { id, name } = item || {};
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
        {id && (
          <Form.Item label={'ID'} className={styles.idItem}>
            {getFieldDecorator('id', {
              initialValue: id || null,
            })(<span>{id}</span>)}
          </Form.Item>
        )}

        <Form.Item label={'名称'}>
          {getFieldDecorator('name', {
            rules: [
              {
                whitespace: true,
                required: true,
                message: '请输入分类名称!',
              },
            ],
            initialValue: name || null,
          })(<Input placeholder={'请输入分类名称'} />)}
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

ClassifyForm.propTypes = {
  form: PropTypes.object,
  loading: PropTypes.object,
  item: PropTypes.object,
  submitLoading: PropTypes.bool,
  handleCancel: PropTypes.func,
  onSubmit: PropTypes.func,
};

export default Form.create()(ClassifyForm);
