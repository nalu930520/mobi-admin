import { stringify } from 'qs';
import request from '../utils/request';

export async function queryAdvertising(parmas) {
  return request(`/v1/mtm/ads?${stringify(parmas)}`);
}

export async function queryAdvertisingDetail(parmas) {
  return request(`/v1/mtm/ad?${stringify(parmas)}`);
}

export async function cancelAdvertising(parmas) {
  return request('/v1/mtm/ad', {
    method: 'PUT',
    body: {
      ...parmas,
    },
  });
}
