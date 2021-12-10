import React, { useCallback, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { useUpdateState } from '@/hooks';
import { getDdOpts } from '@/hooks/redash/const';
import { testConnection } from '@/service/redash';
import {
  Modal,
  Steps,
  Input,
  Empty,
  Form,
  InputNumber,
  Checkbox,
  Icon,
  Row,
  Col,
  Button,
  notification,
} from 'antd';
import { MysqlSvg } from '../../assets/index';

import styles from './index.less';

const { Step } = Steps;
const { Search } = Input;

const formItemLayout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 14 },
};

const DatabaseList = [{ name: 'Mysql', value: 'mysql', icon: <MysqlSvg /> }];

/**
 * 步骤类型
 * @enum
 */
const StepTypeEnum = {
  /** 选择数据类型 */
  ChooseType: 0,
  /** 配置数据库 */
  SetConfig: 1,
  /** 完成 */
  Finish: 2,
};

function CreateDatabaseModal(props) {
  const { onOk, onCancel, form, visible, createDatabaseLoading } = props;
  const { validateFieldsAndScroll, resetFields } = form;

  const [{ selectedDatabase, currentStep, testConnectionLoading }, updateState] = useUpdateState({
    selectedDatabase: null,
    currentStep: StepTypeEnum.ChooseType,
    testConnectionLoading: false,
  });

  // 步骤一选择数据库类型
  const handleSelectDatabase = useCallback(
    current => {
      const active = current?.value === selectedDatabase?.value;
      active && resetFields();
      updateState({ selectedDatabase: current, currentStep: StepTypeEnum.SetConfig });
    },
    [selectedDatabase, updateState, resetFields],
  );

  const handleStepBack = useCallback(() => {
    updateState({ currentStep: StepTypeEnum.ChooseType });
  }, [updateState]);

  /** 创建 */
  const handleCreate = useCallback(() => {
    validateFieldsAndScroll(async (errors, values) => {
      if (errors) {
        return;
      }
      updateState({ currentStep: StepTypeEnum.Finish });

      const success = await onOk(values);
      if (!success) {
        updateState({ currentStep: StepTypeEnum.SetConfig });
      }
    });
  }, [validateFieldsAndScroll, updateState, onOk]);

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

  const afterClose = useCallback(() => {
    resetFields();
    updateState({
      selectedDatabase: null,
      currentStep: StepTypeEnum.ChooseType,
    });
  }, [resetFields, updateState]);

  const okPropsEnum = {
    [StepTypeEnum.ChooseType]: { okText: '确定', okButtonProps: { disabled: true } },
    [StepTypeEnum.SetConfig]: {
      okText: '确定',
      onOk: handleCreate,
    },
    [StepTypeEnum.Finish]: {
      okText: '确定',
      okButtonProps: { disabled: true, loading: createDatabaseLoading },
      onOk: handleCreate,
    },
  };

  const cancelPropsEnum = {
    [StepTypeEnum.ChooseType]: { cancelText: '取消', onCancel },
    [StepTypeEnum.SetConfig]: {
      cancelText: '上一步',
      onCancel: handleStepBack,
    },
    [StepTypeEnum.Finish]: { cancelText: '上一步', cancelButtonProps: { disabled: true } },
  };

  return (
    <Modal
      title="新建连接"
      width={680}
      visible={visible}
      closable={false}
      maskClosable={false}
      className={classnames('dm-modal-default', styles.modal)}
      {...okPropsEnum[currentStep]}
      {...cancelPropsEnum[currentStep]}
      afterClose={afterClose}
      confirmLoading={createDatabaseLoading}
    >
      <span className={styles.close} onClick={onCancel}>
        <Icon type="close" />
      </span>
      <Steps current={currentStep} size="small" className={styles.steps}>
        <Step
          title="选择类型"
          onClick={() => updateState({ currentStep: StepTypeEnum.ChooseType })}
        />
        <Step title="配置" />
        <Step title="完成" />
      </Steps>
      {currentStep === StepTypeEnum.ChooseType ? (
        <ChooseDatabase onSelect={handleSelectDatabase} />
      ) : (
        <>
          <SetConfig form={form} selectedDatabase={selectedDatabase} />
          <span className={styles.btns}>
            <Button type="primary" loading={testConnectionLoading} onClick={testClick}>
              测试连接
            </Button>
          </span>
        </>
      )}
    </Modal>
  );
}

CreateDatabaseModal.propTypes = {
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
  form: PropTypes.object,
  visible: PropTypes.bool,
  createDatabaseLoading: PropTypes.bool,
};

export default Form.create()(CreateDatabaseModal);

function ChooseDatabase(props) {
  const { onSelect } = props;
  const [keyword, setKeyword] = useState();

  const handleSearchChange = useCallback(e => {
    const v = e.target.value;
    setKeyword(v);
  }, []);

  const finalDataSource = useMemo(() => {
    return (
      DatabaseList.filter(n => `${n.name}${n.value}`.toLocaleLowerCase().includes(keyword ?? '')) ||
      []
    );
  }, [keyword]);

  return (
    <section className={styles.chooseDatabase}>
      <Search placeholder="搜索" value={keyword} onChange={handleSearchChange} />
      {!!finalDataSource?.length ? (
        <ul className={styles.list}>
          {finalDataSource.map(n => {
            return (
              <li key={n.value} onClick={() => onSelect && onSelect(n)}>
                <i className={styles.icon}>{n.icon}</i>
                {n.name}
              </li>
            );
          })}
        </ul>
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </section>
  );
}

ChooseDatabase.propTypes = {
  onSelect: PropTypes.func,
};

function SetConfig(props) {
  const { form, selectedDatabase, data } = props;
  const { getFieldDecorator } = form;

  return (
    <section className={styles.setConfig}>
      <h3 className={styles.title}>
        {selectedDatabase?.icon}
        {selectedDatabase?.name}
      </h3>
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
