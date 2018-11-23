import { stringify } from 'qs';
import request from '../utils/request';

export async function addDeposit(parmas) {
  return request('/v1/deposit/detail', {
    method: 'PUT',
    body: parmas,
  });
}

export async function addWidthdraw(parmas) {
  return request('/v1/withdraw/detail', {
    method: 'PUT',
    body: parmas,
  });
}

export async function fetchUserBalance(parmas) {
  return request(`/v1/customer/balance?${stringify(parmas)}`);
}

export async function queryDepositList(parmas) {
  return request(`/v1/deposit/list?${stringify(parmas)}`);
}

export async function queryDepositDetail(parmas) {
  return request(`/v1/deposit/detail?${stringify(parmas)}`);
}

export async function queryWidthdrawList(parmas) {
  return request(`/v1/withdraw/list?${stringify(parmas)}`);
}

export async function queryWidthdrawDetail(parmas) {
  return request(`/v1/withdraw/detail?${stringify(parmas)}`);
}

export async function SubmitVerifyWidthdraw(parmas) {
  return request('/v1/withdraw/detail', {
    method: 'POST',
    body: parmas,
  });
}

export async function refreshStatus(parmas) {
  return request('/v1/withdraw/detail', {
    method: 'PATCH',
    body: {
      ...parmas,
    },
  });
}
