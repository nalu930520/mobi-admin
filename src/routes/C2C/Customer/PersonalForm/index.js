import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Select, Badge, Divider, Input, Button, Row, Col, Modal } from 'antd';
import DescriptionList from '../../../../components/DescriptionList';
import Filter from '../../../../filter';
import styles from './index.less';

const { Description } = DescriptionList;
const { Option } = Select;
const { TextArea } = Input;

@Form.create()
export default class PersonalForm extends Component {
  state = {
    isSetting: '',
    showNoteModal: false,
  }
  handleSubmit = () => {
    console.log('handleSubmit')
  }
  submitUserInfo = (submitName) => {
    const { getFieldValue } = this.props.form;
    if (submitName === 'max_online_adv' || submitName === 'allow_to_create_order') {
      this.setState({
        showNoteModal: true,
      });
      return;
    }
    if (submitName === 'transaction_fee_rate') {
      this.requestUserInfo({
        key: 'transaction_fee_rate',
        modify_type: '2',
        value: getFieldValue('transaction_fee_rate') / 100,
      });
    }
    if (submitName === 'is_certified_seller') {
      this.requestUserInfo({
        key: 'is_certified_seller',
        modify_type: getFieldValue('is_certified_seller'),
      });
    }
  }
  requestUserInfo = (requObj) => {
    const { dispatch } = this.props;
    const { detail } = this.props.customer;
    const { customer_id } = detail;
    dispatch({
      type: 'customer/updateUserInfo',
      payload: {
        customer_id,
        ...requObj,
      } }).then(() => {
      this.setState({
        isSetting: '',
      });
    });
  }
  handleOk = () => {
    const { getFieldValue, setFieldsValue } = this.props.form;
    if (!this.state.isSetting) {
      return;
    }
    this.requestUserInfo({
      key: this.state.isSetting,
      modify_type: getFieldValue(this.state.isSetting),
      value: getFieldValue('note'),
    });
    setFieldsValue({ 'note' : null });
    this.setState({
      showNoteModal: false,
    });
  }
  handleCancel = () => {
    this.setState({
      showNoteModal: false,
    });
  }
  render() {
    const { detail } = this.props.customer;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit}>
        <Row gutter={24}>
          <Col>
            <DescriptionList className={styles.headerList} size="small" col="2">
              <Description term="手机号码">（+{detail.mobile_code}）{detail.mobile}</Description>
              <Description term="Mobi ID">{detail.username}</Description>
              <Description term="平均放币时间">{Math.round(detail.trades_info[0].send_coin_delay / 60)} mins</Description>
              <Description term="取消次数">{detail.user_continuous_cancel_count}&nbsp;{detail.fiat_currency_code}</Description>
              <Description term="好评率"><Badge status="error" />{Math.round(detail.score * 100)} %</Description>
              <Description term="申诉失败次数">{detail.failed_complaint_counts}</Description>
              <Description term="商家认证">
                <div >
                  {getFieldDecorator('is_certified_seller', {
                    initialValue: detail.is_certified_seller ? '1' : '0',
                  })(
                    <Select
                      style={{ width: '100px' }}
                      size="small"
                      onChange={() => {
                        this.setState({
                          isSetting: 'is_certified_seller',
                        });
                      }}
                    >
                      <Option value="0">未认证</Option>
                      <Option value="1">认证</Option>
                    </Select>
                  )}
                  <Button
                    type="primary"
                    style={{ marginLeft: '15px' }}
                    disabled={this.state.isSetting !== 'is_certified_seller'}
                    onClick={() => {
                      this.submitUserInfo('is_certified_seller');
                    }}
                  >
                  修改
                  </Button>
                </div>
              </Description>
              <Description term="手续费">
                {getFieldDecorator('transaction_fee_rate', {
                  initialValue: detail.transaction_fee_rate * 100,
                  rules: [{
                    required: true, message: 'Please confirm your input!',
                  }],
                })(
                  <Input
                    size="small"
                    onChange={() => {
                      this.setState({
                          isSetting: 'transaction_fee_rate',
                        });
                    }}
                    style={{ width: 70 }}
                  />
                )}&nbsp;&nbsp;%
                <Button
                  type="primary"
                  style={{ marginLeft: '15px' }}
                  disabled={this.state.isSetting !== 'transaction_fee_rate'}
                  onClick={() => {
                    this.submitUserInfo('transaction_fee_rate');
                  }}
                >修改
                </Button>
              </Description>
              <Description term="挂单锁">
                <div >
                  {getFieldDecorator('max_online_adv', {
                    initialValue: detail.max_advertisement_online.v > 0 ? '0' : '1',
                  })(
                    <Select
                      style={{ width: '100px' }}
                      size="small"
                      onChange={() => {
                        this.setState({
                          isSetting: 'max_online_adv',
                        });
                      }}
                    >
                      <Option value="0">未锁定</Option>
                      <Option value="1">锁定</Option>
                    </Select>
                  )}
                  <Button
                    type="primary"
                    style={{ marginLeft: '15px', marginRight: '15px' }}
                    disabled={this.state.isSetting !== 'max_online_adv'}
                    onClick={() => {
                      this.submitUserInfo('max_online_adv');
                    }}
                  >
                  修改
                  </Button>
                  <a
                    onClick={() => {
                      Modal.info({
                        title: '挂单锁备注',
                        iconType: false,
                        content: detail.max_advertisement_online.note || '没有备注',
                      });
                    }}
                  >备注
                  </a>
                  <span> {detail.max_advertisement_online.v > 0 ? '' : '解锁时间 2099-12-31 00:00'}</span>
                </div>
              </Description>
              <Description term="购买锁">
                <div>
                  {getFieldDecorator('allow_to_create_order', {
                    initialValue: detail.allow_to_create_order.v === true ? '0' : '1',
                  })(
                    <Select
                      style={{ width: '100px' }}
                      size="small"
                      onChange={() => {
                        this.setState({
                          isSetting: 'allow_to_create_order',
                        });
                      }}
                    >
                      <Option value="0">未锁定</Option>
                      <Option value="1">锁定</Option>
                    </Select>
                  )}
                  <Button
                    type="primary"
                    style={{ marginLeft: '15px', marginRight: '15px' }}
                    disabled={this.state.isSetting !== 'allow_to_create_order'}
                    onClick={() => {
                      this.submitUserInfo('allow_to_create_order');
                    }}
                  >修改
                  </Button>
                  <a
                    onClick={() => {
                      Modal.info({
                        title: '购买锁备注',
                        iconType: false,
                        content: detail.allow_to_create_order.note || '没有备注',
                      });
                    }}
                  >备注
                  </a>
                  <span> {!detail.allow_to_create_order.v && '解锁时间 2099-12-31 00:00'}</span>
                </div>
              </Description>
            </DescriptionList>
          </Col>
        </Row>
        <Divider />
        <Modal
          title="备注"
          visible={this.state.showNoteModal}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          {getFieldDecorator('note', {
            initialValue: '',
          })(
            <TextArea rows={4} />
          )}
        </Modal>
      </Form>
    );
  }
}
