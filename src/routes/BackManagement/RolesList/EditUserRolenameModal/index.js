import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Select, Input, Modal } from 'antd';

const { Option } = Select;
const { TextArea } = Input;
const FormItem = Form.Item;

@Form.create()

@connect(state => ({
  backManagement: state.backManagement,
}))

export default class EditUserRolenameModal extends Component {
  componentWillReceiveProps(nextProps) {
    if (
      !this.props.backManagement.closeModal &&
      nextProps.backManagement.closeModal
    ) {
      this.props.handleCancel();
    }
  }

  handleOk = () => {
    const { id } = this.props.userInfo;
    const { dispatch } = this.props;
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      dispatch({
        type: 'backManagement/updateUserRolename',
        payload: {
          user_id: id,
          rolename: fieldsValue.rolename,
        },
      });
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { updateUserLoading, rolesList } = this.props.backManagement;
    const { visible } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
    };
    return (
      <Modal
        title="修改用户信息"
        visible={visible}
        onOk={this.handleOk}
        confirmLoading={updateUserLoading}
        onCancel={this.props.handleCancel}
      >
        <Form>
          <FormItem
            {...formItemLayout}
            label="邮箱"
          >
            {this.props.userInfo.email}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="昵称"
          >
            {this.props.userInfo.username}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="所属群组"
          >
            {getFieldDecorator('rolename', {
              initialValue: this.props.userInfo.rolename,
            })(
              <Select
                style={{ width: '100%' }}
                size="small"
              >
                {
                  rolesList.list.map(val => <Option value={val.rolename}>{val.rolename}</Option>)
                }
              </Select>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
