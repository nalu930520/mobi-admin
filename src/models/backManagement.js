import { message, Modal } from 'antd';
import store from 'store';
import pathToRegexp from 'path-to-regexp';
import { queryRolesList, queryUsersList, queryRolesUsersList, queryAdminRoleDetail, updateUserRolename, deleteUser, deleteRolesUsers, deleteRole, addRolesUsers, queryNoRoleUser, createGroup, editGroup, queryGroupInfo, QueryRoleList, updateEditRole, queryLogList } from '../services/backManagement.js';

export default {
  namespace: 'backManagement',
  state: {
    rolesList: {
      list: [],
      pagination: {},
    },
    usersList: {
      list: [],
      pagination: {},
    },
    rolesUsersList: {
      list: [],
      pagination: {},
    },
    logList: {
      list: [],
      pagination: {},
    },
    roleDetail: {},
    updateUserLoading: false,
    loading: true,
    usersLoading: true,
    rolesUsersLoading: true,
    rolesLoading: true,
    noRoleUser: [],
    roleList: [],
    roleName: '',
    checkKeys: [],
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname, search }) => {
        if (pathname === '/back-management/auth/addOrEditGroup') {
          dispatch({ type: 'fetchNoRoleUser' });
        }
        const matchAddOrEditRole = pathToRegexp('/back-management/auth/addOrEditRole/:roleName').exec(pathname);
        if (matchAddOrEditRole && matchAddOrEditRole[1]) {
          dispatch({ type: 'fetchRoleList', payload: { rolename: matchAddOrEditRole[1] } });
        }
      });
    },
  },
  effects: {
    *fetchLog({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: {
          loading: true,
        },
      });
      const response = yield call(queryLogList, payload);
      yield put({
        type: 'save',
        payload: {
          logList: {
            list: response.logs,
            pagination: {
              total: response.total,
              pageSize: response.per_page,
              current: response.page,
            },
          },
        },
      });
      yield put({
        type: 'changeLoading',
        payload: {
          loading: false,
        },
      });
    },
    *fetchRolesList({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: {
          rolesLoading: true,
        },
      });
      const response = yield call(queryRolesList, payload);
      if (response) {
        yield put({
          type: 'save',
          payload: {
            rolesList: {
              list: response.roles,
              pagination: {
                total: response.total,
                pageSize: response.per_page,
                current: response.page,
              },
            },
          },
        });
        yield response.roles.forEach((obj) => {
          put({
            type: 'fetchAdminRoleDetail',
            payload: {
              rolename: obj.rolename,
            },
          });
        });
      }

      yield put({
        type: 'changeLoading',
        payload: {
          rolesLoading: false,
        },
      });
    },
    *fetchUsersList({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: {
          usersLoading: true,
        },
      });
      const response = yield call(queryUsersList, payload);
      yield put({
        type: 'save',
        payload: {
          usersList: {
            list: response.users,
            pagination: {
              total: response.total,
              pageSize: response.per_page,
              current: response.page,
            },
          },
        },
      });
      yield put({
        type: 'changeLoading',
        payload: {
          usersLoading: false,
        },
      });
    },
    *fetchRolesUsersList({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: {
          rolesUsersLoading: true,
        },
      });
      const response = yield call(queryRolesUsersList, payload);
      if (response) {
        yield put({
          type: 'save',
          payload: {
            rolesUsersList: {
              list: response.roles_users,
              pagination: {
                total: response.total,
                pageSize: response.per_page,
                current: response.page,
              },
            },
          },
        });
        yield put({
          type: 'changeLoading',
          payload: {
            rolesUsersLoading: false,
          },
        });
      }
    },
    *fetchRoleList({ payload }, { call, put }) {
      const resQueryRoleList = yield call(QueryRoleList, payload);
      const RoleList = resQueryRoleList.permissions;
      const groupByList = RoleList.reduce((groups, item) => {
        const val = item['group_name']
        groups[val] = groups[val] || [];
        groups[val].push(item)
        return groups;
      }, {});
      console.log(groupByList);
      const formatGroup = [];
      for (const key in groupByList) {
        if ({}.hasOwnProperty.call(groupByList, key)) {
          formatGroup.push({
            description: key,
            permission: false,
            children: groupByList[key],
          });
        }
      }
      const newFormatGroup = formatGroup.map((group, outerIndex) => {
        let addKeyChildren = [];
        if (group.children.length) {
          addKeyChildren = group.children.map((child, innIndex) => {
            return {
              ...child,
              title: child.description,
              key: `0-${outerIndex}-${innIndex}`,
            };
          });
        }
        return {
          ...group,
          title: group.description,
          id: `0-${outerIndex}`,
          key: `0-${outerIndex}`,
          children: addKeyChildren,
        };
      });
      const checkKeys = []
      newFormatGroup.forEach((item) => {
        item.children.forEach((child) => {
          if (child.permission) {
            checkKeys.push(child.key);
          }
        });
      });
      yield put({
        type: 'saveRoleList',
        payload: { roleList: newFormatGroup, roleName: payload.rolename, checkKeys } });
    },
    *editRole({ payload }, { call, put }) {
      const resUpdateEditRole = yield call(updateEditRole, payload);
      yield put({ type: 'fetchRoleList', payload: { rolename: payload.rolename } });
      message.success('编辑成功');
    },
    *fetchNoRoleUser({ payload }, { call, put }) {
      const resNoRoleUser = yield call(queryNoRoleUser);
      yield put({ type: 'saveNoRoleUser', payload: resNoRoleUser.users });
    },
    *addOrEditGroup({ payload }, { call, put }) {
      const resCreateGroup = yield call(createGroup, { rolename: payload.roleName });
      if (resCreateGroup.ret === 1) {
        yield call(editGroup, { rolename: payload.roleName, add_users: payload.add_users });
        Modal.success({
          content: '添加成功',
        });
      }
    },
    *fetchAdminRoleDetail({ payload }, { call, put }) {
      const response = yield call(queryAdminRoleDetail, payload);
      if (response) {
        yield put({
          type: 'save',
          payload: {
            roleDetail: response,
          },
        });
      }
    },
    *updateUserRolename({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: { updateUserLoading: true },
      });
      yield put({
        type: 'save',
        payload: { closeModal: false },
      });
      const response = yield call(updateUserRolename, payload);
      if (response === '') {
        yield put({
          type: 'save',
          payload: { closeModal: true },
        });
        message.success('提交成功');
        yield put({
          type: 'fetchUsersList',
          payload: {
            page: 1,
            per_page: 15,
          },
        });
      }
      yield put({
        type: 'changeLoading',
        payload: { updateUserLoading: false },
      });
    },
    *deleteRolesUsers({ payload }, { call, put }) {
      const response = yield call(deleteRolesUsers, payload);
      if (response === '') {
        message.success('删除成功');
        yield put({
          type: 'fetchUsersList',
          payload: {
            page: 1,
            per_page: 15,
          },
        });
      }
    },
    *deleteUser({ payload }, { call, put }) {
      const response = yield call(deleteUser, payload);
      if (response === '') {
        message.success('删除成功');
        yield put({
          type: 'fetchUsersList',
          payload: {
            page: 1,
            per_page: 15,
          },
        });
      }
    },
    *addRolesUsers({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: { updateUserLoading: true },
      });
      yield put({
        type: 'save',
        payload: { closeModal: false },
      });
      const response = yield call(addRolesUsers, payload);
      if (response === '') {
        yield put({
          type: 'save',
          payload: { closeModal: true },
        });
        store.set('rolename', payload.rolename);
        message.success('修改成功');
        yield put({
          type: 'fetchRolesUsersList',
          payload: {
            page: 1,
            per_page: 15,
          },
        });
      }
      yield put({
        type: 'changeLoading',
        payload: { updateUserLoading: false },
      });
    },
    *deleteRole({ payload }, { call, put }) {
      const response = yield call(deleteRole, payload);
      if (response === '') {
        message.success('删除成功');
        yield put({
          type: 'fetchRolesUsersList',
          payload: {
            page: 1,
            per_page: 15,
          },
        });
      }
    },
  },
  reducers: {
    saveRoleList(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    saveNoRoleUser(state, action) {
      return {
        ...state,
        noRoleUser: action.payload,
      };
    },
    saveDetail(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
