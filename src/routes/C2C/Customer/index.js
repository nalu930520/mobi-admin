import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Form, Button, Modal, Timeline, Input } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import PersonalForm from './PersonalForm';
import UserInfo from './UserInfo';

const ButtonGroup = Button.Group;

const getOprationType = (operationType) => {
  let type = '';
  switch (operationType) {
    case 3:
      type = '商家认证';
      break;
    case 4:
      type = '挂单锁';
      break;
    case 5:
      type = '修改用户手续费';
      break;
    case 11:
      type = '购买锁';
      break;
    default:
      type = '';
      break;
  }
  return type;
};

const action = (_this, customer_id, dispatch, userlogs, marks) => (
  <div>
    <ButtonGroup>
      <Button
        onClick={() => {
          Modal.info({
            title: '操作日志',
            width: '800px',
            content: (
              <div style={{ height: '300px', overflow: 'scroll', paddingTop: '4px' }}>
                <Timeline>
                  {userlogs.map(data =>
                    <Timeline.Item>操作邮箱：{data.admin_email} 操作记录：{getOprationType(data.operation_type)} 时间：{moment(data.created_at * 1000).format('YYYY-MM-DD, h:mm:ss')}</Timeline.Item>)}
                </Timeline>
              </div>
            ),
          });
        }}
      >操作日志
      </Button>
      <Button
        onClick={() => {
          _this.setState({
            showRemark: true,
          });
        }}
      >客服描述
      </Button>
    </ButtonGroup>
  </div>
);

@connect(state => ({
  customer: state.customer,
}))
@Form.create()
export default class Customer extends Component {
  state = {
    showRemark: false,
    reMarkValue: '',
  }
  render() {
    const { customer, form, dispatch } = this.props;
    const { marks, userLogs, id } = customer;
    return (
      <PageHeaderLayout
        title="个人信息"
        action={action(this, id, dispatch, userLogs, marks)}
        content={<PersonalForm customer={customer} form={form} dispatch={dispatch} />}
      >
        <UserInfo />
        <Modal
          visible={this.state.showRemark}
          width="800px"
          onCancel={() => {
            this.setState({
              showRemark: false,
            });
          }}
          footer={null}
        >
          <div style={{ height: '300px', overflow: 'scroll', paddingTop: '4px' }}>
            <Timeline>
              {marks.map(data =>
                <Timeline.Item>操作邮箱：{data.admin_email} 客服描述：{data.remark} {moment(data.created_at * 1000).format('YYYY-MM-DD, h:mm:ss')}</Timeline.Item>
              )}
            </Timeline>
          </div>

          <div style={{ textAlign: 'center' }}>
            <Input
              value={this.state.reMarkValue}
              onChange={(e) => {
                this.setState({
                  reMarkValue: e.target.value,
                });
              }}
            />
            <Button
              style={{ marginTop: '20px' }}
              type="primary"
              onClick={() => {
                if (!this.state.reMarkValue) return '';
                dispatch({ type: 'customer/addMark', payload: { remark: this.state.reMarkValue, customer_id: id } });
              }}
            >添加
            </Button>
          </div>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
