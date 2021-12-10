import React, { useState, useCallback, useMemo, useRef } from 'react';
// import PropTypes from 'prop-types';
import moment from 'dayjs';
import API from '@/helpers/api';
// import { useDoApi } from '@/hooks/apihost';
// import { getSqlQueryList } from '@/service/apiHost';
// import { getDataApiUrl } from '@/helpers/view';
import { filterDataFunc } from '@/helpers/screen';
import SelectDetail from '@/components/SelectDetail';
import { useFetchRedushDatasourceList } from '@/hooks/redash';
import {
  Form,
  Input,
  Button,
  Select,
  Icon,
  Divider,
  Switch,
  InputNumber,
  Table,
  message,
  Tag,
} from 'antd';
import AceEditor from '../AceEditor';
import { CreateDatabaseModal } from './components/index';
import ModalCodeEdit from '@/components/ModalCodeEdit';
import { getParseSearch } from '@/helpers/utils';
import { useGetApiHostList, useGetEnvList } from '@/hooks/apihost';
import AddModal from '@/components/redash/AddModal';
import { useDatabaseIdChange } from './hooks';
import { useGetDataId } from '@/hooks';
import styles from './index.less';

const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 20 },
};

function DatabaseConfig(props) {
  const { form, data, tagId: pTagId } = props;
  const { getFieldDecorator, getFieldValue, validateFields, setFieldsValue } = form;
  const tagId = getParseSearch().tagId || pTagId;
  const { data: initData } = useGetApiHostList({ tagId }, true);
  const { data: envList } = useGetEnvList({ tagId }, true);
  const apiHostList = initData.filter(v => v.type === 'database');
  const [data_source_id] = useGetDataId({
    apiHostList,
    envList,
    apiHostId: getFieldValue('apiHostId') || data?.apiHostId,
  });
  const [querySqlList, { doApi }] = useDatabaseIdChange({
    data_source_id,
    setFieldsValue,
  });
  const { data: redashDatasourceList } = useFetchRedushDatasourceList();
  const [addModalVis, setAddModalVisible] = useState();
  const [nowQuery, setNowQuery] = useState();

  const [
    { databaseModalVisible, createDatabaseLoading, debugLoading, code, resultCodeVisible },
    setState,
  ] = useState({
    databaseModalVisible: false,
    createDatabaseLoading: false,
    debugLoading: false,
    code: undefined,
    resultCodeVisible: false,
  });

  const updateState = useCallback(payload => setState(state => ({ ...state, ...payload })), []);

  const handleDatabaseModalOk = useCallback(
    payload => {
      console.log('payloadpayloadpayloadpayload', payload);
      updateState({ createDatabaseLoading: true });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          updateState({ databaseModalVisible: true, createDatabaseLoading: false });
          resolve(false);
        }, 2000);
      });
    },
    [updateState],
  );

  const handleDatabaseModalCancel = useCallback(
    payload => {
      updateState({ databaseModalVisible: false });
    },
    [updateState],
  );

  const btnDebugg = () => {
    validateFields(async (error, values) => {
      const { methodType, queryId, parmasFilterFunc } = values;
      let headers = {};

      let newCondition = {};
      if (parmasFilterFunc) {
        newCondition = filterDataFunc({
          filterFunc: parmasFilterFunc,
          data: {},
        });
      }

      newCondition.query_id = queryId;

      updateState({ debugLoading: true });

      let res;
      try {
        res = await API.post(`/page-comp/apiProxy`, {
          condition: newCondition,
          methodType,
          cusHeaders: headers,
        });
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
        code: res,
        resultCodeVisible: true,
        debugLoading: false,
      };
      updateState({ ...newData });
    });
  };

  const queryClick = v => {
    setAddModalVisible(true);
    setNowQuery(v);
  };

  const readOnlyProps = {
    disCode: true,
    value: JSON.stringify(code, null, 2),
    language: 'javascript',
    titleFiledArr: [],
    showFooter: false,
  };

  const filterFuncProps = {
    form,
    formItemLayout,
    data,
    btnText: '设置',
    btnSize: 'small',
    field: 'filterFunc',
    formLabel: '返回数据过滤器',
    titleFiledArr: [
      {
        key: 'data',
        des: '数据源数据',
      },
    ],
  };

  // 用于判断是否请求
  const cancelRequestFuncProps = {
    form,
    formItemLayout,
    data,
    btnText: '设置',
    btnSize: 'small',
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
    form,
    formItemLayout,
    data,
    btnText: '设置',
    btnSize: 'small',
    field: 'parmasFilterFunc',
    formLabel: '请求参数过滤器',
    titleFiledArr: [
      {
        key: 'otherCompParams',
        des: '其他组件传参过来的数据',
      },
    ],
  };

  const openHighConfig = getFieldValue('openHighConfig');
  const autoRefresh = getFieldValue('autoRefresh');
  const sqlId = getFieldValue('queryId');
  console.log('sqlIdsqlIdsqlId', sqlId);
  const selectSqlQuery = useMemo(() => {
    return querySqlList?.find(n => n?.id === sqlId);
  }, [sqlId, querySqlList]);

  const addmodalprops = {
    visible: addModalVis,
    setAddModalVisible,
    data_source_id,
    setQuerySqlId(id) {
      setFieldsValue({
        queryId: id,
      });
      doApi({
        id: data_source_id,
      });
    },
    nowQuery,
  };

  return (
    <section className={styles.database}>
      <Form.Item label="接口名称" {...formItemLayout}>
        {getFieldDecorator('dataSourceName', {
          initialValue: data?.dataSourceName ?? '',
          rules: [{ required: true, message: '请输入接口名称' }],
        })(<Input placeholder="请输入接口名称" />)}
      </Form.Item>

      <Form.Item label="请求类型" {...formItemLayout} style={{ display: 'none' }}>
        {getFieldDecorator('methodType', {
          initialValue: 'linkDatabase',
          rules: [
            {
              required: true,
              message: '请选择类型',
            },
          ],
        })(
          <Select style={{ width: 120 }}>
            <Select.Option value="linkDatabase">连接数据库</Select.Option>
          </Select>,
        )}
      </Form.Item>

      {/* <div className={styles.selectTypeItem}>
        <Form.Item label="连接" {...formItemLayout}>
          {getFieldDecorator('type')(
            <Select placeholder="请选择已有连接" style={{ width: 300 }}>
              <Select.Option value="screen">大屏数据库</Select.Option>
            </Select>,
          )}
        </Form.Item>
        <Button className={styles.add} type="primary" onClick={handleAddBtnClick}>
          + 新建
        </Button>
      </div> */}

      {/* <Form.Item label="变量" {...formItemLayout}>
        {getFieldDecorator('params')(<SelectParam />)}
      </Form.Item> */}

      <Form.Item label="选择数据源" {...formItemLayout}>
        {getFieldDecorator('apiHostId', {
          initialValue: data?.apiHostId,
          rules: [
            {
              required: true,
              message: '请选择后端数据源',
            },
          ],
        })(
          <SelectDetail
            redashDatasourceList={redashDatasourceList}
            detail={data_source_id}
            apiHostList={apiHostList}
          ></SelectDetail>,
        )}
      </Form.Item>

      <Form.Item label="选择查询语句" {...formItemLayout}>
        {getFieldDecorator('queryId', {
          initialValue: data?.queryId,
          rules: [{ required: true, message: '请选择查询语句' }],
        })(
          <Select
            placeholder="请选择查询语句"
            style={{ width: 300 }}
            dropdownRender={menu => (
              <div>
                {menu}
                <Divider style={{ margin: '4px 0' }} />
                <div
                  style={{ padding: '4px 8px', cursor: 'pointer' }}
                  onMouseDown={e => e.preventDefault()}
                  onClick={() => {
                    setAddModalVisible(true);
                    setNowQuery(null);
                  }}
                >
                  <Icon type="plus" /> 新增
                </div>
              </div>
            )}
            disabled={!data_source_id}
          >
            {querySqlList?.map(n => (
              <Select.Option key={n?.id} value={n?.id}>
                {n?.name}
              </Select.Option>
            ))}
          </Select>,
        )}
      </Form.Item>

      {selectSqlQuery && (
        <Form.Item label=" " colon={false} {...formItemLayout}>
          <Table
            rowKey="id"
            size="small"
            columns={[
              { title: '名称', dataIndex: 'name', width: 120, ellipsis: true },
              {
                title: '创建时间',
                dataIndex: 'created_at',
                width: 200,
                render: text => (text ? moment(text).format('YYYY-MM-DD HH:mm') : ''),
              },
              {
                title: '查询语句',
                dataIndex: 'query',
                ellipsis: true,
                render: (text, v) => (
                  <span
                    style={{ color: '#1991eb', cursor: 'pointer' }}
                    onClick={() => queryClick(v)}
                  >
                    {text}
                  </span>
                ),
              },
            ]}
            dataSource={[selectSqlQuery]}
            pagination={false}
            footer={
              !!selectSqlQuery?.options?.parameters?.length
                ? () =>
                    selectSqlQuery?.options?.parameters?.map(n => (
                      <Tag key={n?.name}>
                        <span style={{ color: '#000', fontWeight: 'bold', marginRight: 10 }}>
                          {n?.name}:
                        </span>
                        {n?.value}
                      </Tag>
                    ))
                : false
            }
          />
        </Form.Item>
      )}

      <Form.Item label="页面初始化加载" {...formItemLayout}>
        {getFieldDecorator('pageInitFetch', {
          initialValue: data?.pageInitFetch ?? false,
          valuePropName: 'checked',
        })(<Switch />)}
      </Form.Item>

      <Form.Item label="打开数据自动刷新" {...formItemLayout}>
        {getFieldDecorator('autoRefresh', {
          initialValue: data?.autoRefresh ?? false,
          valuePropName: 'checked',
        })(<Switch />)}
      </Form.Item>

      {autoRefresh ? (
        <Form.Item label="自动刷新间隔(秒)" {...formItemLayout}>
          {getFieldDecorator('fetchInterval', {
            initialValue: data?.fetchInterval ?? 10,
          })(<InputNumber />)}
        </Form.Item>
      ) : null}

      <Form.Item label="高级" {...formItemLayout}>
        {getFieldDecorator('openHighConfig', {
          initialValue: data?.openHighConfig || false,
          valuePropName: 'checked',
        })(<Switch />)}
      </Form.Item>

      {openHighConfig && (
        <>
          <ModalCodeEdit {...cancelRequestFuncProps}></ModalCodeEdit>
          <ModalCodeEdit {...parmasFilterFuncProps}></ModalCodeEdit>
          <ModalCodeEdit {...filterFuncProps}></ModalCodeEdit>
        </>
      )}

      <CreateDatabaseModal
        visible={databaseModalVisible}
        createDatabaseLoading={createDatabaseLoading}
        onOk={handleDatabaseModalOk}
        onCancel={handleDatabaseModalCancel}
      />

      {resultCodeVisible && !debugLoading && (
        <Form.Item label="数据" {...formItemLayout}>
          <AceEditor {...readOnlyProps}></AceEditor>
        </Form.Item>
      )}

      <div className={styles.btn}>
        <Button type="primary" onClick={btnDebugg} loading={debugLoading}>
          调试API
        </Button>
      </div>
      <AddModal {...addmodalprops}></AddModal>
    </section>
  );
}

DatabaseConfig.propTypes = {};

export default DatabaseConfig;
