import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Select, Input, Modal, Row, Col, Table } from 'antd';
import CurrencySelect from '../../../../components/CurrencySelect';

const { Option } = Select;
const { TextArea } = Input;
const FormItem = Form.Item;
const { Column } = Table;

const columns = [{
  title: '',
  dataIndex: 'currency',
  key: 'currency',
}, {
  title: '处理前剩余数量',
  dataIndex: 'pre_amount',
  key: 'pre_amount',
}, {
  title: '处理数量',
  dataIndex: 'handled_amount',
  key: 'handled_amount',
}, {
  title: '处理后剩余数量',
  dataIndex: 'after_amount',
  key: 'after_amount',
}];

@Form.create()

@connect(state => ({
  hedging: state.hedging,
}))

export default class AddHedgeModal extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'hedging/fetchHedgePlatform',
    });
    dispatch({
      type: 'hedging/fetchHedgeDetail',
      payload: {
        currency: 'cny',
      },
    });
  }

  componentWillReceiveProps(nextProps) {
    if (
      !this.props.hedging.closeModal &&
      nextProps.hedging.closeModal
    ) {
      this.props.handleCancel();
    }
  }

  handleOk = () => {
    const { dispatch } = this.props;
    const { currencyPreAmount } = this.props.hedging;
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      dispatch({
        type: 'hedging/addHedgeRecords',
        payload: {
          source_currency: fieldsValue.source_currency,
          source_pre_amount: currencyPreAmount[fieldsValue.source_currency] * 100000000,
          source_handled_amount: fieldsValue.status * fieldsValue.source_handled_amount * 100000000,
          target_currency: fieldsValue.target_currency,
          target_pre_amount: currencyPreAmount[fieldsValue.target_currency] * 100000000,
          target_handled_amount: fieldsValue.status * fieldsValue.source_handled_amount * fieldsValue.rate * -100000000,
          rate: Number(fieldsValue.rate) * 100000000,
          note_data: fieldsValue.note_data,
          type: fieldsValue.type,
          hedge_platform_id: fieldsValue.hedge_platform_id,
        },
      });
    });
  }

  handleCurrencyChange = (value) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'hedging/fetchCurrencyPreAmount',
      payload: {
        currency: value,
      },
    });
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { platformList, currencyPreAmount, addHedgeRecordsLoading } = this.props.hedging;
    const { visible } = this.props;
    const data = [{
      currency: '源货币',
      pre_amount: currencyPreAmount[getFieldValue('source_currency')],
      handled_amount: getFieldValue('status') * getFieldValue('source_handled_amount'),
      after_amount: currencyPreAmount[getFieldValue('source_currency')] + getFieldValue('status') * getFieldValue('source_handled_amount'),
    }, {
      currency: '目标货币',
      pre_amount: currencyPreAmount[getFieldValue('target_currency')],
      handled_amount: -getFieldValue('status') * getFieldValue('source_handled_amount') * getFieldValue('rate'),
      after_amount: currencyPreAmount[getFieldValue('target_currency')] - getFieldValue('status') * getFieldValue('source_handled_amount') * getFieldValue('rate'),
    }];
    return (
      <Modal
        title="添加对冲记录"
        width={800}
        visible={visible}
        onOk={this.handleOk}
        confirmLoading={addHedgeRecordsLoading}
        onCancel={this.props.handleCancel}
      >
        <Form>
          <h2>对冲信息录入</h2>
          <Row gutter={30}>
            <Col span={8}>
              <FormItem
                label="操作类型"
              >
                {getFieldDecorator('type', {
                  initialValue: 1,
                })(
                  <Select>
                    <Option value={1}>对冲</Option>
                    <Option value={2}>兑换</Option>
                  </Select>
                )}
              </FormItem>
              <FormItem
                label="源货币"
              >
                {getFieldDecorator('source_currency', {
                  initialValue: '',
                })(
                  <CurrencySelect onChange={this.handleCurrencyChange} />
                )}
              </FormItem>
              <FormItem
                label="价格"
              >
                {getFieldDecorator('rate', {
                  initialValue: '',
                })(
                  <Input />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                label="操作方向"
              >
                {getFieldDecorator('status', {
                  initialValue: '',
                })(
                  <Select>
                    <Option value={1}>做多（买）</Option>
                    <Option value={-1}>做空（卖）</Option>
                  </Select>
                )}
              </FormItem>
              <FormItem
                label="目标货币"
              >
                {getFieldDecorator('target_currency', {
                  initialValue: '',
                })(
                  <CurrencySelect onChange={this.handleCurrencyChange} />
                )}
              </FormItem>
              <FormItem
                label="数量"
              >
                {getFieldDecorator('source_handled_amount', {
                  initialValue: '',
                })(
                  <Input />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                label="外部操作平台"
              >
                {getFieldDecorator('hedge_platform_id', {
                  initialValue: '',
                })(
                  <Select>
                    { platformList.list &&
                       platformList.list.map(obj => (<Option value={obj.id}>{obj.name}</Option>))
                     }
                  </Select>
                )}
              </FormItem>
              <FormItem
                label="备注"
              >
                {getFieldDecorator('note_data', {
                  initialValue: '',
                })(
                  <TextArea rows={6} />
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
        <h2>对冲信息预览</h2>
        <Table columns={columns} dataSource={data} pagination={false} rowKey="currency" />
      </Modal>
    );
  }
}
