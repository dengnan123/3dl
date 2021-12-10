import { withMixin } from '@/helpers/dva';
import { getThemeConfigList, deleteThemeConfig } from '@/service';

export default withMixin({
  namespace: 'theme',
  state: {},
  subscriptions: {},
  effects: {
    // 获取主题列表
    *getThemeConfigList({ payload }, { call }) {
      const { errorCode, data } = yield call(getThemeConfigList);
      if (errorCode === 200) {
        return data;
      }
      return [];
    },
    // 删除主题
    *deleteThemeConfig({ payload }, { call }) {
      const { errorCode } = yield call(deleteThemeConfig, payload);
      if (errorCode === 200) {
        return true;
      }
      return false;
    },
  },
  reducers: {},
});
