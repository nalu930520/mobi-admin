import { getSystemSetting, updateSetting } from '../services/Setting.js';

export default {
  namespace: 'setting',

  state: {
    list: [],
    loading: false,
    currentUser: {},
    allSetting: {
      transaction_fee_rate: 0,
      user_cancel_punishment: {
        block_time_delta: 0,
        cancel_max_count: 0,
      },
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getSystemSetting);
      console.log(response);
      yield put({
        type: 'showSetting',
        payload: response,
      });
    },
    *saveSetting({ payload }, { call, put }) {
      console.log(111111);
      console.log(payload);

      const response = yield call(updateSetting, payload);
      yield put({ type: 'fetch' });
    }
  },

  reducers: {
    showSetting(state, action) {
      return {
        ...state,
        allSetting: action.payload,
      };
    },
  },
};
