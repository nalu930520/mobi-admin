import React, { Component } from 'react';
import store from 'store';
import _ from 'lodash';
import { Select } from 'antd';
import s from './index.less';


const { Option } = Select;

export default class MobileCodeSelect extends Component {
  constructor(props) {
    super(props);
    const value = this.props.value || '';
    this.state = {
      mobileCode: value,
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
    const countrys = store.get('countrys');
    const filterCountrys = _.uniqBy(countrys, 'mobile_code');
    return (
      <div className={s.mobileSelectWraper}>
        <Select
          placeholder="请选择"
          value={this.state.mobileCode}
          onChange={this.handleMobileCodeChange}
          style={{ width: '100px' }}
          showSearch
          filterOption={(input, option) =>
            option.props.value.indexOf(input) >= 0}
        >
          {filterCountrys.map(cuntry =>
            (<Option key={cuntry.mobile_code}value={`${cuntry.mobile_code}`}>+ {cuntry.mobile_code}</Option>))}
        </Select>
      </div>
    );
  }
}
