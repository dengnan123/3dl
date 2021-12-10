import { withMixin } from '@/helpers/dva';

import {
  fetchLoadingList,
  fetchLoadingDetail,
  addLoading,
  editLoading,
  deleteLoading,
} from '@/service/loading';
import compilers from '@/helpers/babel/compilers';
import { message } from 'antd';

compilers.initCompiler(); // 初始化babel
export default withMixin({
  namespace: 'loadingTemp',
  state: {
    loadingList: [],
    totalLoading: 0,
  },
  effects: {
    *getLoadingList({ payload }, { put, call, select }) {
      const res = yield call(fetchLoadingList, payload);

      const { errorCode, data } = res;
      if (errorCode !== 200) {
        return message.error('获取失败');
      }
      yield put({
        type: 'updateState',
        payload: {
          loadingList: data?.list || [],
          totalLoading: data?.total || 0,
        },
      });
      return res;
    },
    *getLoadingDetail({ payload }, { put, call, select }) {
      const res = yield call(fetchLoadingDetail, payload);

      const { errorCode, data } = res;
      if (errorCode !== 200) {
        return message.error('获取失败');
      }
      return data;
    },

    *addLoading({ payload }, { put, call, select }) {
      const res = yield call(addLoading, payload);

      const { errorCode } = res;
      if (errorCode !== 200) {
        message.error('添加失败');
        return false;
      }
      return true;
    },

    *editLoading({ payload }, { put, call, select }) {
      const res = yield call(editLoading, payload);

      const { errorCode } = res;
      if (errorCode !== 200) {
        message.error('编辑失败');
        return false;
      }
      return true;
    },

    *deleteLoading({ payload }, { put, call, select }) {
      const res = yield call(deleteLoading, payload);

      const { errorCode } = res;
      if (errorCode !== 200) {
        message.error('删除失败');
        return false;
      }
      return true;
    },
  },
  reducers: {},
});
