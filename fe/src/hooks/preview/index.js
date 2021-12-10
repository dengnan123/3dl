import { useState, useEffect, useRef } from 'react';
// import { download } from '@/helpers/download';
import { filterDataFunc, generateDivId, filterDataEs5Func } from '@/helpers/screen';
import { getLocaleMode, setStorageBykey, getStorageByKey } from '@/helpers/storage';
import { getParseSearch } from '@/helpers/utils';
import { DP_BUILD_TIME_KEY, isPrivateDeployment } from '@/config';
import { windowUtil } from '@/helpers/windowUtil';
import emitter from '@/helpers/mitt';
import { isArray } from 'lodash';
import { getDataApiUrl, getApiRouter } from '@/helpers/view';
import { useCustomCompareEffect, useEffectOnce } from 'react-use';
import { buildTimeCheck } from '@/service/check';
import isEqual from 'fast-deep-equal';
import io from 'socket.io-client';
import { getNewPassParams } from '@/hooks/preview/util';
import {
  getCondition,
  getHeaders,
  updateDataSource,
  getNotUseProxy,
  dealwithData,
  getApiData,
} from './util';
import { getLifecycleFuncs } from '@/helpers/lifecycle';
import { hiddenOrShowAction } from './pageSwitch';

export const useScalePer = ({ pageConfig }) => {
  const [widthScalePer, setWidthPer] = useState(1);
  const [heightScalePer, setHeightPer] = useState(1);
  useEffect(() => {
    if (JSON.stringify(pageConfig) === '{}') {
      return;
    }
    const getTra = () => {
      const { pageWidth, pageHeight } = pageConfig;
      const width = document.body.clientWidth;
      const height = document.body.clientHeight;
      const widthScalePer = width / pageWidth;
      const heightScalePer = height / pageHeight;
      setWidthPer(widthScalePer);
      setHeightPer(heightScalePer);
    };
    getTra();
    window.addEventListener('resize', getTra);
    return () => {
      window.removeEventListener('resize', getTra);
    };
  }, [setWidthPer, setHeightPer, pageConfig]);
  return {
    widthScalePer,
    heightScalePer,
  };
};

export const useInit = ({ init }) => {
  useEffectOnce(() => {
    const { pageId } = getParseSearch();
    init({
      pageId,
    });
  });
};

export const useLoading = ({ propsList }) => {
  const [showLoading, setLoading] = useState(true);
  const intervalRefs = useRef(0);
  const index = intervalRefs.current;
  if (index === 0) {
    if (propsList && propsList.length) {
      intervalRefs.current = 1;
      setTimeout(() => {
        // 等页面完全渲染完成后，取消loading
        setLoading(false);
      }, 500);
    }
  }
  return { showLoading };
};

export const useData = data => {
  const [_data, setData] = useState([]);
  useEffect(() => {
    setData(data);
  }, [data]);

  return { data: _data, setData };
};

// 组件隐藏
const hiddenComps = ({ updateCompsHiddenOrShow, data }) => {
  const {
    hiddenComps,
    openHiddenCompsFilterFunc,
    hiddenCompsFilterFunc,
    hiddenCompsFilterFuncEs5Code,
  } = data;
  let arr = dealwithData(hiddenComps);
  if (openHiddenCompsFilterFunc && hiddenCompsFilterFunc) {
    arr =
      filterDataFunc({
        filterFunc: hiddenCompsFilterFunc,
        filterFuncEs5Code: hiddenCompsFilterFuncEs5Code,
        data,
      }) || [];
  }
  for (const v of arr) {
    emitter.emit(`${v}_hidden`);
  }
};

//  组件显示
const showComps = ({ updateCompsHiddenOrShow, data }) => {
  const {
    showComps,
    showCompsFilterFuncEs5Code,
    showCompsFilterFunc,
    openShowCompsFilterFunc,
  } = data;
  let arr = dealwithData(showComps);
  if (openShowCompsFilterFunc && showCompsFilterFunc) {
    arr =
      filterDataFunc({
        filterFunc: showCompsFilterFunc,
        filterFuncEs5Code: showCompsFilterFuncEs5Code,
        data,
      }) || [];
  }
  for (const v of arr) {
    emitter.emit(`${v}_show`);
  }
};

