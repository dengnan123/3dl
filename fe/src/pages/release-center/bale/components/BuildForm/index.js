import React, { useCallback, useState, useMemo, Fragment } from 'react';
// import PropTypes from 'prop-types';
import { Form, Select, Modal, Button, Drawer, Row, Col, Input, Switch, Divider } from 'antd';
import classnames from 'classnames';
import { findApiHostList, findEnvList } from '@/service/apiHost';
import { useDoApi } from '@/hooks/apiHost';
import { defaultEnvConfig } from '../../const';
import { getStartTemp, downloadTemp } from '@/helpers/startTemp';
import styles from './index.less';

import { getApiHostByEnvId } from '@/helpers/view';

const { Option } = Select;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const formItemLayout2 = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

const titleByType = {
  startSh: '启动脚本变量',
  replaceJson: '环境变量配置',
};

const BuildForm = props => {
  const {
    form: { getFieldDecorator, getFieldValue, validateFields, resetFields },
    vis,
    repaceJsonConfigList,
    startShList,
    onCancel,
    onOk,
    buildPageLoading,
    tagId,
    tagInfo,
  } = props;

  const { gitConfig, serverConfig } = tagInfo || {};
  const gitConfigObject = gitConfig ? JSON.parse(gitConfig) : null;
  const serverConfigObject = serverConfig ? JSON.parse(serverConfig) : null;

  const { state } = useDoApi(findApiHostList, true, { tagId });
  const { state: envState } = useDoApi(findEnvList, true, { tagId });
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [type, setSelectedType] = useState();
  const apiHostList = state?.value?.data || [];
  const envList = envState?.value?.data || [];
  const envId = getFieldValue('envId');
  const startShId = getFieldValue('startShId');
  const replaceJsonId = getFieldValue('replaceJsonId');
  const arr = getApiHostByEnvId(envId, apiHostList);
  // const openBaleVariable = getFieldValue('openBaleVariable');

  const setSelected = useCallback(type => {
    setSelectedType(type);
    setDrawerVisible(true);
  }, []);

  const handleDrawerCancel = useCallback(() => {
    setDrawerVisible(false);
  }, []);

  const getValue = useCallback(() => {
    validateFields((errors, values) => {
      if (errors) {
        return;
      }
      console.log('vvvv', values);
      onOk(values);
    });
  }, [validateFields, onOk]);

  const onSubmitConfirm = useCallback(() => {
    validateFields((errors, values) => {
      if (errors) {
        return;
      }

      let params = { ...values };
      const { gitPush, serverDeploy } = values;
      let title = '';
      if (gitPush) {
        title = '确认将打包好的文件推送到远程？';
        params['gitConfig'] = { ...gitConfigObject, commit: values.commit };
      }
      if (serverDeploy) {
        title = '确认将打包好的文件部署到服务器？';
        params.serverConfig = { ...serverConfigObject };
      }

      if (gitPush && serverDeploy) {
        title = '确认将打包好的文件推送到远程并且部署到服务器？';
      }
      console.log('vvvv--', params);

      Modal.confirm({
        title,
        cancelText: '取消',
        okText: '确定',
        onOk() {
          onOk(params);
        },
      });
    });
  }, [validateFields, onOk, gitConfigObject, serverConfigObject]);

  const afterClose = useCallback(() => {
    resetFields();
    setSelectedType(undefined);
  }, [resetFields]);

  // 详情展示
  const drawerDetail = useMemo(() => {
    let content = null;
    let data = null;
    switch (type) {
      case 'startSh':
        data = startShList?.find(n => n.id === startShId);
        break;
      default:
        data = repaceJsonConfigList?.find(n => n.id === replaceJsonId);
    }
    if (!data || !type) {
      return content;
    }
    switch (type) {
      case 'startSh':
        const json = {};
        const jsonList = data?.json;
        if (jsonList) {
          jsonList.forEach(m => {
            json[m.key] = m.value;
          });
        }
        content = (
          <>
            {data?.json?.map((n, index) => {
              const { key } = n;
              const defaultConfig = defaultEnvConfig[key];
              return (
                <Row key={index} style={{ marginBottom: 10 }}>
                  {defaultConfig && (
                    <Row>
                      <Col span={11} align="right" style={{ color: '#999' }}>
                        {defaultConfig.label}
                      </Col>
                    </Row>
                  )}
                  <Row>
                    <Col span={11} align="right" style={{ color: '#1991eb' }}>
                      {n.key}
                    </Col>
                    <Col span={2} align="center">
                      ：
                    </Col>
                    <Col span={11}>{n.value}</Col>
                  </Row>
                </Row>
              );
            })}
            <h4 style={{ marginTop: 30 }}>脚本预览</h4>
            <p style={{ whiteSpace: 'pre-line' }}>{getStartTemp(json)}</p>
            <Button type="primary" onClick={() => downloadTemp(getStartTemp(json))}>
              下载
            </Button>
          </>
        );
        break;
      default:
        content = (
          <>
            <Row style={{ marginBottom: 10 }}>
              <Col span={11} align="center">
                <h4>替换前</h4>
              </Col>
              <Col span={2}></Col>
              <Col span={11} align="center">
                <h4>替换后</h4>
              </Col>
            </Row>
            {data?.replaceJson?.map((n, index) => {
              return (
                <Row key={index} style={{ marginBottom: 10 }}>
                  <Col span={11} align="right" style={{ color: '#1991eb' }}>
                    {n.key}
                  </Col>
                  <Col span={2} align="center">
                    ：
                  </Col>
                  <Col span={11}>{n.value}</Col>
                </Row>
              );
            })}
          </>
        );
    }
    return content;
  }, [type, startShId, replaceJsonId, repaceJsonConfigList, startShList]);

  const gitBranchList = [
    {
      id: 'release/2.0.0',
      name: 'release/2.0.0',
    },
    {
      id: 'feature/dany/master',
      name: 'feature/dany/master',
    },
    {
      id: 'feature/datacenter/standard/1.0.0',
      name: 'feature/datacenter/standard/1.0.0',
    },
  ];

  const depyTypeList = [
    {
      id: 'dist',
      name: '静态部署',
    },
    {
      id: 'electronDist',
      name: '静态部署--本地化(exe,dmg)',
    },
    {
      id: 'node',
      name: 'node部署',
    },
  ];

  const isNode = getFieldValue('depyType') === 'node';
  const isShowGitConfig = getFieldValue('gitPush');
  const isShowServerConfig = getFieldValue('serverDeploy');
  const hasGitRepository = gitConfigObject && gitConfigObject.url;
  const hasServer = serverConfigObject && serverConfigObject.host;
  return (
    <>
      <Modal
        title="选择打包环境"
        className={classnames(styles.apiConfig, 'dm-modal-default')}
        visible={vis}
        onCancel={onCancel}
        onOk={isShowGitConfig || isShowServerConfig ? onSubmitConfirm : getValue}
        width={600}
        confirmLoading={buildPageLoading}
        okText="打包"
        afterClose={afterClose}
        maskClosable={false}
      >
        <Form.Item label="选择版本" {...formItemLayout}>
          {getFieldDecorator('branch', {
            initialValue: 'release/2.0.0',
            rules: [
              {
                required: true,
              },
            ],
          })(
            <Select style={{ width: 340 }} placeholder="选择版本" allowClear={true}>
              {gitBranchList.map(v => {
                return (
                  <Option key={v.id} value={v.id}>
                    {v.name}
                  </Option>
                );
              })}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="部署方式" {...formItemLayout}>
          {getFieldDecorator('depyType', {
            initialValue: 'node',
            rules: [
              {
                required: true,
              },
            ],
          })(
            <Select style={{ width: 340 }} placeholder="选择部署方式">
              {depyTypeList.map(v => {
                return (
                  <Option key={v.id} value={v.id}>
                    {v.name}
                  </Option>
                );
              })}
            </Select>,
          )}
        </Form.Item>
        {/* {isNode && (
          <Form.Item label="设置静态资源托管路径" {...formItemLayout}>
            {getFieldDecorator('staticPath', {
              initialValue: '',
            })(<Input style={{ width: 340 }} placeholder="请设置静态资源托管路径"></Input>)}
          </Form.Item>
        )} */}

        <Form.Item label="选择环境" {...formItemLayout}>
          {getFieldDecorator(
            'envId',
            {},
          )(
            <Select style={{ width: 340 }} placeholder="环境" allowClear={true}>
              {envList.map(v => {
                return (
                  <Option key={v.id} value={v.id}>
                    {v.name}
                  </Option>
                );
              })}
            </Select>,
          )}
        </Form.Item>
        <div>
          {arr.map((v, index) => {
            return (
              <Form.Item key={index} label={v.apiHostName} {...formItemLayout}>
                {getFieldDecorator('envId', {})(<span>{v.value} </span>)}
              </Form.Item>
            );
          })}
        </div>
        {isNode && (
          <Fragment>
            <Form.Item label="启动脚本" {...formItemLayout}>
              {getFieldDecorator('startShId')(
                <Select style={{ width: 340 }} placeholder="请选择启动脚本" allowClear={true}>
                  {startShList?.map(v => {
                    return (
                      <Option key={v.id} value={v.id}>
                        {v.name}
                      </Option>
                    );
                  })}
                </Select>,
              )}
              {getFieldValue('startShId') && (
                <Button type="link" onClick={() => setSelected('startSh')}>
                  详情
                </Button>
              )}
            </Form.Item>
          </Fragment>
        )}
        {/* {isDist && (
          <Form.Item label="打包时变量替换" {...formItemLayout}>
            {getFieldDecorator('openBaleVariable', { initialValue: true })(
              <Switch checked={openBaleVariable} checkedChildren="开" unCheckedChildren="关" />,
            )}
          </Form.Item>
        )} */}

        <Form.Item label="变量替换" {...formItemLayout}>
          {getFieldDecorator('replaceJsonId')(
            <Select style={{ width: 340 }} placeholder="请选择配置" allowClear={true}>
              {repaceJsonConfigList?.map(v => {
                return (
                  <Option key={v.id} value={v.id}>
                    {v.name}
                  </Option>
                );
              })}
            </Select>,
          )}
          {getFieldValue('replaceJsonId') && (
            <Button type="link" onClick={() => setSelected('replaceJson')}>
              详情
            </Button>
          )}
          {!isNode && (
            <div className={styles.des}>
              如果不是部署在服务器根目录上，需自己在配置里填写nginxPath，如/screen
            </div>
          )}
        </Form.Item>

        {!!hasGitRepository && (
          <Form.Item label="推送到远程仓库" {...formItemLayout} className={styles.lastItem}>
            {getFieldDecorator('gitPush', {
              valuePropName: 'checked',
            })(<Switch />)}
          </Form.Item>
        )}
        {isShowGitConfig && (
          <div className={styles.gitInfo}>
            <p>
              仓库地址:<span>{gitConfigObject?.url}</span>
            </p>
            <p>
              推送分支:<span>{gitConfigObject?.branch}</span>
            </p>
            {/* <p>
              推送路径:<span>{gitConfigObject?.gitPath}</span>
            </p> */}
          </div>
        )}
        {!!hasGitRepository && isShowGitConfig && (
          <Form.Item label="Commit" {...formItemLayout2} className={styles.lastItem}>
            {getFieldDecorator('commit', {
              rules: [
                {
                  required: true,
                  message: '请填写commit信息',
                },
              ],
            })(<Input placeholder="请填写commit信息(fix: fixed bug #001)" />)}
          </Form.Item>
        )}
        {!!hasServer && (
          <>
            <Divider style={{ marginBottom: 0 }} />
            <Form.Item label="部署到服务器" {...formItemLayout} className={styles.lastItem}>
              {getFieldDecorator('serverDeploy', {
                valuePropName: 'checked',
              })(<Switch />)}
            </Form.Item>
          </>
        )}
        {isShowServerConfig && (
          <div className={styles.gitInfo}>
            <p>
              服务器域名:<span>{serverConfigObject?.host}</span>
            </p>
            <p>
              端口:<span>{serverConfigObject?.port ?? 22}</span>
            </p>
            <p>
              用户名:<span>{serverConfigObject?.username}</span>
            </p>
            <p>
              文件上传路径:<span>{serverConfigObject?.path}</span>
            </p>
          </div>
        )}
      </Modal>
      <Drawer
        width={500}
        title={titleByType[type]}
        visible={drawerVisible}
        onClose={handleDrawerCancel}
        mask={false}
      >
        {drawerDetail}
      </Drawer>
    </>
  );
};

export default Form.create()(BuildForm);
