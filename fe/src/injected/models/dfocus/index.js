import { message } from 'antd';
import { redirectTo } from '../../../helpers/view';
import { withMixin } from '../../../helpers/dva';
import { fetchCurrentUser } from '../../../service/user';
import { logout } from './service';

import { clearAll, getToken, setToken, setLocalUser } from '../../../helpers/storage';

export default withMixin({
  state: {},

  effects: {
    *autoLogin({ payload }, { put, call, select }) {
      const token = getToken();
      const { location } = window;
      const { href, origin } = location;
      const currentUrl = href.slice(origin.length);
      // and even no Authorization in cookie
      if (!token) {
        if (currentUrl === '/') {
          return redirectTo('/o/login');
        }
        return redirectTo('/o/login', currentUrl);
      }
      try {
        const info = yield call(fetchCurrentUser);
        const { data, errorCode } = info;
        if (errorCode !== 200 || !data) {
          clearAll();
          if (currentUrl === '/') {
            return redirectTo('/login');
          }
          return redirectTo('/login', currentUrl);
        }

        yield put({
          type: 'users/updateState',
          payload: {
            currentUser: data,
          },
        });
      } catch (err) {
        return message.error(err.message);
      }
    },
    *logout({ payload }, { call }) {
      yield call(logout);
      setToken('');
      setLocalUser({});
      redirectTo('o/login');
    },
  },
  reducers: {},
});
