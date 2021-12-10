import React, { useState, useCallback, useEffect } from 'react';
import { connect } from 'dva';
import router from 'umi/router';

import { fetchPageList, fetchProjectList } from '@/service/index';
import { PageViewModal, AddPagesModal } from '@/components/index';

import SearchHeader from './components/SearchHeader';
import ContentWrap from './components/ContentWrap';

import styles from './index.less';

const LAYOUT_TYPE = [
  {
    label: '自由布局',
    value: 'custom',
  },
  {
    label: '栅格布局',
    value: 'grid',
  },
];

const paginationParams = { current: 1, pageSize: 999, tagId: 35 };

function TemplatePage(props) {
  const { submit, creatPageByTemp, savePageConfig, submitLoading, creatPageByTempLoading } = props;
  const [templateData, setTemplates] = useState({});
  const [tagsList, setTags] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const [typeChecked, setTypeChecked] = useState('free');
  const [tagChecked, setTagChecked] = useState(null);
  const [listLoading, setListLoading] = useState(false);
  // 添加、使用模板创建页面
  const [{ addVisible, isUseTemp, currentInfo, isEdit }, setModalInfo] = useState({
    addVisible: false,
    currentInfo: null,
    isEdit: false,
    isUseTemp: false,
  });
  // 查看缩略图
  const [{ pageViewModalVisbile, selectPageInfo }, setPageViewModalInfo] = useState({
    pageViewModalVisbile: false,
    selectPageInfo: null,
  });

  // 获取标签列表
  useEffect(() => {
    setTags(LAYOUT_TYPE);
  }, []);

  // 获取模板页面列表
  useEffect(() => {
    setListLoading(true);
    fetchPageList({ ...paginationParams, layoutType: tagChecked }).then(result => {
      const { errorCode, data } = result;
      setListLoading(false);
      if (errorCode === 200) {
        setTemplates(data);
      }
    });
  }, [tagChecked]);

  // 获取项目列表
  useEffect(() => {
    fetchProjectList({ pageSize: 999 }).then(result => {
      const { errorCode, data } = result;
      if (errorCode === 200) {
        setProjectList(data);
      }
    });
  }, []);

  const { list } = templateData;

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

  const onCloseView = useCallback(() => {
    setPageViewModalInfo(state => ({
      ...state,
      selectPageInfo: null,
      pageViewModalVisbile: false,
    }));
  }, []);

  // 预览弹窗向前切换页面
  const onPrev = useCallback(() => {
    const index = list?.findIndex(n => n?.id === selectPageInfo?.id);
    let prevPageInfo = null;
    let finalIndex = index - 1;
    if (finalIndex < 0) {
      finalIndex = list?.length - 1;
    }
    prevPageInfo = list?.[finalIndex];

    setPageViewModalInfo(state => ({
      ...state,
      selectPageInfo: prevPageInfo,
    }));
  }, [selectPageInfo, list]);

  // 预览弹窗向后切换页面
  const onNext = useCallback(() => {
    const index = list?.findIndex(n => n?.id === selectPageInfo?.id);
    let nextPageInfo = null;
    let finalIndex = index + 1;
    if (finalIndex > list?.length - 1) {
      finalIndex = 0;
    }

    nextPageInfo = list?.[finalIndex];

    setPageViewModalInfo(state => ({
      ...state,
      selectPageInfo: nextPageInfo,
    }));
  }, [selectPageInfo, list]);

  /****** 使用模板 *******/
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

    submit(values).then(res => {
      const { errorCode, data } = res;
      if (errorCode === 200) {
        handleCancel();
        savePageConfig(data);
        router.push(`/edit?pageId=${data.id}&tagId=${data.tagId}`);
      }
    });
  };
  /****** 使用模板 *******/

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
      <SearchHeader
        tags={tagsList}
        tagChecked={tagChecked}
        setTagChecked={setTagChecked}
        type={typeChecked}
        setTypeChecked={setTypeChecked}
        onAddClick={gotoAdd}
      />
      <ContentWrap
        title={'模板列表'}
        list={list}
        itemClick={btnPreview}
        listLoading={listLoading}
      />

      <AddPagesModal {...modalProps} />

      <PageViewModal
        visible={pageViewModalVisbile}
        pageInfo={selectPageInfo}
        onClose={onCloseView}
        onUseTemp={btnTemp}
        onPrev={onPrev}
        onNext={onNext}
        isTemplateShow={true}
      />
    </div>
  );
}

const mapStateToProps = ({ templatePage, loading }) => {
  return {
    submitLoading: loading.effects['templatePage/submit'],
    creatPageByTempLoading: loading.effects['templatePage/creatPageByTemp'],
  };
};

const mapDispatchToProps = dispatch => {
  return {
    submit: params =>
      dispatch({
        type: 'templatePage/submit',
        payload: {
          ...params,
        },
      }),
    creatPageByTemp: data =>
      dispatch({
        type: 'templatePage/creatPageByTemp',
        payload: data,
      }),
    savePageConfig: pageConfig =>
      dispatch({
        type: 'app/updateState',
        payload: {
          pageConfig,
        },
      }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TemplatePage);
