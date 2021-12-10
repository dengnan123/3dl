import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Form, Modal, Input } from 'antd';
import { InputColor } from '@/components/index';

const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 16 },
};

function ProjectModal(props) {
  const { handleOk, handleCancel, visible, form, currentInfo, isEdit, okButtonLoading } = props;
  const { getFieldDecorator, validateFieldsAndScroll, resetFields } = form;

  const onOk = useCallback(() => {
    validateFieldsAndScroll((errors, values) => {
      if (!errors) {
        handleOk(values);
      }
    });
  }, [validateFieldsAndScroll, handleOk]);

  const onCancel = useCallback(() => {
    handleCancel();
  }, [handleCancel]);

  const afterClose = useCallback(() => {
    resetFields();
  }, [resetFields]);

  return (
    <Modal
      className="dm-modal-default"
      width={700}
      title={!isEdit ? '添加' : '编辑'}
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      afterClose={afterClose}
      okButtonProps={{ loading: okButtonLoading }}
      maskClosable={false}
    >
      <Form {...formItemLayout}>
        <Form.Item label="名称">
          {getFieldDecorator('name', {
            initialValue: currentInfo?.name,
            rules: [
              {
                required: true,
                message: '请输入项目名',
              },
            ],
          })(<Input placeholder="请输入项目名" />)}
        </Form.Item>
        <Form.Item label="所属颜色">
          {getFieldDecorator('color', {
            initialValue: currentInfo?.color,
            rules: [
              {
                required: true,
                message: '请选择项目所属颜色',
              },
            ],
          })(<InputColor />)}
        </Form.Item>
      </Form>
    </Modal>
  );
}

ProjectModal.propTypes = {
  handleOk: PropTypes.func,
  handleCancel: PropTypes.func,
  visible: PropTypes.bool,
  isEdit: PropTypes.bool,
  okButtonLoading: PropTypes.bool,
  currentInfo: PropTypes.object,
};

export default Form.create()(ProjectModal);
