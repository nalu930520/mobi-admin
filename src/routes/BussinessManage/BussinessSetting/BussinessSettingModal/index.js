import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Select, Input, Modal, InputNumber } from 'antd';

const { Option } = Select;
const { TextArea } = Input;
const FormItem = Form.Item;

@Form.create()

@connect(state => ({
  bussinessSetting: state.bussinessSetting,
}))

export default class ChangeSettingModal extends Component {
  componentWillReceiveProps(nextProps) {
    if (
      !this.props.bussinessSetting.closeModal &&
      nextProps.bussinessSetting.closeModal
    ) {
      this.props.handleCancel();
    }
  }

  handleOk = (e) => {
    e.preventDefault();
    const { dispatch, modalKey } = this.props;
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      dispatch({
        type: 'bussinessSetting/updateBussinessSetting',
        payload: {
          modify_value: modalKey === 'transaction_fee_rate' ? fieldsValue.transaction_fee_rate : fieldsValue.premium_rate,
          type: modalKey === 'transaction_fee_rate' ? 1 : 2,
        },
      });
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { modalKey, modalName, visible } = this.props;
    const { loading, setConfig } = this.props.bussinessSetting;
    const modalTitle = modalName;
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
        confirmLoading={loading}
        onCancel={this.props.handleCancel}
      >
        <Form>
          {modalKey === 'transaction_fee_rate' &&
            (<FormItem
              {...formItemLayout}
              label="手续费费率"
            >
              {getFieldDecorator('transaction_fee_rate', {
                  initialValue: setConfig.transaction_fee_rate,
            })(
              <InputNumber step={0.1} />
            )}&nbsp;%
             </FormItem>)
          }
          {modalKey === 'premium_rate' &&
            (<FormItem
              {...formItemLayout}
              label="修改溢价率"
            >
              {getFieldDecorator('premium_rate', {
                  initialValue: setConfig.premium_rate,
            })(
              <InputNumber step={0.1} />
            )}&nbsp;%
             </FormItem>)
          }
        </Form>
      </Modal>
    );
  }
}
