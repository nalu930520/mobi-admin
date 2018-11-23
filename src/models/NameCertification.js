import {
  addMemoServer,
  YiListServer,
  auditorIdServer,
  myDetailServer
} from '../services/NameCertification.js';
export default {
  namespace: 'NameCertification',
  state: {
    data: {
      list: [],
      pagination: {}
    },
    auditorIdList: [],
    aocumentList: {}
  },
  effects: {
    // 审核人
    *fetchauditorId({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(auditorIdServer, payload);
      yield put({
        type: 'reviewList',
        payload: response.auditors,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    // 已归档列表
    *fetchYiList({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(YiListServer, payload);
      yield put({
        type: 'save',
        payload: {
          list: response.records,
          pagination: {
            total: response.total,
            pageSize: response.per_page,
            current: response.page,
          }
        },
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    // 证件/地址验证
    *fetchMyDetails({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(myDetailServer, payload)
      console.log(response)
      yield put({
        type: 'aocumentList',
        payload: response.kyc_app_Info,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      })
    },
     // 添加备注
     *fetchMyDetails({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(addMemoServer, payload)
      console.log(response)
      yield put({
        type: 'aocumentList',
        payload: response.kyc_app_Info,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      })
    },
    *fetchOrderDetail({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    reviewList (state, action) {
      return {
        ...state,
        auditorIdList: action.payload,
      };
    },
    aocumentList (state, action) {
      return {
        ...state,
        aocumentList: action.payload,
      };
    },
  },
};