import { stringify } from 'qs';
import request from '../utils/request';

export async function queryComplaints(params) {
  return request(`/v1/mtm/order_complaints?${stringify(params)}`);
}
export async function queryComplaintDetail(params) {
  return request(`/v1/mtm/order_complaint?${stringify(params)}`);
}
export async function uploadImg(params) {
  console.log(params);
  return request('/v1/mtm/order_complaint', {
    method: 'POST',
    body: params,
  });
}
export async function updateComplaintOrder(params) {
  return request('/v1/mtm/order_complaint', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function updateHandlingComplaintOrder(parmas) {
  return request('/v1/mtm/order_complaint', {
    method: 'PATCH',
    body: {
      ...parmas,
    },
  });
}
