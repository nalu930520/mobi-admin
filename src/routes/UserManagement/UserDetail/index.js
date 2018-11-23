import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Button, Row, Col, Upload, Icon, message, Card, DatePicker, Table, Select, Form, Modal, Timeline, Radio, Menu, Dropdown, Input } from 'antd';
import Filter from '../../../filter';
import mobileImg from '../../../assets/mobile.jpg';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import DescriptionList from '../../../components/DescriptionList';
import C2cPersonalForm from '../../C2C/Customer/PersonalForm';
import UserInfo from '../../C2C/Customer/UserInfo';
import ChangeStatusModal from './ChangeStatusModal';
import ChangeWithdrawModal from './ChangeWithdrawModal';
import AccountOperationModal from './AccountOperationModal';
import WithdrawOperationModal from './WithdrawOperationModal';
import { numberFormat, getcurrencyBycode, codeTocurrencyCode } from '../../../utils/utils.js';
import styles from './index.less';
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const { Description } = DescriptionList;
const ButtonGroup = Button.Group;
const { TextArea } = Input;
const Option = Select.Option;
const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const getOprationType = (operationType) => {
  let type = '';
  switch (operationType) {
    case 3:
      type = '商家认证';
      break;
    case 4:
      type = '挂单锁';
      break;
    case 5:
      type = '修改用户手续费';
      break;
    case 11:
      type = '购买锁';
      break;
    default:
      type = '';
      break;
  }
  return type;
};
const action = (obj) => {
  return (
    <div>
      <ButtonGroup>
        <Button onClick={() => { obj.showModal('accountOperationVisable'); }}>账户操作日志</Button>
      </ButtonGroup>
      <Button type="primary" onClick={() => { obj.showModal('statusVisible'); }}>修改账户状态</Button>
    </div>
  );
};

const extra = (status) => {
  return (
    <Row>
      <Col xs={24} sm={24}>
        <div className={styles.textSecondary}>账户状态</div>
        <div className={styles.heading}><Filter value={status} keyname="accountStatus" /></div>
      </Col>
    </Row>
  );
};

const description = (userInfo) => {
  return (
    <DescriptionList className={styles.headerList} size="small" col="3">
      <Description term="用户ID">{userInfo.id}</Description>
      <Description term="注册时间">{moment.unix(userInfo.created_at).format(dateFormat)}</Description>
      <Description term="最后登录时间">{moment.unix(userInfo.last_login_time).format(dateFormat)}</Description>
      <Description term="用户名">{userInfo.mobi_id}</Description>
      <Description term="注册国家">{userInfo.country_name}</Description>
      <Description term="最后登录IP">{userInfo.last_login_ip}</Description>
      <Description term="用户昵称">{userInfo.nickname}</Description>
      <Description term="系统语言">{userInfo.system_language}</Description>
      <Description term="自由兑换">{userInfo.auto_convert ? '开启' : '锁定'}</Description>
    </DescriptionList>
  );
};

const tabList = [{
  key: 'detail',
  tab: '通用',
}, {
  key: 'c2c',
  tab: 'C2C交易',
}, {
  key: 'RealNameSystem',
  tab: '实名认证',
}];

const operationTabList1 = [{
  key: 'customer_crypto_info',
  tab: '数字货币',
}, {
  key: 'customer_fiat_info',
  tab: '法币',
}];
const operationTabList2 = [{
  key: '7',
  tab: 'Onchain收币',
}, {
  key: '6',
  tab: 'Onchain发币',
}, {
  key: '5',
  tab: 'Offchain转账',
}, {
  key: '11',
  tab: '货币兑换',
}, {
  key: '12',
  tab: '兑换撤销',
}, {
  key: '4',
  tab: '系统退款',
}];

const columns1 = [{
  title: '货币',
  dataIndex: 'currency',
  render: val => val.toUpperCase(),
  key: 'currency',
}, {
  title: '创建时间',
  dataIndex: 'created_at',
  key: 'created_at',
  render: val => (<span>{moment.unix(val).format('YYYY-MM-DD HH:mm:ss')}</span>),
}, {
  title: '地址',
  dataIndex: 'address',
  key: 'address',
}, {
  title: '余额',
  key: 'balance',
  render: val => (
    <span>{numberFormat(val.balance,
      getcurrencyBycode(val.currency).decimal_place)}&nbsp;{codeTocurrencyCode(val.currency)}
    </span>
  ),
}];

