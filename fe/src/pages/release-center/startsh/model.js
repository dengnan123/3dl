import { withMixin } from '@/helpers/dva';
import { fetchStartShList, addStartSh, updateStartSh, deleteStartSh } from './service';

import { message } from 'antd';

export default withMixin({
  namespace: 'startsh',
  state: {
    startShList: [],
  },
  subscriptions: {},
  effects: {
    *getStartShList({ payload }, { put, call }) {
      const { errorCode, data } = yield call(fetchStartShList);
      if (errorCode !== 200) {
        return message.error('获取失败');
      }
      yield put({
        type: 'updateState',
        payload: {
          startShList: data,
        },
      });
    },
    *addStartSh({ payload }, { put, call }) {
      const { errorCode } = yield call(addStartSh, payload);

      if (errorCode !== 200) {
        message.error('添加失败');
        return false;
      }
      yield put({ type: 'getStartShList' });
      return true;
    },
    *updateStartSh({ payload }, { put, call }) {
      const { errorCode } = yield call(updateStartSh, payload);
      if (errorCode !== 200) {
        message.error('修改失败');
        return false;
      }
      yield put({ type: 'getStartShList' });
      return true;
    },
    *deleteStartSh({ payload }, { put, call }) {
      const { errorCode } = yield call(deleteStartSh, payload);
      if (errorCode !== 200) {
        message.error('删除失败');
        return false;
      }
      yield put({ type: 'getStartShList' });
      return true;
    },
  },
  reducers: {},
});
