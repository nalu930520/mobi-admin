import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Table, Radio, Card, Row, Col } from 'antd';
import StandardTable from '../../../../components/StandardTable';
import styles from './index.less';
import { columns1, columns2, columns3, columns31, columns4, columns41 } from '../../../../common/columns.js';
import { numberFormat, getcurrencyBycode, codeTocurrencyCode } from '../../../../utils/utils';

const operationTabList = [{
  key: 'tab1',
  tab: '订单记录',
}, {
  key: 'tab2',
  tab: '挂单记录',
}, {
  key: 'tab3',
  tab: '我屏蔽的人',
}, {
  key: 'tab4',
  tab: '屏蔽我的人',
}, {
  key: 'tab5',
  tab: '我信任的人',
}, {
  key: 'tab6',
  tab: '信任我的人',
}];

const infoColumns1 = [{
  title: '币种',
  render: record => (
    <span>
      {codeTocurrencyCode(record.currency_code)}
    </span>
  ),
}, {
  title: '可用',
  render: record => (
    <span>
      {numberFormat(record.trade_available_volume,
      getcurrencyBycode(record.currency_code).decimal_place)} {codeTocurrencyCode(record.currency_code)}
    </span>
  ),
}, {
  title: '托管',
  render: record => (
    <span>
      {numberFormat(record.trade_frozen_volume,
      getcurrencyBycode(record.currency_code).decimal_place)} {codeTocurrencyCode(record.currency_code)}
    </span>
  ),
}];
const infoColumns2 = [{
  title: '币种',
  render: record => (
    <span>
      {codeTocurrencyCode(record.currency_code)}
    </span>
  ),
}, {
  title: '交易量',
  render: record => (
    <span>
      {numberFormat(record.trade_volume,
      getcurrencyBycode(record.currency_code).decimal_place)} {codeTocurrencyCode(record.currency_code)}
    </span>
  ),
}];
const infoColumns3 = [{
  title: '币种',
  render: record => (
    <span>
      {codeTocurrencyCode(record.currency_code)}
    </span>
  ),
}, {
  title: '交易次数',
  dataIndex: 'transfer_count',
}];


@connect(state => ({
  customer: state.customer,
}))
@Form.create()
export default class UserInfo extends Component {
  state = {
    operationkey: 'tab1',
    orderSide: 'buy',
    selectedRows: [],
  }

  componentDidMount() {
    const { dispatch, customer } = this.props;
    dispatch({
      type: 'customer/fetchDetail',
      payload: { id: customer.id },
    });
    dispatch({
      type: 'customer/fetchOrders',
      payload: {
        side: 'buy',
        customer_id: customer.id,
        page: 1,
        per_page: 10,
      },
    });
    dispatch({
      type: 'customer/fetchPaymentInfo',
      payload: {
        customer_id: customer.id,
      },
    });
    dispatch({
      type: 'customer/fetchMark',
      payload: {
        customer_id: customer.id,
      },
    });
    dispatch({
      type: 'customer/fetchUserLogs',
      payload: {
        customer_id: customer.id,
      },
    });
  }

  onOperationTabChange = (key) => {
    const { dispatch, customer } = this.props;
    const { detail } = customer;
    const params = {
      page: 1,
      per_page: 10,
    };
    switch (key) {
      case 'tab1':
        dispatch({
          type: 'customer/fetchOrders',
          payload: {
            side: 'buy',
            customer_id: detail.id,
            ...params,
          },
        });
        break;
      case 'tab2':
        dispatch({
          type: 'customer/fetchUserAds',
          payload: {
            customer_id: detail.id,
            page: 1,
            per_page: 10,
          },
        });
        break;
      case 'tab3':
        dispatch({
          type: 'customer/fetchRelationship',
          payload: {
            customer_id: detail.id,
            query_type: 1,
            ...params,
          },
        });
        break;
      case 'tab4':
        dispatch({
          type: 'customer/fetchRelationship',
          payload: {
            customer_id: detail.id,
            query_type: 2,
            ...params,
          },
        });
        break;
      case 'tab5':
        dispatch({
          type: 'customer/fetchRelationship',
          payload: {
            customer_id: detail.id,
            query_type: 3,
            ...params,
          },
        });
        break;
      case 'tab6':
        dispatch({
          type: 'customer/fetchRelationship',
          payload: {
            customer_id: detail.id,
            query_type: 4,
            ...params,
          },
        });
        break;
      default:
        break;
    }
    this.setState({ operationkey: key });
  }

