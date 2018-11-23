import { stringify } from 'qs';
import request from '../utils/request';

export async function queryUserId(params) {
  return request(`/v1/mtm/customer?${stringify(params)}`);
}
export async function queryUserPhoneNumber(params) {
  return request(`/v1/mtm/customer_search?${stringify(params)}`);
}

/*
  修改用户信息
  customer_id: 用户id,
  field_name: 字段名
  value: 值
*/
export async function updateUserInfo(params) {
  return request('/v1/mtm/customer', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}
/*
  以id查找用户的所有广告
  customer_id: 用户id
*/
export async function queryUserAds(params) {
  return request(`/v1/mtm/customer_ads?${stringify(params)}`);
}
/*
  查看日志
  customer_id: 用户id
*/
export async function queryUserLogs(params) {
  return request(`/v1/mtm/customer_logs?${stringify(params)}`);
}
/*
  添加备注
  customer_id: 用户id
  mark: 备注
*/
export async function addMark(params) {
  return request('/v1/mtm/customer_marks', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
/*
  查看备注
  customer_id: 用户id
*/
export async function queryUserMark(params) {
  return request(`/v1/mtm/customer_marks?${stringify(params)}`);
}
/*
  以id查找用户的所有订单
  customer_id: 用户id
  side: buy|sell|all
*/
export async function queryUserOrders(params) {
  return request(`/v1/mtm/customer_orders?${stringify(params)}`);
}
/*
  获取收款账户信息
  customer_id: 用户id
*/
export async function queryUserPaymentInfo(params) {
  return request(`/v1/mtm/customer_payment_info_templates?${stringify(params)}`);
}
/*
  获取信任名单 屏蔽名单
  customer_id: 用户id
*/
export async function queryUserRelationship(params) {
  return request(`/v1/mtm/customer_relationship?${stringify(params)}`);
}
