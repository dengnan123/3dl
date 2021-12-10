import React, { useState, useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Pagination, Card, Input, Button, Spin, Form, Modal } from 'antd';
import { GridList } from '@/components/index';
import LoadingDemo from '@/components/InputLoadingStyle/Demo';
import LoadingModal from '@/components/InputLoadingStyle/LoadingModal';

import styles from './index.less';

const { Search } = Input;

const colSpan = {
  xs: { span: 24 },
  sm: { span: 24 },
  md: { span: 12 },
  lg: { span: 12 },
  xl: { span: 6 },
  xxl: { span: 6 },
};

const defaultPagination = { current: 1, pageSize: 12 };

function LoadingTemp(props) {
  const {
    form,
    getLoadingList,
    addLoading,
    editLoading,
    deleteLoading,
    listLoading,
    addOperateLoading,
    editOperateLoading,
    loadingList,
    totalLoading,
  } = props;

  const searchRef = useRef(null);
  const keywordRef = useRef(undefined);
  const searchTimer = useRef(null);

  const [pagination, setPagination] = useState(defaultPagination);
  const [{ visible, currentInfo, isEdit }, setModalInfo] = useState({
    visible: false,
    currentInfo: null,
    isEdit: false,
  });

  /**
   * 获取列表
   */
  const fetchLoadingList = useCallback(() => {
    const payload = {
      keyword: keywordRef.current,
      ...pagination,
    };

    getLoadingList(payload);
  }, [pagination, getLoadingList]);

  const onChange = useCallback((page, pageSize) => {
    setPagination({ current: page, pageSize });
  }, []);

  /**
   * 搜索框
   */
  const onSearchChange = useCallback(e => {
    const value = e.target.value;

    searchTimer.current && clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      keywordRef.current = value;
      setPagination(state => ({ ...state, current: 1 }));
      clearTimeout(searchTimer.current);
    }, 800);
  }, []);

  /**
   * 重置条件
   */
  const handleReset = useCallback(() => {
    keywordRef.current = undefined;
    setPagination(defaultPagination);
    searchRef.current.input.setValue();
  }, []);

  /**
   * 删除
   */
  const showConfirm = useCallback(id => {
    Modal.confirm({
      title: '删除',
      content: '确定要删除吗?',
      onOk: () =>
        new Promise(async (resolve, reject) => {
          const success = await deleteLoading({ id, status: 0 });
          resolve(success);
        }),
    });
  }, []);

  const gotoAdd = useCallback(() => {
    setModalInfo(state => ({ ...state, visible: true, currentInfo: null, isEdit: false }));
  }, []);

  /**
   * 前往编辑
   */
  const btnEdit = useCallback(current => {
    const currentInfo = { ...current, loadingStyle: JSON.parse(current?.loadingStyle) };
    setModalInfo(state => ({ ...state, visible: true, currentInfo, isEdit: true }));
  }, []);

  const handleCancel = useCallback(() => {
    setModalInfo(state => ({ ...state, visible: false }));
  }, []);

  const handleOk = useCallback(
    async values => {
      let params = values;

      function cb() {
        setModalInfo(state => ({ ...state, visible: false }));
        fetchLoadingList();
      }

      if (isEdit) {
        params.id = currentInfo?.id;
        const editSuccess = await editLoading(params);
        editSuccess && cb();
        return;
      }
      const addSuccess = await addLoading(params);
      addSuccess && cb();
    },
    [isEdit, addLoading, fetchLoadingList],
  );

  /**
   * 初始化数据
   */
  useEffect(() => {
    fetchLoadingList();
  }, [fetchLoadingList]);

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <Search
          ref={searchRef}
          onChange={onSearchChange}
          allowClear={true}
          size="large"
          placeholder="名称，id"
          className={styles.search}
        />

        <span className={styles.selectBox}>
          {keywordRef.current && (
            <Button type="link" onClick={handleReset}>
              重置
            </Button>
          )}
        </span>

        <Button className={styles.add} type="primary" onClick={gotoAdd}>
          添加
        </Button>
      </div>
      <div className={styles.desc}>
        <span className={styles.total}>
          共<span>{totalLoading}</span>个
        </span>
      </div>

      <Spin spinning={listLoading}>
        <GridList
          colProps={colSpan}
          dataSource={loadingList}
          renderItem={n => {
            const { id, name, loadingStyle } = n;
            return (
              <Card className={styles.card} hoverable={true}>
                <div className={styles.corverImg}>
                  <div className={styles.view}>
                    <LoadingDemo value={JSON.parse(loadingStyle)} />
                  </div>
                </div>
                <div className={styles.title}>
                  <span>{name}</span>
                </div>
                <div className={styles.operateBtn}>
                  <Button type="link" style={{ marginLeft: '15px' }} onClick={() => btnEdit(n)}>
                    编辑
                  </Button>

                  <Button
                    type="link"
                    onClick={() => {
                      showConfirm(id);
                    }}
                    disabled={true}
                  >
                    删除
                  </Button>
                </div>
              </Card>
            );
          }}
        />
      </Spin>

      <Pagination
        className="dm-pagination-default"
        current={pagination.current}
        pageSize={pagination.pageSize}
        showQuickJumper={true}
        showSizeChanger={true}
        pageSizeOptions={['12', '24', '36', '48']}
        onChange={onChange}
        onShowSizeChange={onChange}
        total={totalLoading}
      />

      <LoadingModal
        form={form}
        title={isEdit ? '编辑Loading' : '添加Loading'}
        visible={visible}
        value={currentInfo}
        okButtonProps={{ loading: addOperateLoading || editOperateLoading }}
        onOk={handleOk}
        onCancel={handleCancel}
      />
    </div>
  );
}

LoadingTemp.propTypes = {
  updateState: PropTypes.func,
  getLoadingList: PropTypes.func,
  getLoadingDetail: PropTypes.func,
  addLoading: PropTypes.func,
  editLoading: PropTypes.func,
  deleteLoading: PropTypes.func,
  form: PropTypes.object,
  loadingList: PropTypes.array,
  totalLoading: PropTypes.number,
  listLoading: PropTypes.bool,
  addOperateLoading: PropTypes.bool,
  editOperateLoading: PropTypes.bool,
  deleteOperateLoading: PropTypes.bool,
};

const mapStateToProps = ({ loadingTemp, loading }) => {
  return {
    loadingList: loadingTemp.loadingList,
    totalLoading: loadingTemp.totalLoading,
    listLoading: loading.effects['loadingTemp/getLoadingList'],
    addOperateLoading: loading.effects['loadingTemp/addLoading'],
    editOperateLoading: loading.effects['loadingTemp/editLoading'],
    deleteOperateLoading: loading.effects['loadingTemp/deleteLoading'],
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateState: payload =>
      dispatch({
        type: 'loadingTemp/updateState',
        payload,
      }),
    getLoadingList: payload =>
      dispatch({
        type: 'loadingTemp/getLoadingList',
        payload,
      }),
    getLoadingDetail: payload =>
      dispatch({
        type: 'loadingTemp/getLoadingDetail',
        payload,
      }),
    addLoading: payload =>
      dispatch({
        type: 'loadingTemp/addLoading',
        payload,
      }),
    editLoading: payload =>
      dispatch({
        type: 'loadingTemp/editLoading',
        payload,
      }),
    deleteLoading: payload =>
      dispatch({
        type: 'loadingTemp/deleteLoading',
        payload,
      }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(LoadingTemp));
