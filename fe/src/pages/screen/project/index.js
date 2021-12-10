import React, { useState, useCallback, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { useDebounce } from '@react-hook/debounce';
import { useUpdateState } from '@/hooks';
import DataConfig from '@/components/DataConfig';
import { Table, Button, Modal, Pagination, Input, Drawer } from 'antd';
import { ProjectModal, ProjectConfig, CompListDrawer } from './components/index';

import styles from './index.less';

const { Search } = Input;
const { confirm } = Modal;

const pageColumns = [
  {
    title: '项目id',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    width: 160,
    render: (text, record) => {
      const { id, tagId } = record;
      const btnPreview = () =>
        window.open(`${window.location.origin}/preview?pageId=${id}&tagId=${tagId}`);

      const btnEdit = () =>
        window.open(`${window.location.origin}/edit?pageId=${id}&tagId=${tagId}`);
      return (
        <>
          <Button style={{ paddingLeft: 0 }} type="link" onClick={btnPreview}>
            预览
          </Button>
          <Button style={{ paddingRight: 0 }} type="link" onClick={btnEdit}>
            编辑
          </Button>
        </>
      );
    },
  },
];

function sliceList(data, page, pageSize) {
  return (data || []).slice((page - 1) * pageSize, page * pageSize);
}

const defaultPagination = { current: 1, pageSize: 10 };

function Project(props) {
  const {
    updateState,
    getProjectPageList,
    getProjectList,
    addProject,
    editProject,
    deleteProject,
    fetchListLoading,
    addProjectLoading,
    editProjectLoading,
    deleteProjectLoading,
    projectList,
    currentUser,
    fetchPageListLoading,
  } = props;

  const [clickTagRowKey, setClickTagRowKey] = useState();
  const [pagination, setPagination] = useState(defaultPagination);
  const [keywords, setKeywords] = useDebounce(undefined, 800);
  const [{ visible, isEdit, currentInfo }, setModalInfo] = useState({
    visible: false,
    isEdit: false,
    currentInfo: null,
  });

  const [dataSourceVis, setDataSourceVis] = useState(false);
  const [nowClick, setClick] = useState(null);
  const [projectConfigVis, setProjectConfigVis] = useState(false);
  const [{ compListDrawerVisible, selectProject }, updateThisState] = useUpdateState({
    compListDrawerVisible: false,
    selectProject: null,
  });

  const projectConfigProps = {
    visible: projectConfigVis,
    setProjectConfigVis,
    onCancel() {
      setProjectConfigVis(false);
    },
    getProjectPageList,
    tagId: nowClick?.id,
  };

  const itemClick = useCallback(record => {
    setDataSourceVis(true);
    setClick(record);
  }, []);

  const pageSwitchClick = useCallback(record => {
    setClick(record);
    setProjectConfigVis(true);
  }, []);

  const onClose = () => {
    setDataSourceVis(false);
  };

  /**
   * 获取列表
   */
  const fetchProjectList = useCallback(() => {
    const payload = { pageSize: 999 };
    getProjectList(payload);
  }, [getProjectList]);

  /**
   * 搜索框
   */
  const onSearchChange = useCallback(
    e => {
      const value = e.target.value;
      setKeywords(value);
      setPagination(defaultPagination);
    },
    [setKeywords, setPagination],
  );

  const goToAdd = useCallback(() => {
    setModalInfo(v => {
      return {
        ...v,
        visible: true,
        isEdit: false,
        currentInfo: null,
      };
    });
  }, []);

  /**
   * 添加、编辑
   */
  const handleOk = useCallback(
    values => {
      if (isEdit) {
        editProject({ ...values, id: currentInfo.id, userId: currentUser.id }).then(success => {
          if (success) {
            setModalInfo(v => {
              return {
                ...v,
                visible: false,
                currentInfo: null,
              };
            });
            fetchProjectList();
          }
        });
        return;
      }
      addProject({ ...values, userId: currentUser.id }).then(success => {
        if (success) {
          setModalInfo(v => {
            return {
              ...v,
              visible: false,
              currentInfo: null,
            };
          });
          fetchProjectList();
        }
      });
    },
    [isEdit, currentUser, currentInfo, addProject, editProject, fetchProjectList],
  );

  const handleCancel = useCallback(() => {
    setModalInfo(v => {
      return {
        ...v,
        visible: false,
        currentInfo: null,
        isEdit: false,
      };
    });
  }, []);

  /**
   * 表格编辑按钮
   */
  const btnEdit = useCallback(current => {
    setModalInfo(v => {
      return {
        ...v,
        visible: true,
        isEdit: true,
        currentInfo: current,
      };
    });
  }, []);

  /**
   * 删除
   */
  const handleDelete = useCallback(
    id => {
      deleteProject({ id, status: 0 }).then(success => {
        if (success) {
          setPagination(defaultPagination);
          fetchProjectList();
        }
      });
    },
    [deleteProject, setPagination, fetchProjectList],
  );

  const showDeleteConfirm = useCallback(
    id => {
      confirm({
        title: '删除',
        content: '是否删除此项目 ？',
        onOk() {
          handleDelete(id);
        },
        okButtonProps: { loading: deleteProjectLoading },
        onCancel() {},
      });
    },
    [handleDelete, deleteProjectLoading],
  );

  const handleCheckUsedCompList = useCallback(
    record => {
      updateThisState({ compListDrawerVisible: true, selectProject: record });
    },
    [updateThisState],
  );

  const onChange = useCallback((page, pageSize) => {
    setPagination({ current: page, pageSize });
  }, []);

  /**
   * 初始化数据
   */
  useEffect(() => {
    fetchProjectList();
  }, [fetchProjectList]);

  const projectColumns = useMemo(() => {
    return [
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        width: 120,
      },
      {
        title: '所属颜色',
        dataIndex: 'color',
        key: 'color',
        width: 120,
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        width: 120,
        render: (text, record) => {
          const { id } = record;
          return (
            <>
              <Button
                className={styles.btn}
                type="link"
                onClick={() => btnEdit(record)}
                // disabled={currentUser.userName !== 'admin' && currentUser.id !== userId}
              >
                编辑
              </Button>
              <Button
                className={styles.btn}
                type="link"
                onClick={() => itemClick(record)}
                // disabled={currentUser.userName !== 'admin' && currentUser.id !== userId}
              >
                数据设置
              </Button>
              <Button
                className={styles.btn}
                type="link"
                onClick={() => pageSwitchClick(record)}
                // disabled={currentUser.userName !== 'admin' && currentUser.id !== userId}
              >
                项目配置
              </Button>
              <Button
                className={styles.btn}
                type="link"
                onClick={() => showDeleteConfirm(id)}
                disabled={currentUser.userName !== 'admin'}
              >
                删除
              </Button>
              <Button
                className={styles.btn}
                type="link"
                onClick={() => handleCheckUsedCompList(record)}
                disabled={currentUser.userName !== 'admin'}
              >
                已使用组件
              </Button>
            </>
          );
        },
      },
    ];
  }, [
    currentUser,
    btnEdit,
    itemClick,
    pageSwitchClick,
    showDeleteConfirm,
    handleCheckUsedCompList,
  ]);

  const { dataSource, totalData } = useMemo(() => {
    const { current, pageSize } = pagination;
    const t = (projectList || []).filter(item =>
      `${item.id}${item.name}`.toLowerCase().includes((keywords || '').trim().toLowerCase()),
    );
    const d = sliceList(t, current, pageSize, keywords);
    return { dataSource: d, totalData: t };
  }, [projectList, pagination, keywords]);

  const modalProps = {
    visible,
    currentInfo,
    isEdit,
    okButtonLoading: addProjectLoading || editProjectLoading,
    handleOk,
    handleCancel,
  };

  const dataConfigProps = {
    hiddenApiRouter: true,
    defaultActiveKey: 'EnvConfig',
    tagId: nowClick?.id,
  };

  /**
   * 项目展开
   */
  const onExpand = useCallback(
    (expanded, record) => {
      const { id, pageList } = record;
      if (expanded && !pageList?.length) {
        getProjectPageList({ tagId: id, current: 1, pageSize: 999 }).then(data => {
          const _tags = (projectList || []).map(n => {
            if (n.id === id) {
              n.pageList = data?.list || [];
            }
            return n;
          });
          updateState({ projectList: _tags });
        });
      }
      setClickTagRowKey(expanded ? id : undefined);
    },
    [updateState, getProjectPageList, projectList],
  );

  /**
   * 项目展开渲染
   */
  const expandedRowRender = useCallback(
    record => {
      const { id, pageList } = record;
      const loading = clickTagRowKey === id && fetchPageListLoading;
      return (
        <Table
          rowKey="id"
          bordered={false}
          showHeader={false}
          columns={pageColumns}
          dataSource={pageList}
          pagination={false}
          loading={loading}
        />
      );
    },
    [clickTagRowKey, fetchPageListLoading],
  );

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <Search
          onChange={onSearchChange}
          allowClear={true}
          size="large"
          placeholder="名称，id"
          className={styles.search}
        />
        <Button className={styles.add} type="primary" onClick={goToAdd}>
          添加
        </Button>
      </div>
      <span className={styles.total}>
        共<span>{totalData.length}</span>条
      </span>
      <div className="dm-table-primary">
        <Table
          rowKey="id"
          loading={fetchListLoading}
          dataSource={dataSource}
          columns={projectColumns}
          expandedRowRender={expandedRowRender}
          // expandRowByClick={true}
          onExpand={onExpand}
          pagination={false}
        />
      </div>

      <Pagination
        className="dm-pagination-default"
        current={pagination.current}
        pageSize={pagination.pageSize}
        showQuickJumper={true}
        showSizeChanger={true}
        onChange={onChange}
        onShowSizeChange={onChange}
        total={(totalData || []).length}
      />

      <ProjectModal {...modalProps} />

      <Drawer
        destroyOnClose={true}
        title={nowClick?.name}
        width={500}
        visible={dataSourceVis}
        onClose={onClose}
      >
        <DataConfig {...dataConfigProps}></DataConfig>
      </Drawer>
      <ProjectConfig {...projectConfigProps}></ProjectConfig>
      <CompListDrawer
        visible={compListDrawerVisible}
        data={selectProject}
        onChange={updateThisState}
      />
    </div>
  );
}

