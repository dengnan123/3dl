import React, { useState, useRef, useEffect, Fragment, useCallback, useMemo } from 'react';
import { Button, Modal, Form, notification, Spin, Icon, message, Collapse, Checkbox } from 'antd';

import ApiConfig from '@/components/ApiConfig';
import DatabaseConfig from '@/components/DatabaseConfig';
import { copyToClip, addEs5CodeToData } from '@/helpers/screen';
import HoverList from '@/components/HoverList';
import {
  addDataSource as add,
  updateDataSourceById as update,
  deleteDataSourceById as del,
} from '@/service';
import { findApiHostList } from '@/service/apiHost';
import { useDoApi } from '@/hooks/apiHost';
import { getParseSearch } from '@/helpers/utils';
import styles from './index.less';

const { Panel } = Collapse;

const direct_api = {
  apiHostName: '其他',
  apiHostId: 'others',
  isApiNull: true,
};

const APIRouter = ({ form, tagId, getList, type }) => {
  const { getFieldsValue, validateFields } = form;
  const { tagId: urlTagId, pageId } = getParseSearch();
  const _tagId = tagId || urlTagId;

  // if (type === 'public') {
  //   getListAndAddCon.tagId = _tagId;
  // } else {
  //   getListAndAddCon.pageId = pageId;
  // }

  const dataTypeRef = useRef(null);
  const [apiSourcesLoading, setApiSourcesLoading] = useState(false);
  const [apiSources, setApiSources] = useState([]);
  const [modalVis, setModalVis] = useState(false);
  const [nowClickInfo, setClickInfo] = useState({});
  const [{ paramPageId }, setParamPageId] = useState({ paramPageId: undefined });

  let getListAndAddCon = useMemo(() => {
    return { tagId: _tagId, pageId: paramPageId };
  }, [_tagId, paramPageId]);

  // 获取数据源列表
  useEffect(() => {
    if (!_tagId) return;
    setApiSourcesLoading(true);
    findApiHostList({ tagId: _tagId }).then(result => {
      const { errorCode, data } = result;
      setApiSourcesLoading(false);
      if (errorCode === 200) {
        setApiSources(data || []);
      }
    });
  }, [_tagId]);

  const { doApi: deleteDataSource } = useDoApi(del);
  const {
    state: { loading: addLoading },
    doApi: addDataSource,
  } = useDoApi(add);

  const {
    state: { loading: updateLoading },
    doApi: updateDataSourceById,
  } = useDoApi(update);

  // 获取接口API列表
  const { state, doApi: getAllDataSource } = useDoApi(getList, true, getListAndAddCon);

  const dataSourceList = state?.value?.data || [];
  const listLoading = state.loading;

  const handleOk = () => {
    validateFields((errors, values) => {
      if (errors) {
        return;
      }
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
          getAllDataSource({
            ...getListAndAddCon,
          });
        });
        return;
      }

      addDataSource({
        ..._newFileds,
        ...getListAndAddCon,
      }).then(res => {
        if (res?.errorCode !== 200) {
          message.error(res?.message || '添加失败！');
        }
        handleCancel();
        getAllDataSource({
          ...getListAndAddCon,
        });
      });
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
    tagId,
  };

  const socketConfig = {
    ...apiConfigProps,
    useDataType: 'socket',
  };

  const databaseConfigProps = {
    ...apiConfigProps,
  };

  const modalProps = {
    API: <ApiConfig {...apiConfigProps}></ApiConfig>,
    socket: <ApiConfig {...socketConfig}></ApiConfig>,
    linkDatabase: <DatabaseConfig {...databaseConfigProps} />,
  };

  // const menu = (
  //   <Menu onClick={menuClick}>
  //     <Menu.Item key="API">http接口</Menu.Item>
  //     <Menu.Item key="socket">socket</Menu.Item>
  //     <Menu.Item key="linkDatabase">数据库</Menu.Item>
  //     <Menu.Item key="other">其他</Menu.Item>
  //   </Menu>
  // );

  const itemClick = v => {
    dataTypeRef.current = v.useDataType;
    setClickInfo(v);
    setModalVis(true);
  };

  const delConfirm = v => {
    Modal.confirm({
      title: '确认！',
      content: '是否删除该API接口！！！',
      okText: '确认',
      cancelText: '取消',
      async onOk() {
        const { errorCode, message: msg } = await deleteDataSource(v);
        if (errorCode !== 200) {
          message.error(msg);
          return;
        }
        getAllDataSource({
          ...getListAndAddCon,
        });
      },
      onCancel() {},
    });
  };

  const handleCheckChange = useCallback(
    e => {
      const checked = e.target.checked;
      const paramPageId = checked ? pageId : undefined;
      setParamPageId({ paramPageId });
      getAllDataSource({ ...getListAndAddCon, pageId: paramPageId });
    },
    [pageId, getListAndAddCon, getAllDataSource],
  );

  // const upgradeConFirm = v => {
  //   Modal.confirm({
  //     title: '确认！',
  //     content: '是否升级改接口为项目公用接口！！！',
  //     okText: '确认',
  //     cancelText: '取消',
  //     async onOk() {
  //       const newData = {
  //         ...v,
  //         tagId: _tagId,
  //       };
  //       const { errorCode, message: msg } = await updateDataSourceById(newData);
  //       if (errorCode !== 200) {
  //         message.error(msg);
  //         return;
  //       }
  //       getAllDataSource({
  //         ...getListAndAddCon,
  //       });
  //     },
  //     onCancel() {},
  //   });
  // };

  const renderHoverListContent = (apiId, type) => {
    let list = (dataSourceList || []).filter(i => i.apiHostId === apiId);
    if (apiId === 'others') {
      list = (dataSourceList || []).filter(i => !i.apiHostId);
    }
    if (!list || !list.length) {
      return (
        <div className={styles.tips}>
          <div>该数据源下尚未添加接口</div>
        </div>
      );
    }
    const hoverListProps = {
      list,
      renderContent({ v, nowHover, index, hoverIndex, ...rest }) {
        // 接口是否被组件使用
        const used = v?.used;
        return (
          <div key={v.id} className={styles.itemDiv}>
            <Button
              type="link"
              style={{ color: !!used ? '#1991eb' : 'rgb(146 139 139)' }}
              onClick={() => {
                itemClick(v);
              }}
            >
              {v.dataSourceName}
            </Button>
            {index === hoverIndex && !used && (
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

    return (
      <Fragment>
        <HoverList {...hoverListProps}></HoverList>
      </Fragment>
    );
  };

  return (
    <Fragment>
      <Spin spinning={listLoading || apiSourcesLoading}>
        <div className={styles.topDiv}>
          <h3>新增</h3>
          <div className={styles.btns}>
            <Button onClick={() => menuClick({ key: 'API' })}>+ http</Button>
            <Button onClick={() => menuClick({ key: 'socket' })}>+ socket</Button>
            <Button onClick={() => menuClick({ key: 'linkDatabase' })}>+ 数据库</Button>
            <Button onClick={() => menuClick({ key: 'other' })} disabled={true}>
              其他
            </Button>
          </div>
        </div>
        {pageId && <Checkbox onChange={handleCheckChange}>仅查看当前页面已使用数据源</Checkbox>}
        <div className={styles.contentCollapse}>
          {!apiSourcesLoading && (
            <Collapse
              expandIconPosition="right"
              bordered={false}
              defaultActiveKey={'others'}
              // accordion={true}
            >
              {[...apiSources, direct_api].map(ap => {
                const { apiHostId, apiHostName, nowUseUrl, type } = ap;
                let headerComp = nowUseUrl ? (
                  <p className={styles.headerPart}>
                    {apiHostName}
                    <span className={styles.db}>{type === 'database' && '(db)'}</span>
                    <span
                      onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        copyToClip(nowUseUrl);
                      }}
                    >
                      ({nowUseUrl})
                    </span>
                  </p>
                ) : (
                  <p className={styles.headerPart}>
                    {apiHostName}
                    <span className={styles.db}>{type === 'database' && '(db)'}</span>
                  </p>
                );
                return (
                  <Panel key={apiHostId + ''} header={headerComp}>
                    {renderHoverListContent(apiHostId, type)}
                  </Panel>
                );
              })}
            </Collapse>
          )}
        </div>
      </Spin>

      <Modal
        title="配置API"
        visible={modalVis}
        onCancel={handleCancel}
        onOk={handleOk}
        width={1400}
        destroyOnClose={true}
        maskClosable={false}
        confirmLoading={addLoading || updateLoading}
      >
        {modalProps[dataTypeRef.current]}
      </Modal>
    </Fragment>
  );
};

export default Form.create()(APIRouter);
