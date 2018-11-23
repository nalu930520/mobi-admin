import { stringify } from 'qs';
import request from '../utils/request';

export async function queryPlatformInfo() {
  return request('/v1/customer/platform_info');
}
export async function queryUserList(params) {
  return request(`/v1/customers_search?${stringify(params)}`);
}
export async function queryUserAddress(params) {
  return request(`/v1/customer_address?${stringify(params)}`);
}
