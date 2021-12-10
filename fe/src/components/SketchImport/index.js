import React from 'react';
import { message, Form, InputNumber } from 'antd';
import { API_HOST } from '@/config';
import UploadFile from '@/components/UploadFile';

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

const SketchImport = ({
  updateState,
  fetchPageUseCompList,
  pageId,
  form: { getFieldDecorator, getFieldValue },
}) => {
  // form.getFieldValue('password')
  const beforeUpload = file => {
    const isLt2M = file.size / 1024 / 1024 < 50;
    if (!isLt2M) {
      message.error('Image must smaller than 20MB!');
    }
    return isLt2M;
  };
  const uploadFile = {
    data: {
      id: pageId,
      left: getFieldValue('left') || 0,
      top: getFieldValue('top') || 0,
    },
    beforeUpload,
    action: `${API_HOST}/page/upload/sketch`,
    onChange(res) {
      //收起modal
      updateState({
        modalVisible: false,
        modalType: null,
      });
      if (res) {
        // 上传成功，获取最新的组件列表
        fetchPageUseCompList({
          pageId,
        });
      }
    },
  };
  return (
    <div>
      <Form.Item label="left" {...formItemLayout}>
        {getFieldDecorator('left', {
          initialValue: 0,
        })(<InputNumber></InputNumber>)}
      </Form.Item>
      <Form.Item label="top" {...formItemLayout}>
        {getFieldDecorator('top', {
          initialValue: 0,
        })(<InputNumber></InputNumber>)}
      </Form.Item>
      {/* <Divider></Divider> */}
      <UploadFile {...uploadFile}></UploadFile>
    </div>
  );
};

export default Form.create()(SketchImport);
