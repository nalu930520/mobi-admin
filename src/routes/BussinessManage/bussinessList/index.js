import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import moment from 'moment';
import _ from 'lodash';
import { Row, Col, Card, Table, Alert, DatePicker, Form, Button, Input, Select } from 'antd';
import Filter from '../../../filter';
import DescriptionList from '../../../components/DescriptionList';
import style from './../../UserManagement/UserList/index.less';
import PasswordStrengthModel from './../BussinessDetail/PassWordStrength';

const { Description } = DescriptionList;
const { Meta } = Card;
const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;
const dateFormat = 'YYYY-MM-DD';

const columns = [{
  title: '创建时间',
  dataIndex: 'created_at',
  render: val => (<span>{moment.unix(val).format('YYYY-MM-DD HH:mm:ss')}</span>),
  key: 'created_at',
}, {
  title: '承兑商号',
  dataIndex: 'merchant_id',
  key: 'merchant_id',
}, {
  title: 'Mobi ID',
  dataIndex: 'mobi_customer_id',
  key: 'mobi_customer_id',
}, {
  title: '用户名',
  dataIndex: 'username',
  key: 'username',
}, {
  title: '承兑商登录状态',
  dataIndex: 'login_status',
  key: 'login_status',
  render: val => (<Filter value={val} keyname="accountStatus" />),
},
{
  title: '承兑商上架状态',
  dataIndex: 'put_away_status',
  key: 'put_away_status',
  render: val => (<Filter value={val} keyname="bussinessStatus" />),
},
{
  title: '操作',
  dataIndex: 'merchant_id',
  key: 'check',
  render: val => (<Link to={`/bussniess/bussniessDetail/${val}`}>查看</Link>),
}];

@Form.create()

@connect(state => ({
  bussinessList: state.bussinessList,
  bussinessDetail: state.bussinessDetail,
}))

