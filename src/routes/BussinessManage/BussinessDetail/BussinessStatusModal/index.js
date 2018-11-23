import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Select, Input, Modal } from 'antd';

const { Option } = Select;
const FormItem = Form.Item;

@Form.create()

@connect(state => ({
  bussinessDetail: state.bussinessDetail,
}))

export default class ChangeStatusModal extends Component {
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
    const { dispatch, modalKey } = this.props;
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      dispatch({
        type: 'bussinessDetail/updateMerchantStatus',
        payload: {
          merchant_id: userInfo.merchant_id,
          value: modalKey === 'bussinessStatus' ? fieldsValue.put_away_status : fieldsValue.login_status,
          type: modalKey === 'bussinessStatus' ? 1 : 2,
        },
      });
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { modalKey, modalName, visible } = this.props;
    const { userInfo, updateBussinessStatusLoading } = this.props.bussinessDetail;
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
        confirmLoading={updateBussinessStatusLoading}
        onCancel={this.props.handleCancel}
      >
        {modalKey === 'bussinessStatus' &&
          <Form>
            <FormItem
              {...formItemLayout}
              label="承兑商上架状态"
            >
              {getFieldDecorator('put_away_status', {
                initialValue: userInfo.put_away_status,
          })(
            <Select
              style={{ width: '100px' }}
              size="small"
            >
              <Option value={0}>下架</Option>
              <Option value={1}>上架</Option>
            </Select>
          )}
            </FormItem>
          </Form>
        }
        {modalKey === 'accountStatus' &&
          <Form>
            <FormItem
              {...formItemLayout}
              label="承兑商登录状态"
            >
              {getFieldDecorator('login_status', {
                initialValue: userInfo.login_status,
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
          </Form>
        }
        {modalKey === 'updateUserName' &&
          <Form>
            <FormItem
              {...formItemLayout}
              label="承兑商用户名"
            >
              {getFieldDecorator('bussinessName')(
                <Input />
              )}
            </FormItem>
          </Form>

        }
        {modalKey === 'resetInitPassword' &&
          <Form>
            <FormItem
              {...formItemLayout}
              label="承兑商初始密码"
            >
              111111
            </FormItem>
          </Form>
        }
      </Modal>
    );
  }
}
