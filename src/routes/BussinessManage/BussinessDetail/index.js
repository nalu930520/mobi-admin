import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Button, Row, Col, Card, Table, Form, Modal, Menu } from 'antd';
import Filter from '../../../filter';
import mobileImg from '../../../assets/mobile.jpg';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import DescriptionList from '../../../components/DescriptionList';
import ChangeStatusModal from './BussinessStatusModal';
import BussinessOperationModal from './BussinessOperationModal';
import OTCModal from './OTCmodal';
import SupportBusinessModal from './supportBusiness';
import PasswordStrengthModel from './PassWordStrength';
import { numberFormat, getcurrencyBycode, codeTocurrencyCode } from '../../../utils/utils.js';
import styles from './index.less';

const { Description } = DescriptionList;
const ButtonGroup = Button.Group;
const dateFormat = 'YYYY-MM-DD HH:mm:ss';

const extra = (userInfo) => {
  return (
    <Row>
      <Col xs={12} sm={12}>
        <div className={styles.textSecondary}>承兑商上架状态</div>
        <div className={styles.heading}><Filter value={userInfo.put_away_status} keyname="bussinessStatus" /></div>
      </Col>
      <Col xs={12} sm={12}>
        <div className={styles.textSecondary}>承兑商登录状态</div>
        <div className={styles.heading}><Filter value={userInfo.login_status} keyname="accountStatus" /></div>
      </Col>
    </Row>
  );
};

const description = (userInfo) => {
  return (
    <DescriptionList className={styles.headerList} size="small" col="2">
      <Description term="创建时间">{moment.unix(userInfo.created_at).format(dateFormat)}</Description>
      <Description term="用户名">{userInfo.username}</Description>
    </DescriptionList>
  );
};
const descriptionUser = (userInfo) => {
  return (
    <DescriptionList className={styles.headerList} size="small" col="3">
      <Description term="创建时间">{moment.unix(userInfo.created_at).format(dateFormat)}</Description>
      <Description term="用户ID">{userInfo.id}</Description>
      <Description term="用户名">{userInfo.username}</Description>
    </DescriptionList>
  );
};

const tabList = [{
  key: '0',
  tab: '通用',
}, {
  key: '1',
  tab: '用户信息',
}, {
  key: '2',
  tab: '支持商户',
}];

const operationTabList = [{
  key: '11',
  tab: 'OTC交易',
}, {
  key: '7',
  tab: 'Onchain收币',
}, {
  key: '6',
  tab: 'Onchain发币',
}, {
  key: '5',
  tab: 'OTC发送',
}, {
  key: '9',
  tab: 'OTC退款',
}];

const columns1 = [{
  title: '货币',
  dataIndex: 'currency_code',
  render: val => val.toUpperCase(),
  key: 'currency_code',
  width: '80%',
}, {
  title: '余额',
  key: 'balance',
  render: val => (
    <span>
      {numberFormat(val.balance, getcurrencyBycode(val.currency_code).decimal_place, false, 8)}&nbsp;
      {codeTocurrencyCode(val.currency_code)}
    </span>
  ),
  width: '20%',
}];

const columns2 = [{
  title: '创建时间',
  dataIndex: 'created_at',
  render: val => (<span>{moment.unix(val).format('YYYY-MM-DD HH:mm:ss')}</span>),
  key: 'created_at',
}, {
  title: '最后修改时间',
  dataIndex: 'updated_at',
  render: val => (<span>{moment.unix(val).format('YYYY-MM-DD HH:mm:ss')}</span>),
  key: 'updated_at',
}, {
  title: '银行',
  dataIndex: 'bank_name',
  key: 'bank_name',
}, {
  title: '收款人姓名',
  dataIndex: 'receiver_name',
  key: 'receiver_name',
}, {
  title: '银行卡卡号',
  dataIndex: 'card_number',
  key: 'card_number',
}, {
  title: '',
  key: 'is_default',
  render: val => (
    <div>{val.is_default ? <div className={styles.defaultSpan}>默认</div> : ''}</div>
  ),
}];

