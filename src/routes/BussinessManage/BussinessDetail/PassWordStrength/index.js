import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, Progress, Button, Row, Col } from 'antd';
import passwordStrength from 'zxcvbn';

const FormItem = Form.Item;

@Form.create()

@connect(state => ({
  bussinessDetail: state.bussinessDetail,
  bussinessList: state.bussinessList,
}))

export default class PasswordStrengthModel extends Component {
  state = {
    loginPassword: '',
    score: 0,
    level: '',
    username: '',
  }
  componentWillMount() {
    this.genRandomString(12, true);
  }
  componentWillReceiveProps(nextProps) {
    if (
      !this.props.bussinessList.closeModal &&
      nextProps.bussinessList.closeModal
    ) {
      this.props.handleCancel();
    }
  }
  handleOk = () => {
    const { merchantId } = this.props.bussinessList;
    const { dispatch, createFlg } = this.props;
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      if (createFlg) {
        dispatch({
          type: 'bussinessList/fetchCreateMerchant',
          payload: {
            merchant_id: merchantId,
            username: fieldsValue.username,
            login_password: fieldsValue.login_password,
          },
        });
      }
    });
  }
  genRandomString = (len, flg) => {
    const textRan = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_';
    const rdmIndex = textRan_ => Math.random() * textRan_.length | 0;
    let rdmString = '';
    for (; rdmString.length < len; rdmString += textRan.charAt(rdmIndex(textRan)));
    this.setState({
      loginPassword: rdmString,
      score: passwordStrength(rdmString).score * 25,
      level: this.levelRange(passwordStrength(rdmString).score),
    });
    if (flg) {
      this.setState({
        username: rdmString,
      });
    }
  }
  handleChange = (event) => {
    this.setState({
      loginPassword: event.target.value,
      score: passwordStrength(event.target.value).score * 25,
      level: this.levelRange(passwordStrength(event.target.value).score),
    });
  }
  levelRange = (score) => {
    const aStr = ['弱', '中', '强', '非常好'];
    return score > 1 ? aStr[score - 1] : aStr[0];
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { passWordLoading } = this.props.bussinessDetail;
    const { visible, createFlg, title, rowData } = this.props;
    let id;
    if (this.props.bussinessList) {
      // const { merchantId } = this.props.bussinessList;
      id = this.props.bussinessList.merchantId;
    } else {
      id = rowData.merchantId;
    }
    const merchantId = id;
    const { loginPassword, score, level, username } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    };

    return (
      <Modal
        title={title}
        visible={visible}
        onOk={this.handleOk}
        confirmLoading={passWordLoading}
        onCancel={this.props.handleCancel}
      >
        <Form>
          {createFlg === 'true' &&
            (<Row gutter={16}>
              <Col span={20}>
                <FormItem
                  {...formItemLayout}
                  label="承兑商号"
                >
                  {getFieldDecorator('merchant_id', {
                    })(
                      <span>{merchantId}</span>
                    )}
                </FormItem>
              </Col>
             </Row>
            )
          }
          {createFlg === 'true' &&
            (<Row gutter={16}>
              <Col span={20}>
                <FormItem
                  {...formItemLayout}
                  label="用户名"
                >
                  {getFieldDecorator('username', {
                    rules: [{
                      required: true, message: '请输入用户名',
                    }],
                    initialValue: username,
                    })(
                      <Input onChange={this.userNameChange} />
                    )}
                </FormItem>
              </Col>
             </Row>
            )
          }
          <Row gutter={16}>
            <Col span={20}>
              <FormItem
                {...formItemLayout}
                label={createFlg === 'true' ? '登录密码' : '新登录密码'}
              >
                {getFieldDecorator('login_password', {
                  rules: [{
                    required: true, message: '请输入登录密码',
                  }],
                  initialValue: loginPassword,
                  })(
                    <Input onChange={this.handleChange} />
                  )}
              </FormItem>
              <div style={{ width: '100%', paddingLeft: '25%' }}>
                <Progress percent={score} successPercent={score} />
                安全等级：{level}
                <p style={{ fontSize: 12 }}>只能包含大小写字母数字、非空字符</p>
              </div>
            </Col>
            <Col span={4}>
              <FormItem>
                <Button type="primary" onClick={() => this.genRandomString(12, false)}>生成</Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}
