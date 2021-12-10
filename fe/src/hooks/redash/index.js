// import { useEffect } from 'react';
// import { useAsyncFn, useEffectOnce } from 'react-use';
// import { isFunction } from 'lodash';
import {
  fetchRedushDatasourceListById,
  fetchRedushDatasourceList,
  doSaveQuery,
  getSchemaList,
  doQuery,
  addDatabase,
  getDatabaseInfo,
} from './service';
import { useDoApi } from '../base';

export const useFetchRedushDatasourceListById = (opts, initFetch) => {
  const { state, doApi } = useDoApi(fetchRedushDatasourceListById, opts);
  return {
    data: state?.value?.data?.list,
    doApi,
  };
};

export const useFetchRedushDatasourceList = (opts, initFetch = true) => {
  const { state, doApi } = useDoApi(fetchRedushDatasourceList, opts, initFetch);
  return {
    data: state?.value?.data?.list || [],
    doApi,
  };
};

export const useDoSaveQuery = opts => {
  const { state, doApi } = useDoApi(doSaveQuery, opts);
  return {
    data: state?.value?.data,
    doApi,
    loading: state.loading,
  };
};

export const useGetSchemaList = opts => {
  const { state, doApi } = useDoApi(getSchemaList, opts);
  return {
    data: state?.value?.data?.schema || [],
    doApi,
    loading: state.loading,
  };
};

export const useDoQuery = opts => {
  const { state, doApi } = useDoApi(doQuery, opts);
  return {
    data: state?.value?.data,
    doApi,
    loading: state.loading,
    state,
  };
};

export const useAddDatabase = opts => {
  return useDoApi(addDatabase, opts);
};

export const useFetchDatabaseList = opts => {
  return useDoApi(fetchRedushDatasourceList, opts);
};

export const useFetchDatabaseInfo = opts => {
  return useDoApi(getDatabaseInfo, opts);
};
