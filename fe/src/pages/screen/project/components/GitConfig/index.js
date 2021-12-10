import React, { useState, useEffect } from 'react';
import { Form, message, Input } from 'antd';

import { updateTag, fetchTagDetail } from '@/service/tag';
import ModalWrapFooter from '@/components/ModalWrapFooter';

// import styles from './index.less';

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

const GitConfig = ({
  tagId,
  getProjectPageList,
  onCancel,
  form,
  form: { getFieldDecorator, getFieldsValue, validateFields, setFieldsValue },
}) => {
  const [okLoading, setOkLoading] = useState(false);
  const [defPage, setDefPage] = useState({});
  console.log(defPage, '======defPage');
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

        console.log(values, '===va');
        const params = {
          id: tagId,
          gitConfig: JSON.stringify(values),
        };
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
        <Form.Item label="仓库地址">
          {getFieldDecorator('url', {
            initialValue: defPage?.gitConfig?.url,
          })(<Input placeholder="请填写仓库地址" />)}
        </Form.Item>
        <Form.Item label="git分支">
          {getFieldDecorator('branch', {
            initialValue: defPage?.gitConfig?.branch,
          })(<Input placeholder="请填写推送的分支(如: feature/tag)" />)}
        </Form.Item>
        {/* <Form.Item label="替换的目录">
          {getFieldDecorator('gitPath', {
            rules: [
              {
                required: true,
                message: '请填写打包替换目录',
              },
            ],
            initialValue: defPage?.gitConfig?.gitPath,
          })(<Input placeholder="请填写打包替换目录(如: dist)" />)}
        </Form.Item> */}
      </Form>
    </ModalWrapFooter>
  );
};

export default Form.create()(GitConfig);
