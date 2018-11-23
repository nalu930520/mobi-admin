import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Card, Table, Button } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import AddHedgeModal from './AddHedgeModal';

const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
const columns = [
  {
    title: '货币',
    dataIndex: 'currency',
    key: 'currency',
    render: val => <span>{val.toUpperCase()}</span>,
  },
  {
    title: '用户兑换入数量',
    dataIndex: 'conversion_amount',
    key: 'conversion_amount',
    render: val => <span>{ val / 100000000 }</span>,
  },
  {
    title: 'Mobi对冲出数量',
    dataIndex: 'handled_amount',
    key: 'handled_amount',
    render: val => <span>{ val / 100000000 }</span>,
  },
  {
    title: '剩余数量',
    key: 'less',
    render:
     val => <span>{(Number(val.conversion_amount) + Number(val.handled_amount)) / 100000000}</span>,
  },
  {
    title: '操作',
    dataIndex: 'currency',
    key: 'operation',
    render: record => (
      <Link to={`/hedging/hedging-record/${record}`}>查看</Link>
    ),
  },
];

@connect(state => ({
  hedging: state.hedging,
}))
export default class Monitor extends PureComponent {
  state = {
    addHedgeModalVisable: false,
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'hedging/fetchMonitorList',
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

  render() {
    const { loading, monitorList } = this.props.hedging;
    return (
      <PageHeaderLayout title="实时监控">
        <Card bordered={false}>
          <Button type="primary" onClick={() => { this.showModal('addHedgeModalVisable'); }}>添加对冲记录</Button>
          <AddHedgeModal
            visible={this.state.addHedgeModalVisable}
            handleCancel={() => { this.handleCancel('addHedgeModalVisable'); }}
          />
          <br />
          <br />
          <Table
            loading={loading}
            columns={columns}
            dataSource={monitorList.list}
            pagination={monitorList.pagination}
            rowKey="currency"
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
