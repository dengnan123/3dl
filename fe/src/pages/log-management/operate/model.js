import { withMixin } from '@/helpers/dva';
import { fetchProjectList } from '@/service';
import { fetchLogList } from './service';
import compilers from '@/helpers/babel/compilers';
import { message } from 'antd';

compilers.initCompiler(); // 初始化babel
export default withMixin({
  namespace: 'operate',
  state: {
    logList: [],
    totalLogs: 0,
    projectList: [],
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/log-management/operate') {
          dispatch({ type: 'getProjectList', payload: { pageSize: 999 } });
        }
      });
    },
  },
  effects: {
    *getLogList({ payload }, { put, call, select }) {
      const res = yield call(fetchLogList, payload);
      const { errorCode, data } = res;
      if (errorCode !== 200) {
        return message.error('获取失败');
      }
      yield put({
        type: 'updateState',
        payload: {
          logList: data?.list || [],
          totalLogs: data?.total || 0,
        },
      });
    },
    *getProjectList({ payload }, { put, call, select }) {
      const res = yield call(fetchProjectList, payload);
      const { errorCode, data } = res;
      if (errorCode !== 200) {
        return message.error('获取项目列表失败');
      }
      yield put({
        type: 'updateState',
        payload: {
          projectList: data || [],
        },
      });
    },
  },
  reducers: {},
});
