import React, { Component } from 'react';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import { connect } from 'dva';
import moment from 'moment';
import { Button, Menu, Dropdown, Icon, Row, Col, Steps, Card, Popover, Badge, Table, Tooltip, Divider } from 'antd';
import classNames from 'classnames';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import DescriptionList from '../../../components/DescriptionList';
import styles from './AllTransactionDetail.less';
import Filter from '../../../filter';
import { numberFormat, getcurrencyBycode, codeTocurrencyCode } from '../../../utils/utils';

const { Step } = Steps;
const { Description } = DescriptionList;
const ButtonGroup = Button.Group;

const extra = orderDetail => (
  <Row>
    <Col xs={24} sm={8}>
      <div className={styles.textSecondary}>订单状态</div>
      <div className={styles.heading}><Filter value={orderDetail.status} keyname="orderStatus" /></div>
    </Col>
    <Col xs={24} sm={8}>
      <div className={styles.textSecondary}>订单金额</div>
      <div className={styles.heading}>
        {numberFormat(orderDetail.fiat_amount, getcurrencyBycode(orderDetail.fiat_currency_code).decimal_place)}
        &nbsp;
        {codeTocurrencyCode(orderDetail.fiat_currency_code)}
      </div>
    </Col>
  </Row>
);

const description = detail => (
  <div>
    <DescriptionList title="交易通用信息" className={styles.headerList} size="large" col="3">
      <Description term="创建时间">{detail.created_at ? moment(detail.created_at * 1000).format('YYYY-MM-DD HH:mm:ss') : '-'}</Description>
      <Description term="接收时间">{detail.received_at ? moment(detail.received_at * 1000).format('YYYY-MM-DD HH:mm:ss') : '-'}</Description>
      <Description term="取消时间">{detail.cancel_at ? moment(detail.cancel_at * 1000).format('YYYY-MM-DD HH:mm:ss') : '-'}</Description>
    </DescriptionList>
    <br />
    <DescriptionList className={styles.headerList} size="large" col="1">
      <Description term="完成时间">{detail.completed_at ? moment(detail.completed_at * 1000).format('YYYY-MM-DD HH:mm:ss') : '-'}</Description>
    </DescriptionList>
    <br />
    <DescriptionList className={styles.headerList} size="large" col="3">
      <Description term="交易类型">{detail.type}</Description>
      <Description term="交易状态">{detail.status}</Description>
      <Description term="交易货币">{codeTocurrencyCode(detail.currency_code)}</Description>
    </DescriptionList>
    <br />
    <DescriptionList className={styles.headerList} size="large" col="3">
      <Description term="交易金额">
        {numberFormat(detail.amount, getcurrencyBycode(detail.currency_code).decimal_place)}&nbsp;{codeTocurrencyCode(detail.currency_code)}
      </Description>
      <Description term="手续费">
        {numberFormat(detail.fee, getcurrencyBycode(detail.currency_code).decimal_place)}&nbsp;{codeTocurrencyCode(detail.currency_code)}
      </Description>
      <Description term="额外手续费">
        {numberFormat(detail.extra_fee, getcurrencyBycode(detail.currency_code).decimal_place)}&nbsp;{codeTocurrencyCode(detail.currency_code)}
      </Description>
    </DescriptionList>
  </div>
);

@connect(state => ({
  transaction: state.transaction,
}))
export default class CommonTransaction extends Component {
  state = {

  }

  componentDidMount() {

  }

  render() {
    const { transaction_detail } = this.props.commonDetail;
    console.log(transaction_detail)
    return (
      <PageHeaderLayout
        title={`单号：${transaction_detail.sn}`}
        logo={<img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />}
        content={description(transaction_detail)}
      >
        <Card title="交易收款人/付款人信息">
          <DescriptionList title="" className={styles.headerList} size="large" col="1">
            <Description term="发起人">{transaction_detail.creator_customer.mobileCode} {transaction_detail.creator_customer.mobile}</Description>
          </DescriptionList>
          <br />
          <DescriptionList title="" className={styles.headerList} size="large" col="3">
            <Description term="付款人">{transaction_detail.payer_customer.mobileCode} {transaction_detail.payer_customer.mobile}</Description>
            <Description term="付款人地址">{transaction_detail.payer_customer.address || '-'}</Description>
            <Description term="付款后余额">
              {transaction_detail.payerRemainBalanceCurrencyCode ? `${numberFormat(transaction_detail.payerRemainBalance, getcurrencyBycode(transaction_detail.payerRemainBalanceCurrencyCode).decimal_place)} 
              ${codeTocurrencyCode(transaction_detail.payerRemainBalanceCurrencyCode)}` : '-'}
            </Description>
          </DescriptionList>
          <br />
          <DescriptionList title="" className={styles.headerList} size="large" col="3">
            <Description term="收款人">{transaction_detail.payee_customer.mobileCode} {transaction_detail.payee_customer.mobile}</Description>
            <Description term="收款人地址">{transaction_detail.payee_customer.address}</Description>
            <Description term="收款后余额">
              {transaction_detail.payeeRemainBalanceCurrencyCode ? `${numberFormat(transaction_detail.payeeRemainBalance, getcurrencyBycode(transaction_detail.payeeRemainBalanceCurrencyCode).decimal_place)} 
              ${codeTocurrencyCode(transaction_detail.payeeRemainBalanceCurrencyCode)}` : '-'}
            </Description>
          </DescriptionList>
        </Card>
        {this.props.children}
      </PageHeaderLayout>

    );
  }
}
