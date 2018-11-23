import React, { Component } from 'react';
import store from 'store';
import _ from 'lodash';
import { Select } from 'antd';
import s from './index.less';


const { Option } = Select;

export default class ReviewerList extends Component {
  constructor(props) {
    super(props);
    console.log(this.props)
    this.state = {
      mobileCode: 1,
      // ReviewerList: list
    };
  }
  componentWillReceiveProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      const { value } = nextProps;
      this.setState({ mobileCode: value });
    }
  }
  triggerChange = (changedValue) => {
    // Should provide an event to pass value to Form.
    const { onChange } = this.props;
    if (onChange) {
      onChange(changedValue);
    }
  }
  handleMobileCodeChange = (mobileCode) => {
    if (!('value' in this.props)) {
      this.setState({ mobileCode });
    }
    this.triggerChange(mobileCode);
  }
  render() {
    return (
      <div className={s.mobileSelectWraper}>
        <Select
          placeholder="请选择"
        >
          {/* {ReviewerList.map(cuntry =>
            (<Option key={cuntry.id}value={`${cuntry.id}`}>{cuntry.name}</Option>))} */}
        </Select>
      </div>
    );
  }
}
