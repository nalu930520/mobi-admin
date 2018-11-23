import { stringify } from 'qs';
import request from '../utils/request';

// 已归档列表
export async function YiListServer(parmas) {
  return request(`/kyc/record?${stringify(parmas)}`, {
    method: 'POST',
    body: parmas,
  });
}
// 审核人
export async function auditorIdServer(parmas) {
  return request(`/kyc/auditor?${stringify(parmas)}`);
}
// 详细信息
export async function myDetailServer(parmas) {
  let DetailId = parmas.id
  delete parmas.id
  return request(`/kyc/${DetailId}?${stringify(parmas)}`);
}

// 添加备注
export async function addMemoServer(parmas) {
  let DetailId = parmas.id
  delete parmas.id
  return request(`/kyc/${DetailId}?${stringify(parmas)}`, {
    method: 'PUT',
    body: parmas,
  })
}

