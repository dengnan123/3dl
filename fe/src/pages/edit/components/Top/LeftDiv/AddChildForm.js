import React, { useCallback } from 'react';
import { Form, Input, InputNumber, Button } from 'antd';

import styles from './index.less';

const { TextArea } = Input;

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

const AddChildForm = props => {
  const {
    form: { getFieldDecorator, validateFields },
    onCancel,
    onOk,
  } = props;

  const onSubmitConfirm = useCallback(() => {
    validateFields((errors, values) => {
      if (errors) {
        return;
      }
      onOk && onOk(values);
    });
  }, [validateFields, onOk]);

  return (
    <>
      <Form>
        <Form.Item {...formItemLayout} label="名称">
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: '请输入子页面名称',
              },
            ],
          })(<Input placeholder="请输入子页面名称" />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="简介">
          {getFieldDecorator('description', {
            initialValue: null,
            rules: [
              {
                required: true,
                message: '请输入页面简介',
              },
            ],
          })(<TextArea placeholder="请输入页面简介" autoSize={{ minRows: 4, maxRows: 4 }} />)}
        </Form.Item>

        <Form.Item {...formItemLayout} label="屏宽">
          {getFieldDecorator('pageWidth', {
            initialValue: 1920,
            rules: [
              {
                required: true,
                message: '请输入屏宽',
              },
            ],
          })(<InputNumber placeholder="请输入屏宽" />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="屏高">
          {getFieldDecorator('pageHeight', {
            initialValue: 1080,
            rules: [
              {
                required: true,
                message: '请输入屏高',
              },
            ],
          })(<InputNumber placeholder="请输入屏高" />)}
        </Form.Item>
      </Form>
      <div className={styles.footerDiv}>
        <Button type="defult" onClick={onCancel}>
          取消
        </Button>
        <Button type="primary" onClick={onSubmitConfirm}>
          添加
        </Button>
      </div>
    </>
  );
};

export default Form.create()(AddChildForm);
