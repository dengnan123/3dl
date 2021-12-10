import { withMixin } from '../../../helpers/dva';
import { fetchPageList, fetchProjectList } from '../../../service';
import { message } from 'antd';

export default withMixin({
  namespace: 'overview',
  state: {
    pageList: [],
    tagList: [],
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        // if (pathname === '/list') {
        //   dispatch({ type: 'getProjectList', payload: { pageSize: 999 } });
        // }
      });
    },
  },
  effects: {
    *getPageList({ payload }, { put, call, select }) {
      const res = yield call(fetchPageList, payload);
      const { errorCode, data } = res;
      if (errorCode !== 200) {
        message.error('获取失败');
        return [];
      }
      yield put({
        type: 'updateState',
        payload: {
          pageList: data?.list || [],
        },
      });
      return data?.list || [];
    },

    *getTagList({ payload }, { put, call, select }) {
      const res = yield call(fetchProjectList, payload);
      const { errorCode, data } = res;
      if (errorCode !== 200) {
        message.error('获取失败');
        return [];
      }
      yield put({
        type: 'updateState',
        payload: {
          tagList: data,
        },
      });
      return data;
    },
  },
  reducers: {},
});
