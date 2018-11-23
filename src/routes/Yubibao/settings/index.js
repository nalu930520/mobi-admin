import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, Form, Button, Input, TimePicker, message, Tooltip } from 'antd';
import StandardTable from '../../../components/StandardTable';
import CurrencySelect from '../../../components/CurrencySelect';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import styles from './index.less';
import bg from 'bignumber.js';
const FormItem = Form.Item;
@connect(state => ({
  yubiBao: state.yubiBao,
}))
@Form.create()
export default class depositList extends PureComponent {
  state = {
    selectedRows: [],
    formValues: {},
    showDetailModal: false,
    detailData: {},
    upperLimit: false,
    transferIncome: false,
    transferredlimit: false,
    arrivalDate: false,
    revenueTimef: false,
    incomeToday: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    console.log("触发了Nci ")
    // 获取初始值
    dispatch({
      type: 'yubiBao/fetchDayInitSetting',
      payload: {
        currency_code: 'btc'
      }
    });
    // 资金池总额req
    dispatch({
      type: 'yubiBao/fetChfundsSum',
      payload: {
        currency_code: 'btc'
      }
    });
    // 七日年化
    dispatch({
      type: 'yubiBao/fetchAddSevenList',
      payload: {
        page: 1,
        per_page: 10,
        currency_code: 'btc'
      },
    });
  }
  // 切换币种
  handleCurrencyChange = (value) => {
    const { dispatch } = this.props;
    // 资金池总额req
    dispatch({
      type: 'yubiBao/fetChfundsSum',
      payload: {
        currency_code: value
      }
    })
    // 七日年化
    dispatch({
      type: 'yubiBao/fetchAddSevenList',
      payload: {
        page: 1,
        per_page: 10,
        currency_code: value
      },
    }); 
    // 获取初始值
    dispatch({
      type: 'yubiBao/fetchDayInitSetting',
      payload: {
        currency_code: value
      }
    });
  }
  handleStandardTableChange = (pagination) => {
    const { dispatch } = this.props;
    const params = {
      page: pagination.current,
      per_page: pagination.pageSize,
      currency_code: this.props.form.getFieldValue('currency_code')
    };
    dispatch({
      type: 'yubiBao/fetchAddSevenList',
      payload: params
    });
  }
  renderSimpleForm(dataStr) {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
            <FormItem label="币种">
              {getFieldDecorator('currency_code', {
                initialValue: 'btc'
              })(
                <CurrencySelect currencyType="C" onChange={this.handleCurrencyChange} />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
            <FormItem label="当前资金池总额">
              <Row>
                <Col md={24} style={{ fontSize: '25px', color: 'red' }}>{dataStr} <span style={{ fontSize: '14px', color: '#000' }}>BTC</span></Col>
              </Row>
            </FormItem>
          </Col>
        </Row>
      </Form>
    )
  }
  // 设置
  setUpperLimit = (id, status, parameter, e) => {
    const { dispatch } = this.props;
    let toggle = (identification, sta) => {
      switch (identification) {
        case 0:
          this.setState({ upperLimit: sta });
          break;
        case 1:
          this.setState({ transferIncome: sta });
          break;
        case 2:
          this.setState({ transferredlimit: sta });
          break;
        case 3:
          this.setState({ arrivalDate: sta });
          break;
        case 4:
          this.setState({ revenueTimef: sta });
          break;
        default:
          this.setState({ incomeToday: sta });
      }
    }
    if (status === 'setting') {
      toggle(id, true)
    } else if (status === 'req') {
      toggle(id, false)
      switch (parameter) {
        // 资金池总额
        case 'pool_max':
          dispatch({
            type: 'yubiBao/fetchDaySetting',
            payload: {
              currency_code: this.props.form.getFieldValue('currency_code'),
              pool_max: this.props.form.getFieldValue('pool_max')
            }
          })
          break;
        // 转入收益日期
        case 'start_day':
          dispatch({
            type: 'yubiBao/fetchDaySetting',
            payload: {
              currency_code: this.props.form.getFieldValue('currency_code'),
              start_day: Number(this.props.form.getFieldValue('start_day'))
            }
          })
          break;
        // 用户每日限额
        case 'daily_balance':
          dispatch({
            type: 'yubiBao/fetchDaySetting',
            payload: {
              currency_code: this.props.form.getFieldValue('currency_code'),
              daily_balance: this.props.form.getFieldValue('daily_balance')
            }
          })
          break;
        // 最晚计算收益时间
        case 'start_time':
          dispatch({
            type: 'yubiBao/fetchDaySetting',
            payload: {
              currency_code: this.props.form.getFieldValue('currency_code'),
              start_time: moment(this.props.form.getFieldValue('start_time')).format('HH:mm:ss')
            }
          })
          break;
        // 每币收益 
        case 'today_per_coin_benefit':
        console.log('发送每币收益接口')
          dispatch({
            type: 'yubiBao/fetchAddIncome',
            payload: {
              currency_code: this.props.form.getFieldValue('currency_code'),
              today_per_coin_benefit: this.props.form.getFieldValue('today_per_coin_benefit')
            }
          })
          break;
        // 收益到账日期   
        case 'grant_day':
          dispatch({
            type: 'yubiBao/fetchDaySetting',
            payload: {
              currency_code: this.props.form.getFieldValue('currency_code'),
              grant_day: Number(this.props.form.getFieldValue('grant_day'))
            }
          })
      }
    } else {
      toggle(id, false)
    }
  }

  renderOption(configCase) {
    const { upperLimit, transferIncome, transferredlimit, arrivalDate, revenueTimef, incomeToday } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Row gutter={16}>
          <Col className="gutter-row" span={12}>
            <div className="gutter-box">
              <FormItem label="资金池上限:">
                <Row>
                  <Col md={5}>
                    {
                      upperLimit ? (
                        <div>
                          {getFieldDecorator('pool_max', {
                            initialValue: configCase.pool_max,
                          })(<Input />)}
                        </div>) : <div>
                          {configCase.pool_max}
                        </div>
                    }
                  </Col>
                  <Col md={2}>BTC</Col>
                  <Col md={17}>
                    <Row>
                      {
                        upperLimit ? (
                          <div>
                            <Col md={12}>
                              <Button type="primary" onClick={() => { this.setUpperLimit(0, 'req', 'pool_max') }}>完成</Button>
                              <Tooltip title="生效时间">
                              {/* <span>{configCase.date}</span> */}
                              <span>{moment.unix(configCase.date).format('YYYY-MM-DD')}</span> 
                              </Tooltip>
                               
                            </Col>
                            <Col md={12}>
                              <Button type="danger" onClick={() => { this.setUpperLimit(0, 'close') }}>取消</Button>
                            </Col>
                          </div>) : (
                            <Button type="primary" onClick={() => { this.setUpperLimit(0, 'setting') }}>设置</Button>
                          )
                      }
                    </Row>
                  </Col>
                </Row>
              </FormItem>
            </div>
          </Col>
          <Col className="gutter-row" span={12}>
            <div className="gutter-box">
              <FormItem label="转入收益计算日期:">
                <Row>
                  <Col md={5}>
                    {
                      transferIncome ? (
                        <div>
                          <Row>
                            <Col md={6}>
                             T+
                            </Col>
                            <Col md={18}>
                                {getFieldDecorator('start_day', {
                                initialValue: configCase.start_day,
                              })(<Input />)}
                            </Col>
                          </Row>  
                        </div>) : <div>
                          T+ {configCase.start_day}
                        </div>
                    }
                  </Col>
                  <Col md={1}>日</Col>
                  <Col md={18}>
                    <Row>
                      {
                        transferIncome ? (
                          <div>
                            <Col md={12}>
                              <Button type="primary" onClick={() => { this.setUpperLimit(1, 'req', 'start_day') }}>完成 </Button>
                              <Tooltip title="生效时间"> 
                              <span>{moment.unix(configCase.date).format('YYYY-MM-DD')}</span> 
                              </Tooltip>
                            </Col>
                            <Col md={12}>
                              <Button type="danger" onClick={() => { this.setUpperLimit(1, 'close') }}>取消</Button>
                            </Col>
                          </div>) : (
                            <Button type="primary" onClick={() => { this.setUpperLimit(1, 'setting') }}>设置</Button>
                          )
                      }
                    </Row>
                  </Col>
                </Row>
              </FormItem>
            </div>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col className="gutter-row" span={12}>
            <div className="gutter-box">
              <FormItem label="用户每日转入限额:">
                <Row>
                  <Col md={3}>
                    {
                      transferredlimit ? (
                        <div>
                          {getFieldDecorator('daily_balance', {
                            initialValue: configCase.daily_balance,
                          })(<Input />)}
                        </div>) : <div>
                          {configCase.daily_balance}
                        </div>
                    }
                  </Col>
                  <Col md={2}>BTC</Col>
                  <Col md={19}>
                    <Row>
                      {
                        transferredlimit ? (
                          <div>
                            <Col md={12}>
                              <Button type="primary" onClick={() => { this.setUpperLimit(2, 'req', 'daily_balance') }}>完成</Button>
                              <Tooltip title="生效时间">
                              <span>{moment.unix(configCase.date).format('YYYY-MM-DD')}</span> 
                              </Tooltip>
                            </Col>
                            <Col md={12}>
                              <Button type="danger" onClick={() => { this.setUpperLimit(2, 'close') }}>取消</Button>
                            </Col>
                          </div>) : (
                            <Button type="primary" onClick={() => { this.setUpperLimit(2, 'setting') }}>设置</Button>
                          )
                      }
                    </Row>
                  </Col>
                </Row>
              </FormItem>
            </div>
          </Col>
          <Col className="gutter-row" span={12}>
            <div className="gutter-box">
              <FormItem label="收益到账日期:">
                <Row>
                  <Col md={5}>
                    {
                      arrivalDate ? (
                        <div>
                            <Row>
                              <Col md={8}>
                              T+
                              </Col>
                              <Col md={16}>
                              {getFieldDecorator('grant_day', {
                              initialValue: configCase.grant_day,
                              })(<Input />)}
                              </Col>
                            </Row>  
                        </div>) : <div>
                         T+ {configCase.grant_day}
                        </div>
                    }
                  </Col>
                  <Col md={1}>日</Col>
                  <Col md={18}>
                    <Row>
                      {
                        arrivalDate ? (
                          <div>
                            <Col md={12}>
                              <Button type="primary" onClick={() => { this.setUpperLimit(3, 'req', 'grant_day') }}>完成</Button>
                              <Tooltip title="生效时间">
                              <span>{moment.unix(configCase.date).format('YYYY-MM-DD')}</span> 
                              </Tooltip>
                            </Col>
                            <Col md={12}>
                              <Button type="danger" onClick={() => { this.setUpperLimit(3, 'close') }}>取消</Button>
                            </Col>
                          </div>) : (
                            <Button type="primary" onClick={() => { this.setUpperLimit(3, 'setting') }}>设置</Button>
                          )
                      }
                    </Row>
                  </Col>
                </Row>
              </FormItem>
            </div>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col className="gutter-row" span={24}>
            <div className="gutter-box">
              <FormItem label="最晚计算收益时间:">
                <Row>
                  <Col md={2}>北京时间</Col>
                  <Col md={3}>
                    {
                      revenueTimef ? (
                        <div>
                          {getFieldDecorator('start_time', {
                            initialValue: moment(configCase.start_time, 'HH:mm:ss'),
                          })(<TimePicker />)}
                        </div>) : <div>
                          {configCase.start_time}
                        </div>
                    }
                  </Col>
                  <Col md={19}>
                    <Row>
                      {
                        revenueTimef ? (
                          <div>
                            <Col md={6}>
                              <Button type="primary" onClick={() => { this.setUpperLimit(4, 'req', 'start_time') }}>完成</Button>
                              <Tooltip title="生效时间">
                              <span>{moment.unix(configCase.date).format('YYYY-MM-DD')}</span> 
                              </Tooltip>
                            </Col>
                            <Col md={6}>
                              <Button type="danger" onClick={() => { this.setUpperLimit(4, 'close') }}>取消</Button>
                            </Col>
                          </div>) : (
                            <Button type="primary" onClick={() => { this.setUpperLimit(4, 'setting') }}>设置</Button>
                          )
                      }
                    </Row>
                  </Col>
                </Row>
              </FormItem>
            </div>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col className="gutter-row" span={12}>
            <div className="gutter-box">
              <FormItem label="今日每币收益:">
                <Row>
                  <Col md={4}>
                    {
                      incomeToday ? (
                        <div>
                          {getFieldDecorator('today_per_coin_benefit', {
                            initialValue: configCase.today_per_coin_benefit,
                          })(<Input />)}
                        </div>) : <div>
                          {configCase.today_per_coin_benefit}
                        </div>
                    }
                  </Col>
                  <Col md={2}>BTC</Col>
                  <Col md={18}>
                    <Row>

                      {
                        incomeToday ? (
                          <div>
                            <Col md={8}>
                              <Button type="primary" onClick={() => { this.setUpperLimit(5, 'req', 'today_per_coin_benefit') }}>完成</Button>
                            </Col>
                            <Col md={8}>
                              <Button type="danger" onClick={() => { this.setUpperLimit(5, 'close') }}>取消</Button>
                            </Col>
                          </div>) : (
                            <Button type="primary" onClick={() => { this.setUpperLimit(5, 'setting') }}>设置</Button>
                          )
                      }
                    </Row>
                  </Col>
                </Row>
              </FormItem>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
  render() {
    const columns = [
      {
        title: '日期',
        dataIndex: 'date',
      },
      {
        title: '每币收益（BTC）',
        dataIndex: 'per_coin',
      },
      {
        title: '七日年化收益率（%）',
        render: record => (
          <span>
           {new bg(String(record.seven_deduce * 100)).toFormat(6)}
          </span>
        ),
      },
    ];
    const { yubiBao: { loading: orderLoading, data, fundsSum, configsObj } } = this.props;
    const { selectedRows } = this.state;
    return (
      <PageHeaderLayout title="币丰堂设置">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderSimpleForm(fundsSum)}
            </div>
            <div className={styles.tableListForm}>
              {this.renderOption(configsObj)}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={orderLoading}
              columns={columns}
              data={data}
              onChange={this.handleStandardTableChange}
            />
            
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}