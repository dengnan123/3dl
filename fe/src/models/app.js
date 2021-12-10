// import { message } from 'antd';
import { withMixin } from '../helpers/dva';
import queryString from 'query-string';
import {
  fetchCompList,
  fetchPageUseCompList,
  addCompToPage,
  updatePageComp,
  delPageComp,
  fetchPageConfig,
} from '../service';

export default withMixin({
  namespace: 'app',
  state: {
    locationPathname: '',
    locationQuery: {},
  },
  subscriptions: {
    setHistory({ dispatch, history }) {
      return history.listen(location => {
        dispatch({
          type: 'updateState',
          payload: {
            locationPathname: location.pathname,
            locationQuery: queryString.parse(location.search),
          },
        });
      });
    },
  },
  effects: {
    *initFetch({ payload }, { put, call, select, all }) {
      const {
        pageConfig: { id: pageId },
      } = yield select(_ => _.app);
      const res = yield all([
        call(fetchCompList, {}),
        call(fetchPageUseCompList, {
          pageId,
        }),
        call(fetchPageConfig, {
          pageId,
        }),
      ]);
      // console.log('resres', res);
    },

    *fetchCompList({ payload }, { put, call, select }) {
      const { errorCode, data } = yield call(fetchCompList, {
        ...payload,
      });
      if (errorCode !== 200) {
        return;
      }
      yield put({
        type: 'updateState',
        payload: {
          initCompList: data,
        },
      });
    },
    *fetchPageUseCompList({ payload }, { put, call, select }) {
      const { errorCode, data } = yield call(fetchPageUseCompList, {
        ...payload,
      });
      if (errorCode !== 200) {
        return;
      }
      yield put({
        type: 'updateState',
        payload: {
          initUseCompList: data,
        },
      });
    },
    *fetchPageConfig({ payload }, { put, call, select }) {
      const { errorCode, data } = yield call(fetchPageConfig, {
        ...payload,
      });
      if (errorCode !== 200) {
        return;
      }
      const { gridLayout, ruleStyle } = data;
      let layoutParams = gridLayout || {};
      if (typeof gridLayout === 'string') {
        layoutParams = JSON.parse(gridLayout);
      }

      let ruleConfig = ruleStyle || {};
      if (typeof ruleStyle === 'string') {
        ruleConfig = JSON.parse(ruleStyle);
      }

      yield put({
        type: 'updateState',
        payload: {
          pageConfig: { ...data, gridLayout: layoutParams, ruleStyle: ruleConfig },
        },
      });
    },
    *addCompToPage({ payload }, { put, call, select }) {
      const { errorCode } = yield call(addCompToPage, {
        ...payload,
      });
      if (errorCode !== 200) {
        return;
      }
    },
    *updatePageComp({ payload }, { put, call, select }) {
      const { errorCode } = yield call(updatePageComp, {
        ...payload,
      });
      if (errorCode !== 200) {
        return;
      }
    },
    *delPageComp({ payload }, { put, call, select }) {
      const { errorCode } = yield call(delPageComp, {
        ...payload,
      });
      if (errorCode !== 200) {
        return;
      }
    },
  },
  reducers: {},
});
