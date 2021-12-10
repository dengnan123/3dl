import { filterDataFunc, filterDataEs5Func } from '@/helpers/screen';
import dynamicAPI from '@/helpers/api/dynamic';
import emitter from '@/helpers/mitt';
import { getNowEnvData } from '@/helpers/view';
import API from '@/helpers/api/previewProxy';
import { isArray } from 'lodash';

export const getCondition = ({
  methodType,
  queryId,
  condition = {},
  parmasFilterFunc,
  parmasFilterFuncEs5Code,
  getNowApiHostValueById,
  apiHostId,
}) => {
  let newCondition = {
    ...condition,
  };

  if (parmasFilterFunc) {
    newCondition = filterDataFunc({
      filterFunc: parmasFilterFunc,
      filterFuncEs5Code: parmasFilterFuncEs5Code,
      data: newCondition,
    });
  }
  if (methodType === 'linkDatabase') {
    newCondition['id'] = queryId;
    newCondition['data_source_id'] = getNowApiHostValueById(apiHostId);
  }
  return newCondition;
};

export const getHeaders = ({ cusHeaderFunc, cusHeaderFuncEs5Code }) => {
  let headers = {};
  if (cusHeaderFunc) {
    headers = filterDataFunc({
      filterFunc: cusHeaderFunc,
      filterFuncEs5Code: cusHeaderFuncEs5Code,
      data: {},
    });
  }
  return headers;
};

export const updateDataSource = ({
  setHasData,
  id,
  resData,
  dataApiUrl,
  filterFunc,
  filterFuncEs5Code,
  condition,
}) => {
  const { data } = resData;
  let newData = data !== undefined ? data : resData;
  if (filterFunc) {
    // 给过滤器加上描述  这样便于debug
    const des = `获取${dataApiUrl}数据`;
    newData = filterDataFunc({
      filterFunc,
      filterFuncEs5Code,
      data: newData,
      condition,
      des,
    });
  }
  // setHasData &&
  //   setHasData({
  //     [id]: newData,
  //   });
  emitter.emit(`${id}_data`, newData);
};

export const getNotUseProxy = ({ apiHostId, apiHostList = [], envList = [], notUseProxy }) => {
  if (notUseProxy) {
    return notUseProxy;
  }
  const checkedEnv = getNowEnvData(envList);
  if (!checkedEnv) {
    return;
  }
  for (const v of apiHostList) {
    const { id } = v;
    if (id === apiHostId) {
      return v.notUseProxy;
    }
  }
};

/**
 * 处理 dynamicExpand otherCompParamsFilterFuncArr
 */
export const getNewPassParams = ({
  otherCompParamsFilterFuncArr,
  id,
  params = {},
  selfOtherCompParams = {},
}) => {
  if (!otherCompParamsFilterFuncArr?.length) {
    return params;
  }
  for (const v of otherCompParamsFilterFuncArr) {
    const { filterFuncEs5Code, filterFunc } = v;
    if (v.id === id) {
      return (
        filterDataFunc({
          otherCompParams: {
            ...selfOtherCompParams,
            ...params,
          },
          filterFuncEs5Code,
          filterFunc,
        }) || params
      );
    }
  }
  return params;
};

/**
 * 模拟接口调用
 */
export const simulationAPI = (data, mockDelayTime = 0) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(data);
    }, mockDelayTime);
  });
};

// 'clearParamsComps', 这四个字段 可能是数组 也可以能对象 前端使用需要处理下 最终处理成数组的形式被使用
// 'passParamsComps',
// 'showComps',
// 'hiddenComps',
export const dealwithData = value => {
  if (!value) {
    return [];
  }
  if (isArray(value)) {
    return value;
  }
  // 说明是对象
  let arr = [];
  for (const key in value) {
    arr = [...arr, ...value[key]];
  }
  return arr;
};

// 获取apiData
export const getApiData = async props => {
  const {
    methodType,
    openMockApi,
    dyMockDataFuncEs5Code,
    mockDelayTime,
    notUseProxy,
    newDataApiUrl,
    newCondition,
    headers,
  } = props;
  try {
    if (openMockApi) {
      const dyMockData = filterDataEs5Func({
        filterFuncEs5Code: dyMockDataFuncEs5Code,
        data: newCondition,
      });
      return await simulationAPI(dyMockData, mockDelayTime);
    }
    if (notUseProxy) {
      return await dynamicAPI({
        dataApiUrl: newDataApiUrl,
        condition: newCondition,
        methodType,
        cusHeaders: headers,
      });
    }
    return await API.post(`/page-comp/apiProxy`, {
      dataApiUrl: newDataApiUrl,
      condition: newCondition,
      methodType,
      cusHeaders: headers,
    });
  } catch (err) {
    console.log('fetchData-----err', err);
    return {};
  }
};
