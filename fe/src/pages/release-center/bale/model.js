import { withMixin } from '@/helpers/dva';
import { fetchPageList } from '@/service';
import { fetchRepaceJsonConfigList, fetchStartShList, buildPage } from './service';
import { findTagList } from '@/service/tag';

import { message } from 'antd';

export default withMixin({
  namespace: 'bale',
  state: {
    // 环境变量配置列表
    repaceJsonConfigList: [],
    tagList: [],
    startShList: [],
  },
  subscriptions: {},
  effects: {
    *getPageList({ payload }, { put, call, select }) {
      const res = yield call(fetchPageList, payload);
      const { errorCode, data } = res;
      if (errorCode !== 200) {
        message.error('获取失败');
        return [];
      }
      return data;
    },
    *getRepaceJsonConfigList({ payload }, { put, call }) {
      const { errorCode, data } = yield call(fetchRepaceJsonConfigList);
      if (errorCode !== 200) {
        return message.error('获取失败');
      }
      yield put({
        type: 'updateState',
        payload: {
          repaceJsonConfigList: data,
        },
      });
    },
    *buildPage({ payload }, { put, call }) {
      const res = yield call(buildPage, payload);
      if (res?.errorCode && res?.errorCode === 500) {
        return message.error('推送失败！！！');
      }
    },
    *getTagList({ payload }, { put, call }) {
      const res = yield call(findTagList, payload);
      const { errorCode, data } = res;
      if (errorCode !== 200) {
        return message.error('获取失败');
      }
      yield put({
        type: 'updateState',
        payload: {
          tagList: data,
        },
      });
      return res;
    },
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
  },
  reducers: {},
});