const columns2 = [{
  title: '货币',
  dataIndex: 'currency',
  render: val => val.toUpperCase(),
  key: 'currency',
}, {
  title: '当日限额',
  key: 'today_limit',
  render: val => (<span>{val.today_limit}&nbsp;{codeTocurrencyCode(val.currency)}</span>),
}, {
  title: '日累积提现量',
  key: 'today_already_withdraw_amount',
  render: val => (
    <span>{numberFormat(val.today_already_withdraw_amount,
      getcurrencyBycode(val.currency).decimal_place)}&nbsp;{codeTocurrencyCode(val.currency)}
    </span>),
}, {
  title: '累积提现量',
  key: 'total_withdraw_amount',
  render: val => (
    <span>{numberFormat(val.total_withdraw_amount,
      getcurrencyBycode(val.currency).decimal_place)}&nbsp;{codeTocurrencyCode(val.currency)}
    </span>),
}];

const columns3 = [{
  title: '创建时间',
  dataIndex: 'created_at',
  render: val => (<span>{moment.unix(val).format('YYYY-MM-DD HH:mm:ss')}</span>),
  key: 'created_at',
}, {
  title: 'Mobi交易ID',
  dataIndex: 'sn',
  key: 'sn',
}, {
  title: '状态',
  dataIndex: 'status',
  key: 'status',
  render: val => (<Filter value={val} keyname="txStatus" />),
}, {
  title: '货币',
  dataIndex: 'currencyObject',
  key: 'currencyObject',
  render: val => val.code,
}, {
  title: '交易金额',
  key: 'amount',
  render: val => (<span>{numberFormat(val.amount,
    getcurrencyBycode(val.currencyObject.code).decimal_place)}
    &nbsp;{codeTocurrencyCode(val.currencyObject.code)}</span>
  ),
}, {
  title: '手续费',
  key: 'fee',
  render: val => (<span>{numberFormat(val.fee,
    getcurrencyBycode(val.currencyObject.code).decimal_place)}
    &nbsp;{codeTocurrencyCode(val.currencyObject.code)}</span>
  ),
}, {
  title: '付款人',
  dataIndex: 'payerObject',
  key: 'payerObject',
  render: val => (<span>{val ? '(+' + val.mobileCode + " " + val.mobile + ') ' + val.address : '-'}</span>),
}, {
  title: '收款人',
  dataIndex: 'payeeObject',
  key: 'payeeObject',
  render: val => (<span>{val ? '(+' + val.mobileCode + " " + val.mobile + ') ' + val.address : '-'}</span>),
}];

const columns4 = [{
  title: '创建时间',
  dataIndex: 'created_at',
  render: val => (<span>{moment.unix(val).format('YYYY-MM-DD HH:mm:ss')}</span>),
  key: 'created_at',
}, {
  title: 'Mobi交易ID',
  dataIndex: 'sn',
  key: 'sn',
}, {
  title: '状态',
  dataIndex: 'status',
  key: 'status',
  render: val => (<Filter value={val} keyname="txStatus" />),
}, {
  dataIndex: 'currencyObject',
  key: 'currencyObject',
  render: val => val.code,
}, {
  title: '交易金额',
  key: 'amount',
  render: val => (<span>{numberFormat(val.amount,
    getcurrencyBycode(val.currencyObject.code).decimal_place)}
    &nbsp;{codeTocurrencyCode(val.currencyObject.code)}</span>
  ),
}, {
  title: '手续费',
  key: 'fee',
  render: val => (<span>{numberFormat(val.fee,
    getcurrencyBycode(val.currencyObject.code).decimal_place)}
    &nbsp;{codeTocurrencyCode(val.currencyObject.code)}</span>
  ),
}, {
  title: '付款人',
  dataIndex: 'payerObject',
  key: 'payerObject',
  render: val => (<span>{val ? '(+' + val.mobileCode + " " + val.mobile + ') ' + val.address : '-'}</span>),
}, {
  title: '收款人',
  dataIndex: 'payeeObject',
  key: 'payeeObject',
  render: val => (<span>{val ? '(+' + val.mobileCode + " " + val.mobile + ') ' + val.address : '-'}</span>),
}];

