import React, { Component } from 'react';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import { connect } from 'dva';
import moment from 'moment';
import { Button, Menu, Dropdown, Icon, Row, Col, Steps, Card, Popover, Badge, Table, Tooltip, Divider } from 'antd';
import classNames from 'classnames';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import DescriptionList from '../../../components/DescriptionList';
import styles from './OrderDetail.less';
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
        {orderDetail.fiat_currency_code}
      </div>
    </Col>
  </Row>
);

const description = orderDetail => (
  <DescriptionList className={styles.headerList} size="small" col="2">
    <Description term="订单创建时间">{moment(orderDetail.created_at * 1000).format('YYYY-MM-DD HH:mm:ss')}</Description>
    <Description term="卖家手机">{`(+${orderDetail.seller_mobile_code})`} {orderDetail.seller_mobile}</Description>
    <Description term="卖家 Mobi ID">{orderDetail.seller_mobi_id}</Description>
    <Description term="买家手机">{`(+${orderDetail.buyer_mobile_code})`} {orderDetail.buyer_mobile}</Description>
    <Description term="买家 Mobi ID">{orderDetail.buyer_mobi_id}</Description>
    <Description term="金额对应数量">{numberFormat(orderDetail.crypto_amount, getcurrencyBycode(orderDetail.crypto_currency_code).decimal_place)} {codeTocurrencyCode(orderDetail.crypto_currency_code)}</Description>
    <Description term="订单变更时间">{moment(orderDetail.updated_at * 1000).format('YYYY-MM-DD HH:mm:ss')}</Description>
    <Description term="广告类型">{orderDetail.adv_side === 1 ? "买" : "卖"}</Description>
  </DescriptionList>
);

@connect(state => ({
  order: state.order,
}))
export default class OrderProfile extends Component {
  state = {

  }

  componentDidMount() {
  }

  render() {
    const { order } = this.props;
    const { orderDetail } = order;
    const { conversations } = orderDetail;
    return (
      <PageHeaderLayout
        title={`单号：${orderDetail.id}`}
        logo={<img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />}
        content={description(orderDetail)}
        extraContent={extra(orderDetail)}
      >
        <Card title="对话内容">
          <div className={styles.chatWraper}>
            {conversations.map(con => (
              <div className={styles.conversionWraper}>
                <p><span style={{ color: '#000' }}>{con.from_username}</span> &nbsp; {moment(con.created_at * 1000).format('YYYY-MM-DD HH:mm:ss')}</p>
                <p className={styles.conText}>{con.text}</p>
              </div>
            ))}

          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
