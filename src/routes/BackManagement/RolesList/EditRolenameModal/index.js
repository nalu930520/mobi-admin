import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Select, Modal } from 'antd';
import difference from 'lodash.difference';

const { Option } = Select;
const FormItem = Form.Item;

@Form.create()

@connect(state => ({
  backManagement: state.backManagement,
}))

export default class EditRolenameModal extends Component {
  componentWillReceiveProps(nextProps) {
    if (
      !this.props.backManagement.closeModal &&
      nextProps.backManagement.closeModal
    ) {
      this.props.handleCancel();
    }
  }

  handleOk = () => {
    const { dispatch } = this.props;
    const { users } = this.props.roleInfo;
    const usersIds = users.map(val => val.id);
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      const userArray = difference(usersIds, fieldsValue.users);
      dispatch({
        type: 'backManagement/addRolesUsers',
        payload: {
          remove_users: userArray,
          rolename: fieldsValue.rolename,
        },
      });
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { updateUserLoading, rolesList } = this.props.backManagement;
    const { visible } = this.props;
    const { users } = this.props.roleInfo;
    const usersIds = users.map(val => val.id);
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
            label="所属群组"
          >
            {getFieldDecorator('rolename', {
              initialValue: this.props.roleInfo.rolename,
            })(
              <Select
                style={{ width: '100%' }}
                size="small"
              >
                {
                  rolesList.list.map(val =>
                    (
                      <Option key={val.rolename} value={val.rolename}>
                        {val.rolename}
                      </Option>
                    )
                  )
                }
              </Select>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="成员："
          >
            {getFieldDecorator('users', {
              initialValue: usersIds,
            })(
              <Select
                mode="multiple"
              >
                {
                  users.map(val => (
                    <Option key={val.id} value={val.id}>
                      {val.username}
                    </Option>
                  ))
                }
              </Select>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
