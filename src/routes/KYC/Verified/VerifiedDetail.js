import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Button, Row, Col, Card, Form, Modal, Select, Input, Radio } from 'antd';
import pathToRegexp from 'path-to-regexp';
import Filter from '../../../filter';
import mobileImg from '../../../assets/mobile.jpg';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import DescriptionList from '../../../components/DescriptionList';
import C2cPersonalForm from '../../C2C/Customer/PersonalForm';
import UserInfo from '../../C2C/Customer/UserInfo';
import { numberFormat, getcurrencyBycode, codeTocurrencyCode } from '../../../utils/utils.js';
import styles from './VerifiedDetail.less';

const { Description } = DescriptionList;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const ButtonGroup = Button.Group;
const dateFormat = 'YYYY-MM-DD HH:mm:ss';

const description = (userInfo) => {
  return (
    <DescriptionList className={styles.headerList} size="small" col="3">
      <Description term="创建时间：">{moment.unix(userInfo.created_at).format(dateFormat)}</Description>
      <Description term="手机号码">{userInfo.mobi_id}</Description>
      <Description term="手机号码所属国家">{userInfo.country_name}</Description>
      <Description term="证件类型">{userInfo.last_login_ip}</Description>
    </DescriptionList>
  );
};

@connect(state => ({
  userdetail: state.userdetail,
  customer: state.customer,
}))
@Form.create()
export default class AdvancedProfile extends Component {
  state = {
    exchangeKey: '7',
    frontVisible: false,
    backVisible: false,
    type: 'credential',
  }
  componentDidMount() {
    const { location } = this.props;
    const { pathname } = location;
    // const pathList = pathname.split('/');
    const match = pathToRegexp('/kyc/detail/:type').exec(pathname);
    if (match && match[1]) {
      console.log('pathList:', match[1])
      if (match[1] === 'address') {
        this.setState({ type: 'address' });
      }
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

  render() {
    const { userInfo, assetsInfo } = this.props.userdetail;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };
    return (
      <PageHeaderLayout
        title={`审核号: ${userInfo.mobile}`}
        logo={<img alt="" src={mobileImg} />}
        content={description(userInfo)}
      >
        <div>
          {this.state.type === 'credential' &&
            <Card title="用户提交信息" bordered={false}>
              <h2>证件信息</h2>
              <DescriptionList style={{ marginBottom: 24 }} col="3">
                <Description term="名">
                  小仙女
                </Description>
                <Description term="中间名">
                  小猴子
                </Description>
                <Description term="姓">
                  刘
                </Description>
                <Description term="生日">
                  {
                    !!assetsInfo.customer_fiat_info && assetsInfo.customer_fiat_info.map(obj =>
                      <span key={obj.currency}>{obj.currency.toUpperCase()}&nbsp;</span>
                    )
                  }
                </Description>
                <Description term="性别">
                  女
                </Description>
                <Description term="国籍">
                  中国
                </Description>
                <Description term="证件类型">
                  护照
                </Description>
              </DescriptionList>
              <Row>
                <Col span={12}>
                  <Card
                    hoverable
                    title="证件信息页照片"
                    extra={<a onClick={() => { this.showModal('frontVisible'); }}>查看大图</a>}
                    style={{ width: 300 }}
                    cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
                  />
                  <Modal
                    visible={this.state.frontVisible}
                    onCancel={() => { this.handleCancel('frontVisible'); }}
                    footer={null}
                  >
                    <img width="100%" alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />
                  </Modal>
                </Col>
              </Row>
            </Card>
          }
          {
            this.state.type === 'address' &&
            <div>
              <Card title="已验证个人信息" bordered={false}>
                <DescriptionList style={{ marginBottom: 24 }} col="3">
                  <Description term="名">
                    小仙女
                  </Description>
                  <Description term="中间名">
                    小猴子
                  </Description>
                  <Description term="姓">
                    刘
                  </Description>
                </DescriptionList>
              </Card>
              <Card title="用户提交信息" bordered={false}>
                <h2>地址信息</h2>
                <DescriptionList style={{ marginBottom: 24 }} col="3">
                  <Description term="地址行1：">
                    徐汇区中山南二路1089号徐汇苑大厦27层
                  </Description>
                  <Description term="地址行2：">
                    -
                  </Description>
                  <Description term="城市">
                    上海
                  </Description>
                  <Description term="省份/洲">
                    上海
                  </Description>
                  <Description term="国家">
                    中国
                  </Description>
                  <Description term="邮编">
                    210000
                  </Description>
                </DescriptionList>
                <Row>
                  <Col span={12}>
                    <Card
                      hoverable
                      title="地址证明文件"
                      extra={<a onClick={() => { this.showModal('frontVisible'); }}>查看大图</a>}
                      style={{ width: 300 }}
                      cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
                    />
                    <Modal
                      visible={this.state.frontVisible}
                      onCancel={() => { this.handleCancel('frontVisible'); }}
                      footer={null}
                    >
                      <img width="100%" alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />
                    </Modal>
                  </Col>
                </Row>
              </Card>
            </div>
          }
          <Card
            title="审核结果"
            bordered={false}
            style={{ marginTop: '30px' }}
          >
            <Form onSubmit={this.handleSubmit}>
              <Row>
                <Col span={12}>
                  <FormItem
                    label="结果"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('result')(
                      <RadioGroup onChange={this.onChange} value={this.state.value}>
                        <Radio value={1}>审核通过</Radio>
                        <Radio value={2}>审核拒绝</Radio>
                      </RadioGroup>
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    label="备注"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('note')(
                      <Input />
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    label="原因"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('reason', {
                      rules: [{ required: true, message: 'Please select your gender!' }],
                    })(
                      <Select
                        placeholder="Select a option and change input text above"
                        onChange={this.handleSelectChange}
                      >
                        <Option value="male">male</Option>
                        <Option value="female">female</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    label="描述"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('description')(
                      <Input />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <FormItem
                style={{ textAlign: 'right' }}
              >
                <Button type="primary" htmlType="submit">
                  提交
                </Button>
              </FormItem>
            </Form>
          </Card>
        </div>
      </PageHeaderLayout>
    );
  }
}
