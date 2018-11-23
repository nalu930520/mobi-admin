import { queryAllAssets, queryFiatAssets, queryDigitalAssets, queryAssetsChange, queryRate, queryExchangeTransaction, queryCurrencyExchangeChange } from '../services/assets.js';

export default {
  namespace: 'assets',
  state: {
    data: {
      list: [],
      eth_total_amount: '-',
      usd_total_amount: '-',
      ltc_total_amount: '-',
      bch_total_amount: '-',
      btc_total_asset: '-',
      btc_total_amount: '-',
      usd_to_btc_total_amount: '-',
      fiat_to_usd_total_amount: '-',
    },
    dailyAssetsList: {
      list: [],
      pagination: {},
    },
    currencyExchangeList: {
      list: [],
      pagination: {},
    },
    rateList: {
      list: [],
      pagination: {},
    },
    transactionList: {
      list: [],
      pagination: {},
    },
    loading: true,
  },
  subscriptions: {
  },
  effects: {
    *fetchAllAssets({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          data: {
            list: [],
          },
        },
      });
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryAllAssets, payload);
      if (response) {
        yield put({
          type: 'save',
          payload: {
            data: {
              list: response.customer_asset_total_object_list,
              eth_total_amount: response.eth_total_amount,
              usd_total_amount: response.usd_total_amount,
              ltc_total_amount: response.ltc_total_amount,
              bch_total_amount: response.bch_total_amount,
              btc_total_asset: response.btc_total_asset,
              btc_total_amount: response.btc_total_amount,
              usd_to_btc_total_amount: response.usd_to_btc_total_amount,
              fiat_to_usd_total_amount: response.fiat_to_usd_total_amount,
            },
          },
        });
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *fetchFiatAssets({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          data: {
            list: [],
          },
        },
      });
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryFiatAssets, payload);
      if (response) {
        yield put({
          type: 'save',
          payload: {
            data: {
              list: response.customer_asset_total_object_list,
              eth_total_amount: response.eth_total_amount,
              usd_total_amount: response.usd_total_amount,
              ltc_total_amount: response.ltc_total_amount,
              bch_total_amount: response.bch_total_amount,
              btc_total_asset: response.btc_total_asset,
              btc_total_amount: response.btc_total_amount,
              usd_to_btc_total_amount: response.usd_to_btc_total_amount,
              fiat_to_usd_total_amount: response.fiat_to_usd_total_amount,
            },
          },
        });
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *fetchDigitalAssets({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          data: {
            list: [],
          },
        },
      });
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryDigitalAssets, payload);
      if (response) {
        yield put({
          type: 'save',
          payload: {
            data: {
              list: response.customer_asset_total_object_list,
              eth_total_amount: response.eth_total_amount,
              usd_total_amount: response.usd_total_amount,
              ltc_total_amount: response.ltc_total_amount,
              bch_total_amount: response.bch_total_amount,
              btc_total_asset: response.btc_total_asset,
              btc_total_amount: response.btc_total_amount,
              usd_to_btc_total_amount: response.usd_to_btc_total_amount,
              fiat_to_usd_total_amount: response.fiat_to_usd_total_amount,
            },
          },
        });
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *fetchAssetsChange({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          dailyAssetsList: {
            list: [],
          },
        },
      });
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryAssetsChange, payload);
      if (response) {
        yield put({
          type: 'save',
          payload: {
            dailyAssetsList: {
              list: response.customer_asset_change_list,
            },
          },
        });
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *fetchRate({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryRate, payload);
      if (response) {
        yield put({
          type: 'save',
          payload: {
            rateList: {
              list: response.exchangeRates,
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
        type: 'changeLoading',
        payload: false,
      });
    },
    *fetchDailyCurrenyExchangeChange({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryCurrencyExchangeChange, payload);
      if (response) {
        yield put({
          type: 'save',
          payload: {
            currencyExchangeList: {
              list: response.currency_exchange_change_object_list,
            },
          },
        });
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *fetchExchangeTransactionHistory({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryExchangeTransaction, payload);
      if (response) {
        yield put({
          type: 'save',
          payload: {
            transactionList: {
              list: response.exchange_transaction_recode_list,
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
        type: 'changeLoading',
        payload: false,
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
