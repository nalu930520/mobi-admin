import React, { Component } from 'react';
import Lens from 'react-lens';
import isUndefined from 'lodash.isundefined';
import isNull from 'lodash.isnull';

import './complaintOrderStatus.js';
import './adStatus.js';
import './adSide';
import './relationStatus.js';
import './orderStatus.js';
import './complaintReason.js';
import './accountStatus.js';
import './formatNumber.js';
import './hedgeType.js';
import './txType.js';
import './txStatus.js';
import './cashStatus.js';
import './bussinessStatus.js';

export default class Filter extends Component {
  render() {
    const { value, keyname } = this.props;
    return (
      <Lens filter={keyname}>{isUndefined(value) || isNull(value) ? '-' : value.toString()}</Lens>
    );
  }
}
