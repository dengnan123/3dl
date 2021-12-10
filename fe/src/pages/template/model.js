import { withMixin } from '@/helpers/dva';
import { addPage, creatPageByTemp } from '@/service';

import compilers from '@/helpers/babel/compilers';
import { message } from 'antd';

compilers.initCompiler(); // 初始化babel
export default withMixin({
  namespace: 'templatePage',
  state: {},
  subscriptions: {},
  effects: {
    *submit({ payload }, { put, call, select }) {
      // 获取当前用户ID todo
      const { currentUser } = yield select(_ => _.users);

      const res = yield call(addPage, {
        ...payload,
        userId: currentUser.id,
      });
      const { errorCode } = res;
      if (errorCode !== 200) {
        return message.error('添加失败');
      }
      return res;
    },

    *creatPageByTemp({ payload }, { put, call, select }) {
      // 获取当前用户ID todo
      const { currentUser } = yield select(_ => _.users);
      const res = yield call(creatPageByTemp, {
        ...payload,
        userId: currentUser.id,
      });
      const { errorCode } = res;
      if (errorCode !== 200) {
        return message.error('添加失败');
      }
      return res;
    },
  },
  reducers: {},
});
