import React, { useState, Fragment } from 'react';
// import PropTypes from 'prop-types';
import { Form, Input, Button, Switch, InputNumber, message, Select, Divider } from 'antd';
import { filterDataFunc } from '@/helpers/screen';
import API from '@/helpers/api';
import { reap } from '@/components/SafeReaper';
import styles from './index.less';
import AceEditor from '@/components/AceEditor';
import { getFormFiledValue, getFormDefValue } from '@/helpers/form';
import SelectDetail from '@/components/SelectDetail';
import { getDataApiUrl } from '@/helpers/view';
import { useGetApiHostList, useGetEnvList } from '@/hooks/apihost';
import { getParseSearch } from '../../helpers/utils';
import ModalCodeEdit from '@/components/ModalCodeEdit';
import dynamicAPI from '@/helpers/api/dynamic';
import { useGetDataId } from '@/hooks';
const { TextArea } = Input;
const { Option } = Select;

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};

const DataConfig = props => {
  const {
    form: { getFieldDecorator, getFieldValue, validateFields },
    data,
    form,
    tagId: pTagId,
    useDataType,
  } = props;
  const tagId = getParseSearch().tagId || pTagId;
  const { data: initData } = useGetApiHostList({ tagId }, true);
  const { data: envList } = useGetEnvList({ tagId }, true);
  const apiHostList = initData.filter(v => !v.type || v.type === 'api');
  const [{ vis, code, debugLoading }, setState] = useState({
    vis: false,
    code: {},
    disCode: false,
    btnDebuggLoading: false,
    debugLoading: false,
  });

  const [nowUseApiHostValue] = useGetDataId({
    apiHostList,
    envList,
    apiHostId: getFieldValue('apiHostId') || data?.apiHostId,
  });

  const btnDebugg = () => {
    // 获取数据
    // disCode 设置为 true

    validateFields(async (error, values) => {
      if (error) {
        message.warning('请填写正确信息');
        return;
      }
      const { methodType, parmasFilterFunc, cusHeaderFunc, notUseProxy } = values;
      let headers = {};
      if (cusHeaderFunc) {
        headers = filterDataFunc({
          filterFunc: cusHeaderFunc,
          data: {},
        });
      }
      let newCondition = {};
      if (parmasFilterFunc) {
        newCondition = filterDataFunc({
          filterFunc: parmasFilterFunc,
          data: {},
        });
      }

      const newDataApiUrl = getDataApiUrl({
        condition: newCondition,
        apiHostList,
        envList,
        ...values,
      });

      if (!newDataApiUrl) {
        return;
      }
      setState(v => {
        return {
          ...v,
          btnDebuggLoading: true,
          disCode: true,
          debugLoading: true,
        };
      });

      let res;
      try {
        if (notUseProxy) {
          res = await dynamicAPI({
            dataApiUrl: newDataApiUrl,
            condition: newCondition,
            methodType,
            cusHeaders: headers,
          });
        } else {
          res = await API.post(`/page-comp/apiProxy`, {
            dataApiUrl: newDataApiUrl,
            condition: newCondition,
            methodType,
            cusHeaders: headers,
          });
        }
      } catch (err) {
        console.log('errrr', err);
        message.warning('调用接口失败！');
      }

      // 有过有过滤器 就加上过滤器
      const filterFunc = getFieldValue('filterFunc');
      const newInputData = res?.data || res;
      if (filterFunc) {
        res = filterDataFunc({
          filterFunc,
          data: newInputData,
        });
      }

      let newData = {
        btnDebuggLoading: false,
        code: res,
        vis: true,
        debugLoading: false,
      };
      setState(v => {
        return {
          ...v,
          ...newData,
        };
      });
    });
  };

  const autoRefresh = getFormFiledValue({
    getFieldValue,
    data,
    key: 'autoRefresh',
  });

  const high = getFormDefValue(data, form, 'openHighConfig', 0);

  // const editProps = {
  //   language: 'javascript',
  //   titleFiledArr: [],
  //   showFooter: false,
  // };

  const readOnlyProps = {
    disCode: true,
    value: JSON.stringify(code, null, 2),
    language: 'javascript',
    titleFiledArr: [],
    showFooter: false,
  };

  const basicProps = {
    form,
    formItemLayout,
    data,
    btnText: '设置',
    btnSize: 'small',
  };
  const headerEditProps = {
    ...basicProps,
    field: 'cusHeaderFunc',
    formLabel: '自定义header',
    titleFiledArr: [],
  };

  // 用于判断是否请求
  const cancelRequestFuncProps = {
    ...basicProps,
    field: 'cancelRequestFunc',
    formLabel: '是否取消请求',
    titleFiledArr: [
      {
        key: 'otherCompParams',
        des: '其他组件传参过来的数据',
      },
    ],
  };

  const parmasFilterFuncProps = {
    ...basicProps,
    field: 'parmasFilterFunc',
    formLabel: '请求参数过滤器',
    titleFiledArr: [
      {
        key: 'otherCompParams',
        des: '其他组件传参过来的数据',
      },
    ],
  };

  const filterFuncProps = {
    ...basicProps,
    field: 'filterFunc',
    formLabel: '返回数据过滤器',
    titleFiledArr: [
      {
        key: 'data',
        des: '数据源数据',
      },
    ],
  };

  const apiRouterFilterProps = {
    ...basicProps,
    field: 'apiRouterFilter',
    formLabel: '动态API',
    titleFiledArr: [],
  };

  const dataApiUrlFilterProps = {
    ...basicProps,
    field: 'dataApiUrlFilter',
    formLabel: '动态地址',
    titleFiledArr: [],
  };

  const mockApiDelayProps = {
    ...basicProps,
    field: 'dyMockDataFunc',
    formLabel: 'mock数据',
    titleFiledArr: [],
  };

  const openDataApiUrlFilter = getFormDefValue(data, form, 'openDataApiUrlFilter', 0);

  const directDataSource = getFormDefValue(data, form, 'directDataSource', 0);

  const openApiRouterFilter = getFormDefValue(data, form, 'openApiRouterFilter', 0);

  const openMockApi = getFormDefValue(data, form, 'openMockApi', 0);

  const getRenderDataApiUrl = () => {
    if (!directDataSource) {
      return;
    }
    return (
      <Fragment>
        {openDataApiUrlFilter ? null : (
          <Form.Item label="完整的后端API地址" {...formItemLayout}>
            {getFieldDecorator('dataApiUrl', {
              initialValue: reap(data, 'dataApiUrl', ''),
              rules: [
                {
                  required: true,
                  message: '请填写API地址',
                },
              ],
            })(<TextArea placeholder="请输入API地址,如：http://test.dfocus/apis/xxx" />)}
          </Form.Item>
        )}
        <Form.Item label="使用动态地址" {...formItemLayout}>
          {getFieldDecorator('openDataApiUrlFilter', {
            initialValue: openDataApiUrlFilter,
            valuePropName: 'checked',
          })(<Switch />)}
        </Form.Item>

        {openDataApiUrlFilter ? <ModalCodeEdit {...dataApiUrlFilterProps}></ModalCodeEdit> : null}
      </Fragment>
    );
  };

  const getRenderApiHostId = () => {
    if (directDataSource) {
      return;
    }
    return (
      <Fragment>
        <Form.Item label="选择数据源" {...formItemLayout}>
          {getFieldDecorator('apiHostId', {
            initialValue: reap(data, 'apiHostId', ''),
            rules: [
              {
                required: true,
                message: '请选择后端数据源',
              },
            ],
          })(
            <SelectDetail
              envList={envList}
              apiHostList={apiHostList}
              detail={nowUseApiHostValue}
            ></SelectDetail>,
          )}
        </Form.Item>
        {openApiRouterFilter ? null : (
          <Form.Item label="API接口" {...formItemLayout}>
            {getFieldDecorator('apiRouter', {
              initialValue: reap(data, 'apiRouter', ''),
            })(<TextArea placeholder="请输入API接口地址,如：/apis/xxx" />)}
          </Form.Item>
        )}

        <Form.Item label="使用动态API" {...formItemLayout}>
          {getFieldDecorator('openApiRouterFilter', {
            initialValue: openApiRouterFilter,
            valuePropName: 'checked',
          })(<Switch />)}
        </Form.Item>
        {openApiRouterFilter ? <ModalCodeEdit {...apiRouterFilterProps}></ModalCodeEdit> : null}
      </Fragment>
    );
  };

  const getHttpItems = () => {
    if (useDataType === 'socket') {
      return (
        <Fragment>
          <Form.Item label="socket 监听事件名称" {...formItemLayout}>
            {getFieldDecorator('socketEventName', {
              initialValue: reap(data, 'socketEventName', 'message'),
            })(<Input />)}
          </Form.Item>
        </Fragment>
      );
    }
    return (
      <Fragment>
        <Form.Item label="请求类型" {...formItemLayout}>
          {getFieldDecorator('methodType', {
            initialValue: reap(data, 'methodType', 'GET'),
            rules: [
              {
                required: true,
                message: '请选择类型',
              },
            ],
          })(
            <Select style={{ width: 120 }}>
              <Option value="GET">GET</Option>
              <Option value="POST">POST</Option>
              <Option value="PATCH">PATCH</Option>
              <Option value="PUT">PUT</Option>
            </Select>,
          )}
        </Form.Item>

        <Form.Item label="页面初始化加载" {...formItemLayout}>
          {getFieldDecorator('pageInitFetch', {
            initialValue: reap(data, 'pageInitFetch', 0),
            valuePropName: 'checked',
          })(<Switch />)}
        </Form.Item>

        <Form.Item label="打开数据自动刷新" {...formItemLayout}>
          {getFieldDecorator('autoRefresh', {
            initialValue: reap(data, 'autoRefresh', 0) ? true : false,
            valuePropName: 'checked',
          })(<Switch />)}
        </Form.Item>

        {autoRefresh ? (
          <Form.Item label="自动刷新间隔(秒)" {...formItemLayout}>
            {getFieldDecorator('fetchInterval', {
              initialValue: reap(data, 'fetchInterval', 10),
            })(<InputNumber />)}
          </Form.Item>
        ) : null}
      </Fragment>
    );
  };

  return (
    <div className={styles.apiConfig}>
      <Form.Item label="关闭代理(不用后台转发)" {...formItemLayout}>
        {getFieldDecorator('notUseProxy', {
          initialValue: reap(data, 'notUseProxy', 0),
          valuePropName: 'checked',
        })(<Switch />)}
      </Form.Item>
      <Form.Item label="直连数据源" {...formItemLayout}>
        {getFieldDecorator('directDataSource', {
          initialValue: reap(data, 'directDataSource', 0),
          valuePropName: 'checked',
        })(<Switch />)}
      </Form.Item>
      <Form.Item label="接口名称" {...formItemLayout}>
        {getFieldDecorator('dataSourceName', {
          initialValue: reap(data, 'dataSourceName', ''),
          rules: [{ required: true, message: '请输入接口名称' }],
        })(<Input placeholder="请输入接口名称" />)}
      </Form.Item>
      {getRenderApiHostId()}
      {getRenderDataApiUrl()}
      {getHttpItems()}
      <ModalCodeEdit {...headerEditProps}></ModalCodeEdit>
      <Form.Item label="高级" {...formItemLayout}>
        {getFieldDecorator('openHighConfig', {
          initialValue: reap(data, 'openHighConfig', 0) ? true : false,
          valuePropName: 'checked',
        })(<Switch />)}
      </Form.Item>
      {high ? (
        <Fragment>
          <ModalCodeEdit {...cancelRequestFuncProps}></ModalCodeEdit>
          <ModalCodeEdit {...parmasFilterFuncProps}></ModalCodeEdit>
          <ModalCodeEdit {...filterFuncProps}></ModalCodeEdit>
        </Fragment>
      ) : null}

      {vis && (
        <Form.Item label="数据" {...formItemLayout}>
          <AceEditor {...readOnlyProps}></AceEditor>
        </Form.Item>
      )}
      <Divider></Divider>
      <Form.Item label="mockAPI" {...formItemLayout}>
        {getFieldDecorator('openMockApi', {
          initialValue: reap(data, 'openMockApi', 0) ? true : false,
          valuePropName: 'checked',
        })(<Switch />)}
      </Form.Item>
      {openMockApi && <ModalCodeEdit {...mockApiDelayProps}></ModalCodeEdit>}
      {openMockApi && (
        <Form.Item label="延迟时间(ms)" {...formItemLayout}>
          {getFieldDecorator('mockDelayTime', {
            initialValue: reap(data, 'mockDelayTime', 0),
          })(<InputNumber />)}
        </Form.Item>
      )}

      <div className={styles.btn}>
        <Button type="primary" onClick={btnDebugg} loading={debugLoading}>
          调试API
        </Button>
      </div>
    </div>
  );
};

export default DataConfig;
