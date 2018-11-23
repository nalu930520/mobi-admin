import React from 'react';
import { Link } from 'dva/router';
import moment from 'moment';
import pathToRegexp from 'path-to-regexp';
import Filter from '../filter';
import { queryComplaints, queryComplaintDetail, updateComplaintOrder, uploadImg, updateHandlingComplaintOrder } from '../services/complaint';
import { numberFormat, getcurrencyBycode, codeTocurrencyCode } from '../utils/utils';

const THeader = [
  {
    title: '订单号',
    dataIndex: 'order_id',
  },
  {
    title: '申诉时间',
    sorter: true,
    render: val => <span>{moment(val.created_at * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>,
  },
  {
    title: '申诉发起方号码',
    render: val => <span><Link to={`/c2c/customer/${val.claimant_id}`} target="_blank">{val.claimant_mobile_code} {val.claimant_mobile}</Link></span>,
  },
  {
    title: '申诉对象号码',
    render: val => <span><Link to={`/c2c/customer/${val.respondent_id}`} target="_blank">{val.respondent_mobile_code} {val.respondent_mobile}</Link></span>,
  },
  {
    title: '订单金额',
    filterMultiple: true,
    render: val => <span>{numberFormat(val.fiat_amount, getcurrencyBycode(val.fiat_currency_code).decimal_place)}&nbsp;{codeTocurrencyCode(val.fiat_currency_code)}</span>,
  },
  {
    title: '状态',
    render: val => (
      <div>
        <Link to={`complaint-details/${val.id}`}>{val.status==3?"已取消":val.is_handling_by_customer_service ? <Filter value={val.status} keyname="complaintOrderStatus" /> : "待处理"}</Link>
      </div>
    ),
  },
];


export default {
  namespace: 'complaint',
  state: {
    data: {
      list: [],
      pagination: {},
      detail: {},
    },
    columns: THeader,
    loading: true,
    complaintStatus: false,
    detail: {
      is_handling_by_customer_service: false,
      conversations: [],
      claimant_detail: {
        email: '',
        img_path_arr: [],
      },
      respondent_detail: {
        email: '',
        img_path_arr: [],
      },
      admin_upload_images: {
        claimant_images: [],
        respondent_images: [],
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const match = pathToRegexp('/c2c/complaint-details/:id').exec(pathname);
        if (match && match[1]) {
          dispatch({
            type: 'fetchDetail',
            payload: match[1],
          });
        }
      });
    },
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryComplaints, payload);
      yield put({
        type: 'save',
        payload: {
          data: {
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
        payload: false,
      });
    },
    *updateHandlingStatus({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      console.log(payload);
      yield call(updateHandlingComplaintOrder, payload);
      yield put({ type: 'fetchDetail', payload: payload.complaint_id });
    },
    *fetchDetail({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryComplaintDetail, { id: payload });
      console.log('complaint Detail:', response);
      yield put({
        type: 'save',
        payload: {
          detail: response,
        },
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *updateComplaintOrder({ payload }, { call, put }) {
      const response = yield call(updateComplaintOrder, payload);
      yield put({ type: 'fetchDetail', payload: payload.id });
    },
    *uploadImg({ payload }, { call, put }) {
      const complaintId = payload.get('complaint_id');
      const response = yield call(uploadImg, payload);
      yield put({ type: 'fetchDetail', payload: complaintId });
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
