import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message } from 'antd';
import StandardTable from '../../../components/StandardTable';
import CurrencySelect from '../../../components/CurrencySelect';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import MobileCodeSelect from '../../../components/MobileCodeSelect';
import Filter from '../../../filter';
import styles from './index.less';
import { getcurrencyBycode, numberFormat, codeTocurrencyCode } from '../../../utils/utils';
import DescriptionList from '../../../components/DescriptionList';
import { queryDepositDetail } from '../../../services/cashCharge';

const { Description } = DescriptionList;
const FormItem = Form.Item;
const { Option } = Select;
const RangePicker = DatePicker.RangePicker;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
@connect(state => ({
  cashManage: state.cashManage,
}))
@Form.create()
export default class depositList extends PureComponent {
  state = {
    selectedRows: [],
    formValues: {},
    showDetailModal: false,
    detailData: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'cashManage/fetchDeposit',
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
      type: 'cashManage/fetchDeposit',
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
      type: 'cashManage/fetchDeposit',
      payload: {
        page: 1,
        per_page: 10,
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

      console.log(fieldsValue);
      for (const key in fieldsValue) {
        if (!fieldsValue[key]) {
          delete fieldsValue[key];
        }
      }
      this.setState({
        formValues: fieldsValue,
      });
      dispatch({
        type: 'cashManage/fetchDeposit',
        payload: {
          ...fieldsValue,
          page: 1,
          per_page: 10,
        },
      });
    });
  }

  showDepositDetail = (data) => {
    queryDepositDetail({ id: data.id })
      .then((resData) => {
        this.setState({
          showDetailModal: true,
          detailData: resData,
        });
      });
  }

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    const mobilePrefixSelector = getFieldDecorator('mobile_code', {
      rules: [{ required: true, message: '请选择' }],
    })(
      <MobileCodeSelect />
    );
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
            <FormItem label="确认码">
              {getFieldDecorator('confirmed_code')(
                <Input style={{ width: '250px' }} placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="手机号码">
              {getFieldDecorator('mobile')(
                <Input addonBefore={mobilePrefixSelector} style={{ width: '250px', marginLeft: '10px' }} placeholder="请输入" />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
            <FormItem label="货币" style={{ width: '300px' }}>
              {getFieldDecorator('currency_code')(
                <CurrencySelect currencyType="F" />
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="状态">
              {
                getFieldDecorator('status')(
                  <Select style={{ width: '250px' }} >
                    <Option value="0">待付款</Option>
                    <Option value="1">待审核</Option>
                    <Option value="2">已完成</Option>
                    <Option value="3">已取消</Option>
                    <Option value="4">未知</Option>
                  </Select>
                )
              }
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginBottom: '24px', textAlign: 'left' }}>
          <Col md={12} sm={24} >
            <Link to="/cashCharge/addDeposit">
              <Button type="primary" icon="plus" >新增充值 </Button>
            </Link>
          </Col>
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
        title: '请求ID',
        dataIndex: 'id',
      },
      {
        title: '手机号',
        render: record => (
          <span>
            {record.mobile_code} {record.mobile}
          </span>
        ),
      },
      {
        title: '币种',
        dataIndex: 'currency_code',
      },
      {
        title: '请求金额',
        render: record => (
          <span>
            {numberFormat(record.request_amount, 8, false)} {record.currency_code}
          </span>
        ),
      },
      {
        title: '确认码',
        dataIndex: 'confirmed_code',
      },
      {
        title: '状态',
        render: record => (
          <span>
            <Filter value={record.status} keyname="cashStatus" />
          </span>
        ),
      },
      {
        title: '时间',
        render: record => (
          <span>
            {moment(record.created_at * 1000).format('YYYY-MM-DD HH:mm:ss')}
          </span>
        ),
      },
      {
        title: '操作',
        render: record => (
          <span>
            <a href="#" onClick={() => { this.showDepositDetail(record); }}>查看</a>
          </span>
        ),
      },
    ];
    const { cashManage: { loading: orderLoading, data } } = this.props;
    const { selectedRows, detailData } = this.state;
    return (
      <PageHeaderLayout title="充值请求列表">
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
          {this.state.showDetailModal &&
          <Modal
            visible={this.state.showDetailModal}
            title="新增充值"
            width="800px"
            onOk={this.handleOk}
            style={{ widht: '1000px' }}
            onCancel={() => {
              this.setState({
                showDetailModal: false,
              });
            }}
            footer={false}
          >
            <Row>
              <Col span={8}>
                <DescriptionList size="small" col="1">
                  <Description term="请求ID">{detailData.id}</Description>
                  <Description term="手机号">{detailData.mobile_code} {detailData.mobile}</Description>
                  <Description term="确认码">{detailData.confirmed_code}</Description>
                  <Description term="创建时间">{moment(detailData.created_at * 1000).format('YYYY-MM-DD HH:mm:ss')}</Description>
                  <Description term="更新时间">{moment(detailData.updated_at * 1000).format('YYYY-MM-DD HH:mm:ss')}</Description>
                </DescriptionList>
              </Col>
              <Col span={8}>
                <DescriptionList size="small" col="1">
                  <Description term="充值币种">{detailData.currency_code}</Description>
                  <Description term="手续费">{numberFormat(detailData.fee, 8, false)} {detailData.currency_code}</Description>
                  <Description term="银行名">{detailData.bank_name}</Description>
                  <Description term="银行地址">{detailData.bank_address}</Description>
                  <Description term="账户名">{detailData.account_name}</Description>
                  <Description term="账户号码">{detailData.bank_account}</Description>
                </DescriptionList>
              </Col>
              <Col span={8}>
                <div className={styles.rightWraper}>
                  <div className={styles.title}>状态</div>
                  <div className={styles.amount}><Filter value={detailData.status} keyname="cashStatus" /></div>
                  <div className={styles.title}>请求金额</div>
                  <div className={styles.amount}>{numberFormat(detailData.request_amount, 8, false)} {detailData.currency_code}</div>
                  <div className={styles.title}>到账金额</div>
                  <div className={styles.amount} style={{ color: 'red' }}>{numberFormat(detailData.reality_amount, 8, false)} {detailData.currency_code}</div>
                </div>
              </Col>
            </Row>
            <DescriptionList size="small" layout="vertical" col="1">
              <Description term="转账回执" >
                <img style={{ width: '500px' }} alt="evidence" src={detailData.evidences[0]} />
              </Description>
            </DescriptionList>
          </Modal>
          }
        </Card>
      </PageHeaderLayout>
    );
  }
}