Project.propTypes = {
  updateState: PropTypes.func,
  getProjectPageList: PropTypes.func,
  getProjectList: PropTypes.func,
  addProject: PropTypes.func,
  editProject: PropTypes.func,
  deleteProject: PropTypes.func,
  fetchListLoading: PropTypes.bool,
  addProjectLoading: PropTypes.bool,
  editProjectLoading: PropTypes.bool,
  deleteProjectLoading: PropTypes.bool,
  projectList: PropTypes.array,
  currentUser: PropTypes.object,
};

const mapStateToProps = ({ project, loading, users }) => ({
  fetchPageListLoading: loading.effects['project/getProjectPageList'],
  fetchListLoading: loading.effects['project/getProjectList'],
  addProjectLoading: loading.effects['project/addProject'],
  editProjectLoading: loading.effects['project/editProject'],
  deleteProjectLoading: loading.effects['project/deleteProject'],
  projectList: project.projectList,
  currentUser: users.currentUser,
});

const mapDispatchToProps = dispatch => ({
  updateState: payload =>
    dispatch({
      type: 'project/updateState',
      payload,
    }),
  getProjectList: payload =>
    dispatch({
      type: 'project/getProjectList',
      payload,
    }),
  addProject: payload =>
    dispatch({
      type: 'project/addProject',
      payload,
    }),
  editProject: payload =>
    dispatch({
      type: 'project/editProject',
      payload,
    }),
  deleteProject: payload =>
    dispatch({
      type: 'project/deleteProject',
      payload,
    }),
  getProjectPageList: payload =>
    dispatch({
      type: 'project/getProjectPageList',
      payload,
    }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Project);
