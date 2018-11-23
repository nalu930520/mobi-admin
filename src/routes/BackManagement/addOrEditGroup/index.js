import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Select, Button, DatePicker } from 'antd';
import StandardTable from '../../../components/StandardTable';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Filter from '../../../filter';
import styles from './index.less';
import { getcurrencyBycode, numberFormat } from '../../../utils/utils';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
const { RangePicker } = DatePicker;

@connect(state => ({
  backManagement: state.backManagement,
}))
@Form.create()
export default class addOrEditGroup extends Component {

  componentDidMount() {
    
  }
  handleSubmit = (e) => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      dispatch({
        type: 'backManagement/addOrEditGroup',
        payload: { ...fieldsValue },
      });
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { noRoleUser } = this.props.backManagement;
    return (
      <Card>
        <Form layout="inline" onSubmit={this.handleSubmit}>
          <Row style={{ marginBottom: '15px' }}>
            <FormItem label="群组名称">
              {getFieldDecorator('roleName')(
                <Input />
              )}
            </FormItem>
          </Row>
          <Row style={{ marginBottom: '15px' }}>
            <FormItem label="添加成员">
              {getFieldDecorator('add_users', {
                initValue: [],
              })(
                <Select
                  mode="multiple"
                  style={{ width: '600px' }}
                  showSearch
                  filterOption={(input, option) =>
                    option.key.indexOf(input) >= 0}
                >
                  {noRoleUser.length ? noRoleUser.map(user => <Option key={user.email} value={user.id}>{user.email}</Option>) : <Option value="1" />}
                </Select>
              )}
            </FormItem>
          </Row>
          <Row>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              style={{ marginRight: '15px' }}
            >提交
            </Button>
            <Button size="large">取消</Button>
          </Row>
        </Form>
      </Card>
    );
  }
}
