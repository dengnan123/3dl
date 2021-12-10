import { Button, Modal, Form, Spin, Icon, message } from 'antd';
import React, { useState } from 'react';

import { useAddApiHost, useUpdateApiHost, useDoApi } from '@/hooks/apihost';
import { deleteApiHost, findEnvList, findApiHostList } from '@/service/apiHost';
import { fetchRedushDatasourceList } from '@/service/redash';
import styles from './index.less';
import HoverList from '@/components/HoverList';
import ApiForm from './api';
import DatabaseForm from './database';

const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 },
};

const typeArr = [
  {
    value: 'api',
    label: '接口',
  },
  {
    value: 'database',
    label: '数据库',
  },
];

const APIHost = ({
  form,
  form: { getFieldDecorator, getFieldsValue, validateFields, resetFields },
  tagId,
}) => {
  const [modalKey, setVis] = useState(false);
  const [nowClick, setNow] = useState(null);

  const { state: findEnvListState } = useDoApi(findEnvList, true, {
    tagId,
    pageSize: 999,
  });
  const envList = findEnvListState?.value?.data || [];

  const { state: redashState, doApi: fetchDataSourceList } = useDoApi(
    fetchRedushDatasourceList,
    false,
    {
      tagId,
      pageSize: 999,
    },
  );

  const datasourceList = redashState?.value?.data?.list || [];

  const { doApi } = useDoApi(deleteApiHost);
  const handleCancel = () => {
    setVis(false);
    resetFields();
    setNow(null);
  };

  const handleOk = () => {
    validateFields(async (errors, values) => {
      if (errors) {
        message.warning('请确认信息填写是否正确！');
        return;
      }

      if (nowClick) {
        // 更新
        await updateFunc({
          ...nowClick,
          ...values,
          tagId,
        });
      } else {
        // 新增
        await addFunc({
          ...values,
          tagId,
        });
      }
      handleCancel();
      fetchList({
        tagId,
      });
    });
  };

  const envListValidator = (rule, value, callback) => {
    // for (const v of value) {
    //   if (!v.envId || !v.value) {
    //     callback('请完善环境组里面的信息');
    //     return;
    //   }
    // }
    callback();
  };

  const { state: apiHostState, doApi: fetchList } = useDoApi(findApiHostList, true, {
    tagId,
  });
  const apiHostList = apiHostState?.value?.data || [];
  const getApiHostListloading = apiHostState.loading;

  const { addFunc, addLoading } = useAddApiHost();
  const { updateFunc, updateLoading } = useUpdateApiHost();

  const delConfirm = v => {
    Modal.confirm({
      title: '确认！',
      content: '是否删除该数据源',
      okText: '确认',
      cancelText: '取消',
      async onOk() {
        const { errorCode, message: msg } = await doApi(v);
        if (errorCode !== 200) {
          message.error(msg);
          return;
        }
        fetchList({
          tagId,
        });
      },
      onCancel() {},
    });
  };

  const hoverListProps = {
    list: apiHostList,
    renderContent({ v, nowHover, index, hoverIndex }) {
      return (
        <div key={v.id}>
          <Button
            type="link"
            onClick={() => {
              setNow(v);
              setVis(v.type || 'api');
              if (v.type === 'database') {
                fetchDataSourceList();
              }
            }}
          >
            {v.apiHostName}
            {v.type === 'database' && <span className={styles.db}>(db)</span>}
          </Button>

          {index === hoverIndex && (
            <Icon
              type="delete"
              onClick={() => {
                delConfirm(v);
              }}
            ></Icon>
          )}
        </div>
      );
    },
  };

  const menuClick = key => {
    if (key === 'database') {
      fetchDataSourceList();
    }
    setVis(key);
  };

  const apiFormProps = {
    formItemLayout,
    getFieldDecorator,
    nowClick,
    typeArr,
    envList,
    envListValidator,
  };

  const modalRender = () => {
    if (modalKey === 'database') {
      return <DatabaseForm {...apiFormProps} datasourceList={datasourceList}></DatabaseForm>;
    }
    return <ApiForm {...apiFormProps}></ApiForm>;
  };

  return (
    <div>
      <div className={styles.topDiv}>
        <h3>新增</h3>
        <div className={styles.btns}>
          <Button onClick={() => menuClick('api')}>+ 接口</Button>
          <Button onClick={() => menuClick('database')}>+ 数据库</Button>
        </div>
      </div>
      <Spin spinning={getApiHostListloading}>
        <HoverList {...hoverListProps}></HoverList>
      </Spin>
      <Modal
        title="添加"
        confirmLoading={addLoading || updateLoading}
        visible={modalKey ? true : false}
        onOk={handleOk}
        onCancel={handleCancel}
        width={900}
        destroyOnClose={true}
      >
        {modalRender()}
      </Modal>
    </div>
  );
};

export default Form.create()(APIHost);
