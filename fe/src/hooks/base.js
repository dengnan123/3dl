import { useAsyncFn, useEffectOnce } from 'react-use';
import { isFunction } from 'lodash';

export const useDoApi = (apiFunc, params = {}, initFetch = false) => {
  const [state, doApi] = useAsyncFn(
    async v => {
      if (!isFunction(apiFunc)) {
        throw new Error('apiFunc must a  function');
      }
      const response = await apiFunc(v);
      return response;
    },
    [apiFunc],
  );
  useEffectOnce(() => {
    if (initFetch) {
      doApi(params);
    }
  });
  return {
    doApi,
    state,
  };
};
