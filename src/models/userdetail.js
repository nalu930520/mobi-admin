import pathToRegexp from 'path-to-regexp';
import { message } from 'antd';
import { queryUserInfo, queryUserAssets, queryUserWithdrawInfo, queryUserTransactionInfo, updateUserAccountStatus, queryOperationLogs, updateUserWithdrawLevel, queryVipConfigs } from '../services/userdetail.js';

export default {
  namespace: 'userdetail',
  state: {
    id: '',
    userInfo: {},
    assetsInfo: {},
    assetsLoading: true,
    withdrawInfo: {},
    withdrawLoading: true,
    transactionLoading: true,
    updateUserAccountLoading: false,
    updateUserWithdrawLoading: false,
    closeModal: false,
    operationLoading: true,
    transactionList: {
      list: [],
      pagination: {},
    },
    operationList: {
      list: [],
      pagination: {},
    },
    vipList: [],
    loading: true,
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const match = pathToRegexp('/user-management/user-detail/:id').exec(pathname);
        if (match && match[1]) {
          dispatch({
            type: 'save',
            payload: {
              id: match[1],
            },
          });
          dispatch({
            type: 'fetchUserInfo',
            payload: { customer_id: match[1] },
          });
          dispatch({
            type: 'fetchUserAssetsInfo',
            payload: { customer_id: match[1] },
          });
          dispatch({
            type: 'fetchUserWithdrawInfo',
            payload: { customer_id: match[1] },
          });
          dispatch({
            type: 'fetchUserTransactionsInfo',
            payload: {
              customer_id: match[1],
              tx_type: 7, // onchain收币 7, onchain发币 6, offchain转账 5, 货币兑换 11, 兑换撤销 12, 系统退款 4
              page: 1,
              per_page: 10,
            },
          });
        }
      });
    },
  },
  effects: {
    *fetchUserInfo({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: { basicLoading: true },
      });
      const response = yield call(queryUserInfo, payload);
      if (response) {
        yield put({
          type: 'save',
          payload: {
            userInfo: response,
          },
        });
      }
      yield put({
        type: 'changeLoading',
        payload: { basicLoading: false },
      });
    },
    *fetchUserAssetsInfo({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: { assetsLoading: true },
      });
      const response = yield call(queryUserAssets, payload);
      if (response) {
        yield put({
          type: 'save',
          payload: {
            assetsInfo: response,
          },
        });
      }
      yield put({
        type: 'changeLoading',
        payload: { assetsLoading: false },
      });
    },
    *fetchUserWithdrawInfo({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: { withdrawLoading: true },
      });
      const response = yield call(queryUserWithdrawInfo, payload);
      if (response) {
        yield put({
          type: 'save',
          payload: {
            withdrawInfo: response,
          },
        });
      }
      yield put({
        type: 'changeLoading',
        payload: { withdrawLoading: false },
      });
    },
    *fetchUserTransactionsInfo({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
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
        type: 'changeLoading',
        payload: { transactionLoading: false },
      });
    },
    *clearTransactionList(_, { put }) {
      yield put({
        type: 'changeLoading',
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
    *updateUserAccountStatus({ payload }, { call, put, select }) {
      yield put({
        type: 'changeLoading',
        payload: { updateUserAccountLoading: true },
      });
      yield put({
        type: 'save',
        payload: { closeModal: false },
      });
      const response = yield call(updateUserAccountStatus, payload);
      if (response === '') {
        yield put({
          type: 'save',
          payload: { closeModal: true },
        });
        message.success('提交成功');
        const id = yield select(state => state.userdetail.id);
        yield put({
          type: 'fetchUserInfo',
          payload: { customer_id: id },
        });
      }
      yield put({
        type: 'changeLoading',
        payload: { updateUserAccountLoading: false },
      });
    },
    *updateUserWithdrawLevel({ payload }, { call, put, select }) {
      yield put({
        type: 'changeLoading',
        payload: { updateUserWithdrawLoading: true },
      });
      yield put({
        type: 'save',
        payload: { closeModal: false },
      });
      const response = yield call(updateUserWithdrawLevel, payload);
      if (response === '') {
        yield put({
          type: 'save',
          payload: { closeModal: true },
        });
        message.success('提交成功');
        const id = yield select(state => state.userdetail.id);
        yield put({
          type: 'fetchUserInfo',
          payload: { customer_id: id },
        });
      }
      yield put({
        type: 'changeLoading',
        payload: { updateUserWithdrawLoading: false },
      });
    },
    *clearOperationList(_, { put }) {
      yield put({
        type: 'changeLoading',
        payload: { operationLoading: true },
      });
      yield put({
        type: 'save',
        payload: {
          operationList: {
            list: [],
            pagination: {},
          },
        },
      });
    },
    *fetchUserOperationLogs({ payload }, { call, put }) {
      yield put({
        type: 'clearOperationList',
      });
      const response = yield call(queryOperationLogs, payload);
      if (response) {
        yield put({
          type: 'save',
          payload: {
            operationList: {
              list: response.logs,
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
          payload: { operationLoading: false },
        });
      }
    },
    *fetchVipConfigs({ payload }, { call, put }) {
      const response = yield call(queryVipConfigs, payload);
      if (response) {
        yield put({
          type: 'save',
          payload: {
            vipList: response.levels,
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
    changeLoading(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
