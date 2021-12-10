import { useState, useEffect, useRef, useCallback } from 'react';
import { getNowUseApihostValue } from '@/helpers/view';

export const usePreloadResources = () => {
  // 预加载页面的资源
};

// 存储当前环境下，所有apihost的对应的值
export const useApiHostHash = (apiHostList, envList) => {
  const hashRef = useRef({});
  useEffect(() => {
    if (!apiHostList?.length) {
      return;
    }
    for (const { id } of apiHostList) {
      const value = getNowUseApihostValue({
        apiHostId: id,
        apiHostList,
        envList,
      });
      hashRef.current[id] = value;
    }
  }, [apiHostList, envList]);
  const getNowApiHostValueById = useCallback(id => {
    console.log('idididid', id);
    console.log('hashRef.current', hashRef.current);
    return hashRef.current[id];
  }, []);
  return {
    getNowApiHostValueById,
  };
};