// 回调
const callback = ({ data, updateCompsHiddenOrShow }) => {
  const { clickCallbackFuncEs5Code, clickCallbackFunc, params, otherCompParams } = data;
  const hiddenComp = arr => {
    for (const v of arr) {
      emitter.emit(`${v}_hidden`);
    }
  };
  const showComp = arr => {
    for (const v of arr) {
      emitter.emit(`${v}_show`);
    }
  };
  if (clickCallbackFunc) {
    filterDataFunc({
      filterFunc: clickCallbackFunc,
      filterFuncEs5Code: clickCallbackFuncEs5Code,
      data: {
        ...params,
        hiddenComp,
        showComp,
      },
      otherCompParams,
    });
  }
};

// 条件缓存
const paramsCache = ({ data, cacheParamsRef, idParamsRef }) => {
  const { cacheParamsDeps, params, dynamicExpand = {} } = data;

  let newCacheParamsDeps = cacheParamsDeps;
  if (dynamicExpand?.openCacheParamsDepsFunc && dynamicExpand?.cacheParamsDepsFuncEs5Code) {
    newCacheParamsDeps =
      filterDataEs5Func({
        filterFuncEs5Code: dynamicExpand?.cacheParamsDepsFuncEs5Code,
        data,
      }) || [];
  }

  // 把条件缓存到cacheParamsRef里面
  for (const v of newCacheParamsDeps) {
    if (cacheParamsRef.current[v]) {
      cacheParamsRef.current[v] = {
        ...cacheParamsRef.current[v],
        ...params,
      };
    } else {
      cacheParamsRef.current[v] = params;
    }
  }
};

// 组件直接参数传递
const passParams = ({ data, updatePassParamsHash }) => {
  const { passParamsComps: initData, params, dynamicExpand, id: selfId } = data;
  const passParamsComps = dealwithData(initData);
  const newParamsObj = formatParams({
    dynamicExpand,
    passParamsComps,
    selfId,
    params,
  });
  // 点击的时候组件之间传递参数
  if (passParamsComps?.length) {
    for (const id of passParamsComps) {
      const newParams = newParamsObj[id];
      emitter.emit(`${id}_passParams`, newParams);
    }
  }
};


const formatParams = ({ dynamicExpand, passParamsComps: ids, selfId, params }) => {
  const newParamsHash = {};
  const otherCompParamsFilterFuncArr = dynamicExpand?.otherCompParamsFilterFuncArr || [];
  for (const id of ids) {
    const newParams =
      getNewPassParams({
        otherCompParamsFilterFuncArr,
        id,
        params,
      }) || {};
    newParamsHash[id] = newParams;
  }
  return newParamsHash;
};

// 清除关联组件条件
const clearParams = ({ data, updateClearParams, cacheParamsRef, dataSourceList, useCompList }) => {
  const { clearParamsComps, dynamicExpand = {} } = data;
  let newClearParamsComps = dealwithData(clearParamsComps);
  if (dynamicExpand?.openClearParamsCompsFunc && dynamicExpand?.clearParamsCompsFuncEs5Code) {
    newClearParamsComps =
      filterDataEs5Func({
        filterFuncEs5Code: dynamicExpand.clearParamsCompsFuncEs5Code,
        data,
      }) || [];
  }
  //告诉子组件需要把状态恢复到默认状态
  // updateClearParams({ shouldClear: newClearParamsComps, resetSelf: id });

  if (newClearParamsComps?.length) {
    for (const id of newClearParamsComps) {
      emitter.emit(`${id}_clearParams`);
    }
  }
};

// 联动数据源
const fetchApi = async ({
  data,
  dataSourceList,
  idParamsRef,
  cacheParamsRef,
  setHasData,
  apiHostList,
  envList,
  getNowApiHostValueById,
}) => {
  const { deps, type, params, openDepsFilterFunc, depsFilterFunc, depsFilterFuncEs5Code } = data;
  let newDeps = deps;

  if (openDepsFilterFunc && depsFilterFunc) {
    newDeps =
      filterDataFunc({
        filterFunc: depsFilterFunc,
        filterFuncEs5Code: depsFilterFuncEs5Code,
        data,
      }) || [];
  }
  if (!newDeps || !newDeps.length) {
    return;
  }
  // const eleId = generateDivId(data);
  // const ele = document.getElementById(eleId);
  // if (!eleInView(ele)) {
  //   console.log('return-----', data);
  //   return;
  // }
  let shouldChangeArr = dataSourceList.filter(v => {
    if (newDeps.includes(v.id)) {
      return true;
    }
    return false;
  });
  let newIdParams = {
    ...idParamsRef.current,
  };
  for (const v of shouldChangeArr) {
    const { id: _ } = v;
    newIdParams[_] = params;
  }
  idParamsRef.current = newIdParams; //保存最新的条件引用
  const fetchArr = shouldChangeArr.map(v => {
    const { id } = v;
    const condition = getSearchParams(idParamsRef, cacheParamsRef, id, type);
    return fetchData({
      ...v,
      condition,
      setHasData,
      apiHostList,
      envList,
      getNowApiHostValueById,
    });
  });
  await Promise.all(fetchArr);
};

