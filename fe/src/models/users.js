import { withMixin } from '../helpers/dva';
import { clearAll } from '@/helpers/storage';
import router from 'umi/router';
import { logout } from '@/service/user';

export default withMixin({
  namespace: 'users',
  state: {
    currentUser: {},
  },
  subscriptions: {},
  effects: {
    *logout({ payload }, { put, call, select }) {
      const { errorCode } = yield call(logout, payload);
      clearAll();
      yield put({
        type: 'updateState',
        payload: {
          currentUser: {},
        },
      });
      router.push('/o/login');
    },
  },
  reducers: {},
});
