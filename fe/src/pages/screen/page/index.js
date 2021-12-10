import React, { useState, useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { useDebounce } from '@react-hook/debounce';
// import classnames from 'classnames';
import router from 'umi/router';
import { Pagination, Card, Input, Select, Button, Modal } from 'antd';
// import { copyToClip } from '@/helpers/screen';
import { staticPath } from '@/config';
import defPic from '@/assets/no-pic.png';
import { GridList, ListTypeSwitch, PageViewModal } from '@/components/index';
import { USER_TYPE, LAYOUT_TYPE } from './const';
import { AddModal } from './components/index';

import styles from './index.less';

const { Search } = Input;
const { confirm } = Modal;
const { ListTypeEnums } = ListTypeSwitch;

const colSpan = {
  xs: { span: 24 },
  sm: { span: 24 },
  md: { span: 12 },
  lg: { span: 6 },
  xl: { span: 6 },
  xxl: { span: 4 },
};

const defaultPagination = { current: 1, pageSize: 24 };

function Page(props) {
  const {
    submit,
    getList,
    delPage,
    updatePage,
    creatPageByTemp,
    savePageConfig,
    listLoading,
    pageList,
    totalPage,
    projectList,
    currentUser,
    submitLoading,
    creatPageByTempLoading,
  } = props;

  const { onlyRead } = currentUser;

  const searchRef = useRef(null);

  const [selectPropject, setSelectPropject] = useState(undefined);
  const [selectType, setSelectType] = useState(undefined);
  const [layoutType, setLayoutType] = useState(undefined);
  const [keyword, setKeyword] = useDebounce(undefined, 800);
  const [listType, setListType] = useState(ListTypeEnums.grid);
  const [pagination, setPagination] = useState(defaultPagination);
  const [{ addVisible, isUseTemp, currentInfo, isEdit }, setModalInfo] = useState({
    addVisible: false,
    currentInfo: null,
    isEdit: false,
    isUseTemp: false,
  });

  const [{ pageViewModalVisbile, selectPageInfo }, setPageViewModalInfo] = useState({
    pageViewModalVisbile: false,
    selectPageInfo: null,
  });

  /**
   * 获取列表
   */
  const fetchPageList = useCallback(() => {
    const payload = {
      layoutType,
      keyword,
      ...pagination,
    };
    if (selectType === 'my') {
      payload.userId = currentUser?.id;
    }
    if (selectPropject !== 'all') {
      payload.tagId = selectPropject;
    }
    getList(payload);
  }, [selectType, selectPropject, pagination, layoutType, keyword, getList, currentUser]);

  const onChange = useCallback((page, pageSize) => {
    setPagination({ current: page, pageSize });
  }, []);

  /**
   * 项目选择
   */
  const onProjectChange = useCallback(v => {
    setPagination(defaultPagination);
    setSelectPropject(v);
  }, []);

  /**
   * 类型选择
   */
  const onTypeChange = useCallback(v => {
    setPagination(defaultPagination);
    setSelectType(v);
  }, []);

  /**
   * 布局选择
   */
  const onLayoutChange = useCallback(v => {
    setPagination(defaultPagination);
    setLayoutType(v);
  }, []);

  /**
   * 搜索框
   */
  const onSearchChange = useCallback(
    e => {
      const value = e.target.value;
      setKeyword(value);
      setPagination(defaultPagination);
    },
    [setKeyword, setPagination],
  );

  /**
   * 重置条件
   */
  const handleReset = useCallback(() => {
    setPagination(defaultPagination);
    setSelectType(undefined);
    setLayoutType(undefined);
    setSelectPropject(undefined);
    setKeyword(undefined);
    searchRef.current.input.setValue();
    fetchPageList();
  }, [fetchPageList, setPagination, setSelectType, setSelectPropject, setKeyword]);

  /**
   * 前往编辑
   */
  const btnEdit = useCallback((id, value) => {
    window.open(`${window.location.origin}/edit?pageId=${id}&tagId=${value.tagId}`);
  }, []);

  /**
   * 打开预览弹窗
   */
  const btnPreview = useCallback((id, value) => {
    setPageViewModalInfo(state => ({
      ...state,
      selectPageInfo: value,
      pageViewModalVisbile: true,
    }));
  }, []);

  const handlePageViewModalClose = useCallback(() => {
    setPageViewModalInfo(state => ({
      ...state,
      selectPageInfo: null,
      pageViewModalVisbile: false,
    }));
  }, []);

  // 预览弹窗向前切换页面
  const onPrev = useCallback(() => {
    const index = pageList?.findIndex(n => n?.id === selectPageInfo?.id);
    let prevPageInfo = null;
    let finalIndex = index - 1;
    if (finalIndex < 0) {
      finalIndex = pageList?.length - 1;
    }
    prevPageInfo = pageList?.[finalIndex];

    setPageViewModalInfo(state => ({
      ...state,
      selectPageInfo: prevPageInfo,
    }));
  }, [selectPageInfo, pageList]);

  // 预览弹窗向后切换页面
  const onNext = useCallback(() => {
    const index = pageList?.findIndex(n => n?.id === selectPageInfo?.id);
    let nextPageInfo = null;
    let finalIndex = index + 1;
    if (finalIndex > pageList?.length - 1) {
      finalIndex = 0;
    }

    nextPageInfo = pageList?.[finalIndex];

    setPageViewModalInfo(state => ({
      ...state,
      selectPageInfo: nextPageInfo,
    }));
  }, [selectPageInfo, pageList]);

  /**
   * 编辑页面基础信息
   */
  const btnEditBasic = useCallback(current => {
    setModalInfo(v => {
      return {
        ...v,
        addVisible: true,
        isUseTemp: false,
        isEdit: true,
        currentInfo: current,
      };
    });
  }, []);

  const btnTemp = useCallback(current => {
    setModalInfo(v => {
      return {
        ...v,
        addVisible: true,
        isUseTemp: true,
        isEdit: false,
        currentInfo: current,
      };
    });
  }, []);

  const btnDel = useCallback(
    async id => {
      const res = await delPage({ id });
      if (res) {
        setPagination(defaultPagination);
        fetchPageList();
      }
    },
    [fetchPageList, setPagination, delPage],
  );

  /**
   * 删除
   */
  const showConfirm = useCallback(
    id => {
      confirm({
        title: '删除',
        content: '是否删除此页面 ？',
        onOk() {
          btnDel(id);
        },
        onCancel() {},
      });
    },
    [btnDel],
  );

  const gotoAdd = useCallback(key => {
    setModalInfo(v => {
      return {
        ...v,
        isEdit: false,
        currentInfo: null,
        addVisible: true,
      };
    });
  }, []);

  const handleCancel = useCallback(() => {
    setModalInfo(v => {
      return {
        ...v,
        isEdit: false,
        currentInfo: null,
        addVisible: false,
        isUseTemp: false,
      };
    });
  }, []);

  const handleOk = values => {
    if (isUseTemp) {
      const inputData = {
        ...values,
        pageId: currentInfo?.id,
      };
      creatPageByTemp(inputData).then(res => {
        const { errorCode, data } = res;
        if (errorCode === 200) {
          handleCancel();
          savePageConfig(data);
          router.push(`/edit?pageId=${data.id}&tagId=${data.tagId}`);
        }
      });
      return;
    }
    if (isEdit) {
      updatePage({ ...values, id: currentInfo?.id }).then(success => {
        if (success) {
          setPagination(defaultPagination);
          setModalInfo(v => {
            return {
              ...v,
              addVisible: false,
              currentInfo: null,
            };
          });
          fetchPageList();
        }
      });

      return;
    }
    submit(values).then(res => {
      const { errorCode, data } = res;
      if (errorCode === 200) {
        handleCancel();
        savePageConfig(data);
        router.push(`/edit?pageId=${data.id}&tagId=${data.tagId}`);
      }
    });
  };

  /**
   * 初始化数据
   */
  useEffect(() => {
    fetchPageList();
  }, [fetchPageList]);

  const modalProps = {
    submit,
    addVisible,
    handleCancel,
    savePageConfig,
    handleOk,
    submitLoading,
    isUseTemp,
    isEdit,
    currentInfo,
    projectList,
    creatPageByTempLoading,
  };

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
          <Select
            style={{ width: 160 }}
            placeholder="项目"
            allowClear={true}
            value={selectPropject}
            onChange={onProjectChange}
            className="dm-select-default"
          >
            <Select.Option value="all">全部</Select.Option>
            {(projectList || []).map(n => (
              <Select.Option key={n.id} value={n.id}>
                {n.name}
              </Select.Option>
            ))}
          </Select>

          <Select
            style={{ width: 100 }}
            placeholder="类型"
            allowClear={true}
            value={selectType}
            onChange={onTypeChange}
            className="dm-select-default"
          >
            {USER_TYPE.map(n => (
              <Select.Option key={n.value} value={n.value}>
                {n.label}
              </Select.Option>
            ))}
          </Select>

          <Select
            style={{ width: 100 }}
            placeholder="布局"
            allowClear={true}
            value={layoutType}
            onChange={onLayoutChange}
            className="dm-select-default"
          >
            {LAYOUT_TYPE.map(n => (
              <Select.Option key={n.value} value={n.value}>
                {n.label}
              </Select.Option>
            ))}
          </Select>

          {(selectPropject || selectType || keyword || layoutType !== undefined) && (
            <Button type="link" onClick={handleReset}>
              重置
            </Button>
          )}
        </span>

        <Button className={styles.add} type="primary" onClick={gotoAdd}>
          <span className={styles.plus}>+</span> 新建可视化
        </Button>
      </div>
      <div className={styles.desc}>
        <span className={styles.total}>
          共<span>{totalPage}</span>条
        </span>

        <ListTypeSwitch className={styles.switch} value={listType} onChange={setListType} />
      </div>

      <GridList
        loading={listLoading}
        colProps={colSpan}
        rowProps={{ gutter: [30, 30] }}
        dataSource={pageList}
        renderItem={n => {
          const { id, name, pageWidth, pageHeight, pageCoverImg } = n;
          const src = pageCoverImg ? `${staticPath}/${id}/${pageCoverImg}` : defPic;
          return (
            <Card
              className={styles.card}
              cover={
                <div
                  className={styles.corverImg}
                  onClick={() => {
                    btnPreview(id, n);
                  }}
                >
                  <div className={styles.view} style={{ backgroundImage: `url(${src})` }}></div>
                  <div className={styles.operateBtn} onClick={e => e.stopPropagation()}>
                    <Button
                      type="link"
                      onClick={() => {
                        btnEditBasic(n);
                      }}
                      disabled={onlyRead}
                    >
                      变更
                    </Button>

                    <Button
                      type="link"
                      onClick={() => {
                        btnEdit(id, n);
                      }}
                      disabled={onlyRead}
                    >
                      编辑
                    </Button>
                    <Button
                      type="link"
                      onClick={() => {
                        btnTemp(n);
                      }}
                      disabled={onlyRead}
                    >
                      使用模板
                    </Button>

                    <Button
                      type="link"
                      onClick={() => {
                        showConfirm(id);
                      }}
                      disabled={onlyRead}
                    >
                      删除
                    </Button>
                  </div>
                </div>
              }
              hoverable={true}
            >
              <div className={styles.title} title={`${name}/${pageWidth}-${pageHeight}`}>
                <span>{name}</span>
                <span style={{ margin: '0 5px' }}>/</span>
                <span>{`${pageWidth}-${pageHeight}`}</span>
              </div>
            </Card>
          );
        }}
      />

      <Pagination
        className="dm-pagination-default"
        current={pagination.current}
        pageSize={pagination.pageSize}
        showQuickJumper={true}
        showSizeChanger={true}
        pageSizeOptions={['12', '24', '36', '48']}
        onChange={onChange}
        onShowSizeChange={onChange}
        total={totalPage}
      />

      <AddModal {...modalProps}></AddModal>

      <PageViewModal
        visible={pageViewModalVisbile}
        pageInfo={selectPageInfo}
        onClose={handlePageViewModalClose}
        onUseTemp={btnTemp}
        onPrev={onPrev}
        onNext={onNext}
        onlyRead={onlyRead}
      />
    </div>
  );
}

