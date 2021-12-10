import { useCallback, useMemo } from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { reap } from '@/components/SafeReaper';
import { defaultEnvList, defaultEnvConfig } from '../../const';

import { Input, Form, Modal, Row, Col, Button, Icon, Tooltip } from 'antd';

import styles from './index.less';

const namespace_startsh = 'startsh';

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

function StartShModal(props) {
  const { addStartSh, updateStartSh, setVisible, form, submitLoading, visible, activeData } = props;
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
  const initialData = useMemo(() => {
    return activeData || {};
  }, [activeData]);
  const json = reap(initialData, 'json', defaultEnvList);

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
      const { json } = values;
      const obj = {};
      // 是否有重复的key值
      let hasRepeat = false;
      if (errors) {
        return;
      }
      json.map((n, index) => {
        if (obj[n.key] === n.key) {
          hasRepeat = true;
          setFields({
            [`json[${index}].key`]: { value: n.key, errors: [new Error('key值重复')] },
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
        addStartSh(values).then(success => {
          if (success) {
            setVisible(false);
          }
        });
        return;
      }
      updateStartSh({ ...initialData, ...values }).then(success => {
        if (success) {
          setVisible(false);
        }
      });
    });
  }, [
    validateFieldsAndScroll,
    isEdit,
    initialData,
    updateStartSh,
    setFields,
    addStartSh,
    setVisible,
  ]);

  getFieldDecorator('keys', { initialValue: json });

  const initialKeys = getFieldValue('keys');

  return (
    <Modal
      visible={visible}
      title={!isEdit ? '添加启动脚本变量' : '编辑启动脚本变量'}
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
            label={
              <span>
                变量列表
                <Tooltip title="自定义key必须以 DP_ 开头">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            }
            labelCol={{ xs: { span: 24 }, sm: { span: 24 } }}
            wrapperCol={{ xs: { span: 0 }, sm: { span: 0 } }}
          />
        </Col>
        <Col span={21} style={{ lineHeight: '39px' }}>
          {initialKeys.map((n, index) => {
            const { key, value } = n;
            const defaultConfig = defaultEnvConfig[key];
            const { isRequired, label } = defaultConfig || {};
            const isDefault = Boolean(defaultConfig);
            const valueRequired = isDefault ? isRequired : true;
            const itemLayout = configFormItemLayout;
            return (
              <Row key={index}>
                <Col span={8}>
                  <Form.Item {...itemLayout} colon={false} extra={isDefault ? label : undefined}>
                    {getFieldDecorator(`json[${index}].key`, {
                      initialValue: key,
                      rules: [{ required: true, message: '请填写变量key值' }],
                      getValueFromEvent: e => {
                        let value = e.target.value.trim();
                        if (value && !value.startsWith('DP_')) {
                          value = `DP_${value}`;
                        }
                        return value;
                      },
                    })(<Input disabled={isDefault} placeholder="请填写变量key值" />)}
                  </Form.Item>
                </Col>
                <Col span={1} style={{ textAlign: 'center' }}>
                  ：
                </Col>
                <Col span={14}>
                  <Form.Item {...configFormItemLayout}>
                    {getFieldDecorator(`json[${index}].value`, {
                      initialValue: value,
                      rules: [{ required: valueRequired, message: '请填写变量value值' }],
                      getValueFromEvent: e => e.target.value.trim(),
                    })(<Input placeholder="请填写变量value值" />)}
                  </Form.Item>
                </Col>
                <Col style={{ textAlign: 'center' }} span={1}>
                  {initialKeys.length > 1 && !isDefault && (
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

StartShModal.propTypes = {
  updateState: PropTypes.func,
  addStartSh: PropTypes.func,
  updateStartSh: PropTypes.func,
  setVisible: PropTypes.func,
  form: PropTypes.object,
  submitLoading: PropTypes.bool,
  activeData: PropTypes.object,
  visible: PropTypes.bool,
};

const mapStateToProps = ({ loading, startsh }) => ({
  submitLoading:
    loading.effects[`${namespace_startsh}/addStartSh`] ||
    loading.effects[`${namespace_startsh}/updateStartSh`],
});

const mapDispatchToProps = dispatch => ({
  updateState: payload => dispatch({ type: `${namespace_startsh}/updateState`, payload }),
  addStartSh: payload => dispatch({ type: `${namespace_startsh}/addStartSh`, payload }),
  updateStartSh: payload => dispatch({ type: `${namespace_startsh}/updateStartSh`, payload }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(StartShModal));
