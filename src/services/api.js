import { stringify } from 'qs';
import request from '../utils/request';

export async function queryProjectNotice() {
  return request('/v1/mtm/project/notice');
}

export async function queryActivities() {
  return request('/v1/mtm/activities');
}

export async function queryRule(params) {
  return request(`/v1/mtm/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/v1/mtm/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/v1/mtm/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/v1/mtm/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/v1/mtm/fake_chart_data');
}

export async function queryTags() {
  return request('/v1/mtm/tags');
}

export async function queryBasicProfile() {
  return request('/v1/mtm/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/v1/mtm/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/v1/mtm/fake_list?${stringify(params)}`);
}

export async function fakeAccountLogin(params) {
  return request('/v1/mtm/login/account', {
    method: 'POST',
    body: params,
  });
}

export async function fakeRegister(params) {
  return request('/v1/mtm/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/v1/mtm/notices');
}

export async function fetchOauthUrl(parmas) {
  return request(`/v1/oauth/authorize?${stringify(parmas)}`);
}

export async function fetchToken(parmas) {
  return request('/v1/oauth/authorize', {
    method: 'POST',
    body: parmas,
  });
}

export async function queryUserPermission() {
  return request('/v1/admin_user');
}
