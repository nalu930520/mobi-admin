import React from 'react';
import { Table, Badge, Divider } from 'antd';
import moment from 'moment';
import pathToRegexp from 'path-to-regexp';
import { removeRule, addRule } from '../services/api';
import { queryOrders, queryOrderDetail } from '../services/order';


export default {
  namespace: 'order',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    loading: true,
    orderDetail: {
      id: 0,
      conversations: [],
    },
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
    *fetchOrderDetail({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryOrderDetail, { id: payload.orderId });
      yield put({
        type: 'saveDetail',
        payload: {
          orderDetail: response,
        },
      });
    },
    *fetch({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryOrders, payload);
      yield put({
        type: 'save',
        payload: {
          list: response.orders,
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
