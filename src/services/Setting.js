import request from '../utils/request';

export async function getSystemSetting() {
  return request('/v1/mtm/system_setting');
}

export async function updateSetting(parmas) {
  return request('/v1/mtm/system_setting', {
    method: 'PUT',
    body: {
      ...parmas,
    },
  });
}
