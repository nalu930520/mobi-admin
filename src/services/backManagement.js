import { stringify } from 'qs';
import request from '../utils/request';

export async function queryRolesList(parmas) {
  return request(`/v1/admin_roles?${stringify(parmas)}`);
}
export async function queryUsersList(parmas) {
  return request(`/v1/admin_users?${stringify(parmas)}`);
}
export async function queryRolesUsersList(parmas) {
  return request(`/v1/admin/roles_users?${stringify(parmas)}`);
}
export async function queryAdminRoleDetail(parmas) {
  return request(`/v1/admin_role?${stringify(parmas)}`);
}

export async function getUserPermission() {
  return request('/v1/admin_user');
}

export async function updateUserRolename(parmas) {
  return request('/v1/admin_user', {
    method: 'PATCH',
    body: {
      ...parmas,
    },
  });
}

export async function deleteUser(parmas) {
  return request('/v1/admin_user', {
    method: 'DELETE',
    body: {
      ...parmas,
    },
  });
}

export async function deleteRolesUsers(parmas) {
  return request('/v1/admin/roles_users', {
    method: 'PUT',
    body: {
      ...parmas,
    },
  });
}

export async function queryNoRoleUser() {
  return request('/v1/admin_users/public');
}

export async function createGroup(parmas) {
  return request('/v1/admin_role', {
    method: 'POST',
    body: parmas,
  });
}

export async function editGroup(parmas) {
  return request('/v1/admin/roles_users', {
    method: 'PUT',
    body: {
      ...parmas,
    },
  });
}

export async function addRolesUsers(parmas) {
  return request('/v1/admin/roles_users', {
    method: 'PUT',
    body: {
      ...parmas,
    },
  });
}

export async function deleteRole(parmas) {
  return request('/v1/admin_role', {
    method: 'DELETE',
    body: {
      ...parmas,
    },
  });
}

export async function QueryRoleList(parmas) {
  return request(`/v1/admin_role?${stringify(parmas)}`);
}

export async function updateEditRole(parmas) {
  return request('/v1/admin_role', {
    method: 'PUT',
    body: {
      ...parmas,
    },
  });
}

export async function queryLogList(parmas) {
  return request(`/v1/operation_logs?${stringify(parmas)}`);
}
