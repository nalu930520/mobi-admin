import { querySetting, updateSetting } from '../services/bussiness.js';
import { message } from 'antd';

export default {
  namespace: 'bussinessSetting',
  state: {
    setConfig: {},
    closeModal: true,
    loading: false,
  },

  effects: {
    *fetchBussinessSetting({ payload }, { call, put }) {
      const response = yield call(querySetting, payload);
      if (response) {
        yield put({
          type: 'save',
          payload: {
            setConfig: response,
          },
        });
      }
    },
    *updateBussinessSetting({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload: { closeModal: false },
      });
      yield put({
        type: 'save',
        payload: { changeLoading: true },
      });
      const response = yield call(updateSetting, payload);
      if (response === '') {
        yield put({
          type: 'save',
          payload: { closeModal: true },
        });
        message.success('修改成功');
        yield put({
          type: 'fetchBussinessSetting',
        });
      }
      yield put({
        type: 'save',
        payload: { changeLoading: false },
      });
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
