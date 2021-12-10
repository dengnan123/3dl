import { withMixin } from '../../helpers/dva';
import { getParseSearch, getClickInfo, getClickInfoById, getGridConfig } from '../../helpers/utils';
import { updateCompIndex } from '@/helpers/zIndex';
import { getChildIds, updateAndBakDataByKey } from '@/helpers/arrayUtil';
import compilers from '@/helpers/babel/compilers';
import {
  syncStyle,
  generaterArrByMul,
  getMinLeft,
  getMinTop,
  getMaxWidth,
  getHeightDiff,
  reductionArr,
  getInfoById,
  dealWithCvData,
  getTreeIds,
} from '@/helpers/utils';
import { html2CanvasBase64 } from '@/helpers/canvas';
import { dealWithDoGroupData, closeSync } from '@/helpers/view';
import { loadCumtomFuncToWindow } from '@/hooks/usePreviewModal';
import router from 'umi/router';
import { getMaxZIndex } from '@/helpers/zIndex';
import uuid from 'uuid';
// import { omit } from 'lodash';
import {
  fetchCompList,
  fetchPageUseCompList,
  addCompToPage,
  updatePageComp,
  fetchPageConfig,
  updatePage,
  generatePagePic,
  cancelGroup,
  doGroup,
  batchAddComp,
  saveAllData,
  addDataSource,
  getAllDataSourceByPageId,
  updateDataSourceById,
  deleteDataSourceById,
  addTheme,
  getThemeList,
  deleteTheme,
  updateTheme,
  getThemeConfigList,
  deleteThemeConfig,
  addThemeConfig,
  markSureEmptyPage,
  pluginMenu,
  flatArrBatchUpdate,
  flatArrBatchDeletePageComp,
  copyBatchAddComp,
} from '../../service';
import { findAllList } from '@/service/customFunc';
import { message } from 'antd';
import { getPageWrapList } from '@/service/apiHost';
compilers.initCompiler(); // 初始化babel
export default withMixin({
  namespace: 'edit',
  state: {
    locationPathname: '',
    locationQuery: {},
    initCompList: [],
    initUseCompList: [], // 最终渲染用的数组，有
    pageConfig: {},
    pageCoverPic: null,
    hiddenDoGroup: false,
    hiddenCancelGroup: false,
    isPress: false,
    drawerVisible: false,
    modalVisible: false,
    rightConfigVis: true,
    leftLayerVis: true,
    modalType: null,
    showDrawerType: null,
    itemCompClickData: {}, // 保存点击图表上传的信息
    mulArr: [], // 多选数组
    themeList: [],
    socketData: {},
    dataSourceList: [],
    isSelectCompInfo: {}, // 当前点击的组件数据
    editSelectInfoBak: null,
    themeConfigList: [],
    compMenuList: [],
    apiHostList: [],
    pageWrapData: {},
  },
  subscriptions: {
    setup(data) {
      const { dispatch, history } = data;
      history.listen(({ pathname }) => {
        const { pageId, tagId } = getParseSearch();
        if (pathname === '/edit') {
          if (!pageId) {
            router.push('/list');
            return;
          }
          dispatch({
            type: 'initFetch',
            payload: {
              pageId: parseInt(pageId),
              tagId: parseInt(tagId),
            },
          });
        }
      });
    },
  },
  effects: {
    *initFetch({ payload: { pageId, tagId } }, { put, call, select, all }) {
      const res = yield all([
        call(fetchCompList, {}),
        call(fetchPageUseCompList, {
          pageId,
          type: 'edit', // 编辑页面是tree形结构数据
        }),
        call(fetchPageConfig, {
          pageId,
        }),
        call(getAllDataSourceByPageId, {
          pageId,
        }),
        call(findAllList, {
          pageId,
          tagId,
        }),
        call(getPageWrapList, {
          pageId,
          tagId,
        }),
      ]);

      const initCompList = res[0].data;
      const initUseCompList = res[1].data;
      const pageConfig = res[2].data;
      const dataSourceList = res[3].data;
      const customFuncList = res[4].data;
      const pageWrapData = res[5].data;
      loadCumtomFuncToWindow(customFuncList);
      if (res[1].errorCode !== 200 || res[2].errorCode !== 200) {
        router.push('list');
        return;
      }

      const { gridLayout, ruleStyle } = pageConfig;
      let layoutParams = gridLayout || {};
      if (typeof gridLayout === 'string') {
        layoutParams = JSON.parse(gridLayout);
      }

      let ruleConfig = ruleStyle || {};
      if (typeof ruleStyle === 'string') {
        ruleConfig = JSON.parse(ruleStyle);
      }

      yield put({
        type: 'updateState',
        payload: {
          initCompList,
          initUseCompList,
          pageConfig: { ...pageConfig, gridLayout: layoutParams, ruleStyle: ruleConfig },
          dataSourceList,
          pageWrapData,
        },
      });
    },
    *updateIndex({ payload }, { put, call, select, all }) {
      const { eventName } = payload;
      const { initUseCompList, isSelectCompInfo } = yield select(_ => _.edit);
      const resData = updateCompIndex({
        arr: initUseCompList,
        isSelectCompInfo,
        key: eventName,
      });
      if (!resData) {
        return;
      }
      const { newArr, changeArr } = resData;
      yield put({
        type: 'updateState',
        payload: {
          initUseCompList: newArr,
        },
      });
      const newChangeArr = changeArr.map(v => {
        return {
          id: v.id,
          zIndex: v.zIndex,
        };
      });
      yield call(flatArrBatchUpdate, newChangeArr);
    },
    *updateDataById({ payload }, { put, call, select, all }) {
      const { id } = payload;
      const { initUseCompList } = yield select(_ => _.edit);
      const { newArr } = updateAndBakDataByKey({
        condition: {
          id,
        },
        arr: initUseCompList,
        data: payload,
      });
      yield put({
        type: 'updateState',
        payload: {
          initUseCompList: newArr,
        },
      });
      yield put({
        type: 'updatePageComp',
        payload,
      });
    },
    *attributeUpdate({ payload }, { put, call, select, all }) {
      // 属性变化的操作
      const { data, id } = payload;
      const { initUseCompList: useCompList, isSelectCompInfo } = yield select(_ => _.edit);
      const shouldCloseSync = closeSync({
        isSelectCompInfo,
        data,
      });
      let newArr;
      if (shouldCloseSync) {
        // 只更新自己 不更新子组件
        const newData = updateAndBakDataByKey({
          condition: {
            id,
          },
          arr: useCompList,
          data,
        });
        newArr = newData.newArr;
      } else {
        newArr = syncStyle(useCompList, data, id);
      }
      yield put({
        type: 'updateState',
        payload: {
          initUseCompList: newArr,
          isSelectCompInfo: {
            ...isSelectCompInfo,
            ...data,
          },
        },
      });
      let newData = {
        id,
        ...data,
      };
      if (!shouldCloseSync) {
        const nowInfo = getClickInfoById(newArr, id);
        newData = {
          ...dealWithDoGroupData(nowInfo),
          ...newData,
        };
      }
      yield put({
        type: 'updatePageComp',
        payload: newData,
      });
    },
    *commonUpdate({ payload }, { put, call, select, all }) {
      // 属性变化的操作
      const { data, id } = payload;
      const { initUseCompList: useCompList } = yield select(_ => _.edit);
      const newArr = useCompList.map(v => {
        if (v.id === id) {
          let grid = {};
          if (!!data.grid && !!v.grid) {
            grid = {
              ...v.grid,
              ...data.grid,
            };
          }
          return {
            ...v,
            ...data,
            grid,
          };
        }
        return v;
      });
      yield put({
        type: 'updateState',
        payload: {
          initUseCompList: newArr,
        },
      });
      const nowInfo = newArr.filter(v => v.id === id)[0] || {};
      yield put({
        type: 'updatePageComp',
        payload: {
          id,
          ...nowInfo,
          ...data,
          oldLeft: nowInfo.left,
          oldTop: nowInfo.top,
          oldWidth: nowInfo.width,
          oldHeight: nowInfo.height,
        },
      });
    },
    *onlyUpdateChangeData({ payload }, { put, call, select, all }) {
      const { data, id } = payload;
      const { initUseCompList, isSelectCompInfo } = yield select(_ => _.edit);
      const { newArr } = updateAndBakDataByKey({
        condition: {
          id,
        },
        arr: initUseCompList,
        data,
      });
      yield put({
        type: 'updateState',
        payload: {
          initUseCompList: newArr,
          isSelectCompInfo: {
            ...isSelectCompInfo,
            ...data,
          },
        },
      });
      yield put({
        type: 'updatePageComp',
        payload: {
          id,
          ...data,
        },
      });
      return 'ok';
    },
    *saveContainerDeps({ payload }, { put, call, select, all }) {
      // 属性变化的操作
      const { data, id } = payload;
      const { initUseCompList: useCompList } = yield select(_ => _.edit);
      const { containerDeps } = data;
      if (!containerDeps.length) {
        return;
      }
      const containerId = containerDeps[0];
      const info = getInfoById(useCompList, id);
      const newArr = useCompList
        .map(v => {
          if (v.id === containerId) {
            if (v.child) {
              return {
                ...v,
                child: [...v.child, info], // 放到容器中
              };
            } else {
              return {
                ...v,
                child: [info],
              };
            }
          }
          return v;
        })
        .filter(v => v.id !== id); // 把自己过滤掉
      yield put({
        type: 'updateState',
        payload: {
          initUseCompList: newArr,
        },
      });
      yield put({
        type: 'updatePageComp',
        payload: {
          id,
          groupId: containerId,
        },
      });
    },
    *saveDataDeps({ payload }, { put, call, select, all }) {
      // 属性变化的操作
      const { data, id } = payload;
      const { initUseCompList, isSelectCompInfo } = yield select(_ => _.edit);
      const { newArr } = updateAndBakDataByKey({
        condition: {
          id,
        },
        arr: initUseCompList,
        data,
      });
      yield put({
        type: 'updateState',
        payload: {
          initUseCompList: newArr,
          isSelectCompInfo: {
            ...isSelectCompInfo,
            ...data,
          },
        },
      });
      yield put({
        type: 'updatePageComp',
        payload: {
          id,
          ...data,
        },
      });
    },
    *cancelDeps({ payload }, { put, call, select, all }) {
      // 属性变化的操作
      const { data, id } = payload;
      const { initUseCompList: useCompList } = yield select(_ => _.edit);
      const newArr = useCompList.map(v => {
        if (v.id === id) {
          return {
            ...v,
            ...data,
          };
        }
        return v;
      });
      yield put({
        type: 'updateState',
        payload: {
          initUseCompList: newArr,
        },
      });
      const nowInfo = newArr.filter(v => v.id === id)[0] || {};
      yield put({
        type: 'updatePageComp',
        payload: {
          id,
          ...nowInfo,
          ...data,
          oldLeft: nowInfo.left,
          oldTop: nowInfo.top,
          oldWidth: nowInfo.width,
          oldHeight: nowInfo.height,
        },
      });
    },

    *fetchCompList({ payload }, { put, call, select }) {
      const { errorCode, data } = yield call(fetchCompList, {
        ...payload,
      });
      if (errorCode !== 200) {
        return;
      }
      yield put({
        type: 'updateState',
        payload: {
          initCompList: data,
        },
      });
    },
    *fetchPageUseCompList({ payload }, { put, call, select }) {
      const { errorCode, data } = yield call(fetchPageUseCompList, {
        ...payload,
      });
      if (errorCode !== 200) {
        return;
      }
      const newData = data.filter(v => {
        if (v.compName === 'Group') {
          return false;
        }
        return true;
      });

      yield put({
        type: 'updateState',
        payload: {
          initUseCompList: newData,
        },
      });
    },
    *refeshPageUseCompList({ payload }, { put, call, select, all }) {
      const { pageId } = getParseSearch();
      const res = yield all([
        call(fetchPageUseCompList, {
          ...payload,
          pageId,
        }),
        call(getPageWrapList, {
          ...payload,
          pageId,
        }),
      ]);
      if (res[0]?.errorCode !== 200 || res[1]?.errorCode !== 200) {
        return;
      }
      const initUseCompList = res[0].data;
      const pageWrapData = res[1].data;
      yield put({
        type: 'updateState',
        payload: {
          initUseCompList,
          pageWrapData,
        },
      });
    },
    *fetchPageConfig({ payload }, { put, call, select }) {
      const { errorCode, data } = yield call(fetchPageConfig, {
        ...payload,
      });
      if (errorCode !== 200) {
        return;
      }

      const { gridLayout, ruleStyle } = data;
      let layoutParams = gridLayout || {};
      if (typeof gridLayout === 'string') {
        layoutParams = JSON.parse(gridLayout);
      }

      let ruleConfig = ruleStyle || {};
      if (typeof ruleStyle === 'string') {
        ruleConfig = JSON.parse(ruleStyle);
      }

      yield put({
        type: 'updateState',
        payload: {
          pageConfig: { ...data, gridLayout: layoutParams, ruleStyle: ruleConfig },
        },
      });
    },
    *addCompToPage({ payload }, { put, call, select }) {
      const inputData = {
        ...payload,
        pageId: parseInt(payload.pageId),
      };

      const bakData = Object.assign({}, inputData);

      // delete inputData.id; // 去除UUID
      const { errorCode, data } = yield call(addCompToPage, inputData);
      const { id } = bakData;
      const { initUseCompList } = yield select(_ => _.edit);
      if (errorCode !== 200) {
        // 说明没保存成功需要把刚才塞进model里面的删除掉
        const newList = initUseCompList.filter(v => v.id !== id);
        yield put({
          type: 'updateState',
          payload: {
            initUseCompList: newList,
          },
        });
        return;
      }

      // 保存成功后 把原来数据的ID替换成新ID
      const newList = initUseCompList.map(v => {
        if (v.id === id) {
          return {
            ...v,
            id: data.id,
          };
        }
        return v;
      });
      yield put({
        type: 'updateState',
        payload: {
          initUseCompList: newList,
        },
      });
    },
    *updatePageComp({ payload }, { put, call, select }) {
      const { initUseCompList } = yield select(_ => _.edit);
      const { errorCode, data } = yield call(updatePageComp, {
        ...payload,
      });
      if (errorCode !== 200) {
        return;
      }
      const { newArr } = updateAndBakDataByKey({
        condition: {
          id: data.id,
        },
        arr: initUseCompList,
        data,
      });
      yield put({
        type: 'updateState',
        payload: {
          initUseCompList: newArr,
        },
      });
      return 'ok';
    },
    *doGroup({ payload }, { put, call, select }) {
      /**
       * 做数据处理 只保留后端需要的数据
       */
      const data = dealWithDoGroupData(payload);
      const { errorCode } = yield call(doGroup, {
        ...data,
      });
      if (errorCode !== 200) {
        return;
      }
    },
    *cancelGroup({ payload }, { put, call, select }) {
      const { errorCode } = yield call(cancelGroup, {
        ...payload,
      });
      if (errorCode !== 200) {
        return;
      }
    },
    *delPageComp({ payload }, { put, call, select }) {
      const { isSelectCompInfo } = yield select(_ => _.edit);

      const ids = getTreeIds(isSelectCompInfo);
      const { errorCode } = yield call(flatArrBatchDeletePageComp, {
        ids,
      });
      if (errorCode !== 200) {
        message.error('删除失败！');
        return;
      }
      // 删除后刷新下页面
      const { pageId } = getParseSearch();
      yield put({
        type: 'refeshPageUseCompList',
        payload: {
          pageId,
          type: 'edit',
        },
      });
      return 'ok';
    },
    *moveOut({ payload }, { put, call, select }) {
      const { isSelectCompInfo } = yield select(_ => _.edit);
      const { id } = isSelectCompInfo;
      const { errorCode } = yield call(updatePageComp, {
        id,
        groupId: null,
      });
      if (errorCode !== 200) {
        return;
      }
      // 删除后刷新下页面
      const { pageId } = getParseSearch();
      yield put({
        type: 'refeshPageUseCompList',
        payload: {
          pageId,
          type: 'edit',
        },
      });
    },
    *moveIn({ payload }, { call, select, put }) {
      const { isSelectCompInfo } = yield select(_ => _.edit);
      yield call(updatePageComp, {
        id: isSelectCompInfo.id,
        groupId: payload.id,
      });
      yield put({
        type: 'refeshPageUseCompList',
        payload: {
          type: 'edit',
        },
      });
    },
    // 批量更新
    *flatArrBatchUpdate({ payload }, { put, call, select }) {
      const { errorCode } = yield call(flatArrBatchUpdate, payload);
      if (errorCode !== 200) {
        return;
      }
      yield put({
        type: 'updateState',
        payload: {
          initUseCompList: payload,
        },
      });
    },
    // 栅格布局的批量更新
    *gridFlatArrBatchUpdate({ payload }, { put, call, select }) {
      const { list, id, widthRate, heightRate } = payload;
      const { child } = getClickInfoById(list, id);
      const getLeftAndWidth = ({ basicStyle, left, width }) => {
        if (basicStyle.forbidScale) {
          // 禁止缩放
          return {
            left,
            width,
          };
        }
        if (widthRate === 1) {
          return {
            left,
            width,
          };
        }
        return {
          left: left * widthRate,
          width: width * widthRate,
        };
      };
      const getTopAndHeight = ({ basicStyle, top, height }) => {
        if (basicStyle.forbidScale) {
          // 禁止缩放
          return {
            top,
            height,
          };
        }
        if (heightRate === 1) {
          return {
            top,
            height,
          };
        }
        return {
          top: top * heightRate,
          height: height * heightRate,
        };
      };
      const getNewChild = child => {
        if (child?.length) {
          return child.map(v => {
            return {
              ...v,
              ...getLeftAndWidth(v),
              ...getTopAndHeight(v),
            };
          });
        }
        return [];
      };
      const newChild = getNewChild(child);
      const newUpdateList = [...list, ...newChild].map(v => {
        // 只保留栅格布局位置大小更改 需要的数据
        return {
          grid: v.grid,
          width: v.width,
          height: v.height,
          left: v.left,
          top: v.top,
          id: v.id,
          groupId: v.groupId,
        };
      });
      const { errorCode } = yield call(flatArrBatchUpdate, newUpdateList);
      if (errorCode !== 200) {
        return;
      }
      const newList = list.map(v => {
        if (v.id === id) {
          return {
            ...v,
            child: newChild,
          };
        }
        return v;
      });
      yield put({
        type: 'updateState',
        payload: {
          initUseCompList: newList,
        },
      });
    },
    *updatePage({ payload }, { put, call, select }) {
      // 获取当前大屏的ID
      const { pageId } = getParseSearch();
      yield call(updatePage, {
        ...payload,
        id: parseInt(pageId),
      });
      // 刷新 fetchPageConfig
      yield put({
        type: 'fetchPageConfig',
        payload: {
          pageId,
        },
      });
    },
    *generatePagePic({ payload }, { put, call, select }) {
      const { pageId } = getParseSearch();
      const { pageConfig } = yield select(_ => _.edit);
      const pageDom = document.querySelector('#canvas');
      const base64 = yield call(html2CanvasBase64, pageDom, {
        // allowTaint: true,
        useCORS: true,
        width: pageConfig.pageWidth,
        height: pageConfig.pageHeight,
        windowWidth: pageDom.scrollWidth,
        windowHeight: pageDom.scrollHeight,
        x: 0,
        y: window.pageXOffset,
      });

      const { errorCode } = yield call(generatePagePic, {
        ...pageConfig,
        pageId: parseInt(pageId),
        imgSrc: base64,
      });
      if (errorCode !== 200) {
        return;
      }
      yield put({
        type: 'updateState',
        payload: {
          pageCoverPic: base64,
        },
      });
    },
    *addCusCompToUseCompList({ payload }, { put, call, select }) {
      const { pageId } = getParseSearch();
      const { compName, mockData, type } = payload;
      const { initUseCompList, pageConfig } = yield select(_ => _.edit);
      const maxIndex = getMaxZIndex(initUseCompList) || 0;
      const id = uuid.v4();
      const { layoutType } = pageConfig;
      const getLeftAndTop = () => {
        if (layoutType === 'grid') {
          return {
            left: 0,
            top: 0,
          };
        }
        return {
          left: payload.left || 100,
          top: payload.top || 100,
        };
      };
      let newInfo = {
        id,
        gridKey: id,
        compName,
        pageId: parseInt(pageId),
        ...getLeftAndTop(),
        width: 400,
        height: 300,
        zIndex: maxIndex + 1,
        deps: [],
        containerDeps: [],
        isSelect: false,
        style: {
          grid: {
            leftType: '%',
            topType: '%',
            rightType: '%',
            bottomType: '%',
            left: '12',
            top: '6',
            right: '6',
            bottom: '12',
          },
        },
        basicStyle: {},
        mockData,
        type,
        useDataType: 'JSON',
      };

      // 如果是栅格系统的话 添加x,y,w,h
      const itemGrid = getGridConfig(initUseCompList, pageConfig);
      newInfo['grid'] = {
        ...itemGrid,
      };

      const arr = [...initUseCompList, newInfo];
      yield put({
        type: 'updateState',
        payload: {
          initUseCompList: arr,
        },
      });

      yield put({
        type: 'addCompToPage',
        payload: {
          ...newInfo,
          pageId,
        },
      });
    },
    *doGroupApi({ payload }, { put, call, select }) {
      const { mulArr, pageConfig, initUseCompList: useCompList } = yield select(_ => _.edit);

      if (!mulArr.length || mulArr.length < 2) {
        return;
      }
      const { left } = getMinLeft(mulArr);
      const { top } = getMinTop(mulArr);
      const width = getMaxWidth(pageConfig.pageWidth, mulArr);
      const height = getHeightDiff(pageConfig.pageHeight, mulArr);
      const { newArr, newGroupData } = generaterArrByMul(mulArr, useCompList, {
        left,
        top,
        width,
        height,
      });
      yield put({
        type: 'updateState',
        payload: {
          initUseCompList: newArr,
          mulArr: [],
        },
      });
      yield put({
        type: 'doGroup',
        payload: newGroupData,
      });
      return newGroupData.id;
    },
    *cancelGroupApi({ payload }, { put, call, select }) {
      const { id } = payload;
      const { initUseCompList: useCompList } = yield select(_ => _.edit);
      const childIds = getChildIds(useCompList, id);
      const arr = reductionArr(useCompList, id);
      const _arr = arr.map(v => {
        return {
          ...v,
          transformY: 0,
          translateX: 0,
          perHeight: 1,
          perWidth: 1,
        };
      });
      yield put({
        type: 'updateState',
        payload: {
          initUseCompList: _arr,
          mulArr: [],
        },
      });
      yield put({
        type: 'cancelGroup',
        payload: {
          id,
          childIds,
        },
      });
    },
    *cv({ payload }, { put, call, select }) {
      const { id } = payload;
      const { initUseCompList } = yield select(_ => _.edit);
      const { newArr, flatArr } = dealWithCvData({
        initUseCompList,
        id,
      });
      yield put({
        type: 'updateState',
        payload: {
          initUseCompList: newArr,
        },
      });
      yield call(batchAddComp, flatArr);
    },
    *cvToOtherApi({ payload }, { put, call, select }) {
      //把模板组件添加到页面上
      const { pageId, id } = payload;
      yield call(copyBatchAddComp, {
        id,
        newPageId: pageId,
      });
      message.success('复制成功');
    },
    // 保存所有数据
    *saveAllData({ payload }, { call, select }) {
      const { initUseCompList } = yield select(_ => _.edit);
      yield call(saveAllData, { compList: initUseCompList });
    },
    // 数据新增
    *addDataSource({ payload }, { call, select, put }) {
      const { pageId } = getParseSearch();
      const { errorCode, message: errMsg } = yield call(addDataSource, { ...payload, pageId });
      if (errorCode === 200) {
        return 'success';
      }
      message.error(errMsg || '添加失败！');
      return '';
    },
    // 获取所有数据源列表
    *getAllDataSourceByPageId({ payload }, { call, select, put }) {
      const { pageId } = getParseSearch();
      const { data, errorCode } = yield call(getAllDataSourceByPageId, { pageId });
      if (errorCode !== 200) {
        return;
      }
      yield put({
        type: 'updateState',
        payload: {
          dataSourceList: data,
        },
      });
    },
    *updateDataSourceById({ payload }, { call, select }) {
      const { errorCode } = yield call(updateDataSourceById, payload);
      if (errorCode === 200) {
        return 'success';
      }
    },
    *deleteDataSourceById({ payload }, { call, select }) {
      const { errorCode } = yield call(deleteDataSourceById, payload);
      if (errorCode === 200) {
        return 'success';
      }
    },
    *addTheme({ payload }, { call, select, put }) {
      // const { pageId } = getParseSearch();

      const { errorCode } = yield call(addTheme, payload);
      if (errorCode !== 200) {
        return;
      }
      return 'ok';
    },
    *getThemeList({ payload }, { call, select, put }) {
      // const { pageId } = getParseSearch();
      const { data, errorCode } = yield call(getThemeList);
      if (errorCode !== 200) {
        return;
      }
      yield put({
        type: 'updateState',
        payload: {
          themeList: data,
        },
      });
    },
    //deleteTheme
    *deleteTheme({ payload }, { call, select, put }) {
      const { errorCode } = yield call(deleteTheme, payload);
      if (errorCode !== 200) {
        return;
      }
      return 'ok';
    },
    *updateTheme({ payload }, { call, select, put }) {
      const { errorCode } = yield call(updateTheme, payload);
      if (errorCode !== 200) {
        return;
      }
      return 'ok';
    },
    *confirmChangeChart({ payload }, { call, select, put }) {
      const { initUseCompList } = yield select(_ => _.edit);
      const data = getClickInfo(initUseCompList);
      return yield put({
        type: 'updatePageComp',
        payload: data,
      });
    },
    *addThemeConfig({ payload }, { call, select, put }) {
      const { errorCode } = yield call(addThemeConfig, payload);
      if (errorCode !== 200) {
        return;
      }
      message.success('发布成功！');
      return 'ok';
    },
    *getThemeConfigList({ payload }, { call, select, put }) {
      const { data, errorCode } = yield call(getThemeConfigList, payload);
      if (errorCode !== 200) {
        return;
      }
      yield put({
        type: 'updateState',
        payload: {
          themeConfigList: data,
        },
      });
    },
    *getPluginMenu({ payload }, { call, select, put }) {
      const { data, errorCode } = yield call(pluginMenu, {
        pageSize: 999,
      });
      if (errorCode !== 200) {
        return;
      }
      yield put({
        type: 'updateState',
        payload: {
          compMenuList: data,
        },
      });
    },
    *deleteThemeConfig({ payload }, { call, select, put }) {
      // const { pageId } = getParseSearch();
      const { errorCode } = yield call(deleteThemeConfig, payload);
      if (errorCode !== 200) {
        return;
      }
      return 'ok';
    },
    //markSureEmptyPage
    *markSureEmptyPage({ payload }, { call, select, put }) {
      const { pageId } = getParseSearch();
      const { errorCode } = yield call(markSureEmptyPage, { pageId });
      if (errorCode !== 200) {
        return;
      }
      return 'ok';
    },
    //hiddenComp
    *hiddenComp({ payload }, { call, select, put }) {
      const { id, isHidden } = payload;
      const { initUseCompList, isSelectCompInfo } = yield select(_ => _.edit);
      const { newArr } = updateAndBakDataByKey({
        condition: {
          id,
        },
        arr: initUseCompList,
        data: {
          isHidden,
        },
      });

      yield put({
        type: 'updateState',
        payload: {
          initUseCompList: newArr,
          isSelectCompInfo: {
            ...isSelectCompInfo,
            isHidden,
          },
        },
      });
      yield put({
        type: 'updatePageComp',
        payload: {
          id,
          isHidden,
        },
      });
    },
    *getPageWrapList({ payload }, { call, select, put }) {
      const { pageId, tagId } = getParseSearch();
      const { errorCode, data } = yield call(getPageWrapList, {
        pageId,
        tagId,
      });
      if (errorCode !== 200) {
        return;
      }
      yield put({
        type: 'updateState',
        payload: {
          pageWrapData: data,
        },
      });
    },
  },
  reducers: {
    addDataUseCompList(state, { payload }) {
      const { initUseCompList } = state;
      const arr = initUseCompList.map(v => {
        if (v.id === payload.id) {
          return {
            ...payload,
            isSelect: v.isSelect,
          };
        }
        return v;
      });
      return {
        ...state,
        initUseCompList: arr,
      };
    },
    updateMulArr(state, { payload }) {
      const { mulArr, initUseCompList: useCompList } = state;
      const { id } = payload;
      const hasArr = mulArr.filter(v => v.id === id);
      if (!hasArr.length) {
        const _arr = useCompList.filter(v => v.id === id);
        return {
          ...state,
          mulArr: [...mulArr, ..._arr],
        };
      }
      return {
        ...state,
      };
    },
    updateArrInfoById(state, { payload }) {
      const { initUseCompList } = state;
      const { id } = payload;
      const newArr = initUseCompList.map(v => {
        if (v.id === id) {
          return {
            ...v,
            ...payload,
          };
        }
        return v;
      });
      return {
        ...state,
        initUseCompList: newArr,
      };
    },
    changeTheme(state, { payload }) {
      const { initUseCompList, editSelectInfoBak } = state;
      const { newArr, bakInfo } = updateAndBakDataByKey({
        condition: {
          id: payload.id,
        },
        arr: initUseCompList,
        data: {
          ...payload,
        },
        bakInfo: editSelectInfoBak,
      });
      return {
        ...state,
        initUseCompList: newArr,
        editSelectInfoBak: bakInfo,
      };
    },
    restoreData(state, { payload }) {
      const { editSelectInfoBak, initUseCompList } = state;
      if (!editSelectInfoBak) {
        return {
          ...state,
        };
      }
      const { newArr } = updateAndBakDataByKey({
        condition: {
          id: editSelectInfoBak.id,
        },
        arr: initUseCompList,
        data: {
          ...editSelectInfoBak,
        },
      });

      return {
        ...state,
        initUseCompList: newArr,
        editSelectInfoBak: null,
      };
    },
    changeToOtherChart(state, { payload }) {
      const { initUseCompList, isSelectCompInfo } = state;
      const newInfo = {
        ...isSelectCompInfo,
        compName: payload.compName,
      };
      const newArr = initUseCompList.map(v => {
        if (v.isClick) {
          return newInfo;
        }
        return v;
      });
      return {
        ...state,
        initUseCompList: newArr,
      };
    },
  },
});
