import { stringify } from 'qs';
import request from '../utils/request';

export async function queryHedgePlatform(parmas) {
  return request(`/v1/hedge/hedge_platform?${stringify(parmas)}`);
}

export async function addHedgePlatform(parmas) {
  return request('/v1/hedge/hedge_platform', {
    method: 'POST',
    body: parmas,
  });
}

export async function editHedgePlatform(parmas) {
  return request('/v1/hedge/hedge_platform', {
    method: 'PUT',
    body: {
      ...parmas,
    },
  });
}

export async function queryBPI() {
  return request('/v1/hedge/bpi_discount');
}

export async function editBPI(parmas) {
  return request('/v1/hedge/bpi_discount', {
    method: 'PUT',
    body: {
      ...parmas,
    },
  });
}

export async function queryBPILog(parmas) {
  return request(`/v1/hedge/bpi_discount_log?${stringify(parmas)}`);
}

export async function queryMonitorList(params) {
  return request(`/v1/hedge/hedge_monitor?${stringify(params)}`);
}

export async function queryHedgeDetail(params) {
  return request(`/v1/hedge/hedge_monitor_detail?${stringify(params)}`);
}

export async function queryHedgeRate(params) {
  return request(`/v1/hedge/hedge_rate?${stringify(params)}`);
}

export async function addHedgeRecords(params) {
  return request('/v1/hedge/hedge_records', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function addLabelNote(params) {
  return request('/v1/hedge/hedge_records', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function queryHedgeRecords(params) {
  return request(`/v1/hedge/hedge_records?${stringify(params)}`);
}

export async function queryOperationUser() {
  return request('/v1/hedge/operation_user');
}