//多语言切换
const langChange = ({ data }) => {
  // const { params } = data;
  // if (params.compName === 'LocaleSwitch') {
  //   setLocaleMode(params.compValue);
  // }
};

// 清理数据源
const clearApiData = ({ data, setHasData }) => {
  const { openClearApiDepsFunc, clearApiDepsFuncEs5Code, clearApiDepsFunc, clearApiDeps } = data;
  let arr = clearApiDeps;
  if (openClearApiDepsFunc && clearApiDepsFunc) {
    arr = filterDataFunc({
      filterFunc: clearApiDepsFunc,
      filterFuncEs5Code: clearApiDepsFuncEs5Code,
      data,
    });
  }
  // if (arr?.length) {
  //   const clearApiIdHash = {};
  //   for (const v of clearApiDeps) {
  //     clearApiIdHash[v] = null;
  //   }
  //   setHasData(clearApiIdHash);
  // }
  if (arr?.length) {
    for (const apiId of clearApiDeps) {
      emitter.emit(`${apiId}_clearApiData`);
    }
  }
};

export const onChange = props => {
  const eventObj = {
    langChange,
    clearParams,
    passParams,
    paramsCache,
    showComps,
    hiddenComps,
    clearApiData,
    fetchApi,
    callback,
  };
  const {
    data: {
      params: { includeEvents, excludeEvents },
    },
  } = props;

  if (isArray(includeEvents)) {
    for (const event of includeEvents) {
      if (eventObj[event]) {
        eventObj[event](props);
      }
    }
    return;
  }
  const allEvents = Object.keys(eventObj);
  if (isArray(excludeEvents)) {
    for (const event of allEvents) {
      if (!excludeEvents.includes(event)) {
        if (eventObj[event]) {
          eventObj[event](props);
        }
      }
    }
    return;
  }
  for (const event of allEvents) {
    if (eventObj[event]) {
      eventObj[event](props);
    }
  }
};

export const useRegistInterval = props => {
  const intervalRefs = useRef([]);
  useCustomCompareEffect(
    () => {
      const clearFunc = () => {
        if (!intervalRefs.current.length) {
          return;
        }
        for (const timer of intervalRefs.current) {
          clearInterval(timer);
        }
      };
      const { dataSourceList } = props;
      for (const item of dataSourceList) {
        const { fetchInterval, autoRefresh, useDataType } = item;
        const _fetchInterval = fetchInterval ? fetchInterval : 10;
        if (['API', 'linkDatabase'].includes(useDataType) && autoRefresh) {
          const timerId = creatFetchInterval({
            ...item,
            fetchInterval: _fetchInterval,
            ...props,
          });

          intervalRefs.current = [...intervalRefs.current, timerId];
        }
      }
      return () => {
        clearFunc();
      };
    },
    [props],
    (prevDeps, nextDeps) => {
      const preProps = prevDeps[0];
      const nextProps = nextDeps[0];
      return isEqual(preProps.dataSourceList, nextProps.dataSourceList);
    },
  );
};

const creatFetchInterval = props => {
  const { fetchInterval, id, idParamsRef, cacheParamsRef } = props;
  return setInterval(() => {
    fetchData({
      ...props,
      condition: {
        ...idParamsRef.current[id],
        ...cacheParamsRef.current[id],
      },
    });
  }, fetchInterval * 1000);
};

export const fetchData = async props => {
  const {
    dataApiUrl,
    id,
    setHasData,
    methodType,
    filterFuncEs5Code,
    filterFunc,
    openHighConfig,
    cancelRequestFunc,
    cancelRequestFuncEs5Code,
    // dataSourceRefCurrent,
    // dataSourceName,
    openMockApi,
    dyMockDataFuncEs5Code,
    mockDelayTime,
  } = props;
  // console.log('dataSourceRefCurrent>>>>>', dataSourceRefCurrent);
  // const nowRefCurrent = dataSourceRefCurrent[id];
  // if (isEmpty(nowRefCurrent)) {
  //   console.log(`${dataSourceName}关联的组件全部消失`);
  //   return;
  // }

  const newDataApiUrl = getDataApiUrl(props);
  const newCondition = getCondition(props);
  const headers = getHeaders(props);

  if (openHighConfig && cancelRequestFunc && cancelRequestFuncEs5Code) {
    const cancelRequest =
      filterDataFunc({
        filterFunc: cancelRequestFunc,
        filterFuncEs5Code: cancelRequestFuncEs5Code,
        data: newCondition,
      }) ?? false;
    if (cancelRequest) {
      return;
    }
  }
  emitter.emit(`${id}_loading_true`, {});
  const notUseProxy = getNotUseProxy(props);
  const resData = await getApiData({
    methodType,
    openMockApi,
    dyMockDataFuncEs5Code,
    mockDelayTime,
    notUseProxy,
    newDataApiUrl,
    newCondition,
    headers,
  });
  emitter.emit(`${id}_loading_false`, resData);
  updateDataSource({
    setHasData,
    id,
    resData,
    dataApiUrl,
    filterFunc,
    filterFuncEs5Code,
    condition: newCondition,
  });
};

