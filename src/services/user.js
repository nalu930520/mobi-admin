import request from '../utils/request';

export async function query() {
  return request('/v1/mtm/users');
}

export async function queryCurrent() {
  return request('/v1/mtm/currentUser');
}
