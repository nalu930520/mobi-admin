import { stringify } from 'qs';
import request from '../utils/request';

export async function queryFinancialList(params) {
  return request(`/v1/financial/fiat/exchange?${stringify(params)}`, {
  });
}
export async function queryFinancialBTCList(params) {
  return request(`/v1/financial/digital/exchange?${stringify(params)}`, {
  });
}
export async function queryFinancialNetList(params) {
  return request(`/v1/financial/network/fee?${stringify(params)}`, {
  });
}
