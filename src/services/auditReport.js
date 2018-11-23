import { stringify } from 'qs';
import request from '../utils/request';

export async function queryAuditlList(params) {
  return request(`/v1/assets?${stringify(params)}`);
}
export async function queryAuditLiability(params) {
  return request(`/v1/liability?${stringify(params)}`);
}