const columns5 = [{
  title: '创建时间',
  dataIndex: 'created_at',
  render: val => (<span>{moment.unix(val).format('YYYY-MM-DD HH:mm:ss')}</span>),
  key: 'created_at',
}, {
  title: 'Mobi交易ID',
  dataIndex: 'sn',
  key: 'sn',
}, {
  title: '类型',
  dataIndex: 'type',
  key: 'type',
  render: val => <span>{val === '1' ? '转入' : '转出'}</span>,
}, {
  title: '状态',
  dataIndex: 'status',
  key: 'status',
  render: val => (<Filter value={val} keyname="txStatus" />),
}, {
  title: '货币',
  dataIndex: 'payeeRemainBalanceCurrencyCode',
  key: 'payeeRemainBalanceCurrencyCode',
}, {
  title: '交易金额',
  key: 'payeeRemainBalance',
  render: val => (<span>{numberFormat(val.amount,
    getcurrencyBycode(val.currencyObject.code).decimal_place)}
    &nbsp;{codeTocurrencyCode(val.currencyObject.code)}</span>
  ),
}, {
  title: '手续费',
  key: 'fee',
  render: val => (<span>{numberFormat(val.fee,
    getcurrencyBycode(val.currencyObject.code).decimal_place)}
    &nbsp;{codeTocurrencyCode(val.currencyObject.code)}</span>
  ),
}, {
  title: '付款人',
  dataIndex: 'payerObject',
  key: 'payerObject',
  render: val => (<span>{val ? '(+' + val.mobileCode + " " + val.mobile + ') ' + val.address : '-'}</span>),
}, {
  title: '收款人',
  dataIndex: 'payeeObject',
  key: 'payeeObject',
  render: val => (<span>{val ? '(+' + val.mobileCode + " " + val.mobile + ') ' + val.address : '-'}</span>),
}];

const columns6 = [{
  title: '创建时间',
  dataIndex: 'created_at',
  render: val => (<span>{moment.unix(val).format('YYYY-MM-DD HH:mm:ss')}</span>),
  key: 'created_at',
}, {
  title: 'Mobi交易ID',
  dataIndex: 'sn',
  key: 'sn',
}, {
  title: '状态',
  dataIndex: 'status',
  key: 'status',
  render: val => (<Filter value={val} keyname="txStatus" />),
}, {
  title: '原始货币',
  dataIndex: 'currencyObject',
  key: 'currencyObject',
  render: val => val.code,
}, {
  title: '原始货币金额',
  render: val => (<span>{numberFormat(val.amount,
    getcurrencyBycode(val.currencyObject.code).decimal_place)}
    &nbsp;{codeTocurrencyCode(val.currencyObject.code)}</span>
  ),
}, {
  title: '目标货币',
  dataIndex: 'targetCurrencyObject',
  key: 'targetCurrencyObject',
  render: val => val.code,
}, {
  title: '目标货币金额',
  render: val => (<span>{numberFormat(val.target_amount,
    getcurrencyBycode(val.targetCurrencyObject.code).decimal_place)}
    &nbsp;{codeTocurrencyCode(val.targetCurrencyObject.code)}</span>
  ),
}, {
  title: '手续费',
  dataIndex: 'fee',
  key: 'fee',
}];

const columns7 = [{
  title: '创建时间',
  dataIndex: 'created_at',
  render: val => (<span>{moment.unix(val).format('YYYY-MM-DD HH:mm:ss')}</span>),
  key: 'created_at',
}, {
  title: 'Mobi交易ID',
  dataIndex: 'sn',
  key: 'sn',
}, {
  title: '状态',
  dataIndex: 'status',
  key: 'status',
  render: val => (<Filter value={val} keyname="txStatus" />),
}, {
  title: '原始货币',
  dataIndex: 'currencyObject',
  key: 'currencyObject',
  render: val => codeTocurrencyCode(val.code),
}, {
  title: '原始货币金额',
  render: val => (<span>{numberFormat(val.amount,
    getcurrencyBycode(val.currencyObject.code).decimal_place)}
    &nbsp;{codeTocurrencyCode(val.currencyObject.code)}</span>
  ),
}, {
  title: '目标货币',
  dataIndex: 'targetCurrencyObject',
  key: 'targetCurrencyObject',
  render: val => codeTocurrencyCode(val.code),
}, {
  title: '目标货币金额',
  render: val => (<span>{numberFormat(val.target_amount,
    getcurrencyBycode(val.targetCurrencyObject.code).decimal_place)}
    &nbsp;{codeTocurrencyCode(val.targetCurrencyObject.code)}</span>
  ),
}];

