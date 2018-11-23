import pathToRegexp from 'path-to-regexp';
import { queryAllComplaintOrders, queryAllOrders, queryAllAds } from '../services/dashboard.js';


export default {
  namespace: 'dashboard',
  state: {
    complaintOrders: {},
    orders: {},
    ads: {},
    loading: false,
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const match = pathToRegexp('/c2c/dashboard').exec(pathname);
        if (match) {
          dispatch({
            type: 'fetchAllComplaintOrders',
            payload: { id: match[1] },
          });
          dispatch({
            type: 'fetchAllOrders',
            payload: { id: match[1] },
          });
          dispatch({
            type: 'fetchAllAds',
            payload: { id: match[1] },
          });
        }
      });
    },
  },
  effects: {
    *fetchAllComplaintOrders({ payload }, { call, put }) {
      const response = yield call(queryAllComplaintOrders, payload);
      if (response) {
        yield put({
          type: 'save',
          payload: {
            complaintOrders: response,
          },
        });
      }
    },
    *fetchAllOrders({ payload }, { call, put }) {
      const response = yield call(queryAllOrders, payload);
      if (response) {
        yield put({
          type: 'save',
          payload: {
            orders: response,
          },
        });
      }
    },
    *fetchAllAds({ payload }, { call, put }) {
      const response = yield call(queryAllAds, payload);
      if (response) {
        yield put({
          type: 'save',
          payload: {
            ads: response,
          },
        });
      }
    },
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
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
