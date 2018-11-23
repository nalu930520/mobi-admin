import { stringify } from 'qs';
import request from '../utils/request';

export async function queryOrders(parmas) {
  return request(`/v1/mtm/orders?${stringify(parmas)}`);
}

export async function queryOrderDetail(parmas) {
  return request(`/v1/mtm/order?${stringify(parmas)}`);
}
