import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Table, Modal } from 'antd';
import Filter from '../../../../filter';

const columns = [{
  title: '操作时间',
  dataIndex: 'created_at',
  render: val => (<span>{moment.unix(val).format('YYYY-MM-DD HH:mm:ss')}</span>),
  key: 'created_at',
}, {
  title: '修改前',
  dataIndex: 'previous_data',
  key: 'previous_data',
}, {
  title: '修改后',
  dataIndex: 'current_data',
  key: 'current_data',
}, {
  title: '操作人',
  dataIndex: 'operation_user',
  key: 'operation_user',
}, {
  title: '备注',
  dataIndex: 'remark',
  key: 'remark',
}];


@connect(state => ({
  userdetail: state.userdetail,
}))

export default class WithdrawOperationModal extends Component {
  state = {
    confirmLoading: false,
  }

  componentDidMount() {
    const { dispatch, userdetail } = this.props;
    const { id } = userdetail;
    dispatch({
      type: 'userdetail/fetchUserOperationLogs',
      payload: {
        customer_id: id,
        operation_type: 13, // 操作类型(12: 改变用户账户状态, 13: 修改账户提现等级)
        page: 1,
        per_page: 10,
      },
    });
  }

  onPageChange = (pagination) => {
    const { dispatch, userdetail } = this.props;
    const { id } = userdetail;
    dispatch({
      type: 'userdetail/fetchUserOperationLogs',
      payload: {
        customer_id: id,
        operation_type: 13, // 操作类型(12: 改变用户账户状态, 13: 修改账户提现等级)
        page: pagination.current,
        per_page: pagination.pageSize,
      },
    });
  }

  handleOk = () => {
    this.setState({
      ModalText: 'The modal will be closed after two seconds',
      confirmLoading: true,
    });
    setTimeout(() => {
      this.setState({
        confirmLoading: false,
      });
      this.props.handleCancel();
    }, 2000);
  }

  render() {
    const { confirmLoading } = this.state;
    const { visible } = this.props;
    const { operationLoading, operationList } = this.props.userdetail;
    return (
      <Modal
        title="限额与手续费操作日志"
        visible={visible}
        onOk={this.handleOk}
        confirmLoading={confirmLoading}
        onCancel={this.props.handleCancel}
        width={800}
      >
        <Table
          loading={operationLoading}
          columns={columns}
          pagination={operationList.pagination}
          dataSource={operationList.list}
          onChange={this.onPageChange}
        />
      </Modal>
    );
  }
}
