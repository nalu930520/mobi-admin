import { queryUserPermission } from '../services/api';
import { getMenuData } from '../common/menu';

const flatten = arr => arr.reduce(
  (acc, val) => acc.concat(val.children ? flatten(val.children) : val), []
);

export default {
  namespace: 'workplace',
  state: {
    name: '',
    rolename: '',
    dashboardPermession: [],
  },

  effects: {
    *getUserPermission({}, { call, put }) {
      const resUserPermission = yield call(queryUserPermission);
      const { permissions, username, rolename } = resUserPermission;
      const userHavePermission = permissions.filter(data => data.permission === true);
      const dashboardPermession = getMenuData(userHavePermission);
      console.log('dashboardPermession', dashboardPermession);
      const newList = [];
      dashboardPermession.forEach((element) => {
        const { children } = element;
        const newChildren = flatten(children);
        const filterNoauth = newChildren.filter(data => data.authority === true);
        newList.push({
          name: element.name,
          children: filterNoauth,
        });
      });
      const filterNoAuth = [];
      newList.forEach((element) => {
        const haveTrue = element.children.find(data => data.authority);
        if (haveTrue) {
          filterNoAuth.push(element);
        }
      });
      filterNoAuth.forEach((element) => {
        element.children.filter((data) => {
          return data.authority === true;
        });
      });
      yield put({ type: 'save', payload: { username, rolename, dashboardPermession: filterNoAuth } });
    },
  },
  subscriptions: {
    setup({ dispatch }) {
      dispatch({ type: 'getUserPermission' });
    },
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
    changeExpandedLoading(state, action) {
      return {
        ...state,
        expandedLoading: action.payload,
      };
    },
  },
};
