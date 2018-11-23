import { queryMerchantDetail,
  queryMerchantLog,
  queryMerchantOTC,
  updateStatus,
  updateMerchantOTC,
  queryUserTransactionInfo,
  queryCustomerRelations,
  queryPublicMerchants,
  createCustomer,
  deleteCustomer,
} from '../services/bussiness.js';
import pathToRegexp from 'path-to-regexp';
import { message } from 'antd';
import { setTimeout } from 'core-js';

export default {
  namespace: 'bussinessDetail',
  state: {
    transactionList: {
      list: [],
      pagination: {},
    },
    logs: {
      list: [],
      pagination: {},
    },
    relationsBusinessList: {
      list: [],
      pagination: {},
    },
    userInfo: {},
    assets: [],
    cards: [],
    accountInfo: {},
    otcInfo: {},
    addressList: [],
    loading: true,
    expandedLoading: true,
    closeModal: true,
    visible: true,
    currencyInfoLoading: false,
    transactionLoading: false,
    operationLoading: false,
    updateBussinessStatusLoading: false,
    statusFlg: true,
    passWordLoading: false,
    confirmLoading: false,
    updateBussinessOTCLoading: false,
    supportBusinessLoading: false,
    supportBusinessList: [],
    supportBusinessVisable: false,
    relationLoading: false,
  },

  effects: {
    *fetchMerchantDetail({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload: { currencyInfoLoading: true },
      });
      const response = yield call(queryMerchantDetail, payload);
      if (response) {
        yield put({
          type: 'save',
          payload: {
            userInfo: response.user_info,
            assets: response.assets,
            cards: response.cards,
          },
        });
      }
      yield put({
        type: 'save',
        payload: { currencyInfoLoading: false },
      });
    },
    *fetchMerchantLog({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload: { operationLoading: true },
      });
      const response = yield call(queryMerchantLog, payload);
      if (response) {
        yield put({
          type: 'save',
          payload: {
            logs: {
              list: response.logs,
              pagination: {
                total: response.total,
                pageSize: response.per_page,
                current: response.page,
              },
            },
          },
        });
      }
      yield put({
        type: 'save',
        payload: { operationLoading: true },
      });
    },
    *fetchMerchantOTC({ payload }, { call, put }) {
      const response = yield call(queryMerchantOTC, payload);
      if (response) {
        yield put({
          type: 'save',
          payload: {
            otcInfo: response,
          },
        });
      }
    },
    *updateMerchantStatus({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          closeModal: false,
          updateBussinessStatusLoading: true,
        },
      });
      const response = yield call(updateStatus, payload);
      if (response === '') {
        yield put({
          type: 'save',
          payload: {
            updateBussinessStatusLoading: false,
            closeModal: true,
          },
        });
        message.success('修改成功');
        yield put({
          type: 'fetchMerchantDetail',
          payload: { merchant_id: payload.merchant_id },
        });
      } else {
        message.success(response.error_message);
      }
    },
    *updateMerchantOTC({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          closeModal: false,
          updateBussinessOTCLoading: true,
        },
      });
      const response = yield call(updateMerchantOTC, payload);
      if (response === '') {
        yield put({
          type: 'save',
          payload: {
            closeModal: true,
            updateBussinessOTCLoading: false,
          },
        });
        message.success('修改成功');
        yield put({
          type: 'fetchMerchantOTC',
          payload: { merchant_id: payload.merchant_id },
        });
      } else {
        message.error(response.error_message);
      }
    },
    *clearTransactionList(_, { put }) {
      yield put({
        type: 'save',
        payload: { transactionLoading: true },
      });
      yield put({
        type: 'save',
        payload: {
          transactionList: {
            list: [],
            pagination: {},
          },
        },
      });
    },
    *fetchUserTransactionsInfo({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload: { transactionLoading: true },
      });
      const response = yield call(queryUserTransactionInfo, payload);
      if (response) {
        yield put({
          type: 'save',
          payload: {
            transactionList: {
              list: response.transactions,
              pagination: {
                total: response.total,
                pageSize: response.per_page,
                current: response.page,
              },
            },
          },
        });
      }
      yield put({
        type: 'save',
        payload: { transactionLoading: false },
      });
    },
    *fetchCustomerRelations({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload: { relationLoading: true },
      });
      const response = yield call(queryCustomerRelations, payload);
      if (response) {
        yield put({
          type: 'save',
          payload: {
            relationsBusinessList: {
              list: response.relations,
              pagination: {
                total: response.total,
                pageSize: response.per_page,
                current: response.page,
              },
            },
          },
        });
      }
      yield put({
        type: 'save',
        payload: { relationLoading: false },
      });
    },
    *fetchPublicMerchants({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          supportBusinessVisable: false,
        },
      });
      const response = yield call(queryPublicMerchants, payload);
      if (response) {
        yield put({
          type: 'save',
          payload: {
            supportBusinessList: response.merchant_apps,
            supportBusinessVisable: true,
          },
        });
      }
    },
    *CreateCustomer({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          closeModal: false,
          supportBusinessLoading: true,
        },
      });
      const response = yield call(createCustomer, payload);
      if (response === '') {
        yield put({
          type: 'save',
          payload: {
            closeModal: true,
            supportBusinessLoading: false,
            supportBusinessVisable: false,
          },
        });
        message.success('新增成功');
      } else {
        message.error(response.error_message);
      }
    },
    *DeleteCustomer({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          closeModal: false,
        },
      });
      const response = yield call(deleteCustomer, { relation_id: payload.relation_id });
      if (response === '') {
        yield put({
          type: 'save',
          payload: {
            closeModal: true,
          },
        });
        message.success('删除成功');
        yield put({
          type: 'fetchCustomerRelations',
          payload: {
            merchant_id: payload.merchant_id,
            page: 1,
            per_page: 10,
          },
        });
      } else {
        message.error(response.error_message);
      }
    },
  },

  reducers: {
    StatusFlg(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    changeExpandedLoading(state, action) {
      return {
        ...state,
        expandedLoading: action.payload,
      };
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const match = pathToRegexp('/bussniess/bussniessDetail/:id').exec(pathname);
        if (match && match[1]) {
          dispatch({
            type: 'save',
            payload: {
              merchant_id: match[1],
            },
          });
          dispatch({
            type: 'fetchMerchantDetail',
            payload: { merchant_id: match[1] },
          });
          dispatch({
            type: 'fetchMerchantOTC',
            payload: { merchant_id: match[1] },
          });
          // dispatch({
          //   type: 'fetchUserTransactionsInfo',
          //   payload: {
          //     customer_id: match[1],
          //     tx_type: 7, // onchain收币 7, onchain发币 6, offchain转账 5, 货币兑换 11, 兑换撤销 12, 系统退款 4
          //     page: 1,
          //     per_page: 10,
          //   },
          // });
        }
      });
    },
  },
};
