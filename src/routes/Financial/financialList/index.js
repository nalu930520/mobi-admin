import React , {PureComponent} from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Table ,Form, DatePicker, Button, Tabs} from 'antd';
import moment from 'moment';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import { numberFormat } from '../../../utils/utils';

const { MonthPicker } = DatePicker;
const { TabPane } = Tabs;
const FormItem = Form.Item;

const operationTabList = [{
  key: 'tab1',
  tab: '法币兑换',
}, {
  key: 'tab2',
  tab: '比特币兑换',
}, {
  key: 'tab3',
  tab: '网络费',
}];
@connect(state => ({
  financial: state.financialList,
}))
@Form.create()
export default class FinancialList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      operationkey: 'tab1',
      monthValue: "",
    };
    this.columns1 = [{
      title: '货币',
      dataIndex: 'currency_code',
      width: '70%',
      key: 'currency_code',
    }, {
      title: '美元收入',
      dataIndex: 'usd_revenue',
      width: '30%',
      key: 'usd_revenue',
      render: val => (
        <span>{numberFormat(val,8)}
        </span>
      ),
    }];
    this.columns2 = [{
      title: '货币',
      dataIndex: 'currency_code',
      width: '70%',
      key: 'currency_code',
    }, {
      title: '比特币收入',
      dataIndex: 'amount',
      width: '30%',
      key: 'amount',
      render: val => (
        <span>{numberFormat(val,8)}
        </span>
      ),
    }];
    this.columns3 = [{
      title: '货币',
      dataIndex: 'currency_code',
      width: '20%',
      key: 'currency_code',
    }, {
      title: '用户支付费用',
      dataIndex: 'customer_pay_mobi_fee',
      width: '25%',
      key: 'customer_pay_mobi_fee',
      render: val => (
        <span>{numberFormat(val,8)}
        </span>
      ),
    },{
      title: 'Mobi支付区块链费用（预估）',
      dataIndex: 'mobi_pay_network_fee',
      width: '25%',
      key: 'mobi_pay_network_fee',
      render: val => (
        <span>{numberFormat(val,8)}
        </span>
      ),
    }, {
      title: '收入',
      dataIndex: 'revenue',
      width: '30%',
      key: 'revenue',
      render: val => (
        <span>{numberFormat(val,8)}
        </span>
      ),
    }];
  }

  componentDidMount() {
    const monthValue = moment().subtract(1, 'month').format('YYYY-MM');
    this.setState({
      monthValue: monthValue,
    });
    var monInit = Date.parse(new Date(monthValue))/1000;
    this.queryList(monInit);
  }
  queryList(start){
    const { dispatch } = this.props;    
    dispatch({
      type: 'financialList/queryFinancialList',
      payload: {
        start: start
      },
    });
  }
  onOperationTabChange = (key) => {
    this.setState({ operationkey: key });
  }
  disabledDate(current) {
    return current && current > moment().endOf('month').subtract(1, 'month');
  }
  handleSubmit = (e) => {
    e.preventDefault();
    const { dispatch } = this.props;
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      const dateValue = fieldsValue['month-picker'];
      if (dateValue) {
        //获取到当前月份第一天转成时间戳
        var mon = Date.parse(new Date(dateValue.format('YYYY-MM')))/1000;
        this.queryList(mon);
      }
    });
  }
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      monthValue: null,
    });
  }
  render() {
    const { monthValue } = this.state ;
    const { getFieldDecorator } = this.props.form;
    const { fiat_exchange_object_list, 
            digital_exchange_object_list, 
            network_fee_object_list, 
            tabLoading} = this.props.financial;
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
    const tabDefaultValue = operationTabList && (operationTabList.filter(item => item.default)[0] || operationTabList[0]);    
    const contentList = {
      tab1: <Table
        dataSource={fiat_exchange_object_list}
        columns={this.columns1}
        pagination={false}
        rowKey="currency_code"
        loading={tabLoading}
      />,
      tab2: <Table
        dataSource={digital_exchange_object_list}
        columns={this.columns2}
        pagination={false}
        rowKey="currency_code"
        loading={tabLoading}
      />,
      tab3: <Table
        dataSource={network_fee_object_list}
        columns={this.columns3}
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
                  label="选择月份："
                  {...formItemLayout }
                >
                  {getFieldDecorator('month-picker', {
                    initialValue :monthValue ? moment(monthValue, 'YYYY-MM'): monthValue,
                    rules: [
                      {
                        required: true,
                        message: '请选择月份',
                      },
                    ],
                  })(
                    <MonthPicker disabledDate={this.disabledDate}  style={{ width: '100%' }} placeholder={'请选择月份'}
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
            onChange={this.onOperationTabChange}
            style = {{paddingLeft :'-2px'}}
          >
            {
              operationTabList.map(item => <TabPane tab={item.tab} key={item.key} />)
            }
          </Tabs>
          {contentList[this.state.operationkey]}
        </Card>
      </PageHeaderLayout>
    );
  }
}
