import React, { useState, useRef, useEffect } from 'react';
import ReactDom from 'react-dom';
import { Modal } from 'antd';
import { connect } from 'dva';
import { copyToClip } from '@/helpers/screen';
import styles from './index.less';
import { useEventArr, useEventListenerAndGetLT } from './hooks';
import MoveIn from './MoveIn';

const RightKeyDiv = props => {
  const divRef = useRef(null);
  const [{ menuWidth, menuHeight }, setMenuDiv] = useState({ menuWidth: 0, menuHeight: 0 });
  const {
    isSelectCompInfo,
    setAlwaysShowHoverID,
    doGroupApi,
    cancelGroupApi,
    cvApi,
    setModal,
    setRenameId,
    setShowDrawerType,
    lookConfig,
    saveStyleToTheme,
    hiddenComp,
    updateIndex,
    onlyUpdateChangeData,
    moveOut,
    pageConfig,
    cvToOtherAction,
    divId,
    mulArr,
    initUseCompList,
    moveInApi,
  } = props;
  const { id: clickId } = isSelectCompInfo;
  const [vis, setVis] = useState(false);
  const [visible, setVisible] = useState(false);
  const [_eventArr] = useEventArr({
    pageConfig,
    mulArr,
    isSelectCompInfo,
  });
  const [{ left: l, top: t }] = useEventListenerAndGetLT({
    divId,
    setVis,
    menuWidth,
    menuHeight,
  });
  const [hoverName, setName] = useState(null);
  const showHover = hoverName => {
    setName(hoverName);
  };
  const showRefLine = id => {
    setAlwaysShowHoverID(id);
  };

  const locking = id => {
    onlyUpdateChangeData({
      id: clickId,
      data: {
        isLocking: 1,
      },
    });
  };

  const unlock = id => {
    onlyUpdateChangeData({
      id: clickId,
      data: {
        isLocking: 0,
      },
    });
  };

  const hidden = id => {
    hiddenComp({
      id: clickId,
      isHidden: 1,
    });
  };

  const show = id => {
    hiddenComp({
      id: clickId,
      isHidden: 0,
    });
  };

  const moveIn = id => {
    setVisible(true);
  };

  const _moveOut = () => {
    Modal.confirm({
      title: '是否把组件移出到最外层?',
      // content: '',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        moveOut();
      },
    });
  };

  const copyCompId = clickID => {
    copyToClip(clickID);
  };

  const changeToOtherChart = () => {
    setShowDrawerType();
  };

  const setAliasName = id => {
    if (setModal) {
      setModal(true);
      setRenameId(id);
    }
  };
  const cv = clickID => {
    cvApi({
      id: clickID,
    });
  };

  const cvToOther = () => {
    cvToOtherAction(clickId);
  };

  const clickTo = eventName => {
    const obj = {
      toTop: 1,
      toBottom: 1,
      toUpperLevel: 1,
      toLowLevel: 1,
    };
    const otherObj = {
      moveIn,
      showRefLine,
      doGroup: doGroupApi,
      cancelGroup: cancelGroupApi,
      cv,
      setAliasName,
      locking,
      unlock,
      hidden,
      show,
      cvToOther,
      changeToOtherChart,
      lookConfig,
      saveStyleToTheme,
      copyCompId,
      _moveOut,
    };
    if (obj[eventName]) {
      updateIndex &&
        updateIndex({
          eventName,
        });
    }
    if (otherObj[eventName]) {
      otherObj[eventName](clickId);
    }
    setVis(false);
  };

  const onMouseLeave = () => {
    setVis(false);
  };

  useEffect(() => {
    if (!divRef.current) {
      return;
    }
    const menuWidth = divRef.current.offsetWidth;
    const menuHeight = divRef.current.offsetHeight;
    setMenuDiv({ menuWidth, menuHeight });
  }, []);

  const render = () => {
    if (!vis) {
      return null;
    }

    return ReactDom.createPortal(
      <div
        className={styles.rightClickDiv}
        style={{ left: l, top: t }}
        onMouseLeave={onMouseLeave}
        ref={divRef}
      >
        {_eventArr.map((v, index) => {
          return (
            <div
              key={index}
              onClick={e => {
                e.stopPropagation();
                clickTo(v.eventName);
              }}
              onMouseEnter={() => {
                showHover(v.eventName);
              }}
              className={hoverName === v.eventName ? styles.hoverDiv : {}}
            >
              {v.name}
            </div>
          );
        })}
      </div>,
      document.body,
    );
  };

  const moveInProps = {
    visible,
    handleOk(value) {
      moveInApi({
        id: value[0],
      });
      setVisible(false);
    },
    handleCancel() {
      setVisible(false);
    },
    data: initUseCompList.filter(v => v.id !== isSelectCompInfo.id),
  };

  return (
    <div>
      <MoveIn {...moveInProps}></MoveIn>
      {render()}
    </div>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    cancelGroupApi: id => {
      dispatch({
        type: 'edit/cancelGroupApi',
        payload: { id },
      });
    },
    doGroupApi: data => {
      return dispatch({
        type: 'edit/doGroupApi',
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
    updateMulArr: data => {
      dispatch({
        type: 'edit/updateMulArr',
        payload: data,
      });
    },
    cvApi: data => {
      dispatch({
        type: 'edit/cv',
        payload: data,
      });
    },
    commonUpdate: data => {
      dispatch({
        type: 'edit/commonUpdate',
        payload: data,
      });
    },
    updateArrInfoById: data => {
      dispatch({
        type: 'edit/updateArrInfoById',
        payload: data,
      });
    },
    updateSelectInfo: data => {
      dispatch({
        type: 'edit/updateState',
        payload: {
          isSelectCompInfo: data,
        },
      });
    },
    setShowDrawerType: isSelectCompInfo => {
      return dispatch({
        type: 'edit/updateState',
        payload: {
          showDrawerType: 'comp',
          drawerVisible: true,
          editSelectInfoBak: isSelectCompInfo,
        },
      });
    },
    addThemeConfig: data => {
      return dispatch({
        type: 'edit/addThemeConfig',
        payload: data,
      });
    },
    hiddenComp(data) {
      dispatch({
        type: 'edit/hiddenComp',
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
    moveInApi(data) {
      dispatch({
        type: 'edit/moveIn',
        payload: data,
      });
    },
  };
};

export default connect(({ edit, loading, users }) => {
  const { initUseCompList } = edit;
  return {
    pageConfig: edit.pageConfig,
    mulArr: edit.mulArr,
    pageWrapData: edit.pageWrapData,
    isSelectCompInfo: edit.isSelectCompInfo,
    currentUser: users.currentUser,
    initUseCompList,
  };
}, mapDispatchToProps)(RightKeyDiv);
