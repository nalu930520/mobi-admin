import React, { Component } from 'react';
import store from 'store';
import _ from 'lodash';
import { Select } from 'antd';
import s from './index.less';


const { Option } = Select;

export default class CurrencySelect extends Component {
  constructor(props) {
    super(props);
    const value = this.props.value || '';
    this.state = {
      currency: value,
    };
  }
  componentWillReceiveProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      const { value } = nextProps;
      this.setState({ currency: value });
    }
  }

  triggerChange = (changedValue) => {
    // Should provide an event to pass value to Form.
    const { onChange } = this.props;
    if (onChange) {
      onChange(changedValue);
    }
  }

  handleCurrencyChange = (currency) => {
    if (!('value' in this.props)) {
      this.setState({ currency });
    }
    this.triggerChange(currency.split(' ')[0].toLowerCase());
  }
  render() {
    const { currencyType, showCurrencyCode, selectWidth } = this.props;
    const currencies = store.get('currencies');
    let filterCurrencies = [];
    if (currencyType) {
      filterCurrencies = currencies.filter(currency => currency.type === currencyType);
    } else {
      filterCurrencies = currencies;
    }
    return (
      <Select
        className={s.mobileSelectWraper}
        placeholder="请选择"
        value={this.state.currency}
        onChange={this.handleCurrencyChange}
        showSearch
        style={selectWidth ? { width: selectWidth } : {}}
        optionFilterProp="children"
        filterOption={(input, option) =>
          option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
      >
        {filterCurrencies.map(currency =>
          (<Option key={currency.abbr} value={`${currency.code} ${currency.name}`}>
            {showCurrencyCode ? currency.abbr : `${currency.name} (${currency.code.toUpperCase()})`}
          </Option>))}
      </Select>
    );
  }
}
