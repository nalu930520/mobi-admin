import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import moment from 'moment';
import store from 'store';
import _ from 'lodash';
import { Row, Col, Tabs, Card, Input, Select, Alert, Table, DatePicker, Button, Form } from 'antd';
import { numberFormat, getcurrencyBycode, codeTocurrencyCode } from '../../../utils/utils';
import CurrencySelect from '../../../components/CurrencySelect';
import SearchList from '../../C2C/List/SearchList';
import styles from './index.less'
const { Meta } = Card;
const { RangePicker } = DatePicker;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const InputGroup = Input.Group;
const Option = Select.Option;
const dateFormat = 'YYYY-MM-DD';


const columns = [{
  title: '创建时间',
  dataIndex: 'created_at',
  render: val => (<span>{moment.unix(val).format('YYYY-MM-DD HH:mm:ss')}</span>),
  key: 'created_at',
}, {
  title: 'Mobi交易ID',
  dataIndex: 'sn',
  key: 'sn',
}, {
  title: '原始货币',
  dataIndex: 'symbol',
  render: val => val.split('-')[0].toUpperCase(),
  key: 'origin_symbol',
}, {
  title: '原始货币金额',
  key: 'source_amount',
  render: val => (
    <span>{numberFormat(val.source_amount,
      getcurrencyBycode(val.symbol.split('-')[0]).decimal_place)}
      &nbsp;{codeTocurrencyCode(val.symbol.split('-')[0])}
    </span>
  ),
}, {
  title: '目标货币',
  dataIndex: 'symbol',
  render: val => val.split('-')[1].toUpperCase(),
  key: 'target_symbol',

}, {
  title: '目标货币金额',
  key: 'target_amount',
  render: val => (
    <span>{numberFormat(val.target_amount,
      getcurrencyBycode(val.symbol.split('-')[1]).decimal_place)}
      &nbsp;{codeTocurrencyCode(val.symbol.split('-')[1])}
    </span>
  ),
}, {
  title: '汇率',
  dataIndex: 'rate',
  key: 'rate',
}, {
  title: '手机号码',
  key: 'mobile',
  render: val => (<span>(+ {val.mobile_code}) {val.mobile}</span>),
}];

@Form.create()

@connect(state => ({
  assets: state.assets,
}))

export default class CurrencyExchangeHistory extends PureComponent {

  componentDidMount() {
    const { dispatch } = this.props;
    // const start = moment().subtract(7, 'day').unix();
    // const end = moment().unix();
    dispatch({
      type: 'assets/fetchExchangeTransactionHistory',
      payload: {
        // created_at_start: moment().subtract(7, 'day').unix(),
        // created_at_end: moment().unix(),
        page: 1,
        per_page: 15,
      },
    });
  }

  onPageChange = (pagination) => {
    const { dispatch, form } = this.props;
    const { getFieldValue } = form;
    const rangeValue = getFieldValue('range-picker');
    let start = null;
    let end = null;

    if (rangeValue) {
      const values = [rangeValue[0].format(dateFormat), rangeValue[1].format(dateFormat)];
      start = moment(values[0]).unix();
      end = moment(values[1]).unix();
    }
    dispatch({
      type: 'assets/fetchExchangeTransactionHistory',
      payload: {
        created_at_start: start,
        created_at_end: end,
        page: pagination.current,
        per_page: pagination.pageSize,
      },
    });
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    dispatch({
      type: 'assets/fetchExchangeTransactionHistory',
      payload: {
        page: 1,
        per_page: 10,
      },
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { dispatch } = this.props;
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      const parmas = {
        mobile_code: fieldsValue.mobile_code,
        mobile: fieldsValue.mobile,
        sn: fieldsValue.sn,
        source_currency_code: fieldsValue.source_currency_code,
        target_currency_code: fieldsValue.target_currency_code,
        page: 1,
        per_page: 15,
      };
      const rangeValue = fieldsValue['range-picker'];
      let start = null;
      let end = null;

      if (rangeValue) {
        const values = [rangeValue[0].format(dateFormat), rangeValue[1].format(dateFormat)];
        start = moment(values[0]).unix();
        end = moment(values[1]).unix();
        parmas.start_time = start;
        parmas.end_end = end;
      }
      dispatch({
        type: 'assets/fetchExchangeTransactionHistory',
        payload: parmas,
      });
    });
  }

  render() {
    const { transactionList, loading } = this.props.assets;
    const { getFieldDecorator } = this.props.form;
    const countrys = store.get('countrys');
    const filterCountrys = _.uniqBy(countrys, 'mobile_code');
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };
    const prefixSelector = getFieldDecorator('mobile_code')(
      <Select
        showSearch
        placeholder="请选择"
        style={{ width: 100 }}
      >
        {_.orderBy(filterCountrys, ['mobile_code'], ['asc']).map(cuntry =>
          (<Option key={cuntry.mobile_code}value={`${cuntry.mobile_code}`}>+ {cuntry.mobile_code}</Option>))}
      </Select>
    );
    return (
      <Card>
        <Form onSubmit={this.handleSubmit}>
          <Row>
            <Col span={11}>
              <FormItem
                label="创建时间："
                {...formItemLayout}
              >
                {getFieldDecorator('range-picker')(
                  <RangePicker
                    format={dateFormat}
                  />
                )}
              </FormItem>
            </Col>
            <Col span={11} offset={1}>
              <FormItem
                {...formItemLayout}
                label="手机号："
              >
                {getFieldDecorator('mobile')(
                  <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
                )}
              </FormItem>
            </Col>
            <Col span={11}>
              <FormItem
                {...formItemLayout}
                label="Mobi交易ID"
              >
                {getFieldDecorator('sn')(
                  <Input style={{ width: '100%' }} />
                )}
              </FormItem>
            </Col>
            <Col span={11} offset={1}>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={12} sm={24}>
                  <FormItem label="原始货币">
                    {getFieldDecorator('source_currency_code')(
                      <CurrencySelect />
                    )}
                  </FormItem>
                </Col>
                <Col md={12} sm={24}>
                  <FormItem label="目标货币">
                    {getFieldDecorator('target_currency_code')(
                      <CurrencySelect />
                    )}
                  </FormItem>
                </Col>
              </Row>
            </Col>
          </Row>
          <FormItem>
            <Row>
              <Col span={24} style={{ textAlign: 'right' }}>
                <Button type="primary" htmlType="submit">查询</Button>
                &nbsp;
                <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
              </Col>
            </Row>
          </FormItem>
        </Form>
        <div className={styles.tableAlert}>
          <Alert
            message={(
              <div>
                数据条目:<b>{transactionList.pagination.total}</b>
              </div>
            )}
            type="info"
            showIcon
          />
        </div>
        <Table
          loading={loading}
          columns={columns}
          dataSource={transactionList.list}
          pagination={transactionList.pagination}
          onChange={this.onPageChange}
          rowKey={list => list.sn + list.symbol}
        />
      </Card>
    );
  }
}
