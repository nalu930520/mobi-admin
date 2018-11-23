import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Table, Modal, Popover, Button } from 'antd';

const columns = [{
  title: '操作时间',
  dataIndex: 'created_at',
  render: val => (<span>{moment.unix(val).format('YYYY-MM-DD HH:mm:ss')}</span>),
  key: 'created_at',
}, {
  title: '操作模块',
  dataIndex: 'operation',
  key: 'operation',
}, {
  title: '修改内容',
  render: record => (
    <Popover content={record.description}>
      <Button type="primary">查看详情</Button>
    </Popover>
  ),
  key: 'current_data',
}, {
  title: '操作人',
  dataIndex: 'operator_username',
  key: 'operator_username',
}];

@connect(state => ({
  bussinessDetail: state.bussinessDetail,
}))

export default class BussinessOperationModal extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    const { userInfo } = this.props.bussinessDetail;
    dispatch({
      type: 'bussinessDetail/fetchMerchantLog',
      payload: {
        merchant_id: userInfo.merchant_id,
        page: 1,
        per_page: 10,
      },
    });
  }

  onPageChange = (pagination) => {
    const { dispatch } = this.props;
    const { userInfo } = this.props.bussinessDetail;
    dispatch({
      type: 'bussinessDetail/fetchMerchantLog',
      payload: {
        merchant_id: userInfo.merchant_id,
        page: pagination.current,
        per_page: pagination.pageSize,
      },
    });
  }

  render() {
    const { visible } = this.props;
    const { loading, logs } = this.props.bussinessDetail;
    return (
      <Modal
        title="账户操作日志"
        visible={visible}
        onOk={this.props.handleCancel}
        onCancel={this.props.handleCancel}
        width={800}
      >
        <Table
          loading={loading.loading}
          columns={columns}
          pagination={logs.pagination}
          dataSource={logs.list}
          onChange={this.onPageChange}
        />
      </Modal>
    );
  }
}
