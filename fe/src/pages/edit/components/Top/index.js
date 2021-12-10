import React from 'react';
import { connect } from 'dva';
// import PropTypes from 'prop-types';
// import { Button, Card, message, Modal } from 'antd';
import styles from './index.less';
import LeftDiv from './LeftDiv';
import RightDiv from './RightDiv';

const Top = props => {
  return (
    <div className={styles.topDiv}>
      <div className={styles.leftDiv}>
        <LeftDiv {...props}></LeftDiv>
      </div>

      <div className={styles.rightDiv}>
        <RightDiv {...props}></RightDiv>
      </div>
    </div>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    addCusCompToUseCompList: data => {
      dispatch({
        type: 'edit/addCusCompToUseCompList',
        payload: data,
      });
    },
    saveAllData: data => {
      dispatch({
        type: 'edit/saveAllData',
        payload: data,
      });
    },
    build: data => {
      dispatch({
        type: 'edit/build',
        payload: data,
      });
    },
    addTempComp: data => {
      dispatch({
        type: 'edit/addTempComp',
        payload: data,
      });
    },
    addDataSource: data => {
      return dispatch({
        type: 'edit/addDataSource',
        payload: data,
      });
    },
    getAllDataSourceByPageId: data => {
      dispatch({
        type: 'edit/getAllDataSourceByPageId',
        payload: data,
      });
    },
    updateDataSourceById: data => {
      return dispatch({
        type: 'edit/updateDataSourceById',
        payload: data,
      });
    },
  };
};

export default connect(({ edit, loading }) => {
  return {
    socketData: edit.socketData,
    useCompList: edit.initUseCompList,
    loading,
    dataSourceList: edit.dataSourceList,
  };
}, mapDispatchToProps)(Top);
