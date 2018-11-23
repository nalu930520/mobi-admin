import { message } from 'antd';
import pathToRegexp from 'path-to-regexp';

import {
  queryHedgePlatform,
  addHedgePlatform,
  editHedgePlatform,
  queryMonitorList,
  addHedgeRecords,
  queryHedgeDetail,
  queryHedgeRecords,
  addLabelNote,
  queryOperationUser,
  queryBPI,
  editBPI,
  queryBPILog,
} from '../services/hedging.js';

export default {
  namespace: 'hedging',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    BPIValue: 0,
    historyList: {
      list: [],
      pagination: {},
    },
    currencyPreAmount: {},
    monitorList: {
      list: [],
      pagination: false,
    },
    platformList: {
      list: [],
      pagination: {},
    },
    operationUser: [],
    closeModal: false,
    hedgeRecordsLoading: true,
    addHedgeRecordsLoading: false,
    loading: true,
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const match = pathToRegexp('/hedging/hedging-record/:currency').exec(pathname);
        if (match && match[1]) {
          if (match[1] === ':currency') {
            dispatch({
              type: 'fetchHedgeRecords',
              payload: {
                page: 1,
                per_page: 10,
              },
            });
          } else {
            dispatch({
              type: 'fetchHedgeRecords',
              payload: {
                source_currency: match[1],
                page: 1,
                per_page: 10,
              },
            });
          }
        }
      });
    },
  },
  effects: {
    *fetchPlatform({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryHedgePlatform, payload);
      yield put({
        type: 'save',
        payload: {
          data: {
            list: response.hedgePlatforms,
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
    *fetchBPI({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryBPI);
      yield put({
        type: 'save',
        payload: {
          BPIValue: response.value,
        },
      });
    },
    *fetchBPILog({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryBPILog, payload);
      yield put({
        type: 'save',
        payload: {
          data: {
            list: response.logs,
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
    *updateBPI({ payload }, { call, put }) {
      yield call(editBPI, payload);
      yield put({ type: 'fetchBPI' });
      yield put({
        type: 'fetchBPILog',
        payload: {
          page: 1,
          per_page: 10,
        },
      });
      message.success('修改成功');
    },
    *addPlatform({ payload }, { call, put }) {
      yield call(addHedgePlatform, payload);
      yield put({
        type: 'fetchPlatform',
        payload: {
          page: 1,
          per_page: 10,
        } });
    },
    *editPlatform({ payload }, { call, put }) {
      yield call(editHedgePlatform, payload);
      yield put({
        type: 'fetchPlatform',
        payload: {
          page: 1,
          per_page: 10,
        } });
    },
    *fetchMonitorList({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryMonitorList, payload);
      if (response) {
        yield put({
          type: 'save',
          payload: {
            monitorList: {
              list: response.hedgeMonitorList,
              pagination: false,
            },
          },
        });
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *fetchCurrencyPreAmount({ payload }, { call, put, select }) {
      const response = yield call(queryMonitorList, payload);
      const obj = yield select(state => state.hedging.currencyPreAmount);
      if (response) {
        const amount = (Number(response.hedgeMonitorList[0].conversion_amount) + Number(response.hedgeMonitorList[0].handled_amount)) / 100000000;
        yield put({
          type: 'save',
          payload: {
            currencyPreAmount: {
              ...obj,
              [response.hedgeMonitorList[0].currency]: amount,
            },
          },
        });
      }
    },
    *fetchHedgeRecords({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          hedgeRecordsLoading: true,
        },
      });
      const response = yield call(queryHedgeRecords, payload);
      if (response) {
        yield put({
          type: 'save',
          payload: {
            historyList: {
              list: response.hedgeRecordList,
              pagination: {
                total: response.total,
                pageSize: response.per_page,
                current: response.page,
              },
            },
          },
        });
      }
      yield put({
        type: 'save',
        payload: {
          hedgeRecordsLoading: false,
        },
      });
    },
    *fetchHedgePlatform({ payload }, { call, put }) {
      const response = yield call(queryHedgePlatform, payload);
      if (response) {
        yield put({
          type: 'save',
          payload: {
            platformList: {
              list: response.hedgePlatforms,
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
    *fetchOperationUser(_, { call, put }) {
      const response = yield call(queryOperationUser);
      if (response) {
        yield put({
          type: 'save',
          payload: {
            operationUser: response.users,
          },
        });
      }
    },
    *fetchHedgeDetail({ payload }, { call, put }) {
      const response = yield call(queryHedgeDetail, payload);
      if (response) {
        yield put({
          type: 'save',
          payload: {
            hedgeDetail: response,
          },
        });
      }
    },
    *addHedgeRecords({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload: { addHedgeRecordsLoading: true },
      });
      yield put({
        type: 'save',
        payload: { closeModal: false },
      });
      const response = yield call(addHedgeRecords, payload);
      if (response === '') {
        yield put({
          type: 'save',
          payload: { addHedgeRecordsLoading: false },
        });
        message.success('提交成功');
        yield put({
          type: 'save',
          payload: { closeModal: true },
        });
      }
    },
    *addLabelNote({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload: { addLabelNoteLoading: true },
      });
      yield put({
        type: 'save',
        payload: { closeModal: false },
      });
      const response = yield call(addLabelNote, payload);
      if (response === '') {
        yield put({
          type: 'save',
          payload: { addLabelNoteLoading: false },
        });
        message.success('提交成功');
        yield put({
          type: 'save',
          payload: { closeModal: true },
        });
        yield put({
          type: 'fetchHedgeRecords',
          payload: {
            page: 1,
            per_page: 10,
          },
        });
      }
    },
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
        loading: action.payload,
      };
    },
  },
};
