import React, { Component } from 'react';
import { Checkbox } from 'antd';

const CheckboxGroup = Checkbox.Group;

export default class TxCheckbox extends Component {
  constructor(props) {
    super(props);
    const value = this.props.value || [];
    this.state = {
      indeterminate: false,
      checkAll: true,
      checkedList: value,
    };
  }

  componentWillReceiveProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      const { value } = nextProps;
      this.setState({ checkedList: value });
    }
  }

  onCheckAllChange = (e) => {
    const { plainOptions } = this.props;
    const checkListOption = plainOptions.map(data => data.value);
    console.log(e.target.checked);
    this.setState({
      checkedList: e.target.checked ? checkListOption : [],
      indeterminate: false,
      checkAll: e.target.checked,
    });
    this.triggerChange(e.target.checked ? checkListOption : []);
  }

  triggerChange = (changedValue) => {
    // Should provide an event to pass value to Form.
    const { onChange } = this.props;
    if (onChange) {
      onChange(changedValue);
    }
  }

  groupOnChange = (checkedList) => {
    const { plainOptions } = this.props;
    this.setState({
      checkedList,
      indeterminate: !!checkedList.length && (checkedList.length < plainOptions.length),
      checkAll: checkedList.length === plainOptions.length,
    });
    this.triggerChange(checkedList);
  }

  render() {
    const { plainOptions } = this.props;
    return (
      <div>
        <Checkbox
          indeterminate={this.state.indeterminate}
          onChange={this.onCheckAllChange}
          checked={this.state.checkAll}
        >
          全部交易
        </Checkbox>
        <CheckboxGroup
          value={this.state.checkedList}
          onChange={this.groupOnChange}
          options={plainOptions}
        />
      </div>
    );
  }
}