const columns4 = [{
  title: '创建时间',
  dataIndex: 'created_at',
  render: val => (<span>{moment.unix(val).format('YYYY-MM-DD HH:mm:ss')}</span>),
  key: 'created_at',
}, {
  title: '订单号',
  dataIndex: 'sn',
  key: 'sn',
}, {
  title: '状态',
  dataIndex: 'status',
  key: 'status',
  render: val => (<Filter value={val} keyname="txStatus" />),
}, {
  title: '交易货币',
  dataIndex: 'payeeRemainBalanceCurrency',
  key: 'payeeRemainBalanceCurrency',
}, {
  title: '交易总金额',
  key: 'payeeRemainBalance',
  render: val => (
    <span>{numberFormat(val.amount,
    getcurrencyBycode(val.currencyObject.code).decimal_place)}
      {codeTocurrencyCode(val.currencyObject.code)}
    </span>
  ),
}, {
  title: '购买货币',
  dataIndex: 'payeeRemainBalanceCurrencyCode',
  key: 'payeeRemainBalanceCurrencyCode',
}, {
  title: '购买总数量',
  dataIndex: 'payeeRemainBalanceCurrencyNum',
  key: 'payeeRemainBalanceCurrencyNum',
}, {
  title: '付款人',
  dataIndex: 'payerObject',
  key: 'payerObject',
  render: val => (<span>{val ? `(+${val.mobileCode} ${val.mobile}) ${val.address}` : '-'}</span>),
}];

@connect(state => ({
  bussinessDetail: state.bussinessDetail,
}))
@Form.create()
export default class BussinessDetail extends Component {
  state = {
    bussinessOperationVisable: false,
    groupModalVisible: false,
    otcModalVisible: false,
    passwordModalVisible: false,
    SupportBusinessStateVisable: false,
    modalKey: '',
    modalName: '',
    password: '',
    bussinessKey: '0',
    rowData: {},
  }

  componentDidMount() {
  }
  onTabChange = (key, type) => {
    this.setState({ [type]: key });
    const { dispatch } = this.props;
    const { userInfo } = this.props.bussinessDetail;
    // const { id } = userdetail;
    if (type === 'bussinessKey') {
      if (key === '2') {
        dispatch({ type: 'bussinessDetail/fetchCustomerRelations',
          payload: {
            merchant_id: userInfo.merchant_id,
            page: 1,
            per_page: 10,
          },
        });
      }
    } else {
      // dispatch({ type: 'bussinessDetail/clearTransactionList' });
      // dispatch({
      //   type: 'bussinessDetail/fetchUserTransactionsInfo',
      //   payload: {
      //     customer_id: id,
      //     tx_type: key, // onchain收币 7, onchain发币 6, offchain转账 5
      //     page: 1,
      //     per_page: 10,
      //   },
      // });
    }
  }
  onPageChange = (pagination) => {
    // const { dispatch } = this.props;
    // const { id } = this.props.userdetail;
    // const { exchangeKey } = this.state;
    // dispatch({
    //   type: 'bussinessDetail/fetchUserTransactionsInfo',
    //   payload: {
    //     customer_id: id,
    //     tx_type: exchangeKey,
    //     page: pagination.current,
    //     per_page: pagination.pageSize,
    //   },
    // });
  }
  relationPageChange(pagination) {
    const { dispatch } = this.props;
    const { userInfo } = this.props.bussinessDetail;
    dispatch({
      type: 'bussinessDetail/fetchCustomerRelations',
      payload: {
        merchant_id: userInfo.merchant_id,
        page: pagination.current,
        per_page: pagination.pageSize,
      },
    });
  }
  showModal = (type, key, name) => {
    this.setState({
      [type]: true,
    });
    this.setState({
      modalKey: key,
      modalName: name,
    });
  }

