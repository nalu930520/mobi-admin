import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Table, Form, DatePicker, Button, Tabs } from 'antd';
import moment from 'moment';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import { numberFormat, getcurrencyBycode } from '../../../utils/utils';

const { TabPane } = Tabs;
const FormItem = Form.Item;

const operationTabList = [{
  key: 'tab1',
  tab: ' 资产',
}, {
  key: 'tab2',
  tab: '负债',
}];
@connect(state => ({
  auditReport: state.auditReport,
}))
@Form.create()
export default class AuditReport extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      curValue: moment().subtract(1, 'days'),
    };
    this.columns1 = [{
      title: '钱包名称',
      dataIndex: 'wallet_type',
      key: 'wallet_type',
    }, {
      title: '货币',
      dataIndex: 'currency',
      key: 'currency',
    }, {
      title: '期初结余',
      key: 'start_surplus',
      render: val => (
        <span>
          {numberFormat(val.start_surplus, 0)}
        </span>
      ),
    }, {
      title: '借（入）',
      key: 'borrow_asset',
      render: val => (
        <span>
          {numberFormat(val.borrow_asset, 0)}
        </span>
      ),
    }, {
      title: '笔数',
      dataIndex: 'borrow_count',
      key: 'borrow_count',
    }, {
      title: '贷（出）',
      key: 'lend_asset',
      render: val => (
        <span>
          {numberFormat(val.lend_asset, 0)}
        </span>
      ),
    }, {
      title: '笔数',
      dataIndex: 'lend_count',
      key: 'lend_count',
    }, {
      title: '期末结余',
      key: 'end_surplus',
      render: val => (
        <span>
          {numberFormat(val.end_surplus, 0)}
        </span>
      ),
    }];
    this.columns2 = [{
      title: '货币',
      dataIndex: 'currency',
      width: '70%',
      key: 'currency',
    }, {
      title: '期终余额',
      width: '30%',
      key: 'end_surplus',
      render: val => (
        <span>
          {numberFormat(val.end_surplus, 0)}
        </span>
      ),
    }];
  }

  componentDidMount() {
    const dateInit = this.state.curValue.unix();
    // console.info(dateInit, 'dateInit----');
    this.queryList(dateInit);
  }
  queryList(query_time) {
    const { dispatch } = this.props;
    dispatch({
      type: 'auditReport/queryAuditInfo',
      payload: {
        query_time,
      },
    });
  }

  disabledDate = (current) => {
    return current && current > moment().subtract(1, 'days');
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      const dateValue = fieldsValue['date-picker'];
      if (dateValue) {
        // 获取到当前月份第一天转成时间戳
        this.queryList(dateValue.unix());
      }
    });
  }
  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      curValue: null,
    });
  }
  render() {
    const { curValue } = this.state;
    const { getFieldDecorator } = this.props.form;
    const {
      assets,
      liabilities,
      tabLoading } = this.props.auditReport;
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
    const tabDefaultValue = operationTabList &&
      (operationTabList.filter(item => item.default)[0] || operationTabList[0]);
    const contentList = {
      tab1: <Table
        dataSource={assets}
        columns={this.columns1}
        pagination={false}
        rowKey="currency_code"
        loading={tabLoading}
      />,
      tab2: <Table
        dataSource={liabilities}
        columns={this.columns2}
        pagination={false}
        rowKey="currency_code"
        loading={tabLoading}
      />,
    };
    return (
      <PageHeaderLayout title="收入报表">
        <Card>
          <Form onSubmit={this.handleSubmit}>
            <Row>
              <Col span={11}>
                <FormItem
                  label="选择日期："
                  {...formItemLayout}
                >
                  {getFieldDecorator('date-picker', {
                    initialValue: curValue,
                    rules: [
                      {
                        required: true,
                        message: '请选择日期',
                      },
                    ],
                  })(
                    <DatePicker
                      disabledDate={this.disabledDate}
                      style={{ width: '100%' }}
                      placeholder="请选择日期"
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={11} offset={2}>
                <FormItem>
                  <Row>
                    <Col span={24} style={{ textAlign: 'right' }}>
                      <Button type="primary" htmlType="submit">查询</Button>
                      &nbsp;
                      <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
                    </Col>
                  </Row>
                </FormItem>
              </Col>
            </Row>
          </Form>
          <Tabs
            defaultActiveKey={(tabDefaultValue && tabDefaultValue.key)}
            style={{ paddingLeft: '-2px' }}
          >
            {
              operationTabList.map(item =>
                (
                  <TabPane
                    tab={item.tab}
                    key={item.key}
                  >
                    {contentList[item.key]}
                  </TabPane>
                )
              )
            }
          </Tabs>
         
        </Card>
      </PageHeaderLayout>
    );
  }
}
