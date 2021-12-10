import { withMixin } from '@/helpers/dva';

import compilers from '@/helpers/babel/compilers';

import { pluginMenu, getThemeConfigList, addThemeConfig } from '@/service';

import { message } from 'antd';

compilers.initCompiler(); // 初始化babel
export default withMixin({
  namespace: 'themeEdit',
  state: {
    compMenuList: [],
    themeConfigList: [],
  },
  subscriptions: {},
  effects: {
    *getPluginMenu({ payload }, { call, select, put }) {
      const { data, errorCode } = yield call(pluginMenu, {
        pageSize: 999,
      });
      if (errorCode !== 200) {
        return;
      }
      yield put({
        type: 'updateState',
        payload: {
          compMenuList: data,
        },
      });
    },
    *getThemeConfigList({ payload }, { call, select, put }) {
      const { data, errorCode } = yield call(getThemeConfigList, payload);
      if (errorCode !== 200) {
        return;
      }
      yield put({
        type: 'updateState',
        payload: {
          themeConfigList: data,
        },
      });
    },
    *addThemeConfig({ payload }, { call, select, put }) {
      const { errorCode, message: msg } = yield call(addThemeConfig, payload);
      if (errorCode !== 200) {
        message.error(msg || '发布失败');
        return false;
      }
      message.success('发布成功');
      return true;
    },
  },
  reducers: {},
});
