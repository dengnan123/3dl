import React, { Fragment, useCallback } from 'react';
import { Form, Input, Modal, InputNumber, Select } from 'antd';
import UploadImg from '../UploadImg';
import { API_HOST } from '@/config';

const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 16 },
};

const { TextArea } = Input;

function AddPagesModal(props) {
  const {
    form: { getFieldDecorator, validateFields, resetFields },
    addVisible,
    handleCancel,
    handleOk,
    submitLoading,
    isUseTemp,
    isEdit,
    currentInfo,
    creatPageByTempLoading,
    projectList,
  } = props;

  const onOk = () => {
    validateFields((errors, values) => {
      if (!errors) {
        handleOk(values);
      }
    });
  };

  const afterClose = useCallback(() => {
    resetFields();
  }, [resetFields]);

  const uploadPagePicProps = {
    API_HOST,
    pageId: currentInfo?.id,
    action: `${API_HOST}/page/upload`,
    data: {
      id: currentInfo?.id,
      saveKey: 'pageCoverImg',
      fileType: 'pic',
    },
  };

  return (
    <Modal
      className="dm-modal-default"
      width={700}
      title={!isEdit ? '添加' : '编辑'}
      okButtonProps={{ loading: submitLoading || creatPageByTempLoading }}
      visible={addVisible}
      onOk={onOk}
      onCancel={handleCancel}
      afterClose={afterClose}
      maskClosable={false}
    >
      <Form>
        <Form.Item {...formItemLayout} label="大屏名称">
          {getFieldDecorator('name', {
            initialValue: currentInfo?.name,
            rules: [
              {
                required: true,
                message: '请输入大屏名称',
              },
            ],
          })(<Input placeholder="请输入大屏名称" />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="页面布局类型">
          {getFieldDecorator('layoutType', {
            initialValue: currentInfo?.layoutType || 'normal',
            rules: [
              {
                required: true,
                message: '请选择布局类型',
              },
            ],
          })(
            <Select placeholder="页面布局类型" disabled={currentInfo?.layoutType}>
              <Select.Option value="normal">自由布局</Select.Option>
              <Select.Option value="grid">栅格布局</Select.Option>
            </Select>,
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="所属项目">
          {getFieldDecorator('tagId', {
            initialValue: currentInfo?.tagId || undefined,
            rules: [
              {
                required: true,
                message: '请选择所属项目',
              },
            ],
          })(
            <Select placeholder="请选择所属项目">
              {(projectList || []).map(n => {
                return (
                  <Select.Option key={n.id} value={n.id}>
                    {n.name}
                  </Select.Option>
                );
              })}
            </Select>,
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="简介">
          {getFieldDecorator('description', {
            initialValue: currentInfo?.description,
            rules: [
              {
                required: true,
                message: '请输入大屏简介',
              },
            ],
          })(<TextArea placeholder="请输入大屏简介" />)}
        </Form.Item>

        {isUseTemp ? null : (
          <Fragment>
            <Form.Item {...formItemLayout} label="屏宽">
              {getFieldDecorator('pageWidth', {
                initialValue: currentInfo?.pageWidth || 1920,
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
                initialValue: currentInfo?.pageHeight || 1080,
                rules: [
                  {
                    required: true,
                    message: '请输入屏高',
                  },
                ],
              })(<InputNumber placeholder="请输入屏高" />)}
            </Form.Item>
            {currentInfo?.id && (
              <Form.Item label="上传封面" {...formItemLayout}>
                {getFieldDecorator('pageCoverImg', {
                  initialValue: currentInfo?.pageCoverImg,
                })(<UploadImg {...uploadPagePicProps} />)}
              </Form.Item>
            )}
          </Fragment>
        )}
      </Form>
    </Modal>
  );
}

export default Form.create()(AddPagesModal);
