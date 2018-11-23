import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Select, Modal, Row } from 'antd';

const { Option } = Select;
const FormItem = Form.Item;

@Form.create()

@connect(state => ({
  bussinessDetail: state.bussinessDetail,
}))

export default class SupportBusinessModal extends Component {
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
        type: 'bussinessDetail/CreateCustomer',
        payload: {
          merchant_id: userInfo.merchant_id,
          customer_id: fieldsValue.customer_id,
        },
      });
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    // const { } = this.props;
    const { supportBusinessLoading, supportBusinessList } = this.props.bussinessDetail;
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
        title="添加支持商户"
        visible={visible}
        onOk={this.handleOk}
        confirmLoading={supportBusinessLoading}
        onCancel={this.props.handleCancel}
      >
        <Form>
          <Row>
            <FormItem
              {...formItemLayout}
              label="选择商户"
            >
              {getFieldDecorator('customer_id', {
                rules: [{
                  required: true, message: '请选择商户',
                }],
              })(
                <Select
                  style={{ width: '80%' }}
                  size="small"
                >
                  {supportBusinessList.map(bus =>
                    (<Option key={bus.merchant_id}value={`${bus.merchant_id}`}>{bus.merchant_name}</Option>))}
                </Select>
              )}
            </FormItem>
          </Row>
        </Form>
      </Modal>
    );
  }
}
