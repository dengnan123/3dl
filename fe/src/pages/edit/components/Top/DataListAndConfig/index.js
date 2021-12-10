import React, { useState, useEffect, useRef, Fragment } from 'react';
import ApiConfig from '@/components/ApiConfig';
import { copyToClip, addEs5CodeToData } from '@/helpers/screen';
import { Button, Modal, Form, notification, Menu, Dropdown, Spin, message } from 'antd';

import styles from './index.less';

const DataListAndConfig = ({
  loading,
  addDataSource,
  getAllDataSourceByPageId,
  updateDataSourceById,
  dataListAndConfigVis: visible,
  form,
  form: { getFieldsValue },
  dataSourceList,
}) => {
  const [modalVis, setModalVis] = useState(false);
  const dataTypeRef = useRef(null);
  const [nowClickInfo, setClickInfo] = useState({});

  useEffect(() => {
    visible && getAllDataSourceByPageId();
  }, [getAllDataSourceByPageId, visible]);

  const handleOk = () => {
    const newFields = getFieldsValue();

    let _newFileds = {
      ...newFields,
    };
    //highConfig true  false 改成 1 0 如果没有highConfig filterFunc 为空字符串
    if (_newFileds.openHighConfig) {
      _newFileds.highConfig = 1;
    } else {
      _newFileds.openHighConfig = 0;
      _newFileds.filterFunc = '';
    }

    if (_newFileds.autoRefresh) {
      _newFileds.autoRefresh = 1;
    } else {
      _newFileds.autoRefresh = 0;
    }

    if (_newFileds.mockData) {
      let obj = {};
      let isError = false;
      try {
        obj = JSON.parse(_newFileds.mockData);
      } catch (err) {
        isError = true;
      }
      if (isError) {
        notification.open({
          message: 'Error',
          description: 'json格式有误',
        });
        return;
      }

      _newFileds.mockData = obj;
    }

    _newFileds.useDataType = dataTypeRef.current;

    //代码编译
    _newFileds = addEs5CodeToData(_newFileds, [
      'dataApiUrlFilter',
      'cusHeaderFunc',
      'parmasFilterFunc',
      'filterFunc',
    ]);

    if (nowClickInfo.id) {
      updateDataSourceById({ ..._newFileds, id: nowClickInfo.id }).then(res => {
        handleCancel();
        getAllDataSourceByPageId();
      });
      return;
    }

    addDataSource(_newFileds).then(res => {
      if (res?.errorCode !== 200) {
        message.error(res?.message || '添加失败！');
      }
      handleCancel();
      getAllDataSourceByPageId();
    });
  };

  const handleCancel = () => {
    setModalVis(false);
  };

  const menuClick = ({ key }) => {
    dataTypeRef.current = key;
    setClickInfo({});
    setModalVis(true);
  };

  const apiConfigProps = {
    form,
    data: nowClickInfo,
  };

  const modalProps = {
    API: <ApiConfig {...apiConfigProps}></ApiConfig>,
  };

  const menu = (
    <Menu onClick={menuClick}>
      <Menu.Item key="API">http接口</Menu.Item>
      <Menu.Item key="other">其他</Menu.Item>
    </Menu>
  );

  const itemClick = v => {
    dataTypeRef.current = v.useDataType;
    setClickInfo(v);
    setModalVis(true);
  };

  return (
    <Fragment>
      <Spin spinning={loading.effects['edit/getAllDataSourceByPageId'] ? true : false}>
        <div className={styles.topDiv}>
          <Dropdown overlay={menu}>
            <div>
              <Button type="primary">新增</Button>
            </div>
          </Dropdown>
          {/* <Button type="primary">合成数据源</Button> */}
        </div>
        {dataSourceList.map(v => {
          return (
            <div key={v.id}>
              <Button
                type="link"
                onClick={() => {
                  itemClick(v);
                }}
              >
                {v.dataSourceName}
              </Button>
              {/* <Icon
                type="delete"
                onClick={() => {
                  itemDelClick(v);
                }}
              ></Icon> */}
              <Button
                type="primary"
                size="small"
                onClick={() => {
                  copyToClip(v.id);
                }}
              >
                复制ID
              </Button>
            </div>
          );
        })}
      </Spin>

      <Modal
        title="配置API"
        visible={modalVis}
        onCancel={handleCancel}
        onOk={handleOk}
        width={1400}
        destroyOnClose={true}
        maskClosable={false}
        confirmLoading={
          loading.effects['edit/addDataSource'] || loading.effects['edit/updateDataSourceById']
        }
      >
        {modalProps[dataTypeRef.current]}
      </Modal>
    </Fragment>
  );
};

export default Form.create()(DataListAndConfig);
