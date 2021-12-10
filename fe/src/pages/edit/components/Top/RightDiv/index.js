import React, { useEffect } from 'react';
import { connect } from 'dva';
// import PropTypes from 'prop-types';
import qs from 'query-string';
import queryString from 'query-string';
import { Button, message, Modal, Icon } from 'antd';

import {
  RefreshIcon,
  ClearIcon,
  DataIcon,
  PreviewIcon,
  SketchIcon,
  ThemeIcon,
  ThemeColorIcon,
} from '@/assets/svg/index';
import { getParseSearch } from '@/helpers/utils';
import ThemeConfigModal from '@/components/ThemeConfigModal';
import DownLoadZipModal from '@/components/DownLoadZipModal';
import SketchImport from '@/components/SketchImport';
import EmptyModal from '@/components/EmptyModal';
import BasicDrawer from '@/components/BasicDrawer';
import AnimateTimeline from '@/components/AnimateTimeline';

import Theme from '../Theme';
import CompLib from '../CompLibConfirm';
import DownloadPage from '../DownloadPage';
import DataSourceDrawer from '../DataSourceDrawer';
import styles from './index.less';

const RightDiv = props => {
  const { pageId, tagId } = queryString.parse(window.location.search);
  const {
    modalVisible,
    updateState,
    socketData,
    modalType,
    loading,
    isSelectCompInfo,
    changeTheme,
    restoreData,
    updatePageComp,
    themeList,
    addTheme,
    getThemeList,
    deleteTheme,
    updateTheme,
    drawerVisible,
    showDrawerType,
    changeToOtherChart,
    confirmChangeChart,
    getThemeConfigList,
    themeConfigList,
    fetchPageUseCompList,
    markSureEmptyPage,
    rightConfigVis,
    refreshLoading,
    refeshPageUseCompList,
    containerDivClick,
  } = props;

  const drawerProps = {
    title: '',
    closable: false,
    visible: drawerVisible,
    mask: false,
    width: 350,
  };

  const { compName } = isSelectCompInfo;

  useEffect(() => {
    if (showDrawerType === 'themeConfig' && compName) {
      getThemeConfigList({
        type: compName,
      });
    }
  }, [showDrawerType, compName, getThemeConfigList]);

  const btnHash = {
    handleRefreshPage: {
      key: 'refreshPage',
      value: '刷新',
      icon: <RefreshIcon />,
      click() {
        refeshPageUseCompList({
          pageId,
          type: 'edit',
        });
        containerDivClick();
      },
    },
    // pageDoGroup: {
    //   key: 'pageDoGroup',
    //   value: '一键成组',
    //   icon: <RefreshIcon />,
    //   click() {
    //     containerDivClick();
    //   },
    // },
    // handleAnimation: {
    //   key: 'AnimateTimeline',
    //   value: '动画线',
    //   icon: <RefreshIcon />,
    //   click() {
    //     updateState({
    //       modalVisible: true,
    //       modalType: 'AnimateTimeline',
    //     });
    //   },
    // },
    handleEmptyPage: {
      key: 'emptyPage',
      value: '清空',
      icon: <ClearIcon />,
      click() {
        updateState({
          modalVisible: true,
          modalType: 'EmptyModal',
        });
      },
    },
    handleSketchImport: {
      key: 'sketchImport',
      value: 'sketch导入',
      icon: <SketchIcon />,
      click() {
        updateState({
          modalVisible: true,
          modalType: 'SketchImport',
        });
      },
    },
    handleThemeConfig: {
      key: 'themeConfig',
      value: '主题库',
      icon: <ThemeIcon />,
      disabled: !isSelectCompInfo || JSON.stringify(isSelectCompInfo) === '{}',
      click() {
        updateState({
          drawerVisible: true,
        });
        getThemeConfigList({
          type: compName,
        });
      },
    },
    handleTheme: {
      key: 'theme',
      value: '主题色',
      icon: <ThemeColorIcon />,
      click() {
        updateState({
          drawerVisible: true,
        });
      },
    },
    handleData: {
      key: 'data',
      value: '数据',
      icon: <DataIcon />,
      click() {
        updateState({
          drawerVisible: true,
        });
      },
    },
    handlePreview: {
      key: 'preview',
      value: '预览',
      icon: <PreviewIcon />,
      click() {
        const data = getParseSearch();
        const str = qs.stringify(data);
        window.open(`${window.location.origin}/preview?${str}`);
      },
    },
    hidden: {
      key: 'hidden',
      value: '收起',
    },
  };

  const iconClick = () => {
    updateState({
      rightConfigVis: !rightConfigVis,
    });
  };

  const setShowDrawerType = showDrawerType => {
    updateState({
      showDrawerType,
    });
  };

  const btnClick = v => {
    if (btnHash[v]) {
      setShowDrawerType(btnHash[v].key);
      btnHash[v].click(v);
    }
  };

  const handleClose = () => {
    updateState({
      drawerVisible: false,
    });
    restoreData();
  };

  const themeProps = {
    isSelectCompInfo,
    updateTheme,
    deleteTheme,
    changeTheme,
    themeList,
    addTheme,
    getThemeList,
    updatePageComp,
    modalLoading:
      loading.effects['edit/addTheme'] ||
      loading.effects['edit/deleteTheme'] ||
      loading.effects['edit/updateTheme'],
    spaning: loading.effects['edit/getThemeList'] ? true : false,
    confirmLoading: loading.effects['edit/updatePageComp'],
  };

  const compLibProps = {
    itemClick(compName) {
      changeToOtherChart(compName);
    },
    confirmChangeChart,
    confirmLoading: loading.effects['edit/confirmChangeChart'],
  };

  const themeConfigModalProps = {
    data: themeConfigList,
    confirmLoading: loading.effects['edit/updatePageComp'],
    itemClick(v) {
      if (!isSelectCompInfo || JSON.stringify(isSelectCompInfo) === '{}') {
        message.warn('请选择组件！！！');
        return;
      }
      changeTheme({
        id: isSelectCompInfo.id,
        style: v.style,
        mockData: v.mockData,
      });
    },
    goBackClick() {
      updateState({
        drawerVisible: false,
      });

      restoreData();
    },
    confirmClick(v) {
      updatePageComp({
        id: isSelectCompInfo.id,
        style: v.style,
        mockData: v.mockData,
      });
    },
    fetchLoading: loading.effects['edit/getThemeConfigList'],
  };

  const downLoadZipModalProps = {
    socketData,
    pageId,
  };

  const sketchImportProps = {
    pageId,
    updateState,
    fetchPageUseCompList,
  };

  const emptyModalProps = {
    valueText: '确认清空页面所有组件？',
    loading: loading.effects['edit/markSureEmptyPage'],
    markSureEmptyPage,
  };

  const renderContent = {
    data: <DataSourceDrawer></DataSourceDrawer>,
    theme: <Theme {...themeProps}></Theme>,
    comp: <CompLib {...compLibProps}></CompLib>,
    themeConfig: <ThemeConfigModal {...themeConfigModalProps}></ThemeConfigModal>,
  };

  const renderModalContent = {
    DownLoadZipModal: <DownLoadZipModal {...downLoadZipModalProps}></DownLoadZipModal>,
    SketchImport: <SketchImport {...sketchImportProps}></SketchImport>,
    EmptyModal: <EmptyModal {...emptyModalProps}></EmptyModal>,
    DownloadPage: <DownloadPage></DownloadPage>,
    AnimateTimeline: <AnimateTimeline></AnimateTimeline>,
  };

  const handleModalCancel = () => {
    updateState({
      modalVisible: false,
    });
  };

  const getBtnLoading = key => {
    if (key === 'refreshPage') {
      return refreshLoading;
    }
  };

  return (
    <div className={styles.container}>
      {Object.keys(btnHash).map((v, index) => {
        const { key, value, disabled, icon } = btnHash[v];

        if (key === 'themeConfig') {
          if (!isSelectCompInfo || JSON.stringify(isSelectCompInfo) === '{}') {
            return null;
          }
        }
        if (key === 'hidden') {
          return (
            <Icon
              key={key}
              className={styles.icon}
              onClick={iconClick}
              type={rightConfigVis ? 'right-square' : 'left-square'}
            />
          );
        }
        return (
          <Button
            type="link"
            key={key}
            className={styles.btn}
            onClick={() => {
              btnClick(v);
            }}
            disabled={disabled}
            loading={getBtnLoading(key)}
          >
            {icon}
            {value}
          </Button>
        );
      })}

      <Modal
        title="Title"
        visible={modalVisible}
        // onOk={handleOk}
        // confirmLoading={confirmLoading}
        onCancel={handleModalCancel}
        footer={null}
        maskClosable={false}
        width={800}
      >
        {renderModalContent[modalType]}
      </Modal>
      <BasicDrawer {...drawerProps}>
        <div className={styles.closeIcon}>
          <Icon type="close" onClick={handleClose} />
        </div>
        {drawerVisible && renderContent[showDrawerType]}
      </BasicDrawer>
    </div>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    changeTheme: data => {
      dispatch({
        type: 'edit/changeTheme',
        payload: data,
      });
    },
    updatePageComp: data => {
      return dispatch({
        type: 'edit/updatePageComp',
        payload: data,
      }).then(res => {
        if (res) {
          dispatch({
            type: 'edit/updateState',
            payload: {
              editSelectInfoBak: null,
            },
          });
        }
      });
    },
    restoreData: data => {
      console.log('restoreDatarestoreData');
      dispatch({
        type: 'edit/restoreData',
      });
    },
    addTheme: data => {
      return dispatch({
        type: 'edit/addTheme',
        payload: data,
      });
    },
    updateTheme: data => {
      return dispatch({
        type: 'edit/updateTheme',
        payload: data,
      });
    },
    getThemeList: () => {
      return dispatch({
        type: 'edit/getThemeList',
      });
    },
    deleteTheme: data => {
      return dispatch({
        type: 'edit/deleteTheme',
        payload: data,
      });
    },
    changeToOtherChart: compName => {
      return dispatch({
        type: 'edit/changeToOtherChart',
        payload: {
          compName,
        },
      });
    },
    confirmChangeChart: () => {
      return dispatch({
        type: 'edit/confirmChangeChart',
      }).then(res => {
        if (res) {
          dispatch({
            type: 'edit/updateState',
            payload: {
              editSelectInfoBak: null,
            },
          });
        }
      });
    },
    getThemeConfigList: data => {
      return dispatch({
        type: 'edit/getThemeConfigList',
        payload: data,
      });
    },
    updateState: data => {
      dispatch({
        type: 'edit/updateState',
        payload: data,
      });
    },
    fetchPageUseCompList: data => {
      dispatch({
        type: 'edit/fetchPageUseCompList',
        payload: data,
      });
    },
    markSureEmptyPage: () => {
      dispatch({
        type: 'edit/markSureEmptyPage',
      }).then(res => {
        const { pageId } = queryString.parse(window.location.search);
        if (res) {
          dispatch({
            type: 'edit/updateState',
            payload: {
              modalVisible: false,
            },
          });
          dispatch({
            type: 'edit/fetchPageUseCompList',
            payload: {
              pageId,
            },
          });
        }
      });
    },
    refeshPageUseCompList(data) {
      dispatch({
        type: 'edit/refeshPageUseCompList',
        payload: data,
      });
    },
  };
};

export default connect(({ edit, loading }) => {
  // const isSelectCompInfo = getClickInfo(edit.initUseCompList);
  const refreshLoading = loading.effects['edit/refeshPageUseCompList'];
  return {
    isSelectCompInfo: edit.isSelectCompInfo,
    themeList: edit.themeList,
    drawerVisible: edit.drawerVisible,
    modalVisible: edit.modalVisible,
    showDrawerType: edit.showDrawerType,
    modalType: edit.modalType,
    themeConfigList: edit.themeConfigList,
    rightConfigVis: edit.rightConfigVis,
    refreshLoading,
  };
}, mapDispatchToProps)(RightDiv);
