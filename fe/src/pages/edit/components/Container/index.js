import React, { useState, useEffect, useCallback, useRef } from 'react';
// import PropTypes from 'prop-types';
import { getLocaleMode } from '@/helpers/storage';
import { Modal, Form } from 'antd';
import { connect } from 'dva';
import { addFont } from '@/helpers/font';
import EditRender from '@/components/EditRenderNew';
import styles from './index.less';
import { staticPath } from '../../../../config';
import { hasLocking } from '@/helpers/status';
import EditPageRuler from '@/components/EditPageRuler';
import LayoutContent from '../GridLayout';
// import { useSelection } from './hooks/selection';

const { confirm } = Modal;

function App(props) {
  const {
    pageWrapData,
    useCompList,
    isSelectCompInfo,
    canvasState,
    pageConfig,
    delPageComp,
    attributeUpdate,
    isPress,
    updateMulArr,
    lang,
    gridFlatArrBatchUpdate,
    setClickIdForLine,
    setmulArrIdForLine,
    mulIdArrForLine,
    updateState,
    containerDivClick,
  } = props;

  // useSelection({ updateMulArr, doGroupApi, cancelGroupApi }); // 暂时隐藏
  const clickId = isSelectCompInfo.id;
  const openAuto = false;

  const { fontFamily } = pageConfig;
  useEffect(() => {
    // 加载字体
    addFont(fontFamily);
  }, [fontFamily]);

  const onMouseUp = useCallback(
    ({ id, left, top }) => {
      // 先判断这个元素有没有锁定 锁定的话不能显示
      if (hasLocking({ id, useCompList })) {
        return;
      }
    },
    [useCompList],
  );

  const { percentageValue } = canvasState;
  const inputEl = useRef(null);
  const pointInCanvasRef = useRef(false);
  const [deleteComp, setDelVis] = useState(false);

  const showClickStatus = useCallback(
    v => {
      const { id } = v;
      updateState({
        isSelectCompInfo: v,
      });
      if (isPress) {
        updateMulArr({
          id,
        });
        setmulArrIdForLine(id);
        return;
      }
      setClickIdForLine(id);
    },
    [isPress, setmulArrIdForLine, setClickIdForLine, updateState, updateMulArr],
  );

  const emitDelete = useCallback(
    e => {
      if (e.keyCode === 8 && clickId && !deleteComp && pointInCanvasRef.current) {
        setDelVis(true);
        confirm({
          title: '确认要删除以下选中的组件?',
          content: '删除后不能恢复！！！',
          okText: 'Yes',
          okType: 'danger',
          cancelText: 'No',
          async onOk() {
            // 删除组件
            await delPageComp({
              id: clickId,
            });
            setDelVis(false);
          },
          onCancel() {
            setDelVis(false);
          },
        });
      }
    },
    [clickId, deleteComp, delPageComp],
  );

  useEffect(() => {
    window.addEventListener('keydown', emitDelete);
    return function remove() {
      window.removeEventListener('keydown', emitDelete);
    };
  }, [emitDelete]);

  const onDragStop = useCallback(
    (e, d, id) => {
      const nowInfo = useCompList.filter(v => v.id === id)[0] || {};
      let data = {
        left: Math.round(d.x),
        top: Math.round(d.y),
      };

      if (nowInfo.left === data.left && nowInfo.top === data.top) {
        return;
      }

      if (openAuto) {
        // 自动对齐
        for (const value of useCompList) {
          const { left: _ } = value;
          if (Math.abs(_ - data.left) < 20) {
            data.left = _;
            break;
          }
        }

        for (const value of useCompList) {
          const { top: _ } = value;
          if (Math.abs(_ - data.top) < 20) {
            data.top = _;
            break;
          }
        }
      }

      attributeUpdate({
        data,
        id,
      });
    },
    [attributeUpdate, openAuto, useCompList],
  );

  const onResizeStop = useCallback(
    (e, direction, ref, delta, position, id) => {
      const data = {
        width: parseInt(ref.style.width),
        height: parseInt(ref.style.height),
        left: parseInt(position.x),
        top: parseInt(position.y),
      };

      attributeUpdate({
        data,
        id,
      });
    },
    [attributeUpdate],
  );

  const getHiddenCanvasSty = key => {
    const res = ((pageConfig[key] * percentageValue) / 100).toFixed(2);
    return parseFloat(res);
  };

  const onMouseOver = useCallback(() => {
    pointInCanvasRef.current = true;
  }, []);

  const onMouseLeave = useCallback(() => {
    pointInCanvasRef.current = false;
  }, []);

  const { layoutType, ruleStyle } = pageConfig || {};
  const isGrid = layoutType && layoutType === 'grid';

  const gridLayoutProps = {
    properties: useCompList.filter(v => v.compName !== 'Group'),
    pageConfig,
    percentageValue,
    gridFlatArrBatchUpdate,
    delPageComp,
    onMouseUp,
    showClickStatus,
    isSelectCompInfo,
    mulIdArrForLine,
    onDragStop,
    onResizeStop,
  };

  return (
    <div className={styles.containerDiv} id="containerDiv">
      <div
        className={styles.ca}
        id="ca"
        style={{
          width: getHiddenCanvasSty('pageWidth') + 200,
          height: getHiddenCanvasSty('pageHeight') + 200,
        }}
      >
        <EditPageRuler
          width={pageConfig.pageWidth + 50}
          height={pageConfig.pageHeight + 50}
          scale={percentageValue / 100}
          itemHeight={16}
          config={{
            lineColor: ruleStyle?.lineColor,
          }}
        />
      </div>
      <div
        className={styles.hiddenCanvas}
        style={{
          width: getHiddenCanvasSty('pageWidth'),
          height: getHiddenCanvasSty('pageHeight'),
          marginLeft: 16,
          marginTop: 16,
        }}
      >
        <div
          className={styles.canvas}
          onMouseLeave={onMouseLeave}
          onMouseOver={onMouseOver}
          onKeyDown={emitDelete}
          id="canvas"
          onClick={containerDivClick}
          style={{
            fontFamily: 'myFont',
            width: pageConfig.pageWidth,
            height: pageConfig.pageHeight,
            backgroundColor: pageConfig.bgc,
            backgroundImage: `url(${staticPath}/${pageConfig.id}/${pageConfig.bgi})`,
            transform: `scale(${percentageValue / 100}, ${percentageValue / 100})`,
          }}
        >
          {!!isGrid ? (
            <LayoutContent {...gridLayoutProps} />
          ) : (
            useCompList.map(v => {
              const props = {
                v,
                inputEl,
                lang,
                pageConfig,
                mulIdArrForLine,
                percentageValue,
                onDragStop,
                onResizeStop,
                showClickStatus,
                onMouseUp,
                isSelectCompInfo,
                pageWrapData,
              };
              return <EditRender {...props} key={v.id}></EditRender>;
            })
          )}
        </div>
      </div>
    </div>
  );
}

const mapDispatchToProps = dispatch => {
  return {
    updateState(payload) {
      dispatch({
        type: 'edit/updateState',
        payload,
      });
    },
    delPageComp: data => {
      return dispatch({
        type: 'edit/delPageComp',
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
    gridFlatArrBatchUpdate: payload => {
      return dispatch({
        type: 'edit/gridFlatArrBatchUpdate',
        payload,
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
  };
};

export default connect(({ edit, loading, users }) => {
  const lang = getLocaleMode();
  return {
    lang,
    pageConfig: edit.pageConfig,
    initFetchLoading: loading.effects['edit/initFetch'],
    addThemeConfigLoading: loading.effects['edit/addThemeConfig'],
    mulArr: edit.mulArr,
    pageWrapData: edit.pageWrapData,
    hiddenDoGroup: edit.hiddenDoGroup,
    hiddenCancelGroup: edit.hiddenCancelGroup,
    isSelectCompInfo: edit.isSelectCompInfo,
    currentUser: users.currentUser,
  };
}, mapDispatchToProps)(Form.create()(App));
