import React from 'react';
import { Link } from 'dva/router';
import pathToRegexp from 'path-to-regexp';
import { message } from 'antd';
import { queryUserId, queryUserPhoneNumber, updateUserInfo, queryUserAds,
queryUserLogs, addMark, queryUserMark, queryUserOrders, queryUserPaymentInfo,
queryUserRelationship } from '../services/customer';
import { getMobileCodeByCountryCode } from '../utils/utils';

const THeader = [
  {
    title: 'Mobi ID',
    dataIndex: 'mobi_id',
  },
  {
    title: '手机号码',
    dataIndex: 'mobile',
  },
  {
    title: '国家号',
    render: (record) => {
      const country = getMobileCodeByCountryCode(record.mobile_country_code);
      return (<span>{country.name}</span>);
    },
  },
  {
    title: '状态',
    dataIndex: 'id',
    render: val => (
      <div>
        <Link to={`/c2c/customer/${val}`} target="_blank">查看</Link>
      </div>
    ),
  },
];


export default {
  namespace: 'customer',
  state: {
    id: '',
    customerList: {
      list: [],
    },
    columns: THeader,
    loading: false,
    detail: {
      trades_info: [{ send_coin_delay: '' },
      ],
      max_advertisement_online: {
        note: '',
        v: '',
      },
      allow_to_create_order: {
        note: '',
        v: '',
      },
    },
    marks: [],
    userLogs: [],
    paymentInfo: {},
    ordersList: {
      list: [],
      pagination: {},
    },
    adsList: [],
    blockedList0: {}, // 我屏蔽的人
    blockedList1: {}, // 屏蔽我的人
    trustList0: {}, // 我信任的人
    trustList1: {}, // 信任我的人
    advancedLoading: false,
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const match = pathToRegexp('/c2c/customer/:id').exec(pathname) ||
          pathToRegexp('/user-management/user-detail/:id').exec(pathname);
        if (match && match[1]) {
          dispatch({
            type: 'save',
            payload: { id: match[1] },
          });
        }
      });
    },
  },
  effects: {
    *fetchID({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryUserId, payload);
      if (response) {
        response.id = payload.id;
        const arr = [];
        arr.push(response);
        yield put({
          type: 'save',
          payload: {
            customerList: {
              list: arr,
            },
          },
        });
        yield put({
          type: 'changeLoading',
          payload: false,
        });
      }
    },
    *fetchDetail({ payload }, { call, put }) {
      const response = yield call(queryUserId, payload);
      if (response) {
        response.id = payload.id;
        yield put({
          type: 'save',
          payload: {
            detail: response,
          },
        });
      }
    },
    *fetchPhoneNumber({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryUserPhoneNumber, payload);
      if (response && response.length > 0) {
        yield put({
          type: 'save',
          payload: {
            customerList: {
              list: response,
            },
          },
        });
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *updateUserInfo({ payload }, { call, put }) {
      const response = yield call(updateUserInfo, payload);
      if (response) {
        yield put({ type: 'fetchDetail', payload: { id: payload.customer_id } });
      }
    },
    *fetchUserAds({ payload }, { call, put }) {
      const response = yield call(queryUserAds, payload);
      if (response) {
        yield put({
          type: 'save',
          payload: {
            adsList: {
              list: response.items,
              pagination: {
                total: response.total,
                pageSize: response.per_page,
                current: response.page,
              },
            },
          },
        });
      }
    },
    *fetchUserLogs({ payload }, { call, put }) {
      const response = yield call(queryUserLogs, payload);
      yield put({ type: 'saveUserLog', payload: response });
      if (response) {
        console.log('UserLog:', response);
      }
    },
    *addMark({ payload }, { call, put }) {
      const response = yield call(addMark, payload);
      if (response) {
        console.log('Mark:', response);
      }
      yield put({ type: 'fetchMark', payload: { customer_id: payload.customer_id } });
      message.success('添加成功');
    },
    *fetchMark({ payload }, { call, put }) {
      const response = yield call(queryUserMark, payload);
      yield put({ type: 'saveMark', payload: response });
      if (response) {
        console.log('Mark:', response);
      }
    },

    *fetchOrders({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: { advancedLoading: true },
      });
      const response = yield call(queryUserOrders, payload);
      if (response) {
        yield put({
          type: 'save',
          payload: {
            ordersList: {
              list: response.orders,
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
          payload: { advancedLoading: false },
        });
      }
    },

    *fetchRelationship({ payload }, { call, put }) {
      const response = yield call(queryUserRelationship, payload);
      let Relationship = '';
      switch (payload.query_type) {
        case 1:
          Relationship = 'blockedList0';
          break;
        case 2:
          Relationship = 'blockedList1';
          break;
        case 3:
          Relationship = 'trustList0';
          break;
        case 4:
          Relationship = 'trustList1';
          break;
        default:
          break;
      }
      yield put({
        type: 'save',
        payload: {
          [Relationship]: {
            list: response.relationships,
            pagination: {
              total: response.total,
              pageSize: response.per_page,
              current: response.page,
            },
          },
        },
      });
    },
    *fetchPaymentInfo({ payload }, { call, put }) {
      const response = yield call(queryUserPaymentInfo, payload);
      if (response) {
        yield put({
          type: 'save',
          payload: {
            paymentInfo: response,
          },
        });
      }
    },
  },

  reducers: {
    saveMark(state, { payload }) {
      return {
        ...state,
        marks: payload.remarks,
      };
    },
    saveUserLog(state, { payload }) {
      return {
        ...state,
        userLogs: payload.operation_logs,
      };
    },
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