Page.propTypes = {
  updateState: PropTypes.func,
  getList: PropTypes.func,
  submit: PropTypes.func,
  savePageConfig: PropTypes.func,
  creatPageByTemp: PropTypes.func,
  delPage: PropTypes.func,
  updatePage: PropTypes.func,
  pageList: PropTypes.array,
  totalPage: PropTypes.number,
  projectList: PropTypes.array,
  submitLoading: PropTypes.bool,
  creatPageByTempLoading: PropTypes.bool,
  listLoading: PropTypes.bool,
  currentUser: PropTypes.object,
};

const mapStateToProps = ({ page, loading, users }) => {
  return {
    pageList: page.pageList,
    totalPage: page.totalPage,
    projectList: page.projectList,
    submitLoading: loading.effects['page/submit'],
    creatPageByTempLoading: loading.effects['page/creatPageByTemp'],
    listLoading: loading.effects['page/getList'],
    currentUser: users.currentUser,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateState: params =>
      dispatch({
        type: 'page/updateState',
        payload: {
          ...params,
        },
      }),
    getList: params =>
      dispatch({
        type: 'page/getList',
        payload: {
          ...params,
        },
      }),
    submit: params =>
      dispatch({
        type: 'page/submit',
        payload: {
          ...params,
        },
      }),
    savePageConfig: pageConfig =>
      dispatch({
        type: 'app/updateState',
        payload: {
          pageConfig,
        },
      }),
    creatPageByTemp: data =>
      dispatch({
        type: 'page/creatPageByTemp',
        payload: data,
      }),
    delPage(data) {
      return dispatch({
        type: 'page/delPage',
        payload: data,
      });
    },
    updatePage(data) {
      return dispatch({
        type: 'page/updatePage',
        payload: data,
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Page);
