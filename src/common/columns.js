import React from 'react';
import moment from 'moment';
import { Link } from 'dva/router';
import Filter from '../filter';
import { numberFormat, getcurrencyBycode, codeTocurrencyCode } from '../utils/utils';

export const columns1 = [{
  title: '时间',
  dataIndex: 'created_at',
  render: val => (<span>{moment.unix(val).format('YYYY-MM-DD HH:mm:ss')}</span>),
}, {
  title: '订单号',
  dataIndex: 'id',
}, {
  title: '买家手机(Mobi ID)',
  render: val => (
    <span>{val.buyer_mobile}&nbsp;({val.buyer_mobi_id})</span>
  ),
}, {
  title: '卖家手机(Mobi ID)',
  render: val => (
    <span>{val.seller_mobile}&nbsp;({val.seller_mobi_id})</span>
  ),
}, {
  title: '订单金额',
  render: val => (
    <span>{numberFormat(val.fiat_amount,
      getcurrencyBycode(val.fiat_currency_code).decimal_place)}&nbsp;{codeTocurrencyCode(val.fiat_currency_code)}
      &nbsp;|&nbsp;{numberFormat(val.crypto_amount,
       getcurrencyBycode(val.crypto_currency_code).decimal_place)}
      &nbsp;{codeTocurrencyCode(val.crypto_currency_code)}
    </span>
  ),
}, {
  title: '状态',
  render: val => (
    <Filter value={val.status} keyname="orderStatus" />
  ),
}];


export const columns2 = [{
  title: '时间',
  dataIndex: 'created_at',
  render: val => (<span>{moment.unix(val).format('YYYY-MM-DD HH:mm:ss')}</span>),
}, {
  title: '广告号',
  dataIndex: 'id',
}, {
  title: '广告数字资产数量',
  render: val => (
    <span>
      {numberFormat(val.total_crypto_amount,
       getcurrencyBycode(val.crypto_currency_code).decimal_place)}
      &nbsp;{codeTocurrencyCode(val.crypto_currency_code)}
    </span>
  ),
}, {
  title: '状态',
  render: val => (
    <Filter value={val.status} keyname="adStatus" />
  ),
}];

export const columns3 = [{
  title: '创建时间',
  dataIndex: 'created_at',
  render: val => (<span>{moment.unix(val).format('YYYY-MM-DD HH:mm:ss')}</span>),
}, {
  title: '相关ID',
  dataIndex: 'target_customer_id',
  render: val => <Link to={`/c2c/customer/${val}`} target="_blank">{val}</Link>,
}];

export const columns31 = [{
  title: '创建时间',
  dataIndex: 'created_at',
  render: val => (<span>{moment.unix(val).format('YYYY-MM-DD HH:mm:ss')}</span>),
}, {
  title: '相关ID',
  dataIndex: 'original_customer_id',
  render: val => <Link to={`/c2c/customer/${val}`} target="_blank">{val}</Link>,
}];

export const columns4 = [{
  title: '创建时间',
  dataIndex: 'created_at',
  render: val => (<span>{moment.unix(val).format('YYYY-MM-DD HH:mm:ss')}</span>),
}, {
  title: '相关ID',
  dataIndex: 'target_customer_id',
  render: val => <Link to={`/c2c/customer/${val}`} target="_blank">{val}</Link>,
}];

export const columns41 = [{
  title: '创建时间',
  dataIndex: 'created_at',
  render: val => (<span>{moment.unix(val).format('YYYY-MM-DD HH:mm:ss')}</span>),
}, {
  title: '相关ID',
  dataIndex: 'original_customer_id',
  render: val => <Link to={`/c2c/customer/${val}`} target="_blank">{val}</Link>,
}];

export const transactionListColumn = (detailUrl, type) => [
  {
    title: '创建时间',
    render: record => (
      <span>
        {moment(record.created_at * 1000).format('YYYY-MM-DD HH:mm:ss')}
      </span>
    ),
  },
  {
    title: 'Mobi交易ID',
    dataIndex: 'sn',
  },
  {
    title: '交易类型',
    render: val => (
      <Filter value={val.type} keyname="txType" />
    ),
  },
  {
    title: '状态',
    render: val => (
      <Filter value={val.status} keyname="txStatus" />
    ),
  },
  {
    title: '货币',
    render: (record) => {
      return (<span>{record ? codeTocurrencyCode(record.currencyObject.code) : ''}</span>);
    },
  },
  {
    title: '交易总金额',
    render: (record) => {
      if (!record) return '';
      const currency = getcurrencyBycode(record.currencyObject.code);
      return (
        <span>
          {numberFormat(record.amount, currency.decimal_place)}&nbsp;
          {codeTocurrencyCode(record.currencyObject.code)}
        </span>
      );
    },
  },
  {
    title: '手续费',
    render: (record) => {
      if (!record) return '';
      const currency = getcurrencyBycode(record.currencyObject.code);
      return (
        <span>
          {numberFormat(record.fee, currency.decimal_place)}&nbsp;
          {codeTocurrencyCode(record.currencyObject.code)}
        </span>
      );
    },
  },
  {
    title: '付款人',
    render: record => (
      <span>
        {record.payerObject ? record.payerObject.mobileCode : '-'} {record.payerObject ? record.payerObject.mobile : ''}
      </span>
    ),
  },
  {
    title: '付款人交易后余额',
    render: (record) => {
      if (!record.payerRemainBalanceCurrencyCode) return '-';
      const currency = getcurrencyBycode(record.payerRemainBalanceCurrencyCode);
      return (
        <span>
          {numberFormat(record.payerRemainBalance, currency.decimal_place)}&nbsp;
          {codeTocurrencyCode(record.payerRemainBalanceCurrencyCode)}
        </span>
      );
    },
  },
  {
    title: '收款人',
    render: (record) => {
      if (!record.payeeObject) return '-';
      if (record.payeeObject.mobileCode || record.payeeObject.mobile) {
        return <span>{record.payeeObject.mobileCode} {record.payeeObject.mobile}</span>;
      }
      return <span>{record.payeeObject.address}</span>;
    }
  },
  {
    title: '收款人款人交易后余额',
    render: (record) => {
      if (!record.payeeRemainBalanceCurrencyCode) return '-';
      const currency = getcurrencyBycode(record.payeeRemainBalanceCurrencyCode);
      return (
        <span>
          {numberFormat(record.payeeRemainBalance, currency.decimal_place)}&nbsp;
          {codeTocurrencyCode(record.payeeRemainBalanceCurrencyCode)}
        </span>
      );
    },
  },
  {
    title: '操作',
    render: (record) => {
      let transactionDetailUrl = '';
      let transactionType = '';
      switch (record.type) {
        case 3:
        case 4:
        case 5:
        case 9:
        case 13:
        case 14:
        case 15:
        case 16:
        case 17:
        case 18:
        case 19:
        case 20:
          // mobi 转账
          transactionDetailUrl = '/trade-management/mobiTransaction-details';
          transactionType = 4;
          break;
        case 6:
        case 7:
          // onChain 转账
          transactionDetailUrl = '/trade-management/onchainTransaction-details';
          transactionType = 2;
          break;
        case 11:
        case 12:
          // 兑换
          transactionDetailUrl = '/trade-management/exchangeTransaction-details';
          transactionType = 3;
          break;
        default:
          break;
      }
      return (
        <span>
          <a href={`${transactionDetailUrl}/${record.id}?transactionType=${transactionType}`}>查看</a>
        </span>);
    },
  },
];
