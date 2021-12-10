import { useEffect, useState } from 'react';
import { Modal, Form, notification, Tabs } from 'antd';

import { useDoSaveQuery, useGetSchemaList } from '@/hooks/redash';
import SchemaBrowser from '@/components/redash/QuerySource/components/SchemaBrowser';
// import { getQueryParameters } from './hooks';

import AddQuery from '../AddQuery';
import FieldsMap from './FieldsMap';

import styels from './index.less';

const { TabPane } = Tabs;

const AddModal = ({
  visible,
  setAddModalVisible,
  form,
  nowQuery,
  data_source_id,
  setQuerySqlId,
}) => {
  const [activeKey, setTabsKey] = useState('1');
  const [fieldsMap, setFieldsMap] = useState({});
  const { fieldsMap: itemFieldsMap } = nowQuery?.options || {};
  const { resetFields } = form;
  useEffect(() => {
    if (!itemFieldsMap) {
      return setFieldsMap({});
    }
    setFieldsMap(itemFieldsMap);
  }, [itemFieldsMap]);

  const { doApi, loading } = useDoSaveQuery();
  const { data, doApi: getList } = useGetSchemaList({
    data_source_id,
  });
  useEffect(() => {
    if (!data_source_id) {
      return;
    }
    if (!visible) {
      return;
    }
    getList({
      data_source_id,
    });
  }, [data_source_id, visible, getList]);

  const save = () => {
    form.validateFields(async (err, values) => {
      if (err) {
        return;
      }
      const { parameters, columns, groupBy, ...restValues } = values;

      const saveData = {
        schedule: null,
        data_source_id,
        options: {
          parameters,
          columns,
          groupBy,
        },
        is_draft: true,
        ...restValues,
      };
      if (nowQuery?.id) {
        saveData.id = nowQuery.id;
      }
      const { data, errorCode } = await doApi(saveData);
      if (errorCode !== 200) {
        notification.open({
          message: 'error',
          description: '后端操作错误',
        });
        return;
      }
      const id = data?.id;
      setAddModalVisible(false);
      setQuerySqlId(id);
    });
  };
  const getSchema = () => {
    if (!data?.length) {
      return;
    }
    return (
      <SchemaBrowser
        schema={data}
        // onRefresh={() => refreshSchema(true)}
        // onItemSelect={handleSchemaItemSelect}
      />
    );
  };

  return (
    <Modal
      title="新增查询语句"
      visible={visible}
      onCancel={() => {
        resetFields();
        setAddModalVisible(false);
      }}
      destroyOnClose={true}
      width={1400}
      onOk={save}
      confirmLoading={loading}
      maskClosable={false}
    >
      <div className={styels.container}>
        <div className={styels.left}>
          <Tabs active={activeKey} onChange={k => setTabsKey(k)}>
            <TabPane tab="schema" key="1">
              <div className={styels.leftContainer}>
                <div>{getSchema()}</div>
              </div>
            </TabPane>
            <TabPane tab="字段映射" key="2">
              {activeKey === '2' && (
                <FieldsMap form={form} fieldsMap={fieldsMap} setFieldsMap={setFieldsMap} />
              )}
            </TabPane>
          </Tabs>
        </div>

        <div className={styels.right}>
          <AddQuery
            form={form}
            nowQuery={nowQuery}
            data_source_id={data_source_id}
            fieldsMap={fieldsMap}
          ></AddQuery>
        </div>
      </div>
    </Modal>
  );
};

export default Form.create()(AddModal);
