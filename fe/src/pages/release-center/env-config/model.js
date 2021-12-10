import { withMixin } from '@/helpers/dva';

import {
  fetchRepaceJsonConfigList,
  addReplaceConfig,
  updateReplaceConfig,
  deleteReplaceConfig,
} from './service';

import { message } from 'antd';

export default withMixin({
  namespace: 'envConfig',
  state: {
    // 环境变量配置列表
    repaceJsonConfigList: [],
  },
  subscriptions: {},
  effects: {
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
    *addReplaceConfig({ payload }, { put, call }) {
      const { errorCode } = yield call(addReplaceConfig, payload);

      if (errorCode !== 200) {
        message.error('添加失败');
        return false;
      }
      yield put({ type: 'getRepaceJsonConfigList' });
      return true;
    },
    *updateReplaceConfig({ payload }, { put, call }) {
      const { errorCode } = yield call(updateReplaceConfig, payload);
      if (errorCode !== 200) {
        message.error('修改失败');
        return false;
      }
      yield put({ type: 'getRepaceJsonConfigList' });
      return true;
    },
    *deleteReplaceConfig({ payload }, { put, call }) {
      const { errorCode } = yield call(deleteReplaceConfig, payload);
      if (errorCode !== 200) {
        message.error('删除失败');
        return false;
      }
      yield put({ type: 'getRepaceJsonConfigList' });
      return true;
    },
  },
  reducers: {},
});
