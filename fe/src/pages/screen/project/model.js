import { withMixin } from '@/helpers/dva';
import {
  fetchPageList,
  fetchProjectList,
  addProject,
  editProject,
  deleteProject,
  getCompListByTag,
} from '@/service';

import compilers from '@/helpers/babel/compilers';
import { message } from 'antd';

compilers.initCompiler(); // 初始化babel
export default withMixin({
  namespace: 'project',
  state: {
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
    *addProject({ payload }, { put, call, select }) {
      // 获取当前用户ID todo
      const { currentUser } = yield select(_ => _.users);

      const res = yield call(addProject, {
        ...payload,
        userId: currentUser.id,
      });
      const { errorCode } = res;
      if (errorCode !== 200) {
        message.error('添加失败');
        return false;
      }
      return true;
    },
    *editProject({ payload }, { put, call, select }) {
      // 获取当前用户ID todo
      const { currentUser } = yield select(_ => _.users);

      const res = yield call(editProject, {
        ...payload,
        userId: currentUser.id,
      });
      const { errorCode } = res;
      if (errorCode !== 200) {
        message.error('编辑失败');
        return false;
      }
      return true;
    },
    *deleteProject({ payload }, { put, call, select }) {
      const res = yield call(deleteProject, payload);
      const { errorCode } = res;
      if (errorCode !== 200) {
        message.error('删除失败');
        return false;
      }
      return true;
    },
    *getProjectPageList({ payload }, { call, select }) {
      const res = yield call(fetchPageList, payload);
      const { errorCode, data } = res;
      if (errorCode !== 200) {
        message.error('获取失败');
        return [];
      }
      return data;
    },
    *getCompListByTag({ payload }, { call, select }) {
      const res = yield call(getCompListByTag, payload);
      const { errorCode, data } = res;
      if (errorCode !== 200) {
        message.error('获取失败');
        return [];
      }
      return data;
    },
  },
  reducers: {},
});
