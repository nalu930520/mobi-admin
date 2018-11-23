import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message } from 'antd';
import StandardTable from '../../../components/StandardTable';
import CurrencySelect from '../../../components/CurrencySelect';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import MobileCodeSelect from '../../../components/MobileCodeSelect';
import Filter from '../../../filter';
import styles from './index.less';
import { numberFormat } from '../../../utils/utils';
import { queryWidthdrawDetail, refreshStatus } from '../../../services/cashCharge';
import DescriptionList from '../../../components/DescriptionList';
import UploadImg from '../../../components/UploadImg';

const { Description } = DescriptionList;
const FormItem = Form.Item;
const { Option } = Select;
const RangePicker = DatePicker.RangePicker;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
@connect(state => ({
  cashManage: state.cashManage,
}))
@Form.create()
export default class widthdrawList extends PureComponent {
  state = {
    expandForm: false,
    selectedRows: [],
    formValues: {},
    showDetailModal: false,
    detailData: {},
    fileList: [],
    showSecondConfirmModal: false,
    submitLoading: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'cashManage/fetchWidthdraw',
      payload: {
        page: 1,
        per_page: 10,
      },
    });
  }

  getStatusOption = (status) => {
    if (status === 1) return '审核';
    if (status === 4) return '刷新';
    return '查看';
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      page: pagination.current,
      per_page: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'cashManage/fetchWidthdraw',
      payload: params,
    });
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'cashManage/fetchWidthdraw',
      payload: {
        page: 1,
        per_page: 10,
      },
    });
  }

  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  }

  handleMenuClick = (e) => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;

    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'rule/remove',
          payload: {
            no: selectedRows.map(row => row.no).join(','),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  }

  handleSelectRows = (rows) => {
    this.setState({
      selectedRows: rows,
    });
  }

  handleSearch = (e) => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      for (const key in fieldsValue) {
        if (!fieldsValue[key]) {
          delete fieldsValue[key];
        }
      }
      this.setState({
        formValues: fieldsValue,
      });
      dispatch({
        type: 'cashManage/fetchWidthdraw',
        payload: {
          ...fieldsValue,
          page: 1,
          per_page: 10,
        },
      });
    });
  }

  showWidthdrawDetail = (data) => {
    if (data.status === 4) {
      // 请求 api 刷新点击记录
      refreshStatus({ id: data.id })
        .then((resData) => {
          console.log(resData);
          this.props.dispatch({
            type: 'cashManage/fetchWidthdraw',
            payload: {
              page: 1,
              per_page: 10,
            },
          });
        });
      return;
    }
    queryWidthdrawDetail({ id: data.id })
      .then((resData) => {
        this.setState({
          showDetailModal: true,
          detailData: resData,
        });
      });
  }

  requestUpload = (files) => {
    // 修改默认上传方式 submit 得到 files
    console.log(files);
    return true;
  }

  handleChange = (fileList) => {
    const filterOneImg = [];
    // 那到最新的一张图 做替换前一张 一次只能上传一章
    filterOneImg.push(fileList[fileList.length - 1]);
    const filesArray = filterOneImg.map((data) => {
      return {
        ...data,
        status: 'done',
      };
    });
    this.setState({ fileList: filesArray });
  }

  showConfirmModal = () => {
    if (!this.state.fileList.length) {
      message.error('请上传转账回执');
      return;
    }
    this.setState({
      showSecondConfirmModal: true,
    });
  }
  handleSecondModalOk = () => {
    this.setState({
      submitLoading: true,
    });
    this.props.dispatch({
      type: 'cashManage/verifyWidthdraw',
      payload: {
        id: this.state.detailData.id,
        evidence: this.state.fileList[0].originFileObj,
      },
    }).then((data) => {
      if (data) {
        message.success('提交成功');
      }
      this.handleSecondModalCancel();
    });
  }
  handleSecondModalCancel = () => {
    this.setState({
      submitLoading: false,
      showSecondConfirmModal: false,
      showDetailModal: false,
      fileList: [],
    });
  }
  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
            <FormItem label="请求ID">
              {getFieldDecorator('id')(
                <Input style={{ width: '250px' }} placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="手机号码">
              {getFieldDecorator('mobile_code')(
                <MobileCodeSelect />
              )}
              {getFieldDecorator('mobile')(
                <Input style={{ width: '250px', marginLeft: '10px' }} placeholder="请输入" />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
            <FormItem label="货币" style={{ width: '300px' }}>
              {getFieldDecorator('currency_code')(
                <CurrencySelect currencyType="F" />
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="状态">
              {
                getFieldDecorator('status')(
                  <Select style={{ width: '250px' }} >
                    <Option value="0">待付款</Option>
                    <Option value="1">待审核</Option>
                    <Option value="2">已完成</Option>
                    <Option value="3">已取消</Option>
                    <Option value="4">未知</Option>
                  </Select>
                )
              }
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginBottom: '24px', textAlign: 'left' }}>
          <Col md={12} sm={24} >
            <Link to="/cashCharge/addWidthdraw">
              <Button type="primary" icon="plus"htmlType="submit">新增提现</Button>
            </Link>
          </Col>
          <Col md={12} sm={24}>
            <span className={styles.submitButtons} style={{ marginBottom: '24px' }}>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }
  render() {
    const columns = [
      {
        title: '请求ID',
        dataIndex: 'id',
      },
      {
        title: '手机号',
        render: record => (
          <span>
            {record.mobile_code} {record.mobile}
          </span>
        ),
      },
      {
        title: '币种',
        dataIndex: 'currency_code',
      },
      {
        title: '请求金额',
        render: record => (
          <span>
            {numberFormat(record.request_amount, 8, false)} {record.currency_code}
          </span>
        ),
      },
      {
        title: '状态',
        render: record => (
          <span>
            <Filter value={record.status} keyname="cashStatus" />
          </span>
        ),
      },
      {
        title: '时间',
        render: record => (
          <span>
            {moment(record.created_at * 1000).format('YYYY-MM-DD HH:mm:ss')}
          </span>
        ),
      },
      {
        title: '操作',
        render: record => (
          <span>
            <a onClick={() => { this.showWidthdrawDetail(record); }}>
              {this.getStatusOption(record.status)}
            </a>
          </span>
        ),
      },
    ];
    const { cashManage: { loading: orderLoading, data } } = this.props;
    const { selectedRows, detailData } = this.state;
    return (
      <PageHeaderLayout title="提现请求列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderSimpleForm()}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={orderLoading}
              columns={columns}
              data={data}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
          {this.state.showDetailModal &&
          <Modal
            visible={this.state.showDetailModal}
            title="提现请求"
            width="800px"
            onOk={this.handleOk}
            style={{ widht: '1000px' }}
            onCancel={() => {
              this.setState({
                showDetailModal: false,
              });
            }}
            footer={detailData.status === 1 ? [
              <Button key="submit" type="primary" onClick={this.showConfirmModal}>审核通过</Button>,
            ] : false}
          >
            <Row>
              <Col span={8}>
                <DescriptionList size="small" col="1">
                  <Description term="请求ID">{detailData.id}</Description>
                  <Description term="用户ID">{detailData.customer_id}</Description>
                  <Description term="手机号">{detailData.mobile_code} {detailData.mobile}</Description>
                  <Description term="创建时间">{moment(detailData.created_at * 1000).format('YYYY-MM-DD HH:mm:ss')}</Description>
                  <Description term="更新时间">{moment(detailData.updated_at * 1000).format('YYYY-MM-DD HH:mm:ss')}</Description>
                </DescriptionList>
              </Col>
              <Col span={8}>
                <DescriptionList size="small" col="1">
                  <Description term="提现币种">{detailData.currency_code}</Description>
                  <Description term="手续费">{numberFormat(detailData.fee, 8, false)} {detailData.currency_code}</Description>
                  <Description term="银行名">{detailData.bank_name}</Description>
                  <Description term="银行地址">{detailData.bank_address}</Description>
                  <Description term="账户名">{detailData.account_name}</Description>
                  <Description term="账户号码">{detailData.bank_account}</Description>
                  <Description term="SWIFT Code">{detailData.swift_code}</Description>
                </DescriptionList>
              </Col>
              <Col span={8}>
                <div className={styles.rightWraper}>
                  <div className={styles.title}>状态</div>
                  <div className={styles.amount}><Filter value={detailData.status} keyname="cashStatus" /></div>
                  <div className={styles.title}>请求金额</div>
                  <div className={styles.amount}>{numberFormat(detailData.request_amount, 8, false)} {detailData.currency_code}</div>
                  <div className={styles.title}>出账金额</div>
                  <div className={styles.amount} style={{ color: 'red' }}>{numberFormat(detailData.reality_amount, 8, false)} {detailData.currency_code}</div>
                </div>
              </Col>
            </Row>
            <DescriptionList size="small" layout="vertical" col="1">
              <Description term="转账回执" >
                {detailData.status === 1 ?
                  <UploadImg
                    fileList={this.state.fileList}
                    handleChange={this.handleChange}
                    requestUpload={(files) => {
                      this.requestUpload(files);
                    }}
                  />
                   : ''}
                {detailData.evidences ? <img style={{ width: '500px' }} alt="evidence" src={detailData.evidences[0]} /> : ''}
              </Description>
            </DescriptionList>
          </Modal>
          }
          <Modal
            title="Modal"
            width="800px"
            zIndex="1001"
            visible={this.state.showSecondConfirmModal}
            onOk={this.handleSecondModalOk}
            onCancel={this.handleSecondModalCancel}
            footer={[
              <Button key="back" onClick={this.handleSecondModalCancel}>取消</Button>,
              <Button key="submit" type="primary" loading={this.state.submitLoading} onClick={this.handleSecondModalOk}>
                确认提交
              </Button>,
            ]}
          >
            <Row>
              <Col span={8}>
                <DescriptionList size="small" col="1">
                  <Description term="手机号">{detailData.mobile_code} {detailData.mobile}</Description>
                  <Description term="出账金额">{numberFormat(detailData.reality_amount, 8, false)} {detailData.currency_code}</Description>
                </DescriptionList>
              </Col>
              <Col span={8}>
                <DescriptionList size="small" col="1">
                  <Description term="银行名">{detailData.bank_name}</Description>
                  <Description term="银行地址">{detailData.bank_address}</Description>
                  <Description term="SWIFT Code">{detailData.swift_code}</Description>
                  <Description term="账户名">{detailData.account_name}</Description>
                  <Description term="账户号码">{detailData.bank_account}</Description>
                </DescriptionList>
              </Col>
            </Row>
          </Modal>
        </Card>
      </PageHeaderLayout>
    );
  }
}
