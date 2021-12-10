import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';

import { Modal, message } from 'antd';

import { queryMenuList, queryCompList } from '@/service';
import SideList from './components/SideList';
import CompList from './components/CompList';
import ClassifyForm from './components/ClassifyForm';
import CompForm from './components/CompForm';
import MoveContent from './components/MoveContent';
import { ALL_MENU, queryListData } from './helper';
import styles from './index.less';

const menuPage = { pageSize: 999, current: 1 };
const compPage = { pageSize: 10, current: 1, keyword: null };
function Comp(props) {
  const { loading, addMenuItem, editMenuItem, onChangePlugin, addPluginItem, currentUser } = props;
  console.log('currentUsercurrentUsercurrentUser', currentUser);
  const [menus, setMenus] = useState({});
  // 左侧Menu编辑时的Item
  const [menuItem, setEdit] = useState(null);
  // 左侧Menu选中的Item
  const [selectedMenu, setSelectedMenu] = useState(null);
  // 右侧组件列表
  const [compData, setCompData] = useState({});
  const [compPagination, setCompPagination] = useState(compPage);
  const [compListLoading, setCompListLoading] = useState(false);
  // 右侧移动的组件Item
  const [moveItem, setMoveItem] = useState(null);
  // Modal相关
  const [modalVis, setModalVis] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalType, setModalType] = useState(null);

  // 获取Menu 列表
  const updateMenuList = useCallback(() => {
    queryMenuList(menuPage).then(res => {
      const data = queryListData(res);
      setMenus(data);
    });
  }, []);

  // 获取右侧对应组件列表
  const updateCompList = useCallback(
    params => {
      const { id } = selectedMenu || {};
      setCompListLoading(true);
      queryCompList({ pluginTagId: id === 'ALL' ? null : id, ...compPagination, ...params }).then(
        res => {
          setCompListLoading(false);
          const data = queryListData(res);
          setCompData(data);
        },
      );
    },
    [selectedMenu, compPagination],
  );

  // 获取Menu列表
  useEffect(() => {
    queryMenuList(menuPage).then(res => {
      const data = queryListData(res);
      setMenus(data);
      setSelectedMenu(ALL_MENU);
      setCompListLoading(true);
      queryCompList({ pluginTagId: null, ...compPagination }).then(res => {
        setCompListLoading(false);
        const data = queryListData(res);
        setCompData(data);
      });
    });
  }, [setMenus, setSelectedMenu, setCompListLoading, setCompData, compPagination]);

  const handleCancel = useCallback(() => {
    setModalVis(false);
    setModalTitle('');
    setModalType(null);
    setMoveItem(null);
    setEdit(null);
  }, []);

  /**
   * Left Menu
   */
  const showAddModal = useCallback(() => {
    setModalVis(true);
    setModalTitle('添加分类');
    setModalType('add');
  }, []);

  // 左侧menu点击事件
  const onSideClick = useCallback(
    reocrd => {
      setSelectedMenu(reocrd);
      setCompPagination(compPage);
      updateCompList({ pluginTagId: reocrd.id === 'ALL' ? null : reocrd.id, ...compPage });
    },
    [updateCompList],
  );

  // 左侧编辑
  const onSideEdit = useCallback(reocrd => {
    setEdit(reocrd);
    setModalVis(true);
    setModalTitle('编辑分类');
    setModalType('add');
  }, []);

  const onSortClick = useCallback(
    (operateData, record) => {
      const newArr = operateData?.newArr;
      const newZIndex = newArr?.find(n => n?.id === record?.id)?.zIndex;
      const params = { id: record?.id, zIndex: newZIndex };
      if (!newArr) return;
      editMenuItem(params).then(res => {
        if (!res) {
          return message.error('移动失败！');
        }
        message.success('移动成功！');
        setMenus(newArr);
      });
    },
    [editMenuItem],
  );

  // menu新增编辑提交事件
  const onClassifySubmit = useCallback(
    values => {
      const { id: selectId } = selectedMenu || {};
      const { id } = values || {};
      if (id) {
        editMenuItem(values).then(res => {
          if (!res) {
            return message.error('编辑失败！');
          }
          handleCancel();
          updateMenuList();
          message.success('编辑成功！');
          if (id === selectId) {
            setSelectedMenu({ ...selectedMenu, name: values.name });
          }
        });
        return;
      }

      addMenuItem(values).then(res => {
        if (!res) {
          return message.error('新增失败！');
        }
        handleCancel();
        updateMenuList();
        message.success('新增成功！');
      });
    },
    [selectedMenu, addMenuItem, handleCancel, updateMenuList, editMenuItem],
  );

  /**
   * Right Table
   */
  const onDeleted = useCallback(
    params => {
      const { id } = params;
      if (!id) return;
      onChangePlugin({ status: 0, id }).then(res => {
        if (!res) {
          return message.error('删除失败！');
        }
        handleCancel();
        updateCompList();
        message.success('删除成功！');
      });
    },
    [updateCompList, handleCancel, onChangePlugin],
  );

  // 添加组件
  const _onAddComp = useCallback(() => {
    setModalVis(true);
    setModalTitle('添加组件');
    setModalType('comp');
  }, []);

  // 移动组件
  const _onMoveComp = useCallback(record => {
    setModalVis(true);
    setModalTitle('移动组件');
    setModalType('edit');
    setMoveItem(record);
  }, []);

  const onMoveSubmit = useCallback(
    values => {
      const { id } = moveItem || {};
      if (!id) return;
      onChangePlugin({ ...values, id }).then(res => {
        if (!res) {
          return message.error('组件移动失败！');
        }
        handleCancel();
        updateCompList();
        message.success('组件移动成功！');
      });
    },
    [moveItem, onChangePlugin, updateCompList, handleCancel],
  );

  const onAddCompSubmit = useCallback(
    values => {
      const { id, type } = selectedMenu || {};
      if (!id) return;
      addPluginItem({ ...values, pluginTagId: id, type }).then(res => {
        if (!res) {
          return message.error('添加组件失败！');
        }
        handleCancel();
        updateCompList();
        message.success('添加组件成功！');
      });
    },
    [addPluginItem, updateCompList, selectedMenu, handleCancel],
  );

  return (
    <div className={styles.compWrapper}>
      <SideList
        data={menus}
        selectedItem={selectedMenu}
        onItemClick={onSideClick}
        onItemEdit={onSideEdit}
        onSortClick={onSortClick}
        onAdd={showAddModal}
      />
      <CompList
        data={compData}
        selectedMenu={selectedMenu}
        pagination={compPagination}
        onDeleted={onDeleted}
        onRemove={_onMoveComp}
        updateList={updateCompList}
        onChangePlugin={onChangePlugin}
        onAdd={_onAddComp}
        setCompPagination={setCompPagination}
        listLoading={compListLoading}
      />

      <Modal
        className={styles.modalMain}
        visible={modalVis}
        title={modalTitle}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose={true}
        maskClosable={false}
      >
        {modalType === 'add' && (
          <ClassifyForm
            handleCancel={handleCancel}
            onSubmit={onClassifySubmit}
            item={menuItem}
            submitLoading={
              loading.effects['compPage/addMenuItem'] || loading.effects['compPage/editMenuItem']
            }
          />
        )}
        {modalType === 'edit' && (
          <MoveContent
            handleCancel={handleCancel}
            onSubmit={onMoveSubmit}
            menuList={menus?.list}
            moveItem={moveItem}
            submitLoading={loading.effects['compPage/onChangePlugin']}
          />
        )}
        {modalType === 'comp' && (
          <CompForm
            handleCancel={handleCancel}
            onSubmit={onAddCompSubmit}
            submitLoading={loading.effects['compPage/addPluginItem']}
          />
        )}
      </Modal>
    </div>
  );
}

Comp.propTypes = {
  loading: PropTypes.object,
  addMenuItem: PropTypes.func,
  editMenuItem: PropTypes.func,
  onChangePlugin: PropTypes.func,
  addPluginItem: PropTypes.func,
};

const mapStateToProps = ({ loading, compPage, users }) => {
  return { loading, currentUser: users.currentUser };
};

const mapDispatchToProps = dispatch => ({
  addMenuItem: payload => {
    return dispatch({
      type: 'compPage/addMenuItem',
      payload,
    });
  },
  editMenuItem: payload => {
    return dispatch({
      type: 'compPage/editMenuItem',
      payload,
    });
  },
  onChangePlugin: payload => {
    return dispatch({
      type: 'compPage/onChangePlugin',
      payload,
    });
  },
  addPluginItem: payload => {
    return dispatch({
      type: 'compPage/addPluginItem',
      payload,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Comp);
