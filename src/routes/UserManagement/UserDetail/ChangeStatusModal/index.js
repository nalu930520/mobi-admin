import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Select, Input, Modal } from 'antd';

const { Option } = Select;
const { TextArea } = Input;
const FormItem = Form.Item;

@Form.create()

@connect(state => ({
  userdetail: state.userdetail,
}))

export default class ChangeStatusModal extends Component {
  componentWillReceiveProps(nextProps) {
    if (
      !this.props.userdetail.closeModal &&
      nextProps.userdetail.closeModal
    ) {
      this.props.handleCancel();
    }
  }

  handleOk = () => {
    const { id } = this.props.userdetail;
    const { dispatch } = this.props;
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      dispatch({
        type: 'userdetail/updateUserAccountStatus',
        payload: {
          customer_id: id,
          status: fieldsValue.status,
          remark: fieldsValue.remark,
        },
      });
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { updateUserAccountLoading } = this.props.userdetail;
    const { visible } = this.props;
    const { status } = this.props.userdetail.userInfo;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };
    return (
      <Modal
        title="修改账户状态"
        visible={visible}
        onOk={this.handleOk}
        confirmLoading={updateUserAccountLoading}
        onCancel={this.props.handleCancel}
      >
        <Form>
          <FormItem
            {...formItemLayout}
            label="账户状态"
          >
            {getFieldDecorator('status', {
              initialValue: status,
            })(
              <Select
                style={{ width: '100px' }}
                size="small"
              >
                <Option value={0}>锁定</Option>
                <Option value={1}>激活</Option>
              </Select>
            )}
          </FormItem>
          <FormItem
            label="备注"
            {...formItemLayout}
          >
            {getFieldDecorator('remark', {
              initialValue: '',
            })(
              <TextArea rows={4} />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
