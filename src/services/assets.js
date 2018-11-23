import { stringify } from 'qs';
import request from '../utils/request';

export async function queryAllAssets() {
  return request('/v1/dashboard/index');
}
export async function queryFiatAssets() {
  return request('/v1/dashboard/fiat');
}
export async function queryDigitalAssets() {
  return request('/v1/dashboard/digital');
}
export async function queryAssetsChange(params) {
  return request(`/v1/dashboard/asset_change?${stringify(params)}`);
}
export async function queryCurrencyExchangeChange(params) {
  return request(`/v1/dashboard/exchange_flow?${stringify(params)}`);
}
export async function queryRate(params) {
  return request(`/v1/dashboard/rate?${stringify(params)}`);
}
export async function queryExchangeTransaction(params) {
  return request(`/v1/dashboard/exchange_transaction_recode?${stringify(params)}`);
}