const columns8 = [{
  title: '创建时间',
  dataIndex: 'created_at',
  render: val => (<span>{moment.unix(val).format('YYYY-MM-DD HH:mm:ss')}</span>),
  key: 'created_at',
}, {
  title: 'Mobi交易ID',
  dataIndex: 'sn',
  key: 'sn',
}, {
  title: '状态',
  dataIndex: 'status',
  key: 'status',
  render: val => (<Filter value={val} keyname="txStatus" />),
}, {
  title: '货币',
  dataIndex: 'currencyObject',
  key: 'currencyObject',
  render: val => codeTocurrencyCode(val.code),
}, {
  title: '交易总额',
  key: 'amount',
  render: val => (<span>{numberFormat(val.amount,
    getcurrencyBycode(val.currencyObject.code).decimal_place)}
    &nbsp;{codeTocurrencyCode(val.currencyObject.code)}</span>
  ),
}];
function handleMenuClick(e,num) {
  e.setState({
    visible: parseInt(num.key)
  });
}
const menu = (obj) => {
  return (
    <Menu onClick={(e) => handleMenuClick(obj,e)}>
      <Menu.Item key="1">个人信息</Menu.Item>
      <Menu.Item key="2">证件信息</Menu.Item>
      <Menu.Item key="3">地址信息</Menu.Item>
    </Menu>
  )
}

