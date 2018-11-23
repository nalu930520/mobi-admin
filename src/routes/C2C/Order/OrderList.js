import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message } from 'antd';
import StandardTable from '../../../components/StandardTable';
import CurrencySelect from '../../../components/CurrencySelect';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Filter from '../../../filter';
import styles from './OrderList.less';
import { getcurrencyBycode, numberFormat, codeTocurrencyCode } from '../../../utils/utils';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
const RangePicker = DatePicker.RangePicker;
@connect(state => ({
  order: state.order,
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
      type: 'order/fetch',
      payload: {
        page: 1,
        per_page: 10,
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
      type: 'order/fetch',
      payload: params,
    });
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'order/fetch',
      payload: {
        page: 1,
        per_page: 10,
      },
    });
  }

  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  }

  handleMenuClick = (e) => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;

    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'rule/remove',
          payload: {
            no: selectedRows.map(row => row.no).join(','),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
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
        mobile: fieldsValue.mobile,
        created_at_start: fieldsValue.dateRange ? fieldsValue.dateRange[0].unix() : '',
        created_at_end: fieldsValue.dateRange ? fieldsValue.dateRange[1].unix() : '',
        id: fieldsValue.id,
        mobi_id: fieldsValue.mobiID,
        status: fieldsValue.status,
        crypto_currency_code: fieldsValue.crypto_currency_code,
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
        type: 'order/fetch',
        payload: {
          ...values,
          page: 1,
          per_page: 10,
        },
      });
    });
  }

  handleModalVisible = (flag) => {
    this.setState({
      modalVisible: !!flag,
    });
  }

  handleAddInput = (e) => {
    this.setState({
      addInputValue: e.target.value,
    });
  }

  handleAdd = () => {
    this.props.dispatch({
      type: 'rule/add',
      payload: {
        description: this.state.addInputValue,
      },
    });

    message.success('添加成功');
    this.setState({
      modalVisible: false,
    });
  }

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
            <FormItem label="手机号">
              {getFieldDecorator('mobile')(
                <Input style={{ width: '250px' }} placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="订单时间">
              {getFieldDecorator('dateRange')(
                <RangePicker />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
            <FormItem label="订单号">
              {getFieldDecorator('id')(
                <Input style={{ width: '250px' }} placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="Mobi ID">
              {getFieldDecorator('mobiID')(
                <Input style={{ width: '250px' }} placeholder="请输入" />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col md={12} sm={24}>
            <FormItem label="订单状态">
              {
                getFieldDecorator('status')(
                  <Select style={{ width: '250px' }} >
                    <Option value={1}>新订单</Option>
                    <Option value={2}>已取消</Option>
                    <Option value={3}>已过期</Option>
                    <Option value={4}>法币已支付</Option>
                    <Option value={5}>已完成</Option>
                    <Option value={6}>申诉中</Option>
                  </Select>
                )
              }
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="原始货币">
              {getFieldDecorator('crypto_currency_code')(
                <CurrencySelect style={{ width: '250px' }} currencyType="C" />
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
        title: '订单号',
        dataIndex: 'id',
      },
      {
        title: '创建时间',
        render: record => (
          <span>
            {moment(record.created_at * 1000).format('YYYY-MM-DD HH:mm:ss')}
          </span>
        ),
      },
      {
        title: '买家信息',
        render: record => (
          <span>
            买家 mobiID：{record.buyer_mobi_id}
            <br />
            买家手机号：（+{record.buyer_mobile_code}）{record.buyer_mobile}
          </span>
        ),
      },
      {
        title: '卖家信息',
        render: record => (
          <span>
            卖家 mobiID：{record.seller_mobi_id}
            <br />
            卖家手机号：（+{record.seller_mobile_code}）{record.seller_mobile}
          </span>
        ),
      },
      {
        title: '订单金额',
        render: (record) => {
          const currency = getcurrencyBycode(record.fiat_currency_code);
          return (
            <span>
              {numberFormat(record.fiat_amount, currency.decimal_place)}&nbsp;
              {codeTocurrencyCode(record.fiat_currency_code)}
            </span>
          );
        },
      },
      {
        title: '订单状态',
        render: record => (
          <span>
            <Filter value={record.status} keyname="orderStatus" />
          </span>
        ),
      },
      {
        title: '操作',
        render: record => (
          <span>
            <a href={`/c2c/order-detail/${record.id}`}>查看</a>
          </span>
        ),
      },
    ];
    const { order: { loading: orderLoading, data } } = this.props;
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
              loading={orderLoading}
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
