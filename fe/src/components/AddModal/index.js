import React from 'react'
import { Form, Modal } from 'antd'
import RenderFormItem from '../RenderFormItem'
import PropTypes from 'prop-types'

function AddModal(props) {
  const {
    form: { getFieldDecorator, validateFields },
    formFileds,
    visible,
    handleCancel,
    handleOk,
    submitLoading,
    modalTitle,
    expendForm,
    maskClosable = false
  } = props

  const onOk = () => {
    validateFields((errors, values) => {
      if (!errors) {
        handleOk(values)
      }
    })
  }
  const renderFormProps = {
    formFileds,
    getFieldDecorator
  }
  return (
    <Modal
      title={modalTitle}
      confirmLoading={submitLoading}
      visible={visible}
      width={740}
      onOk={onOk}
      onCancel={handleCancel}
      destroyOnClose={true}
      className="dm-modal"
      maskClosable={maskClosable}
    >
      <Form>
        <RenderFormItem {...renderFormProps} />
        {expendForm}
      </Form>
    </Modal>
  )
}

AddModal.propTypes = {
  form: PropTypes.object,
  handleCancel: PropTypes.func,
  handleOk: PropTypes.func,
  submitLoading: PropTypes.bool,
  visible: PropTypes.bool,
  formFileds: PropTypes.object,
  modalTitle: PropTypes.string,
  expendForm: PropTypes.any,
  maskClosable: PropTypes.bool
}

export default AddModal
