import React, { Component } from 'react';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import { connect } from 'dva';
import moment from 'moment';
import { Button, Menu, Dropdown, Icon, Row, Col, Steps, Card, Popover, Badge, Table, Tooltip, Divider } from 'antd';
import classNames from 'classnames';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import DescriptionList from '../../../components/DescriptionList';
import styles from './AdDetail.less';
import Filter from '../../../filter';
import { numberFormat, getcurrencyBycode, codeTocurrencyCode } from '../../../utils/utils';

const { Step } = Steps;
const { Description } = DescriptionList;
const ButtonGroup = Button.Group;

const action = (adDetail, dispatch) => (
  <div>
    <Button
      type="primary"
      disabled={adDetail.status !== 2 ? true : false}
      onClick={() => {
        dispatch({ type: 'advertising/cancelAd', payload: { id: adDetail.id, status: 0 } })
      }}
    >撤销
    </Button>
  </div>
);
const extra = adDetail => (
  <Row>
    <Col xs={24} sm={8}>
      <div className={styles.textSecondary}>订单状态</div>
      <div className={styles.heading}><Filter value={adDetail.status} keyname="adStatus" /></div>
    </Col>
  </Row>
);

const description = adDetail => (
  <DescriptionList className={styles.headerList} size="small" col="2">
    <Description term="广告时间">{moment(adDetail.created_at * 1000).format('YYYY-MM-DD HH:mm:ss')}</Description>
    <Description term="手机号码">{adDetail.mobile_code} {adDetail.mobile}</Description>
    <Description term="Mobi ID">{adDetail.mobi_id}</Description>
    <Description term="广告数字资产币种">{codeTocurrencyCode(adDetail.crypto_currency_code)}</Description>
    <Description term="收款法币币种">{codeTocurrencyCode(adDetail.fiat_currency_code)}</Description>
    <Description term="国家地区">{adDetail.country_code}</Description>
    <Description term="计价方式">{adDetail.price_type === 1 ? `固定报价:${numberFormat(adDetail.target_price,
            getcurrencyBycode(adDetail.fiat_currency_code).decimal_place)} ${codeTocurrencyCode(adDetail.fiat_currency_code)}` : `BPI+溢价百分比: ${adDetail.price_premium*100}%`}</Description>
    <Description term="广告数字资产数量">{numberFormat(adDetail.remaining_crypto_amount, getcurrencyBycode(adDetail.crypto_currency_code).decimal_place)} {codeTocurrencyCode(adDetail.crypto_currency_code)}</Description>
    <Description term="收款方式">{adDetail.payment_method_array.toString()}</Description>
    <Description term="收款账户信息">{adDetail.payment_info}</Description>
    <Description term="付款期限">{adDetail.payment_valid_period / 60} mins</Description>
    <Description term="广告类型">{adDetail.side===1?"买":"卖"}</Description>
  </DescriptionList>
);

@connect(state => ({
  advertising: state.advertising,
}))
export default class AdProfile extends Component {
  state = {

  }

  componentDidMount() {
  }

  render() {
    const { advertising, dispatch } = this.props;
    const { adDetail } = advertising;

    return (
      <PageHeaderLayout
        title={`广告号：${adDetail.id}`}
        logo={<img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />}
        content={description(adDetail)}
        extraContent={extra(adDetail)}
        action={action(adDetail, dispatch)}
      />
    );
  }
}
