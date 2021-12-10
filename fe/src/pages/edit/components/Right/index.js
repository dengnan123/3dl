import React from 'react';
import { connect } from 'dva';
// import PropTypes from 'prop-types';
// import { Card } from 'antd';
// import { getClickInfo } from '@/helpers/utils';
import PageConfig from './PageConfig';
import CompConfig from './CompConfig';
import styles from './index.less';

const Right = props => {
  const {
    setUseCompList,
    pageConfig,
    updatePageConfig,
    generatePagePic,
    generatePicLoading,
    updatePageComp,
    addDataUseCompList,
    initUseCompList,
    updatePage,
    isSelectCompInfo,
    containerDivClick
  } = props;

  const pageConfigProps = {
    isSelectCompInfo,
    pageConfig,
    updatePageConfig,
    generatePagePic,
    generatePicLoading,
    updatePage,
    initUseCompList,
  };

  const compConfigProps = {
    isSelectCompInfo,
    setUseCompList,
    initUseCompList,
    updatePageComp,
    addDataUseCompList,
    pageConfig,
    containerDivClick
  };

  const render = () => {
    if (isSelectCompInfo && JSON.stringify(isSelectCompInfo) !== '{}') {
      return <CompConfig {...compConfigProps} />;
    }
    return <PageConfig {...pageConfigProps} />;
    // return (
    //   <Card size="small" title="页面配置" bordered={false}>
    //     <PageConfig {...pageConfigProps} />
    //   </Card>
    // );
  };
  return <div className={styles.rightDiv}>{render()}</div>;
};

const mapDispatchToProps = dispatch => {
  return {
    setUseCompList: arr => {
      dispatch({
        type: 'edit/updateState',
        payload: {
          initUseCompList: arr,
        },
      });
    },
    updatePageConfig: pageConfig => {
      // dispatch({
      //   type: 'edit/updateState',
      //   payload: {
      //     pageConfig,
      //   },
      // });
      dispatch({
        type: 'edit/updatePage',
        payload: pageConfig,
      });
    },
    generatePagePic: data => {
      dispatch({
        type: 'edit/generatePagePic',
      });
    },
    updatePageComp: data => {
      dispatch({
        type: 'edit/updatePageComp',
        payload: data,
      });
    },
    addDataUseCompList: data => {
      dispatch({
        type: 'edit/addDataUseCompList',
        payload: data,
      });
    },
    updatePage: data => {
      dispatch({
        type: 'edit/updatePage',
        payload: data,
      });
    },
    // flatArrBatchUpdate: payload => {
    //   return dispatch({
    //     type: 'edit/flatArrBatchUpdate',
    //     payload,
    //   });
    // },
  };
};

export default connect(({ edit, loading }) => {
  const initUseCompList = edit.initUseCompList;
  return {
    initUseCompList,
    pageConfig: edit.pageConfig,
    generatePicLoading: loading.effects['edit/generatePagePic'],
    isSelectCompInfo: edit.isSelectCompInfo,
  };
}, mapDispatchToProps)(Right);
