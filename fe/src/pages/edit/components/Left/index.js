import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Tabs } from 'antd';
import styles from './index.less';
import Layer from './Layer';
import CompLib from './CompLib';

const { TabPane } = Tabs;

const Left = props => {
  const {
    compMenuListLoading,
    addCusCompToUseCompList,
    compMenuList,
    getPluginMenu,
    updateState,
  } = props;

  const callback = () => {};
  const compLibProps = {
    addCusCompToUseCompList,
    compMenuList,
    getPluginMenu,
    updateState,
    compMenuListLoading,
  };

  return (
    <div className={styles.leftDiv}>
      <Tabs defaultActiveKey="1" onChange={callback}>
        <TabPane tab="图层" key="1">
          <Layer {...props}></Layer>
        </TabPane>
        <TabPane tab="组件库" key="2">
          <CompLib {...compLibProps}></CompLib>
        </TabPane>
      </Tabs>
    </div>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    addCompToPage: data => {
      dispatch({
        type: 'edit/addCompToPage',
        payload: data,
      });
    },
    updatePageComp: data => {
      dispatch({
        type: 'edit/updatePageComp',
        payload: data,
      });
    },
    attributeUpdate: data => {
      dispatch({
        type: 'edit/attributeUpdate',
        payload: data,
      });
    },
    setCancelGroup: v => {
      dispatch({
        type: 'edit/updateState',
        payload: {
          hiddenCancelGroup: v,
        },
      });
    },
    setDoGroup: v => {
      dispatch({
        type: 'edit/updateState',
        payload: {
          hiddenDoGroup: v,
        },
      });
    },
    updateState: payload => {
      dispatch({
        type: 'edit/updateState',
        payload,
      });
    },
    cancelGroupApi: data => {
      dispatch({
        type: 'edit/cancelGroupApi',
        payload: data,
      });
    },
    doGroupApi: data => {
      dispatch({
        type: 'edit/doGroupApi',
        payload: data,
      });
    },
    updateMulArr: data => {
      dispatch({
        type: 'edit/updateMulArr',
        payload: data,
      });
    },
    commonUpdate: data => {
      dispatch({
        type: 'edit/commonUpdate',
        payload: data,
      });
    },
    hiddenComp(data) {
      dispatch({
        type: 'edit/hiddenComp',
        payload: data,
      });
    },
    addCusCompToUseCompList(data) {
      dispatch({
        type: 'edit/addCusCompToUseCompList',
        payload: data,
      });
    },
    getPluginMenu() {
      dispatch({
        type: 'edit/getPluginMenu',
      });
    },
    cvApi: data => {
      dispatch({
        type: 'edit/cv',
        payload: data,
      });
    },
    cvToOtherApi: data => {
      dispatch({
        type: 'edit/cvToOtherApi',
        payload: data,
      });
    },
    updateDataById(data) {
      dispatch({
        type: 'edit/updateDataById',
        payload: data,
      });
    },
    updateIndex(data) {
      dispatch({
        type: 'edit/updateIndex',
        payload: data,
      });
    },
    onlyUpdateChangeData(data) {
     return dispatch({
        type: 'edit/onlyUpdateChangeData',
        payload: data,
      });
    },
    refeshPageUseCompList(data) {
      dispatch({
        type: 'edit/refeshPageUseCompList',
        payload: data,
      });
    },
    moveOut() {
      dispatch({
        type: 'edit/moveOut',
      });
    },
  };
};

export default connect(({ edit, loading }) => {
  return {
    pageConfig: edit.pageConfig,
    mulArr: edit.mulArr,
    hiddenDoGroup: edit.hiddenDoGroup,
    hiddenCancelGroup: edit.hiddenCancelGroup,
    isSelectCompInfo: edit.isSelectCompInfo,
    compMenuList: edit.compMenuList,
    compMenuListLoading: loading.effects['edit/getPluginMenu'],
  };
}, mapDispatchToProps)(Left);
