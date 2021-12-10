import { withMixin } from '../../helpers/dva';
import { getImageList, getVideoList } from './service';

export default withMixin({
  namespace: 'storageCenter',
  state: {
    imageList: [],
    videoList: [],
  },
  subscriptions: {},
  effects: {
    *getImageList({ payload }, { call, put }) {
      const { errorCode, data } = yield call(getImageList);
      if (errorCode === 200) {
        yield put({ type: 'updateState', payload: { imageList: data } });
      }

      return { errorCode, data };
    },
    *getVideoList({ payload }, { call, put }) {
      const { errorCode, data } = yield call(getVideoList);
      if (errorCode === 200) {
        yield put({ type: 'updateState', payload: { videoList: data } });
      }

      return { errorCode, data };
    },
  },
  reducers: {},
});
