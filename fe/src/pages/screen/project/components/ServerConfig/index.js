import React, { useState, useEffect } from 'react';
import { Form, message, Input, InputNumber } from 'antd';

import { updateTag, fetchTagDetail } from '@/service/tag';
import ModalWrapFooter from '@/components/ModalWrapFooter';

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

const ServerConfig = ({
  tagId,
  onCancel,
  form,
  form: { getFieldDecorator, getFieldsValue, validateFields, setFieldsValue },
}) => {
  const [okLoading, setOkLoading] = useState(false);
  const [defPage, setDefPage] = useState({});

  useEffect(() => {
    if (!tagId) return;
    fetchTagDetail({ id: tagId }).then(res => {
      setDefPage(res?.data);
    });
  }, [tagId]);

  const wrapProps = {
    onCancel,
    onOk() {
      validateFields(async (errors, values) => {
        if (errors) return;

        const params = {
          id: tagId,
          serverConfig: JSON.stringify(values),
        };
        console.log(params, '===params');
        setOkLoading(true);
        const updateRes = await updateTag(params);
        setOkLoading(false);
        if (updateRes?.errorCode !== 200) {
          message.error('设置失败');
          return;
        }
        message.success('设置成功');
        onCancel && onCancel();
      });
    },
    loading: okLoading,
  };

  return (
    <ModalWrapFooter {...wrapProps}>
      <Form {...formItemLayout}>
        <Form.Item label="服务器域名">
          {getFieldDecorator('host', {
            initialValue: defPage?.serverConfig?.host,
            rules: [{ required: true, message: '请填写服务器域名' }],
          })(<Input placeholder="请填写服务器域名" />)}
        </Form.Item>
        <Form.Item label="端口号">
          {getFieldDecorator('port', {
            initialValue: defPage?.serverConfig?.port ?? 22,
            rules: [{ required: true, message: '请填写端口号' }],
          })(<InputNumber placeholder="请填写端口号" />)}
        </Form.Item>
        <Form.Item label="用户名">
          {getFieldDecorator('username', {
            initialValue: defPage?.serverConfig?.username,
            rules: [{ required: true, message: '请填写用户名' }],
          })(<Input placeholder="请填写用户名" />)}
        </Form.Item>
        <Form.Item label="密码">
          {getFieldDecorator('password', {
            initialValue: defPage?.serverConfig?.password,
            rules: [{ required: true, message: '请填写密码' }],
          })(<Input.Password placeholder="请填写密码" />)}
        </Form.Item>
        <Form.Item label="文件上传路径">
          {getFieldDecorator('path', {
            initialValue: defPage?.serverConfig?.path,
            rules: [{ required: true, message: '请填写文件上传路径' }],
          })(<Input placeholder="请填写文件上传路径" />)}
        </Form.Item>
      </Form>
    </ModalWrapFooter>
  );
};

export default Form.create()(ServerConfig);
