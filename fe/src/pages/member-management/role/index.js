import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Spin, message, Modal } from 'antd';

import { queryRoleList, addUserRole, queryRoleDetail, editUserRole } from '@/service';
import RoleHeaderFilter from './components/RoleHeaderFilter';
import RoleCardItem from './components/RoleCardItem';
import { AddRoleForm } from './components/RoleForms';

import styles from './index.less';

function RoleList(props) {
  const [listLoading, setListLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [pagination] = useState({ pageSize: 999, current: 1 });
  const [roleData, setData] = useState({});
  // Modal Params
  const [modalVis, setVisible] = useState(false);
  const [type, setType] = useState(null);
  const [roleItem, setItem] = useState(null);
  const { list = [] } = roleData || {};

  /***** 获取角色列表 *****/
  useEffect(() => {
    setListLoading(true);
    queryRoleList(pagination).then(res => {
      setListLoading(false);
      const { errorCode, data } = res || {};
      if (errorCode === 200) {
        setData(data);
      }
    });
  }, []);

  const updateList = useCallback(
    params => {
      setListLoading(true);
      queryRoleList({ ...pagination, ...params }).then(res => {
        setListLoading(false);
        const { errorCode, data } = res || {};
        if (errorCode === 200) {
          setData(data);
        }
      });
    },
    [pagination],
  );
  /***** 获取角色列表 *****/

  const _handleCancel = useCallback(() => {
    setVisible(false);
    setType(null);
    setItem(null);
  }, []);

  /***** 新增编辑+删除角色 *****/
  const onSubmit = useCallback(
    values => {
      if (values.id) {
        editUserRole(values).then(res => {
          const { errorCode } = res || {};
          setSubmitLoading(false);
          if (errorCode === 200) {
            _handleCancel();
            updateList();
            return message.success('编辑角色成功!');
          }
          message.error('编辑角色失败!');
        });
        return;
      }
      addUserRole(values).then(res => {
        const { errorCode } = res || {};
        setSubmitLoading(false);
        if (errorCode === 200) {
          _handleCancel();
          updateList();
          return message.success('添加角色成功!');
        }
        message.error('添加角色失败!');
      });
    },
    [_handleCancel, updateList],
  );

  const onAddClick = useCallback(() => {
    setVisible(true);
    setType('add');
  }, []);

  const _onEditClick = useCallback(({ id }) => {
    queryRoleDetail({ id }).then(res => {
      const { errorCode, data } = res || {};
      setVisible(true);
      setType('edit');
      if (errorCode === 200) {
        setItem(data);
      }
    });
  }, []);

  const onDeleteSubmit = useCallback(values => {
    // disabledMember(values).then(res => {
    //   const { errorCode } = res || {};
    //   if (errorCode === 200) {
    //     updateList();
    //     return message.success('删除角色成功!');
    //   }
    //   message.error('删除角色失败!');
    // });
  }, []);

  const _deleteRole = useCallback(
    values => {
      const { id } = values;
      Modal.confirm({
        title: '确认删除该角色？',
        cancelText: '取消',
        okText: '确认',
        onOk() {
          onDeleteSubmit({ role: id });
        },
        onCancel() {},
      });
    },
    [onDeleteSubmit],
  );
  /***** 新增编辑+删除角色 *****/

  const RenderItems = useMemo(() => {
    if (!list || !list.length) {
      return <p>暂无角色！</p>;
    }
    const items = list.map(item => {
      return (
        <RoleCardItem key={item.id} item={item} editRole={_onEditClick} deleteRole={_deleteRole} />
      );
    });
    return items;
  }, [list, _onEditClick, _deleteRole]);

  return (
    <section className={styles.listContent}>
      <RoleHeaderFilter total={list.length} onAddClick={onAddClick} />
      <div className={styles.list}>
        <Spin spinning={listLoading}>{RenderItems}</Spin>
      </div>
      <Modal
        className={styles.modalMain}
        visible={modalVis}
        title={type === 'edit' ? '编辑角色' : '新增角色'}
        onCancel={_handleCancel}
        footer={null}
        destroyOnClose={true}
        maskClosable={false}
      >
        {modalVis && (
          <AddRoleForm
            onClose={_handleCancel}
            onSubmit={onSubmit}
            submitLoading={submitLoading}
            item={roleItem}
          />
        )}
      </Modal>
    </section>
  );
}

RoleList.propTypes = {};

export default RoleList;
