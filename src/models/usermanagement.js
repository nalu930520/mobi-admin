import { queryUserList, queryUserAddress, queryPlatformInfo } from '../services/usermanagement.js';

export default {
  namespace: 'usermanagement',
  state: {
    userList: {
      list: [],
      pagination: {},
    },
    platformInfo: {},
    addressList: [],
    expandedLoading: true,
    loading: true,
  },

  effects: {
    *fetchPlatformInfo({ payload }, { call, put }) {
      const response = yield call(queryPlatformInfo, payload);
      if (response) {
        yield put({
          type: 'save',
          payload: {
            platformInfo: response,
          },
        });
      }
    },
    *fetchList({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryUserList, payload);
      if (response) {
        yield put({
          type: 'save',
          payload: {
            userList: {
              list: response.customers,
              pagination: {
                total: response.total,
                pageSize: response.per_page,
                current: response.page,
              },
            },
          },
        });
        yield put({
          type: 'changeLoading',
          payload: false,
        });
      }
    },
    *fetchUserAddress({ payload }, { call, put, select }) {
      const oldList = yield select(state => state.usermanagement.addressList);
      if (oldList[payload.customer_id]) {
        return;
      }
      const response = yield call(queryUserAddress, payload);
      if (response) {
        yield put({
          type: 'save',
          payload: {
            addressList: {
              ...oldList,
              [payload.customer_id]: response.addresses,
            },
          },
        });
      }
      yield put({
        type: 'changeExpandedLoading',
        payload: false,
      });
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
    changeExpandedLoading(state, action) {
      return {
        ...state,
        expandedLoading: action.payload,
      };
    },
  },
};
