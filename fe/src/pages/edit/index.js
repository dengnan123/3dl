import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Modal, Form } from 'antd';
import { Prompt } from 'dva/router';
import styles from './index.less';
import Container from './components/Container';
import Left from './components/Left';
import Right from './components/Right';
import Top from './components/Top';
import ReNameModal from './components/ReNameModal';
import SaveThemeConfig from './components/ContainerModals/SaveThemeConfig';
import ScreenList from './components/ScreenList';
import { useLine } from '@/hooks/useLine';
import ActionDiv from './components/ActionDiv';
import { useGetWidthAndHeight } from './hooks';
import { useDragAdd } from './hooks/dragAdd';

const Edit = props => {
  const {
    compList,
    useCompList,
    setUseCompList,
    pageConfig,
    initFetchLoading,
    saveAllData,
    rightConfigVis,
    leftLayerVis,
    addThemeConfig,
    isSelectCompInfo,
    form,
    cvToOtherApi,
    currentUser,
    addThemeConfigLoading,
    setMulArr,
    updateState,
    mulArr,
    addCusCompToUseCompList,
  } = props;

  const { setClickIdForLine, setmulArrIdForLine, mulIdArrForLine, clearLine } = useLine(mulArr);
  const [canvasState, setPer] = useGetWidthAndHeight(pageConfig.pageWidth, pageConfig.pageHeight);
  const { percentageValue } = canvasState;
  const [layerClickID, setLayerClickID] = useState(null);
  const [isPress, setPress] = useState(false);
  const [alwaysShowHoverID, setAlwaysShowHoverID] = useState(null);
  const [modalVis, setVis] = useState(false);
  const [showRightClick, setRightDivVis] = useState(false);
  const [modalVisible, setModal] = useState(false);
  const [renameId, setRenameId] = useState(null);
  const [modalType, setModalType] = useState(null);
  const clickIdRef = useRef(null);
  const [screenModalVis, setScreenModal] = useState(false);
  const [compId, setCompId] = useState(null);
  const [screenId, setScreenId] = useState(null);
  const leftDivRef = useRef();
  useDragAdd({
    leftDivRef,
    addCusCompToUseCompList,
  });

  const screenListProps = {
    setScreenModal,
    setScreenId,
    currentUser,
  };

  const saveThemeConfigProps = {
    isSelectCompInfo,
    form,
  };

  const modalProps = {
    ScreenList: <ScreenList {...screenListProps}></ScreenList>,
    SaveThemeConfig: <SaveThemeConfig {...saveThemeConfigProps}></SaveThemeConfig>,
  };

  const modalTitle = {
    ScreenList: '复制到其他大屏',
    SaveThemeConfig: '发布主题',
  };

  const handleOk = () => {
    if (modalType === 'CodeEdit') {
      setScreenModal(false);
      return;
    }

    if (modalType === 'SaveThemeConfig') {
      form.validateFields((errors, values) => {
        if (!errors) {
          addThemeConfig({
            ...values,
            type: isSelectCompInfo.compName,
            style: isSelectCompInfo.style,
            mockData: isSelectCompInfo.mockData,
          }).then(res => {
            if (res) {
              setScreenModal(false);
            }
          });
        }
      });
      return;
    }

    cvToOtherApi({
      id: compId,
      pageId: screenId,
    });
  };

  const handleCancel = () => {
    setScreenModal(false);
    setScreenId(null);
  };

  const showScreenModal = id => {
    setCompId(id);
    setScreenModal(true);
  };

  const containerDivClick = () => {
    setRightDivVis(false);
    setMulArr([]);
    clearLine();
    updateState({
      isSelectCompInfo: {},
    });
  };

  //监听窗口事件
  useEffect(() => {
    const listener = ev => {
      ev.preventDefault();
      ev.returnValue = '数据要保存吼，确定离开吗？';
      // saveAllData && saveAllData();
    };
    window.addEventListener('beforeunload', listener);
    return () => {
      window.removeEventListener('beforeunload', listener);
    };
  }, [saveAllData]);

  useEffect(() => {
    // 判断有没有在键盘上按下
    window.addEventListener('keydown', e => {
      if (e.keyCode === 91) {
        setPress(true);
      }
    });
    window.addEventListener('keyup', e => {
      if (e.keyCode === 91) {
        setPress(false);
      }
    });
  }, []);

  const onChange = v => {
    setPer(v);
  };

  const containerProps = {
    showRightClick,
    setVis: setRightDivVis,
    containerDivClick,
    useCompList,
    setUseCompList,
    layerClickID,
    setLayerClickID,
    alwaysShowHoverID,
    setAlwaysShowHoverID,
    canvasState,
    pageConfig,
    isPress,
    setModal,
    setRenameId,
    clickIdRef,
    setPer,
    setClickIdForLine,
    setmulArrIdForLine,
    mulIdArrForLine,
    clearLine,
    cvToOtherAction(id) {
      showScreenModal(id);
      setModalType('ScreenList');
    },
    saveStyleToThemeAction() {
      setModalType('SaveThemeConfig');
      setScreenModal(true);
    },
  };

  const rightProps = {
    setVis,
    containerDivClick,
  };
  const leftProps = {
    compList,
    setUseCompList,
    useCompList,
    setLayerClickID,
    layerClickID,
    setAlwaysShowHoverID,
    pageWidth: pageConfig.pageWidth,
    pageHeight: pageConfig.pageHeight,
    pageConfig,
    isPress,
    clickIdRef,
    setClickIdForLine,
    setmulArrIdForLine,
    mulIdArrForLine,
    clearLine,
    setModal,
    setRenameId,
    cvToOtherAction(id) {
      showScreenModal(id);
      setModalType('ScreenList');
    },
    saveStyleToThemeAction() {
      setModalType('SaveThemeConfig');
      setScreenModal(true);
    },
  };
  const topProps = {
    pageId: pageConfig.pageId,
    onChange,
    percentageValue,
    containerDivClick,
  };

  const renameProps = {
    modalVisible,
    setModal,
    submitModal: '',
    useCompList,
    renameId,
  };

  if (initFetchLoading) {
    return (
      <div className={styles.loadingContainer}>
        <p>LOADING...</p>
      </div>
    );
  }

  const rightKeyProps = {
    setVis,
    setAlwaysShowHoverID,
    setModal,
    setRenameId,
    cvToOtherAction(id) {
      showScreenModal(id);
      setModalType('ScreenList');
    },
    divId: 'normal',
  };

  return (
    <div className={styles.container}>
      <Prompt
        when={true}
        message={location => {
          // saveAllData && saveAllData();
          return '数据要保存吼，确定离开吗？';
        }}
      />
      {!modalVis && <Top {...topProps}></Top>}
      <div className={styles.normal} id="normal">
        {/* {modalVis ? null : (
          <Fragment>
            <div className={leftLayerVis ? styles.showLeft : styles.hiddenLeft} id="leftDivWrap">
              <Left {...leftProps}></Left>
            </div>
            <Container {...containerProps}></Container>
            <div className={rightConfigVis ? styles.showRight : styles.hiddenRight}>
              <Right {...rightProps}></Right>
            </div>
          </Fragment>
        )} */}
        <div className={leftLayerVis ? styles.showLeft : styles.hiddenLeft} ref={leftDivRef}>
          <Left {...leftProps}></Left>
        </div>
        <Container {...containerProps}></Container>
        <div className={rightConfigVis ? styles.showRight : styles.hiddenRight}>
          <Right {...rightProps}></Right>
        </div>
        <ActionDiv {...rightKeyProps}></ActionDiv>
      </div>
      <ReNameModal {...renameProps}></ReNameModal>

      <Modal
        title={modalTitle[modalType] ?? '操作'}
        width={760}
        destroyOnClose={true}
        visible={screenModalVis}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={addThemeConfigLoading}
      >
        {modalProps[modalType]}
      </Modal>
    </div>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    setCompList: arr => {
      dispatch({
        type: 'edit/updateState',
        payload: {
          initCompList: arr,
        },
      });
    },
    setUseCompList: arr => {
      dispatch({
        type: 'edit/updateState',
        payload: {
          initUseCompList: arr,
        },
      });
    },
    saveAllData: () => {
      dispatch({
        type: 'edit/saveAllData',
      });
    },
    addThemeConfig: data => {
      return dispatch({
        type: 'edit/addThemeConfig',
        payload: data,
      });
    },
    cvToOtherApi: data => {
      dispatch({
        type: 'edit/cvToOtherApi',
        payload: data,
      });
    },
    setMulArr: data => {
      dispatch({
        type: 'edit/updateState',
        payload: {
          mulArr: data,
        },
      });
    },
    updateState(payload) {
      dispatch({
        type: 'edit/updateState',
        payload,
      });
    },
    addCusCompToUseCompList(data) {
      dispatch({
        type: 'edit/addCusCompToUseCompList',
        payload: data,
      });
    },
  };
};

export default connect(({ edit, users, loading }) => {
  const { initUseCompList } = edit;
  return {
    rightConfigVis: edit.rightConfigVis,
    leftLayerVis: edit.leftLayerVis,
    compList: edit.initCompList,
    useCompList: initUseCompList,
    pageConfig: edit.pageConfig,
    initFetchLoading: loading.effects['edit/initFetch'],
    addThemeConfigLoading: loading.effects['edit/addThemeConfig'],
    isSelectCompInfo: edit.isSelectCompInfo,
    currentUser: users.currentUser,
    mulArr: edit.mulArr,
  };
}, mapDispatchToProps)(Form.create()(Edit));
