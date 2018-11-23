import request from '../utils/request';

export async function queryAllComplaintOrders() {
  return request('/v1/mtm/order_complaint_count');
}

export async function queryAllOrders() {
  return request('/v1/mtm/order_count');
}

export async function queryAllAds() {
  return request('/v1/mtm/ad_count');
}
