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

export default class ChangeWithdrawModal extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    const { id } = this.props.userdetail;
    dispatch({
      type: 'userdetail/fetchVipConfigs',
      payload: {
        customer_id: id,
      },
    });
  }
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
        type: 'userdetail/updateUserWithdrawLevel',
        payload: {
          customer_id: id,
          level: fieldsValue.level,
          remark: fieldsValue.remark,
        },
      });
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { updateUserWithdrawLoading, vipList, userInfo } = this.props.userdetail;
    const { visible } = this.props;
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
        title="提现设置"
        visible={visible}
        onOk={this.handleOk}
        confirmLoading={updateUserWithdrawLoading}
        onCancel={this.props.handleCancel}
      >
        <Form>
          <FormItem
            {...formItemLayout}
            label="提现额度"
          >
            {getFieldDecorator('level', {
              initialValue: userInfo.vip_level,
            })(
              <Select
                style={{ width: '100%' }}
                size="small"
              >
                {
                  !!vipList && vipList.map(obj =>
                    <Option value={obj.level} key={obj.level}>{obj.info}</Option>
                  )
                }
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
