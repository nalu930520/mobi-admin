import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import _ from 'lodash';
import { Select, Radio, Row, Col, Card, Form, Alert, Table, Button, DatePicker } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import styles from './index.less';
import CurrencySelect from '../../../components/CurrencySelect';
import AddLabelNoteModal from './AddLabelNoteModal';
import Filter from '../../../filter';
import { numberFormat, getcurrencyBycode, codeTocurrencyCode } from '../../../utils/utils.js';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

const RadioGroup = Radio.Group;
const typeOptions = [
  { label: '全部类型', value: '' },
  { label: '对冲', value: '1' },
  { label: '兑换', value: '2' },
];
const directionOptions = [
  { label: '全部类型', value: '' },
  { label: '做多', value: '1' },
  { label: '做空', value: '2' },
];

@connect(state => ({
  hedging: state.hedging,
}))
@Form.create()
export default class History extends PureComponent {
  state = {
    addLabelNoteModalVisable: false,
    labelId: '',
    labelNote: '',
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'hedging/fetchHedgePlatform',
    });
    dispatch({
      type: 'hedging/fetchOperationUser',
    });
  }

  onPageChange = (pagination) => {
    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        type: fieldsValue.type,
        operation_direction: fieldsValue.operation_direction,
        start: fieldsValue.dateRange ? fieldsValue.dateRange[0].unix() : '',
        end: fieldsValue.dateRange ? fieldsValue.dateRange[1].unix() : '',
        operatopm_platform: fieldsValue.SN,
        source_currency: fieldsValue.source_currency,
        target_currency: fieldsValue.target_currency,
        user_name: fieldsValue.user_name,
      };
      for (const key in values) {
        if (!values[key]) {
          delete values[key];
        }
      }
      dispatch({
        type: 'hedging/fetchHedgeRecords',
        payload: {
          ...values,
          page: pagination.current,
          per_page: pagination.pageSize,
        },
      });
    });
  }

  setNoteLabelId = (id, note) => {
    this.setState({ labelId: id });
    this.setState({ labelNote: note });
  }

  showModal = (type) => {
    this.setState({
      [type]: true,
    });
  }

  handleCancel = (type) => {
    this.setState({
      [type]: false,
    });
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    dispatch({
      type: 'hedging/fetchHedgeRecords',
      payload: {
        page: 1,
        per_page: 10,
      },
    });
  }

  handleSearch = (e) => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        type: fieldsValue.type,
        operation_direction: fieldsValue.operation_direction,
        start: fieldsValue.dateRange ? fieldsValue.dateRange[0].unix() : '',
        end: fieldsValue.dateRange ? fieldsValue.dateRange[1].unix() : '',
        operation_platform: _.map(fieldsValue.operation_platform).join(','),
        source_currency: fieldsValue.source_currency,
        target_currency: fieldsValue.target_currency,
        user_name: fieldsValue.user_name,
      };
      for (const key in values) {
        if (!values[key]) {
          delete values[key];
        }
      }
      dispatch({
        type: 'hedging/fetchHedgeRecords',
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
    const { platformList, operationUser } = this.props.hedging;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
            <FormItem label="操作类型">
              {getFieldDecorator('type', {
                initialValue: '',
              })(
                <RadioGroup
                  options={typeOptions}
                />
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="操作方向">
              {getFieldDecorator('operation_direction', {
                initialValue: '',
              })(
                <RadioGroup
                  options={directionOptions}
                />
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
            <FormItem label="外部操作平台">
              {getFieldDecorator('operation_platform')(
                <Select mode="multiple">
                  { platformList.list && platformList.list.map(obj => (
                    <Option key={obj.id} value={obj.id}>{obj.name}</Option>)
                  )}
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
            <FormItem label="原始货币">
              {getFieldDecorator('source_currency')(
                <CurrencySelect />
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
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
            <FormItem label="操作人">
              {getFieldDecorator('user_name')(
                <Select>
                  {operationUser && operationUser.map(obj =>
                    (<Option value={obj.user_name} key={obj.user_name}>{obj.user_name}</Option>))
                  }
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
    const { hedgeRecordsLoading, historyList, platformList } = this.props.hedging;
    const columns = [
      {
        title: '创建时间',
        render: record => (
          <span>
            {moment(record.created_at * 1000).format('YYYY-MM-DD HH:mm:ss')}
          </span>
        ),
        key: 'time',
      },
      {
        title: '类型',
        dataIndex: 'type',
        render: val => (<Filter value={val} keyname="hedgeType" />),
        key: 'type',
      },
      {
        title: '源货币',
        dataIndex: 'source_currency',
        render: val => val.toUpperCase(),
        key: 'source_currency',
      },
      {
        title: '方向',
        dataIndex: 'amount_symbol',
        key: 'amount_symbol',
      },
      {
        title: '价格',
        key: 'rate',
        render: val => (
          <span>{numberFormat(val.rate,
            getcurrencyBycode('usd').decimal_place)}&nbsp;{codeTocurrencyCode('usd')}
          </span>
        ),
      },
      {
        title: '处理前剩余数量',
        key: 'source_pre_amount',
        render: val => (
          <span>{numberFormat(val.source_pre_amount,
            getcurrencyBycode(val.source_currency).decimal_place)}
            &nbsp;{codeTocurrencyCode(val.source_currency)}
          </span>
        ),
      },
      {
        title: '处理数量',
        key: 'source_handled_amount',
        render: val => (
          <span>{numberFormat(val.source_handled_amount,
            getcurrencyBycode(val.source_currency).decimal_place)}
            &nbsp;{codeTocurrencyCode(val.source_currency)}
          </span>
        ),
      },
      {
        title: '处理后剩余数量',
        key: 'after_amount',
        render: val => (
          <span>{numberFormat((Number(val.source_pre_amount) + Number(val.source_handled_amount)),
            getcurrencyBycode(val.source_currency).decimal_place)}
            &nbsp;{codeTocurrencyCode(val.source_currency)}
          </span>
        ),
      },
      {
        title: '目标货币',
        dataIndex: 'target_currency',
        render: val => val.toUpperCase(),
        key: 'target_currency',
      },
      {
        title: '处理前剩余数量',
        key: 'target_pre_amount',
        render: val => (
          <span>{numberFormat(val.target_pre_amount,
            getcurrencyBycode(val.target_currency).decimal_place)}
            &nbsp;{codeTocurrencyCode(val.target_currency)}
          </span>
        ),
      },
      {
        title: '处理数量',
        key: 'target_handled_amount',
        render: val => (
          <span>{numberFormat(val.target_handled_amount,
            getcurrencyBycode(val.target_currency).decimal_place)}
            &nbsp;{codeTocurrencyCode(val.target_currency)}
          </span>
        ),
      },
      {
        title: '处理后剩余数量',
        key: 'target_after_amount',
        render: val => (
          <span>{numberFormat((Number(val.target_pre_amount) + Number(val.target_handled_amount)),
            getcurrencyBycode(val.target_currency).decimal_place)}
            &nbsp;{codeTocurrencyCode(val.target_currency)}
          </span>
        ),
      },
      {
        title: '操作人',
        dataIndex: 'user_name',
        key: 'user_name',
      },
      {
        title: '操作平台',
        dataIndex: 'operation_platform',
        key: 'operation_platform',
        render: val => (
          <span>
            { !_.isEmpty(_.filter(platformList.list, { id: val })) ? _.filter(platformList.list, { id: val })[0].name : ''}
          </span>
        ),
      },
      {
        title: '备注',
        dataIndex: 'label_note',
        key: 'label_note',
      },
      {
        title: '操作',
        render: record => (
          <span>
            <a onClick={() => { this.showModal('addLabelNoteModalVisable'); this.setNoteLabelId(record.id, record.label_note); }}>查看标注</a>
          </span>
        ),
        key: 'operation',
      },
    ];


    return (
      <PageHeaderLayout title="订单列表">
        <AddLabelNoteModal
          visible={this.state.addLabelNoteModalVisable}
          labelId={this.state.labelId}
          labelNote={this.state.labelNote}
          handleCancel={() => { this.handleCancel('addLabelNoteModalVisable'); }}
        />
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderSimpleForm()}
            </div>
            <div className={styles.tableAlert}>
              <Alert
                message={(
                  <div>
                    数据条目:<b>{historyList.pagination.total}</b>
                  </div>
                )}
                type="info"
                showIcon
              />
            </div>
            <br />
            <br />
            <Table
              loading={hedgeRecordsLoading}
              columns={columns}
              dataSource={historyList.list}
              pagination={historyList.pagination}
              onChange={this.onPageChange}
              rowKey="time"
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
