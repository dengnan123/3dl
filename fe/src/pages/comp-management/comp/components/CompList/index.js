import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Spin, Upload, Button, Table, Modal, message, Input } from 'antd';
import classnames from 'classnames';
import moment from 'moment';
import AxiosAPI from 'axios';

import { API_HOST, API_BUILD_HOST } from '@/config';
import DefaultImage from '@/assets/defPic.gif';
import styles from './index.less';

const BUILD_URL = () =>
  `${API_BUILD_HOST}/auto-build/?branch=master&gitUrl=ssh://git@180.167.234.224:10108/customization/df-screen-libs.git`;
function CompList(props) {
  const {
    selectedMenu,
    data,
    pagination,
    updateList,
    onAdd,
    onDeleted,
    onRemove,
    onChangePlugin,
    setCompPagination,
    listLoading,
  } = props;
  const [listData, setListData] = useState([]);
  const [item, setItem] = useState(null);
  const [selectedRowKeys, setRowKeys] = useState([]);
  const [packageLoading, setPackageLoading] = useState(false);

  const { list, total } = data || {};
  const { id: menuId, name: menuName } = selectedMenu || {};
  const { keyword } = pagination || {};

  useEffect(() => {
    setListData(list);
    setRowKeys([]);
  }, [list]);

  const selectedIds = selectedRowKeys.map(k => k.id);

  /******Input Search 部分******/
  const onKeyChange = useCallback(
    event => {
      const value = event.target.value;
      setCompPagination({ ...pagination, keyword: value });
      if (!value) {
        updateList({ keyword: null });
      }
    },
    [updateList,pagination,setCompPagination],
  );

  const onKeySearch = useCallback(() => {
    if (!keyword) {
      return;
    }
    updateList({ keyword: keyword });
  }, [updateList, keyword]);
  /******Input Search 部分******/

  const onSubmit = useCallback(
    e => {
      if (!listData?.length) {
        return;
      }
      const hasEdit = listData.some(i => i.isEdit);
      if (!hasEdit) return;
      const { target } = e;
      if (!target) return;
      const { className = '' } = target || {};
      const ITEM_CLASSNAMES = ['ant-input'];
      const isBtn = className.split(' ').some(i => ITEM_CLASSNAMES.includes(i));
      if (isBtn) {
        return;
      }
      const changeItem = listData.find(i => i.isEdit);
      const { id, pluginName } = changeItem || {};
      const { id: prevId, pluginName: prevName } = item || {};
      if (id === prevId && pluginName !== prevName) {
        onChangePlugin({ id, pluginName }).then(res => {
          if (!res) {
            return message.error('修改名称失败！');
          }
          updateList();
          setItem(null);
          message.success('修改名称成功！');
        });
        return;
      }
      const finalData = listData.map(i => {
        if (i.isEdit) {
          return { ...i, isEdit: false };
        }
        return i;
      });
      setListData(finalData);
      setItem(null);
    },
    [onChangePlugin, updateList, listData, item],
  );

  useEffect(() => {
    document.addEventListener('click', onSubmit, false);
    return () => {
      document.removeEventListener('click', onSubmit, false);
    };
  }, [onSubmit]);

  // 一键打包
  const _onPackage = useCallback(() => {
    const compNames = selectedRowKeys.map(k => k.pluginKey);
    setPackageLoading(true);
    AxiosAPI({
      method: 'post',
      url: BUILD_URL(),
      data: { compNames },
    }).then(res => {
      setPackageLoading(false);
    });
  }, [selectedRowKeys]);

  // 图片上传
  const handleChange = useCallback(
    (info, itemId) => {
      const { file } = info;
      const { status } = file;
      switch (status) {
        case 'uploading':
          break;
        case 'done':
          const { errorCode } = file.response;
          if (errorCode === 200) {
            updateList();
            message.success('上传成功！');
            break;
          }
          message.error('上传失败！');
          break;
        default:
          message.error('上传失败！');
      }
    },
    [updateList],
  );

  // 删除组件Modal
  const _onItemDelete = useCallback(
    record => {
      const { id } = record;
      Modal.confirm({
        title: '确认删除该组件？',
        cancelText: '取消',
        okText: '确定',
        // centered: true,
        onOk() {
          onDeleted({ id });
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    },
    [onDeleted],
  );

  // pluginName 双击
  const _onNameClick = useCallback(
    record => {
      if (!listData?.length) {
        return;
      }
      const isEditing = listData.some(i => i.isEdit);
      if (isEditing) return;
      const newList = listData.map(i => {
        if (i.id === record.id) {
          return {
            ...i,
            isEdit: true,
          };
        }
        return i;
      });
      setListData(newList);
      setItem(record);
    },
    [listData],
  );

  // pluginName 改变
  const _onNameChange = useCallback(
    (ev, record) => {
      const { value } = ev.target;
      const obj = { pluginName: value.trim() };
      const finalEvents = listData.map(i => {
        if (i.id === record.id) {
          return {
            ...i,
            ...obj,
          };
        }
        return i;
      });
      setListData(finalEvents);
    },
    [listData],
  );

  // 分页改变
  const _onChangePagination = useCallback(
    values => {
      const { pageSize, current } = values;
      setCompPagination({ ...pagination, pageSize, current });
      updateList({ pageSize, current });
    },
    [setCompPagination, pagination,updateList],
  );

  const TableColumns = useMemo(() => {
    return [
      {
        title: '显示名称',
        dataIndex: 'pluginName',
        align: 'center',
        width: 300,
        render: (text, record) => {
          if (!record.isEdit) {
            return (
              <span style={{ cursor: 'pointer' }} onDoubleClick={() => _onNameClick(record)}>
                {text || record.pluginKey}
              </span>
            );
          }
          return (
            <Input
              value={text}
              style={{ width: 220 }}
              placeholder={'请输入组件显示名称'}
              onChange={e => _onNameChange(e, record)}
            />
          );
        },
      },
      {
        title: '组件Key',
        dataIndex: 'pluginKey',
        align: 'center',
      },
      // {
      //   title: 'Version',
      //   dataIndex: 'version',
      //   align: 'center',
      //   render: text => {
      //     return text || '-';
      //   },
      // },
      {
        title: '更新时间',
        dataIndex: 'updateTime',
        align: 'center',
        render: text => {
          if (text) {
            return moment(Number(text)).format('YYYY-MM-DD HH:mm');
          }
          return '-';
        },
      },
      {
        title: '图片',
        dataIndex: 'pluginImageSrc',
        align: 'center',
        width: 120,
        render: (text, record) => {
          let comImg = DefaultImage;
          if (text) {
            comImg = `${API_HOST}/static/plugin/${text}`;
          }
          return (
            <p className={styles.image}>
              <img alt={`${record.name}-PIC`} src={comImg} />
            </p>
          );
        },
      },
      {
        title: '操作',
        dataIndex: 'action',
        align: 'center',
        width: 300,
        render: (text, record) => {
          return (
            <React.Fragment>
              <Upload
                className={styles.imgUpload}
                name="file"
                accept={'.jpg, .jpeg, .png'}
                data={{ id: record.id }}
                showUploadList={false}
                action={`${API_HOST}/plugin/upload`}
                method="post"
                onChange={fileInfo => handleChange(fileInfo, record.id)}
              >
                <span className={styles.imgBtn}>更新图片</span>
              </Upload>
              <Button type="link" onClick={() => onRemove(record)}>
                移动
              </Button>
              <Button type="link" onClick={() => _onItemDelete(record)} >
                删除
              </Button>
            </React.Fragment>
          );
        },
      },
    ];
  }, [handleChange, _onItemDelete, _onNameClick, _onNameChange, onRemove]);

  return (
    <section className={styles.compContent}>
      <div className={styles.nameLine}>
        <h2>{menuName || '--'}</h2>
        <div className={styles.btnWrapper}>
          <Input.Search
            placeholder="根据名称/Key搜索"
            value={keyword}
            onChange={onKeyChange}
            onSearch={onKeySearch}
            onPressEnter={onKeySearch}
          />
          <Button
            type="primary"
            onClick={_onPackage}
            disabled={selectedIds && selectedIds.length === 0}
            loading={packageLoading}
          >
            一键打包
          </Button>
          {menuId !== 'ALL' && (
            <Button type="primary" onClick={onAdd}>
              添加组件
            </Button>
          )}
        </div>
      </div>
      <Spin spinning={listLoading} size="small">
        <Table
          className={classnames('dm-table-primary', styles.table)}
          columns={TableColumns}
          dataSource={listData || []}
          pagination={{ ...pagination, total, showSizeChanger: true }}
          onChange={_onChangePagination}
          rowKey="id"
          rowSelection={{
            selectedRowKeys: selectedIds,
            onChange: (keys, selectedRows) => {
              setRowKeys(selectedRows);
            },
          }}
          rowClassName={(record, index) => {
            if (!record.isEdit) return;
            return styles.itemEdit;
          }}
        />
      </Spin>
    </section>
  );
}

CompList.propTypes = {
  data: PropTypes.object,
  selectedMenu: PropTypes.object,
  pagination: PropTypes.object,
  updateList: PropTypes.func,
  onDeleted: PropTypes.func,
  onRemove: PropTypes.func,
  onChangePlugin: PropTypes.func,
  onAdd: PropTypes.func,
  setCompPagination: PropTypes.func,
};

export default CompList;
