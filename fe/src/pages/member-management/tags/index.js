import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Spin, Table, Modal, message } from 'antd';
import classnames from 'classnames';

import { queryTagsList, addPageTags, editPageTags, deletePageTags } from '@/service';

import { AddForm } from './components/Forms';
import HeaderFilter from './components/HeaderFilter';
import { _getColumns, pageParams } from './helper';
import styles from './index.less';

const LABELS = [
  {
    name: '自由布局',
    id: 'customization',
    isDefault: true,
  },
  {
    name: '栅格布局',
    id: 'grid',
    isDefault: true,
  },
  {
    name: '互联网',
    id: 1,
  },
  {
    name: '数字大屏',
    id: 3,
  },
  {
    name: '特效',
    id: 4,
  },
];

function TagsPage(props) {
  const [listLoading, setListLoading] = useState(false);
  const [data, setData] = useState({});
  // Modal Params
  const [modalVis, setVisible] = useState(false);
  const [type, setType] = useState(null);
  const [currentItem, setItem] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const { list, total } = data || {};

  /***** 获取标签列表 *****/
  useEffect(() => {
    setListLoading(true);
    queryTagsList(pageParams).then(res => {
      setListLoading(false);
      const { errorCode, data } = res || {};
      if (errorCode === 200) {
        setData({ total: 11, list: LABELS });
      }
    });
  }, []);

  const updateList = useCallback(params => {
    setListLoading(true);
    queryTagsList({ ...pageParams, ...params }).then(res => {
      setListLoading(false);
      const { errorCode, data } = res || {};
      if (errorCode === 200) {
        setData({ total: 11, list: LABELS });
      }
    });
  }, []);
  /***** 获取标签列表 *****/

  const _handleCancel = useCallback(() => {
    setVisible(false);
    setType(null);
    setItem(null);
  }, []);

  /***** 新增标签 *****/
  const onAddSubmit = useCallback(
    values => {
      setSubmitLoading(true);
      if (values.id) {
        editPageTags(values).then(res => {
          const { errorCode } = res || {};
          setSubmitLoading(false);
          if (errorCode === 200) {
            _handleCancel();
            updateList();
            return message.success('编辑用户成功!');
          }
          message.error('编辑用户失败!');
        });
        return;
      }
      addPageTags(values).then(res => {
        const { errorCode } = res || {};
        setSubmitLoading(false);
        if (errorCode === 200) {
          _handleCancel();
          updateList();
          return message.success('添加用户成功!');
        }
        message.error('添加用户失败!');
      });
    },
    [updateList, _handleCancel],
  );

  const onAddClick = useCallback(() => {
    setVisible(true);
    setType('add');
  }, []);

  const onEditTag = useCallback(record => {
    setVisible(true);
    setType('edit');
    setItem(record);
  }, []);
  /***** 新增标签 *****/

  /***** 删除标签 *****/
  const onDeletedSubmit = useCallback(
    values => {
      deletePageTags(values).then(res => {
        const { errorCode } = res || {};
        if (errorCode === 200) {
          updateList();
          return message.success('修改用户状态成功!');
        }
        message.error('修改用户状态失败!');
      });
    },
    [updateList],
  );

  const onDeletedTag = useCallback(
    values => {
      const { id } = values;
      Modal.confirm({
        title: '确认删除该标签？',
        cancelText: '取消',
        okText: '确认',
        onOk() {
          onDeletedSubmit({ id });
        },
        onCancel() {},
      });
    },
    [onDeletedSubmit],
  );
  /***** 删除标签 *****/

  const RenderTitle = useMemo(() => {
    if (type === 'add') {
      return '新增标签';
    }
    return '编辑标签';
  }, [type]);

  return (
    <section className={styles.listContent}>
      <HeaderFilter total={total} onAddClick={onAddClick} />
      <Spin spinning={listLoading} size="small">
        <Table
          className={classnames('dm-table-primary', styles.table)}
          columns={_getColumns({
            onDeleted: onDeletedTag,
            onEdit: onEditTag,
          })}
          dataSource={list || []}
          pagination={false}
          rowKey="id"
        />
      </Spin>

      <Modal
        className={styles.modalMain}
        visible={modalVis}
        title={RenderTitle}
        onCancel={_handleCancel}
        footer={null}
        destroyOnClose={true}
        maskClosable={false}
      >
        {modalVis && (
          <AddForm
            onClose={_handleCancel}
            onSubmit={onAddSubmit}
            submitLoading={submitLoading}
            item={currentItem}
          />
        )}
      </Modal>
    </section>
  );
}

TagsPage.propTypes = {};

export default TagsPage;
