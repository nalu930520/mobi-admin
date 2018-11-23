import pathToRegexp from 'path-to-regexp';
import { queryAdvertising, queryAdvertisingDetail, cancelAdvertising } from '../services/advertising';


export default {
  namespace: 'advertising',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    loading: true,
    adDetail: {
      id: 0,
      payment_method_array: [],
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const match = pathToRegexp('/c2c/advertising-detail/:advertisingId').exec(pathname);
        if (match) {
          dispatch({ type: 'fetchAdvertisingDetail', payload: { id: match[1] } });
        }
      });
    },
  },
  effects: {
    *cancelAd({ payload }, { call, put }) {
      yield call(cancelAdvertising, payload);
      yield put({ type: 'fetchAdvertisingDetail', payload: { id: payload.id } });
    },
    *fetchAdvertisingDetail({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryAdvertisingDetail, { id: payload.id });
      yield put({
        type: 'saveDetail',
        payload: {
          adDetail: response,
        },
      });
    },
    *fetch({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryAdvertising, payload);
      yield put({
        type: 'save',
        payload: {
          list: response.ads,
          pagination: {
            total: response.total,
            pageSize: response.per_page,
            current: response.page,
          },
        },
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
  },

  reducers: {
    saveDetail(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
  },
};
