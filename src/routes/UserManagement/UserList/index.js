import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import moment from 'moment';
import store from 'store';
import _ from 'lodash';
import { Row, Col, Card, Table, Alert, DatePicker, Form, Button, Input, Select } from 'antd';
import Filter from '../../../filter';
import DescriptionList from '../../../components/DescriptionList';
import style from './index.less';

const { Description } = DescriptionList;
const { Meta } = Card;
const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const InputGroup = Input.Group;
const Option = Select.Option;
const dateFormat = 'YYYY-MM-DD';

const columns = [{
  title: '注册时间',
  dataIndex: 'created_at',
  render: val => (<span>{moment.unix(val).format('YYYY-MM-DD HH:mm:ss')}</span>),
  key: 'created_at',
}, {
  title: '手机所属国家／地区',
  dataIndex: 'country_name',
  key: 'country_name',
}, {
  title: '手机号码',
  key: 'mobile',
  render: val => (<span>{val.mobile_code}&nbsp;{val.mobile}</span>),
}, {
  title: 'Mobi用户名',
  dataIndex: 'mobi_id',
  key: 'mobi_id',
}, {
  title: '账户状态',
  dataIndex: 'status',
  key: 'status',
  render: val => (<Filter value={val} keyname="accountStatus" />),
}, {
  title: '操作',
  dataIndex: 'id',
  key: 'check',
  render: val => (<Link to={`/user-management/user-detail/${val}`}>查看</Link>),
}];

const expandedColumns = [{
  title: '货币',
  dataIndex: 'currency',
  key: 'currency',
}, {
  title: '地址',
  dataIndex: 'address',
  key: 'address',
}];

@Form.create()

@connect(state => ({
  usermanagement: state.usermanagement,
}))

export default class UserList extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'usermanagement/fetchPlatformInfo' });
    dispatch({
      type: 'usermanagement/fetchList',
      payload: {
        start_time: moment().subtract(7, 'day').unix(),
        end_time: moment().unix(),
        page: 1,
        per_page: 15,
      },
    });
  }

  onPageChange = (pagination) => {
    const { dispatch, form } = this.props;
    const { getFieldValue } = form;
    const parmas = {
      country_en: _.map(getFieldValue('country_en')).join(','),
      mobile_code: getFieldValue('mobile_code'),
      mobi_id: getFieldValue('mobi_id'),
      mobile: getFieldValue('mobile'),
      status: getFieldValue('status')[0],
      digital_address: getFieldValue('digital_address'),
      page: pagination.current,
      per_page: pagination.pageSize,
    };
    const rangeValue = getFieldValue('range-picker');
    let start = null;
    let end = null;

    if (rangeValue) {
      const values = [rangeValue[0].format(dateFormat), rangeValue[1].format(dateFormat)];
      start = moment(values[0]).unix();
      end = moment(values[1]).unix();
      parmas.start_time = start;
      parmas.end_end = end;
    }
    if (parmas.country_en === '') {
      delete parmas.country_en;
    }
    if (parmas.mobi_id === '') {
      delete parmas.mobi_id;
    }
    if (getFieldValue('status').length > 1) {
      delete parmas.status;
    }
    dispatch({
      type: 'usermanagement/fetchList',
      payload: parmas,
    });
  }

  getAddress = (expanded, record) => {
    if (expanded) {
      const { dispatch } = this.props;
      dispatch({
        type: 'usermanagement/fetchUserAddress',
        payload: {
          customer_id: record.id,
        },
      });
    }
  }

  resetForm = (e) => {
    e.preventDefault();
    this.props.form.resetFields();
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { dispatch } = this.props;
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      const parmas = {
        country_en: _.map(fieldsValue.country_en).join(','),
        mobile_code: fieldsValue.mobile_code,
        mobi_id: fieldsValue.mobi_id,
        mobile: fieldsValue.mobile,
        status: fieldsValue.status[0],
        digital_address: fieldsValue.digital_address,
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
      if (parmas.country_en === '') {
        delete parmas.country_en;
      }
      if (parmas.mobi_id === '') {
        delete parmas.mobi_id;
      }
      if (fieldsValue.status.length > 1) {
        delete parmas.status;
      }
      dispatch({
        type: 'usermanagement/fetchList',
        payload: parmas,
      });
    });
  }

  render() {
    const { platformInfo, userList, addressList, loading, expandedLoading }
     = this.props.usermanagement;
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
      <div>
        <Card
          style={{ marginBottom: 24 }}
          bordered={false}
          bodyStyle={{ padding: 0 }}
          className={style.gridStyle}
        >
          <Row>
            <Col span={6}>
              <Card.Grid>
                <Meta
                  title="已注册用户数量"
                  description={`${platformInfo.customers_count}`}
                />
              </Card.Grid>
            </Col>
            <Col span={6}>
              <Card.Grid>
                <Meta
                  title="注册国家／地区数量"
                  description={`${platformInfo.countries_count}`}
                />
              </Card.Grid>
            </Col>
            <Col span={6}>
              <Card.Grid>
                <Meta
                  title="已激活用户数量"
                  description={`${platformInfo.activated_customers_count}`}
                />
              </Card.Grid>
            </Col>
            <Col span={6}>
              <Card.Grid>
                <Meta
                  title="已锁定用户数量"
                  description={`${platformInfo.deactivated_customers_count}`}
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
                  label="注册国家"
                >
                  {getFieldDecorator('country_en')(
                    <Select
                      showSearch
                      mode="tags"
                      optionFilterProp="children"
                    >
                      { countrys.map(cuntry => (
                        <Option key={cuntry.iso2} value={cuntry.iso2}>{cuntry.name}</Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={11} offset={1}>
                <FormItem
                  {...formItemLayout}
                  label="数字货币地址："
                >
                  {getFieldDecorator('digital_address')(
                    <Input />
                  )}
                </FormItem>
              </Col>
              <Col span={11}>
                <FormItem
                  {...formItemLayout}
                  label="账户状态："
                >
                  {getFieldDecorator('status', {
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
              <Col span={11} offset={1}>
                <FormItem
                  {...formItemLayout}
                  label="Mobi用户名："
                >
                  {getFieldDecorator('mobi_id', {
                    initialValue: '',
                    normalize: (value) => {
                      return value.replace(/\s*$/g, '');
                    },
                  })(
                    <Input />
                  )}
                </FormItem>
              </Col>
            </Row>
            <FormItem>
              <Row>
                <Col span={24} style={{ textAlign: 'right' }}>
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
                  数据条目:<b>{userList.pagination.total}</b>
                </div>
              )}
              type="info"
              showIcon
            />
          </div>
          <Table
            loading={loading}
            columns={columns}
            pagination={userList.pagination}
            dataSource={userList.list}
            onChange={this.onPageChange}
            rowKey={list => list.id}
            expandedRowRender={
              list => (
                <Table
                  loading={expandedLoading}
                  dataSource={addressList[list.id]}
                  pagination={false}
                  columns={expandedColumns}
                  rowKey="currency"
                />
              )
            }
            onExpand={this.getAddress}
          />
        </Card>
      </div>
    );
  }
}
