import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, Row, Col, InputNumber } from 'antd';

const FormItem = Form.Item;

@Form.create()

@connect(state => ({
  bussinessDetail: state.bussinessDetail,
}))

export default class OTCModal extends Component {
  componentWillReceiveProps(nextProps) {
    if (
      !this.props.bussinessDetail.closeModal &&
      nextProps.bussinessDetail.closeModal
    ) {
      this.props.handleCancel();
    }
  }

  handleOk = (e) => {
    e.preventDefault();
    const { userInfo } = this.props.bussinessDetail;
    const { dispatch } = this.props;
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      dispatch({
        type: 'bussinessDetail/updateMerchantOTC',
        payload: {
          merchant_id: userInfo.merchant_id,
          modify_value: fieldsValue.current_fee,
        },
      });
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { modalKey, modalName } = this.props;
    const { updateBussinessOTCLoading, otcInfo } = this.props.bussinessDetail;
    const modalTitle = modalName;
    const { visible } = this.props;
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
        title={modalTitle}
        visible={visible}
        onOk={this.handleOk}
        confirmLoading={updateBussinessOTCLoading}
        onCancel={this.props.handleCancel}
      >
        {modalKey === 'commission' &&
          <Form>
            <Row>
              <FormItem
                {...formItemLayout}
                label="手续费费率"
              >
                {getFieldDecorator('current_fee', {
                  initialValue: otcInfo.current_fee,
                })(
                  <InputNumber step={0.1} />
                )}&nbsp;%
              </FormItem>
            </Row>
          </Form>
        }
        {modalKey === 'limit' &&
          <Form>
            <FormItem
              {...formItemLayout}
              label="购买额度"
            >
              <Row>
                <Col span={10}>
                  {getFieldDecorator('status', {
                    initialValue: status,
                    placeholder: '最小购买额度',
                  })(
                    <Input />
                  )}
                </Col>
                <Col span={1}>
                  <p style={{ textAlign: 'center' }}>-</p>
                </Col>
                <Col span={10}>
                  {getFieldDecorator('status', {
                    initialValue: status,
                    placeholder: '最大购买额度',
                  })(
                    <Input />
                  )}
                </Col>
              </Row>
            </FormItem>
          </Form>
        }
      </Modal>
    );
  }
}
