import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import moment from 'moment';
import { Row, Col, Tabs, Card, Form, Avatar, Table, DatePicker, Button } from 'antd';
import { numberFormat, getcurrencyBycode, codeTocurrencyCode } from '../../../utils/utils';
import SearchList from '../../C2C/List/SearchList';

const { Meta } = Card;
const { RangePicker } = DatePicker;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const dateFormat = 'YYYY-MM-DD';


const operationTabList = [{
  key: 'tab1',
  tab: '全部',
}, {
  key: 'tab2',
  tab: '数字货币',
}, {
  key: 'tab3',
  tab: '法币',
}];

const columns = [{
  title: '货币',
  dataIndex: 'currency_code',
  key: 'currency_code',
  render: val => val.toUpperCase(),
}, {
  title: '当日资产',
  key: 'current_asset',
  render: val => (
    <span>{numberFormat(val.current_asset,
      getcurrencyBycode(val.currency_code).decimal_place)}
    </span>
  ),
}, {
  title: '同比昨日资产变更量',
  key: 'asset_change_amount',
  render: val => (
    <span>{val.asset_change_amount > 0 ? '+' : ''}{numberFormat(val.asset_change_amount,
      getcurrencyBycode(val.currency_code).decimal_place)}
    </span>
  ),
}, {
  title: '同比昨日资产变更百分比',
  dataIndex: 'asset_change_rate',
  key: 'asset_change_rate',
  render: val => (<span>{(val * 100).toFixed(2)}%</span>)
}];

@connect(state => ({
  assets: state.assets,
}))
@Form.create()
export default class DailyAssetsChange extends PureComponent {
  state = {
    operationkey: moment().format(dateFormat),
    dateTabList: [],
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'assets/fetchAssetsChange',
      payload: {
        created_at: moment().unix(),
      },
    });
    this.calculateDateList(15, moment());
  }

  onOperationTabChange = (key) => {
    this.setState({ operationkey: key });
    const { dispatch } = this.props;
    dispatch({
      type: 'assets/fetchAssetsChange',
      payload: {
        created_at: moment(key).unix(),
      },
    });
  }

  calculateDateList = (days, endDate) => {
    const date = [];
    date.push(endDate.format(dateFormat));
    for (let i = 1; i < days; i++) {
      date.push(endDate.subtract(1, 'days').format(dateFormat));
    }
    this.setState({
      dateTabList: date,
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      const rangeValue = fieldsValue['range-picker'];
      const values = [rangeValue[0].format(dateFormat), rangeValue[1].format(dateFormat)];
      const start = moment(values[0]);
      const end = moment(values[1]);
      const days = end.diff(start, 'days');
      this.calculateDateList(days, end);
    });
  }

  render() {
    const { dailyAssetsList, loading } = this.props.assets;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 2 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 22 },
      },
    };
    return (
      <Card>
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            label="选择时间："
            {...formItemLayout}
          >
            {getFieldDecorator('range-picker', {
              initialValue: [moment(moment().subtract(15, 'day')), moment(moment().format(dateFormat))],
              rules: [{ type: 'array', required: true, message: 'Please select time!' }],
            })(
              <RangePicker
                format={dateFormat}
              />
            )}
          </FormItem>
          <FormItem>
            <Row>
              <Col span={24} style={{ textAlign: 'right' }}>
                <Button type="primary" htmlType="submit">查询</Button>
              </Col>
            </Row>
          </FormItem>
        </Form>
        <Tabs type="card" activeKey={this.state.operationkey} onChange={this.onOperationTabChange}>
          {this.state.dateTabList.map(tab => (
            <TabPane tab={tab} key={tab}>
              <Card
                title={tab}
              >
                <Table
                  loading={loading}
                  dataSource={dailyAssetsList.list}
                  pagination={false}
                  rowKey="currency_code"
                  columns={columns}
                />
              </Card>
            </TabPane>
          ))}
        </Tabs>
      </Card>
    );
  }
}