export default class UserList extends PureComponent {
  state = {
    modalFlg: false,
    formValues: {},
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'bussinessList/fetchPlatformInfo' });
    dispatch({
      type: 'bussinessList/fetchList',
      payload: {
        page: 1,
        per_page: 10,
      },
    });
  }

  onPageChange = (pagination) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    const data = {
      page: pagination.current,
      per_page: pagination.pageSize,
      ...formValues,
    };
    dispatch({
      type: 'bussinessList/fetchList',
      payload: data,
    });
  }

  resetForm = (e) => {
    e.preventDefault();
    this.props.form.resetFields();
    this.setState({
      formValues: {},
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'bussinessList/fetchList',
      payload: {
        page: 1,
        per_page: 10,
      },
    });
  }

  handleCancel = () => {
    this.setState({
      modalFlg: false,
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
        merchant_id: fieldsValue.merchant_id,
        login_status: fieldsValue.login_status.length === 1 ? fieldsValue.login_status[0] : undefined,
        putaway_status: fieldsValue.putaway_status.length === 1 ? fieldsValue.putaway_status[0] : undefined,
        username: fieldsValue.username,
        page: 1,
        per_page: 10,
      };
      const rangeValue = fieldsValue['range-picker'];
      let start = null;
      let end = null;
      if (rangeValue && rangeValue.length) {
        const values = [rangeValue[0].format(dateFormat), rangeValue[1].format(dateFormat)];
        start = moment(values[0]).unix();
        end = moment(values[1]).unix();
        parmas.start_time = start;
        parmas.end_time = end;
      }
      for (const key in parmas) {
        if (!parmas[key]) {
          delete parmas[key];
        }
      }
      this.setState({
        formValues: parmas,
      });
      dispatch({
        type: 'bussinessList/fetchList',
        payload: parmas,
      });
    });
  }
  createBussiness=() => {
    const { dispatch } = this.props;
    dispatch({
      type: 'bussinessList/fetchgMerchantId',
    });
    this.setState({
      modalFlg: true,
    });
  }
  validateMerchantID = (rule, value, callback) => {
    if (value && value.length !== 32 && value.length !== 36) {
      callback('请输入正确的承兑商号');
    } else {
      callback();
    }
  }
  render() {
    const { platformInfo, merchantList, loading }
     = this.props.bussinessList;
    const { getFieldDecorator } = this.props.form;
    const { modalFlg } = this.state;
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

    return (
      <div>
        <Card
          style={{ marginBottom: 24 }}
          bordered={false}
          bodyStyle={{ padding: 0 }}
          className={style.gridStyle}
        >
          <Row>
            <Col span={5}>
              <Card.Grid>
                <Meta
                  title="总承兑商数量"
                  description={`${platformInfo.total_merchants}`}
                />
              </Card.Grid>
            </Col>
            <Col span={5}>
              <Card.Grid>
                <Meta
                  title="已激活承兑商数量"
                  description={`${platformInfo.activated_merchants}`}
                />
              </Card.Grid>
            </Col>
            <Col span={5}>
              <Card.Grid>
                <Meta
                  title="已锁定承兑商数量"
                  description={`${platformInfo.locked_merchants}`}
                />
              </Card.Grid>
            </Col>
            <Col span={5}>
              <Card.Grid>
                <Meta
                  title="已上架承兑商数量"
                  description={`${platformInfo.put_away_merchants}`}
                />
              </Card.Grid>
            </Col>
            <Col span={4}>
              <Card.Grid>
                <Meta
                  title="已下架承兑商数量"
                  description={`${platformInfo.sold_out_merchants}`}
                />
              </Card.Grid>
            </Col>
          </Row>
        </Card>
        <Card
          style={{ marginBottom: 24 }}
          bordered={false}
        >
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
                  label="承兑商登录状态："
                >
                  {getFieldDecorator('login_status', {
                    initialValue: ['0', '1'],
                  })(
                    <Select
                      mode="multiple"
                    >
                      <Option key="0">已锁定</Option>
                      <Option key="1">已激活</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={11}>
                <FormItem
                  {...formItemLayout}
                  label="承兑商上架状态："
                >
                  {getFieldDecorator('putaway_status', {
                    initialValue: ['0', '1'],
                  })(
                    <Select
                      mode="multiple"
                    >
                      <Option key="1">已上架</Option>
                      <Option key="0">已下架</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={11} offset={1}>
                <FormItem
                  {...formItemLayout}
                  label="承兑商号："
                >
                  {getFieldDecorator('merchant_id', {
                    rules: [{
                      validator: this.validateMerchantID,
                    }],
                  })(
                    <Input />
                  )}
                </FormItem>
              </Col>

              <Col span={11}>
                <FormItem
                  {...formItemLayout}
                  label="用户名："
                >
                  {getFieldDecorator('username')(
                    <Input />
                  )}
                </FormItem>
              </Col>
            </Row>
            <FormItem>
              <Row>
                <Col span={6} style={{ textAlign: 'left' }}>
                  <Button type="primary" onClick={this.createBussiness}>+新建承兑商</Button>
                </Col>
                <Col span={18} style={{ textAlign: 'right' }}>
                  <Button type="primary" htmlType="submit">查询</Button>
                  &nbsp;
                  <Button onClick={this.resetForm}>重置</Button>
                </Col>
              </Row>
            </FormItem>
          </Form>
          <div className={style.tableAlert}>
            <Alert
              message={(
                <div>
                  数据条目:<b>{merchantList.pagination.total}</b>
                </div>
              )}
              type="info"
              showIcon
            />
          </div>
          <Table
            loading={loading}
            columns={columns}
            pagination={merchantList.pagination}
            dataSource={merchantList.list}
            onChange={this.onPageChange}
            rowKey={list => list.merchant_id}
          />
          <PasswordStrengthModel
            visible={modalFlg}
            createFlg="true"
            title="新建承兑商"
            handleCancel={() => { this.handleCancel(); }}
          />
        </Card>
      </div>
    );
  }
}