export const getSearchParams = (idParamsRef, cacheParamsRef, id, type) => {
  // if (type === 'resetParams') {
  //   return {};
  // }
  const condition = idParamsRef.current[id] || {};
  const cacheParams = cacheParamsRef.current[id] || {};

  const _condition = {
    ...condition,
    ...cacheParams,
  };

  return _condition;
};

export const onClick = ({ data }) => {
  const { onClickCallbackFuncEs5Code, onClickCallbackFunc } = data;
  if (onClickCallbackFunc) {
    filterDataFunc({
      filterFunc: onClickCallbackFunc,
      filterFuncEs5Code: onClickCallbackFuncEs5Code,
      data,
    });
  }
};

export const useHotUpdate = ({ pageConfig, fetchPageUseCompList }) => {
  const timerRef = useRef(null);
  useEffect(() => {
    const { hotUpdate } = pageConfig;
    if (hotUpdate) {
      const timer = setInterval(() => {
        fetchPageUseCompList();
      }, 5 * 1000);
      timerRef.current = timer;
    }
    return () => {
      clearInterval(timerRef.current);
    };
  }, [pageConfig, fetchPageUseCompList]);
};

export const useInitFetchData = props => {
  const isFirstRef = useRef(true);
  useEffect(() => {
    const { dataSourceList } = props;
    if (dataSourceList && dataSourceList.length) {
      if (!isFirstRef.current) {
        return;
      }
      const doFetch = async () => {
        // 执行需要初始化的接口
        const fetchList = dataSourceList.map(async item => {
          const { useDataType, pageInitFetch } = item;
          if (['API', 'linkDatabase'].includes(useDataType) && pageInitFetch) {
            await fetchData({
              ...item,
              condition: {},
              ...props,
            });
          }
        });
        await Promise.all(fetchList);
      };
      setTimeout(() => {
        doFetch();
        // 先下载lib.js 初始化接口可以晚一点
      }, 500);

      isFirstRef.current = false;
    }
  }, [props]);
};

export const useDoPageShell = ({ pageConfig }) => {
  const { pageShellEs5Code } = pageConfig;
  useEffect(() => {
    const { onPageMount, onPageUnMount } = getLifecycleFuncs({ pageShellEs5Code });
    const lang = getLocaleMode();
    const showComps = arr => {
      if (!arr?.length) {
        return;
      }
      hiddenOrShowAction(arr, 'show');
    };
    const hiddenComps = arr => {
      if (!arr?.length) {
        return;
      }
      hiddenOrShowAction(arr, 'hidden');
    };
    const data = {
      lang,
      showComps,
      hiddenComps,
    };
    try {
      onPageMount && onPageMount(data);
    } catch (err) {
      console.log('页面初始化 err', err);
    }
    return () => {
      try {
        onPageUnMount && onPageUnMount(data);
      } catch (err) {
        console.log('页面销毁脚本 err', err);
      }
    };
  }, [pageShellEs5Code]);
};

export const getDataSource = ({ dataSourceId, type, id, dataSourceKey }, preview) => {
  if (!isArray(dataSourceId)) {
    return type === 'container' ? preview : preview[dataSourceId];
  }
};

export const emitterInitOn = data => {
  if (data.length) {
    for (const v of data) {
      const { loadingDeps } = v;
      if (loadingDeps && loadingDeps.length) {
        // 监听数据源
        for (const apiId of loadingDeps) {
          emitter.on(`${apiId}_loading_true`, v => {});
          emitter.on(`${apiId}_loading_false`, v => {});
        }
      }
    }
  }
};

