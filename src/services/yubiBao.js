import { stringify } from 'qs';
import request from '../utils/request';

// 转入转出列表
export async function addTrans(params) {
  return request(`/yub/web/trans?${stringify(params)}`);
}
// 总金额
export async function addSumPool(params) {
  return request(`/yub/web/pool?${stringify(params)}`);
}
// 七日年化
export async function addSevenList(params) {
  return request(`/yub/web/rate/list?${stringify(params)}`);
}
// 币丰堂设置
export async function addBiFengSetting(parmas) {
  return request('/yub/web/daily/setting', {
    method: 'POST',
    body: parmas,
  });
}
// 币丰堂初始化设置
export async function addBiFengInit(params) {
  return request(`/yub/web/daily/setting?${stringify(params)}`);
}

// 每币收益
export async function addIncome(parmas) {
  return request('/yub/web/per/coin', {
    method: 'POST',
    body: parmas,
  });
}

