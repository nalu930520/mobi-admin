import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import { Row, Col, Card, List, Avatar, Table, Popconfirm, Input } from 'antd';
import EditUserRolenameModal from './EditUserRolenameModal';
import EditRolenameModal from './EditRolenameModal';

const operationTabList = [{
  key: 'tab1',
  tab: '后台用户',
}, {
  key: 'tab2',
  tab: '角色群组',
}, {
  key: 'tab3',
  tab: '群组权限',
}];

class RolesList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      operationkey: 'tab1',
      userVisible: false,
      userInfo: {},
      roleVisible: false,
      roleInfo: {},
    };
    this.columns = [{
      title: '邮箱',
      dataIndex: 'email',
      width: '25%',
      key: 'email',
    }, {
      title: '昵称',
      dataIndex: 'username',
      width: '15%',
      key: 'username',
    }, {
      title: '所属群组',
      dataIndex: 'rolename',
      width: '40%',
      key: 'rolename',
    }, {
      title: '操作',
      key: 'operation',
      render: val => (
        <div>
          <a onClick={() => { this.showModal('userVisible'); this.setState({ userInfo: val }); }}>编辑</a>
          &nbsp;
          <a onClick={() => { this.deleteUser(val); }}>删除</a>
        </div>
      ),
    }];
    this.columns2 = [
      {
        title: '角色群组',
        dataIndex: 'rolename',
        key: 'rolename',
      },
      {
        title: '成员',
        dataIndex: 'users',
        render: users => (<span>{users.map(user => <span key={user.username}>{user.username}{', '}</span>).slice(0, 4)}{users.length > 5 && '等人' }</span>),
        key: 'users',
      },
      {
        title: '操作',
        key: 'operation',
        render: val => (
          <div>
            <a onClick={() => { this.showModal('roleVisible'); this.setState({ roleInfo: val }); }}>编辑</a>
            &nbsp;
            <a onClick={() => { this.deleteRole(val); }} disabled={val.users.length > 0}>删除</a>
          </div>),
      },
    ];
    this.columns3 = [
      {
        title: '角色群组',
        dataIndex: 'rolename',
        key: 'rolename',
      },
      {
        title: '操作',
        key: 'operation',
        render: (val) => {
          const { dispatch } = this.props
          return (
            <div>
              <a onClick={() => { dispatch(routerRedux.push(`/back-management/auth/addOrEditRole/${val.rolename}`)); }}>编辑</a>
            </div>
          )
        },
      },
    ];
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'backManagement/fetchUsersList',
      payload: {
        page: 1,
        per_page: 15,
      },
    });
    dispatch({
      type: 'backManagement/fetchRolesList',
      payload: {
        page: 1,
        per_page: 15,
      },
    });
  }

  onOperationTabChange = (key) => {
    this.setState({ operationkey: key });
    const { dispatch } = this.props;
    switch (key) {
      case 'tab1':
        dispatch({
          type: 'backManagement/fetchUsersList',
          payload: {
            page: 1,
            per_page: 15,
          },
        });
        dispatch({
          type: 'backManagement/fetchRolesList',
          payload: {
            page: 1,
            per_page: 15,
          },
        });
        break;
      case 'tab2':
        dispatch({
          type: 'backManagement/fetchRolesUsersList',
          payload: {
            page: 1,
            per_page: 15,
          },
        });
        break;
      case 'tab3':
        dispatch({
          type: 'backManagement/fetchRolesList',
          payload: {
            // page: 1,
            // per_page: 15,
          },
        });
        break;
      default:
        break;
    }
  }

  deleteUser = (user) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'backManagement/deleteUser',
      payload: {
        user_id: user.id,
      },
    });
  }

  deleteRole = (val) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'backManagement/deleteRole',
      payload: {
        rolename: val.rolename,
      },
    });
  }

  showModal = (type) => {
    this.setState({
      [type]: true,
    });
  }

  handleCancel = (type) => {
    this.setState({
      [type]: false,
    });
  }

  tableOnchange = (pagination, effectsName) => {
    const { dispatch } = this.props;

    const params = {
      page: pagination.current,
      per_page: pagination.pageSize,
    };

    dispatch({
      type: `backManagement/${effectsName}`,
      payload: params,
    });
  }

  render() {
    const { rolesList, usersList, rolesUsersList,
      rolesUsersLoading, rolesLoading, usersLoading } = this.props.backManagement;
    const { userVisible, userInfo, roleVisible, roleInfo } = this.state;

    const contentList = {
      tab1: <Table
        dataSource={usersList.list}
        columns={this.columns}
        pagination={usersList.pagination}
        onChange={(pagination) => {
          this.tableOnchange(pagination, 'fetchUsersList');
        }}
        rowKey="email"
        loading={usersLoading}
      />,
      tab2: <Table
        dataSource={rolesUsersList.list}
        columns={this.columns2}
        pagination={rolesUsersList.pagination}
        onChange={(pagination) => {
          this.tableOnchange(pagination, 'fetchRolesUsersList');
        }}
        rowKey="rolename"
        loading={rolesUsersLoading}
      />,
      tab3: <Table
        dataSource={rolesList.list}
        columns={this.columns3}
        pagination={false}
        onChange={(pagination) => {
          this.tableOnchange(pagination, 'fetchRolesList');
        }}
        rowKey="rolename"
        loading={rolesLoading}
      />,
    };
    return (

      <Card
        bordered={false}
        tabList={operationTabList}
        onTabChange={this.onOperationTabChange}
      >
        {contentList[this.state.operationkey]}
        {userVisible && <EditUserRolenameModal
          visible={userVisible}
          userInfo={userInfo}
          handleCancel={() => { this.handleCancel('userVisible'); }}
        />}
        {roleVisible && <EditRolenameModal
          visible={roleVisible}
          roleInfo={roleInfo}
          handleCancel={() => { this.handleCancel('roleVisible'); }}
        />}
      </Card>
    );
  }
}

export default connect(state => ({
  backManagement: state.backManagement,
}))(RolesList);
