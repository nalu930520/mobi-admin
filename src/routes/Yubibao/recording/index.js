import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Select, Button } from 'antd';
import StandardTable from '../../../components/StandardTable';
import CurrencySelect from '../../../components/CurrencySelect';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import MobileCodeSelect from '../../../components/MobileCodeSelect';
import styles from './index.less';
import { IntoString } from '../../../utils/utils';
const FormItem = Form.Item;
const { Option } = Select;
@connect(state => ({
  yubiBao: state.yubiBao,
}))
@Form.create()
export default class depositList extends PureComponent {
  state = {
    selectedRows: [],
    showDetailModal: false,
    detailData: {}
  };
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'yubiBao/fetchAddTrans',
      payload: {
        page: 1,
        per_page: 10,
        currency_code: 'btc'
      },
    });
  }
  handleStandardTableChange = (pagination) => {
    const { dispatch } = this.props;
    let filterFun= (waitData) =>{
      if (Array.isArray(waitData)) {
        if (waitData.length == 1) {
          return Number(waitData[0])
        }else {
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
    };
    dispatch({
      type: 'yubiBao/fetchAddTrans',
      payload: params
    });
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    dispatch({
      type: 'yubiBao/fetchAddTrans',
      payload: {
        page: 1,
        per_page: 10,
        currency_code: 'btc'
      },
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
      console.log(fieldsValue)
      if (Array.isArray(fieldsValue.trans_type)) {
        if (fieldsValue.trans_type.length == 1) {
          fieldsValue.trans_type = Number(fieldsValue.trans_type[0])
        }else {
          fieldsValue.trans_type = 3
        }
      }
      dispatch({
        type: 'yubiBao/fetchAddTrans',
        payload: {
          ...fieldsValue,
          page: 1,
          per_page: 10
        },
      });
    });
  }
  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    const mobilePrefixSelector = getFieldDecorator('code')(
      <MobileCodeSelect />
    );
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
            <FormItem label="手机号码">
              {getFieldDecorator('phone')(
                <Input addonBefore={mobilePrefixSelector} style={{ width: '250px', marginLeft: '10px' }} placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="币种" style={{ width: '300px' }}>
              {getFieldDecorator('currency_code',{
                rules: [{ required: true, message: '请选择币种' }]
              })(
                <CurrencySelect currencyType="C" />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
            <FormItem label="类型" style={{ width: '300px' }}>
              {getFieldDecorator('trans_type')(
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  placeholder="请选择"
                >
                  <Option value="1">转入</Option>
                  <Option value="2">转出</Option>
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
    );
  }
  render() {
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id'
      },
      {
        title: '手机号',
        render: record => (
          <span>
            {record.code} {record.phone}
          </span>
        )
      },
      {
        title: '类型',
        render: record => (
          <span>
            {IntoString(record.trans_type)}
          </span>
        )
      },
      {
        title: '币种',
        dataIndex: 'currency_type'
      },
      {
        title: '请求金额',
        render: record => (
          <span>
            {record.trans_balance} BTC
          </span>
        )
      },
      {
        title: '时间',
        render: record => (
          <span>
            {moment(record.create_time * 1000).format('YYYY-MM-DD HH:mm:ss')}
          </span>
        )
      }
    ];
    // 一级一级  解构
    const { yubiBao: { loading: orderLoading, data } } = this.props;
    console.log(data);
    const { selectedRows } = this.state;
    return (
      <PageHeaderLayout title="转入转出记录">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderSimpleForm()}
            </div>
            <div>总共 {data.pagination.total} 条 当前页码 {data.pagination.current} 当前数量 {data.pagination.pageSize}</div>  
            <StandardTable
              selectedRows={selectedRows}
              loading={orderLoading}
              columns={columns}
              data={data}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
