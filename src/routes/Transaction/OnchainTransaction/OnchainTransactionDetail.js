import React, { Component } from 'react';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import { connect } from 'dva';
import moment from 'moment';
import { Button, Menu, Dropdown, Icon, Row, Col, Steps, Card, Popover, Badge, Table, Tooltip, Divider } from 'antd';
import classNames from 'classnames';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import DescriptionList from '../../../components/DescriptionList';
import styles from './OnchainTransactionDetail.less';
import Filter from '../../../filter';
import { numberFormat, getcurrencyBycode } from '../../../utils/utils';
import CommonTransaction from '../AllTransaction/AllTransactionDetail.js';

const { Description } = DescriptionList;

@connect(state => ({
  transaction: state.transaction,
}))
export default class OnchainTransaction extends Component {
  state = {

  }

  componentDidMount() {
  }

  render() {
    const { transactionDetail } = this.props.transaction;
    const { transaction_detail, block_chain_info } = transactionDetail;
    return (
      <div>
        <CommonTransaction commonDetail={transactionDetail}>
          <Card title="区块链信息" style={{ marginTop: 24 }}>
            <DescriptionList title="" className={styles.headerList} size="large" col="3">
              <Description term="确认数">{block_chain_info.confirmations || '-'}</Description>
              <Description term="需要确认数">{block_chain_info.confirmations_required || '-'}</Description>
            </DescriptionList>
            <br />
            <DescriptionList title="" className={styles.headerList} size="large" col="3">
              <Description term="交易 hash">{block_chain_info.tx_hash || '-'}</Description>
              <Description term="块 hash">{block_chain_info.block_hash || '-'}</Description>
              <Description term="块高度">{block_chain_info.block_height || '-'}</Description>
            </DescriptionList>
            <br />
            <DescriptionList title="" className={styles.headerList} size="large" col="1">
              <Description term="hash">{block_chain_info.hash || '-'}</Description>
            </DescriptionList>
          </Card>
        </CommonTransaction>
      </div>
    );
  }
}
