import { stringify } from 'qs';
import request from '../utils/request';

export async function getMerchantId() {
  return request('/business/merchant/uuid');
}
export async function createMerchant(params) {
  return request('/business/merchant', {
    method: 'POST',
    body: params,
  });
}
export async function queryMerchantList(params) {
  return request(`/business/merchants?${stringify(params)}`);
}
export async function queryPlantInfo() {
  return request('/business/platform_info');
}
export async function queryMerchantDetail(params) {
  return request(`/business/merchant?${stringify(params)}`);
}
export async function queryMerchantLog(params) {
  return request(`/business/merchant/log?${stringify(params)}`);
}
export async function queryMerchantOTC(params) {
  return request(`/business/merchant/otc?${stringify(params)}`);
}
export async function updateMerchantOTC(params) {
  return request('/business/merchant/otc', {
    method: 'PATCH',
    body: params,
  });
}
export async function updateStatus(params) {
  return request('/business/merchant', {
    method: 'PATCH',
    body: params,
  });
}
export async function querySetting() {
  return request('/business/setting');
}
export async function updateSetting(params) {
  return request('/business/setting', {
    method: 'PATCH',
    body: params,
  });
}
export async function queryUserTransactionInfo(parmas) {
  return request(`/v1/customer/transactions?${stringify(parmas)}`);
}
export async function queryCustomerRelations(parmas) {
  return request(`/business/merchant/customer_relations?${stringify(parmas)}`);
}
export async function queryPublicMerchants() {
  return request('/business/public_merchants');
}
export async function createCustomer(params) {
  return request('/business/merchant/customer_relation', {
    method: 'POST',
    body: params,
  });
}
export async function deleteCustomer(params) {
  return request('/business/merchant/customer_relation', {
    method: 'DELETE',
    body: params,
  });
}
