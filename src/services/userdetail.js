import { stringify } from 'qs';
import request from '../utils/request';

export async function queryUserInfo(parmas) {
  return request(`/v1/customer?${stringify(parmas)}`);
}
export async function queryUserAssets(parmas) {
  return request(`/v1/customer_asset?${stringify(parmas)}`);
}
export async function queryUserWithdrawInfo(parmas) {
  return request(`/v1/customer/withdraw_info?${stringify(parmas)}`);
}
export async function queryUserTransactionInfo(parmas) {
  return request(`/v1/customer/transactions?${stringify(parmas)}`);
}
export async function updateUserAccountStatus(parmas) {
  return request('/v1/customer', {
    method: 'PATCH',
    body: {
      ...parmas,
    },
  });
}
export async function updateUserWithdrawLevel(parmas) {
  return request('/v1/customer/vip_config', {
    method: 'PATCH',
    body: {
      ...parmas,
    },
  });
}
export async function queryOperationLogs(parmas) {
  return request(`/v1/customer/operation_logs?${stringify(parmas)}`);
}
export async function queryVipConfigs(parmas) {
  return request(`/v1/customer/vip_configs?${stringify(parmas)}`);
}
