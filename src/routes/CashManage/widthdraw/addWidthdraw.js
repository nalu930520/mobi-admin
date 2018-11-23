import React, { PureComponent } from 'react';
import { Card, Form, Col, Row, Input, Button, Upload, Icon, message, Modal } from 'antd';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import MobileSelect from '../../../components/MobileCodeSelect';
import CurrencySelect from '../../../components/CurrencySelect';
import { fetchUserBalance } from '../../../services/cashCharge';
import DescriptionList from '../../../components/DescriptionList';
import { numberFormat, normalizeNmuber } from '../../../utils/utils';

const FormItem = Form.Item;
const { Description } = DescriptionList;
@connect(state => ({
  cashManage: state.cashManage,
}))
@Form.create()
export default class AddDeposit extends PureComponent {
  state = {
    userBalance: 0,
    requestBalanceSuccess: false,
    showConfirmModal: false,
    firstSubmitLoading: false,
    submitLoading: false,

  }
  getBalance = () => {
    const { getFieldValue } = this.props.form;
    const mobile_code = getFieldValue('mobile_code');
    const mobile = getFieldValue('mobile');
    const currency_code = getFieldValue('currency_code');
    if (!mobile_code || !mobile || !currency_code) {
      message.error('请输入手机号');
      return false;
    }
    return new Promise((resolve, reject) => {
      return fetchUserBalance({ mobile_code, mobile, currency_code })
      .then((data) => {
        console.log('data', data);
        if (data instanceof Error) {
          this.setState({
            requestBalanceSuccess: false,
            firstSubmitLoading: false,
          })
          resolve(false)

        } else {
          this.setState({
            requestBalanceSuccess: true,
            userBalance: data.balance,
          });
          resolve(true)
        }
      });
    })

  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (!this.state.requestBalanceSuccess) {
          console.log(this.state.requestBalanceSuccess);
          this.setState({
            firstSubmitLoading: true,
          });
          this.getBalance()
            .then((data) => {
              console.log(111);
              console.log(data);
              if (data) {
                this.setState({
                  showConfirmModal: true,
                });
              }
              this.setState({
                firstSubmitLoading: false,
              });
            });
          return;
        } else {
          this.setState({
            firstSubmitLoading: false,
            showConfirmModal: true,
          });
        }
        console.log('Received values of form: ', values);
      }
    });
  }
  handleOk = () => {
    this.setState({
      submitLoading: true,
    });
    console.log(this.state.requestBalanceSuccess);
    this.props.dispatch({
      type: 'cashManage/submitWidthdraw',
      payload: this.props.form.getFieldsValue(),
    }).then((data) => {
      console.log(data);
      if (data) {
        message.success('提交成功', 1, () => {
          this.props.dispatch(routerRedux.push('/cashCharge/widthdraw'));
        });
      }
      this.handleCancel();
    });
  }
  handleCancel = () => {
    this.setState({
      submitLoading: false,
      showConfirmModal: false,
    });
  }
  validateRealityAmount = (rule, value, callback) => {
    const reqAmount = this.props.form.getFieldValue('request_amount');
    if (parseInt(reqAmount, 10) >= parseInt(value, 10)) {
      callback();
      return;
    }
    callback('出账账金额不能大于请求金额');
  }
  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const mobilePrefixSelector = getFieldDecorator('mobile_code', {
      rules: [{ required: true, message: '请选择' }],
    })(<MobileSelect />);
    const amountPrefixSelector = getFieldDecorator('currency_code', {
      rules: [{ required: true, message: '请选择' }],
      initialValue: 'usd',
    })(
      <CurrencySelect currencyType="F" showCurrencyCode={1} selectWidth="100px" />
    );
    return (
      <PageHeaderLayout
        title="新增提现"
      >
        <Card bordered={false} >
          <Form layout="vertical" onSubmit={this.handleSubmit} >
            <h2>提现信息</h2>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="手机号">
                  {getFieldDecorator('mobile', {
                    rules: [{ required: true, message: '请输入手机号' }],
                    initialValue: '',
                  })(<Input addonBefore={mobilePrefixSelector} placeholder="请输入手机号" />)}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="请求金额">
                  {getFieldDecorator('request_amount', {
                    rules: [
                      { required: true, message: '请输入请求金额' },
                      { pattern: /^\d{0,8}\.{0,1}(\d{1,2})?$/, message: '只能输入两位小数' },
                    ],
                    initialValue: 0,
                    normalize: normalizeNmuber,
                  })(<Input addonBefore={amountPrefixSelector} placeholder="请输入请求金额" />)}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="出账金额">
                  {getFieldDecorator('reality_amount', {
                    rules: [
                      { required: true, message: '请输入出账金额', initialValue: 0 },
                      { pattern: /^\d{0,8}\.{0,1}(\d{1,2})?$/, message: '只能输入两位小数' },
                      { validator: this.validateRealityAmount },
                    ],
                    initialValue: 0,
                    normalize: normalizeNmuber,
                  })(<Input addonBefore={amountPrefixSelector} placeholder="请输入出账金额" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col lg={12} md={12} sm={24}>
                <span style={{ display: 'inline-block', minWidth: '200px' }}>可用余额：{numberFormat(this.state.userBalance, 8, false, 2)} {getFieldValue('currency_code')}</span>
                <Button onClick={this.getBalance}>查看余额</Button>
                <p>手续费：{(getFieldValue('request_amount') - getFieldValue('reality_amount')).toFixed(2)}</p>
              </Col>
            </Row>
            <h2>提现银行</h2>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="银行名">
                  {getFieldDecorator('bank_name', {
                    rules: [{ required: true, message: '请输入银行名' }],
                    initialValue: '',
                  })(<Input placeholder="请输入银行名" />)}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="银行地址">
                  {getFieldDecorator('bank_address', {
                    rules: [{ required: true, message: '请输入银行地址' }],
                    initialValue: '',
                  })(<Input placeholder="请输入银行地址" />)}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="SWIFT Code">
                  {getFieldDecorator('swift_code', {
                    rules: [{ required: true, message: '请输入swift_code' }],
                    initialValue: '',
                  })(<Input placeholder="请输入swift_code" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="账户名">
                  {getFieldDecorator('account_name', {
                    rules: [{ required: true, message: '请输入账户名' }],
                    initialValue: '',
                  })(<Input placeholder="请输入账户名" />)}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="账户号码">
                  {getFieldDecorator('bank_account', {
                    rules: [{ required: true, message: '请输入账户号码' }],
                    initialValue: '',
                  })(<Input placeholder="请输入账户号码" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={25} >
                <Form.Item >
                  <Button
                    size="large"
                    type="primary"
                    style={{ marginRight: '20px' }}
                    htmlType="submit"
                    loading={this.state.firstSubmitLoading}
                  >提交
                  </Button>
                  <Link to="/cashCharge/widthdraw"><Button size="large" >取消</Button></Link>
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <Modal
            visible={this.state.showConfirmModal}
            title="新增提现"
            onOk={this.handleOk}
            style={{ widht: '1000px' }}
            onCancel={this.handleCancel}
            footer={[
              <Button key="back" onClick={this.handleCancel}>取消</Button>,
              <Button key="submit" type="primary" onClick={this.handleOk} loading={this.state.submitLoading}>
                确认提交
              </Button>,
            ]}
          >
            <Row>
              <Col span={12}>
                <DescriptionList size="small" col="1">
                  <Description term="手机号">{getFieldValue('mobile_code')} {getFieldValue('mobile')}</Description>
                  <Description term="请求金额">{numberFormat(getFieldValue('request_amount'), 0, false)} {getFieldValue('currency_code')}</Description>
                  <Description term="可用金额">{numberFormat(this.state.userBalance, 8, false, 2)} {getFieldValue('currency_code')}</Description>
                  <Description term="手续费">{numberFormat(getFieldValue('request_amount') - getFieldValue('reality_amount'), 0, false)} {getFieldValue('currency_code')}</Description>
                  <Description term="出账金额">{numberFormat(getFieldValue('reality_amount'), 0, false)} {getFieldValue('currency_code')}</Description>
                </DescriptionList>
              </Col>
              <Col span={12}>
                <DescriptionList size="small" col="1">
                  <Description term="银行名">{getFieldValue('bank_name')}</Description>
                  <Description term="银行地址">{getFieldValue('bank_address')}</Description>
                  <Description term="账户名">{getFieldValue('account_name')}</Description>
                  <Description term="账户号码">{getFieldValue('bank_account')}</Description>
                  <Description term="Swift Code">{getFieldValue('swift_code')}</Description>
                </DescriptionList>
              </Col>
            </Row>
          </Modal>
        </Card>
      </PageHeaderLayout>
    );
  }
}
