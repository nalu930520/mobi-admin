import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Select, Button, DatePicker, Popconfirm, message } from 'antd';
import StandardTable from '../../../components/StandardTable';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Filter from '../../../filter';
import styles from './AdList.less';
import { getcurrencyBycode, numberFormat, codeTocurrencyCode } from '../../../utils/utils';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
const { RangePicker } = DatePicker;
@connect(state => ({
  advertising: state.advertising,
}))
@Form.create()
export default class adList extends PureComponent {
  state = {
    expandForm: false,
    selectedRows: [],
    formValues: {},
    page: 1,
    per_page: 10,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'advertising/fetch',
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
    this.setState({
      page: pagination.current,
      per_page: pagination.pageSize,
    });
    dispatch({
      type: 'advertising/fetch',
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
      type: 'advertising/fetch',
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
        start_time: fieldsValue.dateRange ? fieldsValue.dateRange[0].unix() : '',
        end_time: fieldsValue.dateRange ? fieldsValue.dateRange[1].unix() : '',
        id: fieldsValue.id,
        currency: fieldsValue.currency,
        mobi_id: fieldsValue.mobiID,
        status: fieldsValue.status,
        side: fieldsValue.side
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
        type: 'advertising/fetch',
        payload: {
          ...values,
          page: 1,
          per_page: 10,
        },
      });
    });
  }

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }} tyle={{ marginBottom: '12px' }}>
          <Col md={8} sm={24}>
            <FormItem label="手机号">
              {getFieldDecorator('mobile')(
                <Input style={{ width: '250px' }} placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="广告时间">
              {getFieldDecorator('dateRange')(
                <RangePicker style={{ width: '250px' }} />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="广告号">
              {getFieldDecorator('id')(
                <Input style={{ width: '250px' }} placeholder="请输入" />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginBottom: '24px' }}>
          <Col md={8} sm={24}>
            <FormItem label="Mobi ID">
              {getFieldDecorator('mobiID')(
                <Input style={{ width: '250px' }} placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="广告币种">
              {getFieldDecorator('currency')(
                <Select
                  style={{ width: '250px' }}
                  placeholder="请选择广告币种"
                >
                  <Option value="" />
                  <Option value="btc">BTC</Option>
                  <Option value="eth">ETH</Option>
                  <Option value="ltc">LTC</Option>
                  <Option value="bcc">BCH</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="广告状态">
              {getFieldDecorator('status')(
                <Select
                  style={{ width: '250px' }}
                  placeholder="请选择广告状态"
                  
                >
                  <Option value="" />
                  <Option value="2">上架</Option>
                  <Option value="1">下架</Option>
                  <Option value="-1">删除</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="广告类型">
              {getFieldDecorator('side')(
                <Select
                  style={{ width: '250px' }}
                  placeholder="请选择广告类型"
                >
                  <Option value="" />
                  <Option value="1">买</Option>
                  <Option value="2">卖</Option>
                </Select>
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
        title: '广告号',
        dataIndex: 'id',
      },
      {
        title: '广告时间',
        render: record => (
          <span>
            {moment(record.created_at * 1000).format('YYYY-MM-DD HH:mm:ss')}
          </span>
        ),
      },
      {
        title: '手机号码',
        render: record => (
          <span>
            {record.mobile_code} {record.mobile}
          </span>
        ),
      },
      {
        title: '广告数字资产币种',
        render: record => (
          <span>
            {codeTocurrencyCode(record.crypto_currency_code)}
          </span>
        ),
      },
      {
        title: '广告数字资产数量',
        render: (record) => {
          const currency = getcurrencyBycode(record.crypto_currency_code);
          return (
            <span>
              {numberFormat(record.total_crypto_amount, currency.decimal_place)}
              &nbsp;
              {codeTocurrencyCode(record.crypto_currency_code)}
            </span>
          );
        },
      },
      {
        title: '广告状态',
        render: record => (
          <span>
            <Filter value={record.status} keyname="adStatus" />
          </span>
        ),
      },
      {
        title: '广告类型',
        render: record => (
          <span>
            <Filter value={record.side} keyname="adSide" />
          </span>
        ),
      },
      {
        title: '操作',
        render: record => (
          <span>
            <a href={`/c2c/advertising-detail/${record.id}`}>查看</a>
            &nbsp; &nbsp;
            <Popconfirm
              title="确认撤销广告？"
              onConfirm={() => {
                const { dispatch } = this.props;
                dispatch({ type: 'advertising/cancelAd', payload: { id: record.id, status: 0 } })
                  .then(() => {
                    dispatch({ type: 'advertising/fetch',
                    payload: {
                      page: this.state.page,
                      per_page: this.state.per_page,
                    } });
                  });
              }}
              okText="确认"
              cancelText="取消"
            >
              <a
                style={{ display: record.status !== 2 ? 'none' : 'inline-block' }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >撤销广告
              </a>
            </Popconfirm>
          </span>
        ),
      },
    ];
    const { advertising: { loading: adLoading, data } } = this.props;
    const { selectedRows } = this.state;
    return (
      <PageHeaderLayout title="广告列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderSimpleForm()}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={adLoading}
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
