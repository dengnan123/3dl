import { useCallback } from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { reap } from '@/components/SafeReaper';

import { Input, Form, Modal, Row, Col, Button, Icon } from 'antd';

import styles from './index.less';

const namespace_env_config = 'envConfig';

const formItemLayout = {
  labelCol: {
    xs: { span: 3 },
    sm: { span: 3 },
  },
  wrapperCol: {
    xs: { span: 21 },
    sm: { span: 21 },
  },
};

const configFormItemLayout = {
  labelCol: {
    xs: { span: 0 },
    sm: { span: 0 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
  },
};

function ReplaceJsonConfigModal(props) {
  const {
    addReplaceConfig,
    updateReplaceConfig,
    setVisible,
    form,
    submitLoading,
    visible,
    activeData,
  } = props;
  const {
    getFieldDecorator,
    resetFields,
    setFields,
    getFieldValue,
    setFieldsValue,
    validateFieldsAndScroll,
  } = form;
  const isEdit = Boolean(activeData);
  // 默认值
  const initialData = activeData || {};
  const replaceJson = reap(initialData, 'replaceJson', [{ key: undefined, value: undefined }]);

  // 添加配置项
  const handleAdd = useCallback(() => {
    const keys = getFieldValue('keys') || [];
    keys.push({ key: undefined, value: undefined });
    setFieldsValue({ keys });
  }, [getFieldValue, setFieldsValue]);

  // 删除配置项
  const handleRemove = useCallback(
    index => {
      const keys = (getFieldValue('keys') || []).filter((n, i) => i !== index);
      setFieldsValue({ keys });
    },
    [getFieldValue, setFieldsValue],
  );

  const handleCancel = useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  const handleAfterClose = useCallback(() => {
    resetFields();
  }, [resetFields]);

  const handleOk = useCallback(() => {
    validateFieldsAndScroll((errors, values) => {
      const { replaceJson } = values;
      const obj = {};
      // 是否有重复的key值
      let hasRepeat = false;
      if (errors) {
        return;
      }
      replaceJson.map((n, index) => {
        if (obj[n.key] === n.key) {
          hasRepeat = true;
          setFields({
            [`replaceJson[${index}].key`]: { value: n.key, errors: [new Error('key值重复')] },
          });
        }
        obj[n.key] = n.key;
        return n;
      });
      if (hasRepeat) {
        return;
      }
      delete values['keys'];
      if (!isEdit) {
        console.log('values', values);
        addReplaceConfig(values).then(success => {
          if (success) {
            setVisible(false);
          }
        });
        return;
      }
      updateReplaceConfig({ ...initialData, ...values }).then(success => {
        if (success) {
          setVisible(false);
        }
      });
    });
  }, [
    validateFieldsAndScroll,
    isEdit,
    initialData,
    updateReplaceConfig,
    setFields,
    addReplaceConfig,
    setVisible,
  ]);

  getFieldDecorator('keys', { initialValue: replaceJson });

  const initialKeys = getFieldValue('keys');

  return (
    <Modal
      visible={visible}
      title={!isEdit ? '添加环境变量配置' : '编辑环境变量配置'}
      width={960}
      centered={true}
      maskClosable={false}
      className={classnames(styles.modal, 'dm-modal-default')}
      okText="确定"
      cancelText="取消"
      onCancel={handleCancel}
      onOk={handleOk}
      okButtonProps={{ loading: submitLoading }}
      afterClose={handleAfterClose}
    >
      <Form.Item label="标题" {...formItemLayout}>
        {getFieldDecorator('name', {
          initialValue: initialData.name,
          rules: [{ required: true, message: '请填写标题' }],
          getValueFromEvent: e => e.target.value.trim(),
        })(<Input placeholder="请填写标题" />)}
      </Form.Item>

      <Row>
        <Col span={3}>
          <Form.Item
            label="环境变量列表"
            labelCol={{ xs: { span: 24 }, sm: { span: 24 } }}
            wrapperCol={{ xs: { span: 0 }, sm: { span: 0 } }}
          />
        </Col>
        <Col span={21} style={{ lineHeight: '39px' }}>
          {initialKeys.map((n, index) => {
            return (
              <Row key={index}>
                <Col span={10}>
                  <Form.Item {...configFormItemLayout}>
                    {getFieldDecorator(`replaceJson[${index}].key`, {
                      initialValue: n.key,
                      rules: [{ required: true, message: '请填写需要替换的key值' }],
                      getValueFromEvent: e => e.target.value.trim(),
                    })(<Input placeholder="请填写需要替换的key值" />)}
                  </Form.Item>
                </Col>
                <Col span={3} style={{ textAlign: 'center' }}>
                  替换为
                </Col>
                <Col span={10}>
                  <Form.Item {...configFormItemLayout}>
                    {getFieldDecorator(`replaceJson[${index}].value`, {
                      initialValue: n.value,
                      rules: [{ required: true, message: '请填写需要替换的value值' }],
                      getValueFromEvent: e => e.target.value.trim(),
                    })(<Input placeholder="请填写需要替换的value值" />)}
                  </Form.Item>
                </Col>
                <Col style={{ textAlign: 'center' }} span={1}>
                  {initialKeys.length > 1 && (
                    <Icon
                      className={styles.delete}
                      type="minus-circle"
                      onClick={() => handleRemove(index)}
                    />
                  )}
                </Col>
              </Row>
            );
          })}
          <Button block={true} onClick={handleAdd}>
            添加
          </Button>
        </Col>
      </Row>
    </Modal>
  );
}

ReplaceJsonConfigModal.propTypes = {
  updateState: PropTypes.func,
  addReplaceConfig: PropTypes.func,
  updateReplaceConfig: PropTypes.func,
  setVisible: PropTypes.func,
  form: PropTypes.object,
  submitLoading: PropTypes.bool,
  activeData: PropTypes.object,
  visible: PropTypes.bool,
};

const mapStateToProps = ({ loading, envConfig }) => ({
  submitLoading:
    loading.effects[`${namespace_env_config}/addReplaceConfig`] ||
    loading.effects[`${namespace_env_config}/updateReplaceConfig`],
});

const mapDispatchToProps = dispatch => ({
  updateState: payload => dispatch({ type: `${namespace_env_config}/updateState`, payload }),
  addReplaceConfig: payload =>
    dispatch({ type: `${namespace_env_config}/addReplaceConfig`, payload }),
  updateReplaceConfig: payload =>
    dispatch({ type: `${namespace_env_config}/updateReplaceConfig`, payload }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(ReplaceJsonConfigModal));
