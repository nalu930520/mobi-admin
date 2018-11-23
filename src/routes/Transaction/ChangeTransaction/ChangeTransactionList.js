import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Select, Checkbox, Row, Col, Card, Form, Input, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message } from 'antd';
import StandardTable from '../../../components/StandardTable';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Filter from '../../../filter';
import styles from './ChangeTransactionList.less';
import { getcurrencyBycode, numberFormat, codeTocurrencyCode } from '../../../utils/utils';
import MobileCodeSelect from '../../../components/MobileCodeSelect';
import CurrencySelect from '../../../components/CurrencySelect';
import TransactionStatusSelect from '../../../components/TransactionStatusSelect';
import TxCheckbox from '../../../components/TxTypeCheckbox';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
const RangePicker = DatePicker.RangePicker;
const CheckboxGroup = Checkbox.Group;
const plainOptions = [
  { label: '币种兑换', value: '11' },
  { label: '兑换撤销', value: '12' },
];
const checkList = plainOptions.map(data => data.value);

@connect(state => ({
  transaction: state.transaction,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    addInputValue: '',
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'transaction/fetch',
      payload: {
        page: 1,
        per_page: 10,
        transactionType: 3,
      },
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      page: pagination.current,
      per_page: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'transaction/fetch',
      payload: params,
      transactionType: 3,
    });
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'transaction/fetch',
      payload: {
        page: 1,
        per_page: 10,
        transactionType: 3,
      },
    });
  }

  handleSelectRows = (rows) => {
    this.setState({
      selectedRows: rows,
    });
  }

  handleSearch = (e) => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        typeId: fieldsValue.typeId.join(','),
        mobileCode: fieldsValue.mobileCode,
        mobile: fieldsValue.mobile,
        start: fieldsValue.dateRange ? fieldsValue.dateRange[0].unix() : '',
        end: fieldsValue.dateRange ? fieldsValue.dateRange[1].unix() : '',
        SN: fieldsValue.SN,
        source_currency: fieldsValue.source_currency,
        statusId: fieldsValue.statusId.join(','),
        target_currency: fieldsValue.target_currency,
      };
      for (const key in values) {
        if (!values[key]) {
          delete values[key];
        }
      }
      this.setState({
        formValues: values,
      });
      dispatch({
        type: 'transaction/fetch',
        payload: {
          ...values,
          page: 1,
          per_page: 10,
          transactionType: 3,
        },
      });
    });
  }

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row>
          <Col>
            <FormItem label="交易类型">
              {getFieldDecorator('typeId', {
                initialValue: checkList,
              })(
                <TxCheckbox plainOptions={plainOptions} />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
            <FormItem label="创建时间">
              {getFieldDecorator('dateRange')(
                <RangePicker />
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="手机号码">
              {getFieldDecorator('mobileCode')(
                <MobileCodeSelect />
              )}
              {getFieldDecorator('mobile')(
                <Input style={{ width: '250px' }} placeholder="请输入" />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
            <FormItem label="交易 ID">
              {getFieldDecorator('SN')(
                <Input style={{ width: '250px' }} placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="原始货币">
              {getFieldDecorator('source_currency')(
                <CurrencySelect />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
            <FormItem label="交易状态">
              {getFieldDecorator('statusId', {
                initialValue: [],
              })(
                <TransactionStatusSelect />
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="目标货币">
              {getFieldDecorator('target_currency')(
                <CurrencySelect />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginBottom: '24px', textAlign: 'right' }}>
          <Col md={12} sm={24} />
          <Col md={12} sm={24}>
            <span className={styles.submitButtons} style={{ marginBottom: '24px' }}>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const columns = [
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
        title: '原始货币',
        dataIndex: 'sourceCurrencyCode',
      },
      {
        title: '原始金额',
        render: (record) => {
          if (!record.sourceCurrencyCode) return '-';
          const currency = getcurrencyBycode(record.sourceCurrencyCode);
          return (
            <span>
              {numberFormat(record.sourceAmount, currency.decimal_place)}&nbsp;
              {codeTocurrencyCode(record.sourceCurrencyCode)}
            </span>
          );
        },
      },
      {
        title: '原始货币余额',
        render: (record) => {
          if (!record.sourceCurrencyCode) return '-';
          const currency = getcurrencyBycode(record.sourceCurrencyCode);
          return (
            <span>
              {numberFormat(record.sourceAmountBalance, currency.decimal_place)}&nbsp;
              {codeTocurrencyCode(record.sourceCurrencyCode)}
            </span>
          );
        },
      },
      {
        title: '目标货币',
        dataIndex: 'targetCurrencyCode',
      },
      {
        title: '目标金额',
        render: (record) => {
          if (!record.targetCurrencyCode) return '-';
          const currency = getcurrencyBycode(record.targetCurrencyCode);
          return (
            <span>
              {numberFormat(record.targetAmount, currency.decimal_place)}&nbsp;
              {codeTocurrencyCode(record.targetCurrencyCode)}
            </span>
          );
        },
      },
      {
        title: '目标货币余额',
        render: (record) => {
          if (!record.targetCurrencyCode) return '-';
          const currency = getcurrencyBycode(record.targetCurrencyCode);
          return (
            <span>
              {numberFormat(record.targetAmountBalance, currency.decimal_place)}&nbsp;
              {codeTocurrencyCode(record.targetCurrencyCode)}
            </span>
          );
        },
      },
      {
        title: '发起人',
        dataIndex: 'createCustomer.mobile',
      },
      {
        title: '操作',
        render: record => (
          <span>
            <a href={`/trade-management/exchangeTransaction-details/${record.id}?transactionType=3`}>查看</a>
          </span>
        ),
      },
    ];
    const { transaction: { loading: transactionLoading, data } } = this.props;
    const { selectedRows, modalVisible, addInputValue } = this.state;
    return (
      <PageHeaderLayout title="订单列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderSimpleForm()}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={transactionLoading}
              columns={columns}
              data={data}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
