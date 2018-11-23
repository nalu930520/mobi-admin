import React from 'react';
import { Table, Badge, Divider } from 'antd';
import moment from 'moment';
import queryString from 'query-string';
import pathToRegexp from 'path-to-regexp';
import { removeRule, addRule } from '../services/api';
import { queryAllTransaction, queryOnchainTransaction, queryMobiTransaction, queryChangeTransaction, queryAllTransactionDetail, queryOnchainTransactionDetail, queryChangeTransactionDetail, queryMobiTransactionDetail } from '../services/transaction';


export default {
  namespace: 'transaction',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    loading: true,
    transactionDetail: {
      sn: '',
      transaction_detail: {
        creator_customer: {},
        payer_customer: {},
        payee_customer: {},
      },
      block_chain_info: {

      },
      exchange_detail: {

      },
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname, search }) => {
        const match = pathToRegexp('/trade-management/(.*)/:id').exec(pathname);
        if (match) {
          dispatch({ type: 'fetchOrderDetail', payload: { id: match[2], ...queryString.parse(search) } });
        }
      });
    },
  },
  effects: {
    *fetchOrderDetail({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      let requestApi = {};
      switch (parseInt(payload.transactionType, 10)) {
        case 1:
          // all transaction
          requestApi = queryAllTransactionDetail;
          break;
        case 2:
          // On chain transaction
          requestApi = queryOnchainTransactionDetail;
          break;
        case 3:
          requestApi = queryChangeTransactionDetail;
          break;
        case 4:
          requestApi = queryMobiTransactionDetail;
          break;
        default:
          break;
      }

      let response = yield call(requestApi, { id: payload.id });
      if (payload.transactionType === '4') {
        response = {
          transaction_detail: response,
        };
      }
      yield put({
        type: 'saveDetail',
        payload: {
          transactionDetail: response,
        },
      });
    },
    *fetch({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      let requestApi = {};
      switch (payload.transactionType) {
        case 1:
          // all transaction
          requestApi = queryAllTransaction;
          break;
        case 2:
          // On chain transaction
          requestApi = queryOnchainTransaction;
          break;
        case 3:
          requestApi = queryChangeTransaction;
          break;
        case 4:
          requestApi = queryMobiTransaction;
          break;
        default:
          break;
      }
      const response = yield call(requestApi, payload);
      yield put({
        type: 'save',
        payload: {
          list: payload.transactionType === 3 ? response.exchangeTransactions : response.transactions,
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
