import React, { PureComponent } from 'react';
import { Card, Form, Col, Row, Input, Button, Upload, Icon, Select, message, Modal } from 'antd';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import MobileSelect from '../../../components/MobileCodeSelect';
import CurrencySelect from '../../../components/CurrencySelect';
import UploadImg from '../../../components/UploadImg';
import DescriptionList from '../../../components/DescriptionList';
import { addDepisit } from '../../../services/cashCharge';
import { normalizeNmuber } from '../../../utils/utils';
import s from './deposit.less';

const { Description } = DescriptionList;
const FormItem = Form.Item;
@connect(state => ({
  cashManage: state.cashManage,
}))
@Form.create()
export default class AddDeposit extends PureComponent {
  state = {
    fileList: [],
    showFirstConfirmModal: false,
    showSecondConfirmModal: false,
    submitLoading: false,
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!this.state.fileList.length) {
        message.error('请上传转账回执');
        return;
      }
      if (!err) {
        this.setState({ showFirstConfirmModal: true });
        const formData = new FormData();
        console.log('Received values of form: ', values);
        values.evidence = this.state.fileList[0].originFileObj;
        for (const key in values) {
          if (values.hasOwnProperty(key)) {
            formData.append(key, values[key]);
          }
        }
      }
    });
  }

  requestUpload = (files) => {
    // 修改默认上传方式 submit 得到 files
    console.log(files);
    return true;
  }
  handleChange = (fileList) => {
    const filterOneImg = [];
    // 那到最新的一张图 做替换前一张 一次只能上传一章
    filterOneImg.push(fileList[fileList.length - 1]);
    const filesArray = filterOneImg.map((data) => {
      return {
        ...data,
        status: 'done',
      };
    });
    this.setState({ fileList: filesArray });
  }
  handleFirstConfirmOk = () => {
    this.setState({ showSecondConfirmModal: true });
  }
  handleFirstConfirmCancel = () => {
    this.setState({ showFirstConfirmModal: false });
  }
  handleSecondModalOk = () => {
    this.setState({
      submitLoading: true,
    });
    this.props.dispatch({
      type: 'cashManage/submitDeposit',
      payload: {
        ...this.props.form.getFieldsValue(),
        evidence: this.state.fileList[0].originFileObj,
      },
    }).then((data) => {
      if (data) {
        message.success('提交成功', 1, () => {
          this.props.dispatch(routerRedux.push('/cashCharge/deposit'));
        });
      }
      this.handleSecondModalCancel();
    });
  }
  handleSecondModalCancel = () => {
    this.setState({
      submitLoading: false,
      showFirstConfirmModal: false,
      showSecondConfirmModal: false,
    });
  }
  validateRealityAmount = (rule, value, callback) => {
    const reqAmount = this.props.form.getFieldValue('request_amount');
    if (parseInt(reqAmount, 10) >= parseInt(value, 10)) {
      callback();
      return;
    }
    callback('到账金额不能大于请求金额');
  }
  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const mobilePrefixSelector = getFieldDecorator('mobile_code', {
      rules: [{ required: true, message: '请选择' }],
      initialValue: '',
    })(
      <MobileSelect />
    );
    const amountPrefixSelector = getFieldDecorator('currency_code', {
      rules: [{ required: true, message: '请选择' }],
      initialValue: 'usd',
    })(
      <CurrencySelect currencyType="F" showCurrencyCode={1} selectWidth="100px" />
    );

    return (
      <PageHeaderLayout
        title="新增充值"
      >
        <Card bordered={false} >
          <Form layout="vertical" onSubmit={this.handleSubmit}>
            <h2>充值信息</h2>
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
                <Form.Item label="到账金额">
                  {getFieldDecorator('reality_amount', {
                    rules: [
                      { required: true, message: '请输入到账金额' },
                      { pattern: /^\d{0,8}\.{0,1}(\d{1,2})?$/, message: '只能输入两位小数' },
                      { validator: this.validateRealityAmount },
                    ],
                    initialValue: 0,
                    normalize: normalizeNmuber,
                  })(<Input addonBefore={amountPrefixSelector} placeholder="请输入到账金额" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="确认码">
                  {getFieldDecorator('confirmed_code', {
                    rules: [{ required: true, message: '请输入确认码' }],
                    initialValue: '',
                  })(<Input placeholder="请输入确认码" />)}
                </Form.Item>
              </Col>
            </Row>
            <h2>充值银行</h2>
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
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="转账回执" required>
                  <UploadImg
                    fileList={this.state.fileList}
                    handleChange={this.handleChange}
                    requestUpload={(files) => {
                      this.requestUpload(files);
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={25} >
                <Form.Item >
                  <Button size="large" type="primary" style={{ marginRight: '20px' }} htmlType="submit">提交</Button>
                  <Link to="/cashCharge/deposit"><Button size="large" >取消</Button></Link>
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <Modal
            visible={this.state.showFirstConfirmModal}
            title="新增充值"
            onOk={this.handleFirstConfirmOk}
            width="800px"
            onCancel={this.handleFirstConfirmCancel}
            footer={[
              <Button key="back" onClick={this.handleFirstConfirmCancel}>取消</Button>,
              <Button key="submit" type="primary" onClick={this.handleFirstConfirmOk}>
                确认提交
              </Button>,
            ]}
          >
            <Row>
              <Col span={8}>
                <DescriptionList size="small" col="1">
                  <Description term="手机号">{getFieldValue('mobile_code')} {getFieldValue('mobile')}</Description>
                  <Description term="确认码">{getFieldValue('confirmed_code')}</Description>
                </DescriptionList>
              </Col>
              <Col span={8}>
                <DescriptionList size="small" col="1">
                  <Description term="充值币种">{getFieldValue('currency_code')}</Description>
                  <Description term="银行名">{getFieldValue('bank_name')}</Description>
                  <Description term="银行地址">{getFieldValue('bank_address')}</Description>
                  <Description term="账户名">{getFieldValue('account_name')}</Description>
                  <Description term="账户号码">{getFieldValue('bank_account')}</Description>
                </DescriptionList>
              </Col>
              <Col span={8}>
                <div className={s.rightWraper}>
                  <div className={s.title}>请求金额</div>
                  <div className={s.amount}>{getFieldValue('request_amount')}</div>
                  <div className={s.title}>到账金额</div>
                  <div className={s.amount} style={{ color: 'red' }}>{getFieldValue('reality_amount')}</div>
                </div>
              </Col>
            </Row>
            <DescriptionList size="small" layout="vertical" col="1">
              <Description term="转账回执" >
                <Upload fileList={this.state.fileList} listType="picture-card" />
              </Description>
            </DescriptionList>
          </Modal>
          <Modal
            title="Modal"
            visible={this.state.showSecondConfirmModal}
            onOk={this.handleSecondModalOk}
            onCancel={this.handleSecondModalCancel}
            footer={[
              <Button key="back" onClick={this.handleSecondModalCancel}>取消</Button>,
              <Button key="submit" type="primary" loading={this.state.submitLoading} onClick={this.handleSecondModalOk}>
                确认提交
              </Button>,
            ]}
          >
            <p>手机号 {getFieldValue('mobile_code')} {getFieldValue('mobile')}</p>
            <p>到账金额 <span style={{ color: 'red' }}>{getFieldValue('reality_amount')}</span></p>
          </Modal>
        </Card>
      </PageHeaderLayout>
    );
  }
}
