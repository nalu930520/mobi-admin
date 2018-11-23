import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Select, Checkbox, Row, Col, Card, Form, Input, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message } from 'antd';
import StandardTable from '../../../components/StandardTable';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Filter from '../../../filter';
import styles from './MobiTransactionList.less';
import { getcurrencyBycode, numberFormat } from '../../../utils/utils';
import { transactionListColumn } from '../../../common/columns';
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
  { label: '系统退款', value: '4' },
  { label: 'Mobi转账', value: '5' },
  { label: '推特发送', value: '15' },
  { label: '推特退款', value: '16' },
  { label: '预付卡快递费', value: '3' },
  { label: '预付卡卡月费', value: '14' },
  { label: '预付卡刷卡', value: '13' },
  { label: '预付卡充值', value: '18' },
  { label: 'C2C发送', value: '19' },
  { label: 'C2C退款', value: '20' },
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
        transactionType: 4,
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
      transactionType: 4,
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
        transactionType: 4,
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
        statusId: fieldsValue.statusId.join(','),
        currency: fieldsValue.currencyCode,
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
          transactionType: 4,
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
            <FormItem label="货币">
              {getFieldDecorator('currencyCode')(
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
              columns={transactionListColumn('/trade-management/mobiTransaction-details', 4)}
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
