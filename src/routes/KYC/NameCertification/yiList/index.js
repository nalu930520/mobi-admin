import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { Link } from 'dva/router'
import moment from 'moment'
import { Row, Col, Card, Form, Input, Select, Button, DatePicker, Modal } from 'antd'
import StandardTable from '../../../../components/StandardTable'
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout'
import MobileCodeSelect from '../../../../components/MobileCodeSelect'
import { verification, result } from '../../../../utils/utils';
import styles from './index.less'
import TxCheckbox from '../../../../components/TxTypeCheckbox'
const FormItem = Form.Item
const { TextArea } = Input;
const { Option } = Select
const { RangePicker } = DatePicker
const plainOptions = [
  { label: '证件验证', value: 2 },
  { label: '地址验证', value: 3 },
  // { label: '企业验证', value: '2' }
]
const plainOptions1 = [
  { label: '已通过', value: 1 },
  { label: '未通过', value: -1 }
]
const checkList = [2]
const checkList1 = [1]
@connect(state => ({
  NameCertification: state.NameCertification,
}))
@Form.create()
export default class yiList extends PureComponent {
  state = {
    selectedRows: [],
    showDetailModal: false,
    detailData: {},
    visible: false,
    visible1: false,
    modalTitle: '',
    modalContent: '',
  }
  componentDidMount() {
    const { dispatch } = this.props
    // 审核人
    dispatch({
      type: 'NameCertification/fetchauditorId'
    })
    // 归档列表
    dispatch({
      type: 'NameCertification/fetchYiList',
      payload: {
        page: 1,
        per_page: 10,
        type: 'archive'
      },
    })
   
  }
  handleStandardTableChange = (pagination) => {
    const { dispatch } = this.props
    let filterFun = (waitData) => {
      if (Array.isArray(waitData)) {
        if (waitData.length == 1) {
          return Number(waitData[0])
        } else {
          return 3
        }
      }
    }
    const params = {
      page: pagination.current,
      per_page: pagination.pageSize,
      currency_code: this.props.form.getFieldValue('currency_code'),
      trans_type: filterFun(this.props.form.getFieldValue('trans_type')),
      code: this.props.form.getFieldValue('code')
    }
    dispatch({
      type: 'NameCertification/fetchYiList',
      payload: params
    })
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props
    form.resetFields()
    dispatch({
      type: 'NameCertification/fetchYiList',
      payload: {
        page: 1,
        per_page: 10,
      },
    })
  }
  handleSearch = (e) => {
    e.preventDefault()
    const { dispatch, form } = this.props
    form.validateFields((err, fieldsValue) => {
      if (err) return
      for (const key in fieldsValue) {
        if (!fieldsValue[key]) {
          delete fieldsValue[key]
        }
      }
      if (fieldsValue.createTime.length > 0 || fieldsValue.mobile.length > 0) {
        fieldsValue.start_time = fieldsValue.createTime[0].unix()
        fieldsValue.end_time = fieldsValue.createTime[1].unix()
        fieldsValue.mobile = `${fieldsValue.code}-${fieldsValue.mobile}`
        delete fieldsValue.createTime
        delete fieldsValue.code
      }
      console.log(fieldsValue)
      dispatch({
        type: 'NameCertification/fetchYiList',
        payload: {
          ...fieldsValue,
          page: 1,
          per_page: 10,
          type: 'archive'
        },
      })
    })
  }
  handleSubmitModal = (e) => {
    e.preventDefault()
    console.log("添加备注")
    dispatch({
      type: 'NameCertification/fetchYiList',
      payload: {
        ...fieldsValue,
        memo: '1111111',
      },
    })
  }
  showModal = (type, title, cont) => {
    if (title || cont) {
      this.setState({
        [type]: true,
        modalTitle: title,
        modalContent: cont
      })
    } else {
      this.setState({
        [type]: true
      })
    }

  }

  handleOk = (type) => {
    this.setState({
      [type]: false,
    })
  }

  handleCancel = (type) => {
    this.setState({
      [type]: false,
    })
  }

