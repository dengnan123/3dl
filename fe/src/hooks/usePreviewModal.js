import { useState, useCallback } from 'react';
import { setLocaleMode } from '@/helpers/storage';
import { fetchPageUseCompList } from '@/service/index';
import { getPageAggregateApi } from '@/service/apiHost';
// import { buildTimeCheck } from '@/service/check';
import { v4 as uuid } from 'uuid';
// import { findAllList } from '@/service/customFunc';
import { tranformPxToVw } from '@/helpers/screen';
import { getParseSearch } from '@/helpers/utils';
import { getNewPassParams } from '@/hooks/preview/util';
import { updateTreeArrByCondFunc } from '@/helpers/arrayUtil';
import { isArray } from 'lodash';
import { updateListBysaveDeps, getContainerHash } from '@/helpers/utils';
const { pageId, tagId, lang, type } = getParseSearch();
const getDyType = v => {
  if (!v) {
    return;
  }
  const typeArr = ['allSpread', 'widthSpread', 'default', 'fullScreen'];
  if (typeArr.includes(v)) {
    return v;
  }
};
const getDyLang = v => {
  if (!v) {
    return;
  }
  const langArr = ['zh-CN', 'en-US'];
  if (langArr.includes(v)) {
    return v;
  }
};
export const useModal = () => {
  const [modalState, setState] = useState({
    initUseCompList: [],
    bakInitUseCompList: [],
    pageConfig: {},
    idParams: {},
    lang: 'zh-CN',
    dataSourceList: [],
    apiHostList: [],
    envList: [],
    passParamsHash: {}, // 存放组件之间需要传递的参数
    pageWrapData: {},
  });

  const init = async props => {
    const _pageId = props.pageId || pageId;
    const _tagId = props.tagId || tagId;
    const res = await getPageAggregateApi({
      pageId: _pageId,
      tagId: _tagId,
    });

    const { data, errorCode } = res;
    if (errorCode !== 200) {
      return;
    }
    let {
      initUseCompList,
      pageConfig,
      dataSourceList,
      apiHostList,
      envList,
      customFuncList,
      pageWrapData,
    } = data;
    const dyType = getDyType(type);
    const dyLang = getDyLang(lang);
    if (dyType) {
      pageConfig.type = dyType;
    }

    initUseCompList = dealWithInitInitUseCompList({
      pageConfig,
      initUseCompList,
    });

    const { gridLayout } = pageConfig;
    let layoutParams = gridLayout || {};
    if (typeof gridLayout === 'string') {
      layoutParams = JSON.parse(gridLayout);
    }
    const containerHash = getContainerHash(initUseCompList);
    let newList = updateListBysaveDeps({
      containerHash,
      initUseCompList,
    });

    loadCumtomFuncToWindow(customFuncList);
    setState(state => {
      const data = {
        ...state,
        initUseCompList: newList,
        pageConfig: { ...pageConfig, gridLayout: layoutParams },
        bakInitUseCompList: initUseCompList,
        dataSourceList,
        apiHostList,
        envList,
        pageWrapData,
      };
      if (dyLang) {
        data.lang = dyLang;
      }
      return data;
    });
  };
  const fetchPageUseCompListApi = useCallback(async () => {
    const { errorCode, data } = await fetchPageUseCompList({
      pageId,
    });
    if (errorCode !== 200) {
      return;
    }
    setState(state => {
      return {
        ...state,
        initUseCompList: data,
      };
    });
  }, []);

  const updateClearParams = useCallback(payload => {
    setState(state => {
      const { initUseCompList } = state;
      const { shouldClear } = payload;
      const newArr = updateTreeArrByCondFunc({
        conditionFunc({ id }) {
          if (shouldClear && shouldClear?.length && shouldClear.includes(id)) {
            return true;
          }
        },
        arr: initUseCompList,
        data: {
          shouldClearParams: uuid(),
        },
        otherData: {
          shouldClearParams: false,
        },
      });
      return {
        ...state,
        initUseCompList: newArr,
      };
    });
  }, []);

  const updateCompsHiddenOrShow = useCallback(payload => {
    const { showComps, hiddenComps } = payload;
    if (showComps?.length) {
      setState(state => {
        const { initUseCompList } = state;
        const newArr = updateTreeArrByCondFunc({
          conditionFunc({ id }) {
            if (showComps.includes(id)) {
              return true;
            }
          },
          arr: initUseCompList,
          data: {
            isHidden: 0,
          },
        });
        return {
          ...state,
          initUseCompList: newArr,
        };
      });
      return;
    }
    setState(state => {
      const { initUseCompList } = state;
      const newArr = updateTreeArrByCondFunc({
        conditionFunc({ id }) {
          if (hiddenComps.includes(id)) {
            return true;
          }
        },
        arr: initUseCompList,
        data: {
          isHidden: 1,
        },
      });
      return {
        ...state,
        initUseCompList: newArr,
      };
    });
  }, []);

  const updateLoading = useCallback(payload => {
    setState(state => {
      const { initUseCompList } = state;
      const newArr = initUseCompList.map(v => {
        if (v.id === payload.id) {
          const data = {
            ...v,
            ...payload,
          };
          return data;
        }
        return v;
      });
      return {
        ...state,
        initUseCompList: newArr,
      };
    });
  }, []);

  const updatePassParamsHash = useCallback(payload => {
    setState(state => {
      const { passParamsHash } = state;
      const { ids, params, otherCompParamsFilterFuncArr, selfId } = payload;
      const newParamsHash = {
        ...passParamsHash,
      };

      for (const id of ids) {
        const newParams =
          getNewPassParams({
            otherCompParamsFilterFuncArr,
            id,
            params,
            selfOtherCompParams: passParamsHash[selfId],
          }) || {};
        const oldParams = passParamsHash[id] || {};
        // 新旧合并
        newParamsHash[id] = {
          ...oldParams,
          ...newParams,
        };
      }

      return {
        ...state,
        passParamsHash: newParamsHash,
      };
    });
  }, []);

  const setLang = useCallback(lang => {
    setState(state => {
      return {
        ...state,
        lang,
      };
    });
    setLocaleMode(lang);
  }, []);

  const setHasData = useCallback(payload => {
    setState(state => {
      return {
        ...state,
        ...payload,
      };
    });
  }, []);

  const updateState = useCallback(payload => {
    setState(state => {
      return {
        ...state,
        ...payload,
      };
    });
  }, []);

  return {
    updateClearParams,
    updateCompsHiddenOrShow,
    updateLoading,
    updatePassParamsHash,
    init,
    fetchPageUseCompListApi,
    setLang,
    setHasData,
    updateState,
    ...modalState,
  };
};

/**
 * 把自定义函数 挂在到window上
 */
export const loadCumtomFuncToWindow = arr => {
  if (!isArray(arr)) {
    return;
  }
  for (const v of arr) {
    const { customFuncEs5Code, enName } = v;
    let func;
    try {
      // eslint-disable-next-line no-new-func
      func = new Function('data', `${customFuncEs5Code}`);
    } catch (err) {
      console.log('new Function  loadCumtomFuncToWindow err', err);
    }
    if (func) {
      try {
        window[enName] = func;
      } catch (err) {
        console.log('windwo load loadCumtomFuncToWindow err', err);
      }
    }
  }
};

/**
 * 处理初始化数据
 */
export const dealWithInitInitUseCompList = ({ pageConfig, initUseCompList }) => {
  if (pageConfig.type === 'widthSpread') {
    const vwList = tranformPxToVw(initUseCompList, pageConfig.pageWidth);
    return vwList;
  }
  return initUseCompList;
};
