import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { useUpdateState } from '@/hooks';
import { getDdOpts } from '@/hooks/redash/const';
import { testConnection } from '@/service/redash';
import { Modal, Input, Form, Row, Col, InputNumber, Button, notification, Checkbox } from 'antd';

import styles from './index.less';

const formItemLayout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 14 },
};

function EditDatabaseModal(props) {
  const { onOk, onCancel, form, visible, createDatabaseLoading, itemInfo } = props;
  const { validateFieldsAndScroll, resetFields } = form;

  const [{ testConnectionLoading }, updateState] = useUpdateState({
    testConnectionLoading: false,
  });

  /** 提交 */
  const handleSubmit = useCallback(() => {
    validateFieldsAndScroll(async (errors, values) => {
      if (errors) {
        return;
      }
      await onOk(values);
    });
  }, [validateFieldsAndScroll, onOk]);

  const afterClose = useCallback(() => {
    resetFields();
  }, [resetFields]);

  const okPropsEnum = {
    okText: '确定',
    onOk: handleSubmit,
    okButtonProps: { loading: createDatabaseLoading },
  };

  const cancelPropsEnum = {
    cancelText: '取消',
    onCancel,
  };
  const testClick = useCallback(() => {
    form.validateFieldsAndScroll(async (errors, values) => {
      if (errors) {
        return;
      }
      const params = getDdOpts({
        ...values,
        type: 'mysql',
      });
      updateState({ testConnectionLoading: true });

      const result = await testConnection(params);

      updateState({ testConnectionLoading: false });

      if (result?.errorCode === 200) {
        notification.success({
          message: '连接成功',
        });
        return;
      }
      notification.error({
        message: '连接失败',
      });
    });
  }, [form, updateState]);
  return (
    <Modal
      title="编辑连接"
      width={680}
      visible={visible}
      closable={false}
      maskClosable={false}
      className={classnames('dm-modal-default', styles.modalMain)}
      {...okPropsEnum}
      {...cancelPropsEnum}
      afterClose={afterClose}
    >
      <SetConfig form={form} data={itemInfo} />
      <div className={styles.bottom}>
        {/* <Button type="danger" ghost>
          删除
        </Button> */}
        <Button type="primary" loading={testConnectionLoading} onClick={testClick}>
          测试连接
        </Button>
      </div>
    </Modal>
  );
}

EditDatabaseModal.propTypes = {
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
  form: PropTypes.object,
  visible: PropTypes.bool,
  createDatabaseLoading: PropTypes.bool,
};

export default Form.create()(EditDatabaseModal);

function SetConfig(props) {
  const { form, data } = props;
  const { getFieldDecorator } = form;
  return (
    <section className={styles.setConfig}>
      <Form.Item label="名称(Name)" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }}>
        {getFieldDecorator('name', {
          rules: [{ required: true, message: '请填写数据库名称' }],
          initialValue: data?.name,
        })(<Input placeholder="name" allowClear={true} />)}
      </Form.Item>

      <Row>
        <Col span={12}>
          <Form.Item label="域名(Host)" {...formItemLayout}>
            {getFieldDecorator('host', {
              rules: [{ required: true, message: '请填写域名' }],
              initialValue: data?.host,
            })(<Input placeholder="127.0.0.1" allowClear={true} />)}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="端口(Port)" {...formItemLayout}>
            {getFieldDecorator('port', {
              initialValue: data?.port,
            })(<InputNumber placeholder="3306" allowClear={true} />)}
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <Form.Item label="账号(User)" {...formItemLayout}>
            {getFieldDecorator('user', {
              rules: [{ required: true, message: '请填写账号' }],
              initialValue: data?.user,
            })(<Input placeholder="user" allowClear={true} />)}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="密码(Password)" {...formItemLayout}>
            {getFieldDecorator('passwd', {
              rules: [{ required: true, message: '请填写密码' }],
              initialValue: data?.passwd,
            })(<Input.Password placeholder="password" allowClear={true} />)}
          </Form.Item>
        </Col>
      </Row>

      <Form.Item label="数据库名称(Database Name)">
        {getFieldDecorator('db', {
          rules: [{ required: true, message: '请填写数据库名称' }],
          initialValue: data?.db,
        })(<Input placeholder="Database Name" allowClear={true} />)}
      </Form.Item>

      <Form.Item label="私钥文件（SSL）的路径(Path to private key file (SSL))">
        {getFieldDecorator('ssl_key', {
          initialValue: data?.ssl_key,
        })(<Input placeholder="Path to private key file (SSL)" allowClear={true} />)}
      </Form.Item>
      <Form.Item label="客户端证书文件（SSL）的路径(Path to client certificate file (SSL))">
        {getFieldDecorator('ssl_cert', {
          initialValue: data?.ssl_cert,
        })(<Input placeholder="Path to client certificate file (SSL)" allowClear={true} />)}
      </Form.Item>
      <Form.Item label="CA证书文件的路径(Path to CA certificate file to verify peer against (SSL))">
        {getFieldDecorator('ssl_cacert', {
          initialValue: data?.ssl_cacert,
        })(
          <Input
            placeholder="Path to CA certificate file to verify peer against (SSL)"
            allowClear={true}
          />,
        )}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator('use_ssl', {
          initialValue: data?.use_ssl ?? false,
          valuePropName: 'checked',
        })(<Checkbox>使用SSL(Use SSL)</Checkbox>)}
      </Form.Item>
    </section>
  );
}

SetConfig.propTypes = {
  form: PropTypes.object,
  selectedDatabase: PropTypes.object,
};
