import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Spin, Table, Modal, message } from 'antd';
import classnames from 'classnames';

import { queryMemberList, addMembers, disabledMember, editMember } from '@/service';

import { AddForm, ResetForm } from './components/MemberForms';
import MemberHeaderFilter from './components/MemberHeaderFilter';
import { _getColumns, pageParams } from './helper';
import styles from './index.less';

function Member(props) {
  const [listLoading, setListLoading] = useState(false);
  const [pagination, setPagination] = useState(pageParams);
  const [data, setData] = useState({});
  // Modal Params
  const [modalVis, setVisible] = useState(false);
  const [type, setType] = useState(null);
  const [userItem, setItem] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const { list, total } = data || {};

  /***** 获取用户列表 *****/
  useEffect(() => {
    setListLoading(true);
    queryMemberList(pagination).then(res => {
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
      queryMemberList({ ...pagination, ...params }).then(res => {
        setListLoading(false);
        const { errorCode, data } = res || {};
        if (errorCode === 200) {
          setData(data);
        }
      });
    },
    [pagination],
  );
  /***** 获取用户列表 *****/

  const _handleCancel = useCallback(() => {
    setVisible(false);
    setType(null);
    setItem(null);
  }, []);

  /***** 新增用户+重置用户密码 *****/
  const onAddSubmit = useCallback(
    values => {
      setSubmitLoading(true);
      if (values.id) {
        editMember(values).then(res => {
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
      addMembers(values).then(res => {
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

  const onUserEdit = useCallback(record => {
    setVisible(true);
    setType('edit');
    setItem(record);
  }, []);

  const onResetSubmit = useCallback(
    values => {
      setSubmitLoading(true);
      editMember(values).then(res => {
        const { errorCode } = res || {};
        setSubmitLoading(false);
        if (errorCode === 200) {
          _handleCancel();
          updateList();
          return message.success('用户密码更新成功!');
        }
        message.error('用户密码更新失败!');
      });
    },
    [updateList, _handleCancel],
  );
  const onResetPassword = useCallback(values => {
    setVisible(true);
    setType('reset');
    setItem(values);
  }, []);
  /***** 新增用户+重置用户密码 *****/

  /***** 禁用启用用户 *****/
  const onDisabledSubmit = useCallback(
    values => {
      disabledMember(values).then(res => {
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

  const onUserDisabled = useCallback(
    values => {
      const { id, status } = values;
      const title = status ? '确认禁用该用户？' : '确认启用该用户？';
      const confirmStatus = Number(!status);
      Modal.confirm({
        title: title,
        cancelText: '取消',
        okText: '确认',
        onOk() {
          onDisabledSubmit({ userId: id, status: confirmStatus });
        },
        onCancel() {},
      });
    },
    [onDisabledSubmit],
  );

  /***** 分页改变 *****/
  const _onChangePagination = useCallback(
    values => {
      const { pageSize, current } = values;
      setPagination({ ...pagination, pageSize, current });
      updateList({ pageSize, current });
    },
    [pagination],
  );

  const RenderTitle = useMemo(() => {
    if (type === 'reset') {
      return '重置用户密码';
    }
    if (type === 'add') {
      return '新增用户';
    }
    return '编辑用户';
  }, [type]);

  return (
    <section className={styles.listContent}>
      <MemberHeaderFilter total={total} onAddClick={onAddClick} />
      <Spin spinning={listLoading} size="small">
        <Table
          className={classnames('dm-table-primary', styles.table)}
          columns={_getColumns({
            onDisabled: onUserDisabled,
            onReset: onResetPassword,
            onEdit: onUserEdit,
          })}
          dataSource={list || []}
          pagination={{ ...pagination, total, showSizeChanger: true }}
          onChange={_onChangePagination}
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
        {modalVis && type !== 'reset' && (
          <AddForm
            onClose={_handleCancel}
            onSubmit={onAddSubmit}
            submitLoading={submitLoading}
            item={userItem}
          />
        )}
        {type === 'reset' && (
          <ResetForm
            onClose={_handleCancel}
            onSubmit={onResetSubmit}
            item={userItem}
            submitLoading={submitLoading}
          />
        )}
      </Modal>
    </section>
  );
}

Member.propTypes = {};

export default Member;
