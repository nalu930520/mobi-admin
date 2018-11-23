import React, { Component } from 'react';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import { connect } from 'dva';
import moment from 'moment';
import { Button, Menu, Dropdown, Icon, Row, Col, Steps, Card, Popover, Badge, Table, Tooltip, Divider } from 'antd';
import classNames from 'classnames';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import DescriptionList from '../../../components/DescriptionList';
import styles from './MobiTransactionDetail.less';
import Filter from '../../../filter';
import { numberFormat, getcurrencyBycode } from '../../../utils/utils';
import CommonTransaction from '../AllTransaction/AllTransactionDetail.js';

const { Description } = DescriptionList;

@connect(state => ({
  transaction: state.transaction,
}))
export default class MobiTransactionDetail extends Component {
  state = {

  }
  render() {
    const { transactionDetail } = this.props.transaction;
    return (
      <div>
        <CommonTransaction commonDetail={transactionDetail} />
      </div>
    );
  }
}
