import { queryPlantInfo, createMerchant, queryMerchantList, getMerchantId } from '../services/bussiness.js';
import { message } from 'antd';

export default {
  namespace: 'bussinessList',
  state: {
    merchantList: {
      list: [],
      pagination: {},
    },
    platformInfo: {},
    loading: false,
    closeModal: true,
    merchantId: '',
  },

  effects: {
    *fetchPlatformInfo({ payload }, { call, put }) {
      const response = yield call(queryPlantInfo, payload);
      if (response) {
        yield put({
          type: 'save',
          payload: {
            platformInfo: response,
          },
        });
      }
    },
    *fetchCreateMerchant({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload: { closeModal: false },
      });
      const response = yield call(createMerchant, payload);
      if (response === '') {
        yield put({
          type: 'save',
          payload: { closeModal: true },
        });
        message.success('提交成功');
        yield put({
          type: 'fetchPlatformInfo',
        });
      }
    },
    *fetchgMerchantId({ payload }, { call, put }) {
      const response = yield call(getMerchantId, payload);
      if (response) {
        yield put({
          type: 'save',
          payload: {
            merchantId: response.merchant_id,
          },
        });
      }
    },
    *fetchList({ payload }, { call, put }) {
      const response = yield call(queryMerchantList, payload);
      if (response) {
        yield put({
          type: 'save',
          payload: {
            merchantList: {
              list: response.merchant_users,
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