export const useMoveEvent = arr => {
  const [domList, setList] = useState([]);
  useEffect(() => {
    if (!arr || !arr.length) {
      return;
    }
    if (domList.length) {
      return;
    }
    // 批量注册监听器
    for (const v of arr) {
      const { moveCallbackFuncEs5Code, moveCallbackFunc } = v;
      const divId = generateDivId(v);

      if (moveCallbackFunc) {
        // 找到divId 加上监听
        const func = () => {
          console.log('回调 useMoveEvent');
          filterDataFunc({
            filterFunc: moveCallbackFunc,
            filterFuncEs5Code: moveCallbackFuncEs5Code,
            data: v,
          });
        };
        const domDiv = document.getElementById(divId);
        domDiv.addEventListener('touchstart', func);
        setList(pre => {
          return [
            ...pre,
            {
              domDiv,
              func,
            },
          ];
        });
      }
    }
    return () => {
      // 卸载监听器
      for (const v of domList) {
        const { domDiv, func } = v;
        domDiv.removeEventListener('touchstart', func);
      }
    };
  }, [arr, domList]);
};

export const useLoadFuncToWindow = data => {
  useEffect(() => {
    windowUtil(data);
  }, [data]);
};

/**
 * 如果页面是全屏铺满模式，设置body
 */
export const useSetBodyStyle = type => {
  useEffect(() => {
    if (type !== 'allSpread') {
      return;
    }
    // document.body.style.overflow = 'hidden';
    document.body.style.backgroundColor = 'unset';
    // const ele = doc
    const ele = document.getElementById('containerDiv');
    if (ele) {
      ele.style.overflow = 'hidden';
    }
  }, [type]);
};

/**
 * 数据源是socket的处理
 */
export const useSocket = props => {
  useCustomCompareEffect(
    () => {
      const { dataSourceList, setHasData, dataSourceRefCurrent, envList, apiHostList } = props;
      const socketDataSource = dataSourceList.filter(v => v.useDataType === 'socket');
      if (!socketDataSource.length) {
        return;
      }
      for (const item of socketDataSource) {
        socketFunc({
          ...item,
          setHasData,
          dataSourceRefCurrent,
          envList,
          apiHostList,
        });
      }
      return () => {};
    },
    [props],
    (prevDeps, nextDeps) => {
      const preProps = prevDeps[0];
      const nextProps = nextDeps[0];
      return isEqual(preProps.dataSourceList, nextProps.dataSourceList);
    },
  );
};

/**
 * socket监听
 */
export const socketFunc = async props => {
  const {
    dataApiUrl,
    id,
    setHasData,
    filterFuncEs5Code,
    filterFunc,
    socketEventName = 'message',
    // dataSourceRefCurrent,
    // dataSourceName,
  } = props;
  const newDataApiUrl = getDataApiUrl(props);
  const newCondition = getCondition(props);
  const path = getApiRouter(props);
  const socket = io(newDataApiUrl, { ...newCondition, path });

  socket.on(socketEventName, resData => {
    // const nowRefCurrent = dataSourceRefCurrent[id];
    // if (isEmpty(nowRefCurrent)) {
    //   console.log(`${dataSourceName}关联的组件全部消失`);
    //   return;
    // }
    updateDataSource({
      setHasData,
      id,
      resData,
      dataApiUrl,
      filterFunc,
      filterFuncEs5Code,
    });
  });

  socket.on('disconnect', function(msg) {
    console.log('msgmsgmsgmsg', msg);
  });
};

export const useCheckBuildTime = () => {
  // 页面初始化完成后，调用接口，来判断服务器上文件是否有更新,如果更新就刷新页面
  const timerRef = useRef();
  useEffect(() => {
    if (!isPrivateDeployment) {
      return;
    }
    const doFetch = async () => {
      console.log('to-----check');
      const res = await buildTimeCheck();
      const apiDpBuildTime = res?.data?.dpBuildTime;
      if (!apiDpBuildTime) {
        return;
      }
      const oldBuildTime = parseInt(getStorageByKey(DP_BUILD_TIME_KEY));
      if (oldBuildTime === apiDpBuildTime) {
        return;
      }
      if (!oldBuildTime) {
        setStorageBykey(DP_BUILD_TIME_KEY, apiDpBuildTime);
        return;
      }
      // 说明    后端文件更新了 需要强制刷新页面
      setStorageBykey(DP_BUILD_TIME_KEY, apiDpBuildTime);
      window.location.reload(true);
    };
    const timerId = setInterval(() => {
      doFetch();
    }, 1000 * 60);

    doFetch();
    timerRef.current = timerId;
    return () => {
      clearInterval(timerRef.current);
    };
  }, []);
};
