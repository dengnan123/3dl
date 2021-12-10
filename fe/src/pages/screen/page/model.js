import { withMixin } from '@/helpers/dva';
import {
  fetchPageList,
  addPage,
  creatPageByTemp,
  updatePage,
  delPage,
  fetchProjectList,
} from '@/service';

import compilers from '@/helpers/babel/compilers';
import { message } from 'antd';

compilers.initCompiler(); // 初始化babel
export default withMixin({
  namespace: 'page',
  state: {
    pageList: [],
    totalPage: 0,
    projectList: [],
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/screen/page') {
          dispatch({ type: 'getProjectList', payload: { pageSize: 999 } });
        }
      });
    },
  },
  effects: {
    *getList({ payload }, { put, call, select }) {
      const res = yield call(fetchPageList, payload);
      const { errorCode, data } = res;
      if (errorCode !== 200) {
        return message.error('获取失败');
      }
      yield put({
        type: 'updateState',
        payload: {
          pageList: data?.list || [],
          totalPage: data?.total || 0,
        },
      });
      return res;
    },
    *submit({ payload }, { put, call, select }) {
      // 获取当前用户ID todo
      const { currentUser } = yield select(_ => _.users);

      const res = yield call(addPage, {
        ...payload,
        userId: currentUser.id,
      });
      const { errorCode } = res;
      if (errorCode !== 200) {
        return message.error('添加失败');
      }
      return res;
    },

    *creatPageByTemp({ payload }, { put, call, select }) {
      // 获取当前用户ID todo
      const { currentUser } = yield select(_ => _.users);
      const res = yield call(creatPageByTemp, {
        ...payload,
        userId: currentUser.id,
      });
      const { errorCode } = res;
      if (errorCode !== 200) {
        return message.error('添加失败');
      }
      return res;
    },
    *updatePage({ payload }, { put, call, select }) {
      const res = yield call(updatePage, payload);
      const { errorCode } = res;
      if (errorCode !== 200) {
        message.error('更新失败');
        return false;
      }
      return true;
    },
    *delPage({ payload }, { put, call, select }) {
      const res = yield call(delPage, payload);
      const { errorCode } = res;
      if (errorCode !== 200) {
        return message.error('删除失败');
      }
      return res;
    },
    *getProjectList({ payload }, { put, call, select }) {
      const res = yield call(fetchProjectList, payload);
      const { errorCode, data } = res;
      if (errorCode !== 200) {
        return message.error('获取失败');
      }
      yield put({
        type: 'updateState',
        payload: {
          projectList: data,
        },
      });
      return res;
    },
  },
  reducers: {},
});
