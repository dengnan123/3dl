import router from 'umi/router';

import { withMixin } from '../../../helpers/dva';
import { login, registerUser } from './service';

import { setToken } from '../../../helpers/storage';

import { message } from 'antd';

export default withMixin({
  namespace: 'login',
  state: {
    imageInfo: undefined,
    bgImageInfo: {},
  },
  subscriptions: {},
  effects: {
    *login({ payload }, { put, call, select }) {
      const { locationQuery } = yield select(_ => _.app);
      const { data, errorCode, message: errMsg } = yield call(login, payload);
      const { from } = locationQuery;
      if (errorCode === 200) {
        const { token } = data;
        setToken(token);

        if (from) {
          router.push(from);
        } else {
          router.push('/');
        }
        return { errorCode, data };
      }
      message.error(errMsg || '登录失败');
      return { errorCode, data };
    },
    *registerUser({ payload }, { call }) {
      const { errorCode, message: msg } = yield call(registerUser, payload);

      if (errorCode === 200) {
        return true;
      }
      message.error(msg);
      return false;
    },
  },

  reducers: {},
});
