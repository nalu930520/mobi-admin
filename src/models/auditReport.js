import { queryAuditlList, queryAuditLiability } from '../services/auditReport';

export default {
  namespace: 'auditReport',
  state: {
    tabLoading: false,
    fiat_exchange_object_list: [],
    digital_exchange_object_list: [],
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
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
    *queryAuditInfo({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: {
          tabLoading: true,
        },
      });
      const { assets } = yield call(queryAuditlList, payload);
      const { liabilities } = yield call(queryAuditLiability, payload);
      yield put({
        type: 'save',
        payload: {
          assets,
          liabilities,
        },
      });
      yield put({
        type: 'changeLoading',
        payload: {
          tabLoading: false,
        },
      });
    },
  },
};