const extraContent = (obj) => {
  return (
    <div className={styles.extraContent}>
      <RadioGroup defaultValue="all">
        <Button>实名认证操作日志</Button>&nbsp;
        <Button type="primary" onClick={() => obj.showModal1()}>修改实名认证等级</Button>&nbsp;
        <Dropdown overlay={menu(obj)}>
          <Button>
            添加/修改用户信息 <Icon type="down" />
          </Button>
        </Dropdown>
      </RadioGroup>
    </div>
  )
}

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJPG = file.type === 'image/jpeg';
  if (!isJPG) {
    message.error('You can only upload JPG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJPG && isLt2M;
}


let columns = columns3;

@connect(state => ({
  userdetail: state.userdetail,
  customer: state.customer,
}))
@Form.create()
export default class AdvancedProfile extends Component {
  state = {
    assetsKey: 'customer_crypto_info',
    exchangeKey: '7',
    userInfoKey: 'detail',
    statusVisible: false,
    withdrawVisible: false,
    loading: false,
    visible: -1,
    accountOperationVisable: false,
    withdrawOperationVisable: false,
  }
 
  componentDidMount() {
    const { dispatch, customer } = this.props;
    dispatch({
      type: 'customer/fetchDetail',
      payload: { id: customer.id },
    });
    dispatch({
      type: 'customer/fetchUserLogs',
      payload: {
        customer_id: customer.id,
      },
    });
  }
  showModal1 = () => {
    this.setState({
      visible: 0,
    });
  }

  handleOk1 = (e) => {
    console.log(e);
    this.setState({
      visible: -1,
    });
  }

  handleCancel1 = (e) => {
    console.log(e);
    this.setState({
      visible: -1,
    });
  }
  onTabChange = (key, type) => {
    this.setState({ [type]: key });
    switch (key) {
      case '7':
        columns = columns3;
        break;
      case '6':
        columns = columns4;
        break;
      case '5':
        columns = columns5;
        break;
      case '11':
        columns = columns6;
        break;
      case '12':
        columns = columns7;
        break;
      case '4':
        columns = columns8;
        break;
      default:
        columns = columns3;
    }
    const { dispatch, userdetail } = this.props;
    const { id } = userdetail;
    if (type === 'userInfoKey' && key === 'c2c') {
      dispatch({
        type: 'customer/save',
        payload: { id: userdetail.id },
      });
    }
    if (type === 'exchangeKey') {
      dispatch({ type: 'userdetail/clearTransactionList' });
      dispatch({
        type: 'userdetail/fetchUserTransactionsInfo',
        payload: {
          customer_id: id,
          tx_type: key, // onchain收币 7, onchain发币 6, offchain转账 5, 货币兑换 11, 兑换撤销 12, 系统退款 4
          page: 1,
          per_page: 10,
        },
      });
    }
  }


  onPageChange = (pagination) => {
    const { dispatch } = this.props;
    const { id } = this.props.userdetail;
    const { exchangeKey } = this.state;
    dispatch({
      type: 'userdetail/fetchUserTransactionsInfo',
      payload: {
        customer_id: id,
        tx_type: exchangeKey,
        page: pagination.current,
        per_page: pagination.pageSize,
      },
    });
  }

  showModal = (type) => {
    this.setState({
      [type]: true,
    });
  }

  handleCancel = (type) => {
    this.setState({
      [type]: false,
    });
  }
  handleChange = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl => this.setState({
        imageUrl,
        loading: false,
      }));
    }
  }


  render() {
    const { form, dispatch, customer } = this.props;
    const { userLogs } = customer;
    const { userInfo, withdrawInfo, withdrawLoading, assetsInfo, assetsLoading,
      transactionList, transactionLoading }
      = this.props.userdetail;
    const { assetsKey, statusVisible, withdrawVisible, accountOperationVisable,
      withdrawOperationVisable } = this.state;
    const { getFieldDecorator } = form;
    const goodsColumns = [
      {
        title: '创建时间',
        dataIndex: 'id',
        key: 'id',
        render: (text, row, index) => {
          if (index < basicGoods.length) {
            return <a href="">{text}</a>;
          }
          return {
            children: <span style={{ fontWeight: 600 }}>总计</span>,
            props: {
              colSpan: 4,
            },
          };
        },
      },
      {
        title: '完成时间',
        dataIndex: 'name',
        key: 'name',
        render: '',
      },
      {
        title: '审核号',
        dataIndex: 'barcode',
        key: 'barcode',
        render: '',
      },
      {
        title: '验证类型',
        dataIndex: 'price',
        key: 'price',
        align: 'right',
        render: '',
      },
      {
        title: '审核结果',
        dataIndex: 'num',
        key: 'num',
        align: 'right',
        render: (text, row, index) => {
          if (index < basicGoods.length) {
            return text;
          }
          return <span style={{ fontWeight: 600 }}>{text}</span>;
        },
      },
      {
        title: '审核人',
        dataIndex: 'sadsa',
        key: 'sadsa',
        align: 'right',
        render: (text, row, index) => {
          if (index < basicGoods.length) {
            return text;
          }
          return <span style={{ fontWeight: 600 }}>{text}</span>;
        },
      },
      {
        title: '操作',
        dataIndex: 'amount11',
        key: 'amount11',
        align: 'right',
        render: (text, row, index) => {
          if (index < basicGoods.length) {
            return text;
          }
          return <span style={{ fontWeight: 600 }}>{text}</span>;
        },
      },
    ];
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">上传</div>
      </div>
    );
    const imageUrl = this.state.imageUrl;
    return (
      <PageHeaderLayout
        title={`注册手机: ${userInfo.mobile}`}
        logo={<img alt="" src={mobileImg} />}
        action={action(this)}
        content={description(userInfo)}
        extraContent={extra(userInfo.status)}
        tabList={tabList}
        onTabChange={(key) => { this.onTabChange(key, 'userInfoKey'); }}
      >
        {this.state.userInfoKey === 'detail' &&
          <div>
            <Card title="用户资金详情" bordered={false}>
              <DescriptionList style={{ marginBottom: 24 }} col="2">
                <Description term="数字货币">
                  {
                    !!assetsInfo.customer_crypto_info && assetsInfo.customer_crypto_info.length
                  }
                </Description>
                <Description term="已添加钱包">
                  {
                    !!assetsInfo.customer_crypto_info && assetsInfo.customer_crypto_info.map(obj =>
                      <span key={obj.currency}>{obj.currency.toUpperCase()}&nbsp;</span>
                    )
                  }
                </Description>
                <Description term="法币">
                  {
                    !!assetsInfo.customer_fiat_info && assetsInfo.customer_fiat_info.length
                  }
                </Description>
                <Description term="已添加钱包">
                  {
                    !!assetsInfo.customer_fiat_info && assetsInfo.customer_fiat_info.map(obj =>
                      <span key={obj.currency}>{obj.currency.toUpperCase()}&nbsp;</span>
                    )
                  }
                </Description>
              </DescriptionList>
            </Card>
            <Card
              className={styles.tabsCard}
              bordered={false}
              tabList={operationTabList1}
              onTabChange={(key) => { this.onTabChange(key, 'assetsKey'); }}
            >
              <Table
                pagination={false}
                loading={assetsLoading}
                columns={columns1}
                dataSource={assetsInfo[assetsKey]}
                rowKey="currency"
              />
            </Card>
            <Card
              title="限额与手续费"
              style={{ marginBottom: 24 }}
              bordered={false}
              extra={<div><Button onClick={() => { this.showModal('withdrawOperationVisable'); }}>限额操作日志</Button>&nbsp;<Button type="primary" onClick={() => { this.showModal('withdrawVisible'); }}>修改提现限额</Button></div>}
            >
              <h3>兑换手续费与累积量</h3>
              <DescriptionList style={{ marginBottom: 24 }} col="3">
                <Description term="当前额外手续费">0.5%</Description>
                <Description term="日累积兑换量">{numberFormat(withdrawInfo.today_conversion_amount, getcurrencyBycode('usd').decimal_place)}&nbsp;{codeTocurrencyCode('usd')}</Description>
                <Description term="全部累积兑换量">{numberFormat(withdrawInfo.total_conversion_amount, getcurrencyBycode('usd').decimal_place)}&nbsp;{codeTocurrencyCode('usd')}</Description>
              </DescriptionList>
              <h3>数字货币提现限额与累积量</h3>
              <Table
                pagination={false}
                loading={withdrawLoading}
                columns={columns2}
                dataSource={withdrawInfo.info}
                rowKey="currency"
              />
            </Card>
            <Card
              className={styles.tabsCard}
              bordered={false}
              tabList={operationTabList2}
              onTabChange={(key) => { this.onTabChange(key, 'exchangeKey'); }}
            >
              <Table
                pagination={transactionList.pagination}
                loading={transactionLoading}
                dataSource={transactionList.list}
                columns={columns}
                onChange={this.onPageChange}
              />
            </Card>
          </div>
        }
        {
          this.state.userInfoKey === 'c2c' && <div>
            <Card
              className={styles.tabsCard}
              bordered={false}
              title={<div className={styles.titlewraper}>
                <h3>C2C交易用户详情</h3>
                <Button
                  type="primary"
                  onClick={() => {
                    Modal.info({
                      title: '操作日志',
                      width: '800px',
                      content: (
                        <div style={{ height: '300px', overflow: 'scroll', paddingTop: '4px' }}>
                          <Timeline>
                            {userLogs.map(data =>
                              <Timeline.Item>操作邮箱：{data.admin_email} 操作记录：{getOprationType(data.operation_type)} 时间：{moment(data.created_at * 1000).format('YYYY-MM-DD, h:mm:ss')}</Timeline.Item>)}
                          </Timeline>
                        </div>
                      ),
                    });
                  }}
                >操作日志</Button>
              </div>}
            >
              <C2cPersonalForm customer={customer} form={form} dispatch={dispatch} />
            </Card>
            <UserInfo />
          </div>
        }
        {
          this.state.userInfoKey === 'RealNameSystem' && <div>
            <Modal
              title="修改账户类型"
              visible={this.state.visible===0}
              onOk={this.handleOk1}
              onCancel={this.handleCancel1}
            >
              <Form layout="vertical">
                <FormItem label="实名认证等级">
                  {getFieldDecorator('title', {
                    rules: [{ required: true, message: '请选择实名认证等级' }],
                  })(
                    <Select>
                      <Option value="jack">Jack</Option>
                      <Option value="lucy">Lucy</Option>
                      <Option value="disabled" disabled>Disabled</Option>
                      <Option value="Yiminghe">yiminghe</Option>
                    </Select>
                  )}
                </FormItem>
                <FormItem label="备注">
                  {getFieldDecorator('description')(<TextArea rows={4} />)}
                </FormItem>
              </Form>
            </Modal>
            <Modal
              title="添加/修改个人信息"
              visible={this.state.visible===1}
              onOk={this.handleOk1}
              okText='提交'
              onCancel={this.handleCancel1}
            >
              <Form layout="vertical">
                <FormItem label="邮箱:">
                  {getFieldDecorator('title', {
                    rules: [{ required: true, message: '请选择实名认证等级' }],
                  })(<Input placeholder="请输入" />)}
                </FormItem>
                <FormItem label="名:">
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: '请选择实名认证等级' }],
                  })(<Input placeholder="请输入" />)}
                </FormItem>
                <FormItem label="中间名:">
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: '请选择实名认证等级' }],
                  })(<Input placeholder="请输入" />)}
                </FormItem>
                <FormItem label="姓:">
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: '请选择实名认证等级' }],
                  })(<Input placeholder="请输入" />)}
                </FormItem>
                <FormItem label="选择日期:">
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: '请选择日期' }],
                  })(<DatePicker placeholder="请选择日期" />)}
                </FormItem>
                <FormItem label="性别:">
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: '请选择日期' }],
                  })(
                    <RadioGroup>
                      <Radio value={1}>男</Radio>
                      <Radio value={2}>女</Radio>
                    </RadioGroup>
                  )}
                </FormItem>
                <FormItem label="国籍:">
                  {getFieldDecorator('title', {
                    rules: [{ required: true, message: '请选择实名认证等级' }],
                  })(
                    <Select>
                      <Option value="jack">Jack</Option>
                      <Option value="lucy">Lucy</Option>
                      <Option value="disabled" disabled>Disabled</Option>
                      <Option value="Yiminghe">yiminghe</Option>
                    </Select>
                  )}
                </FormItem>
                <FormItem label="收入来源:">
                  {getFieldDecorator('title', {
                    rules: [{ required: true, message: '请选择实名认证等级' }],
                  })(
                    <Select>
                      <Option value="jack">Jack</Option>
                      <Option value="lucy">Lucy</Option>
                      <Option value="disabled" disabled>Disabled</Option>
                      <Option value="Yiminghe">其他</Option>
                    </Select>
                  )}
                </FormItem>
                <FormItem label="来源:">
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: '请选择日期' }],
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Form>
            </Modal>
            <Modal
              title="添加/修改证件信息"
              visible={this.state.visible===2}
              onOk={this.handleOk1}
              okText='提交'
              onCancel={this.handleCancel1}
            >
              <Form layout="vertical">
                <FormItem label="证件类型:">
                  {getFieldDecorator('title', {
                    rules: [{ required: true, message: '请选择实名认证等级' }],
                  })(
                    <Select>
                      <Option value="jack">Jack</Option>
                      <Option value="lucy">Lucy</Option>
                      <Option value="disabled" disabled>Disabled</Option>
                      <Option value="Yiminghe">yiminghe</Option>
                    </Select>
                  )}
                </FormItem>
                <FormItem label="证件号码:">
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: '请选择实名认证等级' }],
                  })(<Input placeholder="请输入" />)}
                </FormItem>
                <FormItem label="证件失效期:">
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: '请选择实名认证等级' }],
                  })(<DatePicker placeholder="请选择日期" />)}
                </FormItem>
                <FormItem label="证件信息页照片:">
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: '请选择实名认证等级' }],
                  })(
                    <Upload
                      name="avatar"
                      listType="picture-card"
                      className="avatar-uploader"
                      showUploadList={false}
                      action="//jsonplaceholder.typicode.com/posts/"
                      beforeUpload={beforeUpload}
                      onChange={this.handleChange}
                    >
                      {imageUrl ? <img src={imageUrl} alt="avatar" /> : uploadButton}
                    </Upload>
                  )}
                </FormItem>
                <FormItem label="本人手持证件照片:">
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: '请选择日期' }],
                  })(
                    <Upload
                    name="avatar"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    action="//jsonplaceholder.typicode.com/posts/"
                    beforeUpload={beforeUpload}
                    onChange={this.handleChange}
                  >
                    {imageUrl ? <img src={imageUrl} alt="avatar" /> : uploadButton}
                  </Upload>
                  )}
                </FormItem>
              </Form>
            </Modal>
            <Modal
              title="添加/修改地址信息"
              visible={this.state.visible===3}
              onOk={this.handleOk1}
              okText='提交'
              onCancel={this.handleCancel1}
            >
              <Form layout="vertical">
                <FormItem label="地址行1:">
                  {getFieldDecorator('title', {
                    rules: [{ required: true, message: '请选择实名认证等级' }],
                  })(<Input placeholder="请输入" />)}
                </FormItem>
                <FormItem label="地址行2:">
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: '请选择实名认证等级' }],
                  })(<Input placeholder="请输入" />)}
                </FormItem>
                <FormItem label="城市:">
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: '请选择实名认证等级' }],
                  })(<Input placeholder="请输入" />)}
                </FormItem>
                <FormItem label="省份/州:">
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: '请选择实名认证等级' }],
                  })(<Input placeholder="请输入" />)}
                </FormItem>
                <FormItem label="国家:">
                  {getFieldDecorator('title', {
                    rules: [{ required: true, message: '请选择实名认证等级' }],
                  })(
                    <Select>
                      <Option value="jack">Jack</Option>
                      <Option value="lucy">Lucy</Option>
                      <Option value="disabled" disabled>Disabled</Option>
                      <Option value="Yiminghe">yiminghe</Option>
                    </Select>
                  )}
                </FormItem>
                <FormItem label="邮编:">
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: '请选择日期' }],
                  })(
                    <Input placeholder="请输入" />
                  )}
                </FormItem>
                <FormItem label="地址证明文件:">
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: '请选择日期' }],
                  })(
                    <Upload
                    name="avatar"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    action="//jsonplaceholder.typicode.com/posts/"
                    beforeUpload={beforeUpload}
                    onChange={this.handleChange}
                  >
                    {imageUrl ? <img src={imageUrl} alt="avatar" /> : uploadButton}
                  </Upload>
                  )}
                </FormItem>
              </Form>
            </Modal>
            <Card
              className={styles.listCard}
              bordered={false}
              title="用户实名认证信息"
              style={{ marginTop: 24 }}
              extra={extraContent(this)}
            >
            </Card>
            <Card title="当前实名认证等级：等级0" style={{ marginBottom: 24, marginTop: -24 }} bordered={false}>
              <DescriptionList style={{ marginBottom: 24 }} title="个人信息">
                <Description term="邮箱">--</Description>
                <Description term="名">--</Description>
                <Description term="中间名">sss</Description>
                <Description term="姓">上市撒</Description>
                <Description term="生日">1993-22-22</Description>
                <Description term="性别">nan1</Description>
                <Description term="国籍">中国</Description>
                <Description term="收入来源">--</Description>
              </DescriptionList>
              <DescriptionList style={{ marginBottom: 24 }} title="证件信息">
                <Description term="证件类型">--</Description>
                <Description term="证件号码">--</Description>
                <Description term="证件失效期">sss</Description>
                <Row>
                  <Col span={8}>
                    <div>
                      <h4 style={{ marginBottom: 40 }}>证件信息页照片</h4>
                      <div style={{ width: 120, height: 120, textAlign: 'center', marginTop: -24, paddingTop: 90, background: '#fafafa', border: '1px dotted #d9d9d9' }}>
                        <span>暂无图片</span>
                      </div>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div>
                      <h4 style={{ marginBottom: 40 }}>本人手持证件照片</h4>
                      <div style={{ width: 120, height: 120, textAlign: 'center', marginTop: -24, paddingTop: 90, background: '#fafafa', border: '1px dotted #d9d9d9' }}>
                        <span>暂无图片</span>
                      </div>
                    </div>
                  </Col>
                </Row>
              </DescriptionList>
              <DescriptionList style={{ marginBottom: 24 }} title="地址信息">
                <Description term="地址行1">--</Description>
                <Description term="地址行2">--</Description>
                <Description term="城市">--</Description>
                <Description term="省份/州">--</Description>
                <Description term="国家">--</Description>
                <Description term="邮编">--</Description>
                <Row>
                  <Col span={8}>
                    <div>
                      <h4 style={{ marginBottom: 40 }}>地址证明文件</h4>
                      <div style={{ width: 120, height: 120, textAlign: 'center', marginTop: -24, paddingTop: 90, background: '#fafafa', border: '1px dotted #d9d9d9' }}>
                        <span>暂无图片</span>
                      </div>
                    </div>
                  </Col>
                </Row>
              </DescriptionList>
              <div className={styles.title}>退货商品</div>
              <Table
                style={{ marginBottom: 24 }}
                pagination={false}
                // loading={loading}
                // dataSource={goodsData}
                columns={goodsColumns}
                rowKey="id"
              />
            </Card>
          </div>
        }
        {statusVisible && <ChangeStatusModal
          visible={statusVisible}
          handleCancel={() => { this.handleCancel('statusVisible'); }}
        />}
        {withdrawVisible && <ChangeWithdrawModal
          visible={withdrawVisible}
          handleCancel={() => { this.handleCancel('withdrawVisible'); }}
        />}
        {accountOperationVisable && <AccountOperationModal
          visible={accountOperationVisable}
          handleCancel={() => { this.handleCancel('accountOperationVisable'); }}
        />}
        {withdrawOperationVisable && <WithdrawOperationModal
          visible={withdrawOperationVisable}
          handleCancel={() => { this.handleCancel('withdrawOperationVisable'); }}
        />}
      </PageHeaderLayout>
    );
  }
}
