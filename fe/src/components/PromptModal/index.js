import { Modal, Input } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'

const { TextArea } = Input

class PromptModal extends React.Component {
  state = {
    value: ''
  }
  render() {
    const { visible, title = '提示', handleOk, handleCancel, message, confirmLoading, noMessage } = this.props
    const _handleOk = () => {
      handleOk(this.state.value)
      this.setState({
        value: ''
      })
    }
    const _onCancel = () => {
      this.setState({
        value: ''
      })
      handleCancel()
    }
    return (
      <div>
        <Modal
          title={title}
          visible={visible}
          onOk={_handleOk}
          onCancel={_onCancel}
          confirmLoading={confirmLoading}
          destroyOnClose={true}
          className="dm-tip-modal"
        >
          {noMessage ? (
            <TextArea
              value={this.state.value}
              onChange={e => {
                this.setState({
                  value: e.target.value
                })
              }}
            />
          ) : (
            <p style={{ fontSize: 16, marginBottom: 0 }}>{message}</p>
          )}
        </Modal>
      </div>
    )
  }
}
PromptModal.propTypes = {
  title: PropTypes.string,
  handleOk: PropTypes.func,
  handleCancel: PropTypes.func,
  visible: PropTypes.bool,
  message: PropTypes.string,
  confirmLoading: PropTypes.bool,
  noMessage: PropTypes.bool
}

export default PromptModal