  modal = () => {
    const { getFieldDecorator } = this.props.form
    return (
      <Modal
        title="添加备注"
        visible={this.state.visible1}
        onOk={() => { this.handleOk('visible1') }}
        onCancel={() => { this.handleCancel('visible1') }}
      >
        <Form onSubmit={this.handleSubmitModal}>
          <FormItem
            label="备注"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 12 }}
          >
            {getFieldDecorator('note')(
              <TextArea rows={4} placeholder="请在此添加备注" />
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
  renderSimpleForm(list) {
    const { getFieldDecorator } = this.props.form
    const { NameCertification: { auditorIdList } } = this.props
    const mobilePrefixSelector = getFieldDecorator('code')(
      <MobileCodeSelect />
    )
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
            <FormItem label="验证类型">
              {getFieldDecorator('status', {
                initialValue: checkList,
              })(
                <TxCheckbox plainOptions={plainOptions} />
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            {getFieldDecorator('level', {
              initialValue: checkList1,
            })(
              <TxCheckbox plainOptions={plainOptions1} />
            )}
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
            <FormItem label="创建时间">
              {getFieldDecorator('createTime', {
                initialValue: [],
              })(
                <RangePicker />
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="手机号码" style={{ width: '300px' }}>
              {getFieldDecorator('mobile')(
                <Input addonBefore={mobilePrefixSelector} style={{ width: '250px', marginLeft: '10px' }} placeholder="请输入" />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
            <FormItem label="审核人" style={{ width: '300px' }}>
              {getFieldDecorator('auditor_id')(             
                <Select
                  style={{ width: '100%' }}
                  placeholder="请选择"
                >
                {auditorIdList && auditorIdList.map((data) => 
                  <Option key={data.id} value={data.id}>{data.name}</Option>
                )}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <span className={styles.submitButtons} style={{ marginBottom: '24px' }}>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            </span>
          </Col>
        </Row>
      </Form>
    )
  }
  render() {
    const columns = [
      {
        title: '创建时间',
        render: record => (
          <span>
            {moment(record.created_at * 1000).format('YYYY-MM-DD HH:mm:ss')}
          </span>
        )
      },
      {
        title: '审核号',
        dataIndex: 'application_no'
      },
      {
        title: '验证类型',
        render: record => (
          <span>
            {verification(record.level)}
          </span>
        )
      },
      {
        title: '手机号',
        dataIndex: 'mobile'
      },
      {
        title: '审核结果',
        render: record => (
          <span>
            {result(record.status)}
          </span>
        )
      },
      {
        title: '审核人',
        dataIndex: 'auditor'
      },
      {
        title: '操作',
        render: record => (
          <span>
            {/* 证件验证 */}
            {record.level === 2 &&
              (<Link to={`DocumentVerification/${record.application_no}?type=${record.level}`}>查看</Link>)}
            {/* 地址验证 */}
            {record.level === 3 &&
              (<Link to={`addressVerification/${record.application_no}?type=${record.level}`}>
                查看
            </Link>)} &nbsp;
            {record.memo &&
              (<a href="javascript:;" onClick={() => this.showModal('visible', record.auditor, record.memo)}>查看备注</a>)
            }&nbsp;
            {!record.memo &&
              (<a href="javascript:;" onClick={() => this.showModal('visible1')}>添加备注</a>)
            }
          </span>
        )
      }
    ]
    const { NameCertification: { loading, data } } = this.props
    const { selectedRows } = this.state
    return (
      <PageHeaderLayout title="转入转出记录">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderSimpleForm()}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              columns={columns}
              data={data}
              onChange={this.handleStandardTableChange}
            />
            <Modal
              title="查看备注"
              visible={this.state.visible}
              onOk={() => { this.handleOk('visible') }}
              onCancel={() => { this.handleCancel('visible') }}
            >
              <p>备注人: {this.state.modalTitle}</p>
              <p>备注: {this.state.modalContent}</p>
            </Modal>
            {/* 添加备注 */}
            {this.modal()} 
          </div>
        </Card>
      </PageHeaderLayout>
    )
  }
}
