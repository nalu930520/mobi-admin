import pathToRegexp from 'path-to-regexp';
import {
  addTrans,
  addSumPool,
  addSevenList,
  addBiFengInit,
  addBiFengSetting,
  addIncome
} from '../services/yubiBao.js';
import { message } from 'antd';
export default {
  namespace: 'yubiBao',
  state: {
    data: {
      list: [],
      pagination: {}
    },
    fundsSum: '',
    configsObj: {},
    loading: true,
  },
  subscriptions: {
  },
  effects: {
    // 资金池总额r
    *fetChfundsSum({ payload }, { call, put }) {
      const response = yield call(addSumPool, payload);
      console.log(response + "资金池总额")
      yield put({
        type: 'saveSum',
        payload: response.amount
      });
    },
    // 币丰堂初始化
    *fetchDayInitSetting({ payload }, { call, put }) {
      const response = yield call(addBiFengInit, payload);
      console.log(response + "币丰堂设置初始化")
      yield put({
        type: 'saveConfig',
        payload: {
          daily_balance: response.daily_balance, // 每日限额
          start_time: response.start_time, // 收益时间
          start_day: response.start_day, // 计算收益日
          grant_day: response.grant_day, // 发放收益日
          pool_max: response.pool_max, // 资金池最大值
          today_per_coin_benefit: response.today_per_coin_benefit, // 每币收益
          date: response.date // 生效日期
        }
      });
    },
    // 币丰堂设置
    *fetchDaySetting({ payload }, { call, put }) {
      const response = yield call(addBiFengSetting, payload);
      yield put({
        type: 'saveConfig',
        payload: {
          daily_balance: response.daily_balance, // 每日限额
          start_time: response.start_time, // 收益时间
          start_day: response.start_day, // 计算收益日
          grant_day: response.grant_day, // 发放收益日
          pool_max: response.pool_max, // 资金池最大值
          today_per_coin_benefit: response.today_per_coin_benefit, // 每币收益
          date: response.date // 生效日期
        }
      });
    },
    // 转入转出记录
    *fetchAddTrans({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(addTrans, payload);
      // console.log(response)
      yield put({
        type: 'save',
        payload: {
          list: response.list,
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
    // 七日年化
    *fetchAddSevenList({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(addSevenList, payload);
      console.log(response)
      yield put({
        type: 'save',
        payload: {
          list: response.setting_list,
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
    // 每币收益
    *fetchAddIncome({ payload }, { call, put }) {
      console.log(payload)
      const response = yield call(addIncome, payload);
      yield put({
        type: 'saveConfig',
        payload: {
          daily_balance: response.daily_balance, // 每日限额
          start_time: response.start_time, // 收益时间
          start_day: response.start_day, // 计算收益日
          grant_day: response.grant_day, // 发放收益日
          pool_max: response.pool_max, // 资金池最大值
          today_per_coin_benefit: response.today_per_coin_benefit, // 每币收益
          date: response.date // 生效日期
        }
      });
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
    saveSum(state, action) {
      return {
        ...state,
        fundsSum: action.payload,
      }
    },
    saveConfig(state, action) {
      return {
        ...state,
        configsObj: action.payload,
      }
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
  },
};