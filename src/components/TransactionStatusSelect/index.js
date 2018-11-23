import React, { Component } from 'react';
import { Select } from 'antd';
import s from './index.less';


const { Option } = Select;

export default class TransactionStatusSelect extends Component {
  constructor(props) {
    super(props);
    const value = this.props.value || '';
    this.state = {
      statusId: value,
    };
  }
  componentWillReceiveProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      const { value } = nextProps;
      this.setState({ statusId: value });
    }
  }
  triggerChange = (changedValue) => {
    // Should provide an event to pass value to Form.
    const { onChange } = this.props;
    if (onChange) {
      onChange(changedValue);
    }
  }
  handleStatusIdChange = (statusId) => {
    if (!('value' in this.props)) {
      this.setState({ statusId });
    }
    this.triggerChange(statusId);
  }
  render() {
    return (
      <div className={s.mobileSelectWraper}>
        <Select
          mode="multiple"
          style={{ width: '250px' }}
          placeholder="请输入"
          value={this.state.statusId}
          onChange={this.handleStatusIdChange}
        >
          <Option key="1">待付款</Option>
          <Option key="2">已付款</Option>
          <Option key="3">处理中</Option>
          <Option key="4">已完成</Option>
          <Option key="5">已取消</Option>
          <Option key="6">账号不存在</Option>
          <Option key="7">无效</Option>
          <Option key="8">未确认</Option>
          <Option key="9">确认中</Option>
          <Option key="10">拒绝</Option>
          <Option key="11">延迟</Option>
        </Select>
      </div>
    );
  }
}
