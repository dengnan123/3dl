import { withMixin } from '@/helpers/dva';
import { addMenuItem, editMenuItem, onChangePlugin, addPluginItem } from '@/service';

export default withMixin({
  namespace: 'compPage',
  state: {},
  subscriptions: {},
  effects: {
    // 新增Menu
    *addMenuItem({ payload }, { call }) {
      const { errorCode } = yield call(addMenuItem, payload);
      if (errorCode === 200) {
        return true;
      }
      return false;
    },
    // 编辑Menu
    *editMenuItem({ payload }, { call }) {
      const { errorCode } = yield call(editMenuItem, payload);
      if (errorCode === 200) {
        return true;
      }
      return false;
    },
    // 编辑组件
    *onChangePlugin({ payload }, { call }) {
      const { errorCode } = yield call(onChangePlugin, payload);
      if (errorCode === 200) {
        return true;
      }
      return false;
    },
    // 新增组件
    *addPluginItem({ payload }, { call }) {
      const { errorCode } = yield call(addPluginItem, payload);
      if (errorCode === 200) {
        return true;
      }
      return false;
    },
  },
  reducers: {},
});
