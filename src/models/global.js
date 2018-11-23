import fetch from 'dva/fetch';
import store from 'store';
import { routerRedux } from 'dva/router';
import queryString from 'query-string';
import { queryNotices, fetchOauthUrl, fetchToken, queryUserPermission } from '../services/api';

export default {
  namespace: 'global',

  state: {
    collapsed: false,
    notices: [],
    fetchingNotices: false,
    rolename: '',
    user_email: '',
  },

  effects: {
    *fetchCurrency ({}, { call, put }) {
      const rescurrencies = yield fetch('https://api.mobi.me/public/currency').then((response) => { return response.json(); });
      const currencyList = rescurrencies.currencies;
      currencyList.push(
        {
          abbr: 'btg',
          client_display_decimal_place: 8,
          code: 'btg',
          convertible: false,
          decimal_place: 8,
          first_currency_rate_place: 0,
          has_card: false,
          image_url: 'http://ofomy1urr.bkt.clouddn.com/btg.png?e=1537169591&token=S_tuZJVmM0pm_U3_8wfIs00jXlIfy1jNUmGqXBWp:w_ThIF4eqe4kb5qYKlQcitU0ixM=',
          is_erc20_token: false,
          name: 'Bitcoin Gold',
          status: 1,
          type: 'D',
          update_at: 1516945511,
        }
      );
      store.set('currencies', currencyList);
    },
    *fetchCountrys() {
      const counrtys = yield fetch('https://api.mobi.me/public/country').then((response) => { return response.json(); });
      store.set('countrys', counrtys.countries);
    },
    *fetchNotices(_, { call, put }) {
      yield put({
        type: 'changeNoticeLoading',
        payload: true,
      });
      const data = yield call(queryNotices);
      yield put({
        type: 'saveNotices',
        payload: data,
      });
      yield put({
        type: 'user/changeNotifyCount',
        payload: data.length,
      });
    },
    *clearNotices({ payload }, { put, select }) {
      yield put({
        type: 'saveClearedNotices',
        payload,
      });
      const count = yield select(state => state.global.notices.length);
      yield put({
        type: 'user/changeNotifyCount',
        payload: count,
      });
    },
    *getOauthUrl({ payload }, { put, call }) {
      const resOauthUrl = yield call(fetchOauthUrl, payload);
      if (resOauthUrl.authorize_url) {
        window.location.href = resOauthUrl.authorize_url;
      }
    },
    *getToken({ payload }, { put, call }) {
      const resGetToken = yield call(fetchToken, payload);
      store.set('adminToken', resGetToken.token);
      store.set('userPermissions', resGetToken.permissions);
      store.set('userEmail', resGetToken.user_email);
      store.set('rolename', resGetToken.rolename);
      yield put({ type: 'getPermission' });
      yield put(routerRedux.push('/workplace'));
    },
    *getPermission({ payload }, { put, call }) {
      const resPermission = yield call(queryUserPermission);
      yield put({ type: 'saveUserInfo', payload: resPermission });
      store.set('userPermissions', resPermission.permissions);
      console.log(resPermission);
    },
  },

  reducers: {
    saveUserInfo(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
    saveNotices(state, { payload }) {
      return {
        ...state,
        notices: payload,
        fetchingNotices: false,
      };
    },
    saveClearedNotices(state, { payload }) {
      return {
        ...state,
        notices: state.notices.filter(item => item.type !== payload),
      };
    },
    changeNoticeLoading(state, { payload }) {
      return {
        ...state,
        fetchingNotices: payload,
      };
    },
  },

  subscriptions: {
    setup({ history, dispatch }) {
      dispatch({ type: 'fetchCurrency' });
      dispatch({ type: 'fetchCountrys' });
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        const permissions = store.get('userPermissions');
        if (pathname === '/workplace') {
          dispatch({ type: 'getPermission' });
        }
        if (pathname === '/' && queryString.parse(search).code) {
          dispatch({ type: 'getToken', payload: { code: queryString.parse(search).code } });
        } else if (!store.get('adminToken') || !permissions) {
          dispatch({ type: 'getOauthUrl', payload: { env: process.env.NODE_ENV || 'dev' } });
        }
      });
    },
  },
};
