import React, { Component } from 'react';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import { connect } from 'dva';
import moment from 'moment';
import { Button, Menu, Dropdown, Icon, Row, Col, Steps, Card, Popover, Badge, Table, Tooltip, Divider } from 'antd';
import classNames from 'classnames';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import DescriptionList from '../../../components/DescriptionList';
import styles from './ChangeTransactionDetail.less';
import Filter from '../../../filter';
import { numberFormat, getcurrencyBycode, codeTocurrencyCode } from '../../../utils/utils';
import CommonTransaction from '../AllTransaction/AllTransactionDetail.js';

const { Description } = DescriptionList;

@connect(state => ({
  transaction: state.transaction,
}))
export default class ChangeTransaction extends Component {
  state = {

  }
  render() {
    const { transactionDetail } = this.props.transaction;
    const { transaction_detail, exchange_detail } = transactionDetail;
    return (
      <div>
        <CommonTransaction commonDetail={transactionDetail}>
          <Card title="兑换信息" style={{ marginTop: 24 }}>
            <DescriptionList title="" className={styles.headerList} size="large" col="3">
              <Description term="目标货币">{codeTocurrencyCode(exchange_detail.target_currency_code)}</Description>
              <Description term="兑换后金额">{numberFormat(exchange_detail.target_amount, getcurrencyBycode(exchange_detail.target_currency_code).decimal_place)}&nbsp;{codeTocurrencyCode(exchange_detail.target_currency_code)}</Description>
            </DescriptionList>
            <br />
          </Card>
        </CommonTransaction>
      </div>
    );
  }
}
