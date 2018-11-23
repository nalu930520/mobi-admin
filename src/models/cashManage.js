import pathToRegexp from 'path-to-regexp';
import {
  addDeposit,
  addWidthdraw,
  queryDepositList,
  queryWidthdrawList,
  SubmitVerifyWidthdraw,
} from '../services/cashCharge';

export default {
  namespace: 'cashManage',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    loading: true,
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const match = pathToRegexp('/c2c/order-detail/:orderId').exec(pathname);
        if (match) {
          dispatch({ type: 'fetchOrderDetail', payload: { orderId: match[1] } });
        }
      });
    },
  },
  effects: {
    *fetchWidthdraw({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryWidthdrawList, payload);
      yield put({
        type: 'save',
        payload: {
          list: response.withdraw_request_list,
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
    *fetchDeposit({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryDepositList, payload);
      console.log(response)
      yield put({
        type: 'save',
        payload: {
          list: response.deposit_request_list,
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
    *verifyWidthdraw({ payload }, { call, put }) {
      const formData = new FormData();
      for (const key in payload) {
        if (Object.prototype.hasOwnProperty.call(payload, key)) {
          formData.append(key, payload[key]);
        }
      }
      const resVerifyWidthdraw = yield call(SubmitVerifyWidthdraw, formData);
      if (resVerifyWidthdraw instanceof Error) return false;
      return true;
    },
    *submitDeposit({ payload }, { call, put }) {
      console.log(payload);
      // const submitData = payload
      const formData = new FormData();
      for (const key in payload) {
        if (Object.prototype.hasOwnProperty.call(payload, key)) {
          formData.append(key, payload[key]);
        }
      }
      const resAddDeposit = yield call(addDeposit, formData);
      if (resAddDeposit instanceof Error) return false;
      return true;
    },
    *submitWidthdraw({ payload }, { call, put }) {
      const resAddWidth = yield call(addWidthdraw, payload);
      if (resAddWidth instanceof Error) return false;
      return true;
    },
    *fetchOrderDetail({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      // const response = yield call(queryOrderDetail, { id: payload.orderId });
      // yield put({
      //   type: 'saveDetail',
      //   payload: {
      //     orderDetail: response,
      //   },
      // });
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