  handleCancel = (type) => {
    this.setState({
      [type]: false,
    });
  }

  handleMenuClick = (e, key, name, data) => {
    console.info(data);
    if (key === 'resetPassword') {
      this.setState({
        passwordModalVisible: true,
        rowData: data,
      });
    } else {
      this.showModal('groupModalVisible', key, name);
    }
  }
  addSupportBusiness = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'bussinessDetail/fetchPublicMerchants' });
    this.setState({
      SupportBusinessStateVisable: true,
    });
  }
  removeSupportBusiness = (val) => {
    const { dispatch } = this.props;
    const { userInfo } = this.props.bussinessDetail;
    dispatch({
      type: 'bussinessDetail/DeleteCustomer',
      payload: {
        relation_id: val.relation_id,
        merchant_id: userInfo.merchant_id,
      },
    });
  }
  render() {
    const columns3 = [{
      title: '创建时间',
      dataIndex: 'created_at',
      render: val => (<span>{moment.unix(val).format('YYYY-MM-DD HH:mm:ss')}</span>),
      key: 'created_at',
    }, {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    }, {
      title: '登录密码',
      dataIndex: 'bank',
      key: 'bank',
    }, {
      title: '用户权限',
      dataIndex: 'reciverName',
      key: 'reciverName',
    }, {
      title: '操作',
      key: 'action',
      render: (text, record) => {
        return (
          <span>
            <a onClick={e => this.handleMenuClick('groupModalVisible', 'updateUserName', '修改用户名', e)}>修改用户名</a> &nbsp;&nbsp;
            <a onClick={() => this.handleMenuClick('groupModalVisible', 'resetPassword', '修改用户名', record)}>修改登录密码</a>
          </span>
        );
      },
    }];
    const columns5 = [{
      title: '手机号',
      dataIndex: 'mobile',
      key: 'mobile',
    }, {
      title: '用户ID',
      dataIndex: 'customer_id',
      key: 'customer_id',
    }, {
      title: '操作',
      key: 'action',
      render: (record) => {
        return (
          <span>
            <a onClick={() => this.removeSupportBusiness(record)}>移除</a>
          </span>
        );
      },
    }];
    const { userInfo, assets, cards, otcInfo, currencyInfoLoading, transactionList, transactionLoading, relationsBusinessList, supportBusinessVisable, relationLoading } = this.props.bussinessDetail;
    const { bussinessOperationVisable, groupModalVisible, modalName, modalKey, otcModalVisible, passwordModalVisible, SupportBusinessStateVisable, rowData } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="resetPassword" menuName="重置承兑商密码">
          重置承兑商密码
        </Menu.Item>
        <Menu.Item key="updateUserName" menuName="修改承兑商用户名">
          修改承兑商用户名
        </Menu.Item>
        <Menu.Item key="resetInitPassword" menuName="查看承兑商初始密码">
          查看承兑商初始密码
        </Menu.Item>
      </Menu>
    );
    const action = (obj) => {
      return (
        <div>
          <Button type="primary" onClick={() => { obj.showModal('bussinessOperationVisable'); }}>查看承兑商操作日志</Button>
          <ButtonGroup>
            <Button onClick={() => { obj.showModal('groupModalVisible', 'bussinessStatus', '修改承兑商状态'); }}>修改承兑商上架状态</Button>
            <Button onClick={() => { obj.showModal('groupModalVisible', 'accountStatus', '修改承兑商状态'); }}>修改承兑商登陆状态</Button>
          </ButtonGroup>
        </div>
      );
    };
    return (
      <PageHeaderLayout
        title={`承兑商号: ${userInfo.merchant_id}`}
        logo={<img alt="" src={mobileImg} />}
        action={action(this)}
        content={this.state.bussinessKey === '0' ? description(userInfo) : descriptionUser(userInfo)}
        extraContent={extra(userInfo)}
        tabList={tabList}
        onTabChange={(key) => { this.onTabChange(key, 'bussinessKey'); }}
      >

        {this.state.bussinessKey === '0' &&
          <div>
            <Card title="承兑商资金详情" bordered={false} className={styles.tabsCard}>
              <Table
                pagination={false}
                loading={currencyInfoLoading}
                columns={columns1}
                dataSource={assets}
                rowKey="currency_code"
              />
            </Card>
            <Card
              title="OTC手续费与限额"
              bordered={false}
              className={styles.tabsCard}
              extra={<div><Button type="primary" onClick={() => { this.showModal('otcModalVisible', 'commission', '修改手续费费率'); }}>修改手续费费率</Button></div>}
            >
              <h3>OTC手续费</h3>
              <DescriptionList style={{ marginBottom: 24 }} col="2">
                <Description term="当前手续费费率">
                  {
                    otcInfo.current_fee
                  }%
                </Description>
                <Description term="全部累积手续费">
                  {numberFormat(otcInfo.total_fee, 8, false, 8)}&nbsp;USDT
                </Description>
              </DescriptionList>
            </Card>
            <Card title="承兑商银行卡" bordered={false} className={styles.tabsCard}>
              <Table
                pagination={false}
                loading={currencyInfoLoading}
                columns={columns2}
                dataSource={cards}
                rowKey="card_number"
              />
            </Card>
            <Card
              className={styles.tabsCard}
              bordered={false}
              tabList={operationTabList}
              onTabChange={(key) => { this.onTabChange(key, 'operationTabList'); }}
            >
              <Table
                pagination={transactionList.pagination}
                loading={transactionLoading}
                dataSource={transactionList.list}
                columns={columns4}
                onChange={this.onPageChange}
              />
            </Card>
          </div>
        }
        {this.state.bussinessKey === '1' &&
          <div>
            <Card title="用户列表" bordered={false} className={styles.tabsCard}>
              <Table
                pagination={false}
                loading={currencyInfoLoading}
                columns={columns3}
                dataSource={[]}
              />
            </Card>
          </div>
        }
        {this.state.bussinessKey === '2' &&
          <div>
            <Card
              title="支持商户列表"
              bordered={false}
              className={styles.tabsCard}
              extra={<div><Button type="primary" onClick={() => { this.addSupportBusiness(); }}>添加支持商户</Button></div>}
            >
              <Table
                pagination={relationsBusinessList.pagination}
                loading={relationLoading}
                columns={columns5}
                dataSource={relationsBusinessList.list}
                onChange={this.relationPageChange}
                rowKey={list => list.relation_id}
              />
            </Card>
          </div>
        }
        {groupModalVisible && <ChangeStatusModal
          visible={groupModalVisible}
          modalName={modalName}
          modalKey={modalKey}
          handleCancel={() => { this.handleCancel('groupModalVisible'); }}
        />}
        {otcModalVisible && <OTCModal
          visible={otcModalVisible}
          modalName={modalName}
          modalKey={modalKey}
          handleCancel={() => { this.handleCancel('otcModalVisible'); }}
        />}
        {bussinessOperationVisable && <BussinessOperationModal
          visible={bussinessOperationVisable}
          handleCancel={() => { this.handleCancel('bussinessOperationVisable'); }}
        />}
        {passwordModalVisible && <PasswordStrengthModel
          visible={passwordModalVisible}
          createFlg="false"
          title="修改登录密码"
          rowData={rowData}
          handleCancel={() => { this.handleCancel('passwordModalVisible'); }}
        />}
        {supportBusinessVisable && <SupportBusinessModal
          visible={SupportBusinessStateVisable}
          handleCancel={() => { this.handleCancel('SupportBusinessStateVisable'); }}
        />}
      </PageHeaderLayout>
    );
  }
}
