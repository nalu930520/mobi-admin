import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Card, Avatar, Table } from 'antd';
import Filter from '../../../filter';
import DescriptionList from '../../../components/DescriptionList';
import { numberFormat, getcurrencyBycode, codeTocurrencyCode } from '../../../utils/utils';
import styles from './Dashboard.less';
import btcIcon from '../../../assets/btc.jpg';
import bchIcon from '../../../assets/bch.jpg';
import ethIcon from '../../../assets/eth.jpg';
import ltcIcon from '../../../assets/ltc.jpg';
import usdIcon from '../../../assets/usd.jpg';

const { Meta } = Card;

const operationTabList = [{
  key: 'tab1',
  tab: '全部',
}, {
  key: 'tab2',
  tab: '数字货币',
}, {
  key: 'tab3',
  tab: '法币',
}];


const columns = [
  {
    title: '货币',
    dataIndex: 'currency_code',
    render: val => val.toUpperCase(),
  },
  {
    title: '金额',
    className: 'column-money',
    render: val => (
      <span>{val.amount}
        &nbsp;{codeTocurrencyCode(val.currency_code)}
      </span>
    ),
  },
];

const THeader = [
  {
    title: '货币',
    dataIndex: 'currency_code',
    render: val => val.toUpperCase(),
  },
  {
    title: '金额',
    className: 'column-money',
    render: val => (
      <span>{numberFormat(val.amount,
        getcurrencyBycode(val.currency_code).decimal_place, true)}&nbsp;
        {codeTocurrencyCode(val.currency_code)}
      </span>
    ),
  },
  {
    title: '折合美元金额 (USD)',
    className: 'column-money',
    render: val => (
      <span>{numberFormat(val.usd_amount,
        getcurrencyBycode('cny').decimal_place, true)}&nbsp;
        USD
      </span>
    ),
  },
];


class Dashboard extends PureComponent {
  state = {
    operationkey: 'tab1',
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'assets/fetchAllAssets' });
  }

  onOperationTabChange = (key) => {
    this.setState({ operationkey: key });
    const { dispatch } = this.props;
    switch (key) {
      case 'tab1':
        dispatch({
          type: 'assets/fetchAllAssets',
        });
        break;
      case 'tab2':
        dispatch({
          type: 'assets/fetchDigitalAssets',
        });
        break;
      case 'tab3':
        dispatch({
          type: 'assets/fetchFiatAssets',
        });
        break;
      default:
        break;
    }
  }

  render() {
    const { data, loading } = this.props.assets;
    const contentList = {
      tab1: <div>
        <Card
          className={styles.projectList}
          style={{ marginBottom: 24 }}
          bordered={false}
          bodyStyle={{ padding: 0 }}
        >
          <Row>
            <Card.Grid className={styles.gridStyle}>
              <Meta
                avatar={<Avatar src={btcIcon} />}
                title="比特币总资产"
                description={<span><Filter value={data.btc_total_asset} keyname="formatNumber" /> BTC</span>}
              />
            </Card.Grid>
            <Card.Grid className={styles.gridStyle}>
              <Meta
                title="比特币总额"
                description={<span><Filter value={data.btc_total_amount} keyname="formatNumber" /> BTC</span>}
              />
            </Card.Grid>
            <Card.Grid className={styles.gridStyle}>
              <Meta
                title="美元总资产折合比特币"
                description={<span><Filter value={data.usd_to_btc_total_amount} keyname="formatNumber" /> BTC</span>}
              />
            </Card.Grid>
          </Row>
          <Row>
            <Card.Grid className={styles.gridStyle}>
              <Meta
                avatar={<Avatar src={bchIcon} />}
                title="比特现金总额"
                description={<span><Filter value={data.bch_total_amount} keyname="formatNumber" /> BCH</span>}
              />
            </Card.Grid>
            <Card.Grid className={styles.gridStyle}>
              <Meta
                avatar={<Avatar src={ethIcon} />}
                title="以太坊总额"
                description={<span><Filter value={data.eth_total_amount} keyname="formatNumber" /> ETH</span>}
              />
            </Card.Grid>
            <Card.Grid className={styles.gridStyle}>
              <Meta
                avatar={<Avatar src={ltcIcon} />}
                title="莱特币总额"
                description={<span><Filter value={data.ltc_total_amount} keyname="formatNumber" /> LTC</span>}
              />
            </Card.Grid>
          </Row>
        </Card>
        <Table dataSource={data.list} columns={columns} pagination={false} rowKey="currency_code" loading={loading} />
      </div>,
      tab2: <div>
        <Card
          className={styles.projectList}
          style={{ marginBottom: 24 }}
          bordered={false}
          bodyStyle={{ padding: 0 }}
        >
          <Card.Grid className={styles.gridStyle1}>
            <Meta
              avatar={<Avatar src={btcIcon} />}
              title="比特币总额"
              description={<span><Filter value={data.btc_total_amount} keyname="formatNumber" /> BCH</span>}
            />
          </Card.Grid>
          <Card.Grid className={styles.gridStyle1}>
            <Meta
              avatar={<Avatar src={bchIcon} />}
              title="比特现金总额"
              description={<span><Filter value={data.bch_total_amount} keyname="formatNumber" /> BCH</span>}
            />
          </Card.Grid>
          <Card.Grid className={styles.gridStyle1}>
            <Meta
              avatar={<Avatar src={ethIcon} />}
              title="以太坊总额"
              description={<span><Filter value={data.eth_total_amount} keyname="formatNumber" /> ETH</span>}
            />
          </Card.Grid>
          <Card.Grid className={styles.gridStyle1}>
            <Meta
              avatar={<Avatar src={ltcIcon} />}
              title="莱特币总额"
              description={<span><Filter value={data.ltc_total_amount} keyname="formatNumber" /> LTC</span>}
            />
          </Card.Grid>
        </Card>
        <Table dataSource={data.list} columns={columns} pagination={false} rowKey="currency_code" loading={loading} />
      </div>,
      tab3: <div>
        <Card
          className={styles.projectList}
          style={{ marginBottom: 24 }}
          bordered={false}
          bodyStyle={{ padding: 0 }}
        >
          <Card.Grid className={styles.gridStyle}>
            <Meta
              avatar={<Avatar src={usdIcon} />}
              title="美元总资产"
              description={<span><Filter value={Number(data.fiat_to_usd_total_amount) + Number(data.usd_total_amount)} keyname="formatNumber" /> USD</span>}
            />
          </Card.Grid>
          <Card.Grid className={styles.gridStyle}>
            <Meta
              title="美元总额"
              description={<span><Filter value={data.usd_total_amount} keyname="formatNumber" /> USD</span>}
            />
          </Card.Grid>
          <Card.Grid className={styles.gridStyle}>
            <Meta
              title="其它法币折合美元总额"
              description={<span><Filter value={data.fiat_to_usd_total_amount} keyname="formatNumber" /> USD</span>}
            />
          </Card.Grid>
        </Card>
        <Table dataSource={data.list} columns={THeader} pagination={false} rowKey="currency_code" loading={loading} />
      </div>,
    };
    return (

      <Card
        className={styles.tabsCard}
        bordered={false}
        tabList={operationTabList}
        onTabChange={this.onOperationTabChange}
      >
        {contentList[this.state.operationkey]}
      </Card>
    );
  }
}

export default connect(state => ({
  assets: state.assets,
}))(Dashboard);
