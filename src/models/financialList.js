import { routerRedux } from 'dva/router';
import {queryFinancialList, queryFinancialBTCList, queryFinancialNetList} from '../services/financial';
export default {
  namespace: 'financialList',
  state: {
    tabLoading: false,
    fiat_exchange_object_list: [],
    digital_exchange_object_list: [],
    network_fee_object_list: []
  },
  reducers: {
    save(state, action) {
      return { 
        ...state, 
        ...action.payload 
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
  effects: {
    *queryFinancialList({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: {
          tabLoading: true,
        },
      });
      const { fiat_exchange_object_list} = yield call(queryFinancialList, payload);
      const { digital_exchange_object_list} = yield call(queryFinancialBTCList, payload);
      const { network_fee_object_list} = yield call(queryFinancialNetList, payload);
      yield put({
        type: 'save',
        payload: {
          fiat_exchange_object_list :fiat_exchange_object_list,
          digital_exchange_object_list :digital_exchange_object_list,
          network_fee_object_list :network_fee_object_list          
        },
      });
      yield put({
        type: 'changeLoading',
        payload: {
          tabLoading: false,
        },
      });
    }
  },
  subscriptions: {
  },
};
