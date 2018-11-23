import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import moment from 'moment';
import { Card, Table } from 'antd';
import { numberFormat, getcurrencyBycode } from '../../../utils/utils';

const columns = [{
  title: '货币配对',
  dataIndex: 'symbol',
  render: val => val.toUpperCase(),
  key: 'symbol',
}, {
  title: '正向汇率',
  dataIndex: 'rate',
  key: 'rate',
}, {
  title: '逆向汇率',
  dataIndex: 'inverse_rate',
  key: 'inverse_rate',
}, {
  title: '更新时间',
  dataIndex: 'updated_at',
  render: val => (<span>{moment.unix(val).format('YYYY-MM-DD HH:mm:ss')}</span>),
  key: 'updated_at',
}];

class RateView extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'assets/fetchRate',
      payload: {
        page: 1,
        per_page: 15,
      },
    });
  }

  onPageChange = (pagination) => {
    console.log('pagination:', pagination);
    const { dispatch } = this.props;
    dispatch({
      type: 'assets/fetchRate',
      payload: {
        page: pagination.current,
        per_page: pagination.pageSize,
      },
    });
  }

  render() {
    const { rateList, loading } = this.props.assets;
    return (
      <Card>
        <Table
          loading={loading}
          columns={columns}
          dataSource={rateList.list}
          pagination={rateList.pagination}
          rowKey="symbol"
          onChange={this.onPageChange}
        />
      </Card>
    );
  }
}

export default connect(state => ({
  assets: state.assets,
}))(RateView);
