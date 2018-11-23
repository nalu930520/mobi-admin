import { stringify } from 'qs';
import request from '../utils/request';

export async function queryAllTransaction(parmas) {
  return request(`/v1/transaction?${stringify(parmas)}`);
}

export async function queryOnchainTransaction(parmas) {
  return request(`/v1/transaction/onchain?${stringify(parmas)}`);
}

export async function queryMobiTransaction(parmas) {
  return request(`/v1/transaction/mobi?${stringify(parmas)}`);
}

export async function queryChangeTransaction(parmas) {
  return request(`/v1/transaction/exchange?${stringify(parmas)}`);
}

export async function queryOnchainTransactionDetail(parmas) {
  return request(`/v1/transaction/onchain_detail?${stringify(parmas)}`);
}

export async function queryChangeTransactionDetail(parmas) {
  return request(`/v1/transaction/exchange_detail?${stringify(parmas)}`);
}

export async function queryMobiTransactionDetail(parmas) {
  return request(`/v1/transaction/mobi_detail?${stringify(parmas)}`);
}