  handleSideChange = (e) => {
    const orderSide = e.target.value;
    const { dispatch, customer } = this.props;
    const { detail } = customer;
    dispatch({
      type: 'customer/fetchOrders',
      payload: {
        side: orderSide,
        customer_id: detail.id,
        page: 1,
        per_page: 10,
      },
    });
    this.setState({ orderSide });
  }

  handleSelectRows = (rows) => {
    this.setState({
      selectedRows: rows,
    });
  }

  handleStandardTableChange1 = (pagination) => {
    const { dispatch, customer } = this.props;
    const { detail } = customer;
    const { orderSide } = this.state;

    const params = {
      page: pagination.current,
      per_page: pagination.pageSize,
      customer_id: detail.id,
      side: orderSide,
    };

    dispatch({
      type: 'customer/fetchOrders',
      payload: params,
    });
  }
  handleStandardTableChange2 = (pagination) => {
    const { dispatch, customer } = this.props;
    const { detail } = customer;

    const params = {
      page: pagination.current,
      per_page: pagination.pageSize,
      customer_id: detail.id,
    };

    dispatch({
      type: 'customer/fetchUserAds',
      payload: params,
    });
  }
  handleTbleChange = (queryType, pagination) => {
    const { dispatch, customer } = this.props;
    const { detail } = customer;

    const params = {
      page: pagination.current,
      per_page: pagination.pageSize,
      customer_id: detail.id,
      query_type: parseInt(queryType, 10),
    };

    dispatch({
      type: 'customer/fetchRelationship',
      payload: params,
    });
  }
  render() {
    const { customer } = this.props;
    const { advancedLoading, ordersList, adsList, blockedList0,
      blockedList1, trustList0, trustList1, detail } = customer;
    const { orderSide, selectedRows } = this.state;

    const contentList = {
      tab1: <div className={styles.orderList}>
        <Radio.Group
          onChange={this.handleSideChange}
          value={orderSide}
          style={{ marginBottom: 10 }}
        >
          <Radio.Button value="buy">买</Radio.Button>
          <Radio.Button value="sell">卖</Radio.Button>
        </Radio.Group>
        <Table
          loading={advancedLoading}
          columns={columns1}
          dataSource={ordersList.list}
          pagination={ordersList.pagination}
          onChange={this.handleStandardTableChange1}
        />
      </div>,
      tab2: <Table
        loading={advancedLoading}
        columns={columns2}
        dataSource={adsList.list}
        onChange={this.handleStandardTableChange2}
      />,
      tab3: <Table
        loading={advancedLoading}
        columns={columns3}
        dataSource={blockedList0.list}
        pagination={blockedList0.pagination}
        onChange={(pagination) => {
          this.handleTbleChange('1', pagination);
        }}
      />,
      tab4: <Table
        loading={advancedLoading}
        dataSource={blockedList1.list}
        pagination={blockedList0.pagination}
        columns={columns31}
        onChange={(pagination) => {
          this.handleTbleChange('2', pagination);
        }}
      />,
      tab5: <Table
        loading={advancedLoading}
        dataSource={trustList0.list}
        pagination={trustList0.pagination}
        columns={columns4}
        onChange={(pagination) => {
          this.handleTbleChange('3', pagination);
        }}
      />,
      tab6: <Table
        loading={advancedLoading}
        dataSource={trustList1.list}
        pagination={trustList1.pagination}
        columns={columns41}
        onChange={(pagination) => {
          this.handleTbleChange('4', pagination);
        }}
      />,
    };
    return (
      <div>
        <Card title="资产交易信息" style={{ marginBottom: 24 }} bordered={false}>
          <Row gutter={24}>
            <Col span={10}>
              <h3>资金：</h3>
              <Table
                bordered
                dataSource={detail.extras_info}
                columns={infoColumns1}
                pagination={false}
              />
            </Col>
            <Col span={7}>
              <h3>交易量：</h3>
              <Table
                bordered
                dataSource={detail.trades_info}
                columns={infoColumns2}
                pagination={false}
              />
            </Col>
            <Col span={7}>
              <h3>交易次数：</h3>
              <Table
                bordered
                dataSource={detail.trades_info}
                columns={infoColumns3}
                pagination={false}
              />
            </Col>
          </Row>
        </Card>
        <Card
          className={styles.tabsCard}
          bordered={false}
          tabList={operationTabList}
          onTabChange={this.onOperationTabChange}
        >
          {contentList[this.state.operationkey]}
        </Card>
      </div>
    );
  }
}
